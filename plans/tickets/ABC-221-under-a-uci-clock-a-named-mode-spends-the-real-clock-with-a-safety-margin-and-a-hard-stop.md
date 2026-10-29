---
id: ABC-221
title: "Under a UCI clock, a named mode spends the real clock with a safety margin and a hard stop, and never loses on time"
status: backlog
column: Backlog
size: M
priority: P2
epic: EPIC-009
---

# ABC-221: a named UCI clock mode: the real clock, a safety margin, a hard stop

> **Cut 2026-10-29 by BA/PM** (task `bapm-epic009-tournament`, records only, at `main` `51c85f49`). **Built only if
> the owner picks option (b) or (c).** It waits in Backlog on Q2, Q3 (`<NAME>`) and Q5 (the per-move ceiling; default
> keep 32 s). The idea comes from `owner-ideas.md` § B item 4, which is **UNKNOWN - verify** as a claim. This page
> rests on today's behaviour as the System Analyst mapped it (`sa-ideas-verify` `…1ccf0010` §§ 3–5, 7, 9; `EPIC-009`
> T3–T6), not on § B. The SA's § 9 names what blocks (b) today: the level cap, the 32 s clamp, no time manager, and
> no measuring path. This ticket removes the first and third for the mode only; `ABC-218` and `ABC-222` are the
> measuring path.

## Problem

- **User:** a UCI GUI or `cutechess-cli` user at a 40/15 clock (Q1 (ii) or (iii)).
- **Pain:** today the clock share is capped at the `Skill Level`'s budget (T4), so the default level uses 13 % of a
  40/15 clock. At `Skill Level` 7 the margin at a period's last move is 50 ms (T3).
- **Value:** one named mode that spends the clock it is given, keeps a margin on every move, and never loses on time.

## Scope

1. A mode `<NAME>`, selected over UCI; off by default. How it is spelt is Architect/Design's.
2. With the mode on and a clock in `go`: the budget comes from the side's remaining clock and `movestogo`, less a
   safety margin, and is **not** capped at a level's per-move budget. It is capped at the mode's ceiling (Q5: 32 s).
3. A hard stop: the search's deadline is never later than the remaining clock less the margin, whatever the share.
4. Without `movestogo`: a rule Architect/Design sets, held to the same margin.
5. With the mode on and no clock in `go`: Architect/Design rules the budget (for example the level's).

## Out of scope

- Spending more time on a hard move (a search change; `EPIC-009` § Out of scope). Pondering. A worker for `isready`.
- Levels 1–7, `Skill Level`'s default, and today's allocation when the mode is off.

## Acceptance criteria

All rows on the virtual clock. Each simulated search takes its budget + 31 ms (`AR-NFR004-A`'s bound), and a book move
takes 0 ms.

- **A1 (offered, off by default).** **Given** `uci`, **then** the mode is offered in the form Architect/Design rules,
  off by default, and `Skill Level` still reads `default 5`.
- **A2 (one 40/15 period).** **Given** the mode on, **when** one whole period is played (900 000 ms, `movestogo` 40…1,
  no book moves), **then** the clock left after every one of the 40 moves is **≥ 1 000 ms**, and the period uses
  **≥ 85 %** of 900 s.
- **A3 (banked book time).** **Given** the same period with the first 6 moves from the book, **then** every move left
  ≥ 1 000 ms, and the 34 searched moves use ≥ 85 % of 900 s together.
- **A4 (three periods).** **Given** 120 moves across 3 periods (the clock gains 900 000 ms after moves 40 and 80),
  **then** every move leaves ≥ 1 000 ms, and each period uses ≥ 85 %.
- **A5 (hard stop).** **Given** `go wtime 3000 btime 3000 movestogo 1` with the mode on, **then** the search's
  deadline leaves ≥ 1 000 ms of the 3 000 ms. **Given** `wtime 800`, **then** a move is still returned (the engine's
  unabortable depth 1), and the row records how much clock it used.
- **A6 (no `movestogo`).** **Given** `go wtime 900000 btime 900000` with no `movestogo`, **when** 80 moves are played
  with no added time, **then** every move leaves ≥ 1 000 ms.
- **A7 (ceiling).** **Given** a clock whose share exceeds the mode's ceiling (for example `wtime 3600000 movestogo
  40`), **then** the budget is ≤ the ceiling (32 000 ms under Q5's default).
- **A8 (mode off: unchanged, M3).** **Given** the mode off and `Skill Level` 1–7, **when** A2's period is replayed,
  **then** every `go`'s budget equals base's, row for row.
- **A9 (`NFR-008`).** 0 real-clock rows in the default lane; `npm test` wall ≤ 10 s at load1 ≤ 8.

The 1 000 ms on the virtual clock leaves 500 ms for pipe and GUI latency under `EPIC-009` M1's ≥ 500 ms closest call.
`ABC-222` reads M1 on the real clock.

## NFR triggers

- **`NFR-004`:** under Q5's default the mode's ceiling is today's clamp, 32 s, and no bound moves. Security/NFR places
  a line for the mode. Under Q5 (ii) the bound moves, on the owner's word only.
- **`NFR-009`:** ≤ 30 s is inside `ABC-212`'s reading; at a 32 s ceiling Security/NFR rules whether a re-read is owed
  (≤ 16 MiB, growth ≤ 1 MiB).
- **`ADR-0044` D5:** `isready` answered up to one budget late, ≤ 32 s (`RISK-EPIC009-02`). Architect/Design rules it.
- **Security (ASVS L1):** one option in a closed set; `go`'s numeric tokens are already parsed and refused today.

## Test notes

1. Virtual-clock rows in `src/uci-session.test.ts`'s pattern (`ADR-0027`); A2–A7 are each one simulated sequence.
2. `ABC-222` is the real-clock acceptance (`EPIC-009` M1, M2).
3. UAT is owed; the QE verdict signs it.

## Size and priority

- **Size: M.** One allocation rule with its margin, stop and no-`movestogo` rule, an option, and nine rows. Not L:
  variable allocation is out.
- **Priority: P2.**

## Dependencies

- Owner: Q2 = (b) or (c), Q3, Q5.
- **Architect/Design first (In Design):** an `ADR-0044` D4 amendment (the mode's allocation, margin and stop) and a
  D5 ruling at ≤ 32 s, reported to the owner.
- Independent of `ABC-219`. Shares `src/uci-session.ts` with `ABC-220` (built only under (a), so never both).

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ |
| 2 | scope and out-of-scope | ✅ 5 scope items; variable allocation out |
| 3 | INVEST | ✅ independent; M |
| 4 | testable, measurable acceptance | ✅ A1–A9: ms, %, row-for-row identity |
| 5 | dependencies known | ✅ owner Q2/Q3/Q5; Architect `ADR-0044` D4/D5 |
| 6 | NFR triggers with targets | ✅ `NFR-004` 32 s under Q5's default (no bound moves); `NFR-009` ≤ 16 MiB |
| 7 | test notes | ✅ 3 |
| 8 | size | ✅ M |
| 9 | priority | ✅ P2 |
| 10 | no major unresolved blocker | ❌ Q2 and Q3 unanswered |

**DoR 9/10. Backlog.**
