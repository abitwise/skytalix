---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-121-g6-comment
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md (apply a design ruling)
ticket: plans/tickets/ABC-121-principal-variation-search-late-move-reductions.md
ref: .grugops/context/ticket-to-pr-ABC-121/
ruling_ref: .grugops/context/ruling-abc121-g6/   (decision …ea306e58)
enqueued_by: orchestrator
enqueued_at: 2026-09-26T06:00:00Z
branch: grugops/ABC-121-pvs-lmr
base: grugops/ABC-121-pvs-lmr (tip after this enqueue)
worktree: .claude/worktrees/ABC-121-pvs-lmr (existing; reuse it)
---

# Subtask: apply `ruling-abc121-g6` — one comment in `src/transposition.test.ts`

The ruling keeps the `G6` re-point (decision 4 binds). In `src/transposition.test.ts`, in the
comment starting "RE-POINTED at `ABC-121`…", replace exactly the sentence the ruling note
`…ea306e58` names with the ruling's replacement text, verbatim. Keep "Measured, not argued".
Nothing else changes — no assertion, no literal; the `KNIGHT_G1_PAIR` docstring stays (flagged,
outside scope).

Run `npm test` (bounded; stop only with Ctrl-C/SIGTERM) and lint; record.

## Fences
Only that comment, a trace row, § Delivery. Never merge; never push. Task-unique scratchpad file
for commit messages; re-read `git log -1 --format=%s` after each commit.

## Publish
Append to § Delivery, a trace row. Queue pending → claimed → done per Workflow 17. Report: the
diff (numstat + the sentence before/after), gates, sha.
