---
task: wave-2026-09-25
subtask: qe-ABC-058
role: qe-e2e
workflow: agent-factory/workflows/04-ticket-to-pr.md (review exit / quality gate)
ticket: plans/tickets/ABC-058-three-security-bar-instruments-cannot-observe-their-own-clauses.md
ref: .grugops/context/qe-ABC-058/
source_refs: .grugops/context/ticket-to-pr-ABC-058/ (decision …0963774f, observation …b98960df, probe/)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T11:13:08Z
branch: grugops/ABC-058-security-bar-instruments (review tip fb914ded; QE commits go on top)
base: grugops/wave-2026-09-25
---

# Subtask: QE review of `ABC-058` — security-bar instruments

XS, test-only. Verify A1, A2, A5–A8 independently on out-of-tree copies. Re-run the Engineer's mutant
table (control, prose `spawnSync(`, MS1, MS2, M3f, M3g, M3h) and add your own: a different
forbidden-byte class removed from bar 3; a `spawnSync` hidden in a template string vs a real call;
a whitespace byte in the probe token (does bar 3 lose it, as the Engineer argues?). Confirm
`N8_SPAWN` = 27 and the single call site. Read the cost per `ADR-0035` (proposed) on the narrow set
if you re-measure; otherwise accept the Engineer's two sets as reported. Flag for Security/NFR the
clause (c) question (bytes passed to an existing child changed inside an existing literal). Verdict
PASS / PASS_WITH_GAPS / FAIL. Fences: no production changes, `plans/board.md`, ADRs, `AGENTS.md`.
Notes per Workflow 16; trace row at the END of `plans/traceability.md`.
