---
subtask: bapm-cut-ABC-173
role: ba-pm
ticket: ABC-173 (new)
branch: grugops/bapm-cut-ABC-173 (from main, current tip)
worktree: ../wt-bapm-cut-ABC-173
ref: .grugops/context/bapm-cut-ABC-173/
---

# Cut ABC-173: cap this repo's vitest at 2 CPU cores and 2 GB memory (owner word `…c4a8e1f6`)

Read the owner-word note first; it has the facts. Then cut **one XS/S ticket**, ABC-173, with Given/When/Then criteria that a wrong build fails.

## What the ticket must cover
1. **CPU.**
   - Keep `maxWorkers: 2` and the ABC-144 A7 pin.
   - State which vitest lanes and spawned children count against "2 cores".
   - Rule whether a lane that spawns children (`CLI_DEEP`) must serialise its child processes.
2. **Memory, a 2 GB ceiling.**
   - There is no hard cap on macOS. Choose the mechanism: per-process and per-worker heap limits whose sum is 2 GB or less. Say how the budget splits between the main process, 2 workers, and any children.
   - Say where the limit lives. Options: `package.json` scripts and `NODE_OPTIONS`; a vitest config key; worker `resourceLimits`. `poolOptions` is forbidden, and so is anything else that breaks ABC-144 A7 or ABC-152 V3.
   - **Whether vitest 4.1.11 has a non-`poolOptions` way to set worker-thread `resourceLimits` is UNKNOWN.** Make verifying it the ticket's first step. Give a fallback if it has none, for example `NODE_OPTIONS=--max-old-space-size` inheritance, verified per worker.
   - Add a criterion that proves each limit is **applied**, not just configured. For example, a probe test reads `v8.getHeapStatistics().heap_size_limit` in a worker. A wrong build must fail it.
3. **Fences and pins.** Name every existing pin the change touches:
   - ABC-144 A7 and ABC-152 V3 in `src/cli.test.ts`;
   - the ADR-0008 text;
   - the `vitest.config.ts` comment block.
4. **NFR-008 / ADR-0035.** N8-LANE moves. Say whether the change needs an Architect ruling first. Recommend whether a short Architect addendum to ADR-0008 goes before the SE, and name the owner question if the lane's ≤ 3 s wall bar is at risk.
5. **Staleness.** Record that ABC-146's A0 staleness list (`vitest.config.ts`, `package.json`) fires. That is acceptable, because the levels re-cut re-measures anyway. The levels re-cut ticket will be ABC-174.

Run the DoR score. Board placement is the Orchestrator's job.

## Fences
- Records only: the new ticket page and notes.
- Do **not** touch:
  - `src/`
  - `vitest.config.ts`
  - `package.json`
  - `plans/board.md`
  - `plans/traceability.md`
  - `../wt-ABC-171`
  - `../wt-arch-levels-recut`
- Never push or merge.
- Run no timing readings.

## Handoff
Write `.grugops/queue/done/bapm-cut-ABC-173.md` and `.claim.md` in main's working tree, uncommitted, with:
- the commit;
- the page path;
- the criteria summary;
- the Architect-first recommendation;
- the owner questions;
- the DoR;
- a trace row.
