---
id: 20261009T160220Z-architect-design-decision-q2-the-deterministic-budget-is-the-clock-on-virtual-time-0e7e4c4d
kind: decision
by: architect-design
at: 2026-10-09T16:02:20Z
verified_by:
confidence: high
refs:
  - ABC-086
  - ABC-084
  - ABC-085
  - ABC-087
  - ABC-078
  - ADR-0027
  - ADR-0024
  - ADR-0026
  - NFR-004
  - N8-LANE
  - memory-bank/50-decisions/ADR-0027-deterministic-mode-is-the-shipped-engine-on-a-virtual-clock-and-the-seed-does-not-reach-move-selection.md
  - .grugops/context/ruling-abc086-seed/probe/ceiling.jsonl
supersedes:
---

# Q2 ruling: the deterministic budget is the existing `Clock` on virtual time, from a module outside `src/engine.ts`

Hand-authored, no `seal`. Recorded in `ADR-0027` (proposed) decisions 3–6.

## Ruling

- **Deterministic mode is the shipped engine with a virtual clock:**
  `createEngine({ budgetMs, now: <virtual clock> })`, or `chooseMove` with the same options.
  - There is no node budget, no new `EngineOptions` field and no new `src/engine.ts` export.
- **The virtual clock is one small production module outside `src/engine.ts`.**
  - The suggested name is `src/virtual-clock.ts`, with one export, but the name and spelling are
    the Engineer's.
  - The export is a factory that returns a `Clock`. Each reading advances by a fixed positive
    step, and the first reading is 0. That is `src/engine.test.ts`'s `tickingClock`
    (`:121-128`), shipped.
  - It throws on a step that is not finite or not greater than 0, because a frozen clock never
    terminates (`src/engine.ts:109-112`). A fractional step is allowed.
  - Harnesses import it outside any test file. No production module imports it, and `src/cli.ts`
    never does.
  - Its rows go in `src/engine.test.ts`, which avoids the `N8-LANE` 160 ms floor for a new test
    file.
- **The `Clock` comment is re-worded, comment only** (`src/engine.ts:107-112`).
  - "real-time and NON-DECREASING" becomes advancing and non-decreasing: `Date.now` in the shipped
    construction, a virtual clock in deterministic mode.
  - "a test supplies virtual time" becomes "a test or a deterministic-mode harness".
- **`HARD_CEILING_MS` clamps virtual milliseconds unchanged.** The step is the dial.

## Why

- **The virtual clock is already a node budget.**
  - It is read every 1 024 nodes inside the recursion (`:202-208`), plus once at entry, once per
    iteration boundary and once at return.
  - So with a fixed step the abort point is a pure function of the node count. The measured
    rate on kiwipete is 1 013–1 022 nodes per reading.
  - A separate node budget would add a second abort path and an option on a shipped entry point
    (`ADR-0024` decision 7, coding rule 7) for a granularity nothing needs.
- **`ABC-078` `A4`'s pin is untouched.** The export list is unchanged and every
  `chooseMove.length` stays 2.
- **`ADR-0024` decision 7 is untouched.** `now` has existed since `ABC-078`.
- **The ceiling does not bind.** At step 1 it allows 5 002 readings, which is 5 112 572 nodes
  (kiwipete, depth 8). Three real seconds bought about 0.62 M nodes here (depth 7, loaded; not a
  pin).
- **"Real-time" in the contract was never load-bearing.** The termination argument needs readings
  that advance. A real clock is not required. `ABC-078`'s own suite has run on virtual time since
  it merged.
