---
task: wave-2026-09-25
subtask: design-ABC-152-qe152i
role: architect-design
ticket: plans/tickets/ABC-152-upgrade-vitest-to-4-1-and-run-src-without-the-module-runner-with-every-mock-and-spy-guard-still-armed.md
ref: .grugops/context/design-ABC-152-qe152i/
enqueued_by: orchestrator
enqueued_at: 2026-10-12T00:00:00Z
branch: grugops/ABC-152-vitest-4-1-runner-off (tip 5eafe95c)
base: main
---

# Subtask: rule QE-152-i (QE gap register `…e0c0d051` on the ticket branch).

src/cli.test.ts line 6 ("nothing here re-routes the module graph") is stale since 88009d0b. Rule: extend ruling 10
(one comment-only SE commit at that line, exact replacement text given by you) or a follow-up. Also say whether
QE-152-j changes RISK-ABC152-SPY-QUERY's wording. Rulings only, nothing measured; record a short note + ADR-0042
line on a branch grugops/design-ABC-152-qe152i from main in your own worktree; never merge. Use /usr/bin/diff.
