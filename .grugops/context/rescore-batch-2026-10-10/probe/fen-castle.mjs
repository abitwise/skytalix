const wt = process.argv[2];
const { parseFen } = await import(`${wt}/src/fen.ts`);
const { legalMoves } = await import(`${wt}/src/legal.ts`);
for (const f of ["4k3/8/8/8/8/8/8/K7 w KQ - 0 1", "4k3/8/8/8/8/8/8/4K3 w K - 0 1", "4k3/8/4Q3/8/8/8/8/4K3 w - - 0 1"]) {
  const ms = legalMoves(parseFen(f));
  console.log(f, JSON.stringify(ms.map((m) => (typeof m === "number" ? m : m))).slice(0, 300));
}
