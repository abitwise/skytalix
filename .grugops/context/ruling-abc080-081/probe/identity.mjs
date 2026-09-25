// Does ID+TT (+ordering) report, at each completed iteration d, the same SCORE and MOVE as search(pos, d)?
const { run, search, parseFen } = await import("./probe.mjs");
const corpus = {
  startpos: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  kiwipete: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "position-3": "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1",
  "position-4": "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1",
  "position-5": "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8",
  "position-6": "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
  "kq-corner": "k7/8/1K6/8/8/8/8/1Q6 w - - 0 1", "kr-corner": "k7/8/1K6/8/8/8/8/1R6 w - - 0 1",
  "kqk-h8": "7k/8/6K1/8/8/8/8/6Q1 w - - 0 1", "kp-vs-k": "8/8/8/4k3/8/8/4P3/4K3 w - - 0 1",
  "krk-a-file": "8/8/8/8/8/k7/8/KR6 w - - 0 1", "pawn-race": "8/6p1/8/8/8/8/1P6/k1K5 w - - 0 1",
};
const lbl = (m) => m ? `${m.from}-${m.to}${m.promotion || ""}` : "null";
const cfgs = { "080": { order: 2 }, "080+081": { order: 3, ttCut: true }, "081-alone": { order: 0, ttCut: true } };
const D = Number(process.argv[2] ?? 3);
let tot = {};
for (const [cn, cfg] of Object.entries(cfgs)) {
  let sc = 0, mv = 0, n = 0;
  for (const [name, fen] of Object.entries(corpus)) {
    // ID up to D, capturing the result of each iteration by re-running (probe keeps TT across iterations within run)
    for (let d = 1; d <= D; d++) {
      const r = run(fen, cfg, d, "id"); const ref = search(parseFen(fen), d); n++;
      if (r.score !== ref.score) { sc++; console.log(cn, name, "d" + d, "score", r.score, "vs", ref.score); }
      if (lbl(r.move) !== lbl(ref.move)) mv++;
    }
  }
  console.log(`${cn}: ${n} (position,depth) pairs to d${D}: score mismatches ${sc}, move mismatches ${mv}`);
}
