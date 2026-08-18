---
id: 20260819T020000Z-architect-design-observation-the-restated-lane-reading-and-what-quiet-could-not-be-bought-c1d2e3f4
kind: observation
by: architect-design
at: 2026-08-19T02:00:00Z
verified_by:
confidence: high
refs:
  - ABC-108
  - OQ-1
  - NFR-008
  - N8-LANE
  - N8-SPAWN
  - ADR-0008
  - AR-N8LANE-078
supersedes:
---

# The restated lane reading at `54cbb23` — **14.760 s CPU (n=8, protocol) / 14.480 s CPU (n=6, cooled)** against `NFR-008`'s 13 s clause, and the quiet machine `A1` asks for **could not be bought — so the contamination was SIZED instead of asserted**

**This is not a stamp.** Hand-authored `observation`; no `finding` is admissible on this install.
**Confidence `high` on the CPU clause and `low` on the direction of the wall clause** — both reasons
are stated below and neither is smoothed.

## What was measured, and on which tree — stated, not implied

**Anchor: `main` @ `54cbb23`**, taken from `git archive` so only tracked files exist in the measured
trees. **39 test files / 1181 tests**, asserted by every single run (a run whose counts were not
`39` / `1181` would have been recorded as a harness error and never as a datum; **there were none**).

**`ABC-078` is IN.** `ABC-108`'s `## Dependencies` said the measurer must state whether the reading
is taken with or without `src/engine.test.ts` and calls it the measurer's call. **It is not a call
any more: `ABC-078` merged** (`src/engine.test.ts` last touched by `d4dc5f6` on `main`), and so did
`ABC-037`'s `src/line-input.test.ts` (`09fb8a6`). **The inherited reading's condition B — 35 files,
"the lane before `ABC-078`" — is now a historical condition and I did not reconstruct it.** The
question `ABC-108` asks is about the lane that exists, and the lane that exists is 39 files.

**The tree grew by more than `ABC-078` between the two readings**: Security/NFR measured 36 files /
1016 tests on 2026-08-18; `54cbb23` carries **39 files / 1181 tests** — **+3 files and +165 tests in
one day**. Anyone comparing my absolutes to theirs must carry that.

## The `vitest.config.ts` worktree trap — avoided by construction, and stated

`vitest.config.ts` declares no `exclude`, so an in-repo agent worktree makes the default lane report
another branch's tree as its own. **`git archive` emits tracked files only, and `.claude/worktrees/`
is untracked, so no measured tree contained one.** Verified rather than assumed: `find <copy> -name
'*.test.ts' -not -path '*/node_modules/*' | wc -l` = **39** in conditions `A` and `N` and **47** in
`P`. **No figure here was taken in-repo and no `--exclude` was needed.**

## SAMPLE 1 — the protocol reading. n = 8, null control ADMISSIBLE

Three out-of-tree copies under `$SCRATCH/oq1/`, `node_modules` symlinked into each (**disclosed
deviation, inherited from every prior lane reading on this project**); `AGENTS.md` needed no separate
copy because it is tracked and came with the archive (**the inherited reading's second disclosed
deviation does not arise here, and that is a difference from it, not a silent repeat**). CPU =
user + sys from `/usr/bin/time -p`, one fresh OS process per run, **condition order rotated every
round** (`A N P` / `N P A` / `P A N`), **9 rounds, round 0 discarded, n = 8**, 1-min load average
recorded at the start and end of every round. **27 usable runs, 0 harness errors.**

- **`A`** = the lane at `54cbb23`, 39 files / 1181 tests
- **`N`** = a `diff -r`-verified byte-identical twin of `A` — **the identity null control**
- **`P`** = `A` plus **8 trivial one-assertion test files** and nothing else (`diff -r` verified,
  47 files / 1189 tests) — **the per-file slope probe, and the instrument that sizes the load**

```
condition medians, n = 8              CPU (user+sys)         WALL
A  the lane, 39 files                    14.760 s           2.805 s      range 14.67-15.05 / 2.75-2.85
N  identity twin, 39 files               14.795 s           2.785 s      range 14.57-15.06 / 2.70-2.89
P  A + 8 trivial files, 47 files         16.120 s           2.880 s      range 15.49-16.23 / 2.81-3.07

IDENTITY NULL CONTROL  N-A   median +15 ms = +0.10% CPU, sign 5/8 positive
                             -> inside the row's <= 1.5% clause, sign at chance -> ADMISSIBLE
                             (recorded BEFORE the treatment was looked at, as the row requires)

SLOPE PROBE            P-A   median +1230 ms CPU, sign 8/8, per-round
                             820 / 1500 / 1230 / 1250 / 1130 / 1460 / 1130 / 1230 ms
                             -> 153.7 ms CPU per test file on THIS lane, in THIS session

NFR-008  CPU <= 13 s   ->  14.760 s = 113.5% of the clause.  OVER by 1.760 s.
NFR-008  WALL <= 3 s   ->   2.805 s =  93.5% of the clause.  Under by 0.195 s.
```

## SAMPLE 2 — the cooled series. **NOT protocol-conformant (n = 6) and quoted as a supplement, never averaged with sample 1**

Six single runs of condition `A`, each preceded by a **90 s idle gap** so the 1-min load average
decays back toward the machine's non-harness baseline, with the load recorded **immediately before**
each run — which is the only honest place to read "quiet" (see the next section).

```
run   load BEFORE     CPU        WALL
 1       2.77       14.64 s     3.17 s
 2       2.09       14.19 s     3.03 s
 3       1.44       14.78 s     3.06 s
 4       1.68       14.37 s     3.23 s
 5       2.24       14.59 s     3.26 s
 6       2.29       14.29 s     3.07 s
MEDIAN   2.17       14.480 s    3.120 s      range 14.19-14.78 / 3.03-3.26

NFR-008  CPU <= 13 s   ->  14.480 s = 111.4% of the clause.  OVER by 1.480 s.
NFR-008  WALL <= 3 s   ->   3.120 s = 104.0% of the clause.  OVER by 0.120 s.
```

**The wall clock moved the WRONG WAY between the samples and I am not going to hide it:** the cooled
sample is quieter and reads **higher** wall (3.120 s vs 2.805 s) while reading **lower** CPU
(14.480 s vs 14.760 s). Lower CPU at lower load is what the machine should do; higher wall is not.
**The consistent explanation is a cold filesystem/JIT cache after each 90 s idle gap — back-to-back
interleaved rounds run warm — and I did not separately establish it, so it is labelled a candidate
and not a cause.** What it means for the ruling is in the `decision` note: **the CPU clause is ruled
and the wall clause's DIRECTION is not.**

## `A1` — **FAILED as written, and the reason is structural rather than a matter of trying harder**

`A1` asks for a maximum recorded 1-min load average **≤ 1.0 on 8 cores**. **It was never reached.**

```
sample 1, recorded at every round boundary      min 1.72   median 7.19   MAX 10.24
sample 2, recorded immediately before each run  min 1.44   median 2.17   max 2.77
lowest 1-min load observed anywhere in the hop  1.44
```

**`A1` cannot be satisfied by a measurement of this lane on this machine, and that is a property of
the criterion rather than of the machine.** The default lane runs `pool: "threads"` at
`availableParallelism() − 1` = **7 workers** and consumes ~14.6 s of CPU in ~2.9 s of wall — **~5x
parallelism**. A back-to-back interleaved harness therefore drives the 1-min load average above 1.0
**by itself**, within one round, whatever else is running. **A load threshold sampled at round
boundaries during the harness measures the harness.** The only reading of `A1` that could ever pass
is the pre-run load of an isolated single run — and even with a 90 s idle gap and no measurement of
my own in flight, this machine's floor was **1.44**, because ~20 agent worktrees and the usual
desktop processes are live. **This machine cannot be quieted from inside it, exactly as
`ABC-108`'s ⚠️ and `## Dependencies` predicted.**

**So `A1` was not met, the reading was taken anyway, and the honest move was to stop asserting quiet
and start SIZING the contamination.** That is the next section, and it is the substance of this hop.

## Sizing the contamination — **the load sensitivity of this instrument is ~2%, MEASURED, not assumed**

`ABC-108` `A4` asks how much of a gap is load inflation and how much is content. The whole open
question turns on it, so it gets a measurement rather than an argument. **Three independent
estimates, all pointing the same way:**

**(1) Within sample 1, load swung 3.2x during the run and CPU barely noticed.** Condition `A`'s runs,
split by the load recorded against them:

```
rounds 1-3, load 2.99-3.17    14.67 / 14.69 / 14.72   median 14.69 s
rounds 4-8, load 6.96-10.17   14.77 / 14.93 / 14.75 / 15.05 / 15.00   median 14.93 s
                                            DELTA +0.24 s = +1.63% for a 3.2x rise in load
```

**(2) Across the samples, load fell ~3x and CPU fell 1.9%.** Sample 2 (load 2.17) reads 14.480 s
against sample 1's 14.760 s — **−1.90%**.

**(3) The single quietest observation of the whole hop is still far over the clause.** The lowest
CPU any run of condition `A` produced — across all 15 of them, including sample 1's discarded
warm-up — is **14.15 s at load 1.74**. **That is 8.8% over 13 s.** There is no run in this hop,
under any condition, at any load, that came in under the clause.

> **THE BOUND THIS PUTS ON THE OPEN QUESTION.** To bring the restated figure under 13 s requires
> deflating it by **10.2%** (from 14.480 s) or **11.9%** (from 14.760 s). **The largest load effect
> measurable in this hop, over a 6x load swing from 1.7 to 10.2, is 1.9%.** The required deflation is
> **five to six times larger than the entire measured load sensitivity of the instrument.** Load
> inflation cannot account for this reading and this is the first time that has been measured rather
> than argued.

## `A4` — the per-file all-in cost, restated against 341 ms and 383 ms

```
ratified 2026-08-13, post-`threads`      9.545 s / 28 files  =  341 ms per file
Security/NFR 2026-08-18 (condition B)   13.400 s / 35 files  =  383 ms per file
THIS HOP, sample 1                      14.760 s / 39 files  =  378 ms per file
THIS HOP, sample 2 (cooled)             14.480 s / 39 files  =  371 ms per file
```

**My figure lands between the two, and much nearer the inherited 383 than the ratified 341 — while
being taken at a LOWER load than either.** That is the answer to the honesty clause `ABC-108` was
built around:

- **What I CAN attribute.** Of the 42 ms/file gap between the ratified 341 and the inherited 383,
  **~7 ms/file (about 2%) is load**, by the sensitivity measured above. **The remaining ~35 ms/file —
  roughly five sixths of it — is content and file mix.** Direct arithmetic: the lane grew from
  **28 files / 807 tests to 39 files / 1181 tests**, and the eleven files added since the ratified
  reading cost `(14.480 − 9.545) / 11` = **449 ms per file all-in — 32% more than the old lane's
  341 ms average.** The lane did not get slower per file by drifting; **it took on eleven
  above-average files.**
- **A second route to the same place — this hop's own slope.** 153.7 ms/file (sign 8/8) against the
  ratified post-`threads` slope of **138.9 ms/file**: **+10.7%.** **This one is CONFOUNDED and I will
  not spend it as if it were clean** — the catalog's own floor measurement records that marginal cost
  **rises with file count** (100/124/151/163/168 ms at +2/+4/+8/+16/+32 on a 22-file lane), and my
  window is 39→47 files against the ratified 28→36. Some unknown share of that +10.7% is the window,
  not the load. **Reported, not banked.**
- **What I CANNOT attribute, and it cuts AGAINST the deflation argument rather than for it.** The
  ratified 341 ms is **itself a loaded figure**: item 7 of the 2026-08-13 reading states plainly that
  two other agents were live throughout, that **98 of its 135 runs began at a 1-min load above the
  machine's 8 cores** (median **10.56**, max 35.90), and that *"this is a LOADED measurement, the
  load pushes the absolutes UP, and both clauses are MET anyway"*. **So 341 ms is not a clean
  low-load baseline, and deflating today's figure toward it is backwards** — today's reading was
  taken at a load median of **2.17** (sample 2) and **7.19** (sample 1) against that session's
  **10.56**. **The honest residue: I cannot say how much of the RATIFIED 341 ms is inflation, only
  that it is not a floor.** Every direction that residue could move pushes the true content cost of
  today's lane **up**, not down.

## Cross-check by arithmetic — the row's own restatement rule, run against the measurement

`NFR-008`'s item 6 says: if files land, **do not re-measure, restate by arithmetic**. Run against
today's 39 files it predicts the breach on its own, from the ratified numbers alone:

```
floor only, at the ratified threads slope   9.545 + 11 x 0.1389  =  11.07 s   (under)
at this hop's measured slope                9.545 + 11 x 0.1537  =  11.23 s   (under)
at the ratified ALL-IN 341 ms/file          9.545 + 11 x 0.341   =  13.30 s   OVER, on 2026-08-13's
                                                                              own published number
MEASURED                                                            14.48-14.76 s
```

**The row forecast this in its own words on 2026-08-13** — *"USE ~7 AS THE PLANNING NUMBER AND ~16 AS
THE CEILING"*, *"tight, not comfortable"* — **and eleven files landed against a planning number of
seven.** The measurement did not discover a surprise; it confirmed a published forecast that nobody
re-read at a cut. **The gap between the arithmetic restatement (13.30 s) and the measurement
(14.48 s) is the eleven files being heavier than average, and that gap is 1.18 s — most of the
breach.**

## Where the lane's CPU actually goes, for whoever writes the remedy — INDICATIVE, and labelled so

From one run's per-file report (`log-A-6`), the slowest default-lane files by in-worker time:

```
src/perft.test.ts                     939 ms   (24 tests)
src/san.qualifier.hardening.test.ts   427 ms   (20 tests)
src/history-pane.test.ts              371 ms   (26 tests)
src/engine.test.ts                    348 ms   (24 tests)
src/search.test.ts                    336 ms   (28 tests)
src/search.qe.test.ts                 286 ms   (6 tests)
src/san.test.ts                       259 ms   (22 tests)
```

**Read this with the caveat or do not read it at all.** Those are per-file **in-worker** times from
a single run, **not CPU and not a median** — the whole file set sums to roughly **4.2 s** against a
**14.5 s** CPU total, so **~70% of this lane's CPU is the per-file floor** (transform, collect,
prepare, and the per-file module-registry isolation `ADR-0008` deliberately bought), **not test
execution.** Any remedy that trims assertions inside files is aimed at the smaller 30%. **`UNKNOWN -
verify`: the all-in CPU saving of moving any specific file out of the default lane was NOT measured
here and must be measured by the remedy ticket, not inferred from this table.**

## What this reading does NOT establish

- **Not a figure for any other machine.** Apple M3 (Mac15,13) / 8 logical cores / Darwin 25.5.0
  arm64 / macOS 26.5.2 / Node v24.12.0 / vitest 3.2.7. **`UNKNOWN - verify` anywhere else.**
- **Not a quiet-machine reading.** `A1` failed; see above. **What replaces it is a measured bound on
  the contamination, not a claim of its absence.**
- **Not a wall-clause verdict in either direction.** 2.805 s under the protocol and 3.120 s cooled;
  the samples disagree across the clause and one of them is not protocol-conformant on `n`.
- **Not a re-measurement of `NFR-001`–`NFR-007`.** None was touched.
- **Not a verdict on any test, file or coverage decision.** Nothing was examined for deletion and
  **`src/` is byte-identical across this hop** (`A8`).
- **Nothing was charged to `N8-SPAWN`.** The harness ran outside the repository; its balance stays
  **0 ms**.
