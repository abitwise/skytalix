// ABC-083 A10 row 15 (ABC-080 A3, class R): full-ordering / unordered nodes, the test's own doors
// (searchWithoutPvsOrReductions / searchWithoutOrdering). Usage: node r15.mjs <tree-root> <label> [depths]
const [root, label, ds] = process.argv.slice(2);
const S = await import(`${root}/src/search.ts`);
const { parseFen } = await import(`${root}/src/fen.ts`);
const FEN = {
  kiwipete: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "position-6": "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
};
for (const d of (ds ?? "2").split(",").map(Number)) for (const [n, f] of Object.entries(FEN)) {
  const a = S.searchWithoutPvsOrReductions(parseFen(f), d), b = S.searchWithoutOrdering(parseFen(f), d);
  console.log(JSON.stringify({ label, name: n, depth: d, full: a.nodes, none: b.nodes, pct: +(100 * a.nodes / b.nodes).toFixed(2), sameScore: a.score === b.score }));
}
