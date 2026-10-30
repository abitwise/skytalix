// per-evasion quiescence values one ply deeper (shipped rules). usage: node per-evasion.mjs <tree> <fen>
const [T, fen] = process.argv.slice(2);
const { parseFen } = await import(`${T}/src/fen.ts`);
const { legalMoves } = await import(`${T}/src/legal.ts`);
const { makeMove, unmakeMove } = await import(`${T}/src/apply.ts`);
const { squareName } = await import(`${T}/src/position.ts`);
const q = await import(`${T}/src/quiescence.ts`);
const p = parseFen(fen);
for (const m of legalMoves(p)) {
  const u = makeMove(p, m);
  const v = -q.quiesce(p, -Infinity, Infinity, 1, 0, { evasions: true }, () => {});
  unmakeMove(p, m, u);
  console.log(`${squareName(m.from)}${squareName(m.to)} ${v}`);
}
