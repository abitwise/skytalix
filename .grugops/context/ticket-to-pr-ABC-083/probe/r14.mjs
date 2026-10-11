// ABC-083 A10 row 14 (ABC-079 A5, class R): quiescence node-count multiplier, the test's own method:
// searchWithoutPvsOrReductions(p, d).nodes / searchWithoutQuiescence(p, d).nodes.
// Usage: node r14.mjs <tree-root> <label>
const [root, label] = process.argv.slice(2);
const S = await import(`${root}/src/search.ts`);
const { parseFen } = await import(`${root}/src/fen.ts`);
const FEN = {
  kiwipete: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "position-6": "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
};
const LEVEL = { kiwipete: [NaN, 180, 50, 70], "position-6": [NaN, 10, 26, 13] };
for (const [n, f] of Object.entries(FEN)) for (const d of [1, 2, 3]) {
  const q = S.searchWithoutPvsOrReductions(parseFen(f), d), b = S.searchWithoutQuiescence(parseFen(f), d);
  console.log(JSON.stringify({ label, name: n, depth: d, withQ: q.nodes, bare: b.nodes, ratio: +(q.nodes / b.nodes).toFixed(2), level: LEVEL[n][d], over: q.nodes / b.nodes > LEVEL[n][d] }));
}
