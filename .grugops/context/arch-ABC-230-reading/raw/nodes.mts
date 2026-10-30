// Probe Q3-2: option (b) (ep component only when a capturer stands beside the pushed pawn) against
// main's key: fixed-depth search() score and node count on the six benchmark positions.
import * as A from "./src/search.ts";
import * as B from "./srcb/search.ts";
import { parseFen as pa } from "./src/fen.ts";
import { parseFen as pb } from "./srcb/fen.ts";
const C = [
  ["startpos", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"],
  ["kiwipete", "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1"],
  ["position-3", "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1"],
  ["position-4", "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1"],
  ["position-5", "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8"],
  ["position-6", "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10"],
];
const depth = Number(process.argv[2] ?? 5);
let moved = 0;
for (const [name, fen] of C) {
  const a = A.search(pa(fen), depth);
  const b = B.search(pb(fen), depth);
  const same = a.nodes === b.nodes && a.score === b.score;
  if (!same) moved++;
  console.log(`${name} d${depth} base nodes=${a.nodes} score=${a.score} | (b) nodes=${b.nodes} score=${b.score} ${same ? "SAME" : "MOVED"}`);
}
console.log(`moved ${moved}/${C.length}`);
