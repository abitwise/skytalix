---
kind: adr
id: ADR-0001
---
# ADR-0001: Board representation is 0x88

## Status

accepted

## Context

ABC-001 owns the position representation that every other module reads: rendering
(EPIC-002), the move parser (EPIC-003), the engine (EPIC-004), and the opening book
(EPIC-005) all build on it. Choosing it once, deliberately, is cheaper than discovering
mid-EPIC-004 that the representation is the bottleneck.

Two constraints bear on the choice:

- `NFR-001` targets ≥ 1,000,000 nodes/sec for move generation. Board indexing and
  off-board detection sit in the innermost loop of the search — they run tens of millions
  of times per move.
- The ABC-008 spike measured 2.64M nodes/sec search-shaped using a 0x88 board, which is
  the evidence this decision leans on. Choosing a different representation now would
  invalidate that measurement and reopen `RISK-002`.

## Decision

The board is a 128-entry `Uint8Array` indexed as `square = rank * 16 + file`, with
`a1 = 0`, `h1 = 7`, `a8 = 112`, `h8 = 119`. The upper nibble holds the rank and the lower
nibble the file, so a square is off-board exactly when `(square & 0x88) !== 0`.

Pieces are small integers: type in the low 3 bits (`PAWN`=1 .. `KING`=6) with a colour flag
at bit 3 (`BLACK`=8). Empty is 0.

## Alternatives

**Plain 8x8 array (64 entries).** Simplest to read, and the most natural mental model.
Rejected because every sliding-piece ray and every knight offset needs an explicit
file-wrap check — the classic source of "the knight on a1 can reach h2" bugs. 0x88 turns
that check into one mask, and the ABC-002 acceptance criteria are written around exactly
that failure mode.

**Bitboards (twelve 64-bit boards, one per piece type and colour).** The fastest option
and what strong engines use. Rejected for this project: it needs magic-bitboard move
generation to pay off, which is a large step up in complexity, and the requester's binding
constraint is "not too complex". The ABC-008 measurement shows 0x88 already clears the NFR
targets with headroom, so the extra complexity would buy speed the strength target does not
need.

**Piece-list representation.** Rejected as a primary structure — it optimizes iteration
over pieces but complicates square lookup, which is what rendering and the move parser
need most.

## Consequences

- Off-board detection is one mask; no wrap checks in ray generation. This directly serves
  ABC-002's edge-wrapping acceptance criteria.
- Half the array (the 64 off-board squares) is never used. That waste is deliberate and is
  what buys the cheap bounds check.
- Square arithmetic is not the obvious `rank * 8 + file`, so every module must go through
  the `squareAt` / `fileOf` / `rankOf` helpers rather than computing indices inline. A
  module that hand-rolls `rank * 8 + file` will be subtly wrong.
- The ABC-008 throughput measurement stays valid, because the benchmark used this same
  representation.

## Rollback

The representation is confined behind `src/position.ts` and the helpers it exports. Moving
to bitboards later means rewriting `position.ts`, `fen.ts`, and move generation, while the
FEN round-trip test suite and the ABC-006 perft suite carry over unchanged — those tests
assert behavior, not layout, so they are exactly the safety net a rollback needs. The
realistic trigger for rollback is a measured failure of `NFR-005` on target hardware, not
a preference.
