---
id: 20261011T104858Z-software-engineer-observation-abc144-reds-counts-gates-5b9e2d31
kind: observation
by: software-engineer
at: 2026-10-11T10:48:58Z
verified_by:
confidence: high
refs:
  - ABC-144
  - ADR-0040
  - N8-LANE
  - NFR-008
  - src/cli.test.ts
  - vitest.config.ts
supersedes:
---

# SE `ABC-144`: the pin's reds, the counts and the gates. No timing was read

**No timing or CPU reading was taken or recorded at this hop.** Window B owns those. Lane cost: **not graded**.
Vitest's own duration prints were ignored.

## Reds on a scratch copy (`npx vitest run src/cli.test.ts -t "ABC-144"`, one run each)

The scratch copy was the build tree, copied out of tree with `node_modules` linked, and deleted afterwards.
The control on the unmodified copy was green, 1 passed and 67 skipped.

| arm | change | result | assertion message |
|---|---|---|---|
| r1 | delete `maxWorkers: 3` | **RED** | `expected undefined to be 3` |
| r2 | add `isolate: false` | **RED** | `expected false to be true` |
| r3 | `VITEST_MAX_THREADS=8` | **RED** | `VITEST_MAX_THREADS: expected 8 to be less than or equal to 3` |
| r3b | `VITEST_MAX_THREADS=4` | **RED** | `VITEST_MAX_THREADS: expected 4 to be less than or equal to 3` |
| x1 | `maxWorkers: 4` | RED | `expected 4 to be 3` |
| x2 | add `fileParallelism: false` | RED | `expected false to be true` |
| x3 | add `poolOptions: { threads: { maxThreads: 8 } }` | RED | `expected { threads: { maxThreads: 8 } } to be undefined` |
| x4 | `VITEST_MAX_FORKS=8` | RED | `VITEST_MAX_FORKS: expected 8 to be less than or equal to 3` |
| lower | `VITEST_MAX_THREADS=2` | green (as designed: the env may lower the cap) | — |

The worker sees the env variable, so the env half of the pin stays (`ADR-0040` d3's residual does not apply).

## Resolved configuration (`A2`, test note 4)

`node .grugops/context/design-ABC-144/probe/resolved-workers.mjs` at head reads:
`pool: "threads", maxWorkers: 3, threadsMaxThreads: null, isolate: true, fileParallelism: true,
envMaxThreads: null, effectiveWorkers: 3`.

## Counts (`A6`, JSON report `.test-results/last-run.json`, one `npm test` run each, exit 0)

| tree | files | tests | passed | failed | skipped |
|---|---:|---:|---:|---:|---:|
| base `5ed308a8` | 55 | 1728 | 1728 | 0 | 0 |
| head (code commit) | **55 = base** | **1729 = base + 1** | 1729 | 0 | 0 |

Every `*.nfr.test.ts` file passed in the head run, because the whole run passed. This is ONE run. It is not
`A6`'s 20-run screen, which is still owed (QE or Security/NFR).

## Gates at head

lint (`biome check .`) 0; typecheck (`tsc --noEmit`) 0; build 0; `npm test` 0.
0 production `src/` lines: the diff touches `vitest.config.ts` and `src/cli.test.ts` only.
Spawns: 0 added. The pin is an in-process `import()` of a config file, and `N8_SPAWN` stays 27.
