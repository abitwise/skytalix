// arch-ABC-239-f3f4 D1/D3: chooseMove on a frozen clock at fixed depths on zugzwang.001.
// usage: node zz.ts <srcdir> <label> <depth...>
const [srcdir, label, ...depths] = process.argv.slice(2) as [string, string, ...string[]];
const { chooseMove } = await import(`${srcdir}/engine.ts`);
const { parseFen } = await import(`${srcdir}/fen.ts`);
const { squareName } = await import(`${srcdir}/position.ts`);
const FEN = "8/8/p1p5/1p5p/1P5p/8/PPP2K1p/4R1rk w - - 0 1";
for (const d of depths.map(Number)) {
  const t0 = Date.now();
  const c = chooseMove(parseFen(FEN), { budgetMs: 1_000, now: () => 0, maxDepth: d });
  console.log(`${label} d${d}: depth ${c.depth} move ${squareName(c.move.from)}${squareName(c.move.to)} score ${c.score} nodes ${c.nodes} (${Date.now() - t0} ms)`);
}
