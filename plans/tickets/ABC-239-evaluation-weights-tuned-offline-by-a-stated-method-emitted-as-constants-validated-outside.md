---
id: ABC-239
title: "The evaluation's weights are tuned offline by a stated method on a licensed position set, emitted as constants, and validated against an outside opponent"
status: backlog
column: Backlog
size: L
priority: P3
epic: EPIC-011
---

# ABC-239: offline tuning of the evaluation weights

> **RE-HOMED 2026-11-01 to `EPIC-011` by BA/PM** (task `bapm-epic011-dedupe`, records only, at `main` `2e9a2457`). The
> owner asked for a new epic for the 3 000 path, started after the open epics close, and for no work done twice
> (`orch-2026-10-30a` `…022fb66f`). `ADR-0056` D4 maps this ticket to its gap list, so it leaves `EPIC-010` rather
> than holding that epic's close. **Id unchanged; nothing below this block is edited.** `ADR-0056` row E2, "the
> largest single eval lever". `EPIC-011` Phase 4, after E1. **Its wait on "milestone 2's evaluation" becomes a wait on
> E1** (the full taper, which folds `ABC-231`/`ABC-232`). The data question is now the owner's Q-3K-7 (own games
> allowed by default, as its `A1`; Lichess CC0 exports; a Stockfish-labelled set raises a product-identity question).
> `ADR-0056`: M0's games (`ABC-255`) may serve as data.

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
3. Validation outside, never self-play alone (`RISK-EPIC010-05`): ~~the smoke pair and, before the merge, its batched R pair (A6)~~ *2026-11-01:* the 100-game read and, asked of the owner first, the 400-game pair against Stockfish before the merge (A6).

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
- **A6 (the reading).** *(2026-11-01, the owner's rule, `bapm-100-400-rule`; replaces the smoke pair and the 200 + 200 R pair at 4 000 ms that this row named.)* One 100-game read at 100 ms a move before the merge (`EPIC-011` § The per-change rule): the candidate head rebased on `main` against its merge-base, self-play, openings 1–50 with both colours, one game at a time, through `ABC-255`. 100 of 100 games complete, the candidate makes 0 faults and loses 0 games on time, and the score meets the `ADR-0056` fold's pass line (`arch-adr0056-100ms-fold`, pending; `UNKNOWN - verify` until merged). **And an outside read before the merge** (a tuned set judged by self-play alone repeats `EPIC-008`'s failure, `RISK-EPIC010-05`): the 400-game pair at 100 ms against Stockfish, the candidate head against its merge-base (`EPIC-011` § The per-change rule, the epic shape), graded by the fold's epic pass line. It is not the owner-set epic read and is estimated over 1 h (≈ 1.3–2 h), so **it is asked of the owner before it starts**; if he declines, this ticket merges on the 100-game read and the epic's 400-game read is its outside check. Reported: W/L/D, score and Elo ± error of each read, the pair's X ± Y, `G11`.

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
| 4 | testable, measurable acceptance | ✅ every row measurable; A6 is the 100-game read plus, on the owner's yes, the 400-game outside pair (pass lines: the `ADR-0056` fold's, pending) *(2026-11-01)* |
| 5 | dependencies known | ✅ |
| 6 | NFR triggers with targets | ✅ `G2` ≤ 1.02 × |
| 7 | test notes | ✅ 2 |
| 8 | size | ✅ L |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ❌ data licence; ADR; milestone 2 |

**DoR 8/10 (re-scored 2026-10-29). Backlog.**
