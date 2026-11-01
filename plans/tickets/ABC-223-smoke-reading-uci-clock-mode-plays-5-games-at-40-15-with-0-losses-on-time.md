---
id: ABC-223
title: "Smoke reading: `uci-clock-mode` plays 5 games at 40/15 over UCI with 0 losses on time, closest call ≥ 500 ms and ≥ 75 % clock use"
status: done
column: Done
closed: "2026-11-01, merged to main at b45162fc; QE PASS_WITH_GAPS (qe-ABC-223, 767b4959), no blocking gap, which signs UAT"
size: S
priority: P3
epic: EPIC-009
owner: QE/E2E
---

# ABC-223: smoke reading of `uci-clock-mode` at 40/15: `EPIC-009` M1, M2 and the 60 s ceiling, in 5 games

> **CLOSED 2026-11-01, Done, folded by BA/PM** (task `bapm-epic009-close`, records only, at `main` `38c787be`; nothing
> run). QE's verdict is **PASS_WITH_GAPS** (`qe-ABC-223` `…767b4959`) by the pre-registered rule (PREREG `…caae8984`,
> sealed at `fe866192` before game 1), **with no blocking gap**. Merged at `b45162fc`. **The QE verdict signs UAT**
> (owner delegation, 2026-10-22). The merge changes no production line. Reading `…2c62a346`, artifacts `…247a14c4`,
> observations `…5c8f2995`.
>
> - **Build:** `main` `28e46464`. Its diff from `af32f82c` over `src` and `data` is 4 `*.test.ts` files only, so by
>   the RE-SCORED rule it is `ABC-221`'s build.
> - **A1 MET** (pins; `setoption name TimeMode value uci-clock-mode` reached both engines, 5 of 5 games, 0 refusals).
>   **A2 MET** (5 of 5 kept, 0 faults, 0 kills after a result). **A3 MET (M1):** 0 losses on time, closest call
>   **1 099 ms** (≥ 500). **A4 MET (M2):** 12 side-periods, least use **99.88 %** (≥ 75 %). **A5 MET:** longest move
>   **25 285 ms** (≤ 60 000), 0 budgets at the 59 500 cap. **A6** clocks left at period ends were 1 099–1 101 ms;
>   `movestogo` was on 629 of 629 `go` lines; 0 `isready` arrived during a search; overhead median +0.6 ms, max
>   +2.5 ms over 614 searches. **A7 GAP:** not ALONE (QE-223-a), on mains, Tctl median 78.1 °C (max 93.1 °C),
>   frequency fell by at most 0.26 %, 3.93 h of play.
> - **Test note 2 did not fire.** Nothing goes back to `ABC-221`, and no re-tune or re-run is owed.
> - **Dispositions (QE-223-a…g):**
>   - **a (MEDIUM, host): accepted, non-blocking; no ticket.** Another repository's `vitest` ran in 48.8 % of samples.
>     PREREG § 5's window rule did not fire (no move left < 1 000 ms; none took ≥ 59 900 ms), so A3 and A5 stand.
>     The host is shared outside this repository, so this is not a defect here. **Owner informed by the
>     Orchestrator** (board, `38c787be`: "owner told again"), as for `EPIC-010` QE-M1B2-c. Its effect on search depth
>     is `UNKNOWN - verify` and out of scope (no strength reading).
>   - **b (INFO, A3): accepted.** 1 100 − δ at all 12 period ends is `ADR-0052` D2's margin, read live. In this
>     smoke's scope it closes `RISK-EPIC009-01` for `uci-clock-mode`. A forfeit rate is bounded only by `EPIC-011`'s
>     40/15 readings (G4; C6).
>   - **c (INFO, A5): accepted, no action.** The cap is not approached at 40/15. Its hard stop is held by `ABC-221`
>     A10 (59 500.8 ms) and `ABC-246`'s rows.
>   - **d (INFO, `AR-NFR004-A`): accepted.** +2.5 ms max at 22.4–25.3 s budgets is under ~31 ms. The figure is
>     Security/NFR's to place at its next catalog hop; no catalog edit is owed here.
>   - **e (INFO): accepted, no action.** `RISK-EPIC009-02`/`-03` were not exercised. They stay covered by
>     `AR-UCI-BUSY` and the `ABC-220`/`ABC-221` virtual-clock rows.
>   - **f (INFO, method): recorded, no action.** The thermal stop was SIGTERM, so `EPIC-010` QE-M1B2-b's pause clause
>     did not apply. The harness was launched detached anyway.
>   - **g (INFO): recorded.** 2 games reached the cap and 12 side-periods completed (4 needed). The play took 3.93 h,
>     inside the ≤ ~5 h bound (`RISK-EPIC009-04`).
> - **`EPIC-009` milestone 2 is graded MET on this reading and `ABC-221`'s.** The epic is closed (its page).

> **RE-SCORED 2026-10-31 by BA/PM** (task `bapm-ABC-221-fold`, records only, at `main` `9c008db4`; nothing run). **The
> wait is met: `ABC-221` merged** at `af32f82c` (code `c48a6f83`) and `9395d8dc`, on QE PASS_WITH_GAPS (`qe-ABC-221`
> `…861e737d`) and Security/NFR PASS (`secnfr-ABC-221` `…ef060512`). **DoR 9/10 → 10/10, Ready.** The board move and
> the order are the Orchestrator's. What the merge sets here:
>
> - **The build (A1).** "`ABC-221`'s merge sha" is **`af32f82c`**, the merge that carries the code. `git diff c48a6f83
>   9c008db4 -- src data tools` is empty. *BA/PM's reading:* a later `main` sha is the same build for this reading
>   only if `git diff af32f82c <sha> -- src data` lists `*.test.ts` files and nothing else (for example `ABC-245`'s or
>   `ABC-246`'s test-only merges). PREREG names the one sha it plays.
> - **A6's budget is derived.** Read from the code at `9c008db4`: no engine line names the budget (the `info string`
>   lines are `book`, the refusals and the level notice). So the 2026-10-31 fallback below applies: PREREG derives each
>   budget from its `go` line by `ADR-0052` D4 (`min(59 500, C)`; `min(x, 59 500)` for `movetime`). That `UNKNOWN` is
>   closed.
> - **What `ABC-221` read that this reading confirms in play:** on the virtual clock 1 069 ms are left on every move of
>   a period (A2–A4), and on the real clock the longest search walled 59 500.8 ms at a 59 500 budget (A10). At 40/15
>   with `movestogo` the share stays near 22.4 s, so A5 is not expected to reach the cap. A3's closest call (≥ 500 ms)
>   is still the row to watch: the margin is about 1 s.
> - **Host.** QE-221-c showed an orphan process from another hop can hold a core through an ALONE window. A7's ALONE
>   check includes no foreign process at 100 % of a core before game 1. This reading must not overlap `ABC-245`'s or
>   `ABC-246`'s `G8`; the order is the Orchestrator's.
> - **Nothing else moves.** 5 games plus the coverage extension (the "play all 10" rule did not fire), the bounds in
>   A3–A5, size S, P3.

> **DATED 2026-10-31 by BA/PM** (task `bapm-ABC-222-epic009-m1`, records only, at `main` `4bd9ac6a`). **`ABC-222` is
> Done** (QE PASS `qe-ABC-222` `…cc542c76`, merged `ae7211c3`), and milestone 1 meets M1–M4 (`EPIC-009`). What that
> reading sets here:
>
> - **The "play all 10" rule does not fire.** `ABC-222`'s per-move overhead max is **+2 ms**, under the 300 ms trigger
>   (median 0 ms, 561 searches). So this reading plays 5 games, plus the coverage extension only if fewer than 4
>   side-periods complete. *(In `ABC-222`, 5 games completed 10.)*
> - **How A5 and A6 read their ms.** `cutechess-cli` 1.5.1 prints a move time of ≥ 10 s to whole seconds in the PGN
>   (QE-222-f). So PREREG takes each move's time from the exact `go` clock deltas, as `ABC-222`'s PREREG did. The PGN
>   is cross-checked against them; in `ABC-222` 0 of 561 disagreed.
>   - A5's bound does not move: ≤ 60 000 ms, read exactly.
>   - A6's "the budget the engine logged": if no engine line carries the budget, PREREG derives it from each `go` line
>     by `ADR-0052` D4 (`min(59 500, C)`). Whether an engine line carries it is `UNKNOWN - verify` at PREREG.
> - **The slack to read against.** The real δ in `ABC-222` was ≤ 2 ms, against this mode's ≤ 600 ms on a period's
>   last move. This mode's margin is about 1 s, not 18.8 s, so A3's closest call is the row to watch.
> - **Not exercised in `ABC-222`, logged again here:** `isready` during a search (0) and `go` without `movestogo` (0).
>   That is A6, unchanged.
> - **The wall.** `ABC-222`'s 5 games took 3.44 h ALONE (Tctl median 73.9 °C, max 76.1 °C). This mode may spend up to
>   its whole clock (≤ 60 min a game, § Scope), so the ≤ ~5 h bound stands. 3.44 h is not a forecast for this mode.
> - **Nothing else moves.** DoR stays **9/10**, and the ticket stays in Backlog until `ABC-221` merges.

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

- `ABC-221` merged *(met 2026-10-31, `af32f82c`)*. `ABC-204`'s host tool pins. The openings file at its pinned sha. An idle board.
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
| 10 | no major unresolved blocker | ✅ `ABC-221` merged at `af32f82c` (2026-10-31). *(Was ❌: nothing to read until `ABC-221` merges.)* |

**DoR 10/10 (re-scored 2026-10-31, `bapm-ABC-221-fold`). Ready.** It runs ALONE, ≤ ~5 h. *(Was: "DoR 9/10. Backlog
until `ABC-221` merges.")* *(2026-11-01: **Done**, merged `b45162fc`; see the CLOSED block at the top.)*
