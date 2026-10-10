---
task: wave-2026-09-25
subtask: recut-abc051
role: ba-pm
workflow: agent-factory/workflows (BA/PM re-score / re-cut; DoR per AGENTS.md)
ticket: plans/tickets/ABC-051-turn-loop-records-false-and-per-ply-bar-blind.md
ref: .grugops/context/recut-abc051/
source_refs: .grugops/context/ticket-to-pr-ABC-051/ (observation …ac73a414, decision …42b950e1)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T08:44:50Z
branch: grugops/recut-abc051
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: re-cut `ABC-051` after the Engineer's re-verification stop

The Engineer stopped before code (`7eee6fb`). Three questions, all yours:
1. **Site 2:** `ADR-0021` (accepted) numbers the turn-loop machine at 18 transitions; the page's
   counting rule (Test note 5) gives 19 on today's tree. Choose (b) 18 — keep the ADR, write the
   counting rule beside it, rewrite Problem row 2 and Test note 5 — or (a) 19, which amends an
   accepted ADR and therefore needs an Architect ruling + owner word: if you pick (a), say so and
   STOP short of Ready.
2. **Site 1** is already true (ABC-120 rewrote it): drop it.
3. **A2** vs merged `ABC-043`/turn-loop A8 (ii)/(iii): resolve the duplication against the page's
   own Out-of-scope line.
Re-anchor every cited line number to today's tree. Re-score DoR. Fences: no `src/`, no
`plans/board.md`, no ADR edits, no pages other than `ABC-051`. Decision note per Workflow 16;
trace row appended at the END of `plans/traceability.md`.
