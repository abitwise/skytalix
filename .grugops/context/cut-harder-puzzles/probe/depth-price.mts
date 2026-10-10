// BA/PM pricing probe (cut-harder-puzzles): depth reached, nodes and plain-node wall per move
// for the shipped engine in ADR-0027 deterministic mode, on positions heavier than ABC-084's rows.
const W = process.argv[2];
const { chooseMove } = await import(`${W}/src/engine.ts`);
const { virtualClock } = await import(`${W}/src/virtual-clock.ts`);
const { parseFen } = await import(`${W}/src/fen.ts`);
const P: [string, string][] = [
  ["start", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"],
  ["kiwipete", "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1"],
  ["perft-pos3", "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1"],
  ["perft-pos4", "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1"],
  ["perft-pos5", "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8"],
];
for (const step of [1, 0.25, 0.125]) {
  let total = 0;
  for (const [name, fen] of P) {
    const t = performance.now();
    const c = chooseMove(parseFen(fen), { budgetMs: 25, now: virtualClock(step) });
    const ms = performance.now() - t;
    total += ms;
    console.log(`readings ${25 / step}\t${name}\td${c?.depth}\tn${c?.nodes}\t${ms.toFixed(0)} ms`);
  }
  console.log(`readings ${25 / step}: ${P.length} moves, ${total.toFixed(0)} ms plain node`);
}
