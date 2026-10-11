---
id: 20261011T084951Z-qe-e2e-artifact-ref-abc070-gates-170bb433
kind: artifact-ref
by: qe-e2e
at: 2026-10-11T08:49:51Z
verified_by:
confidence: high
refs:
  - ABC-070
  - sha c0fedf7c (delivered; gates run here, detached)
  - branch grugops/ABC-070-abc065-dependencies
supersedes:
---

# QE `ABC-070`: commands run and gate results at `c0fedf7c`

The worktree was detached at `c0fedf7c`, with `node_modules` symlinked from the main checkout. No timing readings were taken, per the subtask fence.

- `npm run lint`: exit 0, 102 files checked, no fixes.
- `npm run typecheck`: exit 0.
- `npm run build`: exit 0.
- `npm test`: exit 0. `.test-results/last-run.json`: `success: true`, 1680 tests, 1680 passed, 0 failed, 0 pending/skipped, 0 todo. The reporter shows 53 test files passed out of 53.
- `git diff --name-only c0fedf7c~1 c0fedf7c` gives 1 path, `plans/tickets/ABC-065-…md`, and `c0fedf7c~1` = `f6187bc1`.
- A4 byte check: `/usr/bin/diff -U0` on the page at both commits, plus a line-window identity check with a failing control.
- Notes are hand-written: there is no `scripts/context-io.ts` and no propose_note in this install (memory-bank `60-progress.md`). There is no §14 stamp, so no `finding` was recorded.
