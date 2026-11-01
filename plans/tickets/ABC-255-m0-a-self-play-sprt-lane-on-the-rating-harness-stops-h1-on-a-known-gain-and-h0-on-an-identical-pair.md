---
id: ABC-255
title: "M0: the rating harness plays the owner's reads: 100 games new against base and 400 games head-to-head at 100 ms a move, and a 10-game Stockfish smoke at 0.5 s a move (tools only)"
status: backlog
column: Backlog
size: S
priority: P1
epic: EPIC-011
---

# ABC-255: the owner's 100 / 400 reads at 100 ms and the 0.5 s smoke (M0)

> **RE-SCOPED AGAIN 2026-11-01 by BA/PM** (task `bapm-owner-answers`, records only, at `main` `adab5f0d`; nothing run).
> The owner's answers (`orch-2026-10-30a` `…43098cef`, verbatim there): *"1. b ; 2. ok ; 3. quick check can be with
> 0.5s difficulty. Make sure engine is not changed internally and it works on different difficulty settings."*
> **(1)** The epic read is 400 games head-to-head at 100 ms, the closing build against the starting build: `d`'s
> shape, so the 100 ms control on `rpair` and `r` (the 200 + 200 pair against Stockfish) is **dropped**. **(3)** The
> 10-game smoke against Stockfish is kept with `skytalix` at 0.5 s a move: `r` (and `rpair`, which reuses `r`'s
> vector) gain that control. **The owner's condition** is a new row (A6): no `src/` or `data/` change, and the control
> reaches `skytalix` only as `st=` / `timemargin=`. Size stays S. DoR 10/10 → **9/10**: the `ADR-0056` fold of these
> answers (`arch-adr0056-owner-answers`) is not on `main`, and it may name the 0.5 s margin and the smoke's E. The
> previous text is in git at `adab5f0d`.

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
- **Pain:** the owner's rule asks for three things the harness cannot play as one command each. `d` (new against base)
  refuses any budget under 1 000 ms (`tools/rating/rating.ts` `D_BUDGETS_MS`), so neither the 100-game change read nor
  the 400-game head-to-head epic read runs at 100 ms; `qe-tc-depth-probe` played its 100 ms games from a scratch
  script (`…07357280`). `r` plays `skytalix` only at 4 000 ms, so the 10-game smoke cannot run at 0.5 s.
- **Value:** each read is one pinned command with its records: a change read (≈ 0.4 h), an epic read (≈ 1.6 h, 4 × the
  change read; estimate) and a smoke (≈ 10 min, estimate) are reproducible, not hand-built.

## Scope

1. **`d` at 100 ms (`ADR-0056` C2′; the owner's answer 1):** `d` accepts `--budget-ms 100`, with `timemargin` 50 ms at
   that budget; Q1's 5 000 − budget stays for every other budget. The change read is `--rounds 50` (100 games,
   openings 1–50, both colours); the epic read is `--rounds 200` (400 games, `d`'s default rounds over the 100
   openings of today's `tools/rating/openings.epd`), head against base.
2. **The 0.5 s smoke control on `r` and `rpair` (the owner's answer 3):** `skytalix` `st=0.5` with a `timemargin`
   fixed at design (or by the fold, if it names one); Stockfish keeps `r`'s `st=0.5` and `timemargin=2000`. The
   smoke is `r <build> <out> --elo E --rounds 5 --concurrency 1` with that control (flag name fixed at design).
3. **Records:** as `ABC-204` / `ABC-225` write them (PGN, `cutechess-cli` log, host log, `SHA256SUMS`), plus the
   control.

## Out of scope

- **SPRT in any form** (the owner, 2026-11-01). No Elo or pass-line maths in repo code (`ABC-204` § Out of scope):
  the harness reports and QE grades.
- **The 100 ms control on `rpair` and `r`** (dropped 2026-11-01: the epic read no longer plays Stockfish). If the
  fold keeps a 100 ms Stockfish reading (C1's claim timing, C4's anchors, a milestone reading), it is added then.
- A larger opening set: 100 games use 50 openings; 400 games use the 100 openings in 200 rounds, as `d`'s default does.
- **Any change to `src/`, `data/`, `vitest.config.ts`** (the owner's condition), or to the existing defaults and pins
  of `d`, `r` and `rpair`.
- A harness check that the engine works across its difficulty settings: the Architect names that check in the fold;
  it is not this ticket's.
- Width above 1 by default (one core, the owner, `…f7a50e95`). `--concurrency` stays as it is.
- A second harness or a new binary.

## Acceptance criteria

- **A1 (`d` at 100 ms).** `node tools/rating/rating.ts d <candidate> <base> <out> --budget-ms 100 --rounds 50
  --concurrency 1 --dry-run`, and the same with `--rounds 200`, each print a `cutechess-cli` argument vector with
  `st=0.1` and `timemargin=50` on both engines, `-games 2 -rounds 50` (resp. `-rounds 200`) `-concurrency 1`, and
  today's opening file with `order=sequential` and `-repeat`. The dry run of the default and of each of today's
  budgets (3 000, 2 500, 2 000, 1 500, 1 000) is byte-equal to base's.
- **A2 (the 0.5 s control).** `r <build> <out> --elo E --rounds 5 --concurrency 1 --dry-run` with the 0.5 s control
  prints a vector with `st=0.5` and the design's `timemargin` for `skytalix`, no `option.Skill Level` on `skytalix`,
  and `st=0.5`, `timemargin=2000` for Stockfish. `rpair` with the same control prints the same `st=` and `timemargin=` on both
  engines in every block, its `option.Skill Level=6` (`ABC-247`) unchanged. Without the control, every `r` and `rpair` dry run is byte-equal to base's (4 000 ms, `st=0.5`).
- **A3 (sanity read on a known pair, reported, not graded).** QE runs A1's 100-game command without `--dry-run` on
  `ABC-208`'s merge `b5c67ab7` against its first parent, host ALONE (≈ 25 min). Reported: W/L/D, score, Elo ± error,
  and whether the GAIN bar (≥ 50.0 of 100) is met (if its +38 holds at 100 ms it passes 94 % of the time, `ADR-0056`).
- **A4 (identical pair, reported, not graded).** QE runs A1's 100-game command on candidate = base = `main` at the
  hop, host ALONE (≈ 25 min): 100 of 100 games complete, 0 faults, 0 losses on time. Reported: games per hour and the
  draw ratio at 100 ms.
- **A5 (one real smoke, reported, not graded).** QE runs A2's `r` command without `--dry-run` on `main` at the hop,
  E = 1 910 unless the fold names another, host ALONE (≈ 10 min): 10 of 10 games complete, 0 faults, 0 losses on
  time. Reported: W/L/D, score, games per hour, and Stockfish's depth per move (for the fold's E).
- **A6 (the owner's condition: the engine is not changed).** `git diff --name-only <base> <head> -- src/ data/` is
  empty, and in every A1 and A2 vector the control reaches `skytalix` only as `st=` and `timemargin=` (no new
  `option.` on `skytalix`).
- **A7 (gates).** `npm run lint`, `typecheck`, `test`, `build` green at every commit. New lane rows ≤ 0.1 s (`G8`
  ≤ 10 s). `git diff` touches `tools/rating/` and its tests only.
- **A8 (the reading).** A `## Reading` section on this page with A3, A4 and A5, and QE's sealed note.

## What happens on a miss

- **A4 or A5 shows a fault, a loss on time or an incomplete run:** a defect in the shape or the pairing. Back to the
  Software Engineer. A3 and A5 grade nothing: a low score is reported (A3 with `ADR-0056`'s depth-gated caveat) and does
  not block.
- **A6 fails:** NOT MET; the control moves out of the engine before review.

## NFR triggers

- **`NFR-008`:** ≤ 0.1 s of new lane rows; no run enters `npm test`.
- **Host:** A3, A4 (≈ 25 min each) and A5 (≈ 10 min) run ALONE, logged as `ABC-225`. All are under 1 h (estimates);
  if design shows one over 1 h, it is asked of the owner first. **Security:** builds only the SHAs it is given, as
  `ABC-204` does; no new input path in the engine.

## Test notes

1. Unit rows: the dry-run vectors of `d` (both round counts), `r` and `rpair`, and the byte-equal defaults.
2. A3, A4 and A5 run in QE's scratch clone, ALONE.
3. No UAT: tools only (as `ABC-225`, `ABC-247`).

## Size and priority

- **Size: S.** One budget on `d`, one control on `r` (which `rpair` reuses).
- **Priority: P1.** `EPIC-010`'s close read and every later strength change are read on it.

## Dependencies

- `ABC-204`, `ABC-225` and `ABC-247` Done.
- **Architect:** `ADR-0056` C2′ (merged `94f1504c`) for the 100 ms margin; **the owner-answers fold
  (`arch-adr0056-owner-answers`, in flight)** for anything it names on the 0.5 s control (margin, E).
- **Owner:** none new (answers 1–3 given, `…43098cef`).

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ none of the three reads can be played today |
| 2 | scope and out-of-scope | ✅ |
| 3 | INVEST | ✅ S; independent of every engine ticket |
| 4 | testable, measurable acceptance | ✅ byte-equal dry runs, the exact vectors, 100 / 400 / 10 games, 0 faults, 0 time losses, an empty `src/` / `data/` diff |
| 5 | dependencies known | ⚠️ the owner-answers fold is not on `main`; it may name the 0.5 s margin and the smoke's E *(2026-11-01; was ✅ on the first fold, `94f1504c`)* |
| 6 | NFR triggers with targets | ✅ ≤ 0.1 s lane |
| 7 | test notes | ✅ |
| 8 | size | ✅ S |
| 9 | priority | ✅ P1 |
| 10 | no major unresolved blocker | ✅ may be pulled before `EPIC-010` closes (`EPIC-011` C12, confirmed by the Orchestrator) |

**DoR 9/10 (re-scored 2026-11-01, `bapm-owner-answers`). Ready once the owner-answers fold merges and does not
change the shapes above; the column move is the Orchestrator's.**
