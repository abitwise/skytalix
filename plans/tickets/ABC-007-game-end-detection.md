---
id: ABC-007
title: Game-end detection
status: done
column: Done
size: M
priority: P0
epic: EPIC-001
feature: —
---

# ABC-007 — Game-end detection

## Problem

*User*: the player, who needs the game to end when the game is over. *Pain*: a chess program
that misses a checkmate, or plays on into a dead-drawn position, is not a chess program.
*Value*: the terminal-state check that lets EPIC-002's loop stop and EPIC-006's result screen
say why — and that the engine needs in order to value a mate correctly.

## Scope

All five terminal conditions, returning a result *and* a machine-readable reason:

- **Checkmate** — side to move is in check and has zero legal moves.
- **Stalemate** — side to move is not in check and has zero legal moves.
- **Threefold repetition** — the same position (placement + side to move + castling rights +
  en-passant availability) occurs three times. Requires a position history; add Zobrist
  hashing here, since this is the first ticket that needs it.
- **Fifty-move rule** — the halfmove clock reaches 100 plies.
- **Insufficient material** — K vs K, K+B vs K, K+N vs K, and K+B vs K+B with both bishops
  on the same colour square.

## Out of scope

- Resignation and draw offers — those are session concerns, EPIC-006.
- Displaying the result to the player — EPIC-002 / EPIC-006.
- The seventy-five-move and fivefold rules (automatic draws under FIDE) — not needed for a
  human-vs-engine game where the fifty-move claim is applied automatically.

## Acceptance (Given/When/Then)

- **Given** the fool's-mate position `rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3`,
  **when** the state is evaluated, **then** the result is checkmate, Black wins.
- **Given** `7k/5Q2/6K1/8/8/8/8/8 b - - 0 1`, **when** the state is evaluated, **then** the
  result is stalemate and a draw — the side to move has no legal move and is not in check.
- **Given** a game where both sides shuffle knights back to their starting squares twice,
  **when** the starting position occurs for the third time, **then** the result is a draw by
  threefold repetition.
- **Given** a position whose halfmove clock is 99, **when** a non-capture non-pawn move is
  applied, **then** the result is a draw by the fifty-move rule.
- **Given** a position with only the two kings, **when** the state is evaluated, **then** the
  result is a draw by insufficient material.
- **Given** a position with king and bishop against king and bishop on **opposite**-coloured
  squares, **when** the state is evaluated, **then** the game is **not** drawn — mate is
  still constructible.
- **Given** any non-terminal position, **when** the state is evaluated, **then** the result
  is "in progress" and no reason is set.

## Dependencies

- `ABC-005` — checkmate and stalemate are both "zero legal moves", split by check status.
- `ABC-003` — the halfmove clock and the move history it maintains.

## Security / NFR triggers

- `NFR-001` (throughput) — the engine calls this at every leaf. Terminal detection must be
  cheap: check the legal-move count that was computed anyway, never recompute it.
- No security trigger.

## Test notes

Every acceptance case is a FEN with an exact expected verdict — a table test. The
opposite-coloured-bishops case is deliberately a *negative* test: it is the one insufficient-
material rule that is easy to over-apply, and over-applying it would draw games that are
still winnable.

Threefold repetition needs a played move sequence rather than a single FEN, so it gets its
own small test that applies a move list and asserts the draw fires on the third occurrence,
not the second.

## Definition of Ready

Problem ✅ · scope + out-of-scope ✅ · INVEST ✅ · acceptance measurable ✅ · dependencies ✅ ·
NFR triggers ✅ · test notes ✅ · size `M` ✅ · priority `P0` ✅ · no blocker ✅
