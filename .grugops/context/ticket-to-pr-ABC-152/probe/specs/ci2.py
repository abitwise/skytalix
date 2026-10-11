NAME="R5-command-input-PRODUCTION_DEPS-path-extra-legalMoves"
CMD="npx vitest run src/command-input.test.ts"
EDITS=[("src/move-input.ts","const PRODUCTION_DEPS: MoveInputDeps = { legalMoves, parseCoordinateMove, parseSan, toSan };","const PRODUCTION_DEPS: MoveInputDeps = {\n  legalMoves: (position) => (legalMoves(position), legalMoves(position)), // PLANT: one extra call on the deps path\n  parseCoordinateMove,\n  parseSan,\n  toSan,\n};")]
