---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-04T21:18:23Z
subtask: qe-ABC-282
role: qe-e2e
ref: .grugops/context/qe-ABC-282/
branch: new grugops/qe-ABC-282 from grugops/ABC-282 — worktree .claude/worktrees/qe-ABC-282
width: wrap EVERY test, build or engine run, every vitest too, in `flock <scratch>/host-test.lock <cmd>`. One core. **Game reads ALONE: each whole match in ONE flock.** Timing reads ALONE with twin arms. **Any single validation run estimated over 1 h: STOP and report before running; only the owner approves it.** Host paths only as placeholders.
---
# Verify ABC-282 (W1) — A6's 100-game clock read; the verdict signs UAT
Read plans/tickets/ABC-282*.md (A0–A6, F1–F7, budget line), ADR-0071 (D1–D12, D10's control), the se-ABC-282 notes (…aadd2d48, …988cd2cb, …2d4dc274, …6779a759), QE-300-a (carried here), and the qe-ABC-283 done brief as the game-read precedent.
1. Seal a PREREG before any game or timing read: A6 = 100 games at `d --tc 40/8` (40 moves in 8 SECONDS; time it from ADR-0071 D10, not from SE's ABC-300 note), W1 against main's merge-base, intent GAIN ≥ 50.0 / 100. A miss is final: no re-play. A4: the existing 5-game 40/15 check and M2's ≥ 75 % period use (R-0071-1). State the time estimate of each.
2. Close QE-300-a: read the control: line in machine.txt and the tokens in cmd.txt from the real run.
3. Re-read offline, independently: A0's counts, A1 (a)–(c), A2, A3, A5, the D12 rows, every non-clock mode node-identical to main, typecheck, lint, build, skip count 0, R-281-a's four lines and ABC-302's nine -t lines.
4. Review, and say pin or bar:
   - ABC-221 A10's change (three searches moved to go movetime 90000; a fourth keeps the clock line). SE changed it because W1 makes the old assertion impossible; the ticket did not foresee it.
   - SE's two D12 item 2 readings. Count how often reading 1 fires on the K25 / A1 (c) corpus, as information.
5. NFR-008: grade the default lane with twin arms against main's merge-base. Budget ≤ +0.10 s as the head-minus-base median wall; report against 10 s and 9.6 s.
6. Verdict: PASS, PASS_WITH_GAPS or FAIL, in a sealed note. Per the owner's delegation it signs UAT. On an A6 miss it is FAIL, and nothing merges.
Fences: tests and your records on your branch; never edit src/ production files. No push, force, amend, rebase or merge into main. Leave nothing running.
Publish: sealed notes (task qe-ABC-282, contextRoot = the worktree's .grugops/context, `at` from `date -u`); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.
