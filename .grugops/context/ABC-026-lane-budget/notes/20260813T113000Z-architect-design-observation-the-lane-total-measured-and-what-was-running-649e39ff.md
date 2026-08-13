---
id: 20260813T113000Z-architect-design-observation-the-lane-total-measured-and-what-was-running-649e39ff
kind: observation
by: architect-design
at: 2026-08-13T11:30:00Z
verified_by:
confidence: high
refs:
  - ABC-026
  - ABC-026-A1
  - H5
  - NFR-008
  - ADR-0008
  - plans/nfr-catalog.md
  - 06c5427
supersedes:
---

# `A1`: the lane total, MEASURED. **Wall 2.210 s ≤ 3 s MET. CPU 10.390 s ≤ 13 s MET. `H5` is discharged.**

**This is an `observation`, not a `finding`, and the reason is structural rather than modest.** There is
no `§14-gate` verdict on this hop and no `human:<name>` grant, so no verification stamp exists and none
was invented. **The substrate gap is re-verified rather than inherited, for the sixth consecutive hop
on this install:** `scripts/` does not exist in this repository, there is no `context-io.*` and no
`claim.*` anywhere in the repository or in the kit at `/Users/olgeroeselg/.grugops/agent-factory`, and
`mcp__grugops__*` is not in this session's tool set. Workflow 16's stop condition is live. These notes
are hand-written into `notes/` in the `agent-factory/contracts/context-note.md` format; `index.md` /
`index.jsonl` do not exist for this task. The queue claim was taken by hand with an atomic
`mkdirSync(".grugops/queue/claimed/ABC-026-lane-budget")` per Workflow 17 step 2. Owner:
**Orchestrator**.

## The instrument, and what makes a run a datum

`npm test`, **`PERFT_DEEP` unset** (deleted from the child environment, not merely absent), `/usr/bin/time -p`,
wall (`real`) and CPU (`user + sys`) recorded separately and **never blended**. **Interleaved, condition
order rotated every round, round 0 discarded as warm-up, one fresh OS process per run, n = 8 usable
rounds per condition per sample.**

**Every run asserts its own tree state BEFORE it runs and its own counts AFTER.** The tree-state
assertion checks the presence, absence and exact content hash of `vitest.config.ts` against the run's
label and counts `src/*.test.ts`; the count assertion checks `28/28` test files and `807/807` tests. **A
run whose tree state or counts are not what its label claims is a harness error and never a datum.**
**135 recorded runs across four suites, 0 harness errors.**

Measured at `main` = **`06c5427`**, on branch `grugops/ABC-026-lane-budget` in a separate worktree.
**Machine: Apple M3 (Mac15,13), 8 logical cores, Darwin 25.5.0 arm64, Node v24.12.0, npm 11.7.0,
vitest 3.2.7** — matches `NFR-008`'s named reference machine exactly, verified rather than assumed.
`UNKNOWN - verify` on any other hardware.

## The reading

```
n = 8 usable rounds per condition per sample, interleaved       WALL          CPU (user+sys)
sample A   in-worktree, loadavg median 9.83                   2.210 s        10.390 s
             spread                                        1.880-2.970    10.070-11.590
sample B   in-worktree, loadavg median 7.65                   1.845 s         9.975 s
             spread                                        1.770-2.050     9.660-10.340
sample C   out-of-tree copy, cmp-verified byte-identical       1.935 s        10.315 s

NFR-008 wall <= 3 s   ->  MET on all three.  Worst median 2.210 s = 73.7% of the clause.
NFR-008 CPU  <= 13 s  ->  MET on all three.  Worst median 10.390 s = 79.9% of the clause.
```

**Said plainly rather than flattered: individual RUNS reached 2.97 s and 3.02 s under load.** The
clause binds the **median** and the median is MET with margin on every sample — **and a single run was
never a reading of this row.** The Orchestrator's baseline `1.59 s` single run is confirmed as a
*plausible single run* (my own gate run read 1.52 s wall / 8.93 s CPU on the delivered tree) and it is
**not** a median; the brief was right to forbid quoting it as one.

## **THE CPU CLAUSE BINDS FIRST, and this hop measured it rather than inheriting the ruling**

```
                     identity null control      signal for +2 test files
CPU                  +0.48%   sign 5/8          +3.49%   sign 7/8      <- resolves
WALL                 +3.88%   sign 6/8          +1.81%   sign 5/8      <- does NOT
```

**The wall clock's null control is LARGER than its own signal for two added test files.** In absolute
terms the wall null read **+75 ms** and the two-file wall delta read **+35 ms** — the instrument reads
*nothing* as more expensive than *something*. CPU's null is ~7x smaller than its two-file signal.
**This independently re-derives `ADR-0008` Decision 3 and Alternative D from new data**, and it is the
second route the 2026-08-12 architecture audit did not have.

## **WHAT WAS RUNNING WHILE I MEASURED — part of the measurement**

Two other agents were live on this machine throughout: an `ABC-021` build in a sibling worktree and a
markdown-only refinement cut. Also Chrome, Docker Desktop's VM, VS Code and iTerm2.

```
1-min load average immediately before a run   min 3.23   median 10.56   max 35.90   (8 cores)
runs starting above the core count            98 of 135
a SIBLING worktree's vitest directly observed  2 of 135
```

The two contended runs were `npm exec vitest run src/turn-loop.test.ts src/turn-loop.nfr.test.ts` —
**`ABC-021`'s own lane, identified by its command line, not guessed.** Both fell in the `pool: "threads"`
slope sweep: **one was the discarded warm-up round (never a datum) and the other landed at the TOP of
its condition's range, so it does not move that condition's median of 8.** **Neither lane-total sample
(A or B) nor the per-file floor sweep observed a sibling vitest at all.**

**The honest reading of the contention: it pushes the absolutes UP, and both clauses are MET anyway.**
This is therefore a conservative measurement, not a flattering one. Two prior hops declined this
measurement because a live QE hop shared the cores; **that caution was right, and the correct response
was to record the load per run rather than to wait for a quiet machine that this project does not
have.**

## Disclosed deviations

- **`node_modules` was SYMLINKED** from the sibling `cli-chess-example` worktree. `NFR-008`'s named
  environment assumes an installed tree; a symlink is a deviation from it. It affects module
  *resolution* rather than execution, it is the same deviation the delivery audit disclosed, and the
  symlink was removed before this hop finished.
- **Absolutes are session properties.** `plans/nfr-catalog.md` records the same tree drifting **+22%
  inside one hour** under load. Ratios replicate; absolutes do not. Every figure above carries its
  machine.
