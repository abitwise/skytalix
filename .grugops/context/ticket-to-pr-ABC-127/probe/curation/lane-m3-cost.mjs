const S = process.argv[2];
const { makeMove, unmakeMove } = await import(`${S}/apply.ts`);
const { parseFen } = await import(`${S}/fen.ts`);
const { isInCheck, legalMoves } = await import(`${S}/legal.ts`);
const { squareName } = await import(`${S}/position.ts`);
const label = (m) => `${squareName(m.from)}${squareName(m.to)}`;
function defenderLost(position, n) {
  const replies = legalMoves(position);
  if (replies.length === 0) return isInCheck(position);
  if (n <= 1) return false;
  return replies.every((reply) => {
    const undo = makeMove(position, reply);
    const mates = legalMoves(position).some((move) => {
      const undo2 = makeMove(position, move);
      const lost = defenderLost(position, n - 1);
      unmakeMove(position, move, undo2);
      return lost;
    });
    unmakeMove(position, reply, undo);
    return mates;
  });
}
function matingMoves(fen, n) {
  const position = parseFen(fen);
  return legalMoves(position).filter((move) => { const undo = makeMove(position, move); const lost = defenderLost(position, n); unmakeMove(position, move, undo); return lost; }).map(label);
}
for (const fen of process.argv.slice(3)) {
  const t = performance.now(); const m3 = matingMoves(fen, 3); const t3 = performance.now() - t;
  const u = performance.now(); const m2 = matingMoves(fen, 2); const t2 = performance.now() - u;
  console.log(fen, m3, m2, t3.toFixed(0), "ms", t2.toFixed(0), "ms");
}
