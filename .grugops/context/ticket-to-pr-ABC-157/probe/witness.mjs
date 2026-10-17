const T = process.argv[2];
const { parseFen } = await import(`${T}/src/fen.ts`);
const { legalMoves } = await import(`${T}/src/legal.ts`);
const out = [];
for (const f of ["w K", "w Q", "b k", "b q", "w kq", "b KQ"]) out.push(`${f}:${legalMoves(parseFen(`r3k2r/8/8/8/8/8/8/R3K2R ${f} - 0 1`)).length}`);
console.log(out.join(" "));
