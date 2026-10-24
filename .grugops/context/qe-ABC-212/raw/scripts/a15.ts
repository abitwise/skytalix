// ABC-212 A15 reading (NFR-005's instrument): chooseMove at a level's budget, REAL clock, plain node.
// One search per process. usage: node a15.ts <tree> <position-name> <level>
import { pathToFileURL } from "node:url";
const [tree, name, levelArg] = process.argv.slice(2);
const m = (p: string) => import(pathToFileURL(`${tree}/src/${p}`).href);
const { LEVELS } = await m("levels.ts");
const { chooseMove } = await m("engine.ts");
const { parseFen } = await m("fen.ts");
const FENS: Record<string, string> = {
  kiwipete: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "position-6": "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
};
const level = Number(levelArg);
const budgetMs = LEVELS[level].budgetMs;
const start = Date.now();
const c = chooseMove(parseFen(FENS[name]), { budgetMs, now: Date.now });
const wall = Date.now() - start;
console.log(JSON.stringify({ position: name, level, budgetMs, depth: c?.depth, nodes: c?.nodes, elapsedMs: c?.elapsedMs, wallMs: wall, score: c?.score, node: process.version }));
