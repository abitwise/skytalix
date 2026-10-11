NAME="R4-gameend-nfr-NFR001-zobristKey-on-cheap-branch"
CMD="npx vitest run src/gameend.nfr.test.ts"
EDITS=[("src/gameend.ts","): GameStatus {\n  if (legalMoves(position).length === 0) {","): GameStatus {\n  zobristKey(position); // PLANT: an expected-0 read added\n  if (legalMoves(position).length === 0) {")]
