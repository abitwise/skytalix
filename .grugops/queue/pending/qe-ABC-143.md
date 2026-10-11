---
task: wave-2026-09-25
subtask: qe-ABC-143
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md
ticket: plans/tickets/ABC-143-a-red-npm-test-can-leave-a-result-file-that-reads-green.md
ref: .grugops/context/qe-ABC-143/
enqueued_by: orchestrator
enqueued_at: 2026-10-11T00:00:00Z
branch: grugops/ABC-143-result-file-reads-red (tip 14cd1cf0; code f97ad60b; base 117c1c8e)
---

# Subtask: QE on `ABC-143`, the custom result-file reporter

Verify A1–A6 independently. Re-plant the A1 setTimeout throw, the A2 `while (true) {}` hang under the 60 s bound, and the A3 describe-body
throw, plus ABC-142's inverted assertion, in copies outside the repo. Run the page's query exactly as written. The build notes are under
`.grugops/context/ticket-to-pr-ABC-143/notes/` on the branch.
Break the reporter on purpose, and add any break the criteria should catch:
- `success` computed without the exit code;
- the start marker never written;
- unhandled errors dropped;
- the exit hook not registered.

Also check the vitest-version coupling: it subclasses `JsonReporter` from vitest 3.2.7. Name what breaks on a vitest upgrade, and whether anything pins it.
The Engineer's own limits are a killed-before-exit marker that names no test, and two runs in one checkout overwriting each other. Rule whether each is a gap.
Do not touch production `src/` or `plans/board.md`. Take no timing grades. Never merge or push.
Publish notes per Workflow 16 with a PASS / PASS_WITH_GAPS / FAIL verdict, a trace row at the END of `plans/traceability.md`, and a § QE section on the ticket.
