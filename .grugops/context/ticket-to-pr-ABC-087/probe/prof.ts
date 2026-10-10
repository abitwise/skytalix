import { chooseMove } from "<worktree>/src/engine.ts";
import { parseFen } from "<worktree>/src/fen.ts";
import { virtualClock } from "<worktree>/src/virtual-clock.ts";
const p = parseFen("r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1");
for (const step of [100, 50, 25]) {
  const t = performance.now();
  let n = 0;
  for (let i = 0; i < 50; i++) { const c = chooseMove(p, { budgetMs: 100, now: virtualClock(step) }); n += c!.nodes; }
  console.log(step, ((performance.now() - t) / 50).toFixed(2), "ms/call", n / 50, "nodes");
}
