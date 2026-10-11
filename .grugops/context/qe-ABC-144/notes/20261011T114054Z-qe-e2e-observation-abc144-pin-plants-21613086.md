---
id: 20261011T114054Z-qe-e2e-observation-abc144-pin-plants-21613086
kind: observation
by: qe-e2e
at: 2026-10-11T11:40:54Z
verified_by:
confidence: high
refs:
  - ABC-144
  - ADR-0040
  - ADR-0008
  - QE-144-a
  - QE-144-b
  - QE-144-c
  - src/cli.test.ts
  - vitest.config.ts
  - 20261011T104858Z-software-engineer-observation-abc144-reds-counts-gates-5b9e2d31
supersedes:
---

# QE `ABC-144`: the `A7` pin re-planted. All 8 SE reds reproduce. Of QE's 11 extras, 7 go red and 4 survive (three routes, all INFO)

This note is hand-authored and unsealed. Every row was RUN by QE on 2026-10-11. Each plant ran on a
fresh `git archive d675ef42` copy outside the repository, with `node_modules` linked and one change
applied. Each change was checked to hit its anchor exactly once. The command was
`npx vitest run src/cli.test.ts -t "ABC-144"`. The `eff` column is the Architect's
`resolved-workers.mjs` run on the same copy under the same environment. **No timing was read.**
Script and raw output: `../probe/plants.mjs`, `../probe/plants.out.tsv`.

## The SE's plants, re-planted by QE (`ADR-0040` d3 + addendum r1, r2, r3, r3b; SE extras x1–x4)

| id | change | pin | message | resolved |
|---|---|---|---|---|
| control | none | green, 1 passed / 67 skipped | — | eff 3, isolate true |
| r1 | delete `maxWorkers: 3` | **RED** | `expected undefined to be 3` | eff 7 |
| r2 | add `isolate: false` | **RED** | `expected false to be true` | isolate false |
| r3 | `VITEST_MAX_THREADS=8` | **RED** | `VITEST_MAX_THREADS: expected 8 to be less than or equal to 3` | eff 8 |
| r3b | `VITEST_MAX_THREADS=4` | **RED** | `… expected 4 to be less than or equal to 3` | eff 4 |
| x1 | `maxWorkers: 4` | RED | `expected 4 to be 3` | eff 4 |
| x2 | add `fileParallelism: false` | RED | `expected false to be true` | eff 1 |
| x3 | add `poolOptions.threads.maxThreads: 8` | RED | `expected { threads: { maxThreads: 8 } } to be undefined` | eff 8 |
| x4 | `VITEST_MAX_FORKS=8` | RED | `VITEST_MAX_FORKS: expected 8 to be …` | eff 3 |
| lower | `VITEST_MAX_THREADS=2` | green (as designed) | — | eff 2 |
| lower3 | `VITEST_MAX_THREADS=3` (the boundary) | green (as designed) | — | eff 3 |

Every message matches the SE's table (`…5b9e2d31`). r3 is red, so the worker sees the variable, and
`ADR-0040` d3's residual does not apply. The env half stays.

## QE's own plants

| id | change | pin | what it shows |
|---|---|---|---|
| q1 | `pool: "forks"` | RED | `expected 'forks' to be 'threads'` |
| q2 | `maxWorkers: "50%"` | RED | `expected '50%' to be 3`. The core-scaling form `A2` refuses is caught |
| q3 | `maxWorkers: 2` | RED | `expected 2 to be 3`. A lowering is a ruling too (the pin's comment) |
| q4 | `poolOptions.threads.isolate: false` | RED | `poolOptions` must be undefined |
| q5 | `projects: [{ extends: true, test: { name: "p", isolate: false } }]` | **green: survives** | `QE-144-a` |
| q5b | the same with `poolOptions.threads.isolate: false` in the project | **green: survives** | `QE-144-a` |
| q6 | add `minWorkers: 8` | RED, the whole run | `RangeError: options.minThreads and options.maxThreads must not conflict` (tinypool 1.1.1). Loud, not a silent raise |
| q7 | `VITEST_MIN_THREADS=8` | RED, the whole run | the same `RangeError` |
| q8 | `VITEST_MAX_THREADS=abc` | RED, the whole run | `RangeError: Invalid array length` |
| q9 | `--maxWorkers=8` on the narrow-set command line | **green: survives** | `QE-144-b` |
| q10 | `maxWorkers: process.env.VITEST_WORKER_ID ? 3 : 8` | **green: survives** | `QE-144-c` (adversarial) |

## The `projects` survivors are inert at runtime on vitest 3.2.7

- **Config level.** Under q5, `createVitest` resolves one project, `p`, which collects all 55 specs
  with `isolate: false` (`../probe/projects-probe.mjs`). The pin cannot see it, because it reads only
  the root `lane.test`.
- **Runtime.** QE added three one-test files that each increment a `globalThis` counter, and ran them
  under one worker (`VITEST_MAX_THREADS=1`, and again with `--maxWorkers=1`).
  - With the control, q5 and q5b, every file read **1, 1, 1**: isolated.
  - With r2 (top-level `isolate: false`), the files read **1, 2, 3**: shared. That proves the probe can
    see a leak.
  - The reason, from the source: `createThreadsPool` reads `isolate` from the ROOT config's
    `poolOptions.threads` (`vitest/dist/chunks/coverage.DfSpMS-b.js:2747`, `:2761`), not from the
    project.
- So the route is closed today by vitest's own behaviour, not by the pin. A vitest bump can open it.
  Logged as INFO `QE-144-a`, with that trigger.

## Not added

QE added no test. The scratch copies were deleted. No plant touched the worktree.
