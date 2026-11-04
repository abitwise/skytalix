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
