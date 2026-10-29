---
id: ABC-222
title: "Smoke reading: `simple-tournament` plays 5 games at 40/15 over UCI with 0 losses on time, closest call ≥ 500 ms and ≥ 75 % clock use"
status: backlog
column: Backlog
size: S
priority: P2
epic: EPIC-009
owner: QE/E2E
---

# ABC-222: smoke reading of `simple-tournament` at 40/15: `EPIC-009` M1, M2 and the 22.5 s ceiling, in 5 games

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
- **Value:** `EPIC-009` M1 and M2 and the 22.5 s ceiling, shown working in real games.

## Scope

- `cutechess-cli` 1.5.1 plays the built `dist/uci.js` at `ABC-220`'s merge sha against itself. Both sides use
  `simple-tournament`, selected by the `option.<Name>=<value>` line the Architect ruled. `OwnBook` is on, with one
  thread and `restart=on`.
- **5 games at `tc=40/900`** (40/15, repeating, no increment), one game from each of openings 1–5 of
  `tools/rating/openings.epd`. In self-play both sides are the same build and setting, so colour balance does not
  matter. Each game gives two sides' clocks.
- Each game is capped at `-maxmoves 80`, two periods per side. QE checks in game 1's PGN whether `cutechess-cli`
  counts moves or plies, and pins the cap in PREREG so that an uncapped game reaches each side's move 40.
- `timemargin=0` for both sides, so any overrun past the flag is a loss on time.
- Width 1, ALONE. Wall ≤ ~5 h (≤ 80 moves × 2 sides × 22.5 s ≈ 60 min a game).
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
  - the `setoption` line that selects the setting, quoted from game 1's `-debug all` log. If it does not reach the
    engine, stop, fix the spelling, and restart the count.
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
  "completed period" in PREREG. It counts from the first move played after the opening position.
- **A5 (the ceiling).** The longest single `skytalix` move, from the PGN's per-move times, is **≤ 22 500 ms**.
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

- **`NFR-004`:** A5 (22.5 s, the owner's).
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

- **Size: S.** One reading of 5 games, ≤ ~5 h ALONE plus ~1 h QE.
- **Priority: P2.** It closes milestone 1.

## Dependencies

- `ABC-220` merged. `ABC-204`'s host tool pins (re-pinned 2026-10-28). The openings file at its pinned sha.
- An idle board: this is alone-when-idle work, scheduled by the Orchestrator, never beside another reading.

## Definition of Ready (re-scored 2026-10-29)

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ owner word (Q1, Q4, Q8) |
| 2 | scope and out-of-scope | ✅ 5 games pinned; strength and major validation out |
| 3 | INVEST | ✅ S; testable |
| 4 | testable, measurable acceptance | ✅ 0 losses on time, ≥ 500 ms, ≥ 75 %, ≤ 22 500 ms, 5 of 5 games |
| 5 | dependencies known | ✅ `ABC-220`; `ABC-204` pins; an idle board |
| 6 | NFR triggers with targets | ✅ `NFR-004` 22.5 s; the 5 % frequency rule |
| 7 | test notes | ✅ 3 |
| 8 | size | ✅ S |
| 9 | priority | ✅ P2 |
| 10 | no major unresolved blocker | ❌ nothing to read until `ABC-220` merges |

**DoR 9/10. Backlog** until `ABC-220` merges.
