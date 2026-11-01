---
id: ABC-232
title: "Passed pawns are worth more as material comes off, on ABC-231's phase"
status: backlog
column: Backlog
size: S
priority: P3
epic: EPIC-011
---

# ABC-232: passed pawns by phase

> **RE-HOMED 2026-11-01 to `EPIC-011` by BA/PM** (task `bapm-epic011-dedupe`, records only, at `main` `2e9a2457`). The
> owner asked for a new epic for the 3 000 path, started after the open epics close, and for no work done twice
> (`orch-2026-10-30a` `…022fb66f`). `ADR-0056` D4 maps this ticket to its gap list, so it leaves `EPIC-010` rather
> than holding that epic's close. **Id unchanged; nothing below this block is edited.** `ADR-0056` rows E1 (phase
> scaling) and E4 (passer terms). **Verdict: merge into E1** (its phase scaling) **and E4** (any passer term beyond
> it) at `EPIC-011` Phase 4's refinement; closes as merged then. Its wait on `ABC-231` becomes a wait on E1.

> **Cut 2026-10-29 by BA/PM** (task `bapm-epic010-improvements`, records only, at `main` `f45aea95`). § B item 5, the
> passed-pawn half (SA `…306a4012` row 5b). Rook activity by phase is not cut (scope). **Waits in Backlog on**
> `ABC-231` and the owner's Q4. Milestone 2.

> **AMENDED 2026-10-29 by BA/PM** (task `bapm-owner-words-b`, records only): the owner set Q4 = (e), extended
> (`orch-2026-10-29g` `…278e149b`). This ticket's reading is now the smoke pair before merge (`EPIC-010` § The
> merge rule), with a batched validation later. Q4 no longer holds it. **Next real wait:** `ABC-231` merged (and its ADR ruling). Milestone 2. DoR 8/10 → 9/10.

## Problem

- **User:** the owner, in endgames.
- **Pain:** `PASSED_PAWN_BONUS` is by rank only (`src/evaluate.ts:187`); a passed pawn on the 6th is worth the same
  with all pieces on as in a pawn ending.
- **Value:** the engine pushes, and stops, passed pawns when it matters.

## Scope

1. The passed-pawn bonus = phase-blend of today's values (middlegame) and larger endgame values by a stated rule,
   using `ABC-231`'s phase.
2. The same off switch.

## Out of scope

- Rook activity, king-pawn distance terms, tuning.

## Acceptance criteria

- **A1 (the blend).** **Given** 6 positions with a passed pawn at ranks 4–7 and phase ≤ 0.25, **then** each bonus is
  ≥ 1.5 × base's; **given** the start position and 6 middlegames with phase ≥ 0.75, **then** within 5 cp of base.
- **A2 (relations).** `G3` mirror and purity.
- **A3 (cost).** `G2` ≤ base × 1.03.
- **A4 (gates).** `G1`, `G5`, `G6` (floor 6), `G8`, `G9`, `G10`.
- **A5 (the reading).** *(2026-11-01, the owner's rule, `bapm-100-400-rule`; replaces the smoke pair of `EPIC-010` § The merge rule.)* One 100-game read at 100 ms a move before the merge (`EPIC-011` § The per-change rule): the candidate head rebased on `main` against its merge-base, self-play, openings 1–50 with both colours, one game at a time, through `ABC-255`. 100 of 100 games complete, the candidate makes 0 faults and loses 0 games on time, and the score meets the `ADR-0056` fold's pass line (`arch-adr0056-100ms-fold`, pending; `UNKNOWN - verify` until merged). Reported: W/L/D, score, `cutechess-cli`'s Elo ± error, `G11`.

## NFR triggers

- **`NFR-005`:** `G6`. **`G2`:** A3. **Security:** none.

## Test notes

1. UAT is owed. The QE verdict signs it.

## Size and priority

- **Size: S.** **Priority: P3.**

## Dependencies

- `ABC-231` merged (its phase). Same ADR ruling as `ABC-231`. **Owner:** Q4 answered 2026-10-29: (e), extended (`orch-2026-10-29g` `…278e149b`).

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ SA 5b |
| 2 | scope and out-of-scope | ✅ |
| 3 | INVEST | ✅ S; own reading |
| 4 | testable, measurable acceptance | ✅ every row measurable; A5 is the 100-game read at 100 ms (`EPIC-011` § The per-change rule; its pass line is the `ADR-0056` fold's, pending) *(2026-11-01)* |
| 5 | dependencies known | ✅ `ABC-231` |
| 6 | NFR triggers with targets | ✅ `G2` ≤ 1.03 × |
| 7 | test notes | ✅ 1 |
| 8 | size | ✅ S |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ❌ `ABC-231` |

**DoR 9/10 (re-scored 2026-10-29). Backlog.**
