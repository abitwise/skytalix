# se-ABC-274 acceptance readings (Engineer's rows; no timing): A1 node identity 11/11 exact against the pre-ticket head, cross-build 0 mismatches in 9 120 rows; A2 0 `Object.is` misses in 25 620 rows; A3 15/15 families blended exactly, and every row goes red when the eg halves are ignored; A4 green; A7 zero expectations moved, npm test 2 566 → 2 585 (+19 added rows), deep lanes equal to the pre-ticket head's; A8 R-TC scan green; A9 |Σ mg| ≤ 15 910, |Σ eg| ≤ 17 510, inside int16. A5 / A6 / S2 nps belong to QE and are owed

Every run was under the host lock (`flock …/host-test.lock`). The pre-ticket head is `128e3c6c`, whose src tree equals `main` `54dee3f2` (`ABC-269` + C1). It was read two ways: as `git archive HEAD src` in the scratchpad, for the one-process readings, and as a detached worktree, for its own deep lanes. Scripts are under `raw/scripts/`, outputs under `raw/out/`.

## A1: node identity (read first)
- **B0's 11 readings** (`b0.ts`, run once per build): the candidate's output is byte-identical to the head's (`diff` empty).
  - `chooseMove` kiwipete d8 1 296 788, d9 2 733 330; position-6 d8 404 930, d9 926 005, d10 1 692 669.
  - `chooseMoveWithoutTaper` d8: kiwipete 1 306 981, position-6 391 451.
  - `search` d8: kiwipete 839 514, position-6 1 533 901.
  - `searchWithoutTaper` d8: kiwipete 888 786, position-6 1 262 046.
  - These equal `se-ABC-269-cut`'s `b0.out`.
- **Cross-build** (`xbuild.ts`, one process, candidate against head): 190 positions (`G3`'s 184 plus 6 endgames). The readings were the shipped `search()` and 13 search doors at d1–3 (the Pruning doors at d1–2), and the shipped `chooseMove` and 7 engine doors to d3. Each row compared `nodes|score|move`. **9 120 rows, 0 mismatches**: `ABC-269`'s 8 360 door rows, plus 570 shipped `search` rows and 190 shipped `chooseMove` rows.

## A2: the same evaluation (`a2.ts`, one process)
- **Positions:** 366 distinct FENs: `G3`'s 184, every FEN in `src/evaluate.taper-corpus.ts` and the 6 endgames. With mirrors that is 732 positions.
- **Readings:** `evaluate`, `evaluateWithoutTaper`, `evaluateWithoutMobility` and `evaluateWithoutPawnCache` on every position, plus `evaluateAtPhase` at every phase 0–30 (22 692 rows). **25 620 rows, 0 `Object.is` misses.**

## A3: the blend is live for every family (default lane, `src/evaluate.taper.test.ts`)
- **The 15 families:** MATERIAL, PST.pawn/knight/bishop/rook/queen/king, DOUBLED, ISOLATED, PASSED, the 3 king-file terms, MOBILITY_WEIGHT and MOBILITY_CAP.
- **Offsets:** C = 24 on the eg half. The square tables take it on files a–d only, so that the king's offset does not cancel. The mobility cap takes −72.
- **Positions:** six per family, each at phases 1–23 with a non-zero count, selected by rule (see the migration note).
- **Checks on each position:**
  - `evaluate` equals mg + trunc((Δ + shift) × (24 − w) / 24) under `Object.is`. Here mg and Δ are E1's, read outside the seam, and shift is the offset times the term's count, computed by the test's own counters.
  - mg is unchanged.
  - At phase 0, the score moves by exactly the shift.
- **Result: 15/15 green.**
- **Mutation check:** I planted a temporary mutant that packs mg into both halves, drops mobility's Δ and reads the king's eg from the shipped table. All 15 family rows went red, and so did the seam row. The mutant was restored from a copy, and `grep MUTANT` returns 0.

## A4: `G3` and purity
- The mirror rows (`G3` and the taper corpus's 30) are green in the default lane. `evaluate` writes no module state: the packed arrays are written only by `loadParameters`, at load and by the test-only seam.

## A7: no row moves
- **`npm test`:** 2 566/2 566 before (pre-change, same worktree) and **2 585/2 585 after**. The 19 added rows are A3 (17) and A9 (2).
- **Deep lanes, candidate then pre-ticket head** (each `vitest --reporter=verbose` under the lock; the head's figures are in `deep-base-exits.txt`):
  - taper 165 (head 146, +19);
  - null-move 44; futility 53; search 57; quiescence 116; transposition (SEARCH_DEEP) 40; pvs-lmr 29; ordering 43; engine 82; transposition (ENGINE_DEEP) 26; pawns 44; puzzle 18 (G1 54/58).
  - puzzle-weakened: 1 failed | 13 passed. Its gate is the weakened negative control, "solved 16 ≥ 54" is meant to fail, and the head reads the same.
- **Report lines:** mate floor 0/163 and 0/189, `ABC-268` A4's ratios and heads unchanged.

## A8 and A9
- **A8:** the diff reads no budget, deadline, `movetime`, test flag or environment (`src/levels.test.ts` R-TC scan green). No games were played.
- **A9:** the bound from the table is |Σ mg| ≤ 15 910 and |Σ eg| ≤ 17 510. Both are inside int16. Its non-vacuity row (a queen eg of 3 000) goes red.

## Owed (not this hop's)
- **A5 `G2`:** QE, under PREREG `…e36ee7ca`'s shape.
- **A6 `G6`:** QE, ≥ 5 interleaved rounds per board.
- **S2 nps:** reported only.
- **`NFR-008` `N8-LANE`:** no timing reading here.
- **UAT:** the QE verdict.
- **QE's A3 freeze:** test note 1. It was not found, so `UNKNOWN - verify`.
- **The Architect's word on the `withParametersForTest` seam:** A3 says `UNKNOWN - verify`.
