// qe-ABC-271 K1 (a)-(e) independent re-check, ONE process, tree T (default H) against B (main's copy). Written by QE
// from the STATED rule (qe-ABC-271-freeze verify.mjs's rule(), from ADR-0070's text), never from the build's passerTerms.
//  Part 1: QE's frozen rows (fixtures.json, sha256 checked): passerTermsForTest per side = frozen seam at the probed
//          values; 0 at the shipped values; every pair's A - B per side = the frozen difference.
//  Part 2: a broad corpus (G3's 184, every taper-corpus FEN, the mate corpus, the 56 frozen rows, 300 seeded random
//          walks of legal moves from the start (not games: no engine move is chosen), 20 000 seeded random endgame
//          placements), each with its mirror. At two value sets (the probed VP; distinct primes V2):
//          seam = rule per side; HOT PATH: white-POV evaluateAtPhase(p, k) at V = mg + trunc((D0 + e_k) x (24 - k) / 24)
//          for k in 0, 1, 6, 12, 23, 24, where mg = evaluateWithoutTaper, D0 = evaluateAtPhase(p, 0) - mg at the shipped
//          values, and e_k = the rule's white minus black (kd + free, + U only when k = 0); evaluateWithoutTaper unmoved;
//          the memo path (evaluate) = evaluateWithoutPawnCache, Object.is; mirror Object.is.
//          At the SHIPPED values: T's evaluate / evaluateAtPhase(k) / evaluateWithoutTaper / evaluateWithoutPawnCache /
//          evaluateWithoutMobility Object.is B's; the seam is 0; the memo words (hit and miss) = the rule's frontmost passers.
// usage: node k1.ts <S> <fixtures.json> [tree=H] [scale=1 (walks x 300, placements x 20 000)]
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
const [S, fxPath, treeArg = "H", scaleArg = "1"] = process.argv.slice(2);
const SCALE = Number(scaleArg);
const T = `${S}/${treeArg}/src`, BT = `${S}/B/src`;
const ev = await import(`${T}/evaluate.ts`), P = await import(`${T}/evaluate-params.ts`);
const bev = await import(`${BT}/evaluate.ts`), bfen = await import(`${BT}/fen.ts`);
const { parseFen, toFen } = await import(`${T}/fen.ts`);
const { buildCorpus, mirrorPosition } = await import(`${T}/evaluate.mirror-corpus.ts`);
const tc = await import(`${T}/evaluate.taper-corpus.ts`);
const { MATE_CORPUS } = await import(`${T}/search.mate-corpus.ts`);
const { legalMoves, isInCheck } = await import(`${T}/legal.ts`);
const { makeMove } = await import(`${T}/apply.ts`);
const fxText = readFileSync(fxPath);
const FX = JSON.parse(fxText.toString("utf8"));
let fail = 0; const bad: string[] = [];
const no = (m: string) => { fail++; if (bad.length < 30) bad.push(m); };
const out: any = { tree: treeArg, fixturesSha256: createHash("sha256").update(fxText).digest("hex") };
if (out.fixturesSha256 !== "bf3c205bf4106209e3151717d93542180d90d344cecfdfbb6f2a30c9d5db887a") no("fixtures sha256");
// ---- the rule (verify.mjs's, parametrised by the value set V and an explicit phase for U) ----
const PAWN = 1, KING = 6, BLK = 8, PW = [0, 0, 1, 1, 2, 4, 0];
const cheb = (a: number, b: number) => Math.max(Math.abs((a & 7) - (b & 7)), Math.abs((a >> 4) - (b >> 4)));
function rule(pos: any, V: any, phaseArg?: number) {
  const b = pos.board; let phase = 0; const king: any = { white: -1, black: -1 };
  for (let s = 0; s < 128; s++) { if (s & 0x88) continue; const x = b[s]; if (!x) continue; phase += PW[x & 7]; if ((x & 7) === KING) king[x & BLK ? "black" : "white"] = s; }
  if (phaseArg !== undefined) phase = phaseArg;
  const res: any = {};
  for (const colour of ["white", "black"]) {
    const black = colour === "black", own = PAWN | (black ? BLK : 0), enemy = PAWN | (black ? 0 : BLK), step = black ? -1 : 1;
    const ownK = king[colour], enK = king[black ? "white" : "black"], defenderToMove = pos.blackToMove !== black;
    let kd = 0, free = 0, unst = false, word = 0;
    for (let file = 0; file < 8; file++) {
      for (const r of black ? [1, 2, 3, 4, 5, 6] : [6, 5, 4, 3, 2, 1]) {
        const sq = r * 16 + file; if (b[sq] !== own) continue;
        let passed = true;
        for (let rr = r + step; rr >= 1 && rr <= 6; rr += step) for (let ff = Math.max(0, file - 1); ff <= Math.min(7, file + 1); ff++) if (b[rr * 16 + ff] === enemy) passed = false;
        if (!passed) continue;
        const R = black ? 7 - r : r, Q = (black ? 0 : 7) * 16 + file;
        let isFree = 1; for (let rr = r + step; black ? rr >= 0 : rr <= 7; rr += step) if (b[rr * 16 + file]) isFree = 0;
        const dE = cheb(enK, Q), dO = cheb(ownK, Q);
        kd += V.KE[R] * Math.min(dE, 5) - V.KO[R] * Math.min(dO, 5);
        free += V.F[R] * isFree;
        if (phase === 0 && isFree && (R === 1 ? 5 : 7 - R) < dE - (defenderToMove ? 1 : 0)) unst = true;
        word |= r << (3 * file);
        break;
      }
    }
    res[colour] = { kd, free, un: unst ? V.U : 0, word };
  }
  return res;
}
const pad = (a: number[]) => [...a, 0];
const VP = { KE: pad(FX.values.PASSED_KING_ENEMY), KO: pad(FX.values.PASSED_KING_OWN), F: pad(FX.values.PASSED_FREE), U: FX.values.PASSED_UNSTOPPABLE };
const V2 = { KE: [0, 3, 5, 7, 11, 13, 17, 0], KO: [0, 2, 3, 5, 7, 11, 19, 0], F: [0, 23, 29, 31, 37, 41, 43, 0], U: 97 };
const table = (V: any) => ({ ...P, PASSED_KING_ENEMY: { mg: P.PASSED_KING_ENEMY.mg, eg: V.KE }, PASSED_KING_OWN: { mg: P.PASSED_KING_OWN.mg, eg: V.KO },
  PASSED_FREE: { mg: P.PASSED_FREE.mg, eg: V.F }, PASSED_UNSTOPPABLE: { mg: 0, eg: V.U } });
const TP = table(VP), T2 = table(V2);
const seam = (p: any, params?: any) => (params ? ev.withParametersForTest(params, () => ev.passerTermsForTest(p)) : ev.passerTermsForTest(p));
const eqParts = (a: any, b: any) => a.kd === b.kd && a.free === b.free && a.un === b.un;
// ---- Part 1: frozen rows ----
const byId: any = {}; let p1 = 0;
for (const row of FX.k1c) {
  const p = parseFen(row.fen); byId[row.id] = row;
  const s = seam(p, TP), z = seam(p);
  for (const c of ["white", "black"]) {
    if (!eqParts(s[c], row[c].seam)) no(`P1 ${row.id} ${c} ${JSON.stringify(s[c])} != ${JSON.stringify(row[c].seam)}`);
    if (z[c].kd !== 0 || z[c].free !== 0 || z[c].un !== 0) no(`P1 ${row.id} ${c} not 0 at shipped`);
  }
  row._s = s; p1++;
}
let pairs = 0;
for (const row of FX.k1c) if (row.half === "A") { const b = FX.k1c.find((r: any) => r.pair === row.pair && r.half === "B"); if (!b) continue; pairs++;
  for (const c of ["white", "black"]) for (const k of ["kd", "free", "un"]) if (row._s[c][k] - b._s[c][k] !== row[c].seam[k] - b[c].seam[k]) no(`P1 pair ${row.pair} ${c} ${k}`); }
out.part1 = { rows: p1, pairs };
// ---- Part 2: corpus ----
const fens = new Set<string>();
for (const c of buildCorpus()) fens.add(toFen(c.position));
const walk = (v: any) => { if (typeof v === "string" && /^[1-8pnbrqkPNBRQK/]+ [wb] /.test(v)) fens.add(v); else if (v && typeof v === "object") for (const x of Object.values(v)) walk(x); };
walk(tc); for (const f of MATE_CORPUS) fens.add(typeof f === "string" ? f : (f as any).fen);
for (const r of [...FX.k1c, ...FX.k1a]) fens.add(r.fen);
const named = fens.size;
let seed = 271271; const rnd = (n: number) => { seed = (Math.imul(seed, 1103515245) + 12345) >>> 0; return (seed >>> 8) % n; };
for (let g = 0; g < Math.round(300 * SCALE); g++) { const p = parseFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
  for (let ply = 0; ply < 160; ply++) { const ms = legalMoves(p); if (ms.length === 0) break; makeMove(p, ms[rnd(ms.length)]); fens.add(toFen(p)); } }
const walks = fens.size - named;
// random endgame placements: two kings, 1-6 pawns a side (ranks 2-7), 0-2 other pieces; side not to move not in check
let placed = 0;
while (placed < Math.round(20000 * SCALE)) {
  const sq = Array(64).fill("");
  const put = (ch: string, lo: number, hi: number) => { for (let t = 0; t < 50; t++) { const i = lo * 8 + rnd((hi - lo + 1) * 8); if (!sq[i]) { sq[i] = ch; return i; } } return -1; };
  const wk = put("K", 0, 7), bk = put("k", 0, 7); if (cheb(((wk >> 3) << 4) | (wk & 7), ((bk >> 3) << 4) | (bk & 7)) < 2) continue;
  for (let i = 1 + rnd(4); i > 0; i--) put("P", 1, 6); for (let i = 1 + rnd(4); i > 0; i--) put("p", 1, 6);
  for (let i = rnd(3); i > 0; i--) put("NBRQnbrq"[rnd(8)], 0, 7);
  const rows: string[] = []; for (let r = 7; r >= 0; r--) { let s = "", e = 0; for (let f = 0; f < 8; f++) { const x = sq[r * 8 + f]; if (!x) e++; else { if (e) s += e; e = 0; s += x; } } if (e) s += e; rows.push(s); }
  const fen = `${rows.join("/")} ${rnd(2) ? "b" : "w"} - - 0 1`;
  let p: any; try { p = parseFen(fen); } catch { continue; }
  const other = { ...p, board: p.board.slice(), blackToMove: !p.blackToMove }; if (isInCheck(other)) continue;
  fens.add(toFen(p)); placed++;
}
const wpov = (p: any, v: number) => (p.blackToMove ? 0 - v : v);
const PH = [0, 1, 6, 12, 23, 24];
const cnt = { positions: 0, withPasser: 0, phase0: 0, uLiveVP: 0, uAtPhase0Hot: 0, freeNonZero: 0, seamRows: 0, hotRows: 0, idRows: 0, memoRows: 0, mirrorRows: 0 };
for (const fen of fens) {
  let p0: any; try { p0 = parseFen(fen); } catch { continue; }
  for (const p of [p0, mirrorPosition(p0)]) {
    cnt.positions++;
    const ph = ev.phaseOf(p); if (ph === 0) cnt.phase0++;
    const rp = rule(p, VP), r2 = rule(p, V2);
    if (rp.white.word | rp.black.word) cnt.withPasser++;
    if (rp.white.un || rp.black.un) cnt.uLiveVP++;
    if (rp.white.free || rp.black.free) cnt.freeNonZero++;
    // seam vs rule at both value sets, and 0 at the shipped values
    const sp = seam(p, TP), s2 = seam(p, T2), s0 = seam(p);
    for (const c of ["white", "black"]) {
      if (!eqParts(sp[c], rp[c])) no(`seamVP ${c} ${toFen(p)} ${JSON.stringify(sp[c])} != ${JSON.stringify(rp[c])}`);
      if (!eqParts(s2[c], r2[c])) no(`seamV2 ${c} ${toFen(p)} ${JSON.stringify(s2[c])} != ${JSON.stringify(r2[c])}`);
      if (s0[c].kd || s0[c].free || s0[c].un) no(`seam0 ${c} ${toFen(p)}`);
      cnt.seamRows += 3;
    }
    // hot path at V2 and VP: the blend formula, phase by phase
    const mg = wpov(p, ev.evaluateWithoutTaper(p));
    const d0 = wpov(p, ev.evaluateAtPhase(p, 0)) - mg;
    for (const [V, params] of [[V2, T2], [VP, TP]] as const) {
      const mgV = wpov(p, ev.withParametersForTest(params, () => ev.evaluateWithoutTaper(p)));
      if (mgV !== mg) no(`hot mg moved ${toFen(p)}`);
      for (const k of PH) {
        const r = rule(p, V, k);
        const e = r.white.kd + r.white.free + r.white.un - (r.black.kd + r.black.free + r.black.un);
        if (k === 0 && (r.white.un || r.black.un)) cnt.uAtPhase0Hot++;
        const want = mg + Math.trunc(((d0 + e) * (24 - k)) / 24);
        const got = wpov(p, ev.withParametersForTest(params, () => ev.evaluateAtPhase(p, k)));
        if (got !== want) no(`hot k=${k} ${toFen(p)} got ${got} want ${want}`);
        cnt.hotRows++;
      }
      // memo path = no-memo path, Object.is, at V (evaluate through the memo, cold then warm)
      ev.withParametersForTest(params, () => {
        const a = ev.evaluate(p), b2 = ev.evaluate(p), c2 = ev.evaluateWithoutPawnCache(p);
        if (!Object.is(a, c2) || !Object.is(b2, c2)) no(`memo eval ${toFen(p)} ${a} ${b2} ${c2}`);
        const m = mirrorPosition(p);
        if (!Object.is(ev.evaluate(p), ev.evaluate(m))) no(`mirror evaluate at V ${toFen(p)}`);
        if (!Object.is(ev.evaluateAtPhase(p, 0), ev.evaluateAtPhase(m, 0))) no(`mirror eval@0 at V ${toFen(p)}`);
        cnt.memoRows++; cnt.mirrorRows += 2;
      });
    }
    // value identity at the shipped values against B (main's copy)
    const bp = bfen.parseFen(toFen(p));
    const pairsId: [string, number, number][] = [["evaluate", ev.evaluate(p), bev.evaluate(bp)], ["noTaper", ev.evaluateWithoutTaper(p), bev.evaluateWithoutTaper(bp)],
      ["noMemo", ev.evaluateWithoutPawnCache(p), bev.evaluateWithoutPawnCache(bp)], ["noMob", ev.evaluateWithoutMobility(p), bev.evaluateWithoutMobility(bp)],
      ...PH.map((k) => [`at${k}`, ev.evaluateAtPhase(p, k), bev.evaluateAtPhase(bp, k)] as [string, number, number])];
    for (const [n, a, b] of pairsId) { if (!Object.is(a, b)) no(`identity ${n} ${toFen(p)} ${a} vs ${b}`); cnt.idRows++; }
    if (!Object.is(ev.evaluate(p), ev.evaluate(mirrorPosition(p)))) no(`mirror shipped ${toFen(p)}`);
    // memo words: a miss, a hit, and fresh, each = the rule's frontmost passers
    const fresh = ev.pawnStructureForTest(p, false), m1 = ev.pawnStructureForTest(p, true), m2 = ev.pawnStructureForTest(p, true);
    for (const w of [fresh, m1, m2]) if (w.whitePassers !== rp.white.word || w.blackPassers !== rp.black.word || w.structure !== fresh.structure) no(`memo words ${toFen(p)} ${JSON.stringify(w)} rule ${rp.white.word}/${rp.black.word}`);
    cnt.memoRows++;
  }
}
// collisions: walk the whole corpus through the memo at V2 twice in order, each = the no-memo path
let coll = 0;
ev.withParametersForTest(T2, () => { for (let pass = 0; pass < 2; pass++) for (const fen of fens) { const p = parseFen(fen); const a = ev.evaluate(p), b = ev.evaluateWithoutPawnCache(p); if (!Object.is(a, b)) no(`collision pass ${pass} ${fen}`); coll++; } });
out.part2 = { distinctFens: fens.size, named, walks, placed, ...cnt, collisionRows: coll, V2 };
out.fail = fail; out.bad = bad;
console.log(JSON.stringify(out, null, 1));
console.log(fail === 0 ? "K1 OK" : `K1 FAIL ${fail}`);
