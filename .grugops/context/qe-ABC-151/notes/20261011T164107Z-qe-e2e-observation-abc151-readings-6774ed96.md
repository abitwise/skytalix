---
id: 20261011T164107Z-qe-e2e-observation-abc151-readings-6774ed96
kind: observation
by: qe-e2e
at: 2026-10-11T16:41:07Z
verified_by:
confidence: high
refs:
  - ABC-151
  - ABC-144
  - ABC-149
  - ADR-0040
  - ADR-0008
  - N8-LANE
  - NFR-008
  - NFR-001
  - NFR-005
  - vitest.config.ts
  - src/cli.test.ts
  - sha fc4ebb33 (reviewed tip; code 0035001c; base f439c8fd)
  - sha aa932974 (wave tip, dry-run merge)
supersedes:
---

# QE `ABC-151`: the value and count readings. `A1`, `A2` and `A6` (QE's part) are MET on QE's own runs; no timing was read

This note is hand-authored and unsealed. Every reading is QE's own, taken 2026-10-11:
- the head, in QE's worktree on `grugops/ABC-151-two-test-workers` at `fc4ebb33` (code `0035001c`);
- base `f439c8fd` and the wave tip `aa932974`, from `git archive` copies outside the repository.

**No timing, CPU or heat reading was taken or graded.** Vitest's duration prints were ignored. load1 is logged
only for context. It read 8.65–55.64 during the screen, because other hops were running (QE `ABC-149`, Architect
`ABC-152`).

## The diff (`f439c8fd..fc4ebb33`)

- **Code:** `vitest.config.ts` (+10/−6) and `src/cli.test.ts` (+8/−5). The rest are the SE's notes, probe, ticket
  § Delivery and one trace row.
- **`vitest.config.ts`:**
  - `maxWorkers: 3` → `2`;
  - the `maxWorkers` header paragraph is rewritten to name the owner's pick, his words, and addendum 2. It keeps
    decision 2's reading of 3 in view;
  - no other line inside `export default` moves. The isolation warning and the `pool` paragraph are not in the
    hunk.
- **`src/cli.test.ts`:**
  - the change is confined to the `ABC-144 A7` `describe`: the titles say 2, `toBe(2)`, the env check is
    `toBeLessThanOrEqual(2)`, and the comment cites "`ADR-0040` addendum 2";
  - no `it` or assertion was added or removed, and no line names `spawn`, `execFile` or `child_process`
    (`N8-LANE`: 0 / 0 / 0).
- **0 production lines.** `git diff --name-only f439c8fd fc4ebb33 | grep -v '\.test\.ts$' | grep '^src/'` is
  empty.

## `A1`: the setting, and the resolved configuration (test note 3)

`vitest.config.ts` at head: `test` holds `pool: "threads"`, `maxWorkers: 2` and `exclude`. There is no `isolate`
key and no `poolOptions`.

`resolved-workers.mjs` (`design-ABC-144/probe/`):

| tree | pool | maxWorkers | isolate | fileParallelism | effectiveWorkers |
|---|---|---:|---|---|---:|
| head `fc4ebb33` | threads | 2 | true | true | **2** |
| base `f439c8fd` | threads | 3 | true | true | **3** |
| wave tip `aa932974` | threads | 3 | true | true | 3 |
| dry-run merge (head + `aa932974`) | threads | 2 | true | true | **2** |
| both merged (`ABC-149` + wave + head) | threads | 2 | true | true | **2** |
| head, `VITEST_MAX_THREADS=8` | threads | 2 (`threadsMaxThreads` 8) | true | true | 8 (why the env half matters) |

`A1` is MET. The probe's precedence is still vitest 3.2.7's: the installed version is 3.2.7, and
`coverage.DfSpMS-b.js:3719-3749` is unchanged.

## A runtime cross-check: the cap reaches the runner, not only the resolver

Test note 3 rules out reading the cap from a process count under load. So QE read the runner's own slot ids.
- **Method.** Six one-test probe files each append `VITEST_POOL_ID` to a log, and wait 400 ms so that they
  overlap. Nothing is timed or asserted on time. They ran in scratch copies only, never in the repository
  (`../probe/rt.sh`, `../probe/rt.out.tsv`).

| tree / env | distinct pool slots |
|---|---:|
| head | **2** (1, 2) |
| base | **3** (1, 2, 3) |
| head, `VITEST_MAX_THREADS=1` | 1 |
| head, `VITEST_MAX_THREADS=8` | 6 (one per file; this shows the probe can see a raise) |
| head, `VITEST_MAX_THREADS=0x3` | **3**, with the pin green (`QE-151-a`) |

## `A2`: the pin moves with it, and it is armed

- **Text.** `toBe(2)`. The env loop is `toBeLessThanOrEqual(2)` over `VITEST_MAX_THREADS` and `VITEST_MAX_FORKS`.
  The `describe` says "2-worker cap" and the `it` says "2 threads workers".
- **Armed.** The plants are in `…cb3b04e5`. r1, r2, r3, r3b (`=3`) and `maxWorkers: 3` are RED. `=2` and `=1`
  are green.

`A2` is MET. `QE-151-a` is a pre-existing route, not a miss of `A2`'s wording.

## `A6`: the 20-run screen (a count screen, not a timing)

`npm test` at head, back to back (`qe-ABC-144/probe/screen.mjs`, unchanged; raw `../probe/screen-head-fc4ebb33.tsv`).
A run is green only when all of these hold:
- exit 0;
- the JSON report has 0 failed, 0 pending and 0 todo;
- every `*.nfr.test.ts` entry has status `passed`.

**20 of 20 consecutive green, in 20 runs total, with no red and no restart.** Every run read:
- 56 files;
- 1740 tests, 1740 passed;
- 0 failed, 0 skipped, 0 todo;
- 7 of 7 `*.nfr.test.ts` files passed;
- 0 unhandled errors.

The screen ran at load1 8.65–55.64, under other hops' load, so it is a harsher condition than a quiet machine.
It is not `A5`'s 27 runs. Those are the window's.

## `A6`: counts against base, and the merged trees

| tree | exit | files | tests | skipped | `*.nfr` | inventory |
|---|---:|---:|---:|---:|---|---|
| base `f439c8fd` | 0 | 56 | 1740 | 0 | 7/7 | — |
| head `fc4ebb33` (20 runs) | 0 | **56 = base** | **1740 = base** | 0 | 7/7 | 56 = 56, `No findings.` |
| dry-run merge (head + `aa932974`) | 0 | 56 | 1740 | 0 | 7/7 | 56 = 56, `No findings.` |
| both merged (`ABC-149` + wave + head) | 0 | 56 | 1740 | 0 | 7/7 | — |

- `test-skip-integrity.js --skip-count 0`: `No findings.`, exit 0.
- **Gates.** lint, typecheck and build are 0 at head, on the dry-run merge and on the both-merged tree.
  `npm test` is 0 at all three.

## `A6`: the opt-in lanes, equal collection (`vitest list`, base copy against head copy)

`../probe/collect.mjs`, raw `../probe/collect.tsv`. There are ten configurations: the default, plus each `*_DEEP`
variable over the whole tree. `INPUT_DEEP` runs with `NODE_OPTIONS=--expose-gc`, and `LADDER_DEEP` is listed both
as `1` and as `verdict`.

| lane | files base = head | tests base = head | only at base | only at head |
|---|---:|---:|---|---|
| default | 56 | 1740 | the A7 pin's `3-worker` title | the A7 pin's `2-worker` title |
| `PERFT_DEEP` | 56 | 1748 | same | same |
| `SEARCH_DEEP` | 56 | 1815 | same | same |
| `ENGINE_DEEP` | 56 | 1761 | same | same |
| `INPUT_DEEP` (+ `--expose-gc`) | 56 | 1744 | same | same |
| `ZOBRIST_DEEP` | 56 | 1741 | same | same |
| `PUZZLE_DEEP` | 56 | 1746 | same | same |
| `CLI_DEEP` | 56 | 1746 | same | same |
| `LADDER_DEEP=1` | 56 | 1745 | same | same |
| `LADDER_DEEP=verdict` | 56 | 1744 | same | same |

- **All 10 are EQUAL.** The file sets are identical, the test counts are equal, and every `vitest list` exits 0
  on both sides.
- The only differing id is the `A7` pin in `src/cli.test.ts`, renamed from "3-worker" / "3 threads" to "2-worker" /
  "2 threads": one id at base and one at head. That is `A6`'s "the pin changes literals and adds no `it`".
- **The lanes' exits were NOT run by QE** (`QE-151-d`). Addendum 2 puts them at step 5 of the width-1 window,
  where their walls are reported too.

## The dry-run merge

- **Against the wave tip `aa932974`.** `git merge --no-commit --no-ff` in a detached worktree at `fc4ebb33` is
  **clean**. The incoming files are queue files and `plans/board.md` only. The merged tree's gates and counts are
  in the table above, and it resolves `effectiveWorkers` 2. It was aborted, and nothing was committed.
- **Against `ABC-149`, which is also in review** (`grugops/ABC-149-reporter-plants`, tip `9a309fb4`).
  `git merge-tree` finds one conflict, in `plans/traceability.md`: append against append (`QE-151-c`).
  - **`src/cli.test.ts` does not overlap.** `ABC-149` touches only `tools/grugops/result-file-reporter.js`, its
    own notes, two ticket files (`ABC-143`, `ABC-149`) and one trace row. Neither `ABC-149` nor the wave since base touches `src/cli.test.ts`
    or `vitest.config.ts`.
  - The union-resolved both-merged tree is green: 56 / 1740, 7/7 `*.nfr`, `effectiveWorkers` 2.
  - The wave tip against `ABC-149` alone conflicts the same way, so the conflict is not this ticket's.
