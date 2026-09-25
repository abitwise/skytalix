---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-109-a5
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md (ticket build, Engineer half)
ticket: plans/tickets/ABC-109-agents-md-is-near-a-cap-that-truncates-silently.md
ref: .grugops/context/ticket-to-pr-ABC-109-a5/
scribe_ref: .grugops/context/scribe-abc109-restructure/
enqueued_by: orchestrator
enqueued_at: 2026-09-26T03:50:00Z
branch: grugops/ABC-109-agents-md-cap
base: grugops/ABC-109-agents-md-cap (tip after this enqueue)
worktree: .claude/worktrees/ABC-109-agents-md-cap (existing; reuse it)
---

# Subtask: build `ABC-109` `A5` — the `AGENTS.md` byte-count guard

The Scribe half is done: `AGENTS.md` 32 565 B → 21 786 B. **Constant: `24576` bytes** (the
ticket's `A1` target). Build `A5` exactly as the ticket words it: one assertion in
`src/cli.test.ts` that reds when `AGENTS.md` exceeds the constant, **watched red before it ships**
(temporarily pad `AGENTS.md` past the constant, show the row red, revert byte-for-byte). Keep the
default-lane charge within the ticket's `N8-LANE` line and report it.

## Stop conditions
- The guard needs anything beyond one assertion in `src/cli.test.ts` (plus its constant).
- Any existing `src/cli.test.ts` row about `AGENTS.md` (`ABC-065`/`067`/`071`) reds against the
  restructured file — report it; do not edit `AGENTS.md` (Scribe's).

## Fences
Only `src/cli.test.ts`, notes, trace row, ticket § Delivery. No `AGENTS.md`, `plans/board.md`,
`plans/nfr-catalog.md`, ADRs. Never merge; never push. Commit messages via a scratchpad file with a
task-unique name and `git commit -F`; re-read `git log -1 --format=%s` after each commit.

## Publish
An `observation` note under `ref:`, append to § Delivery, a trace row. Queue pending → claimed →
done per Workflow 17. Report: `A5` MET or not, the red proof, gates, `N8-LANE`, sha, numstat.
