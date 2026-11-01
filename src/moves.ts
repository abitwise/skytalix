/**
 * Pseudo-legal move generation.
 *
 * "Pseudo-legal" is deliberate: these moves obey each piece's movement rules but
 * may still leave the mover's own king in check. Filtering those out is ABC-005,
 * kept separate so each half can be tested on its own. The ONE exception is
 * castling: its own through-check rule (the king may not start, pass through, or
 * land on an attacked square) is a castling rule, not a general legality rule, so
 * ABC-004 applies it here via `isSquareAttackedBy` — the same attack primitive
 * ABC-005 then consumes for full legality filtering.
 *
 * Every offset below is a precomputed table rather than per-call arithmetic — this
 * is the innermost loop of the search (NFR-001), and 0x88 makes the edge test that
 * the tables rely on a single mask (ADR-0001).
 */

import {
  BISHOP,
  BLACK,
  CASTLE_BK,
  CASTLE_BQ,
  CASTLE_WK,
  CASTLE_WQ,
  EMPTY,
  isBlack,
  isOnBoard,
  KING,
  KNIGHT,
  PAWN,
  type Position,
  pieceType,
  QUEEN,
  ROOK,
  rankOf,
} from "./position.ts";

/** No special-move flag set — an ordinary quiet move or capture. */
export const FLAG_NONE = 0;
/** The move is a pawn capturing en passant; `to` is the empty target, `captured` the enemy pawn beside it. */
export const FLAG_EN_PASSANT = 1;
/** The move is a castle; the rook's leg is derived from the king's destination `to`. */
export const FLAG_CASTLE = 2;
/** The move is a pawn promotion; `promotion` names the piece type the pawn becomes. */
export const FLAG_PROMOTION = 4;

export interface Move {
  readonly from: number;
  readonly to: number;
  /** The piece that moves, colour flag included. */
  readonly piece: number;
  /** The piece standing on `to`, or EMPTY on a quiet move. For en passant, the captured pawn (not on `to`). */
  readonly captured: number;
  readonly flags: number;
  /** For a FLAG_PROMOTION move, the piece TYPE the pawn becomes (QUEEN…KNIGHT); EMPTY otherwise. */
  readonly promotion: number;
}

const DIAGONALS = [17, 15, -15, -17] as const;
const ORTHOGONALS = [16, 1, -1, -16] as const;
const ALL_DIRECTIONS = [...ORTHOGONALS, ...DIAGONALS] as const;
const KNIGHT_LEAPS = [33, 31, 18, 14, -14, -18, -31, -33] as const;
const PAWN_CAPTURE_SIDES = [-1, 1] as const;

/** The four pieces a pawn may promote to. Q first so a bare "take the first promotion" defaults sanely. */
const PROMOTION_PIECES = [QUEEN, ROOK, BISHOP, KNIGHT] as const;

/** Directions a sliding piece rides until it hits something or leaves the board. */
const RAYS: Readonly<Record<number, readonly number[]>> = {
  [BISHOP]: DIAGONALS,
  [ROOK]: ORTHOGONALS,
  [QUEEN]: ALL_DIRECTIONS,
};

/** Single-square offsets for the pieces that step rather than slide. */
const STEPS: Readonly<Record<number, readonly number[]>> = {
  [KNIGHT]: KNIGHT_LEAPS,
  [KING]: ALL_DIRECTIONS,
};

const WHITE_PAWN_RANK = 1;
const BLACK_PAWN_RANK = 6;

function addMove(moves: Move[], from: number, to: number, piece: number, captured: number): void {
  moves.push({ from, to, piece, captured, flags: FLAG_NONE, promotion: EMPTY });
}

/** A pawn reaching the last rank: one move per promotion piece, quiet or capture alike. */
function addPromotions(
  moves: Move[],
  from: number,
  to: number,
  piece: number,
  captured: number,
): void {
  for (const promotion of PROMOTION_PIECES) {
    moves.push({ from, to, piece, captured, flags: FLAG_PROMOTION, promotion });
  }
}

function addStepMoves(
  moves: Move[],
  position: Position,
  from: number,
  piece: number,
  black: boolean,
  offsets: readonly number[],
): void {
  for (const offset of offsets) {
    const to = from + offset;
    if (!isOnBoard(to)) continue;

    const target = position.board[to] as number;
    if (target !== EMPTY && isBlack(target) === black) continue;

    addMove(moves, from, to, piece, target);
  }
}

function addRayMoves(
  moves: Move[],
  position: Position,
  from: number,
  piece: number,
  black: boolean,
  offsets: readonly number[],
): void {
  for (const offset of offsets) {
    for (let to = from + offset; isOnBoard(to); to += offset) {
      const target = position.board[to] as number;

      if (target === EMPTY) {
        addMove(moves, from, to, piece, EMPTY);
        continue;
      }
      // The ray stops on the first piece either way; it captures only an enemy.
      if (isBlack(target) !== black) addMove(moves, from, to, piece, target);
      break;
    }
  }
}

const WHITE_PROMOTION_RANK = 7;
const BLACK_PROMOTION_RANK = 0;

function addPawnMoves(
  moves: Move[],
  position: Position,
  from: number,
  piece: number,
  black: boolean,
): void {
  const forward = black ? -16 : 16;
  const push = from + forward;
  const promotionRank = black ? BLACK_PROMOTION_RANK : WHITE_PROMOTION_RANK;

  if (isOnBoard(push) && position.board[push] === EMPTY) {
    if (rankOf(push) === promotionRank) {
      addPromotions(moves, from, push, piece, EMPTY);
    } else {
      addMove(moves, from, push, piece, EMPTY);

      // A double push is reachable only from the starting rank, which puts its
      // destination on the board unconditionally — no second edge test needed.
      const doublePush = push + forward;
      const startRank = black ? BLACK_PAWN_RANK : WHITE_PAWN_RANK;
      if (rankOf(from) === startRank && position.board[doublePush] === EMPTY) {
        addMove(moves, from, doublePush, piece, EMPTY);
      }
    }
  }

  for (const side of PAWN_CAPTURE_SIDES) {
    const to = push + side;
    if (!isOnBoard(to)) continue;

    const target = position.board[to] as number;
    if (target !== EMPTY && isBlack(target) !== black) {
      if (rankOf(to) === promotionRank) addPromotions(moves, from, to, piece, target);
      else addMove(moves, from, to, piece, target);
      continue;
    }

    // En passant: `to` is this move's `epSquare`, the target square is EMPTY, and the
    // captured pawn really does sit beside the mover on `to`'s file, one rank back. All
    // three are CHECKED below (ABC-022); the last two used to be stated by this comment
    // and enforced by nothing. An occupant of the mover's OWN colour survives the capture
    // test above — that test requires `isBlack(target) !== black` — so the generator
    // offered a capture onto the mover's own piece; and an absent captured pawn was still
    // written into `move.captured`, which `undoSpecial` restores unconditionally, creating
    // a pawn the board never held. Reaching an ep target is only geometrically possible
    // from the correct rank, so the file/rank guard is implicit in `to === epSquare`.
    //
    // Both preconditions sit AFTER the `epSquare` test rather than before it: over the
    // standing 518,474-node perft walk that is 331 evaluations instead of 216,269, for an
    // identical answer (NFR-001).
    if (to === position.epSquare) {
      const capturedPawn = PAWN | (black ? 0 : BLACK);
      if (target === EMPTY && position.board[to - forward] === capturedPawn) {
        moves.push({
          from,
          to,
          piece,
          captured: capturedPawn,
          flags: FLAG_EN_PASSANT,
          promotion: EMPTY,
        });
      }
    }
  }
}

/**
 * Rides `offset` from `square` until the first piece; true if that piece is an enemy
 * slider of the ray's kind (or a queen, which rides every ray). An empty ray or a
 * blocker of the wrong kind is not an attack.
 */
function raySliderAttacks(
  position: Position,
  square: number,
  offset: number,
  sliderType: number,
  byBlack: boolean,
): boolean {
  for (let to = square + offset; isOnBoard(to); to += offset) {
    const piece = position.board[to] as number;
    if (piece === EMPTY) continue;
    if (isBlack(piece) === byBlack) {
      const type = pieceType(piece);
      return type === sliderType || type === QUEEN;
    }
    return false; // first blocker is friendly (to the attacker) or the wrong slider — the ray is spent
  }
  return false;
}

/**
 * Is `square` attacked by any piece of the colour named by `byBlack`? The primitive the
 * castling through-check rule stands on here, and the one ABC-005 consumes for full
 * legality filtering and check detection. `square` need not be occupied — attack is a
 * property of the board geometry, not of what stands on the target.
 */
export function isSquareAttackedBy(position: Position, square: number, byBlack: boolean): boolean {
  const board = position.board;
  const enemyPawn = PAWN | (byBlack ? BLACK : 0);

  // A pawn attacks the two squares diagonally ahead of it, so an attacker sits one rank
  // "behind" the target relative to its own advance direction.
  const pawnRank = byBlack ? square + 16 : square - 16;
  for (const side of PAWN_CAPTURE_SIDES) {
    const from = pawnRank + side;
    if (isOnBoard(from) && board[from] === enemyPawn) return true;
  }

  const enemyKnight = KNIGHT | (byBlack ? BLACK : 0);
  for (const offset of KNIGHT_LEAPS) {
    const from = square + offset;
    if (isOnBoard(from) && board[from] === enemyKnight) return true;
  }

  const enemyKing = KING | (byBlack ? BLACK : 0);
  for (const offset of ALL_DIRECTIONS) {
    const from = square + offset;
    if (isOnBoard(from) && board[from] === enemyKing) return true;
  }

  for (const offset of DIAGONALS) {
    if (raySliderAttacks(position, square, offset, BISHOP, byBlack)) return true;
  }
  for (const offset of ORTHOGONALS) {
    if (raySliderAttacks(position, square, offset, ROOK, byBlack)) return true;
  }

  return false;
}

/**
 * A castling option: the right that must be held, the king's two-square hop, the rook's
 * home square, the squares between king and rook that must be EMPTY, and the squares the
 * king stands on or crosses that must not be attacked (its origin included — a king in
 * check may not castle). The rook's own leg is derived from the king's destination in
 * apply.ts; `rookFrom` here is the square the rook must STAND on for the castle to exist
 * at all (ABC-009), which is a precondition rather than part of the move.
 */
interface CastleOption {
  readonly right: number;
  readonly kingFrom: number;
  readonly kingTo: number;
  readonly rookFrom: number;
  readonly empty: readonly number[];
  readonly kingPath: readonly number[];
}

// Squares in 0x88: e1=4 f1=5 g1=6 d1=3 c1=2 b1=1 a1=0 h1=7; e8=116 f8=117 g8=118 d8=115 c8=114 b8=113 a8=112 h8=119.
const WHITE_CASTLES: readonly CastleOption[] = [
  { right: CASTLE_WK, kingFrom: 4, kingTo: 6, rookFrom: 7, empty: [5, 6], kingPath: [4, 5, 6] },
  { right: CASTLE_WQ, kingFrom: 4, kingTo: 2, rookFrom: 0, empty: [1, 2, 3], kingPath: [4, 3, 2] },
];
const BLACK_CASTLES: readonly CastleOption[] = [
  {
    right: CASTLE_BK,
    kingFrom: 116,
    kingTo: 118,
    rookFrom: 119,
    empty: [117, 118],
    kingPath: [116, 117, 118],
  },
  {
    right: CASTLE_BQ,
    kingFrom: 116,
    kingTo: 114,
    rookFrom: 112,
    empty: [113, 114, 115],
    kingPath: [116, 115, 114],
  },
];

/**
 * Adds the legal castling moves for the side to move. Unlike the rest of generation these
 * are filtered for the through-check rule (ABC-004 scope), so a castle never appears when
 * the king would start, cross, or land in check.
 *
 * The right being set is not enough on its own: a FEN can assert a right the board
 * contradicts, and offering the castle then produces a move the rules forbid whose
 * make/unmake pair writes a king onto a square that never held one (ABC-009). So the two
 * home squares are read too, and each is an IDENTITY test — the mover's own KING and ROOK
 * bytes, not merely an occupied square, since an occupancy test admits an impostor of
 * either colour. They sit above the two costlier tests because a byte compare is cheaper
 * than an emptiness scan and far cheaper than an attack scan (NFR-001).
 */
function addCastlingMoves(moves: Move[], position: Position, black: boolean): void {
  const options = black ? BLACK_CASTLES : WHITE_CASTLES;
  const attackerIsBlack = !black;
  const king = KING | (black ? BLACK : 0);
  const rook = ROOK | (black ? BLACK : 0);

  for (const option of options) {
    if ((position.castling & option.right) === 0) continue;
    if (position.board[option.kingFrom] !== king) continue;
    if (position.board[option.rookFrom] !== rook) continue;
    if (option.empty.some((square) => position.board[square] !== EMPTY)) continue;
    if (option.kingPath.some((square) => isSquareAttackedBy(position, square, attackerIsBlack))) {
      continue;
    }
    moves.push({
      from: option.kingFrom,
      to: option.kingTo,
      piece: king,
      captured: EMPTY,
      flags: FLAG_CASTLE,
      promotion: EMPTY,
    });
  }
}

/** Every pseudo-legal move for the side to move, in no guaranteed order. */
export function generateMoves(position: Position): Move[] {
  const moves: Move[] = [];
  const black = position.blackToMove;

  for (let from = 0; from < 128; from++) {
    if (!isOnBoard(from)) continue;

    const piece = position.board[from] as number;
    if (piece === EMPTY || isBlack(piece) !== black) continue;

    const type = pieceType(piece);
    if (type === PAWN) {
      addPawnMoves(moves, position, from, piece, black);
      continue;
    }

    const steps = STEPS[type];
    if (steps !== undefined) {
      addStepMoves(moves, position, from, piece, black, steps);
      continue;
    }

    addRayMoves(moves, position, from, piece, black, RAYS[type] as readonly number[]);
  }

  addCastlingMoves(moves, position, black);

  return moves;
}

/**
 * ABC-235 cut 3: the CAPTURES of `generateMoves`, and nothing else — exactly
 * `generateMoves(position).filter((move) => move.captured !== EMPTY)`, in the SAME ORDER. Quiescence
 * sorts its captures with a stable MVV-LVA sort, so ties keep generation order (ABC-206); a
 * reordered list would find a different refutation first and change node counts. So this walks
 * exactly as `generateMoves` walks, and only skips what that filter would drop:
 *
 * - squares 0..127; a pawn's capture sides -1 then +1, each side a normal capture (a promotion
 *   capture emits Q, R, B, N) or else the en-passant check, with ABC-022's two guards (the target
 *   is empty, the captured pawn is there); step offsets and ray directions in table order, rays
 *   walking their empty squares without emitting them;
 * - no pushes, no quiet promotions, no castling: none of them captures.
 *
 * `generateMoves` is untouched, so perft and NFR-001's perft half are untouched. The two
 * generators share the movement rules; `src/moves.test.ts`'s oracle rows hold them together.
 */
export function generateCaptures(position: Position): Move[] {
  const moves: Move[] = [];
  const black = position.blackToMove;
  const board = position.board;

  for (let from = 0; from < 128; from++) {
    if (!isOnBoard(from)) continue;

    const piece = board[from] as number;
    if (piece === EMPTY || isBlack(piece) !== black) continue;

    const type = pieceType(piece);
    if (type === PAWN) {
      addPawnCaptures(moves, position, from, piece, black);
      continue;
    }

    const steps = STEPS[type];
    if (steps !== undefined) {
      for (const offset of steps) {
        const to = from + offset;
        if (!isOnBoard(to)) continue;
        const target = board[to] as number;
        if (target === EMPTY || isBlack(target) === black) continue;
        addMove(moves, from, to, piece, target);
      }
      continue;
    }

    for (const offset of RAYS[type] as readonly number[]) {
      for (let to = from + offset; isOnBoard(to); to += offset) {
        const target = board[to] as number;
        if (target === EMPTY) continue;
        if (isBlack(target) !== black) addMove(moves, from, to, piece, target);
        break;
      }
    }
  }

  return moves;
}

/** `addPawnMoves`' capture half, verbatim: its pushes and quiet promotions are not captures. */
function addPawnCaptures(
  moves: Move[],
  position: Position,
  from: number,
  piece: number,
  black: boolean,
): void {
  const forward = black ? -16 : 16;
  const push = from + forward;
  const promotionRank = black ? BLACK_PROMOTION_RANK : WHITE_PROMOTION_RANK;

  for (const side of PAWN_CAPTURE_SIDES) {
    const to = push + side;
    if (!isOnBoard(to)) continue;

    const target = position.board[to] as number;
    if (target !== EMPTY && isBlack(target) !== black) {
      if (rankOf(to) === promotionRank) addPromotions(moves, from, to, piece, target);
      else addMove(moves, from, to, piece, target);
      continue;
    }

    // En passant, with the same two guards as `addPawnMoves` (ABC-022): the target square is
    // empty and the captured pawn really stands beside the mover.
    if (to === position.epSquare) {
      const capturedPawn = PAWN | (black ? 0 : BLACK);
      if (target === EMPTY && position.board[to - forward] === capturedPawn) {
        moves.push({
          from,
          to,
          piece,
          captured: capturedPawn,
          flags: FLAG_EN_PASSANT,
          promotion: EMPTY,
        });
      }
    }
  }
}

// ---------------------------------------------------------------------------
// ABC-250 (ADR-0055 O1-b part 1): packed moves. A move is one integer, written into a caller's
// preallocated `Int32Array` instead of a fresh `Move[]`. For this ticket's life the rules core
// holds two move paths, object and packed: the search, quiescence, ordering, the TT and every
// shell module keep the object functions above, unchanged; perft reads the packed path. The
// packed generators below walk EXACTLY as `generateMoves` / `generateCaptures` walk (squares
// 0..127, the same table order, the same pawn and castling order), so the decoded list equals
// the object list in order. `ABC-250` A2's list-equality oracle holds the two paths together
// until `ABC-252` removes the duplicate.
//
// Layout (28 bits): from 0-6 | to 7-13 | piece 14-17 | captured 18-21 | flags 22-24 |
// promotion 25-27. Every field is a small non-negative integer, so the word is a positive int32.
// ---------------------------------------------------------------------------

const TO_SHIFT = 7;
const PIECE_SHIFT = 14;
const CAPTURED_SHIFT = 18;
const FLAGS_SHIFT = 22;
const PROMOTION_SHIFT = 25;

/** Packs the six fields of a move into one integer (the layout above). */
export const encodeMove = (
  from: number,
  to: number,
  piece: number,
  captured: number,
  flags: number,
  promotion: number,
): number =>
  from |
  (to << TO_SHIFT) |
  (piece << PIECE_SHIFT) |
  (captured << CAPTURED_SHIFT) |
  (flags << FLAGS_SHIFT) |
  (promotion << PROMOTION_SHIFT);

export const packedFrom = (move: number): number => move & 0x7f;
export const packedTo = (move: number): number => (move >> TO_SHIFT) & 0x7f;
export const packedPiece = (move: number): number => (move >> PIECE_SHIFT) & 15;
export const packedCaptured = (move: number): number => (move >> CAPTURED_SHIFT) & 15;
export const packedFlags = (move: number): number => (move >> FLAGS_SHIFT) & 7;
export const packedPromotion = (move: number): number => (move >> PROMOTION_SHIFT) & 7;

/** The packed form of a `Move` object. */
export const packMove = (move: Move): number =>
  encodeMove(move.from, move.to, move.piece, move.captured, move.flags, move.promotion);

/** The `Move` object a packed move stands for: the same six fields `generateMoves` would emit. */
export function unpackMove(move: number): Move {
  return {
    from: packedFrom(move),
    to: packedTo(move),
    piece: packedPiece(move),
    captured: packedCaptured(move),
    flags: packedFlags(move),
    promotion: packedPromotion(move),
  };
}

/** Throws when a generator ran past its buffer: a typed array drops such writes silently. */
function assertFits(out: Int32Array, end: number): number {
  if (end > out.length) {
    throw new RangeError(`packed move buffer overflow: ${end} moves into ${out.length} slots`);
  }
  return end;
}

/** A pawn's promotions, Q, R, B, N, as `addPromotions` emits them. `base` carries from/to/piece/captured. */
function writePromotions(out: Int32Array, n: number, base: number): number {
  const promoting = base | (FLAG_PROMOTION << FLAGS_SHIFT);
  out[n] = promoting | (QUEEN << PROMOTION_SHIFT);
  out[n + 1] = promoting | (ROOK << PROMOTION_SHIFT);
  out[n + 2] = promoting | (BISHOP << PROMOTION_SHIFT);
  out[n + 3] = promoting | (KNIGHT << PROMOTION_SHIFT);
  return n + 4;
}

/**
 * `addPawnMoves`' capture half, packed: sides -1 then +1, each a capture (promotion captures
 * emit Q, R, B, N) or else the en-passant check with ABC-022's two guards.
 */
function writePawnCaptures(
  out: Int32Array,
  n: number,
  board: Uint8Array,
  from: number,
  piece: number,
  black: boolean,
  epSquare: number,
): number {
  const forward = black ? -16 : 16;
  const push = from + forward;
  const promotionRank = black ? BLACK_PROMOTION_RANK : WHITE_PROMOTION_RANK;
  const base = from | (piece << PIECE_SHIFT);

  for (let side = -1; side <= 1; side += 2) {
    const to = push + side;
    if ((to & 0x88) !== 0) continue;

    const target = board[to] as number;
    if (target !== EMPTY && (target & BLACK) !== (black ? BLACK : 0)) {
      const move = base | (to << TO_SHIFT) | (target << CAPTURED_SHIFT);
      if (to >> 4 === promotionRank) n = writePromotions(out, n, move);
      else out[n++] = move;
      continue;
    }

    if (to === epSquare) {
      const capturedPawn = PAWN | (black ? 0 : BLACK);
      if (target === EMPTY && board[to - forward] === capturedPawn) {
        out[n++] =
          base |
          (to << TO_SHIFT) |
          (capturedPawn << CAPTURED_SHIFT) |
          (FLAG_EN_PASSANT << FLAGS_SHIFT);
      }
    }
  }
  return n;
}

/** `addPawnMoves`, packed: the push (promotion or single, then double), then the two capture sides. */
function writePawnMoves(
  out: Int32Array,
  n: number,
  board: Uint8Array,
  from: number,
  piece: number,
  black: boolean,
  epSquare: number,
): number {
  const forward = black ? -16 : 16;
  const push = from + forward;
  const base = from | (piece << PIECE_SHIFT);

  if ((push & 0x88) === 0 && board[push] === EMPTY) {
    if (push >> 4 === (black ? BLACK_PROMOTION_RANK : WHITE_PROMOTION_RANK)) {
      n = writePromotions(out, n, base | (push << TO_SHIFT));
    } else {
      out[n++] = base | (push << TO_SHIFT);
      const doublePush = push + forward;
      if (
        from >> 4 === (black ? BLACK_PAWN_RANK : WHITE_PAWN_RANK) &&
        board[doublePush] === EMPTY
      ) {
        out[n++] = base | (doublePush << TO_SHIFT);
      }
    }
  }

  return writePawnCaptures(out, n, board, from, piece, black, epSquare);
}

/** `addCastlingMoves`, packed: the same options in the same order, with the same five tests. */
function writeCastlingMoves(
  out: Int32Array,
  n: number,
  position: Position,
  black: boolean,
): number {
  const options = black ? BLACK_CASTLES : WHITE_CASTLES;
  const board = position.board;
  const king = KING | (black ? BLACK : 0);
  const rook = ROOK | (black ? BLACK : 0);

  for (const option of options) {
    if ((position.castling & option.right) === 0) continue;
    if (board[option.kingFrom] !== king) continue;
    if (board[option.rookFrom] !== rook) continue;
    if (option.empty.some((square) => board[square] !== EMPTY)) continue;
    if (option.kingPath.some((square) => isSquareAttackedBy(position, square, !black))) continue;
    out[n++] = encodeMove(option.kingFrom, option.kingTo, king, EMPTY, FLAG_CASTLE, EMPTY);
  }
  return n;
}

/**
 * Every pseudo-legal move for the side to move, packed into `out` from index `start`, in
 * `generateMoves`' order. Returns the index one past the last move written.
 */
export function generateMovesPacked(position: Position, out: Int32Array, start: number): number {
  const board = position.board;
  const black = position.blackToMove;
  const own = black ? BLACK : 0;
  const epSquare = position.epSquare;
  let n = start;

  for (let from = 0; from < 128; from++) {
    if ((from & 0x88) !== 0) continue;

    const piece = board[from] as number;
    if (piece === EMPTY || (piece & BLACK) !== own) continue;

    const type = piece & 7;
    if (type === PAWN) {
      n = writePawnMoves(out, n, board, from, piece, black, epSquare);
      continue;
    }

    const base = from | (piece << PIECE_SHIFT);
    if (type === KNIGHT || type === KING) {
      const steps = type === KNIGHT ? KNIGHT_LEAPS : ALL_DIRECTIONS;
      for (let i = 0; i < steps.length; i++) {
        const to = from + (steps[i] as number);
        if ((to & 0x88) !== 0) continue;
        const target = board[to] as number;
        if (target !== EMPTY && (target & BLACK) === own) continue;
        out[n++] = base | (to << TO_SHIFT) | (target << CAPTURED_SHIFT);
      }
      continue;
    }

    const rays = type === BISHOP ? DIAGONALS : type === ROOK ? ORTHOGONALS : ALL_DIRECTIONS;
    for (let i = 0; i < rays.length; i++) {
      const offset = rays[i] as number;
      for (let to = from + offset; (to & 0x88) === 0; to += offset) {
        const target = board[to] as number;
        if (target === EMPTY) {
          out[n++] = base | (to << TO_SHIFT);
          continue;
        }
        if ((target & BLACK) !== own)
          out[n++] = base | (to << TO_SHIFT) | (target << CAPTURED_SHIFT);
        break;
      }
    }
  }

  n = writeCastlingMoves(out, n, position, black);
  return assertFits(out, n);
}

/**
 * The captures of `generateMovesPacked`, and nothing else, in the same order: `generateCaptures`,
 * packed into `out` from index `start`. Returns the index one past the last move written.
 */
export function generateCapturesPacked(position: Position, out: Int32Array, start: number): number {
  const board = position.board;
  const black = position.blackToMove;
  const own = black ? BLACK : 0;
  const epSquare = position.epSquare;
  let n = start;

  for (let from = 0; from < 128; from++) {
    if ((from & 0x88) !== 0) continue;

    const piece = board[from] as number;
    if (piece === EMPTY || (piece & BLACK) !== own) continue;

    const type = piece & 7;
    if (type === PAWN) {
      n = writePawnCaptures(out, n, board, from, piece, black, epSquare);
      continue;
    }

    const base = from | (piece << PIECE_SHIFT);
    if (type === KNIGHT || type === KING) {
      const steps = type === KNIGHT ? KNIGHT_LEAPS : ALL_DIRECTIONS;
      for (let i = 0; i < steps.length; i++) {
        const to = from + (steps[i] as number);
        if ((to & 0x88) !== 0) continue;
        const target = board[to] as number;
        if (target === EMPTY || (target & BLACK) === own) continue;
        out[n++] = base | (to << TO_SHIFT) | (target << CAPTURED_SHIFT);
      }
      continue;
    }

    const rays = type === BISHOP ? DIAGONALS : type === ROOK ? ORTHOGONALS : ALL_DIRECTIONS;
    for (let i = 0; i < rays.length; i++) {
      const offset = rays[i] as number;
      for (let to = from + offset; (to & 0x88) === 0; to += offset) {
        const target = board[to] as number;
        if (target === EMPTY) continue;
        if ((target & BLACK) !== own)
          out[n++] = base | (to << TO_SHIFT) | (target << CAPTURED_SHIFT);
        break;
      }
    }
  }

  return assertFits(out, n);
}
