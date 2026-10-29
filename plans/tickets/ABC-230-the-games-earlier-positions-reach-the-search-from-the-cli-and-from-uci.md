---
id: ABC-230
title: "The game's earlier positions reach the search, from the CLI and from UCI, so it sees a repetition the game already holds; a bare FEN still has none"
status: backlog
column: Backlog
size: M
priority: P2
epic: EPIC-010
---

# ABC-230: game history into the search

> **Cut 2026-10-29 by BA/PM** (task `bapm-epic010-improvements`, records only, at `main` `f45aea95`). § B item 3,
> verified by the SA (`…306a4012` rows 3a–3c, 3e). **Waits in Backlog on:** `ABC-226`'s count (it sets this ticket's
> milestone), an ADR reading, and the owner's Q4. The en-passant key point is Q3, not this ticket.

## Problem

- **User:** the owner in the CLI and a GUI over UCI.
- **Pain:** `repeatsInPath` scans the per-ply key array only (`src/search.ts:129-138`), seeded with the root's key
  alone (`src/engine.ts:549`). Both seams pass `history.position` only (`src/engine.ts:604`, `src/level-seam.ts:17`);
  the UCI parser replays the moves and keeps the final `Position` (`src/uci-session.ts:119-141`). So the search cannot
  see that a move repeats a position from earlier in the game: it can walk into a draw when winning or miss one when
  losing. How often is `ABC-226`'s count.
- **Value:** the search scores a move that repeats a game position the way the game will end it.

## Scope

1. The keys of the game's earlier positions since the last irreversible move (capture, pawn move, castling-right
   change) are handed to the search as a read-only input, CLI and UCI alike. `src/history.ts` is not imported into
   the search (`ABC-081` `A6`); the keys are handed in.
2. UCI: `position … moves …` keeps the keys it replays through (`ADR-0044` D3, as the Architect reads it).
3. The repetition rule inside the search is unchanged; it now finds earlier game keys as well as path keys.
4. A bare FEN carries no history; that stays explicit (a test row).
5. An `ADR-0026` d10 door if the Architect rules the change a value-changing heuristic.

## Out of scope

- The ep key (`ADR-0020` d2; owner Q3). The game-end threefold in `src/history.ts` / `gameStatus` (unchanged).
- Draw-score tuning (contempt).

## Acceptance criteria

- **A1 (CLI).** **Given** a game in the CLI where position P has occurred twice and a legal move returns to it, **when**
  the engine searches, **then** that move scores the draw score (0) at the root, and the door (or base) scores it
  otherwise. ≥ 4 fixture games, both colours.
- **A2 (UCI).** **Given** `position startpos moves …` reaching the same fixtures, **then** the same root scores as A1,
  byte-equal `bestmove` to the CLI's on each.
- **A3 (bare FEN).** **Given** `position fen <F>` with no moves, **then** the search's input holds only the root key,
  and the result equals base node for node.
- **A4 (identity elsewhere).** **Given** the `ABC-078` `A3` corpus (positions without game history), **then** the
  search is node-equal to base.
- **A5 (bounds).** **Given** a UCI move list of 600 plies, **then** the keys handed in are only those since the last
  irreversible move, and never more than 100 (the fifty-move window); `NFR-009` growth ≤ 1 MiB between 1 s and 3 s
  searches holds.
- **A6 (gates).** `G1`, `G5`, `G6` "≥ base" (floor 6), `G7`, `G8`, `G9`.
- **A7 (the reading).** The Q4 rule. Reported: X ± Y and the count of games in the reading that end by repetition,
  head against base.

## NFR triggers

- **`NFR-009`:** A5. **`NFR-005`:** `G6`. **`NFR-008`:** fixed-depth, virtual-clock rows only.
- **Security (ASVS L1):** the UCI move list now feeds the search. Bounded by A5; no new parsing. Security/NFR reads it
  at the gate (`RISK-EPIC010-06`).

## Test notes

1. Fixture games built from a short shuffle (for example Nf3 Nf6 Ng1 Ng8 twice) and one from an R PGN that `ABC-226`
   names, if any.
2. UAT is owed (production lines on both surfaces). The QE verdict signs it.

## Size and priority

- **Size: M.** Two surfaces and one search input; no new heuristic.
- **Priority: P2,** or P3 in milestone 2 if `ABC-226`'s total is 0 (its `A5`).

## Dependencies

- **`ABC-226`** Done.
- **Architect/Design first:** `ADR-0002` clause 3 already says the per-ply array is "seeded once per search from the
  history module"; the Architect rules whether that clause covers this (keys handed in, `ABC-081` `A6`) or a new ADR
  or `ADR-0044` D3 amendment is owed, and whether an `ADR-0026` door applies. Reported to the owner when it lands.
- **Owner:** Q4. Q3 only if he re-opens `ADR-0020` d2 (a separate ticket then).
- Shares `src/uci-session.ts` with `EPIC-009`'s `ABC-220`/`ABC-221`; whichever merges second rebases.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ SA 3a–3c |
| 2 | scope and out-of-scope | ✅ 5 items; ep out |
| 3 | INVEST | ✅ independent of 228/229; M |
| 4 | testable, measurable acceptance | ⚠ A1–A6 measurable; A7's reading is the rule Q4 sets |
| 5 | dependencies known | ✅ `ABC-226`; ADR reading; Q4 |
| 6 | NFR triggers with targets | ✅ ≤ 100 keys; ≤ 1 MiB growth |
| 7 | test notes | ✅ 2 |
| 8 | size | ✅ M |
| 9 | priority | ✅ P2 (conditional) |
| 10 | no major unresolved blocker | ❌ ADR reading; Q4; `ABC-226` |

**DoR 8/10. Backlog.**
