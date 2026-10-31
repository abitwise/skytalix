// For candidate shuttle fixtures: legalMoves order at the root and the index of the third-occurrence move.
const [tree] = process.argv.slice(2);
const { newGame, playMove, keyHistory } = await import(`${tree}/src/history.ts`);
const { legalMoves } = await import(`${tree}/src/legal.ts`);
const { squareName } = await import(`${tree}/src/position.ts`);
const { toFen } = await import(`${tree}/src/fen.ts`);
const uci = (m) => squareName(m.from) + squareName(m.to);
const cands = [
  ["4k3/8/8/8/8/8/8/1Q2K3 w - - 0 1", "b1b2 e8d8 b2b1 d8e8 b1b2 e8d8 b2b1", "d8e8"],
  ["4k3/8/8/8/8/8/8/Q3K3 w - - 0 1", "a1a2 e8d8 a2a1 d8e8 a1a2 e8d8 a2a1", "d8e8"],
  ["q3k3/8/8/8/8/8/8/4K3 b - - 0 1", "a8a7 e1d1 a7a8 d1e1 a8a7 e1d1 a7a8", "d1e1"],
  ["4k3/8/8/8/8/8/8/Q3K3 w - - 0 1", "a1a2 e8d8 a2a1 d8e8 a1a2 e8d8 a2a1 d8e8 a1a2 e8d8", "a2a1"],
  ["q3k3/8/8/8/8/8/8/4K3 b - - 0 1", "a8a7 e1d1 a7a8 d1e1 a8a7 e1d1 a7a8 d1e1 a8a7 e1d1", "a7a8"],
  ["4k3/8/8/8/8/8/8/Q3K3 w - - 0 1", "a1a2 e8f8 a2a1 f8e8 a1a2 e8f8 a2a1", "f8e8"],
  ["4k3/8/8/8/8/8/8/Q3K3 w - - 0 1", "a1a2 e8f7 a2a1 f7e8 a1a2 e8f7 a2a1", "f7e8"],
  ["4k3/8/8/8/8/8/8/Q3K3 w - - 0 1", "a1a2 e8e7 a2a1 e7e8 a1a2 e8e7 a2a1", "e7e8"],
  ["8/8/8/8/8/8/8/k1K4R w - - 0 1", "h1h2 a1a2 h2h1 a2a1 h1h2 a1a2 h2h1", "a2a1"],
  ["7k/8/8/8/8/8/8/Q3K3 w - - 0 1", "a1a2 h8g8 a2a1 g8h8 a1a2 h8g8 a2a1", "g8h8"],
  ["k7/8/8/8/8/8/8/4K2Q w - - 0 1", "h1h2 a8b8 h2h1 b8a8 h1h2 a8b8 h2h1", "b8a8"],
  ["k7/8/8/8/8/8/8/4K2Q w - - 0 1", "h1h2 a8b7 h2h1 b7a8 h1h2 a8b7 h2h1", "b7a8"],
  ["4k3/8/8/8/8/8/8/Q3K3 w - - 0 1", "a1a2 e8d7 a2a1 d7e8 a1a2 e8d7 a2a1", "d7e8"],
  ["4k3/8/8/8/8/8/8/Q3K3 w - - 0 1", "e1d1 e8d8 d1e1 d8e8 e1d1 e8d8 d1e1 d8e8 e1d1 e8d8", "d1e1"],
  ["4k3/8/8/8/8/8/8/Q3K3 w - - 0 1", "e1f1 e8d8 f1e1 d8e8 e1f1 e8d8 f1e1 d8e8 e1f1 e8d8", "f1e1"],
  ["4k3/8/8/8/8/8/8/Q3K3 w - - 0 1", "e1e2 e8d8 e2e1 d8e8 e1e2 e8d8 e2e1 d8e8 e1e2 e8d8", "e2e1"],
  ["4k3/8/8/8/8/8/8/Q3K3 w - - 0 1", "e1d2 e8d8 d2e1 d8e8 e1d2 e8d8 d2e1 d8e8 e1d2 e8d8", "d2e1"],
];
for (const [fen, moves, rep] of cands) {
  const h = newGame(fen);
  for (const t of moves.split(" ")) {
    const m = legalMoves(h.position).find((x) => uci(x) === t);
    if (!m) { console.log("ILLEGAL", t, fen, moves); break; }
    playMove(h, m);
  }
  const order = legalMoves(h.position).map(uci);
  console.log(`${toFen(h.position)} | n=${order.length} idx(${rep})=${order.indexOf(rep)} last=${order.at(-1)} | ${order.join(" ")}`);
}
