---
task: wave-2026-09-25
subtask: scribe-ABC-151-k2
role: agents-md-scribe
ticket: plans/tickets/ABC-151-heat-the-owner-picks-two-test-workers-lower-the-cap-3-to-2-re-pin-it-and-read-wall-and-heat.md
ref: .grugops/context/scribe-ABC-151-k2/
enqueued_by: orchestrator
enqueued_at: 2026-10-11T00:00:00Z
branch: grugops/scribe-ABC-151-k2 (create from main)
base: main
---

# Subtask: AGENTS.md worker-cap line 3 → 2 (ABC-151 merged; ADR-0040 addendum 2).

Change the worker-cap bullet's `test.maxWorkers: 3` → 2, `VITEST_MAX_THREADS` ≤ 3 → ≤ 2, cite addendum 2 only if it
fits (24,474 B, budget 24,576 B). Run lint, typecheck, `npx vitest run src/cli.test.ts`. Commit on your branch; never merge.
