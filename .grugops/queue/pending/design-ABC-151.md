---
task: wave-2026-09-25
subtask: design-ABC-151
role: architect-design
ticket: plans/tickets/ABC-151-heat-the-owner-picks-two-test-workers-lower-the-cap-3-to-2-re-pin-it-and-read-wall-and-heat.md
ref: .grugops/context/design-ABC-151/
enqueued_by: orchestrator
enqueued_at: 2026-10-11T00:00:00Z
base: grugops/wave-2026-09-25
---

# Subtask: design-ABC-151

Write the ADR-0040 addendum recording the owner's k = 2 (note `…fbbdde16` item 3): pin value 2, env may lower never raise, isolate on, the ticket's window plan (wall + R ≤ 10 s, CPU interval < 0, two 27-run head-only heat sequences k = 2 vs k = 3, no bar). No readings. Commit on your branch grugops/design-ABC-151 from the wave; never merge.
Use a git worktree (symlink node_modules; remove the symlink before removing the worktree). Use /usr/bin/diff.
Three hops run in parallel (Architect ABC-151, Architect ABC-152, SE ABC-149): no timing readings.
