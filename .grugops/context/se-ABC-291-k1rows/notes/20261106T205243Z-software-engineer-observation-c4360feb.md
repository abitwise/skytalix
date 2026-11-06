---
id: 20261106T205243Z-software-engineer-observation-c4360feb
kind: observation
by: software-engineer
at: 2026-11-06T20:52:43Z
verified_by: 
confidence: high on the counts, read as run; lane cost is a reported figure on an unheld host
refs:
  - ABC-291
  - ADR-0075
  - EPIC-011
  - NFR-008
  - qe-ABC-291-k1/20261106T203639Z-qe-e2e-observation-b850a2ad
  - qe-ABC-291-k1/20261106T202814Z-qe-e2e-decision-2e186a33
  - qe-ABC-291-k1/20261106T203702Z-qe-e2e-observation-5de6a358
supersedes: 
seal: sha256:9cf83b23b6dd7b82724fd8ae6da00d8864bd0442b7ce9145ab1c7542b768b9d0
---

# se-ABC-291-k1rows observation: no QE row red, no STOP; +24 rows, about +9 ms in the lane; all four counts green

Tip of the test commit `70d931ab`. Each command ran under the host lock, one at a time.

| read | result |
|---|---|
| QE's 24 rows on the tip | **0 red, first run.** F1 does not fire |
| the 36 older rows under the new file flip | 0 red |
| `npm run typecheck` | exit 0 |
| `npm run lint` | exit 0, 148 files |
| `npm test` | 2 814 of 2 814, 71 files, none skipped, 9.18 s; was 2 790 |
| `ENGINE_DEEP` `src/evaluate.pawns.test.ts` | 121 of 121; 120 default + 1 deep |
| `git diff --name-only 63af973e -- src tools` | `src/engine.test.ts`, `src/evaluate.pawns.test.ts`, `src/uci-session.test.ts`: test files only |

## Lane cost, for `NFR-008`
**+24 tests, 0 new files, 0 searches.** `src/evaluate.pawns.test.ts` default lane, three runs each, same tree but for these rows:

| | before | after |
|---|---|---|
| file, ms | 62, 69, 60 | 79, 71, 63 |
| median, ms | 62 | 71 |
| K1 (c) + (d) tests, ms | 6.5, 7.3, 6.6 | 11.4, 11.0, 9.9 |

So about **+9 ms** on the file, of which about +4 ms is in the rows' own blocks; the rest is inside these runs' spread. Against the catalog's 0.915 s headroom this is about 1 %. **This is a reported figure, not a graded read:** the host was not held, foreign load was not logged, n = 3 and the spread (9 to 16 ms) is as wide as the delta. The one 9.18 s `npm test` wall is unpaired and no `NFR-008` verdict. That verdict stays the row census's.

## The rows see what QE said they could not
- **QE's `k1-compare.mjs` on the new file, not edited:** 60 rows, 0 values differ against the labeller, and no cell either way. All 31 mutants read at least 2; the 13 that read 0 are now 2 to 8. As before, this acts on QE's labeller, not on `src`, and counts only as-written and colour-mirror images.
- **Faults planted in `src/evaluate.ts`, on a scratch copy (`<scratch>/<home>/<repo>`), never on the branch.** Unplanted: 60 of 60. Each plant reddened a new row and none of the older 36:

| plant, white branch | red |
|---|---|
| (b) passes a neighbour two or more behind | L4 |
| any enemy piece on the stop | N11 |
| left arm reaches R + 3 | N5, N6, N13, L4 |
| double-step target holds an enemy pawn | N14 |
| friend on the stop blocks the arms | D2, D3 |

N16 and N17 had no plant: the seam takes no en passant field, and QE has no mutant for it. They pin that, and would go red only if one were added. W1–W7 had no plant on `src`: its pawn scan is on the 0x88 board and guards by file, so the wrap faults are read on QE's mutants only.
