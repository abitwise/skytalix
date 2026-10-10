---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-137
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-137-clause-1-helper-is-unpinned.md
ref: .grugops/context/ticket-to-pr-ABC-137/
source_refs: .grugops/context/design-F-072-1/notes/ (…1708c558: R5c spec), .grugops/context/bapm-cuts-r5c-f1331-2026-10-10/probe/r5c-ledger-5d55cc48.tsv, .grugops/context/qe-ABC-136/ (planters), .grugops/context/qe-ABC-057/probe/ (spansqe.py)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T15:50:20Z
branch: grugops/ABC-137-helper-pin
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: build `ABC-137` — pin clause 1's helper `productionModulesIn` (ADR-0011 R5c)

XS, P3, DoR 10/10. The ticket page is the contract. Test-only, `src/history-pane.nfr.test.ts`. Re-verify the
premise at the current tip first (`XHELPER-NARROW+FMT+WPERFT-STATIC` green; operator/operand pins red); if
stale, STOP and report.

## Stop conditions
- Any other path — STOP. ABC-136's pinned literals and ABC-057's spans: hash before/after (the reach
  comment the page rewrites may sit inside a span — report code-only hash equality if so, as ABC-134 did).
- Cost per `ADR-0035` (proposed): narrow set + twin, R and load1; inadmissible is a valid report.

## Fences
Never merge; never push. No `plans/board.md`, ADRs, `AGENTS.md`. Own worktree; link `node_modules` into
YOUR worktree only. Commit-message file in a PRIVATE scratchpad subdirectory. Real UTC stamps. Trailer
`Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Publish
Notes per Workflow 16, trace row at the END of `plans/traceability.md`, ticket § Delivery. Queue
pending → claimed → done (by hand, main checkout, uncommitted). Report: gates, per-criterion evidence
(kill ledger before/after), cost, `src/` numstat, branch + sha.
