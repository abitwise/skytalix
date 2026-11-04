---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-04T16:47:43Z
subtask: se-ABC-283-merge
role: software-engineer
ref: .grugops/context/se-ABC-283-merge/
branch: new grugops/ABC-283-merge from grugops/qe-ABC-283 — worktree .claude/worktrees/se-ABC-283-merge
width: wrap EVERY test, build or engine run, every vitest too, in `flock <scratch>/host-test.lock <cmd>`. One core. No games. Host paths only as placeholders.
---
# Bring main (with ABC-271) into the ABC-283 bundle and re-read on the merged tree (QE-283-i)
Read the rulings …2409cec9 and …c7609f51, and QE's verdict qe-ABC-283 …de1dc511 with its gaps …f8f8c2cc.
1. `git merge --no-ff main` into grugops/ABC-283-merge (no rewrite). Resolve the test-file conflicts (expected: src/evaluate.taper.test.ts, src/transposition.test.ts) so that both sides' rows survive. ABC-271's memo-size re-pins and the bundle's re-pins both stand. Move no other expectation.
2. On the merged tree, re-read and record:
   - P0 (all-off doors) against main's post-271 counts;
   - K0 of ABC-271, which must still hold with the bundle off;
   - the mate floor (search and chooseMove d5, 0 lost);
   - zugzwang 7/7;
   - G1, none newly missed;
   - typecheck, lint and build;
   - skip count 0;
   - R-281-a's four -t lines;
   - npm test green, with the default-lane median over ~6 interleaved pairs against main (report it against 10 s and 9.5 s).
   Explain every count that differs from QE's …3f370426 or from main. No games.
Fences: src/ (merge resolution only), tests, your records. No production logic change. No ticket, EPIC, ADR or board edits. No push, force, amend, rebase or merge into main. Leave nothing running.
Publish: sealed notes (task se-ABC-283-merge, contextRoot = the worktree's .grugops/context, `at` from `date -u`); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.
