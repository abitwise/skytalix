---
task: wave-2026-09-25
subtask: rescore-batch-2-2026-10-10
role: ba-pm
workflow: agent-factory/workflows (BA/PM re-score; DoR per AGENTS.md)
ref: .grugops/context/rescore-batch-2-2026-10-10/
enqueued_by: orchestrator
enqueued_at: 2026-10-10T10:36:38Z
branch: grugops/rescore-batch-2-2026-10-10
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: re-verify and re-score the Backlog tickets that look pullable but were scored in August

Today three August-scored pages (`ABC-051`, `ABC-010`, `ABC-119`) stopped at build re-verification
because their premises had moved. Re-verify BEFORE a pull, against today's tree, for:
`ABC-057`, `ABC-058`, `ABC-059`, `ABC-060` (ordering on `ABC-042` now met), `ABC-072`, `ABC-073`,
`ABC-104`, `ABC-055`. For each: does every cited line/number/count still hold; is the problem still
real (or already fixed by a later ticket — say which); re-anchor; re-score DoR; name file overlaps with
in-flight work (`ABC-119` in review: `src/cli.real-engine.test.ts`; Ready-for-UAT `ABC-036`
`src/command-input*`, `ABC-051` `src/turn-loop*`, `ABC-127` puzzle files; Backlog `ABC-129`).
Drop (with reason) any ticket whose problem no longer exists. Report a pull order. `ABC-055` edits
`plans/board.md` — that file is the Orchestrator's; say how its build should be sequenced, don't edit it.
Fences: no `src/`, no `plans/board.md`, no ADRs; only these eight pages. Decision note per Workflow
16; trace rows at the END of `plans/traceability.md`.
