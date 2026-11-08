// SCRATCH PROBE (arch-ABC-298-probe; ADR-0077 d9 step 3). One board per process: chooseMove with
// maxDepth 9 and now () => 0. Prints the result and, on the counted copy, the counters. Reads no
// clock and prints no timing figure (elapsedMs is not printed).
// Usage (from a copy's root): BOARD=<kiwipete|position-6|start> node probe.ts
import * as engine from "./src/engine.ts";
import { parseFen, toFen } from "./src/fen.ts";
import { squareName } from "./src/position.ts";

const BOARDS: Record<string, string> = {
  kiwipete: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "position-6": "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
  start: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
};
const board = process.env.BOARD ?? "";
const fen = BOARDS[board];
if (fen === undefined) throw new Error(`unknown BOARD ${board}`);
const position = parseFen(fen);
const r = engine.chooseMove(position, { budgetMs: 1e9, now: () => 0, maxDepth: 9 });
if (r === null) throw new Error("no move");
const out: Record<string, unknown> = {
  board,
  maxDepth: 9,
  depth: r.depth,
  nodes: r.nodes,
  score: r.score,
  move: `${squareName(r.move.from)}${squareName(r.move.to)}:${r.move.promotion}`,
  pure: toFen(position) === fen,
};
const e = engine as unknown as Record<string, Float64Array | undefined>;
if (e.PROBE_G !== undefined) {
  out.G = Array.from(e.PROBE_G);
  out.H = Array.from(e.PROBE_H as Float64Array);
  out.C = Array.from(e.PROBE_C as Float64Array);
  out.X = Array.from(e.PROBE_X as Float64Array);
}
console.log(JSON.stringify(out));
