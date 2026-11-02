---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-02T22:05:41Z
subtask: qe-ABC-269-freeze
role: qe-e2e
ref: .grugops/context/qe-ABC-269-freeze/
branch: new grugops/ABC-269 from main (at dispatch) — worktree .claude/worktrees/qe-ABC-269-freeze (the Engineer builds on top of your commit on this same branch)
width: wrap EVERY test/build/engine run in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`. One core.
---
# Freeze ABC-269's QE positions before the build
Read plans/tickets/ABC-269*.md (QE freezes section), ADR-0064, arch-E1 notes (…d8150777) and raw/probe.
- Freeze, as committed fixtures plus a sealed PREREG note, BEFORE any E1 code exists: the 6 king-and-pawn endings for B1(d), the passer readings by phase for B1(e), ≥ 15 mirror positions for B1(a), and any other set the page names. Choose them independently of the probe where the page allows; record why each is in.
- No production code; fixtures/test data only (tests that need E1 code are written by the Engineer).
Fences: test fixtures + your records only. No push, force, amend, rebase, merge into main. Leave nothing running.
Publish: sealed notes (task qe-ABC-269-freeze, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit; ## Result + trace row; brief + claim to done/.
