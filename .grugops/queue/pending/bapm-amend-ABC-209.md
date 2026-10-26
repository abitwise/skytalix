---
subtask: bapm-amend-ABC-209
role: ba-pm
ticket: plans/tickets/ABC-209-the-transposition-table-is-kept-across-the-moves-of-one-game.md
ref: .grugops/context/bapm-amend-ABC-209/
branch: new grugops/bapm-amend-ABC-209 from main, worktree ../wt-bapm-amend-ABC-209
width: 1 of 3 — records only (no npm, vitest, build or timing)
---

# ABC-209: place the Architect's page lines; DoR re-score

## Do
- Read Orchestrator `orch-2026-10-26u/…388d6d51` and Architect `arch-design-ABC-209/…2e73dcd9`. The page lines are in `.grugops/queue/done/arch-design-ABC-209.md`, under "BA/PM page lines".
- Place each line on the ABC-209 page as a dated amendment:
  - Scope 1: CLI `new` as a clear path.
  - Scope 2: the clear door is "no token".
  - Scope 3 and the `adr` front-matter.
  - Test note 2: answered.
  - A4: the shape of the 40-search row.
  - A3: pair selection.
- **No criterion's bar changes.** If a line would change one, stop and say so.
- Re-score DoR. Put the board card lines in your Result: In Design → Ready for Dev if 10/10. Don't edit the board.

## Fences
- Work only in your worktree. No `src/`, and no npm/vitest/timing.
- Never push, force, amend or rebase. Never merge into main.
- Records: class and count only (ADR-0049 d4).

## Publish
- Commit on your branch. Seal notes (task `bapm-amend-ABC-209`) with `at` taken from `date -u`.
- Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
