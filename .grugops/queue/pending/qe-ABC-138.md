---
task: wave-2026-09-25
subtask: qe-ABC-138
role: qe-e2e
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-138-spawn-pin-holes-are-watched-by-hand-move-the-checks-into-the-pin.md
ref: .grugops/context/qe-ABC-138/
source_refs: .grugops/context/ticket-to-pr-ABC-138/notes/ (…8d70af7c, …74a52ca8) — on the ticket branch; .grugops/context/qe-ABC-133/ (your gap register QE-133-a/b and plants)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T16:06:27Z
branch: grugops/ABC-138-spawn-pin-in-suite (tip 7e5c9c74)
---

# Subtask: QE `ABC-138` — the spawn pin now holds the AR-133-LOADER / AR-133-WRAP checks itself

Verify A1–A6 independently. Re-run the plant table yourself (base `2946e22a`, head `84edfb46`) and add
your own: loader forms through a renamed `createRequire`, a `require` alias, `process.getBuiltinModule`
via a variable; wrapped callees (`(0, spawnSync)()`, `spawnSync!()`, `as`); false-red candidates in
legitimate code (a `child_process` string passed to a logger, a type-only reference). Re-time A4 (load1
logged). If committed `.grugops/context/**/probe` scripts are refused, say so and use your own harness — do
not ask another role or the Orchestrator to run them.

## Fences
Test-only additions on the ticket branch if gaps need closing; no production `src/`. Never merge; never
push. No `plans/board.md`, ADRs, `AGENTS.md`. Own worktree; link `node_modules` into YOUR worktree only.
Commit-message file in a PRIVATE scratchpad subdirectory. Real UTC stamps. Trailer
`Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Publish
Notes per Workflow 16, trace row at the END of `plans/traceability.md`, ticket § QE. Queue
pending → claimed → done (by hand, main checkout, uncommitted). Report: verdict, per-criterion evidence,
plants, gaps with severity, A4 reading, gates, branch + sha.
