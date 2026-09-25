/**
 * PROBE: ABC-121 A2 — depth completed in the default 3 s budget, chooseMove (this build) vs
 * chooseMoveWithoutPvsOrReductions (the pre-ABC-121 engine, node for node), kiwipete and
 * position-6, SAME PROCESS, plain node (NFR-005's runner), ROUNDS rounds, the order alternating
 * each round. The 1-minute load average is read before every run. The node rate of each
 * run is printed; the clock-free companion (nodes to depth 7) is the suite's SEARCH_DEEP row.
 * Usage: node depth.ts [rounds]
 */
import { loadavg } from "node:os";
import { chooseMove, chooseMoveWithoutPvsOrReductions, DEFAULT_BUDGET_MS } from "../../../../src/engine.ts";
import { parseFen } from "../../../../src/fen.ts";

const ROUNDS = Number(process.argv[2] ?? 3);
const POS: Array<[string, string]> = [
  ["kiwipete", "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1"],
  ["position-6", "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10"],
];
// The base build itself (the main checkout at 15c6eb0, imported read-only) as a third arm.
const base = await import("/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-example/src/engine.ts");
const CONFIGS = [
  ["chooseMove", chooseMove],
  ["chooseMoveWithoutPvsOrReductions", chooseMoveWithoutPvsOrReductions],
  ["base-15c6eb0-chooseMove", base.chooseMove as typeof chooseMove],
] as const;

for (let round = 1; round <= ROUNDS; round++) {
  const k = (round - 1) % CONFIGS.length;
  const order = [...CONFIGS.slice(k), ...CONFIGS.slice(0, k)];
  for (const [name, fen] of POS) {
    for (const [config, choose] of order) {
      const load = loadavg()[0]?.toFixed(2);
      const c = choose(parseFen(fen), { budgetMs: DEFAULT_BUDGET_MS });
      if (c === null) throw new Error("no move");
      console.log(JSON.stringify({ round, name, config, depth: c.depth, nodes: c.nodes, ms: c.elapsedMs, nps: Math.round((1000 * c.nodes) / c.elapsedMs), load1: load }));
    }
  }
}
