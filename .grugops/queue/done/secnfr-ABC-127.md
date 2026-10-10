---
task: wave-2026-09-25
subtask: secnfr-ABC-127
role: security-nfr
workflow: agent-factory/workflows/05-* (Security/NFR review)
ticket: plans/tickets/ABC-127-harder-puzzles-catch-the-surviving-weakenings-and-leave-headroom.md
ref: .grugops/context/secnfr-ABC-127/
source_refs: .grugops/context/ticket-to-pr-ABC-127/ (observation …eee7be49)  .grugops/context/qe-ABC-127/ (verdict …affa3970, readings …f5e127b9)  .grugops/context/secnfr-ABC-084/ (F1 precedent)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T09:45:47Z
branch: grugops/ABC-127-harder-puzzles (review tip 1087a42; your commits go on top)
base: grugops/wave-2026-09-25
---

# Subtask: Security/NFR review of `ABC-127` — the price of the harder puzzle suite

Rule on: `A7` (gating ≤ 45 s / lane ≤ 90 s are READINGS, never asserted — Engineer 20–21 / 32–34 s
quiet, QE 28–32 / 45–53 s loaded, one 43.7 s gating reading), `A8`/`N8-LANE` (0 new files;
Engineer +435 ms under contention, +30 ms file-alone), the 300 s hang guards vs QE-127-g (4× reading
299.0 s under load — is that only a probe, or can a lane row reach it?), and QE-127-a (thin reds at
the budget edge: does it change the risk of `ABC-083`/`ABC-087` reddening the suite under the
`ADR-0028` rule?). Re-measure on a machine as quiet as you can get and say the load beside every
number. `NFR-008` stays unruled (Architect, `ADR-0019`) — read, do not rule it. Result: PASS /
PASS_WITH_RISKS / FAIL with required fixes and accepted risks. Fences: no `src/` production
changes, no `plans/board.md`, `plans/nfr-catalog.md` (propose wording in your note), ADRs,
`AGENTS.md`, baseline file. Notes per Workflow 16; trace row at the END of `plans/traceability.md`.
