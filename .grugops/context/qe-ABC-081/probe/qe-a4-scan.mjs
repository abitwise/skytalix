// QE ABC-081 A4 gap-hunt: look for a search-level MATE-IN-2 entry reuse (not mate-in-1) that
// flips a root score/depth between "good" (±ply adjustment) and "T1 mutant" (raw mate score,
// no adjustment). Compares engine.chooseMove across a wide endgame corpus and budgets.
const [GOOD, BAD] = process.argv.slice(2);
const ge = await import(GOOD + "/src/engine.ts");
const be = await import(BAD + "/src/engine.ts");
const { parseFen } = await import(GOOD + "/src/fen.ts");
const { legalMoves } = await import(GOOD + "/src/legal.ts");
const { makeMove, unmakeMove } = await import(GOOD + "/src/apply.ts");

const MATE_SCORE = 30_000;

// Root corpus: mating endgames of several shapes, and one classic mate-in-2 puzzle.
const roots = [
  "k7/8/8/K7/8/8/8/1R6 b - - 1 1", // the build's own kr-mid case (mate-in-1 reuse found here)
  "k7/8/1K6/8/8/8/8/1Q6 w - - 0 1",
  "k7/8/1K6/8/8/8/8/1R6 w - - 0 1",
  "7k/8/6K1/8/8/8/8/6Q1 w - - 0 1",
  "8/8/8/8/8/k7/8/KR6 w - - 0 1",
  "8/8/8/3k4/8/8/8/K5Q1 w - - 0 1",
  "8/8/8/4k3/8/8/8/R3K3 w - - 0 1",
  "6k1/5ppp/8/8/8/8/5PPP/3RR1K1 w - - 0 1",
  "8/8/8/8/2k5/8/1K6/7R w - - 0 1",
  "7k/5K2/8/8/8/8/8/6R1 w - - 0 1",
  "k7/2K5/8/8/8/8/8/7Q w - - 0 1",
  "8/8/8/8/4k3/8/8/4K2Q w - - 0 1",
  "6k1/6pp/8/8/8/8/8/R5K1 w - - 0 1", // classic mate-in-2 rook ladder shape
  "1k6/1p6/8/8/8/8/8/R5K1 w - - 0 1",
  "5rk1/5ppp/8/8/8/8/8/4R1K1 w - - 0 1", // back-rank mate-in-2
];

// Expand with every legal child of every root, one ply deeper.
const all = [];
for (const f of roots) {
  let p;
  try { p = parseFen(f); } catch { continue; }
  all.push(f);
  for (const m of legalMoves(p)) {
    const u = makeMove(p, m);
    // re-derive FEN via search import's own toFen if available
    all.push(f + "|child-skip"); // placeholder, we scan roots directly below (children too slow to re-FEN here)
    unmakeMove(p, m, u);
  }
}

const budgets = [3, 5, 8, 10, 15, 20, 30, 40, 60, 80, 100, 120, 160, 200, 250];
let diffs = 0, scanned = 0;
for (const f of roots) {
  for (const budget of budgets) {
    let pos;
    try { pos = parseFen(f); } catch { continue; }
    let t = 0, u = 0;
    const g = ge.chooseMove(pos, { budgetMs: budget, now: () => t++ });
    const b = be.chooseMove(parseFen(f), { budgetMs: budget, now: () => u++ });
    scanned++;
    if (!g || !b) continue;
    if (g.score !== b.score || g.depth !== b.depth) {
      diffs++;
      const dist = (s) => (Math.abs(s) >= 20000 ? MATE_SCORE - Math.abs(s) : null);
      console.log(
        "DIFF", f, "budget", budget,
        "good depth/score", g.depth, g.score, "mateDist", dist(g.score),
        "bad(T1) depth/score", b.depth, b.score, "mateDist", dist(b.score),
      );
    }
  }
}
console.log("scanned", scanned, "roots x budgets; diffs", diffs);
