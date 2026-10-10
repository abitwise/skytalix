---
task: wave-2026-09-25
subtask: scribe-ABC-087
role: agents-md-scribe
workflow: agent-factory/workflows/04-ticket-to-pr.md (Scribe's pen: AGENTS.md)
ticket: plans/tickets/ABC-087-difficulty-levels-as-budget-plus-blunder-rate.md
ref: .grugops/context/scribe-ABC-087/
source_refs: .grugops/context/ticket-to-pr-ABC-087/ (claim …53ebd6d1 drafted line; observation …14ec8ea7)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T13:09:33Z
branch: grugops/ABC-087-difficulty-levels (commit on top of dacfe32f in worktree .claude/worktrees/ABC-087-difficulty-levels)
base: grugops/wave-2026-09-25
---

# Subtask: land `ABC-087`'s `ENGINE_DEEP` levels line in `AGENTS.md` — and make room for it

`AGENTS.md` is at ~24,433 B against the 24,576 B cap (guarded in `src/cli.test.ts`, `ABC-109`); the
drafted line ("28 passed (22 default)", ~200 s) will not fit as is. Land it AND recover headroom by
tightening existing `RUN` comment receipts (stale or verbose ones first — e.g. `Test (all)` still says
1539 tests / 50 files; today's wave reads 51 files / 1583, this branch 52 / 1603). Rules: never drop a
command, a trigger, a rule or a guarded string; keep every `Dev / run` slot rule (`ABC-065`/`ABC-069`)
and the `PUZZLE_DEEP` TRIGGER text byte-identical; leave ≥ 400 B headroom for `ABC-131`'s count edit and
the next lane. Check size on the branch AND on a scratch merge with the wave. Only `AGENTS.md`, a note,
and a trace row at the END of `plans/traceability.md`. Gates: lint, typecheck, `npm test` (all
`AGENTS.md` guards green), `lane-inventory.js`.
