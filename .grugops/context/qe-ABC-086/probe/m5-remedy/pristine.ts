/**
 * Deterministic mode's clock (`ABC-086`, `ADR-0027` decisions 3-4).
 *
 * Deterministic mode is the shipped engine on virtual time:
 * `createEngine({ budgetMs, now: virtualClock(step) })`, or `chooseMove` with the same options.
 * The same position, budget and step choose the same move every time, because the engine reads
 * the clock every `NODES_PER_CLOCK_CHECK` nodes and the abort point becomes a node count.
 *
 * A VIRTUAL MILLISECOND IS NOT A REAL ONE. The depth reached here says nothing about the depth
 * reached in three real seconds; `NFR-005` stays measured on the wall clock. `HARD_CEILING_MS`
 * clamps a virtual budget like a real one (decision 6) — the step is the dial.
 *
 * For harnesses (`ABC-084`, `ABC-085`, `ABC-087`) and tests. No production module imports it, and
 * `src/cli.ts` never does (`ABC-086` `A5`). It reads no real clock and no entropy (`A4`).
 */



/**
 * A clock whose first reading is 0 and whose every reading advances by `stepMs`. Its state is
 * this closure's own — two clocks never share a reading (`A6`).
 *
 * Throws on a step that is not finite or not greater than 0: a frozen clock never lets the
 * deepening loop terminate (the `Clock` contract), so a harness typo must fail loudly rather
 * than hang. A fractional step is allowed.
 */
export function virtualClock(stepMs: number) {
  if (!(Number.isFinite(stepMs) && stepMs > 0)) {
    throw new RangeError(`virtualClock: step must be finite and > 0, got ${stepMs}`);
  }
  let reading = 0;
  return () => {
    const current = reading;
    reading += stepMs;
    return current;
  };
}
