---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-149
role: software-engineer
ticket: plans/tickets/ABC-149-the-result-file-reporters-exit-code-check-is-pinned-by-no-plant.md
ref: .grugops/context/ticket-to-pr-ABC-149/
enqueued_by: orchestrator
enqueued_at: 2026-10-11T00:00:00Z
base: grugops/wave-2026-09-25
---

# Subtask: ticket-to-pr-ABC-149

Build ABC-149 per its page (reporter exit-code / run-arm plants, QE-143-a/-b). Branch grugops/ABC-149-reporter-plants from the wave. Run all gates; show each plant red then removed. Never merge.
Use a git worktree (symlink node_modules; remove the symlink before removing the worktree). Use /usr/bin/diff.
Three hops run in parallel (Architect ABC-151, Architect ABC-152, SE ABC-149): no timing readings.
