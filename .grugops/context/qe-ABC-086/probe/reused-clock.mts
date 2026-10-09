// QE probe (qe-ABC-086, follow-up to mutants R3/R4): does a REUSED clock (one that has already
// been read k times — what `createEngine` does across a game) choose what a FRESH clock chooses?
// With an exact step (1, 0.5) the readings are exact and the abort point is relative, so it must.
// With a non-dyadic step (0.1, 0.3, 1/3) `start + budget` and the accumulated readings round
// differently from a fresh clock's, and the abort point can move by one reading. For each step,
// the shared 30 at budget 24, against clocks pre-advanced by k in {1, 37, 1000, 123457} reads.
import { chooseMove } from "../../../../src/engine.ts";
import { parseFen } from "../../../../src/fen.ts";
import { virtualClock } from "../../../../src/virtual-clock.ts";
import { label, thirty } from "./corpus.mts";

const BUDGET = 24;
const corpus = thirty();
const sig = (c: ReturnType<typeof chooseMove>) =>
  c === null ? "null" : `${label(c.move)} d${c.depth} n${c.nodes}`;
for (const step of [1, 0.5, 0.1, 0.3, 1 / 3]) {
  const fresh = corpus.map(({ fen }) => sig(chooseMove(parseFen(fen), { budgetMs: BUDGET, now: virtualClock(step) })));
  const parts: string[] = [];
  for (const k of [1, 37, 1000, 123457]) {
    const diffs: string[] = [];
    corpus.forEach(({ name, fen }, i) => {
      const clock = virtualClock(step);
      for (let j = 0; j < k; j++) clock();
      const got = sig(chooseMove(parseFen(fen), { budgetMs: BUDGET, now: clock }));
      if (got !== fresh[i]) diffs.push(`${name}: fresh ${fresh[i]} | reused ${got}`);
    });
    parts.push(`k=${k}: ${diffs.length}/30 differ`);
    for (const d of diffs.slice(0, 3)) console.log(`  step ${step} k=${k} ${d}`);
  }
  console.log(`step ${step}: ${parts.join(", ")}`);
}
