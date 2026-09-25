---
id: 20260924T201000Z-software-engineer-observation-rehop2-nfr008-n8lane-paired-fa80923-vs-tip-b16d3f59
kind: observation
by: software-engineer
at: 2026-09-24T20:10:00Z
verified_by:
confidence: low
refs:
  - ABC-079
  - NFR-008
  - ADR-0019
  - plans/nfr-catalog.md
  - src/search.test.ts
  - src/search.qe.test.ts
supersedes:
---

# `NFR-008` and `N8-LANE`, paired: before = `fa80923`, after = `33b9a02`. The default lane barely moves, and the machine was at load 17–35

`confidence: low` because of the load. The arms were measured at **load 17–35**, with other
sessions' test runs live on the same 8-core M3. That is far off the catalog's quiet-machine
protocol. Every run exited 0.

Method: both trees come from `git archive` into the session scratchpad, with `node_modules`
symlinked. Each run is a fresh `/usr/bin/time -p npx vitest run --dir src [--exclude …]`, CPU =
user + sys. Each round runs all six arms back to back: before and after × (full lane, lane
without the two search files, lane without `src/quiescence.test.ts`). There were **5 rounds**:
3, then 2 more because the load was high.

## `NFR-008`: the whole default lane (level 15 s CPU, 3 s wall)

```
                         cpu s, 5 rounds                        median   wall median   files / tests
before  fa80923          22.46 / 24.56 / 27.58 / 21.69 / 26.54   24.56     6.90         41 / 1243
after   33b9a02          23.01 / 27.16 / 27.86 / 26.09 / 26.54   26.54     7.82         41 / 1244
paired after - before    0.55 / 2.60 / 0.28 / 4.40 / 0.00        +0.55
```

**Non-conforming on both arms**, as re-hop 1 recorded: 24.6–26.5 s CPU against 15 s, and
6.9–7.8 s wall against 3 s. The before arm is already over, so this hop did not cause the
crossing. The only default-lane change in this hop is one `QE-G1` case on a bare-kings
position. The +0.55 s paired median sits inside a 0.00–4.40 s spread, which is noise at this
load.

## `N8-LANE`: the two touched files, measured alone (the cleaner reading)

`npx vitest run src/search.test.ts src/search.qe.test.ts` (default lane), interleaved, 5 rounds,
load 18.8–20.7:

```
before fa80923   35 tests   cpu 2.96 / 3.39 / 3.30 / 3.20 / 3.31   median 3.30
after  33b9a02   36 tests   cpu 3.20 / 3.64 / 3.50 / 3.33 / 3.20   median 3.33
paired           0.24 / 0.25 / 0.20 / 0.13 / -0.11                 median +0.20 s (4 of 5 positive)
```

Inside the full lane, the "charge" of the two search files (full minus lane without them) reads
a median of 1.66 s before and 3.24 s after. The quiescence file's charge reads −0.27 s before
and 1.22 s after. A negative charge is impossible, so the full-lane subtraction cannot resolve a
sub-second file charge at load 17–35. **These subtraction figures are not evidence about either
file.** The standalone pairing above is the one to read. Even that is a loaded reading: the
default-lane content changed by one case, and a 0.2 s rise for it is more than a bare-kings
call should cost. `N8-LANE` is **not claimed MET or NOT MET** here; it needs a quiet-machine
re-read.

Raw rows: session scratchpad `nfr008.tsv` (not committed).
