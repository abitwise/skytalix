---
subtask: bapm-records-owner-b
role: ba-pm
ref: .grugops/context/bapm-records-owner-b/
branch: new grugops/bapm-records-owner-b from main, worktree ../wt-bapm-records-owner-b
width: 1 of 3 — records only (no npm, vitest, build or timing)
---

# Owner word: G6 "≥ base" stays graded (A); ABC-209's ADR accepted

## Do
- Read Orchestrator `owner-word-2026-10-26b/…2ae5fc12`.
- **EPIC-008:** add a dated line at the G6 row's reading rule saying that "≥ base" is graded (option A) on the owner's word, and that QE-205-c is closed.
  - Don't change the row's bound or wording otherwise.
  - Touch any other EPIC-008 line that names QE-205-c as open only with a dated pointer.
- **ABC-209 page:**
  - The `adr:` front-matter and one dated line: ADR-0025 D4 amendment ACCEPTED by the owner (`…2ae5fc12`).
  - Sync the front-matter `status`/`column` to the board: ABC-209 is moving to In Development (`ticket-to-pr-ABC-209` is building).
  - No criterion changes. An SE is building from this page right now on its own branch, so keep the edits to these lines only.
- Put any board card lines in your Result. Don't edit the board.

## Fences
- Work only in your worktree. No `src/`, and no npm/vitest/timing.
- Never push, force, amend or rebase. Never merge into main.
- Records: class and count only (ADR-0049 d4).

## Publish
- Commit on your branch. Seal notes (task `bapm-records-owner-b`) with `at` taken from `date -u`.
- Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
