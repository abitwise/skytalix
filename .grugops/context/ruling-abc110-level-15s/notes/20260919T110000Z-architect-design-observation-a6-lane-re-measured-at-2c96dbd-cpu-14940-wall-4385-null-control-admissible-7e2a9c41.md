---
id: 20260919T110000Z-architect-design-observation-a6-lane-re-measured-at-2c96dbd-cpu-14940-wall-4385-null-control-admissible-7e2a9c41
kind: observation
by: architect-design
at: 2026-09-19T11:00:00Z
verified_by:
confidence: high
refs:
  - ABC-110
  - ABC-110/A6
  - ABC-110/A7
  - ABC-110/A8
  - ABC-111
  - NFR-008
  - N8-LANE
  - N8-SPAWN
  - ADR-0014
  - ADR-0019
  - plans/nfr-catalog.md
supersedes:
---

# `ABC-110` `A6` — the default lane re-measured at `2c96dbd` under `NFR-008`'s own protocol: **median CPU 14.940 s / median wall 4.385 s, n = 8, identity null control −0.37% at 3/8 — ADMISSIBLE.** Raw numbers, load, deviations, and what was NOT measured

**This is not a stamp.** Hand-authored `observation`; no `finding` is admissible on this install.
**Confidence `high` on the CPU figure; the wall figure is data and carries no verdict** (see the
sibling `decision` note and `ABC-111`).

## Tree, counts, and the one thing that differs from every prior lane reading

**Anchor: `2c96dbd`** (`grugops/owner-rulings-2026-09-19` tip = the base of this hop's branch).
**40 test files / 1213 tests / skip 0**, asserted by every run — a run whose counts were not
40 / 1213 would have been a harness error, never a datum; **there were none (18 of 18 `ok`)**. Skip
count captured separately by the JSON reporter: `numPendingTests + numTodoTests = 0`, 1213 passed.

**Deviation, disclosed, and it is new:** the two out-of-tree copies were made with **`rsync -a`
of the worktree** (excluding `.git`, `node_modules`, `coverage`), **not `git archive`** — the
sandbox this hop ran in refused every `git archive` / `git ls-files` invocation. What that could have
let in is untracked content; what rules it out: `git status --short` on the worktree showed only this
hop's staged queue rename under `.grugops/` (excluded by `vitest.config.ts` and outside `--dir src`),
and `git diff --stat 2c96dbd -- src vitest.config.ts package.json package-lock.json tsconfig.json
biome.json` was **empty**. The copy carries a `.claude/` directory (`settings.json`, `skills/`) with
**no `worktrees/` under it** (checked), and `--dir src` scans `src/` only in any case:
`find <copy>/src -name '*.test.ts' | wc -l` = **40**, whole-copy count also **40**. **`AGENTS.md` is
in the copy**, so the inherited `ENOENT` deviation does not arise. `node_modules` is symlinked into
each copy — the inherited deviation every lane reading on this project carries.

Copies `A` and `N` verified byte-identical by `/usr/bin/diff -r --exclude=node_modules` (no
output). (`diff` unqualified is aliased to `git diff` in this shell; the absolute path was used.)

## Instrument

Contained lane **`npx vitest run --dir src`**, exactly as the subtask and the row's own re-measure
instruction state. `/usr/bin/time -p`; CPU = user + sys; one fresh OS process per run; condition
order rotated every round (`A N` on even rounds, `N A` on odd); **9 rounds, round 0 discarded,
n = 8**; 1-min load average (`sysctl vm.loadavg`) read immediately before and after each run and at
round boundaries. Harness: `raw-harness.mjs.txt` beside this note (`.txt` so it is a record, not a
runnable thing in the repo). It ran entirely outside the repository and is not committed —
`N8-SPAWN` 0 ms.

## The numbers

```
round cond  wall   user   sys    cpu    files tests load_before load_after
  0    A   16.49  15.30  2.98  18.28    40   1213    4.02  4.12   <- DISCARDED (round 0; the session's cold first run)
  0    N    4.43  13.28  1.50  14.78    40   1213    4.12  4.11   <- DISCARDED (round 0)
  1    N    4.39  13.16  1.53  14.69    40   1213    4.11  4.11
  1    A    4.34  13.25  1.51  14.76    40   1213    4.11  4.18
  2    A    4.32  13.24  1.58  14.82    40   1213    4.18  4.65
  2    N    4.39  13.12  1.57  14.69    40   1213    4.65  4.75
  3    N    4.34  13.19  1.54  14.73    40   1213    4.75  4.53
  3    A    4.40  13.41  1.54  14.95    40   1213    4.53  4.49
  4    A    4.50  13.34  1.59  14.93    40   1213    4.49  4.53
  4    N    4.31  13.44  1.60  15.04    40   1213    4.53  4.25
  5    N    4.37  13.35  1.53  14.88    40   1213    4.25  4.25
  5    A    4.75  13.59  1.57  15.16    40   1213    4.25  4.39
  6    A    4.65  13.53  1.60  15.13    40   1213    4.39  4.28
  6    N    4.61  13.60  1.61  15.21    40   1213    4.28  5.38
  7    N    4.43  13.38  1.57  14.95    40   1213    5.38  6.63
  7    A    4.37  13.46  1.53  14.99    40   1213    6.63  7.46
  8    A    4.33  13.39  1.54  14.93    40   1213    7.46  6.94
  8    N    4.32  13.51  1.54  15.05    40   1213    6.94  6.54

condition medians, n = 8            CPU (user+sys)      WALL
A  the lane                            14.940 s        4.385 s     range 14.76-15.16 / 4.32-4.75
N  identity twin                       14.915 s        4.380 s     range 14.69-15.21 / 4.31-4.61

IDENTITY NULL CONTROL  N-A per round CPU (ms):  -70 -130 -220 +110 -280 +80 -40 +120
                       median -55 ms = -0.37%, sign 3/8 positive  ->  ADMISSIBLE (<= 1.5%, sign at chance)
                       recorded BEFORE any figure was compared to a level
                       N-A per round WALL (ms):  +50 +70 -60 -190 -380 -40 +60 -10   median -25 ms

against the clauses
NFR-008 CPU <= 15 s   (ADR-0019)  ->  14.940 s =  99.6%   UNDER by 0.060 s
NFR-008 CPU <= 13 s   (the old level, for the record)  ->  114.9%, over by 1.940 s
NFR-008 WALL <= 3 s               ->   4.385 s = 146.2%   DATA ONLY - NOT A VERDICT (ABC-111)
```

**Vitest's own `Duration` line** read 3.71–3.88 s on the runs I checked; the ~0.65 s between that and
`real` is `npx` + Node bootstrap outside vitest's timer, common to every reading on this row.

## Load — not quiet, not claimed, sized

```
1-min load before each run      min 4.02   median 4.44   max 7.46
5-min load at round boundaries  6.75 - 7.27 throughout
15-min                          6.97 - 7.15
sample-internal sensitivity     rounds 1-3 (load 4.1-4.8)  median A CPU 14.82 s
                                rounds 6-8 (load 4.3-7.5)  median A CPU 14.99 s     +1.1%
prior readings of the same instrument (ADR-0014)                                    +1.63% / -1.90%
runs individually over 15 s CPU   A: 15.16 (r5), 15.13 (r6)   N: 15.04 (r4), 15.21 (r6)   4 of 16
```

Before the harness the session read load averages of **13–20** (an in-tree single run at that load
read **16.46 s CPU / 4.30 s wall**, 40 / 1213 — recorded here as context, NOT part of the sample:
it was in-repo, single, and unpaired). The harness was started when the 1-min load fell to ~4.
**Sibling hops of this same wave (`owner-rulings-2026-09-19`, six subtasks) were live on this machine;
how many were running during the sample is `UNKNOWN - verify`.**

## The wall clock and the parallelism — reported, with the candidate named

```
CPU / wall ratio (effective parallelism, 8 logical cores, 7 workers)
  this sample, A median              14.940 / 4.385  =  3.41x
  2026-08-19 warm interleaved                           5.29x
  2026-08-19 cooled                                     4.64x
```

Wall rose ~1.4 s against 2026-08-19 while CPU rose ~0.2–0.5 s (of which ~0.37 s is the one file
added since). **The lane did not get 1.4 s of wall heavier; it got ~35% less parallelism.** With the
harness contributing ~3.4 of a 1-min load of 4–7.5, roughly one to four of the eight cores were busy
elsewhere. **Core contention from concurrent work is the consistent explanation and it is a
CANDIDATE, not a cause** — it was not separately established, and `ABC-111` `A5` (a second session
≥ 1 h later) is the test that would establish or exclude it. This is exactly why the wall figure is
data and not a verdict.

## `A7` and `A8`, measured

- **`A7`:** eight-row hash of `plans/nfr-catalog.md` (`grep -E '^\| NFR-00[1-8] \|' | shasum -a 256`)
  read **`63f66795…ca31`** before this hop's edit — reproducing the figure QE could not, and defining
  its byte range — and **`eee4dfff…3e5f`** after. Rows `NFR-001`–`NFR-007` hashed individually:
  `fcae7ccf…`, `75fcc5e2…`, `79e391ff…`, `053ba48a…`, `f9c6579b…`, `850ba137…`, `3988e3bb…` before
  **and after**. `NFR-008`: `c1524ad1…` → `080ba017…` — the level cell only. 56 table lines before
  and after. `git diff --numstat` over the hop touches no file under `src/`, and not
  `vitest.config.ts`, `AGENTS.md` or `package.json`.
- **`A8`:** 1213 tests / 40 files / skip 0 before; nothing moved lanes; 1213 / 40 / 0 after. The
  ticket's 1181 was the count at `54cbb23`; `main` took on one file and 32 tests since, none of it
  this ticket's.

## What was NOT measured, so nobody reads it in

No per-file removal (`A1`–`A4` are QE's, 2026-08-20, and were not repeated). No cooled series. No
`isolate: false` (forbidden; not re-tested). No second session. No other machine.
