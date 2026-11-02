const T = process.argv[2];
const { parseFen } = await import(`${T}/src/fen.ts`);
const s = await import(`${T}/src/search.ts`);
const { evaluate } = await import(`${T}/src/evaluate.ts`);
const { legalMoves, givesCheck } = await import(`${T}/src/legal.ts`);
const { makeMove, unmakeMove } = await import(`${T}/src/apply.ts`);
const { squareName } = await import(`${T}/src/position.ts`);
const q = parseFen("4k3/8/8/8/8/3r4/8/4K3 w - - 0 2");
console.log("eval", evaluate(q), "futilityNode", s.futilityNode(q, 1, 2, 1010, 1011), "search1", s.search(q, 1).score);
const ord = s.orderMoves(legalMoves(q), [], null);
for (const [i, m] of ord.entries()) {
  const u = makeMove(q, m); const leaf = s.search(q, 0).score; unmakeMove(q, m, u);
  console.log(i, squareName(m.from) + squareName(m.to), "futileMove", s.futileMove(q, m, i), "-leaf", -leaf);
}
