---
id: 20260723T230200Z-software-engineer-decision-eb6d63d0
kind: decision
by: software-engineer
at: 2026-07-23T23:02:00Z
verified_by: 
confidence: high
refs:
  - ABC-007
  - ABC-005
  - EPIC-001
  - EPIC-004
  - NFR-001
  - src/gameend.ts
  - src/zobrist.ts
supersedes: 
---

Implementation decisions for ABC-007 (game-end detection).

**Two modules: `zobrist.ts` (hashing) and `gameend.ts` (detection).** The ticket names Zobrist as "the first ticket that needs it" and EPIC-004's transposition table is the second consumer, so hashing is its own concern, not buried in game-end. `zobristKey` hashes exactly the repetition-relevant state — placement, side to move, castling rights, en-passant file — and ignores the move counters by construction, which is the FIDE definition of "the same position".

**Deterministic Zobrist table (splitmix64, fixed seed), NOT `Math.random`.** A table that varied per run would make keys unreproducible; a fixed-seed PRNG fills the (piece,square)/side/castling/ep-file tables once at load. Keys are stable within and across runs.

**`gameStatus(position, positionCounts?)` returns result + machine-readable reason, generating legal moves ONCE (NFR-001).** The ticket's throughput note is explicit — "check the legal-move count that was computed anyway, never recompute it." So the function computes `legalMoves` a single time and reads its length for the mate/stalemate decision; it never generates twice. `isInCheck` (one attack test) runs only when the move list is empty. Threefold is opt-in via the `positionCounts` map (key→occurrences, maintained by the caller including the current position); omit it and repetition is simply never reported — the loop that has no history yet pays nothing.

**Precedence: zero-legal-moves first, then the draws.** Checkmate/stalemate are decided before insufficient-material / fifty-move / threefold, so a mate delivered on the 100th half-move or with thin material is correctly a win, not a draw. Verified by a QE probe (back-rank mate with halfmoveClock=100 → checkmate, not fifty-move).

**Insufficient material is coded to the ticket's exact list, guarding against over-application.** Any pawn/rook/queen → sufficient immediately. Otherwise: 0 or 1 minor → draw; two-plus minors → draw ONLY when there are no knights and every bishop is on one square colour. This draws K vs K, K+minor vs K, and K+B vs K+B on the same colour, while opposite-coloured bishops are NOT drawn (mate constructible) — the negative case the ticket flags as easy to get wrong, and KN vs KB / KNN are not auto-drawn either.

**Winner encoding:** on checkmate, `result` is `white-wins`/`black-wins` (the side NOT to move) and `reason` is `checkmate`; stalemate and the three draw rules are `result: draw` with their specific reason; a live position is `in-progress` / `null`.

**Scope held.** No resignation/draw-offer, no result display (EPIC-002/006), no seventy-five-move or fivefold rule (out of scope). This is the last EPIC-001 ticket — the rules core is rule-complete and perft-proven.
