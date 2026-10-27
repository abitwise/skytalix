---
subtask: bapm-ready-ABC-210
role: ba-pm
ticket: plans/tickets/ABC-210-checks-at-the-horizon-a-check-extension-or-checks-in-quiescence.md
ref: .grugops/context/bapm-ready-ABC-210/
branch: new grugops/bapm-ready-ABC-210 from main, worktree ../wt-bapm-ready-ABC-210
width: 1 of 3 — records only (no npm, vitest, build or timing)
---

# ABC-210: Ready trigger met (ABC-209 closed) — DoR re-score; ABC-208 page front-matter sync

## Do
- Read Orchestrator `orch-2026-10-27c` (this hop's routing note) and BA/PM `bapm-s1-ABC-209/…492fb6ce`. Use `bapm-ready-ABC-209` (`…955d0031`) as the model.
- **Re-score the ABC-210 page's DoR** against the kit's `checklists/definition-of-ready.md` at main's tip. Re-check every `file:line` cite: ABC-208 moved `search.ts`/`engine.ts`, and ABC-209 never merged.
- **Carry the epic's reading rules onto the page as dated lines:**
  - D base = its own merge-base on main.
  - G6 by the EPIC-008 rule, with "≥ base" graded (rule A, the owner's word `…2ae5fc12`).
  - This ticket's own "≥ base − 1" clause: is it still consistent with rule A? Say so, and don't decide it.
  - One reading, final (`…4c3f7639`).
  - A frozen-clock d7/d8 pre-check.
  - The reading runs ALONE.
- **The ADR question:** the page names a reversal of `quiescence.ts:21-24` (a new ADR plus an ADR-0026 door), which goes to the owner. Say whether that is still needed as written. Don't decide it; flag it for Architect/Design's design hop.
- **ABC-208 page (LOW):** sync the front-matter `status`/`column` to Done (merged `b5c67ab7`). Nothing else on that page.
- Put the board card lines in your Result: Backlog → Ready if DoR is 10/10, otherwise say what is missing. Don't edit the board.

## Fences
- Work only in your worktree. No `src/`, and no npm/vitest/timing.
- Never push, force, amend or rebase. Never merge into main.
- Records: class and count only (ADR-0049 d4).

## Publish
- Commit on your branch. Seal notes (task `bapm-ready-ABC-210`) with `at` taken from `date -u`.
- Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
