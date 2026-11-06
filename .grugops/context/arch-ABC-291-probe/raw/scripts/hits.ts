// SCRATCH PROBE (arch-ABC-291-probe), PR10's memo count, on the `count` copy (never timed): hits and misses in chooseMove
// at a fixed depth on G2's six roots, ON, the memo emptied before each root. A report; it decides nothing.
import { chooseMove } from "./src/engine.ts";
import { clearPawnCacheForTest, probeCounts } from "./src/evaluate.ts";
import { parseFen } from "./src/fen.ts";
const ROOTS = [["startpos", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"], ["kiwipete", "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1"], ["position-3", "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1"], ["position-4", "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1"], ["position-5", "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8"], ["position-6", "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10"]] as const;
const depth = Number(process.env.D ?? 8);
let hits = 0, misses = 0;
for (const [name, fen] of ROOTS) {
  clearPawnCacheForTest();
  const a = probeCounts();
  chooseMove(parseFen(fen), { budgetMs: 1e9, now: () => 0, maxDepth: depth });
  const b = probeCounts();
  const h = b.hits - a.hits, m = b.misses - a.misses;
  hits += h; misses += m;
  console.log(JSON.stringify({ name, depth, hits: h, misses: m }));
}
console.log(JSON.stringify({ depth, hits, misses, hitPct: +(100 * hits / (hits + misses)).toFixed(3) }));
