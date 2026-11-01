# ABC-254 identity: G4 out of tree byte-equal (7 827 + 264 rows, sha 1f29d434… / 63173dde…); A1 deep 48/48; QE's own differential 777 439 nodes, 0 mismatches, 0 mutations; perft 32/32 and 54 count lines equal; G1 58 rows equal

QE/E2E, task `qe-ABC-254`, read by the PREREG `…6b25d0a8`. The base is `09d1f675` and the head is `600d8de3`, both `git archive` trees in the scratchpad. Raw files are in `raw/g4/`, `raw/fuzz/` and `raw/gates/`.

## G4 / A3 identity, out of tree (16:43:03–16:53:03, one pool of 22 processes, rows deterministic)
- **Harness:** `raw/qe-scripts/g4.mjs`. It is `se-ABC-235/raw/a1.mjs` (sha256 prefix `c0f1a2b7ff112220`) with these additions, each marked `QE-254`:
  - `legalCapturesAndQueenPromotions` in the list rows;
  - the Zobrist key in the purity check;
  - the four doors added since ABC-235: `searchWithoutQuietPromotions`, `searchWithoutQuiescenceEvasions`, `chooseMoveWithoutQuietPromotions` and `chooseMoveWithoutQuiescenceEvasions`.
- **Corpus:** 301 positions, from the ABC-078 A3 corpus (301) and ABC-121's 190, deduped. Each tree expands the corpus with its own `legalMoves`, so the corpus rows are compared too.
- **Rows per build: 7 827.**

| part | rows |
|---|---:|
| corpus | 302 |
| lists (legal, captures, captures + queen promotions, `hasLegalMove`, check, ep, both evals, purity) | 301 |
| `chooseMove` + 5 doors × budgets 3 and 5 on `tickingClock(1)` (move, score, depth, nodes, clock reads) | 3 612 |
| `search` + 9 doors at fixed depth 5 | 3 010 |
| `searchWithoutPruning` / `…OrQuiescence` at depth 2 | 602 |

- **The depth-5 sample** runs the two unpruned doors at depth 5 on the six endgame families and position-3: 132 positions, 264 rows.
- **Result: `cmp` byte-equal, B = H.** The main sha256 is `1f29d4346517333236bb6d28faba4ef37fcd2708ead08a8eddca0c4f799f4320` and the sample's is `63173dde63fb246a044bee007a6ac9ede6087ae25ebed79c62e0a312523b96a5`. There are **0 `"pure":false` rows**.
  - The `chooseMove` rows completed depths 1–5, and every one of the 3 612 rows read the clock.
  - Six list rows append quiet promotions. The rows total about 2.2 × 10⁹ search nodes.
- **The unpruned doors at depth 2 are ACCEPTABLE** on qe-ABC-235's terms:
  - (a) `git diff 09d1f675 600d8de3 -- src/search.ts src/engine.ts src/quiescence.ts` is empty;
  - (b) the ten other search functions are node-equal at depth 5 on all 301;
  - (c) the depth-5 sample is byte-equal;
  - (d) the depth-2 rows are equal.
- **G4 MET** (A3's identity half). The `ENGINE_DEEP` engine lane (ABC-078 A3 sweep, 77/77) and the `SEARCH_DEEP` search.pvs-lmr lane (`ADR-0026` bounded oracle, 29/29) are green; see the gates note.

## A1 / A2 re-read (SE claims green)
- `ENGINE_DEEP=1 … vitest run src/legal.test.ts`, the whole file: **48/48** in 194.5 s.
  - It covers the 285 074-node walk and the 518 474-node walk at every node: four lists in order, `hasLegalMove`, `toFen`, Zobrist and full state.
  - It covers the A2 rows, plus every pre-existing legal row.
- In the default lane, the six ABC-254 rows are green in all three head runs of G8.

## QE's own differential, independent of the SE's walks (`raw/qe-scripts/fuzz.mjs`, head tree, seed 254)
- **Corpus:**
  - 3 000 seeded random playouts of up to 300 plies, from the 6 perft roots, the 6 ABC-078 endgames and the 58 puzzle FENs. A third of the picks are biased toward checks, captures, promotions and en passant.
  - 300 000 random placements that `parseFen` accepts (5.2 M tries). Sliders are favoured, and random castling and ep fields are added.
- **At every node:** `legalMoves`, `legalCaptures` and `legalCapturesAndQueenPromotions` against their `full*` oracle, compared in order on `from`, `to`, `promotion`, `flags`, `piece` and `captured`. `hasLegalMove` against `fullHasLegalMove` and against the list length. `toFen` and Zobrist checked after each lazy call.
- **777 439 nodes: 0 mismatches, 0 mutations.**
- **Classes reached:**

| class | count |
|---|---:|
| in check (nodes) | 121 026 |
| king moves rejected | 954 774 |
| pinned-piece moves rejected out of check | 40 923 |
| en-passant moves rejected | 54 (91 nodes with an ep move) |
| nodes with quiet promotions appended | 21 623 |
| no-move nodes | 5 420 |

- Wall time: 35 s.
- **The harness has power.** Plants PQ1, PQ2 and PQ3 give 428, 988 and 26 673 mismatches on a tenth of this corpus (findings note).

## Perft and G1
- `PERFT_DEEP=1` `src/perft.test.ts`: **32/32**.
- `npm run perft` on head and `node src/perft-bench.ts` on base print the same **54 count lines**. Head's rate is INFO (NFR-001): 11.5–30.4 M/s per root.
- **G1:** `PUZZLE_DEEP=1` `src/puzzle-suite.test.ts` 18/18. Out of tree, `se-ABC-235/raw/g1.mjs` on B and H gives 58 rows each, `cmp` equal: move, score, depth and nodes per row. Both sha256 values are `dfbe8735…`.
  - The rows equal base's row for row, so the solved count equals base's 54/58.
  - The count line itself is in the gates note.
- **A3 MET** (perft and identity).
