---
task: wave-2026-09-25
subtask: qe-ABC-130
role: qe-e2e
workflow: agent-factory/workflows/04-ticket-to-pr.md (review exit / quality gate)
ticket: plans/tickets/ABC-130-lane-inventory-is-red-on-probe-files-the-lane-correctly-excludes.md
ref: .grugops/context/qe-ABC-130/
source_refs: .grugops/context/ticket-to-pr-ABC-130/ (decision …3e1a7c50, observation …8d4b2e91)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T10:15:36Z
branch: grugops/ABC-130-lane-inventory-probes (review tip 1ae58c32; QE commits go on top)
base: grugops/wave-2026-09-25
---

# Subtask: QE review of `ABC-130` — `lane-inventory.js` stops expecting `.grugops/` probes

XS, tool-only. Verify A1–A6 independently in `git archive` copies outside the repo (never plant in
the worktree). Re-run the Engineer's A2/A3/A4 mutants and add your own — at least: a probe under a
nested `.grugops` path collected by a mistyped glob; a `.test.ts` outside `src/` and outside
`.grugops/` (does the tool still name it?); a quoted/space path. Confirm the pathspec is a literal and
never read from `vitest.config.ts`. Verdict PASS / PASS_WITH_GAPS / FAIL. Fences: no `src/`,
`plans/board.md`, ADRs, `AGENTS.md`, `vitest.config.ts`. Notes per Workflow 16; trace row at the END
of `plans/traceability.md`.
