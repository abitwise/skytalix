---
task: wave-2026-09-25
subtask: design-ABC-144
role: architect-design
ticket: plans/tickets/ABC-144-npm-test-chokes-the-macbook-air-m3-cut-its-cpu-and-cap-its-cores.md
ref: .grugops/context/design-ABC-144/
enqueued_by: orchestrator
enqueued_at: 2026-10-11T00:00:00Z
branch: grugops/design-ABC-144
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: design hop for `ABC-144`, the owner's P1 to stop `npm test` choking the MacBook Air M3

The ticket page is the contract (DoR 10/10, In Design). The BA/PM notes are under `.grugops/context/bapm-batch-2026-10-11/notes/`.
`ADR-0008` (d7: `isolate: false` stays forbidden) and `ADR-0035` bind.

## Produce
1. **A trade-off table of the pool and worker settings that can deliver the page's bars:** CPU ≤ 0.85× base, ≤ 4 workers, wall ≤ 10 s unless the owner accepts a new number, and `isolate` true. Columns: setting, expected CPU and wall effect, evidence (recorded readings only), risk. Include options that address heat and lag in case "choking" means those to the owner. That is BA/PM's open question 1, so make the table answer it.
2. **A recommended setting**, written as an ADR (PROPOSED), plus the value check that holds it. The value check is never a timing.
3. **The measurement plan for the quiet window:** what to run, how many runs, warm and cold, and how to log load1. It must be runnable later by Security/NFR or the Engineer at width 1.

## Fences
- **Take no timing or CPU measurements now.** Two Engineer builds are running `npm test` in parallel. Use recorded readings only, and name every reading the plan still owes.
- Do not touch `src/`, `package.json`, `vitest.config.ts`, `plans/board.md` or `AGENTS.md`. Do not merge or push.

## Publish
Publish notes per Workflow 16 into `ref:` and a trace row at the END of `plans/traceability.md`. Move the queue file pending → claimed → done by hand, in the main
checkout, uncommitted.
