---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-04T21:20:42Z
subtask: qe-ABC-301-s0
role: qe-e2e
ref: .grugops/context/qe-ABC-301-s0/
branch: new grugops/qe-ABC-301-s0 from grugops/ABC-301 — worktree .claude/worktrees/qe-ABC-301-s0
width: wrap EVERY test, build or engine run, every vitest too, in `flock <scratch>/host-test.lock <cmd>`. One core. No games, no fit. Short reads only. Host paths only as placeholders.
---
# Read ABC-301's scope 0 green before the fit; confirm or reject the P1 form
Read plans/tickets/ABC-301*.md (scope 0), your own qe-ABC-271 gaps …d0f7af61 (QE-271-g, h, i), arch-second-pull-1104 …4917f0f7, se-ABC-301-s0's notes (…8fb36960, …f68982f4, …534a582c), and the Orchestrator ruling of 2026-11-04T21:20:01Z.
1. P1: the written row reads 31/44; SE ran each fixture at its own phase and reads 44/44. Rule independently: is this a correct specification of the same bar, or a bar moved after a red? Re-derive it from ADR-0070 (where U fires) and your hot-row identity. Check E14–E16 and H1 die on it. State what the row would miss.
2. P2: the guard row, with planted callers. P3: 17 exports equal to main's values, the typecheck, the TUNE_DEEP lane, B-T1 0 misses.
3. The tracer deviation (it reads the seam through the frozen fixtures, not passerTermsForTest as ADR-0067 d5 says): acceptable, or not?
4. Default-lane cost of scope 0: report the added ms.
Verdict: scope 0 GREEN or RED, in a sealed note. RED stops the fit.
Fences: your records on your branch; no src or tools edits. No push, force, amend, rebase or merge into main. Leave nothing running.
Publish: sealed notes (task qe-ABC-301-s0, contextRoot = the worktree's .grugops/context, `at` from `date -u`); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.
