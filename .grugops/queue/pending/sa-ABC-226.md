---
subtask: sa-ABC-226
role: system-analyst
ticket: ABC-226
ref: .grugops/context/sa-ABC-226/
branch: new grugops/sa-ABC-226 from main, worktree ../wt-sa-ABC-226
---

# ABC-226: records scan for the repetitions the search could not see (no games)

Work the ticket `plans/tickets/ABC-226-…` exactly: its scope, its acceptance (Given/When/Then) and its test notes.
It is a records-and-scan ticket: read the R/D PGNs already on main and use short offline scripts. No games, no
`rating.ts`, no `src/` edits. Read EPIC-010 and BA/PM `bapm-epic010-improvements/…12cb550d`, plus `sa-ideas-verify/…306a4012`
(item 3), for context.

## Fences
- Your worktree and scratchpad only. Records and scripts under your context folder. No `src/`, `data/` or `tools/`
  edits. Engine probes are single-process, under 5 min of CPU in total, only when `ps` shows no cutechess.
- Never push, force, amend or rebase. Never merge into main. No board edits. Linters only via `npm run …`. No host
  paths in records.

## Publish
- Seal notes (task `sa-ABC-226`) with `at` from `date -u`, answering each acceptance criterion. Commit on your branch.
- Write a dated result line into the ticket page on your branch, plus `## Result` and a 10-cell trace row into this
  brief in main's queue, then move it and its claim.md to done/.
