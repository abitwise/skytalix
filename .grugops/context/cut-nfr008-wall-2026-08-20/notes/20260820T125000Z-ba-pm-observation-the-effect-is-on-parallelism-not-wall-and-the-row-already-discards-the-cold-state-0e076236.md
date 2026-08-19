---
id: 20260820T125000Z-ba-pm-observation-the-effect-is-on-parallelism-not-wall-and-the-row-already-discards-the-cold-state-0e076236
kind: observation
by: ba-pm
at: 2026-08-20T12:50:00Z
verified_by:
confidence: high
refs:
  - ABC-111
  - ABC-110
  - NFR-008
  - ADR-0014
  - .grugops/context/design-oq1-lane-budget-2026-08-19/notes/raw-sample1-interleaved.tsv
  - .grugops/context/design-oq1-lane-budget-2026-08-19/notes/raw-sample2-cooled.tsv
supersedes:
---

# Three things derived at this cut from the EXISTING raw TSVs, in no prior note: **the effect is on PARALLELISM and separates the two states with ZERO OVERLAP**; **`NFR-008`'s protocol already discards the cold state by construction**; and **the settled protocol moves the number `ABC-110` `A2` sums against by 280 ms**

**This is not a stamp.** Hand-authored `observation`; no `finding` is admissible on this install.
**No new measurement was taken at this hop.** Every input below is Architect/Design's raw per-run
data at `design-oq1-lane-budget-2026-08-19`; **the arithmetic is mine and its inputs are shown so it
can be checked rather than trusted.** Machine: Apple M3 (Mac15,13) / 8 logical cores / Darwin 25.5.0
arm64 / Node v24.12.0 / vitest 3.2.7 — **`UNKNOWN - verify` anywhere else.**

## 1. The effect is on PARALLELISM, not on CPU — and unlike wall, it does not straddle anything

CPU (user + sys) ÷ wall, per run — effective parallelism on 8 logical cores with 7 vitest workers:

```
warm A, sample 1 rounds 1-8   5.184 5.256 5.268 5.281 5.300 5.322 5.332 5.353   median 5.291
cooled A, sample 2 runs 1-6   4.449 4.475 4.618 4.655 4.683 4.830               median 4.637

warm MIN 5.184  >  cooled MAX 4.830          14 runs, ZERO OVERLAP, gap 0.354 (7.3%)
median delta -0.654 = -12.4%                 sign 8/8 vs 6/6 against every opposing run
```

**Wall straddles the 3 s clause (2.805 / 3.120). The ratio straddles nothing.** Whatever the cooled
state is, **it costs the lane ~0.65x of parallelism and costs it no CPU** — which is why the CPU
clause could be ruled from these same runs and the wall clause could not.

**This is why `ABC-111` `A2` judges the delta on the ratio as well as on wall, and why test note 8
requires the ratio as a third, derived, reported column.** It is the sharpest instrument available
on this data and it costs nothing to record.

## 2. The row already discards the cold state BY CONSTRUCTION — round 0 is the whole cold sample

Sample 1's round 0 ran `A N P` in that order. It is the only round in the interleaved harness whose
first run is genuinely cold, and the discarded warm-up is exactly that run:

```
round 0  A  wall 2.99  CPU 14.15  ratio 4.732   <- the COOLED range, and the warm sample's highest wall
round 0  N  wall 2.80  CPU 14.58  ratio 5.207   <- already warm, ONE run later
round 0  P  wall 2.91  CPU 15.53  ratio 5.337   <- already warm, TWO runs later
```

**Only the first run of the session carries the signature; the next run in the same round does not.**
`NFR-008`'s protocol says *"round 0 discarded as warm-up"* — **so the row's own text already
discards the cold state, and the 2026-08-19 cooled sample is that discarded state re-created six
times over.**

**Read this precisely.** It is evidence about **what the row's text already does**, and it is a real
input to `ABC-111` `A4`, which must argue its choice against the row's own words. **It is NOT a
ruling that warm is the right state** — the counter-argument is on the ticket and it is genuine: the
row's `Applies to` cell calls this lane *"the inner loop every role runs several times per hop"*, and
a role's FIRST run of a hop is cold, so if a hop runs the lane three times, one of the three is cold.
**Weighting that is `ABC-111`'s to settle and Architect/Design's to rule. Neither was done here.**

## 3. Load does not explain the cooled sample, and that is worth stating because it is the obvious suspect

Inside sample 2, 1-min load recorded immediately before each run against that run's wall:

```
load 2.77 -> 3.17 s     load 2.09 -> 3.03 s     load 1.44 -> 3.06 s
load 1.68 -> 3.23 s     load 2.24 -> 3.26 s     load 2.29 -> 3.07 s
```

**No monotone relation, and the quieter sample reads the HIGHER wall** (sample 2 median load 2.17
against sample 1's 7.19). **The four rival candidates on `ABC-111`'s page each predict a wall rise
with no CPU rise, which is exactly why wall alone cannot separate them and `A3` needs its own arms.**

## 4. **The settled protocol also moves the number `ABC-110` `A2` sums against — 1.480 s or 1.760 s**

**This was not written down anywhere before this cut and it is the most consequential item here.**

```
CPU clause ruled on   14.480 s  (COOLED, n = 6, no null control)   deficit 1.480 s   <- ADR-0014
protocol-conformant   14.760 s  (WARM,   n = 8, null control ADMISSIBLE)  deficit 1.760 s
                                                          difference     280 ms = 19% larger
```

**The CPU ruling stands either way and neither ticket re-opens it:** both figures are over 13 s, and
Architect/Design ruled on the **lower** on purpose *"so the ruling does not depend on which sample a
reader prefers"* — which was right, and which is precisely why the choice survived unexamined.
**What does depend on the sample is the DEFICIT, and `ABC-110` `A2` sums its measured savings
against it as a number.**

**Recorded, not acted on.** `ABC-110` `A2` was **not re-cut** and `ABC-110` was **not re-scored** —
it stays DoR 8/10 ⚠️x2. Its `## Dependencies` bullet carries this in place, with the instruction that
whoever executes `A2` states which figure the settled protocol implies and sums against that one.
`ABC-111` `A7` requires the number to be handed over explicitly.

## What this note does NOT establish

- **Not a wall-clause verdict in either direction**, and not a warm-vs-cold choice. That is
  `ABC-111`'s to settle and Architect/Design's to rule.
- **Not a cause.** The cold FS/JIT cache remains a **candidate**, as Architect/Design labelled it, and
  three rivals survive: CPU-frequency ramp / core parking, the idle gap itself, and an unmeasured
  background process. **Section 1 narrows the instrument, not the cause.**
- **Not a new measurement.** No harness was run at this hop; **`N8-SPAWN` stays 0 ms** and nothing
  was charged anywhere.
- **Not a figure for any other machine**, and not a re-measurement of `NFR-001`–`NFR-007`.
