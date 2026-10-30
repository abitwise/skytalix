// qe-ABC-240 INFO: the unpruned doors on the midgame roots, deeper than A1's depth 2, as far as they are affordable.
// searchWithoutPruningOrQuiescence at depth 4 on the six perft roots; searchWithoutPruning at depth 3 on startpos and
// position-6 (kiwipete's depth 3 alone costs about 60 s). usage: node midsample.mjs <treeDir> > out.jsonl
const tree = process.argv[2];
const { parseFen, toFen } = await import(`${tree}/src/fen.ts`);
const search = await import(`${tree}/src/search.ts`);
const PERFT = [
  ["startpos", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"],
  ["kiwipete", "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1"],
  ["position-3", "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1"],
  ["position-4", "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1"],
  ["position-5", "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8"],
  ["position-6", "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10"],
];
const lbl = (m) => (m ? `${m.from}-${m.to}-${m.promotion}-${m.flags}` : "null");
const jobs = [
  ...PERFT.map(([n, f]) => [n, f, "searchWithoutPruningOrQuiescence", 4]),
  ...PERFT.filter(([n]) => n === "startpos" || n === "position-6").map(([n, f]) => [n, f, "searchWithoutPruning", 3]),
];
for (const [name, fen, fn, depth] of jobs) {
  const p = parseFen(fen);
  const r = search[fn](p, depth);
  console.log(JSON.stringify({ name, fn, depth, move: lbl(r.move), score: r.score, nodes: r.nodes, pure: toFen(p) === fen }));
}
