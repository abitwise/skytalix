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

> **AMENDED 2026-10-29 by BA/PM** (task `bapm-owner-words-b`, records only): the owner set Q4 = (e), extended
> (`orch-2026-10-29g` `…278e149b`). This ticket's reading is now the smoke pair before merge (`EPIC-010` § The
> merge rule), with a batched validation later. Q4 no longer holds it. **Next real wait:** milestone 2's evaluation tickets, the `ADR-0048` data licence and a method ADR. Milestone 3. DoR 7/10 → 8/10.

## Problem

- **User:** the owner at level 5.
- **Pain:** the weights are hand-picked by rule (`src/evaluate.ts:52-145`; `ABC-215`). `ABC-207`'s hand change lost
  (−18.3 ± 16.5).
- **Value:** weights fitted to data, with no runtime learned component (`EPIC-004` non-goal holds: constants only).

## Scope

1. A tuning tool under `tools/` (not shipped in `dist/`): a stated method (for example logistic fit of game results
   against the static eval), on a position set with a recorded licence, split into training and validation.
2. Its output: a constants file in `src/` with the provenance header `ABC-215` set.
3. Validation outside, never self-play alone (`RISK-EPIC010-05`): the smoke pair and, before the merge, its batched R pair (A6).

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
- **A6 (the reading).** The smoke pair of `EPIC-010` § The merge rule (owner Q4 = (e), extended, 2026-10-29), on the candidate head rebased on `main`, before the merge: S-1 0 faults, S-2 0 losses on time, S-3 D ≥ 3.0 of 10 (else ≥ 7.0 of 20), S-4 R ≥ 3.0 of 10 (else ≥ 7.0 of 20). **And its batched validation is read before the merge, not after:** an interleaved R
  pair (`ABC-225`), the candidate head against its merge-base, 200 + 200 games; merge only if it is not LOSS
  (X + Y ≥ 0). Why: a tuned set judged by self-play alone repeats `EPIC-008`'s failure, and this ticket is alone in
  milestone 3, so its batch costs the same hours before the merge as after it, and needs no revert. BA/PM's delivery
  call (2026-10-29), inside the owner's rule. Reported: each smoke's W/L/D and score, the ledger's pooled R score since the last batch, the pair's X ± Y and pentanomial, `G11`.

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

- `ABC-231`, `ABC-232` Done or closed. `ADR-0048` (data licence). A method ADR. **Owner:** Q4 answered 2026-10-29: (e), extended (`orch-2026-10-29g` `…278e149b`).

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ SA 8b |
| 2 | scope and out-of-scope | ✅ constants only |
| 3 | INVEST | ⚠ L; depends on milestone 2 |
| 4 | testable, measurable acceptance | ✅ every row measurable; A6 is the smoke pair (`EPIC-010` § The merge rule, S-1–S-4) |
| 5 | dependencies known | ✅ |
| 6 | NFR triggers with targets | ✅ `G2` ≤ 1.02 × |
| 7 | test notes | ✅ 2 |
| 8 | size | ✅ L |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ❌ data licence; ADR; milestone 2 |

**DoR 8/10 (re-scored 2026-10-29). Backlog.**
