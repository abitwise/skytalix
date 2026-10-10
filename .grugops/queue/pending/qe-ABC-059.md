---
task: wave-2026-09-25
subtask: qe-ABC-059
role: qe-e2e
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-059-agents-md-runnability-guard-pins-a-spelling-not-a-fact.md
ref: .grugops/context/qe-ABC-059/
source_refs: .grugops/context/ticket-to-pr-ABC-059/ (…084a3e0b, …53346fff)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T13:30:50Z
branch: grugops/ABC-059-runnability-guard (tip 4230d3ab)
---

# Subtask: QE `ABC-059` — the `AGENTS.md` runnability guard reads the fact, not a spelling

Verify A1–A6 independently against the page; re-run the engineer's mutants yourself and add any the
page implies that were missed (e.g. a span rule edge: abbreviation dots, `?`/`!`, a span with two
`npm run` words). Confirm the guard stays green on ABC-087's `AGENTS.md` (`8330651d`). Judge the
engineer's decisions: the span rule (`.`/`!`/`?` + space or end) and asserting floors rather than counts.

**Cost:** the engineer's ADR-0035 (proposed) reading was INADMISSIBLE twice (twin control failed at load1
20–34). Take the reading again (narrow set `src/cli.test.ts`, base `0b6e1c25`/head/twin) when load is
lower; if it is still inadmissible, report it so with load1 logged — do not claim an N8-LANE state.

## Fences
Test-only additions on the ticket branch if gaps need closing; no production `src/` edits. Never merge;
never push. No `plans/board.md`, ADRs, `AGENTS.md`. Own worktree; link `node_modules` into YOUR worktree
only. Commit-message file in a PRIVATE scratchpad subdirectory. Real UTC stamps. Trailer
`Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Publish
Notes per Workflow 16, trace row at the END of `plans/traceability.md`, ticket § QE. Queue
pending → claimed → done (by hand, main checkout, uncommitted). Report: verdict, per-criterion evidence,
mutants, gaps with severity, cost state, gates, branch + sha.
