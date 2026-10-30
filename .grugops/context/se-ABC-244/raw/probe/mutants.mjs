// se-ABC-244 mutant list for the SE's A2 parity run. Frozen before any head run (freeze.mjs).
// Each entry: one exact string replacement in one production file, asserted unique at base.
const PSEUDO =
  "((t, b) => [(b ? t + 16 : t - 16) - 1, (b ? t + 16 : t - 16) + 1].some((s) => (s & 0x88) === 0 && position.board[s] === (PAWN | (b ? 8 : 0))))(position.epSquare, position.blackToMove)";
export const MUTANTS = {
  // qe-ABC-230 …af1628d2 § 3: the seam ignores the injected keyHistory.
  F230: ["src/level-seam.ts", "keyHistory === undefined", "true || keyHistory === undefined"],
  // qe-ABC-241 …939168a8 § 2, byte copies of qe-ABC-241/raw/qe-scripts/mutate.mjs.
  QM1: ["src/levels.ts", "[...priorKeys, repetitionKey(position, zobristKey(position))]", "[...priorKeys, zobristKey(position)]"],
  QM2: ["src/gameend.ts", "positionCounts.get(repetitionKey(position, zobristKey(position)))", "positionCounts.get(zobristKey(position))"],
  QM3: ["src/uci-session.ts", "const keys = [repetitionKey(position, zobristKey(position))];", "const keys = [zobristKey(position)];"],
  QM4: ["src/gameend.ts", "if (position.epSquare === NO_SQUARE || hasLegalEnPassant(position)) return key;", `if (position.epSquare === NO_SQUARE || ${PSEUDO}) return key;`],
  // ABC-244 A6 bullet 3: the session hands the replayed keys untrimmed.
  UNTRIM: ["src/uci-session.ts", "return { position, priorKeys: trimPriorKeys(keys, position.halfmoveClock) };", "return { position, priorKeys: keys };"],
  // ABC-244 A6 bullet 4: the search's repetition draw scores non-zero.
  REP0: ["src/engine.ts", "    repeatsBeforeRoot(budget.prior, key, ply, position.halfmoveClock)\n  ) {\n    return 0;", "    repeatsBeforeRoot(budget.prior, key, ply, position.halfmoveClock)\n  ) {\n    return 1;"],
  // se-ABC-241 …887921ba M1 (the § Rollback), reconstructed by se-ABC-244: repetitionKey returns the hash key.
  S241M1: ["src/gameend.ts", "  if (position.epSquare === NO_SQUARE || hasLegalEnPassant(position)) return key;\n  return key ^ epFileKey(position.epSquare);", "  return key;"],
  // se-ABC-241 …887921ba M6, reconstructed by se-ABC-244: UCI replay keys raw (the moves, not the FEN key).
  S241M6: ["src/uci-session.ts", "    keys.push(repetitionKey(position, zobristKey(position)));", "    keys.push(zobristKey(position));"],
};
