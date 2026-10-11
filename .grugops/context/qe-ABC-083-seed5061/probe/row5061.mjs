// QE seed 5061: one puzzle row, the suite's exact call — chooseMove(parseFen(fen), { budgetMs: 25, now: virtualClock(stepMs) }).
// usage: node row5061.mjs <tree-root> <label> <stepMs> [fen]
import { pathToFileURL } from "node:url";
const [tree, tag, step, fenArg] = process.argv.slice(2);
const src = (f) => pathToFileURL(`${tree}/src/${f}`).href;
const { chooseMove } = await import(src("engine.ts"));
const { parseFen } = await import(src("fen.ts"));
const { virtualClock } = await import(src("virtual-clock.ts"));
const { squareName } = await import(src("position.ts"));
const fen = fenArg ?? "8/nk1p3q/4b3/5P2/1P2P3/3r4/6NP/b4KB1 w - - 0 1";
const c = chooseMove(parseFen(fen), { budgetMs: 25, now: virtualClock(Number(step)) });
const mv = `${squareName(c.move.from)}${squareName(c.move.to)}`;
const ok = ["f5e6", "g1a7"].includes(mv);
console.log([tag, `step=${step}`, `readings=${(25 / Number(step)).toFixed(2)}`, ok ? "SOLVED" : "MISSED", mv, `d${c.depth}`, `n${c.nodes}`, `score=${c.score ?? ""}`].join("\t"));
