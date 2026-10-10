---
task: wave-2026-09-25
subtask: rescore-batch-2026-10-10
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md (batch DoR re-score to refill Ready)
tickets: ABC-126 ABC-083 ABC-036 ABC-038 ABC-010 ABC-087
ref: .grugops/context/rescore-batch-2026-10-10/
enqueued_by: orchestrator
enqueued_at: 2026-10-10T07:59:44Z
branch: grugops/rescore-batch-2026-10-10
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: re-score six Backlog tickets against today's merged code, to refill `Ready`

The owner wants more tickets in flight in parallel. `Ready` is 0/8. Re-score each against the merged
wave (`ABC-082`, `ABC-084`, `ABC-086`, `ABC-102`, `ABC-125` all Done since their pages were written):
- `ABC-126` (XS, P2) — its only ⚠️ (wait for `ABC-084`) is discharged; the corpus now lives in
  `src/puzzle-corpus.ts`; check the fix also keeps `ABC-084`'s puzzle suite green (option B: the
  corpus file is not on the trigger list, say whether the suite should still be run).
- `ABC-083` (P1) — 9/10, item 10 open: name exactly what is open and who rules it.
- `ABC-036` (P1), `ABC-038` (P2) — dependencies `ABC-035`/`032`/`037` are Done; the help region
  is full after `ABC-036` (`A7`).
- `ABC-010` (P1, M) — FEN semantic validation; its 2026-08-13 re-verify found 4 consumers.
- `ABC-087` (P1) — 7/10; the PVS-bound blunder-draw design question is Architect/Design's.
For each: DoR out of 10, every ⚠️ with its owner, and whether it is `Ready` now. Where a ruling is
owed, state the exact question (the Orchestrator dispatches it). Say which pairs touch the same
files (they cannot build in parallel).

## Fences
Ticket pages of these six only. No `src/`, `plans/board.md`, `AGENTS.md`, ADRs. Never merge; never
push. Own worktree; link `node_modules` into YOUR worktree only if you probe. Commit-message file in a
PRIVATE scratchpad subdirectory; `git commit -F`. Real UTC stamps. A board-audit hop runs in parallel
and will not touch these six pages.

## Publish
Page edits, one trace row per ticket, one `decision` note under `ref:`. Queue pending → claimed →
done per Workflow 17. Report: per ticket DoR / Ready? / ⚠️ owners / rulings owed; file-overlap map;
branch + sha.
