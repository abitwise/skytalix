---
id: 20261019T150000Z-architect-design-observation-abc173-heap-probe-counts-and-limits-4e81d0b6
kind: observation
by: architect-design
at: 2026-10-19T15:00:00Z
verified_by:
confidence: high
sealed: false
task: wave-2026-09-25
subtask: arch-ABC-173-adr0008
refs: [ABC-173, ADR-0008, node_modules/vitest/dist/chunks/cli-api.CnMVyzaz.js]
---

# Scratch probes for the `ABC-173` heap ceiling: counts, exit codes and limits only, no timing

**Scope.** The tree was `3468f054` via `git archive`, in a scratch directory outside the repository. Node v26.11.1,
vitest 4.1.11. The full record is `.grugops/context/arch-ABC-173-adr0008/probe/RUN.txt`.

- **The flag and the limit.** `--max-old-space-size=F` gives `heap_size_limit = F + 96` MiB on every reading.
  128 → 224 and 400 → 496.
- **Workers.**
  - A worker shares the process-wide flag: `execArgv: []` under `--max-old-space-size=128` reads 224.
  - A heap flag in a worker's `execArgv` throws `ERR_WORKER_INVALID_EXEC_ARGV`.
  - `resourceLimits` appears in 0 files of vitest's `dist/`.
- **Default lane, 2 runs (flags 240 and 128).** Each run: exit 0, 59 files, 1915 passed. Peak live count:
  - at most 4 worker `Worker` objects at once (an upper bound);
  - at most 2 Node children at once (29 child starts);
  - a total peak of 6, excluding the lane's own npm: wrapper + main + 2 workers + 2 children.
- **Lanes at 224 MiB:**
  - `PUZZLE_DEEP`: exit 1, "Worker exited unexpectedly", 2 of 2 runs;
  - quiescence 37, transposition (ENGINE) 26, transposition (SEARCH) 40, `ZOBRIST_DEEP` 33;
  - `INPUT_DEEP`: 34 with `--expose-gc` and 33 without;
  - `CLI_DEEP` 10, with the flag in argv in the scratch copy;
  - coverage 1915.
- **`PUZZLE_DEEP` across flags:** 18 passed at 256, 292, 336, 496, 996 and at the default. Red at 224.
- **Lanes at 496 MiB:** `SEARCH_DEEP` `search.test.ts` 57, `PERFT_DEEP` 32.
- **`globalSetup`:**
  - it runs on the main thread;
  - `state.getPaths().length` reads 1, 5 and 59;
  - a throw gives exit 1 with no test run;
  - `provide`/`inject` reaches the workers;
  - the armed red goes red: 2 files at the 496 flag against row 224.
- **`.npmrc`.** npm `set-envs.js:102-104` replaces `NODE_OPTIONS` for every npm command. `tsc --noEmit` at 224 MiB
  gives heap out of memory, exit 134.
- **Not run:**
  - `ENGINE_DEEP` `engine.test.ts` and `levels.test.ts`;
  - `LADDER_DEEP`;
  - `SEARCH_DEEP` `search.pvs-lmr.test.ts`.

  These belong to the SE's `A7`.
