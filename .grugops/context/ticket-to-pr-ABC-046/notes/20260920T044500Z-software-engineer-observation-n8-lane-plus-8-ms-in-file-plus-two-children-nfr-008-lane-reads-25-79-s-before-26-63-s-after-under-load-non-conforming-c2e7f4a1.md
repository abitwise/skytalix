---
id: 20260920T044500Z-software-engineer-observation-n8-lane-plus-8-ms-in-file-plus-two-children-nfr-008-lane-reads-25-79-s-before-26-63-s-after-under-load-non-conforming-c2e7f4a1
kind: observation
by: software-engineer
at: 2026-09-20T04:45:00Z
verified_by:
confidence: medium
refs:
  - ABC-046
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

# `N8-LANE` at this hop: +8 ms in-file and TWO children, 0 new files; `NFR-008` CPU reads 25.79 s BEFORE and 26.63 s AFTER — both over 15 s, under sibling load, n = 3: REPORTED AS NON-CONFORMING, NOT RULED, NOTHING TRIMMED

**NOT A STAMP, and NOT a conforming `ADR-0019` reading.** The subtask asked for `/usr/bin/time
-p`, ≥ 3 runs, load noted, and said a > 15 s reading under load is REPORTED as non-conforming,
never ruled and never trimmed. That is what was run and this is what it says. `ADR-0019` trigger
(a) needs the row's own protocol (n ≥ 7 interleaved, rotated order, round 0 discarded, identity
null control ≤ 1.5%); **this sample does not meet it.** `plans/nfr-catalog.md` is NOT opened.

## Instrument

`/usr/bin/time -p npx vitest run --dir src` spawned from a node script (`raw-lane-harness.mjs.txt`),
one fresh OS process per run; `sysctl -n vm.loadavg` sampled before each. CPU = user + sys. Both
samples ran IN THE SAME WORKTREE — "before" on the untouched base tree (`d1d431f`, 42 / 1325)
before any edit was made, "after" on the tree that became `6cdde15` (42 / 1361). Two sibling
hops (`ABC-079` re-hop and one more) were live; the 1-minute load ran 6.8–14.0 across the six
runs. Raw: `raw-lane-before.json.txt`, `raw-lane-after.json.txt`.

## Before (base `d1d431f`, 42 files / 1325 tests)

| run | load (1/5/15) | real | user | sys | CPU |
| --- | --- | --- | --- | --- | --- |
| 1 | 6.77 6.97 6.86 | 8.33 | 23.19 | 2.60 | **25.79** |
| 2 | 8.55 7.36 7.00 | 7.59 | 22.99 | 2.51 | **25.50** |
| 3 | 8.35 7.34 7.00 | 7.49 | 23.48 | 2.49 | **25.97** |

**Median CPU 25.79 s** (range 25.50–25.97). Counts 42 / 1325 on every run (the harness's `ok`
column reads `HARNESS_ERROR` on these three because it was handed the subtask's 1317 as the
expected count; every run exited 0 with 42 / 1325 — the expectation was wrong, not the run).

## After (tip `6cdde15`, 42 files / 1361 tests)

| run | load (1/5/15) | real | user | sys | CPU |
| --- | --- | --- | --- | --- | --- |
| 1 | 7.20 6.62 6.51 | 7.51 | 24.00 | 2.63 | **26.63** |
| 2 | 9.12 7.05 6.67 | 8.63 | 24.58 | 2.75 | **27.33** |
| 3 | 14.00 8.10 7.04 | 7.73 | 22.78 | 2.41 | **25.19** |

**Median CPU 26.63 s** (range 25.19–27.33). Counts asserted 42 / 1361 on every run.

## `N8-LANE` — the ticket's own charge, per file (`raw-infile-*.json.txt`, n = 7 each, sequential)

| file | rows | median vitest `tests` ms | median file duration | median process CPU (user+sys) | 1-min load during |
| --- | --- | --- | --- | --- | --- |
| `src/command-input.test.ts` before | 98 | 28 | 341 ms | 1.86 s | 8.4–8.7 |
| `src/command-input.test.ts` after | 131 | **36** (+8) | 388 ms | 1.98 s (+0.12) | 8.4–8.9 |
| `src/cli.test.ts` before | 62 | 51 | 5270 ms | 8.60 s | **12.1–21.0** |
| `src/cli.test.ts` after | 65 | **42** | 4910 ms | 8.64 s (+0.04) | 9.3–14.4 |

"Before" for the two files was measured in a scratch copy of the tree with the four files at
`d1d431f` (`raw-infile-harness.mjs.txt`; the copy is outside the repository and was discarded),
"after" in the worktree at `6cdde15`. **The `src/cli.test.ts` pair is NOT a clean reading:** the
"before" sample ran while the 1-minute load climbed from 12 to 21 (a sibling hop's lane run), the
"after" sample at 9–14, and the sign of the `tests` ms delta (−9) is that load, not this diff. Its
process-CPU delta (+0.04 s) is likewise inside the noise; the two children were priced at
`ABC-043` / `ABC-115` at ~0.15–0.18 s of CPU each (collect-time `spawnSync`), so ~+0.3–0.35 s is
the expected charge and the sample cannot resolve it. The `src/command-input.test.ts` pair ran at
matched load and is believed: **+8 ms** of in-file test time for 33 unit rows.

## Clause state, in `ADR-0014` decision 4's form

- **Measured: `N8-LANE` ≈ +8 ms in-file + two children (expected ~0.3–0.35 s process CPU, not
  resolved by this sample), 0 files** — against the ticket's 650 ms bar, met on the number this
  ticket controls. The children were not priced on the ticket (it names `N8-LANE` and no
  `N8-SPAWN` figure) and are reported, not netted.
- **`NFR-008` CPU: the lane reads OVER 15 s BEFORE this ticket's change exists** (25.79 s at load
  6.8–8.6) **and after** (26.63 s at load 7.2–14.0). The before→after delta is +0.84 s at n = 3
  under moving load. The ticket's effective bar `min(650 ms, headroom re-measured at the delivery
  base)`: **the headroom at this base is NEGATIVE (−10.8 s at this instrument), so this delivery
  reads as a lane breach that is the base's, REPORTED AS NON-CONFORMING, not ruled, nothing
  trimmed.** Same shape as `ABC-120` (17.88 / 18.25 s) and `ABC-045` (18.58 / 20.29 s) on
  2026-09-19 — and NOTE the level: this base reads ~7 s higher than `ABC-045`'s base did ONE
  merge earlier, at comparable load; `git diff --stat d13fb1f d1d431f -- src/` is empty, so
  nothing under `src/` changed between them. Either the host was busier (the 5-minute load was
  ~7 throughout, vs ~5.7 at `ABC-045`) or the sibling `ABC-079` re-hop's search work is
  contending harder; this sample cannot tell which. Handed up as a number, not a diagnosis.
- Wall: 7.49–8.63 s, REPORTED, NOT RULED (`ABC-111`).
- `src/cli.test.ts`'s own three-clause cap (`ABC-115`'s: ≤ 7 added children, ≤ 2.0 s added wall,
  ≤ 0.30 s CPU per added child): 2 children; the wall and CPU deltas are inside this sample's
  noise (see above); reported, not claimed met.
- **Nothing was trimmed, folded, skipped or made opt-in** to move any of these numbers.

## Hand-up

Whether these readings are `ADR-0019` trigger (a) is not this role's to decide. The Orchestrator
now holds five sibling samples saying the same thing about the base; `OPT-1`, `ABC-108` and
`ABC-111` are where the lane question lives.
