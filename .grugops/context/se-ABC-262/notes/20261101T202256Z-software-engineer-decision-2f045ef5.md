---
id: 20261101T202256Z-software-engineer-decision-2f045ef5
kind: decision
by: software-engineer
at: 2026-11-01T20:22:56Z
verified_by: 
confidence: high: rows and asserts as committed in 39a6237e
refs:
  - se-ABC-262
  - ABC-262
  - ABC-261
  - ABC-254
  - EPIC-011
  - QE-261-a
  - QE-261-b
  - NFR-008
supersedes: 
seal: sha256:fe79bfdd4ea0cfae201ec2120b515d9951904c294549c35e173663b13c459823
---

# se-ABC-262 design: two new rows beside ABC-261's, as the page names them; one comment narrowed

- **Early-exit row** (`src/gameend.nfr.test.ts`, inside the `ABC-206` call-count describe, right after ABC-261's row): B2 `4k3/8/8/8/8/4K3/PPP5/8 w - - 0 1`. Asserts in-row: `isInCheck` false; `generateMoves(p)[0].piece === PAWN`; king moves ≥ 3 (8 on B2); then, after `vi.clearAllMocks()`, `hasLegalMove` true, spied `isSquareAttackedBy` count `> 0` and **`<= 1`**. Uses the spy ABC-261 already added to the `./moves.ts` mock. Only other line touched: the `./position.ts` import widened by `PAWN`.
- **Promotion row** (`src/legal.test.ts`, a new describe after ABC-261's): P1′ `4k3/8/8/8/8/8/p7/4R2K b - - 0 1` (a2→a1, absent) and P2′ `7K/8/8/8/8/8/1p6/R3k3 b - - 0 1` (b2→b1, present). Asserts per board: `blackToMove`, `isInCheck`, `board[from] === PAWN | BLACK`, `from >> 4 === 1`, `board[to] === EMPTY`, lazy `toEqual` full, promotion presence. `Move.promotion` holds the uncoloured piece type, so the compare is `=== QUEEN`.
- **Stop-rule preconditions held:** production reads exactly 1 on B2 (scratch probe `B2COUNT 1`), and both mirror boards pass every A2 assert. No board swapped, no bar loosened.
- **Deviation (comment only):** the promotion row's comment first said the in-check test "is read for both sides". It does not see QB (see the plants note), so before commit the comment was narrowed to what the row asserts (lazy = full, absent, present). The plant runs used the earlier comment; the code is the same.
- **A6 layout:** the claim is its own commit (`3ea272c0`), so the code commit `39a6237e` touches only the two test files. No ABC-261 title or `expect(` line changed. Neither file has a header test count, so none was raised (the `45 tests` in the gameend.nfr header counts `gameend.test.ts`).
