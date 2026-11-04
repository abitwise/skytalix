# se-ABC-279 migration: every row that moved, old → new (test note 3, ADR-0058 d5's practice). Two figures were re-pinned (ABC-122 A6's leaf: 10 → 0 capture nodes, 139 → 129 total). Four rows were re-pointed to the door pair with their figures unchanged (ADR-0069 d8), and five source ladders grew by the new door. No zugzwang depth was re-pinned. Value and behaviour rows stay on the shipped path

Software Engineer, task `se-ABC-279`, `grugops/ABC-279`, commits `cd9ccd10` and `1feb7560`.

## Re-pointed to `searchWithoutSeePruning` / `chooseMoveWithoutSeePruning` (figures unchanged)
- **`src/engine.test.ts` ABC-170 A2 row 2** ("plays search(position, d)'s move and score at the reported depth d").
  - On the shipped tree, 6 000 nodes runs out just as depth 2 completes: 6 072 nodes, the same with the limit and with the depth cap. The row no longer enters and aborts an iteration, so it stopped biting (`expected 6072 to be greater than 6072`).
  - It measures the abort, not the SEE skip, so it now reads the door pair. Row 1 (the limit is honoured) and row 3 (maxNodes 1) stay on the shipped `chooseMove`.
- **`src/search.ordering.test.ts` ABC-080 tie fixture (TIE_FEN, depth 1).**
  - `search()` d1 a4b3 is now read on `searchWithoutSeePruning`. The shipped `search()` and `chooseMove` both play a1b1 at depth 1.
  - The engine-root = `search()`-root identity row now runs on both pairs: a4b3 on the doors, a1b1 shipped.
- **`src/evaluate.taper.test.ts` ABC-269 B0** (form-L counts). Five `chooseMove` counts (1 296 788 / 2 733 330 / 404 930 / 926 005 / 1 692 669) and `search()` d8 839 514 / 1 533 901 are now read on the doors.
  - The shipped d8 counts are ABC-279's, in `src/see.test.ts` A4 (a): 605 117 / 406 787 and 766 275 / 87 475.

## Re-pinned
- **`src/search.capacity.test.ts` ABC-122 A6.** `leafAtCapacity()` scores the ply-128 leaf "with the shipped rules", and its record now is the shipped one, `{ evasions, quietPromotions, taper, seePruning }`. The leaf's capture nodes go 10 → 0, and `result.nodes` goes 139 → 129. The score is unchanged.

## Source ladders: the new door joins each list (its literal is the shipped one less `seePruning`)
- `src/quiescence.test.ts`:
  - `RULES_SEE_PRUNING` is pinned, and the selector regex reads `taper ? seePruning ? RULES_SEE_PRUNING : RULES_TAPERED : …`.
  - The `quiescenceEvasions` and `quietPromotions` true-lists gain `searchWithoutSeePruning` / `chooseMoveWithoutSeePruning`.
- `src/search.null-move.test.ts` QE-208-c: the `nullMove` true-list gains both doors.
- `src/search.futility.test.ts`: the `futility` true-list gains both doors, and `least` goes 13 → 14 / 7 → 8.
- `src/evaluate.taper.test.ts`: `taper` is true on the shipped entry and on its SEE door. `searchWithoutTaper` is now "the SEE door less the taper", and `least` goes 14 → 15 / 8 → 9.
- Export lists: `ABC-077` A6 +1 (`searchWithoutSeePruning`) and `ABC-078` A4 +1 (`chooseMoveWithoutSeePruning`, `.length` 2). `src/see.ts` has exactly 3 exports, pinned in `src/see.test.ts`. Nothing re-exports `see`.
- `src/transposition.test.ts` A7: `seeScratchByteLength()` = 288 joins NFR-009 (a)'s sum.

## Moves that change (ticket test note 5)
- Kiwipete d8 e2a6 −81 → d5e6 −89, in both recursions. Startpos d8 `search()` d2d4 → b1c3 (the probe's report).
- No committed row read either move. Nothing reddened on them, and nothing was re-pointed for them.
- At the G6 budget (4 000 ms, depth 9) kiwipete still plays Bxa6 (e2a6) in both builds.

## Stayed on the shipped path (value and behaviour rows)
- The zugzwang rows: `src/search.null-move.test.ts` / `src/search.futility.test.ts` A3 (c), shipped `chooseMove`, at depths 8-12 as recorded. All green.
- The mate floors (ABC-268 A3 (b), ABC-269 B2) and `G1`. All green with no figure moved.
