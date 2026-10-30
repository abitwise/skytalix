// ABC-228 readings (the deep rows' numbers, which the lane's reporter does not print): A4 node ratio at
// depth 6, d5 drift on the 190 in both recursions, and the mate floor on the 287. usage: node oracle.mjs <tree>
const T = process.argv[2];
const { parseFen, toFen } = await import(`${T}/src/fen.ts`);
const s = await import(`${T}/src/search.ts`);
const e = await import(`${T}/src/engine.ts`);
const { legalMoves } = await import(`${T}/src/legal.ts`);
const { makeMove, unmakeMove } = await import(`${T}/src/apply.ts`);
const { gameStatus } = await import(`${T}/src/gameend.ts`);
const { MATE_CORPUS } = await import(`${T}/src/search.mate-corpus.ts`);
const ROOTS = [
  ["startpos", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"],
  ["kiwipete", "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1"],
  ["position-3", "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1"],
  ["position-4", "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1"],
  ["position-5", "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8"],
  ["position-6", "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10"],
];
const ENDGAMES = ["k7/8/1K6/8/8/8/8/1Q6 w - - 0 1", "k7/8/1K6/8/8/8/8/1R6 w - - 0 1", "7k/8/6K1/8/8/8/8/6Q1 w - - 0 1", "8/8/8/4k3/8/8/4P3/4K3 w - - 0 1", "8/8/8/8/8/k7/8/KR6 w - - 0 1", "8/6p1/8/8/8/8/1P6/k1K5 w - - 0 1"];
const sq = (x) => "abcdefgh"[x & 7] + ((x >> 4) + 1);
const corpus = [];
for (const [name, fen] of ROOTS) {
  corpus.push([name, fen]);
  const p = parseFen(fen);
  for (const m of legalMoves(p)) {
    const u = makeMove(p, m);
    if (gameStatus(p).result === "in-progress") corpus.push([`${name}/${sq(m.from)}${sq(m.to)}`, toFen(p)]);
    unmakeMove(p, m, u);
  }
}
ENDGAMES.forEach((f, i) => corpus.push([`endgame-${i}`, f]));
console.log(`corpus ${corpus.length}`);
for (const [name, fen] of [ROOTS[1], ROOTS[5]]) {
  const h = s.search(parseFen(fen), 6).nodes, d = s.searchWithoutQuiescenceEvasions(parseFen(fen), 6).nodes;
  console.log(`A4 ${name} d6: ${h} / ${d} = ${(h / d).toFixed(3)}x`);
}
const isMate = (x) => Math.abs(x) > s.MATE_SCORE - 1000;
const deepen = (f, fen) => f(parseFen(fen), { budgetMs: 1000, now: () => 0, maxDepth: 5 }).score;
for (const [what, on, ref] of [
  ["search() d5", (fen) => s.search(parseFen(fen), 5).score, (fen) => s.searchWithoutQuiescenceEvasions(parseFen(fen), 5).score],
  ["chooseMove to d5", (fen) => deepen(e.chooseMove, fen), (fen) => deepen(e.chooseMoveWithoutQuiescenceEvasions, fen)],
]) {
  const deltas = []; let flips = 0, moved = 0;
  for (const [n, fen] of corpus) {
    const r = ref(fen), g = on(fen);
    if (r !== g) moved++;
    if (isMate(r) || isMate(g)) { if (isMate(r) !== isMate(g) || Math.sign(r) !== Math.sign(g)) flips++; continue; }
    deltas.push([Math.abs(g - r), `${n}: ${r} -> ${g}`]);
  }
  deltas.sort((a, b) => b[0] - a[0]);
  const w = deltas.filter(([x]) => x <= 25).length / deltas.length;
  const p95 = deltas[Math.floor(0.05 * deltas.length)][0];
  console.log(`${what}: ${(100 * w).toFixed(2)}% within 25 cp of ${deltas.length}, max ${deltas[0][0]} cp (${deltas[0][1]}), p95 ${p95}, flips ${flips}, scores moved ${moved}/${corpus.length}`);
}
let mates = 0, viol = 0, newMates = 0;
for (const fen of MATE_CORPUS) {
  const r = s.searchWithoutQuiescenceEvasions(parseFen(fen), 5).score, g = s.search(parseFen(fen), 5).score;
  if (!isMate(r)) { if (isMate(g)) newMates++; continue; }
  mates++;
  if (!isMate(g) || Math.sign(g) !== Math.sign(r) || Math.abs(g) < Math.abs(r)) viol++;
}
console.log(`mate floor d5 on ${MATE_CORPUS.length}: ${viol} of ${mates} door mates violated; new mates ${newMates}`);
