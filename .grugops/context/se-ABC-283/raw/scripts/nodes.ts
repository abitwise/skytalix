// usage: node nodes.ts <repo root> <searchExport> <chooseExport> <depths csv> [positions csv]
// Prints one JSON line per (position, depth): search() and chooseMove(maxDepth) node counts, score, move.
const [root, searchName, chooseName, depthsCsv, posCsv] = process.argv.slice(2);
const search = (await import(`${root}/src/search.ts`))[searchName as string];
const choose = (await import(`${root}/src/engine.ts`))[chooseName as string];
const { parseFen } = await import(`${root}/src/fen.ts`);
const { squareName } = await import(`${root}/src/position.ts`);
const ROOTS: Record<string, string> = {
  startpos: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  kiwipete: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "position-3": "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1",
  "position-4": "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1",
  "position-5": "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8",
  "position-6": "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
};
const mv = (m: { from: number; to: number } | null) => (m ? squareName(m.from) + squareName(m.to) : "-");
for (const name of (posCsv ?? "kiwipete,position-6").split(",")) {
  for (const d of (depthsCsv as string).split(",").map(Number)) {
    const s = search(parseFen(ROOTS[name] as string), d);
    const c = choose(parseFen(ROOTS[name] as string), { budgetMs: 1e9, now: () => 0, maxDepth: d });
    console.log(JSON.stringify({ name, d, search: { nodes: s.nodes, score: s.score, move: mv(s.move) }, choose: { nodes: c.nodes, score: c.score, move: mv(c.move), depth: c.depth } }));
  }
}
