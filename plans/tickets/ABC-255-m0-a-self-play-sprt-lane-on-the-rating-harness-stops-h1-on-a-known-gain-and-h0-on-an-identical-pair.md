---
id: ABC-255
title: "M0: the rating harness plays the owner's two reads at 100 ms a move: 100 games new against base, and the 400-game pair against Stockfish (tools only)"
status: backlog
column: Backlog
size: S
priority: P1
epic: EPIC-011
---

# ABC-255: the owner's 100 / 400 reads at 100 ms (M0)

> **RE-SCOPED 2026-11-01 by BA/PM** (task `bapm-100-400-rule`, records only, at `main` `452415bd`; nothing run). The
> owner's word (`orch-2026-10-30a` `…2896c6eb`): no SPRT; *"We can just run 100 games that's it and 400 games after
> each epic is done on 100ms."* **The SPRT lane is dropped**, and the page below is rewritten for the two reads he set.
> The SPRT text is in git at `452415bd`. **Aligned to the owner's rule, pending the `ADR-0056` fold**
> (`arch-adr0056-100ms-fold`, in flight): Stockfish's move time, the band of E it is measured for, and the pass lines
> are its. The file name keeps "sprt" so that every reference to this page still resolves. Size M → S (no SPRT, no
> new opening file). It may be pulled before `EPIC-010` closes, because that epic's close reading needs it (`EPIC-011`
> C12).

> **Cut 2026-11-01 by BA/PM** (task `bapm-epic011-dedupe`, records only, at `main` `2e9a2457`; nothing run, built or
> timed). Source: `ADR-0056` D2 row M0 ("SPRT self-play lane … none — new ticket"), D5 § Per-change measure, D8 ("On
> Q-3K-2/3: the M0 ticket (`tools/` only; acceptance: an SPRT run on a known +gain pair such as `ABC-208`'s … terminates
> H1, and on an identical pair terminates H0)"). `EPIC-011` Phase 0, pull 1. **Starts after `EPIC-006`, `EPIC-009` and
> `EPIC-010` close** (owner, 2026-11-01, `…022fb66f`).

## Problem

- **User:** the owner, QE, and every strength-changing ticket from here on, in `EPIC-010`'s close and in `EPIC-011`.
- **Pain:** the owner's rule asks for two reads at 100 ms a move, and the harness can play neither. `d` (new against
  base) refuses any budget under 1 000 ms (`tools/rating/rating.ts` `D_BUDGETS_MS`), and `rpair` (base and head each
  against Stockfish) plays `skytalix` at 4 000 ms against Stockfish at `st=0.5`. `qe-tc-depth-probe` had to play its
  100 ms games from a scratch script (`…07357280`).
- **Value:** each read is one pinned command with its records, so a change read (≈ 0.4 h) and an epic read
  (≈ 1.3–2 h, estimate) are reproducible, not hand-built.

## Scope

1. **The change read:** `d` accepts a 100 ms budget. 100 games = `--rounds 50` (openings 1–50 of today's
   `tools/rating/openings.epd`, both colours). Each side keeps today's rule `timemargin` = 5 000 − budget.
2. **The epic read:** `rpair` gains a `skytalix` move time (100 ms) and a Stockfish move time (default: the fold's),
   both recorded in the run's header and records. 400 games = today's default `--rounds 100` (200 per build).
3. **The Stockfish band:** an E outside the band the fold names as measured at Stockfish's move time is refused.
4. **Records:** as `d` and `rpair` write them today (PGN, `cutechess-cli` log, host log, `SHA256SUMS`), plus the two
   move times.

## Out of scope

- **SPRT in any form** (the owner, 2026-11-01). No Elo or pass-line maths in repo code (`ABC-204` § Out of scope):
  the harness reports and QE grades by the fold's rule.
- A larger opening set: 100 games use 50 openings, and the epic read uses all 100 per build.
- Any change to `src/`, `data/`, `vitest.config.ts`, the `r` mode, or the existing defaults of `d` and `rpair`.
- Width above 1 by default (one core, the owner, `…f7a50e95`). `--concurrency` stays as it is.
- A second harness or a new binary.

## Acceptance criteria

- **A1 (change shape).** `node tools/rating/rating.ts d <candidate> <base> <out> --budget-ms 100 --rounds 50
  --concurrency 1 --dry-run` prints a `cutechess-cli` argument vector with `st=0.1` and `timemargin=4900` on both
  engines, `-games 2 -rounds 50 -concurrency 1`, and today's opening file with `order=sequential` and `-repeat`. The
  dry run of the default and of each of today's budgets (3 000, 2 500, 2 000, 1 500, 1 000) is byte-equal to base's.
- **A2 (epic shape).** `rpair <base> <candidate> <out>` with the 100 ms flag and `--concurrency 1 --dry-run` (flag
  names fixed at design) prints a schedule of 400 games, 200 per build, and every block's vector carries `st=0.1` for
  `skytalix` and Stockfish's `st=` at the fold's default. Without the new flags the dry run is byte-equal to base's
  (4 000 ms, `st=0.5`).
- **A3 (Stockfish band).** An `--elo` outside the band the fold names as measured at Stockfish's move time exits 1
  and names the band. Until the fold lands the band is ≤ 2 600 at any Stockfish time under 500 ms (the probe's measured
  top, `…9fd1fdce`). A unit row pins one refused and one accepted E.
- **A4 (a real change read, identical pair).** QE runs A1's command without `--dry-run`, candidate = base = `main` at
  the hop, host ALONE: 100 of 100 games complete, 0 faults, 0 losses on time, and the score meets the fold's pass
  line. Reported: W/L/D, score, Elo ± error, wall time and games per hour (the probe read 259 an hour on a shared
  host). A miss of the pass line is re-run once; a second miss is a defect.
- **A5 (a short real epic read).** QE runs A2's command without `--dry-run` and with `--rounds 10` (40 games, one
  block per build), base = candidate = `main`, host ALONE: 40 of 40 complete, `skytalix` 0 faults and 0 losses on
  time, the Stockfish depth guard reads 0 misses, and games per hour is reported, so the 400-game read's hours are read
  and not guessed.
- **A6 (gates).** `npm run lint`, `typecheck`, `test`, `build` green at every commit. New lane rows ≤ 0.1 s (`G8`
  ≤ 10 s). `git diff` touches `tools/rating/` and its tests only.
- **A7 (the reading).** A `## Reading` section on this page with A4 and A5, and QE's sealed note.

## What happens on a miss

- **A4 misses twice, or A5 shows a fault:** a defect in the shape or the pairing. Back to the Software Engineer.
- **A5 reads depth-guard misses:** the Stockfish time does not hold its pick depth on this host. QE records it; the
  Architect re-reads the default. The mode does not merge until A5 reads 0 misses.

## NFR triggers

- **`NFR-008`:** ≤ 0.1 s of new lane rows; no run enters `npm test`.
- **Host:** A4 (≈ 0.4 h) and A5 run ALONE, logged as `ABC-225`. Both are under 1 h (estimates); if design shows one
  over 1 h, it is asked of the owner first. **Security:** builds only the SHAs it is given, as `ABC-204` does; no new
  input path in the engine.

## Test notes

1. Unit rows: both dry-run vectors, the byte-equal defaults, the E band.
2. A4 and A5 run in QE's scratch clone, ALONE.
3. No UAT: tools only (as `ABC-225`, `ABC-247`).

## Size and priority

- **Size: S.** One budget on `d`, two move times on `rpair`, one guard.
- **Priority: P1.** `EPIC-010`'s close read and every later strength change are read on it.

## Dependencies

- `ABC-204`, `ABC-225` and `ABC-247` Done.
- **Architect:** the `ADR-0056` fold: Stockfish's default move time, its measured band of E, the pass lines.
- **Owner:** none new.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ neither read can be played today |
| 2 | scope and out-of-scope | ✅ |
| 3 | INVEST | ✅ S; independent of every engine ticket |
| 4 | testable, measurable acceptance | ✅ byte-equal dry runs, 100 / 400 games, 0 faults, 0 time losses, 0 depth misses |
| 5 | dependencies known | ⚠️ Stockfish's default time, the band and the pass line are the `ADR-0056` fold's (in flight) |
| 6 | NFR triggers with targets | ✅ ≤ 0.1 s lane |
| 7 | test notes | ✅ |
| 8 | size | ✅ S |
| 9 | priority | ✅ P1 |
| 10 | no major unresolved blocker | ✅ may be pulled before `EPIC-010` closes (`EPIC-011` C12) |

**DoR 9/10 (re-scored 2026-11-01). Backlog; Ready once the `ADR-0056` fold is merged (row 5).**
