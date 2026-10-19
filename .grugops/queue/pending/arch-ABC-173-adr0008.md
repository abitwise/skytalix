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
