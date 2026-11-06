---
id: 20261106T190400Z-software-engineer-observation-8b80f592
kind: observation
by: software-engineer
at: 2026-11-06T19:04:00Z
verified_by: 
confidence: high: read as run; G6, the lane wall, firing and audit not read
refs:
  - ABC-289
  - ABC-282
  - ABC-303
  - EPIC-011
  - ADR-0024
  - ADR-0056
  - ADR-0071
  - ADR-0074
  - NFR-005
  - NFR-008
  - NFR-009
  - arch-ABC-303-w1-rows/20261105T124145Z-architect-design-decision-0f8a4f82
supersedes: 
seal: sha256:997e8e097a15af016357bdfe2ee4a16807846b54aad39f69e9f5e1122d4893da
---

# se-ABC-289 observation: every door, count and pin the page names, read on the tip. DP0, DP1, DP3 met; DP2 red on drift and `G1`; b 2.2727 rounds to 2.3; 13 rows, 3.6 ms in-thread

Head `grugops/ABC-289`, base `main` `063ca870`, `git archive` arms in scratch. `raw/read.ts` is `se-ABC-303`'s driver with this ticket's arms. Every output was non-empty (`raw/out/exits.txt`). These are the engineer's readings; QE grades. The base moved, so both sets are given, as d12 asks. The bars stay; 7.018 re-derives to door + 0.15.

| row | on `0cc9afd1`, re-read bundle off | on the tip, new base | bar | reads |
|---|---|---|---|---|
| door `search()` d8 kiwipete / pos-6 | 523 847 / 234 214 | 311 546 / 163 523 | equal base | met |
| door `chooseMove` d8 | 707 548 / 101 425 | 573 518 / 94 911 | equal base | met |
| head `search()` d8 | 333 296 / 193 534 | 189 531 / 118 836 | instrument | — |
| head `chooseMove` d8 | 458 740 / 83 175 | 357 380 / 77 974 | instrument | — |
| `ABC-279` pair | 839 514 / 1 533 901, 1 296 788 / 404 930 | the same | equal | met |
| DP3 ratios, kiwi s / c, pos-6 s / c | 0.6362 / 0.6484 / 0.8263 / 0.8201 | 0.6084 / 0.6231 / 0.7267 / 0.8215 | ≤ 0.88 | met |
| DP3 reach at 47 000 | 6.868 → 7.147 | 7.016 → 7.405, +0.389; 77 deeper, 5 shallower, 20 moves | ≥ door + 0.15 (7.166) | met |
| drift `search()` | 100 %, 12 | 99.47 %, **34** | ≥ 98 %, ≤ 30 | **red** |
| drift `chooseMove` | 100 %, 20 | 99.47 %, **34**; 0 sign changes | ≥ 98 %, ≤ 30 | **red** |
| mate floor d5 | 0 / 191, 0 / 189 | 0 / 191, 0 / 189 | 0 | met |
| zugzwang | — | 7 / 7, at recorded depths | 7 / 7 | met |
| `G1` | 54 / 58 | **53 / 58, 1 new** | ≥ 54, none new | **red** |

- **DP0:** S1 12 of 12 (nodes, score, move; d6–d8; door against base's shipped path). S2 70 of 70: 20 `search` and 15 `chooseMove` doors against the same door on the base, two roots.
- **DP1:** (a)–(f), 8 rows green. 8 of 8 planted faults red a row (`raw/out/mut.txt`). A first mutant run was void (no tool tree, "no tests"), caught by count and re-run.
- **DP5:** `src/evaluate.ts`, `src/evaluate-params.ts` untouched, so `G2` is not re-read.
- **Other reports:** `chooseMove` d6 floor 0 / 209; older-door floors 0 on each; KRK/KQK 0 of 17, 17, 29.
- **b:** 2.2727, n 175, p25 1.950, p75 2.743, rounds to **2.3**. Per depth d = 4–10: 2.075, 2.610, 2.479, 2.114, 2.327, 2.236, 2.256. For the Orchestrator; no change proposed.

**Gates at the tip.** Typecheck 0. Lint 0. Build 0. `npm test` exit 1: **2 742 passed, 5 failed of 2 747**, 71 files; the five are W1's rows. Skip count 0, `test-skip-integrity` No findings, `lane-inventory` No findings.

| deep lane | result |
|---|---|
| `SEARCH_DEEP` quiescence | 132 / 134, the 2 drift rows |
| `SEARCH_DEEP` bundle | 51 / 51 after the R7 re-point (49 / 51 before) |
| `SEARCH_DEEP` see 52, search 57, ordering 43, pvs-lmr 29, null-move 46, futility 53, transposition 40, taper 170, passer 29 | all green |
| `PUZZLE_DEEP` | 17 / 18, the `G1` gate |
| `ENGINE_DEEP` engine | 91 / 105, 14 W1 rows |
| `ENGINE_DEEP` uci-session | 263 / 270, 7 W1 rows |
| `ENGINE_DEEP` capacity 2, transposition 26; `UCI_DEEP` 13; `CLI_DEEP` 11 | all green |

0 pending, 0 todo in every report. Rows: `raw/out/failed-rows.txt`. **Levels not run:** it is part of DP4's read.

**Pins moved old → new: none.** No score, node or move pin moved. Re-pointed, figures unchanged (`ADR-0074` d8): `src/search.bundle.test.ts` R7's two rows, shipped → the new door. Export lists: `ABC-077` A6 38 → 39, `ABC-078` A4 20 → 21. Rules-record and ternary source rows follow the text. Door ladders grown in five test files, and `see` A-row's regex.

**Lane cost.** Default lane 2 734 → 2 747, **+13 rows** (8 DP1, 3 switch, 2 door rows), **3.6 ms in-thread**, largest 1.13 ms, against the aim ≤ 90 ms; rows ≥ 50 ms: none. None in `src/cli.test.ts`, no new file. The ≤ +0.10 s head-minus-base wall is **not read**. Deep: 7 rows in `src/quiescence.test.ts`; that lane took 96 s. `NFR-009`: 0 bytes.

**Not read:** `G6`, the lane wall, firing and audit figures on the new base (48.25 % and 0.893 % are the old base's), all `UNKNOWN - verify`.

**What the read will need, if the ticket goes on.** An owner-held quiet host for `G6` / `NFR-005` at `LEVELS[5]`, 4 000 ms, graded by the median, and for the lane twin (head-minus-base ≤ +0.10 s; `…43e6d8fd` 4), under the PREREG's slot gate. Then QE's own PREREG with CF1–CF10, C2′ ≥ 50.0 / 100 at 100 ms against the merge-base, S′ at E 1 810, the Levels lane. DP4 cannot start while DP2 is red.
