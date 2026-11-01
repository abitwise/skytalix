---
id: ABC-231
title: "The king table is tapered by phase, alone: today's table while material is on, a centralising table as it comes off, and no king-safety term"
status: backlog
column: Backlog
size: S
priority: P3
epic: EPIC-011
---

# ABC-231: a tapered king table, alone

> **RE-HOMED 2026-11-01 to `EPIC-011` by BA/PM** (task `bapm-epic011-dedupe`, records only, at `main` `2e9a2457`). The
> owner asked for a new epic for the 3 000 path, started after the open epics close, and for no work done twice
> (`orch-2026-10-30a` `…022fb66f`). `ADR-0056` D4 maps this ticket to its gap list, so it leaves `EPIC-010` rather
> than holding that epic's close. **Id unchanged; nothing below this block is edited.** `ADR-0056` row E1 (the full
> taper). **Verdict: merge into E1** at `EPIC-011` Phase 4's refinement: this ticket is a subset of E1 (`ADR-0056` D2,
> D8). It stays a page until E1 is cut so that its acceptance rows (the `ABC-205` `G6` replay in `A1`) carry over,
> then it closes as merged. `G6` "≥ base" still binds (Q-3K-4 open). Its reading is `EPIC-011` § The per-change rule.

> **Cut 2026-10-29 by BA/PM** (task `bapm-epic010-improvements`, records only, at `main` `f45aea95`). § B item 5, the
> king half, verified (SA `…306a4012` rows 5a, 5c). **Not `ABC-205` again:** that ticket shipped a king-safety term
> **and** a taper and closed on `G6` at `position-6` (cost, not play). This is the taper alone. **Waits in Backlog
> on:** an Architect ruling and the owner's Q4. Milestone 2.

> **AMENDED 2026-10-29 by BA/PM** (task `bapm-owner-words-b`, records only): the owner set Q4 = (e), extended
> (`orch-2026-10-29g` `…278e149b`). This ticket's reading is now the smoke pair before merge (`EPIC-010` § The
> merge rule), with a batched validation later. Q4 no longer holds it. **Next real wait:** the Architect's ruling (`ADR-0031` addendum scope). Milestone 2. DoR 8/10 → 9/10.

> **Dated line 2026-10-30 by BA/PM** (task `bapm-ABC-228-merge-fold`, records only, at `main` `e42b637b`). `ABC-228`
> merged under OQ-228-1 (ii) (`ADR-0053` d10): level 5 and `DEFAULT_BUDGET_MS` play 4 000 ms. **`A1` reads at the new
> referent:** head and base both at `LEVELS[5]` = 4 000 ms, on the frozen clock first and then by the `G6` rule.
> `ABC-205`'s failing 3 s reading stays the reason for `A1`, but it is never compared with a 4 000 ms reading. `A5`'s
> `G5` reads level 5 at ≤ 4 s, with the 5 s ceiling. No other row moves, and DoR stays 9/10 (Backlog, the ADR ruling).

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
  the frozen clock first and, if it fails, the ticket stops before any game. *(2026-10-30: both builds at
  `LEVELS[5]` = 4 000 ms, the referent from `ABC-228`'s merge `e42b637b`. `ABC-205`'s 3 s reading is not the
  comparison.)*
- **A2 (the taper).** **Given** 6 king-and-pawn endings chosen by QE and frozen before the build, **then** the king's PST term on a
  centre square exceeds a corner square's by ≥ 20 cp; **given** the start position and 6 middlegames, **then** the
  king term equals base's within 2 cp.
- **A3 (relations).** `G3`: the mirror (exact equality) and purity rows stay green.
- **A4 (cost).** `G2` mean per call ≤ base × 1.05 in the same session.
- **A5 (gates).** `G1`, `G5`, `G6` (floor 6), `G8`, `G9`, `G10`.
- **A6 (the reading).** *(2026-11-01, the owner's rule, `bapm-100-400-rule`; replaces the smoke pair of `EPIC-010` § The merge rule.)* One 100-game read at 100 ms a move before the merge (`EPIC-011` § The per-change rule): the candidate head rebased on `main` against its merge-base, self-play, openings 1–50 with both colours, one game at a time, through `ABC-255`. 100 of 100 games complete, the candidate makes 0 faults and loses 0 games on time at the 50 ms margin, and the score meets `ADR-0056` C2′ (merged `94f1504c`): ≥ 50.0 of 100 for a GAIN, ≥ 43.0 for a NEUTRAL, the intent declared at design. A miss is NOT MET and is not re-played. Reported: W/L/D, score, `cutechess-cli`'s Elo ± error, `G11`. *(2026-11-01, `bapm-owner-answers`, the owner's answer 3.)* **And the Stockfish smoke beside it:** 10 games, the candidate at 0.5 s a move against Stockfish 19 `UCI_LimitStrength`, one game at a time, through `ABC-255` (`EPIC-011` § The per-change rule): 10 of 10 complete, 0 faults, 0 losses on time, and the no-collapse bar the `ADR-0056` owner-answers fold names for 0.5 s (`UNKNOWN - verify` until it merges).

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
- **Owner:** Q4 answered 2026-10-29: (e), extended (`orch-2026-10-29g` `…278e149b`). Q2 was answered the same day: the ~1700 non-goal is removed (`EPIC-004` amendment).
- Milestone 1's quiescence tickets merged or closed first (they move the node budget `G6` reads).

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ SA 5a |
| 2 | scope and out-of-scope | ✅ taper only |
| 3 | INVEST | ✅ S |
| 4 | testable, measurable acceptance | ✅ every row measurable; A6 is the 100-game read at 100 ms (`EPIC-011` § The per-change rule; its pass line is `ADR-0056` C2′) *(2026-11-01)* *2026-11-01 (`bapm-owner-answers`): plus the 10-game Stockfish smoke at 0.5 s; its no-collapse bar is the owner-answers fold's, scored as the C2′ line was while pending (the ticket leaves Backlog only after that fold merges).* |
| 5 | dependencies known | ✅ |
| 6 | NFR triggers with targets | ✅ `G2` ≤ 1.05 ×; floor 6 |
| 7 | test notes | ✅ 2 |
| 8 | size | ✅ S |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ❌ ADR ruling |

**DoR 9/10 (re-scored 2026-10-29). Backlog.**
