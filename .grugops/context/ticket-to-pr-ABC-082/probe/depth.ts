/**
 * ABC-082 A6 / NFR-005 part 2: depth completed by chooseMove at DEFAULT_BUDGET_MS on the real clock,
 * kiwipete and position-6, plain node, the ABC-082 build and the base build (5ebe1d8) in the SAME
 * process, order alternating each round; the 1-minute load average read before every run.
 * Usage: node depth.ts [rounds]
 */
import { loadavg } from "node:os";
const ROUNDS = Number(process.argv[2] ?? 3);
const branch = await import("/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-example/.claude/worktrees/ABC-082-pawn-structure/src/engine.ts");
const base = await import("/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/e0dd4cf5-83f1-4fb6-bb33-18c0c2394948/scratchpad/base/src/engine.ts");
const fen = await import("/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-example/.claude/worktrees/ABC-082-pawn-structure/src/fen.ts");
const POS = [
  ["kiwipete", "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1"],
  ["position-6", "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10"],
];
const CONFIGS = [["ABC-082", branch.chooseMove], ["base-5ebe1d8", base.chooseMove]];
for (let round = 1; round <= ROUNDS; round++) {
  const order = round % 2 === 1 ? CONFIGS : [...CONFIGS].reverse();
  for (const [name, f] of POS) {
    for (const [config, choose] of order) {
      const load1 = loadavg()[0].toFixed(2);
      const c = choose(fen.parseFen(f), { budgetMs: branch.DEFAULT_BUDGET_MS });
      console.log(JSON.stringify({ round, name, config, depth: c.depth, nodes: c.nodes, ms: c.elapsedMs, nps: Math.round((1000 * c.nodes) / c.elapsedMs), load1 }));
    }
  }
}
