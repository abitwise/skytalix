// ABC-082: ruling-abc079-g1g2's oracle re-run — searchWithoutPruning(p, 3) vs the pinned door and search(). Plain node.
// Usage: node oracle.ts <tree-root>
const root = process.argv[2];
const S = await import(`${root}/src/search.ts`);
const F = await import(`${root}/src/fen.ts`);
const P = await import(`${root}/src/position.ts`);
const lbl = (m) => (m ? P.squareName(m.from) + P.squareName(m.to) : "null");
const FEN = {
  "position-6": "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
  kiwipete: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
};
for (const [n, fen] of Object.entries(FEN)) {
  const t = performance.now();
  const o = S.searchWithoutPruning(F.parseFen(fen), 3);
  const ms = Math.round(performance.now() - t);
  const d = S.searchWithoutPvsOrReductions(F.parseFen(fen), 3);
  const s = S.search(F.parseFen(fen), 3);
  console.log(JSON.stringify({ name: n, oracle: [o.score, lbl(o.move), o.nodes], oracleMs: ms, pre121: [d.score, lbl(d.move)], search: [s.score, lbl(s.move)], equal: o.score === d.score && lbl(o.move) === lbl(d.move) && o.score === s.score && lbl(o.move) === lbl(s.move) }));
}
