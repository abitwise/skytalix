---
subtask: bapm-ready-ABC-209
role: ba-pm
ticket: plans/tickets/ABC-209-the-transposition-table-is-kept-across-the-moves-of-one-game.md
ref: .grugops/context/bapm-ready-ABC-209/
branch: new grugops/bapm-ready-ABC-209 from main, worktree ../wt-bapm-ready-ABC-209
width: 1 of 3 — records only (no npm, vitest, build or timing)
---

# ABC-209: Ready trigger met (ABC-208 Done) — DoR re-score

## Do
- Read Orchestrator `orch-2026-10-26q/…836cb92d` (ABC-208 merged as `b5c67ab7`, S1 MET) and the BA/PM `bapm-ready-ABC-208` hop as the model (`…75bf6402`).
- Re-score the ABC-209 page's DoR against the kit's `checklists/definition-of-ready.md` at main's current tip. Re-check every `file:line` cite against the tree: null move moved `search.ts`/`engine.ts`.
- State on the page what this ticket carries forward from the epic:
  - D base = its own merge-base on main, which now carries ABC-208.
  - G6 by the EPIC-008 rule.
  - One reading, final (`…4c3f7639`).
  - A frozen-clock d7/d8 pre-check.
  - The reading runs ALONE.
  - NFR-009 growth ≤ 1 MiB over 40 moves (over = STOP).
- The page names an `ADR-0025` D4 amendment that goes to the owner. Say whether it is needed as written, or whether the change fits inside an accepted ADR. Don't decide it; flag it for Architect/Design's design hop.
- Put the board card lines in your Result: Backlog → Ready if DoR is 10/10, otherwise what is missing. Don't edit the board.

## Fences
- Work only in your worktree. No `src/`, and no npm/vitest/timing.
- Never push, force, amend or rebase. Never merge into main.
- Records: class and count only (ADR-0049 d4).

## Publish
- Commit on your branch. Seal notes (task `bapm-ready-ABC-209`) with `at` taken from `date -u`.
- Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
