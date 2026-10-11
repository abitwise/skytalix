---
task: wave-2026-09-25
subtask: qe-ABC-144
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md
ticket: plans/tickets/ABC-144-npm-test-chokes-the-macbook-air-m3-cut-its-cpu-and-cap-its-cores.md
ref: .grugops/context/qe-ABC-144/
enqueued_by: orchestrator
enqueued_at: 2026-10-11T00:00:00Z
branch: grugops/ABC-144-cap-test-workers (tip d675ef42; code d4468fd3; base 5ed308a8)
hold: dispatch when a slot frees
---

# Subtask: QE on the ABC-144 build. Counts and value checks only; Window B is a separate width-1 hop.

Verify everything that is not a timing reading:
- the config diff;
- the pin and its reds (re-plant r1, r2, r3, r3b and the extras yourself);
- the resolved config (`effectiveWorkers: 3`, `isolate: true`);
- files = base, tests = base + 1;
- **A6's 20 consecutive green runs (a count screen, not timing);**
- the `*_DEEP` lanes' equal-collection check.

Also check the merge against `grugops/ABC-143-result-file-reads-red`, which edits `src/cli.test.ts` too: a dry-run merge in your worktree, never committed.
Rule whether the hand-written notes being "unsealed" matters. It is the repo norm.
**Take no timing grades.** A1, A3, A4, A5, the AR-N8SPAWN-DRIFT discharge and the thermal log belong to Window B. Do not touch `plans/board.md` or production `src/`. Never merge or push.
Publish notes per Workflow 16 with a PASS / PASS_WITH_GAPS / FAIL verdict, a trace row at the END of `plans/traceability.md`, and a § QE section on the ticket.
