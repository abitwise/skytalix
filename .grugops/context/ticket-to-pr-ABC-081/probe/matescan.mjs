const [W, M] = process.argv.slice(2);
const good = await import(W + "/src/search.ts"), bad = await import(M + "/src/search.ts");
const ge = await import(W + "/src/engine.ts"), be = await import(M + "/src/engine.ts");
const { parseFen } = await import(W + "/src/fen.ts");
const FENS = {
  "kq-corner": "k7/8/1K6/8/8/8/8/1Q6 w - - 0 1",
  "kr-corner": "k7/8/1K6/8/8/8/8/1R6 w - - 0 1",
  "kqk-h8": "7k/8/6K1/8/8/8/8/6Q1 w - - 0 1",
  "krk-a-file": "8/8/8/8/8/k7/8/KR6 w - - 0 1",
  "kq-mid": "8/8/8/3k4/8/8/8/K5Q1 w - - 0 1",
  "kr-mid": "8/8/8/4k3/8/8/8/R3K3 w - - 0 1",
  "backrank-m2": "6k1/5ppp/8/8/8/8/5PPP/3RR1K1 w - - 0 1",
  "kqk-b": "8/8/8/8/8/2k5/8/K6Q b - - 0 1",
};
for (const [n, f] of Object.entries(FENS)) {
  for (const d of [3, 4, 5, 6]) {
    const a = good.search(parseFen(f), d), o = good.searchWithoutTable(parseFen(f), d), b = bad.search(parseFen(f), d);
    if (a.score !== o.score || b.score !== o.score) console.log("fixed", n, d, "good", a.score, "off", o.score, "nomate", b.score);
  }
  for (const budget of [3, 5, 10, 20, 40]) {
    let t = 0, u = 0;
    const a = ge.chooseMove(parseFen(f), { budgetMs: budget, now: () => t++ });
    const b = be.chooseMove(parseFen(f), { budgetMs: budget, now: () => u++ });
    const ref = good.searchWithoutTable(parseFen(f), a.depth);
    if (a.score !== ref.score || b.score !== a.score || a.depth !== b.depth) console.log("engine", n, budget, "good", a.depth, a.score, "ref", ref.score, "nomate", b.depth, b.score);
  }
}
console.log("done");
