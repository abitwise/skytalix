---
id: 20260920T013500Z-software-engineer-observation-n8-lane-plus-4-ms-in-file-plus-one-child-nfr-008-lane-reads-18-58-s-before-20-29-s-after-under-load-non-conforming-2d8b6f74
kind: observation
by: software-engineer
at: 2026-09-20T01:35:00Z
verified_by:
confidence: medium
refs:
  - ABC-045
  - ABC-108
  - ABC-111
  - ADR-0019
  - ADR-0014
  - NFR-008
  - N8-LANE
  - src/command-input.test.ts
  - src/cli.test.ts
  - plans/nfr-catalog.md
supersedes:
---

# `N8-LANE` at this hop: +4 ms in-file and ONE child (~0.30 s process CPU), 0 new files; `NFR-008` CPU reads 18.58 s BEFORE and 20.29 s AFTER — both over 15 s, under sibling load, n = 3: REPORTED AS NON-CONFORMING, NOT RULED, NOTHING TRIMMED

**NOT A STAMP, and NOT a conforming `ADR-0019` reading.** The subtask asked for `/usr/bin/time
-p`, ≥ 3 runs, load noted, and said a > 15 s reading under load is REPORTED as non-conforming,
never ruled and never trimmed. That is what was run and this is what it says. `ADR-0019` trigger
(a) needs the row's own protocol (n ≥ 7 interleaved, rotated order, round 0 discarded, identity
null control ≤ 1.5%); **this sample does not meet it.** `plans/nfr-catalog.md` is NOT opened.

## Instrument

`/usr/bin/time -p npx vitest run --dir src` spawned from a node script (`raw-lane-harness.mjs.txt`),
one fresh OS process per run; `sysctl -n vm.loadavg` sampled before each. CPU = user + sys. Both
samples ran IN THE SAME WORKTREE — "before" on the untouched base tree (`bd40d85`, 42 / 1297)
before any edit was made, "after" on the tree that became `b8afa30` (42 / 1317). Three sibling hops
(`ABC-079` re-hop, `ABC-075`, `ABC-120`'s QE) were live. Raw: `raw-lane-before.json.txt`,
`raw-lane-after.json.txt`.

## Before (base `bd40d85`, 42 files / 1297 tests)

| run | load (1/5/15) | real | user | sys | CPU |
| --- | --- | --- | --- | --- | --- |
| 1 | 7.90 5.67 5.52 | 5.36 | 16.32 | 1.73 | **18.05** |
| 2 | 7.59 5.65 5.51 | 5.30 | 16.86 | 1.72 | **18.58** |
| 3 | 7.30 5.62 5.50 | 5.68 | 17.05 | 1.85 | **18.90** |

**Median CPU 18.58 s** (range 18.05–18.90). Counts asserted 42 / 1297 on every run.

## After (tip `b8afa30`, 42 files / 1317 tests)

| run | load (1/5/15) | real | user | sys | CPU |
| --- | --- | --- | --- | --- | --- |
| 1 | 5.62 5.80 5.71 | 6.15 | 17.62 | 1.99 | **19.61** |
| 2 | 5.73 5.82 5.72 | 5.75 | 18.66 | 1.97 | **20.63** |
| 3 | 10.00 6.70 6.03 | 5.76 | 18.34 | 1.95 | **20.29** |

**Median CPU 20.29 s** (range 19.61–20.63). Counts asserted 42 / 1317 on every run.

## `N8-LANE` — the ticket's own charge, per file (`raw-infile-*.json.txt`, n = 7 each, sequential, load 1-min 6.2–12.7)

| file | rows | median vitest `tests` ms | median file duration | median process CPU (user+sys) |
| --- | --- | --- | --- | --- |
| `src/command-input.test.ts` before | 79 | 17 | 247 ms | 1.46 s |
| `src/command-input.test.ts` after | 98 | **21** (+4) | 251 ms | 1.51 s (+0.05) |
| `src/cli.test.ts` before | 61 | 29 | 3000 ms | 5.96 s |
| `src/cli.test.ts` after | 62 | **29** (+0) | 3210 ms (+210 wall) | 6.26 s (+0.30) |

The 19 unit rows cost **+4 ms** of in-file test time. The one child (`A4`) does not show in the
in-file `tests` figure at all — `spawnSync` runs at module scope, i.e. at collect time — and shows
as **+0.30 s of process CPU** for the file, in line with the ~0.15–0.18 s per node child measured at
`ABC-043` / `ABC-115`. **0 new test files, 0 new modules, 0 new dependencies, 1 new child.**

## Clause state, in `ADR-0014` decision 4's form

- **Measured: `N8-LANE` ≈ +4 ms in-file + ~0.30–0.35 s process CPU for the one child, 0 files** —
  against the ticket's 650 ms bar, met on the number this ticket controls. The ticket priced the
  unit rows in "single-digit milliseconds" and that is what they cost; the child was not priced on
  the ticket (it names `N8-LANE` and no `N8-SPAWN` figure) and is reported, not netted.
- **`NFR-008` CPU: the lane reads OVER 15 s BEFORE this ticket's change exists** (18.58 s at
  load 7.3–7.9) **and after** (20.29 s at load 5.6–10.0). The before→after delta is +1.71 s at
  n = 3 under moving load; the per-file process figures attribute ~0.35 s of it to this diff and
  the rest is not attributable by this sample. The ticket's effective bar
  `min(650 ms, headroom re-measured at the delivery base)`: **the headroom at this base is
  NEGATIVE (−3.6 s at this instrument), so this delivery reads as a lane breach that is the base's,
  REPORTED AS NON-CONFORMING, not ruled, nothing trimmed.** Same shape as `ABC-120` (17.88 s /
  18.25 s), `ABC-107`, `ABC-034` on 2026-09-19.
- Wall: 5.30–6.15 s, REPORTED, NOT RULED (`ABC-111`).
- `src/cli.test.ts`'s own three-clause cap (`ABC-115`'s: ≤ 7 added children, ≤ 2.0 s added wall,
  ≤ 0.30 s CPU per added child): 1 child, +0.21 s wall, ~0.30 s CPU — at the edge of the third
  clause at n = 7 unpaired; reported, not claimed met.
- **Nothing was trimmed, folded, skipped or made opt-in** to move any of these numbers.

## Hand-up

Whether these readings are `ADR-0019` trigger (a) is not this role's to decide. The Orchestrator
holds four sibling samples from today saying the same thing about the base; `OPT-1`, `ABC-108` and
`ABC-111` are where the lane question lives.
