const wt = process.argv[2];
const { parseFen } = await import(`${wt}/src/fen.ts`);
const { legalMoves } = await import(`${wt}/src/legal.ts`);
const ms = legalMoves(parseFen("4k3/8/4Q3/8/8/8/8/4K3 w - - 0 1"));
console.log("legal", ms.length, "captures", JSON.stringify(ms.filter((m) => m.captured !== 0)));
