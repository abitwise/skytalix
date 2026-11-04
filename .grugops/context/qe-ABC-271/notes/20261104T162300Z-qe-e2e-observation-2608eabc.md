---
id: 20261104T162300Z-qe-e2e-observation-2608eabc
kind: observation
by: qe-e2e
at: 2026-11-04T16:23:00Z
verified_by: 
confidence: high for the graded pass (one sequential loop, own scratch copy, file hash checked around every run); a discarded racing pass is disclosed
refs:
  - qe-ABC-271
  - grugops/qe-ABC-271
  - grugops/ABC-271
  - ABC-271
  - EPIC-011
  - E4a
  - ADR-0070
  - ADR-0067
  - ADR-0046
  - ADR-0035
  - R-281-a
  - K0
  - K1
  - K2
  - K3
  - K4
  - F1
  - F2
  - F3
  - G1
  - G2
  - G6
  - S2
  - NFR-001
  - NFR-005
  - NFR-008
  - NFR-009
  - QE-271-a
  - QE-271-b
  - QE-271-c
  - QE-271-d
  - QE-271-e
  - QE-271-f
  - QE-271-g
  - QE-271-h
  - QE-271-i
  - QE-271-j
  - QE-271-k
  - QE-271-l
  - UAT
  - main/d2f01e7c
  - src/4fb3da04
  - 10f29a82
  - src/08e56302
  - 9644b44c
  - src/evaluate.ts
  - src/evaluate-params.ts
  - src/evaluate.passer.test.ts
  - src/evaluate.passer-fixtures.json
  - src/evaluate.taper.test.ts
  - src/evaluate.pawns.test.ts
  - src/transposition.test.ts
  - qe-ABC-271/20261104T143423Z-qe-e2e-decision-c55891e0
  - qe-ABC-271-freeze/20261104T133856Z-qe-e2e-decision-67b5eeac
  - qe-ABC-271-freeze/20261104T133902Z-qe-e2e-observation-a8173b00
  - se-ABC-271/20261104T142439Z-software-engineer-decision-2340385e
  - se-ABC-271/20261104T142439Z-software-engineer-observation-d3690ae6
  - se-ABC-271/20261104T142439Z-software-engineer-observation-863fb251
  - se-ABC-271/20261104T142439Z-software-engineer-observation-4e7d2740
  - orch-2026-10-30a/…730399e5
  - orch-2026-10-30a/…6ccd8243
  - sha256:bf3c205bf4106209e3151717d93542180d90d344cecfdfbb6f2a30c9d5db887a
supersedes: 
seal: sha256:795defa8a05f5bdb56a574f1c667313138d8cb4ac9f160ead7fe09e7478fdcf1
---

# qe-ABC-271 break attempts on the seam, the memo and the hot path: 16 mutants on a scratch copy. QE's checker kills 16 / 16. The build's own `src/evaluate.passer.test.ts` kills 15 / 16, but two of those die only on a source-text pin, and **one hot-path mutant survives it: E16, the side to move inverted in `whiteMinusBlack` only (21 / 21 green)**. A test gap (`QE-271-h`), not a defect: the build is right, by QE's hot-path rows

QE/E2E, task `qe-ABC-271`. Mutants were planted in `src/evaluate.ts` on a **scratch copy** (`M2`: `git archive 10f29a82` of `src/`, `tools/` and the config, with the main checkout's `node_modules` linked), never the worktree. The copy was restored and `cmp`-equal to the build afterwards. Per mutant there were two runs, each under the host lock: QE's `k1.ts` (tree `M2`, corpus scale 0.05: 6 732 positions plus the 56 frozen rows) and the build's own test file. A sha256 of the mutated file is taken before and after each run, and all match. Raw: `raw/out/mutants2/summary.txt`. Scripts: `raw/scripts/mutate.py`, `mutants2.sh`.

| id | planted fault | QE `k1.ts` | build's test file (21 rows) |
|---|---|---|---|
| CLEAN | none | OK, 0 | 21 passed |
| E1 | U ignores the side to move | FAIL 1 229 (frozen U2-in, U4-in, U6-stm; hot k = 0) | 3 red |
| E2 | U's d capped at 5 | FAIL 606 | 3 red |
| E3 | the walk stops before Q | FAIL 20 552 | 2 red |
| E4 | a memo hit drops the white word | FAIL 40 771 | 2 red (K1 (e), live mirror) |
| E5 | black records its REAR passer | FAIL 13 444 | 2 red (live mirror, seam symmetry) |
| E6 | a king does not block the path | FAIL 16 567 | 3 red |
| E7 | hot path: white's two kings swapped | FAIL 58 233 (hot rows, live mirror) | 2 red (live mirror; source text) |
| E8 | U added per passer, into free | FAIL 3 594 | 3 red |
| E9 | the enemy cap at 6 | FAIL 23 261 | 2 red |
| E10 | U fires at phase ≤ 1 | FAIL 5 291 | 3 red |
| E11 | a miss does not store the white word | FAIL 40 771 | 2 red |
| E12 | black's R off by one | FAIL 70 518 | 5 red |
| E13 | hot path skipped when only black has a passer | FAIL 20 355 (hot rows, live mirror) | 2 red (live mirror; source text) |
| E14 | hot path: both sides' kings swapped (symmetric) | FAIL 52 172 (hot rows only) | **1 red, the source row's text pin only** |
| E15 | hot path: phase + 1, so U never fires (symmetric) | FAIL 4 464 (hot k = 0 only) | **1 red, the source row's text pin only** |
| **E16** | **hot path: the side to move inverted (symmetric; outside the pinned text)** | **FAIL 1 832 (hot k = 0 only)** | **21 passed: survives** |

## What it shows
- **The seam and the memo are well guarded by the build's own rows** (E1–E6, E8–E12). Every mutant that the seam or the memo words can see is red there. The frozen rows do their job: E1, for example, is caught by U2-in, U4-in and U6-stm.
- **The hot path is guarded by behaviour only where a fault is asymmetric** (E7 and E13 break the live mirror). A symmetric hot-path fault is seen only by a source-text pin (E14, E15), or not at all (E16). The reason: no default-lane row compares `evaluate`'s E4a contribution with the seam's at live values. K1 (b) runs at 0, where the loop adds nothing. K1 (c) reads only `passerTermsForTest`, which calls `passerTerms` with its own king scan and its own phase, not the walk's.
- **At this build nothing is wrong.** QE's hot-path rows (`k1.ts`, 1 610 232 of them on the full corpus) prove `evaluateAtPhase` = mg + trunc((D0 + e_k) × (24 − k) / 24) at two live value sets and six phases. The risk is a later regression, most likely at the second pull, when these values become non-zero and the hot path is what ships. `QE-271-h` in the gaps note proposes the one row that closes it.

## Discarded run, disclosed (process slip, LOW)
A first mutant pass on another copy (`M`) ran its vitest half without `tools/` (vitest's heap guard loads `tools/grugops/heap-guard.js`: "No test files found", exit 1). The re-pass QE started for it then **raced the first pass on the same scratch file**, because each loop copies the mutant outside the lock. Both of those passes are discarded unread, and their raw files are not kept. The graded pass above (`M2`) ran alone on its own copy, with the file hash checked around every run. Nothing outside the scratch area was touched.
