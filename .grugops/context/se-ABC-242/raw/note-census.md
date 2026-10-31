# `ABC-242` R1 census (`ADR-0046` § Addendum 2026-10-30): 10 added rows, all on a virtual clock at step 10, 0 real-clock rows

Budget is level 1's own 100 ms on every search below. Every root holds 5 legal moves, so a blunder child's slice is
20 ms. Reads per search = ⌈budget ÷ step⌉.

| row (file § title) | searches per fixture | budget | step | reads per blunder call | reads per child | class |
|---|---|---|---|---|---|---|
| `levels.test.ts` A1 "the third-occurrence move scores exactly 0, unsearched; base scores it otherwise" (5 fixtures) | 1 level + 1 base oracle | 100 ms | 10 | 10 | 2 | time-blind |
| `levels.test.ts` A1 "on QE's probe, scored[0] is {d8e8, 0} and 4 child searches run for 5 legal moves" | 1 level | 100 ms | 10 | 10 | 2 | time-blind |
| `levels.test.ts` A1 "with the repeat last in legalMoves order, the list is base's but for its exact 0" | 1 + 1 | 100 ms | 10 | 10 | 2 | time-blind |
| `levels.test.ts` A2 "a second occurrence keeps base's score; …" | 1 + 1 | 100 ms | 10 | 10 | 2 | time-blind |
| `levels.test.ts` A3 "a key older than the child's clock is never counted: …" | 1 + 1 | 100 ms | 10 | 10 | 2 | time-blind |
| `levels.test.ts` A5 "on every A1 fixture the move played is the strict second-best of the new list" (5) | 1 | 100 ms | 10 | 10 | 2 | time-blind |
| `levels.test.ts` A6 "with no keys, or an empty list, …" (5 fixtures × 2 lists) | 1 + 1 | 100 ms | 10 | 10 | 2 | reads `elapsedMs` only as an equality with base on the same step (no bound) |
| `levels.test.ts` A6 "a non-blunder draw at level 1 is chooseMove's on the same keys, node for node" | 1 level (engine path) + 1 `chooseMove` | 100 ms | 10 | 10 (one `chooseMove`) | n/a | time-blind |
| `cli.test.ts` A4 "the seam plays a direct createLevel(LEVELS[1]) call's move; …" (5) | 1 seam + 1 direct | 100 ms | 10 | 10 | 2 | time-blind |
| `uci-session.test.ts` A4 "the same move from all three; …" (5) | 1 direct + 1 seam + 1 `go` | 100 ms | 10 | 10 | 2 | time-blind (R3: one step on the three callers and in both files) |

## The step, per R2 and `ABC-244` condition 2
- Kill sets (frozen M1–M8; M1 no check, M2 one match, M3 no clock bound, M4 search then 0, M5 score 1, M6 strict
  oldest bound, M7 walk from −2, M8 raw `zobristKey`), identical at steps 1, 10, 100 and 1 000 on every row:
  A1 ×3 {M1, M4, M5, M6}; A2 {M2}; A3 {M3}; A5 {M1, M5, M6}; A6 ×2 {}; CLI A4 {M1, M5, M6}; UCI A4 {M1, M5, M6}.
  M7 and M8 survive every row at every step (finding note).
- Condition 2: at step 1 a blunder call reads 100 times (20 per child), at 10 it reads 10 (2 per child), at 100 once.
  So 100 and 1 000 are refused and **10 is chosen**.
- In-thread cost of the 10 rows at step 1 vs 10 (parity run, one sample each): 5.15 s vs 0.085 s (sum of per-row durations). Copying a step-1
  form would have cost seconds of lane wall, as R4 warns.
