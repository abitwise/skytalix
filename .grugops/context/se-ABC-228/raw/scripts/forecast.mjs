// A8/A9 forecast, frozen-clock half (ADR-0053 d9/d10): head's chooseMove on a frozen clock to base's
// real-clock depth; head nodes x 1.09 against base's 3 s nodes (A8) or 4/3 of them (A9). Also: the
// head's door and base's chooseMove on the same frozen clock, which must be node-equal.
// usage: node forecast.mjs <baseTree> <headTree> <budgetMs> <board:depth:baseNodes>...
const [baseTree, headTree, budgetArg, ...rows] = process.argv.slice(2);
const budgetMs = Number(budgetArg);
const BOARDS = {
  kiwipete: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "position-6": "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
};
const bf = await import(`${baseTree}/src/fen.ts`);
const be = await import(`${baseTree}/src/engine.ts`);
const hf = await import(`${headTree}/src/fen.ts`);
const he = await import(`${headTree}/src/engine.ts`);
const scale = budgetMs / 3000;
for (const row of rows) {
  const [board, d, n] = row.split(":");
  const depth = Number(d);
  const baseNodes = Number(n);
  const fen = BOARDS[board];
  const opts = { budgetMs, now: () => 0, maxDepth: depth };
  const head = he.chooseMove(hf.parseFen(fen), opts);
  const door = he.chooseMoveWithoutQuiescenceEvasions(hf.parseFen(fen), opts);
  const baseFrozen = be.chooseMove(bf.parseFen(fen), opts);
  const pct = ((head.nodes * 1.09) / (scale * baseNodes)) * 100;
  console.log(
    JSON.stringify({
      board,
      depth,
      budgetMs,
      baseRealNodes: baseNodes,
      bar: scale * 100,
      head: { depth: head.depth, nodes: head.nodes, move: `${head.move.from}-${head.move.to}`, score: head.score },
      door: { depth: door.depth, nodes: door.nodes, score: door.score },
      baseFrozen: { depth: baseFrozen.depth, nodes: baseFrozen.nodes, score: baseFrozen.score },
      doorEqualsBase: door.nodes === baseFrozen.nodes && door.score === baseFrozen.score,
      headOverDoor: +(head.nodes / door.nodes).toFixed(3),
      pct: +pct.toFixed(1),
    }),
  );
}
