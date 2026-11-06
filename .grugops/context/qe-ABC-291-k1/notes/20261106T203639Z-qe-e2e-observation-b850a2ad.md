---
id: 20261106T203639Z-qe-e2e-observation-b850a2ad
kind: observation
by: qe-e2e
at: 2026-11-06T20:36:39Z
verified_by: 
confidence: high: counts read at the tip; mutants act on the labeller, not on src
refs:
  - ABC-291
  - ADR-0075
  - EPIC-011
supersedes: 
seal: sha256:58537a8cf4b88624e9a14ebfc042171db4ea3dfbefc41939759ee35fdd119e42
---

# K1's fixtures compared: 0 values differ, 0 of my rows red at the tip; `SEAM_ROWS` meets K1 (c) except d1's double step and en passant, and 13 fault classes pass it unseen

Tip `63af973e`, `src/` unedited. The freeze is after the build (`…2e186a33`, committed at `4948aad0` before `SEAM_ROWS` was opened). All of this is coverage. **No d1–d4 defect was found, and F1 does not fire.**

## Reads
| read | result |
|---|---|
| my 88 rows, 352 images, both sides to move where legal: 704 reads | seam 0 misses, mg and eg; hot path 0 misses; memo 0 misses; parse 0 |
| `SEAM_ROWS`, 36 rows, against my labeller | **0 values differ** |
| `src/evaluate.pawns.test.ts`, default lane | 95 of 95 |
| the same file, `ENGINE_DEEP` | 96 of 96 |

D1–D3 read 0 hot-path misses. With K0 (a) holding the off door to the base, that shows a backward rear pawn pays both `DOUBLED` and `PAWN_BACKWARD`.

## K1 (c)'s letter
| K1 (c) asks | `SEAM_ROWS` |
|---|---|
| one per definition per colour | met |
| one per edge file per definition | met |
| each clause of Backward failing alone | met, one form each |
| d1's exclusions | **part met.** R1, the four "excludes", add and doubled are read. **Double step and en passant have no row** |

## What `SEAM_ROWS` cannot see
Each class is a clause mutant of my labeller. "0" means no row of `SEAM_ROWS`, as written or colour-mirrored, tells the mutant from d1. The tip passes my rows on every class, so each is a missing row, not a fault in the build.

| class | mutant | `SEAM_ROWS` | mine | rows to carry |
|---|---|---:|---:|---|
| **(b): a neighbour two or more ranks behind** | `b-only-R-and-R-1` | **0** | 8 | L4 |
| double step, an exclusion | `c-double-step-target` | **0** | 20 | N13, N14 |
| en passant, an exclusion | no mutant; the seam takes no ep | none | | N16, N17 |
| friend on the stop, stop attacked | `c-friend-on-stop-blocks` | **0** | 8 | D3 |
| the same on a doubled rear pawn | `rear-of-doubled-free` | **0** | 8 | D2 |
| enemy on (f, R + 2) | `c-two-ahead` | **0** | 8 | N2 |
| enemy on (f ± 1, R + 3) | `c-attack-one-further` | **0** | 28 | N5, N6 |
| enemy piece on the stop | `c-enemy-piece-on-stop` | **0** | 4 | N11 |
| enemy piece on the attacker's square | `c-enemy-piece-attacks` | **0** | 8 | N12 |
| a/h wrap, connected | `wrap-connected` | **0** | 6 | W1, W2 |
| a/h wrap, phalanx | `wrap-phalanx` | **0** | 6 | W3, W4 |
| a/h wrap, clause (a) | `wrap-a` | **0** | 4 | W5 |
| a/h wrap, clause (c) | `wrap-c` | **0** | 4 | W6, W7 |
| phalanx at R5, value 8 | `table-phalanx-R5` | **0** | 4 | P4 |

The other 18 mutants read at least 2 rows on each side, and `SEAM_ROWS` sees them. The table's "13" counts its rows at 0, with en passant as the row no mutant reads. `raw/out/compare.out` has all 32 counts.

## Smaller gaps
- **Rows missing, no mutant:** edge-file backward by the stop arm (B9, B11). Backward at R3 and R5 (A5, B7).
- **Wings:** `SEAM_ROWS` reads the colour mirror and not the file flip. Mine read both.
- **A title reads more than its row:** "a backward rear pawn of a doubled pair still pays" reads the seam, which has no `DOUBLED` part. The value is right.
- **`SEAM_ROWS` holds nothing my list lacks,** on the (definition, R, colour, edge) cells read.

## Corrections owed (findings; I edited nothing)
1. Add the rows above to K1 (c), at least L4, N13, N14, N16, N17. The last four close K1 (c)'s letter, and L4 is the clause's reason for existing. `raw/k1-rows.mjs` holds each row with its value.
2. K1 (c) stays recorded as frozen after the build.

**Limits.** My hand values and labeller share one author, so PR3's labeller, 0 mismatches on the build, is the wider check on d1's reading. Mutants act on my labeller, not on `src`: a 0 says the row set cannot tell the fault, because each row's expected value is unchanged. It does not say the fault exists. Test note 1's "(b) rows" were not in this brief, so they are not read.
