// secnfr-ABC-083-quiet-readings A9/A7: ONE chooseMove at DEFAULT_BUDGET_MS on the real clock, in this fresh plain-node
// process. Same shape as ticket-to-pr-ABC-083/probe/depth.mjs; load1 and thermal are read by the driver, outside.
// Usage: node one.mjs <tree-root> <label> <kiwipete|position-6> <round>
const [root, label, name, round] = process.argv.slice(2);
const FEN = {
  kiwipete: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "position-6": "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
};
const { chooseMove, DEFAULT_BUDGET_MS } = await import(`${root}/src/engine.ts`);
const { parseFen } = await import(`${root}/src/fen.ts`);
const c = chooseMove(parseFen(FEN[name]), { budgetMs: DEFAULT_BUDGET_MS });
console.log([round, label, name, DEFAULT_BUDGET_MS, c.depth, c.nodes, c.elapsedMs, Math.round((1000 * c.nodes) / c.elapsedMs)].join("\t"));
