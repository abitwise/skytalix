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
