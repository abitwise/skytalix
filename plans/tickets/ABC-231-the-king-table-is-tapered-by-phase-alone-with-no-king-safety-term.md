---
id: ABC-231
title: "The king table is tapered by phase, alone: today's table while material is on, a centralising table as it comes off, and no king-safety term"
status: backlog
column: Backlog
size: S
priority: P3
epic: EPIC-010
---

# ABC-231: a tapered king table, alone

> **Cut 2026-10-29 by BA/PM** (task `bapm-epic010-improvements`, records only, at `main` `f45aea95`). § B item 5, the
> king half, verified (SA `…306a4012` rows 5a, 5c). **Not `ABC-205` again:** that ticket shipped a king-safety term
> **and** a taper and closed on `G6` at `position-6` (cost, not play). This is the taper alone. **Waits in Backlog
> on:** an Architect ruling and the owner's Q4. Milestone 2.

## Problem

- **User:** the owner, in endgames.
- **Pain:** the king table is untapered (`src/evaluate.ts:59`, `KING_TABLE` `:131-145`): the centre costs −20 to −50
  on every rank in every phase, so in a king-and-pawn ending the king is told to hide.
- **Value:** the king walks to the centre when the queens and most pieces are off.

## Scope

1. A phase from non-pawn material (0 = bare kings, 1 = the start's material), computed once per `evaluate` call.
2. The king's PST = phase × today's table + (1 − phase) × an endgame table that rewards the centre, both written by a
   stated rule (`ABC-215`'s provenance rule).
3. An `ADR-0026`-style off switch, so the old evaluation is reachable in tests.

## Out of scope

- Any king-safety term (`ABC-205`'s). Passed pawns (`ABC-232`). Rook activity. Tuning (`ABC-239`).

## Acceptance criteria

- **A1 (`ABC-205`'s failure, first).** **Given** `ABC-205`'s failing reading (`G6` on `position-6`), **when** this
  ticket's head is read by the `G6` rule, **then** `position-6`'s median completed depth is ≥ base's. This is read on
  the frozen clock first and, if it fails, the ticket stops before any game.
- **A2 (the taper).** **Given** 6 king-and-pawn endings chosen by QE and frozen before the build, **then** the king's PST term on a
  centre square exceeds a corner square's by ≥ 20 cp; **given** the start position and 6 middlegames, **then** the
  king term equals base's within 2 cp.
- **A3 (relations).** `G3`: the mirror (exact equality) and purity rows stay green.
- **A4 (cost).** `G2` mean per call ≤ base × 1.05 in the same session.
- **A5 (gates).** `G1`, `G5`, `G6` (floor 6), `G8`, `G9`, `G10`.
- **A6 (the reading).** The Q4 rule. Reported: X ± Y, `G11`.

## NFR triggers

- **`NFR-005`:** A1 and `G6`. **`NFR-001`/`G2`:** A4. **Security:** none.

## Test notes

1. A1's frozen-clock pre-check is the `ABC-205`/`ABC-215` process step.
2. UAT is owed. The QE verdict signs it.

## Size and priority

- **Size: S.** One table, one blend, one phase; no new term.
- **Priority: P3.** Milestone 2.

## Dependencies

- **Architect/Design:** whether `ADR-0031`'s accepted, not-shipped addendum covers a taper without the king-safety
  term, or a new ADR is owed; and `ABC-083`'s "untapered by decision" is revised. Reported to the owner.
- **Owner:** Q4. (Q2 blocks nothing: its default cites his `EPIC-008` word.)
- Milestone 1's quiescence tickets merged or closed first (they move the node budget `G6` reads).

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ SA 5a |
| 2 | scope and out-of-scope | ✅ taper only |
| 3 | INVEST | ✅ S |
| 4 | testable, measurable acceptance | ⚠ A1–A5 measurable; A6 is Q4's |
| 5 | dependencies known | ✅ |
| 6 | NFR triggers with targets | ✅ `G2` ≤ 1.05 ×; floor 6 |
| 7 | test notes | ✅ 2 |
| 8 | size | ✅ S |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ❌ ADR ruling; Q4 |

**DoR 8/10. Backlog.**
