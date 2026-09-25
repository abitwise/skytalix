// Recompute src/search.ordering.test.ts's A2 corpus size (same construction), outside vitest.
const W = process.argv[2];
const { parseFen, toFen } = await import(W + "/src/fen.ts");
const { legalMoves } = await import(W + "/src/legal.ts");
const { makeMove, unmakeMove } = await import(W + "/src/apply.ts");
const { gameStatus } = await import(W + "/src/gameend.ts");
const { EMPTY, squareName } = await import(W + "/src/position.ts");
const label = (m) => `${squareName(m.from)}${squareName(m.to)}${m.promotion === EMPTY ? "" : m.promotion}`;
const FENS = {
  startpos: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  kiwipete: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "position-3": "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1",
  "position-4": "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1",
  "position-5": "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8",
  "position-6": "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
};
function expandFrom(name, root, plies) {
  const out = [];
  const walk = (pn, p, left) => {
    if (left === 0) return;
    for (const m of legalMoves(p)) {
      const u = makeMove(p, m);
      const cn = `${pn}/${label(m)}`;
      out.push({ name: cn, fen: toFen(p) });
      walk(cn, p, left - 1);
      unmakeMove(p, m, u);
    }
  };
  walk(name, root, plies);
  return out;
}
const corpus = [
  ...Object.entries(FENS).flatMap(([name, fen]) => [{ name, fen }, ...expandFrom(name, parseFen(fen), 1)]),
  ...expandFrom("position-3", parseFen(FENS["position-3"]), 2).filter(({ name }) => name.includes("/", name.indexOf("/") + 1)),
].filter(({ fen }) => gameStatus(parseFen(fen)).result === "in-progress");
console.log("A2 corpus size", corpus.length);
