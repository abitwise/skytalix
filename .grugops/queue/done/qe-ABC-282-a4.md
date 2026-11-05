---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-05T07:43:37Z
subtask: qe-ABC-282-a4
role: qe-e2e
ref: .grugops/context/qe-ABC-282/
branch: grugops/qe-ABC-282 (tip 9e5b39ad) — existing worktree .claude/worktrees/qe-ABC-282
width: A4 only, then the verdict. No src or test edits.
---
# Read A4 (owner-approved)
The owner approved A4 (…latest orch-2026-10-30a decision): about 3.5 h, one lock hold, ALONE. Read your hop's verdict …a6a2ba28, gaps …f75e3402, ABC-282's A4 lines and F5, ADR-0071 D11, and ABC-223's protocol.
1. Check main since your read: production src/ and tools/rating unchanged since 22931005 (ABC-304 was test-only; ABC-301's emission did not land). If either moved, stop and report.
2. Seal the PREREG before any game: 5 games, tc=40/900, ABC-223's scratch protocol, M1 (0 losses on time, closest call ≥ 500 ms), M2 (≥ 75 % of each completed period used, per side, book included), both sides reported, the miss rule, what counts as a harness error, and the one case where a re-launch is allowed.
3. Dry-run the whole command before launch, and read that dry run before sealing. Check free space in /tmp first and through the run; an empty output with exit 0 is not a reading.
4. Play once. If the run passes about 4.5 h, stop and report it.
5. Close QE-282-a. Then re-issue the verdict: with A4 MET, PASS_WITH_GAPS with no blocking gap signs UAT. With A4 missed, F5, to Architect/Design: state whether it was too little or too much. The game read is not re-played either way.
Fences: no ADR, ticket, EPIC, board, src, test or tool edits. No push, force, amend, rebase or merge into main. Leave nothing running.
Publish: sealed notes (task qe-ABC-282, contextRoot = the worktree's .grugops/context, `at` from `date -u` run immediately before each note); commit; update ## Result and the trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0. Check every committed log for host paths before the commit, not after.

## Result

**2026-11-05T11:36:17Z, QE/E2E. A4 MET. Verdict re-issued: PASS_WITH_GAPS, NO BLOCKING GAP, which signs UAT** (`…5191f871`, superseding `…a6a2ba28`). Read at `04ebeb7e` (`src/` `d235214c`). The PREREG `…6b4674af` was sealed at `2d5dd850` before game 1. Played once, in one lock hold. A6 not re-played. Nothing was pushed or merged, and nothing is left running.

- **Main:** `src/` production and `tools/rating` unchanged since `22931005` (only `9e0d4044`, three test files), before launch and after the run.
- **M1 MET, both sides:** 0 losses on time; closest call White 6 705 ms (g05 move 40), Black 1 100 ms (g04 move 80, stamp-read, at least about 1 075 ms).
- **M2 MET, both sides:** 12 side-periods, bar 675 000 ms. White P1: g01 93.16, g02 94.88, g03 97.70, g04 94.96, g05 99.26 %; P2: g04 101.36 %. Black P1: g01 97.09, g02 96.98, g03 95.77, g04 98.71, g05 97.47 %; P2: g04 101.17 %.
- **Games:** g01 ½–½ 3-fold (103 plies); g02 0–1 mate (102); g03 0–1 mate (122); g04 ½–½ cap (160); g05 ½–½ 3-fold (119). 0 faults.
- **Wall:** 12 909 s = 3 h 35 min 9 s of play, hold 3 h 35 min 51 s. Wall stop not reached.
- **F5 did not fire; F1–F7 none.** QE-282-a closed.
- **Gaps (`…4f8f7f5d`):** 0 blocking. QE-282-k MEDIUM: not ALONE, another repository's vitest in 728 of 1 284 samples, 0 from skytalix, Tctl max 97.8 °C. QE-282-l LOW: longest move 59 501 ms, 499 ms under the ceiling, 13 budgets at the cap. QE-282-m LOW: QE's slips. QE-282-n INFO. QE-282-b, d, f, j stand.
- **Notes:** PREREG `…6b4674af`, read `…1434a7d1` (supersedes `…c459f805`), gaps `…4f8f7f5d`, verdict `…5191f871`. Records: `raw/out/a4/`, `raw/out/a4-rehearsal/`.
- **Owed at merge:** QE-282-j's count re-read, since `ABC-304`'s test files are on `main`. The merge and the board are not QE's.
