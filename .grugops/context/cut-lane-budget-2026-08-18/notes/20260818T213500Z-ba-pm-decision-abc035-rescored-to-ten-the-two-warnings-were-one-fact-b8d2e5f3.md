---
id: 20260818T213500Z-ba-pm-decision-abc035-rescored-to-ten-the-two-warnings-were-one-fact-b8d2e5f3
kind: decision
by: ba-pm
at: 2026-08-18T21:35:00Z
verified_by:
confidence: high
refs:
  - ABC-035
  - ABC-033
  - plans/tickets/ABC-035-in-game-commands.md
supersedes:
---

# `ABC-035` DoR RE-SCORED: **9/10 ⚠️x1 → 10 of 10, 0 ⚠️.** Both marks were ONE fact and it is discharged by measurement — and the overdue re-score is corrected in place rather than backdated

**This is not a stamp.** Hand-authored `decision`; no `finding` is admissible on this install.

## The discharge, measured rather than asserted

Items **3** (INVEST — not fully independent) and **10** (no major unresolved blocker) both carried
a ⚠️, and both said the same thing in two places: `ABC-035` classifies in front of `ABC-033`'s
entry point and must land after it.

| fact | measured at |
|---|---|
| `ABC-033` merged to `main` | `0d0f635` — *"Merge branch 'grugops/abc033-repair2' - ABC-033 one prompt, both formats"* |
| `resolveMoveInput` exported on `main` | `src/move-input.ts:149` |
| suite at the time of the pull | **1049 tests / 36 files, skip 0** |

The ticket that stood in front of this one is behind it. **New result: 10 of 10, 0 ⚠️.**

## What I did NOT do, and it is the point of the hop

**I did not backdate anything and I did not touch one acceptance criterion.** The board row records
the Orchestrator writing, at the pull, that *"the page still reads 9/10 ⚠️ x1; re-scoring it is
BA/PM's pen and has not happened — I pulled on the measured fact, not on a re-scored page, and that
is recorded here rather than smoothed"*. **That sentence is left standing on the board and
corrected in place.** He was right to pull on the measured fact and right not to re-score with a
pen that is not his; this hop is that pen arriving late, and the lateness stays visible.

`ABC-035` has since been built and sits in `In Review` at `e01033f` (`src/command-input.ts` +142,
`src/command-input.test.ts` +539). **None of its eight criteria is re-scored here** — the delivery
evidence is the engineer's and QE's.

## A smaller arithmetic correction, recorded because it was load-bearing for nobody and confusing for everybody

The 2026-08-13 header read *"9 of 10 clean, 1 recorded ⚠️"* while the table below carried **two**
⚠️ marks. **That was not a miscount** — the two marks were counted as the single fact they are.
Strictly, the table said 8 of 10 *marks* clean and the header said 9 of 10 *items*. **Today both
readings agree at 10**, so the discrepancy is retired by the re-score rather than by an edit to
history: the 2026-08-13 block is retained verbatim underneath the new one.
