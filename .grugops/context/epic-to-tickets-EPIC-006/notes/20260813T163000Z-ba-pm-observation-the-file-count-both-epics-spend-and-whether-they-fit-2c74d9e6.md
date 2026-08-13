---
id: 20260813T163000Z-ba-pm-observation-the-file-count-both-epics-spend-and-whether-they-fit-2c74d9e6
kind: observation
by: ba-pm
at: 2026-08-13T16:30:00Z
verified_by:
confidence: medium
refs:
  - EPIC-006
  - EPIC-003
  - ABC-026
  - ABC-041
  - ABC-042
  - ABC-043
  - ABC-044
  - ABC-045
  - ABC-046
  - ADR-0008
  - NFR-008
  - plans/nfr-catalog.md
supersedes:
---

# The two epics spend 10–12 test files against a planning number of ~10 — they fit at the best case with 45 ms of margin, and miss at the worst

> **Hand-authored, no stamp. NOTHING HERE WAS RE-MEASURED.** Every input is read from
> `plans/nfr-catalog.md`'s `ABC-026` `H5` section (anchored at `main` = `06c5427`, 28 test files /
> 807 tests) and restated by arithmetic, which is that section's own item 6 rule: *"do NOT re-measure:
> restate by arithmetic from the per-file cost above."* `confidence: medium` because the outputs are
> projections over a published band, not readings — the inputs are `high`, the extrapolation is not.

## The starting figures, quoted rather than derived

```
NFR-008 clause                      CPU <= 13 s      (wall <= 3 s, MET with margin, not the binding one)
measured median, sample A (worst)   CPU 10.390 s     = 79.9% of the clause
after `pool: "threads"` adoption    CPU  9.545 s     -> headroom 13 - 9.545 = 3.455 s
                                                        (item 8, published, not derived here)

planning number  3.455 / 0.341 = ~10 files   <- "all-in" cost per file = 9.545 / 28
ceiling          3.455 / 0.1389 = ~25 files  <- floor-only, at the ticket's threads slope
                 3.455 / 0.165  = ~21 files  <- floor-only, at QE's independently measured slope
```

**The planning number is unaffected by the slope disagreement** (`−12.2%` by the ticket, `−9.0%` by
QE): it is total ÷ 28, not a slope. **Only the ceiling moves, and the ceiling is not what binds.**

**Nothing has been spent since the reading.** `ABC-021` merged with **zero new test files**
(`plans/board.md`'s row), so `src/` still holds **28** — counted this hop. The suite grew 807 → 816
tests, worth **3.2–3.9 ms** at that section's own 0.35–0.43 ms per test. Item 6's restatement rule
subtracts nothing.

## What this hop commits `EPIC-006` to, per ticket, with the file WEIGHT stated

**QE routed exactly this to BA/PM at the next cut** — *"`~7` is a MEAN on a distribution that has no
typical member: mean 309 ms vs median 94.2 ms, one file at 25.7% of all file time … severity low,
owner BA/PM at the next cut"*. **This is the discharge: every ticket names its count AND its class.**

| ticket | new files | class | why |
|---|---|---|---|
| `ABC-041` | **1** | median-weight or lighter | pure functions, ~10 cases, no corpus, no spawn; the probe edit lands in the existing `src/history-pane.nfr.test.ts` |
| `ABC-042` | **1** | **the heaviest file either epic adds** | it **spawns child processes**; the floor was fitted on files that import nothing, so the floor is not this file's cost |
| `ABC-043` | **0** | (makes `ABC-042`'s heavier) | same module under test — criteria extend that file by construction |
| `ABC-044` | **1** | median-weight | hand-built `LoopOutcome`s and one ≥ 40-ply replay costing tens of µs |
| `ABC-045` | **0** | nil | extends `ABC-035`'s command file and the shared entry-point file |
| `ABC-046` | **0–1** | nil–light | same, unless its ruling forces a separate file |
| **total** | **3–4** | | three of six add none, deliberately |

**The one anchor available for a spawning file, and it is the only one:** the merged fd-3 probe child
measured **66 ms** for an 11-module closure (architecture audit, 2026-08-12). The entry point's
closure is larger. **Plan for `ABC-042`'s file at several times the 94 ms median and keep the spawn
count in single digits** — `N8-LANE`'s 650 ms per-ticket bar is the control that catches it, and
`ABC-042` and `ABC-043` share one file and therefore **one** bar. That is written into both tickets.

## The arithmetic, both ends, and I am not picking the flattering one

```
EPIC-003  7-8 files   (read off all eight `## Lane cost` sections; ABC-032 can be 0)
EPIC-006  3-4 files   (this hop)
                     ---------
total     10-12 files

at the ALL-IN mean, 0.341 s/file  (the number `A2` publishes, and the conservative one)
  10 files  ->  3.410 s   vs 3.455 s headroom   FITS, margin  0.045 s  (1.3% of headroom)
  11 files  ->  3.751 s                          OVER by 0.296 s
  12 files  ->  4.092 s                          OVER by 0.637 s  -> projected CPU median 13.637 s

at the FLOOR-ONLY slope, 0.1389 s/file (ticket) / 0.165 s/file (QE)
  12 files  ->  1.667 s / 1.980 s                FITS with 1.8 s / 1.5 s to spare
```

**Verdict, stated plainly because the brief asked for it and because a comfortable answer here would
be a false one: the two epics do NOT comfortably fit.** They fit at the best case with **45 ms** of
margin — 1.3% of the headroom, which is inside anybody's noise — and they exceed the 13 s CPU clause
by **~0.6 s** at the worst case if every added file costs what today's average file costs. **They fit
easily if the added files land near the floor.** Which end applies is **file weight**, and that is
precisely the variable QE recorded as absent from the published band.

**One unit warning, because blending them is the easy mistake here.** QE's mean/median figures are
**per-file in-worker duration**, a different unit from the CPU clause, and QE says so explicitly:
*"used here for shape only, never blended with the CPU clause."* I have used them for **shape**
(the all-in mean is 3.3× the median, so it over-prices a typical file) and **not** to compute a
cheaper headroom. **No target was moved and no number was re-derived to buy room.**

## The levers, all inside ticket authors' control, none of them a re-measurement

Together they are worth up to **−3 files**, which is exactly the gap between the best and worst cases:

1. **`ABC-032` takes its stated 0-file option** (`parseSan`'s rows extend `src/san.test.ts`) — **−1**.
2. **`ABC-043`, `ABC-045`, `ABC-046` add no file** — already required by their tickets, and it is the
   single largest saving this epic makes.
3. **`ABC-038` is `EPIC-003`'s own declared negotiable slice** — *"cut FIRST if `EPIC-003` runs
   long; all four epic acceptance criteria hold without it"* — **−1** if it is cut.
4. **Cap and state `ABC-042`'s spawn count.** A spawning file is the one that turns a fits into a
   misses.

**If it still does not fit after those, the decision is `ADR-0008`'s owner's and the level is Olger
Oeselg's, ratified in person. It is not a ticket author's to take, and I am not taking it.**

## One more thing worth recording about `N8-LANE`

The per-ticket bar is **650 ms CPU**, and the published headroom is **~5 tickets' worth of it**
(`3.455 / 0.650 = 5.3`; item 5 records `~4` pre-threads). **`EPIC-003` and `EPIC-006` together are
fourteen tickets.** The bar is a **ceiling per ticket, not a budget fourteen tickets can each draw
on** — in practice a one-file ticket spends ~139–165 ms, about a quarter of it. **Stated so nobody
reads `N8-LANE` as an allowance.**
