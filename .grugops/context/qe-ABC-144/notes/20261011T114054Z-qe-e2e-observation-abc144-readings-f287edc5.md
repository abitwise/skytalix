---
id: 20261011T114054Z-qe-e2e-observation-abc144-readings-f287edc5
kind: observation
by: qe-e2e
at: 2026-10-11T11:40:54Z
verified_by:
confidence: high
refs:
  - ABC-144
  - ADR-0040
  - ADR-0008
  - ABC-042
  - ABC-143
  - N8-LANE
  - NFR-008
  - vitest.config.ts
  - src/cli.test.ts
  - sha d675ef42 (reviewed tip; code d4468fd3; base 5ed308a8)
  - sha 9d0fcb96 (wave tip, dry-run merge)
supersedes:
---

# QE `ABC-144`: the value and count readings. `A2`, `A6` and `A7` are MET on QE's own runs; no timing was read

This note is hand-authored and unsealed. Every reading is QE's own, taken 2026-10-11 in QE's worktree
on `grugops/ABC-144-cap-test-workers` at `d675ef42` (code `d4468fd3`), with `node_modules` linked. Base
`5ed308a8` and the wave tip `9d0fcb96` were read from `git archive` copies outside the repository.
**No timing or CPU reading was taken or graded.** load1 is logged where it was read, for context only:
5.6–8.9 during the screen, with other agents' hops running. Vitest's duration prints were ignored.

## The config diff (`5ed308a8..d4468fd3`)

- `vitest.config.ts`: the only removed lines are `import { defineConfig } …`, `export default defineConfig({`
  and `});`. They are replaced by a type-only `import type { ViteUserConfig }`, `export default {` and
  `} satisfies ViteUserConfig;`. One `maxWorkers: 3,` follows `pool: "threads",`.
- The header gains one paragraph, appended after the existing text. The isolation warning and the `pool`
  paragraph are not touched: no removed line falls inside the comment.
- `isolate`, `minWorkers`, `fileParallelism` and `poolOptions` are not written. `package.json` is
  byte-identical, so `ABC-042` `A10`'s pinned `scripts.test` is untouched.
- `src/cli.test.ts`: +24 lines, −0. One type import, plus one `describe` / `it` at the file's end. No
  added line names `spawn`, `execFile` or `child_process`, so it adds 0 spawns. No timing assertion: the
  only inequality is the env value's `toBeLessThanOrEqual(3)`.
- **0 production `src/` lines.** `git diff --name-only 5ed308a8 d675ef42 -- src/ | grep -v '\.test\.ts$'`
  is empty.

## `A2`: the resolved configuration (test note 4), `resolved-workers.mjs`

| tree | pool | maxWorkers | isolate | fileParallelism | effectiveWorkers |
|---|---|---:|---|---|---:|
| head `d675ef42` | threads | 3 | true | true | **3** |
| base `5ed308a8` | threads | — | true | true | 7 |
| wave tip `9d0fcb96` | threads | — | true | true | 7 |
| dry-run merge (head + `9d0fcb96`) | threads | 3 | true | true | **3** |

- 3 is a fixed integer and ≤ 4, so `A2`'s bar is MET. It is the expected reading under `ADR-0040`'s
  addendum (accepted, k = 3).
- **QE checked the probe against vitest 3.2.7's source.** In `createThreadsPool`
  (`coverage.DfSpMS-b.js:2748`), `maxThreads` is `poolOptions.maxThreads ?? maxWorkers ?? cores − 1`.
  `fileParallelism: false` forces 1 (`:2765`). `VITEST_MAX_THREADS` writes `poolOptions.threads.maxThreads`
  (`:3719`). That matches the probe's precedence.
- At head, `VITEST_MAX_THREADS=8` resolves 8. That is why the pin's env half matters.

## `A6`: the 20-run screen (a count screen, not a timing)

`npm test` at head, 20 runs back to back (`../probe/screen.mjs`, raw `../probe/screen-head-d675ef42.tsv`).
A run counts as green only when all of these hold:
- exit 0;
- the JSON report has 0 failed, 0 pending and 0 todo;
- every `*.nfr.test.ts` entry has status `passed`.

**20 of 20 consecutive green, in 20 runs total, with no red and no restart.** Every run read:
- 55 files;
- 1729 tests, 1729 passed;
- 0 failed, 0 skipped, 0 todo;
- 7 of 7 `*.nfr.test.ts` files passed.

## `A6`: counts against base, and the merged tree

| tree | exit | files | tests | skipped | inventory |
|---|---:|---:|---:|---:|---|
| base `5ed308a8` | 0 | 55 | 1728 | 0 | — |
| head `d675ef42` | 0 | **55 = base** | **1729 = base + 1** | 0 | 55 = 55, `No findings.` |
| wave tip `9d0fcb96` | 0 | 55 | 1728 | 0 | — |
| dry-run merge | 0 | 55 | **1729 = wave + 1** | 0 | 55 = 55, `No findings.` |

The delta is exactly the one declared in `ADR-0040` d3: +1 test, the `A7` pin, and 0 files.

## `A6`: the opt-in lanes, equal collection (`vitest list`, base copy against head)

`../probe/collect.mjs`, raw `../probe/deep-collect-5ed308a8-vs-d675ef42.tsv`. Ten configurations: the
default, plus each `*_DEEP` variable over the whole tree. `INPUT_DEEP` runs with
`NODE_OPTIONS=--expose-gc`, and `LADDER_DEEP` is listed both as `1` and as `verdict`.
- **All 10 are EQUAL.** Base and head collect 55 files.
- No id exists only at base.
- The one id that exists only at head is the `A7` pin in `src/cli.test.ts`. That file is in no lane's
  deep set.
- Each lane's deep files, from the collection: `PERFT_DEEP` perft (+8); `SEARCH_DEEP` search,
  search.ordering, transposition, search.pvs-lmr, quiescence; `ENGINE_DEEP` engine, transposition,
  search.pvs-lmr, levels; `INPUT_DEEP` line-input (+4); `ZOBRIST_DEEP` zobrist (+1); `PUZZLE_DEEP`
  puzzle-suite (+6); `CLI_DEEP` cli.real-engine (+6); `LADDER_DEEP` ladder (+5 at `1`, +4 at `verdict`).

## `A6`: the opt-in lanes exit 0 at head (each lane over its own deep files, in one invocation, under the cap)

`../probe/run-lanes.sh`, raw `../probe/deep-lanes-exit-d675ef42.tsv`. Exit code and counts only. **No
wall was recorded.**

| lane | files | exit | passed / total | equals what the lane collects |
|---|---:|---:|---|---|
| `PERFT_DEEP` | 1 | 0 | 32 / 32 | yes |
| `INPUT_DEEP` (+ `--expose-gc`) | 1 | 0 | 34 / 34 (the whole lane; the retention guard ran) | yes |
| `ZOBRIST_DEEP` | 1 | 0 | 33 / 33 | yes |
| `PUZZLE_DEEP` | 1 | 0 | 18 / 18 | yes |
| `CLI_DEEP` | 1 | 0 | 7 / 7 | yes |
| `LADDER_DEEP=1` | 1 | 0 | 18 / 18 | yes |
| `ENGINE_DEEP` | 4 | 0 | 121 / 121 | yes |
| `SEARCH_DEEP` | 5 | 0 | 201 / 201 | yes |
| `LADDER_DEEP=verdict` | 1 | **not run** | — (~44 h estimate; `ABC-146`'s run) | collection equal |

The multi-file lanes ran under the 3-worker cap and exited 0. `PUZZLE_DEEP` is green, so it shows no
`NEWLY-MISSED` red; the change touches no engine code anyway.

## Gates at head, and on the dry-run merge

- **Head:**
  - lint, typecheck, build and `npm test` exit 0;
  - `test-skip-integrity.js --skip-count 0` reads `No findings.`;
  - `lane-inventory.js` reads 55 = 55;
  - `host-protection.js` exit 2, `UNKNOWN - verify` (`QE-144-f`).
- **Dry-run merge**, `git merge --no-commit --no-ff grugops/wave-2026-09-25` at `9d0fcb96`:
  - **one conflict, in `plans/traceability.md`.** It is an append-against-append; QE resolved it as a
    union in the working tree only;
  - `src/cli.test.ts`, `package.json` and `tools/grugops/*` auto-merge, with no marker;
  - lint, typecheck, build and `npm test` exit 0, with 55 / 1729 / 0 skipped;
  - the merged `npm test` is `ABC-143`'s result-file reporter, and its file reads `success` true, with
    0 failed, 0 pending and 0 todo (the process exit was 0);
  - the `ABC-144` `A7` and `ABC-042` `A10` blocks are green together: 32 passed, 36 skipped of 68;
  - `effectiveWorkers` is 3.

  **Then `git merge --abort`**: exit 0, and the tree is clean at `d675ef42`. Nothing was committed.
