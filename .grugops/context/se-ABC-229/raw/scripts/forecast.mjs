// ABC-229 forecast, frozen-clock half (adapted from se-ABC-228's): head's chooseMove on a frozen clock
// to base's real-clock depth at 4 000 ms; head nodes x factor against base's 4 s nodes (both sides at
// 4 000 ms, so the bar is 100 %). Also the head's door and base's chooseMove on the same frozen clock,
// which must be node-equal, and indicative CPU per node of head vs door (process.cpuUsage).
// usage: node forecast.mjs <baseTree> <headTree> <board:depth:baseNodes>...
const [baseTree, headTree, ...rows] = process.argv.slice(2);
const BOARDS = {
  kiwipete: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "position-6": "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
};
const bf = await import(`${baseTree}/src/fen.ts`);
const be = await import(`${baseTree}/src/engine.ts`);
const hf = await import(`${headTree}/src/fen.ts`);
const he = await import(`${headTree}/src/engine.ts`);
const cpu = (fn) => { const c0 = process.cpuUsage(); const r = fn(); const c = process.cpuUsage(c0); return [r, (c.user + c.system) / 1000]; };
for (const row of rows) {
  const [board, d, n] = row.split(":");
  const depth = Number(d);
  const baseNodes = Number(n);
  const fen = BOARDS[board];
  const opts = { budgetMs: 4000, now: () => 0, maxDepth: depth };
  const [door, doorMs] = cpu(() => he.chooseMoveWithoutQuietPromotions(hf.parseFen(fen), opts));
  const [head, headMs] = cpu(() => he.chooseMove(hf.parseFen(fen), opts));
  const baseFrozen = be.chooseMove(bf.parseFen(fen), opts);
  const cpuPerNode = headMs / head.nodes / (doorMs / door.nodes);
  console.log(JSON.stringify({
    board, depth, baseRealNodes: baseNodes,
    head: { depth: head.depth, nodes: head.nodes, move: `${head.move.from}-${head.move.to}`, score: head.score, cpuMs: Math.round(headMs) },
    door: { depth: door.depth, nodes: door.nodes, move: `${door.move.from}-${door.move.to}`, score: door.score, cpuMs: Math.round(doorMs) },
    baseFrozen: { depth: baseFrozen.depth, nodes: baseFrozen.nodes, score: baseFrozen.score },
    doorEqualsBase: door.nodes === baseFrozen.nodes && door.score === baseFrozen.score,
    headOverDoor: +(head.nodes / door.nodes).toFixed(4),
    cpuPerNodeHeadOverDoor: +cpuPerNode.toFixed(3),
    pctAt109: +((head.nodes * 1.09 / baseNodes) * 100).toFixed(1),
    pctAtMeasuredCpu: +((head.nodes * Math.max(1, cpuPerNode) / baseNodes) * 100).toFixed(1),
  }));
}
