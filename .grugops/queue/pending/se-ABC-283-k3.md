---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-04T14:26:18Z
subtask: se-ABC-283-k3
role: software-engineer
ref: .grugops/context/se-ABC-283-k3/
branch: existing grugops/ABC-283 — worktree .claude/worktrees/se-ABC-283 (reuse it)
width: wrap EVERY test, build or engine run, every vitest too, in `flock <scratch>/host-test.lock <cmd>`. One core. No games. Host paths only as placeholders.
---
# Apply K3 to the bundle (ABC-283), per ADR-0063's F2 ruling
Read the Orchestrator ruling …6c6fb0be and the Architect's ruling arch-ABC-283-mate …05ef9fc9 (build lines 1–5) plus observation …c8e90c3c.
0. In the existing worktree, run `git merge --no-ff grugops/arch-ABC-283-mate` into grugops/ABC-283 (this brings the ADR-0063 dated lines and the diagnosis records; no rewrite).
1. Build lines 1–5 of …05ef9fc9 exactly:
   - orderKey's history branch returns Math.max(0, HISTORY[...]);
   - re-pin the bundle order row old → new, and add the negative-equals-zero assertion;
   - the rows listed as unchanged stay unchanged;
   - the listed mate-floor rows go green with no re-pin.
2. Re-read the following and record them in the Result:
   - P0;
   - zugzwang;
   - G1;
   - the mate floor (search and chooseMove d5, plus the d6 report);
   - the drift (≤ 42 cp);
   - the d8 ratios;
   - typecheck, lint and build;
   - skip count 0;
   - every deep lane, with R-281-a's four -t lines and their passed counts;
   - npm test green and ≤ 10 s, by a few interleaved base/head pairs.
   Any count that differs from …05ef9fc9 is explained before any other bar is read.
Fences: src/, tests, your records. No ticket, EPIC, ADR (beyond what the merge brings) or board edits. No push, force, amend, rebase or merge into main. Leave nothing running.
Publish: sealed notes (task se-ABC-283-k3, contextRoot = the worktree's .grugops/context, `at` from `date -u`); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.
