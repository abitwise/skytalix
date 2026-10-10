---
task: wave-2026-09-25
subtask: qe-ABC-126
role: qe-e2e
workflow: agent-factory/workflows/04-ticket-to-pr.md (review exit / quality gate)
ticket: plans/tickets/ABC-126-hanging-corpus-pair-starts-in-check.md
ref: .grugops/context/qe-ABC-126/
source_refs: .grugops/context/ticket-to-pr-ABC-126/ (decision …7c41a2e9, observation …b3d870e5, probe/)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T10:59:02Z
branch: grugops/ABC-126-corpus-repairs (review tip efcda60d; QE commits go on top)
base: grugops/wave-2026-09-25
---

# Subtask: QE review of `ABC-126` — corpus repairs

Verify A1–A7 independently. Option B applies: run `PUZZLE_DEEP=1` yourself (three processes, cmp
per-row output; 58/62 = baseline, no NEWLY lines) and `PUZZLE_DEEP=weakened` (exit 1). Run
`SEARCH_DEEP=1` quiescence. Re-prove the four new FENs with an oracle importing no engine code
(legality under `ADR-0033`'s six rules — now accepted — accept sets, margins). Confirm the removed
carve-out leaves all 62 rows asserted not-in-check and that each new assertion reds on the shipped
FENs. Confirm baseline untouched. Verdict PASS / PASS_WITH_GAPS / FAIL. Fences: no production
changes, no `plans/board.md`, ADRs, `AGENTS.md`, baseline. Plant only out of tree. Notes per
Workflow 16; trace row at the END of `plans/traceability.md`.
