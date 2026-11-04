const root = process.argv[2];
const E = await import(`${root}/src/engine.ts`);
const { parseFen } = await import(`${root}/src/fen.ts`);
const rows: [string, number][] = [["8/7k/5K2/8/8/8/8/5R2 w - - 2 2", 5], ["8/k7/2K5/8/8/8/8/1R6 w - - 2 2", 5], ["7k/8/R4K2/8/8/8/8/8 b - - 1 1", 6], ["7k/8/5K2/8/8/8/8/5R2 b - - 1 1", 6], ["7k/8/5K2/8/8/8/8/6R1 b - - 1 1", 6], ["k7/8/2K5/8/8/8/8/1R6 b - - 1 1", 6]];
for (const [fen, d] of rows) {
  const o: Record<string, number> = {};
  for (const n of ["chooseMove", "chooseMoveWithoutHistory", "chooseMoveWithoutSeeOrdering", "chooseMoveWithoutAspiration", "chooseMoveWithoutBundle"]) o[n] = E[n](parseFen(fen), { budgetMs: 1e9, now: () => 0, maxDepth: d }).score;
  console.log(fen, d, JSON.stringify(o));
}
