---
task: wave-2026-09-25
subtask: rescore-abc102
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md (fold discharged blockers + DoR re-score)
ticket: plans/tickets/ABC-102-undo.md
ref: .grugops/context/rescore-abc102/
source_refs: memory-bank/50-decisions/ADR-0021-the-turn-loop-gains-quit-and-take-back-arms.md  .grugops/context/ruling-abc046-quit-arm/  .grugops/context/qe-ABC-120/  .grugops/context/ticket-to-pr-ABC-046/  .grugops/context/qe-ABC-046/
enqueued_by: orchestrator
enqueued_at: 2026-10-09T15:55:00Z
branch: grugops/rescore-abc102
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: re-score `ABC-102` (`undo`) against the merged record

Cut 2026-08-16 at DoR 7/10. Its blockers, per its own § Dependencies: the contract-shape ruling
(same as `ABC-046`'s) → ruled by `ADR-0021`; the arm ticket `ABC-120` → Done (transition 18,
`{ kind: "take-back", plies, messages }`); `ABC-046` (`COMMAND_TABLE`, quit/new) → Done;
EPIC-004's engine reply → `ABC-078`…`ABC-081` Done. Verify each against source on this base,
fold the ruling and the arm into the page (scope, criteria, line numbers read today), and re-score.
Price the `N8-LANE` line on today's lane. Name anything `ADR-0021` clause 4 leaves to this ticket
("nothing to undo" wording, the 0-/1-ply boundary).

Score DoR out of 10 with every ⚠️ named. If 10/10 (or a ⚠️ that is plainly non-blocking), set the
page to `Ready` and say so; otherwise name the missing input and its owner.
