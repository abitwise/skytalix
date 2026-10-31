---
id: 20261031T025128Z-qe-e2e-observation-00cc4db1
kind: observation
by: qe-e2e
at: 2026-10-31T02:51:28Z
verified_by: 
confidence: high: one real run, read against the sealed PREREG bars by QE's own reader; figures copied from raw/run/read.txt
refs:
  - ABC-222
  - ABC-220
  - EPIC-009
  - ADR-0052
  - NFR-004
  - AR-NFR004-A
  - RISK-EPIC009-02
  - RISK-EPIC009-03
  - RISK-EPIC009-04
  - 19d18df1
  - grugops/qe-ABC-222
  - qe-ABC-222/20261030T232126Z-qe-e2e-decision-63f93685
  - qe-ABC-220/20261030T152147Z-qe-e2e-observation-58af5b6a
supersedes: 
seal: sha256:5f6c1572e0f4957d22bbfcb4d43a7d89ab41ea01ba640efc3237ef81d3c18aca
---

# qe-ABC-222 reading: 5 games of `simple-tournament` at 40/15, ALONE, run to the end. A1–A5 and A7 MET, A6 reported: 0 losses on time, closest call 19 991 ms, worst period use 88.00 % over 10 side-periods, longest move 22 002 ms (+2 ms)

QE/E2E, task `qe-ABC-222`. Read against PREREG `…63f93685` (sealed and committed `9138d0a5` before any game).
Figures are copied from `raw/run/read.txt`, which is QE's reader `raw/scripts/read222.py` run on `raw/run/`.

## Run
- **Build:** tip `19d18df1`. Harness `raw/scripts/run-222.sh` (sha256 `a6132f7f…a7a`, unchanged since sealing). It
  ran as one background job: session 2026-10-30T23:23:19Z → 2026-10-31T02:49:27Z, rc 0, `status=done`, 5 games,
  10 side-periods.
- **No thermal stop and no watchdog.** The run is not VOID. The coverage extension did not fire: 4 side-periods
  were already complete after game 2.
- **Wait-clear** (`raw/run/precheck.log`): no foreign vitest or `cutechess-cli` pid at the snapshot. Clear at
  23:23:14Z on 3 checks: load1 1.15 / 0.83 / 0.59 and Tctl 32.5 / 32.1 / 32.5 °C.

## Games
| game | opening | plies | end | side-periods |
|---|---|---|---|---|
| g01 | 1 | 87 | 1/2-1/2, Draw by 3-fold repetition | 2 |
| g02 | 2 | 128 | 0-1, Black mates | 2 |
| g03 | 3 | 59 | 1-0, White mates | 0 |
| g04 | 4 | 160 | 1/2-1/2, Draw by adjudication: maximal game length (the cap) | 4 |
| g05 | 5 | 140 | 0-1, Black mates | 2 |

## A1 pins: MET
- Pins as in the PREREG § 1, re-stated in `raw/run/cmd.txt`:
  - sha `19d18df1`;
  - `cutechess-cli 1.5.1`, sha256 `dc776901…f40a`, equal to the `ABC-204` re-pin;
  - `openings.epd` `0d7f7a72…2666`, equal to `OPENINGS_SHA256`.
- **Game 1's `-debug all` log** has `>skytalix-a(0): setoption name TimeMode value simple-tournament` and
  `>skytalix-b(1): setoption name TimeMode value simple-tournament`. The same holds in all 5 games, with 0
  `TimeMode takes …` refusals.
- **The cap unit, from the PGNs:** `-maxmoves 80` gave `PlyCount` 160 in g04, with "maximal game length". The
  rehearsal's `-maxmoves 4` gave 8 plies. So the cap counts full moves.

## A2 games kept: MET
- 5 of 5 PGNs and `-debug all` logs are kept: 4 rule results and 1 move cap.
- 0 faults. 0 engine kill or timeout lines after a result line. All 10 engine stderr files are empty.
- Every side's go/bestmove pairs equal its PGN plies.

## A3 (M1): MET
- **0 losses on time.**
- **Closest call 19 991 ms:** g05 `skytalix-b` move 40, clock 41 991, elapsed 22 000.
- The next least are 19 992 (g04 a, move 40), 19 993 (g04 b, move 40), 39 990 (g04 b, move 80) and 39 991 (g04 a,
  move 80).
- The time per move is the exact clock delta (PREREG § 4). The stamp delta minus the exact figure over 564 moves is
  min −1, max +1, median 0 ms.

## A4 (M2): MET
10 side-periods are complete (≥ 4 needed). Each uses ≥ 75 %, and the minimum is **88.00 %**.

| game | side | period | use | clock left after its 40th move | book moves |
|---|---|---|---|---|---|
| g01 | w | P1 | 92.89 % | 63 986 ms | 2 |
| g01 | b | P1 | 92.89 % | 63 985 ms | 2 |
| g02 | w | P1 | 88.00 % | 107 984 ms | 4 |
| g02 | b | P1 | 88.00 % | 107 990 ms | 4 |
| g04 | w | P1 | 97.78 % | 19 992 ms | 0 |
| g04 | w | P2 | 97.78 % | 39 991 ms | 0 |
| g04 | b | P1 | 97.78 % | 19 993 ms | 0 |
| g04 | b | P2 | 97.78 % | 39 990 ms | 0 |
| g05 | w | P1 | 95.33 % | 41 988 ms | 1 |
| g05 | b | P1 | 97.78 % | 19 991 ms | 0 |

## A5 (the 22 s ceiling): MET
- **Longest move 22 002 ms:** g02 `skytalix-a` move 6, exact clock delta. Its PGN string is `22s`. It is
  < 22 500 ms, and the excess over 22 000 ms is **+2 ms**.
- 150 of 574 moves are over 22 000 ms, each by ≤ 2 ms.
- 561 of 574 moves carry a PGN time. The 13 without one are the 13 book moves (empty eval, < 500 ms). The max PGN
  time is `22s`, none reads above `22s`, and 0 PGN strings disagree with their exact figure.

## A6 (reported)
- **Clock left after each period's 40th move:** see the A4 table: 63 986, 63 985, 107 984, 107 990, 19 992, 39 991,
  19 993, 39 990, 41 988 and 19 991 ms.
- **`movestogo`:** 574 `go` lines carry it and 0 do not. Game 1's first `go` line:
  `go wtime 900000 btime 900000 movestogo 40`.
- **`isready` during a search: 0.** `cutechess-cli` sends `isready` before each `go`, never during one.
- **Per-move overhead** (elapsed − 22 000) over the 561 searched moves:
  - median **0 ms**, max **+2 ms**, min −1 ms;
  - 0 searched moves under 21 000 ms, so no early returns;
  - over exact clock deltas only, the max is +2 ms.
  - The 13 book moves took ≤ 1 ms each, 4 ms in all.
- **`AR-NFR004-A`, its next reading at 22 s:** max +2 ms over 561 searches through the real pipe and cutechess's
  timer. That is against the risk's ≤ ~31 ms and `qe-ABC-220` `A11`'s +1.0 ms in-process. The risk stands with its
  number.

## A7 (host): MET
- **Play window:** 23:23:19Z → 02:49:27Z, 12 368 s (3.44 h). 1 231 samples at 10 s, largest gap 11 s.
- **No battery** (an empty `power_supply` class), so the host was on mains.
- **ALONE:** 0 samples with a foreign vitest and 0 with a second `cutechess-cli`. load1 median 1.06–1.07 in each
  quarter, which is the one thinking engine.

| quarter | n | Tctl median | Tctl max | busiest-core MHz median | vs Q1 |
|---|---|---|---|---|---|
| Q1 | 308 | 73.9 | 76.1 | 5 033.7 | — |
| Q2 | 308 | 74.1 | 76.0 | 5 033.0 | −0.01 % |
| Q3 | 307 | 73.5 | 75.9 | 5 038.7 | +0.10 % |
| Q4 | 308 | 74.0 | 76.0 | 5 034.1 | +0.01 % |

- **Tctl median 73.9 °C, max 76.1 °C.** The running median never neared 85 °C, and the last watcher line read
  73.9 °C.
- **No frequency fall:** the worst quarter is −0.01 % against Q1. The precedent formula (run median / median of the
  first 6 samples) gives a fall of 0.52 % (INFO).
