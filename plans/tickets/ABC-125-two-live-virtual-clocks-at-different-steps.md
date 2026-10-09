---
id: ABC-125
title: Two live virtual clocks at different steps — the row that kills a module-level step
status: backlog
column: Backlog
size: XS
priority: P1
epic: EPIC-004
feature: —
---

# ABC-125 — one default-lane row, so a clock's step cannot leak between instances unseen

> **Cut 2026-10-09 by BA/PM** (task `wave-2026-09-25`, subtask `cut-followups-2026-10-09`,
> Workflow 07) from QE's `ABC-086` gap **G-QE-1**
> (`.grugops/context/qe-ABC-086/notes/20261009T202646Z-qe-e2e-decision-abc086-verdict-pass-with-findings-8df281c8.md`,
> mutant table in `…-own-mutants-0df7078c.md`). The code is correct; this is a test gap. The
> routing note is `.grugops/context/cut-followups-2026-10-09/notes/`.

## Problem

*User*: whoever builds on `ABC-086`'s virtual clock with more than one clock alive at once. That is
`ABC-085`'s ladder: two engines, each on its own clock, and its levels may use different steps.

*Pain*: QE planted twelve mutants in `src/virtual-clock.ts`. **One survives both lanes: `M5`,
where the step is module state and the last factory call's step wins.** Every row that builds two
clocks gives them the same step (the state row uses 1 and 1; `A6`'s interleaved row uses 1 and 1
at different budgets). `ABC-086` `A6`'s text says "different budgets or steps", and no row runs
different steps. The `A6` interleaved row cannot see clock state at all, by construction: the
engine's deadline is relative to its own entry reading.

*Value*: the next ticket that runs two clocks at different steps finds the leak in a 0 ms row,
instead of as unexplained node-count drift in a 5-hour ladder.

## Scope

- **One default-lane row** in `src/engine.test.ts`, inside `describe("ABC-086 A6 — each virtual
  clock keeps its own state")`: two live clocks at **different** steps, read interleaved. QE's
  verified shape: `a = virtualClock(1)`, `b = virtualClock(0.5)`, and
  `[a(), b(), a(), b(), a(), b()]` equals `[0, 0, 1, 0.5, 2, 1]`.
- Nothing else.

## Out of scope

- **Any change to `src/virtual-clock.ts` or any other production file.** The module is correct.
- **QE's `G-QE-2` (small positive steps, units slips) and `G-QE-3` (`A4` aliasing).** `G-QE-2` is
  folded into `ABC-084` `A4`'s step guard already. `G-QE-3` is mitigated and has no home here.
- **The `ENGINE_DEEP` interleaved row.** It guards engine state (transposition table, killers),
  which it does catch (QE `R2`). It is not this ticket's.

## Acceptance (Given/When/Then)

- **`A1` (the row exists and is green on the shipped module).** **Given** two clocks built by
  `virtualClock(1)` and `virtualClock(0.5)`, both still alive, **when** they are read alternately,
  three reads each, **then** the six readings equal **`[0, 0, 1, 0.5, 2, 1]`** exactly (`toEqual`).
  It runs in the default lane, not behind `ENGINE_DEEP`.
- **`A2` (the row kills `M5` — the criterion this ticket exists for).** **Given** QE's `M5` (the
  step held at module level, so the last factory call's step wins) planted in a scratch copy or
  reverted by `git checkout`, **when** `src/engine.test.ts` runs on the default lane, **then** the
  new row is **red**, and it is green again once the mutant is removed. The PR note records both
  runs (command, exit code, the failing row's name). `src/` is clean afterwards
  (`git status --porcelain -- src` reads only `src/engine.test.ts`).
- **`A3` (test-only).** **Then** `git diff --numstat <base>...<tip> -- src` lists
  **`src/engine.test.ts` only**, and `src/virtual-clock.ts` is byte-identical. Lint, typecheck,
  build and `npm test` exit 0; skip count 0; `test-skip-integrity.js` reports `No findings.`

## Dependencies

- **`ABC-086` — `Done`** (merged `3f26e21`). The module and the `A6` describe block exist.
- **Downstream, hard: `ABC-085` must not build before this lands.** Its `A5` runs two engines,
  each on its own clock. *(Carried on `ABC-085`'s page.)*
- **Downstream, soft: `ABC-087` should not build before this lands.** Its `A10` runs two level
  instances, each on its own clock, interleaved. Not written on `ABC-087`'s page; the Orchestrator
  sequences it.
- **`ABC-084` (In Development) is not a conflict.** It builds a fresh clock per move, one at a time,
  and its scope does not name `src/engine.test.ts`. `src/engine.test.ts` is not on `ABC-084`'s
  trigger list (`src/engine.ts` is a literal path), so no puzzle-suite run is owed here.

## Security / NFR triggers

- **`N8-LANE` — ≤ 650 ms CPU net.** Six closure reads and no search: about 0 ms. No new test file,
  so no per-file floor.
- **`NFR-004`, `NFR-005` — not triggered.** No production line changes.
- **Security — not triggered.** No input surface.

## Test notes

1. **Write the row, plant `M5`, see it red, then remove `M5`.** A row that has never gone red
   proves nothing (`A2`). QE's runner and its `M5` patch are in
   `.grugops/context/qe-ABC-086/probe/` (`mutants.mjs`, `m5-remedy/`).
2. **Use different steps, not just different budgets.** That is the whole gap. Steps 1 and 0.5 are
   dyadic, so the readings are exact and `toEqual` is safe (QE: a non-dyadic step rounds).
3. **BA/PM re-read the shipped shape** at `7b54dae`: `[0,0,1,0.5,2,1]`, match
   (`.grugops/context/cut-followups-2026-10-09/probe/clock-steps.out.txt`).

## Size and priority rationale

**Size `XS` (1).** One row, about eight lines, in an existing describe block, with a verified
expected value and a named mutant to prove it.

**Not `XL`. No `SPLIT_REQUIRED`.**

**Priority `P1`.** QE rated it LOW–MEDIUM. It is a hard prerequisite of `P1` `ABC-085`, and a
prerequisite should not be ranked below the ticket that waits on it (the same pairing `ABC-087`
states with `ABC-085`). It is pullable today and costs almost nothing.

## Definition of Ready

Assessed by BA/PM, **2026-10-09**, against the wave tip `7b54dae`. **Result: 10 of 10, no ⚠️ —
MET.** The page is left at `Backlog`; the `Ready` move is the Orchestrator's on the board.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** a named surviving mutant (`M5`), the consumer that would hit it (`ABC-085`), and why the existing rows cannot see it |
| 2 | scope and out-of-scope clear | **✅** one row in one describe block; production code, `G-QE-2`/`G-QE-3` and the deep row fenced out |
| 3 | INVEST-shaped | **✅** independent (`ABC-086` `Done`), small, testable; valuable as the guard `ABC-085` builds on |
| 4 | acceptance testable and measurable | **✅** an exact six-reading array, a mutant that must go red and then green, a one-file `numstat` |
| 5 | dependencies known | **✅** upstream `Done`; downstream hard (`ABC-085`) and soft (`ABC-087`); `ABC-084` ruled not a conflict |
| 6 | security/NFR triggers with a measurable target | **✅** `N8-LANE` ≤ 650 ms (≈ 0 ms, no new file); `NFR-004`/`NFR-005` not triggered, with the reason |
| 7 | test notes present | **✅** three |
| 8 | size assigned | **✅** `XS` (1) |
| 9 | priority assigned | **✅** `P1`, with the reason |
| 10 | no major unresolved blocker | **✅** none: the expected value is measured, and the mutant and runner exist |

## Delivery

**2026-10-09, Software Engineer** (task `wave-2026-09-25`, subtask `ticket-to-pr-ABC-125`).
Branch `grugops/ABC-125-two-clocks` from `928c83b`, code in `6a25164`. Not merged, not pushed.
Readings and raw files: `.grugops/context/ticket-to-pr-ABC-125/notes/`.

**Criteria: 3 of 3 met.**

| # | verdict | reading |
|---|---|---|
| `A1` | MET | One default-lane row in the `ABC-086 A6` describe: `[0, 0, 1, 0.5, 2, 1]` by `toEqual`, 0 ms |
| `A2` | MET | `M5` planted in the shipped module: `npx vitest run src/engine.test.ts` exit 1, 1 failed / 32 passed, this row red (received `[0, 0, 0.5, 0.5, 1, 1]`). Reverted: exit 0, 33 passed. `src/` status afterwards: `src/engine.test.ts` only |
| `A3` | MET | numstat `src/engine.test.ts` +8/−0 only; `src/virtual-clock.ts` byte-identical. Lint, typecheck, build exit 0; `npm test` 49 files / 1531 passed / 0 skipped; integrity `No findings.` |

**`N8-LANE`: −350 ms net (−0.97 %, sign 4/8), MET.** Null −0.40 %, 4/8, so the run is
admissible. 0 new files. M3 under load1 24–45.

**Owed:** the QE hop, the `In Review` move (Orchestrator) and the merge.
