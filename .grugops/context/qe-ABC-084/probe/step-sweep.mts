// QE probe (qe-ABC-084, focus 3 / A4): the shipped engine in ADR-0027 deterministic mode at the
// baseline's budget (25) and OTHER steps, under plain `node` (not vitest), a fresh clock per move.
// Step 1 is the control: its 40 lines must equal the vitest gating run's rows byte for byte.
// Prints rows in the suite's own format plus a per-step summary against the bars
// (gate >= 40, A1 10/10 mates, A2 <= 1 losing of 24).
// Usage (worktree root): node .grugops/context/qe-ABC-084/probe/step-sweep.mts <step> [<step> ...]
import { chooseMove } from "../../../../src/engine.ts";
import { parseFen } from "../../../../src/fen.ts";
import { squareName } from "../../../../src/position.ts";
import { PUZZLES } from "../../../../src/puzzle-corpus.ts";
import { virtualClock } from "../../../../src/virtual-clock.ts";

const budgetMs = 25;
for (const stepMs of process.argv.slice(2).map(Number)) {
  const t0 = performance.now();
  let solved = 0;
  let mates = 0;
  let losing = 0;
  for (const p of PUZZLES) {
    const c = chooseMove(parseFen(p.fen), { budgetMs, now: virtualClock(stepMs) });
    const chosen = c === null ? "null" : `${squareName(c.move.from)}${squareName(c.move.to)}`;
    const ok = p.kind === "do-not-hang" ? chosen !== p.losing : p.accept.includes(chosen);
    if (ok) solved++;
    if (ok && p.kind === "mate-in-2") mates++;
    if (!ok && p.kind === "do-not-hang") losing++;
    console.log(`${ok ? "SOLVED" : "MISSED"}\t${p.kind}\t${chosen}\td${c?.depth ?? 0}\tn${c?.nodes ?? 0}\t${p.name}`);
  }
  const wall = ((performance.now() - t0) / 1000).toFixed(2);
  const inside = solved >= 40 && mates === 10 && losing <= 1;
  console.log(`STEP ${stepMs} (readings/move ${budgetMs / stepMs}): solved ${solved}/40, mates ${mates}/10, losing ${losing}/24, ${inside ? "INSIDE" : "OUTSIDE"} the bars, wall ${wall} s`);
}
