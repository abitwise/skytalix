// qe-ABC-250 A4 probe: ONE fresh-process perft read on one board, one tree. usage: node probe-perft.mjs <treeDir> <B|H> <board>
// Depths are src/perft-bench.ts's. The page's runs at those depths last 0.02-0.24 s (se-ABC-250 ff7ffb6e), too short for the
// 5 % spread, and the page states no repetition method, so the REPS below were fixed in the PREREG before any timed run
// (from se-ABC-250's recorded rates, aiming at >= ~1.5 s of timed work per run). Per ADR-0055 D3's method the first call is
// reported apart (firstMs / firstNps, INFO); the graded nps is the steady state: REPS more calls, nodes / their wall time.
// perft() is the tree's own export, the one src/perft-bench.ts calls: object path on base, packed path on head.
import { performance } from "node:perf_hooks";
const [tree, build, board] = process.argv.slice(2);
const { parseFen, toFen } = await import(`${tree}/src/fen.ts`);
const { perft } = await import(`${tree}/src/perft.ts`);
const BOARDS = { // fen, perft-bench depth, published count at that depth (src/perft.test.ts), REPS
  kiwipete: ["r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1", 4, 4085603, 12],
  "position-6": ["r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10", 4, 3894594, 12],
  start: ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", 4, 197281, 150],
  "position-3": ["8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1", 5, 674624, 40],
  "position-4": ["r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1", 4, 422333, 80],
  "position-5": ["rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8", 4, 2103487, 20],
};
const [fen, depth, expected, reps] = BOARDS[board];
const p = parseFen(fen);
const f0 = performance.now();
const first = perft(p, depth);
const firstMs = performance.now() - f0;
let nodes = 0;
let countOk = first === expected;
const t0 = performance.now();
for (let i = 0; i < reps; i++) {
  const n = perft(p, depth);
  nodes += n;
  if (n !== expected) countOk = false;
}
const steadyMs = performance.now() - t0;
const ru = process.resourceUsage();
console.log(JSON.stringify({
  build, board, depth, reps, nodes, countOk, firstMs: Math.round(firstMs * 10) / 10, firstNps: Math.round((first / firstMs) * 1000),
  steadyMs: Math.round(steadyMs * 10) / 10, nps: Math.round((nodes / steadyMs) * 1000), cpuS: (ru.userCPUTime + ru.systemCPUTime) / 1e6,
  pure: toFen(p) === fen,
}));
