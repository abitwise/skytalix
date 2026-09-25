const W = process.argv[2];
const { parseFen, toFen } = await import(W + "/src/fen.ts");
const S = await import(W + "/src/search.ts");
const { legalMoves } = await import(W + "/src/legal.ts");
const { makeMove, unmakeMove } = await import(W + "/src/apply.ts");
const { gameStatus } = await import(W + "/src/gameend.ts");
const { squareName } = await import(W + "/src/position.ts");
const L = (m) => squareName(m.from) + squareName(m.to);
const roots = {
  startpos: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  kiwipete: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "position-3": "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1",
  "position-4": "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1",
  "position-5": "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8",
  "position-6": "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
};
const found = [];
for (const [name, fen] of Object.entries(roots)) {
  const cands = [[name, fen]];
  const p = parseFen(fen);
  for (const m of legalMoves(p)) { const u = makeMove(p, m); if (gameStatus(p).result === "in-progress") cands.push([name + "/" + L(m), toFen(p)]); unmakeMove(p, m, u); }
  for (const [n, f] of cands) for (const d of [1, 2]) {
    const a = S.search(parseFen(f), d), b = S.searchWithoutOrdering(parseFen(f), d);
    if (L(a.move) !== L(b.move)) found.push({ n, d, ordered: L(a.move), unordered: L(b.move), score: a.score, nodes: a.nodes, fen: f });
  }
}
console.log(found.length); for (const x of found.slice(0, 12)) console.log(JSON.stringify(x));
