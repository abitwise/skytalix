---
subtask: se-ABC-225-main
role: software-engineer
ticket: ABC-225
ref: .grugops/context/se-ABC-225-main/
branch: grugops/ABC-225 @ 9988a778 (worktree /home/olger/projects/public/wt-ABC-225); bring current main in by MERGE (no rebase)
width: shared, no timed reads — HELD until qe-ABC-229 ends
---
# SE ABC-225: take main into the branch; rpair budget 3 000 → 4 000
## Read
ABC-225 ticket (dated lines from bapm-ABC-228-merge-fold and bapm-ABC-242-225-owner), ADR-0053 d10, tools/rating/rating.ts on main (R literal 4000), qe-ABC-225 records on grugops/qe-ABC-225 (3da78303).
## Do
- `git merge <main sha>` into grugops/ABC-225; resolve tools/rating/rating.ts so rpair's own budget reads 4 000 and A1 ("same pins as r") holds against main's R mode.
- Gates via `npm run …`; npm test count. A1–A4 re-checked (non-timed). A5/A6 are QE's, ALONE at --concurrency 1.
## Fences
tools/rating/ and its tests only. Never push, force, amend, rebase, merge into main. No board edits. Never bare npx/npm exec. No games. No host paths. Never `while pgrep -f` loops.
## Publish
Sealed notes (task `se-ABC-225-main`, contextRoot = worktree), commit, `## Result` + trace row here, brief + claim to done/.
