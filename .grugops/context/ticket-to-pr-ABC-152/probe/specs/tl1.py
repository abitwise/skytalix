NAME="R4-turn-loop-and-nfr-extra-gameStatusOf"
CMD="npx vitest run src/turn-loop.test.ts src/turn-loop.nfr.test.ts"
EDITS=[("src/turn-loop.ts","  let status = gameStatusOf(history);\n","  gameStatusOf(history); // PLANT\n  let status = gameStatusOf(history);\n")]
