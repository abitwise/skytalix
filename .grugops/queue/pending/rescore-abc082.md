---
task: wave-2026-09-25
subtask: rescore-abc082
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md (fold discharged blockers + DoR re-score)
ticket: plans/tickets/ABC-082-evaluation-pawn-structure.md
ref: .grugops/context/rescore-abc082/
source_refs: memory-bank/50-decisions/ADR-0026-a-value-changing-search-heuristic-gets-a-test-only-off-door-and-a-bounded-oracle.md
enqueued_by: orchestrator
enqueued_at: 2026-10-09T15:55:00Z
branch: grugops/rescore-abc082
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: re-score `ABC-082` (evaluation — pawn structure) against the merged engine

Cut 2026-08-16 at DoR 9/10, needs `ABC-076` (Done). Since then the search has grown (`ABC-078`…
`ABC-081`, `ABC-121` PVS/LMR, `ADR-0026`). A value-changing evaluation can move MERGED bars:
find every merged test, oracle or NFR line that pins a score, a best move, a node count or a depth
(e.g. `ABC-080`/`ABC-081` `A3`, `ABC-121`'s bounded oracle, `NFR-005`'s depth floor,
`NFR-004`), and say for each whether this ticket's change could redden it and who re-levels it.
Update line numbers, dependencies and the `N8-LANE` line; re-score.

Score DoR out of 10 with every ⚠️ named. If 10/10 (or plainly non-blocking), set the page `Ready`.
