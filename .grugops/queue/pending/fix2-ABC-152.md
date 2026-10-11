---
task: wave-2026-09-25
subtask: fix2-ABC-152
role: software-engineer
ticket: plans/tickets/ABC-152-upgrade-vitest-to-4-1-and-run-src-without-the-module-runner-with-every-mock-and-spy-guard-still-armed.md
ref: .grugops/context/fix2-ABC-152/
enqueued_by: orchestrator
enqueued_at: 2026-10-12T00:00:00Z
branch: grugops/ABC-152-vitest-4-1-runner-off (tip 5eafe95c)
base: 91024242
---

# Subtask: one comment-only commit per ADR-0042 addendum 3 ruling 12 (note `…840a7403` on main).

Replace ONLY line 6 of src/cli.test.ts with the exact text in the note. Line 5 unchanged; no line added/removed;
`expect(` stays 324; no other file. Show `git diff -U0 HEAD~1`, lint green, `npm test` 56/1741 (own worktree with
its own `npm ci`; remove the worktree after). Commit on the ticket branch; never merge. Use /usr/bin/diff.
