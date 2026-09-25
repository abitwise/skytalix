/**
 * PROBE: transposition.test.ts's depth-10 rook ending (ABC-081 A4, the engine reusing a mate score
 * at a second ply) under the three engine shapes at 160 injected ticks, plus fixed-depth references.
 */
import {
  chooseMove,
  chooseMoveWithoutPvsOrReductions,
  chooseMoveWithoutReductions,
} from "../../../../src/engine.ts";
import { parseFen } from "../../../../src/fen.ts";
import { search, searchWithoutReductions, searchWithoutTable } from "../../../../src/search.ts";
import { lbl } from "./corpus.ts";

const FEN = "k7/8/8/K7/8/8/8/1R6 b - - 1 1";
for (const [name, choose] of [
  ["chooseMove", chooseMove],
  ["chooseMoveWithoutReductions", chooseMoveWithoutReductions],
  ["chooseMoveWithoutPvsOrReductions", chooseMoveWithoutPvsOrReductions],
] as const) {
  for (const budget of [160]) {
    let ticks = 0;
    const c = choose(parseFen(FEN), { budgetMs: budget, now: () => ticks++ });
    console.log(JSON.stringify({ name, budget, depth: c?.depth, score: c?.score, move: lbl(c?.move ?? null), nodes: c?.nodes }));
  }
}
for (const d of [9, 10, 11]) {
  console.log(JSON.stringify({ d, search: search(parseFen(FEN), d).score, withoutReductions: searchWithoutReductions(parseFen(FEN), d).score, withoutTable: searchWithoutTable(parseFen(FEN), d).score }));
}
