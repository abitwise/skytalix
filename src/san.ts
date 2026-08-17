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

/**
 * `parseSan` — the second direction of the SAN grammar, over the SAME tables (`ADR-0004` clause 2).
 *
 * IT IS RESOLUTION, NOT A SECOND GRAMMAR. Nothing below decodes a piece letter back into a piece
 * type, decodes a castle string back into a king move, or builds a `Move`: the parsed text is
 * matched against the description that `PIECE_LETTERS` and `body` above ALREADY produce for each
 * legal move, and the answer is an element of the list. So the piece letters, the promotion letters
 * and the castle strings each occur exactly once in this file (`ABC-032` `A7`) — the reverse
 * direction reads them through the forward one and owns no table of its own.
 *
 * The castle strings are reached the strongest way available: a castle candidate's own
 * `toSan(position, move, legal)` output, suffix stripped, compared against the input. That is why
 * this file holds no castle literal of its own and why NO EXISTING LINE OF THIS MODULE CHANGED for
 * `ABC-032` (`A6`). The one visible price is recorded rather than hidden: when castling is not
 * legal in the position there is no castle move to ask, so a castle-shaped input is `unreadable`
 * rather than `no-such-move`. Both are `rejected`, the two codes never collapse, and no acceptance
 * criterion turns on it — but a reader should not have to discover it.
 *
 * MOVE IDENTITY — `ADR-0004` (2b). Every `Move` returned, in `move` and in every `ambiguous`
 * candidate, is an ELEMENT of the legal move list for the position (`filter` never copies).
 *
 * CASE IS MEANING and this reader is case-exact: `bxc4` is a pawn capture, `Bxc4` a bishop capture,
 * and both can be legal in one position (`ABC-032` § Out of scope). `ABC-033` owns the case-folded
 * retry and the multi-match it can produce.
 *
 * The same caller obligation as `toSan`: a supplied `legal` must be the legal moves of `position`.
 */

/**
 * A machine-readable code, never display copy — `ABC-034` owns the wording. The two members are
 * `ADR-0004` (2a)'s floor and they must never collapse into one; the same two the coordinate
 * grammar carries (`src/coordinate-move.ts`), so `ABC-033` sees one shape at the seam.
 */
export type SanRejectReason =
  /** The text is not SAN this module can read at all. */
  | "unreadable"
  /** Well-formed SAN that names no legal move in this position. */
  | "no-such-move";

/** The three outcomes, closed — `ADR-0004` (2a). A single match is `move`, never a 1-element list. */
export type SanParseResult =
  | { readonly outcome: "move"; readonly move: Move }
  | { readonly outcome: "ambiguous"; readonly candidates: readonly Move[] }
  | { readonly outcome: "rejected"; readonly reason: SanRejectReason };

/** Derived from the one table above — not a second one. `"NBRQK"` at load. */
const PIECE_LETTER_CLASS = Object.values(PIECE_LETTERS).join("");

/** `Nbd2`, `R1a3`, `Qh4xe1`, `Be5` — letter, optional file and/or rank qualifier, capture, target. */
const PIECE_MOVE = new RegExp(`^([${PIECE_LETTER_CLASS}])([a-h]?)([1-8]?)(x?)([a-h][1-8])$`);

/** `e4`, `exd5`, `e8=Q`, `bxa1=N` — the capture form carries the origin file, which is a rule. */
const PAWN_MOVE = new RegExp(`^(?:([a-h])x)?([a-h][1-8])(?:=([${PIECE_LETTER_CLASS}]))?$`);

/** Check and mate are decoration ON INPUT: `Nxf3`, `Nxf3+` and `Nxf3#` all name the same move. */
const CHECK_SUFFIX = /[+#]$/;

/** The piece letter `body` would print for this move — `""` for a pawn. One table, read forwards. */
function pieceLetterOf(move: Move): string {
  return PIECE_LETTERS[pieceType(move.piece)] ?? "";
}

/**
 * Resolves a SAN string against the legal moves of `position`.
 *
 * `legal` is optional and carries the caller obligation above; supplying the list the caller
 * already holds means this function performs ZERO `legalMoves` calls of its own on the piece and
 * pawn paths (`ADR-0004` clause 2: 0.10 µs supplied against 4.31 µs unsupplied, which is what makes
 * `A1`'s run over the whole perft corpus affordable).
 *
 * `text` is declared `string` because that is what every caller has; the runtime guard is what
 * makes the function TOTAL against whatever a loop actually hands over (`A5`).
 */
export function parseSan(
  position: Position,
  text: string,
  legal?: readonly Move[],
): SanParseResult {
  if (typeof text !== "string") return { outcome: "rejected", reason: "unreadable" };

  const written = text.trim().replace(CHECK_SUFFIX, "");
  const moves = legal ?? legalMoves(position);

  const piece = PIECE_MOVE.exec(written);
  if (piece !== null) {
    const [, letter, qualifierFile, qualifierRank, capture, destination] = piece;
    return resolve(
      moves.filter(
        (move) =>
          (move.flags & FLAG_CASTLE) === 0 &&
          pieceLetterOf(move) === letter &&
          squareName(move.to) === destination &&
          (move.captured !== EMPTY) === (capture === "x") &&
          (qualifierFile === "" || squareName(move.from)[0] === qualifierFile) &&
          (qualifierRank === "" || squareName(move.from)[1] === qualifierRank),
      ),
    );
  }

  const pawn = PAWN_MOVE.exec(written);
  if (pawn !== null) {
    const [, originFile, destination, promotion] = pawn;
    return resolve(
      moves.filter(
        (move) =>
          pieceLetterOf(move) === "" &&
          squareName(move.to) === destination &&
          (move.captured !== EMPTY) === (originFile !== undefined) &&
          (originFile === undefined || squareName(move.from)[0] === originFile) &&
          (promotion === undefined || PIECE_LETTERS[move.promotion] === promotion),
      ),
    );
  }

  // `0-0` / `0-0-0` are accepted for `O-O` / `O-O-O`; the strings themselves come from `toSan`.
  const castled = written.replaceAll("0", "O");
  const castles = moves.filter(
    (move) =>
      (move.flags & FLAG_CASTLE) !== 0 &&
      toSan(position, move, moves).replace(CHECK_SUFFIX, "") === castled,
  );
  if (castles.length === 0) return { outcome: "rejected", reason: "unreadable" };
  return resolve(castles);
}

/** The three arms, closed, from one candidate list: none, exactly one, or two and more. */
function resolve(candidates: readonly Move[]): SanParseResult {
  if (candidates.length === 0) return { outcome: "rejected", reason: "no-such-move" };
  if (candidates.length === 1) return { outcome: "move", move: candidates[0] as Move };
  return { outcome: "ambiguous", candidates };
}
