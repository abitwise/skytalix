// qe-ABC-270 K1 (c) + (a) independent re-check, ONE process, against tree T (default H). Written by QE from the
// STATED rule (qe-ABC-270-freeze verify.mjs's counts()), never from the build's kingExposure.
//  Part 1: QE's frozen rows (pairs.json, read from file, sha256 checked by the caller): per king through
//          kingExposureForTest at 0 and at 2 x base; subject A = 3 x B in each half; other king equal; QC8 still;
//          evaluate / evaluateWithoutTaper white-POV seam delta = the frozen seamNetWpov.
//  Part 2: a broad corpus (G3's 184, every taper-corpus FEN, the mate corpus, 6 endgames, 600 seeded random games,
//          each mirrored): with queen-on pairs at DISTINCT mg != eg values, per king and per half, the seam's
//          change equals the rule's feature counts x the values (kingExposureForTest), AND the hot path's change
//          (evaluateWithoutTaper = mg; evaluateAtPhase(p, 0) = eg) equals black's minus white's predicted change.
//          This checks the walk's flags, not only the test seam's own scan. Plus mirror Object.is at those values.
// usage: node k1.ts <S> <pairs.json> [tree=H]
import { readFileSync } from "node:fs";
const [S, pairsPath, treeArg = "H"] = process.argv.slice(2);
const T = `${S}/${treeArg}/src`;
const ev = await import(`${T}/evaluate.ts`);
const P = await import(`${T}/evaluate-params.ts`);
const { parseFen, toFen } = await import(`${T}/fen.ts`);
const { buildCorpus, mirrorPosition } = await import(`${T}/evaluate.mirror-corpus.ts`);
const tc = await import(`${T}/evaluate.taper-corpus.ts`);
const { MATE_CORPUS } = await import(`${T}/search.mate-corpus.ts`);
const { legalMoves } = await import(`${T}/legal.ts`);
const { makeMove } = await import(`${T}/apply.ts`);
const data = JSON.parse(readFileSync(pairsPath, "utf8"));
const PAWN = 1, QUEEN = 5, KING = 6, BLK = 8;
let fail = 0; const bad: string[] = [];
const no = (m: string) => { fail++; if (bad.length < 25) bad.push(m); };
function counts(board: Uint8Array, black: boolean) {
  let king = -1, enemyQueen = 0;
  for (let s = 0; s < 128; s++) { if (s & 0x88) continue; const p = board[s]; if (!p) continue;
    if ((p & 7) === KING && ((p & BLK) !== 0) === black) king = s;
    if ((p & 7) === QUEEN && ((p & BLK) !== 0) !== black) enemyQueen = 1; }
  const own = PAWN | (black ? BLK : 0), enemy = PAWN | (black ? 0 : BLK), step = black ? -1 : 1;
  const kf = king & 7, kr = king >> 4;
  let s_ = 0, h_ = 0, o_ = 0;
  for (let f = Math.max(0, kf - 1); f <= Math.min(7, kf + 1); f++) {
    let sheltered = false;
    for (const d of [1, 2]) { const r = kr + d * step; if (r >= 0 && r <= 7 && board[r * 16 + f] === own) sheltered = true; }
    if (!sheltered) s_++;
    let o = false, e = false;
    for (let r = 0; r < 8; r++) { if (board[r * 16 + f] === own) o = true; if (board[r * 16 + f] === enemy) e = true; }
    if (!o) { if (e) h_++; else o_++; }
  }
  return { s: s_, h: h_, o: o_, q: enemyQueen };
}
const wpov = (p: any, v: number) => (p.blackToMove ? 0 - v : v);
const at = (q: [number, number, number, number, number, number]) => ({ ...P,
  KING_SHELTER_MISSING_QUEEN: { mg: q[0], eg: q[1] }, KING_FILE_HALF_OPEN_QUEEN: { mg: q[2], eg: q[3] }, KING_FILE_OPEN_QUEEN: { mg: q[4], eg: q[5] } });
const ZERO = at([0, 0, 0, 0, 0, 0]);
const base = { s: P.KING_SHELTER_MISSING, h: P.KING_FILE_HALF_OPEN, o: P.KING_FILE_OPEN };
const TWO = at([2 * base.s.mg, 2 * base.s.eg, 2 * base.h.mg, 2 * base.h.eg, 2 * base.o.mg, 2 * base.o.eg]);
const out: any = { tree: treeArg, part1: [], part2: {} };
// ---- Part 1: frozen rows
let p1rows = 0;
for (const row of data.rows) {
  const r: any = { id: row.id };
  const read = (fen: string, params: any) => ev.withParametersForTest(params, () => ev.kingExposureForTest(parseFen(fen)));
  const net = (fen: string, fn: string) => {
    const p = parseFen(fen);
    return wpov(p, ev.withParametersForTest(TWO, () => ev[fn](p))) - wpov(p, ev.withParametersForTest(ZERO, () => ev[fn](p)));
  };
  for (const side of ["A", "B"]) {
    const z = read(row[side], ZERO), t = read(row[side], TWO);
    r[side] = { zero: z, two: t, net: net(row[side], "evaluate"), netWt: net(row[side], "evaluateWithoutTaper") };
    for (const c of ["white", "black"]) {
      const x = row.expect[side][c];
      if (z[c].mg !== x.baseCp || z[c].eg !== x.baseCp) no(`${row.id}${side} ${c} at 0: ${JSON.stringify(z[c])} != ${x.baseCp}`);
      if (t[c].mg !== x.seam2xCp || t[c].eg !== x.seam2xCp) no(`${row.id}${side} ${c} at 2x: ${JSON.stringify(t[c])} != ${x.seam2xCp}`);
    }
    if (r[side].net !== row.expect[side].seamNetWpov) no(`${row.id}${side} evaluate net ${r[side].net} != ${row.expect[side].seamNetWpov}`);
    if (r[side].netWt !== row.expect[side].seamNetWpov) no(`${row.id}${side} evaluateWithoutTaper net ${r[side].netWt} != ${row.expect[side].seamNetWpov}`);
  }
  const subj = row.subject, other = subj === "white" ? "black" : "white";
  for (const h of ["mg", "eg"]) {
    if (row.kind === "pair") {
      if (r.A.two[subj][h] !== 3 * r.B.two[subj][h]) no(`${row.id} subject ${h}: A ${r.A.two[subj][h]} != 3 x B ${r.B.two[subj][h]}`);
      if (r.B.two[subj][h] !== r.B.zero[subj][h]) no(`${row.id} subject B ${h} moved at 2x (queenless)`);
    } else if (r.A.two[subj][h] !== r.B.two[subj][h]) no(`${row.id} control subject moved`);
    if (r.A.two[other][h] !== r.B.two[other][h]) no(`${row.id} other king ${h} differs A/B`);
  }
  r.subject3x = row.kind === "pair" ? `${r.A.two[subj].mg}/${r.B.two[subj].mg} mg, ${r.A.two[subj].eg}/${r.B.two[subj].eg} eg` : "control";
  p1rows++; out.part1.push({ id: row.id, kind: row.kind, subject3x: r.subject3x, netA: r.A.net, netB: r.B.net });
}
// ---- Part 2: broad corpus at distinct values
const V: [number, number, number, number, number, number] = [7, 11, 13, 3, 5, 17];
const VP = at(V);
const fenSet = new Set<string>();
for (const c of buildCorpus()) fenSet.add(toFen(c.position));
const walk = (v: any) => { if (typeof v === "string" && /^[1-8pnbrqkPNBRQK/]+ [wb] /.test(v)) fenSet.add(v); else if (v && typeof v === "object") for (const x of Object.values(v)) walk(x); };
walk(tc); for (const f of MATE_CORPUS) fenSet.add(f);
for (const f of ["k7/8/1K6/8/8/8/8/1Q6 w - - 0 1", "7k/8/6K1/8/8/8/8/6Q1 w - - 0 1", "8/8/8/4k3/8/8/4P3/4K3 w - - 0 1"]) fenSet.add(f);
for (const row of data.rows) { fenSet.add(row.A); fenSet.add(row.B); }
let seed = 270270; const rnd = (n: number) => { seed = (Math.imul(seed, 1103515245) + 12345) >>> 0; return seed % n; };
for (let g = 0; g < 600; g++) { const p = parseFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
  for (let ply = 0; ply < 160; ply++) { const ms = legalMoves(p); if (ms.length === 0) break; makeMove(p, ms[rnd(ms.length)]); fenSet.add(toFen(p)); } }
let positions = 0, seamRows = 0, hotRows = 0, mirrorRows = 0, withFlag = 0, bothFlags = 0, featureHits = { sQ: 0, hQ: 0, oQ: 0 };
const pred = (c: any) => ({ mg: V[0] * c.s * c.q + V[2] * c.h * c.q + V[4] * c.o * c.q, eg: V[1] * c.s * c.q + V[3] * c.h * c.q + V[5] * c.o * c.q });
for (const fen of fenSet) {
  let p0: any; try { p0 = parseFen(fen); } catch { continue; }
  for (const p of [p0, mirrorPosition(p0)]) {
    positions++;
    const cw = counts(p.board, false), cb = counts(p.board, true);
    if (cw.q || cb.q) withFlag++; if (cw.q && cb.q) bothFlags++;
    for (const c of [cw, cb]) { if (c.q && c.s) featureHits.sQ++; if (c.q && c.h) featureHits.hQ++; if (c.q && c.o) featureHits.oQ++; }
    const z = ev.withParametersForTest(ZERO, () => ev.kingExposureForTest(p)), v = ev.withParametersForTest(VP, () => ev.kingExposureForTest(p));
    for (const [k, c] of [["white", cw], ["black", cb]] as const) {
      const b = 15 * c.s + 10 * c.h + 20 * c.o; // E1's base pairs, equal halves (pairs.json params)
      if (z[k].mg !== b || z[k].eg !== b) no(`seam base ${k} ${toFen(p)}: ${JSON.stringify(z[k])} != ${b}`);
      const d = pred(c);
      if (v[k].mg - z[k].mg !== d.mg || v[k].eg - z[k].eg !== d.eg) no(`seam delta ${k} ${toFen(p)}: ${v[k].mg - z[k].mg}/${v[k].eg - z[k].eg} != ${d.mg}/${d.eg}`);
      seamRows++;
    }
    const dw = pred(cw), db = pred(cb);
    const mg = wpov(p, ev.withParametersForTest(VP, () => ev.evaluateWithoutTaper(p))) - wpov(p, ev.withParametersForTest(ZERO, () => ev.evaluateWithoutTaper(p)));
    const eg = wpov(p, ev.withParametersForTest(VP, () => ev.evaluateAtPhase(p, 0))) - wpov(p, ev.withParametersForTest(ZERO, () => ev.evaluateAtPhase(p, 0)));
    const mg24 = wpov(p, ev.withParametersForTest(VP, () => ev.evaluateAtPhase(p, 24))) - wpov(p, ev.withParametersForTest(ZERO, () => ev.evaluateAtPhase(p, 24)));
    if (mg !== db.mg - dw.mg) no(`hot mg ${toFen(p)}: ${mg} != ${db.mg - dw.mg}`);
    if (mg24 !== db.mg - dw.mg) no(`hot mg@24 ${toFen(p)}: ${mg24} != ${db.mg - dw.mg}`);
    if (eg !== db.eg - dw.eg) no(`hot eg ${toFen(p)}: ${eg} != ${db.eg - dw.eg}`);
    hotRows += 3;
  }
  const m = mirrorPosition(p0);
  for (const params of [VP, TWO]) for (const fn of ["evaluate", "evaluateWithoutTaper"]) {
    const a = ev.withParametersForTest(params, () => ev[fn](p0)), b = ev.withParametersForTest(params, () => ev[fn](m));
    if (!Object.is(a, b)) no(`mirror ${fn} ${fen}: ${a} vs ${b}`); mirrorRows++;
  }
}
out.part2 = { distinctFens: fenSet.size, positions, withFlag, bothFlags, featureHits, seamRows, hotRows, mirrorRows, values: V };
out.part1rows = p1rows; out.fail = fail; out.bad = bad;
console.log(JSON.stringify(out, null, 1));
console.log(fail === 0 ? "K1 OK" : `K1 FAIL ${fail}`);
