---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-01T18:16:56Z
subtask: qe-ABC-254-a4v2
role: qe-e2e
ref: .grugops/context/qe-ABC-254-a4v2/
branch: new grugops/qe-ABC-254-a4v2 from grugops/qe-ABC-254-a4 (c5da6514) — worktree .claude/worktrees/qe-ABC-254-a4v2
width: ALONE WINDOW. The Orchestrator dispatches this only when no other hop of this session is running and dispatches nothing during it. Still take `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock` for the whole read.
---
# QE: fresh A4 read for ABC-254 under ADR-0055 D3-V2
## Inputs
ADR-0055 addendum D3-V2 (on main; Architect notes .grugops/context/arch-d3-under-load/ …6f646a39, …603a0ca9). Prior reads (qe-ABC-254, qe-ABC-254-a4) stay UNRESOLVED; never pool or re-grade them. Carried MET: A1, A2, A3, A5 (…1c801504).
## Do
- Seal a PREREG implementing D3-V2 exactly: pair counts only if after it no foreign vitest/cutechess, both runs foreign load ≤ 0.8 cores, Tctl < 85 °C; first 5 counted pairs per board; order alternates by counted-pair count (3:2); cap 15 attempts per board; VOID-LOAD if < 5 counted; agreement check (paired-ratio median vs graded ratio on the same side of every bar, else one re-run then VOID); bars unchanged (≥ 1.10 on two of kiwipete/position-6/start, ≥ 1.00 third, position-4 ≥ 0.97). Grade by script, not by hand.
- Record the window's start/end UTC. Start check as qe-ABC-254-a4 (3 s /proc sample, real-vitest detector); wait cap 45 min.
- Final ABC-254 verdict: PASS / PASS_WITH_GAPS (carry QE-254-b/c/d) / FAIL (bar missed → ticket miss rule) / UNRESOLVED (VOID-LOAD).
- Run time ≤ 40 min excluding waits. Thermal stop. Never kill foreign processes.
## Fences
Your records only. No src/, board, plans/, memory-bank/. No push, force, amend, rebase, merge into main. Leave nothing running.
## Publish
Sealed notes (task qe-ABC-254-a4v2, contextRoot = worktree's .grugops/context, never the plugin cache); commit; ## Result + trace row; brief + claim to done/.

## Result

**ABC-254 verdict: PASS_WITH_GAPS.** A4 is **MET** under ADR-0055 D3-V2 on a fresh ALONE read. A1, A2, A3 and A5 stay MET from qe-ABC-254 (`…1c801504`). QE-254-a is **closed**. QE-254-b and QE-254-c (LOW, test-only, BA/PM) and QE-254-d (INFO, QE's instrument) carry, and all three are non-blocking. The ticket's miss rule does not fire. UAT is owed on production lines (`src/legal.ts`) and, under the owner-delegation rule, is signed by this QE verdict; recording that is the Orchestrator's call.

- **PREREG** `…a1136cf6` implements D3-V2. It was sealed and committed in `acc092ca` after the addendum and before any timed run. Its rules: a pair is admitted only if, after it, no foreign vitest or cutechess is present, both runs read foreign cores ≤ 0.8 (unrounded) and both read Tctl < 85 °C. A board's reading is its first 5 admitted pairs, with order by admitted count (3 : 2), a cap of 15 attempts, VOID-LOAD below 5, the agreement guard, one board re-run then VOID, and unchanged bars.
- **Pre-run checks (no search):** the driver was logic-tested with a stub probe, and the grader passed 16 synthetic cases. Grading is by `grade.mjs` only.
- **Window:** the hop started at 18:52:25Z and ended at 19:02:54Z. The lock was requested and acquired at 18:57:48Z with no other holder, and **held 18:57:48–19:00:43Z** for the whole read as one `flock … run.sh` job. No other hop of this session ran.
- **Start (unchanged check), 18:57:51Z:** 0 vitest, 0 cutechess, 0 processes over 50 % on the 3 s `/proc` sample, load1 0.46, Tctl 36.4 °C. **Not SHARED.**

**A4 table** (main schedule; no re-run was owed; counted pairs ordered BH HB BH HB BH on every board):

| board | attempts | counted | head ÷ base | paired median | agree | spread B / H | status |
|---|---:|---:|---:|---:|---|---|---|
| kiwipete | 5 | 5 | **1.112** | 1.112 | yes | 2.7 % / 2.7 % | valid |
| position-6 | 5 | 5 | **1.120** | 1.125 | yes | 2.4 % / 2.8 % | valid |
| start | 5 | 5 | **1.106** | 1.106 | yes | 1.2 % / 3.8 % | valid |
| position-4 (guard) | 6 | 5 | **1.095** | 1.097 | yes | 2.3 % / 2.2 % | valid |

- **Bar and guard:** the bar holds, with all three of kiwipete, position-6 and start at ≥ 1.10. The guard holds: 1.095 ≥ 0.97.
- **Validity:** (v1) held on every attempt. Thermal: after-run Tctl was at most 78.6 °C, with per-board medians 75.4–77.2 °C.
- **INFO:** G6 depths B → H were 8 → 9, 10 = 10, 11 = 11 and 11 = 11. G5 max wall was 4 001.2 ms. No counted paired ratio fell below 1.081.
- **Load evidence:** 21 attempts, 20 admitted.
  - Counted runs read foreign cores 0.24–0.53, and load1 ran 0.46–1.31.
  - 1 pair was discarded (position-4, attempt 1): head read 1.05 foreign cores from a foreign `claude` process (PID 4469, another session, about 59 h up).
  - No gate pause.
- **Run time:** the timed schedule took 172 s, with gate waits of 0.5 s.
- **Disclosed slip:** one `cat` of this hop's own times file ran during round 1. The concurrent pair was admitted at ≤ 0.37 foreign cores, and the read stands.
- **Risk:** start is 0.006 above 1.10. kiwipete, the second 1.10 board, has 0.012 of margin.
- **Notes** (task `qe-ABC-254-a4v2`, contextRoot = worktree; 6 of 6 read back sealed, no findings):
  - PREREG `…a1136cf6`;
  - verdict `…623a62e2`;
  - timing `…a11aaf5c`;
  - host `…7aaf058c`;
  - gaps `…321add53`;
  - artifacts `…63973f82`, an observation, because the writer refuses an `artifact-ref` without §14-gate provenance.
- **Commits** on `grugops/qe-ABC-254-a4v2`: `af26e437` (claim), `acc092ca` (PREREG), `f386d8d8` (evidence and notes), then this done move. Not pushed, not merged. Nothing of this hop is left running, and no foreign process was killed.

### Trace row (10 cells, header order)

| ABC-254 | Lazy legality: make/test/unmake only for king moves, en passant, pinned pieces and checks (ADR-0003 (1-A), (c3) folded in) | EPIC-010 | ADR-0003 (amended 2026-11-01); ADR-0055 D3 validity read as D3-V2 (addendum 2026-11-01) | NFR-005: G6 ≥ base (8→9, 10=10, 11=11, 11=11) INFO; NFR-004: G5 ≤ 4 001.2 ms INFO; NFR-009/008/001 carried from qe-ABC-254 | grugops/ABC-254 @ 600d8de3 (tip fe53dbda): src/legal.ts, src/legal.test.ts, src/gameend.nfr.test.ts | QE PASS_WITH_GAPS (A4 D3-V2 read, ALONE, lock held, not SHARED): kiwipete 1.112, pos-6 1.120, start 1.106, pos-4 1.095; all valid, spreads ≤ 3.8 %, agreement held, 20/21 admitted; A1–A3, A5 MET carried (qe-ABC-254) | UAT owed (production lines); signed by this QE verdict under owner delegation (Orchestrator records) | — | QE PASS_WITH_GAPS (branch, not merged; QE-254-a closed; QE-254-b/c LOW; QE-254-d INFO) |
