---
subtask: qe-ABC-229
role: qe-e2e
ticket: ABC-229
ref: .grugops/context/qe-ABC-229/
branch: grugops/ABC-229 @ e196a281 (code f6ff1c4a; main b92a3394 merged in, no conflicts); base = main b92a3394 (search-identical to 01c37946); QE commits on new grugops/qe-ABC-229 from e196a281 (worktree .claude/worktrees/qe-ABC-229)
width: ALONE (timing + games)
---
# QE ABC-229: graded G6 at 4 s, G8 on the combined tree, G5/G11, A5 smoke pair, UAT
## Read
ABC-229 ticket (A1–A5, FOLDED (ii) block), ADR-0053 d5–d10, your frozen Q-SET (qe-ABC-229-qset `…fd9819a5`), se-ABC-229
notes (`…666b62b1`, `…292fc055`, `…dbc87a5b`, `…3a1286b6`), how qe-ABC-228-ii ran (g6.mjs reuse).
## Do
- PREREG first, sealed and committed before any timed read or game.
- Q-SET gate: QP-1..QP-9 in src/quiescence.test.ts at the frozen values; reproduce 2–3 of the SE's planted faults; A1 door identity spot-check.
- Gates via `npm run …`; npm test + skip integrity; deep lanes one file at a time (local vitest entry, heap 400).
- **G8 (NFR-008, the risk on this ticket):** base b92a3394 vs head e196a281, interleaved b h h b b h, ALONE. Head median > 10 s → FAIL G8 and STOP before the smokes; report the per-file cost (which rows) so a fix can be routed.
- **G6 graded:** 5 interleaved runs per build, BOTH at 4 000 ms, kiwipete + position-6, median "≥ base", floor 6. Miss → STOP, report (owner).
- G5 (level 5 ≤ 4 s, 5 s ceiling), G11 at 4 s (reported).
- **A5 smokes ALONE `--concurrency 1`:** `d e196a281 b92a3394 <out> --budget-ms 1500 --rounds 5 --concurrency 1`, `r e196a281 <out> --elo 1910 --rounds 5 --concurrency 1`.
  S-1..S-4; W/L/D; ledger (R at 4 000 ms recorded, not pooled). Wait-clear; thermal stop median > 85 °C.
## Fences
No src/, tools/, data/ edits. Never push, force, amend, rebase, merge into main. No board edits. Never bare `npx`/`npm exec`.
No host paths in commits. Scratch `qe-229/`. Tool env file outside the repo, mode 600, pins verified.
Waiting: poll an output file or `kill -0 <pid>`; never `while pgrep -f …`. Stop every wait loop before reporting.
## Publish
Sealed notes (task `qe-ABC-229`, contextRoot = worktree), commit, `## Result` + 10-cell trace row here, brief + claim to done/.

## RESUME 2026-10-30 19:45Z (Orchestrator)
The first QE run went silent after the R smoke died at 17:43:44Z (~80 s in, mid-game; cutechess, sampler and thermal watcher all
stopped in the same second; no thermal stop, running median 74 °C) — an external kill, not a product fault. Done before it, in the
first QE's scratch `qe-229/` (same session scratchpad) and branch commit a22d4d7b (PREREG …8ecd4ea6): §§ 1–2 (Q-SET 55/55, planted
faults), § 3 gates + deep lanes, § 4 G8, § 5 G6 + G11 (both passed, since it proceeded to the smokes), § 6 D smoke (harness end code 0,
Tctl median 74.75 °C). Remaining: re-read the committed evidence (do not re-run what is done, unless a record is missing — then say
so), RE-RUN the R smoke ALONE from the start (the died run is VOID, recorded as such), then the verdict, notes, Result and done/ move.
Before starting, check that nothing else writes to the worktree or runs a harness (another agent may still hold the old run).

## Result

**2026-10-30, QE/E2E (resumed run). Verdict: PASS_WITH_GAPS.** A1–A5, the gates, G5, G8, G6 and S-1..S-4 are MET. The gaps are non-blocking. Under Test note 2 and the 2026-10-22 ruling, **this verdict signs UAT**. The merge is a human's.

- **Branch:** `grugops/qe-ABC-229`, from `e196a281`. PREREG at `a22d4d7b`; records and notes at `0da8566e`; this brief follows in the next commit.
  - QE merged nothing and pushed nothing, and made no `src`, `tools` or `data` edit.
- **Notes:**
  - PREREG `20261030T162159Z-qe-e2e-decision-8ecd4ea6`, sealed and committed before any timed read or game.
  - Breaking reads `20261030T202320Z-qe-e2e-observation-5e603f02`. Gates / G8 / G6 / G11 `…-observation-0b7fd4f6`. Smokes `…-observation-cfb537cf`. Verdict `…-decision-2afef8bf`. Artifacts `…-observation-9c9b2a67`.
- **Resume:** I re-read the first run's records, and none was missing. I re-ran only the R smoke. The first R run (killed externally at 17:43:44Z in game 1, no thermal stop) is VOID and recorded under `raw/a6/r-void/`.
- **Checks:**
  - Q-SET 55/55 in src and on the head build. A1 spot-check 0 of 114 rows differ. List sweep 0 of 516 518 nodes wrong; value sweep 0 of 250. The SE's planted faults P2, P3 and P5 are red as recorded, and QE's QE1 and QE2 are red too.
  - lint, typecheck and build exit 0. `npm test` passed 2 322 / 2 322, with 0 skips and `No findings.` All 16 deep lanes are green. **G1** 54/58. **A3** 1.019× / 1.000×. **G9** identical.
  - **G5:** level 5 max 4 001 ms.
  - **G8:** head median 9.90 s, base 9.90 s (+0.01 s). MET with 0.10 s of headroom. This ticket's cost is about 22 ms (`src/quiescence.test.ts`).
- **G6 at 4 000 ms on both builds:** kiwipete base 8 ×5, head 8 ×5. position-6 base 10 ×5, head 10 ×5. MET.
- **G11 at 4 s (reported):** depth and move equal on 5/5.
- **Smokes, ALONE at width 1:**
  - D (`d e196a281 b92a3394 --budget-ms 1500`): 2/3/5, **4.5 / 10**, NEUTRAL.
  - R (`r e196a281 --elo 1910`, `st=4`): 9/1/0, **9.0 / 10**, +381.7 ± nan. Recorded at 4 000 ms, not pooled and not compared.
  - S-1 0 faults, S-2 0 time losses, S-3 4.5 ≥ 3.0, S-4 9.0 ≥ 3.0: all MET.
- **Gaps / findings:**
  - **QE-229-a (MEDIUM, non-blocking here):** G8 headroom is 0.10 s, and the base has used it up (`src/uci-session.test.ts`, `ABC-220`, about 2.0 s per run). The next ticket that adds default-lane time will likely FAIL G8. Route to the NFR-008 owner.
  - **QE-229-b (LOW, host):** another project's vitest suite overlapped the R re-run (127 of 188 samples) and part of D (25 of 220). No thermal stop fired, the frequency fall was ≤ 0.82 %, and the readings stand. The wait-clear gates only the start of a run.
  - **QE-229-c (INFO):** the first R run was killed externally. VOID, re-run once.
  - **QE-229-d (INFO):** QE1 and QE2 are caught by one list-shape row each, and by no Q-SET value row.
- **Host:**
  - Timing session: Tctl median 56.8 °C, max 73.3 °C.
  - D: median 74.75 °C, max 83.0 °C. R: median 78.44 °C, max 87.5 °C (8 samples above 85 °C). No thermal stop fired.
- **Queue:** I worked only in the worktree. This tracked `done/` copy of the brief and its claim.md is on the QE branch. The main checkout's `claimed/qe-ABC-229.*` was not touched.

### Trace row (10 cells, header order)

| ABC-229 (qe-ABC-229) | QE PASS_WITH_GAPS at e196a281: Q-SET 55/55, A1 0/114 differ, sweeps 0 wrong, planted faults red; G6 kiwipete 8 = 8, position-6 10 = 10 at 4 000 ms MET; A5 D 2/3/5 4.5/10, R 9/1/0 9.0/10 at 4 000 ms (not pooled), S-1..S-4 MET; first R run VOID (external kill), re-run once; QE-229-a MEDIUM (G8 headroom 0.10 s, non-blocking) | EPIC-010 | quiet queen promotions in quiescence (ADR-0053 d5–d10); level 5 at 4 000 ms unchanged | NFR-004 G5 level 5 max 4 001 ms; NFR-005 G6 8 = 8 / 10 = 10 MET; NFR-008 G8 9.90 s (+0.01 s, headroom 0.10 s); A3 1.019× / 1.000×; G1 54/58; heat: timing Tctl 56.8 / 73.3 °C, D 74.75 / 83.0 °C, R 78.44 / 87.5 °C | grugops/qe-ABC-229 @ 0da8566e (+ this brief; on grugops/ABC-229 e196a281; code f6ff1c4a; main b92a3394 merged in) | npm test 63 files 2 322/2 322, skips 0; 16 deep lanes green (quiescence 116/116 and 99/99, levels 45/45, engine 77/77, uci-session 206/206, PUZZLE 18/18); QE sweeps and planted faults; .grugops/context/qe-ABC-229/notes/ (6) + raw/ | signed by the QE verdict (PASS_WITH_GAPS) | — | In Review → toward In Security/NFR and the merge (human) |
