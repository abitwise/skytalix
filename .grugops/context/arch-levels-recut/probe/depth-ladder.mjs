// Architect/Design probe, subtask arch-levels-recut (task wave-2026-09-25). Read-only use of src/; writes
// nothing but stdout. VIRTUAL CLOCK ONLY: no wall-clock reading is taken or printed.
//
// Usage (from this directory): node depth-ladder.mjs sweep [step]   -> one JSON line per corpus position
//                              node depth-ladder.mjs check [step]   -> direct chooseMove at named budgets,
//                                                                      for comparison with the sweep
//
// sweep: for k = 1, 2, ... call chooseMove(position, { budgetMs: 5000, maxDepth: k, now: counting clock }).
//   The counting clock is virtualClock(step)'s arithmetic (reading i is i * step) with a read counter. With
//   maxDepth = k and every iteration completed, the reads are: entry, one loop check before each of
//   iterations 2..k, the in-iteration reads (every NODES_PER_CLOCK_CHECK nodes from iteration 2), the loop
//   check after k (the clock is read before maxDepth is compared, src/engine.ts deepen), and the return.
//   So the last read at or before the end of iteration k has index T_k - 3, and a budget-b search at this
//   step completes iteration k iff (T_k - 3) * step < b (reads are made at node counts, not at clock
//   values, so the budget-b search is a prefix of this one up to its abort). The sweep stops at the first
//   k the 5 000 ms ceiling aborts, or at k = 40 (a mate-solved line), whichever comes first.
// check: chooseMove(position, { budgetMs: b, now: virtualClock(step) }) for b in CHECK_BUDGETS on the first
//   CHECK_POSITIONS corpus positions; the analysis compares move and depth with the sweep's prediction.
import { chooseMove } from "../../../../src/engine.ts";
import { buildCorpus } from "../../../../src/evaluate.mirror-corpus.ts";
import { virtualClock } from "../../../../src/virtual-clock.ts";

const mode = process.argv[2];
const step = Number(process.argv[3] ?? 4);
// BA/PM's 50-position set, as ADR-0038's probe (design-ABC-085/probe/ladder-step.mjs) took it.
const corpus = () => buildCorpus().filter((e, i) => !e.name.includes("child") || i % 4 === 0);
const label = (m) => `${m.from}-${m.to}${m.promotion ? `=${m.promotion}` : ""}`;
const CEILING = 5000;
const K_CAP = 40;
const CHECK_BUDGETS = [100, 170, 500, 1500, 4500];
const CHECK_POSITIONS = 12;

if (mode === "sweep") {
  for (const { name, position } of corpus()) {
    const iters = [];
    for (let k = 1; k <= K_CAP; k++) {
      let reads = 0;
      const now = () => reads++ * step;
      const c = chooseMove(position, { budgetMs: CEILING, maxDepth: k, now });
      if (c.depth < k) break; // the ceiling aborted iteration k
      iters.push({ k, T: reads, move: label(c.move), score: c.score, nodes: c.nodes });
    }
    console.log(JSON.stringify({ name, step, iters }));
  }
} else if (mode === "check") {
  const out = [];
  for (const { name, position } of corpus().slice(0, CHECK_POSITIONS)) {
    for (const b of CHECK_BUDGETS) {
      const c = chooseMove(position, { budgetMs: b, now: virtualClock(step) });
      out.push({ name, b, step, move: label(c.move), depth: c.depth, nodes: c.nodes });
    }
  }
  for (const row of out) console.log(JSON.stringify(row));
} else {
  console.error("usage: node depth-ladder.mjs <sweep|check> [step]");
  process.exit(2);
}
