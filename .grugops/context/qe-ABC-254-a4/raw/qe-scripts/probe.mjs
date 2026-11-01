// qe-ABC-254 A4 probe: ONE fresh-process search. chooseMove at 4 000 ms on the real clock, one board, one tree.
// usage: node probe.mjs <treeDir> <B|H> <board>. nps = nodes / elapsedMs × 1000 (the ABC-227 / se-ABC-254 method).
import { performance } from "node:perf_hooks";
const [tree, build, board] = process.argv.slice(2);
const { parseFen, toFen } = await import(`${tree}/src/fen.ts`);
const { chooseMove } = await import(`${tree}/src/engine.ts`);
const BOARDS = {
  start: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  kiwipete: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "position-6": "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
  "position-4": "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1",
};
const fen = BOARDS[board];
const p = parseFen(fen);
const t0 = performance.now();
const c = chooseMove(p, { budgetMs: 4000 });
const wallMs = performance.now() - t0;
const ru = process.resourceUsage();
console.log(JSON.stringify({
  build, board, depth: c.depth, nodes: c.nodes, elapsedMs: c.elapsedMs, wallMs: Math.round(wallMs * 10) / 10,
  move: c.move ? `${c.move.from}-${c.move.to}-${c.move.promotion}` : null, score: c.score,
  nps: Math.round((c.nodes / c.elapsedMs) * 1000), cpuS: (ru.userCPUTime + ru.systemCPUTime) / 1e6, pure: toFen(p) === fen,
}));
