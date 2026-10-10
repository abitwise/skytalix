---
id: 20261010T145645Z-qe-e2e-observation-abc131-readings-margin-a4-07d83577
kind: observation
by: qe-e2e
at: 2026-10-10T14:56:45Z
verified_by:
confidence: high
refs:
  - ABC-131
  - ADR-0034
  - RISK-003
  - ABC-127
  - ABC-126
  - ABC-087
  - ABC-083
  - src/puzzle-suite.baseline.json
  - src/levels.test.ts
  - commit:679e847d
  - commit:96f3168d
  - commit:f994c724
supersedes:
---

# `ABC-131` readings: `PUZZLE_DEEP` at base and tip, the 0.8x margin re-derived, `A4` re-planted

Hand-authored, no seal. Every run used a `git archive` copy of the named commit, with only the named plant
applied (`raw-qe-run.sh.txt`, `raw-qe-plant-*.mjs.txt`). The worktree's `git status --porcelain src`
was empty before QE's own commit.

**`PUZZLE_DEEP=1` (gating wall in vitest, load1 at start):**

| run | commit | solved | tests | exit | wall | load1 |
|---|---|---|---|---|---|---|
| base | `679e847d` | 58/62 | 17 passed | 0 | 33.26 s (mate-in-3 oracle 12 rows, 10.48 s) | 3.68 |
| tip p1 | `96f3168d` | 54/58 | 18 passed | 0 | 21.54 s | 10.58 |
| tip p2 | `96f3168d` | 54/58 | 18 passed | 0 | 23.04 s | 7.50 |
| tip p3 | `96f3168d` | 54/58 | 18 passed | 0 | 20.00 s | 6.82 |
| `measuredAt` | `506d80c6` | 54/58 vs recorded 58/62 | 1 failed, 17 passed | 1 (`expected 58 to be 62`, test note 1) | 25.55 s | 7.61 |
| QE tip | `f994c724` | 54/58 | 18 passed | 0 | 25.00 s | 4.02 |

The per-row lines (move, depth, nodes) have sha1 `11326e1c` in all five 54/58 runs. That equals the
engineer's `raw-deep-tip.rows.txt`, and it equals the base's rows with the four seeds removed. **No retained
row moved.** The baseline's `measuredAt` `506d80c` is therefore the right provenance: that tree's per-row
readings are the tip's.

**The 0.8x margin, re-derived.** `virtualClock` reads 0 at start, and the engine's iteration-head and
1,024-node checks each consume one reading while `now() < 25`. On the real clock module
(`raw-qe-readings.mts.txt`) the readings are 24 at step 1, 20 at 1.2, **19 at 1.25 and at 1.3**, 18 at
1.35, 17 at 1.4 and 99 at 0.25.

| step | readings | ratio | solved | NEWLY-MISSED | load1 |
|---|---|---|---|---|---|
| 1 | 24 | 1.000 | 54/58 | 0 | (above) |
| 1.25 | 19 | 0.792 | **54/58** | **0** | 5.23 |
| 1.3 | 19 | 0.792 | 54/58 | 0 | 8.70 |
| 1.35 | 18 | 0.750 | 51/58 | seeds **1**, **69**, **1163** (mate in 3) | 7.87 |
| 0.25 | 99 | 4.125 | 58/58 (`A5`, 4 NEWLY-SOLVED) | 0 | 15.89 |

`A3`'s step 1.25 is slightly stricter than nominal 0.8x (19/24). The tightest retained rows survive at 19
readings and are lost at 18. On a uniform node-growth model, they tolerate a tree **at least 24/19 − 1 ≈
26 %** bigger. They are lost by **24/18 − 1 ≈ 33 %**. This is a model, not a measurement. The engineer's
"expect reds above about 20 %" sits on the safe side of it. For Security/NFR's `RISK-003` wording.

**`A4`, 17 weakenings planted alone on `96f3168d`** (`raw-qe-a4-weakenings.txt`; solved/58, exit, load1):
`W1` 43 1 (7.51) · `W1b` 41 1 (5.74) · `W2` 50 1 (5.07) · `W3` 35 1 (4.15) · `W4` 44 1 (4.17) ·
`W5` 48 1 (5.85) · `W6` 50 1 (5.23) · `W7` 46 1 (8.56) · `W8` 49 1 (12.67) · `W9` 44 1 (13.83) ·
`W10` 54 0 (16.08) · `W11` 54 0 (12.04) · `W12` 46 1 (8.93) · `W13` 52 1 (7.26) · `W14` 54 0 (7.34) ·
`W15` 35 1 (7.08) · `W16` 47 1 (7.09). **14/17 red; of the 10 `ABC-127` survivors, 7 are red, including
`W1`, `W1b`, `W4` and `W5`, and `W2`, `W13` and `W16` (3 ≥ 2).** Every solved count and missed-row set
equals the engineer's jsonl. Against the cut's recount, only `W9` differs (44 vs 45). Its extra miss is
`discovered check: the bishop moves, Rxd8`. That row was SOLVED in `qe-ABC-127/probe/a3/W9.rows.txt` on
its old FEN, and `d10ffeff` (`ABC-126`) re-authored it after. **The `W9` recount note is confirmed.**

**Outside the ticket's named lanes — `ENGINE_DEEP=1 src/levels.test.ts` (`ABC-087`) reads `PUZZLES`.**
QE ran it at `96f3168d`: exit 0, 28 passed, 213 s real (load1 6.23 → 20.73 at end). `A4` perft + puzzles
reads 96/242 = 39.7 % against 40 %, and `A3` reads easiest 35/58 against default 54/58. Both stay green
on the shorter corpus. AGENTS.md records 246 moves and "35 vs 58 of 62" for the base: see `QE-131-c`.
The same run's `A5` real-clock maximum was 4,780 ms of 5,000 under that load. That is `ABC-087`'s lane, not
this ticket's (INFO `QE-131-g`).
