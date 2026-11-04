// se-ABC-283-k3: the KRK aspiration row, each arm at maxDepth 1..6 (a fresh call per depth): move / score / nodes.
// usage: node iter.ts <repoRoot> <fen>
const [root, fen] = process.argv.slice(2) as [string, string];
const E = await import(`${root}/src/engine.ts`);
const { parseFen } = await import(`${root}/src/fen.ts`);
const { squareName } = await import(`${root}/src/position.ts`);
for (const [n, c] of [["head", E.chooseMove], ["noasp", E.chooseMoveWithoutAspiration], ["alloff", E.chooseMoveWithoutBundle]] as const) {
  const row: string[] = [];
  for (let d = 1; d <= 6; d++) {
    const r = c(parseFen(fen), { budgetMs: 1e9, now: () => 0, maxDepth: d });
    row.push(`d${d}:${squareName(r.move.from)}${squareName(r.move.to)}/${r.score}/${r.nodes}`);
  }
  console.log(n, row.join(" "));
}
