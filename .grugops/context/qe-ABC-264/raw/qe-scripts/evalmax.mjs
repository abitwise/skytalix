// qe-ABC-264: the static-score premise. evaluate() on extreme material (promoted queens), legal-shaped boards.
const [H] = process.argv.slice(2);
const { parseFen } = await import(`${H}/src/fen.ts`);
const { evaluate } = await import(`${H}/src/evaluate.ts`);
const { isInCheck } = await import(`${H}/src/legal.ts`);
const { reverseFutilityCut } = await import(`${H}/src/search.ts`);
for (const fen of [
  "QQQQQQQQ/QRRBBNN1/8/8/8/8/8/K6k b - - 0 1",
  "k7/8/8/8/8/8/QRRBBNN1/QQQQQQQK w - - 0 1",
  "k7/8/8/8/3QQQ2/2QQ1QQ1/3QQ3/R3K2R w - - 0 1",
]) {
  const p = parseFen(fen);
  console.log(JSON.stringify({ fen, stm: p.blackToMove ? "b" : "w", inCheck: isInCheck(p), eval: evaluate(p), cutAtBetaFloorMinus1: reverseFutilityCut(p, 1, 1, 19_999) }));
}
