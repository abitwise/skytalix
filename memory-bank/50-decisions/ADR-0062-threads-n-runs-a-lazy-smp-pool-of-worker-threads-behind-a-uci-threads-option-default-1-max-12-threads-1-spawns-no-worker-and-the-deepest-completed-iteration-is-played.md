---
kind: adr
id: ADR-0062
---
# ADR-0062: `Threads N` runs a Lazy SMP pool of `worker_threads` behind a UCI `Threads` spin option, default 1, max 12. `Threads 1` spawns no worker and is today's engine. Above it every worker searches, and the deepest completed iteration is played

## Status

**PROPOSED** 2026-11-02 by Architect/Design (task `arch-ABC-266`, records plus scratch probes, on
`grugops/arch-ABC-266` from `main` `22b38478`). Nothing in `src/`, the tests, `tools/`, `plans/` or the board moved.
Every probe figure below is a count or a property; no clock was read.

- **What it amends.** `ADR-0044` D3 (the `uci` and `setoption` rows gain `Threads`), D5 (one thread, no worker) and
  D6's "not in v1" row for `Threads`. D8 gains the worker entry in the emit set. Nothing else in `ADR-0044` moves.
- **Acceptance.** The D5 reversal is pre-accepted by the owner (`ADR-0057` OQ-1 *"1 yes"*, `orch-2026-10-30a`
  `…81ae2db4`). The text of this ADR is still reported to him (`ABC-266` § Dependencies). Two parts go further than
  `ADR-0057` § Inputs named, so the Architect asks for acceptance by name rather than reading OQ-1 as covering them:
  - **D6, the played result:** the deepest completed iteration among the workers, not worker 0's (`ADR-0057` § Inputs
    recommended worker 0's). The reason is the probe in § Context.
  - **D1, the maximum:** 12, or 8 if the owner wants the host left room. It is his choice; 12 is recommended.
- **The answer that settles it:** *"accept ADR-0062 (max 12)"*, *"accept ADR-0062 with max 8"*, or *"decline"*.
- **Reading (b)** (the `ABC-208` / `ABC-237` / `ABC-265` precedent): the build of `ABC-266` may start while this is
  PROPOSED. **The merge waits on his acceptance**, on `ABC-265`'s merge, and on `ABC-266` A7.
- **Default without an answer:** `ADR-0044` D3 and D5 stand as written, and `ABC-266` is not merged.
- **If `ABC-266` does not merge** (A7 NOT MET, F4), a dated line here reads "accepted, not in force on `main`"
  (`ADR-0026` decision 9's form).
- **Source.** `ADR-0057` (ACCEPTED 2026-11-02) D2.2, D4, § Inputs for the thread tickets (column TH-2 and the four
  choices left to this ADR); the `ADR-0025` amendment of 2026-11-02 (PROPOSED), which leaves the clear-versus-stop
  order and the worker's adoption of the buffer to this ADR (`arch-ABC-265` `…e396e5ab`, item (c)).
- **`ABC-267` folds into `ABC-266`** (D13). Its rows join `ABC-266`'s acceptance, with one case added and one seam
  dropped.

## Context

### What is fixed before this ADR

- **Lazy SMP over one lockless shared table** (`ADR-0057` D2.1–D2.3, accepted). The table is `ABC-265`'s: four `Uint32`
  words a slot over one `SharedArrayBuffer`, the XOR check, the verified copy for `tableCutoff`, and `tableBuffer()`
  as the handle (`ADR-0025` amendment of 2026-11-02, PROPOSED; built on `grugops/ABC-265` `cad6ae13`, in QE).
- **The stop flag is a `SharedArrayBuffer` slot read through the injected clock** (`ADR-0044` D5's pre-design:
  `now = () => (stopped ? Infinity : Date.now())`). The clock is consulted every `NODES_PER_CLOCK_CHECK` (1 024)
  nodes, so the engine's abort path needs no edit.
- **The owner's standing answers:** OQ-2 (a), one game at a time and every routine read at `Threads 1`; OQ-3 (c), the
  40/15 claim read at both thread counts; OQ-4 (a), `NFR-009` counts retained growth summed over workers, with the table
  once.
- **Today's session is synchronous.** `go` runs `chooseMove` inside `handleLine`
  (`src/uci-session.ts`), and input waits in the pipe. `chooseMove` clears the table at entry (`src/engine.ts`,
  `deepen`). Its `elapsedMs` is `now()` at return minus `now()` at entry.
- **`Position` is a plain object** (a `Uint8Array` board and five numbers or booleans, `src/position.ts:30-42`). The
  prior keys are a `bigint[]`. Both pass through `postMessage` by structured clone, exactly.

### The probe (`measured (informal)`, scratch only, counts and properties, no clock read)

A `git archive` of `grugops/ABC-265` `cad6ae13` (`src/`, `package.json`, `tsconfig.json`) under the session scratch
directory, never a worktree. Two scratch edits: an `adoptTable(buffer)` in `transposition.ts` (D4's form) and, for the
diversity rows only, a depth offset in `deepen`'s loop. Scripts imported the scratch `src/` by absolute path. Every run:
`flock host-test.lock timeout 280 node …`, Node v26.12.1, host `oeselg-dev`. The scratch copy was deleted at hop end.

| id | what it ran | window (UTC, 2026-11-02) |
|---|---|---|
| PR-1 | a 4-worker pool: identity, worker 0's nodes to a fixed depth with k = 2, 4 helpers (none / odd helpers one ply deeper), a stale stop slot, memory per isolate after `gc()`, clean exit | 15:45:31–15:46:36 |
| PR-2 | the depth each worker completes inside 1 000 000 nodes, k = 1, 2, 4, both diversity forms, four positions | 15:47:12–15:48:25 |
| PR-3 | PR-2 with a deeper-entry cutoff rule (`ADR-0058`'s direction; scratch only) | 15:48:52–15:49:43 |
| PR-4 | PR-1's nodes-to-depth on four positions, exact rule and deeper-entry rule | 15:49:59–15:51:40 |
| PR-5 | `heap_size_limit` of a worker isolate under the lanes' heap flags and under `resourceLimits` | queued from ≈ 15:52, done 15:58:13 (it waited on other hops' runs) |
| PR-6 | PR-5 under process-wide V8 heap flags (`--max-old-space-size`, `--max-semi-space-size`) | queued from ≈ 16:00, done 16:13:08 |

**Results.**

- **The pool works as designed.** A worker that adopts the main thread's buffer, with the main thread clearing it,
  searches node for node like `chooseMove` on the main thread: **3 of 3** positions equal in move, score and nodes
  (kiwipete d8 1 575 537, position-6 d8 124 683, start d9 230 719). Every helper stopped through the slot returned a
  legal move. **36 of 36** multi-worker runs held every property. 4 workers were constructed for the whole run, 0 error
  events, 0 bad exits, and the process exited 0 after `terminate()`.
- **Two traps, both shown.** A helper stopped through the slot reports `elapsedMs` = `Infinity` (its clock reads
  `Infinity` at return). A search that starts with the slot already set completes depth 1 only, legal, with
  `elapsedMs` = `NaN`. D5 and D6 handle both.
- **Helpers barely shorten worker 0's path to a depth.** Worker 0's nodes to complete a fixed depth, as a ratio to the
  same search alone (two or three repetitions each):

  | position, depth | k = 2 | k = 4 | k = 4, odd helpers +1 ply | k = 4, deeper-entry rule |
  |---|---|---|---|---|
  | kiwipete d8 | 0.959–0.996 | 0.868–0.989 | 0.985–0.991 | 0.891–0.953 |
  | position-6 d10 | 0.986–0.994 | 0.911–0.953 | 0.920–0.993 | 0.942–1.069 |
  | start d10 | 0.993–1.406 | 0.895–0.949 | 1.104–1.746 | 1.182–1.300 |
  | position-4 d9 | 0.988–0.998 | 0.992–0.995 | 0.993–0.994 | 0.982–0.991 |

  The deeper-entry column is helpers with no offset. Inside 1 000 000 nodes a worker, worker 0 reached the same depth
  as alone in **64 of 64** runs (32 in PR-2, 32 in PR-3). A helper went one ply deeper in 2 of the 64.
- **Why.** Every worker runs the same deterministic search, so the workers walk the same tree in near lockstep. Under
  the exact-depth hit rule (`ADR-0025` decision 2; `ADR-0058` is accepted, not in force), an entry cuts only at the
  remaining depth it was stored at. So a helper's entry helps worker 0 only when the helper is slightly ahead in the
  same place. A helper one ply deeper stores entries at a depth worker 0 never asks for.
- **Memory per isolate after `gc()`** (PR-1): the main thread's `arrayBuffers` read 4 732 091 B, which includes the
  4 194 304 B table. Each worker's read 537 811 B, Node's own buffers, without the table. So the shared table shows
  only in the isolate that allocated it. `heapUsed` is per isolate (10.05–10.06 MB in each worker). `rss` is the
  process's, the same figure in every isolate. `--expose-gc` reaches the workers.
- **A worker inherits the lane's heap flag** (PR-5). Under `--max-old-space-size=400` a worker's `heap_size_limit`
  reads 496 MiB, as the main thread's does. Under 128 it reads 224 MiB. `resourceLimits.maxOldGenerationSizeMb` is
  overridden by the flag. Only a young-generation limit lowers it (48 old + 8 young → 412 MiB under the 400 flag).
- **What this does not show.** Nothing here reads strength or time. A count of nodes to a depth is not the depth
  reached in a time when workers run at different speeds. That is the point of D6 and of the timing probe in D12.

### The core-speed fact this ADR leans on (`documented` in `ADR-0057`, `measured (informal)` there)

- A slow (Zen 5c) core runs a search at 0.61 of a fast one (SP1b). At 12 workers in one process the slowest worker
  runs at 0.55–0.74 of the fastest (SP1). The OS places the workers.
- So at `Threads 12` worker 0 runs on a slow core more often than not. With worker 0's move played and helpers that
  barely shorten its path (PR-1 to PR-4), `Threads 12` can play shallower than `Threads 1`, which a quiet host runs on
  a fast core. D6 picks the deepest completed iteration to remove that.

## Decision

### D1. The `Threads` option (amends `ADR-0044` D3 and D6)

- **`uci`** writes one more line, after the `TimeMode` line and before `uciok`:
  `option name Threads type spin default 1 min 1 max 12`. Every other line is byte-identical. The maximum is one named
  constant, `MAX_THREADS` = 12, one per physical core (`ADR-0057` D2.4). With the owner's "max 8" it is 8, and nothing
  else in this ADR changes.
- **`setoption name Threads value <v>`** takes `<v>` only if it is the canonical decimal of an integer from 1 to
  `MAX_THREADS` (`String(n) === v`; so `07`, `+2` and `2.0` are refused). Any other value, an absent one included,
  keeps the old value and writes one line: `info string Threads takes an integer 1-12, got <v>; kept <old>` (`<v>` is
  `nothing` when absent). This is `Skill Level`'s rule and spelling (`ADR-0044` D3). The name matches
  case-insensitively, as every option does.
- `ucinewgame` does not reset it. **`Threads` leaves D3's "any other name is ignored" list.** `Hash`, `MultiPV`,
  `UCI_Chess960` and `UCI_AnalyseMode` stay on it. A GUI that sends `Threads` unconditionally (Lichess's provider)
  now sets it; a value above 12 is refused and kept at the old one.
- **D6's row** "UCI options `Hash`, `Threads`, …": `Threads` is brought in by the owner's OQ-1 and this ADR.
- **Security (ASVS L1).** One new value parsed from UCI input, matched against 12 strings. No other input path.

### D2. `Threads 1` is today's engine, and `Threads` governs only the search path

- **`Threads 1` spawns no worker.** `go` runs `chooseMove` inside `handleLine`, in the main thread, as today. The
  session's code path at `Threads 1` is today's, line for line, so `G4` is node-equal by construction, every UCI and
  CLI lane passes unedited apart from D1's one line, and `AR-UCI-BUSY` reads as today.
- **`Threads` applies only where `chooseMove` is called today:** the rate-0 path (levels 5–7 under `TimeMode level`,
  and `simple-tournament` and `uci-clock-mode`). A book move needs no search. Levels 1–4 play through `createLevel`
  in the main thread at every `Threads` value, with no message: `LEVELS`, their budgets and their blunder draw do not
  move (`ABC-266` § Out of scope).
- **The terminal game is unchanged** (`ADR-0044` D7). `src/cli.ts` never imports the pool, and it has no `Threads`.
- **Deterministic mode** (`ADR-0027`) holds at `Threads 1` only. A `Threads ≥ 2` row asserts properties, never nodes
  or a move (`ADR-0057` D4's `G4` row).

### D3. `Threads k ≥ 2`: k search workers, and the main thread searches nothing

- **k `worker_threads` workers, one search each per `go`.** Each worker has its own module state, so its own killers,
  history, key array and verified copy (`ADR-0057` D2.2). Only the table is shared.
- **The main thread** reads input, writes output, owns the table and the stop slot, and chooses the result. It never
  searches at `Threads ≥ 2`. So `isready` and `stop` are answered during a search (D7), the side gain `ADR-0044` D5
  named.
- **The pool lives from `setoption` to `setoption`.** `setoption name Threads value k`:
  - k ≥ 2 and different from the current value: close the old pool, spawn k workers. The session is *starting*
    until every worker has posted that it is online (its imports done, its table adopted).
  - k = 1: close the pool. No worker is left.
  - the same value: nothing.
  So a GUI's `isready` after its `setoption` lines absorbs the start-up. cutechess-cli 1.5.1 sends `uci`, the
  `setoption` lines, then `isready`, and waits for `readyok`. It also sends `isready` before every `go` (read from
  `-debug all` logs of earlier reads on this host). A `go` that arrives first waits, and its budget still counts from
  its own arrival (D5 step 5).
- **What a worker receives for a `go`:** the held `Position` and its prior keys (structured clone, exact), the
  budget, the `go` line's arrival time on the main thread's clock, `maxDepth` and `maxNodes`, as D12 of `ADR-0044`
  computes them today. It learns its index once, at spawn.
- **Helper diversity: none in this build.** Every worker runs the same search. They diverge only through timing and the
  table. In the probe, odd helpers one ply deeper bought nothing measurable under either hit rule (PR-1 to PR-4). The
  index reaches every worker, so a diversity rule later is a change to the worker entry alone. Its triggers are in D12.

### D4. How a worker adopts the table (answers the `ADR-0025` amendment's open item)

- **The main thread allocates.** The pool calls `clearTable()` once before it spawns, so the buffer exists, then hands
  `tableBuffer()` to each worker once, in its `workerData`. No worker allocates a table.
- **A worker calls `adoptTable(buffer)` once, at start-up, before any search.** It is a new export of
  `src/transposition.ts`, production code on the worker path. Its contract:
  - it binds this thread's view to the given buffer;
  - from then on, **`clearTable()` in this thread resets only the verified copy** (`hitSlot = −1`) and never touches
    the buffer, so a worker's `chooseMove` cannot wipe what the others store;
  - it throws on a buffer whose byte length is not `TABLE_ENTRIES × 16`, so the slot mask stays a constant.
  - The main thread never calls it. So at `Threads 1` no line of `transposition.ts` runs differently, and `G4` holds.
- It is not an `EngineOptions` field and not a hook the recursion reads (`ADR-0026` decision 2's rejections, as the
  `ADR-0025` amendment requires of the handle). Its name is the Engineer's; the contract is this ADR's.

### D5. One search at `Threads ≥ 2`, in order (the clear and the stop)

1. **The pool is idle:** every worker has posted its result for the previous `go`. A worker writes the table only
   inside `chooseMove`, and posts after `chooseMove` returns, so after its post it writes nothing.
2. **The main thread clears the whole buffer** (`clearTable()` in the owning thread).
3. **It resets the stop slot:** `Atomics.store(stop, 0, 0)`.
4. **It posts the `go` to every worker.**
5. **Each worker runs** `chooseMove(position, { budgetMs: max(1, budget − (Date.now() − goAt)), now: stopClock,
   priorKeys, maxDepth?, maxNodes? })`, where `stopClock = () => (Atomics.load(stop, 0) !== 0 ? Infinity :
   Date.now())`. It posts its move, score, completed depth and nodes.
6. **On the first result, the main thread sets the slot:** `Atomics.store(stop, 0, 1)`. Every other worker aborts at
   its next clock check, at most `NODES_PER_CLOCK_CHECK` nodes later (≈ 1–2 ms at 0.5–0.9 M nodes/s a worker,
   `estimate`), and posts its deepest completed iteration.
7. **When all k results are in,** the main thread chooses (D6), writes the `info` line and the `bestmove` (or holds
   it, D7), and the pool is idle again.

Why this order holds:

- **No worker writes while the table is cleared** (step 1 before step 2). The `ADR-0025` amendment's rule, "after every
  worker of the previous search has stopped writing", is step 1.
- **No worker of the new search writes before the clear.** The clear (2) is sequenced before the reset (3), a
  sequentially consistent `Atomics.store`. Every worker's first act in `chooseMove` is `now()`, an `Atomics.load` of the
  slot. Every search ends with the slot at 1 (step 6), so a load that reads 0 reads step 3's store, and the clear
  happens-before the worker's search.
- **A stale stop cannot leak in.** The slot is reset only while the pool is idle. A `stop` that lands between steps 3
  and 5 is a real stop: the worker completes depth 1 and returns a legal move (PR-1's stale-stop row).
- **The budget is the `go` line's.** Each worker subtracts the time since the main thread received the `go`, so a
  worker that starts late spends no more wall time than `Threads 1` would. Every worker gets the same budget, depth and
  node limits. `go nodes x` bounds each worker's own count; the `info` line reports the sum (D6).
- **Time limits are untouched.** The clamp (`HARD_CEILING_MS`), each mode's ceiling and `AR-NFR004-A` hold per worker,
  as today, because each worker runs today's `chooseMove`. `NFR-004`'s 1 024-node check holds in every worker by the
  same code.
- **No `Atomics.wait` anywhere.** Workers wait for a `go` on their message port. The main thread never blocks.

### D6. The played result, and the `info` line

- **Played: the deepest completed iteration among the k results; on a tie, the lowest worker index.** Each worker
  returns only completed iterations (`ABC-078` `A3`), so any of them is a full search of its depth from this position
  by today's engine.
  - **Why not worker 0's, as `ADR-0057` § Inputs recommended.** The probe found that helpers barely shorten worker 0's
    path (§ Context). The OS can place worker 0 on a slow core at 0.55–0.74 of the fastest. Played alone, worker 0
    could then play shallower than `Threads 1`. The deepest result follows the fastest worker, and that is what the
    hardware read (A7) is meant to read.
  - **Why not a vote** (Stockfish's best-thread rule, depth and score weighted). It needs a tuned weighting this engine
    has never read. The deepest-completed rule has no constant.
- **The `info` line:** `depth`, `score` and `pv` come from the played result. `nodes` is the sum over the k workers.
  `time` is the main thread's clock from the `go` line's arrival to the last result. `nps` is
  `round(nodes × 1000 / max(1, time))`. **A worker's own `elapsedMs` is never printed:** it reads `Infinity` or `NaN`
  after a stop (PR-1). At `Threads 1` the line is today's.
- `bestmove 0000` when no position is held or it has no legal move, as today, and decided before any worker is asked.

### D7. The session while the pool is busy (amends `ADR-0044` D5)

- **Two busy states at `Threads ≥ 2`: *starting* and *searching*.** While busy, input lines queue in arrival order
  and run, in order, when the pool is idle again, as today's pipe holds them. Four exceptions:
  - **`isready` while *searching* with an empty queue:** `readyok` at once, within `AR-UCI-BUSY`'s bound. Otherwise it
    queues, so a `readyok` never overtakes an earlier command. While *starting* it queues and is answered when every
    worker is online.
  - **`stop`** sets the slot (D5 step 6). The `bestmove` follows when every result is in. One `bestmove` per `go`
    holds. A `stop` after the `bestmove` is ignored, as today.
  - **`ponderhit`** is `stop`, as in v1.
  - **`quit`** is `stop`, then the `bestmove`, then the pool closes and the session ends. End of input is `quit`.
    Today's order, "the search's `bestmove`, then the quit", is kept.
- **`go infinite` / `go ponder`.** The workers search to the budget D4.1 gives (`HARD_CEILING_MS`, 60 s). A result that
  arrives with no `stop` is held, as D4.3 says today. `stop` releases it. A `stop` during the search marks the answer to
  be written, not held.
- **At `Threads 1`** nothing here applies. `isready` and `stop` during a search are answered at most one budget late,
  D5's folded bounds, as today.
- **`handleLine` stays synchronous.** At `Threads ≥ 2` a `go` returns at once, and the pool calls the session back
  with the results.

### D8. Where the code goes (amends `ADR-0044` D2's file list and D8's emit set)

- **`src/search-pool.ts`** (main thread): spawns the workers, owns the stop slot, runs D5's order, chooses D6's
  result, closes. **`src/search-worker.ts`** (the worker entry): adopts the table, runs `chooseMove` with the stop
  clock, posts results. File names are the Engineer's.
- **`src/uci-session.ts` stays capability-free.** It takes the pool as an optional injected capability. `src/uci.ts`
  binds the real one, as it binds the streams and the clock (`ADR-0044` D2, `ADR-0011` clause 4). A test binds a
  fake. **With no pool injected, `Threads` parses and prints, and every `go` runs in the main thread**, so every
  existing session test runs unedited.
- **The worker's URL.** `tsc`'s `rewriteRelativeImportExtensions` rewrites import specifiers, not a string inside
  `new URL()`. So the pool names the worker file with its own module's extension: `.ts` under `npm run uci`, `.js` in
  `dist/`. **`tsconfig.build.json`'s `files` gains the worker entry**, because nothing imports it and D8's emit set is
  what `uci.ts` imports. `dist/` then holds `uci.js`, what it imports, and the worker entry with what it imports. The
  read's `artifacts.txt` hashes the whole `dist/`, so it picks the new file up. No test row pinning the emit list was
  found (read, not run); any that exists re-pins with old and new figures (ticket test note 4).
- **Close.** `src/uci.ts` closes the pool on every end path: `quit`, end of input, `EPIPE` and a fault. Closing
  terminates every worker. Workers are also `unref()`'d, so a missed close cannot hold the process open.

### D9. Faults

- **A worker `error` event, a `messageerror`, or an `exit` the pool did not ask for** is a fault. So is a `Worker`
  constructor that throws at `setoption`, and an exception in the session's result callback.
- **A fault ends the session the way an escaped exception does today:** `src/uci.ts` writes its fixed `internal
  error` line to stderr, sets exit code 70, closes the pool and ends (`ADR-0016` clause 2: still three exit codes).
  No `bestmove` is invented.
- **No fallback to `Threads 1`.** A silent fallback would hide the defect `ABC-266` A3 counts ("no worker `error`
  event or non-zero `exit`").

### D10. `NFR-009` at `Threads ≥ 2` (OQ-4 (a))

- **The reading.** Retained growth after `gc()`, `heapUsed` and `arrayBuffers`, summed over the main thread and every
  worker. Each isolate is read before its first search and after a 1 s and a 4 s search.
  - **Level:** the sum of each isolate's growth over its pre-search reading, plus the table, ≤ 16 MiB.
  - **Growth clause:** the summed growth from the 1 s to the 4 s search ≤ 1 MiB in each field.
  - Each worker's V8 baseline heap (≈ 10 MB in use after `gc()`, PR-1) is its pre-search reading, so it sits outside
    the bound, as OQ-4 (a) rules.
- **The table counts once by construction.** The buffer is allocated in the main thread, and only that isolate's
  `arrayBuffers` shows it (PR-1). The main thread's pre-pool reading must be taken before the pool's first
  `clearTable()`, so the 4 MiB is counted in the main thread's growth and nowhere else.
- **The channel.** A worker answers one `memory` message with `process.memoryUsage()` after `gc()` when `gc` is
  exposed. It reads a count and holds no capability. Its form is the Engineer's.
- **The line `NFR-009`'s row needs** (Security/NFR places it; this ADR does not edit the catalog):
  *"At `Threads ≥ 2` (`ADR-0062` D10, OQ-4 (a)): retained growth summed over the main thread and every search worker,
  after `gc()`; each worker's pre-search heap is outside the level; the shared table is counted once, in the main
  thread that allocates it."*

### D11. The test lanes (`NFR-008`, `NFR-010`)

- **The default lane holds no real worker.** A worker isolate inherits the lane's heap flag (PR-5). The suite shape is
  already at 2 016 of `NFR-010`'s 2 048 MiB (9 isolates × 224 MiB). One more isolate of 224 MiB breaks it. So
  `ABC-267` A4's "at most one 2-worker row" is settled at **zero**, which its "at most one allows zero" provides. The
  default lane carries only fake-pool rows: D7's queue, `isready`, `stop`, `quit` and the fault path, synchronous and
  pure. `N8-LANE` is still read before and after (`G8`), and `NFR-008`'s 10 s bar is unchanged.
- **The deep lane is new, `THREADS_DEEP=1`**, one file (recommended `src/uci.threads.test.ts`):
  `THREADS_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/uci.threads.test.ts`.
  - It does not ride on `ENGINE_DEEP`, so an `ENGINE_DEEP` run never takes up to 12 cores unasked, and QE schedules it
    with the host ALONE.
  - **Every real-worker row runs in a Node child:** the engine, `node <flags> src/uci.ts`, for the property, `stop`
    and `isready` rows (the `UCI_DEEP` precedent, `ABC-168`; a child is the shipped shape, and its exit code and its
    having no thread left are read directly), and a small fixture script for the memory reading (D10) and the stress
    (D13, A8), each spawning its own workers. No real worker runs inside a vitest isolate, where it would inherit the
    lane's 496 MiB.
  - **The child's flags are fixed: `--max-old-space-size=48 --max-semi-space-size=8`** (plus `--expose-gc` for the
    memory fixture). A process-wide V8 flag reaches every worker (PR-6), so each isolate's `heap_size_limit` reads
    72 MiB. The child and 12 workers are 936 MiB.
  - **`NFR-010`'s one-file shape** is main and one vitest worker at 496 MiB each, plus two Node children at 496 MiB
    each: 1 984 MiB. The threads child takes the two children's 992 MiB: 936 ≤ 992, and the lane's total is 1 928 MiB
    ≤ 2 048. One child runs at a time. The level does not move. The row for this shape is Security/NFR's to place.
  - **The owner's 2-core rule.** *"vitest needs to be capped to max 2 cpu cores"* is held today by `maxWorkers: 2`
    (`NFR-010`: "CPU is not this row's"). A `Threads 4` or `Threads 12` child uses 4 or 12 cores for its rows. That is
    the owner's to rule (owner question 2). **Without an answer, the deep lane's standing rows stay at `Threads 2`**
    (two busy cores). Then `Threads 4` and `Threads M` play only in A7's 100 games, and A5 and `G5` at `Threads M` and A8 at
    W = 12 are read once by QE out of tree, with the same fixtures and flags, host ALONE.

PR-6's figures (`heap_size_limit` of the child's main thread and of each worker, MiB; the sums are the child plus k
workers) and the fit inside the one-file shape's 992 MiB:

| child flags | child main | each worker | k = 2 | k = 4 | k = 12 | most workers inside 992 |
|---|---|---|---|---|---|---|
| `--max-old-space-size=32` | 128 | 128 | 384 | 640 | 1 664 | 6 |
| `… =32 --max-semi-space-size=4` | 44 | 44 | 132 | 220 | 572 | 21 |
| `… =32 --max-semi-space-size=8` | 56 | 56 | 168 | 280 | 728 | 16 |
| **`… =48 --max-semi-space-size=8`** (chosen) | **72** | **72** | **216** | **360** | **936** | **12** |

The chosen row gives each worker 48 MiB of old generation against ≈ 10 MB in use after `gc()` (PR-1). It holds 12
workers, and so `MAX_THREADS`. A smaller semi-space only changes GC work inside a test child; production keeps V8's
defaults (§ Alternatives).

### D12. The `ABC-266` read, its harness, and one probe before the build

- **`d` cannot set `Threads` today.** `cutechessArgs` (`tools/rating/rating.ts`) gives skytalix `st=`,
  `timemargin=`, `restart=on`, its stderr, and `option.Skill Level` for `rpair` only. `d` sends no option (read, not
  run). So `ABC-266` scope 5 is owed.
- **Scope 5, the smallest change:** `d` takes `--threads N`, checked as text against `^([1-9]|1[0-2])$` (1–12). It
  adds `option.Threads=N` to the candidate side (`name=skytalix`) only. The base side gets nothing, so it plays at the
  default `Threads 1`. `machine.txt` records `threads: skytalix N, base 1`, and `--dry-run` prints it. `r` and `rpair`
  do not take it. It is harness configuration: no engine path is keyed on it (R-TC part 1). `tools/` only.
- **N = M = 12** (8 if the owner sets max 8). Pre-registered on `ABC-266`'s page at Ready.
- **The read, exactly** (QE, host ALONE, `CUTECHESS_CLI` and `STOCKFISH` set as for every read):
  `node tools/rating/rating.ts d <candidate-sha> <candidate-sha> <out-dir> --budget-ms 100 --rounds 50 --concurrency 1 --threads 12`.
  - The same build on both sides: `d` builds each side in its own clone and refuses neither SHA twice (read, not
    run). 50 rounds is 100 games, openings 1–50 with both colours, at `st=0.1` and `timemargin=50`.
  - `--concurrency 1` is required: `d`'s default is 3, and OQ-2 (a) is one game at a time.
  - With `restart=on`, each game starts a fresh engine, so the pool starts 100 times. cutechess-cli sends the
    `setoption` lines, then `isready`, and waits for `readyok` before the game (D3: the start-up is absorbed there).
  - Core-seconds for the N side are N × wall (`ADR-0057` D4), reported with the wall figures.
- **Beside it, at `Threads 1`:** S′ as `ABC-266` A7 states it (`r <candidate> <out> --budget-ms 500 --rounds 5
  --concurrency 1`; `r` takes no `--threads`) and the Levels deep lane. Neither moves.
- **One timing probe before the build is recommended** (the Orchestrator's to schedule; ≤ 15 min, host ALONE).
  - **Why.** PR-1 to PR-4 say helpers barely help worker 0, and the A7 bar is GAIN (≥ 50.0 of 100). If `Threads 12`
    plays at about the depth of `Threads 1`, A7 reads about 50 and fails about half the time by noise. F4 says a miss
    is not re-played. One probe can say which way it leans before 15–35 h are spent.
  - **What.** This hop's scratch pool, rebuilt from `ABC-265`, plays `go movetime 100` and `go movetime 1000` on 20
    positions of the `ABC-078` `A3` corpus at `Threads 1`, 4 and 12. It records the played depth and which worker
    supplied it.
  - **Reading.** If `Threads 12`'s played depth is not above `Threads 1`'s on the median at 100 ms, the Architect
    re-proposes before the build: helper diversity (D3), or `ADR-0058`'s deeper-entry rule at `Threads ≥ 2` only, each
    with its own probe. Otherwise the build goes ahead as written. It is a probe, not a gate, and it is not A7.

### D13. `ABC-267` folds into `ABC-266`

- **Ruling: fold.** `ABC-266` is the merge that creates several writers. The race guard should land with the race.
  `ABC-267`'s A3 is `ABC-266` A5's instrument made standing. Its A1 widens `ABC-266` A3. One QE hop reads both.
  `ABC-266` stays L (≈ 20–45 h, `estimate`: its 15–35 h plus `ABC-267`'s 5–10 h).
- **The rows, as they join `ABC-266`** (BA/PM writes them on the page):
  - **A3 (properties)** takes `ABC-267` A1's form: `Threads` ∈ {2, 4, M}, every position of the `ABC-078` `A3`
    corpus, `go movetime 200`, in `THREADS_DEEP`. Rows above the fit or the owner's 2-core answer (D11) are read
    through A7 instead.
  - **A5 (`NFR-009`)** is a standing `THREADS_DEEP` row, read as D10 says.
  - **A8 (new; `ABC-267` A2), the multi-writer stress,** in `THREADS_DEEP`. W writer workers, W = 4 and W = 12 (W = 2
    under the default answer to owner question 2), run from a fixture child with D11's flags, each adopting the
    production table (D4), store and probe 4 096 keys chosen to fall into 1 024 slots of the 2^18-slot table. Each key's depth, score and move are functions of the key.
    At least 10 M probes a run.
    - **Bars:** undetected corrupt hits = 0, meaning a hit whose `tableCutoff` does not return its own key's score.
      Torn slots observed > 0 (SP2 read 0.69 % at 4 writers, 2.6 % at 12).
    - **The case added here, probe-then-cutoff:** for every hit, the writer calls `tableCutoff(slot, depthOf(key),
      −∞, +∞, 0)` and checks that it returns `scoreOf(key)`. It then re-reads word 2 of the slot. **Bar: slots
      overwritten between the probe and the cutoff > 0, and corrupt cutoffs = 0.** It shows the `ADR-0025` verified
      copy (T10) under real concurrency.
    - Reported: probes, hits, torn slots and their fraction, slots overwritten in the window.
  - **`ABC-267` scope 5 (a 2^10-slot test seam) is dropped.** Keys chosen into 1 024 slots give the same contention on
    the production table at its production size, so no test-only export is needed.
  - **`ABC-267` A4 (the default lane) is settled at zero rows** (D11). The before and after figures are still read.
  - **`ABC-267` A5 (determinism)** joins `ABC-266` A6 as a source row: no default-lane row asserts a node count or a
    move at `Threads ≥ 2`.
- **F2 of `ABC-267`** stays: a corrupt hit or a corrupt cutoff is a defect in `ABC-265`'s check or copy, routed back.
  F3 stays: torn slots = 0, or overwrites in the window = 0, is an instrument defect, reworked before it is read.

## Alternatives

- **The main thread is worker 0 and searches in place, with k − 1 helpers.** Rejected. It keeps `handleLine` blocked,
  so `isready` and `stop` are answered a budget late at `Threads ≥ 2` too, and the D5 side gain is lost. It also puts
  the played search on the main thread's core, wherever that is.
- **`Threads 1` as one worker.** Rejected: it moves the default product's path, its timing and `AR-UCI-BUSY`, for no
  gain at one thread (`ADR-0057` § Inputs).
- **Worker 0's move is played** (`ADR-0057` § Inputs' recommendation). Rejected on the probe (D6).
- **Helper diversity now** (odd helpers one ply deeper, or a permuted root order). Rejected for this build: the probe
  saw no measurable effect under either hit rule, and a root permutation edits `src/engine.ts`. Kept as the first lever
  after D12's probe.
- **Every worker clears the table at its own `chooseMove` entry** (today's code unchanged). Rejected: a late worker
  wipes what the others stored mid-search, and a clear racing a store leaves torn slots on purpose.
- **An `EngineOptions` field that skips the clear.** Rejected: `ADR-0026` decision 2 and the `ADR-0025` amendment keep
  table plumbing out of the engine's options.
- **The main thread enforces the budget with a timer that sets the slot.** Rejected: two clocks for one budget. Each
  worker's own deadline, counted from the `go` line, is today's rule in every worker.
- **Spawn the pool at each `go`.** Rejected: every move would pay the start-up, at 100 ms a move.
- **On a worker fault, fall back to `Threads 1`.** Rejected (D9).
- **`resourceLimits` on every production worker to fit `NFR-010`.** Rejected for production: the lane's flag overrides
  the old-generation limit anyway (PR-5), and a young-generation limit in play would change GC work the hardware read
  measures. The fit is made on the test child's flags instead (D11).
- **A `Threads` value from `os.availableParallelism()`.** Rejected: the `uci` output would depend on the host, and the
  option-list rows would not be fixed.

## Consequences

- **`ADR-0044`:** D3, D5 and D6's `Threads` row, and D8's emit set, as above, effective at `ABC-266`'s merge. A dated
  pointer goes in its § Status. The "Amendment coming" line there is now answered.
- **`AR-UCI-BUSY`:** unchanged at `Threads 1`. At `Threads ≥ 2`, `isready` and `stop` during a search are answered
  within its bound: at once for `isready` with an empty queue, and within one clock interval plus the slowest
  worker's post for `stop`. Security/NFR re-reads it at the gate.
- **`NFR-004`:** each worker runs today's `chooseMove`, so the 1 024-node check and every ceiling hold per worker.
  `G5` at `Threads 1` and at `Threads M` (A2, A6).
- **`NFR-005`:** `G6` at `Threads 1`; nothing on that path moves.
- **`NFR-008`:** no real worker in the default lane; fake-pool rows only (D11).
- **`NFR-009`:** read as D10. The line in D10 goes to Security/NFR to place.
- **`NFR-010`:** the deep lane's engine child fits inside the one-file shape's child allowance (D11's table). A row for
  the threads child goes to Security/NFR, inside the 2 048 MiB level. The level does not move.
- **AGENTS.md:** the UCI time-mode line ("`isready` and `stop` mid-search answer up to one budget late (no worker)")
  holds at `Threads 1` only after the merge. A new `THREADS_DEEP` command line and the `Threads` option line are owed
  to the scribe at the merge.
- **Migration:** none. Nothing is persisted, and the default is `Threads 1`.
- **Risks, named:**
  - A7 reads near 50 if the pool adds little depth (D12's probe exists for this).
  - A worker on a slow core is slower, and readings move with host load. A7 is read with the host ALONE.
  - More than 12 workers in one process lose (`ADR-0057` D2.4, cause `UNKNOWN - verify`). The maximum stays at 12.
  - A worker's start-up under `restart=on` is paid once a game, at `isready`. Its size is not read here
    (`UNKNOWN - verify`, read by A3's bound and A7's 0 losses on time).

### Falsifiers

| # | clause | what would falsify it | how to check |
|---|---|---|---|
| **P1** | D2: `Threads 1` is today's engine | any `G4` mismatch at `Threads 1`, or an edited UCI or CLI row beyond D1's line | `ABC-266` A2 |
| **P2** | D5: the clear and the stop are ordered | a corrupt cutoff, or a table entry from the previous `go` hit in a new one | `ABC-266` A8; a source row on D5's order |
| **P3** | D6: the played result is a completed iteration | an illegal `bestmove`, or a depth in the `info` line no worker completed | `ABC-266` A3 |
| **P4** | D7: one `bestmove` per `go`; `isready` and `stop` answered during a search | a second or missing `bestmove`, or `readyok` / `bestmove` later than `AR-UCI-BUSY`'s bound at `Threads ≥ 2` | `ABC-266` A4 |
| **P5** | D9: a fault exits 70, and every end path closes the pool | a worker left running after `quit` or end of input, or a fault that writes a `bestmove` | `ABC-266` A3 and a fault-injection row on the fake pool |
| **P6** | D10: the table counts once | the summed reading counts 4 MiB more than once, or misses it | `ABC-266` A5 |

P1 firing is a defect (`ABC-266` F2). P2–P6 firing is a defect, back to the Engineer. A7 NOT MET is `ABC-266` F4: not
merged, and this ADR reads "accepted, not in force".

## Rollback

- **Before acceptance:** mark this ADR `withdrawn`. `ADR-0044` D3 and D5 stand, and the pointer lines go with it.
- **After `ABC-266` ships:** set `Threads` to 1 (the default) and the product is today's. A full rollback reverts
  `ABC-266`'s one ticket: `Threads 1` is node for node the same before and after, so no move changes. The `uci` output
  loses one line, and the session lanes re-pin it.
- `ABC-265`'s table stays either way. It is node for node today's at one writer.
