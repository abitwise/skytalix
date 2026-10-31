// Base vs head blunder lists on the A1 fixtures at level 1's 100 ms, rate 1, seed 1, for each step.
// usage: node values.mjs <tree> [steps=1,10,100,1000]
const [tree, stepsArg = "1,10,100,1000"] = process.argv.slice(2);
const { newGame, playMove, keyHistory, repetitionKeyHistory } = await import(`${tree}/src/history.ts`);
const { legalMoves } = await import(`${tree}/src/legal.ts`);
const { trimPriorKeys } = await import(`${tree}/src/engine.ts`);
const { createLevel } = await import(`${tree}/src/levels.ts`);
const { squareName } = await import(`${tree}/src/position.ts`);
const { virtualClock } = await import(`${tree}/src/virtual-clock.ts`);
const uci = (m) => squareName(m.from) + squareName(m.to);
const FIX = {
  P: ["4k3/8/8/8/8/8/8/1Q2K3 w - - 0 1", "b1b2 e8d8 b2b1 d8e8 b1b2 e8d8 b2b1"],
  A2: ["4k3/8/8/8/8/8/8/1Q2K3 w - - 0 1", "b1b2 e8d8 b2b1"],
  F1: ["8/3k4/8/8/8/8/8/Q3K3 w - - 0 1", "a1a2 d7e8 a2a1 e8d7 a1a2 d7e8 a2a1"],
  F2: ["q3k3/8/8/8/8/8/8/4K3 b - - 0 1", "a8a7 e1d1 a7a8 d1e1 a8a7 e1d1 a7a8"],
  W1: ["8/8/8/4k3/8/7p/7P/6KR b - - 0 1", "e5d5 g1f1 d5e5 f1g1 e5f5 g1f1 f5e5"],
  B1: ["6kr/7p/7P/8/4K3/8/8/8 w - - 0 1", "e4d4 g8f8 d4e4 f8g8 e4f4 g8f8 f4e4"],
  A3: ["3k4/8/8/8/8/8/8/1Q2K3 b - - 0 4", ""],
};
for (const step of stepsArg.split(",").map(Number)) {
  for (const [name, [fen, moves]] of Object.entries(FIX)) {
    const h = newGame(fen);
    for (const t of moves.split(" ").filter(Boolean)) playMove(h, legalMoves(h.position).find((x) => uci(x) === t));
    let prior = trimPriorKeys(repetitionKeyHistory(h), h.position.halfmoveClock);
    if (name === "A3") { const g = newGame(FIX.P[0]); for (const t of FIX.P[1].split(" ")) playMove(g, legalMoves(g.position).find((x) => uci(x) === t)); prior = repetitionKeyHistory(g).slice(0, -1); }
    const r = createLevel({ budgetMs: 100, blunderRate: 1 }, { seed: 1, now: virtualClock(step) })(h.position, prior);
    const s = r.scored.map((x) => `${uci(x.move)}:${x.score}`).join(" ");
    const nk = createLevel({ budgetMs: 100, blunderRate: 1 }, { seed: 1, now: virtualClock(step) })(h.position);
    const s0 = nk.scored.map((x) => `${uci(x.move)}:${x.score}`).join(" ");
    console.log(`step ${step} ${name} | ${uci(r.move)} ${r.kind} d${r.depth} n${r.nodes} t${r.elapsedMs} | ${s}\n             nokeys | ${uci(nk.move)} ${nk.kind} d${nk.depth} n${nk.nodes} | ${s0}`);
  }
}
