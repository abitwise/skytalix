import { chooseMove, HARD_CEILING_MS } from "<worktree>/src/engine.ts";
import { parseFen } from "<worktree>/src/fen.ts";
let ticks = 0, reads = 0;
const now = () => { reads++; const r = ticks; ticks += 1; return r; };
const c = chooseMove(parseFen("r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1"), { budgetMs: HARD_CEILING_MS, now, maxNodes: 6000 });
console.log(JSON.stringify({ HARD_CEILING_MS, reads, nodes: c.nodes, depth: c.depth, elapsedMs: c.elapsedMs }));
