NAME="C4-levels-extra-chooseMove-on-engine-path"
CMD="npx vitest run src/levels.test.ts -t 'QE-087-a'"
EDITS=[("src/levels.ts","      const choice = chooseMove(position, { budgetMs: level.budgetMs, now });\n","      chooseMove(position, { budgetMs: level.budgetMs, now }); // PLANT\n      const choice = chooseMove(position, { budgetMs: level.budgetMs, now });\n")]
