// ABC-080 A3/A4 reading: node counts and scores per configuration at fixed depth.
const W = process.argv[2];
const depths = (process.argv[3] ?? "4,5").split(",").map(Number);
const names = (process.argv[4] ?? "kiwipete,position-6").split(",");
const { parseFen } = await import(W + "/src/fen.ts");
const S = await import(W + "/src/search.ts");
const FENS = {
  startpos: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  kiwipete: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "position-3": "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1",
  "position-4": "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1",
  "position-5": "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8",
  "position-6": "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
};
const cfgs = { none: S.searchWithoutOrdering, "mvv-lva": S.searchWithoutKillers, "+killers": S.search };
for (const name of names) for (const d of depths) {
  const row = { name, d };
  for (const [k, f] of Object.entries(cfgs)) {
    if (k === "none" && d >= 5 && process.env.SKIP_NONE5) { row[k] = "skipped"; continue; }
    const t = process.hrtime.bigint();
    const r = f(parseFen(FENS[name]), d);
    row[k] = { nodes: r.nodes, score: r.score, ms: Math.round(Number(process.hrtime.bigint() - t) / 1e6) };
  }
  console.log(JSON.stringify(row));
}
