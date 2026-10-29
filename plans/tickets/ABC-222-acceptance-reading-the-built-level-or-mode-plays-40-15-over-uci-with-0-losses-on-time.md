---
id: ABC-222
title: "Acceptance reading: the built level or mode plays 40/15 over UCI with 0 losses on time and ≥ 75 % clock use"
status: backlog
column: Backlog
size: S
priority: P2
epic: EPIC-009
owner: QE/E2E
---

# ABC-222: read `EPIC-009` M1 and M2 on the real clock

> **Cut 2026-10-29 by BA/PM** (task `bapm-epic009-tournament`, records only, at `main` `51c85f49`). It waits in
> Backlog until the UCI side of the owner's option is merged: `ABC-220` under (a), `ABC-221` under (b) or (c). Under
> (o) it is not run, unless the owner says `ABC-218` should be graded instead.

## Problem

- **User:** the owner, and anyone who plays `skytalix` at 40/15 over UCI.
- **Pain:** "never loses on time" is a claim on the real clock and the real pipe. The virtual-clock rows cannot prove
  it.
- **Value:** `EPIC-009` M1 and M2 graded on games.

## Scope

- `ABC-218`'s protocol, unchanged except that both sides use the built level or mode `<NAME>`:
  - **full length:** `tc=40/900`, 2 games (opening 1, both colours), `-maxmoves 120`;
  - **scaled:** `tc=40/60`, 20 games (openings 1–10, both colours), `-maxmoves 120`;
  - `timemargin=0`, width 1, ALONE.

## Out of scope

- Strength (`EPIC-009` Q6). Any code change. Non-UCI surfaces (the CLI has no clock).

## Acceptance criteria

- **A1 (pins).** As `ABC-218` `A1`, at the merge sha of the built ticket.
- **A2 (games).** 2 of 2 full-length and 20 of 20 scaled PGNs and `-debug all` logs kept. A fault (illegal move,
  disconnect, stall, crash) or a frequency fall over 5 % makes the reading UNRESOLVED: named, and re-run once.
- **A3 (M1).** Over A2's 22 games, **0** losses on time by either side, and the closest call (least clock left after
  any `skytalix` move, derived as in `ABC-218`'s PREREG) is **≥ 500 ms**.
- **A4 (M2).** In the 2 full-length games, every completed 40-move period uses **≥ 75 %** of its 900 s, per side,
  book moves included.
- **A5 (against the baseline).** A3's and A4's numbers are reported beside `ABC-218`'s, row for row.
- **A6 (ceiling).** The longest single move is ≤ the built level's or mode's `NFR-004` ceiling (24.0 s, 24.5 s or 32 s
  by the owner's answers), plus `AR-NFR004-A`'s ≤ ~31 ms.

## NFR triggers

- **`NFR-004`:** A6.
- **Heat:** ~2.5–4 h ALONE, with `ABC-218` `A7`'s thermal and frequency log (`RISK-EPIC009-04`).

## Test notes

1. QE's scratch clone; PREREG sealed before game 1; raw files under QE's task context with paths scrubbed.
2. A failed A3 or A4 is NOT MET: a `failed-attempt` note, and the built ticket goes back to BA/PM. One re-tune round,
   as `EPIC-008`'s S1 allowed.

## Size and priority

- **Size: S.** One reading, the protocol already pinned by `ABC-218`.
- **Priority: P2.**

## Dependencies

- `ABC-220` (option a) or `ABC-221` (b, c) merged. `ABC-218` read (its protocol and baseline). An idle board.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ |
| 2 | scope and out-of-scope | ✅ |
| 3 | INVEST | ✅ S; testable |
| 4 | testable, measurable acceptance | ✅ 0 losses, ≥ 500 ms, ≥ 75 %, ceiling in ms |
| 5 | dependencies known | ✅ |
| 6 | NFR triggers with targets | ✅ `NFR-004` per the built ceiling; 5 % frequency rule |
| 7 | test notes | ✅ 2 |
| 8 | size | ✅ S |
| 9 | priority | ✅ P2 |
| 10 | no major unresolved blocker | ❌ nothing to read until Q2 is answered and its build merges |

**DoR 9/10. Backlog.**
