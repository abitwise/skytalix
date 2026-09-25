const V = process.argv[2];
const { chooseMove } = await import(V + "/src/engine.ts");
const { XS } = await import(V + "/src/transposition.ts");
const { parseFen, toFen } = await import(V + "/src/fen.ts");
const { legalMoves } = await import(V + "/src/legal.ts");
const { makeMove, unmakeMove } = await import(V + "/src/apply.ts");
const roots = [
  "k7/8/1K6/8/8/8/8/1Q6 w - - 0 1", "k7/8/1K6/8/8/8/8/1R6 w - - 0 1", "7k/8/6K1/8/8/8/8/6Q1 w - - 0 1",
  "8/8/8/8/8/k7/8/KR6 w - - 0 1", "8/8/8/3k4/8/8/8/K5Q1 w - - 0 1", "8/8/8/4k3/8/8/8/R3K3 w - - 0 1",
  "6k1/5ppp/8/8/8/8/5PPP/3RR1K1 w - - 0 1", "8/8/8/8/4k3/8/8/4K2Q w - - 0 1", "8/8/8/8/2k5/8/1K6/7R w - - 0 1",
  "8/8/8/8/8/5k2/8/5K1Q b - - 0 1", "7k/5K2/8/8/8/8/8/6R1 w - - 0 1", "k7/2K5/8/8/8/8/8/7Q w - - 0 1",
];
const all = [];
for (const f of roots) { let p; try { p = parseFen(f); } catch (e) { console.log("bad fen", f); continue; } all.push(f); for (const m of legalMoves(p)) { const u = makeMove(p, m); all.push(toFen(p)); unmakeMove(p, m, u); } }
const hits = [];
for (const f of all) for (const budget of [5, 10, 20, 40, 80, 160]) {
  let pos; try { pos = parseFen(f); } catch (e) { console.log('bad child', f); continue; }
  XS.cross = 0; XS.crossMate = 0; XS.samples.length = 0; let t = 0;
  const c = chooseMove(pos, { budgetMs: budget, now: () => t++ });
  if (c && XS.crossMate > 0) hits.push({ f, budget, depth: c.depth, score: c.score, crossMate: XS.crossMate, s: XS.samples[0] });
}
console.log(all.length, "positions;", hits.length, "with a cross-ply mate cutoff");
for (const h of hits.slice(0, 15)) console.log(JSON.stringify(h));
