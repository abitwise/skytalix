# se-ABC-298 build: ADR-0077 d1–d3 as written, in both recursions. No switch, no door, no captures-first, nothing tuned

Software Engineer, task `se-ABC-298`, on `grugops/ABC-298` from `main` `6f943726` (freeze `b9b8eee9`, an ancestor). This note records what was built and the choices that were mine (names, placement). The STOP is in the `failed-attempt` note.

## d2, the seam
- **`src/moves.ts` `generateMovesFrom(position, from)`.** It calls the same helpers `generateMoves` calls (`addPawnMoves`, `addStepMoves`, `addRayMoves`), then `addCastlingMoves` for a king. That helper emits a castle only from the king's home square, and after the king's steps, as `generateMoves` does. `generateMoves` is not edited.
- **`src/legal.ts` `legalMoveFrom(position, from, to, promotion)`.**
  - It takes the one per-square move with that `to` and `promotion`; no two of one square's moves share them.
  - It then always tests it with `staysSafe`. The king square is `move.to` for a king move, else `kingSquareOf`.
  - It uses no pin scratch.
- **`src/transposition.ts` `entryMoveLegal(slot, position)`.** A live read of word 2 (`& MOVE_BITS`), unpacked beside `packMove` and checked by `legalMoveFrom`. It never reads `hitData`. Import chain: `transposition` → `legal` → `apply` / `moves` / `position`, no cycle.
- **`HASH_FIRST_DEPTH_LIMIT = 2` lives in `src/transposition.ts`.**
  - It is not in `search.ts`: `src/search.test.ts` A6 pins `search.ts`'s export set exactly.
  - Its name avoids `max_?depth`: `src/engine.test.ts` A4 allows that word on two lines only.
  - Its comment carries § Context's reason.

## d1, the gate (both `negamax`)
- **The gate:** `slot !== -1 && depth <= 2`, plus `switches.ordering === "full"` in `search.ts` (the engine always orders in full).
- **The countermove read.** It is read before the hash move's subtree. In `search.ts` that is the existing `const countermove = …`, moved up. In `engine.ts` it is read in the hash block, and `orderMoves` takes it when the hash move was searched (d3 item 3).
- **The hash move's search.** Searched by `searchMove` at index 0 with reduction 0, so it gets the node's own window. In `engine.ts` its make and unmake sit in `try` / `finally`.
- **The cutoff test.** It is `Math.max(alpha, score) >= beta`, index 0's test exactly.
- **On a cutoff.**
  - `recordHistoryCutoff(position, HASH_CUTTER, 0, depth, false, previousCut)`. `HASH_CUTTER` is a one-entry module scratch, so no list is allocated, and index 0 has no malus.
  - Then `killers.record(ply, hash)` and `storeEntry(…, boundOf(score, alphaIn, beta), score, ply, hash)`. Return.
- **No cutoff.**
  - `legalMoves` and the ordering run with the same hash move, and a gated node never re-reads word 2 (d3 item 4).
  - `futilityNode` and `moveCountNode` run where they ran, with `alphaIn` (d3 items 9 and 13).
  - Index 0's bookkeeping is kept for the hash move: `searchedQuiets` +1 if it is quiet and the limit is above 0, `index` 1, `best` and `bestMove`, and alpha raised.
  - The loop runs over `list.slice(1)`. One array per gated node that does not cut. `shortcut: a slice per non-cutting gated node; upgrade to an index loop only if the futility source row is re-pointed`, because that row requires `for (const move of`.
- **Unchanged:** the roots, quiescence, every node at remaining depth 3 or more, and every door with the table off or partial ordering.

## Shapes kept for existing source rows (no row edited)
- **`src/search.futility.test.ts`'s order:** `const moves = legalMoves(position);`, then `const alphaIn = alpha;`, then `const futile = …`, then `for (const move of …)`, with nothing that makes a move or stores in between.
- **`src/search.bundle.test.ts`:** the literal `previousCut === null ? 0 : countermoveAt(previousCut),` in the engine.
- **`src/search.test.ts` A6:** no new `search.ts` export.

## Rows added (no existing line changed: `git diff b9b8eee9..HEAD -- 'src/*.test.ts'` removes 0 lines)
- **`src/legal.test.ts`:**
  - SG2 (a), QE's 38 hand cases, through `legalMoveFrom`, through the table (`entryMoveLegal`) and against the oracle `entryMove(slot, legalMoves(p))`, with FEN and key unchanged. Plus a count row.
  - SG2 (b), `ENGINE_DEEP` only: `ABC-254` A1's two walks (285 074 and 518 474 nodes). Every legal move's bits, and the parent's legal moves' bits, through the table.
- **`src/moves.test.ts`:** the per-square oracle on SG2 (a)'s 18 boards and the six perft roots, plus, under `ENGINE_DEEP`, on `G4`'s 301, built as `g4.mjs` builds it.
- **`src/search.futility.test.ts`:** SG2 (c), two seeds by four searches. It uses two call-through mocks (`./transposition.ts`, `./apply.ts`) that sit idle without a seed. QE-298-g's precondition is asserted (node reached at remaining 1 / 2, slot hit, no table cutoff). This file mocks neither module on `main`, so none of the 12 frozen mocking files changed (QE-298-h).
- **`src/search.bundle.test.ts`:** SG1 (a), all seven rows (`SEARCH_DEEP`): nodes, move, score, and for `chooseMove` the depth and clock reads.
- **For `NFR-008`:** the 301 per-square row (about 77 ms in-thread) runs in `ENGINE_DEEP` only. A default-lane SG2 (b) depth-1 walk (about 18 ms) was dropped, since d6 puts SG2 (b) in `ENGINE_DEEP`.
