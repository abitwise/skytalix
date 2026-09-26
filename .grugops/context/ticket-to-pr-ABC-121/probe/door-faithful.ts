/**
 * PROBE: every pre-ABC-121 door of THIS tree against the BASE build (the main checkout's src/ at
 * 15c6eb0, imported read-only), score + nodes + move, node for node. Search doors at depths 1-4 on
 * the six roots and six endgames; the engine door against the base chooseMove at injected-clock
 * budgets 1..12 ticks (1 tick per consultation).
 */
import { parseFen } from "../../../../src/fen.ts";
import * as here from "../../../../src/search.ts";
import * as hereEngine from "../../../../src/engine.ts";
import { ENDGAMES, lbl, ROOTS } from "./corpus.ts";

const BASE = "/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-example/src";
const base = await import(`${BASE}/search.ts`);
const baseEngine = await import(`${BASE}/engine.ts`);

const pairs: Array<[string, string]> = [
  ["searchWithoutPvsOrReductions", "search"],
  ["searchWithoutPruning", "searchWithoutPruning"],
  ["searchWithoutQuiescence", "searchWithoutQuiescence"],
  ["searchWithoutOrdering", "searchWithoutOrdering"],
  ["searchWithoutKillers", "searchWithoutKillers"],
  ["searchWithoutTable", "searchWithoutTable"],
  ["searchWithoutPruningOrQuiescence", "searchWithoutPruningOrQuiescence"],
];
let cells = 0;
let bad = 0;
for (const [name, fen] of [...ROOTS, ...ENDGAMES]) {
  for (const [mine, theirs] of pairs) {
    const maxD = theirs.includes("Pruning") || theirs === "searchWithoutOrdering" ? 3 : 4;
    for (let d = 1; d <= maxD; d++) {
      if (theirs.includes("Pruning") && d === 3 && !["position-3", "startpos"].includes(name) && !ENDGAMES.some(([n]) => n === name)) continue;
      const a = (here as Record<string, Function>)[mine](parseFen(fen), d);
      const b = base[theirs](parseFen(fen), d);
      cells++;
      if (a.score !== b.score || a.nodes !== b.nodes || lbl(a.move) !== lbl(b.move)) {
        bad++;
        console.log(JSON.stringify({ name, mine, d, here: [a.score, a.nodes, lbl(a.move)], base: [b.score, b.nodes, lbl(b.move)] }));
      }
    }
  }
}
let ecells = 0;
let ebad = 0;
const tick = () => { let t = 0; return () => t++; };
for (const [name, fen] of [...ROOTS, ...ENDGAMES]) {
  for (let budget = 1; budget <= 12; budget++) {
    const a = hereEngine.chooseMoveWithoutPvsOrReductions(parseFen(fen), { budgetMs: budget, now: tick() });
    const b = baseEngine.chooseMove(parseFen(fen), { budgetMs: budget, now: tick() });
    ecells++;
    if (a.score !== b.score || a.nodes !== b.nodes || a.depth !== b.depth || lbl(a.move) !== lbl(b.move)) {
      ebad++;
      console.log(JSON.stringify({ name, budget, here: [a.score, a.nodes, a.depth, lbl(a.move)], base: [b.score, b.nodes, b.depth, lbl(b.move)] }));
    }
  }
}
console.log(JSON.stringify({ summary: "door-faithful", searchCells: cells, searchMismatches: bad, engineCells: ecells, engineMismatches: ebad }));
