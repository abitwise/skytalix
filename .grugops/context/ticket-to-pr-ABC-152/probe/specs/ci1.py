NAME="R3-command-input-movesMessages-derives-twice"
CMD="npx vitest run src/command-input.test.ts"
EDITS=[("src/command-input.ts","  const { legalMoves: derive, toSan: san } = deps ?? { legalMoves, toSan };\n","  const { legalMoves: derive, toSan: san } = deps ?? { legalMoves, toSan };\n  derive(position); // PLANT\n")]
