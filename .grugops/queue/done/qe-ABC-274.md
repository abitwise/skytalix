---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-03T13:53:23Z
subtask: qe-ABC-274
role: qe-e2e
ref: .grugops/context/qe-ABC-274/
branch: grugops/ABC-274 (162a4eed + main merged) — worktree .claude/worktrees/se-ABC-274
width: wrap EVERY test/build/engine run in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>` — EVERY vitest run too (QE-273-a: an unlocked vitest run was seen during R1). One core. **ALONE window for A5 timing**; record uptime at each session start/end. Set CUTECHESS_CLI/STOCKFISH only if you run games (none expected). If node_modules is missing, symlink main's and remove before commit. Any single run forecast > 1 h: stop and ask.
---
# QE verdict on ABC-274 (E2-pre, value-identical)
Read plans/tickets/ABC-274*.md (A1–A9), ADR-0067 d8 (+ QE-269-f line, seam ruling …3169a174, F8), se notes (…22e25cea, …c4eedfc0, …3219e70e; fix …57960d89, …dfb8e1ba).
1. **A5 G2: seal a PREREG first** in the shape of …e36ee7ca (arms: base = main 54dee3f2 src tree 4d6b117b, second copy as control, H = ABC-274 shipped tapered entry; session 2 reversed; MET iff mean H/B ≤ 1.0500 unrounded; void only if C/B outside [0.970, 1.030], one re-run; session spread pre-stated as a report vs 0.037; round order in words). A miss → ADR-0067 F8 disposition (STOP to Architect; one cut allowed); no re-play.
2. A6 G6 (graded "≥ base": median depth not below head on either board; every run ≥ depth 6) and the S2 nps report (not graded).
3. Independently re-check A1 (B0 11 counts + cross-build), A2 (Object.is), A3, A7 (npm test 2 588, no row moved), A8, A9; S1–S3 rows green; carry-over (src diff vs c131ecd0 = seam body + tests only); the seam ruling's Q1–Q4; the deep lanes (the fix hop did not re-run them).
4. Verdict PASS / PASS_WITH_GAPS / FAIL (signs UAT); record the missed A3 freeze as a LOW process gap. Merge is the Orchestrator's and waits owner acceptance of ADR-0067.
Fences: test/records only. No push, force, amend, rebase, merge into main. Leave nothing running.
Publish: sealed notes (task qe-ABC-274, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit (Result text included); ## Result + trace row; brief + claim to done/.

## Result

**DONE: PASS_WITH_GAPS. The QE verdict signs UAT for `ABC-274`** on `grugops/ABC-274` (code `7daae342`, `src/` `4cb84035`; branch head `2baeb905` + QE records) against the pre-ticket head `main` `54dee3f2` (`src/` `4d6b117b`, which is also `main` `af214979`'s). Finished 2026-11-03T14:32:04Z. Not pushed, not merged. The merge is the Orchestrator's and human, and it waits on the owner's "accept ADR-0067".

- **PREREG** `20261103T135907Z-qe-e2e-decision-4b732a08`, sealed and committed (`25dc5b1e`) before any timing. It states the bar and statistic, the arms, the void band, the spread report against 0.037, and the round order in words. No bar moved.
- **A5 `G2`: MET.** Session 1 [B, C, P, H] read r₁ = 0.9797 (c 0.9982), 14:05:34Z–14:05:43Z, load1 0.83 → 0.92. Session 2 [H, P, C, B] read r₂ = 0.9997 (c 1.0001), 14:06:13Z–14:06:22Z, load1 0.90 → 0.91. **R = 0.9897** (0.9896932361) ≤ 1.0500. Spread |r₁ − r₂| = 0.0201, under the 0.037 reference. |R − 1.05| = 0.0603, so no "within one session spread" label. H / `58fa3eb4` = 0.9980 / 1.0130 (report). No void, no re-run.
- **A6 `G6`: MET.** 14:06:56Z–14:13:04Z, load1 0.83 → 0.55. Head kiwipete 9 × 5 and position-6 10 × 5; base the same; medians equal; WARN 0; Bxa6 / Nd5 every run.
- **S2 nps (report):** ns per node at `chooseMove` d8, H / B 1.0016 / 0.9971 (window 1) and 0.9782 / 0.9770 (window 2). Nodes per ms at 4 000 ms: head 844–875 / 847–867, base 858–889 / 830–858.
- **Re-checked independently:**
  - A1: B0 11 / 11, cross-build 0 / 9 120 (8 360 door rows).
  - A2: 0 / 4 840 290 `Object.is` misses.
  - A3: 15 / 15, with the seam ruling's Q1–Q4 met (Q2: 6 rows a family, DOUBLED 4; phase spread narrow).
  - A4: green.
  - A7: `npm test` 2 588 / 2 588 in 9.55 s; 0 expectations moved; 13 deep lanes on each tree equal (taper 168 against 146, +22 added rows; `G1` 54 / 58; mate floor 0 / 163 and 0 / 189).
  - A8: clean. A9: 15 910 / 17 510 inside int16. S1–S3 green. The carry-over condition holds, and A1, A2, A5 and A6 were read on the repair head anyway.
  - Two scratch-copy mutants: M1 (eg square-table halves dropped) goes red on A3's 5 PST rows only, and M2 (`Math.floor`) goes red on 40 rows.
- **Gaps** (none blocking):
  - QE-274-a LOW (process): the A3 freeze before the build was missed.
  - QE-274-b INFO (Architect, for `ABC-239`): A3's rows are thin in phase and board.
  - QE-274-c INFO: the formal ≈ 1 h S2 protocol was not taken.
  - QE-274-d INFO: the `node_modules` symlink is not git-ignored.
- **Notes:** `…4b732a08` (PREREG), `…9d0d829c` (A5 / S2), `…967fc993` (A6), `…7bc2d970` (A1 / A2), `…15498bb4` (verification), `…d4c26218` (gaps), `…fa87f74d` (verdict). There is a trace row in `plans/traceability.md`. The board move (In Review → UAT signed) is the Orchestrator's.
