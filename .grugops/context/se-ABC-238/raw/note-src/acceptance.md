# se-ABC-238 acceptance: A1 (G4) met, A2 met, A3 met, the mate floor met, A4 NOT MET (F4), firing rate 0.2 %

At `grugops/ABC-238` (code commit, see artifacts note) against `main` `b19af469`. Every reading is deterministic: fixed depth, or `chooseMove` on a frozen clock with `maxDepth`. Raw files are in `raw/`.

## A1 / G4 / F6: cross-build, out of tree (`raw/a1.txt`, `raw/scripts/a1.mjs`, adapted from se-ABC-229's)
- **Corpus:** 276 positions, the `ABC-078 A3` / `ABC-121` sources (six roots, six endgames, every in-progress child).
- **The new pair against base's shipped path, 0 differ on score, move and nodes:**
  - head `searchWithoutDeeperCutoffs` against base `search()` at d1-4: 1 104 rows, sha `98c554876f946df4` on both sides;
  - head `chooseMoveWithoutDeeperCutoffs` against base `chooseMove` to 4: 276 rows, sha `16053ea24626369f` on both sides.
- **Every older door against its pre-ticket self: 0 differ.** The shas equal those se-ABC-229 recorded:
  - QuietPromotions pair `477fbd2e…` / `32a44406…`;
  - QuiescenceEvasions pair `7a5924b5…` / `aa3b9cfa…`;
  - NullMove, Reductions, PvsOrReductions, Table, Ordering, Killers and Quiescence at d3;
  - Pruning and PruningOrQuiescence at d2;
  - the three older engine doors to 4.
- **Non-vacuity (thin at these depths):** head `search()` differs from base on 10 of 1 104 rows. Head `chooseMove` to 4 differs on 0 of 276; the rule barely fires below depth 5. The liveness row and the deep readings below show it acting.

## A2: the predicate (`src/transposition.test.ts`, default lane)
- An exact entry at depth 8, probed at depth 5, returns 40 with the switch on and null with it off.
- **Each bound against each side of the window, the switch on and off:**
  - lower: cuts at beta 50 and 40, returning 50 (fail-soft); does not cut at beta 51 or below alpha;
  - upper: cuts at alpha 50 and 60, returning 50; does not cut at alpha 49 or above beta;
  - exact: returns its score whatever the window.
- A shallower entry never cuts. At equal depth the two rules agree for every bound and window.
- A deeper mate is restored to the probing ply: MATE_SCORE-4 stored at ply 1, depth 8, reads MATE_SCORE-6 at ply 3, depth 5.

## A3 / F1 / F2: drift at d5 on the 190 (SEARCH_DEEP row, green)
- `search()` against `searchWithoutDeeperCutoffs`: **100.00 % of 187 within 25 cp**, max **3 cp** (startpos/d2d4 6 -> 9). 1 score moved; 0 mate sign flips; 0 mate-status changes.
- `chooseMove` against `chooseMoveWithoutDeeperCutoffs`: **100.00 % of 187**, max **10 cp** (endgame kp-vs-k 147 -> 137). 1 moved; 0 flips; 0 status changes.

## The 287 mate sign floor at d5 (SEARCH_DEEP row, green)
- 189 door mates; **0 violated**; 0 mate distances changed.

## A4 / F4: NOT MET (see the failed-attempt note)
- `search(…, 8)` against the door:
  - kiwipete 1 109 987 / 1 116 785 = **0.9939x**;
  - position-6 1 595 656 / 1 602 457 = **0.9958x**.
  - The bar is <= 0.95x. Score and move are unchanged on both.
- Report only, `chooseMove` to 8: 0.9587x and 0.9986x.
- `G6` (graded, real clock, 5 interleaved runs) is QE's. It was not run here.

## The firing rate at d6 on the 190 (ADR-0058 d9, a report)
- `search()` d6: 2 367 / 1 114 332 probes = **0.212 %** (0.902 % of 262 545 hits).
- `chooseMove` to d6: 1 541 / 876 757 = **0.176 %** (0.479 % of 321 833 hits).
- **Under 1 in 100:** by the Architect's line, any read states that limit.

## Re-pointed rows read their pre-ticket figures (SEARCH_DEEP)
- `ABC-229 A3`: 330 314 / 324 162 = 1.019x, and 154 466 / 154 464 = 1.000x.
- `ABC-229` drift: 100 % / max 8 cp in both recursions.
- Both equal se-ABC-229's record.
- The untouched older oracles read as recorded:
  - ABC-228: 1.368x / 1.405x; 89.30 % / 88.77 %, 118 cp; 0 of 189;
  - ABC-208: 100 %, 25 cp / 8 cp; 0 of 189;
  - ABC-121: 97.86 %, 63 cp; 0 of 180.
