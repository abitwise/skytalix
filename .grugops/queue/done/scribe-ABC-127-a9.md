---
task: wave-2026-09-25
subtask: scribe-ABC-127-a9
role: agents-md-scribe
workflow: agent-factory/workflows/04-ticket-to-pr.md (Scribe's pen: AGENTS.md)
ticket: plans/tickets/ABC-127-harder-puzzles-catch-the-surviving-weakenings-and-leave-headroom.md
ref: .grugops/context/scribe-ABC-127-a9/
source_refs: .grugops/context/ticket-to-pr-ABC-127/ (claim …6341cc47 — drafted line)  .grugops/context/secnfr-ABC-127/ (quiet readings …6a3b6274)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T10:30:27Z
branch: grugops/ABC-127-harder-puzzles (commit on top of 4c09b5c in worktree .claude/worktrees/ABC-127-harder-puzzles)
base: grugops/wave-2026-09-25
---

# Subtask: land `ABC-127` `A9` — the `PUZZLE_DEEP` line in `AGENTS.md`

The Engineer drafted the line (claim note); Security/NFR says it agrees with its quiet readings.
Land it in `AGENTS.md` on the ABC-127 branch, checked against those readings, keeping the option-B
`TRIGGER` text unchanged. Note: the wave's `AGENTS.md` gained `ABC-069`'s slot comment (merged
`c86fcf7`, 23,879 B) since this branch was cut — keep your edit to the `PUZZLE_DEEP` lines only so the
merge stays clean, and check the size against the 24,576 B cap on the MERGED result
(`git merge-tree` or a scratch merge). Do NOT refresh other test-count receipts. Fences: only
`AGENTS.md`, a note, and a trace row at the END of `plans/traceability.md`. Gates: lint, typecheck,
`npm test` (the `AGENTS.md` guards in `src/cli.test.ts` must stay green).
