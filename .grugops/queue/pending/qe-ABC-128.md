---
task: wave-2026-09-25
subtask: qe-ABC-128
role: qe-e2e
workflow: agent-factory/workflows/04-ticket-to-pr.md (review exit / quality gate)
ticket: plans/tickets/ABC-128-the-take-back-edge-has-no-keyhistory-guard.md
ref: .grugops/context/qe-ABC-128/
source_refs: .grugops/context/ticket-to-pr-ABC-128/ (decision …f2b00452, observation …2189d95b)  .grugops/context/qe-ABC-051/probe/ (M9)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T09:38:44Z
branch: grugops/ABC-128-take-back-guard (review tip 61a785f; QE commits go on top)
base: grugops/wave-2026-09-25
---

# Subtask: QE review of `ABC-128` — take-back `keyHistory` guard

XS, test-only. Verify A1–A3 independently: M9 survives at base and reds exactly A3–A5 at tip; plant
at least two further mutants (e.g. `keyHistory` on the allowed-claim edge, on an advancing ply) to
check the narrowed A8 title is now true of its rows. Confirm `src/` diff is `src/turn-loop.test.ts`
only. Verdict PASS / PASS_WITH_GAPS / FAIL. Fences: no `plans/board.md`, ADRs, `AGENTS.md`, no
production changes; revert every plant in a scratch copy. Notes per Workflow 16; trace row at the
END of `plans/traceability.md`.
