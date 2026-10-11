// QE ABC-152 V4, second batch: replacements for the two plants that missed the guard, and base-tree readings.
const p = (id, tests, edits, expect, why) => ({ id, tests, edits, expect, why });
const e = (file, find, replace) => ({ file, find, replace });
export const head = [
  // search.ordering: one extra balanced make/unmake pair AROUND the killer offer (SE's pair was around the record)
  p("so-offer-made-one-ply-deep", ["src/search.ordering.test.ts"], [e("src/search.ts",
    "  let index = 0;\n  for (const move of ordered(moves, ply, switches, killers, hashMove)) {\n",
    "  let index = 0;\n  const qeUndo = makeMove(position, moves[0] as Move);\n  const qeOrdered = ordered(moves, ply, switches, killers, hashMove);\n  unmakeMove(position, moves[0] as Move, qeUndo);\n  for (const move of qeOrdered) {\n")], "red", "killer offered while one extra move is outstanding"),
  // engine.capacity: the ROOT key write doubled (SE doubled the inner write)
  p("ec-root-key-written-twice", ["src/engine.capacity.test.ts"], [e("src/engine.ts",
    "      budget.keys[1] = zobristKeyAfterMove(rootKey, position, move, undo);\n",
    "      zobristKeyAfterMove(rootKey, position, move, undo);\n      budget.keys[1] = zobristKeyAfterMove(rootKey, position, move, undo);\n")], "red", "writes per iteration 128 -> 129"),
];
export const base = [
  p("BASE-ctl-command-input-engine-capacity", ["src/command-input.test.ts", "src/engine.capacity.test.ts"], [], "green", "base control"),
  p("BASE-ci-pd-add-SE", ["src/command-input.test.ts"], [e("src/move-input.ts", "const PRODUCTION_DEPS: MoveInputDeps = { legalMoves, parseCoordinateMove, parseSan, toSan };", "const PRODUCTION_DEPS: MoveInputDeps = {\n  legalMoves: (position) => (legalMoves(position), legalMoves(position)), // PLANT\n  parseCoordinateMove,\n  parseSan,\n  toSan,\n};")], "green", "SE's add-plant on base 3.2.7"),
  p("BASE-ci-pd-remove-SE", ["src/command-input.test.ts"], [e("src/move-input.ts", "const PRODUCTION_DEPS: MoveInputDeps = { legalMoves, parseCoordinateMove, parseSan, toSan };", "const PRODUCTION_DEPS: MoveInputDeps = {\n  legalMoves: () => [], // PLANT\n  parseCoordinateMove,\n  parseSan,\n  toSan,\n};")], "red", "SE's removal on base"),
  p("BASE-ec-root-key-not-via-mock", ["src/engine.capacity.test.ts"], [e("src/engine.ts", "      budget.keys[1] = zobristKeyAfterMove(rootKey, position, move, undo);\n", "      budget.keys[1] = zobristKey(position);\n")], "green", "is the root-write removal blind on base too?"),
];
export default [];
