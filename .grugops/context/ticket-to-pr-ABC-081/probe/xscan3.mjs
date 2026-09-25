const [X, M] = process.argv.slice(2);
const gx = await import(X + "/src/engine.ts"), bm = await import(M + "/src/engine.ts");
const { XS } = await import(X + "/src/transposition.ts");
const { parseFen, toFen } = await import(X + "/src/fen.ts");
const { legalMoves } = await import(X + "/src/legal.ts");
const { makeMove, unmakeMove } = await import(X + "/src/apply.ts");
const roots = ["k7/8/1K6/8/8/8/8/1Q6 w - - 0 1", "k7/8/1K6/8/8/8/8/1R6 w - - 0 1", "7k/8/6K1/8/8/8/8/6Q1 w - - 0 1",
  "8/8/8/8/8/k7/8/KR6 w - - 0 1", "8/8/8/3k4/8/8/8/K5Q1 w - - 0 1", "8/8/8/4k3/8/8/8/R3K3 w - - 0 1",
  "8/8/8/8/2k5/8/1K6/7R w - - 0 1", "7k/5K2/8/8/8/8/8/6R1 w - - 0 1", "8/8/8/8/4k3/8/8/4K2Q w - - 0 1"];
const all = [];
for (const f of roots) { const p = parseFen(f); all.push(f); for (const m of legalMoves(p)) { const u = makeMove(p, m); all.push(toFen(p)); unmakeMove(p, m, u); } }
for (const f of all) for (const b of [20, 40, 80, 160]) {
  let pos; try { pos = parseFen(f); } catch { continue; }
  XS.crossMate = 0; XS.samples.length = 0; let t = 0, u = 0;
  const g = gx.chooseMove(pos, { budgetMs: b, now: () => t++ });
  const m = bm.chooseMove(parseFen(f), { budgetMs: b, now: () => u++ });
  if (g === null) continue;
  const m2 = XS.samples.filter((s) => / raw -?29997 /.test(s)).length;
  if (g.score !== m.score || g.depth !== m.depth || (g.move.from !== m.move.from || g.move.to !== m.move.to)) console.log("DIFF", f, b, "good", g.depth, g.score, "nomate", m.depth, m.score, "crossMate", XS.crossMate, "mateIn2Reuse", m2);
}
console.log("scanned", all.length);
