/**
 * PROBE: is chooseMoveWithoutReductions really unreduced? Injected clock of 1 tick per consultation
 * at small budgets on the six endgames and position-3: depth, score, nodes for all three engine shapes.
 */
import {
  chooseMove,
  chooseMoveWithoutPvsOrReductions,
  chooseMoveWithoutReductions,
} from "../../../../src/engine.ts";
import { parseFen } from "../../../../src/fen.ts";
import { ENDGAMES, ROOTS } from "./corpus.ts";

const positions = [...ENDGAMES, ROOTS[2] as [string, string]];
for (const [name, fen] of positions) {
  for (const budget of [5, 10, 20]) {
    const row: Record<string, unknown> = { name, budget };
    for (const [door, choose] of [
      ["shipped", chooseMove],
      ["noRed", chooseMoveWithoutReductions],
      ["pre", chooseMoveWithoutPvsOrReductions],
    ] as const) {
      let t = 0;
      const c = choose(parseFen(fen), { budgetMs: budget, now: () => t++ });
      row[door] = [c?.depth, c?.score, c?.nodes];
    }
    console.log(JSON.stringify(row));
  }
}
