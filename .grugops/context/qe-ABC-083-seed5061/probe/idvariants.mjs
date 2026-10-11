// QE seed 5061: the engine's deepening loop and its two test doors at several readings budgets.
// usage: node idvariants.mjs <tree-root> <label> <step>...
import { pathToFileURL } from "node:url";
const [tree, tag, ...steps] = process.argv.slice(2);
const src = (f) => pathToFileURL(`${tree}/src/${f}`).href;
const E = await import(src("engine.ts"));
const { parseFen } = await import(src("fen.ts"));
const { virtualClock } = await import(src("virtual-clock.ts"));
const { squareName } = await import(src("position.ts"));
const fen = "8/nk1p3q/4b3/5P2/1P2P3/3r4/6NP/b4KB1 w - - 0 1";
const lab = (m) => `${squareName(m.from)}${squareName(m.to)}`;
for (const step of steps) for (const name of ["chooseMove", "chooseMoveWithoutReductions", "chooseMoveWithoutPvsOrReductions"]) {
  const c = E[name](parseFen(fen), { budgetMs: 25, now: virtualClock(Number(step)) });
  const m = lab(c.move);
  console.log(`${tag}\t${name}\treadings=${(25 / Number(step)).toFixed(2)}\t${["f5e6", "g1a7"].includes(m) ? "SOLVED" : "MISSED"}\t${m}\td${c.depth}\tscore=${c.score}\tn${c.nodes}`);
}
