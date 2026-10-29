---
id: ABC-220
title: "The same named level over UCI, at a fixed T a move under any clock"
status: backlog
column: Backlog
size: S
priority: P2
epic: EPIC-009
---

# ABC-220: the named level over UCI (option (a) only)

> **Cut 2026-10-29 by BA/PM** (task `bapm-epic009-tournament`, records only, at `main` `51c85f49`). **Built only if
> the owner picks option (a).** Under (c), UCI gets `ABC-221` instead, and this ticket is closed unbuilt. It waits in
> Backlog on Q2, Q3 (`<NAME>`) and Q4 (T; under (a) the proposed T is 22.0 s).

## Problem

- **User:** a UCI GUI or `cutechess-cli` user at a 40/15 clock.
- **Pain:** `Skill Level` 7 already gives ~22.5 s a move under a 40/15 clock (`EPIC-009` T3–T4), but it is not named
  for it, and at T = 22.5 s the last move of a period ends ~50 ms from the flag.
- **Value:** the CLI's named level, offered over UCI too, at a T that keeps a margin by arithmetic (Q4).

## Scope

1. The level `<NAME>` is selectable over UCI. How (a `Skill Level` value or its own option) is Architect/Design's,
   because `Skill Level` is a `spin` 1–7.
2. Under a clock, the budget is today's `min(G, T)` (`src/uci-session.ts` D4.1–D4.2). With no clock, it is T.

## Out of scope

- A new allocation rule (that is `ABC-221`). Levels 1–7. The `Skill Level` default (5). `ADR-0044` D5's latency.

## Acceptance criteria

- **A1 (offered).** **Given** `uci`, **then** the reply offers `<NAME>` in the form Architect/Design rules, and the
  `Skill Level` line still reads `default 5`.
- **A2 (no clock).** **Given** the level is selected and `go` with no time token, **then** the search gets `budgetMs`
  = T (virtual clock).
- **A3 (a 40/15 period).** **Given** the level, **when** one whole 40/15 period is played on the virtual clock (each
  `go` carries the clock left and `movestogo` 40…1, and each search takes its budget + 31 ms), **then** the clock left
  after every one of the 40 moves is ≥ 1 000 ms, and the period uses ≥ 75 % of 900 s. (At T = 22.0 s the arithmetic
  gives ~20 s left after the 40th move. At T = 22.5 s this row fails: Q4.)
- **A4 (levels unchanged, M3).** **Given** `Skill Level` 1–7 and the same simulated period, **then** every `go`'s
  budget equals base's, row for row.
- **A5 (`NFR-008`).** 0 real-clock rows in the default lane; `npm test` wall ≤ 10 s at load1 ≤ 8.

## NFR triggers

- **`NFR-004`:** the level's ceiling as in `ABC-219` (T + 2 s). The real-clock read is `ABC-219` `A7` and `ABC-222`.
- **`ADR-0044` D5:** `isready` during a search is answered up to T late (≤ 24 s). Accepted unless Architect/Design
  rules otherwise (`RISK-EPIC009-02`).
- **Security (ASVS L1):** one more value in a closed option set. No new input class.

## Test notes

1. All rows on the virtual clock in `src/uci-session.test.ts`'s pattern (`ADR-0027`).
2. UAT is owed; the QE verdict signs it. `ABC-222` is the real-clock acceptance.

## Size and priority

- **Size: S.** One surface over an existing level; the allocation is unchanged.
- **Priority: P2.**

## Dependencies

- `ABC-219` merged (the level exists). Owner Q2 = (a), Q3, Q4.
- Architect/Design: the UCI spelling under `ADR-0044` D3/D11 and `ADR-0045`, reported to the owner.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ |
| 2 | scope and out-of-scope | ✅ |
| 3 | INVEST | ✅ S; depends only on `ABC-219` |
| 4 | testable, measurable acceptance | ✅ A1–A5 (ms, %, row-for-row identity) |
| 5 | dependencies known | ✅ `ABC-219`; owner; Architect |
| 6 | NFR triggers with targets | ⚠ `NFR-004` ceiling proposed, not yet the owner's text |
| 7 | test notes | ✅ 2 |
| 8 | size | ✅ S |
| 9 | priority | ✅ P2 |
| 10 | no major unresolved blocker | ❌ Q2 must be (a); Q3, Q4 |

**DoR 8/10. Backlog.**
