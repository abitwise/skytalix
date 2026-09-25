const V = process.argv[2];
const { search } = await import(V + "/src/search.ts");
const { chooseMove } = await import(V + "/src/engine.ts");
const { STATS } = await import(V + "/src/transposition.ts");
const { parseFen } = await import(V + "/src/fen.ts");
const F = { startpos: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", kiwipete: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1", "position-3": "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1", "position-6": "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10" };
for (const [n, f] of Object.entries(F)) for (const d of [4, 5]) {
  if (d === 5 && n !== "position-3") continue;
  STATS.probes = 0; STATS.hits = 0; const t = performance.now(); const r = search(parseFen(f), d);
  console.log("fixed", n, d, "rate", (STATS.hits / STATS.probes).toFixed(4), "nodes", r.nodes, Math.round(performance.now() - t) + "ms");
}
for (const [n, f] of Object.entries(F)) for (const target of [3, 4]) {
  const row = [];
  for (const off of [false, true]) {
    STATS.off = off; STATS.probes = 0; STATS.hits = 0; let done = false;
    STATS.onStore = (ply, depth) => { if (ply === 0 && depth === target) done = true; };
    const t = performance.now();
    const c = chooseMove(parseFen(f), { budgetMs: 1000, now: () => (done ? 1e12 : 0) });
    row.push({ nodes: c.nodes, depth: c.depth, ms: Math.round(performance.now() - t), rate: STATS.probes ? (STATS.hits / STATS.probes).toFixed(4) : null });
    STATS.off = false; STATS.onStore = null;
  }
  console.log("ID", n, target, JSON.stringify(row), "ratio", (row[0].nodes / row[1].nodes).toFixed(4));
}
