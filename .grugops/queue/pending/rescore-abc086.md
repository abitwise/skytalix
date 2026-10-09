---
task: wave-2026-09-25
subtask: rescore-abc086
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md (fold discharged blockers + DoR re-score)
ticket: plans/tickets/ABC-086-deterministic-move-selection-under-a-fixed-seed.md
ref: .grugops/context/rescore-abc086/
source_refs: memory-bank/50-decisions/ADR-0026-a-value-changing-search-heuristic-gets-a-test-only-off-door-and-a-bounded-oracle.md  .grugops/context/ruling-abc121-lmr-oracle/
enqueued_by: orchestrator
enqueued_at: 2026-10-09T15:55:00Z
branch: grugops/rescore-abc086
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: re-score `ABC-086` (deterministic move selection) against the merged engine

Cut 2026-08-16 at DoR 8/10, ⚠️(3) "`ABC-078` must land first" and ⚠️(10) "the deterministic-mode
construction is BA/PM's reading; the search architecture is Architect/Design's". Since then
`ABC-076`…`ABC-081`, `ABC-121` (PVS/LMR, `ADR-0026`) and `ABC-122` have landed. Read the
search and engine sources on this base: where the time source enters, whether any non-determinism
other than wall-clock remains (TT, move ordering, killers, history), and whether the page's six
criteria (300/300, seeds-differ, entropy prohibition, shipped default, `NFR-004`) still bind the
code as built. Update line numbers, dependencies and the `N8-LANE` line; re-score.

If ⚠️(10) still needs an Architect/Design ruling, say exactly which question, and do not set Ready.
Score DoR out of 10 with every ⚠️ named.
