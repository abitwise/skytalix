---
id: 20260723T210512Z-software-engineer-decision-9dfc351d
kind: decision
by: software-engineer
at: 2026-07-23T21:05:12Z
verified_by: 
confidence: high
refs:
  - ABC-003
  - ABC-004
  - EPIC-001
  - NFR-001
  - ADR-0001
  - src/apply.ts
  - src/apply.test.ts
supersedes: 
---

Implementation decisions for ABC-003 (make/unmake with full state restoration).

**New module `src/apply.ts`, not an extension of `moves.ts`.** Make/unmake is a distinct concern (mutating a position) from move generation (reading one), and the repo's one-module-per-concern shape (`position.ts` / `moves.ts` / `fen.ts`) is the pattern followed. No new ADR: ABC-001 already fixed the representation (ADR-0001, 0x88), and this ticket consumes that decision without adding a structural one.

**The undo record carries exactly the four fields the move cannot rederive** — `captured`, `castling`, `epSquare`, `halfmoveClock` — as the ticket's scope enumerates. `makeMove` returns it; `unmakeMove(position, move, undo)` consumes it. The captured piece is read from `board[to]` (the authoritative source) before it is overwritten, so the record is self-contained rather than trusting `move.captured`. Side-to-move and fullmove are deliberately NOT in the record: both are derivable — the side flips deterministically, and fullmove advances iff the mover was Black, so `unmakeMove` mirrors the increment with a symmetric decrement after flipping the side back.

**NFR-001 satisfied by construction.** `makeMove` mutates the 128-entry board in place and allocates only a fixed four-field record — no `Uint8Array` copy per node. Full-position copying, which the ticket explicitly rejects, appears nowhere. This is the property the whole search rests on.

**Castling *rights* are updated; castling *moves* are not (ABC-004).** A single `CASTLE_LOSS` square→mask table clears the right when a king or rook vacates its home square (`from`) or a rook is captured on its home square (`to`); a square not in the table contributes 0, so the mask is a no-op for every ordinary move. This is in ABC-003's scope ("updating: … castling rights"). Executing the rook's movement during a castle, the en-passant capture-square removal, and the promotion piece swap are ABC-004 — this make/unmake mechanism is what ABC-004 extends.

**En-passant target is set on a double push only.** Detected as a pawn move with `|to − from| === 32` (two ranks in 0x88); the target is the arithmetic midpoint of `from`/`to`. Every other move clears `epSquare` to `NO_SQUARE`. Guarding on `isPawn` first is load-bearing — a rook can also move two ranks (Δ32) but must not set an ep target.

**One self-fix consumed (of 2 budgeted), on the gate not the logic.** The tests passed at runtime on the first green, but `tsc` (typecheck + build) failed on four `noUncheckedIndexedAccess` errors from explicit `PERFT_POSITIONS[0][1]` indexing in the test. Fixed by hoisting a named `START_FEN` constant (the `moves.test.ts` convention) and referencing it directly — no production code changed, no test weakened. Gate green after the fix.

**Scope held.** No special-move execution, no legality filtering, no repetition history (ABC-007), no move ordering. Pseudo-legal moves in, exact restoration out.
