// Depth completed in 3 s (chooseMove, DEFAULT_BUDGET_MS, real clock): this build (A) vs the base (B),
// ONE plain-node process, arms alternated per round, load average read before every run.
import { loadavg } from "node:os";
const [A, B, roundsArg] = process.argv.slice(2);
const rounds = Number(roundsArg ?? 3);
const arms = {
  A: { eng: await import(A + "/src/engine.ts"), fen: await import(A + "/src/fen.ts") },
  B: { eng: await import(B + "/src/engine.ts"), fen: await import(B + "/src/fen.ts") },
};
const F = {
  kiwipete: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "position-6": "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
};
// warm-up: one short search per arm so JIT state is comparable
for (const k of ["A", "B"]) arms[k].eng.chooseMove(arms[k].fen.parseFen(F.kiwipete), { budgetMs: 200 });
for (let r = 0; r < rounds; r++) {
  const order = r % 2 === 0 ? ["A", "B"] : ["B", "A"];
  for (const name of Object.keys(F)) for (const k of order) {
    const load = loadavg()[0].toFixed(2);
    const t = performance.now();
    const c = arms[k].eng.chooseMove(arms[k].fen.parseFen(F[name]), { budgetMs: arms[k].eng.DEFAULT_BUDGET_MS });
    console.log(JSON.stringify({ runner: "node", round: r, arm: k, name, depth: c.depth, nodes: c.nodes, ms: Math.round(performance.now() - t), load1: +load }));
  }
}
