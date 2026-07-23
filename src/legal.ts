/**
 * Legality filtering — the layer that turns pseudo-legal moves into legal ones.
 *
 * `generateMoves` (ABC-002/004) returns moves that obey each piece's movement rules but
 * may still leave the mover's own king in check — a pinned piece stepping off the pin, the
 * king walking into an attack, a move that ignores an existing check. `legalMoves` filters
 * those out; `isInCheck` and the `isSquareAttackedBy` primitive (from moves.ts, first needed
 * by castling in ABC-004) are the pieces the rest of the project calls to know the game state.
 *
 * The filter is deliberately make/test/unmake: for each pseudo-legal move, play it, ask
 * whether the mover's king is now attacked, take it back. The ticket endorses this — correctness
 * first, and the EPIC-004 spike decides whether a pin-aware generator is ever worth building.
 * Its virtue is that it is uniformly correct: absolute pins, check evasion, and the rare
 * en-passant discovered check (two pawns leaving one rank at once) all fall out of the same
 * test, with no special case, because the test runs against the real resulting board.
 */

import { makeMove, unmakeMove } from "./apply.ts";
import { generateMoves, isSquareAttackedBy, type Move } from "./moves.ts";
import { BLACK, KING, type Position } from "./position.ts";

/**
 * The 0x88 square of the given side's king. Every legal position has exactly one king per
 * side (parseFen enforces it, make/unmake preserves it), and off-board squares are EMPTY, so
 * a single scan for the king's byte finds it.
 */
function kingSquareOf(position: Position, black: boolean): number {
  return position.board.indexOf(KING | (black ? BLACK : 0));
}

/** True when the side to move is in check — its king stands on a square the enemy attacks. */
export function isInCheck(position: Position): boolean {
  const black = position.blackToMove;
  return isSquareAttackedBy(position, kingSquareOf(position, black), !black);
}

/**
 * The pseudo-legal moves for the side to move, filtered so none leaves the mover's own king
 * in check. Plays each move on the position in place and takes it back, so the position is
 * unchanged on return.
 */
export function legalMoves(position: Position): Move[] {
  const moverIsBlack = position.blackToMove;
  const legal: Move[] = [];

  for (const move of generateMoves(position)) {
    const undo = makeMove(position, move);
    // makeMove flipped the side; the mover's king must not be attacked by the now-mover.
    const kingSquare = kingSquareOf(position, moverIsBlack);
    if (!isSquareAttackedBy(position, kingSquare, !moverIsBlack)) legal.push(move);
    unmakeMove(position, move, undo);
  }

  return legal;
}
