---
task: wave-2026-09-25
subtask: secnfr-ABC-058
role: security-nfr
workflow: agent-factory/workflows/05-pr-quality-gate.md (Security/NFR review)
ticket: plans/tickets/ABC-058-three-security-bar-instruments-cannot-observe-their-own-clauses.md
ref: .grugops/context/secnfr-ABC-058/
source_refs: .grugops/context/qe-ABC-058/ (clause (c) question …ebb74095, gap register …904bdd2d, probes …4b252e30)  .grugops/context/ticket-to-pr-ABC-058/
enqueued_by: orchestrator
enqueued_at: 2026-10-10T11:34:12Z
branch: grugops/ABC-058-security-bar-instruments (review tip be12015a; your commits go on top)
base: grugops/wave-2026-09-25
---

# Subtask: Security/NFR review of `ABC-058` — the security bar's own instruments

Rule: (1) does `ABC-041` clause (c) ("a new spawn") fire when the bytes handed to an EXISTING child change
inside an EXISTING literal (BEL + DEL added; command/options/count/call site unchanged; QE measured 0 of
those bytes reaching the run's captured output — terminal run UNKNOWN)? (2) grade QE-058-a (string-blind
comment strip trades three kills; only the `"/*"` shape could arrive by accident) and QE-058-c — fix now,
follow-up ticket, or accepted risk with owner. (3) Cost: read the Engineer's two sets (one MET, one
UNRESOLVED ≤ +0.107 s) and QE's note that child-heavy files may sit above `ADR-0035`'s one-file floor.
Result PASS / PASS_WITH_RISKS / FAIL with required fixes and accepted risks. Fences: no production
changes, `plans/board.md`, `plans/nfr-catalog.md` (another Security/NFR hop holds it), ADRs, `AGENTS.md`.
Notes per Workflow 16; trace row at the END of `plans/traceability.md`.
