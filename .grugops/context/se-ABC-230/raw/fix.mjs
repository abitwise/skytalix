// Probe the ABC-230 fixture games on the head tree: base (no keys) vs prior keys.
const tree = process.argv[2];
const { parseFen, toFen } = await import(`${tree}/src/fen.ts`);
const { chooseMove, trimPriorKeys } = await import(`${tree}/src/engine.ts`);
const { newGame, playMove, keyHistory } = await import(`${tree}/src/history.ts`);
const { parseCoordinateMove } = await import(`${tree}/src/coordinate-move.ts`);
const { squareName } = await import(`${tree}/src/position.ts`);
const { virtualClock } = await import(`${tree}/src/virtual-clock.ts`);
const uci = (m) => squareName(m.from) + squareName(m.to);
const game = (fen, moves) => {
  const h = newGame(fen);
  for (const t of moves) {
    const r = parseCoordinateMove(h.position, t);
    if (r.outcome !== "move") throw new Error(t);
    playMove(h, r.move);
  }
  return h;
};
const FIX = [
  ["kqk black", "4k3/8/8/8/8/8/8/Q3K3 w - - 0 1", "a1a2 e8d8 a2a1 d8e8 a1a2 e8d8 a2a1"],
  ["kqk white", "q3k3/8/8/8/8/8/8/4K3 b - - 0 1", "a8a7 e1d1 a7a8 d1e1 a8a7 e1d1 a7a8"],
  ["krk black", "4k3/8/8/8/8/8/8/R3K3 w - - 0 1", "a1a2 e8d8 a2a1 d8e8 a1a2 e8d8 a2a1"],
  ["krk white", "r3k3/8/8/8/8/8/8/4K3 b - - 0 1", "a8a7 e1d1 a7a8 d1e1 a8a7 e1d1 a7a8"],
  ["kqk black h1q", "4k3/8/8/8/8/8/8/4K2Q w - - 0 1", "h1h2 e8d8 h2h1 d8e8 h1h2 e8d8 h2h1"],
  ["kqk white h8q", "4k2q/8/8/8/8/8/8/4K3 b - - 0 1", "h8h7 e1d1 h7h8 d1e1 h8h7 e1d1 h7h8"],
  ["H2 kqk black 2nd", "4k3/8/8/8/8/8/8/Q3K3 w - - 0 1", "a1a2 e8d8 a2a1"],
  ["H2 kqk white 2nd", "q3k3/8/8/8/8/8/8/4K3 b - - 0 1", "a8a7 e1d1 a7a8"],
];
for (const d of [3, 4, 5]) {
  for (const [name, fen, moves] of FIX) {
    const h = game(fen, moves.split(" "));
    const root = toFen(h.position);
    const prior = trimPriorKeys(keyHistory(h), h.position.halfmoveClock);
    const o = { budgetMs: 32000, maxDepth: d };
    const b = chooseMove(parseFen(root), { ...o, now: virtualClock(1) });
    const k = chooseMove(parseFen(root), { ...o, now: virtualClock(1), priorKeys: prior });
    console.log(`d${d} ${name} | ${root} | prior ${prior.length} | base ${uci(b.move)} ${b.score} n${b.nodes} | keys ${uci(k.move)} ${k.score} n${k.nodes}`);
  }
}
