---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-109-a5-proof
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md (re-hop to close A5 as worded)
ticket: plans/tickets/ABC-109-agents-md-is-near-a-cap-that-truncates-silently.md
ref: .grugops/context/ticket-to-pr-ABC-109-a5/
qe_ref: .grugops/context/qe-ABC-109/   (A5 NOT MET to the letter)
enqueued_by: orchestrator
enqueued_at: 2026-09-26T05:00:00Z
branch: grugops/ABC-109-agents-md-cap
base: grugops/ABC-109-agents-md-cap (tip after this enqueue)
worktree: .claude/worktrees/ABC-109-agents-md-cap (existing; reuse it)
---

# Subtask: close `ABC-109` `A5` as worded — red on an in-memory number

QE ruled `A5` NOT MET to the letter: the red path must be shown on an in-memory number, not by
writing the real file. The Orchestrator's earlier queue task caused the deviation. Close it:

Run the **shipped** assertion's own code path against an in-memory 24 577-byte `Buffer` without
writing `AGENTS.md` (e.g. a throwaway run where the file read is replaced by the in-memory buffer),
watch it red, and at 24 576 bytes watch it green. Record both outputs verbatim. Nothing new ships
unless the ticket requires it; a trivial `expect(24577).toBeLessThanOrEqual(24576)` detached from
the shipped assertion does NOT count — the proof must go through the same expression.

## Fences
`AGENTS.md` byte-identical throughout (record sha256 before/after). Notes, § Delivery, trace row
only; `src/cli.test.ts` unchanged unless the proof genuinely requires it — stop and report if so.
Never merge; never push. Task-unique scratchpad file for commit messages; re-read
`git log -1 --format=%s` after each commit.

## Publish
Append to the `A5` observation note or a new one under `ref:`, append to § Delivery, a trace row.
Queue pending → claimed → done per Workflow 17. Report: the red and green outputs, the sha256s,
sha, numstat.
