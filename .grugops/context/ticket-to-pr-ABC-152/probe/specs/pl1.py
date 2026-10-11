NAME="C4-search-pvs-lmr-node-storeEntry-removed"
CMD="npx vitest run src/search.pvs-lmr.test.ts -t 'A4'"
EDITS=[("src/search.ts","  if (switches.table) storeEntry(key, depth, boundOf(best, alphaIn, beta), best, ply, bestMove);","  // PLANT: the node's storeEntry call removed")]
