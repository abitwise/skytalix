---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-152
role: software-engineer
ticket: plans/tickets/ABC-152-upgrade-vitest-to-4-1-and-run-src-without-the-module-runner-with-every-mock-and-spy-guard-still-armed.md
ref: .grugops/context/ticket-to-pr-ABC-152/
enqueued_by: orchestrator
enqueued_at: 2026-10-11T00:00:00Z
branch: grugops/ABC-152-vitest-4-1-runner-off (create from main)
base: main
---

# Subtask: build ABC-152 per the page (V1–V8, V12's 0-production-lines part) and the ADR-0042 addendum's build plan.

Follow the addendum's build plan (`…80a214d3`, `…f9b73048`, probe `.grugops/context/design-ABC-152-owner-route/probe/`):
bump (no --force), runner key, pin, reporter + plant block in one commit, test rework one commit per form with
`expect(` counts, V4 plants (STOP and report on any guard that cannot be armed by an admitted form — never delete,
skip, move or weaken a test). Your worktree needs its OWN `npm ci` (no node_modules symlink — that would be 3.2.7);
never touch the main checkout's node_modules. No timing reads (V9–V11 are Security/NFR's width-1 window). Run all
gates. Commit on your branch; never merge. Use /usr/bin/diff.
