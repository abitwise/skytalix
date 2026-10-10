---
task: wave-2026-09-25
subtask: board-audit-2026-10-10
role: orchestrator (delegated audit)
workflow: agent-factory/workflows/09-daily-sweep.md (board vs record reconciliation)
ref: .grugops/context/board-audit-2026-10-10/
enqueued_by: orchestrator
enqueued_at: 2026-10-10T07:59:44Z
branch: grugops/board-audit-2026-10-10
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: validate `plans/board.md` against the record, and bring it up to date

Ground truth, in order: git history on `grugops/wave-2026-09-25` (merges, owner-word commits),
the Orchestrator decision notes under `.grugops/context/wave-2026-09-25/notes/`, the queue
(`.grugops/queue/{pending,claimed,done}`), ticket pages.
Check and FIX on your branch:
1. Every ticket in exactly one column; column matches the record (e.g. merged + owner-accepted →
   Done; a row whose own text says "Done"/"accepted" but sits elsewhere). Every `plans/tickets/` id
   on the board and vice versa.
2. Column-heading WIP counts `(WIP n/limit)` equal the rows under them; limits match
   `.grugops/factory.config.json` `wip_limits`.
3. Board rows for tickets touched on 2026-10-09/10 reflect the latest state (re-scores, new criteria,
   dependencies now Done — e.g. rows still saying "needs ABC-078" / "OPEN" for Done tickets).
4. The Blocked section: is each entry still blocked, with a dated reason? (`ABC-074`.)
5. Ticket-page frontmatter `status:`/`column:` — 33 disagree with the board (board is
   authoritative). Sync them to the board EXCEPT these pages, which other hops are editing now:
   `ABC-126`, `ABC-083`, `ABC-036`, `ABC-038`, `ABC-010`, `ABC-087`, and any NEW ticket page.
6. Stale queue claims: `claimed/qe-ABC-080`, `claimed/rescore-abc081` (2026-09-25; both tickets Done,
   done/ records exist?) — report what you find; do NOT delete them (Orchestrator decides).
Do NOT re-score any DoR, do NOT change any ticket's acceptance text, do NOT move a ticket out of
`Backlog` into a work column on judgement — only to match the record. Prepend ONE `_Updated:` line.

## Fences
`plans/board.md` + ticket frontmatter lines only (and your note). No `src/`, `AGENTS.md`, ADRs,
config. Never merge; never push. Own worktree under `.claude/worktrees/`. Commit-message file in a
PRIVATE scratchpad subdirectory; `git commit -F`. Real UTC stamps.

## Publish
An `observation` note under `ref:` listing every discrepancy found and its fix (or why not fixed).
Queue pending → claimed → done per Workflow 17. Report: counts per column after, discrepancies
found/fixed, the stale-claim finding, branch + sha.
