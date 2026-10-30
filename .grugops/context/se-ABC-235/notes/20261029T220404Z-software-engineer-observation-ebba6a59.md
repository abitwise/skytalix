---
id: 20261029T220404Z-software-engineer-observation-ebba6a59
kind: observation
by: software-engineer
at: 2026-10-29T22:04:04Z
verified_by: 
confidence: high (deterministic; cmp byte-identical; plants watched red)
refs:
  - ABC-235
  - EPIC-010
  - arch-ABC-235/20261029T205200Z-architect-design-decision-7fc1b90c
  - arch-ABC-235/20261029T205200Z-architect-design-decision-eebca902
  - grugops/ABC-235
  - a37f1d87
  - dcbad73d
  - 7f3f0fda
  - f9576af3
  - ABC-078
  - ABC-121
  - ABC-206
  - ABC-022
  - NFR-001
  - NFR-004
  - src/legal.test.ts
  - src/moves.test.ts
  - src/gameend.nfr.test.ts
  - src/evaluate.pawns.test.ts
  - src/transposition.test.ts
supersedes: 
seal: sha256:5ccc660ac377bd93447bca3bd055dab821155f615465561cd5c175eeee65a7cd
---

# Software Engineer observation, se-ABC-235: A1 byte-equal to the merge base at every cut; the per-cut oracles; perft

## A1, cross-build, out of tree, plain `node` (Node v26.12.1), against `a37f1d87`
- **The harness.** It is scratch only; no golden file is committed. The base is `git archive a37f1d87 src`, and each head is a copy of the worktree's `src` at the cut commit. Rows are JSON lines, compared with `cmp`.
- **The corpus.** ABC-078 `A3` (the six endgames plus their in-progress children, and `broadCorpus`: perft roots, their children, 25 position-3 grandchildren, in-progress only) plus ABC-121's 190, deduplicated by FEN. That gives **301 unique positions**; the 190 is a subset of the A3 set.
- **The rows (6 021).** The corpus listing, 302 rows. Per position:
  - `legalMoves`, `legalCaptures`, `hasLegalMove`, `isInCheck`, `hasLegalEnPassant`, `evaluate`, `evaluateWithoutMobility` and purity: 301 rows.
  - `chooseMove` and its three doors (`WithoutNullMove`, `WithoutReductions`, `WithoutPvsOrReductions`) at budgets 3 and 5 on `tickingClock(1)`. Each row holds move, score, completed depth, nodes, clock reads and purity: 2 408 rows.
  - `search`, `searchWithoutNullMove`, `searchWithoutReductions` and `searchWithoutPvsOrReductions` at depth 5: 1 204 rows.
  - `searchWithoutTable`, `searchWithoutKillers`, `searchWithoutOrdering` and `searchWithoutQuiescence` at depth 5: 1 204 rows.
  - `searchWithoutPruning` and `searchWithoutPruningOrQuiescence` at depth 2 (decision note): 602 rows.
- **The result.** sha256 `812f86ae46766537f73657b70f447f4c2e61d124051e0629fb374f90ac2bd000` for the base, cut 1, cut 3 and cut 5 alike. `cmp` is byte-identical at each cut, with 0 `"pure":false` rows.

## The per-cut oracles (`arch-ABC-235` P1-P3), in the existing test files
- **Cut 1** (`src/legal.test.ts`). `legalMoves` and `legalCaptures` list-equal, and `hasLegalMove` boolean-equal, against a reference rebuilt from `generateMoves`, `makeMove`, `unmakeMove`, `isSquareAttackedBy` and a per-move `board.indexOf`. Every row asserts the full state is unchanged. The walk is ABC-206 A2's (six perft FENs plus six terminal and clock FENs): depth 1 in the lane, depth 3 under `ENGINE_DEEP=1`. Six targeted rows: a rook check, a pinned knight, both castles, a castle through attack, the king capturing its checker, and en passant exposing the king on the rank. Denominators asserted, including king moves and castles.
  - Plant: hoisted square for king moves too. 6 rows red; restored.
- **Cut 3** (`src/moves.test.ts`). `generateCaptures(p)` deep-equals `generateMoves(p).filter(captured ≠ EMPTY)` in order, with the position unchanged. Same walk, depth 1 in the lane, depth 3 under `ENGINE_DEEP=1`. Targeted rows:
  - en passant on both sides and both colours, and an ep on side -1 before a normal capture on side +1 (order asserted);
  - the rank-pinned ep;
  - ABC-022's twelve off-domain ep FENs;
  - capture promotions on both sides, Q R B N in order;
  - three boards with all castling rights: no castle offered, and no own-colour target.
  - Spied guard (`src/gameend.nfr.test.ts`): `legalCaptures` calls `generateMoves` 0 times and `generateCaptures` once, on three boards.
  - Plants: pawn sides swapped in `generateCaptures`, 3 rows red. `generateMoves(...).filter` reintroduced in `legalCaptures`, the guard red. Both restored.
  - ABC-206's existing `legalCaptures` list-equality rows stay green.
- **Cut 5** (`src/evaluate.pawns.test.ts`). `evaluate` is `Object.is`-equal to `evaluateWithoutPawnCache`, cache-cold and then cache-warm (warm hits > half asserted), with the position unchanged. Run on the walk (depth 1 in the lane, depth 3 under `ENGINE_DEEP=1`) and on G3's mirror corpus with every mirror (368 positions).
  - Forced collision: two pawn placements on one slot with different values, evaluated alternately three rounds. After the other one, each is a miss on the shared slot, then a hit, and each time returns its own value.
  - 384 KiB asserted. G7 (a): `tableByteLength() + key array + pawnCacheByteLength() ≤ 16 MiB` in `src/transposition.test.ts`.
  - Plant: slot-only hit (`pawnCacheWhite[slot] !== -1`). The collision row red; restored.

## Perft (each cut)
- `npm run perft` counts equal base's at cuts 1, 3 and 5 (timing columns differ, counts do not).
- `PERFT_DEEP=1 … vitest run src/perft.test.ts`: 32/32 at cuts 1, 3 and 5.
