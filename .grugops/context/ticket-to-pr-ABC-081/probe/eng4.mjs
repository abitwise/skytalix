const sp = process.argv[2], W = process.argv[3];
const PERP4 = "7k/5Q2/6pp/qr6/8/8/6PP/7K w - - 0 1", PERP5 = "7k/8/6pp/qr6/8/Q7/6PP/7K w - - 0 1";
for (const [k, t] of Object.entries({ good: W, E3: sp + "/mE3", R3: sp + "/mR3" })) {
  const { chooseMove } = await import(t + "/src/engine.ts"); const { parseFen } = await import(t + "/src/fen.ts"); const { squareName } = await import(t + "/src/position.ts");
  const out = [];
  for (const [n, f] of [["perp4", PERP4], ["perp5", PERP5]]) for (const b of [3, 4, 5, 6, 8, 10]) { let x = 0; const t0 = performance.now(); const c = chooseMove(parseFen(f), { budgetMs: b, now: () => x++ }); out.push(`${n}@${b}:d${c.depth},${c.score},${squareName(c.move.from)}${squareName(c.move.to)},${c.nodes}`); }
  console.log(k, out.join(" "));
}
