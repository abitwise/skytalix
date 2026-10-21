---
id: 20261021T080448Z-software-engineer-artifact-ref-abc160-branch-commit-2a006524
kind: artifact-ref
by: software-engineer
at: 2026-10-21T08:04:48Z
verified_by:
confidence: high
sealed: false
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-160
refs: [ABC-160, EPIC-005]
supersedes:
---

# `ABC-160` artifacts

- **Branch:** `grugops/ABC-160` from `main` `51503331`. Tip **`1d2fd467`** (the only commit, the code commit).
  Worktree `../wt-ABC-160`, kept for review, with a `node_modules` symlink (ignored). Not pushed, not merged.
- **Changed:** `tools/opening-book/book.test.ts` only, +18/−0, one hunk `@@ -335,0 +336,18 @@`, inside the `A1/A2`
  `it` (head lines 274–354).
- **Tests:** none added or removed (59 files / 1987 tests, base = head). One more refusal case inside an existing `it`.
- **Production lines (`src/`, tests excluded):** none. See the readings note.
- **Docs:** none touched. The ticket page, `plans/board.md` and `plans/traceability.md` are untouched (brief fence);
  the trace row is in `.grugops/queue/done/ticket-to-pr-ABC-160.md`.
- **Probe:** `probe/plant.mjs` (this folder) is the mutant planter. It writes a mutated `compile.ts` into a scratch
  copy; every anchor must match exactly once or it throws.
- **Remaining work:** the QE hop (owed). The UAT waiver applies by measurement.
