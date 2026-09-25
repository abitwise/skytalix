const W = process.argv[2];
const { chooseMove } = await import(W + "/src/engine.ts");
const { search } = await import(W + "/src/search.ts");
const { parseFen } = await import(W + "/src/fen.ts");
const { squareName } = await import(W + "/src/position.ts");
const lab = (m) => squareName(m.from) + squareName(m.to);
const F = "rnbqkbnr/ppp1pppp/8/3p4/6P1/8/PPPPPP1P/RNBQKBNR w KQkq d6 0 2";
for (const d of [1, 2, 3]) { const r = search(parseFen(F), d); console.log("search", d, lab(r.move), r.score, r.nodes); }
for (let b = 1; b <= 12; b++) { let t = 0; const c = chooseMove(parseFen(F), { budgetMs: b, now: () => t++ }); console.log("budget", b, "depth", c.depth, lab(c.move), c.score, "nodes", c.nodes); }
