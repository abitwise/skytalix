// ORACLE_AT_DEPTH_3 re-run (quiescence.test.ts A5's rule): searchWithoutPruning(p, 3) must equal searchWithoutPvsOrReductions
// and search() on score and move. Deterministic, no clock. usage: node oracle.mts <tree>
const tree = process.argv[2];
const { parseFen } = await import(`${tree}/src/fen.ts`);
const S = await import(`${tree}/src/search.ts`);
const FEN: Record<string, string> = { kiwipete: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1", "position-6": "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10" };
const { squareName } = await import(`${tree}/src/position.ts`);
const lab = (m: any) => (m ? squareName(m.from) + squareName(m.to) : null);
for (const n of ["position-6", "kiwipete"]) {
  const o = S.searchWithoutPruning(parseFen(FEN[n]), 3), p = S.searchWithoutPvsOrReductions(parseFen(FEN[n]), 3), s = S.search(parseFen(FEN[n]), 3);
  console.log(JSON.stringify({ pos: n, oracle: [o.score, lab(o.move), o.nodes], pre121: [p.score, lab(p.move)], search: [s.score, lab(s.move)], equal: o.score === p.score && o.score === s.score && lab(o.move) === lab(p.move) && lab(o.move) === lab(s.move) }));
}
