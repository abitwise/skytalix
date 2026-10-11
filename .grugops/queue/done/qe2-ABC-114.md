---
task: wave-2026-09-25
subtask: qe2-ABC-114
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md
ticket: plans/tickets/ABC-114-four-false-sentences-in-epic-006s-own-instrument-comments.md
ref: .grugops/context/qe2-ABC-114/
enqueued_by: orchestrator
enqueued_at: 2026-10-11T00:00:00Z
branch: grugops/ABC-114-instrument-comments (tip d60cedb4; fix 54644ee5)
---

# Subtask: second QE pass on `ABC-114`. You validate the fix under A7.

The first QE verdict was FAIL (`…a32a9616`, gap register `…168698b8`, under `.grugops/context/qe-ABC-114/notes/`). The Engineer's fix is `54644ee5`
(comment-only; notes under `.grugops/context/fix-ABC-114/notes/`). **Re-plant `M9`, `D3`, `ORD` and `D4` yourself** on the tip file, the ablation and
`cc037b3e^`, and check every new sentence against your own runs. Confirm QE-114-a and QE-114-b are closed. Re-check that A2–A7 still
hold at the new tip: the diff is still comment-only in the two files, and the counts are unchanged.
QE-114-c belongs to BA/PM and is out of scope. Do not touch production `src/` or `plans/board.md`. Take no timing grades. Never merge or push.
Publish notes per Workflow 16 with a PASS / PASS_WITH_GAPS / FAIL verdict, a trace row at the END of `plans/traceability.md`, and a § QE (2nd pass) section on the ticket.
