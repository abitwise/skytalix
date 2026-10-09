---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-082
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-082-evaluation-pawn-structure.md
ref: .grugops/context/ticket-to-pr-ABC-082/
source_refs: .grugops/context/rescore-abc082/  memory-bank/50-decisions/ (ADR-0024, ADR-0026)
enqueued_by: orchestrator
enqueued_at: 2026-10-09T16:35:00Z
branch: grugops/ABC-082-pawn-structure
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: build `ABC-082` — pawn-structure evaluation

DoR 10/10, 0 ⚠️ (BA/PM, `5bd065d`), size M. The ticket page is the contract (`A1`–`A8`, Scope,
fences, test notes, the 23-row pin/level table, `N8-LANE` line).

The page sorts every merged bar this change can move into four classes. Follow it exactly:
- **Exact pins** (node counts, best moves, oracle answers): re-pin from a fresh measurement, each in
  `A8`'s re-pin ledger with before/after.
- **Purpose fixtures**: re-measure; if the fixture no longer exercises its purpose, find a
  replacement and show its named mutant still reds. If none can be found → stop condition.
- **Levels** (`ADR-0024` quiescence levels, `ABC-080` `A3`, `ABC-077` `A2`, `ABC-081` `A2`/`A3`,
  `ABC-121` `A1`/`A5`, `ABC-079` `A1`, `QE-G3`, the delete rule): NEVER edit a level literal.
- **NFRs** (`NFR-005` depth, `NFR-008` lane): measure and report; never move a level.

## Stop conditions (hand up, do not trim or widen)
- Any LEVEL goes red, or a purpose fixture has no replacement → stop, report, Architect/Design rules.
- `A6`'s plain-node depth reads below 6 → stop. Missing depth 7 → report (owner warning), continue.
- Any change needed outside the page's Scope.
- `N8-LANE` over its line: measure and report, do not trim tests.

## Fences
Never merge; never push. Do not touch `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md`, ADRs.
Own `git worktree` under `.claude/worktrees/` (symlink `node_modules` from the main checkout).
Commit messages via a scratchpad file and `git commit -F`. Parallel: Engineer on `ABC-102`
(`src/command-input.ts`), Architect/Design ruling on `ABC-086` (no `src/` edits). Append trace rows
at the end of the table only.

## Publish
`decision` + `observation` + `claim` notes under `ref:`, a trace row, a ticket § Delivery with the
re-pin ledger. Queue pending → claimed → done per Workflow 17. Report: gates (lint / typecheck /
build / files / passed / skips), every engine deep lane result, the re-pin ledger summary,
`NFR-005` depth reading, `N8-LANE` reading, `src/` numstat, branch + sha.
