---
id: 20260723T222200Z-software-engineer-decision-baf8f8b1
kind: decision
by: software-engineer
at: 2026-07-23T22:22:00Z
verified_by: 
confidence: high
refs:
  - ABC-004
  - ABC-005
  - ABC-006
  - EPIC-001
  - NFR-001
  - src/moves.ts
  - src/apply.ts
supersedes: 
---

Implementation decisions for ABC-004 (castling, en passant, promotion).

**Extended `moves.ts` and `apply.ts` in place, no new module.** The ticket scopes these as extensions of ABC-002 generation and ABC-003 make/unmake, and the special moves share every offset table and the undo record with the code they extend. A separate module would only duplicate the geometry.

**Special handling is flag-driven and off the common path (NFR-001).** `Move` gains a `flags` bit (`FLAG_EN_PASSANT` / `FLAG_CASTLE` / `FLAG_PROMOTION`) and a `promotion` piece-type field (EMPTY for ordinary moves). `makeMove`/`unmakeMove` keep their exact ABC-003 fast path and call `applySpecial`/`undoSpecial` only when `flags !== FLAG_NONE` — an ordinary move or capture pays nothing. The ticket's explicit constraint ("must not add a branch to the common path; keep it flag-driven") is met by a single guard, not per-piece branching.

**One `FLAG_CASTLE`, rook leg derived from the king's destination.** Rather than carry the rook squares on the Move or split kingside/queenside flags, a `CASTLE_ROOK_MOVE` table keyed by the king's `to` square (g1/c1/g8/c8) yields the rook's from/to. Minimal state on the hot Move object; SAN's kingside-vs-queenside distinction (EPIC-003) can re-derive it the same way when needed.

**En passant and promotion undo, the asymmetry worth noting.** Promotion undo is *free*: the generic unmake already restores `move.piece` (the pawn) to `from` and `undo.captured` to `to`, so `undoSpecial` returns early — only make needs the piece swap. En passant is the opposite: the captured pawn never sits on `to`, so make removes it from `to ± 16` and undo restores it there from `move.captured` (set to the enemy pawn at generation time), because the undo record's `captured` (read from `to`) is EMPTY for an ep target.

**Cross-ticket seam: `isSquareAttackedBy` lives here, in ABC-004, and ABC-005 consumes it.** Castling's through-check rule ("the king may not start, cross, or land on an attacked square") is a castling rule the ticket explicitly scopes to ABC-004 — and it *requires* attack detection. So `isSquareAttackedBy(position, square, byBlack)` is implemented in `moves.ts` now (co-located with the offset tables it reuses) and exported. ABC-005 builds `legalMoves`/`isInCheck` on top of it rather than re-deriving it. This is a documented deviation from ABC-005's nominal scope line ("`isSquareAttackedBy` — the primitive underneath everything here"): the primitive is the same, it just had to exist one ticket earlier because castling needed it. No behavioural overlap — ABC-005 still owns full legality filtering.

**Scope held.** Castling is the one move generated fully legal (its through-check filter runs in generation); everything else stays pseudo-legal for ABC-005 to filter. No ordinary-king-safety filtering, no SAN, no repetition history here.
