---
id: ABC-232
title: "Passed pawns are worth more as material comes off, on ABC-231's phase"
status: backlog
column: Backlog
size: S
priority: P3
epic: EPIC-010
---

# ABC-232: passed pawns by phase

> **Cut 2026-10-29 by BA/PM** (task `bapm-epic010-improvements`, records only, at `main` `f45aea95`). § B item 5, the
> passed-pawn half (SA `…306a4012` row 5b). Rook activity by phase is not cut (scope). **Waits in Backlog on**
> `ABC-231` and the owner's Q4. Milestone 2.

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
- **A5 (the reading).** The Q4 rule. Reported: X ± Y, `G11`.

## NFR triggers

- **`NFR-005`:** `G6`. **`G2`:** A3. **Security:** none.

## Test notes

1. UAT is owed. The QE verdict signs it.

## Size and priority

- **Size: S.** **Priority: P3.**

## Dependencies

- `ABC-231` merged (its phase). Same ADR ruling as `ABC-231`. **Owner:** Q4.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ SA 5b |
| 2 | scope and out-of-scope | ✅ |
| 3 | INVEST | ✅ S; own reading |
| 4 | testable, measurable acceptance | ⚠ A5 is Q4's |
| 5 | dependencies known | ✅ `ABC-231` |
| 6 | NFR triggers with targets | ✅ `G2` ≤ 1.03 × |
| 7 | test notes | ✅ 1 |
| 8 | size | ✅ S |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ❌ `ABC-231`; Q4 |

**DoR 8/10. Backlog.**
