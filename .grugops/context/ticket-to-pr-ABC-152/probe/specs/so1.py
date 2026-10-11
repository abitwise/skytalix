NAME="C4-search-ordering-makeMove-around-killer-record"
CMD="npx vitest run src/search.ordering.test.ts"
EDITS=[("src/search.ts","    if (alpha >= beta) {\n      killers.record(ply, move);\n","    if (alpha >= beta) {\n      const plantUndo = makeMove(position, move); // PLANT: one makeMove (and its unmake) added\n      killers.record(ply, move);\n      unmakeMove(position, move, plantUndo);\n")]
