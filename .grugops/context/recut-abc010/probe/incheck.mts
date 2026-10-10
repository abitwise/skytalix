const W = process.argv[2];
const { parseFen } = await import(`${W}/src/fen.ts`);
const { isInCheck, legalMoves } = await import(`${W}/src/legal.ts`);
for (const fen of process.argv.slice(3)) { const p = parseFen(fen); console.log(`${fen}  sideToMoveInCheck=${isInCheck(p)} legal=${legalMoves(p).length}`); }
