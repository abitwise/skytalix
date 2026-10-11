NAME="R4-gameend-nfr-NFR001-extra-legalMoves"
CMD="npx vitest run src/gameend.nfr.test.ts"
EDITS=[("src/gameend.ts","): GameStatus {\n  if (legalMoves(position).length === 0) {","): GameStatus {\n  legalMoves(position); // PLANT\n  if (legalMoves(position).length === 0) {")]
