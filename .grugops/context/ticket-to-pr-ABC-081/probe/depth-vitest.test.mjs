// Same reading as depth.mjs, under the vitest runner: this build (A) vs the base (B), one worker.
import { loadavg } from "node:os";
import { it } from "vitest";
const A = "/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/cc8144c4-cb23-42b5-90b8-44bcbd8a2345/scratchpad/armA", B = "/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/cc8144c4-cb23-42b5-90b8-44bcbd8a2345/scratchpad/armB";
const F = {
  kiwipete: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "position-6": "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
};
it("depth in 3 s, A vs B, 3 rounds", async () => {
  const arms = {
    A: { eng: await import(A + "/src/engine.ts"), fen: await import(A + "/src/fen.ts") },
    B: { eng: await import(B + "/src/engine.ts"), fen: await import(B + "/src/fen.ts") },
  };
  for (const k of ["A", "B"]) arms[k].eng.chooseMove(arms[k].fen.parseFen(F.kiwipete), { budgetMs: 200 });
  for (let r = 0; r < 3; r++) {
    const order = r % 2 === 0 ? ["A", "B"] : ["B", "A"];
    for (const name of Object.keys(F)) for (const k of order) {
      const load1 = +loadavg()[0].toFixed(2);
      const t = performance.now();
      const c = arms[k].eng.chooseMove(arms[k].fen.parseFen(F[name]), { budgetMs: arms[k].eng.DEFAULT_BUDGET_MS });
      console.log(JSON.stringify({ runner: "vitest", round: r, arm: k, name, depth: c.depth, nodes: c.nodes, ms: Math.round(performance.now() - t), load1 }));
    }
  }
}, 120_000);
