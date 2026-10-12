---
id: 20261012T204800Z-ba-pm-artifact-ref-branch-files-gates-76a7070f
kind: artifact-ref
by: ba-pm
task: bapm-amend-ABC-101
at: 2026-10-12T20:48:00Z
verified_by:
confidence: high
refs:
  - ABC-101
  - ABC-086
  - ABC-042
  - 20261012T204500Z-ba-pm-decision-six-rulings-a5i-repinned-a9-widened-dor-10-of-10-f4a8b6ee
  - 20261012T204400Z-ba-pm-observation-what-a5i-guards-and-what-the-wiring-keeps-0a291de1
supersedes:
---

# Branch, files and gates for `bapm-amend-ABC-101`

This note is hand-authored and unsealed.

- **Branch:** `grugops/bapm-amend-ABC-101`, worktree `../wt-bapm-amend-ABC-101`, from `main` `4e5c38d4`. The
  amendment commit is `9d0e2aef`, and this note is the commit on top of it. Not merged, not pushed.
- **Files (109 insertions, 0 deletions, so append-only):**
  - `plans/tickets/ABC-086-deterministic-move-selection-under-a-fixed-seed.md`: (i′) under `A5`(i), and
    § Amendment;
  - `plans/tickets/ABC-101-difficulty-selection.md`: the `A7` reading, the `A9` widening, the guards named
    after the build, the out-of-scope annotation, § Amendment and the DoR;
  - `plans/tickets/ABC-042-entry-point-argv-and-the-first-frame.md`: one dated pointer;
  - one row at the end of `plans/traceability.md`;
  - the three notes in this directory.
  - `src/`, `tools/`, tests, ADRs, `plans/board.md` and `AGENTS.md` are untouched. The SE's branch was read
    only.
- **Gates at `9d0e2aef`, in the worktree, with `node_modules` symlinked (ignored by `.git/info/exclude`):**
  - `npm run -s lint`: exit 0, 112 files, no fixes;
  - `npm run -s typecheck`: exit 0;
  - `npm run -s build`: exit 0;
  - `npm test`: exit 0, 58 files, 1780 passed. `.test-results/last-run.json` reads `success: true`, 0 failed,
    0 pending, 0 todo;
  - `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: `No findings.`,
    exit 0.
- **No timing was read.**
