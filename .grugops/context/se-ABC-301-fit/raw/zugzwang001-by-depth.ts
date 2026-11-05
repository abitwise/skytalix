const root = process.argv[2]!;
const { chooseMove } = await import(root + "/src/engine.ts");
const { parseFen } = await import(root + "/src/fen.ts");
const fen = "8/8/p1p5/1p5p/1P5p/8/PPP2K1p/4R1rk w - - 0 1";
const sq = (s: number) => "abcdefgh"[s & 7]! + (8 - (s >> 3));
for (const d of [8, 9, 10, 11, 12, 13]) {
  const t = Date.now();
  const c = chooseMove(parseFen(fen), { budgetMs: 1000, now: () => 0, maxDepth: d });
  console.log(JSON.stringify({ d, depth: c.depth, score: c.score, nodes: c.nodes, from: c.move.from, to: c.move.to, ms: Date.now() - t }));
}
