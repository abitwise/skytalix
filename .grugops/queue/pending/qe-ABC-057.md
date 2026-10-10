---
task: wave-2026-09-25
subtask: qe-ABC-057
role: qe-e2e
workflow: agent-factory/workflows/04-ticket-to-pr.md (review exit / quality gate)
ticket: plans/tickets/ABC-057-licence-guard-comparator-and-stale-clause3-docblock.md
ref: .grugops/context/qe-ABC-057/
source_refs: .grugops/context/ticket-to-pr-ABC-057/ (decision …b4c2a298, observations …4d731ea3, …c225fb9c, probe/)  .grugops/context/qe-ABC-054/ (QE-054-b)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T13:14:28Z
branch: grugops/ABC-057-licence-guard (review tip 00aad4da; QE commits go on top)
base: grugops/wave-2026-09-25
---

# Subtask: QE review of `ABC-057` — licence guard comparator and docblock

Verify A1–A5 and test note 5 independently on out-of-tree copies. Re-plant M15 and M15-SUB (head red, base
green) and add your own: `toStrictEqual` / `toMatchObject` / `expect.arrayContaining` swaps; a reformatted
comparator line (does the framed literal false-red on harmless whitespace?); a moved comparator. Confirm the
four spans are byte-identical (re-hash yourself). Read the two docblock narrowings (QE-054-b fold-in, stale
`turn-loop.ts` sentence) against what the code does. Verdict PASS / PASS_WITH_GAPS / FAIL. Fences: no
production changes, `plans/board.md`, ADRs, `AGENTS.md`. Notes per Workflow 16; trace row at the END of
`plans/traceability.md`.
