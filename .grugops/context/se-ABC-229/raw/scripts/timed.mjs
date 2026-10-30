// ABC-229 forecast, real-clock half: one chooseMove per board at <budgetMs> on <tree>, plain node.
// usage: node timed.mjs <tree> <budgetMs> <board>...
const [tree, budgetArg, ...boards] = process.argv.slice(2);
const BOARDS = {
  kiwipete: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "position-6": "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
};
const f = await import(`${tree}/src/fen.ts`);
const e = await import(`${tree}/src/engine.ts`);
for (const board of boards) {
  const t0 = Date.now();
  const r = e.chooseMove(f.parseFen(BOARDS[board]), { budgetMs: Number(budgetArg) });
  const ms = Date.now() - t0;
  console.log(JSON.stringify({ board, budgetMs: Number(budgetArg), depth: r.depth, nodes: r.nodes, elapsedMs: ms, move: `${r.move.from}-${r.move.to}`, score: r.score }));
}
