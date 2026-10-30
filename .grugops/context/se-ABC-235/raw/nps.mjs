// One fresh-process nps probe (ABC-227 method): chooseMove at 3 000 ms, one board, one tree.
// usage: node nps.mjs <treeDir> <start|kiwipete|position-6>
import { loadavg } from "node:os";
const [tree, board] = process.argv.slice(2);
const { parseFen, toFen } = await import(`${tree}/src/fen.ts`);
const { chooseMove } = await import(`${tree}/src/engine.ts`);
const BOARDS = {
  start: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  kiwipete: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "position-6": "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
};
const fen = BOARDS[board];
const load1 = loadavg()[0];
const p = parseFen(fen);
const c = chooseMove(p, { budgetMs: 3000 });
if (toFen(p) !== fen) throw new Error("position changed");
console.log(JSON.stringify({ tree: tree.split("/").pop(), board, load1, depth: c.depth, nodes: c.nodes, elapsedMs: c.elapsedMs, nps: Math.round((c.nodes / c.elapsedMs) * 1000) }));
