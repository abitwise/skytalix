---
task: wave-2026-09-25
subtask: qe-ABC-036
role: qe-e2e
workflow: agent-factory/workflows/04-ticket-to-pr.md (review exit / quality gate)
ticket: plans/tickets/ABC-036-the-moves-command.md
ref: .grugops/context/qe-ABC-036/
source_refs: .grugops/context/ticket-to-pr-ABC-036/ (decision …daa1392b, observation …605aa727, claim …83696dfe)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T08:32:35Z
branch: grugops/ABC-036-moves-command (review this tip, a261966; QE commits go on top)
base: grugops/wave-2026-09-25
---

# Subtask: QE review of `ABC-036` — the `moves` command

Verify A1–A7 against the page independently (do not trust the Engineer's tables). Re-run every
gate on the branch tip. Plant your own mutants. Check the Engineer's four reversible decisions
(code-unit sort, `legal moves: <n>` wording, retired `ABC-035 A4` row, `moves` outside
`TOKEN_SPELLINGS`) against the page and `ABC-035`'s criteria; flag any that contradicts a
criterion. Assess the three untested cases (zero legal moves, `moves` clearing an armed `quit`,
ASCII glyph mode): add rows where cheap, else gap-register them. PUZZLE_DEEP is NOT required (no
engine/search/evaluate file touched — confirm that from the diff).

Verdict: PASS / PASS_WITH_GAPS / FAIL with a gap register. Fences: no `plans/board.md`,
`AGENTS.md`, ADRs; no production-code changes (tests only, and only if cheap). Notes per Workflow
16; trace row appended at the END of `plans/traceability.md`.
