// arch-ABC-289-joint DIAGNOSTIC: one FEN, head and door, depths. node deep.ts <root> <fen> <d0> <d1>
const [root, fen, a, b] = process.argv.slice(2);
const S = await import(`${root}/src/search.ts`), E = await import(`${root}/src/engine.ts`);
const { parseFen } = await import(`${root}/src/fen.ts`); const { squareName } = await import(`${root}/src/position.ts`);
const mv = (m) => (m ? squareName(m.from) + squareName(m.to) : "-");
for (let d = Number(a); d <= Number(b); d++) {
  const o = { d };
  for (const [k, f] of [["sH", (p) => S.search(p, d)], ["sD", (p) => S.searchWithoutDeltaPruning(p, d)], ["cH", (p) => E.chooseMove(p, { budgetMs: 1e9, now: () => 0, maxDepth: d })], ["cD", (p) => E.chooseMoveWithoutDeltaPruning(p, { budgetMs: 1e9, now: () => 0, maxDepth: d })]]) { const r = f(parseFen(fen)); o[k] = [r.score, mv(r.move), r.nodes]; }
  console.log(JSON.stringify(o));
}
