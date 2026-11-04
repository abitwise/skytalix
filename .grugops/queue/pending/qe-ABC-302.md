---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-04T18:29:35Z
subtask: qe-ABC-302
role: qe-e2e
ref: .grugops/context/qe-ABC-302/
branch: new grugops/qe-ABC-302 from grugops/ABC-302 — worktree .claude/worktrees/qe-ABC-302
width: wrap EVERY test, build or engine run, every vitest too, in `flock <scratch>/host-test.lock <cmd>`. One core. A8's timing read ALONE with twin arms (ADR-0035 D1), PREREG first. No games. Host paths only as placeholders.
---
# Verify ABC-302 (test-only NFR-008 headroom); UAT waived (test-only)
Read plans/tickets/ABC-302*.md (A1–A9), arch-ABC-302 …bcadd41d (forms, mutants, -t lines), the se-ABC-302 notes (…3e6f1b76, …82b1f26f), and qe-ABC-281's done brief as the precedent.
1. Freeze A6's 27 mutants in a sealed PREREG, then re-run the kill matrix on a scratch copy of the tip: every mutant is killed in the default lane at the tip, or as the matrix states.
2. A2: the moved bodies are byte-identical once the nesting indent is removed. A3: lane total 2 684. A4: every -t line prints "1 passed", with the per-lane counts. A5: AGENTS.md counts and size ≤ 18 432 B. Run the full deep lanes of the eight touched files.
3. A8: grade the default lane with interleaved twin arms against main's merge-base. Report against 10 s, the 9.4 s target, 9.5 s and 9.6 s. SE read 9.52 s ungraded.
4. Typecheck, lint, build, skip count 0, lane-inventory.
5. Verdict: PASS, PASS_WITH_GAPS or FAIL, in a sealed note. A9 (Security/NFR's ruling on R-N8H-1) follows the merge.
Fences: tests and your records on your branch; never edit src/ production files. No push, force, amend, rebase or merge into main. Leave nothing running.
Publish: sealed notes (task qe-ABC-302, contextRoot = the worktree's .grugops/context, `at` from `date -u`); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.
