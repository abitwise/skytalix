---
id: 20261102T010954Z-software-engineer-observation-470e5bf6
kind: observation
by: software-engineer
at: 2026-11-02T01:09:54Z
verified_by: 
confidence: high: deterministic cross-build and fixed-depth readings under the lock; A4 counts equal the probe's to the node; raw in raw/
refs:
  - se-ABC-264
  - ABC-264
  - ADR-0059
  - ADR-0050
  - ADR-0026
  - ADR-0028
  - ADR-0056
  - EPIC-011
  - ABC-229
  - ABC-086
  - ABC-249
  - NFR-005
  - NFR-008
  - grugops/ABC-264
  - 358b5f4a
  - 0b73f51d
  - arch-ABC-264/20261102T003352Z-architect-design-observation-1e9c2549
supersedes: 
seal: sha256:38fdccee418848caa24823720691c8b6fafed8d62a0367b8cbaa56ddc6cdfd70
---

# se-ABC-264 acceptance: A1 met (cross-build node-equal), A2 met, A3 met (97.33 % / max 107 cp in both recursions, mate floor 0/189, zugzwang 7/7), A4 met with the probe's counts to the node (0.5901 / 0.6373 / 0.6173 / 0.6282)

At `grugops/ABC-264` `358b5f4a` against `main` `0b73f51d`. Every reading is deterministic: fixed depth, or `chooseMove` on a frozen clock with `maxDepth`. Every run was under the host lock. Raw output is in `raw/`.

## A1 / G4 / F6: cross-build, out of tree (`raw/a1.txt`, `raw/a1.mjs`, adapted from se-ABC-238's)
- **Corpus:** 276 positions (six roots, six endgames, every in-progress child).
- **The new doors against base's shipped path, 0 differ on nodes, score and move:**
  - head `searchWithoutReverseFutility` against base `search()` at d1-4: 1 104 rows, sha `98c554876f946df4` on both sides;
  - head `chooseMoveWithoutReverseFutility` against base `chooseMove` to 4: 276 rows, sha `16053ea24626369f` on both sides.
- **Every older door against its pre-ticket self: 0 differ.** The shas equal se-ABC-238's base shas (QuietPromotions `477fbd2e…` / `32a44406…`; QuiescenceEvasions `7a5924b5…` / `aa3b9cfa…`). Also equal:
  - NullMove, Reductions, PvsOrReductions, Table, Ordering, Killers and Quiescence at d3;
  - Pruning and PruningOrQuiescence at d2;
  - the three older engine doors to 4.
- **Non-vacuity:** head `search()` differs from base on 449 of 1 104 rows; head `chooseMove` to 4 differs on 156 of 276.
- **Export lists:** `ABC-077` A6 +2 (`reverseFutilityCut`, `searchWithoutReverseFutility`); `ABC-078` A4 +1 (`chooseMoveWithoutReverseFutility`). That is three names, as `ADR-0059` d4 reads A1's "two".

## A2: `src/search.reverse-futility.test.ts`, default lane
- **The predicate's table:**
  - It cuts at depths 1, 2 and 3 with beta = eval - 120·depth exactly, and not 1 cp above, which pins the margin and `>=`. It also cuts far from the root and with Black to move.
  - It returns false, with 0 evaluations paid, on boards where the margin alone would cut, for each of: the root; depth 4; depth 20; beta = -MATE_FLOOR; beta below it; beta = +MATE_FLOOR and above it; in check; two non-pawn pieces; the other side holding the pieces; pawns only.
  - **Mate-band blind spot:** the +MATE_FLOOR side is observable only through a call-through stub of `evaluate` that returns 25 000 / 29 999. The band edges are tested on both sides (±(MATE_FLOOR-1) cut when the margin allows).
- **"0 child moves searched; the door searches them":** call-through mocks of `legalMoves`, `makeMove` and `unmakeMove` log events.
  - At the first divergence between `search()` and its door (kiwipete d3), and again for `chooseMove` deepened to 3: the head's `make` into the node is followed directly by `unmake`, with 0 generated and 0 made. The door generates that node's moves and makes the first.
  - The node is out of check, has ≥ 3 non-pawn pieces, and the predicate accepts it.
- **Zugzwang guard in the tree:** on the six endgames and the four K+P rows, `search()` d6 and `chooseMove` to 6 equal their doors in move, score and nodes.
- **Source row:** both bodies gate on `<switch>.reverseFutility && alpha + 1 === beta && reverseFutilityCut(position, <depth>, ply, beta)`, then `return beta;`. The gate comes after `tableCutoff(` and before the null-move gate. Between them there is no `storeEntry(`, `legalMoves(` or `evaluate(`.
- **Planted variants, each red on this file (run and reverted):**

  | planted variant | tests red |
  |---|---|
  | no mate-band guard | 4 |
  | lower-side band guard only | 2 |
  | no check guard | 1 |
  | margin 100 | 5 |
  | depth 1-4 | 1 |
  | PV nodes too | 1 |
  | returns the static score | 1 |
  | guard at 2 pieces | 1 |
  | no zugzwang guard | 4 |

## A3 / F1 / F2 / F3 (SEARCH_DEEP rows, green)
- **Drift d5 on the 190:**
  - `search()` against `searchWithoutReverseFutility`: **97.33 % of 187 within 25 cp**, max **107 cp** (kiwipete/f3g4 1142 -> 1035), against the 160 cp cap.
  - `chooseMove` against `chooseMoveWithoutReverseFutility`: **97.33 %**, max **107 cp** (same row).
  - Both: 0 mate sign flips, 0 mate-status flips.
- **Mate floor on the 287 at d5:** 189 door mates, **0 violated**, 0 longer, 0 shorter.
- **Zugzwang:** `ADR-0050` d9's seven rows (`src/search.null-move.test.ts` A2, shipped `chooseMove` at 9/11/12/8/8/8/8) all play their recorded moves: the SEARCH_DEEP null-move lane, 44/44.

## A4 / F4 (SEARCH_DEEP rows, green; `ADR-0059` d9 bar 0.75x)

| reading | head nodes | door nodes | ratio |
|---|---|---|---|
| `search()` kiwipete d8 | 658 971 | 1 116 785 | **0.5901x** |
| `search()` position-6 d8 | 1 021 190 | 1 602 457 | **0.6373x** |
| `chooseMove` kiwipete to 8 | 972 596 | 1 575 537 | **0.6173x** |
| `chooseMove` position-6 to 8 | 299 183 | 476 244 | **0.6282x** |

- **Instrument check:** all four head counts equal the Architect's probe counts **to the node**, so no count needs explaining. The root score at kiwipete `search()` is -60 -> -59, as the probe recorded.
- `G6` (graded, real clock) is QE's.

## Re-pointed and re-pinned rows (for the PR)
- **Re-pointed** (shipped side to the new door, per `ADR-0059` d6): `ABC-229` A3 (d6 node ratio) and both `ABC-229` d5 drift rows, in `src/quiescence.test.ts`. They read their pre-ticket figures (lane green).
- **Re-pinned, source rows:**
  - the export lists (`src/search.test.ts`, `src/engine.test.ts`);
  - the `quiescenceEvasions` and `quietPromotions` literal maps (`src/quiescence.test.ts`);
  - QE-208-c's `nullMove` map (`src/search.null-move.test.ts`).
- **Re-pinned, fixture (`ADR-0028` fixture first):** `ABC-086` A6, interleaved engines (`src/engine.test.ts`, ENGINE_DEEP), engine B's budget **3 -> 5** virtual ms.
  - With the rule on, the 3 ms engine reaches depth 2 and agrees with the 1 ms engine on all 10 positions, so the non-vacuity line read 0.
  - At 5 ms they disagree on 2. The door at 3 ms disagreed on 1.
  - The assertion and bound are unchanged.
- **No value row moved:** `ABC-249` still reads Ke1 404 / Kg1 497 (default lane green), so test note 3 is not triggered.
