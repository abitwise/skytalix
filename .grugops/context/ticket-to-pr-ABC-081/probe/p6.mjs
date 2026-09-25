const A = process.argv[2];
const { chooseMove } = await import(A + "/src/engine.ts");
const { parseFen } = await import(A + "/src/fen.ts");
const f = "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10";
for (const b of [2000, 2500, 3000, 4000, 5000]) { const t = performance.now(); const c = chooseMove(parseFen(f), { budgetMs: b }); console.log(b, "depth", c.depth, "nodes", c.nodes, "ms", Math.round(performance.now() - t)); }
