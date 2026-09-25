const V = process.argv[2];
const { chooseMove } = await import(V + "/src/engine.ts");
const { search } = await import(V + "/src/search.ts");
const { XS } = await import(V + "/src/transposition.ts");
const { parseFen } = await import(V + "/src/fen.ts");
const FENS = {
  "kq-corner": "k7/8/1K6/8/8/8/8/1Q6 w - - 0 1", "kr-corner": "k7/8/1K6/8/8/8/8/1R6 w - - 0 1",
  "kqk-h8": "7k/8/6K1/8/8/8/8/6Q1 w - - 0 1", "krk-a-file": "8/8/8/8/8/k7/8/KR6 w - - 0 1",
  "kq-mid": "8/8/8/3k4/8/8/8/K5Q1 w - - 0 1", "kr-mid": "8/8/8/4k3/8/8/8/R3K3 w - - 0 1",
  "backrank-m2": "6k1/5ppp/8/8/8/8/5PPP/3RR1K1 w - - 0 1",
};
for (const [n, f] of Object.entries(FENS)) {
  for (const budget of [5, 20, 80]) {
    XS.cross = 0; XS.crossMate = 0; XS.samples.length = 0; let t = 0;
    const c = chooseMove(parseFen(f), { budgetMs: budget, now: () => t++ });
    console.log("engine", n, budget, "depth", c.depth, "score", c.score, "cross", XS.cross, "crossMate", XS.crossMate, XS.samples[0] ?? "");
  }
  for (const d of [4, 5, 6]) {
    XS.cross = 0; XS.crossMate = 0; XS.samples.length = 0;
    const r = search(parseFen(f), d);
    console.log("search", n, d, "score", r.score, "cross", XS.cross, "crossMate", XS.crossMate, XS.samples[0] ?? "");
  }
}
