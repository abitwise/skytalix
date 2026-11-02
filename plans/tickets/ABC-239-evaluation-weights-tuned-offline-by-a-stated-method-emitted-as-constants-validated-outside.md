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
3. Validation outside, never self-play alone (`RISK-EPIC010-05`): ~~the smoke pair and, before the merge, its batched R pair (A6)~~ *2026-11-01:* the 100-game read and, asked of the owner first, the 400-game pair against Stockfish before the merge (A6). *2026-11-01 (`bapm-owner-answers`): the 100-game read, the 10-game Stockfish smoke at 0.5 s, and, asked of the owner first, a 200 + 200 pair against Stockfish at 0.5 s before the merge (A6).*

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
- **A6 (the reading).** *(2026-11-01, the owner's rule, `bapm-100-400-rule`; replaces the smoke pair and the 200 + 200 R pair at 4 000 ms that this row named.)* One 100-game read at 100 ms a move before the merge (`EPIC-011` § The per-change rule): the candidate head rebased on `main` against its merge-base, self-play, openings 1–50 with both colours, one game at a time, through `ABC-255`. 100 of 100 games complete, the candidate makes 0 faults and loses 0 games on time at the 50 ms margin, and the score meets `ADR-0056` C2′ (merged `94f1504c`): ≥ 50.0 of 100 for a GAIN, ≥ 43.0 for a NEUTRAL, the intent declared at design. A miss is NOT MET and is not re-played. *(2026-11-01, `bapm-owner-answers`, the owner's answers 1 and 3: the epic read is now 400 games head-to-head, so it is no longer an outside check, and the pair this row named has no epic shape left to borrow.)* **And the Stockfish smoke beside it:** 10 games, the candidate at 0.5 s a move against Stockfish 19 `UCI_LimitStrength`, through `ABC-255` (`EPIC-011` § The per-change rule): 10 of 10 complete, 0 faults, 0 losses on time, and S-4 at ~~E 1 650~~ *E 1 810 (2026-11-02, `bapm-records-1102c`; `ADR-0056` S′ amendment)*: ≥ 3.0 of 10, below that 10 more games and ≥ 7.0 of 20 (`ADR-0056` S′; `skytalix` `timemargin` 50 ms; ~~`r <candidate> <out> --budget-ms 500 --rounds 5 --concurrency 1`~~ `r <candidate> <out> --elo 1810 --budget-ms 500 --rounds 5 --concurrency 1`) *(was the fold's bar, `UNKNOWN - verify`; merged `a0f9297e`, `bapm-reconcile-adr0056`)*. *(2026-11-01, `bapm-reconcile-adr0056`, `ADR-0056` R-TC part 2: the owner's "works on different difficulty settings".)* **And the Levels deep lane on the candidate head:** `ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/levels.test.ts --reporter=verbose`, QE, host alone, beside the 100-game read (≈ 9 min): exit 0 with every test passed (41 at `ADR-0056`'s count; QE counts its own run). A failure is a defect, back to the Software Engineer. **And an outside read before the merge, asked of the owner first** (a tuned set judged by self-play alone repeats `EPIC-008`'s failure, `RISK-EPIC010-05`): the interleaved pair (`rpair`), the candidate head against its merge-base, each 200 games against Stockfish 19 `UCI_LimitStrength` at the 0.5 s smoke control (`ABC-255`), one game at a time; MET when the pair's point estimate is ≥ 0 (C3′'s decision rule, kept for this owner-asked pair; *2026-11-01, `bapm-reconcile-adr0056`: the merged fold, `a0f9297e`, supersedes C3′ only as the epic read, by C3″*); *(`bapm-reconcile-adr0056`: the fold gives the 0.5 s control to `r` alone (`--budget-ms 500`) and leaves `rpair` unchanged, so on the owner's yes this pair is two `r <build> <out> --budget-ms 500 --rounds 100 --concurrency 1` reads, the candidate then its merge-base, not interleaved, unless a harness ticket gives `rpair` the control first; which one is the Orchestrator's, `UNKNOWN - verify`)*; about ± 58–78 Elo (C3′'s figure for a 200 + 200 pair). Estimated ≈ 5 h (BA/PM arithmetic: ≈ 85 plies a game at 0.5 s a side; not a reading), over 1 h, so **it is asked of the owner before it starts**; if he declines, this ticket merges on the 100-game read and the smoke, and `RISK-EPIC010-05` stays open for it (no outside read with resolution follows at the epic's close). Reported: W/L/D, score and Elo ± error of each read, the pair's X ± Y, `G11`.

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
| 4 | testable, measurable acceptance | ✅ every row measurable; A6 is the 100-game read plus, on the owner's yes, the 400-game outside pair (pass lines: `ADR-0056` C2′ and C3′) *(2026-11-01)* *2026-11-01 (`bapm-owner-answers`): plus the 0.5 s smoke; the outside pair is at 0.5 s and graded by C3′'s point-estimate rule; the smoke's bar is the owner-answers fold's, scored as the C2′ line was while pending.* *2026-11-01 (`bapm-reconcile-adr0056`): the fold merged (`a0f9297e`); the smoke's bar is S′'s S-4 at ~~E 1 650~~ E 1 810 (2026-11-02, `bapm-records-1102c`), the row adds the Levels deep lane (exit 0, every test passed), and the outside pair is two `r` reads unless `rpair` gains the control. Score unchanged.* |
| 5 | dependencies known | ✅ |
| 6 | NFR triggers with targets | ✅ `G2` ≤ 1.02 × |
| 7 | test notes | ✅ 2 |
| 8 | size | ✅ L |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ❌ data licence; ADR; milestone 2 |

**DoR 8/10 (re-scored 2026-10-29). Backlog.**
