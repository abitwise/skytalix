// One timed search in a fresh plain-node process. usage: node timed.mjs <tree> <a4|g6> <kiwipete|position-6>
const [tree, mode, pos] = process.argv.slice(2);
const FEN = {
  kiwipete: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "position-6": "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
}[pos];
const { parseFen } = await import(`${tree}/src/fen.ts`);
const { chooseMove, DEFAULT_BUDGET_MS, HARD_CEILING_MS } = await import(`${tree}/src/engine.ts`);
const p = parseFen(FEN);
// A4: fixed depth 8 on the real clock, the ceiling as budget (never reached: every run must read depth 8).
// G6: NFR-005's own reading, chooseMove at DEFAULT_BUDGET_MS on the real clock.
const options = mode === "smoke" ? { budgetMs: 1000, maxDepth: 2 } : mode === "a4" ? { budgetMs: HARD_CEILING_MS, maxDepth: 8 } : { budgetMs: DEFAULT_BUDGET_MS };
const t0 = performance.now();
const c = chooseMove(p, options);
const ms = performance.now() - t0;
const tag = tree.endsWith("/base") ? "base" : tree.endsWith("/head") ? "head" : tree;
console.log(JSON.stringify({ tree: tag, mode, pos, ms: Math.round(ms * 10) / 10, depth: c.depth, nodes: c.nodes, score: c.score, move: `${c.move.from}-${c.move.to}`, at: new Date().toISOString() }));
