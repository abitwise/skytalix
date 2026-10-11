NAME="C4-engine-capacity-extra-zobristKeyAfterMove"
CMD="npx vitest run src/engine.capacity.test.ts"
EDITS=[("src/engine.ts","      keys[ply + 1] = zobristKeyAfterMove(key, position, move, undo);\n","      zobristKeyAfterMove(key, position, move, undo); // PLANT\n      keys[ply + 1] = zobristKeyAfterMove(key, position, move, undo);\n")]
