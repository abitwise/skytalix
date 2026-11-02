---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-02T18:10:58Z
subtask: qe-ABC-268
role: qe-e2e
ref: .grugops/context/qe-ABC-268/
branch: new grugops/qe-ABC-268 from grugops/ABC-268 (head 4ca819c3; code df984484; base ca6e8506, src tree f2388e40) — worktree .claude/worktrees/qe-ABC-268
width: wrap EVERY test/build/engine run in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`. One core.
---
# QE part 1: grade ABC-268 (P3 futility) — everything EXCEPT A6's games
## Read
plans/tickets/ABC-268*.md, ADR-0061 (PROPOSED), se-ABC-268 notes (…a787198c, …68b320a6, …6f57c250, …2e7e2a0f), arch-phase2-p3 raw/probe (audit mode).
## Do
- Own A1 cross-build sample; A2 rows + at least 3 plants of your own; A3 drift/mate/zugzwang; A3(d) cut audit re-run independently (expect 30 272 / 2 943 / 0 flips); A4 counts exact.
- Gates: G1, G5 real clock, graded G6 interleaved, G8, G9, G11, lint/typecheck/build, npm test ×3 (expect 2 407), skip-integrity, lane inventory; review the re-pointed ABC-229 rows (figures unchanged).
- DO NOT run the 100-game read, smoke or Levels — they wait owner acceptance of ADR-0061.
- Verdict for part 1: READY-FOR-A6 / GAPS (ids) / FAIL.
## Fences
Tests and your records only; no src/ production edits, no board/plans/memory-bank. No push, force, amend, rebase, merge into main. Leave nothing running.
## Publish
Sealed notes (task qe-ABC-268, contextRoot = worktree's .grugops/context, never the plugin cache); queue moves inside your worktree; commit; ## Result + trace row; brief + claim to done/.
