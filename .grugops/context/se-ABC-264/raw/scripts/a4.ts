import { parseFen } from "<worktree>/src/fen.ts";
import { search, searchWithoutReverseFutility } from "<worktree>/src/search.ts";
import { chooseMove, chooseMoveWithoutReverseFutility } from "<worktree>/src/engine.ts";
const F: Record<string,string> = {
 kiwipete: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
 "position-6": "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
};
for (const [n,f] of Object.entries(F)) {
  const h = search(parseFen(f), 8), d = searchWithoutReverseFutility(parseFen(f), 8);
  console.log("search", n, h.nodes, d.nodes, (h.nodes/d.nodes).toFixed(4), h.score, d.score);
  const o = { budgetMs: 1000, now: () => 0, maxDepth: 8 };
  const ch = chooseMove(parseFen(f), o)!, cd = chooseMoveWithoutReverseFutility(parseFen(f), o)!;
  console.log("choose", n, ch.nodes, cd.nodes, (ch.nodes/cd.nodes).toFixed(4), ch.score, cd.score);
}
