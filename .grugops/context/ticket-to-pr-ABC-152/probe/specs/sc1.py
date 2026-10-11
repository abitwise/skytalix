NAME="C4-search-capacity-extra-zobristKeyAfterMove"
CMD="npx vitest run src/search.capacity.test.ts"
EDITS=[("src/search.ts","    keys[ply + 1] = zobristKeyAfterMove(key, position, move, undo);\n","    zobristKeyAfterMove(key, position, move, undo); // PLANT\n    keys[ply + 1] = zobristKeyAfterMove(key, position, move, undo);\n")]
