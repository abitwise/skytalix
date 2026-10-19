---
subtask: arch-ABC-173-adr0008
role: architect-design
ticket: ABC-173
branch: grugops/arch-ABC-173-adr0008 (from main, current tip)
worktree: ../wt-arch-ABC-173-adr0008
ref: .grugops/context/arch-ABC-173-adr0008/
---

# ADR-0008 addendum for ABC-173: where the 2-executor / 2048 MiB caps live (records only)

Read these first:
- The ABC-173 page.
- BA/PM's notes, `…7e3b19d4` and the claim `…2c9d5a61`. The claim reports that vitest 4.1.11 has no worker `resourceLimits` route, that a heap flag in worker `execArgv` is rejected, and that `NODE_OPTIONS=--max-old-space-size` sets the same limit for every isolate.
- The owner's answers to Q1–Q4, in `…e7d2a915`:
  - Σ `heap_size_limit` ≤ 2048 MiB;
  - 2 busy executors, one core each;
  - all 10 `AGENTS.md` lanes;
  - nothing gives way on a breach without the owner's word.

Write a dated addendum to `memory-bank/50-decisions/ADR-0008-default-test-lane-budget.md` (PROPOSED, for the owner to accept) that rules on:

1. **Where the limit lives**, so that the direct `npx vitest run` lane commands carry it as well as `npm test`. Candidates:
   - a `package.json` script per lane;
   - `NODE_OPTIONS` in the `AGENTS.md` lane lines;
   - a vitest config setup that re-execs;
   - a `.npmrc` or `node` options file.

   The ruling must keep `ABC-144` A7, `ABC-152` V3, `ABC-042` A10 `SCRIPTS_AT_HEAD` and `ABC-119` `CHILD_ENV` green, or name exactly which ones move.
2. **The budget table:** main process, 2 workers, and every spawned Node child at the 4 spawn sites. It must sum to ≤ 2048 MiB at the peak of concurrency. Verify, using the vitest source in `node_modules`, that the main process cannot be limited separately from the workers.
3. **The `INPUT_DEEP` `NODE_OPTIONS=--expose-gc` collision**, and how the `CLI_DEEP` child gets its flag through `spawnSync`'s args without breaking the `CHILD_ENV = {}` pin.
4. **The 2-executor definition.** Confirm that `maxWorkers: 2` plus serial `spawnSync` children meets it.
5. **N8-LANE (ADR-0035).** Does it need a fresh baseline at merge? Who reads it, and in what window?

You may probe on scratch copies, for example heap limits read in a worker, a child, and the main process. Report counts and limits only. **Take no timing readings.**

## Fences
- Records only. Do not touch `src/`, `vitest.config.ts`, `package.json`, `AGENTS.md`, `plans/board.md` or `plans/traceability.md`.
- Never push. Never merge.
- Work in `git worktree add ../wt-arch-ABC-173-adr0008 -b grugops/arch-ABC-173-adr0008 main`.

## Hand off
Write `.grugops/queue/done/arch-ABC-173-adr0008.md` and `.claim.md` in main's working tree, uncommitted. Include:
- the commit;
- the rulings;
- the budget table;
- the pins that move;
- the exact changes the SE will make;
- any owner question;
- a trace row.

---

## Result (architect-design, 2026-10-19)

- **Commit:** `b917a3bd` on `grugops/arch-ABC-173-adr0008`, parent `3468f054`, in `../wt-arch-ABC-173-adr0008`.
  It is not pushed and not merged.
  - 20 files, +1189.
  - **0 lines under `src/`.** `vitest.config.ts`, `package.json`, `AGENTS.md`, `plans/board.md` and
    `plans/traceability.md` are untouched.
- **ADR:** `memory-bank/50-decisions/ADR-0008-default-test-lane-budget.md`, which gains a Status pointer and
  **§ ADDENDUM 2026-10-19, PROPOSED**. The owner's acceptance is owed.
- **Notes** in `.grugops/context/arch-ABC-173-adr0008/notes/`. They are hand-authored, `sealed: false`:
  - decision `…9c2f7a41`;
  - observation `…4e81d0b6`;
  - artifact-ref `…b7d35e20`.
- **Probes:** `.grugops/context/arch-ABC-173-adr0008/probe/RUN.txt`, on a scratch `git archive` copy.
  - They record counts, exit codes and heap limits only. **No timing readings.**
  - The vitest stdout files were not kept, because they print durations.

### Rulings

1. **Where the limit lives.**
   - `NODE_OPTIONS=--max-old-space-size=<flag>` goes on the lane command:
     - in `scripts.test` and `scripts["test:watch"]`;
     - as a prefix on every vitest command in `AGENTS.md`.
   - **Enforcement:** a `globalSetup` guard, `tools/grugops/heap-guard.js`, runs in the vitest main process.
     - It reads `heap_size_limit` there (this is `A5`).
     - If the limit is above the row for its shape, it throws: exit 1, and no test runs.
     - So a lane typed without the prefix is refused. It never runs uncapped.
   - **Rejected:**
     - a `package.json` script per lane: `A10`'s `added` = `["chess"]` goes red, and `npx` still bypasses it;
     - a re-exec in the config: an extra main process, and `A7`/`V3` import the config;
     - `.npmrc` `node-options`:
       - npm `set-envs.js:102-104` **replaces** `NODE_OPTIONS` for every npm command, so `INPUT_DEEP`'s
         `--expose-gc` is silently lost;
       - `tsc --noEmit` at 224 MiB runs out of heap, exit 134, which breaks the typecheck and build gates;
     - a node options file: experimental, and it needs a flag;
     - `--max-heap-size`: not a documented Node option;
     - a `test.env` children row;
     - one uniform row (below).
   - **The setup entry (BA/PM's question 5) is allowed.** It is a path string, so the config import still loads
     nothing at run time, and `A7`/`V3` stay byte-identical and green.
2. **The budget table** is in two shapes, chosen by the run's file count. The guard reads that count with
   `project.vitest.state.getPaths()` and passes the row on with `provide("heapRowMiB")`.
3. **`INPUT_DEEP`:** one value carries both flags,
   `INPUT_DEEP=1 NODE_OPTIONS="--expose-gc --max-old-space-size=400" npx vitest run src/line-input.test.ts`.
   - Dropping the heap flag makes the guard refuse the run.
   - Dropping the gc flag reads 33 instead of 34. That is the existing trap, and it was seen in scratch.
4. **`CLI_DEEP`:** the child's argv is `[heapToken, entryPointIn(root), ...CHILD_ARGS]`.
   - `heapToken` is the last `--max-old-space-size=<digits>` in the worker's own `process.env.NODE_OPTIONS`, which
     is the lane's value as vitest copies it (`cli-api…:3718`). If there is none, the test throws.
   - `CHILD_ENV` stays `{}`, `CHILD_ARGS` is unchanged, and `NODE_OPTIONS` itself never reaches the child.
5. **Two executors: confirmed as built.**
   - `Pool.schedule` returns early at `activeTasks >= maxWorkers` (`:3494`).
   - `spawnSync` blocks the worker that called it.
   - Overhead, not executors: the vitest main thread, terminating workers, the wrapper and the npm client.
6. **`N8-LANE`: no fresh baseline**, because it has none. It is a paired delta.
   - QE reads two things in `ABC-173`'s QE hop, on the branch tip, **before** merge:
     - `ABC-173`'s narrow-set charge, with the base arm on the base command and the head arm on the head command;
     - `A9`, the `npm test` wall ≤ 10 s at load1 ≤ 8 with CPU reported, read **with a twin**. That twin R replaces
       the full-lane `F` (1.72 s / 3.25 s, pre-4.1 and pre-cap).
   - Per-set `F` values stay until each set's first capped reading.
   - The `ADR-0035` stack declaration gains the heap clause.
   - Over 10 s goes to the owner.
7. **Main and workers cannot be limited separately.** Verified in vitest's source:
   - `new Worker` at `cli-api.CnMVyzaz.js:3229-3234` passes no `resourceLimits`, and 0 files in `dist/` mention it;
   - `execArgv` (`:3798-3803`, `:3727-3735`) forwards no heap flag, and a heap flag in a Worker's `execArgv` throws
     `ERR_WORKER_INVALID_EXEC_ARGV`;
   - V8's flag is process-wide: a worker with `execArgv: []` reads the main's 224;
   - `resourceLimits` is reachable only through a custom `poolRunner` (`:3609`), which is forbidden.

### Budget table (`heap_size_limit`; on node v26.11.1 the flag + 96 = the limit)

**SUITE shape** (≥ 2 files: `npm test`, `test:watch`, coverage ×2, skip-count capture, multi-file filters).
`--max-old-space-size=128` = **224 MiB**.

| isolate | live | MiB |
|---|---:|---:|
| `run-bounded` wrapper | 1 | 224 |
| vitest main | 1 | 224 |
| workers running a file | 2 | 448 |
| workers still terminating (**reserve, observed**: up to 4 live in 2 of 2 runs; vitest does not await them, `:3547`) | 2 | 448 |
| Node children (by construction: `npmRun` = npm + node, plus 1 from the other worker; 2 observed) | 3 | 672 |
| **Σ** | **9** | **2016** |

**ONE-FILE shape** (every `*_DEEP` line, and `npx vitest run <path>`). `--max-old-space-size=400` = **496 MiB**.

| isolate | live | MiB |
|---|---:|---:|
| vitest main | 1 | 496 |
| worker (one task, so one worker) | 1 | 496 |
| Node children (synchronous; `npmRun` is 2) | 2 | 992 |
| **Σ** | **4** | **1984** |

**Not counted** (the ticket's Q1 definition):
- the lane's npm client (under `npm test` it keeps Node's default of 4192);
- non-Node children;
- RSS.

**Why two rows:**
- `PUZZLE_DEEP` is red at 224 ("Worker exited unexpectedly", 2 of 2 runs) and green at 256, 292, 336 and 496.
- 9 × 256 = 2304 > 2048, so no single value works.

**Green at the rows (scratch):**
- at 224:
  - `npm test`: 59 files, 1915 passed;
  - coverage: 1915;
- at 496: `PUZZLE` 18, `SEARCH_DEEP` `search` 57, `PERFT_DEEP` 32;
- at 224, below their 496 row: `INPUT` 34, `CLI_DEEP` 10, `ZOBRIST` 33, quiescence 37, transposition 26 and 40.

**Not run** (left to the SE's `A7`): `ENGINE_DEEP` `engine` and `levels`, `LADDER_DEEP`, `SEARCH_DEEP` `pvs-lmr`.

### Pins that move (re-pinned in `ABC-173`'s diff, reason stated)

- **`ABC-042` `A10` `SCRIPTS_AT_HEAD`** (`src/cli.test.ts:1779-1780`): the `test` and `"test:watch"` values only.
  The key set and `added` = `["chess"]` are unchanged. It is still a byte pin, so `A7`'s "CLI-flag route closed"
  holds.
- **`tools/grugops/run-bounded.js:9-10`:** the header quote.
- **`N8_SPAWN`** (`src/cli.test.ts:1950`): 27 → **28**, written `17 + 7 + 1 + 2 + 1` (the `A6` probe child).
- **`CLI_DEEP`'s deep count:** +1 (10 → 11 on this tree).
- **Comments:** the header sentence in `src/cli.real-engine.test.ts`, and `src/line-input.test.ts:77`.
- **`AGENTS.md`:** the vitest command lines, about +640 B.
  - **`ABC-109` `A5` (≤ 24,576 B, at the budget today) stays green by offset.** The same diff moves at least as many
    bytes of RUN-receipt comments, verbatim, to `memory-bank/90-agents-md-command-log.md`.
  - The `Dev / run` slot is not touched.

**These stay green and byte-identical:**
- `ABC-144` `A7` and `ABC-152` `V3`;
- `ABC-119` `CHILD_ENV` `{}` and the `CHILD_ARGS` filter;
- `ADR-0008` decision 7;
- `INPUT_DEEP`'s 34;
- `ABC-065`/`067`/`071`.

**This fires (accepted on the page):** `ABC-146` `A0`'s staleness.

### Exact SE changes

1. **`package.json`.**
   - `"test": "NODE_OPTIONS=--max-old-space-size=128 node tools/grugops/run-bounded.js 60000 vitest run --reporter=default --reporter=./tools/grugops/result-file-reporter.js --outputFile.json=.test-results/last-run.json"`
   - `"test:watch": "NODE_OPTIONS=--max-old-space-size=128 vitest"`
   - Nothing else changes.
2. **`tools/grugops/run-bounded.js`:** the header quote only.
3. **New `tools/grugops/heap-guard.js`.**
   - It exports the rows `{suite: 224, oneFile: 496}` and the flags `{suite: 128, oneFile: 400}`.
   - Its default `setup(project)` does this, and nothing else:
     - assert `isMainThread`;
     - `files = project.vitest.state.getPaths().length`; throw on 0 or if the API is missing;
     - pick the row (`files === 1` → oneFile);
     - throw if `heap_size_limit` is above the row, with a message that names the limit, the row and the prefix;
     - `project.provide("heapRowMiB", row)`.
4. **`vitest.config.ts`:** add `globalSetup: ["./tools/grugops/heap-guard.js"]` and one header paragraph.
5. **`src/cli.real-engine.test.ts`:**
   - put `heapToken` in argv;
   - add one deep-block probe child, built the same way, asserting ≤ `inject("heapRowMiB")`;
   - amend the header sentence.
6. **`src/cli.test.ts`:**
   - **`A6`:** one `childOf` child that prints `heap_size_limit`, asserted ≤ `inject`; `N8_SPAWN` becomes 28.
   - **`A4`:** one in-process worker row (`!isMainThread`, ≤ `inject`).
   - **`A10`:** the two values.
   - **Static rows:**
     - `C2`: no async `child_process` forms, and ≥ 4 synchronous sites;
     - `A3`: every `AGENTS.md` vitest command carries its shape's flag, `INPUT_DEEP` carries both flags in one
       value, and the flags equal `heap-guard.js`'s exports;
     - `A6`: the `history-pane.nfr` and `transposition` `spawnSync` calls have no `env` key and no heap flag in argv.
7. **`AGENTS.md`:**
   - the SUITE flag on the coverage ×2 and skip-count lines;
   - the ONE-FILE flag on `PERFT`, `SEARCH` ×4, `ENGINE` ×3, `ZOBRIST`, `PUZZLE`, `CLI`, `LADDER` and
     `Test (single file)`;
   - the `INPUT_DEEP` line as in ruling 3;
   - the byte offset as described under the pins.
8. **`src/line-input.test.ts:77`:** the comment.
9. **`A7`:**
   - run every lane as spelled and record its counts;
   - record peak `heapUsed` (observation only);
   - read the live-worker maximum once with `probe/pre.mjs` + `analyze2.mjs`, using
     `NODE_OPTIONS="--import=<pre.mjs> --max-old-space-size=128" npx vitest run`;
   - more than 4 live workers, or any OOM, goes to the owner.
10. **Armed reds** (watch each go red, then revert it):
    - no script prefix (default lane);
    - no argv token, then no line prefix (`CLI_DEEP`);
    - no heap flag (`INPUT_DEEP`);
    - an added `spawn(` (`C2`);
    - 2 files at the ONE-FILE flag.

### Risks named

- **`RISK-ABC173-TEARDOWN`:** the reserve of 2 is observed, not bounded by vitest's source.
- **`RISK-ABC173-STATE`:** the guard reads `vitest.state.getPaths()` (`reporters.d…:1297`, `:1165`). This is the
  same class as `RISK-ABC143-01`, and it fails loud.
- **`RISK-ABC173-PUZZLE`:** `PUZZLE_DEEP` is red at 224 and green at 256. Its margin is the ONE-FILE row, about
  1.9x.
- **Node versions other than v26.11.1:** the flag-to-limit offset is unread there. The guard reads the limit.

### Owner questions

- **OQ1.** Accept the addendum: SUITE 224 MiB (Σ 2016) and ONE-FILE 496 MiB (Σ 1984)? *Recommend: yes.*
- **OQ2.** Count workers that are still terminating against the 2048, using the observed reserve of 2? His Q1 reads
  this way, and it is why there are two rows.
  - The alternative is to count only the isolates that run tests. That allows one uniform row of 292 MiB
    (`--max-old-space-size=196`): 7 × 292 = 2044.
  - Under that alternative, `PUZZLE_DEEP` was green at 292 in 1 run and red at 224.
  - *Recommend: count them, with two rows.*
- **OQ3.** The guard also refuses coverage, skip-count, single-file runs and `test:watch` without the prefix, so
  they get the prefix too. Does "vitest needs to be capped" cover every vitest run? *Recommend: yes.*

**`NFR` (for Security/NFR after acceptance):**
- a new catalog row at the next free id (`NFR-010` at this commit), *Test-lane V8 heap ceiling*, carrying the table
  above;
- `NFR-008`'s stack declaration gains the heap clause.

### Trace row (for the Orchestrator to apply; not hand-edited here)

`| ABC-173 (A1, A2, design) | ADR-0008 addendum 2026-10-19 PROPOSED: NODE_OPTIONS=--max-old-space-size on scripts.test/test:watch + every AGENTS.md vitest line; globalSetup tools/grugops/heap-guard.js refuses a run above its shape row (A5); SUITE 128→224 MiB × 9 = 2016, ONE-FILE 400→496 MiB × 4 = 1984; INPUT_DEEP one NODE_OPTIONS; CLI_DEEP heap token in argv, CHILD_ENV {}; 2 executors as built; N8-LANE no baseline, A9 twin before merge replaces full-lane F; A1 = (b) none (cli-api.CnMVyzaz.js:3229-3234); Architect/Design arch-ABC-173-adr0008 | — | ADR-0008 (addendum), ADR-0035 (stack clause, F rule), ADR-0040 (cap unchanged) | NFR-008 (stack clause; wall bar unchanged), proposed NFR-010 heap ceiling | records only; b917a3bd on grugops/arch-ABC-173-adr0008; 0 lines in src/ | scratch probes: counts/exit codes/heap limits only (probe/RUN.txt), no timing | owner acceptance owed (OQ1–OQ3); then SE | notes …9c2f7a41, …4e81d0b6, …b7d35e20 |`
