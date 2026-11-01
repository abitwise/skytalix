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
 *
 * ABC-254 (ADR-0003 as amended 2026-11-01, (1-A)): that test now runs only where a move can be
 * illegal — king moves, en passant, pinned pieces, and every move while in check. The full
 * filters (`fullLegalMoves` and its three siblings) stay below as the fallback's proven form and
 * as the oracle; the lazy filters keep every signature and return the same lists in the same order.
 */

import {
  createUndoStack,
  makeMove,
  makeMovePacked,
  unmakeMove,
  unmakeMovePacked,
} from "./apply.ts";
import {
  FLAG_EN_PASSANT,
  FLAG_NONE,
  FLAG_PROMOTION,
  generateCaptures,
  generateCapturesPacked,
  generateMoves,
  generateMovesPacked,
  isSquareAttackedBy,
  type Move,
  packedFlags,
  packedFrom,
  packedPiece,
  packedTo,
} from "./moves.ts";
import {
  BISHOP,
  BLACK,
  EMPTY,
  isOnBoard,
  KING,
  NO_SQUARE,
  PAWN,
  type Position,
  QUEEN,
  ROOK,
} from "./position.ts";

/**
 * The 0x88 square of the given side's king. Every legal position has exactly one king per
 * side (parseFen enforces it, make/unmake preserves it), and off-board squares are EMPTY, so
 * a single scan for the king's byte finds it.
 *
 * ABC-235 cut 1: the three filters below (`legalMoves`, `hasLegalMove`, `legalCaptures`) scan
 * ONCE per call, before their loop, instead of once per move after `makeMove`. With one king per
 * side, no move of the mover's changes where its king stands except its own king move (castling
 * included, whose `to` is the king's square): en passant removes an ENEMY pawn and a promotion
 * replaces a pawn. So for each move the king stands on `move.to` when `move.piece` is the mover's
 * king, else on the hoisted square — the square the per-move scan found — and the attack test
 * reads the same board. The make/test/unmake strategy is unchanged (ADR-0003 clause 1, OD-206-1);
 * only where the scan runs moved. Nothing is cached on `Position` (ADR-0020). `isInCheck`,
 * `givesCheck` and `hasLegalEnPassant` keep their own scan.
 */
function kingSquareOf(position: Position, black: boolean): number {
  return position.board.indexOf(KING | (black ? BLACK : 0));
}

/** True when the side to move is in check — its king stands on a square the enemy attacks. */
export function isInCheck(position: Position): boolean {
  const black = position.blackToMove;
  return isSquareAttackedBy(position, kingSquareOf(position, black), !black);
}

// ---------------------------------------------------------------------------
// The FULL filters: make/test/unmake on every pseudo-legal move. Since ABC-254 (ADR-0003 (1-A))
// they are no longer what the engine calls; they stay in `src/` as the fallback's proven form and
// as the oracle the lazy filters below are read against (ADR-0003 (1-A): deleting them needs a
// new ADR). Each `fullX` returns exactly what `X` returns.
// ---------------------------------------------------------------------------

/**
 * The pseudo-legal moves for the side to move, filtered so none leaves the mover's own king
 * in check. Plays each move on the position in place and takes it back, so the position is
 * unchanged on return. The oracle for `legalMoves` (ABC-254).
 */
export function fullLegalMoves(position: Position): Move[] {
  const moverIsBlack = position.blackToMove;
  const king = KING | (moverIsBlack ? BLACK : 0);
  const kingHome = kingSquareOf(position, moverIsBlack);
  const legal: Move[] = [];

  for (const move of generateMoves(position)) {
    const undo = makeMove(position, move);
    // makeMove flipped the side; the mover's king must not be attacked by the now-mover.
    const kingSquare = move.piece === king ? move.to : kingHome;
    if (!isSquareAttackedBy(position, kingSquare, !moverIsBlack)) legal.push(move);
    unmakeMove(position, move, undo);
  }

  return legal;
}

/**
 * True when the side to move has at least one legal move: `legalMoves(position).length > 0`,
 * by the same make/test/unmake filter, but it stops at the first legal move instead of building
 * the list. A search leaf only needs to know whether the list is empty (ABC-206). The position is
 * unchanged on return.
 */
export function fullHasLegalMove(position: Position): boolean {
  const moverIsBlack = position.blackToMove;
  const king = KING | (moverIsBlack ? BLACK : 0);
  const kingHome = kingSquareOf(position, moverIsBlack);

  for (const move of generateMoves(position)) {
    const undo = makeMove(position, move);
    const kingSquare = move.piece === king ? move.to : kingHome;
    const legal = !isSquareAttackedBy(position, kingSquare, !moverIsBlack);
    unmakeMove(position, move, undo);
    if (legal) return true;
  }

  return false;
}

/**
 * The legal captures for the side to move: the same list, in the same order, as
 * `legalMoves(position).filter((move) => move.captured !== EMPTY)`. Only captures pay the
 * make/test/unmake check, and since ABC-235 cut 3 only captures are generated:
 * `generateCaptures` is `generateMoves(position).filter(capture)` in the same order. Two
 * order-preserving filters commute, so the order is generation order, which quiescence's stable
 * sort depends on (ABC-206). The position is unchanged on return.
 */
export function fullLegalCaptures(position: Position): Move[] {
  const moverIsBlack = position.blackToMove;
  const king = KING | (moverIsBlack ? BLACK : 0);
  const kingHome = kingSquareOf(position, moverIsBlack);
  const captures: Move[] = [];

  for (const move of generateCaptures(position)) {
    const undo = makeMove(position, move);
    const kingSquare = move.piece === king ? move.to : kingHome;
    if (!isSquareAttackedBy(position, kingSquare, !moverIsBlack)) captures.push(move);
    unmakeMove(position, move, undo);
  }

  return captures;
}

/** The 0x88 square of the a-file pawn one push from queening: rank 7 for white, rank 2 for black. */
const WHITE_PROMOTING_RANK_START = 0x60;
const BLACK_PROMOTING_RANK_START = 0x10;

/**
 * Quiescence's move list out of check (`ABC-229`, `ADR-0053` decision 5): `legalCaptures`' list,
 * in its order, with the legal QUIET promotions TO A QUEEN appended after it, by `from` square
 * ascending — the order `generateMoves` would give them. The same list as
 * `legalMoves(position).filter((m) => m.captured !== EMPTY || m.promotion === QUEEN)` with the
 * quiet queen promotions moved to the end. Quiet under-promotions stay out.
 *
 * ONE generation pass: the captures come from the single `generateCaptures` call, and the quiet
 * queen promotions from a scan of the eight squares one push from queening, in the same call. No
 * second `generateMoves` or `legalMoves` pass (the probe's second pass cost 1.7x CPU at 1.01x
 * nodes). Only the captures and the quiet queen promotions pay the make/test/unmake check. The
 * position is unchanged on return.
 */
export function fullLegalCapturesAndQueenPromotions(position: Position): Move[] {
  const moverIsBlack = position.blackToMove;
  const king = KING | (moverIsBlack ? BLACK : 0);
  const kingHome = kingSquareOf(position, moverIsBlack);
  const moves: Move[] = [];

  for (const move of generateCaptures(position)) {
    const undo = makeMove(position, move);
    const kingSquare = move.piece === king ? move.to : kingHome;
    if (!isSquareAttackedBy(position, kingSquare, !moverIsBlack)) moves.push(move);
    unmakeMove(position, move, undo);
  }

  const pawn = PAWN | (moverIsBlack ? BLACK : 0);
  const forward = moverIsBlack ? -16 : 16;
  const start = moverIsBlack ? BLACK_PROMOTING_RANK_START : WHITE_PROMOTING_RANK_START;
  const board = position.board;
  for (let from = start; from < start + 8; from++) {
    const to = from + forward;
    if (board[from] !== pawn || board[to] !== EMPTY) continue;
    const move: Move = {
      from,
      to,
      piece: pawn,
      captured: EMPTY,
      flags: FLAG_PROMOTION,
      promotion: QUEEN,
    };
    const undo = makeMove(position, move);
    // A pawn move never moves the king, so the mover's king stands on its hoisted square.
    if (!isSquareAttackedBy(position, kingHome, !moverIsBlack)) moves.push(move);
    unmakeMove(position, move, undo);
  }

  return moves;
}

// ---------------------------------------------------------------------------
// ABC-254: lazy legality, ADR-0003 (1-A) with (c3) folded in. Each filter works out, once per
// call and before its loop, the mover's king square, whether the mover is in check, and (out of
// check) the set of the mover's pinned pieces. It then tests exactly four classes of move:
//
//   1. every king move, castling included;      3. every move by a pinned piece;
//   2. every en-passant capture;                4. every move while the mover is in check.
//
// Every other pseudo-legal move is accepted untested. Why that is complete (ADR-0003 (1-A)): out
// of check, a non-king move can expose its own king only by opening a line to it; one piece
// leaving opens a line only if it stood alone between the king and an enemy slider of that line's
// kind (it was pinned), and only en passant removes two pieces at once. Putting a piece on a
// square never attacks its own king. The pin detector below may mark too much, never too little.
//
// The filter walks the SAME generated list in the SAME order and only skips the test, so the list
// is the full filter's list, in its order. It compacts the generator's own fresh array in place
// (the generator allocates a new one per call), so the caller still gets a fresh array.
//
// The test itself (`staysSafe`): an unflagged move moves one piece from `from` to `to`, exactly the
// two board bytes `makeMove` writes for it, and the attack test reads only the board, so it sets
// those two bytes, tests and puts them back (menu item (c3)). A castle, an en-passant capture or a
// promotion places or removes more than that, so it takes the full `makeMove` / `unmakeMove`.
//
// State: nothing is cached on `Position` (ADR-0020). The pin set is one fixed-size module scratch
// (`G7`, growth 0): a 128-entry epoch stamp, so no clearing per call. It is safe because no filter
// calls another filter (or anything that marks pins) inside its loop; if one ever does, the
// scratch must move into the call.
// ---------------------------------------------------------------------------

/** The eight rays out of the king: four orthogonal (rook lines), then four diagonal (bishop lines). */
const PIN_RAYS = [16, 1, -1, -16, 17, 15, -15, -17] as const;

/** `pinStamp[square] === epoch` marks a pinned piece for the call that drew `epoch`. */
const pinStamp = new Uint32Array(128);
let pinEpoch = 0;

/**
 * Marks every own piece that stands alone between the mover's king and an enemy slider that
 * moves along that ray (rook or queen on a rank or file, bishop or queen on a diagonal), and
 * returns the epoch the marks carry. Reads the board only.
 */
function markPins(board: Uint8Array, kingSquare: number, moverIsBlack: boolean): number {
  let epoch = (pinEpoch + 1) >>> 0;
  if (epoch === 0) {
    pinStamp.fill(0);
    epoch = 1;
  }
  pinEpoch = epoch;
  const own = moverIsBlack ? BLACK : 0;

  for (let ray = 0; ray < 8; ray++) {
    const offset = PIN_RAYS[ray] as number;
    const slider = ray < 4 ? ROOK : BISHOP;
    let shield = -1;
    for (let square = kingSquare + offset; (square & 0x88) === 0; square += offset) {
      const piece = board[square] as number;
      if (piece === EMPTY) continue;
      if ((piece & BLACK) === own) {
        if (shield !== -1) break; // two own pieces: neither is pinned on this ray
        shield = square;
        continue;
      }
      // The first enemy piece ends the ray: it pins the shield if it slides along this line.
      if (shield !== -1) {
        const type = piece & 7;
        if (type === slider || type === QUEEN) pinStamp[shield] = epoch;
      }
      break;
    }
  }

  return epoch;
}

/**
 * Does the mover's king, standing on `kingSquare` after `move`, stay unattacked? Plays the move
 * on the board (two bytes for an unflagged move, the full `makeMove` otherwise), tests and takes it
 * back, so the position is byte-identical on return.
 */
function staysSafe(
  position: Position,
  move: Move,
  kingSquare: number,
  moverIsBlack: boolean,
): boolean {
  if (move.flags === FLAG_NONE) {
    const board = position.board;
    const captured = board[move.to] as number;
    board[move.to] = move.piece;
    board[move.from] = EMPTY;
    const safe = !isSquareAttackedBy(position, kingSquare, !moverIsBlack);
    board[move.from] = move.piece;
    board[move.to] = captured;
    return safe;
  }
  const undo = makeMove(position, move);
  const safe = !isSquareAttackedBy(position, kingSquare, !moverIsBlack);
  unmakeMove(position, move, undo);
  return safe;
}

/**
 * The lazy filter over a freshly generated list: keeps, in order, the moves the full filter
 * keeps, compacting `moves` in place and returning it.
 */
function filterLazily(position: Position, moves: Move[]): Move[] {
  const moverIsBlack = position.blackToMove;
  const king = KING | (moverIsBlack ? BLACK : 0);
  const kingHome = kingSquareOf(position, moverIsBlack);
  const count = moves.length;
  let kept = 0;

  if (isSquareAttackedBy(position, kingHome, !moverIsBlack)) {
    // Class 4: in check, every move takes the test (double check included). No pin set.
    for (let i = 0; i < count; i++) {
      const move = moves[i] as Move;
      if (staysSafe(position, move, move.piece === king ? move.to : kingHome, moverIsBlack)) {
        moves[kept++] = move;
      }
    }
  } else {
    const epoch = markPins(position.board, kingHome, moverIsBlack);
    for (let i = 0; i < count; i++) {
      const move = moves[i] as Move;
      if (move.piece === king) {
        if (!staysSafe(position, move, move.to, moverIsBlack)) continue; // class 1
      } else if (move.flags === FLAG_EN_PASSANT || pinStamp[move.from] === epoch) {
        if (!staysSafe(position, move, kingHome, moverIsBlack)) continue; // classes 2 and 3
      }
      moves[kept++] = move;
    }
  }

  moves.length = kept;
  return moves;
}

/**
 * The pseudo-legal moves for the side to move, filtered so none leaves the mover's own king
 * in check: the same list, in the same order, as `fullLegalMoves`, by lazy legality (ABC-254).
 * The position is unchanged on return.
 */
export function legalMoves(position: Position): Move[] {
  return filterLazily(position, generateMoves(position));
}

/**
 * True when the side to move has at least one legal move: `legalMoves(position).length > 0`
 * (and `fullHasLegalMove`), stopping at the first legal move (ABC-206). Out of check, the first
 * move outside the tested classes answers at once (ABC-254). The position is unchanged on return.
 */
export function hasLegalMove(position: Position): boolean {
  const moverIsBlack = position.blackToMove;
  const king = KING | (moverIsBlack ? BLACK : 0);
  const kingHome = kingSquareOf(position, moverIsBlack);
  const moves = generateMoves(position);

  if (isSquareAttackedBy(position, kingHome, !moverIsBlack)) {
    for (const move of moves) {
      if (staysSafe(position, move, move.piece === king ? move.to : kingHome, moverIsBlack)) {
        return true;
      }
    }
    return false;
  }

  const epoch = markPins(position.board, kingHome, moverIsBlack);
  for (const move of moves) {
    if (move.piece === king) {
      if (staysSafe(position, move, move.to, moverIsBlack)) return true;
    } else if (move.flags === FLAG_EN_PASSANT || pinStamp[move.from] === epoch) {
      if (staysSafe(position, move, kingHome, moverIsBlack)) return true;
    } else {
      return true;
    }
  }
  return false;
}

/**
 * The legal captures for the side to move: the same list, in the same order, as
 * `fullLegalCaptures` (= `legalMoves(position).filter((move) => move.captured !== EMPTY)`), by lazy
 * legality over `generateCaptures` (ABC-206, ABC-235 cut 3, ABC-254). The position is unchanged on
 * return.
 */
export function legalCaptures(position: Position): Move[] {
  return filterLazily(position, generateCaptures(position));
}

/**
 * Quiescence's move list (`ABC-229`): the same list, in the same order, as
 * `fullLegalCapturesAndQueenPromotions` — `legalCaptures`' list with the legal quiet promotions to
 * a queen appended by `from` square ascending. One generation pass, as there. A quiet promotion is
 * a pawn move, never en passant, so out of check it takes the test only when the pawn is pinned
 * (ABC-254). The position is unchanged on return.
 */
export function legalCapturesAndQueenPromotions(position: Position): Move[] {
  const moves = filterLazily(position, generateCaptures(position));

  const moverIsBlack = position.blackToMove;
  const pawn = PAWN | (moverIsBlack ? BLACK : 0);
  const forward = moverIsBlack ? -16 : 16;
  const start = moverIsBlack ? BLACK_PROMOTING_RANK_START : WHITE_PROMOTING_RANK_START;
  const board = position.board;
  let kingHome = -1;
  let inCheck = false;
  let epoch = 0;

  for (let from = start; from < start + 8; from++) {
    const to = from + forward;
    if (board[from] !== pawn || board[to] !== EMPTY) continue;
    if (kingHome === -1) {
      // Worked out once, and only on a board with a quiet promotion to test. The pin set is
      // re-marked here: `filterLazily` above may have drawn its own epoch, and the board is the
      // same, so the marks are the same set.
      kingHome = kingSquareOf(position, moverIsBlack);
      inCheck = isSquareAttackedBy(position, kingHome, !moverIsBlack);
      if (!inCheck) epoch = markPins(board, kingHome, moverIsBlack);
    }
    const move: Move = {
      from,
      to,
      piece: pawn,
      captured: EMPTY,
      flags: FLAG_PROMOTION,
      promotion: QUEEN,
    };
    // A pawn move never moves the king, so the mover's king stands on its hoisted square.
    if (
      (inCheck || pinStamp[from] === epoch) &&
      !staysSafe(position, move, kingHome, moverIsBlack)
    ) {
      continue;
    }
    moves.push(move);
  }

  return moves;
}

// ---------------------------------------------------------------------------
// ABC-250 (ADR-0055 O1-b part 1): the same lazy filter (ADR-0003 (1-A), the same four classes, the
// same pin set and the same two-byte test) over a PACKED list (`src/moves.ts`). It compacts the
// generator's window `out[start, end)` in place and returns the new end, so the kept moves are the
// object filter's moves in the object filter's order. Perft reads these; the search keeps the
// object filters above until `ABC-251`. The make/test/unmake fallback's undo slot is one fixed
// module scratch (`G7`, growth 0), safe because the test never nests.
// ---------------------------------------------------------------------------

const packedTestUndo = createUndoStack(1);

/** `staysSafe` for a packed move: the two-byte test when unflagged, else the packed make/unmake. */
function staysSafePacked(
  position: Position,
  move: number,
  kingSquare: number,
  moverIsBlack: boolean,
): boolean {
  if (packedFlags(move) === FLAG_NONE) {
    const board = position.board;
    const from = packedFrom(move);
    const to = packedTo(move);
    const piece = packedPiece(move);
    const captured = board[to] as number;
    board[to] = piece;
    board[from] = EMPTY;
    const safe = !isSquareAttackedBy(position, kingSquare, !moverIsBlack);
    board[from] = piece;
    board[to] = captured;
    return safe;
  }
  makeMovePacked(position, move, packedTestUndo, 0);
  const safe = !isSquareAttackedBy(position, kingSquare, !moverIsBlack);
  unmakeMovePacked(position, move, packedTestUndo, 0);
  return safe;
}

/** `filterLazily` over `out[start, end)`: keeps, in order, what the full filter keeps; returns the new end. */
function filterLazilyPacked(
  position: Position,
  out: Int32Array,
  start: number,
  end: number,
): number {
  const moverIsBlack = position.blackToMove;
  const king = KING | (moverIsBlack ? BLACK : 0);
  const kingHome = kingSquareOf(position, moverIsBlack);
  let kept = start;

  if (isSquareAttackedBy(position, kingHome, !moverIsBlack)) {
    // Class 4: in check, every move takes the test (double check included). No pin set.
    for (let i = start; i < end; i++) {
      const move = out[i] as number;
      const kingSquare = packedPiece(move) === king ? packedTo(move) : kingHome;
      if (staysSafePacked(position, move, kingSquare, moverIsBlack)) out[kept++] = move;
    }
    return kept;
  }

  const epoch = markPins(position.board, kingHome, moverIsBlack);
  for (let i = start; i < end; i++) {
    const move = out[i] as number;
    if (packedPiece(move) === king) {
      if (!staysSafePacked(position, move, packedTo(move), moverIsBlack)) continue; // class 1
    } else if (packedFlags(move) === FLAG_EN_PASSANT || pinStamp[packedFrom(move)] === epoch) {
      if (!staysSafePacked(position, move, kingHome, moverIsBlack)) continue; // classes 2 and 3
    }
    out[kept++] = move;
  }
  return kept;
}

/**
 * `legalMoves`, packed: the legal moves for the side to move, written into `out` from `start` in
 * `legalMoves`' order. Returns the index one past the last. The position is unchanged on return.
 */
export function legalMovesPacked(position: Position, out: Int32Array, start: number): number {
  return filterLazilyPacked(position, out, start, generateMovesPacked(position, out, start));
}

/**
 * `legalCaptures`, packed: the legal captures, written into `out` from `start` in `legalCaptures`'
 * order. Returns the index one past the last. The position is unchanged on return.
 */
export function legalCapturesPacked(position: Position, out: Int32Array, start: number): number {
  return filterLazilyPacked(position, out, start, generateCapturesPacked(position, out, start));
}

/**
 * Does `move`, a legal move for the side to move, give check? The same answer as playing it,
 * asking `isInCheck`, and taking it back (ABC-206). An unflagged move only moves one piece from
 * `from` to `to`, and the attack test reads only the board, so for it the two board bytes are
 * set, the enemy king's square is tested, and both bytes are put back. A castle, en-passant
 * capture or promotion changes more than two squares, so it is played and taken back. The
 * position is unchanged on return.
 */
export function givesCheck(position: Position, move: Move): boolean {
  if (move.flags !== FLAG_NONE) {
    const undo = makeMove(position, move);
    const check = isInCheck(position);
    unmakeMove(position, move, undo);
    return check;
  }

  const moverIsBlack = position.blackToMove;
  const board = position.board;
  const captured = board[move.to] as number;
  board[move.to] = move.piece;
  board[move.from] = EMPTY;
  const check = isSquareAttackedBy(position, kingSquareOf(position, !moverIsBlack), moverIsBlack);
  board[move.from] = move.piece;
  board[move.to] = captured;
  return check;
}

/** The two neighbouring files a pawn can capture from — the same pair moves.ts steps over. */
const EP_CAPTURE_SIDES = [-1, 1] as const;

/**
 * Is an en-passant capture LEGAL for the side to move? True exactly when
 * `legalMoves(position).some(m => m.flags === FLAG_EN_PASSANT)` is true ON POSITIONS WHOSE
 * EN-PASSANT SQUARE THE BOARD DOES NOT CONTRADICT — that expression is the DEFINITION and the
 * test oracle there, and it is deliberately NOT the implementation: running the whole generator
 * here costs ~14x a bare key on the positions that reach it, and it is called from `zobristKey`
 * on every node ABC-011 makes it reach (ADR-0005).
 *
 * That domain contains every position `makeMove` can produce, hence everything reachable by
 * play. Outside it the answer is SPECIFIED rather than derived: `false`, which is the truthful
 * answer about a board on which the named capture cannot be performed (the pawn to take is
 * absent, or the destination is occupied). The reason is the cost above rather than anything
 * the generator gets wrong: this predicate never consults `generateMoves`, so it has to
 * establish its own preconditions (below) and specifying the answer is what keeps the key
 * INDEPENDENT of the generator. ABC-022 made the en-passant branch enforce those same
 * preconditions, so off-domain the oracle now answers `false` here too — but that agreement is
 * BOUGHT by guard (a), not inherited: delete (a) and this predicate answers `true` on boards
 * where the generator offers nothing.
 *
 * ABC-011: FIDE 9.2.3 makes two positions the same only when "the possible moves of all the
 * pieces of both players are the same", so a pawn takeable only by a move that exposes its
 * captor's king "could not have been captured" and the en-passant right is not real. That is
 * why this is legality and not the cheaper board-only question.
 *
 * Like `legalMoves` it plays a move and takes it back, so the position is byte-identical on
 * return — for EVERY input, not merely for reachable ones, and BY CONSTRUCTION rather than by
 * luck of the input distribution: the two guards below establish the precondition `unmakeMove`
 * assumes and does not state, so the probe is never played on a board it does not fit. Asserted
 * across the call rather than assumed (`src/legal.test.ts`).
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
  const captured = PAWN | (black ? 0 : BLACK);

  // The probe move is synthesised here rather than taken from the generator, so its
  // precondition has to be established here too — nothing else in the call chain does it.
  // Both conditions are loop-invariant, so they sit above the loop rather than inside it.
  //
  // (a) buys the ANSWER: with the target occupied, `generateMoves` offers no ep move, so the
  //     oracle says no and so must this. WHY it offers none is a precondition of the en-passant
  //     branch itself (ABC-022), not a reading of the square as an ordinary capture: an ENEMY
  //     occupant is consumed by the capture branch, but an occupant of the mover's OWN colour
  //     never was and still never is — that branch requires `isBlack(target) !== black` — so it
  //     used to fall through and be offered anyway, which was precisely the defect.
  //     Purity does NOT need it — make/unmake round-trips exactly when the captured pawn is
  //     genuinely there — which is why it cannot be folded into (b).
  // (b) buys PURITY: `undoSpecial` writes `move.captured` back onto `rank` unconditionally, so
  //     if the board never held that pawn the "restore" creates one and the damage is
  //     permanent. (a) does NOT catch that — an ep square on the wrong rank leaves the target
  //     empty — which is why it cannot be folded into (a).
  if (position.board[target] !== EMPTY) return false;
  if (position.board[rank] !== captured) return false;

  for (const side of EP_CAPTURE_SIDES) {
    const from = rank + side;
    if (!isOnBoard(from) || position.board[from] !== pawn) continue;

    const move: Move = {
      from,
      to: target,
      piece: pawn,
      captured,
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
