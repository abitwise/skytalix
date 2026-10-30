// ABC-229 deep readings in plain node on the head tree: A3 node ratios at d6, the d5 drift of both
// recursions against ABC-229's doors on the 190, and ABC-228's re-pointed rows (A4, drift, mate floor).
// usage: node oracle.mjs <headTree>
const [H] = process.argv.slice(2);
const fen = await import(`${H}/src/fen.ts`);
const s = await import(`${H}/src/search.ts`);
const e = await import(`${H}/src/engine.ts`);
const legal = await import(`${H}/src/legal.ts`);
const apply = await import(`${H}/src/apply.ts`);
const ge = await import(`${H}/src/gameend.ts`);
const mc = await import(`${H}/src/search.mate-corpus.ts`);
const P = (f) => fen.parseFen(f);
const ROOTS = {
  kiwipete: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "position-6": "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
};
const SIX = [
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", ROOTS.kiwipete,
  "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1",
  "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1",
  "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8", ROOTS["position-6"],
];
const ENDGAMES = ["k7/8/1K6/8/8/8/8/1Q6 w - - 0 1", "k7/8/1K6/8/8/8/8/1R6 w - - 0 1", "7k/8/6K1/8/8/8/8/6Q1 w - - 0 1", "8/8/8/4k3/8/8/4P3/4K3 w - - 0 1", "8/8/8/8/8/k7/8/KR6 w - - 0 1", "8/6p1/8/8/8/8/1P6/k1K5 w - - 0 1"];
const c190 = [];
for (const f of SIX) { c190.push(f); const p = P(f); for (const m of legal.legalMoves(p)) { const u = apply.makeMove(p, m); if (ge.gameStatus(p).result === "in-progress") c190.push(fen.toFen(p)); apply.unmakeMove(p, m, u); } }
c190.push(...ENDGAMES);
console.log(`corpus ${c190.length}`);
for (const [n, f] of Object.entries(ROOTS)) {
  const head = s.search(P(f), 6).nodes, d229 = s.searchWithoutQuietPromotions(P(f), 6).nodes, d228 = s.searchWithoutQuiescenceEvasions(P(f), 6).nodes;
  console.log(`ABC-229 A3 ${n} d6: ${head} / ${d229} = ${(head / d229).toFixed(4)}x; ABC-228 A4 (re-pointed) ${d229} / ${d228} = ${(d229 / d228).toFixed(4)}x`);
}
const isMate = (x) => Math.abs(x) > s.MATE_SCORE - 1000;
const deep = (choose, f) => choose(P(f), { budgetMs: 1000, now: () => 0, maxDepth: 5 }).score;
function drift(label, on, ref) {
  const d = []; let flips = 0, moved = 0;
  for (const f of c190) { const r = ref(f), g = on(f); if (r !== g) moved++; if (isMate(r) || isMate(g)) { if (isMate(r) !== isMate(g) || Math.sign(r) !== Math.sign(g)) flips++; continue; } d.push([Math.abs(g - r), `${f}: ${r} -> ${g}`]); }
  d.sort((a, b) => b[0] - a[0]);
  const w = d.filter(([x]) => x <= 25).length / d.length;
  console.log(`${label}: ${(100 * w).toFixed(2)}% within 25 cp of ${d.length}, max ${d[0][0]} cp (${d[0][1]}); scores moved on ${moved}/190; mate flips ${flips}`);
}
drift("ABC-229 search() d5 vs searchWithoutQuietPromotions", (f) => s.search(P(f), 5).score, (f) => s.searchWithoutQuietPromotions(P(f), 5).score);
drift("ABC-229 chooseMove to d5 vs chooseMoveWithoutQuietPromotions", (f) => deep(e.chooseMove, f), (f) => deep(e.chooseMoveWithoutQuietPromotions, f));
drift("ABC-228 (re-pointed) searchWithoutQuietPromotions d5 vs searchWithoutQuiescenceEvasions", (f) => s.searchWithoutQuietPromotions(P(f), 5).score, (f) => s.searchWithoutQuiescenceEvasions(P(f), 5).score);
drift("ABC-228 (re-pointed) chooseMoveWithoutQuietPromotions to d5 vs chooseMoveWithoutQuiescenceEvasions", (f) => deep(e.chooseMoveWithoutQuietPromotions, f), (f) => deep(e.chooseMoveWithoutQuiescenceEvasions, f));
let mates = 0, viol = 0, mates229 = 0, viol229 = 0;
for (const f of mc.MATE_CORPUS) {
  const r = s.searchWithoutQuiescenceEvasions(P(f), 5).score;
  const r2 = s.searchWithoutQuietPromotions(P(f), 5).score;
  if (isMate(r)) { mates++; if (!isMate(r2) || Math.sign(r2) !== Math.sign(r) || Math.abs(r2) < Math.abs(r)) viol++; }
  if (isMate(r2)) { mates229++; const g = s.search(P(f), 5).score; if (!isMate(g) || Math.sign(g) !== Math.sign(r2) || Math.abs(g) < Math.abs(r2)) viol229++; }
}
console.log(`ABC-228 mate floor (re-pointed) d5: ${viol} of ${mates} violated; report: search() vs ABC-229 door, ${viol229} of ${mates229} violated`);
