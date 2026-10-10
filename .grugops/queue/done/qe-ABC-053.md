---
task: wave-2026-09-25
subtask: qe-ABC-053
role: qe-e2e
workflow: agent-factory/workflows/04-ticket-to-pr.md (review exit / quality gate)
ticket: plans/tickets/ABC-053-frame-path-probe-measures-load-time.md
ref: .grugops/context/qe-ABC-053/
source_refs: .grugops/context/ticket-to-pr-ABC-053/ (decision …9594aafe, observation …3a8f5aa3, probe/)  .grugops/context/ruling-abc053-abc054/  memory-bank/50-decisions/ADR-0029-* (accepted)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T11:56:48Z
branch: grugops/ABC-053-frame-path-per-frame (review tip 57251578; QE commits go on top)
base: grugops/wave-2026-09-25
---

# Subtask: QE review of `ABC-053` — frame-path guard at LOAD and PER FRAME

Verify A2–A5 independently on out-of-tree copies. Rebuild ADR-0029's kill ledger yourself (all ten
builds incl. WGLYPH-DYN) and add mutants of your own: a frame producer that imports `history.ts` only on
the 41st+ ply; a second composer via namespace import; a root rename; a settle-dependent dynamic import
(does 3 `setImmediate` turns suffice?). Check the docblock's four uncovered cases are true. Flag clause
(d) for Security/NFR. Verdict PASS / PASS_WITH_GAPS / FAIL. Fences: no production changes,
`plans/board.md`, ADRs, `AGENTS.md`. Notes per Workflow 16; trace row at the END of
`plans/traceability.md`.
