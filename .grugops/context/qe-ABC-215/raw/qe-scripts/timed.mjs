// One real-clock search in a fresh plain-node process (ABC-206 QE's timed.mjs, G6/G11 modes only).
// usage: node timed.mjs <tree> g6 <kiwipete|position-6>   |   node timed.mjs <tree> g11 <label> <fen>
const [tree, mode, pos, fenArg] = process.argv.slice(2);
const FEN = {
  kiwipete: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "position-6": "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
}[pos] ?? fenArg;
const { parseFen } = await import(`${tree}/src/fen.ts`);
const { toSan } = await import(`${tree}/src/san.ts`);
const { chooseMove, DEFAULT_BUDGET_MS } = await import(`${tree}/src/engine.ts`);
const p = parseFen(FEN);
const t0 = performance.now();
const c = chooseMove(p, { budgetMs: DEFAULT_BUDGET_MS });
const ms = performance.now() - t0;
const tag = tree.endsWith("/base") ? "base" : tree.endsWith("/head") ? "head" : tree;
console.log(JSON.stringify({ tree: tag, mode, pos, budget: DEFAULT_BUDGET_MS, ms: Math.round(ms * 10) / 10, depth: c.depth, nodes: c.nodes, score: c.score, san: toSan(p, c.move), at: new Date().toISOString() }));
