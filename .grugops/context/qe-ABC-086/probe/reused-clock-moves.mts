// QE probe (qe-ABC-086), follow-up to reused-clock.mts: in the two configurations where a reused
// clock's node count differs from a fresh one on 30/30, how many differ in MOVE or DEPTH?
import { chooseMove } from "../../../../src/engine.ts";
import { parseFen } from "../../../../src/fen.ts";
import { virtualClock } from "../../../../src/virtual-clock.ts";
import { label, thirty } from "./corpus.mts";

for (const [step, k] of [[0.1, 1000], [1 / 3, 123457]] as const) {
  let move = 0, depth = 0, nodes = 0;
  const examples: string[] = [];
  for (const { name, fen } of thirty()) {
    const a = chooseMove(parseFen(fen), { budgetMs: 24, now: virtualClock(step) });
    const clock = virtualClock(step);
    for (let j = 0; j < k; j++) clock();
    const b = chooseMove(parseFen(fen), { budgetMs: 24, now: clock });
    if (a === null || b === null) continue;
    if (label(a.move) !== label(b.move)) { move++; examples.push(`${name}: ${label(a.move)}@d${a.depth} vs ${label(b.move)}@d${b.depth}`); }
    if (a.depth !== b.depth) depth++;
    if (a.nodes !== b.nodes) nodes++;
  }
  console.log(`step ${step} k=${k}: move differs ${move}/30, depth differs ${depth}/30, nodes differ ${nodes}/30 ${examples.slice(0, 4).join("; ")}`);
}
