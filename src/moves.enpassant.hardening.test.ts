/**
 * ABC-022 — QE hardening rows for the two en-passant GENERATION preconditions.
 *
 * `src/moves.enpassant.test.ts` is the acceptance file: it pins `A1`-`A6` in the ticket's own
 * words. This file adds the rows a mutation campaign proved the acceptance net cannot see.
 * Every row here PASSES on the delivered fix — NO production line changed — and each was
 * written because a build that fails it passes all eleven criteria, all 439 delivered tests
 * AND the `PERFT_DEEP=1` lane at 32/32.
 *
 * Both criteria say "at minimum", so these tables are inside `A1` and `A3` as written rather
 * than a widening of them: what they replace is a SAMPLE of two piece types with a QUANTIFIER
 * over every piece code `parseFen` will produce.
 *
 * 1. THE OWN-COLOUR OCCUPANT'S PIECE TYPE. `A1` names a knight and a rook on both colours,
 *    satisfying "at least two distinct piece types" literally. A guard that admits one further
 *    own type therefore survives: reading the target as "EMPTY, or the mover's own QUEEN"
 *    passes every criterion, all 439 tests and the deep lane, while offering a capture onto the
 *    mover's own queen — and playing it overwrites that queen with a pawn. `## Scope` bullet 1
 *    says "whatever occupies it and whatever colour it is", which is a claim about EVERY byte,
 *    so the table below carries all six of the mover's own piece types on both colours to move.
 *
 * 2. THE BYTE ONE RANK BEHIND THE TARGET. This is the sharper hole, because `A3` moves only
 *    along the colour axis: its six rows put NOTHING or the mover's OWN pawn on the capture
 *    square and never anything else. `## Scope` bullet 2 requires "the enemy PAWN" to be there,
 *    and two builds that read the weaker condition survive the whole net today —
 *      - "some ENEMY piece is behind it" (any type), and
 *      - "anything that is not the mover's own pawn is behind it".
 *    Both offer the capture with `captured: PAWN | …` while a knight, bishop, rook or queen
 *    stands on the capture square, and `undoSpecial` — untouched by ABC-022 — then writes that
 *    pawn byte back over the piece, so one `legalMoves` call turns an enemy KNIGHT into an enemy
 *    PAWN and playing the move removes it outright. That is half (b)'s harm on a piece worth
 *    more than a pawn, and no delivered row reaches it.
 *
 * WHAT THIS FILE DELIBERATELY DOES NOT COVER. The ENEMY occupant on the target is `A5`'s axis,
 * and `A5` is this board's only guard against the colour-shaped restructure. Quantifying that
 * axis here would make the mutant fail in two files and falsify `A5`'s own "fails only here" —
 * a comment about the generator's en-passant branch, which is the class of defect this ticket
 * exists to remove. Measured rather than assumed: the restructure mutant passes all 40 rows
 * below. That the enemy axis is still SAMPLED at two piece types is reported as an open gap,
 * not closed by a side effect here.
 *
 * INSTRUMENT LIMIT, recorded rather than hidden: the king rows relocate the kings, because
 * `parseFen` refuses a board with two of either. Bytes that are not valid piece codes are not
 * FEN-producible at all and are out of this file's reach; every row below is a FEN the parser
 * accepts and `toFen` renders back unchanged.
 *
 * Purity is asserted per make/unmake PAIR as well as across the call, for the reason the
 * acceptance file records: the call-level oracle self-masks. It is not decoration here either —
 * four rows of the "not the mover's own pawn" build read CLEAN across the call and DIRTY per
 * pair.
 */

import { describe, expect, it } from "vitest";
import { makeMove, unmakeMove } from "./apply.ts";
import { parseFen, toFen } from "./fen.ts";
import { legalMoves } from "./legal.ts";
import { FLAG_EN_PASSANT, generateMoves, type Move } from "./moves.ts";
import type { Position } from "./position.ts";

/** All 128 board bytes and all five scalars — the whole state, kept field by field. */
interface StateSnapshot {
  readonly board: number[];
  readonly blackToMove: boolean;
  readonly castling: number;
  readonly epSquare: number;
  readonly halfmoveClock: number;
  readonly fullmoveNumber: number;
}

function snapshot(position: Position): StateSnapshot {
  return {
    board: Array.from(position.board),
    blackToMove: position.blackToMove,
    castling: position.castling,
    epSquare: position.epSquare,
    halfmoveClock: position.halfmoveClock,
    fullmoveNumber: position.fullmoveNumber,
  };
}

function expectSameState(position: Position, before: StateSnapshot, label: string): void {
  expect(Array.from(position.board), `board bytes: ${label}`).toEqual(before.board);
  expect(position.blackToMove, `blackToMove: ${label}`).toBe(before.blackToMove);
  expect(position.castling, `castling: ${label}`).toBe(before.castling);
  expect(position.epSquare, `epSquare: ${label}`).toBe(before.epSquare);
  expect(position.halfmoveClock, `halfmoveClock: ${label}`).toBe(before.halfmoveClock);
  expect(position.fullmoveNumber, `fullmoveNumber: ${label}`).toBe(before.fullmoveNumber);
}

function enPassantCount(moves: Move[]): number {
  return moves.filter((move) => (move.flags & FLAG_EN_PASSANT) !== 0).length;
}

/** Parses and re-renders: a mistyped board must not become a verdict. */
function position(fen: string): Position {
  const parsed = parseFen(fen);
  expect(toFen(parsed), `FEN must render back identically: ${fen}`).toBe(fen);
  return parsed;
}

type Row = readonly [fen: string, expected: number, what: string];

/**
 * Axis 1 — the byte on the en-passant TARGET, every own piece type on both colours to move.
 * The captured pawn is genuinely present on every row, so the only thing under test is the
 * occupant. The two EMPTY rows are the controls that keep this table from passing by rejecting
 * everything.
 */
const OWN_OCCUPANT_ON_TARGET: readonly Row[] = [
  ["4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1", 1, "the target is EMPTY, white to move — control"],
  ["4k3/8/3P4/3pP3/8/8/8/4K3 w - d6 0 1", 0, "own PAWN on the target, white to move"],
  ["4k3/8/3N4/3pP3/8/8/8/4K3 w - d6 0 1", 0, "own KNIGHT on the target, white to move"],
  ["4k3/8/3B4/3pP3/8/8/8/4K3 w - d6 0 1", 0, "own BISHOP on the target, white to move"],
  ["4k3/8/3R4/3pP3/8/8/8/4K3 w - d6 0 1", 0, "own ROOK on the target, white to move"],
  ["4k3/8/3Q4/3pP3/8/8/8/4K3 w - d6 0 1", 0, "own QUEEN on the target, white to move"],
  ["4k3/8/3K4/3pP3/8/8/8/8 w - d6 0 1", 0, "own KING on the target, white to move"],
  ["4k3/8/8/8/3pP3/8/8/4K3 b - e3 0 1", 1, "the target is EMPTY, black to move — control"],
  ["4k3/8/8/8/3pP3/4p3/8/4K3 b - e3 0 1", 0, "own PAWN on the target, black to move"],
  ["4k3/8/8/8/3pP3/4n3/8/4K3 b - e3 0 1", 0, "own KNIGHT on the target, black to move"],
  ["4k3/8/8/8/3pP3/4b3/8/4K3 b - e3 0 1", 0, "own BISHOP on the target, black to move"],
  ["4k3/8/8/8/3pP3/4r3/8/4K3 b - e3 0 1", 0, "own ROOK on the target, black to move"],
  ["4k3/8/8/8/3pP3/4q3/8/4K3 b - e3 0 1", 0, "own QUEEN on the target, black to move"],
  ["8/8/8/8/3pP3/4k3/8/4K3 b - e3 0 1", 0, "own KING on the target, black to move"],
];

/**
 * Axis 2 — the byte ONE RANK BEHIND the target, every FEN-producible piece code on both
 * colours to move. The target is EMPTY on every row, so the only thing under test is what the
 * move claims to capture. Exactly two rows may offer the move: the ones where the enemy PAWN
 * really is there.
 */
const BYTE_BEHIND_THE_TARGET: readonly Row[] = [
  ["4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1", 1, "the ENEMY PAWN is behind it, white to move — control"],
  ["4k3/8/8/4P3/8/8/8/4K3 w - d6 0 1", 0, "nothing behind it, white to move"],
  ["4k3/8/8/3PP3/8/8/8/4K3 w - d6 0 1", 0, "own PAWN behind it, white to move"],
  ["4k3/8/8/3NP3/8/8/8/4K3 w - d6 0 1", 0, "own KNIGHT behind it, white to move"],
  ["4k3/8/8/3BP3/8/8/8/4K3 w - d6 0 1", 0, "own BISHOP behind it, white to move"],
  ["4k3/8/8/3RP3/8/8/8/4K3 w - d6 0 1", 0, "own ROOK behind it, white to move"],
  ["4k3/8/8/3QP3/8/8/8/4K3 w - d6 0 1", 0, "own QUEEN behind it, white to move"],
  ["4k3/8/8/3KP3/8/8/8/8 w - d6 0 1", 0, "own KING behind it, white to move"],
  ["4k3/8/8/3nP3/8/8/8/4K3 w - d6 0 1", 0, "enemy KNIGHT behind it, white to move"],
  ["4k3/8/8/3bP3/8/8/8/4K3 w - d6 0 1", 0, "enemy BISHOP behind it, white to move"],
  ["4k3/8/8/3rP3/8/8/8/4K3 w - d6 0 1", 0, "enemy ROOK behind it, white to move"],
  ["4k3/8/8/3qP3/8/8/8/4K3 w - d6 0 1", 0, "enemy QUEEN behind it, white to move"],
  ["8/8/8/3kP3/8/8/8/4K3 w - d6 0 1", 0, "enemy KING behind it, white to move"],
  ["4k3/8/8/8/3pP3/8/8/4K3 b - e3 0 1", 1, "the ENEMY PAWN is behind it, black to move — control"],
  ["4k3/8/8/8/3p4/8/8/4K3 b - e3 0 1", 0, "nothing behind it, black to move"],
  ["4k3/8/8/8/3pp3/8/8/4K3 b - e3 0 1", 0, "own PAWN behind it, black to move"],
  ["4k3/8/8/8/3pn3/8/8/4K3 b - e3 0 1", 0, "own KNIGHT behind it, black to move"],
  ["4k3/8/8/8/3pb3/8/8/4K3 b - e3 0 1", 0, "own BISHOP behind it, black to move"],
  ["4k3/8/8/8/3pr3/8/8/4K3 b - e3 0 1", 0, "own ROOK behind it, black to move"],
  ["4k3/8/8/8/3pq3/8/8/4K3 b - e3 0 1", 0, "own QUEEN behind it, black to move"],
  ["8/8/8/8/3pk3/8/8/4K3 b - e3 0 1", 0, "own KING behind it, black to move"],
  ["4k3/8/8/8/3pN3/8/8/4K3 b - e3 0 1", 0, "enemy KNIGHT behind it, black to move"],
  ["4k3/8/8/8/3pB3/8/8/4K3 b - e3 0 1", 0, "enemy BISHOP behind it, black to move"],
  ["4k3/8/8/8/3pR3/8/8/4K3 b - e3 0 1", 0, "enemy ROOK behind it, black to move"],
  ["4k3/8/8/8/3pQ3/8/8/4K3 b - e3 0 1", 0, "enemy QUEEN behind it, black to move"],
  ["4k3/8/8/8/3pK3/8/8/8 b - e3 0 1", 0, "enemy KING behind it, black to move"],
];

const EVERY_HARDENING_ROW: readonly Row[] = [...OWN_OCCUPANT_ON_TARGET, ...BYTE_BEHIND_THE_TARGET];

describe("ABC-022 QE hardening — the OWN occupant on the target, quantified over every type", () => {
  it.each(OWN_OCCUPANT_ON_TARGET)(
    "generateMoves offers the en-passant move only onto an empty target on %s (%s)",
    (fen, expected, _what) => {
      expect(enPassantCount(generateMoves(position(fen))), `generateMoves: ${fen}`).toBe(expected);
    },
  );

  it.each(OWN_OCCUPANT_ON_TARGET)(
    "legalMoves agrees with it on %s (%s)",
    (fen, expected, _what) => {
      // The two control rows are legal en-passant captures with nothing pinning the capturer,
      // so the filter keeps them; every other row must be 0 in both.
      expect(enPassantCount(legalMoves(position(fen))), `legalMoves: ${fen}`).toBe(expected);
    },
  );
});

describe("ABC-022 QE hardening — the byte behind the target, quantified over the whole space", () => {
  it.each(BYTE_BEHIND_THE_TARGET)(
    "generateMoves offers the en-passant move only for the enemy pawn on %s (%s)",
    (fen, expected, _what) => {
      expect(enPassantCount(generateMoves(position(fen))), `generateMoves: ${fen}`).toBe(expected);
    },
  );

  it.each(BYTE_BEHIND_THE_TARGET)(
    "legalMoves agrees with it on %s (%s)",
    (fen, expected, _what) => {
      expect(enPassantCount(legalMoves(position(fen))), `legalMoves: ${fen}`).toBe(expected);
    },
  );
});

describe("ABC-022 QE hardening — purity over both tables, per make/unmake PAIR", () => {
  it.each(EVERY_HARDENING_ROW)(
    "keeps all 128 bytes and all five scalars across the call and per pair on %s (%s)",
    (fen, _expected, _what) => {
      const start = position(fen);
      const before = snapshot(start);
      legalMoves(start);
      expectSameState(start, before, `${fen} across the call`);

      const stepped = position(fen);
      const beforeSteps = snapshot(stepped);
      for (const move of generateMoves(stepped)) {
        const undo = makeMove(stepped, move);
        unmakeMove(stepped, move, undo);
        expectSameState(stepped, beforeSteps, `${fen} after ${move.from}->${move.to}`);
      }
    },
  );
});
