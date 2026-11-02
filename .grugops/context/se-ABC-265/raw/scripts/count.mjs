const S = process.argv[2];
const { chooseMove } = await import(`${S}/src/engine.ts`);
const { parseFen } = await import(`${S}/src/fen.ts`);
const B = { kiwipete: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1", "position-6": "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10" };
for (const [b, d] of [["kiwipete", 9], ["position-6", 10]]) {
  globalThis.__probes = 0; globalThis.__stores = 0;
  const c = chooseMove(parseFen(B[b]), { budgetMs: 1000, now: () => 0, maxDepth: d });
  console.log(`${b} chooseMove fixed to ${d}: nodes ${c.nodes}, probeTable ${globalThis.__probes} (${(globalThis.__probes / c.nodes).toFixed(4)}/node), storeEntry ${globalThis.__stores} (${(globalThis.__stores / c.nodes).toFixed(4)}/node)`);
}
