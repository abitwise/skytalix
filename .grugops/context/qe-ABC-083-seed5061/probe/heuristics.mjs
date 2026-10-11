// QE seed 5061: which search heuristic decides the d5 pick. Fixed-depth search variants (d5, d6) and
// the engine's own deepening variants at the suite's budget (25 ms, virtualClock(1)).
// usage: node heuristics.mjs <tree-root> <label>
import { pathToFileURL } from "node:url";
const [tree, tag] = process.argv.slice(2);
const src = (f) => pathToFileURL(`${tree}/src/${f}`).href;
const S = await import(src("search.ts"));
const E = await import(src("engine.ts"));
const { parseFen } = await import(src("fen.ts"));
const { virtualClock } = await import(src("virtual-clock.ts"));
const { squareName } = await import(src("position.ts"));
const fen = "8/nk1p3q/4b3/5P2/1P2P3/3r4/6NP/b4KB1 w - - 0 1";
const lab = (m) => (m ? `${squareName(m.from)}${squareName(m.to)}` : "null");
const ok = (m) => (["f5e6", "g1a7"].includes(m) ? "SOLVED" : "MISSED");
for (const name of ["search", "searchWithoutReductions", "searchWithoutPvsOrReductions", "searchWithoutTable", "searchWithoutKillers", "searchWithoutPruning"]) {
  for (const d of [4, 5, 6]) {
    if (name === "searchWithoutPruning" && d > 4) continue;
    const r = S[name](parseFen(fen), d);
    console.log(`${tag}\t${name}\td${d}\t${ok(lab(r.move))}\t${lab(r.move)}\tscore=${r.score}\tn${r.nodes}`);
  }
}
for (const name of ["chooseMove", "chooseMoveWithoutReductions", "chooseMoveWithoutPvsOrReductions"]) {
  const c = E[name](parseFen(fen), { budgetMs: 25, now: virtualClock(1) });
  console.log(`${tag}\t${name}\tbudget25/step1\t${ok(lab(c.move))}\t${lab(c.move)}\td${c.depth}\tscore=${c.score}\tn${c.nodes}`);
}
