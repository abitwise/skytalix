---
id: 20260924T200700Z-software-engineer-observation-rehop-n8-lane-plus-3-rows-0-files-0-children-in-file-within-1-ms-lane-cpu-20-68-s-before-20-07-s-after-under-load-20-27-not-ruled-75389b36
kind: observation
by: software-engineer
at: 2026-09-24T20:07:00Z
verified_by:
confidence: medium
refs:
  - ABC-046
  - N8-LANE
  - NFR-008
  - ADR-0019
  - src/command-input.test.ts
  - src/line-input.test.ts
  - plans/nfr-catalog.md
supersedes:
---

# `N8-LANE` at the re-hop: +3 rows, 0 files, 0 children, and the in-file charge is within 1 ms. Lane CPU was 20.68 s before and 20.07 s after at load 20–27, over 15 s both ways. Reported as non-conforming, not ruled

**NOT A STAMP, and NOT a conforming `ADR-0019` reading.** That needs n ≥ 7 interleaved runs, rotated,
with round 0 discarded and a null control. This sample is not that. `plans/nfr-catalog.md` was not
opened, and `NFR-008` is not ruled.

## Instrument

- `raw-rehop-nfr-harness.mjs.txt` runs `/usr/bin/time -p npx vitest run …` as one fresh process per
  run, and samples `sysctl -n vm.loadavg` before each run.
- CPU = user + sys.
- "Before" is the four touched files written back to `5d0fdb0`; "after" is `HEAD` (`85b66c6`).
- The two trees are **INTERLEAVED run by run** (B A, A B, B A, …), so each pair sees the same load.
- The harness restores `HEAD` in a `finally`, and `git status --short -- src` was **empty** afterwards.
- Raw output: `raw-rehop-nfr-lane-and-infile-run1.json.txt` (lane n = 3, plus a first in-file pass
  whose `tests` ms regex missed, so only CPU is usable from it) and `raw-rehop-nfr-infile-run2.json.txt`
  (in-file n = 7, with the regex fixed).

## In-file charge (n = 7 per tree, interleaved; 1-minute load 13.4–15.9)

| file | rows before → after | median vitest `tests` ms before → after | median process CPU before → after |
| --- | --- | --- | --- |
| `src/command-input.test.ts` | 131 → 133 | 26 → **25** | 1.48 s → 1.46 s |
| `src/line-input.test.ts` | 29 → 30 | 16 → **17** | 1.41 s → 1.39 s |

The two rows in `command-input.test.ts` and the one row in `line-input.test.ts` cost about 1 ms or
less. That is at the resolution of vitest's own counter, and the sign is noise.

## Whole-lane CPU (`npx vitest run --dir src`, n = 3 per tree, interleaved)

| run | tree | 1-min load | real | user | sys | CPU | counts |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | before | 20.67 | 5.54 | 18.65 | 2.03 | **20.68** | 42 / 1361 |
| 1 | after | 23.90 | 5.16 | 17.47 | 1.94 | **19.41** | 42 / 1364 |
| 2 | after | 26.15 | 5.82 | 18.03 | 2.04 | **20.07** | 42 / 1364 |
| 2 | before | 27.50 | 6.41 | 18.47 | 2.21 | **20.68** | 42 / 1361 |
| 3 | before | 25.13 | 5.63 | 18.76 | 1.99 | **20.75** | 42 / 1361 |
| 3 | after | 23.60 | 5.73 | 18.71 | 2.03 | **20.74** | 42 / 1364 |

- **Median CPU: before 20.68 s (range 20.68–20.75), after 20.07 s (range 19.41–20.74).**
- Every run exited 0 with the counts shown.
- Both trees read over 15 s in every run, including before the change. So the breach, if the bar is
  read this way, is the base's and not this diff's.
- The after-median sits 0.6 s *below* the before-median. That is load noise, not a saving: sibling
  hops were live and the 1-minute load was 20–27.

## `N8-LANE` counts

- **+3 rows**, all in existing files.
- **0 new test files.**
- **0 new child processes:** `src/cli.test.ts` is byte-identical, and the spawn pin stays
  `17 + 7 + 1 + 2`.
- `NFR-002` is untouched. `disarm` is one assignment per over-cap line and is off the per-ply path.
