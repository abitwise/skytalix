NAME="R5-command-input-PRODUCTION_DEPS-path-removes-legalMoves"
CMD="npx vitest run src/command-input.test.ts"
EDITS=[("src/move-input.ts","const PRODUCTION_DEPS: MoveInputDeps = { legalMoves, parseCoordinateMove, parseSan, toSan };","const PRODUCTION_DEPS: MoveInputDeps = {\n  legalMoves: () => [], // PLANT: the deps path no longer calls legalMoves\n  parseCoordinateMove,\n  parseSan,\n  toSan,\n};")]
