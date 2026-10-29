---
id: ABC-219
title: "A named tournament level in the CLI: the engine thinks a fixed T a move, rate 0, and levels 1–7 are unchanged"
status: backlog
column: Backlog
size: M
priority: P2
epic: EPIC-009
---

# ABC-219: a named tournament level in the CLI, at a fixed T a move

> **Cut 2026-10-29 by BA/PM** (task `bapm-epic009-tournament`, records only, at `main` `51c85f49`). **Waits in
> Backlog on the owner:** Q2 = (a) or (c), Q3 (the name, written `<NAME>` below), Q4 (T and its ceiling). Q1 informs
> Q2. If Q2 is (o) or (b), this ticket is closed unbuilt.

## Problem

- **User:** the owner, playing `npm run chess` (if Q1 is (i) or (iii)).
- **Pain:** the CLI has no clock (`EPIC-009` T2) and no setting named for tournament play. Level 7 thinks 30 s a move,
  which is slower than a 40/15 pace.
- **Value:** one named level that plays at a 40/15 pace, T a move, with no blunders.

## Scope

1. A level `<NAME>`: budget T (Q4), blunder rate 0.
2. The CLI flag `--difficulty <NAME>`, its usage line, and the refusal text.
3. The start-up question's answers (`ABC-200`).
4. The PGN `Difficulty` tag and the engine's player name (`src/pgn.ts`).
5. Under option (a) only: nothing over UCI here; `ABC-220` carries it. Under (c): UCI does not offer the level.

## Out of scope

- Levels 1–7, the default (5) and their budgets. A clock in the CLI. Think-time display (Q7). Early stop on a forced
  move (`ABC-212` OQ-212-2; `RISK-EPIC009-06`).

## Acceptance criteria

T and `<NAME>` are the owner's answers. Every row holds for any value of them.

- **A1 (the budget).** **Given** `--difficulty <NAME>`, **when** the engine plays 10 non-book moves on the virtual
  clock, **then** each `chooseMove` call gets `budgetMs` = T, and 0 of 10 draws take the blunder path.
- **A2 (the flag).** **Given** `npm run chess -- --difficulty <NAME>`, **then** the game starts at that level, and the
  usage line lists `<NAME>` beside `1|2|3|4|5|6|7`, byte-exact to the spelling Architect/Design rules.
- **A3 (the start-up question).** **Given** no `--difficulty` on a terminal, **when** the player answers `<NAME>`,
  **then** the game is the same as with the flag (same level object, same seed handling).
- **A4 (the record).** **Given** a finished game at `<NAME>`, **then** the PGN's `Difficulty` tag reads `<NAME>`, and
  the engine's player name reads `skytalix (difficulty <NAME>)`.
- **A5 (refusal).** **Given** `--difficulty` followed by a word that is not 1–7 or `<NAME>` (for example a one-letter
  misspelling of `<NAME>`), **then** the existing refusal shape and exit code are used, and the text lists `<NAME>`.
- **A6 (levels unchanged, `EPIC-009` M3).** `git diff` base..head on `src/levels.ts` shows `LEVELS[1..7]` and
  `DEFAULT_LEVEL` unchanged. With no `--difficulty` and no answer, the level is 5.
- **A7 (wall, deep lane).** **Given** 5 fixed positions, **when** each is searched once at T on the real clock in
  plain `node`, **then** each returns in ≤ the level's `NFR-004` ceiling (T + 2 s, Q4), and the max is recorded.
  This runs in the `ENGINE_DEEP` lane, never in the default lane, ALONE.
- **A8 (`NFR-008`).** The default lane gains only virtual-clock rows: 0 real-clock rows, and `npm test` wall ≤ 10 s
  at load1 ≤ 8.

## NFR triggers

- **`NFR-004` (owner's, Q4):** a ceiling for the new level, T + 2 s (24.5 s or 24.0 s). Under the 32 s clamp, so the
  clamp does not move. A7 reads it. Security/NFR places the text on the owner's word.
- **`NFR-009`:** T ≤ 30 s is inside `ABC-212`'s level-7 reading (≤ 16 MiB). No re-read is owed unless T > 30 s.
- **`NFR-008`:** A8.
- **Security (ASVS L1):** one more word in two closed sets (the flag, the start-up answer). No new input class.

## Test notes

1. Default lane: A1–A6 on the virtual clock and on the existing CLI test seams.
2. `ENGINE_DEEP` lane: A7, about 2 min of wall, ALONE, never during a reading.
3. UAT is owed (production lines change). The QE verdict signs it (`…5aaf7cec` item 2).

## Size and priority

- **Size: M.** Data plus four surfaces (flag, question, PGN, refusal) and a non-ordinal value through
  `src/cli-options.ts`. `ABC-212` was M for a similar spread.
- **Priority: P2.** The owner's own idea.

## Dependencies

- **Owner:** Q2 (a or c), Q3, Q4.
- **Architect/Design first (In Design):** an `ADR-0045` amendment, reported to the owner. It rules how a named level
  sits beside the ordinals 1–7 (an ordinal 8 with a name, or a name only), and what `HARDEST_LEVEL` then means.
- Files shared with `ABC-220` and `ABC-221`: `src/levels.ts`, `src/cli-options.ts`. Whichever merges second rebases.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ owner word; user, pain, value |
| 2 | scope and out-of-scope | ✅ 5 scope items; levels 1–7, clock, display out |
| 3 | INVEST | ✅ independent of `ABC-221`; M; testable |
| 4 | testable, measurable acceptance | ✅ A1–A8, parameterised by T and `<NAME>` |
| 5 | dependencies known | ✅ owner Q2–Q4; Architect `ADR-0045` amendment |
| 6 | NFR triggers with targets | ⚠ `NFR-004` ceiling T + 2 s is proposed, not yet the owner's text |
| 7 | test notes | ✅ 3 |
| 8 | size | ✅ M |
| 9 | priority | ✅ P2 |
| 10 | no major unresolved blocker | ❌ Q2, Q3, Q4 unanswered |

**DoR 8/10. Backlog**, until the owner answers Q2–Q4. Then In Design (Architect/Design), then Ready.
