---
id: 20260722T180530Z-software-engineer-decision-94f53f7f
kind: decision
by: software-engineer
at: 2026-07-22T18:05:30Z
verified_by: 
confidence: high
refs:
  - ABC-002
  - EPIC-001
  - ADR-0001
  - NFR-001
  - src/moves.ts
  - src/position.ts
supersedes: 
---

Implementation decisions for ABC-002 (pseudo-legal move generation).

**No new ADR.** ABC-001 already decided the representation (ADR-0001, 0x88). This ticket consumes that decision and adds nothing structural, so recording another ADR would be ceremony. The one structural consequence worth naming: `isOnBoard` is the *only* edge test in the generator — there is not a single hand-rolled file-wrap check anywhere in `moves.ts`, which is precisely what ADR-0001 bought and what ABC-002's a1-knight criterion exists to prove.

**`pieceType` and `isBlack` were added to `position.ts`, not to `moves.ts`.** ABC-001 deleted these two helpers and left a comment in `position.ts` saying they belong to ABC-002, "which is where they will first be used". That comment is now honored and replaced with the real implementations. They live in `position.ts` rather than `moves.ts` because the piece encoding (`PAWN`..`KING` in the low 3 bits, `BLACK` at bit 3) is defined there — an accessor that decodes that encoding from another module would put the encoding in two places, and ADR-0001 already warns that a module hand-rolling square arithmetic "will be subtly wrong". Same argument, applied to piece bits.

**Three offset tables, not four.** `DIAGONALS` and `ORTHOGONALS` are the primitives; `ALL_DIRECTIONS` is their concatenation and serves both the queen and the king, because a king is a queen with a range of one. Writing a separate eight-entry `KING_OFFSETS` literal identical to the queen's would be a second copy of the same eight numbers, and the pair could then drift.

**Sliding pieces are dispatched by table lookup, stepping pieces by another, pawns by neither.** The generator branches three ways: `PAWN` (its own function, because pawns are the only piece whose move direction depends on colour and whose captures differ from its quiet moves), a `STEPS` lookup (knight, king), and a `RAYS` lookup (bishop, rook, queen). This is the shape the ticket's NFR-001 note asked for — precomputed offset/ray tables over per-call arithmetic. No numeric throughput target is asserted here; ABC-006 measures it, and ABC-008 already established the representation clears NFR-001 with headroom.

**The double push needs no board-edge test, and deliberately does not have one.** A double push is only reachable from the starting rank, which places its destination two ranks inside the board unconditionally. Adding an `isOnBoard` guard there would be handling a scenario that cannot occur (AGENTS.md rule 8). The `&&` short-circuit ordering that makes this safe is load-bearing, so it carries a comment.

**Promotion is generated as an ordinary move, not skipped and not flagged.** A pawn push to the last rank appears in the list as a plain move with `flags: 0`. Promotion is ABC-004's scope, and the `flags` slot exists for exactly that extension. The alternative — omitting last-rank pushes until ABC-004 lands — would make the generator silently under-report moves, which is a worse intermediate state than an unflagged one.

**Scope held.** No castling, no en passant, no promotion flags, no king-safety filtering, no move ordering. The output is pseudo-legal on purpose, as the ticket specifies.
