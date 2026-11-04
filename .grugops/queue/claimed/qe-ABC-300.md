---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-04T14:25:34Z
subtask: qe-ABC-300
role: qe-e2e
ref: .grugops/context/qe-ABC-300/
branch: new grugops/qe-ABC-300 from grugops/ABC-300 — worktree .claude/worktrees/qe-ABC-300
width: wrap EVERY test, build or engine run, every vitest too, in `flock <scratch>/host-test.lock <cmd>`. One core. Offline rows only; no games (A6 is read at ABC-282's A6). Host paths only as placeholders.
---
# Verify ABC-300 (the harness plays a clock, tools only)
Read plans/tickets/ABC-300*.md, se-ABC-300's notes (…a0bef530, …b0b970ed, …33a60189) and its diff on grugops/ABC-300 against main.
Re-check A1–A5 and A7 independently. Make break attempts:
- other --tc values;
- flag order and duplicate flags;
- --tc on r/rpair;
- byte-equality of every existing dry-run argv;
- 0 src lines.
A6 stays UNKNOWN until ABC-282's A6; carry it as a named gap. UAT is waived (tools only).
Verdict: PASS, PASS_WITH_GAPS or FAIL, in a sealed note.
Fences: tests and your records only on your branch; never edit tools/rating/rating.ts itself. No push, force, amend, rebase or merge into main. Leave nothing running.
Publish: sealed notes (task qe-ABC-300, contextRoot = the worktree's .grugops/context, `at` from `date -u`); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.
