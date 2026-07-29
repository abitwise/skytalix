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

**Amended 2026-07-29 (architecture audit): the blast radius is wider than this section
originally claimed.** It read "the representation is confined behind `src/position.ts` and the
helpers it exports". It is not. The 16-per-rank stride and literal 0x88 square indices are
baked into five other modules, verified by file and line:

- `apply.ts:52` `CASTLE_LOSS` keyed on raw squares `4, 116, 0, 7, 112, 119`; `apply.ts:70`
  `CASTLE_ROOK_MOVE` keyed `6/2/118/114`; `apply.ts:62` `DOUBLE_PUSH = 32`; `apply.ts:78`
  `move.to ± 16`.
- `moves.ts:58-61` the direction and leap tables (`±16, ±1, ±15, ±17, ±14, ±18, ±31, ±33`);
  `moves.ts:152` and `moves.ts:236` `± 16`; `moves.ts:279,283` `WHITE_CASTLES` / `BLACK_CASTLES`
  as raw square literals; `moves.ts:326` a scan to 128.
- `zobrist.ts:45,62` a `15 * 128` table addressed `piece << 7 | square`; `zobrist.ts:59` a scan
  to 128.
- `gameend.ts:60` and `fen.ts:104` scan to 128.

That is not a defect in the code and it must not be "fixed": routing offset tables through
helper calls would be slower and less readable, and the constants carry explanatory comments
(`moves.ts:278`). It was a defect in this section's prose — a maintainer reading the original
sentence would plan the wrong-sized change.

So: moving to bitboards later means rewriting `position.ts`, `fen.ts`, and move generation
**and reworking the layout constants in `apply.ts`, `moves.ts`, `zobrist.ts`, and
`gameend.ts`** — six of the nine modules in `src/`. Only `legal.ts`, `perft.ts` and
`perft-bench.ts` are layout-free; they go through the exported helpers, constants and the
`Move` type, which is what the Consequences section asks of every module. The FEN round-trip
test suite and the ABC-006 perft suite carry over unchanged — those tests assert behavior, not
layout, so they are exactly the safety net a rollback needs, and that mitigation is intact.
Rollback is still *safe*; it is just wider than advertised.

The realistic trigger for rollback is a measured failure of `NFR-001` generation throughput on
target hardware, not a preference. This section previously named `NFR-005` while the Context
binds on `NFR-001`; they are reconciled to `NFR-001` here, because `NFR-005` is in fact missed
today (see `plans/nfr-catalog.md`, corrected 2026-07-29) for reasons the audit attributed to
make/test/unmake legality filtering, not to the board representation — reading that miss as a
rollback trigger for 0x88 would replace the right change with the wrong one.
