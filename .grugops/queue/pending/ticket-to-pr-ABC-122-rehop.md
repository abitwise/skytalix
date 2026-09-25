---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-122-rehop
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-122-gate-hardening-bounded-timeout-and-capacity-guard-test.md
ref: .grugops/context/ticket-to-pr-ABC-122/
amend_ref: .grugops/context/amend-abc122-a4-pin/   (A11 widened by exactly one pin)
enqueued_by: orchestrator
enqueued_at: 2026-09-25T22:00:00Z
branch: grugops/ABC-122-gate-hardening
base: grugops/ABC-122-gate-hardening (tip after this enqueue)
worktree: .claude/worktrees/ABC-122-gate-hardening (existing; reuse it)
---

# Subtask: `ABC-122` re-hop — land `A4` inside the widened `A11`

BA/PM ruled the stop: `A11` is widened by exactly one line — `src/cli.test.ts`'s
`SCRIPTS_AT_HEAD.test` literal, mirrored byte-for-byte to the wrapped string `A4` wires into
`package.json`'s `scripts.test`. Apply the two-line patch you measured, in one commit, and deliver
`A4`, `A11`, `A12` fresh (the other criteria stand; re-run the full gate through the wrapper).

## Stop conditions
- Anything beyond those two lines is needed.
- The gate is not green through `npm test` itself.

## Fences
As before. Never merge; never push. No `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md`, ADRs.
Commit messages via a scratchpad file and `git commit -F`.

## Publish
An `observation` note under `ref:` (A4/A11/A12 readings, `npm test` exit and counts, the
reverted-root-guard hang reading through `npm test` if you re-run it), append to the ticket's
§ Delivery, a trace row. Queue pending → claimed → done per Workflow 17. Report: criteria, gates,
sha, numstat.
