/**
 * Standard Algebraic Notation — `e2e4` is a coordinate, `Nf3` is what a chess player reads.
 *
 * `ADR-0004` puts SAN in one module above `src/legal.ts` because the grammar has a rules
 * dependency it cannot shed: a `Move` carries `{ from, to, piece, captured, flags, promotion }`
 * (`src/moves.ts:46`), which is enough for `e2e4` and not enough for `Nbd2`. SAN needs TWO
 * positions — the one before the move, to know which OTHER legal moves of the same piece type
 * reach that square, and the one after it, to know whether the move gives check or mate. That is
 * why this file imports `legal.ts` and `apply.ts`, and it is why a renderer could not own it.
 *
 * `toSan` is the whole module. `parseSan` is `EPIC-003`'s and is added to THIS file, over these
 * same tables — one grammar, both directions (`ADR-0004` clause 2). Nothing here forecloses it.
 *
 * It deliberately does NOT import `gameend.ts`: `#` is checkmate only, while `gameStatus` would
 * additionally compute insufficient material and repetition, which are not SAN suffixes. It does
 * not import `history.ts` either — SAN is derived per frame and never stored (clause 3).
 *
 * TWO CALLER OBLIGATIONS, neither of them validated here. `move` must be a legal move of
 * `position`, as produced by `legalMoves(position)`; and a supplied `legal` list must be the legal
 * moves of that same position. Supply another position's list and the answer is silently wrong —
 * that is the price of the optional parameter and it is paid by the caller. Behaviour on an
 * illegal `move` is undefined and `ABC-013` asserts nothing about it.
 *
 * The position is mutated transiently and restored: `suffix` makes the move, asks, and unmakes it,
 * so `toFen(position)` is byte-identical across every call (`ABC-013` `A18`).
 */

import { makeMove, unmakeMove } from "./apply.ts";
import { isInCheck, legalMoves } from "./legal.ts";
import { FLAG_CASTLE, FLAG_PROMOTION, type Move } from "./moves.ts";
import {
  BISHOP,
  EMPTY,
  fileOf,
  KING,
  KNIGHT,
  PAWN,
  type Position,
  pieceType,
  QUEEN,
  ROOK,
  rankOf,
  squareName,
} from "./position.ts";

const PIECE_LETTERS: Readonly<Record<number, string>> = {
  [KNIGHT]: "N",
  [BISHOP]: "B",
  [ROOK]: "R",
  [QUEEN]: "Q",
  [KING]: "K",
};

/** The king's destination file on the kingside leg — file g. The queenside leg lands on c. */
const KINGSIDE_FILE = 6;

/**
 * The qualifier between the piece letter and the destination: nothing when the piece is unique,
 * otherwise the origin file, otherwise the origin rank, otherwise the full origin square.
 *
 * THE FILE IS TRIED FIRST AND THE ORDER IS NOT INTERCHANGEABLE. Two knights on `b1` and `d5` both
 * reaching `c3` are separated by either axis, and only `Nbc3` is right.
 *
 * Rivals are the LEGAL moves of the same piece byte (type and colour) reaching the same square
 * from a different origin — `legalMoves`, never `generateMoves`. A pinned piece that geometrically
 * reaches the square is not a rival, because it has no move to be ambiguous with. `other.from`
 * excludes the mover itself rather than reference identity, so a caller may hand in a list from a
 * different `legalMoves` call than the one `move` came out of.
 *
 * Only reached for a piece move: a pawn is never disambiguated (its origin file is a capture rule,
 * not a qualifier), which is why a pawn move never builds a legal list at all.
 */
function disambiguator(position: Position, move: Move, legal?: readonly Move[]): string {
  let sharesFile = false;
  let sharesRank = false;
  let hasRival = false;

  for (const other of legal ?? legalMoves(position)) {
    if (other.to !== move.to || other.piece !== move.piece || other.from === move.from) continue;
    hasRival = true;
    if (fileOf(other.from) === fileOf(move.from)) sharesFile = true;
    if (rankOf(other.from) === rankOf(move.from)) sharesRank = true;
  }

  if (!hasRival) return "";

  const origin = squareName(move.from);
  if (!sharesFile) return origin[0] as string;
  if (!sharesRank) return origin[1] as string;
  return origin;
}

/**
 * `+` for check, `#` for checkmate, nothing otherwise — decided on the position AFTER the move.
 *
 * `#` is check AND no reply, in that order and both of them: a move that leaves the opponent with
 * no legal move but NOT in check is a stalemate, and SAN has no suffix for it. The `&&` also keeps
 * the second generation off every non-checking move, which is where the cost is (`ADR-0004`: mate
 * is additionally `legalMoves(after).length === 0`, and that call is ~97% of a SAN string).
 */
function suffix(position: Position, move: Move): string {
  const undo = makeMove(position, move);
  // makeMove flipped the side, so isInCheck now asks about the side the move was played AGAINST.
  const check = isInCheck(position);
  const mate = check && legalMoves(position).length === 0;
  unmakeMove(position, move, undo);

  if (!check) return "";
  return mate ? "#" : "+";
}

/**
 * Everything before the suffix: the castle string, or a pawn move, or a piece move.
 *
 * Capture is read from `move.captured` and NOT from `position.board[move.to]`, because an en
 * passant capture's destination square is empty — `exd6` is the one row a board read gets wrong.
 */
function body(position: Position, move: Move, legal?: readonly Move[]): string {
  if ((move.flags & FLAG_CASTLE) !== 0) {
    return fileOf(move.to) === KINGSIDE_FILE ? "O-O" : "O-O-O";
  }

  const captures = move.captured !== EMPTY;
  const destination = squareName(move.to);

  if (pieceType(move.piece) === PAWN) {
    const promotion =
      (move.flags & FLAG_PROMOTION) !== 0 ? `=${PIECE_LETTERS[move.promotion] ?? ""}` : "";
    const arrival = captures ? `${squareName(move.from)[0]}x${destination}` : destination;
    return `${arrival}${promotion}`;
  }

  const letter = PIECE_LETTERS[pieceType(move.piece)] ?? "";
  return `${letter}${disambiguator(position, move, legal)}${captures ? "x" : ""}${destination}`;
}

/**
 * The SAN string for `move` played in `position`, e.g. `Nf3`, `exd5`, `O-O-O`, `a8=Q#`.
 *
 * `legal` is optional and is part of the contract rather than a tuning detail: when the caller
 * already holds the legal move list — `EPIC-003`'s parser, which just generated it to validate,
 * and its `moves` command, which is formatting that very list — supplying it skips the generation
 * this function would otherwise pay for the disambiguator. A castle string and a pawn move never
 * consult the list at all; a checking move pays one generation regardless, for the mate test.
 */
export function toSan(position: Position, move: Move, legal?: readonly Move[]): string {
  return `${body(position, move, legal)}${suffix(position, move)}`;
}
