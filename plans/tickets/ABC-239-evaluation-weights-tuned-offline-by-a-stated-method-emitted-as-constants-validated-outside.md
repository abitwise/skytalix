---
id: ABC-239
title: "The evaluation's weights are tuned offline by a stated method on a licensed position set, emitted as constants, and validated against an outside opponent"
status: backlog
column: Backlog
size: L
priority: P3
epic: EPIC-010
---

# ABC-239: offline tuning of the evaluation weights

> **Cut 2026-10-29 by BA/PM** (task `bapm-epic010-improvements`, records only, at `main` `f45aea95`). § B item 8,
> verified (SA `…306a4012` rows 8a, 8b): every table is written from a stated rule, never tuned. Never tried.
> **Waits in Backlog on** milestone 2's evaluation tickets (§ B item 8: "after the phase-aware design settles"), a data
> licence ruling (`ADR-0048`), a method ADR, and the owner's Q4. Milestone 3, the last pull.

## Problem

- **User:** the owner at level 5.
- **Pain:** the weights are hand-picked by rule (`src/evaluate.ts:52-145`; `ABC-215`). `ABC-207`'s hand change lost
  (−18.3 ± 16.5).
- **Value:** weights fitted to data, with no runtime learned component (`EPIC-004` non-goal holds: constants only).

## Scope

1. A tuning tool under `tools/` (not shipped in `dist/`): a stated method (for example logistic fit of game results
   against the static eval), on a position set with a recorded licence, split into training and validation.
2. Its output: a constants file in `src/` with the provenance header `ABC-215` set.
3. Validation outside: the Q4 rule's outside reading, never self-play alone (`RISK-EPIC010-05`).

## Out of scope

- A runtime network or any learned runtime component. New terms. Tuning search parameters.

## Acceptance criteria

- **A1 (licence).** **Given** the position set, **then** its source and licence are recorded and accepted under
  `ADR-0048` before any fit runs. Positions from this project's own games are allowed by default.
- **A2 (split).** **Then** training and validation sets share no game; the fit's loss on validation is reported and
  is ≤ the hand weights' loss on the same set.
- **A3 (constants only).** `dist/` holds no tuning code (`git diff` on the built tree); `src/` gains constants only.
- **A4 (relations).** `G3` mirror and purity; `G2` ≤ base × 1.02 (only constants change).
- **A5 (gates).** `G1`, `G5`, `G6` "≥ base" (floor 6), `G8`, `G9`, `G10`.
- **A6 (the reading).** The Q4 rule, with its outside reading **required** whatever Q4's option (a tuned set judged by
  self-play alone repeats `EPIC-008`'s failure). If Q4 is (a), BA/PM asks the owner before this ticket leaves Backlog.

## NFR triggers

- **`NFR-008`:** the tool's tests outside the default lane. **`G2`:** A4. **Security:** the tool reads local files
  only; no network fetch at run time.

## Test notes

1. The fit is reproducible from a seed; the seed and the set's hash are recorded.
2. UAT is owed. The QE verdict signs it.

## Size and priority

- **Size: L.** A tool, a data set and its licence, a fit, a validation. Not split: each part alone ships nothing
  measurable. If design shows more than one new tool module, BA/PM splits the data set into its own ticket from the
  pool.
- **Priority: P3.**

## Dependencies

- `ABC-231`, `ABC-232` Done or closed. `ADR-0048` (data licence). A method ADR. **Owner:** Q4.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ SA 8b |
| 2 | scope and out-of-scope | ✅ constants only |
| 3 | INVEST | ⚠ L; depends on milestone 2 |
| 4 | testable, measurable acceptance | ⚠ A6 is Q4's |
| 5 | dependencies known | ✅ |
| 6 | NFR triggers with targets | ✅ `G2` ≤ 1.02 × |
| 7 | test notes | ✅ 2 |
| 8 | size | ✅ L |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ❌ data licence; ADR; Q4; milestone 2 |

**DoR 7/10. Backlog.**
