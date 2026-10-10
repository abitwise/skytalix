---
task: wave-2026-09-25
subtask: scribe-ABC-069
role: agents-md-scribe
workflow: agent-factory/workflows/04-ticket-to-pr.md (Scribe's pen: AGENTS.md)
ticket: plans/tickets/ABC-069-dev-run-slot-conventions-are-unwritten.md
ref: .grugops/context/scribe-ABC-069/
enqueued_by: orchestrator
enqueued_at: 2026-10-10T09:15:46Z
branch: grugops/ABC-069-agents-md-conventions
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: deliver `ABC-069` — write the `Dev / run` slot's rendering conventions where a Scribe sees them

DoR 10/10, XS, P3, scored 2026-08-16. The ticket page is the contract. **Loosening the guard is
REFUSED on the page — do not touch the guard.**

## First step — re-verify
Find the guard the page names under `src/` and confirm the two conventions it enforces are still
the ones the page describes, and still unwritten in `AGENTS.md`. If either moved, write an
observation note and STOP (BA/PM re-scores).

## Stop conditions
- Any `src/` file would need to change — STOP (page says 0 files under `src/`).
- `AGENTS.md` would exceed its size cap (24 576 B; read the cap where AGENTS.md states it) — STOP.

## Fences
Never merge; never push. Only `AGENTS.md`, the ticket page § Delivery, notes, and a trace row at the
END of `plans/traceability.md`. Do NOT refresh `AGENTS.md`'s test-count receipts (they move again
when `ABC-036`/`ABC-051` merge). No `plans/board.md`, ADRs. Own worktree; link `node_modules` into
YOUR worktree only. Commit-message file in a PRIVATE scratchpad subdirectory. Real UTC stamps.

## Publish
Notes per Workflow 16. Report: re-verification, gates (lint, typecheck, build, test, skip-integrity —
the guard must stay green), `AGENTS.md` byte size before/after, branch + sha.
