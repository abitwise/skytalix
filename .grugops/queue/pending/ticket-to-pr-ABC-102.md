---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-102
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-102-undo.md
ref: .grugops/context/ticket-to-pr-ABC-102/
source_refs: .grugops/context/rescore-abc102/  memory-bank/50-decisions/ADR-0021-the-turn-loop-gains-quit-and-take-back-arms.md
enqueued_by: orchestrator
enqueued_at: 2026-10-09T16:05:00Z
branch: grugops/ABC-102-undo
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: build `ABC-102` — `undo`

DoR 10/10, 0 ⚠️ (BA/PM, `d155f04`). The ticket page is the contract (`A1`–`A9`, Scope, fences,
test notes, `N8-LANE` line, rulings 3/6/7). `A9` fences the `src/` diff to exactly
`src/command-input.ts` and `src/command-input.test.ts`; ruling 6 drops the `commands:` heading and
names the two rows (`:459`, `:1121`) that change.

## Stop conditions (hand up, do not trim or widen)
- Any change needed outside `A9`'s two files (notably `src/turn-loop.ts`, the frame, `ABC-035`'s guard).
- `A8`/`ABC-035` `A7` cannot hold at hidden count 0 on the real frame.
- `N8-LANE` over its line: measure and report, do not trim tests.

## Fences
Never merge; never push. Do not touch `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md`, ADRs.
Own `git worktree` under `.claude/worktrees/` (symlink `node_modules` from the main checkout).
Commit messages via a scratchpad file and `git commit -F`. Parallel BA/PM hops (`ABC-086`,
`ABC-082`) run on other branches; append trace rows at the end of the table only.

## Publish
`decision` + `observation` + `claim` notes under `ref:`, a trace row, a ticket § Delivery. Queue
pending → claimed → done per Workflow 17. Report: gates (lint / typecheck / build / files / passed
/ skips), the `src/` numstat, `N8-LANE` reading, branch + sha.
