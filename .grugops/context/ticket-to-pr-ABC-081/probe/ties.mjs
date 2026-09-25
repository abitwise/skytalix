// How often the ABC-078 A3 identity sweep sees a DIFFERENT root move of EQUAL score (the amendment's case).
const A = process.argv[2];
const { chooseMove } = await import(A + "/src/engine.ts");
const { search, MATE_SCORE } = await import(A + "/src/search.ts");
const { parseFen, toFen } = await import(A + "/src/fen.ts");
const { legalMoves } = await import(A + "/src/legal.ts");
const { makeMove, unmakeMove } = await import(A + "/src/apply.ts");
const { gameStatus } = await import(A + "/src/gameend.ts");
const { squareName } = await import(A + "/src/position.ts");
const lab = (m) => squareName(m.from) + squareName(m.to);
const END = ["k7/8/1K6/8/8/8/8/1Q6 w - - 0 1", "k7/8/1K6/8/8/8/8/1R6 w - - 0 1", "7k/8/6K1/8/8/8/8/6Q1 w - - 0 1", "8/8/8/4k3/8/8/4P3/4K3 w - - 0 1", "8/8/8/8/8/k7/8/KR6 w - - 0 1", "8/6p1/8/8/8/8/1P6/k1K5 w - - 0 1"];
const PERFT = ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1", "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1", "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1", "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8", "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10"];
const withChildren = (fens) => fens.flatMap((f) => { const p = parseFen(f); const out = [f]; for (const m of legalMoves(p)) { const u = makeMove(p, m); if (gameStatus(p).result === "in-progress") out.push(toFen(p)); unmakeMove(p, m, u); } return out; });
function rootMoveScore(fen, move, depth) { const p = parseFen(fen); makeMove(p, legalMoves(p).find((c) => c.from === move.from && c.to === move.to && c.promotion === move.promotion)); const s = 0 - search(p, depth - 1).score; return s > MATE_SCORE - 1000 ? s - 1 : s < -(MATE_SCORE - 1000) ? s + 1 : s; }
for (const [label, corpus, budgets] of [["endgames+children", withChildren(END), [3, 5]], ["perft roots+children", withChildren(PERFT), [5]]]) {
  let pairs = 0, ties = 0, bad = 0; const samples = [];
  for (const f of corpus) for (const b of budgets) {
    let t = 0; const c = chooseMove(parseFen(f), { budgetMs: b, now: () => t++ }); const r = search(parseFen(f), c.depth); pairs++;
    if (c.score !== r.score) bad++;
    if (lab(c.move) !== lab(r.move)) { if (rootMoveScore(f, c.move, c.depth) === r.score) { ties++; if (samples.length < 3) samples.push(`${f} d${c.depth} ${lab(c.move)} vs ${lab(r.move)} @ ${r.score}`); } else bad++; }
  }
  console.log(label, "positions", corpus.length, "pairs", pairs, "equal-score move differences accepted", ties, "divergences", bad); for (const s of samples) console.log("   ", s);
}
