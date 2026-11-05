// qe-ABC-301-s0: ADR-0067 d5's tracer row AS WRITTEN (traced count x value = the part passerTermsForTest returns inside
// withParametersForTest), run outside tools/ so it may name the seam, on the 44 fixtures and on a wide corpus, at three
// value sets; plus the identity gate at those values (B-T1 cannot see E4a at 0). usage: node tracerdirect.ts <tree> [scale]
import { readFileSync } from "node:fs";
const [root, scaleArg = "1"] = process.argv.slice(2); const SCALE = Number(scaleArg);
const ev = await import(`${root}/src/evaluate.ts`), P = await import(`${root}/src/evaluate-params.ts`);
const { parseFen, toFen } = await import(`${root}/src/fen.ts`);
const { buildCorpus, mirrorPosition } = await import(`${root}/src/evaluate.mirror-corpus.ts`);
const tc = await import(`${root}/src/evaluate.taper-corpus.ts`);
const { MATE_CORPUS } = await import(`${root}/src/search.mate-corpus.ts`);
const { legalMoves, isInCheck } = await import(`${root}/src/legal.ts`);
const { makeMove } = await import(`${root}/src/apply.ts`);
const T = await import(`${root}/tools/tune/tracer.ts`);
const FX = JSON.parse(readFileSync(`${root}/src/evaluate.passer-fixtures.json`, "utf8"));
const pad = (a: number[]) => [...a, 0];
const sets: Record<string, any> = {
  probed: { KE: pad(FX.values.PASSED_KING_ENEMY), KO: pad(FX.values.PASSED_KING_OWN), F: pad(FX.values.PASSED_FREE), U: FX.values.PASSED_UNSTOPPABLE },
  primes: { KE: [0, 3, 5, 7, 11, 13, 17, 0], KO: [0, 2, 3, 5, 7, 11, 19, 0], F: [0, 23, 29, 31, 37, 41, 43, 0], U: 97 },
  fitShape: { KE: [0, 4, 6, 9, 14, 22, 31, 0], KO: [0, 1, 2, 6, 8, 15, 27, 0], F: [0, 2, 12, 18, 40, 55, 90, 0], U: 0 } };
const table = (V: any) => ({ ...P, PASSED_KING_ENEMY: { mg: P.PASSED_KING_ENEMY.mg, eg: V.KE }, PASSED_KING_OWN: { mg: P.PASSED_KING_OWN.mg, eg: V.KO }, PASSED_FREE: { mg: P.PASSED_FREE.mg, eg: V.F }, PASSED_UNSTOPPABLE: { mg: 0, eg: V.U } });
const fens = new Set<string>();
for (const c of buildCorpus()) fens.add(toFen(c.position));
const walkObj = (v: any) => { if (typeof v === "string" && /^[1-8pnbrqkPNBRQK/]+ [wb] /.test(v)) fens.add(v); else if (v && typeof v === "object") for (const x of Object.values(v)) walkObj(x); };
walkObj(tc); for (const f of MATE_CORPUS) fens.add(typeof f === "string" ? f : (f as any).fen);
for (const r of [...FX.k1c, ...FX.k1a]) fens.add(r.fen);
let seed = 301301; const rnd = (n: number) => { seed = (Math.imul(seed, 1103515245) + 12345) >>> 0; return (seed >>> 8) % n; };
for (let g = 0; g < Math.round(300 * SCALE); g++) { const p = parseFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
  for (let ply = 0; ply < 160; ply++) { const ms = legalMoves(p); if (ms.length === 0) break; makeMove(p, ms[rnd(ms.length)]); fens.add(toFen(p)); } }
let placed = 0;
while (placed < Math.round(20000 * SCALE)) {
  const sq = Array(64).fill("");
  const put = (ch: string, lo: number, hi: number) => { for (let t = 0; t < 50; t++) { const i = lo * 8 + rnd((hi - lo + 1) * 8); if (!sq[i]) { sq[i] = ch; return i; } } return -1; };
  const wk = put("K", 0, 7), bk = put("k", 0, 7); if (Math.max(Math.abs((wk >> 3) - (bk >> 3)), Math.abs((wk & 7) - (bk & 7))) < 2) continue;
  for (let i = 1 + rnd(4); i > 0; i--) put("P", 1, 6); for (let i = 1 + rnd(4); i > 0; i--) put("p", 1, 6);
  for (let i = rnd(3); i > 0; i--) put("NBRQnbrq"[rnd(8)] as string, 0, 7);
  const rows: string[] = []; for (let r = 7; r >= 0; r--) { let s = "", e = 0; for (let f = 0; f < 8; f++) { const x = sq[r * 8 + f]; if (!x) e++; else { if (e) s += e; e = 0; s += x; } } if (e) s += e; rows.push(s); }
  const fen = `${rows.join("/")} ${rnd(2) ? "b" : "w"} - - 0 1`;
  let p: any; try { p = parseFen(fen); } catch { continue; }
  if (isInCheck({ ...p, board: p.board.slice(), blackToMove: !p.blackToMove })) continue;
  fens.add(toFen(p)); placed++;
}
const positions: any[] = []; for (const f of fens) { let p: any; try { p = parseFen(f); } catch { continue; } positions.push(p, mirrorPosition(p)); }
const dot = (a: number[], b: number[]) => a.reduce((s, x, i) => s + x * (b[i] as number), 0);
const out: any = { positions: positions.length, sets: {} };
for (const [name, V] of Object.entries(sets)) {
  const tbl = T.tableOf(table(V)); const r = { seamRows: 0, seamMiss: 0, fixtureRows: 0, fixtureMiss: 0, gateMiss: 0, evalAtMiss: 0, worst: 0, nonZeroE: 0, uFired: 0, first: [] as string[] };
  const fixtureFens = new Set(FX.k1c.map((x: any) => x.fen));
  ev.withParametersForTest(table(V), () => { for (const p of positions) {
    const c = T.passerCounts(p), s = ev.passerTermsForTest(p); const fx = fixtureFens.has(toFen(p));
    for (const side of ["white", "black"] as const) {
      const kd = dot(c[side].enemy, V.KE) - dot(c[side].own, V.KO), free = dot(c[side].free, V.F), un = c[side].unstoppable * V.U;
      const ok = kd === s[side].kd && free === s[side].free && un === s[side].un; r.seamRows++; if (fx) r.fixtureRows++;
      if (!ok) { r.seamMiss++; if (fx) r.fixtureMiss++; if (r.first.length < 3) r.first.push(`${side} ${toFen(p)}`); }
      if (s[side].un) r.uFired++;
    }
    if (s.white.kd + s.white.free - s.black.kd - s.black.free !== 0) r.nonZeroE++;
    const e = ev.evaluate(p), white = p.blackToMove ? 0 - e : e; const t = T.trace(p); const g = T.gateMiss(t, white, tbl);
    if (g.miss) { r.gateMiss++; if (r.first.length < 3) r.first.push(`gate ${toFen(p)} d ${g.d}`); } if (g.d > r.worst) r.worst = g.d;
    if (T.evaluateAt(t, tbl) !== white) r.evalAtMiss++;
  } });
  out.sets[name] = r;
}
console.log(JSON.stringify(out));
