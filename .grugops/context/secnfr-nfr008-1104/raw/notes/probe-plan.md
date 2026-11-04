# secnfr-nfr008-1104 probe plan, sealed after session 1's census and before session 2 runs. One change to the PREREG (`…c7289371`), stated

Session 1 (the graded read) is done and its census is taken. The grade is not restated here; it is in this task's readings observation. This note fixes the probe before any probe run.

## The candidate rule, applied to the census (median in-thread, the 16 scored H and H2 runs)
A row is a candidate when all of these hold:
- its own file already has a `*_DEEP` gate;
- it costs ≥ 60 ms;
- it is not a recorded bar row: the zugzwang rows (`zugzwang.001` and the K+P rows), ABC-283's bundle rows (`src/search.bundle.test.ts`), or the door-switch rows;
- it does not read time on a fine virtual-clock step. Those rows are the ones ABC-248 / `ADR-0046` kept in the default lane on purpose: `uci-session`'s ABC-167 A5 / A6 / A7, ABC-171 A2 / A6, ABC-174 A5 and ABC-220 A13;
- it is not already the default slice of a deeper deep row: `legal` ABC-206 A2 at depth 1 (depth 3 is deep), and `search.test` A4 at depth 1 (depth 2 is deep).

## P1: seven rows in form-S position (each to its own file's existing deep lane)
| row | file | its lane | median ms |
|---|---|---|---:|
| R1 "A2 — the instrumented search makes 0 null moves in check …" › "search() to depth 4 and chooseMove deepened to 4: every null move is made out of check, with three or more pieces" | `src/search.null-move.test.ts` | SEARCH_DEEP | 134 |
| R2 "ABC-241 A4, A5 — UCI …" › "A5: the CLI level seam's injected list equals UCI's, key for key, and both play d8e8" | `src/uci-session.test.ts` | ENGINE_DEEP (`RUN_ENGINE_DEEP`) | 107 |
| R3 futility "the doors …" › "the rule changes the work: search() at depth 4 and chooseMove deepened to 4 on position-6 …" | `src/search.futility.test.ts` | SEARCH_DEEP | 90 |
| R4 "ABC-075 property — the ep component tracks the ep FIELD …" › "holds at every node within 2 plies of every perft position" | `src/zobrist.test.ts` | ZOBRIST_DEEP | 86 |
| R5 "ABC-170 A5 — the limits only shorten …" › "on an infinite budget, maxDepth 1000 returns within the same consultation count" | `src/engine.test.ts` | ENGINE_DEEP | 77 |
| R6 "A7 — seeded, in deterministic mode" › "a fixed seed gives identical blunder decisions across runs" | `src/levels.test.ts` | ENGINE_DEEP | 71 |
| R7 "ABC-174 A3 — the default plays as the engine …" › "move, depth and nodes are equal on 30 of 30 positions, for each of two seeds" | `src/levels.test.ts` | ENGINE_DEEP | 67 |

Sum: 632 ms in-thread. Expected P1 counts: 71 files, 2 680 passed, 7 skipped, 0 failed.

## P2 = P1 plus two heavy rows whose files have NO deep gate (information only, outside ABC-281's form)
- `src/cli.test.ts` "ABC-241 A4, A7 — the CLI …" › "A4: with repetitionKeyHistory injected the default level plays d8e8 at exactly 0; base does not" (188 ms).
- `src/engine.capacity.test.ts` "ABC-122 A8 …" › "ends every line at ply 128 …" (115 ms; the file's only row).
- Expected P2 counts: 71 / 2 678 / 9 / 0.

## The one change to the PREREG
- The PREREG named one probe arm, paired against H in the order H P P H. **This session runs three arms, H, P1 and P2, rotated as in session 1** (H P1 P2 / P1 P2 H / P2 H P1). Round 0 is discarded. It runs until 8 complete scored rounds or 12 rounds, in one hold, with the same host gate. P2 is added so that the rows outside the form are sized in the same window.
- Read: per round, P1 − H and P2 − H, wall and CPU, as medians with the k = 2 interval and sign counts. It is an estimate, never a grade.
- The skip form (`it.skip`) keeps each row's collection and any describe setup, so a real move saves a little more than the probe shows. A form-S remnant keeps a little, so it saves less. ABC-281 measured −0.37 s graded against the probe's −0.38 s.
