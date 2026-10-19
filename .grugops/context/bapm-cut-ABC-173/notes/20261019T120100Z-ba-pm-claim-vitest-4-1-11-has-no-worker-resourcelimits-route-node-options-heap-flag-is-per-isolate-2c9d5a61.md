---
id: 20261019T120100Z-ba-pm-claim-vitest-4-1-11-has-no-worker-resourcelimits-route-node-options-heap-flag-is-per-isolate-2c9d5a61
kind: claim
by: ba-pm
task: bapm-cut-ABC-173
at: 2026-10-19T12:01:00Z
verified_by:
confidence: UNKNOWN - verify
refs:
  - ABC-173
  - ABC-144
  - node_modules/vitest/dist/chunks/cli-api.CnMVyzaz.js
  - node_modules/vitest/dist/chunks/reporters.d.DtoKVV2s.d.ts
---

# vitest 4.1.11 offers no worker resourceLimits route; the Node heap flag is process-wide and applies per isolate

**Status: a claim.** It is not load-bearing until `ABC-173` `A1` re-runs it. No timing was read.

## vitest (static reading of node_modules/vitest 4.1.11)
- `ThreadsPoolWorker.start()` is at `cli-api.CnMVyzaz.js:3229`. It calls
  `new Worker(entrypoint, { env, execArgv, stdout, stderr })`, with no `resourceLimits`.
- Searching `dist/` for `resourceLimits` returns 0 hits.
- The top-level `execArgv` key exists (`reporters.d.DtoKVV2s.d.ts:2831`), and it is not `poolOptions`.
- `vmMemoryLimit` applies only to `vmThreads` / `vmForks` (`cli-api…js:3839-3840`). It is a recycle threshold.

## Node probe (Node v26.11.1, scratch directory, outside the repo)
- With no flag: main 4192 MiB, worker 4192 MiB.
- With `NODE_OPTIONS=--max-old-space-size=600`: main 696 MiB, and workers (`execArgv` undefined or `[]`) also
  696 MiB.
- With worker `execArgv: ["--max-old-space-size=300"]`: `ERR_WORKER_INVALID_EXEC_ARGV`.

## Repo facts
- `CLI_DEEP`'s `CHILD_ENV` is pinned to `{}` (`src/cli.real-engine.test.ts:300`).
- The `INPUT_DEEP` lane command sets `NODE_OPTIONS=--expose-gc`, which replaces any inherited `NODE_OPTIONS`.
- `scripts.test` is byte-pinned by `ABC-042` `A10` (`src/cli.test.ts:1777`).
