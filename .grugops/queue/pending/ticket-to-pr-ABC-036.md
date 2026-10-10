---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-036
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-036-the-moves-command.md
ref: .grugops/context/ticket-to-pr-ABC-036/
source_refs: .grugops/context/rescore-batch-2026-10-10/ (decision …973fd389)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T08:15:15Z
branch: grugops/ABC-036-moves-command
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: build `ABC-036` — the `moves` command

DoR 10/10 (BA/PM re-score `rescore-batch-2026-10-10`, merged `d9c5fdc`). The ticket page is the
contract. `A4` was re-anchored: one `legalMoves` per `moves` line, that array passed to every
`toSan`, both spied through `MoveInputDeps`.

## Stop conditions (hand up, do not trim or widen)
- Any criterion that cannot be met without touching files outside `src/command-input.ts`, its
  test, and whatever the page itself names — report and STOP.
- Any engine/search/evaluate/quiescence/transposition/puzzle file touched — STOP (`ABC-127` is
  building in parallel on the puzzle files).
- `N8-LANE` > 650 ms CPU on the default lane for this ticket's tests: stop and report.

## Fences
Never merge; never push. No `plans/board.md`, `AGENTS.md` (draft any line in your note for the
Scribe), `plans/nfr-catalog.md`, ADRs. Own worktree; link `node_modules` into YOUR worktree only.
Commit-message file in a PRIVATE scratchpad subdirectory; `git commit -F`. Real UTC stamps
(`date -u`).

## Publish
`decision` + `observation` + `claim` notes under `ref:`, a trace row appended at the END of
`plans/traceability.md`, ticket § Delivery. Queue pending → claimed → done per Workflow 17.
Report: gates (lint, typecheck, build, test, skip-integrity), per-criterion evidence, `N8-LANE`
reading, `src/` numstat, branch + sha.
