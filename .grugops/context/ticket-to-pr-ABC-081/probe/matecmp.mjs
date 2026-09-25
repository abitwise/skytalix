const [W, M] = process.argv.slice(2);
const ge = await import(W + "/src/engine.ts"), be = await import(M + "/src/engine.ts");
const { searchWithoutTable, search } = await import(W + "/src/search.ts");
const { parseFen } = await import(W + "/src/fen.ts");
const C = ["k7/8/8/K7/8/8/8/1R6 b - - 1 1", "k7/8/8/2K5/8/8/8/1R6 b - - 1 1", "k7/8/8/1K6/8/8/8/1R6 b - - 1 1",
  "k7/8/8/1K6/8/8/8/1Q6 b - - 1 1", "k7/8/2K5/8/8/8/8/1R6 b - - 1 1", "k7/8/1K6/8/8/8/8/2R5 b - - 1 1",
  "7k/8/8/6K1/8/8/8/6Q1 b - - 1 1", "7k/8/6K1/8/8/8/8/Q7 b - - 1 1", "5K1k/8/8/8/8/8/8/6R1 b - - 1 1"];
for (const f of C) for (const b of [20, 40, 80, 160]) {
  let t = 0, u = 0;
  const g = ge.chooseMove(parseFen(f), { budgetMs: b, now: () => t++ });
  const m = be.chooseMove(parseFen(f), { budgetMs: b, now: () => u++ });
  const ref = g.depth <= 8 ? searchWithoutTable(parseFen(f), g.depth).score : "skip";
  const s = g.depth <= 8 ? search(parseFen(f), g.depth).score : "skip";
  const flag = g.score !== m.score || g.depth !== m.depth ? "DIFF" : "";
  console.log(f, b, "good d", g.depth, g.score, g.nodes, "| nomate d", m.depth, m.score, m.nodes, "| ref", ref, "search", s, flag);
}
