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
> The SPRT text is in git at `452415bd`. **Aligned to the owner's rule and to the `ADR-0056` fold**
> (`arch-adr0056-100ms-fold`, merged `94f1504c` during this hop; its § "ABC-255 (M0): re-scope it" is followed
> here). The file name keeps "sprt" so that every reference to this page still resolves. Size M → S (no SPRT, no
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
  (≈ 1.0–1.6 h, `ADR-0056` C3′, estimate) are reproducible, not hand-built.

## Scope

1. **The change read (`ADR-0056` C2′):** `d` accepts `--budget-ms 100`, with `timemargin` 50 ms at that budget; Q1's
   5 000 − budget stays for every other budget. 100 games = `--rounds 50` (openings 1–50 of today's
   `tools/rating/openings.epd`, both colours).
2. **The epic read (C3′):** `rpair` and `r` accept the 100 ms control: `skytalix` `st=0.1` with `timemargin` 50 ms,
   Stockfish `st=0.1` with its 2 000 ms margin. 400 games = `rpair`'s default `--rounds 100` (200 per build) at
   `--concurrency 1`.
3. **Records:** as `ABC-204` / `ABC-225` write them (PGN, `cutechess-cli` log, host log, `SHA256SUMS`), plus the
   control.

## Out of scope

- **SPRT in any form** (the owner, 2026-11-01). No Elo or pass-line maths in repo code (`ABC-204` § Out of scope):
  the harness reports and QE grades by `ADR-0056` C2′ / C3′.
- A larger opening set: 100 games use 50 openings, and the epic read uses all 100 per build.
- Any change to `src/`, `data/`, `vitest.config.ts`, or the existing defaults and pins of `d`, `r` and `rpair`.
- A harness-side guard on E above 2 600: the fold puts an R5-style probe before any C3′ read whose E exceeds 2 600,
  and `ABC-204`'s depth guard makes a read UNRESOLVED if Stockfish misses its pick depth.
- Width above 1 by default (one core, the owner, `…f7a50e95`). `--concurrency` stays as it is.
- A second harness or a new binary.

## Acceptance criteria

- **A1 (change shape).** `node tools/rating/rating.ts d <candidate> <base> <out> --budget-ms 100 --rounds 50
  --concurrency 1 --dry-run` prints a `cutechess-cli` argument vector with `st=0.1` and `timemargin=50` on both
  engines, `-games 2 -rounds 50 -concurrency 1`, and today's opening file with `order=sequential` and `-repeat`. The
  dry run of the default and of each of today's budgets (3 000, 2 500, 2 000, 1 500, 1 000) is byte-equal to base's.
- **A2 (epic shape).** `rpair <base> <head> <out> --elo E --rounds 100 --concurrency 1 --dry-run` with the 100 ms
  control (flag name fixed at design) prints a schedule of 400 games, 200 per build, and every block's vector carries
  `st=0.1` and `timemargin=50` for `skytalix` and `st=0.1`, `timemargin=2000` for Stockfish. `r` with the same control
  prints the same two engine shapes. Without the control, every `rpair` and `r` dry run is byte-equal to base's
  (4 000 ms, `st=0.5`).
- **A3 (sanity read on a known pair, reported, not graded).** QE runs A1's command without `--dry-run` on `ABC-208`'s
  merge `b5c67ab7` against its first parent, host ALONE (≈ 25 min). Reported: W/L/D, score, Elo ± error, and whether
  the GAIN bar (≥ 50.0 of 100) is met (if its +38 holds at 100 ms it passes 94 % of the time, `ADR-0056`).
- **A4 (identical pair, reported, not graded).** QE runs A1's command on candidate = base = `main` at the hop, host
  ALONE (≈ 25 min): 100 of 100 games complete, 0 faults, 0 losses on time. Reported: games per hour and the draw ratio
  at 100 ms.
- **A5 (gates).** `npm run lint`, `typecheck`, `test`, `build` green at every commit. New lane rows ≤ 0.1 s (`G8`
  ≤ 10 s). `git diff` touches `tools/rating/` and its tests only.
- **A6 (the reading).** A `## Reading` section on this page with A3 and A4, and QE's sealed note.

## What happens on a miss

- **A4 shows a fault, a loss on time or an incomplete run:** a defect in the shape or the pairing. Back to the Software
  Engineer. A3 grades nothing: a low score is reported with `ADR-0056`'s depth-gated caveat and does not block.

## NFR triggers

- **`NFR-008`:** ≤ 0.1 s of new lane rows; no run enters `npm test`.
- **Host:** A3 and A4 (≈ 25 min each) run ALONE, logged as `ABC-225`. Both are under 1 h (estimates); if design shows
  one over 1 h, it is asked of the owner first. **Security:** builds only the SHAs it is given, as `ABC-204` does; no new
  input path in the engine.

## Test notes

1. Unit rows: the dry-run vectors of `d`, `rpair` and `r`, and the byte-equal defaults.
2. A3 and A4 run in QE's scratch clone, ALONE.
3. No UAT: tools only (as `ABC-225`, `ABC-247`).

## Size and priority

- **Size: S.** One budget on `d`, one control on `rpair` and `r`.
- **Priority: P1.** `EPIC-010`'s close read and every later strength change are read on it.

## Dependencies

- `ABC-204`, `ABC-225` and `ABC-247` Done.
- **Architect:** `ADR-0056` C2′ / C3′ and its § "ABC-255 (M0)" (merged `94f1504c`). Nothing open.
- **Owner:** none new.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ neither read can be played today |
| 2 | scope and out-of-scope | ✅ |
| 3 | INVEST | ✅ S; independent of every engine ticket |
| 4 | testable, measurable acceptance | ✅ byte-equal dry runs, the exact vectors, 100 / 400 games, 0 faults, 0 time losses |
| 5 | dependencies known | ✅ `ADR-0056` fold merged (`94f1504c`) |
| 6 | NFR triggers with targets | ✅ ≤ 0.1 s lane |
| 7 | test notes | ✅ |
| 8 | size | ✅ S |
| 9 | priority | ✅ P1 |
| 10 | no major unresolved blocker | ✅ may be pulled before `EPIC-010` closes (`EPIC-011` C12) |

**DoR 10/10 (re-scored 2026-11-01). Ready recommended; the column move is the Orchestrator's.**
