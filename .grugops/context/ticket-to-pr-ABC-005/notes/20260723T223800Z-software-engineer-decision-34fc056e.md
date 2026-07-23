---
id: 20260723T223800Z-software-engineer-decision-34fc056e
kind: decision
by: software-engineer
at: 2026-07-23T22:38:00Z
verified_by: 
confidence: high
refs:
  - ABC-005
  - ABC-004
  - ABC-007
  - EPIC-001
  - NFR-001
  - src/legal.ts
supersedes: 
---

Implementation decisions for ABC-005 (legal move filtering + check detection).

**New module `src/legal.ts`** — legality is a distinct concern from generation (`moves.ts`) and mutation (`apply.ts`), matching the repo's one-module-per-concern shape.

**`isSquareAttackedBy` is reused, not rebuilt.** It was implemented in ABC-004 (castling's through-check rule required it) and lives in `moves.ts`. ABC-005 consumes it for both `isInCheck` and the move filter. This is the seam flagged in the ABC-004 decision note: ABC-005's scope line named `isSquareAttackedBy` as "the primitive underneath everything here", and it is — it just had to exist one ticket earlier. No duplication.

**`legalMoves` is a make/test/unmake filter, exactly as the ticket endorses.** For each pseudo-legal move: play it, check whether the mover's king is attacked in the resulting position, take it back. The ticket is explicit — "A make/test/unmake filter is acceptable for this ticket... Do not pre-optimize here — correctness first, and the spike decides whether the optimization is ever needed." Its decisive virtue is uniform correctness: the three hard cases the ticket calls out — absolute pins, check evasion, and en-passant discovered check — need NO special code, because the test runs against the real resulting board. The ep discovered-check case (two pawns leaving one rank at once) is the one nearly every generator-based approach gets wrong; here it is simply "after exd6, is my king attacked? yes → drop it."

**King lookup via `Uint8Array.indexOf`.** `kingSquareOf` returns `board.indexOf(KING | colour)`. Exactly one king per side exists in any legal position (parseFen enforces it, make/unmake preserves it) and off-board squares are EMPTY, so the scan always finds it. Chose this over a hand loop with a can't-happen `throw`: the throw would be an unreachable line (a rule-8 impossible-scenario guard) and an uncovered branch. `indexOf` has neither — same linear cost, no dead code.

**Scope held.** Checkmate/stalemate *detection* is ABC-007 (it consumes `isInCheck` + `legalMoves.length`); move ordering/evaluation is EPIC-004. `isInCheck` and `legalMoves` are exported for ABC-007 and the game loop; `kingSquareOf` stays private (no caller needs it directly).
