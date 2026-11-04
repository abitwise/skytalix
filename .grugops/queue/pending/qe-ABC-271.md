---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-04T14:26:53Z
subtask: qe-ABC-271
role: qe-e2e
ref: .grugops/context/qe-ABC-271/
branch: new grugops/qe-ABC-271 from grugops/ABC-271 — worktree .claude/worktrees/qe-ABC-271
width: wrap EVERY test, build or engine run, every vitest too, in `flock <scratch>/host-test.lock <cmd>`. One core. Timing reads (K3, K4) run ALONE: one flock session per timing session, twin arm per ADR-0035 D1. No games. Host paths only as placeholders.
---
# Verify ABC-271 (E4a structure only at 0) and sign UAT by verdict
Read plans/tickets/ABC-271*.md (K0–K4, F1–F5), ADR-0070, your freeze (qe-ABC-271-freeze PREREG …67b5eeac, gaps …a8173b00), the rulings …730399e5 and …6ccd8243, and se-ABC-271's notes (…2340385e, …d3690ae6, …863fb251, …4e7d2740).
1. Seal a PREREG for K3 (G2 ≤ 1.05× on the six graded positions) and K4 (G6 ≥ base) before any timing run. Then grade both, graded, with twin arms.
   - Name your host temperature gate in the PREREG. If you relax it, say so and why.
   - The endgame report set (SE read it at 1.114–1.126×, above the probe's 1.085) is reported, not graded.
2. Re-check K0, K1 (a)–(e) and K2 independently against your frozen rows. Make break attempts on the seam and the memo.
3. Review the extra export pawnStructureForTest (not named in the ADR): it must be test-only and reached from test files only.
4. Run R-281-a's four moved-row -t lines with their expected passed counts (A5 "4 passed"; QE-208-a, ABC-230 A3/A4 and levels A9 "1 passed" each); a short count is a blocking gap. Also run the deep lanes SE left UNKNOWN that are cheap and game-free.
5. Default npm test: green and ≤ 10 s.
6. Verdict: PASS, PASS_WITH_GAPS or FAIL, in a sealed note. Per the owner's delegation, your verdict signs UAT.
SE's process slip (four ~1 s unlocked vitest runs) is accepted LOW by the Orchestrator; no action.
Fences: tests and your records on your branch; never edit src/ production files. No push, force, amend, rebase or merge into main. Leave nothing running.
Publish: sealed notes (task qe-ABC-271, contextRoot = the worktree's .grugops/context, `at` from `date -u`); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.
