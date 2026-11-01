// One fresh-process nps probe: chooseMove at 4 000 ms, one board, one tree.
// usage: node nps.mjs <treeDir> <label> <start|kiwipete|position-6|position-4>
import { loadavg } from "node:os";
const [tree, label, board] = process.argv.slice(2);
const { parseFen, toFen } = await import(`${tree}/src/fen.ts`);
const { chooseMove } = await import(`${tree}/src/engine.ts`);
const BOARDS = {
  start: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  kiwipete: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "position-6": "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
  "position-4": "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1",
};
const fen = BOARDS[board];
const load1 = loadavg()[0];
const p = parseFen(fen);
const c = chooseMove(p, { budgetMs: 4000 });
if (toFen(p) !== fen) throw new Error("position changed");
console.log(JSON.stringify({ tree: label, board, load1, depth: c.depth, nodes: c.nodes, elapsedMs: c.elapsedMs, move: c.move ? `${c.move.from}-${c.move.to}` : null, score: c.score, nps: Math.round((c.nodes / c.elapsedMs) * 1000) }));
