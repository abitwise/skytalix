# se-ABC-303-main observation: on the moved base R1, R2, P3, P4 equal the old figures to the count; b reads 2.2786, rounding to 2.3; A0's shipped counts move

Head `c0c5b84c`, base `main` `572edf13`, each a `git archive` in scratch. Drivers `se-ABC-303` `raw/read.ts`, `raw/audit.ts`, `raw/audit_patch.py`, `arch-ABC-282` `raw/p1p2.mjs`, `raw/an1.mjs`, `se-ABC-282` `raw/a0-3.mjs`, all unedited. Every output was non-empty (`raw/out/exits.txt`). Reported, not judged. These are the engineer's readings; QE re-reads.

| row | old | on `c0c5b84c` |
|---|---|---|
| R1, P4's own door and all on | 93.58 %, 80 cp / 94.12 %, 79 cp | 93.58 %, 80 cp / 94.12 %, 79 cp |
| R2 | 288 / 1 886 = 15.27 %; 29, 9, 0 | 288 / 1 886 = 15.27 %; 29, 9, 0 |
| P3, bar ≤ 0.89 × | 0.6039 / 0.8170 / 0.7509 / 0.8363 | the same |
| P4, bar ≥ door + 0.10 | +0.116 | +0.116 (6.900 → 7.016) |
| b, pooled median, n 175 | 2.3043 on `22931005`; 2.3319 at the ADR | 2.2786, p25 1.912, p75 2.734, rounds to **2.3** |

b on the base `572edf13`, same driver, is 2.3043, the sealed figure, so the instrument holds. Per depth on the head, d = 4-10: 2.188, 2.346, 2.310, 2.095, 2.350, 2.341, 2.228. Odd d 2.292, even d 2.250. No change to b is proposed.

**A0-1, frozen clock, shipped path, base → head.**
| position | d | base | head |
|---|---|---|---|
| kiwipete | 6 | e2a6 −59, 140 341 | e2a6 −101, 104 780 |
| kiwipete | 7 | d5e6 −82, 330 628 | e2a6 −105, 244 677 |
| kiwipete | 8 | d5e6 −89, 707 548 | e2a6 −114, 573 518 |
| position-6 | 6 | c3d5 87, 14 570 | c3d5 87, 10 513 |
| position-6 | 7 | c3d5 79, 32 165 | c3d5 43, 39 268 |
| position-6 | 8 | c3d5 71, 101 425 | c3d5 45, 94 911 |

**A0-2, `virtualClock(1)`, no `softMs`.** Depth, move and nodes are the same in all four; the score moves.
| position | budget | depth, move, nodes | base score | head score |
|---|---|---|---|---|
| kiwipete | 50 | 5, e2a6, 47 384 | −59 | −75 |
| kiwipete | 200 | 6, e2a6, 199 960 | −59 | −101 |
| position-6 | 50 | 7, c3d5, 44 105 | 79 | 43 |
| position-6 | 200 | 8, c3d5, 196 681 | 71 | 45 |

**A0-3, position-6, the six W1-off rows, base → head.** Move c3d5 throughout.
- `level` `go movetime 200`, `level` `go wtime 4000 btime 4000`, `simple-tournament` `go movetime 200`, `uci-clock-mode` `go movetime 200`: depth 8, 196 681 nodes, cp 71 → 45.
- `simple-tournament` `go wtime 8000 btime 8000 movestogo 40`: depth 7, 69 705 nodes, cp 79 → 43.
- `uci-clock-mode` `go depth 6`: cp 87, 14 570 → 10 513 nodes.
- Off the A0 list, the W1-on row: `uci-clock-mode` `go wtime 8000 btime 8000 movestogo 40`: depth 7, cp 79 → 43, 32 165 → 39 268 nodes.

**The other rows of tables 1-3, the engineer's reading, QE grades.**
- S1 12 / 12 and S2 58 / 58, against `572edf13`. S3 0 on every row (B1 0 / 191, B2 0 / 189, B3 0 on each, 0 / 188). S4 7 / 7. S5 54 / 58, none newly missed. S6 0 sign changes, 0 mate flips. S7 100 %, 9 cp / 100 %, 4 cp. P5 3 072.
- R3, R4 and R7 equal the old figures. `s2`, `nodes`, `reach`, `drift`, `audit`, `floor`, `zug`, `g1` and `krk` output files are byte-identical to `se-ABC-303`'s.

**Not read.** P6 (`G6`), P7 and R5 (timings; the brief has no graded timing), R6's firing figures, S′, Levels, `build`, the `-t` lines, and the other deep lanes. So **`G6` is `UNKNOWN - verify`.**

**Items 3-5 on the lanes.** A4 (b) on `chooseMoveWithoutBundle`: door 5.879, head 6.716, +0.837, the ADR's figure, 22 root moves differ. A3 (a): 96.26 %, 66 cp / 95.72 %, 96 cp, 0 flips. A7's sum row is green; by arithmetic 4 822 312 + 3 072 = 4 825 384 bytes.

**Gates at the tip.** Typecheck 0. Lint 0. `npm test` exit 1: 2 730 passed, 3 failed of 2 733, 71 files. Skip count 0.

| deep lane | result |
|---|---|
| `SEARCH_DEEP` evaluate.passer | 28 / 28 |
| `SEARCH_DEEP` see | 52 / 52 |
| `SEARCH_DEEP` transposition | 40 / 40 |
| `ENGINE_DEEP` transposition | 26 / 26 |
| `ENGINE_DEEP` engine | 93 / 105, 12 failed |
| `SEARCH_DEEP` engine | 77 / 79, 2 failed, the same two as the default lane |
| `ENGINE_DEEP` uci-session | 258 / 265, 7 failed |

0 pending and 0 todo in each lane's JSON report. Row names: `raw/out/failed-rows.txt`.
