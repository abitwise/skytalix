---
task: wave-2026-09-25
subtask: qe-ABC-085
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md
ticket: plans/tickets/ABC-085-self-play-ladder.md
ref: .grugops/context/qe-ABC-085/
enqueued_by: orchestrator
enqueued_at: 2026-10-11T00:00:00Z
branch: grugops/ABC-085-self-play-ladder (tip 773b48cc; harness d5b0f0e2)
hold: dispatch AFTER ABC-144 quiet Window A
---

# Subtask: QE on the `ABC-085` harness build. The verdict is not in scope.

Verify A3–A6 independently, in short mode or on default rows. A1 and A2 wait for the verdict run and are out of scope. Re-plant the
Engineer's four mutants, and add any the harness should also kill. Confirm that the default lane has 0 ladder games (by count). The build notes are under `.grugops/context/ticket-to-pr-ABC-085/notes/`.
Do not run `LADDER_DEEP` at full length; one short-mode run is enough. Take no timing grades. Never merge or push. Do not touch `plans/board.md`.
Publish notes per Workflow 16 with a PASS / PASS_WITH_GAPS / FAIL verdict, a trace row at the END of `plans/traceability.md`, and a § QE section on the ticket.
