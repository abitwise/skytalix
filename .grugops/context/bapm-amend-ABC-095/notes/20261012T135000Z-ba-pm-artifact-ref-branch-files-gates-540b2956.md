---
id: 20261012T135000Z-ba-pm-artifact-ref-branch-files-gates-540b2956
kind: artifact-ref
by: ba-pm
task: bapm-amend-ABC-095
at: 2026-10-12T13:50:00Z
verified_by:
confidence: high
refs:
  - ABC-095
  - ABC-119
  - ABC-043
  - ABC-044
  - ABC-045
  - ABC-046
  - 20261012T134500Z-ba-pm-decision-abc095-amended-to-wiring-rulings-m-dor-10-of-10-b4ee59f2
  - 20261012T134225Z-ba-pm-observation-who-reads-the-ten-children-and-four-readings-off-the-list-809044ec
supersedes:
---

# Branch, files and gates for `bapm-amend-ABC-095`

This note is hand-authored and unsealed.

- **Branch:** `grugops/bapm-amend-ABC-095`, worktree `../wt-bapm-amend-ABC-095`, from `main` `85e9d5cc`.
  The amendment commit is `689ec437`, and this note is the commit on top of it. Not merged, not pushed.
- **Files:**
  - `plans/tickets/ABC-095-…md`, `ABC-119-…md`, `ABC-043-the-live-session.md`,
    `ABC-044-the-result-screen.md`, `ABC-045-resign.md`, `ABC-046-quit-and-new.md`;
  - one row appended at the end of `plans/traceability.md`;
  - the three notes in this directory.
  - `src/`, `tools/`, ADRs, `plans/board.md` and `AGENTS.md` are untouched.
- **Gates at `689ec437`, in the worktree, with `node_modules` symlinked at its root (ignored by
  `.git/info/exclude`):**
  - `npm run lint`: exit 0, 109 files;
  - `npm run typecheck`: exit 0;
  - `npm run build`: exit 0;
  - `npm test`: exit 0, 57 files and 1775 tests passed. `.test-results/last-run.json` reads
    `success: true`, 0 failed, 0 pending, 0 todo, 57 `testResults`;
  - `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: `No findings.`,
    exit 0.
- **No timing was read.** A foreign `vitest` from `oeselg-labs/platform/repos/product-template` was
  running on the host during `npm test`. That does not bear on a pass/fail reading.
