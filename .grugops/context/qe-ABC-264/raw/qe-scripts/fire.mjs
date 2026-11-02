// qe-ABC-264 firing-rate read (INFO) on the scratch instrument tree F. usage: node fire.mjs <F> <board> <real:MS|frozen:D>
const [F, board, mode] = process.argv.slice(2);
const FENS = { startpos: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  kiwipete: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "position-6": "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10" };
const { parseFen } = await import(`${F}/src/fen.ts`);
const { chooseMove } = await import(`${F}/src/engine.ts`);
const [kind, v] = mode.split(":"); const n = Number(v);
const opts = kind === "real" ? { budgetMs: n } : { budgetMs: 1000, now: () => 0, maxDepth: n };
const t0 = performance.now(); const c = chooseMove(parseFen(FENS[board]), opts); const ms = performance.now() - t0;
const r = globalThis.qeRfp, tries = r.tries.reduce((a, b) => a + b, 0), cuts = r.cuts.reduce((a, b) => a + b, 0);
console.log(JSON.stringify({ board, mode, ms: +ms.toFixed(1), depth: c.depth, nodes: c.nodes, tries, cuts, cutPerNode: +(100 * cuts / c.nodes).toFixed(2),
  cutPerTry: +(100 * cuts / tries).toFixed(2), triesByDepth: r.tries.slice(1, 4), cutsByDepth: r.cuts.slice(1, 4), over3: r.tries[4] }));
