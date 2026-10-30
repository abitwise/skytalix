/**
 * Game-end detection — the terminal-state check that lets the game loop stop and the engine
 * value a mate correctly.
 *
 * `gameStatus` reports exactly one of three states. The game is OVER automatically, on one of
 * the five conditions that need no claim: checkmate (FIDE 5.1.1), stalemate (5.2.1), a dead
 * position by material (a SUBSET of 5.2.2 — see `isInsufficientMaterial`), fivefold repetition
 * (9.6.1), and seventy-five moves (9.6.2). Or it is IN PROGRESS with one or more draws the
 * player having the move may CLAIM: threefold repetition (9.2) and the fifty-move rule (9.3).
 * Or it is in progress with nothing claimable.
 *
 * The claim half is the point, and it runs one way: FIDE 9.2.1 and 9.3.1 give the claim to the
 * player having the move, so a claimable draw is never reported as `result: "draw"` — the side
 * to move may just as well play on, and mate. The two arms of `GameStatus` make the mistake
 * unrepresentable rather than merely tested for.
 *
 * It stays cheap (NFR-001), though the search leaf calls `leafEndReason` instead (ABC-206): it
 * generates the legal moves ONCE and reads their count, and the fivefold rule and the threefold
 * claim share a single Zobrist key read that a caller passing no counts map never pays for at all.
 */

import { hasLegalEnPassant, hasLegalMove, isInCheck, legalMoves } from "./legal.ts";
import {
  BISHOP,
  fileOf,
  isOnBoard,
  KNIGHT,
  NO_SQUARE,
  PAWN,
  type Position,
  pieceType,
  QUEEN,
  ROOK,
  rankOf,
} from "./position.ts";
import { epFileKey, zobristKey } from "./zobrist.ts";

export type GameResult = "in-progress" | "white-wins" | "black-wins" | "draw";

/** How a game ENDED. FIDE 9.2/9.3 are not here: a claimable draw has not ended anything. */
export type EndReason =
  | "checkmate" // 5.1.1
  | "stalemate" // 5.2.1
  | "insufficient-material" // a subset of 5.2.2, as implemented — see the module header
  | "fivefold-repetition" // 9.6.1, automatic
  | "seventy-five-move"; // 9.6.2, automatic

/** A draw the player HAVING THE MOVE may claim. Disjoint from `EndReason`, by construction. */
export type ClaimableDraw = "threefold-repetition" | "fifty-move"; // 9.2, 9.3

export interface DrawClaims {
  /** Who may claim. Always the side to move (9.2.1, 9.3.1) — never the side that just moved. */
  readonly by: "white" | "black";
  /** Which draws that side may claim. NEVER empty; ordered threefold first, then fifty-move. */
  readonly draws: readonly ClaimableDraw[];
}

export type GameStatus =
  | {
      readonly result: "white-wins" | "black-wins" | "draw";
      /** Why the game ended. */
      readonly reason: EndReason;
      readonly claimable?: undefined;
    }
  | {
      readonly result: "in-progress";
      readonly reason: null;
      /** Absent unless the side to move has a draw to claim; never present and empty. */
      readonly claimable?: DrawClaims;
    };

/** The halfmove clock (in plies) at which the fifty-move rule may be CLAIMED: 50 full moves. */
const FIFTY_MOVE_PLIES = 100;

/** The halfmove clock at which the game draws with no claim (9.6.2): 75 moves by each side. */
const SEVENTY_FIVE_MOVE_PLIES = 150;

/** Occurrences of one position that make the repetition draw claimable (9.2). */
const THREEFOLD_OCCURRENCES = 3;

/** Occurrences at which it draws with no claim (9.6.1). */
const FIVEFOLD_OCCURRENCES = 5;

/** The light/dark colour of a square, as 0 or 1. Two same-colour bishops can never mate. */
const squareColour = (square: number): number => (fileOf(square) + rankOf(square)) & 1;

/**
 * True when neither side has the material to force checkmate: K vs K, K+B vs K, K+N vs K, and
 * K+B vs K+B with every bishop on one colour. A single pawn, rook, or queen makes mate
 * constructible, so any of those returns false at once. Opposite-coloured bishops are
 * deliberately NOT drawn — mate is still constructible, and over-applying this rule would draw
 * a winnable game.
 *
 * There is no FIDE article called "insufficient material". This is the material-count SUBSET
 * of the dead-position rule (5.2.2, *no series of legal moves can produce checkmate*): a dead
 * position that is not material-thin — a fully locked pawn wall, say — is not detected here
 * and plays on until 9.6.2's seventy-five-move backstop ends it. A draw is late, never wrong.
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
 * The REPETITION KEY of `position`, whose Zobrist key is `key` (`ADR-0020` § AMENDMENT 2026-10-30,
 * C1 and C2): `key` with the ep file XORed out when `position` carries an ep square and no LEGAL
 * en-passant capture exists, and `key` unchanged otherwise. A pseudo-legal capture that is illegal
 * (a pinned capturer, the rank pin) takes the file out: FIDE 9.2.3 counts those positions as the
 * same. A legal capture keeps it in, so two positions with different move sets never share a key.
 *
 * EVERY comparison of a position against the game's earlier positions uses it: the game-end
 * counts, this module's lookup into them, and every key in a search's `priorKeys`. The hash, the
 * TT, the book and the search's own per-ply array stay raw. This is the one function that computes
 * it. Pure: `hasLegalEnPassant` plays a probe move and takes it back, and it runs only when an ep
 * square is set — once per double push in a game, never per search node.
 */
export function repetitionKey(position: Position, key: bigint): bigint {
  if (position.epSquare === NO_SQUARE || hasLegalEnPassant(position)) return key;
  return key ^ epFileKey(position.epSquare);
}

/**
 * The state of `position`: over, or in progress with the claims the side to move holds. Pass
 * `positionCounts` — a map from each seen position's REPETITION key (`repetitionKey`) to how many
 * times it has occurred (including the current one) — to enable the repetition rules; omit it (the loop has
 * no history yet, a search leaf keeps its own) and repetition is simply never reported. A bare
 * caller still gets both clock-based rules, so it can never see a game that does not end.
 *
 * Checkmate and stalemate are decided first from the single, shared legal-move generation, so
 * a mate is never mistaken for a draw when the clock is high or material is thin. The rest run
 * automatic-before-claimable: an automatic draw ends the game, and only then is what the side
 * to move could have claimed still worth reporting.
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

  if (position.halfmoveClock >= SEVENTY_FIVE_MOVE_PLIES) {
    return { result: "draw", reason: "seventy-five-move" };
  }

  // ONE key read, shared by the automatic fivefold rule and the threefold claim below — and
  // skipped entirely, at no cost, by a caller that passes no counts map.
  // The counts are keyed by repetition key (`ADR-0020` § AMENDMENT 2026-10-30 C3), so the lookup is.
  const occurrences =
    positionCounts === undefined
      ? 0
      : (positionCounts.get(repetitionKey(position, zobristKey(position))) ?? 0);

  if (occurrences >= FIVEFOLD_OCCURRENCES) {
    return { result: "draw", reason: "fivefold-repetition" };
  }

  const draws: ClaimableDraw[] = [];
  if (occurrences >= THREEFOLD_OCCURRENCES) draws.push("threefold-repetition");
  if (position.halfmoveClock >= FIFTY_MOVE_PLIES) draws.push("fifty-move");

  if (draws.length === 0) return { result: "in-progress", reason: null };

  return {
    result: "in-progress",
    reason: null,
    claimable: { by: position.blackToMove ? "black" : "white", draws },
  };
}

/**
 * Why the game at a search leaf has ended, or `null` if it has not: exactly
 * `gameStatus(position).reason` with no counts map, checked in the same order (ABC-206).
 * Checkmate and stalemate first, then dead position by material, then seventy-five moves. The
 * fifty-move claim and repetition are never terminal here, as with a bare `gameStatus` call;
 * the search decides repetition off its own key array.
 *
 * It is cheaper than `gameStatus` because a leaf needs no list of moves: `hasLegalMove` stops at
 * the first legal move, and no Zobrist key is read.
 */
export function leafEndReason(position: Position): EndReason | null {
  if (!hasLegalMove(position)) return isInCheck(position) ? "checkmate" : "stalemate";
  if (isInsufficientMaterial(position)) return "insufficient-material";
  if (position.halfmoveClock >= SEVENTY_FIVE_MOVE_PLIES) return "seventy-five-move";
  return null;
}
