---
id: 20261011T163112Z-software-engineer-observation-abc151-reds-counts-gates-d73145f6
kind: observation
by: software-engineer
at: 2026-10-11T16:31:12Z
verified_by:
confidence: high
refs:
  - ABC-151
  - ABC-144
  - ADR-0040
  - N8-LANE
  - NFR-008
  - src/cli.test.ts
  - vitest.config.ts
  - .grugops/context/ticket-to-pr-ABC-151/probe/plants.sh
  - .grugops/context/ticket-to-pr-ABC-151/probe/plants.out.tsv
supersedes:
---

# SE `ABC-151`: the pin's reds and greens, the resolved read, the counts and the gates. No timing was read

This note is hand-authored and unsealed. **No timing, CPU or heat reading was taken or recorded.** Other hops
were running (SE `ABC-149`, Architect `ABC-152`). The `A3`–`A5` window is Security/NFR's. Vitest's own duration
prints were ignored.

## Reds and greens (`A2`). Code commit `0035001c`

- **Method:** one fresh `git archive 0035001c` copy per arm, outside the repo, with `node_modules` linked. One
  change is applied, and its anchor must match exactly once. The pin runs once with
  `npx vitest run src/cli.test.ts -t "ABC-144"`. `resolved-workers.mjs` (`design-ABC-144/probe/`) is then run on
  the same copy under the same env, and the copy is deleted.
- **Script:** `../probe/plants.sh`. **Raw output:** `../probe/plants.out.tsv`.
- **Failed attempt, recorded:** r1's first try used a multi-line anchor, and `grep -cF` counted 120 lines, so the
  arm never ran. It was re-run with the single-line anchor `maxWorkers: 2,`. The committed script carries the
  fixed anchor.

| arm | change | pin | message | resolved |
|---|---|---|---|---|
| control | none | green, 1 passed / 67 skipped | — | eff 2, isolate true |
| r1 | delete `maxWorkers: 2` | **RED** | `expected undefined to be 2` | eff 7 |
| r2 | add `isolate: false` | **RED** | `expected false to be true` | isolate false |
| r3 | `VITEST_MAX_THREADS=8` | **RED** | `VITEST_MAX_THREADS: expected 8 to be less than or equal to 2` | eff 8 |
| r3b | `VITEST_MAX_THREADS=3` | **RED** | `VITEST_MAX_THREADS: expected 3 to be less than or equal to 2` | eff 3 |
| revert | `maxWorkers: 3` | **RED** | `expected 3 to be 2` | eff 3 |
| extra | `VITEST_MAX_FORKS=3` | RED | `VITEST_MAX_FORKS: expected 3 to be less than or equal to 2` | eff 2 (forks key, threads pool) |
| lower2 | `VITEST_MAX_THREADS=2` | green (as designed) | — | eff 2 |
| lower1 | `VITEST_MAX_THREADS=1` | green (as designed) | — | eff 1 |

r3b is red, so the stale `≤ 3` boundary is caught. r3 is red, so the worker sees the variable, and the env half
stays (`ADR-0040` d3's residual still does not apply).

## Resolved configuration (`A1`, test note 3)

`node .grugops/context/design-ABC-144/probe/resolved-workers.mjs`:
- head (worktree at `0035001c`): `pool: "threads", maxWorkers: 2, threadsMaxThreads: null, isolate: true,
  fileParallelism: true, envMaxThreads: null, effectiveWorkers: 2`;
- base (`git archive f439c8fd`): `maxWorkers: 3, isolate: true, effectiveWorkers: 3`.

At head, `vitest.config.ts`'s `test` keys are `pool: "threads"`, `maxWorkers: 2` and `exclude`. There is no
`isolate` key and no `poolOptions`.

## Counts (`A6`, `.test-results/last-run.json`, one `npm test` run each, exit 0)

| tree | files | tests | passed | failed | skipped/todo |
|---|---:|---:|---:|---:|---:|
| base `f439c8fd` | 56 | 1740 | 1740 | 0 | 0 |
| head `0035001c` | **56 = base** | **1740 = base** | 1740 | 0 | 0 |

- **A discarded reading.** The first base attempt failed at `ln` (an old `base/` directory left in the shared
  scratchpad). Its JSON was read from the main checkout's stale report, so it was thrown away. The table is the
  re-run on a fresh copy.
- **The `*.nfr` files:** all 7 `*.nfr.test.ts` files passed in the head run. That is ONE run, not `A6`'s 20-run
  screen, which is still owed.

## Gates at head

- lint (`biome check .`) 0; typecheck (`tsc --noEmit`) 0; build (`tsc --noEmit`) 0; `npm test` 0.
- **0 production lines:** `git diff --name-only f439c8fd 0035001c | grep -v '\.test\.ts$' | grep '^src/'` is
  empty. The diff touches `vitest.config.ts` and `src/cli.test.ts` only.
- **`N8-LANE`:** 0 test files, 0 tests and 0 spawns added.
