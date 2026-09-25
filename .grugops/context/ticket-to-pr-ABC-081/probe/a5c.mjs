const [W, M] = process.argv.slice(2);
const g = await import(W + "/src/search.ts"), b = await import(M + "/src/search.ts");
const ge = await import(W + "/src/engine.ts"), be = await import(M + "/src/engine.ts");
const { parseFen } = await import(W + "/src/fen.ts");
const { squareName } = await import(W + "/src/position.ts");
const lab = (m) => squareName(m.from) + squareName(m.to);
for (const f of ["7k/8/6pp/qr6/8/Q7/6PP/7K w - - 0 1", "7k/6pp/q7/8/QR6/6PP/8/7K b - - 0 1"]) {
  for (const d of [4, 5, 6]) {
    const on = g.search(parseFen(f), d), off = g.searchWithoutTable(parseFen(f), d), mut = b.search(parseFen(f), d);
    console.log(f, "d", d, "on", on.score, lab(on.move), on.nodes, "off", off.score, lab(off.move), off.nodes, "| norep", mut.score, lab(mut.move));
  }
  for (const budget of [5, 10, 20]) { let t = 0, u = 0; const c = ge.chooseMove(parseFen(f), { budgetMs: budget, now: () => t++ }); const m = be.chooseMove(parseFen(f), { budgetMs: budget, now: () => u++ }); console.log("  engine", budget, c.depth, c.score, lab(c.move), c.nodes, "| norep", m.depth, m.score, lab(m.move)); }
}
