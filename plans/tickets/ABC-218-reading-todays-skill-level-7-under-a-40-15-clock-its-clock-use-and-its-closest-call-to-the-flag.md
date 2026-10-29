---
id: ABC-218
title: "Reading: today's `Skill Level` 7 under a 40/15 clock over UCI, its clock use and its closest call to the flag"
status: dropped
column: Done
size: S
priority: P2
epic: EPIC-009
owner: QE/E2E
---

# ABC-218: read today's `Skill Level` 7 under a 40/15 clock: clock use, closest call, losses on time

> **CLOSED BY THE OWNER 2026-10-29, NOT RUN.** Owner, verbatim (`orch-2026-10-29g` `…a67f71ac`): *"Close ABC-218 -
> no need to measure it, it is not deterministic and we can't anyway use it for tournament."* Recorded by BA/PM,
> task `bapm-amend-epic009`. No game was played, and nothing in `src/`, `data/` or `tools/` changed. Today's
> `Skill Level` 7 is not the 40/15 setting: `EPIC-009` builds `simple-tournament` (`ABC-220`) and later
> `uci-clock-mode` (`ABC-221`). Its protocol lives on, cut to 5 games at `tc=40/900`, as `ABC-222`'s and `ABC-223`'s
> smoke readings. There is no baseline to compare them against; they are graded on `EPIC-009` M1 and M2 alone. The
> page below is the cut, kept as history; its DoR no longer applies.
>
> **Cut 2026-10-29 by BA/PM** (task `bapm-epic009-tournament`, records only, at `main` `51c85f49`). A reading of
> today's engine. **No code changes.** It grades nothing on the engine: it reports, and the owner's options in
> `EPIC-009` § Options rest on it.

## Problem

- **User:** the owner, choosing between `EPIC-009`'s options (o), (a), (b) and (c).
- **Pain:** by the code (`EPIC-009` T3–T4; SA `sa-ideas-verify` `…1ccf0010` § 7, probe P1: one search at 22 500 ms),
  a GUI that sends a 40/15 clock already gets ~22.5 s a move at `Skill Level` 7, with a 50 ms margin at each period's
  last move. No game has read it on a real clock, and whether `cutechess-cli` sends `movestogo` is
  `UNKNOWN - verify` (SA § 7). The choice
  between "nothing new" and a clock mode turns on that reading.
- **Value:** measured clock use and closest call for today's engine, before anything is built. The same protocol is
  `ABC-222`'s acceptance reading, so its numbers are the baseline.

## Scope

- `cutechess-cli` 1.5.1 plays the built `dist/uci.js` of `main` against itself. Both sides: `Skill Level` 7, `OwnBook`
  on, one thread, `restart=on`.
- Two parts, at width 1, ALONE:
  - **Full length:** `tc=40/900`, 2 games (opening 1 of `tools/rating/openings.epd`, both colours), `-maxmoves 120`.
  - **Scaled:** `tc=40/60` (1.5 s a move at period start), 20 games (openings 1–10, both colours), `-maxmoves 120`.
    It exercises each period's last move about ten times more often than the full-length part.
- `timemargin=0` for both sides, so any overrun past the flag is a loss on time.
- `cutechess-cli` runs directly in QE's scratch clone. `tools/rating/rating.ts` plays `st=` only, and it is **not**
  edited.

## Out of scope

- Any `src/`, `data/` or `tools/` change. Strength: no Elo, no Stockfish (`EPIC-009` Q6).
- Grading `EPIC-009` M1/M2. This reading reports; M1/M2 are graded only by `ABC-222`, or under option (o) on the
  owner's word.

## Acceptance criteria

- **A1 (pins).** **Given** the scratch clone at a recorded `main` sha, built with `npm ci && npm run build` (rc 0),
  **when** the reading starts, **then** the record holds: the sha; `cutechess-cli --version` = 1.5.1 and its sha256
  equal to `ABC-204`'s host re-pin (2026-10-28); the `openings.epd` sha256 equal to `OPENINGS_SHA256`; the exact
  command line with paths replaced by placeholders (`ADR-0049` d4).
- **A2 (full length).** **Given** `tc=40/900`, **when** 2 games are played, **then** 2 of 2 PGNs and their
  `-debug all` logs are kept, and each game ends by a rule result, the move cap, or a loss on time. Any other end
  (illegal move, disconnect, stall, crash) is a named fault. An engine killed **after** the game's result line (for
  example at `cutechess-cli`'s 15 000 ms `IdleTimeout` after a game-end `stop`; `ADR-0045` A4, SA `…1ccf0010` § 8) is
  counted and reported, and it is not a fault of that game.
- **A3 (scaled).** **Given** `tc=40/60`, **when** 20 games are played, **then** 20 of 20 PGNs and logs are kept, as in
  A2.
- **A4 (what the GUI sends).** **Given** A2's logs, **then** the first `go` line of each game is quoted, and the count
  of `go` lines sent to `skytalix` with and without `movestogo` is reported. Expected: every one carries `movestogo`
  (`RISK-EPIC009-03`); a `go` without it is reported, not a fault.
- **A5 (the numbers), per part and per side.** Reported, not graded:
  - losses on time (count);
  - **closest call:** the least clock left after any `skytalix` move, in ms. It is derived from each `go` line's
    `wtime`/`btime` minus that move's time. QE pins the derivation in PREREG before game 1;
  - the clock left after each period's 40th move (list);
  - for each completed 40-move period, the time used as a % of the period's clock (900 s, or 60 s scaled), book moves
    included;
  - the longest single move, in ms, against the 30 000 ms budget and the 32 000 ms clamp;
  - `isready` lines sent during a search (count; `RISK-EPIC009-02`).
- **A6 (the arithmetic check).** **Given** A5, **then** QE states whether the readings match `EPIC-009`'s T3–T4
  arithmetic: ~22.5 s a move at a period's start, and ~50 ms left after a 40th move that followed full-budget moves.
  A mismatch is reported to BA/PM with the rows, not explained away.
- **A7 (host).** **Given** the run, **then** it ran ALONE (no other agent hop and no foreign `vitest` or harness), on
  AC, with a thermal and frequency log sampled at least every 60 s. Tctl median per quarter and max are reported. A
  frequency fall over 5 % from the run's first quarter makes the reading UNRESOLVED, named, and re-run once
  (`orch-2026-10-29g` `…ef6ab697`).

## NFR triggers

- **`NFR-004`:** read, not graded. A5's longest move is reported against 32 000 ms (`AR-NFR004-A` ≤ ~31 ms).
- **`NFR-008`:** untouched; nothing runs in `npm test`.
- **Heat:** the full-length part is ~1.5–3 h and the scaled part ~0.5–1 h of wall at width 1 (estimates,
  `UNKNOWN - verify`). That is long enough to reach this host's 80 °C+ medians (`…ef6ab697`). A7 covers it.
- **Security:** no new input; host paths stay out of the records.

## Test notes

1. QE's scratch clone only, like `ABC-202` and `ABC-204`. Raw files under `.grugops/context/qe-ABC-218/` (or QE's
   task name), with paths scrubbed.
2. PREREG sealed before game 1: the command lines, the game counts, the closest-call derivation, the thermal rule.
3. The `Skill Level` option spelling in `cutechess-cli` (`option.Skill Level=7`) is checked in the first game's log:
   the `setoption` line must reach the engine. If it does not, stop and fix the spelling before counting games.

## Size and priority

- **Size: S.** One reading, two parts, ~2.5–4 h ALONE plus ~1 h QE.
- **Priority: P2.** It is the owner's own idea, and every option rests on it. Nothing is broken without it.

## Dependencies

- `ABC-204`'s host tool pins (re-pinned 2026-10-28). The openings file at its pinned sha.
- An idle board: it is alone-when-idle work, scheduled by the Orchestrator, never beside another reading.
- No owner answer is needed.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ owner word (`EPIC-009` header); user, pain and value stated |
| 2 | scope and out-of-scope | ✅ two parts pinned; no code, no strength, no grade |
| 3 | INVEST | ✅ independent of every owner answer and of every other ticket; S |
| 4 | testable, measurable acceptance | ✅ A1–A7: counts, ms, %, pinned shas |
| 5 | dependencies known | ✅ `ABC-204` pins; an idle board |
| 6 | NFR triggers with targets | ✅ `NFR-004` read against 32 000 ms; 5 % frequency rule |
| 7 | test notes | ✅ 3 |
| 8 | size | ✅ S |
| 9 | priority | ✅ P2 |
| 10 | no major unresolved blocker | ✅ none |

**DoR 10/10. Ready.** QE/E2E, ALONE when the board is idle.
