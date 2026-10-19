---
id: 20261019T114816Z-architect-design-observation-levels-recut-probe-readings-step4-5804b43d
kind: observation
by: architect-design
at: 2026-10-19T11:48:16Z
verified_by:
confidence: high
sealed: false
task: wave-2026-09-25
subtask: arch-levels-recut
refs: [ABC-087, ABC-085, ABC-146, ADR-0038, ADR-0032, ADR-0045, NFR-004]
---

# Virtual-clock probe at step 4 on main `398603fa`: today's 3v4 and 4v5 budgets sit inside one ply, and a 3x budget step adds one ply on 47–49 of 50 positions

Hand-authored and unsealed: no `finding` is admissible on this install (`AGENTS.md`). Every figure is a count, taken on the virtual clock
from `probe/raw/`. No wall-clock reading was taken. Method: `probe/RUN.txt`.

- **The set.** BA/PM's 50-position set, the one `ABC-085`'s named-risk table used. `ABC-146`'s `A0` workload is the start position
  alone, so the 50 were taken for comparability.
- **The method is exact, and checked.** One sweep per position with `maxDepth` = 1, 2, … at the 5 000 ms ceiling gives the depth and
  the move at every budget. It was compared with direct `chooseMove` calls at 100, 170, 500, 1 500 and 4 500 ms on 12 positions: **60 of
  60 agree** on depth and move.
- **One more ply costs 2.67x the clock reads** (median; p25 2.30, p75 3.10; 148 samples).
- **Today's top levels** (counts out of 50):

| pair | completes a deeper iteration | mean gain | move differs |
|---|---:|---:|---:|
| 3 000 v 4 000 (today 3v4) | 7 | +0.14 ply | 1 |
| 4 000 v 4 500 (today 4v5) | 3 | +0.06 ply | 1 |
| 3 000 v 5 000 (the ceiling) | 18 | +0.36 ply | 2 |

- **3x steps** (counts out of 50):

| pair | completes a deeper iteration | mean gain | move differs |
|---|---:|---:|---:|
| 1 000 v 3 000 | 49 | +1.08 ply | 5 |
| 330 v 1 000 | 49 | +1.06 ply | 3 |
| 500 v 1 500 | 47 | +1.04 ply | 5 |
| 1 500 v 4 500 | 48 | +1.04 ply | 5 |

- **Lower pairs** (counts out of 50):

| pair | completes a deeper iteration | mean gain |
|---|---:|---:|
| 180 v 330 | 30 | +0.64 ply |
| 100 v 180 | 39 | +0.82 ply |
| 100 v 3 000 | 50 | +3.60 ply |
| 330 v 3 000 | 50 | +2.14 ply |
| 500 v 500 | 0 | 0 |

- **Median depth at step 4:**

| budget (ms) | 100 | 180 | 330 | 500 | 1 000 | 1 500 | 3 000 | 4 500 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| median depth | 5 | 5 | 5 | 6 | 7 | 7 | 8 | 8 |

- **The cost of one `ADR-0032` blunder,** read through the level's own scored list. It is the gap between the best score and the strict
  second-best, out of 50 positions:

| budget (ms) | p25 | median | p75 | positions ≥ 100 cp |
|---|---:|---:|---:|---:|
| 220 | 14 | 71 | 104 | 13 |
| 330 | 25 | 71 | 93 | 12 |
| 500 | 20 | 69 | 85 | 11 |
| 1 000 | 16 | 71 | 113 | 16 |
| 3 000 | 34 | 86 | 147 | 18 |

  No position was "no-candidate".
- **From run 2's game lines (`abc146-verdict/raw/verdict-run2.out.txt`, recounted, not re-run):**
  - 4v5 plays the same game from both chairs. Seed 5 is 53 plies and a white win both ways round. Seed 4 is an 82-ply threefold draw
    both ways.
  - Mean plies per pair:

| pair | 3v4 | 4v5 | 2v3 | 1v2 | 1v5 |
|---|---:|---:|---:|---:|---:|
| mean plies | 102.7 | 105.2 | 91.5 | 97.2 | 65.7 |

  - Recorded wall per (ply × mean virtual budget ms), on the shared host:

| pair | 3v4 | 4v5 | 2v3 | 1v2 | 1v5 |
|---|---:|---:|---:|---:|---:|
| wall per virtual ms-ply | 1.09 | 1.10 | 1.08 | 0.91 | 1.27 |

  These are inputs to an estimate, not timings taken here.
