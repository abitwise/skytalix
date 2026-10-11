---
task: wave-2026-09-25
subtask: secnfr-ABC-147-review
role: security-nfr
ticket: plans/tickets/ABC-147-how-much-of-npm-tests-cpu-is-vitests-per-node-engine-overhead.md
ref: .grugops/context/secnfr-ABC-147-review/
enqueued_by: orchestrator
enqueued_at: 2026-10-11T00:00:00Z
branch: grugops/ABC-147-vitest-overhead-probe (tip 4c634f09)
---

# Subtask: validate the ABC-147 probe, in place of QE (owner rule: docs-only tickets may take Security/NFR instead of QE)

ABC-147 changes only `plans/` and `.grugops/` (a read-only probe). **Review the method, the admissibility and the arithmetic. Do NOT re-run the lane.**
The machine is hot, and the lever ticket re-measures anyway. The notes are under `.grugops/context/ticket-to-pr-ABC-147/` on the branch: `METHOD.md`, `raw/`, and five notes.
Check:
- the method was committed before the graded runs;
- the run exclusions follow the page's own rules;
- the A1 buckets sum and are attributed correctly;
- the A2 pairs are interleaved and the digests equal;
- the A3 band arithmetic, including the cold-call lower edge (26.0 %);
- whether the ≥ 15 % arm holds under every reading the page allows.

Also name the profiler-hang finding (5/18 `--cpu-prof` runs killed at 60 s) as a risk, with its owner.
Verdict: PASS / PASS_WITH_GAPS / FAIL. Publish notes per Workflow 16, a trace row at the END of `plans/traceability.md`, and a § Review section on the ticket, on the ticket branch.
Do not touch `src/` or `plans/board.md`. Never merge or push.
