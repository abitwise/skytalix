---
task: wave-2026-09-25
subtask: secnfr-ABC-087
role: security-nfr
workflow: agent-factory/workflows/05-pr-quality-gate.md (Security/NFR review)
ticket: plans/tickets/ABC-087-difficulty-levels-as-budget-plus-blunder-rate.md
ref: .grugops/context/secnfr-ABC-087/
source_refs: .grugops/context/qe-ABC-087/ (NFR-004 clamp facts …df34cf5a, gap register …62d79e31)  .grugops/context/ticket-to-pr-ABC-087/ (claim …53ebd6d1 drafted NFR-004 wording; observations …69fa98d1, …26fd4d9d)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T12:48:48Z
branch: grugops/ABC-087-difficulty-levels (review tip 42ab1b35; your commits go on top)
base: grugops/wave-2026-09-25
---

# Subtask: Security/NFR review of `ABC-087` — difficulty levels

Performance-sensitive flow: rule `NFR-004` for the level layer (the 5 s ceiling binds per move PLAYED;
the level module clamps its own total; QE measured 5015/5005 ms returns for 20 s / Infinity levels — the
engine's existing `AR-NFR004-A` shape) and grade QE-087-c (clamp unpinned, no live exposure in today's
table). Read the randomness seam (seeded mulberry32 per instance; seed never reaches `chooseMove`) for any
security relevance. Cost: the Engineer's ADR-0035 reading (+0.555 s, R 0.030, MET) and the deep lane
(~200 s, ENGINE_DEEP). Propose `NFR-004` catalog wording in your note (do NOT edit the catalog — another
hop holds it). Result PASS / PASS_WITH_RISKS / FAIL. Fences: no production changes, `plans/board.md`,
catalog, ADRs, `AGENTS.md`. Notes per Workflow 16; trace row at the END of `plans/traceability.md`.
