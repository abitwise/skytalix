// one G6 search in a fresh process: node se268-g6one.mjs <tree> <tag> <pos> <round>
const [T, tag, pos, round] = process.argv.slice(2);
const FEN = { kiwipete: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1", "position-6": "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10" };
const { chooseMove } = await import(`${T}/src/engine.ts`);
const { parseFen } = await import(`${T}/src/fen.ts`);
const { LEVELS } = await import(`${T}/src/levels.ts`);
const { readFileSync } = await import("node:fs");
const load1 = +readFileSync("/proc/loadavg", "utf8").split(" ")[0];
const budget = LEVELS[5].budgetMs;
const t0 = performance.now();
const c = chooseMove(parseFen(FEN[pos]), { budgetMs: budget });
const ms = +(performance.now() - t0).toFixed(1);
console.log(JSON.stringify({ tree: tag, pos, round: +round, budget, ms, depth: c.depth, nodes: c.nodes, score: c.score, load1_before: load1, at: new Date().toISOString() }));
