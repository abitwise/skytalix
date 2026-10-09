---
id: 20261009T193917Z-software-engineer-decision-abc086-virtual-clock-module-comment-only-engine-rows-89bbd170
kind: decision
by: software-engineer
at: 2026-10-09T19:39:17Z
verified_by: 
confidence: high
refs:
  - ABC-086
  - ADR-0027
  - ABC-078
  - ABC-084
  - ABC-085
  - ABC-087
  - src/virtual-clock.ts
  - src/engine.ts
  - src/engine.test.ts
  - plans/tickets/ABC-086-deterministic-move-selection-under-a-fixed-seed.md
supersedes: 
---

# `ABC-086` build decisions — `virtualClock`, a comment-only `engine.ts`, rows in `engine.test.ts`

Hand-authored, no seal (degraded posture, `AGENTS.md`). Base `1d74693`, code commit `1ae5284`.

## D1 — the module: `src/virtual-clock.ts`, one export `virtualClock(stepMs): Clock`

- First reading 0, each reading `+stepMs`. The state is a closure `let`, never module state.
- Guard: `!(Number.isFinite(stepMs) && stepMs > 0)` throws `RangeError`. That covers `0`, `-1`,
  `NaN` and `±Infinity`. A fractional step is allowed.
- `import type { Clock } from "./engine.ts"` is type-only. It is erased at runtime, so the module
  has no runtime edge to the engine, and the engine has no edge to it.
- Name: the ADR's suggested path. The factory is named for what it returns, as `tickingClock` was.

## D2 — `src/engine.ts`: comment lines only

- `:107-112` now reads "the wall clock in the shipped construction, a virtual clock
  (`src/virtual-clock.ts`) in deterministic mode — which a test or a deterministic-mode harness
  supplies". The contract is "ADVANCING and NON-DECREASING". The termination sentence is
  byte-identical.
- The `now` field comment (`:148`, now `:150-153`) is re-worded to match. The ticket permits this.
- **The re-word deliberately avoids the literal token `Date.now`.** `A4` is a grep of the
  delivered `src/` diff for `Date.now`, and a comment that kept the token would be a hit. So the
  comment says "the wall clock". The single implementation is still `options.now ?? Date.now`, now
  at `:457` (it was `:452`; it moved 5 lines because of the comment growth).
- No export, signature or behaviour changed. `ABC-078` `A4`'s export pin is untouched and green.

## D3 — the test rows

- **`ABC-078`'s `tickingClock` is kept** (coding rule 9). Every `ABC-086` row uses `virtualClock`.
- **`thirtyPositions` was hoisted out of the `RUN_DEEP` block** so that both lanes share one
  corpus. The body is unchanged and the doc comment gained one sentence.
- **`A1`:**
  - The default lane runs 30 × 2 at budget 2.
  - The deep lane runs 30 × 10 at **budget 24**. The probe read 27/30 at depth ≥ 4 there; budget 8
    read 15/30 and budget 16 read 16/30, both too close to the criterion's "at least half" to
    survive a change to the evaluation.
  - The depth floor (≥ 15/30) is ASSERTED in its own row.
  - Each run uses a fresh position (via FEN) and a fresh `virtualClock(1)`.
- **`A2`** runs kiwipete 10 times at `DEFAULT_BUDGET_MS` with no `now`.
  - It asserts that each move is legal and logs move, depth and elapsed time.
  - The reason it must never assert identity is written in the test file (test note 2).
  - "The shipped wall-clock budget" is read as the shipped budget on the shipped clock. That is
    the stricter of the two readings, and it costs 30 s in the deep lane.
- **`A4`** is a source row: `src/virtual-clock.ts` carries no real-clock read and no entropy.
  The diff-level grep is evidence, not a test.
- **`A5`:**
  - (i) is a source row: `src/cli.ts` contains `createEngine({ budgetMs: DEFAULT_BUDGET_MS })`.
  - (ii) walks `src/cli.ts`'s relative imports to a fixed point: static, type-only and dynamic.
    It asserts that `engine.ts` IS reached (the denominator) and `virtual-clock.ts` is NOT.
  - (iii) is git evidence, not a test.
- **`A6`:**
  - Engine A is `budgetMs 1` and engine B is `budgetMs 3`, both at step 1.
  - The corpus is the 10 positions of the `position-3` and `position-4` families.
  - A row asserts that the two engines DIFFER somewhere (3/10 at the base), so the equal-output
    case is not trivial.
  - A second row checks the per-instance clock state directly: a second clock reads 0 after the
    first has advanced.
- **`A7`** asserts at the factory only, and never hands the engine a zero step.
