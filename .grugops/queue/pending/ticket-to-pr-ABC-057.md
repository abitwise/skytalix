---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-057
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-057-licence-guard-comparator-and-stale-clause3-docblock.md
ref: .grugops/context/ticket-to-pr-ABC-057/
source_refs: .grugops/context/rescore-batch-2-2026-10-10/ (…4fdfe525)  .grugops/context/qe-ABC-054/ (gap register …ee331683: QE-054-b)  .grugops/context/secnfr-ABC-053/ (AR-053-ORDER)  .grugops/context/ticket-to-pr-ABC-054/ (moved anchors)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T13:03:24Z
branch: grugops/ABC-057-licence-guard
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: build `ABC-057` — licence guard comparator and the stale clause-3 docblock

DoR 10/10, XS, P1. The ticket page is the contract. Anchors moved with `ABC-054`'s merge (`cb044bb2`):
the struck sentence is now ~`:212-213`, the comparator ~`:358` — re-anchor first. Fold-in from QE-054-b
(BA/PM routed it here): the narrowed composer claim ("a static value import") is still wider than the
tripwire — `import { /* c */ assembleFrame }` passes tsc and lint and the tripwire stays green; narrow the
docblock wording to what the tripwire reads (do NOT widen the tripwire — that is ADR-0029's). Test note:
re-run QE-053's two arming-order controls (AR-053-ORDER).

## Stop conditions
- Any production file would change — STOP. Any file beyond the page's (+ the composer docblock) — STOP.
- The tripwire code and the licence regex lines stay byte-identical — STOP if not.
- Cost per `ADR-0035` (proposed): narrow set + twin, report R.

## Fences
Never merge; never push. No `plans/board.md`, ADRs, `AGENTS.md`. Own worktree; link `node_modules`
into YOUR worktree only. Commit-message file in a PRIVATE scratchpad subdirectory. Real UTC stamps.

## Publish
Notes per Workflow 16, trace row at the END of `plans/traceability.md`, ticket § Delivery. Queue
pending → claimed → done. Report: gates, per-criterion evidence (M15 red), cost, `src/` numstat, branch + sha.
