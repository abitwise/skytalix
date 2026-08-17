---
id: 20260817T205400Z-software-engineer-observation-n8-lane-measured-lane-split-c4a7e10b
kind: observation
by: software-engineer
at: 2026-08-17T20:54:00Z
verified_by:
confidence: medium
refs:
  - ABC-077
  - N8-LANE
  - NFR-008
  - plans/nfr-catalog.md
  - src/search.test.ts
supersedes:
---

# `N8-LANE` — the lane fit was DECIDED WITH A MEASUREMENT, and the split follows from it

`DoR` item 10's remaining ⚠️ (`G4`) was this measurement. It is taken.

## The instrument

Paired and interleaved, in ONE tree, both conditions on the branch tip:

- **A** = `npx vitest run` — the default lane WITH `src/search.test.ts`.
- **B** = `npx vitest run --exclude '**/search.test.ts'` — the identical tree with that one file
  excluded from the run.

CPU = user + sys from `/usr/bin/time -p`. One fresh OS process per run, condition order rotated
every round (`AB`/`BA`), **9 rounds with round 0 discarded as warm-up = n 8 usable paired deltas**.
This differs from `plans/nfr-catalog.md`'s wording — that protocol pairs two TREES; this pairs two
RUNS over one tree by excluding the added file. Recorded as the deviation it is.

## The reading

```
paired deltas, rounds 1-8 (s CPU)   0.630 0.370 0.700 0.430 0.870 0.730 0.450 0.620
median                              0.625 s CPU
sign                                8/8 positive  -> an effect exists

identity null control (both conditions the IDENTICAL command, same harness, n = 8)
  deltas                            0.200 -0.390 0.070 0.050 -0.060 -0.310 -0.190 0.410
  median                            -0.005 s  =  -0.04% of the ~12 s lane      sign 4/8 = chance
  well inside the catalog's <= 1.5% admissibility floor

NET of the 160 ms per-file floor (one file added):  625 - 160 = 465 ms
N8-LANE bar                                                     650 ms
                                                    ->  MET at 0.72x
```

**The machine was LOADED while this ran** — 1-minute load average 24.77 on 8 cores (Apple M3, 8
cores, 16 GB, macOS 25.5.0, node v24.12.0), with this session's own agent work running. Load pushes
the absolutes UP, so the reading is conservative rather than flattering.

## The split the measurement forced, and the one it did NOT allow

The whole file in one lane costs **~8.7 s** under the runner. Measured per test, the four costs that
did not fit: the depth-3 pruned/unpruned pair on kiwipete (~700 ms), `position-6` (~547 ms) and
`position-5` (~331 ms); the 204-position broad corpus at depth 2 (~2.7 s); the depth-7 mate case
(~1.4 s). Those went behind **`SEARCH_DEEP=1`** on the `PERFT_DEEP` precedent — not defined when the
flag is unset, so the skip count stays 0.

**The depth-3 sweep was NOT silently dropped.** The default lane keeps the depth-3 pruned/unpruned
pair on `position-3` (~58 ms), which is the same window-bug detector on a cheaper subtree; the other
five run under the flag. Default-lane test time after the split: **194 ms** (from 839 ms in the
first, unsplit shape).

Two further reductions were taken instead of dropping coverage, and both are named because they look
like coincidences in the diff: `searchPair()` runs each pruned/unpruned pair ONCE and `A1`, `A2` and
`A7` read the scores, the node counts and the byte-identity off that one measurement; `corpusRun()`
does the same for `A4` and `A7` over the corpus. Three criteria, three separate assertions, one
search.

**One trade is real and is stated plainly: `A2`'s own case — kiwipete at depth 3 — is in the DEEP
lane, and the default lane guards `A2` at startpos depth 2 (27.1%) instead.** A regression that
prunes correctly at depth 2 and not at depth 3 would pass `npm test` and be caught only by
`SEARCH_DEEP=1`. That is why the deep-lane command is now in `AGENTS.md` with "run it at the QE hop
and after any change to `src/search.ts`" attached to it.

## An observation about the lane TOTAL, which is not mine to rule on

Condition B — the lane WITHOUT this ticket's file — measured **11.3 to 13.3 s CPU** across 9 rounds
on this loaded machine. `NFR-008`'s CPU clause is **<= 13 s**, and the last recorded reading was
10.390 s at `06c5427` with 28 test files. There are now 33. **This is a raw observation from a
loaded machine on an instrument built for DELTAS, not a measurement of `NFR-008` and not a verdict
on it** — that row belongs to Architect/Design. It is recorded because it would be dishonest to
report my own delta as comfortable without noting what it is a delta ON.
