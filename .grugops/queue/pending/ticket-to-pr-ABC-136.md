---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-136
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-136-licence-guard-operands-are-unpinned.md
ref: .grugops/context/ticket-to-pr-ABC-136/
source_refs: .grugops/context/design-owed-rulings-2026-10-10/notes/ (…95c73721 item 3: R5b spec), .grugops/context/qe-ABC-057/ (gap register …a331f012, probe/plantqe057.py), .grugops/context/bapm-followups-2026-10-10/probe/r5b-ledger.sh
enqueued_by: orchestrator
enqueued_at: 2026-10-10T14:41:18Z
branch: grugops/ABC-136-licence-operands
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: build `ABC-136` — pin the licence guard's two operands (ADR-0011 R5b)

DoR 10/10, XS, P3. The ticket page is the contract (it follows the Architect's R5b spec: what to pin and the
kill ledger). Test-only, `src/history-pane.nfr.test.ts` only. Re-verify the premise at the current tip
first (both operand mutants leave the file green; operator/witness mutants red); if stale, STOP and report.

## Stop conditions
- Any path other than `src/history-pane.nfr.test.ts` — STOP.
- ABC-057's pinned spans (licence regex lines, licence test, sibling tripwire, composer tripwire code,
  `WITNESSED_EXPRESSION`, `LICENSED_DRIVERS`, probe block) must stay byte-identical unless the page says
  otherwise — hash before/after.
- `ABC-134` (comment-only, same file) follows this ticket; don't touch its four prose sites.
- Cost per `ADR-0035` (proposed, per-set floor): narrow set + twin, report R and load1.

## Fences
Never merge; never push. No `plans/board.md`, ADRs, `AGENTS.md`. Own worktree; link `node_modules` into
YOUR worktree only. Commit-message file in a PRIVATE scratchpad subdirectory. Real UTC stamps. Trailer
`Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Publish
Notes per Workflow 16, trace row at the END of `plans/traceability.md`, ticket § Delivery. Queue
pending → claimed → done (by hand, main checkout, uncommitted). Report: gates, per-criterion evidence
(kill ledger before/after), cost, `src/` numstat, branch + sha.
