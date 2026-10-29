---
id: ABC-223
title: "Smoke reading: `uci-clock-mode` plays 5 games at 40/15 over UCI with 0 losses on time, closest call ≥ 500 ms and ≥ 75 % clock use"
status: backlog
column: Backlog
size: S
priority: P3
epic: EPIC-009
owner: QE/E2E
---

# ABC-223: smoke reading of `uci-clock-mode` at 40/15: `EPIC-009` M1, M2 and the 60 s ceiling, in 5 games

> **RECONCILED 2026-10-29 to `ADR-0052` (PROPOSED) by BA/PM** (task `bapm-owner-words-b`, records only).
>
> - **The selecting line** is `option.TimeMode=uci-clock-mode` (`ADR-0052` D1). Game 1's log must show `setoption
>   name TimeMode value uci-clock-mode`.
> - **The ceiling read in A5:** the mode's budget is ≤ 59 500 ms under a 60 000 ms ceiling (`ADR-0052` D4). At 40/15
>   with `movestogo` its share stays near 22.4 s, rising only by banked book time, so these games are not expected to
>   reach the cap. `ABC-221`'s A7 and A10 hold it; A5 here only confirms it in play.
> - **The slack to read against:** the reserve leaves ≥ 1 069 ms on the virtual clock, and M1's ≥ 500 ms survives
>   δ ≤ 600 ms on a period's last move (`ADR-0052` D5). The margin is much thinner than `simple-tournament`'s 18.8 s,
>   so A6's overhead figures matter more here.
> - **Smoke size: 5 games, kept, with `ABC-222`'s coverage extension up to 10** (the same reasons; `ABC-222`'s header).
>   If `ABC-222`'s per-move overhead max is over 300 ms (half the 600 ms slack), QE plays all 10 games here.
> - DoR stays 9/10, waiting on `ABC-221`.
>
> **Cut 2026-10-29 by BA/PM** (task `bapm-amend-epic009`, records only, at `main` `a5d70e35`), on the owner's answers
> of 2026-10-29 (`orch-2026-10-29g` `…a67f71ac`).
>
> - Q1: smoke readings are "5 or 10" games, "just to make sure things work".
> - Q2: the clock mode comes later.
> - Q5: its ceiling is 60 s.
> - Q8: the measures are accepted.
>
> It is `uci-clock-mode`'s twin of `ABC-222`, split out because the mode is a later milestone. One ticket reading two
> milestones would be two tickets hiding. It uses the id `ABC-223`, which the cut left unused.

## Problem

- **User:** the owner, and any `cutechess-cli` match that selects `uci-clock-mode` at 40/15.
- **Pain:** the mode's margin and hard stop are proven only on the virtual clock (`ABC-221`). The pipe and GUI latency
  is unread, and the mode may spend up to 60 s on one move.
- **Value:** `EPIC-009` M1 and M2 and the 60 s ceiling, shown working in real games.

## Scope

`ABC-222`'s protocol, unchanged except as listed:

- the build is at `ABC-221`'s merge sha;
- both sides use `uci-clock-mode`, selected by `option.TimeMode=uci-clock-mode` (`ADR-0052` D1);
- the ceiling read in A5 is 60 000 ms (budget ≤ 59 500 ms);
- the coverage extension of `ABC-222` applies (up to 10 games), and all 10 are played if `ABC-222`'s per-move overhead
  max was over 300 ms.

So: `cutechess-cli` 1.5.1, self-play, **5 games at `tc=40/900`**, openings 1–5, `-maxmoves 80` (unit checked in game
1), `timemargin=0`, `OwnBook` on, width 1, ALONE. The wall is ≤ ~5 h: each side spends at most its clock, ≤ 1 800 s
per 80 moves, so ≤ 60 min a game.

## Out of scope

- Any `src/`, `data/` or `tools/` change. Strength (Q6). Major validation at ≥ 100 games (Q1, later).
- `simple-tournament` (`ABC-222`). Any clock other than 40/15.

## Acceptance criteria

- **A1 (pins).** As `ABC-222` `A1`, at `ABC-221`'s merge sha, with the mode's `setoption` line quoted from game 1.
- **A2 (games kept).** As `ABC-222` `A2`: 5 of 5 PGNs and logs are kept. A fault makes the reading UNRESOLVED and
  re-run once. A kill after a result line is counted and reported.
- **A3 (M1).** There are **0** losses on time by either side. The closest call is **≥ 500 ms**, derived as in PREREG
  (as `ABC-222` `A3`).
- **A4 (M2).** Every completed 40-move period, per side, uses **≥ 75 %** of its 900 s, book moves included, over at
  least 4 completed side-periods (as `ABC-222` `A4`).
- **A5 (the ceiling).** The longest single `skytalix` move is **≤ 60 000 ms** (a budget ≤ 59 500 ms plus
  `AR-NFR004-A`'s ≤ ~31 ms).
- **A6 (reported, not graded):**
  - the clock left after each period's 40th move;
  - the `go` lines with and without `movestogo`;
  - `isready` lines sent during a search;
  - the longest move and where in the period it fell;
  - per-move overhead (the PGN move time minus the budget the engine logged), as a median and a max.
- **A7 (host).** As `ABC-222` `A7`: ALONE, on AC, a thermal and frequency log, and the 5 % frequency rule.

## NFR triggers

- **`NFR-004`:** A5 (60 s, the owner's).
- **Heat:** ≤ ~5 h ALONE (`RISK-EPIC009-04`).
- **`NFR-008`:** untouched. **Security:** no new input; host paths stay out of the records.

## Test notes

1. QE's scratch clone. PREREG is sealed before game 1. Raw files go under QE's task context, with paths scrubbed.
2. A failed A3, A4 or A5 is NOT MET. It goes in as a `failed-attempt` note, and `ABC-221` goes back to BA/PM. One
   re-tune round is allowed.

## Size and priority

- **Size: S.** One reading of 5 games, ≤ ~5 h ALONE plus ~1 h QE.
- **Priority: P3.** It closes milestone 2.

## Dependencies

- `ABC-221` merged. `ABC-204`'s host tool pins. The openings file at its pinned sha. An idle board.
- `ABC-222` read first is useful (its per-move overhead), but it is not required.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ owner word (Q1, Q2, Q5, Q8) |
| 2 | scope and out-of-scope | ✅ 5 games pinned; strength and major validation out |
| 3 | INVEST | ✅ S; testable |
| 4 | testable, measurable acceptance | ✅ 0 losses on time, ≥ 500 ms, ≥ 75 % over ≥ 4 side-periods, ≤ 60 000 ms, every game kept |
| 5 | dependencies known | ✅ `ABC-221`; `ABC-204` pins; an idle board |
| 6 | NFR triggers with targets | ✅ `NFR-004` 60 s; the 5 % frequency rule |
| 7 | test notes | ✅ 2 |
| 8 | size | ✅ S |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ❌ nothing to read until `ABC-221` merges |

**DoR 9/10. Backlog** until `ABC-221` merges.
