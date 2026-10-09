---
id: 20261009T163130Z-software-engineer-observation-abc082-a8-repin-ledger-and-fixture-bites-b92fa204
kind: observation
by: software-engineer
at: 2026-10-09T16:31:30Z
verified_by:
confidence: high
refs:
  - ABC-082
  - ABC-078
  - ABC-079
  - ABC-080
  - ABC-081
  - ABC-121
  - .grugops/context/ticket-to-pr-ABC-082/probe/rows.ts
  - .grugops/context/ticket-to-pr-ABC-082/probe/rows-base.json
  - .grugops/context/ticket-to-pr-ABC-082/probe/rows-branch.json
  - .grugops/context/ticket-to-pr-ABC-082/probe/oracle.ts
  - .grugops/context/ticket-to-pr-ABC-082/probe/mutants.mjs
  - .grugops/context/ticket-to-pr-ABC-082/probe/mutants-ledger.json
supersedes:
---

# `A8`'s re-pin ledger: rows 1–13, each measured on base `5ebe1d8` and branch `34c9c02` by `rows.ts`; every F-row mutant re-planted and red

**Method:**
- `node probe/rows.ts <tree>` (plain node, `DEEP=1` for rows 6-deep and 7), run on base and on
  the branch. Raw output: `rows-base.json`, `rows-branch.json`.
- Mutants: `probe/mutants.mjs`, one scratch copy per mutant, exact-string edits, the row's file
  on the default lane.
- No pin was set from a failure message: every value below was measured by the probe first.

## Class P (exact pins)

| # | row | old | new | lane |
|---|---|---|---|---|
| 1 | `search.ordering.test.ts` `A4` d2 | 9 804 / 3 391 / 2 467 | **9 319 / 3 286 / 2 429** | default |
| 2 | `search.ordering.test.ts` `G4` d3 | 261 | 261 (unchanged) | default |
| 3 | `search.ordering.test.ts` `G1` | depth 3, 358 | **depth 3, 360** | default |
| 4 | `transposition.test.ts` `A1` d4 | 1 123 / 1 299 (score 90 = 90) | **1 319 / 1 474** (80 = 80) | default |
| 5 | `transposition.test.ts` `A5` | 7 241; 0 / f7f8; −470 | **7 251**; 0 / f7f8; −470 | default |
| 6 | `quiescence.test.ts` `A4` | d2 136 / g5f6; d3 2 273 / c3d5 | unchanged | default / `SEARCH_DEEP` |
| 7 | `quiescence.test.ts` `A5` oracle | 50 / e2a6; 30 / c3d5 | **55 / e2a6; 55 / c3d5** | `SEARCH_DEEP` |
| 8 | `search.pvs-lmr.test.ts` `A4` | `[95, "h5e5"]` on both rows | `search()` row **`[10, "b1c1"]`** (new fixture, decision `…7040acad`); `chooseMove` row `[95, "h5e5"]` unchanged | default |

**Row 7: re-pinned only by the in-file rule.**
- Oracle `searchWithoutPruning(p, 3)`, plain node, on the branch.
- kiwipete: 55 / e2a6, 76 949 007 nodes, 282 s.
- position-6: 55 / c3d5, 11 799 948 nodes, 38 s.
- Both equal `searchWithoutPvsOrReductions` AND `search()` on score and move (`oracle-branch.jsonl`).
- Load 4–11 during the run; the 282 s reflects that load (record: about 160 s).

## Class F (fixture bites, re-planted on the branch)

| # | row | premise on branch | mutant | reads | red? |
|---|---|---|---|---|---|
| 3 | `G1` | depth 3 at 3 ticks | `N3` (killer recorded outside the cutoff) | 357 vs 360 | **red** |
| 8 | `A4` | see decision `…7040acad` | `noLmrResearch`, `noResearch`, each also search-only / engine-only | new `search()` fixture −20 / b1b4 vs 10 / b1c1 | **6 / 6 red** |
| 9 | `ABC-078` `A3` | e2e3 at d1 and d2 (−30, −80), g4g5 at d3. Budget 3 aborts inside d3 (1 067 nodes > 44 + 204); budget 4 completes d3 | keep the aborted iteration's best-so-far | −65 vs −80 | **red** |
| 10 | `TIE_FEN` | f8f7 vs e7f7, both 230 | `M11` (engine root unordered) | e7f7; `G1` reads 635 | **red** |
| 11 | `ABC-078` `A2` | 3 666 nodes against the 10 240 bound (base 3 836) | `M1` (in-recursion clock check deleted) | 67 176 | **red** |
| 12 | `ABC-078` `A4` | kp-vs-k at 5 / 10 / 40 ticks: 4 / 6 / 9 (base 5 / 7 / 10) | `if (iteration > 4) break;` | 4 / 4 / 4 | **red** |
| 13 | `ABC-081` `A5` | 6 ticks: d4, 0, f7f8. Deep 10 ticks: d6, 0, a3f8 | repetition-blind engine; root ignores hash move | −380; depth 3 | **red**, **red** |

**Row 12 margin:** the 10-tick reading is now exactly 6, at the `≥ 6` bound (base 7). It is
green, with no margin left. Reported, not changed.

**Pawnless fixtures (test note 6):** all green on every lane run, with no change. This covers the
mate corpus, `FORK`, `G6`, and the depth-10 rook ending.

## Class R (levels): no literal edited

`git diff 5ebe1d8 34c9c02 -- src/` changes only class-P `expect` lines and the
`ORACLE_AT_DEPTH_3` values. **Two R rows are red on the deep lanes:** observation `…9bdc69b3`.
