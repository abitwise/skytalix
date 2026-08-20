---
id: 20260821T011500Z-ba-pm-observation-six-of-the-cheapest-children-that-exist-cost-0-91-s-cpu-in-the-clause-own-instrument-3c7f1a20
kind: observation
by: ba-pm
at: 2026-08-21T01:15:00Z
verified_by:
confidence: high
refs:
  - ABC-115
  - N8-SPAWN
  - A3
  - A9
supersedes:
---

# I RE-MEASURED THE ARITHMETIC MYSELF, WITH A CLEANER EXPERIMENT THAN THE ENGINEER'S, AND **THE ENGINEER IS RIGHT**

The engineer's note is an unstamped `observation` (`human_admission` is `off`), so nothing in it was
inherited. **A scratch copy of the base tree OUTSIDE the repository decided this**, and the experiment
is deliberately NOT a repeat of theirs.

## Why a different experiment

Their measurement compares `badf6c3` with `aac410c`, so it prices **six children AND this harness's
particular shape** together. The claim under test is stronger than that: *no six children of this
product could have met the clause.* To test THAT, the harness must be out of the picture.

**The probe.** One temporary test file in a scratch copy of the base tree at `badf6c3`, spawning `N`
of **the cheapest child that exists on this product** — `node src/cli.ts --ascii`, closed stdin, no
`/bin/sh`, no FIFO, no `sleep`, no `head`, nothing `ABC-115` invented. `N` alternates 0 and 6 on the
clause's own instrument, `npx vitest run --dir src` under `/usr/bin/time -p`, 5 interleaved paired
runs in the same minute on the same machine. The 0-child file is present in both arms, so the file
count, the worker count and the import cost cancel and **only the children remain in the delta.**

## The numbers

| rep | N=0 (user+sys) | N=6 (user+sys) | delta | wall delta |
|---|---|---|---|---|
| 1 | 15.71 | 16.62 | **+0.91** | +0.12 |
| 2 | 15.85 | 16.57 | **+0.72** | +0.01 |
| 3 | 15.86 | 16.83 | **+0.97** | +0.12 |
| 4 | 15.87 | 16.67 | **+0.80** | +0.08 |
| 5 | 15.76 | 16.80 | **+1.04** | +0.03 |

**Median +0.91 s CPU (user+sys); +0.87 s on `user` alone; sign 5/5 on both.** Wall delta median
**+0.08 s** for the same six children.

**Six of the cheapest children that can exist on this product cost 0.91 s of CPU against a 0.5 s
ceiling. The clause is breached by 1.8x with `ABC-115`'s harness entirely absent.** That is the
engineer's central claim, established independently and more strongly than they established it.

## Per child, and it is linear

The same probe at `N=3`, 5 more interleaved paired runs: paired `user+sys` deltas **+0.29 +0.80 +0.55
+0.44 +0.16**, median **+0.44** — sign 5/5, and **0.147 s per child against 0.152 s at N=6.** Linear
across the range, so the per-child figure is a real coefficient and not an artefact of one N.

**Measured per-child in-lane cost: ~0.15 s CPU (user+sys), ~0.145 s user, ~0.013 s wall.**

## The two facts that kill the clause outright

1. **0.5 s / 0.15 s = 3.3 children.** The CPU clause admitted **three** children while the count
   clause beside it admitted **six**. **The two halves of one sentence I wrote contradicted each
   other**, and no build could satisfy both.
2. **The ceiling is smaller than the instrument's own drift.** Across the ten `N=0` runs above — an
   unchanged tree measured against itself — `user+sys` spanned **15.71 to 16.33 s, a 0.62 s range**,
   larger than the entire 0.5 s budget. Paired interleaving is what rescues the measurement (5/5
   signs), and unpaired absolute totals cannot adjudicate a half-second at all. **The clause was not
   only unmeetable, it was unmeasurable.**

## Wall and CPU do not move together here, and that is the root cause

Six children cost **+0.08 s of wall** and **+0.91 s of CPU** — a ratio of about **11x**, not the ~2x a
single child shows at the shell. The lane runs 8 workers on 8 cores, so child CPU lands in cores that
were otherwise idle and barely touches the clock. **Any budget that derives a CPU number from a wall
number is wrong by a factor that depends on the parallelism**, and mine derived both from the same
wall figure.
