---
task: wave-2026-09-25
subtask: bapm-cut-k2-vitest41
role: ba-pm
ticket: (new) — next free ids from plans/board.md
ref: .grugops/context/bapm-cut-k2-vitest41/
enqueued_by: orchestrator
enqueued_at: 2026-10-11T00:00:00Z
branch: grugops/bapm-cut-k2-vitest41 (create from grugops/wave-2026-09-25)
base: grugops/wave-2026-09-25
---

# Subtask: cut two owner-asked tickets (owner word note `…fbbdde16` in .grugops/context/wave-2026-09-25/notes/).

1. **k = 2 (heat).** Owner: "Heat 2 workers is fine". Lower `vitest.config.ts` `test.maxWorkers` 3 → 2, value pin → 2
   (env may lower, never raise), `isolate` stays on; ADR-0040 addendum (Architect) records the owner's k = 2; AGENTS.md
   worker-cap line updated (102 B headroom); timing re-read at width 1 (Window A had 2w at −22.7 % CPU, 8.2 s wall vs
   W = 10 s; Window B showed moderate thermal at k = 3 under back-to-back runs — read thermal at k = 2 the same way,
   ideally a head-only back-to-back sequence). Small; likely no Architect design beyond the addendum.
2. **vitest 4.1 upgrade.** Owner: "vitest - yes do a ticket and upgrade". Route from ABC-147/ABC-150/ADR-0041:
   vitest 4.1 `viteModuleRunner: false` to remove the ~5x module-runner interop cost (up to ~1/3 of lane CPU). In scope:
   the major bump, the 47 mock/spy tests the runner change affects, RISK-ABC143-01 (result-file reporter on a major
   bump), the ABC-144 pin (maxWorkers semantics on 4.x), ADR-0008 d7 (isolate), lane collect-equality. Needs an
   Architect design hop + ADR first. Sequence after the k = 2 ticket (both touch vitest.config.ts).

Also note on the ABC-146 / ABC-095/096 rows nothing changes. Write ticket pages under plans/tickets/ with testable
criteria and DoR; add Backlog/Ready rows on YOUR branch's plans/board.md copy is NOT allowed — instead list the exact
rows in your report and the Orchestrator places them. Never merge or push.
