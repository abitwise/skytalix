const W = process.argv[2];
const { chooseMove, chooseMoveWithoutTaper } = await import(`${W}/src/engine.ts`);
const { search, searchWithoutTaper } = await import(`${W}/src/search.ts`);
const { parseFen } = await import(`${W}/src/fen.ts`);
const { squareName } = await import(`${W}/src/position.ts`);
const lab = (m: any) => m ? squareName(m.from) + squareName(m.to) : "-";
const fens = JSON.parse(process.argv[3]);
for (const [n, fen] of fens) {
  const row = [];
  for (const [c, s] of [[chooseMove, search], [chooseMoveWithoutTaper, searchWithoutTaper]] as const) {
    let t = 0; const a = c(parseFen(fen), { budgetMs: 10, now: () => (t += 1) - 1, maxDepth: 3 });
    const b = s(parseFen(fen), 3);
    t = 0; const u = c(parseFen(fen), { budgetMs: 10, now: () => (t += 1) - 1 });
    row.push(`${lab(a.move)}/${a.score} vs ${lab(b.move)}/${b.score} unl d${u.depth}`);
  }
  console.log(n, "| shipped", row[0], "| door", row[1]);
}
