# design-ABC-152-owner-route: readings as run (2026-10-11, Architect/Design)

**Correctness and source reads only. No wall, CPU or duration was read or recorded.**

## The scratch trees (session scratchpad, outside the repository)

| tree | content | node_modules |
|---|---|---|
| `v41off` | `git archive main` (`f11afad8`: `ABC-149` and `ABC-151` merged, `maxWorkers: 2`); `package.json` devDependencies `vitest ~4.1.11`, `@vitest/coverage-v8 ~4.1.11`, `vite ~7.3.6`; `npm install --ignore-scripts`; plus `experimental: { viteModuleRunner: false }` (`runner-off-key.diff`) | its own: vitest 4.1.11, coverage-v8 4.1.11, vite 7.3.6 (`npm ls` exit 0) |
| `a2/*`, `a20/*`, `gm/v41-*`, `pin/*` | copies of `v41off`'s `src/` + config, one change each | symlink to `v41off`'s |
| `gm/base-*` | `v41off`'s `src/` with **main's** `vitest.config.ts` and `package.json` | symlink to the main checkout's (vitest 3.2.7) |

This repository's `package.json` and lockfile were not touched.

## R1. `VITEST_MAX_WORKERS` resolution on 4.1.11 (`resolved-workers-v4.mjs` from `design-ABC-152/probe/`, in `v41off`)

Source: `vitest/dist/chunks/coverage.DM_a_rWm.js:380`:
`if (process.env.VITEST_MAX_WORKERS) resolved.maxWorkers = Number.parseInt(process.env.VITEST_MAX_WORKERS);`
and `cli-api.CnMVyzaz.js:3832` `resolveMaxWorkers`: `if (project.config.maxWorkers) return …; if (root maxWorkers) return …; return max(cpus - 1, 1)`.

| `VITEST_MAX_WORKERS` | resolved `maxWorkers` | effective |
|---|---|---|
| unset | 2 | 2 |
| `""` | 2 | 2 (ignored: falsy) |
| `1` / `2` | 1 / 2 | 1 / 2 |
| `3` / `8` | 3 / 8 | **3 / 8** |
| `0` | 0 | **7** (falsy, falls back to cpus − 1) |
| `abc` | NaN | **7** (falsy) |
| `0x3` / `0x8` | 3 / 8 | **3 / 8** (no radix: hex parses) |
| `" 3"` / `3abc` | 3 / 3 | **3** |
| `2.9` / `1e1` | 2 / 1 | 2 / 1 |
| `-1` | −1 | −1: **`vitest run` exits 0 and runs no test** (full lane, and a one-file run) |

With `-1` the one-file run's result file read `success: false`, `runState: "exited"`, `exitCode: 0`, and no counts.

## R2. `vi.resetModules()` and a query-string import (`fresh/`, runner off and on, `maxWorkers: 1`)

| | runner off | runner on |
|---|---|---|
| `vi.resetModules()` then `import("./dep.ts")` | **same instance** | new instance |
| `import("./dep.ts?run=0")` vs `?run=1` | new instance; load-time `Math.random()` differs; module counter restarts at 1 | the same |
| `import("./dep2.ts?run=0")` vs `?run=1`, where `dep2` imports `dep` | new `dep2`; **`dep` shared** (its salt is equal) | the same |

## R3. `src/book.test.ts` ABC-094 A2 (runner off, `-t "ABC-094 A2"`)

Plant (`a2-plant-book.diff`): a load-time `const LOAD_SALT = Math.random()` in `src/book.ts`, mixed into the draw.

| A2 form | no plant | plant |
|---|---|---|
| as is (`vi.resetModules(); await import("./book.ts")`) | 1 passed | **1 passed: blind** |
| query form (`a2-query-form.diff`: ``await import(`./book.ts?abc094-a2=${run}`)``) | 1 passed | **1 failed** |

`tsc --noEmit` on the query-form tree: the only error is `src/cli.test.ts(3406,17): TS2339 Property 'poolOptions' does not exist on type 'InlineConfig'` (the pre-existing pin, on 4.1.11's types; see R6). `biome check src/book.test.ts`: clean.

## R4. `src/san.test.ts` A20 (runner off, `-t "A20"`)

| form | plant | result |
|---|---|---|
| as is: `expect(Object.keys(namespace)).toEqual(["toSan", "parseSan"])` | none | **failed**: `expected [ 'parseSan', 'toSan' ] to deeply equal [ 'toSan', 'parseSan' ]` |
| sorted (`a20-sorted-form.diff`): `expect(Object.keys(namespace).sort()).toEqual(["parseSan", "toSan"])` | none | passed |
| sorted | `export const PLANT = 1;` added to `san.ts` | **failed**: `[ 'PLANT', 'parseSan', 'toSan' ]` |
| sorted | `export { toSan as toSanX };` added | **failed**: `[ 'parseSan', 'toSan', 'toSanX' ]` |

## R5. `src/glyph-mode.nfr.test.ts` (`NFR-007`, zero-count guards on Node built-ins), whole file

R4 form (`nfr007-r4-form.diff`): the four top-level `const {…} = await import(p)` become static imports. Plants (`nfr007-plants.diff`) add one I/O call as the first statement of `selectGlyphMode`.

| tree | plant | result |
|---|---|---|
| base 3.2.7 | none | 3 passed |
| base 3.2.7 | `import { existsSync } from "node:fs"` + call | **1 failed**: `existsSync … +0 times, but got 9 times` |
| 4.1.11 off, as is | `existsSync` | **loud**: `[Function readFileSync] is not a spy` |
| 4.1.11 off, R4 | none | 3 passed |
| 4.1.11 off, R4 | `existsSync` (named import) | **1 failed**: `got 9 times` |
| 4.1.11 off, R4 | `access` from `node:fs/promises` | **1 failed**: `got 9 times` |
| 4.1.11 off, R4 | `spawnSync` from `node:child_process` | **1 failed**: `got 9 times` |
| 4.1.11 off, R4 | `import * as fs from "node:fs"`; `fs.existsSync` | **1 failed**: `got 9 times` |

## R6. The re-armed pin (`pin-prototype.diff`), 4.1.11 runner off, `npx vitest run src/cli.test.ts -t "ABC-144 A7|ABC-152 V3"`

`tsc --noEmit` on `v41off` with the prototype: exit 0. `biome check src/cli.test.ts`: exit 0, one info, `lint/correctness/useParseIntRadix` (an *unsafe* fix: "Add a radix of 10").

| plant | result | message |
|---|---|---|
| control | 2 passed | — |
| r1: delete `maxWorkers: 2` | **red** | `expected undefined to be 2` |
| r2: add `isolate: false` | **red** | `expected false to be true` |
| r4: add `projects: [{ test: { maxWorkers: 8, … } }]` | **red** | `expected [ { test: … } ] to be undefined` |
| `maxWorkers: 3` | **red** | `expected 3 to be 2` |
| `fileParallelism: false` | **red** | `expected false to be true` |
| `poolOptions: { threads: { maxThreads: 8 } }` | **red** | `expected true to be false` |
| V3: delete `experimental.viteModuleRunner` | **red** | `expected undefined to be false` |
| V3: `viteModuleRunner: true` | **red** | `expected true to be false` |
| env `VITEST_MAX_WORKERS=8` / `3` | **red** | `expected 8 / 3 to be less than or equal to 2` |
| env `0x3` / `0x8` (`QE-151-a`) | **red** | `expected 3 / 8 to be less than or equal to 2` |
| env `0` / `abc` | **red** | `expected 0 / NaN to be greater than or equal to 1` |
| env `" 3"` / `3abc` | **red** | `expected 3 to be ≤ 2` |
| env `""` (`QE-151-b`) | green | — (vitest ignores it too) |
| env `1` / `2` | green | — |
| env `VITEST_MAX_THREADS=8` | green | inert on 4.x (resolves 2) |
| env `-1` | **no test runs; exit 0** | see R1 |

## R7. `nodeLoader: false` with the runner off (`nl/`)

| `experimental.nodeLoader` | result |
|---|---|
| default (`true`) | a `{ spy: true }` automock counts 2 calls made through an importer: passed |
| `false` | **loud**: `Vitest mocker was not initialized in this environment. vi.queueMock() is forbidden.`, no tests |

## R8. The reporter route (`rep/`), 4.1.11 runner off, one file

`JsonReporter.onTestRunEnd(testModules)` calls `writeReport` once (`index.UpGiHP7g.js`). vitest calls
`report("onTestRunEnd", modules, [...errors], state)` (`cli-api.CnMVyzaz.js:12674`).
`r.js` = the current reporter with `onFinished` replaced by `onTestRunEnd(testModules, unhandledErrors, reason)`,
plus a load-time check that `writeReport` and `onTestRunEnd` are functions (`rep/reporter-route.diff`).

| plant | reporter | runs | exit | `success` | `unhandledErrors` | console names it |
|---|---|---|---|---|---|---|
| none | current / `r.js` | 1 / 1 | 0 / 0 | true / true | [] / [] | — |
| `unh` (ABC-149's example: `setTimeout(() => throw, 0)`, test returns at once) | current | 5 | **1, 0, 0, 0, 1** | false ×2, true ×3 | [] ×5 | 0 on each exit-0 run; 2 on the exit-1 run whose console was kept (the first run's was not kept) |
| `unh` | `r.js` | 5 | **0, 1, 0, 1, 1** | true ×2, false ×3 | **["PLANT-timer"]** on every exit-1 run | 0 on each exit-0 run whose console was kept; 2 on every exit-1 run |
| `unhw` (the same throw; the test awaits a 50 ms timer) | current | 6 | 1 ×6 | false ×6 | **[] ×6** | 2 ×6 |
| `unhw` | `r.js` | 6 | 1 ×6 | false ×6 | **["PLANT-timer"] ×6** | 2 ×6 |

So on 4.1.11 with the runner off, ABC-149's unhandled example is a **race**: the file's worker can be stopped
before the timer fires, and then vitest sees nothing (exit 0): 5 of 10 runs, across both reporters. The awaited
form is deterministic (12 of 12 exit 1).

## R9. `QE-149-a`: the READ IT query pasted with its line breaks (comment prefixes stripped), on R8's `unhw` + `r.js` file

| wrap | result |
|---|---|
| today's (`.test-results/last-run.json` on its own comment line) | `jq` blocks reading stdin (stopped with SIGTERM); then `.test-results/last-run.json: Permission denied` (the path runs as a command) — `QE-149-a` reproduced |
| `rep/readit-rewrap.txt` (the path moved onto the line with the closing `'`; no other byte of the query changed) | `error  PLANT-timer` and `run    exited exitCode=1`, exit 0: the unhandled row's two lines, by content |

## R10. The same `fresh/` and `nl/` probes on vitest **3.2.7** (main's `node_modules`, no `experimental` key)

- `vi.resetModules()` + import: a new instance (`same=false`).
- Query import: `dep` is new (its salt differs, and its counter restarts); `dep2` is new, and its `dep` is shared.
  This is the same as 4.1.11.
- `vi.mock(p, { spy: true })`: `isMock=true calls=2` through an importer, passed.

So R2 / R5 (`{ spy: true }`), R4 and rulings 2 and 3 rest only on mechanisms that 3.2.7 also has.

Other counts: `render-seam.test.ts` has 9 `vi.spyOn(` calls, all namespace spies; `cli.test.ts` has 1
`vi.spyOn(glyphMode`.
