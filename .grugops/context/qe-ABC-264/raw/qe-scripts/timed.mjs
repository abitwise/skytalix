// qe-ABC-229: one real-clock search in a fresh plain-node process (qe-ABC-228-ii timed.mjs; expected budget changed).
// Both builds play at their own LEVELS[5].budgetMs, which is 4 000 on BOTH (ABC-228 merged reading (ii)). The script
// refuses to read if LEVELS[5].budgetMs differs from the tree's DEFAULT_BUDGET_MS (ADR-0045 D2) or from 4 000.
// usage: node timed.mjs <tree> g6 <kiwipete|position-6>   |   node timed.mjs <tree> g11 <label> <fen>
const [tree, mode, pos, fenArg] = process.argv.slice(2);
const FEN =
  {
    kiwipete: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
    "position-6": "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
  }[pos] ?? fenArg;
const { parseFen } = await import(`${tree}/src/fen.ts`);
const { toSan } = await import(`${tree}/src/san.ts`);
const { chooseMove, DEFAULT_BUDGET_MS } = await import(`${tree}/src/engine.ts`);
const { LEVELS } = await import(`${tree}/src/levels.ts`);
const tag = tree.endsWith("/base") ? "base" : tree.endsWith("/head") ? "head" : tree;
const budget = LEVELS[5].budgetMs;
if (budget !== DEFAULT_BUDGET_MS || budget !== 4000 || LEVELS[5].blunderRate !== 0) {
  console.error(`REFUSED: ${tag} LEVELS[5]=${JSON.stringify(LEVELS[5])} DEFAULT_BUDGET_MS=${DEFAULT_BUDGET_MS} expected=4000`);
  process.exit(4);
}
const p = parseFen(FEN);
const t0 = performance.now();
const c = chooseMove(p, { budgetMs: budget });
const ms = performance.now() - t0;
console.log(JSON.stringify({ tree: tag, mode, pos, budget, ms: Math.round(ms * 10) / 10, depth: c.depth, nodes: c.nodes, score: c.score, san: toSan(p, c.move), at: new Date().toISOString() }));
