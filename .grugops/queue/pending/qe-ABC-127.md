---
task: wave-2026-09-25
subtask: qe-ABC-127
role: qe-e2e
workflow: agent-factory/workflows/04-ticket-to-pr.md (review exit / quality gate)
ticket: plans/tickets/ABC-127-harder-puzzles-catch-the-surviving-weakenings-and-leave-headroom.md
ref: .grugops/context/qe-ABC-127/
source_refs: .grugops/context/ticket-to-pr-ABC-127/ (decision …558e9520, observation …eee7be49, claim …6341cc47, probe/)  .grugops/context/qe-ABC-084/ (weakenings.mjs, indep-oracle.mjs)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T09:19:02Z
branch: grugops/ABC-127-harder-puzzles (review tip a7e1128; QE commits go on top)
base: grugops/wave-2026-09-25
---

# Subtask: QE review of `ABC-127` — harder puzzles

Verify A1–A6 against the page independently. Option B applies (owner ruling, ABC-084): run
`PUZZLE_DEEP=1` yourself (three processes, cmp the per-row output) and `PUZZLE_DEEP=weakened`
(must exit 1). Re-run the A3 matrix yourself from `qe-ABC-084`'s `weakenings.mjs` — at least
W1, W1b, W4, W5, W13, W14 (the two thinnest reds) and W10/W11 (survivors). Re-prove a sample of
answers with an oracle you write that imports no engine/search/evaluate/quiescence/transposition
code (A2). Judge decision D1 (seeded random placements vs named motifs) against the page's
breadth wording. Confirm the 40 existing rows byte-identical, the baseline commit is alone with a
reason, and the intermediate commit's red is only the deep gate row. Report the host-protection
check's exit 2 — is it a gate here or not (`.grugops/factory.config.json` mandatory gates)?
A7/A8/N8-LANE are Security/NFR's to rule — record readings only. Verdict PASS / PASS_WITH_GAPS /
FAIL with a gap register. Fences: no `plans/board.md`, `AGENTS.md`, ADRs, baseline file;
no production changes. Notes per Workflow 16; trace row at the END of `plans/traceability.md`.
