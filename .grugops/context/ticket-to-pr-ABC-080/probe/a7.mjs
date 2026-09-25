// ABC-080 A7: completed depth within DEFAULT_BUDGET_MS (3 s, real clock) on kiwipete and
// position-6, pre-ordering build (4f74acc, git-archived) vs this build, SAME PROCESS, alternating
// order per round. Node counts and depths are printed; ms are this machine under its load.
import { execSync } from "node:child_process";
const [BASE, HEAD] = process.argv.slice(2);
const ROUNDS = Number(process.env.ROUNDS ?? 3);
const load = () => execSync("sysctl -n vm.loadavg").toString().trim();
const builds = {
  base: { fen: await import(BASE + "/src/fen.ts"), engine: await import(BASE + "/src/engine.ts") },
  head: { fen: await import(HEAD + "/src/fen.ts"), engine: await import(HEAD + "/src/engine.ts") },
};
const FENS = {
  kiwipete: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "position-6": "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
};
console.log("node", process.version, "load", load());
for (let round = 0; round < ROUNDS; round++) {
  const order = round % 2 ? ["head", "base"] : ["base", "head"];
  for (const name of Object.keys(FENS)) for (const b of order) {
    const { fen, engine } = builds[b];
    const t = Date.now();
    const c = engine.chooseMove(fen.parseFen(FENS[name]), { budgetMs: engine.DEFAULT_BUDGET_MS });
    console.log(JSON.stringify({ round, build: b, name, depth: c.depth, nodes: c.nodes, ms: Date.now() - t, score: c.score, load: load() }));
  }
}
