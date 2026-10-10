// ABC-083 A7/A9: completed depth of chooseMove at DEFAULT_BUDGET_MS on the real clock, ONE run
// per fresh plain-node process (the product's own shape), load1 read before the run.
// Usage: node depth.mjs <tree-root> <label> <kiwipete|position-6> <round>
import { loadavg } from "node:os";
const [root, label, name, round] = process.argv.slice(2);
const FEN = {
  kiwipete: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "position-6": "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
};
const { chooseMove, DEFAULT_BUDGET_MS } = await import(`${root}/src/engine.ts`);
const { parseFen } = await import(`${root}/src/fen.ts`);
const load1 = +loadavg()[0].toFixed(2);
const c = chooseMove(parseFen(FEN[name]), { budgetMs: DEFAULT_BUDGET_MS });
console.log(JSON.stringify({ round: +round, label, name, depth: c.depth, nodes: c.nodes, ms: c.elapsedMs, nps: Math.round((1000 * c.nodes) / c.elapsedMs), load1, at: new Date().toISOString() }));
