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
import { FLAG_EN_PASSANT, generateMoves, isSquareAttackedBy, type Move } from "./moves.ts";
import { BLACK, EMPTY, isOnBoard, KING, NO_SQUARE, PAWN, type Position } from "./position.ts";

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

/** The two neighbouring files a pawn can capture from — the same pair moves.ts steps over. */
const EP_CAPTURE_SIDES = [-1, 1] as const;

/**
 * Is an en-passant capture LEGAL for the side to move? True exactly when
 * `legalMoves(position).some(m => m.flags === FLAG_EN_PASSANT)` is true — that expression is
 * the DEFINITION and the test oracle, and it is deliberately NOT the implementation: running
 * the whole generator here costs ~14x a bare key on the positions that reach it, and it is
 * called from `zobristKey` on every node ABC-011 makes it reach (ADR-0005).
 *
 * ABC-011: FIDE 9.2.3 makes two positions the same only when "the possible moves of all the
 * pieces of both players are the same", so a pawn takeable only by a move that exposes its
 * captor's king "could not have been captured" and the en-passant right is not real. That is
 * why this is legality and not the cheaper board-only question.
 *
 * Like `legalMoves` it plays a move and takes it back, so the position is byte-identical on
 * return — asserted across the call rather than assumed (`src/legal.test.ts`).
 */
export function hasLegalEnPassant(position: Position): boolean {
  const target = position.epSquare;
  if (target === NO_SQUARE) return false;

  const black = position.blackToMove;
  const pawn = PAWN | (black ? BLACK : 0);
  // A pawn captures diagonally forward, so a capturer of `target` stands one rank behind it
  // relative to its own advance, on a neighbouring file. Deriving the (at most) two candidate
  // from-squares is what keeps this off `generateMoves`; 0x88 turns the file-wrap case at the
  // a- and h-files into the same edge test as everything else.
  const rank = black ? target + 16 : target - 16;

  for (const side of EP_CAPTURE_SIDES) {
    const from = rank + side;
    if (!isOnBoard(from) || position.board[from] !== pawn) continue;

    const move: Move = {
      from,
      to: target,
      piece: pawn,
      captured: PAWN | (black ? 0 : BLACK),
      flags: FLAG_EN_PASSANT,
      promotion: EMPTY,
    };

    const undo = makeMove(position, move);
    const legal = !isSquareAttackedBy(position, kingSquareOf(position, black), !black);
    unmakeMove(position, move, undo);

    if (legal) return true;
  }

  return false;
}
