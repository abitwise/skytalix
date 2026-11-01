---
id: 20261101T152313Z-software-engineer-decision-cb525705
kind: decision
by: software-engineer
at: 2026-11-01T15:23:13Z
verified_by: 
confidence: high: the design follows ADR-0003 (1-A) clause by clause; proven by A1/A2 rows and four planted reds
refs:
  - se-ABC-254
  - ABC-254
  - EPIC-010
  - ADR-0003
  - ADR-0055
  - ADR-0020
  - NFR-005
  - NFR-009
  - NFR-008
  - NFR-001
  - grugops/ABC-254
  - 600d8de3
  - 09d1f675
  - src/legal.ts
  - src/legal.test.ts
  - src/gameend.nfr.test.ts
supersedes: 
seal: sha256:54b796267e518b7cb6398f15d004b2771ae1e9d612cdbcc439713343d901864c
---

# ABC-254 design: lazy legality, ADR-0003 (1-A) with (c3) folded in

- `src/legal.ts`: `legalMoves`, `hasLegalMove`, `legalCaptures`, `legalCapturesAndQueenPromotions` are lazy. Signatures are unchanged.
- Once per call, before the loop: the king square (`board.indexOf`), the check flag (`isSquareAttackedBy`), and, only when not in check, the pin set.
- **In check (class 4):** every move goes to the test and no pin set is built. This is the response ADR-0003 falsifier 3 designs in advance.
- **Out of check:** a move goes to the test only if it is a king move (castling included: `move.piece === king`), an en-passant capture, or a move by a marked piece. Every other move is accepted untested.
- **Pin detector (`markPins`):** checks 8 rays out of the king. An own piece is marked when it stands alone between the king and the first enemy piece on the ray, and that enemy piece is a rook or queen on a rank or file, or a bishop or queen on a diagonal. It can mark too much, never too little.
- **The test (`staysSafe`):**
  - An unflagged move uses the board-only form: it sets the same two bytes `makeMove` writes, tests, and restores them.
  - A castle, en passant or promotion takes the full `makeMove`/`unmakeMove`. These are the (1-A) conditions for folding in (c3).
- **Order:** the filter walks the generator's list once and compacts that fresh array in place. The output is the same list in the same order, and it is still a fresh array.
- **`legalCapturesAndQueenPromotions`:** converted. The quiet queen promotions are tested only in check or when the pawn is marked as pinned.
- **State:** nothing is cached on `Position`. The pin set lives in one module `Uint32Array(128)` epoch stamp, so there is no clearing per call and G7 growth is 0. No filter calls another filter inside its loop, which is the condition (1-A) puts on a shared scratch.
- **Oracle:** the full filters stay as `fullLegalMoves`, `fullHasLegalMove`, `fullLegalCaptures` and `fullLegalCapturesAndQueenPromotions`. Their code is unchanged, only renamed, and they are exported for A1.
- **Unchanged:** `isInCheck`, `givesCheck` and `hasLegalEnPassant`. `src/moves.ts` is not touched.
