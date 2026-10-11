NAME="C4-transposition-node-probeTable-removed"
CMD="npx vitest run src/transposition.test.ts -t 'standing guard'"
EDITS=[("src/search.ts","  const slot = switches.table ? probeTable(key) : -1;","  const slot = -1; // PLANT: the node's probeTable call removed")]
