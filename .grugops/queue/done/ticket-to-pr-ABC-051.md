---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-051
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-051-turn-loop-records-false-and-per-ply-bar-blind.md
ref: .grugops/context/ticket-to-pr-ABC-051/
enqueued_by: orchestrator
enqueued_at: 2026-10-10T08:40:50Z
branch: grugops/ABC-051-turn-loop-records
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: build `ABC-051` — the turn loop's own records, and its per-ply bar

DoR 10/10, but scored 2026-08-13; `src/turn-loop.ts` has moved since. The ticket page is the
contract.

## First step — re-verify before writing code
Check every site the page names against the CURRENT `src/turn-loop.ts`, `src/turn-loop.nfr.test.ts`,
`src/turn-loop.test.ts`, `src/history.ts`. Record per site: still false / already true / moved.
If any criterion's premise no longer holds, or a criterion would now need a different file set:
write an observation note and STOP — BA/PM re-scores; do not reinterpret the page.

## Stop conditions (hand up, do not trim or widen)
- Any file outside the four above (and the page's own list) needs to change — STOP.
- Any engine/search/evaluate/quiescence/transposition/puzzle file, or `src/command-input*` (ABC-036
  awaiting UAT) — STOP.
- `N8-LANE` > 650 ms CPU on the default lane — STOP and report.

## Fences
Never merge; never push. No `plans/board.md`, `AGENTS.md` (draft any line in your note), ADRs,
`plans/nfr-catalog.md`. Own worktree; link `node_modules` into YOUR worktree only. Commit-message
file in a PRIVATE scratchpad subdirectory; `git commit -F`. Real UTC stamps.

## Publish
`decision` + `observation` + `claim` notes under `ref:`, trace row appended at the END of
`plans/traceability.md`, ticket § Delivery. Queue pending → claimed → done per Workflow 17.
Report: re-verification table, gates, per-criterion evidence, `N8-LANE`, `src/` numstat, branch + sha.
