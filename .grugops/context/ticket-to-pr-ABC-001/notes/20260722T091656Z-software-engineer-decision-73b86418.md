---
id: 20260722T091656Z-software-engineer-decision-73b86418
kind: decision
by: software-engineer
at: 2026-07-22T09:16:56Z
verified_by: 
confidence: high
refs:
  - ABC-001
  - EPIC-001
  - ADR-0001
  - NFR-001
  - src/position.ts
  - src/fen.ts
supersedes: 
---

Implementation decisions for ABC-001 (position state and FEN round-trip).

**Board representation is 0x88 — recorded as ADR-0001.** This is a structural decision that constrains every downstream module, so it gets an ADR rather than being buried in a commit. Rationale in short: off-board detection collapses to `(square & 0x88) !== 0`, which is what ABC-002's edge-wrapping acceptance criteria need, and it is the representation the ABC-008 spike measured — choosing anything else would have invalidated that 2.64M nodes/sec measurement and reopened RISK-002. Bitboards were considered and rejected as disproportionate to a "not too complex" project whose NFR targets are already met with headroom.

**The parser never returns a partial position.** Every fault throws `FenError` naming the specific problem — field count, rank length, illegal character, missing king, bad side-to-move, bad castling char, bad en-passant square, non-numeric or out-of-range clocks. The ticket asked for named rejection; the reason it matters is that a half-parsed position escaping into the engine surfaces as a baffling bug several modules away from its cause.

**King validation is stricter than the ticket asked for.** ABC-001's scope listed "no king" as a rejection case. The implementation asserts *exactly one* king per side, not merely at least one, because two white kings is equally impossible and equally corrupting downstream. This is a small widening of a stated criterion, flagged here rather than left silent.

**Three exported helpers were removed before commit.** `isOnBoard`, `pieceType`, and `isBlackPiece` were written speculatively; coverage showed `pieceType` and `isBlackPiece` were never called by anything in this ticket. They are move-generation concerns belonging to ABC-002, and AGENTS.md rules 5 and 7 (only requested features, no unrequested flexibility) say they should not exist yet. `pieceType` and `isBlackPiece` were deleted with a comment pointing at ABC-002; `isOnBoard` was kept and put to work in `assertBothKingsPresent`, so the 0x88 off-board rule lives in exactly one place rather than being hand-inlined.

That deletion is the coverage report doing real work: it did not just report a number, it identified dead API surface that would have shipped.
