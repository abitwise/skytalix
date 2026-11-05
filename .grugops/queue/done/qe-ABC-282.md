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

## Result

**2026-11-04T23:04:16Z, QE/E2E. Verdict PASS_WITH_GAPS with ONE BLOCKING GAP: it does NOT sign UAT, and ABC-282 should not merge on it. Every bar that was read is MET, but A4 is unread.** Read at `04ebeb7e` (`src/` `d235214c`) against `22931005`. The PREREG `…416a183f` was sealed at `5608a0e5` before any game. A6 was played once. Nothing was pushed or merged, and nothing is left running.

- **A6 (`…b4427cbd`):** 100 / 100 at `tc=40/8`, **W/L/D 45 / 32 / 23 = 56.5 ≥ 50.0, MET**, 0 faults, 0 losses on time, 35 min 41 s. Elo +45.4 ± 60.7, so the harness label is NEUTRAL: bar met, gain not proven. Partial moves 2.63 %, mean depth 8.062 against 7.973, head period use at 40/8 min 76.72 %, median 82.27 %.
- **A4: NOT RUN (QE-282-a, BLOCKING).** `qe-ABC-223` took 3 h 56 min; the estimate under W1 is 3.3–3.7 h, over the 1 h line, and only the owner approves it. It cannot be shortened or split. M1 and M2 are `UNKNOWN - verify`. F5 is unread.
- **Offline (`…e4b8527a`, `…ee3bb3dc`):** A0 byte-equal, 600 non-clock rows sha256-equal, A1 (c) base 0.3476, head 0.0000, A1 (a), (b), A2, D12 by QE's oracle 0 disagreements, A3 1 140 go lines 0 bad, A5 zugzwang 7 / 7, G1 54 / 58, none newly missed. Gates green, skip count 0, `npm test` 2 709 / 2 709, R-281-a 4 / 1 / 1 / 1, ABC-302's nine 1 each.
- **QE-300-a:** closed, `ABC-300` A6 MET.
- **Pin or bar:** `ABC-221` A10 a pin; D12 reading 1 a pin (fires 0 of 125); D12 reading 2 a pin (0 of 125).
- **NFR-008 (`…dfa196bf`):** head minus base **+0.020 s, ≤ +0.10 s, MET**; H 9.48 s, 0.52 s under 10 s, below 9.6 s; twin admissible, n = 8.
- **Gaps (`…f75e3402`):** 1 blocking (QE-282-a). Medium: QE-282-b, the `/tmp` quota. Low: c, the harness's shared checkout; d, foreign vitest in A6 and twin round 8; e, QE's own slips; f, g. Info: h, i, j.
- **Verdict:** `…a6a2ba28`.
- **Owed by the Orchestrator:** ask the owner for A4's run (about 3.5 h of lock); rule on the ticket's "the merge waits on A6 only" against A4; clear finished hops' scratch (QE-282-b).
