// qe-ABC-273 G11 (reported, not graded): qe-ABC-268 raw/qe-scripts/timed.mjs's g11 path, one fresh plain-node process
// per position, the tree's own LEVELS[5].budgetMs (refused unless 4 000 = DEFAULT_BUDGET_MS, blunder rate 0).
// usage: node g11.mjs <tree> <label> <fen>
const [tree, label, FEN] = process.argv.slice(2);
const { parseFen } = await import(`${tree}/src/fen.ts`);
const { toSan } = await import(`${tree}/src/san.ts`);
const { chooseMove, DEFAULT_BUDGET_MS } = await import(`${tree}/src/engine.ts`);
const { LEVELS } = await import(`${tree}/src/levels.ts`);
const budget = LEVELS[5].budgetMs;
if (budget !== DEFAULT_BUDGET_MS || budget !== 4000 || LEVELS[5].blunderRate !== 0) {
  console.error(`REFUSED: LEVELS[5]=${JSON.stringify(LEVELS[5])} DEFAULT_BUDGET_MS=${DEFAULT_BUDGET_MS} expected=4000`);
  process.exit(4);
}
const p = parseFen(FEN);
const t0 = performance.now();
const c = chooseMove(p, { budgetMs: budget });
const ms = performance.now() - t0;
console.log(JSON.stringify({ tree: "main", pos: label, budget, ms: Math.round(ms * 10) / 10, depth: c.depth, nodes: c.nodes, score: c.score, san: toSan(p, c.move), at: new Date().toISOString() }));
