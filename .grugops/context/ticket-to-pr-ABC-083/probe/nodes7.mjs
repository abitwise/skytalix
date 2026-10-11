// ABC-083 A9 (clock-free): cumulative nodes for chooseMove to COMPLETE depth D. A virtual clock
// ticks once per consultation (once per NODES_PER_CLOCK_CHECK nodes); binary-search the smallest
// budget that completes D. The deepening loop stops on now() < deadline before it starts D+1, so
// the node count at that budget is the work through depth D. Re-implements secnfr-ABC-082's
// `nodes7.mjs` from its note (…ff8ad962); that file is not on record.
// Usage: node nodes7.mjs <tree-root> <label>
const [root, label] = process.argv.slice(2);
const { chooseMove } = await import(`${root}/src/engine.ts`);
const { parseFen } = await import(`${root}/src/fen.ts`);
const POS = [
  ["kiwipete", "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1"],
  ["position-6", "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10"],
];
const run = (fen, budgetMs) => { let t = 0; return chooseMove(parseFen(fen), { budgetMs, now: () => t++ }); };
for (const [name, fen] of POS) {
  for (const D of [6, 7]) {
    let lo = 1, hi = 4096;
    while (lo < hi) { const mid = (lo + hi) >> 1; if (run(fen, mid).depth >= D) hi = mid; else lo = mid + 1; }
    const c = run(fen, lo);
    const below = run(fen, lo - 1);
    console.log(JSON.stringify({ label, name, depth: D, budgetTicks: lo, nodes: c.nodes, reached: c.depth, oneTickLess: below.depth, move: c.move && [c.move.from, c.move.to], score: c.score }));
  }
}
