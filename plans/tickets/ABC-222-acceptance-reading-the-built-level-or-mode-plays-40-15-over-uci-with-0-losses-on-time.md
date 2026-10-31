---
id: ABC-222
title: "Smoke reading: `simple-tournament` plays 5 games at 40/15 over UCI with 0 losses on time, closest call ≥ 500 ms and ≥ 75 % clock use"
status: done
column: Done
closed: "2026-10-31, merged to main at ae7211c3; QE PASS (qe-ABC-222, cc542c76), which signs UAT"
size: S
priority: P2
epic: EPIC-009
owner: QE/E2E
---

# ABC-222: smoke reading of `simple-tournament` at 40/15: `EPIC-009` M1, M2 and the 22 s ceiling, in 5 games

> **CLOSED 2026-10-31, Done, folded by BA/PM** (task `bapm-ABC-222-epic009-m1`, records only, at `main` `4bd9ac6a`).
> QE's verdict is **PASS** (`qe-ABC-222` `…cc542c76`), by the pre-registered rule (PREREG `…63f93685`, sealed at
> `9138d0a5` before any game). It was merged at `ae7211c3`. **The QE verdict signs UAT** (the owner delegation; no
> production line changed). The reading is in `…00cc4db1` and the observations are in `…4daf292f`.
>
> - **A1 MET.** The pins hold. Game 1's `-debug all` log shows `setoption name TimeMode value simple-tournament` for
>   both engines, with 0 refusals in 5 games. `-maxmoves 80` counts full moves (`PlyCount` 160 at the cap).
> - **A2 MET.** 5 of 5 games are kept: 4 rule results and 1 move cap. 0 faults, 0 kills after a result.
> - **A3 MET (M1).** 0 losses on time. The closest call is **19 991 ms** (bar ≥ 500 ms).
> - **A4 MET (M2).** 10 side-periods are complete (≥ 4 needed). The least use is **88.00 %** (bar ≥ 75 %). The coverage
>   extension did not fire.
> - **A5 MET (22 s).** The longest move is **22 002 ms**, below 22 500 ms. That is +2 ms over 22 000 ms, and it is
>   expected (§ FOLDED). No PGN time reads above `22s`.
> - **A6 reported:**
>   - the clock left after a period's 40th move is 19 991–107 990 ms;
>   - 574 of 574 `go` lines carry `movestogo`;
>   - 0 `isready` lines arrived during a search;
>   - the per-move overhead has a median of 0 ms and a max of +2 ms, over 561 searches.
> - **A7 MET.** The run was ALONE and on mains. The Tctl median was 73.9 °C and the max 76.1 °C. The frequency fell by
>   ≤ 0.01 % against Q1. The play window was 3.44 h for 5 games.
> - **QE-222-a (INFO, the build).** QE built the tip `19d18df1`, not `ec1e835b`, under the RE-SCORED block's rule. Over
>   `src/uci-session.ts`, `src/engine.ts` and `src/uci.ts`, only `engine.ts` differs: `ABC-229`'s `quietPromotions`
>   switch. The deadline, the 1 024-node check and `HARD_CEILING_MS` are unchanged. So the reading covers what `main`
>   ships, with the `ABC-228`/`ABC-229` search included. A1's "at `ABC-220`'s merge sha" is met by that rule.
> - **QE-222-f (INFO) closes A5's `UNKNOWN - verify`, the PGN's precision.** `cutechess-cli` 1.5.1 prints a move time
>   of ≥ 10 s to whole seconds. So the PGN alone reads A5 exactly at the owner's whole-second reading: `22s` means
>   < 22 500 ms. The ms figures come from the `go` clock deltas. Those are the same integer, and 0 of 561 disagree. A
>   book move under 500 ms has no PGN time at all.
> - **QE-222-b (INFO), for Security/NFR:** `AR-NFR004-A` at 22 s, through the real pipe and cutechess's timer, reads max
>   +2 ms over 561 searches. The risk stands with its number. No catalog edit is made on this hop.
> - **QE-222-d, QE-222-e (INFO): `RISK-EPIC009-02` and `-03` were not exercised.** cutechess sent 0 `isready` during a
>   search, and it sent `movestogo` on every `go`. Both residuals stay covered as before: `AR-UCI-BUSY` and `ABC-220`'s
>   virtual-clock rows.
> - **QE-222-c, -g, -h (INFO): no ticket.**
>   - c: the closest call is `ADR-0052` D3's arithmetic, less 9 ms.
>   - g: the reader got one parsing fix after the ungraded rehearsal; no derivation moved.
>   - h: ALONE rests on a process scan plus the Orchestrator's schedule.
> - **Test note 3 did not fire.** Nothing goes back to BA/PM, and no re-tune is owed.
> - **`EPIC-009` milestone 1 is complete** (`ABC-220` + `ABC-222`). The grade against M1–M4 is on the epic page.
> - The notes are in `.grugops/context/bapm-ABC-222-epic009-m1/notes/`.

> **CONFIRMED 2026-10-30 by the owner, folded by BA/PM** (task `bapm-ABC-242-225-owner`, records only). His words on
> this item, verbatim (`orch-2026-10-30a` `…f4673b9f`): *"Whole-second reading of "≤ 22 s" - confirm"*. The first
> half of that message, the catalog's reference machine, is Security/NFR's.
>
> - **The PREREG reads A5 against < 22 500 ms.** "≤ 22 s" is read to the whole second, by the owner's word. The open
>   confirmation in the two blocks below is **closed**. A5's bound does not move.
> - Nothing else changes. DoR stays 10/10, and the ticket stays Ready.

> **RE-SCORED 2026-10-30 by BA/PM** (task `bapm-ABC-220-merge-fold`, records only, at `main` `4ac4f3bb`). **The wait
> is met: `ABC-220` merged at `ec1e835b`** (QE PASS_WITH_GAPS `qe-ABC-220` `…7a09c5e1`; Security/NFR
> PASS_WITH_RISKS `secnfr-ABC-220`). **DoR 9/10 → 10/10. Backlog → Ready.** The board move is the Orchestrator's.
>
> - **The build to read** is `ABC-220`'s merge, `ec1e835b` (Scope, A1). If `main` has moved on when the reading
>   starts, QE records the tip sha it builds and, in PREREG, the `git diff --stat ec1e835b..<tip>` over
>   `src/uci-session.ts`, `src/engine.ts` and `src/uci.ts`.
> - **What `ABC-220` measured, for the PREREG to read against** (`qe-ABC-220` `…58af5b6a`, on this host): one search at
>   T took 21 999.4–22 001.0 ms of wall (`A11`, 5 positions), so the in-process overshoot is ≤ 1.0 ms of
>   `AR-NFR004-A`'s ≤ ~31 ms. A6's per-move overhead (the PGN time minus T) is therefore mostly the pipe and
>   cutechess. Security/NFR names these games as `AR-NFR004-A`'s next reading at 22 s (the 5-search sample is thin).
> - **A5 is unchanged:** < 22 500 ms, the whole-second reading. The owner's confirmation of that reading is still open
>   and blocks nothing (`ABC-220`'s FOLDED note). *(**Confirmed by the owner 2026-10-30**, `…f4673b9f`.)* A move over 22 000 ms is expected and is reported, not a breach.
> - **QE-220-f (INFO):** a spaced `setoption name Time Mode …` is ignored silently. A1's check of game 1's `-debug all`
>   log for `setoption name TimeMode value simple-tournament` is the guard; it stays as written.
> - **Scheduling, not a DoR gap:** the reading is ALONE on an idle host (≤ ~5 h, ≤ ~10 h with the coverage
>   extension). The Orchestrator places it after any timed SE or QE hop on the host.

> **FOLDED 2026-10-30 by BA/PM** (task `bapm-owner-adr-fold`, records only, at `main` `a046e839`). The owner accepted
> `ADR-0052` with the ceiling at 22 s, equal to T (`orch-2026-10-29g` `…3dd61448`; `ABC-220`'s header has his words).
>
> - **A5:** the longest move is **≤ 22 s read to the whole second, that is < 22 500 ms** (was ≤ 22 500 ms). The engine is
>   never handed more than 22 000 ms (`ABC-220` A6); the stop overshoot and the pipe add a few ms past it. A move
>   over 22 000 ms is therefore expected and is not a breach. The excess is reported (A6). This whole-second reading is
>   BA/PM's, on the owner's "whole seconds", and the Orchestrator confirms it with him. *(**Confirmed by the owner
>   2026-10-30**, `orch-2026-10-30a` `…f4673b9f`: "Whole-second reading of "≤ 22 s" - confirm".)*
> - **A3 and A4 hold unchanged:** T is still 22 000 ms, so 40 × 22 s = 880 s of 900 s (97.8 %, 97.9 % at δ = 31 ms),
>   ≈ 18.8 s left after move 40, and M1's ≥ 500 ms survives δ ≤ 487 ms a move on average.
> - Wall: 80 moves × 2 sides × 22 s ≈ 59 min a game, still ≤ ~5 h for 5 games. DoR stays 9/10, waiting on `ABC-220`.

> **RECONCILED 2026-10-29 to `ADR-0052` (PROPOSED) by BA/PM** (task `bapm-owner-words-b`, records only).
>
> - **The selecting line** is `option.TimeMode=simple-tournament` (`ADR-0052` D1). It needs no shell quoting. Game 1's
>   `-debug all` log must show `setoption name TimeMode value simple-tournament`.
> - **`cutechess-cli` 1.5.1 sends `movestogo`** whenever moves are left in the period (the Architect read its source,
>   `…04fdc439` § 1). A6 still logs it.
> - **The slack to read against:** M1's ≥ 500 ms survives a per-move overhead δ ≤ 600 ms on a period's last move, and
>   about 487 ms of δ per move on average (`ADR-0052` D5). A6's overhead figures are read against that.
> - **Smoke size: 5 games, kept** (BA/PM's call; the owner's `EPIC-009` word is "5 or 10"). Why not `EPIC-010`'s 10:
>   - A 40/15 game costs up to ≈ 1 h ALONE, so 10 games would be ≈ 10 h of heat for one reading. The owner's 10 in
>     `EPIC-010` was said of games at 1.5 s and 3 s a move, ≈ 0.7 h for all 20.
>   - What this smoke guards, the flag at a period's end, is held by arithmetic with ≈ 18.8 s to spare (`ADR-0052`
>     D3). Five games give up to 20 side-period ends to look at, which "makes sure things work". A forfeit rate is
>     the later major validation's to count (≥ 100 games), and 10 games could not bound one either.
>   - **One coverage rule uses his upper bound** (A4 below): if the 5 games complete fewer than 4 side-periods, QE plays
>     on, up to 10 games. Self-play often ends early by repetition (`sa-ABC-226`: 1 718 of 4 199 games), and a smoke
>     that never reaches move 40 cannot read M2.
> - Nothing else changes. DoR stays 9/10, waiting on `ABC-220`.
>
> **RE-SCOPED 2026-10-29 by BA/PM** (task `bapm-amend-epic009`, records only, at `main` `a5d70e35`), on the owner's
> answers of 2026-10-29 (`orch-2026-10-29g` `…a67f71ac`).
>
> - **Was:** the acceptance reading of whichever level or mode was built: 2 full-length games plus 20 scaled games,
>   compared with `ABC-218`'s baseline.
> - **Now:** `simple-tournament`'s smoke reading. It is 5 games at 40/15, "just to make sure things work" (Q1).
> - `ABC-218` was closed by the owner, not run, so there is no baseline. The reading is graded on `EPIC-009` M1, M2
>   and the 22.5 s ceiling alone.
> - Major validation (≥ 100 games, 24–48 h) and any strength reading are later, and out of this MVP (Q1, Q6).
> - `uci-clock-mode`'s smoke reading is `ABC-223`.
>
> **Cut 2026-10-29 by BA/PM** (task `bapm-epic009-tournament`). The cut's text is in git at `f45aea95`.

## Problem

- **User:** the owner, and any `cutechess-cli` match that selects `simple-tournament` at 40/15.
- **Pain:** "never loses on time" is a claim about the real clock and the real pipe. `ABC-220`'s virtual-clock rows
  cannot show it, and the pipe and GUI latency is unread (`EPIC-009` § The budget T).
- **Value:** `EPIC-009` M1 and M2 and the 22 s ceiling, shown working in real games.

## Scope

- `cutechess-cli` 1.5.1 plays the built `dist/uci.js` at `ABC-220`'s merge sha against itself. Both sides use
  `simple-tournament`, selected by `option.TimeMode=simple-tournament` (`ADR-0052` D1). `OwnBook` is on, with one
  thread and `restart=on`.
- **5 games at `tc=40/900`** (40/15, repeating, no increment), one game from each of openings 1–5 of
  `tools/rating/openings.epd`. In self-play both sides are the same build and setting, so colour balance does not
  matter. Each game gives two sides' clocks.
- Each game is capped at `-maxmoves 80`, two periods per side. QE checks in game 1's PGN whether `cutechess-cli`
  counts moves or plies, and pins the cap in PREREG so that an uncapped game reaches each side's move 40.
- `timemargin=0` for both sides, so any overrun past the flag is a loss on time.
- **Coverage extension (2026-10-29):** if the 5 games complete fewer than 4 side-periods (a side's 40th move
  reached), QE plays on, one game at a time on openings 6, 7, … in order, until 4 are complete, **up to 10 games in
  all** (the owner's "5 or 10").
- Width 1, ALONE. Wall ≤ ~5 h (≤ 80 moves × 2 sides × 22 s ≈ 59 min a game); ≤ ~10 h if the extension runs to 10.
- `cutechess-cli` runs directly in QE's scratch clone. `tools/rating/rating.ts` plays `st=` only and is **not** edited.

## Out of scope

- Any `src/`, `data/` or `tools/` change. Strength: no Elo and no Stockfish (Q6).
- Major validation at ≥ 100 games (Q1, later). A forfeit rate: 5 games cannot bound one.
- `uci-clock-mode` (`ABC-223`).

## Acceptance criteria

- **A1 (pins).** **Given** the scratch clone at `ABC-220`'s merge sha, built with `npm ci && npm run build` (rc 0),
  **when** the reading starts, **then** the record holds:
  - the sha;
  - `cutechess-cli --version` = 1.5.1, with its sha256 equal to `ABC-204`'s host re-pin (2026-10-28);
  - the `openings.epd` sha256, equal to `OPENINGS_SHA256`;
  - the exact command line, with paths replaced by placeholders (`ADR-0049` d4);
  - the `setoption` line that selects the setting, quoted from game 1's `-debug all` log: it must read `setoption name
    TimeMode value simple-tournament`. If it does not reach the engine, stop, fix the spelling, and restart the
    count.
- **A2 (games kept).** 5 of 5 PGNs and their `-debug all` logs are kept. Each game ends by a rule result, the move cap,
  or a loss on time.
  - Any other end (an illegal move, a disconnect, a stall, a crash) is a named fault, and it makes the reading
    UNRESOLVED and re-run once.
  - An engine killed **after** a game's result line (for example at `cutechess-cli`'s 15 000 ms `IdleTimeout` after a
    game-end `stop`; `ADR-0045` A4) is counted and reported. It is not a fault of that game.
- **A3 (M1).** Over the 5 games, there are **0** losses on time by either side. The closest call is **≥ 500 ms**: the
  least clock left after any `skytalix` move, derived from each `go` line's `wtime`/`btime` minus that move's time. QE
  pins the derivation in PREREG before game 1.
- **A4 (M2).** Every completed 40-move period, per side, uses **≥ 75 %** of its 900 s, book moves included. QE pins
  "completed period" in PREREG. It counts from the first move played after the opening position. **At least 4
  side-periods are completed** across the games played (the coverage extension above, up to 10 games). If 10 games
  still complete fewer than 4, A4 is UNRESOLVED and named, not MET.
- **A5 (the ceiling, 22 s, owner 2026-10-30).** The longest single `skytalix` move, from the PGN's per-move times, is
  **≤ 22 s read to the whole second, that is < 22 500 ms**. QE pins the PGN time's precision in PREREG
  (`UNKNOWN - verify` for `cutechess-cli` 1.5.1). *(The whole-second reading was confirmed by the owner on
  2026-10-30, `…f4673b9f`. The PREREG reads A5 against < 22 500 ms.)* *(**Closed 2026-10-31**, QE-222-f (`qe-ABC-222`
  `…4daf292f`): 1.5.1 prints ≥ 10 s to whole seconds, so `22s` reads < 22 500 ms. Read: 22 002 ms, MET.)*
- **A6 (reported, not graded):**
  - the clock left after each period's 40th move (a list);
  - the count of `go` lines sent with and without `movestogo` (`RISK-EPIC009-03`), and game 1's first `go` line,
    quoted;
  - `isready` lines sent during a search (a count; `RISK-EPIC009-02`);
  - per-move overhead: the PGN move time minus T, as a median and a max. This is the first reading of the pipe and GUI
    latency (`EPIC-009` § The budget T).
- **A7 (host).** The run is ALONE (no other agent hop, no foreign `vitest`, no harness) and on AC, with a thermal and
  frequency log sampled at least every 60 s. The Tctl median per quarter and the max are reported. A frequency fall
  over 5 % from the run's first quarter makes it UNRESOLVED, named, and re-run once (`orch-2026-10-29g` `…ef6ab697`).

## NFR triggers

- **`NFR-004`:** A5 (22 s, the owner's, amended 2026-10-30; read to the whole second).
- **Heat:** ≤ ~5 h ALONE (`RISK-EPIC009-04`). A7.
- **`NFR-008`:** untouched. Nothing runs in `npm test`.
- **Security:** no new input. Host paths stay out of the records.

## Test notes

1. QE's scratch clone only, like `ABC-202` and `ABC-204`. Raw files go under QE's task context, with paths scrubbed.
2. PREREG is sealed before game 1: the command line, the cap and its unit, the closest-call derivation, "completed
   period", and the thermal rule.
3. A failed A3, A4 or A5 is NOT MET. It goes in as a `failed-attempt` note, and `ABC-220` goes back to BA/PM. One
   re-tune round is allowed (for example a smaller T, which the owner is told).

## Size and priority

- **Size: S.** One reading of 5 games, ≤ ~5 h ALONE plus ~1 h QE (≤ ~10 h if the coverage extension runs to 10).
- **Priority: P2.** It closes milestone 1.

## Dependencies

- `ABC-220` merged: **met 2026-10-30, `ec1e835b`**. `ABC-204`'s host tool pins (re-pinned 2026-10-28). The openings file at its pinned sha.
- An idle board: this is alone-when-idle work, scheduled by the Orchestrator, never beside another reading.

## Definition of Ready (re-scored 2026-10-30, `bapm-ABC-220-merge-fold`; was 9/10 on 2026-10-29)

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ owner word (Q1, Q4, Q8) |
| 2 | scope and out-of-scope | ✅ 5 games pinned, extended to ≤ 10 only for coverage; strength and major validation out |
| 3 | INVEST | ✅ S; testable |
| 4 | testable, measurable acceptance | ✅ 0 losses on time, ≥ 500 ms, ≥ 75 % over ≥ 4 side-periods, longest move < 22 500 ms (22 s to the whole second), every game kept |
| 5 | dependencies known | ✅ `ABC-220` (merged `ec1e835b`); `ABC-204` pins; an idle board |
| 6 | NFR triggers with targets | ✅ `NFR-004` 22 s (2026-10-30); the 5 % frequency rule |
| 7 | test notes | ✅ 3 |
| 8 | size | ✅ S |
| 9 | priority | ✅ P2 |
| 10 | no major unresolved blocker | ✅ `ABC-220` merged at `ec1e835b` (2026-10-30). The whole-second confirmation is the owner's and blocks nothing. *(Confirmed by the owner 2026-10-30, `…f4673b9f`.)* *(Was ❌: nothing to read until `ABC-220` merges.)* |

**DoR 10/10 (2026-10-30). Ready.** It closes milestone 1. It runs ALONE on an idle host; the Orchestrator places it.
*(**Done 2026-10-31:** QE PASS `…cc542c76`, merged `ae7211c3`. Milestone 1 is closed; see the CLOSED block at the top.)*
*(Was: "DoR 9/10. Backlog until `ABC-220` merges.")*
