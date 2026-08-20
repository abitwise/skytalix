---
id: 20260821T012000Z-ba-pm-observation-i-reproduced-the-delivered-delta-and-it-sits-near-the-floor-not-above-it-8b4e2d61
kind: observation
by: ba-pm
at: 2026-08-21T01:20:00Z
verified_by:
confidence: high
refs:
  - ABC-115
  - N8-SPAWN
  - A3
  - A9
supersedes:
---

# I ALSO REPRODUCED THE DELIVERED DELTA — AND THE NUMBER THAT DECIDES THE RULING IS THAT IT SITS **NEAR THE FLOOR**

The engineer's table was not inherited either. `src/cli.ts` and `src/cli.test.ts` at `badf6c3` (base)
and at `aac410c` (delivered) were dropped alternately into the SAME scratch tree — so the tree, the
`node_modules`, the machine and the minute are identical and only those two files move.
`npx vitest run --dir src` under `/usr/bin/time -p`, 5 interleaved paired runs.

| rep | base wall | delivered wall | base user+sys | delivered user+sys |
|---|---|---|---|---|
| 1 | 3.38 | 4.14 | 15.74 | 16.74 |
| 2 | 3.24 | 4.17 | 16.02 | 16.67 |
| 3 | 3.04 | 4.21 | 15.75 | 17.07 |
| 4 | 3.10 | 4.22 | 15.61 | 16.85 |
| 5 | 3.03 | 4.29 | 15.78 | 16.97 |

**Paired deltas — wall: +0.76 +0.93 +1.17 +1.12 +1.26 (median +1.12). `user+sys`: +1.00 +0.65 +1.32
+1.24 +1.19 (median +1.19). `user` alone: median +0.92. Sign 5/5 on both.**

Every run: **base 40 files / 1207 tests, delivered 40 files / 1212 tests, both green, 0 skipped.**
The spawn pin moves **17 -> 23** in the delivered file (`N8-LANE` row, `expect(spawned).toBe(N8_SPAWN)`
with `N8_SPAWN` written `17 + 6`), so **+6 children is asserted by the suite, not by a narrator.**

## Against the engineer's figures

| | engineer | me | agree? |
|---|---|---|---|
| children | +6 | +6 | yes |
| wall | +1.14 s | +1.12 s | yes |
| CPU `user+sys` | +1.02 s | +1.19 s | same order, **mine is worse** |
| CPU `user` | +0.78 s | +0.92 s | same order, **mine is worse** |

**I did not measure a smaller breach than they reported.** Two different machines-states, two
different experiments, one conclusion.

## THE NUMBER THE RULING TURNS ON

Cheapest-possible six children: **+0.91 s**. `ABC-115`'s actual six: **+1.19 s** (mine) / **+1.02 s**
(theirs). **The delivered harness is 1.1x-1.3x the theoretical floor** — `A9`'s child buys a
`/bin/sh`, a FIFO and a `head` for about 0.1-0.3 s of CPU over a bare `node src/cli.ts`.

**This harness is not wasteful and it is not why the clause broke.** A ruling that raised the ceiling
to fit a bloated build would be excusing an overrun; the measurement says there is no overrun to
excuse. The clause broke on its own arithmetic, above the harness.
