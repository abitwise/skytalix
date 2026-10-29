---
subtask: se-ABC-227
role: software-engineer
ticket: ABC-227
ref: .grugops/context/se-ABC-227/
branch: new grugops/se-ABC-227 from main, worktree ../wt-se-ABC-227
---

# ABC-227: profile where a node's time goes at 3 s (no code change)

Work the ticket `plans/tickets/ABC-227-…` exactly: its scope, its acceptance and its test notes. It is a measurement
ticket: `node --cpu-prof` plus heap sampling on the fixed boards, scripts and outputs under your context `raw/`. No
`src/` change. Read EPIC-010 and BA/PM `bapm-epic010-improvements/…12cb550d`, plus `sa-ideas-verify/…306a4012` (item 7).

## Fences
- About 1 min of CPU per board, as the ticket says. Record load1 per run. Run only when `ps` shows no cutechess; if
  one appears, wait. No games and no `rating.ts`.
- Own `npm ci --ignore-scripts`. Linters only via `npm run …`; never a bare `npx <name>`.
- Your worktree and scratchpad only. No `src/`, `data/` or `tools/` edits. Never push, force, amend or rebase. Never
  merge into main. No board edits. No host paths or usernames in records or profiles (redact `.cpuprofile` URLs).

## Publish
- Seal notes (task `se-ABC-227`) with `at` from `date -u`, answering each acceptance criterion. Commit on your branch.
- Write a dated result line into the ticket on your branch, plus `## Result` and a 10-cell trace row into this brief
  in main's queue, then move it and its claim.md to done/.
