---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-130
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-130-lane-inventory-is-red-on-probe-files-the-lane-correctly-excludes.md
ref: .grugops/context/ticket-to-pr-ABC-130/
source_refs: .grugops/context/rule-abc119-a2/ (decision …9f278676)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T10:11:05Z
branch: grugops/ABC-130-lane-inventory-probes
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: build `ABC-130` — `lane-inventory.js` stops expecting `.grugops/` probe files

DoR 10/10, XS, cut today. The ticket page is the contract (fix in the tool; pathspec written in it,
never read from `vitest.config.ts`; no renames; no config change; G4's false "NOT tracked" text
forbidden for `.grugops/` paths).

## Stop conditions
- Any file other than `tools/grugops/lane-inventory.js` (+ its test if the page names one) — STOP.
- `vitest.config.ts`, any `.grugops/context/` probe, `src/cli.real-engine.test.ts` (ABC-119 in
  review) — never touched.

## Fences
Never merge; never push. No `plans/board.md`, ADRs, `AGENTS.md`. Own worktree; link `node_modules`
into YOUR worktree only. Commit-message file in a PRIVATE scratchpad subdirectory. Real UTC stamps.

## Publish
Notes per Workflow 16, trace row at the END of `plans/traceability.md`, ticket § Delivery. Queue
pending → claimed → done. Report: gates (incl. `lane-inventory.js` exit code before/after), per-criterion
evidence, branch + sha, numstat.
