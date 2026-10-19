---
type: decision
role: orchestrator
task: wave-2026-09-25
at: 2026-10-19T11:30:00Z
sealed: false
refs: [ABC-144, ABC-151, ADR-0008, NFR-008, ABC-173]
---

# Owner word, 2026-10-19: cap vitest at 2 CPU cores and 2 GB of memory

The owner's word, verbatim:

> *"vitest needs to be capped to max 2 cpu cores and 2GB of memory"*

## What is already in place
- `vitest.config.ts` already sets `pool: "threads"` and `maxWorkers: 2`.
- That cap came from ABC-151, on the owner's word, and `src/cli.test.ts` `ABC-144 A7` pins it by value.
- So **CPU** is already capped at 2 test workers. The vitest main thread runs on top of those 2 workers.
- **Memory is not capped.**

## What the word asks for
- A 2 GB memory ceiling for this repo's vitest runs.
- Confirmation that the 2-core cap covers every lane that uses vitest in this repo:
  - the default lane;
  - `CLI_DEEP`, which also spawns real-engine children;
  - `PERFT_DEEP`;
  - `ENGINE_DEEP`;
  - `LADDER_DEEP`.

## Facts that shape the ticket
- **macOS has no cgroups,** so no in-repo setting can enforce a hard total of 2 GB.
- The workable mechanism is per-process heap limits that sum to 2 GB or less: the main process plus 2 worker threads, and any spawned children. On Node this means `--max-old-space-size` for processes and `resourceLimits` for worker threads.
- **It is UNKNOWN whether vitest 4.1.11 exposes worker-thread `resourceLimits` without `poolOptions`.** `poolOptions` is forbidden by `ABC-144 A7`. This must be verified.
- `vitest.config.ts` and `package.json` are on ABC-146's staleness list. Changing either makes the ladder verdict stale for any re-take.
  - That is acceptable here: the owner's levels re-cut, `…b2e6d4a9`, re-measures the ladder anyway.
- The change will move the N8-LANE baseline (NFR-008, ADR-0035).
- **Scope:** this caps only this repo's vitest. The owner's other projects need their own setting.

**Routed to:** BA/PM cuts **ABC-173**. The levels re-cut ticket takes the next id after it.
