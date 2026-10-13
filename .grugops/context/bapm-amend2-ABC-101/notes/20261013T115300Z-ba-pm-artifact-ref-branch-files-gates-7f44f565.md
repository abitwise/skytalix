---
id: 20261013T115300Z-ba-pm-artifact-ref-branch-files-gates-7f44f565
kind: artifact-ref
by: ba-pm
task: bapm-amend2-ABC-101
at: 2026-10-13T11:53:00Z
verified_by:
confidence: high
refs:
  - ABC-101
  - ABC-014
  - EPIC-002
  - plans/tickets/ABC-101-difficulty-selection.md
  - plans/tickets/ABC-014-board-frame-renderer.md
  - plans/epics/EPIC-002-terminal-board-and-game-loop.md
  - plans/traceability.md
  - 20261013T115000Z-ba-pm-decision-a11-folded-a9-widened-dor-10-of-10-se-qe-steps-493e3ec3
supersedes:
---

# Branch, files, gates for `bapm-amend2-ABC-101`

This note is hand-authored and unsealed. It points at a branch; it is not a gate stamp. It carries no
`sha`/`gate_run`/`content_hash`, because it points at no UAT spec.

- **Branch:** `grugops/bapm-amend2-ABC-101`, from `main` `94c1daa5`, in worktree `../wt-bapm-amend2-ABC-101`.
  Not merged and not pushed.
- **Amendment commit:** `78419c49`. It is additions only (`git diff --numstat`, 0 deleted lines):
  - `plans/tickets/ABC-101-difficulty-selection.md`: +139;
  - `plans/tickets/ABC-014-board-frame-renderer.md`: +6;
  - `plans/epics/EPIC-002-terminal-board-and-game-loop.md`: +2;
  - `plans/traceability.md`: +1, at the end;
  - notes `…d17b61d6` and `…493e3ec3`.
- **Gates,** run on the worktree before `78419c49`, with the same tree content:
  - `npm run -s lint`: 0 (112 files);
  - `npm run -s typecheck`: 0;
  - `npm run -s build`: 0;
  - `npm test`: 0, 58 files, 1780 tests. `.test-results/last-run.json` reads `success` `true`, pending 0,
    todo 0;
  - `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: "No findings.", exit 0.
- **Not touched:** `src/`, `tools/`, tests, `plans/board.md`, `AGENTS.md`, ADRs.
