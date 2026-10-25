---
subtask: bapm-amend-ABC-215
role: ba-pm
ticket: plans/tickets/ABC-215-the-evaluation-values-are-our-own-and-the-cc-by-sa-carve-out-leaves-notice.md
ref: .grugops/context/bapm-amend-ABC-215/
branch: new grugops/bapm-amend-ABC-215 from main (after the design merge), worktree ../wt-bapm-amend-ABC-215
width: 1 of 3 (records only)
---

# ABC-215 scope line: README licence sentence (before Ready for Dev)

## Do
- Per Architect `arch-design-ABC-215/…e04234f4`: `README.md:84-86` (ABC-216) says the evaluation values are CC BY-SA 3.0; that becomes false at this ticket's merge. Amend A8 (dated) so the build also updates that README sentence (and only it), keeping ABC-216's A2/A3/A7 true (Apache-2.0, LICENSE/NOTICE links, kit files MIT). No other scope change.
- Re-score DoR; give the board card line for In Design → Ready for Dev.

## Fences
- Only your worktree and `<scratchpad>/bapm215/`. No `src/`. No npm/vitest. Never push, force, amend or rebase; never merge into main; no board edits. Records: class and count only.

## Publish
- Commit on your branch. Seal notes (task bapm-amend-ABC-215). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
