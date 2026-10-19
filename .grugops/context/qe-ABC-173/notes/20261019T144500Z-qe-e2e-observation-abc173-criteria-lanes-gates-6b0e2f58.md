---
id: 20261019T144500Z-qe-e2e-observation-abc173-criteria-lanes-gates-6b0e2f58
kind: observation
by: qe-e2e
task: qe-ABC-173
at: 2026-10-19T14:45:00Z
verified_by:
confidence: high
sealed: false
refs:
  - ABC-173
  - ADR-0008
  - ABC-144
  - ABC-152
  - ABC-119
  - ABC-109
  - ABC-143
  - NFR-008
  - QE-173-d
  - QE-173-f
  - QE-173-g
---

# `ABC-173` at `840ebbf7`: criteria, every `AGENTS.md` lane as spelled, gates, reporter row, waiver. Counts only, no timing

Hand-authored and unsealed. Scratch detached worktree `../wt-qe-ABC-173` at `840ebbf7`, node v26.11.1, vitest 4.1.11,
MacBook-Air.local (Mac15,13, 8 cores). The printed vitest "Duration" lines are not readings and are not recorded.

## Gates and lanes (each typed exactly as `AGENTS.md` spells it at `840ebbf7`, one at a time, `NODE_OPTIONS` and every `*_DEEP` unset first)
| lane | exit | passed |
|---|---:|---|
| lint / typecheck / build | 0 / 0 / 0 | biome 116 files |
| `npm test` | 0 | 59 files, 1920/1920; `last-run.json` `success: true`, `numTotalTests` 1920, 0 failed, 0 pending, `exitCode` 0 |
| skip-count capture | 0 | **0** (the same JSON: 1920 total, 59 files, `success` true) |
| `test-skip-integrity … --skip-count 0` | 0 | `No findings.` |
| `PERFT_DEEP` | 0 | 32 |
| `SEARCH_DEEP` search / transposition / quiescence / pvs-lmr | 0 each | 57 / 40 / 37 / 29 |
| `ENGINE_DEEP` engine / levels / transposition | 0 each | 60 / 28 / 26 |
| `INPUT_DEEP` / `ZOBRIST_DEEP` / `PUZZLE_DEEP` | 0 each | 34 / 33 / 18 |
| `CLI_DEEP` | 0 | 11 |
| `LADDER_DEEP` (short mode) | 0 | 18 |
| single file (`<path>` = `src/fen.test.ts`) | 0 | 82 |
| Coverage / Coverage `src/` | 0 / 0 | 1920 / 1920, **both green on their first run** |

No lane printed a heap out-of-memory error, `Worker exited unexpectedly` or a guard refusal. Every count equals the SE's.

## Criteria
- **C1:** `ABC-144 A7` (34 lines) and `ABC-152 V3` (7 lines) are byte-identical to `6cfc1be9` (`cmp`, sha256
  `ebdf5bc1…` / `4928a31a…`) and green. `globalSetup` is the path string `./tools/grugops/heap-guard.js`. Wrong builds:
  `maxWorkers: 3` reds `A7`; `viteModuleRunner: true` reds `V3`.
- **C2:** green; plants of a named `spawn(`, a namespace `cp.exec(` and a renamed `fork` each red it. Parser bounds:
  observation `…3d7a91c4` (`QE-173-c`).
- **A1:** (b) none, re-read: `grep -rl resourceLimits node_modules/vitest/dist` is 0 files;
  `cli-api.CnMVyzaz.js:3229-3234` is `new Worker(this.entrypoint, { env, execArgv, stdout, stderr })`.
- **A2:** `heap-guard.js` carries `ROWS_MIB { suite 224, oneFile 496 }`, `FLAGS_MIB { 128, 400 }`, and the addendum's
  table: 9 x 224 = 2016, 4 x 496 = 1984, each <= 2048. Every row is a number.
- **A3:** the static row covers exactly 17 commands; 14 of 14 `AGENTS.md`/flag mutants red it. Armed reds rerun at
  this hop: `npm test` without its prefix (scratch copy outside the repository) refused, exit 1; `CLI_DEEP` without the
  prefix refused (4192 > ONE-FILE 496), exit 1; `INPUT_DEEP` with `--expose-gc` only refused, exit 1. Each refusal
  message names `heap-guard` and the prefix to type.
- **A4:** green. Wrong builds: `globalSetup` removed reds `A4` and `A6`; the guard disabled AND the run unprefixed reds
  `A4` and `A6` (the limit read in the worker is 4192 MiB). The heap flag in vitest `execArgv`:
  `ERR_WORKER_INVALID_EXEC_ARGV`, no test runs, exit 1.
- **A5:** the guard refuses every wrong command battery (two files unprefixed, one file unprefixed, two files at 400,
  one file at 450, one file at 500) and admits every correct one. Its own wrong builds: `QE-173-a`.
- **A6:** `heapProbe` (childOf), the static row and the `CLI_DEEP` probe are green. `CHILD_ENV` is `{}` and its pin is
  green. Token mutants: `…3d7a91c4`.
- **A7:** every lane green at the cap, as above; no OOM. (Live-worker census and `heapUsed` peaks are the SE's
  observations `…4b2e8f61`; not re-read here.)
- **A8:** the diff names its pins: `A10` (`test`, `test:watch` only), the `run-bounded.js` quote, `N8_SPAWN` 27 -> 28
  (`17 + 7 + 1 + 2 + 1`), `CLI_DEEP` 10 -> 11, two comments, `ABC-170 A3` step 1 -> 5 and `ABC-167 A5` "movetime 100"
  step 1 -> 10 (owner). `ABC-119` pins green. `AGENTS.md` 24,576 -> 24,343 B; the 13 moved receipts are each present
  verbatim once in the base `AGENTS.md` and sum to the stated 868 B (five entries list 1 B more than their quoted
  string: the separating space; the total and `wc -c` agree).
- **A9:** OWED (`…c9e4a7d1`).

## The SE-named gap: the guard's refusal in the result file (`QE-173-d`), reproduced
In a scratch copy outside the repository, `scripts.test` without its prefix: `npm test` exit 1; the console prints
`heap-guard: refused. This run's V8 heap_size_limit is 4192 MiB, above the SUITE row of 224 MiB (59 test files …)`.
`last-run.json`: `success` false, `runState` "exited", `exitCode` 1, `numTotalTests` 0, `testResults` [], `unhandledErrors`
[]. The READ IT query prints exactly `run    exited exitCode=1`. The file cannot read green (the reporter's guarantee
holds); it does not name the cause. `numTotalTests` 0 with `testResults` [] tells it apart from the exit-code-only row
(1920 tests).

## Waiver
`git diff --name-only 68bbf33f...840ebbf7 | grep -v '\.test\.ts$' | grep '^src/'` prints nothing, and so does the
`AGENTS.md` per-commit form (`<c>~1 <c>`) for each of `affee860`, `48842a1f`, `840ebbf7`. **0 production files.**

## Merge
`git merge-tree --write-tree main 840ebbf7` is clean (main `5d9d9de3`; main has no code, `AGENTS.md` or config change
since `68bbf33f`). Against `grugops/ABC-171` (`5dee231c`) it is also clean, but ABC-171's +533 lines of
`src/uci-session.test.ts` have never run under the cap (`QE-173-g`).

## Small things
- `QE-173-f` (INFO): the `Test (all)` HTML comment in `AGENTS.md` still quotes the unprefixed
  `node tools/grugops/run-bounded.js 60000 vitest run`. The script is the authority and `A10` pins it.
- Observation, not ABC-173's: `node_modules/` in main's checkout holds a self-referential `node_modules -> node_modules`
  symlink (dated 2026-10-17); `diff -r` reports a loop. Untouched.
