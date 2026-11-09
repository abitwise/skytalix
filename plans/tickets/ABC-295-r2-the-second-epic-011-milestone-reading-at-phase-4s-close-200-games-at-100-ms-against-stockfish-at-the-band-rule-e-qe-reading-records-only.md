---
id: ABC-295
title: "R2: the second EPIC-011 milestone reading, on main at Phase 4's close: 200 games at 100 ms a move against Stockfish 19 UCI_LimitStrength at the band-rule E, in R1's shape, reported as X ± Y on that scale with the highest milestone met named (QE reading, records only; no code)"
status: done
column: Done
closed: "2026-11-09, merged to local main at 06f4e0be (from grugops/qe-ABC-295; records only, no code); QE qe-ABC-295 reading …e11c410e VALID: 122 / 8 / 70, 126.0 / 200 (63.0 %) against Stockfish 19 at E 1 810, Elo +92.5 ± 49.1, X = 1 902.5 ± 49.1 (cluster ± 42.3), highest milestone none; R2-A1..A3 MET by QE, R2-A4 met by bapm-close-1109b (EPIC-011 R2 row and G2). Front matter by bapm-close-1109b"
size: S
priority: P2
epic: EPIC-011
feature: —
adr: "ADR-0056 D5 / D6 item 7 (R milestone readings) and C4's 100 ms outside-reading shape, ruled for R1–R3 (arch-post-269 …8136b589, ADR-0056 D6's dated line of 2026-11-03). No new ADR"
---

# ABC-295: R2, the milestone reading at Phase 4's close

> **CLOSED 2026-11-09, DONE, by BA/PM** (task `bapm-close-1109b`, records only, at `main` `638ac8a5`; nothing run).
> **Merged to local `main` at `06f4e0be`** from `grugops/qe-ABC-295` (records only). Source: QE `qe-ABC-295` verdict `…e11c410e` and
> readings `…1245d022` (PREREG `…4151e128`); the owner's held host and pre-approved step (`orch-2026-10-30a` `…810191ff` items 1–2).
>
> **Result: VALID, read once.** On `main` `e069b49a` (`src/` `bba42fb7`), host ALONE (0 foreign processes in 213 samples):
>
> | row | bar | read | result |
> |---|---|---|---|
> | R2-A1 | 200 / 200, 0 faults, 0 time losses | 200 / 200; faults 0; 0 time losses either side; depth guard 0 of 10 608 | MET |
> | R2-A2 | every scope-3 figure; the command as run | W / D / L **122 / 8 / 70**, **126.0 / 200 (63.0 %)**, Elo **+92.5 ± 49.1** against E 1 810, **X = 1 902.5 ± 49.1** (opening-cluster ± 42.3), `G11` reported; highest milestone **none** (E < 2 200); both tool variables set, paths redacted; `control:` line byte-equal (`ABC-275` A6) | MET |
> | R2-A3 | ≤ 1 h or asked | 0.60 h measured (estimate 0.4–0.9 h); band rule: E 1 810 confirmed, no step, no second run; the owner's pre-approved step not used | MET |
> | R2-A4 | `EPIC-011` § Phases R2 row and G2 cite the figure | written by this hop (`bapm-close-1109b`) | MET |
>
> - **R2 against R1 (reported, not graded):** X₂ − X₁ = 1 902.5 − 1 806.5 = **+96.0**; about ± 68 combined, so about +28 to +164. Each is one
>   200-game sample on the same E, control, openings and pins. Its own scale: never compared with the 4 s ≈ 2 074, never pooled into S′.
> - **One move-cap draw, as QE gives it:** round 24 (opening 24), Stockfish White and `skytalix` Black, adjudicated a draw at 400 plies by
>   `-maxmoves 200`, with Stockfish showing `+M3` at the last move. It gives `skytalix` at most +0.5: at 125.5 / 200 the score would be
>   62.75 %, about +91 Elo, with the same band outcome. R2-A1 does not count it as a fault; the tool reports it on its own line.
> - **No product finding.** `G1` (40/15), C4's anchors and R3 (`ABC-299`, closed won't-do) are out of scope. `EPIC-011`'s `G7` 400-game read is
>   waived by the owner (`…810191ff` item 3), so this is the epic's last reading.
> - The board move is the Orchestrator's (made at `397b892c`).

> **READY, 2026-11-09, by BA/PM** (task `bapm-close-1109`, records only, at `main` `e069b49a`; nothing run): the hold is met. **Phase 4 is closed by the closures** of the project's close, the Orchestrator's ruling under § Dependencies (`orch-2026-10-30a` `…a9c03e07` item 1), and the owner's yes runs R2 as this page stands (item 2). DoR 10/10, unchanged. Nothing else on this page moves.

> **Cut 2026-11-04 by BA/PM: DoR 10/10, Backlog, HELD on its placement** (task `bapm-epic011-areas`, records only, at
> `main` `b274711c`; nothing run). Source: the owner's ruling 3 (`orch-2026-10-30a` `…4c4cb03d`). `EPIC-011` § Phases
> row R2 ("QE reading, cut when Phase 4 closes"; the id is given now by the ruling).
> - **A reading, not a strength change.** It gates nothing (`EPIC-011` § Phases: milestone readings "gate nothing").
> - **Hold:** Phase 4's close. Which Phase 4 tickets close it is the Orchestrator's ruling (`UNKNOWN - verify` today:
>   `ABC-271`, the second pull, `ABC-272` and `ABC-290`–`ABC-294` are open). Then Ready, by a records hop or the
>   Orchestrator's move.
> - **The board move is the Orchestrator's.**
> - *2026-11-05 (`bapm-wait-lines-1105`; `…2b3440cf` item 4, `ADR-0056` D6's dated line): the second pull no longer holds Phase 4 open. The
>   Architect reads the close as `ABC-272` and `ABC-290`–`ABC-294` settling. The ruling stays the Orchestrator's. Nothing else on this page
>   moves: 200 games at 100 ms, the band rule, R1's shape and R1's figure as the base.*

## Problem

- **User:** the owner, who wants to see where the climb stands (`EPIC-011` G2).
- **Pain:** R1 read **X = 1 806.5 ± 47.4** at E 1 810 on `main` `85a304ff`, after E1 (`ABC-273`, QE `…07b3c794`).
  Every read since is self-play except the 10-game S′ smoke, which sees only a collapse (`RISK-EPIC011-04`). ~~The second pull is a tuned set, and a tuned set judged by self-play alone is the failure on record
  (`RISK-EPIC010-05`).~~
  *2026-11-05 (`bapm-wait-lines-1105`; `…2b3440cf` item 4): the second pull closed NOT MET, so no tuned set reaches this reading. R2 reads a
  rule-made evaluation, with any term merged by then on hand values. It reads less of a jump than Phase 4 was planned for: expect no
  E2 term in the reading.*
- **Value:** one number on the same scale after Phase 4, so the evaluation block's outside effect can be read against
  R1. No Elo by itself.

## Scope

1. **One reading, QE, host ALONE, outside `npm test`,** on `main` at Phase 4's close, naming the sha. An R reading and
   an anchor's 100 ms half on the same sha are one reading (`ADR-0056` D6).
2. **The shape** (R1's, `ABC-273` scope 2): 200 games, openings 1–100 with both colours, one game at a time;
   `skytalix` at `st=0.1`, `timemargin` 50 ms, level 5, no `Skill Level`; Stockfish 19 `UCI_LimitStrength` at E by
   `ABC-204`'s band rule (25–75 %), `st=0.1`, `timemargin` 2 000, `Threads 1`, `Hash 16`, `restart=on`; `ABC-204`'s
   depth guard. The command, as R1 ran it:
   `CUTECHESS_CLI=<cutechess-cli 1.5.1, sha256 dc776901…2154f40a> STOCKFISH=<Stockfish 19, sha256 c78c22a9…4593e352d2> node tools/rating/rating.ts r <main-sha> <out> --elo <E> --budget-ms 100 --rounds 100 --concurrency 1`.
   - **E starts at R1's 1 810; QE confirms it in the PREREG.** At 100 ms `r` refuses E above 2 600 (`ABC-275`).
   - Both variables are required; paths stay out of the records (`ADR-0049` d4).
3. **The report:** W / D / L, score, Elo ± error against E, X = E + Δ, the opening-cluster interval, `G11`, and the
   highest milestone of 2 200 … 3 000 (*[proposed]*) met by `ADR-0056` D5's claim rule, or "none". Its own scale: never
   compared with the 4 s ≈ 2 074, never pooled into S′.

## Out of scope

- Any code; a harness gap found here is a new ticket. The 40/15 claim (G1) and C4's anchors (40/15, asked of the owner
  first). R3 (`ABC-299`).

## Acceptance criteria

- **R2-A1 (validity).** **Given** the reading, **then** 200 / 200 games complete, `skytalix` makes 0 faults
  (`EPIC-010` S-1's states) and loses 0 games on time at the 50 ms margin. A base or Stockfish fault makes the reading
  UNRESOLVED: **re-run once, asked of the owner first** (`QE-273-c`, folded).
- **R2-A2 (the report).** QE's note carries every figure of scope 3, the command as run with both variables shown set
  and paths redacted, the `main` sha and the E used; `cmd.txt` shows Stockfish at `st=0.1 timemargin=2000` and the
  `control:` line names both sides' control (`ABC-275` A6).
- **R2-A3 (cost).** About 0.4–0.9 h (an estimate; R1 measured 0.59 h). **If QE's PREREG estimate is over 1 h, it is
  asked of the owner before it starts.** A band-rule step's second run is asked of the owner first.
- **R2-A4 (the records).** `EPIC-011` § Phases' R2 row and G2 cite the figure (BA/PM, a records hop).

## NFR triggers

- None on the product. Outside `npm test` (`NFR-008` untouched); host ALONE; one core.

## Test notes

1. `ABC-204`'s pinned tools and `ABC-255` / `ABC-275`'s harness; paths out of the records.
2. No UAT (a reading, no production change).

## Size and priority

- **Size: S.** **Priority: P2**, as R1 (the Orchestrator raised R1 to P2).

## Dependencies

- **Phase 4's close** (the Orchestrator's ruling on which tickets close it). The placement, not a design blocker.
- `ABC-275` merged (met, `85a304ff`).

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ G2; ~~R1's figure predates the tuner~~ *(2026-11-05: no tuned set reaches this reading)*; `RISK-EPIC011-04` |
| 2 | scope and out-of-scope | ✅ one reading; no code |
| 3 | INVEST | ✅ S |
| 4 | testable, measurable acceptance | ✅ 200 / 200, 0 faults, 0 time losses; every scope-3 figure; ≤ 1 h or asked |
| 5 | dependencies known | ✅ Phase 4's close (placement); `ABC-275` met |
| 6 | NFR triggers with targets | ✅ none on the product |
| 7 | test notes | ✅ 1–2 |
| 8 | size | ✅ S |
| 9 | priority | ✅ P2 |
| 10 | no major unresolved blocker | ✅ the control and command are ruled (`…8136b589`); only the placement waits |

**DoR 10/10. Held in Backlog until Phase 4's close.**
