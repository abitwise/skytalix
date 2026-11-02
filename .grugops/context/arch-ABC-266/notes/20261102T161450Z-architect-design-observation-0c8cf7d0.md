---
id: 20261102T161450Z-architect-design-observation-0c8cf7d0
kind: observation
by: architect-design
at: 2026-11-02T16:14:50Z
verified_by: 
confidence: high for the counts and properties (scratch, reproducible); informal, not a reading; no timing
refs:
  - ABC-266
  - arch-ABC-266
  - grugops/arch-ABC-266
  - 22b38478
  - dd834f90
  - EPIC-011
  - ABC-265
  - cad6ae13
  - ADR-0057
  - ADR-0025
  - ADR-0058
  - NFR-009
  - NFR-010
  - src/transposition.ts
  - src/engine.ts
  - tools/rating/rating.ts
supersedes: 
seal: sha256:50e7044809d20e1bc5569db0814488b8541982c37ee2a8ff778a36d5f3634783
---

# ABC-266 design probe: the pool mechanics hold; helpers barely shorten worker 0's path; the table shows only in the allocating isolate; workers inherit the lane's heap flag

Architect/Design, task `arch-ABC-266`. Scratch `git archive` of `grugops/ABC-265` `cad6ae13` (`src/`, `package.json`, `tsconfig.json`) under the session scratch directory, never a worktree; deleted at hop end. Scratch edits only: `adoptTable(buffer)` in `transposition.ts` (a borrowing thread's `clearTable` resets only the verified copy) and, for diversity rows, a depth offset in `deepen`'s loop; PR-3/PR-4 also a scratch deeper-entry rule behind an env var. Every run `flock host-test.lock timeout ≤280 node …`, Node v26.12.1, host oeselg-dev. Counts and properties only; no clock was read as a figure.

- **PR-1 (15:45:31–15:46:36Z), the pool.** 4 workers, each `adoptTable(main's tableBuffer())`; main `clearTable()` before each go, `Atomics.store(stop,0,0)`, post; on worker 0's result `Atomics.store(stop,0,1)`; wait all.
  - Identity: a worker alone equals main-thread `chooseMove` in move, score, nodes on 3/3 (kiwipete d8 1 575 537; position-6 d8 124 683; start d9 230 719).
  - Properties: 36/36 multi-worker runs legal at the required depth; every slot-stopped helper legal with `elapsedMs` = Infinity (trap). Stale stop slot at entry: depth 1, legal, `elapsedMs` NaN (trap). 4 Worker constructions, 0 `error`, 0 bad `exit`, process exit 0 after `terminate()`.
  - Memory after `gc()`: main `arrayBuffers` 4 732 091 B (includes the 4 194 304 B SAB); each worker 537 811 B (no SAB); `heapUsed` per isolate 10.05-10.06 MB; `rss` process-wide (same in all). `gc` is a function in workers under `--expose-gc`.
- **Worker 0 nodes to a fixed depth, ratio to alone** (PR-1, PR-4 15:49:59–15:51:40Z; exact rule / scratch deeper-entry rule): kiwipete d8 k2 0.959-0.996, k4 0.868-0.989; position-6 d10 k4 0.911-0.953; start d10 k2 0.993-1.406, k4 0.895-0.949; position-4 d9 0.982-0.998; odd helpers +1 ply 0.920-1.746; deeper-entry rule 0.891-1.300. No setting gives a consistent reduction.
- **Depth inside 1 000 000 nodes a worker** (PR-2 15:47:12–15:48:25Z exact rule; PR-3 15:48:52–15:49:43Z deeper-entry rule): worker 0 reached alone's depth in 64/64 runs, 32 each (kiwipete 7, position-6 10, start 10, position-4 9); a helper went one ply deeper in 2/64.
- **PR-5 (queued from ~15:52Z, done 15:58:13Z), worker `heap_size_limit`:** no flag: main 4192 MiB, worker 4192; `resourceLimits` old 32 → 128, old 48 + young 8 → 60, old 64 → 160. Under `--max-old-space-size=400`: main 496, worker 496, old 32 → 496, old 48 + young 8 → 412, old 64 → 496. Under 128: 224 / 224 / 224 / 140 / 224. So a worker inherits the process-wide flag, which overrides `maxOldGenerationSizeMb`.
- **PR-6 (queued from ~16:00Z, done 16:13:08Z), process-wide V8 flags, main / worker `heap_size_limit` (MiB):** `--max-old-space-size=32` 128/128; `=32 --max-semi-space-size=4` 44/44; `=32 --max-semi-space-size=8` 56/56; `=48 --max-semi-space-size=8` 72/72. A process-wide flag reaches every worker. The last one fits a child + 12 workers in 936 MiB, inside NFR-010's one-file child allowance (992 MiB).
- **Read, not run:** cutechess-cli 1.5.1 sends `uci`, the `setoption` lines, then `isready`, and waits for `readyok`; it also sends `isready` before every `go` (earlier reads' `-debug all` logs in the session scratch). `tools/rating/rating.ts` `cutechessArgs` gives skytalix no `Threads` option; `d` builds each side in its own clone and refuses neither SHA twice.
- **What it does not show:** strength or time. Node counts to a depth are not depth in a time when workers run at different speeds.
