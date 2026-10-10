---
task: wave-2026-09-25
subtask: recut-abc119
role: ba-pm
workflow: agent-factory/workflows (BA/PM re-cut; DoR per AGENTS.md)
ticket: plans/tickets/ABC-119-no-test-anywhere-runs-the-delivered-clis-real-engine.md
ref: .grugops/context/recut-abc119/
source_refs: .grugops/context/ticket-to-pr-ABC-119/ (observation …5b1e7c04 — three moved premises, three proposals)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T09:37:03Z
branch: grugops/recut-abc119
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: re-cut `ABC-119` after the Engineer's re-verification stop

The Engineer stopped before code (`66bec27`): P1 `A5`'s literal hash range moved; P2 the spawn
ceiling is now `17 + 7 + 1 + 2` = 27; P3 `A3`(ii) "≤ 3 s" is red by construction under
`AR-NFR004-A`. The note carries three proposals — rule each (you may take, amend or refuse them;
say why). Re-anchor every cited line/number to today's tree, refresh stale lane readings
(`NFR-008` level is 15 s per `ADR-0019`), and trim toward the 300-line page budget without
cutting acceptance text. If a fix needs an NFR-catalog or ADR change, name the owner and stop
short of Ready. Re-score DoR. Fences: no `src/`, no `plans/board.md`, no ADRs, no other pages.
Decision note per Workflow 16; trace row at the END of `plans/traceability.md`.
