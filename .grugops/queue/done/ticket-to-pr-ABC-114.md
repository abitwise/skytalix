---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-114
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-114-four-false-sentences-in-epic-006s-own-instrument-comments.md
ref: .grugops/context/ticket-to-pr-ABC-114/
enqueued_by: orchestrator
enqueued_at: 2026-10-11T00:00:00Z
branch: grugops/ABC-114-instrument-comments
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: build `ABC-114`, the four false sentences in EPIC-006's instrument comments

S, P2, DoR 9/10 (the ⚠️ is item 10, a consequence authorised on the page). The ticket page is the contract.
Re-verify each premise at the current tip first. If a sentence is already gone or has moved, report it; do not invent a fix.

## Stop conditions
- Comment prose only. **0 production lines and 0 assertion changes.** Any other edit: STOP and report.
- **A7 is binding:** you write the replacement sentences, and you do NOT validate them. Validation is a separate QE hop, which I enqueue after you.
- Other agents are running in parallel: an Architect batch and a BA/PM batch (editing `plans/tickets/`). Stay in your own worktree. **Take no timing readings for grading**; report the lane cost as "loaded machine, not graded".

## Fences
Never merge or push. Do not touch `plans/board.md`, ADRs or `AGENTS.md`. Work in your own worktree, and link
`node_modules` into it only. Use real UTC stamps and quoted heredocs only. End each commit with a `Co-Authored-By:` trailer naming the model you actually are.

## Publish
Publish notes per Workflow 16, a trace row at the END of `plans/traceability.md`, and the ticket's § Delivery. Move the queue file
pending → claimed → done by hand, in the main checkout, uncommitted. Report: gates, per-criterion evidence, diff names, branch and sha.
