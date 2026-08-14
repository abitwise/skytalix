---
id: 20260814T204800Z-software-engineer-observation-n8-lane-measured-78268cf3
kind: observation
by: software-engineer
at: 2026-08-14T20:48:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - N8-LANE
  - NFR-008
  - plans/nfr-catalog.md
  - src/cli.test.ts
supersedes: 
---

# `N8-LANE` is BREACHED, measured — and the breach is forced by the criteria, not by the build

> The ticket predicted this file would be the one to test the bar: *"this ticket is the most likely
> in either epic to test it: ONE new test file, the heaviest either epic adds."* **It tests it and it
> fails it.** The number is here with its protocol so the gate reads a measurement rather than my
> opinion of one.

## The reading

Conditions, both `npm test`'s runner invoked directly (`npx vitest run`), `PERFT_DEEP` unset:

- **with** — the delivered tree, **30 files / 856 tests**
- **without** — `--exclude 'src/cli.test.ts' --exclude '**/node_modules/**'`, **29 files / 827 tests**
  (verified to be exactly the merged lane, by file and test count)

CPU is `user + sys` from `/usr/bin/time -p`. Paired per round, **condition order rotated every
round**, one fresh OS process per run, **round 0 discarded**.

| round | with (ms) | without (ms) | delta (ms) |
|---|---|---|---|
| 0 (discarded) | 10680 | 9110 | 1570 |
| 1 | 10540 | 9140 | **1400** |
| 2 | 10450 | 9160 | **1290** |
| 3 | 10760 | 9260 | **1500** |
| 4 | 10820 | 9700 | **1120** |
| 5 | 10860 | 9310 | **1550** |
| 6 | 10770 | 9450 | **1320** |
| 7 | 10930 | 9340 | **1590** |

**Median paired delta: 1400 ms CPU. Sign test: 7/7 positive** — the effect is real, not noise.
**Net of the per-file floor (1 test file x 160 ms): 1240 ms.**

> **`N8-LANE` (≤ 650 ms CPU, net): NOT MET. 1240 ms is 1.9x the bar.**

**What is NOT claimed.** This is n = 7 with the order rotated, but it carries **no identity null
control** — the catalog's admissibility clause requires a `cmp`-verified byte-identical second tree
run as its own condition. So this reading is honest and reproducible but **not a fully admissible
`N8-LANE` measurement**; the formal one is Security/NFR's at the gate. I expect it to land in the
same place, because the cost decomposes into child processes rather than into anything statistical.

## Where the 1400 ms is, so the gate does not have to guess

Measured directly on the same machine:

| item | CPU each | count | total |
|---|---|---|---|
| `node src/cli.ts <args>` child | **~88 ms** | 9 | ~790 ms |
| `npm run chess` child | **~210 ms** | 1 | ~210 ms |
| the file itself (transform, collect, the two 1000-case sweeps, source reads) | — | — | ~240 ms |
| vitest per-file floor (charged to `NFR-008`'s floor account, not to this ticket) | 160 ms | 1 | 160 ms |

**~1000 ms of the delta is child processes.** For scale: a bare `node -e ""` costs **10 ms** here, so
the ~78 ms above that is loading and type-stripping the entry point's module graph — the engine, on
every child, including the six that reject an argument and exit before composing anything.

## Why this is criteria-forced rather than a build that could be made cheaper

Ten children is the **floor** for the criteria as written, and I looked for a merge for each one:

- `A1` requires the bare `npm run <name>` — the only npm child, and the expensive one. It already
  carries `A7`'s ascii half and `A8`.
- `A4` names three runs (`--colour white`, `--colour black`, `--colour random`). One of them already
  carries `A7`'s unicode half; the other two carry nothing else because nothing else is left.
- `A6`(iii) names **four** argvs, verbatim. Four children.
- Bar 3 says **"spawn once"** with an escape-bearing token; no `A6`(iii) argv can carry it without
  ceasing to be the argv `A6`(iii) names.

**Even at the criteria's own minimum, this file costs ~1.0 s of child CPU. There is no build
satisfying `A1`, `A4`, `A5`, `A6`(iii) and bar 3 on this machine that meets `N8-LANE`.** That is the
shape of the conflict: it is between two accepted rows of the same ticket, not between the ticket and
this build.

**One lever I measured and did NOT take.** Deferring the heavy imports behind a dynamic `import()` on
the success path would make the six rejection children ~75 ms cheaper each (~450 ms), landing at
~790 ms net — **still over the bar**, while adding top-level `await` and an argv-adjacent dynamic
import to a composition root that security bar 1 reads line by line. Buying a still-failing number
with that is the wrong trade, and coding rules 5 and 7 forbid the flexibility outright. Recorded as
considered-and-declined, not silently skipped.

## What is NOT breached

`NFR-008`'s own total is **≤ 13 s CPU** and the lane now reads **~10.7 s** (from ~9.2 s). The lane
budget holds; it is the **per-ticket 5% slice** that does not. The wall clause is unaffected: the
same eight rounds moved the wall by well under the noise the catalog already records for it.
