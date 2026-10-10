---
task: wave-2026-09-25
subtask: qe-ABC-119
role: qe-e2e
workflow: agent-factory/workflows/04-ticket-to-pr.md (review exit / quality gate)
ticket: plans/tickets/ABC-119-no-test-anywhere-runs-the-delivered-clis-real-engine.md
ref: .grugops/context/qe-ABC-119/
source_refs: .grugops/context/ticket-to-pr-ABC-119-r2/ (notes …b7edc319, …75c1c46a, …904f6a64, …2409b286)  .grugops/context/rule-abc119-a2/ (decision …9f278676)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T10:11:05Z
branch: grugops/ABC-119-r2 (review tip a6453bc; QE commits go on top)
base: grugops/wave-2026-09-25
---

# Subtask: QE review of `ABC-119` — the real-engine CLI lane

Verify A1–A6 against the page AS RULED at `a6453bc` (read the page on the branch). Run the three
A2 closers exactly as BA/PM's decision note lists them: default lane with `CLI_DEEP` unset (skip
count 0, no `[CLI_DEEP]` lines); `lane-inventory.js` at `<base>` and `HEAD` (delta reading); the
three-tree null-twin harness, n ≥ 7, admissibility FIRST. Run `CLI_DEEP=1` yourself (≥ 2 runs).
Re-plant M2 and add mutants of your own (A3/A4 rows stayed green on both Engineer mutants — find
one each should catch, or gap-register that they cannot). Security/NFR is timing ABC-127 in
parallel: log load1 beside every number; an inadmissible set is rerun, two inadmissible → stop and
hand up. Verdict PASS / PASS_WITH_GAPS / FAIL. Fences: no production changes, no `plans/board.md`,
ADRs, `AGENTS.md`, `tools/`. Notes per Workflow 16; trace row at the END of `plans/traceability.md`.
