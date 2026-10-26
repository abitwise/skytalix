// qe-ABC-207 independent criteria reading (A1, A2, A3 mirror). Deterministic, no clock.
// It re-implements the reach count and the early-queen condition from the ticket text (not from src/), and
// compares, over a seeded random-playout corpus:
//   head.evaluate - head.evaluateWithoutMobility  ==  clamp(sum weight[type] * reach)   (QE weights Q1 R2 B4 N4 K4)
//   head.evaluateWithoutMobility - base.evaluateWithoutMobility  ==  -(QE early-queen term), side-to-move sign
//   head.evaluate(mirror p) == head.evaluate(p)
// usage: node criteria.mts <base-tree> <head-tree> [games=400] [plies=80]
const [BASE, HEAD, gArg, pArg] = process.argv.slice(2);
const H = await import(`${HEAD}/src/evaluate.ts`);
const B = await import(`${BASE}/src/evaluate.ts`);
const { parseFen, toFen } = await import(`${HEAD}/src/fen.ts`);
const { legalMoves } = await import(`${HEAD}/src/legal.ts`);
const { makeMove } = await import(`${HEAD}/src/apply.ts`);
const { mirrorPosition, clonePosition, PERFT_POSITIONS } = await import(`${HEAD}/src/evaluate.mirror-corpus.ts`);

// --- QE's own model (from the ticket: N 4, B 4, R 2, Q 1, K 4; Q strictly lowest) ---
const W: Record<number, number> = { 2: 4, 3: 4, 4: 2, 5: 1, 6: 4 };
const N8 = [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]];
const K8 = [[1, 1], [1, 0], [1, -1], [0, 1], [0, -1], [-1, 1], [-1, 0], [-1, -1]];
const DIAG = [[1, 1], [1, -1], [-1, 1], [-1, -1]], ORTH = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const at = (b: Uint8Array, f: number, r: number) => b[r * 16 + f] as number; // 0x88
const reach = (b: Uint8Array, f: number, r: number, piece: number): number => {
  const t = piece & 7, black = (piece & 8) !== 0; let n = 0;
  const own = (x: number) => x !== 0 && ((x & 8) !== 0) === black;
  if (t === 2 || t === 6) {
    for (const [df, dr] of t === 2 ? N8 : K8) { const ff = f + df, rr = r + dr; if (ff < 0 || ff > 7 || rr < 0 || rr > 7) continue; if (!own(at(b, ff, rr))) n++; }
    return n;
  }
  const dirs = t === 3 ? DIAG : t === 4 ? ORTH : [...DIAG, ...ORTH];
  for (const [df, dr] of dirs) {
    for (let ff = f + df, rr = r + dr; ff >= 0 && ff <= 7 && rr >= 0 && rr <= 7; ff += df, rr += dr) {
      const x = at(b, ff, rr); if (x === 0) { n++; continue; } if (!own(x)) n++; break;
    }
  }
  return n;
};
const qeMobility = (b: Uint8Array): number => {
  let m = 0;
  for (let r = 0; r < 8; r++) for (let f = 0; f < 8; f++) { const x = at(b, f, r); if (x === 0 || (x & 7) === 1) continue; const v = reach(b, f, r, x) * (W[x & 7] as number); m += (x & 8) ? -v : v; }
  return Math.max(-100, Math.min(100, m));
};
const qeQueenTerm = (b: Uint8Array): number => {
  // per side: a queen on a square other than its home (d1/d8) AND >= 2 of N b/g, B c/f on its back rank
  const side = (black: boolean) => {
    const c = black ? 8 : 0, r = black ? 7 : 0; let out = false;
    for (let rr = 0; rr < 8; rr++) for (let f = 0; f < 8; f++) if (at(b, f, rr) === (5 | c) && !(rr === r && f === 3)) out = true;
    const home = (at(b, 1, r) === (2 | c) ? 1 : 0) + (at(b, 6, r) === (2 | c) ? 1 : 0) + (at(b, 2, r) === (3 | c) ? 1 : 0) + (at(b, 5, r) === (3 | c) ? 1 : 0);
    return out && home >= 2 ? 25 : 0;
  };
  return side(false) - side(true); // white-minus-black charge
};
const stm = (p: any, wmb: number) => (p.blackToMove ? -wmb : wmb);

// --- corpus: seeded random playouts from the start position and the perft positions ---
let seed = 20261025;
const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x80000000);
const games = Number(gArg ?? 400), plies = Number(pArg ?? 80);
const roots = ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", ...PERFT_POSITIONS.map((x: any) => x.fen)];
const corpus: any[] = [];
for (let g = 0; g < games; g++) {
  const p = parseFen(roots[g % roots.length] as string);
  for (let i = 0; i < plies; i++) { const ms = legalMoves(p); if (!ms.length) break; makeMove(p, ms[Math.floor(rnd() * ms.length)]); corpus.push(clonePosition(p)); }
}
const stats = { positions: corpus.length, mobilityMismatch: 0, termMismatch: 0, mirrorMismatch: 0, pureMismatch: 0, termCharged: 0, termWhite: 0, termBlack: 0,
  clampEngaged: 0, unclampedRawSumMatches: 0, termChargedInCpwEndgame: 0, examples: [] as string[] };
const cpwEndgame = (b: Uint8Array) => { // CPW simplified-evaluation definition: no queens, or each side with a queen has no other piece but at most one minor
  const ok = (c: number) => { let q = 0, minors = 0, majors = 0; for (let r = 0; r < 8; r++) for (let f = 0; f < 8; f++) { const x = at(b, f, r); if (x === 0 || (x & 8) !== c) continue; const t = x & 7; if (t === 5) q++; else if (t === 2 || t === 3) minors++; else if (t === 4) majors++; } return q === 0 || (majors === 0 && minors <= 1); };
  return ok(0) && ok(8);
};
for (const p of corpus) {
  const before = toFen(p);
  const hm = H.evaluate(p) - H.evaluateWithoutMobility(p);
  if (hm !== stm(p, qeMobility(p.board))) { stats.mobilityMismatch++; if (stats.examples.length < 5) stats.examples.push(`mob ${before} head ${hm} qe ${stm(p, qeMobility(p.board))}`); }
  const t = qeQueenTerm(p.board);
  const dTerm = H.evaluateWithoutMobility(p) - B.evaluateWithoutMobility(p);
  if (dTerm !== stm(p, -t)) { stats.termMismatch++; if (stats.examples.length < 5) stats.examples.push(`term ${before} head-base ${dTerm} qe ${stm(p, -t)}`); }
  if (t !== 0 || (qeQueenTerm(p.board) === 0 && false)) stats.termCharged++;
  // per side counts
  { const w = qeQueenTerm(p.board); if (w > 0) stats.termWhite++; if (w < 0) stats.termBlack++; }
  if (t !== 0 && cpwEndgame(p.board)) stats.termChargedInCpwEndgame++;
  const m = mirrorPosition(p);
  if (H.evaluate(m) !== H.evaluate(p)) stats.mirrorMismatch++;
  if (toFen(p) !== before) stats.pureMismatch++;
  let raw = 0; for (let r = 0; r < 8; r++) for (let f = 0; f < 8; f++) { const x = at(p.board, f, r); if (x === 0 || (x & 7) === 1) continue; const v = reach(p.board, f, r, x) * (W[x & 7] as number); raw += (x & 8) ? -v : v; }
  if (Math.abs(raw) >= 100) stats.clampEngaged++; else stats.unclampedRawSumMatches++;
}
console.log(JSON.stringify(stats));

// --- A1: QE's own pairs, found programmatically: the piece on a square, kings fixed, ONE own pawn that either
// blocks the last square of one line or stands elsewhere; QE's reach says the piece differs by exactly one square
// and every other piece's reach is equal. Several squares per piece, both colours. Clamp out of play checked. ---
const fenOf = (pcs: Record<string, string>, black: boolean) => {
  const rows: string[] = [];
  for (let r = 7; r >= 0; r--) { let row = "", gap = 0; for (let f = 0; f < 8; f++) { const c = pcs[`${f},${r}`]; if (c) { if (gap) row += gap; gap = 0; row += c; } else gap++; } if (gap) row += gap; rows.push(row); }
  return `${rows.join("/")} ${black ? "b" : "w"} - - 0 1`;
};
const boardOf = (fen: string) => parseFen(fen).board as Uint8Array;
const reaches = (b: Uint8Array) => { const out: number[] = []; for (let r = 0; r < 8; r++) for (let f = 0; f < 8; f++) { const x = at(b, f, r); if (x && (x & 7) !== 1) out.push(reach(b, f, r, x)); } return out; };
const types = (b: Uint8Array) => { const out: number[] = []; for (let r = 0; r < 8; r++) for (let f = 0; f < 8; f++) { const x = at(b, f, r); if (x && (x & 7) !== 1) out.push(x & 7); } return out; };
const TYPE: Record<string, number> = { N: 2, B: 3, R: 4, Q: 5 };
const A1: Record<string, any> = {};
for (const black of [false, true]) for (const pc of ["Q", "R", "B", "N"]) {
  const ch = black ? pc.toLowerCase() : pc, pawn = black ? "p" : "P";
  let found = 0; const steps: number[] = [];
  for (const [pf, pr] of [[3, 3], [4, 4], [2, 5], [5, 2]]) {
    const kings = { "0,7": "k", "7,0": "K" }; // a8, h1
    for (let u = 0; u < 64 && found < 4; u++) for (let v = 0; v < 64 && found < 4; v++) {
      const uf = u & 7, ur = u >> 3, vf = v & 7, vr = v >> 3;
      if (ur < 1 || ur > 6 || vr < 1 || vr > 6 || u === v) continue;
      const base: Record<string, string> = { ...kings, [`${pf},${pr}`]: ch };
      if (base[`${uf},${ur}`] || base[`${vf},${vr}`]) continue;
      const fo = fenOf({ ...base, [`${uf},${ur}`]: pawn }, black), fb = fenOf({ ...base, [`${vf},${vr}`]: pawn }, black);
      let ro: number[], rb: number[]; try { ro = reaches(boardOf(fo)); rb = reaches(boardOf(fb)); } catch { continue; }
      // order of non-pawn pieces is identical; find the piece index (the only differing one must be the piece)
      const diff = ro.map((x, i) => x - (rb[i] as number)); const nz = diff.filter((d) => d !== 0);
      if (nz.length !== 1 || nz[0] !== 1) continue;
      if (types(boardOf(fo))[diff.findIndex((d) => d !== 0)] !== TYPE[pc]) continue;
      const pos = parseFen(fo), neg = parseFen(fb);
      const mo = H.evaluate(pos) - H.evaluateWithoutMobility(pos), mb = H.evaluate(neg) - H.evaluateWithoutMobility(neg);
      if (Math.abs(mo) >= 100 || Math.abs(mb) >= 100) continue;
      // side-to-move sign: the piece belongs to the side to move, so one more square raises the score
      steps.push(mo - mb); found++;
      if (found === 1) A1[`${black ? "b" : "w"}${pc}_example`] = { open: fo, blocked: fb, step: mo - mb };
    }
  }
  A1[`${black ? "b" : "w"}${pc}_steps`] = steps;
}
console.log("A1", JSON.stringify(A1));

// --- A2: the criterion pairs (QE's own) and the boundary of the condition ---
const e = (f: string) => H.evaluate(parseFen(f));
const wom = (f: string) => H.evaluateWithoutMobility(parseFen(f));
const bwom = (f: string) => B.evaluateWithoutMobility(parseFen(f));
const A2 = {
  // Qa4 v Qd1, both knights and bishops home, black queen home; a different pawn set from the SE's
  crit_Qa4: { out: e("rnbqkbnr/pp1ppppp/8/2p5/Q7/2P5/PP1PPPPP/RNB1KBNR w KQkq - 0 3"), home: e("rnbqkbnr/pp1ppppp/8/2p5/8/2P5/PP1PPPPP/RNBQKBNR w KQkq - 0 3") },
  crit_Qa4_btm: { out: e("rnbqkbnr/pp1ppppp/8/2p5/Q7/2P5/PP1PPPPP/RNB1KBNR b KQkq - 0 3"), home: e("rnbqkbnr/pp1ppppp/8/2p5/8/2P5/PP1PPPPP/RNBQKBNR b KQkq - 0 3") },
  // the term in isolation (head womob - base womob), white to move, by count of white minors home
  term_4home: wom("rnbqkbnr/pppp1ppp/8/4p3/Q7/2P5/PP1PPPPP/RNB1KBNR w KQkq - 0 3") - bwom("rnbqkbnr/pppp1ppp/8/4p3/Q7/2P5/PP1PPPPP/RNB1KBNR w KQkq - 0 3"),
  term_2home_N: wom("rnbqkbnr/pppp1ppp/8/4p3/Q7/2P2N2/PP1PPPPP/RN2KB1R w KQkq - 0 3") - bwom("rnbqkbnr/pppp1ppp/8/4p3/Q7/2P2N2/PP1PPPPP/RN2KB1R w KQkq - 0 3"),
  term_1home: wom("rnbqkbnr/pppp1ppp/8/4p3/Q7/2P2N2/PP1PPPPP/R3KB1R w KQkq - 0 3") - bwom("rnbqkbnr/pppp1ppp/8/4p3/Q7/2P2N2/PP1PPPPP/R3KB1R w KQkq - 0 3"),
  term_0home_developed: wom("rnbqkbnr/pppp1ppp/8/4p3/Q1B1P3/2NPBN2/PPP2PPP/R3K2R w KQkq - 0 6") - bwom("rnbqkbnr/pppp1ppp/8/4p3/Q1B1P3/2NPBN2/PPP2PPP/R3K2R w KQkq - 0 6"),
  term_queen_home: wom("rnbqkbnr/pppp1ppp/8/4p3/8/2P5/PP1PPPPP/RNBQKBNR w KQkq - 0 3") - bwom("rnbqkbnr/pppp1ppp/8/4p3/8/2P5/PP1PPPPP/RNBQKBNR w KQkq - 0 3"),
  term_no_queen: wom("rnbqkbnr/pppp1ppp/8/4p3/8/2P5/PP1PPPPP/RNB1KBNR w KQkq - 0 3") - bwom("rnbqkbnr/pppp1ppp/8/4p3/8/2P5/PP1PPPPP/RNB1KBNR w KQkq - 0 3"),
  // knights swapped onto bishop squares do not count as home
  term_wrong_type_home: wom("rnbqkbnr/pppp1ppp/8/4p3/Q7/2P5/PP1PPPPP/R1NBKN1R w KQkq - 0 3") - bwom("rnbqkbnr/pppp1ppp/8/4p3/Q7/2P5/PP1PPPPP/R1NBKN1R w KQkq - 0 3"),
  // black early queen, black to move: charge lowers black's (side to move) score
  term_black_btm: wom("rnb1kbnr/pppp1ppp/8/4p2q/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 1 2") - bwom("rnb1kbnr/pppp1ppp/8/4p2q/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 1 2"),
  // both sides out: cancels
  term_both: wom("rnb1kbnr/pppp1ppp/8/4p2q/Q3P3/8/PPPP1PPP/RNB1KBNR w KQkq - 1 3") - bwom("rnb1kbnr/pppp1ppp/8/4p2q/Q3P3/8/PPPP1PPP/RNB1KBNR w KQkq - 1 3"),
  // endgames with no minor pieces (QE's own): queen off home, rooks and pawns only
  term_eg_noMinors_Q: wom("6k1/5ppp/8/8/3Q4/8/5PPP/R5K1 w - - 0 1") - bwom("6k1/5ppp/8/8/3Q4/8/5PPP/R5K1 w - - 0 1"),
  term_eg_noMinors_KQvK: wom("8/8/4k3/8/8/2Q5/8/4K3 w - - 0 1") - bwom("8/8/4k3/8/8/2Q5/8/4K3 w - - 0 1"),
};
console.log("A2", JSON.stringify(A2));
