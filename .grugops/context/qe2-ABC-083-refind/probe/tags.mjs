// QE2 ABC-083 re-find: ADR-0034 d4 tag re-measure. The suite's call at 25 readings on one variant tree.
// usage: node tags.mjs <variant-root> <label> "<fen>|<accept,...>"
import { pathToFileURL } from "node:url";
const [tree, tag, spec] = process.argv.slice(2);
const src = (f) => import(pathToFileURL(`${tree}/src/${f}`).href);
const { chooseMove } = await src("engine.ts");
const { parseFen } = await src("fen.ts");
const { virtualClock } = await src("virtual-clock.ts");
const { squareName } = await src("position.ts");
const [fen, acc] = spec.split("|");
const c = chooseMove(parseFen(fen), { budgetMs: 25, now: virtualClock(1) });
const m = `${squareName(c.move.from)}${squareName(c.move.to)}`;
console.log(`${tag}\t${acc.split(",").includes(m) ? "SOLVED" : "MISSED"} ${m} d${c.depth} n${c.nodes}`);
