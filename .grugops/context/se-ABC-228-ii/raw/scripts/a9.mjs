// A9 forecast, frozen-clock half (ADR-0053 d10; ABC-228 A9): head's chooseMove on a frozen clock to base's
// real-clock 3 s depth. Reported in A8's units: head nodes x 1.09 / base's 3 s nodes (bar <= 133.3 %), and the
// same read as a share of 4/3 x base's 3 s nodes (bar <= 100 %). Head's door and base's frozen chooseMove must be
// node-equal. A factor other than 1.09 (QE's measured 1.139 on position-6) is printed as INFO only.
// usage: node a9.mjs <baseTree> <headTree> <board:depth:baseNodes>...
const [baseTree, headTree, ...rows] = process.argv.slice(2);
const BOARDS = {
  kiwipete: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "position-6": "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
};
const bf = await import(`${baseTree}/src/fen.ts`);
const be = await import(`${baseTree}/src/engine.ts`);
const hf = await import(`${headTree}/src/fen.ts`);
const he = await import(`${headTree}/src/engine.ts`);
const HEAD_MS = he.DEFAULT_BUDGET_MS;
const BASE_MS = be.DEFAULT_BUDGET_MS;
for (const row of rows) {
  const [board, d, n] = row.split(":");
  const depth = Number(d);
  const baseNodes = Number(n);
  const fen = BOARDS[board];
  const head = he.chooseMove(hf.parseFen(fen), { budgetMs: HEAD_MS, now: () => 0, maxDepth: depth });
  const door = he.chooseMoveWithoutQuiescenceEvasions(hf.parseFen(fen), { budgetMs: HEAD_MS, now: () => 0, maxDepth: depth });
  const baseFrozen = be.chooseMove(bf.parseFen(fen), { budgetMs: BASE_MS, now: () => 0, maxDepth: depth });
  const scale = HEAD_MS / BASE_MS;
  const pctA8 = ((head.nodes * 1.09) / baseNodes) * 100;
  console.log(JSON.stringify({
    board, depth, headBudgetMs: HEAD_MS, baseBudgetMs: BASE_MS, baseRealNodes: baseNodes,
    head: { depth: head.depth, nodes: head.nodes, move: `${head.move.from}-${head.move.to}`, score: head.score },
    door: { depth: door.depth, nodes: door.nodes, score: door.score },
    baseFrozen: { depth: baseFrozen.depth, nodes: baseFrozen.nodes, score: baseFrozen.score },
    doorEqualsBase: door.nodes === baseFrozen.nodes && door.score === baseFrozen.score,
    headOverDoor: +(head.nodes / door.nodes).toFixed(3),
    pctA8Units: +pctA8.toFixed(1), barA8Units: +(scale * 100).toFixed(1),
    pctOfScaledBase: +(pctA8 / scale).toFixed(1), barScaled: 100,
    met: pctA8 <= scale * 100,
    info_pctA8Units_at_1139: +(((head.nodes * 1.139) / baseNodes) * 100).toFixed(1),
  }));
}
