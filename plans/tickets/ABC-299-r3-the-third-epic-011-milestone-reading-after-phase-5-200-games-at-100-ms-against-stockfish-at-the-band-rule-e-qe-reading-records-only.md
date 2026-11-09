---
id: ABC-299
title: "R3: the third EPIC-011 milestone reading, on main after Phase 5: 200 games at 100 ms a move against Stockfish 19 UCI_LimitStrength at the band-rule E, in R1's shape, reported as X ± Y on that scale with the highest milestone met named; above E 2 600, C3′'s probe first (QE reading, records only; no code)"
status: dropped
column: Done
size: S
priority: P3
epic: EPIC-011
feature: —
adr: "ADR-0056 D5 / D6 item 7 (R milestone readings) and C4's 100 ms outside-reading shape, ruled for R1–R3 (arch-post-269 …8136b589, ADR-0056 D6's dated line of 2026-11-03). Above E 2 600 at 100 ms, C3′'s probe gives the rule first (not written; UNKNOWN - verify). No new ADR"
---

# ABC-299: R3, the milestone reading after Phase 5

> **CLOSED WON'T-DO, 2026-11-09, by BA/PM** (task `bapm-close-1109`, records only, at `main` `e069b49a`; nothing run): project closed by the owner 2026-11-09 (`orch-2026-10-30a` `…a9c03e07`). Status `dropped`, column Done: closed, not delivered. The page below stands as the record; the board move is the Orchestrator's.

> **Cut 2026-11-04 by BA/PM: DoR 10/10, Backlog, HELD on its placement** (task `bapm-epic011-areas`, records only, at
> `main` `b274711c`; nothing run). Source: the owner's ruling 3 (`orch-2026-10-30a` `…4c4cb03d`). `EPIC-011` § Phases
> row R3 (the id is given now by the ruling).
> - **A reading, not a strength change.** It gates nothing. It tells the Orchestrator whether asking the owner for
>   the 40/15 claim (C1) or the A1 anchor is worth his hours (`ADR-0056` D6, "C1 is timed by a 100 ms reading … plus
>   the measured offset").
> - **Hold:** Phase 5's close (`ABC-282`, `ABC-296`–`ABC-298`; which close it is the Orchestrator's ruling).
> - **Conditional blocker, named:** if the band rule puts E above 2 600, `r` refuses it at 100 ms (`ABC-275`) until
>   C3′'s probe gives a rule. That probe and any tools change are then owed first. At R1, X read 1 806.5, so this is
>   not expected at R3 (a judgement, not a reading).
> - **The board move is the Orchestrator's.**

## Problem

- **User:** the owner (`EPIC-011` G2, "the climb is visible"; G1, the claim).
- **Pain:** R1 (1 806.5 ± 47.4) and R2 (`ABC-295`) bracket Phases 2–4. Phase 5 adds time use (W1), extensions and
  speed. Without R3 there is no outside number between R2 and the owner-asked 40/15 readings.
- **Value:** one number on the same scale after Phase 5. No Elo by itself.

## Scope

1. **One reading, QE, host ALONE, outside `npm test`,** on `main` after Phase 5, naming the sha. An R reading and an
   anchor's 100 ms half on the same sha are one reading.
2. **The shape:** R1's (`ABC-273` scope 2; `ABC-295` scope 2 writes it out), with the command
   `CUTECHESS_CLI=<cutechess-cli 1.5.1, sha256 dc776901…2154f40a> STOCKFISH=<Stockfish 19, sha256 c78c22a9…4593e352d2> node tools/rating/rating.ts r <main-sha> <out> --elo <E> --budget-ms 100 --rounds 100 --concurrency 1`.
   E starts at R2's figure; QE confirms it in the PREREG. `Threads 1` on both sides (threads are parked; if they
   re-open, the claim's "1 CPU" / "N CPU" labels apply, OQ-3 (c)).
3. **The report:** as R1's scope 3, with the highest milestone of 2 200 … 3 000 (*[proposed]*) met, or "none". Its own
   scale.

## Out of scope

- Any code. **The 40/15 claim reading** (G1, C1): of the order of 100–200 h, asked of the owner first; not this page.
  C4's anchors. V4's question (the owner's, if the curve flattens below 3 000 after Phase 5).

## Acceptance criteria

- **R3-A1 (validity).** 200 / 200 games complete, `skytalix` makes 0 faults and loses 0 games on time at the 50 ms
  margin. A base or Stockfish fault makes the reading UNRESOLVED: **re-run once, asked of the owner first**.
- **R3-A2 (the report).** Every scope-3 figure, the command as run with both variables shown set and paths redacted,
  the sha and the E used; Stockfish's `st=0.1 timemargin=2000` shown in `cmd.txt`; the `control:` line.
- **R3-A3 (cost).** About 0.4–0.9 h (an estimate; R1 measured 0.59 h). Over 1 h by QE's PREREG estimate, or a band-rule
  step's second run: asked of the owner first.
- **R3-A4 (the records).** `EPIC-011` § Phases' R3 row and G2 cite the figure (BA/PM, a records hop). If the curve has
  flattened below 3 000, the records name V4's question as the owner's.

## NFR triggers

- None on the product. Outside `npm test`; host ALONE; one core.

## Test notes

1. `ABC-204`'s pinned tools and `ABC-255` / `ABC-275`'s harness; paths out of the records.
2. No UAT (a reading, no production change).

## Size and priority

- **Size: S.** **Priority: P3**, the furthest reading out.

## Dependencies

- **Phase 5's close** (placement). **If E > 2 600:** C3′'s probe and any tools change first (conditional, named above).
- `ABC-275` merged (met).

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ G2 after Phase 5; the claim's timing |
| 2 | scope and out-of-scope | ✅ one reading; the claim out |
| 3 | INVEST | ✅ S |
| 4 | testable, measurable acceptance | ✅ 200 / 200, 0 faults, 0 time losses; every figure; ≤ 1 h or asked |
| 5 | dependencies known | ✅ Phase 5's close; the E > 2 600 condition named |
| 6 | NFR triggers with targets | ✅ none on the product |
| 7 | test notes | ✅ 1–2 |
| 8 | size | ✅ S |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ✅ control and command ruled; only the placement waits (and C3′'s probe, only if E > 2 600) |

**DoR 10/10. Held in Backlog until Phase 5's close.**
