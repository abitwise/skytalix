---
task: wave-2026-09-25
subtask: qe3-ABC-152
role: qe-e2e
ticket: plans/tickets/ABC-152-upgrade-vitest-to-4-1-and-run-src-without-the-module-runner-with-every-mock-and-spy-guard-still-armed.md
ref: .grugops/context/qe3-ABC-152/
enqueued_by: orchestrator
enqueued_at: 2026-10-12T00:00:00Z
branch: grugops/ABC-152-vitest-4-1-runner-off (tip 3c55b965)
base: 91024242
---

# Subtask: confirm 3c55b965 per ADR-0042 addendum 3 ruling 12 (note `…840a7403` on main).

Only: the commit is comment-only, replaces exactly src/cli.test.ts line 6 with the ruled text, line 5 unchanged,
`expect(` 324, no other file. Close QE-152-i. Read-only (git show / git diff); no worktree needed. Record a short
note under .grugops/context/qe3-ABC-152/notes/ in the main checkout, uncommitted. Use /usr/bin/diff.
