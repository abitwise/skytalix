const root = process.argv[2];
const S = await import(`${root}/src/search.ts`);
const E = await import(`${root}/src/engine.ts`);
const { parseFen } = await import(`${root}/src/fen.ts`);
const { squareName } = await import(`${root}/src/position.ts`);
const fen = "6k1/R7/5K2/8/8/8/8/8 w - - 2 2";
const mv = (m: any) => (m ? squareName(m.from) + squareName(m.to) : "-");
for (const n of ["search", "searchWithoutHistory", "searchWithoutSeeOrdering", "searchWithoutBundle"])
  for (const d of [5, 6, 7]) { const r = S[n](parseFen(fen), d); console.log(n, d, mv(r.move), r.score, r.nodes); }
for (const n of ["chooseMove", "chooseMoveWithoutHistory", "chooseMoveWithoutSeeOrdering", "chooseMoveWithoutAspiration", "chooseMoveWithoutBundle"])
  for (const d of [5, 6]) { const r = E[n](parseFen(fen), { budgetMs: 1e9, now: () => 0, maxDepth: d }); console.log(n, d, mv(r.move), r.score, r.nodes); }
