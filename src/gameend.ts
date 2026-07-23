/**
 * Game-end detection — the terminal-state check that lets the game loop stop and the engine
 * value a mate correctly.
 *
 * `gameStatus` returns both a result (who stands where) and a machine-readable reason, across
 * the five terminal conditions: checkmate, stalemate, threefold repetition, the fifty-move
 * rule, and insufficient material. It is built to be cheap at a search leaf (NFR-001): it
 * generates the legal moves ONCE and reads their count, rather than recomputing.
 */

import { isInCheck, legalMoves } from "./legal.ts";
import {
  BISHOP,
  fileOf,
  isOnBoard,
  KNIGHT,
  PAWN,
  type Position,
  pieceType,
  QUEEN,
  ROOK,
  rankOf,
} from "./position.ts";
import { zobristKey } from "./zobrist.ts";

export type GameResult = "in-progress" | "white-wins" | "black-wins" | "draw";

export type EndReason =
  | "checkmate"
  | "stalemate"
  | "threefold-repetition"
  | "fifty-move"
  | "insufficient-material"
  | null;

export interface GameStatus {
  readonly result: GameResult;
  /** Why the game ended, or null while it is in progress. */
  readonly reason: EndReason;
}

/** The halfmove clock (in plies) at which the fifty-move rule applies: 50 full moves. */
const FIFTY_MOVE_PLIES = 100;

/** The light/dark colour of a square, as 0 or 1. Two same-colour bishops can never mate. */
const squareColour = (square: number): number => (fileOf(square) + rankOf(square)) & 1;

/**
 * True when neither side has the material to force checkmate: K vs K, K+B vs K, K+N vs K, and
 * K+B vs K+B with every bishop on one colour. A single pawn, rook, or queen makes mate
 * constructible, so any of those returns false at once. Opposite-coloured bishops are
 * deliberately NOT drawn — mate is still constructible, and over-applying this rule would draw
 * a winnable game.
 */
function isInsufficientMaterial(position: Position): boolean {
  let knights = 0;
  let bishops = 0;
  const bishopColours = new Set<number>();

  for (let square = 0; square < 128; square++) {
    if (!isOnBoard(square)) continue;
    const type = pieceType(position.board[square] as number);

    if (type === PAWN || type === ROOK || type === QUEEN) return false;
    if (type === KNIGHT) knights++;
    else if (type === BISHOP) {
      bishops++;
      bishopColours.add(squareColour(square));
    }
  }

  const minors = knights + bishops;
  if (minors <= 1) return true; // K vs K, or a lone minor
  // Two or more pieces are drawish only when they are all bishops on a single colour.
  return knights === 0 && bishopColours.size === 1;
}

/**
 * The terminal state of `position`. Pass `positionCounts` — a map from each seen position's
 * Zobrist key to how many times it has occurred (including the current one) — to enable
 * threefold-repetition detection; omit it (the loop has no history yet) and repetition is
 * simply never reported.
 *
 * Checkmate and stalemate are decided first from the single, shared legal-move generation, so
 * a mate is never mistaken for a draw when the clock is high or material is thin.
 */
export function gameStatus(
  position: Position,
  positionCounts?: ReadonlyMap<bigint, number>,
): GameStatus {
  if (legalMoves(position).length === 0) {
    if (isInCheck(position)) {
      return { result: position.blackToMove ? "white-wins" : "black-wins", reason: "checkmate" };
    }
    return { result: "draw", reason: "stalemate" };
  }

  if (isInsufficientMaterial(position)) {
    return { result: "draw", reason: "insufficient-material" };
  }

  if (position.halfmoveClock >= FIFTY_MOVE_PLIES) {
    return { result: "draw", reason: "fifty-move" };
  }

  if (positionCounts !== undefined && (positionCounts.get(zobristKey(position)) ?? 0) >= 3) {
    return { result: "draw", reason: "threefold-repetition" };
  }

  return { result: "in-progress", reason: null };
}
