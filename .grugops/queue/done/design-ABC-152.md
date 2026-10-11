---
task: wave-2026-09-25
subtask: design-ABC-152
role: architect-design
ticket: plans/tickets/ABC-152-upgrade-vitest-to-4-1-and-run-src-without-the-module-runner-with-every-mock-and-spy-guard-still-armed.md
ref: .grugops/context/design-ABC-152/
enqueued_by: orchestrator
enqueued_at: 2026-10-11T00:00:00Z
base: grugops/wave-2026-09-25
---

# Subtask: design-ABC-152

Write the new ADR for the vitest 4.1 + `viteModuleRunner: false` route (ADR-0041 route (a)) per the ticket's D1–D4: two-arm correctness screen of mock/spy guards, RISK-ABC143-01 (result-file reporter), maxWorkers/isolate semantics on 4.x (ADR-0040, ADR-0008 d7), lane collect-equality, the pre-registered split (→ owner). Read vitest 4.1 in a scratch tree only — never change package.json/lockfile on a shared branch. No timing reads (other hops run). Commit on grugops/design-ABC-152 from the wave; never merge.
Use a git worktree (symlink node_modules; remove the symlink before removing the worktree). Use /usr/bin/diff.
Three hops run in parallel (Architect ABC-151, Architect ABC-152, SE ABC-149): no timing readings.
