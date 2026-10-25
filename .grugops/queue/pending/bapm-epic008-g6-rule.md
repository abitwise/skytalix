---
subtask: bapm-epic008-g6-rule
role: ba-pm
ref: .grugops/context/bapm-epic008-g6-rule/
epic: plans/epics/EPIC-008-skytalix-plays-measurably-stronger-at-the-same-levels-and-time-budgets.md
branch: new grugops/bapm-epic008-g6-rule from main, worktree ../wt-bapm-epic008-g6-rule
width: 2 of 2 agents (records only)
---

# EPIC-008: G6 reading rule (QE-215-a) + ABC-215 Done line

## Do
- Per Orchestrator `orch-2026-10-25w/…ccf209d9` and QE `qe-ABC-215/…c2c3540f` (finding QE-215-a): write the G6 reading rule that qe-ABC-205 and qe-ABC-215 pre-registered into EPIC-008's G6 row, dated. The rule is n = 5 per board per build, interleaved; grade by median; any run below 6 fails. Bounds do not move: depth ≥ 6 and "≥ base" stay as written, and QE-205-c stays the owner's open question.
- Add a dated line for ABC-215 to EPIC-008: Done, merged `5c91e2e4`, D NEUTRAL +15.6 ± 23.8, S3 met (row 9 and M2).
- Add a dated status line to the ABC-215 ticket page (Done, merged `5c91e2e4`).

## Fences
- Only your worktree and `<scratchpad>/bapm008/`. No `src/`. No npm/vitest. Never push, force, amend or rebase; never merge into main; no board edits. Records: class and count only.

## Publish
- Commit on your branch. Seal notes (task bapm-epic008-g6-rule). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
