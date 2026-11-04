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

## Result

**DONE: PASS_WITH_GAPS, with no blocking gap. The QE verdict signs UAT for `ABC-271`** on `grugops/ABC-271` (code `10f29a82`, `src/` `08e56302`) against `main` `d2f01e7c` (`src/` `4fb3da04`, unmoved since SE's base, so one K0 set). Finished 2026-11-04T16:23:17Z by qe-e2e (claude-opus-5-5). Not pushed and not merged.

- **PREREG** `20261104T143423Z-qe-e2e-decision-c55891e0` was sealed and committed (`9644b44c`) before any timing run.
  - K3 is `ADR-0067` d8's A5 (B / C / H, reverse order, the `main`-copy control C as the twin arm, void band [0.970, 1.030]). K4 uses `qe-ABC-268`'s `G6` scripts unchanged.
  - **The host temperature gate is Tctl ≤ 60.0 °C** before each K3 session and before every K4 read. **It was not relaxed.**
- **K0: MET.** 7 / 7 exact on the build and on `main`'s copy, with score and move identical. Break attempts: `search()` d7 on the 112 frozen positions and mirrors, 0 differ; six endgames at `chooseMove` d9, identical.
- **K1: MET.**
  - Part 1: QE's 44 frozen fixtures are exact per side at the probed values, and the 19 pair differences are exact.
  - Part 2: 134 186 positions against a re-implementation of the ADR's text at two live value sets: seam, hot path at six phases, mirror, `Object.is` identity against `main` live, and memo words through collisions. 0 failures in about 4.8 M checks.
  - (d) A9 green; source row green.
- **K2: MET.** Exactly the two memo-size re-pins (458 752 → 589 824). No other expectation moved in any lane.
- **K3 `G2`: MET.** R = 1.0187 (r 1.0042 / 1.0332, c 0.9832 / 1.0058), within one session spread. Reported: the endgame set reads 1.1246 / 1.1169 ×; in search, 1.021 / 1.037 × ns per node.
- **K4 `G6`: MET.** 9 / 9 and 12 / 12; every run ≥ 9; 0 WARN.
- **R-281-a:** 4 / 1 / 1 / 1 passed, as expected.
- **Deep lanes:**
  - The five game-free lanes SE left UNKNOWN are green: perft 32, zobrist 33, input 34, UCI real-engine 13, UCI session 241.
  - SE's 16 lanes are green, with G1 at 54 / 58. The weakened puzzle lane is red by design.
  - `CLI_DEEP` and `LADDER_DEEP` were not run (games).
- **Default lane:** `npm test` green, 2 672 / 2 672 in **9.34 s** (≤ 10 s). Typecheck, lint and build exit 0. Skip count 0, `No findings.`
- **`pawnStructureForTest`:** test-only, called from `src/evaluate.passer.test.ts` alone.
- **Mutants:** QE's checker kills 16 / 16. The build's own file kills 15 / 16, and E16 survives (a hot-path-only fault).
- **Gaps (none blocking):**
  - QE-271-f MEDIUM: the endgame cost is read by no bar.
  - QE-271-h MEDIUM: no default-lane row checks the hot path at live values.
  - QE-271-g LOW: the second test-only export has no caller guard.
  - INFO: QE-271-i, j, k, l.
  - QE's own process slip, LOW: a racing mutant pass, discarded.
- **Notes:**
  - `…c55891e0` (PREREG)
  - `…78f353e7` (K3)
  - `…3e1cc3ff` (K4)
  - `…fa3054e5` (K0 / K1 / K2 / gates)
  - `…0d7b2f4c` (deep lanes, R-281-a)
  - `…2608eabc` (mutants)
  - `…d0f7af61` (gaps)
  - `…74da20bf` (verdict)
- The trace row is in `plans/traceability.md`. The board move (In Review → UAT signed) and the merge are the Orchestrator's.
