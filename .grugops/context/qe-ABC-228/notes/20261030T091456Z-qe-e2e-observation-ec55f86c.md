---
id: 20261030T091456Z-qe-e2e-observation-ec55f86c
kind: observation
by: qe-e2e
at: 2026-10-30T09:14:56Z
verified_by: 
confidence: high: every lane and gate run in this session on the candidate; G8 interleaved with wait-clear before each run
refs:
  - qe-ABC-228
  - ABC-228
  - d9c5bcde
  - 61d5d629
  - 20261030T072548Z-qe-e2e-decision-06163ef3
  - A4
  - A5
  - G1
  - G5
  - G7
  - G8
  - NFR-004
  - NFR-008
supersedes: 
seal: sha256:b57ecb6691074bd9fe550274367c7a2cbf8b6dc0772a9c4434e8e99ba02581f3
---

# qe-ABC-228 checks, part 2: npm test and skips, the deep lanes (G1, G5, G7, A4), G8

QE/E2E, task `qe-ABC-228`, resumed under the sealed PREREG (`20261030T072548Z-qe-e2e-decision-06163ef3`) from the checkpoint (`20261030T073301Z-qe-e2e-observation-bcf2fd7c`), branch `grugops/qe-ABC-228` @ `c654f540`. Candidate `d9c5bcde` (code `9bd3c519`), base `61d5d629`. `main` is now `98dd35df`. `git diff 61d5d629 main -- src data tools package.json package-lock.json` is still empty, so no rebase is needed. Host at resume: rebooted, Tctl 34.6 °C, 0 cutechess-cli, 0 vitest. Both tool binaries' sha256 equal the harness pins (prefixes `dc776901…`, `c78c22a9…`); the paths are not recorded.

## npm test and skip integrity (`raw/gates/`)
- `npm test` at `d9c5bcde`: exit 0. 63 files, **2 211 / 2 211 passed**. Duration 9.71 s.
- `.test-results/last-run.json`: `numPendingTests` 0 and `numTodoTests` 0, so the skip count is 0. `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` printed `No findings.`, exit 0.

## Deep lanes: 15 lanes, one file each, all green (`raw/deep/`, `raw/qe-scripts/deep.mjs`)
Each lane ran as `node ./node_modules/vitest/vitest.mjs run <file>` with `NODE_OPTIONS=--max-old-space-size=400` and its flag set. No `npx` and no `npm exec`.
- `SEARCH_DEEP`: quiescence 80/80, search.null-move 44/44, search 57/57, search.ordering 43/43, search.pvs-lmr 29/29, transposition 40/40.
- `ENGINE_DEEP`: quiescence 67/67, search.ordering 30/30, search.pvs-lmr 21/21, transposition 26/26, engine 77/77, levels 44/44.
- `PUZZLE_DEEP` puzzle-suite 18/18. `CLI_DEEP` cli.real-engine 11/11. `UCI_DEEP` uci.real-engine 5/5.
- **A4 MET:** kiwipete d6 324 162 / 237 007 = **1.368×**; position-6 d6 154 464 / 109 912 = **1.405×**. Both are ≤ 1.5× and above 1.0×, so the evasion loop is alive. Both equal the reference to three decimals.
- **G1 MET:** solved **54/58**, baseline 54/58. No newly solved row. The 4 misses are the mate-in-3 rows (seeds 24, 234, 288, 580), the same as base.
- **G5 MET:** `ENGINE_DEEP` levels and engine are green. Level 5 (A5 row): 30 moves, **max 3 002 ms** against 3 s, with the 5 s ceiling. Level 6: max 5 002 ms. Level 7: max 30 001 ms.
- **G7 (reported):** `ENGINE_DEEP` transposition is green, 26/26.
- Drift report (SEARCH_DEEP quiescence): `search()` d5 is 89.30 % within 25 cp, max 118 cp, and 0 mate-status flips on the 190.
- **Host caveat:** a foreign vitest from another project started at 07:50:33 and overlapped lanes 3 to 15, including the real-clock G5 rows. Tctl reached 85.6 °C at the end of the levels lane, which takes 547 s. Each lane is still green. The G5 maximums are budget-bound (3 002 ms at a 3 000 ms budget), so extra load cannot turn a fail into a pass on that bar. The lanes are not timed reads under the PREREG; G8, G6 and G11 are, and each one waited for a clear host.

## G8 MET (`raw/g8/`, `raw/qe-scripts/g8.mjs`)
- Method: `npm test` wall in the worktree (head) and in QE's `git archive` base tree, which shares the same `node_modules`. The order was base, head, head, base, base, head.
- **Change at resume:** `g8.mjs` now waits for a clear host before every run (0 foreign vitest, 0 cutechess-cli, load1 ≤ 2.0, Tctl ≤ 60.0 °C). These are the PREREG's timing preconditions. The script holds 132 wait polls in total, because the foreign suite returned 08:16–08:39.
- Walls: base 8.62, 9.08, 9.05 s and head 9.37, 10.19, 9.36 s. Every run exited 0 (base 2 178 tests, head 2 211). load1 before each run was ≤ 1.70.
- **Medians: base 9.05 s, head 9.37 s**, so head − base is **+0.32 s**. Head's median is ≤ 10 s at load1 ≤ 8.
