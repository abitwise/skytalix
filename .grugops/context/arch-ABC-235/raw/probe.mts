// arch-ABC-235 probe: pawn-structure cache hit rate and makeMove calls per evaluate, on a scratch copy of src.
import { chooseMove } from "./src/engine.ts";
import { parseFen } from "./src/fen.ts";
const FENS: Record<string, string> = {
  kiwipete: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "position-6": "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
  start: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
};
for (const [name, fen] of Object.entries(FENS)) {
  const g = globalThis as any;
  g.__probe ??= {}; Object.assign(g.__probe, { evals: 0, makes: 0, ps: 0, uniq: new Map(), dm: new Array(1 << 14).fill(""), dmHits: 0, mism: 0 });
  const c = chooseMove(parseFen(fen), { budgetMs: 5000, maxNodes: 400_000 }) as any;
  const p = g.__probe;
  console.log(JSON.stringify({ name, depth: c.depth, nodes: c.nodes, evals: p.evals, makesPerEval: +(p.makes / p.evals).toFixed(1), makesPerNode: +(p.makes / c.nodes).toFixed(1), pawnCalls: p.ps, uniquePawnSigs: p.uniq.size, idealHitRate: +(1 - p.uniq.size / p.ps).toFixed(4), directMapped16kHitRate: +(p.dmHits / p.ps).toFixed(4), sigValueMismatch: p.mism }));
}
