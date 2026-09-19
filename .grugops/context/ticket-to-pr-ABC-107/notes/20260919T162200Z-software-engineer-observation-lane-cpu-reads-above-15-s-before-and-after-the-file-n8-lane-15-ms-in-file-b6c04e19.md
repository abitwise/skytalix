---
id: 20260919T162200Z-software-engineer-observation-lane-cpu-reads-above-15-s-before-and-after-the-file-n8-lane-15-ms-in-file-b6c04e19
kind: observation
by: software-engineer
at: 2026-09-19T16:22:00Z
verified_by:
confidence: medium
refs:
  - ABC-107
  - ABC-108
  - ABC-111
  - ADR-0019
  - ADR-0014
  - NFR-008
  - N8-LANE
  - src/frame.overflow-bound.test.ts
  - plans/nfr-catalog.md
supersedes:
---

# `NFR-008` at this hop: the lane reads ABOVE 15 s CPU both BEFORE and AFTER the new file — under load, at n = 3, NOT under the row's protocol — and `N8-LANE`'s in-file content is 15 ms

**NOT A STAMP, and NOT a conforming `ADR-0019` reading.** The subtask asked for `/usr/bin/time -p`,
≥ 3 runs, median, load average noted. That is what was run. `ADR-0019` trigger (a) requires the
row's own protocol (n ≥ 7 interleaved, rotated order, round 0 discarded, identity null control
≤ 1.5% at sign at chance). **This sample does not meet that protocol** and is reported as what it is.

## Instrument

`/usr/bin/time -p npx vitest run --dir src` spawned from a node script, one fresh OS process per
run, in the isolated worktree (`node_modules` symlinked to the main checkout), `os.loadavg()`
sampled before each run. CPU = user + sys. Machine: the same M3 / 8 cores as `ADR-0019`'s reading.
`ADR-0019`'s 14.940 s was taken at 1-min load 4.02–7.46; this sample's load is comparable but the
worktree, the symlinked `node_modules` and two live sibling hops are confounders it did not have.

## Before (tree `475d559`, 40 files / 1213 tests, no new file)

| run | load (1/5/15) | real | user | sys | CPU |
| --- | --- | --- | --- | --- | --- |
| 1 | 2.58 3.04 3.03 | 4.49 | 15.57 | 1.73 | **17.30** |
| 2 | 2.58 3.04 3.03 | 4.53 | 15.42 | 1.67 | **17.09** |
| 3 | 2.62 3.04 3.03 | 4.52 | 15.50 | 1.66 | **17.16** |

**Median CPU 17.16 s** (range 17.09–17.30). Counts asserted 40 / 1213 on every run.

## After (tree `a5a9178`, 41 files / 1238 tests, the new file in the lane)

| run | load (1/5/15) | real | user | sys | CPU |
| --- | --- | --- | --- | --- | --- |
| 1 | 3.35 3.33 3.16 | 4.51 | 15.02 | 1.68 | **16.70** |
| 2 | 5.25 3.73 3.30 | 4.28 | 14.84 | 1.61 | **16.45** |
| 3 | 6.03 3.91 3.36 | 4.20 | 15.13 | 1.66 | **16.79** |

**Median CPU 16.70 s** (range 16.45–16.79). Counts asserted 41 / 1238 on every run.

## What this says, and what it cannot

1. **Every one of the six runs reads above 15 s — including all three BEFORE the file existed.**
   At this hop's instrument the lane is 2.1–2.3 s over the owner's level with `ABC-107`'s file
   absent. The crossing is therefore NOT attributable to this ticket by this sample.
2. **The paired before→after delta is −460 ms** (after reads LOWER while a file was ADDED and load
   ROSE from 2.6 to 6.0). A negative delta on an added file is the instrument's noise floor, not an
   effect; the ~370 ms per-file floor the subtask names is inside that noise at n = 3.
3. **`N8-LANE`, the ticket's own charge:** the file's test content runs in **15 ms** (vitest
   in-file `tests` figure; standalone `collect 57 ms, transform 51 ms, duration 204 ms`). The
   runner's per-file floor is charged to `NFR-008`'s floor account (owner Architect/Design), not
   to the ticket. **≤ 650 ms: met on in-file content by two orders of magnitude; the whole-lane
   paired delta is unmeasurable at this n and load**, exactly as `plans/nfr-catalog.md` § `N8-LANE`
   predicts for a sub-noise change.
4. **Nothing was trimmed and nothing was folded into an existing file** to dodge the floor — the
   subtask forbids both, and the ticket's `A5` wants the fixtures named in their own right.

## Hand-up

The subtask's rule: "if the lane crosses 15 s, report `ADR-0019` trigger (a) and hand up."
**The 15 s level reads crossed in this sample, before and after alike.** Whether that is trigger
(a) is not this role's to decide — trigger (a) needs a conforming n ≥ 7 reading with a null
control at a named commit, and `ADR-0019` itself said "expect this trigger to fire on the next
ticket that adds a test file" and "a single run over 15 s is not that". The Orchestrator has the
numbers; the sized remedy `OPT-1` and `ABC-108` / `ABC-111` are where the lane question lives.
