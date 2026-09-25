// Probe: A1 / A2 / A3 for one variant tree. Usage: node measure.mjs <variantDir> [a1|a2|a3]
const V = process.argv[2], what = process.argv[3];
const { search, searchWithoutTable } = await import(V + "/src/search.ts");
const { chooseMove } = await import(V + "/src/engine.ts");
const { STATS } = await import(V + "/src/transposition.ts");
const { parseFen } = await import(V + "/src/fen.ts");
const { squareName } = await import(V + "/src/position.ts");
const lab = (m) => (m ? squareName(m.from) + squareName(m.to) + (m.promotion || "") : "null");
const PERFT = {
  startpos: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  kiwipete: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "position-3": "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1",
  "position-4": "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1",
  "position-5": "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8",
  "position-6": "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
  "knight-g1-K": "4k3/8/8/8/8/8/8/4K1NR w K - 0 1",
  "knight-g1-none": "4k3/8/8/8/8/8/8/4K1NR w - - 0 1",
};
if (what === "a1") {
  for (const [n, f] of Object.entries(PERFT)) {
    const d = 4;
    const t0 = performance.now(); const a = search(parseFen(f), d); const t1 = performance.now();
    const b = searchWithoutTable(parseFen(f), d); const t2 = performance.now();
    console.log(JSON.stringify({ n, d, on: [a.score, lab(a.move), a.nodes, Math.round(t1 - t0)], off: [b.score, lab(b.move), b.nodes, Math.round(t2 - t1)], same: a.score === b.score }));
  }
}
if (what === "a2") {
  for (const n of ["kiwipete", "position-6"]) {
    STATS.probes = 0; STATS.hits = 0;
    const a = search(parseFen(PERFT[n]), 5);
    console.log(JSON.stringify({ n, d: 5, fixed: true, score: a.score, nodes: a.nodes, probes: STATS.probes, hits: STATS.hits, rate: +(STATS.hits / STATS.probes).toFixed(4) }));
  }
}
if (what === "a3") {
  const target = Number(process.argv[4] ?? 5);
  for (const n of ["kiwipete", "position-6"]) {
    const row = { n, target };
    for (const off of [false, true]) {
      STATS.off = off; STATS.probes = 0; STATS.hits = 0;
      let done = false;
      STATS.onStore = (ply, depth) => { if (ply === 0 && depth === target) done = true; };
      // clock: 0 until iteration `target` completes (root store), then far past any deadline.
      const t0 = performance.now();
      const c = chooseMove(parseFen(PERFT[n]), { budgetMs: 1000, now: () => (done ? 1e12 : 0) });
      row[off ? "off" : "on"] = { depth: c.depth, nodes: c.nodes, score: c.score, move: lab(c.move), ms: Math.round(performance.now() - t0), hitRate: STATS.probes ? +(STATS.hits / STATS.probes).toFixed(4) : null };
      STATS.onStore = null; STATS.off = false;
    }
    row.ratio = +(row.on.nodes / row.off.nodes).toFixed(4);
    console.log(JSON.stringify(row));
  }
}
