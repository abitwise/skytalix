// Deterministic node counts to complete depth k (frozen clock). usage: node nodes.mts <tree>
const tree = process.argv[2];
const { parseFen } = await import(`${tree}/src/fen.ts`);
const { chooseMove } = await import(`${tree}/src/engine.ts`);
const FEN: Record<string, string> = { kiwipete: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1", "position-6": "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10" };
for (const n of ["kiwipete", "position-6"]) {
  const row: string[] = [];
  for (const k of [6, 7, 8]) { const c = chooseMove(parseFen(FEN[n]), { budgetMs: 1e9, now: () => 0, maxDepth: k }); row.push(`d${k}=${c.nodes}`); }
  console.log(n, row.join(" "));
}
