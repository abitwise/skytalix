---
id: 20261011T085525Z-architect-design-observation-abc144-what-was-read-nothing-timed-222e288c
kind: observation
by: architect-design
at: 2026-10-11T08:55:25Z
verified_by:
confidence: high
refs:
  - ABC-144
  - ADR-0040
  - ADR-0008
  - ADR-0035
  - NFR-008
  - node_modules/vitest/dist/chunks/coverage.DfSpMS-b.js
  - node_modules/vitest/dist/node.js
  - node_modules/tinypool/dist/index.js
  - .grugops/context/design-ABC-144/probe/resolved-workers.mjs
  - .grugops/context/design-ABC-144/probe/lane144.mjs
supersedes:
---

# `ABC-144` design hop: what was read, and what was not measured

This note is hand-authored and unsealed. No `finding` is admissible on this install (`AGENTS.md`).
- **Worked against** the wave tip `629d83c2`, in a worktree on `grugops/design-ABC-144`.
- **No timing and no CPU reading of the lane was taken.** Two Engineer builds were running `npm test`. Every
  lane figure in this hop's notes and in `ADR-0040` is a recorded reading with its source, or a labelled
  projection.

## Reads that time nothing

**1. vitest 3.2.7 worker resolution** (`node_modules/vitest/dist/chunks/coverage.DfSpMS-b.js`):
- `:2745-2765`, `createThreadsPool`:
  - `threadsCount` is `availableParallelism() − 1` in run mode, and `floor(n / 2)` in watch mode;
  - `maxThreads = poolOptions.threads.maxThreads ?? config.maxWorkers ?? threadsCount`;
  - `minThreads = poolOptions.threads.minThreads ?? config.minWorkers ?? min(threadsCount, maxThreads)`;
  - `isolateWorkers` is on when `poolOptions.threads.isolate ?? true`.
- `:3586-3591`: `fileParallelism: false` forces max = min = 1.
- `:3719-3727`: **`VITEST_MAX_THREADS` / `VITEST_MAX_FORKS` in the environment overwrite `poolOptions`**, so
  they outrank the config file's `maxWorkers`.

**2. tinypool 1.1.1** (`node_modules/tinypool/dist/index.js`):
- `:523`: the constructor spawns `minThreads` workers eagerly.
- `:650` and `:694`: with `isolateWorkers`, every finished task removes its worker, and then
  `_ensureMinimumWorkers()` refills to `minThreads`.
- So each run boots workers that may never take a task. Today that is up to 7. Under a cap of 4 it is up
  to 4.

**3. The resolved configuration.** `probe/resolved-workers.mjs`, run in out-of-tree copies under the
scratchpad, `node_modules` symlinked. It reads the config and runs no test:

| copy | effectiveWorkers |
|---|---|
| base `vitest.config.ts` (wave tip) | **7** |
| base + `maxWorkers: 4,` | **4** |
| same, under `VITEST_MAX_THREADS=8` | **8**: the environment raises a config cap |
| base + cap, written as a plain object `satisfies ViteUserConfig`, with a type-only import | **4**: vitest loads the form |

- A direct `import("./vitest.config.ts")` of the plain-object form under Node v26.11.0 returned
  `{ maxWorkers: 4, pool: "threads" }`, with no run-time import.
- `tsc` on that form was **not run**: `UNKNOWN - verify` (the Engineer, `npm run typecheck`).

**4. Core topology.** `sysctl -n hw.perflevel0.physicalcpu hw.perflevel1.physicalcpu` → `4` / `4`, named
`Performance` / `Efficiency`. A hardware read, not a load reading.

**5. The `src/cli.test.ts` pins that the `A7` pin would sit beside:**
- `:1648`: `ABC-042` `A10`, `scripts.test` byte for byte;
- `:1838`: `N8_SPAWN` = 27;
- `:1842-1878`: `ABC-138`'s parser pin. It counts calls whose first argument names `child_process`, so an
  `import("../vitest.config.ts")` is outside it.

## The harness self-test

`probe/lane144.mjs` ran on a **stub** command (`node stub.js` writing a fake result file): 3 arms × 3 rounds.
- It checks that the result file is fresh and that counts are asserted.
- It parses `sysctl vm.loadavg`, `pmset -g therm` and `pmset -g batt`, and builds the summary.
- Its timings are of a stub and are **discarded, not recorded**.
- The R index rule was checked against `ADR-0035` decision 1: k = 1 / 2 / 2 / 2 / 3 / 3 / 3 / 4 at
  n = 7 … 14.

## Not touched

`src/`, `package.json`, `vitest.config.ts`, `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md`, and the
`ABC-144` page. Nothing was merged or pushed.
