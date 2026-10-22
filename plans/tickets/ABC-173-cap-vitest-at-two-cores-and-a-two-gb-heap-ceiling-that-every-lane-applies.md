---
id: ABC-173
title: "Cap this repo's vitest at 2 CPU cores and a 2 GB heap ceiling, applied (not just configured) in every lane"
status: done
column: Done
size: S
priority: P1
epic: —
feature: —
---

# ABC-173: every vitest lane keeps 2 busy executors and a summed V8 heap limit of 2048 MiB or less, and a probe proves the limit took effect

> **Cut 2026-10-19 by BA/PM** (task `wave-2026-09-25`, subtask `bapm-cut-ABC-173`). It answers the owner's word
> of 2026-10-19, quoted verbatim in note `.grugops/context/wave-2026-09-25/notes/…c4a8e1f6`:
> *"vitest needs to be capped to max 2 cpu cores and 2GB of memory"*.
>
> **This hop took no timing reading.** It read vitest 4.1.11's own `dist/` and ran one heap-limit probe of Node
> itself in a scratch directory (see § Step-1 evidence). Every other figure is cited or labelled as arithmetic.

## Problem

*User*: the owner at the MacBook Air M3 (8 cores) while any vitest lane runs, plus every agent hop that runs one.

*Pain*: CPU is already capped (`maxWorkers: 2`, `ABC-151`, pinned by `ABC-144` `A7`). **Memory is not capped.**
Each Node isolate takes V8's default heap limit. This hop read **4192 MiB** per isolate (Node v26.11.1, no flag), and
a lane runs up to 6 isolates at once.

*Value*: a run cannot claim more than about 2 GB of V8 heap on the owner's machine. Each of the 2-core and 2 GB
caps is shown to be in force by a test that fails without it.

## Meanings this ticket adopts (owner Q1-Q3 confirm them)

- **"2 cores"**: at most **2 CPU-busy test executors at once.** An executor is a vitest worker, or the child
  process that worker is blocked on. vitest's main thread orchestrates and reports. It is counted as overhead,
  not as a third core. macOS has no CPU quota, so this is a concurrency cap, not a hard 2.0-core limit (Q2).
- **"2 GB"**: **Σ `heap_size_limit` ≤ 2048 MiB** over every Node isolate that is live at the same time in the
  process tree a lane command starts. The `npm` process itself is not counted. macOS has no cgroups. RSS
  (native memory, buffers, code) is **reported, not gated** (Q1). `heap_size_limit` is the value checked, not
  the flag value. This hop read `--max-old-space-size=600` → `heap_size_limit` 696 MiB, so the flag
  understates the limit by about 96 MiB.
- **"this repo's vitest"**: all of the lane commands `AGENTS.md` lists. That is the default lane (`npm test`)
  plus `CLI_DEEP`, `PERFT_DEEP`, `ENGINE_DEEP` (both of its files), `LADDER_DEEP`, `SEARCH_DEEP` (both of its
  files), `INPUT_DEEP`, `ZOBRIST_DEEP` and `PUZZLE_DEEP`. The owner-word note names five of these lanes. This
  ticket covers all of them (Q3).

## Scope

**CPU**
- Keep `maxWorkers: 2`, `pool: "threads"`, isolation on, and the `ABC-144` `A7` pin byte-identical.
- **Children run one at a time per worker (ruling).** Every child-spawning test file uses a synchronous
  primitive today (`spawnSync` / `execFileSync`: `cli.test.ts`, `cli.real-engine.test.ts`,
  `history-pane.nfr.test.ts`, `transposition.test.ts`, `ladder.test.ts` (git)). A worker blocked on its child
  is idle, so the two together count as one executor.
  - `CLI_DEEP` **must keep its children serial**: one live child at a time, never a `Promise.all` of spawns.
  - The ceiling is 2 live children lane-wide (one per worker).
  - This ticket pins that rule. It does not change it.

**Memory**
- **Step 1: re-verify the `resourceLimits` question** (`A1`). Only then may the mechanism be chosen.
- Choose a **budget table** with one row per isolate kind: the wrapper (`tools/grugops/run-bounded.js`, `npm test`
  only), the vitest main process, worker ×2, and live children ×≤2. Each row gives `heap_size_limit` and a count,
  and the table sums to ≤ 2048 MiB.
  - Arithmetic, not a ruling: a uniform limit over 6 isolates is ≤ 341 MiB each.
  - The values are the Architect's (§ Architect first).
- **Where the limit lives** is the Architect's to choose, from these routes:
  - the `package.json` script and `NODE_OPTIONS`;
  - each lane command in `AGENTS.md`;
  - a `vitest.config.ts` key or setup entry;
  - a node option in each spawn site's argv.

  Every lane must carry the limit, so the choice must reach the `npx vitest run …` lane commands that bypass
  `npm test`. **Forbidden**: `poolOptions`, a custom `pool` initializer, a change to `maxWorkers`, `isolate`,
  `fileParallelism` or `test.projects`, and anything else that turns `ABC-144` `A7` or `ABC-152` `V3` red.
- A **probe** that reads the limit where it applies, so a build that only configures the limit fails (`A4`-`A6`).

**Records**
- An `ADR-0008` addendum (Architect, first).
- One paragraph in the `vitest.config.ts` header comment block.
- The `AGENTS.md` lane lines, if the lane commands change.

## Out of scope

- The owner's other projects. Each needs its own setting.
- An RSS cap or any OS-level enforcement (`ulimit`, `taskpolicy`, `cpulimit`).
- Windows.
- Non-Node children (`git` in `ladder.test.ts`). They are outside the V8 mechanism. Their memory is recorded,
  not capped.
- Any change to the worker count.
- `ABC-174` (the levels re-cut).

## Step-1 evidence from this hop (`claim`, `UNKNOWN - verify` until `A1` re-runs it)

- `node_modules/vitest` is **4.1.11**. `ThreadsPoolWorker.start()` (`dist/chunks/cli-api.CnMVyzaz.js:3229`)
  builds `new Worker(entrypoint, { env, execArgv, stdout, stderr })`. **It passes no `resourceLimits`.** Searching
  `dist/` for `resourceLimits` finds no hits.
- **The top-level `execArgv` key exists in 4.x** (`reporters.d.DtoKVV2s.d.ts:2831`; not `poolOptions`), and it
  reaches the Worker. But Node **refuses** a heap flag there: `new Worker(…, { execArgv: ["--max-old-space-size=300"] })`
  → `ERR_WORKER_INVALID_EXEC_ARGV`. So this route crashes the worker. It does not cap it.
- `vmMemoryLimit` applies to `vmThreads` / `vmForks` only (`getMemoryLimit` returns `null` for other pools,
  `cli-api…js:3839-3840`). It is also a recycle threshold, not a cap. **It is not usable here.**
- **Fallback, observed:** `NODE_OPTIONS=--max-old-space-size=600` gave the main isolate a `heap_size_limit` of
  696 MiB. Workers with `execArgv` undefined or `[]` got the same 696 MiB. The flag is process-wide, so the main
  process and its workers **cannot be given different limits** this way.
- Spawned children:
  - Children of `cli.test.ts`, `history-pane` and `transposition` inherit `process.env`, so they inherit
    `NODE_OPTIONS`.
  - **`CLI_DEEP` children get an empty environment.** It is pinned at `src/cli.real-engine.test.ts:300`
    (`Object.keys(CHILD_ENV)` is `[]`), so `NODE_OPTIONS` cannot reach them without breaking that pin.
- **The `INPUT_DEEP` collision:** its `AGENTS.md` command sets `NODE_OPTIONS=--expose-gc`. That **replaces** any
  `NODE_OPTIONS` the limit relies on.

## Acceptance criteria

**CPU**
- **`C1`.** **Given** the merged tree, **when** the default lane runs, **then** `ABC-144` `A7` and `ABC-152` `V3`
  pass and their `describe` blocks are byte-identical to `6cfc1be9`.
- **`C2` (serial children).** **Given** every `src/**/*.test.ts` source, **when** a default-lane row scans it
  (in process, no spawn), **then** no file calls the asynchronous `node:child_process` forms (`spawn`, `exec`,
  `execFile`, `fork`).
  - A build that adds one fails this row.
  - Non-vacuity: the row asserts that it found ≥ 4 synchronous call sites.

**Memory**
- **`A1` (step 1, first).** **Given** the installed vitest version, **when** the SE reads its `dist/`, **then** the
  page records one of two answers, with file:line:
  - **(a)** a non-`poolOptions` key that sets worker `resourceLimits`; or
  - **(b)** "none".

  On (a), the Architect rules that the key passes `A7` before it is used. On (b), the fallback is a heap flag
  inherited per process, verified per isolate by `A4`-`A6`.
- **`A2` (the budget).** **Given** the Architect's addendum, **then** the page carries the budget table:
  - one row per isolate kind, each with `heap_size_limit` in MiB and a count live at once;
  - the stated sum is ≤ 2048 MiB;
  - every row has a number. None reads "default".
- **`A3` (every lane carries it).** **Given** each lane command as `AGENTS.md` spells it after this ticket,
  **when** it runs, **then** the limit applies.
  - This is shown by an **armed red** on three lanes: the default lane, `CLI_DEEP` and `INPUT_DEEP`. With the
    mechanism removed, each exits non-zero, and the red names the probe.
  - The remaining lanes are shown green if they share the default lane's mechanism. If the mechanism is
    command-borne, a static row asserts every lane line in `AGENTS.md` carries it.
- **`A4` (applied in a worker).** **Given** any lane, **when** a test runs, **then** `worker_threads.isMainThread`
  is `false` and `v8.getHeapStatistics().heap_size_limit` is ≤ the table's worker row (in bytes).
  - A build that leaves the limit unapplied fails. On this hop's machine such a build reads about 4192 MiB.
- **`A5` (applied in the main process).** **Given** any lane, **when** the run starts, **then** the main process's
  `heap_size_limit` is read **in the main process** and is ≤ the table's main row. Above the row, the run exits
  non-zero. Where it is read from is the Architect's choice.
- **`A6` (applied in children).** **Given** each Node spawn site (`cli.test.ts` `childOf`, `history-pane.nfr`,
  `transposition`, `cli.real-engine`), **when** a probe child is launched with exactly that site's env and
  node-option construction, **then** it reports `heap_size_limit` ≤ the table's child row.
  - `CLI_DEEP`'s `CHILD_ENV` stays `{}`.
  - `cli.test.ts`'s `N8_SPAWN` (27) moves only by a re-pin that this page states.
- **`A7` (nothing runs out of memory).** **Given** the cap, **when** the SE runs every lane listed in `AGENTS.md`,
  **then** each one returns its current pass and skip counts, and no lane exits with a heap out-of-memory error.
  The counts include: gates green, `CLI_DEEP` 10/10, `PERFT_DEEP` 32/32 and `LADDER_DEEP=1` short mode.
  - Peak `heapUsed` per lane is recorded. It is an observation, not a gate.
  - An out-of-memory error goes to the owner (Q4). It does not trigger a silent raise of the limit.

**Fences and pins**
- **`A8`.** The diff names every pin it touches. Each pin is either green and unchanged, or re-pinned in the same
  diff with the reason stated (§ Pins touched).
- **`A9` (NFR-008).** **Given** the merged tree, **when** QE reads the lane by `ADR-0035`'s instrument, **then**
  `npm test` wall is ≤ 10 s at load1 ≤ 8, and CPU is reported.
  - A breach goes to the owner (Q4).
  - **The "≤ 3 s" wall in the brief is the struck pre-2026-10-10 level.** The live level is R-1, 10 s.

## Pins touched (name each one; none is a drive-by)

| pin | where | effect |
|---|---|---|
| `ABC-144` `A7` | `src/cli.test.ts:3536` | must stay byte-identical and green. A new config key is allowed only if `A7` still passes |
| `ABC-152` `V3` | `src/cli.test.ts:3571` | byte-identical, green |
| `ABC-042` `A10` `SCRIPTS_AT_HEAD` | `src/cli.test.ts:1759-1801` | **red if `scripts.test` changes** (byte pin). `A7`'s comment says this pin closes the CLI-flag route. A `NODE_OPTIONS` prefix needs a re-pin as a ruling |
| `run-bounded.js` header | `tools/grugops/run-bounded.js:9-10` | quotes `scripts.test` verbatim. Update it if `scripts.test` moves |
| `ABC-119` `CHILD_ENV` / `CHILD_ARGS` | `src/cli.real-engine.test.ts:91-92, 297-300` | env stays `{}`. A heap flag must go in as a node option before the entry point, not in `CHILD_ARGS` |
| `N8_SPAWN` = 27 | `src/cli.test.ts:1950` | moves if `A6` adds a child through `childOf` |
| `ADR-0008` | decision 7 (isolation), pinned at `src/cli.test.ts:3555` | unchanged. The addendum adds the memory ceiling |
| `vitest.config.ts` header block | the `maxWorkers` / `viteModuleRunner` paragraphs | gains one memory paragraph. The existing text stays |
| `AGENTS.md` lane lines | `:69-:135`. Note that `ABC-164` reports `AGENTS.md` is at its byte budget | the `INPUT_DEEP` line and any command-borne mechanism |

## Staleness (recorded, accepted)

**`ABC-146` `A0`'s staleness rule fires.**
- The page's list (`ABC-146` line 326) names `vitest.config.ts` and "the vitest or node version". The owner-word
  note adds `package.json`. This ticket treats a change to either file as firing it.
- This is acceptable because the owner's levels re-cut (`…b2e6d4a9`, ticket **`ABC-174`**) re-measures anyway.
- **Ordering:** `ABC-174` should take its readings after `ABC-173` merges. A reading taken before the merge is
  stale on arrival.

## NFR triggers

- `NFR-008` / `N8-LANE` (`ADR-0035`): the change re-bases the lane for every later ticket.
- Memory target: Σ `heap_size_limit` ≤ 2048 MiB.
- CPU target: ≤ 2 busy executors at once.

## Architect first (recommendation)

**Yes. Write a short `ADR-0008` addendum before the SE.** It rules on:
1. where the limit lives, so that every lane carries it (`A3`);
2. the budget table (`A2`);
3. the `INPUT_DEEP` `NODE_OPTIONS` collision;
4. how the `CLI_DEEP` child gets its flag under the `CHILD_ENV` pin;
5. whether a setup entry in `vitest.config.ts` is allowed under the rule that `A7`'s import loads nothing at run
   time;
6. `N8-LANE` admissibility: whether `ADR-0035` needs a fresh baseline reading at the merge.

## Dependencies

- The `ADR-0008` addendum (Architect).
- Owner answers Q1-Q4, or "accept recommendations".
- **Merge-order conflict risks** (soft):
  - `ABC-172` (rename) also edits `package.json`;
  - `ABC-171` is in flight.
- `ABC-174` follows this ticket.

## Test notes

- **Armed reds** (each one watched red, then reverted):
  - remove the mechanism → `A4` / `A5` red;
  - move the flag into vitest `execArgv` → the worker dies with `ERR_WORKER_INVALID_EXEC_ARGV` (a loud red);
  - put the mechanism in `package.json` only, then run `npx vitest run` directly → `A3` red;
  - drop the `CLI_DEEP` child flag → `A6` red;
  - add a `spawn(` → `C2` red;
  - raise one row above the table → `A4` red.
- Probes assert where they run (`isMainThread`), so they cannot pass vacuously.
- No probe asserts a figure that depends on the machine, apart from the table's ceilings.

## Owner questions

- **Q1.** Is "2 GB" the summed V8 heap limit (≤ 2048 MiB), with RSS reported but not gated? macOS cannot cap
  RSS. *Recommend: yes.*
- **Q2.** Does "2 cores" mean 2 busy test executors, with vitest's main thread counted as overhead? The
  alternative is a hard 2.0-core total, which needs `maxWorkers: 1` and overrides his own heat pick.
  *Recommend: yes, 2 executors.*
- **Q3.** Does the cap cover all of the `AGENTS.md` vitest lanes, not only the five named in the note?
  *Recommend: yes.*
- **Q4.** Which one gives way in each case?
  - A lane runs out of memory under its share. Does the limit go up, or does the lane get fixed?
  - `npm test` wall goes past `NFR-008`'s 10 s. Does the cap give way, or the bar?

  *Recommend: neither moves without his word. Each is reported to him.*

## DoR (9/10, held in Backlog)

| check | |
|---|---|
| problem clear | ✓ |
| scope / out-of-scope | ✓ |
| INVEST | ✓ S. It is independent of `ABC-174`, which waits on it |
| G/W/T testable + measurable | ✓ `C1`-`C2`, `A1`-`A9` |
| dependencies known | ✓ |
| NFR triggers + targets | ✓ 2048 MiB, 2 executors, `NFR-008` 10 s |
| test notes | ✓ |
| size | ✓ S |
| priority | ✓ P1 |
| no major unresolved blocker | ✗ The `ADR-0008` addendum and Q1/Q2 (the meaning of the bar) are open |
