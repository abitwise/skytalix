const [root, base, m] = process.argv.slice(2);
const { parseFen, toFen } = await import(`${root}/src/fen.ts`); const { legalMoves } = await import(`${root}/src/legal.ts`); const { makeMove } = await import(`${root}/src/apply.ts`); const { squareName } = await import(`${root}/src/position.ts`);
const p = parseFen(base); const mv = legalMoves(p).find((x) => squareName(x.from) + squareName(x.to) === m); makeMove(p, mv); console.log(toFen(p));
