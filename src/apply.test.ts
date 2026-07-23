import { describe, expect, it } from "vitest";
import { makeMove, type UndoRecord, unmakeMove } from "./apply.ts";
import { parseFen, toFen } from "./fen.ts";
import { FLAG_CASTLE, FLAG_EN_PASSANT, FLAG_PROMOTION, generateMoves, type Move } from "./moves.ts";
import {
  BLACK,
  CASTLE_BQ,
  CASTLE_WK,
  CASTLE_WQ,
  EMPTY,
  NO_SQUARE,
  parseSquareName,
  QUEEN,
  ROOK,
} from "./position.ts";

/**
 * The six standard perft positions (CPW / Marcel van Kervinck). ABC-006 will use
 * these to verify move *counts*; here they are the widest spread of legal positions
 * available to drive the make/unmake round-trip property over.
 */
const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

const PERFT_POSITIONS: ReadonlyArray<readonly [name: string, fen: string]> = [
  ["start", START_FEN],
  ["kiwipete", "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1"],
  ["position-3", "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1"],
  ["position-4", "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1"],
  ["position-5", "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8"],
  ["position-6", "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10"],
];

const E2 = parseSquareName("e2");
const E3 = parseSquareName("e3");
const E4 = parseSquareName("e4");

// ---------------------------------------------------------------------------
// Acceptance — the five Given/When/Then criteria on ABC-003. These assert the
// observable outcome (a FEN identity, an ep target, a clock delta). The unit
// block below asserts the internal logic and does not re-assert these outcomes.
// ---------------------------------------------------------------------------

describe("ABC-003 acceptance", () => {
  it("round-trips every pseudo-legal move on all six perft positions to the exact FEN", () => {
    for (const [name, fen] of PERFT_POSITIONS) {
      const moves = generateMoves(parseFen(fen));
      expect(moves.length, `${name} generated no moves`).toBeGreaterThan(0);

      // A fresh position per move, so each move is tested in isolation and a failure
      // points at the exact move rather than cascading from a corrupted board.
      for (const move of moves) {
        const position = parseFen(fen);
        const undo = makeMove(position, move);
        unmakeMove(position, move, undo);
        expect(toFen(position), `${name}: ${JSON.stringify(move)}`).toBe(fen);
      }
    }
  });

  it("restores the captured piece and the halfmove clock after a capture is undone", () => {
    const fen = "4k3/8/8/3r4/8/8/8/3RK3 w - - 7 20";
    const position = parseFen(fen);
    const capture = generateMoves(position).find((move) => move.captured !== EMPTY);
    if (capture === undefined) throw new Error("expected a capture to be available");

    const undo = makeMove(position, capture);
    unmakeMove(position, capture, undo);

    expect(toFen(position)).toBe(fen);
  });

  it("sets the en-passant target to e3 on the e2–e4 double push and clears it on undo", () => {
    const position = parseFen(START_FEN);
    const doublePush = generateMoves(position).find((move) => move.from === E2 && move.to === E4);
    if (doublePush === undefined) throw new Error("expected the e2–e4 double push");

    const undo = makeMove(position, doublePush);
    expect(position.epSquare).toBe(E3);

    unmakeMove(position, doublePush, undo);
    expect(position.epSquare).toBe(NO_SQUARE);
  });

  it("increments the halfmove clock by exactly 1 on a quiet non-pawn move", () => {
    const position = parseFen("4k3/8/8/8/8/8/8/4K1N1 w - - 4 30");
    const before = position.halfmoveClock;
    const knightMove = generateMoves(position).find(
      (move) => move.captured === EMPTY && move.from === parseSquareName("g1"),
    );
    if (knightMove === undefined) throw new Error("expected a quiet knight move");

    makeMove(position, knightMove);

    expect(position.halfmoveClock).toBe(before + 1);
  });

  it("advances the fullmove number after Black's move but not after White's", () => {
    const whiteToMove = parseFen(START_FEN);
    const whiteMove = generateMoves(whiteToMove)[0];
    if (whiteMove === undefined) throw new Error("expected a white move");
    makeMove(whiteToMove, whiteMove);
    expect(whiteToMove.fullmoveNumber).toBe(1);

    const blackToMove = parseFen(START_FEN.replace(" w ", " b "));
    const blackMove = generateMoves(blackToMove)[0];
    if (blackMove === undefined) throw new Error("expected a black move");
    makeMove(blackToMove, blackMove);
    expect(blackToMove.fullmoveNumber).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// Unit — the logic beneath the acceptance outcomes: what the undo record carries,
// and the castling-rights clearing that make() performs but the round-trip
// property (which restores rights on undo) never exercises.
// ---------------------------------------------------------------------------

describe("the undo record", () => {
  it("captures the prior castling, ep square, and halfmove clock a move cannot rederive", () => {
    const position = parseFen(START_FEN);
    const priorCastling = position.castling;
    const move = generateMoves(position)[0];
    if (move === undefined) throw new Error("expected a move");

    const undo = makeMove(position, move);

    expect(undo).toEqual({
      captured: EMPTY,
      castling: priorCastling,
      epSquare: NO_SQUARE,
      halfmoveClock: 0,
    });
  });
});

describe("castling rights", () => {
  const CASTLE_TEST_FEN = "r3k3/8/8/8/8/8/8/R3K2R w KQq - 0 1";

  it("clears both of a side's rights when its king moves", () => {
    const position = parseFen(CASTLE_TEST_FEN);
    const kingMove = generateMoves(position).find(
      (move) => move.from === parseSquareName("e1") && move.captured === EMPTY,
    );
    if (kingMove === undefined) throw new Error("expected a quiet king move");

    makeMove(position, kingMove);

    expect(position.castling & (CASTLE_WK | CASTLE_WQ)).toBe(0);
  });

  it("clears only the near-side right when a rook leaves its home square", () => {
    const position = parseFen(CASTLE_TEST_FEN);
    const rookMove = generateMoves(position).find(
      (move) => move.from === parseSquareName("a1") && move.captured === EMPTY,
    );
    if (rookMove === undefined) throw new Error("expected a quiet a1-rook move");

    makeMove(position, rookMove);

    expect(position.castling & CASTLE_WQ).toBe(0);
    expect(position.castling & CASTLE_WK).not.toBe(0);
  });

  it("clears the opponent's right when their rook is captured on its home square", () => {
    const position = parseFen(CASTLE_TEST_FEN);
    const captureA8 = generateMoves(position).find(
      (move) => move.to === parseSquareName("a8") && move.captured !== EMPTY,
    );
    if (captureA8 === undefined) throw new Error("expected a capture of the a8 rook");

    makeMove(position, captureA8);

    expect(position.castling & CASTLE_BQ).toBe(0);
  });

  it("resets the halfmove clock to 0 on a capture", () => {
    const position = parseFen("4k3/8/8/3r4/8/8/8/3RK3 w - - 7 20");
    const capture = generateMoves(position).find((move) => move.captured !== EMPTY);
    if (capture === undefined) throw new Error("expected a capture to be available");

    makeMove(position, capture);

    expect(position.halfmoveClock).toBe(0);
  });
});

// QE probes: places a bug could hide behind the green suite above. The acceptance
// property round-trips White-to-move positions at depth 1; these probe the paths it
// leaves open — recursion depth > 1, the Black-move colour mirror, and the castling
// right restored (not just cleared) across a round-trip.
describe("QE edge probes", () => {
  it("restores the exact FEN after three nested make/unmake operations (search depth 3)", () => {
    const fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    const position = parseFen(fen);
    const stack: Array<{ move: Move; undo: UndoRecord }> = [];

    // Alternates White, Black, White — the real shape of a search, which depth-1 misses.
    for (let ply = 0; ply < 3; ply++) {
      const move = generateMoves(position)[0];
      if (move === undefined) throw new Error("expected a move");
      stack.push({ move, undo: makeMove(position, move) });
    }

    for (let i = stack.length - 1; i >= 0; i--) {
      const step = stack[i];
      if (step === undefined) throw new Error("missing undo step");
      unmakeMove(position, step.move, step.undo);
    }

    expect(toFen(position)).toBe(fen);
  });

  it("round-trips a Black move, restoring the fullmove number it advanced", () => {
    // The acceptance property covers only White-to-move perft positions, so undoing a
    // Black move — where fullmove is decremented — is otherwise never exercised.
    const fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1";
    const position = parseFen(fen);
    const move = generateMoves(position)[0];
    if (move === undefined) throw new Error("expected a black move");

    const undo = makeMove(position, move);
    expect(position.fullmoveNumber).toBe(2);

    unmakeMove(position, move, undo);
    expect(toFen(position)).toBe(fen);
  });

  it("sets the en-passant target behind a Black pawn's double push", () => {
    // Criterion 3 pins White (e2–e4 → e3). Colour asymmetry lives in the pawn direction,
    // so the Black mirror (e7–e5 → e6) is where a one-sided bug survives.
    const position = parseFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1");
    const push = generateMoves(position).find(
      (move) => move.from === parseSquareName("e7") && move.to === parseSquareName("e5"),
    );
    if (push === undefined) throw new Error("expected the e7–e5 double push");

    makeMove(position, push);

    expect(position.epSquare).toBe(parseSquareName("e6"));
  });

  it("restores a castling right after the rook granting it is captured and the move undone", () => {
    const fen = "r3k3/8/8/8/8/8/8/R3K2R w KQq - 0 1";
    const position = parseFen(fen);
    const captureA8 = generateMoves(position).find(
      (move) => move.to === parseSquareName("a8") && move.captured !== EMPTY,
    );
    if (captureA8 === undefined) throw new Error("expected a capture of the a8 rook");

    const undo = makeMove(position, captureA8);
    expect(position.castling & CASTLE_BQ).toBe(0);

    unmakeMove(position, captureA8, undo);
    expect(toFen(position)).toBe(fen);
  });

  it("resets the halfmove clock to 0 on a quiet pawn push", () => {
    const position = parseFen("4k3/8/8/8/8/8/4P3/4K3 w - - 9 40");
    const push = generateMoves(position).find((move) => move.from === parseSquareName("e2"));
    if (push === undefined) throw new Error("expected a pawn push");

    makeMove(position, push);

    expect(position.halfmoveClock).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// ABC-004 acceptance — special-move MAKE/UNMAKE. The moves.test.ts sibling block
// covers generation; these assert that make executes the special mechanics and
// unmake reverses them exactly (a FEN round-trip). The perft-position property
// test above already round-trips every generated castle/promotion incidentally;
// these pin the exact board and the undo record's restoration by hand.
// ---------------------------------------------------------------------------

const CASTLE_FEN = "r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1";

function findMove(moves: Move[], predicate: (move: Move) => boolean, description: string): Move {
  const move = moves.find(predicate);
  if (move === undefined) throw new Error(`expected ${description}`);
  return move;
}

describe("ABC-004 acceptance — castling make/unmake", () => {
  it("moves the rook and round-trips a White kingside castle", () => {
    const position = parseFen(CASTLE_FEN);
    const castle = findMove(
      generateMoves(position),
      (move) => (move.flags & FLAG_CASTLE) !== 0 && move.to === parseSquareName("g1"),
      "a White kingside castle",
    );

    const undo = makeMove(position, castle);
    // King on g1, rook jumped h1 -> f1, White's rights gone, clock ticks (not a pawn/capture).
    expect(toFen(position)).toBe("r3k2r/8/8/8/8/8/8/R4RK1 b kq - 1 1");

    unmakeMove(position, castle, undo);
    expect(toFen(position)).toBe(CASTLE_FEN);
  });

  it("moves the rook and round-trips a White queenside castle", () => {
    const position = parseFen(CASTLE_FEN);
    const castle = findMove(
      generateMoves(position),
      (move) => (move.flags & FLAG_CASTLE) !== 0 && move.to === parseSquareName("c1"),
      "a White queenside castle",
    );

    const undo = makeMove(position, castle);
    // King on c1, rook jumped a1 -> d1.
    expect(toFen(position)).toBe("r3k2r/8/8/8/8/8/8/2KR3R b kq - 1 1");

    unmakeMove(position, castle, undo);
    expect(toFen(position)).toBe(CASTLE_FEN);
  });

  it("clears White's kingside right when the h1 rook is captured on its home square", () => {
    // The commonly-missed case: a right lost by CAPTURE, not by the king or rook moving.
    const position = parseFen(CASTLE_FEN.replace(" w ", " b "));
    const capture = findMove(
      generateMoves(position),
      (move) => move.to === parseSquareName("h1") && move.captured !== EMPTY,
      "a capture of the h1 rook",
    );

    makeMove(position, capture);

    expect(position.castling & CASTLE_WK).toBe(0);
    expect(position.castling & CASTLE_WQ).not.toBe(0);
  });
});

describe("ABC-004 acceptance — en passant and promotion make/unmake", () => {
  it("restores both pawns after an en-passant capture is undone", () => {
    const fen = "4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1";
    const position = parseFen(fen);
    const ep = findMove(
      generateMoves(position),
      (move) => (move.flags & FLAG_EN_PASSANT) !== 0,
      "the exd6 en-passant capture",
    );

    const undo = makeMove(position, ep);
    // White pawn now on d6, the black d5 pawn removed from a square the capturer never sat on.
    expect(toFen(position)).toBe("4k3/8/3P4/8/8/8/8/4K3 b - - 0 1");

    unmakeMove(position, ep, undo);
    expect(toFen(position)).toBe(fen); // black pawn back on d5, white pawn back on e5
  });

  it("restores a pawn, not the promoted piece, when a promotion is undone", () => {
    const fen = "7k/4P3/8/8/8/8/8/4K3 w - - 0 1";
    const position = parseFen(fen);
    const promote = findMove(
      generateMoves(position),
      (move) => (move.flags & FLAG_PROMOTION) !== 0 && move.promotion === QUEEN,
      "the e8=Q promotion",
    );

    const undo = makeMove(position, promote);
    expect(toFen(position)).toBe("4Q2k/8/8/8/8/8/8/4K3 b - - 0 1");

    unmakeMove(position, promote, undo);
    expect(toFen(position)).toBe(fen); // a pawn stands on e7 again, no queen remains
  });
});

// QE probes: the colour mirror and the capture-promotion, where a one-sided bug or a
// dropped captured-piece would hide behind the White-only acceptance cases above.
describe("ABC-004 QE edge probes", () => {
  it("round-trips a Black kingside castle, moving the h8 rook and advancing fullmove", () => {
    const fen = CASTLE_FEN.replace(" w ", " b ");
    const position = parseFen(fen);
    const castle = findMove(
      generateMoves(position),
      (move) => (move.flags & FLAG_CASTLE) !== 0 && move.to === parseSquareName("g8"),
      "a Black kingside castle",
    );

    const undo = makeMove(position, castle);
    expect(toFen(position)).toBe("r4rk1/8/8/8/8/8/8/R3K2R w KQ - 1 2");

    unmakeMove(position, castle, undo);
    expect(toFen(position)).toBe(fen);
  });

  it("round-trips a Black en-passant capture — the mirror of the White ep path", () => {
    // White has just pushed d2–d4; Black's e4 pawn takes exd3, removing the pawn on d4.
    const fen = "4k3/8/8/8/3Pp3/8/8/4K3 b - d3 0 1";
    const position = parseFen(fen);
    const ep = findMove(
      generateMoves(position),
      (move) => (move.flags & FLAG_EN_PASSANT) !== 0,
      "the exd3 en-passant capture",
    );

    const undo = makeMove(position, ep);
    expect(toFen(position)).toBe("4k3/8/8/8/8/3p4/8/4K3 w - - 0 2");

    unmakeMove(position, ep, undo);
    expect(toFen(position)).toBe(fen);
  });

  it("round-trips a Black promotion — the mirror of the White promotion path", () => {
    const fen = "4k3/8/8/8/8/8/1p6/4K3 b - - 0 1";
    const position = parseFen(fen);
    const promote = findMove(
      generateMoves(position),
      (move) => (move.flags & FLAG_PROMOTION) !== 0 && move.promotion === QUEEN,
      "the b1=q promotion",
    );

    const undo = makeMove(position, promote);
    expect(toFen(position)).toBe("4k3/8/8/8/8/8/8/1q2K3 w - - 0 2");

    unmakeMove(position, promote, undo);
    expect(toFen(position)).toBe(fen);
  });

  it("generates four capture-promotions and round-trips one, clearing the rook's castling right", () => {
    // White pawn b7 can take the a8 rook and promote; the capture also clears Black's queenside right.
    const fen = "r3k3/1P6/8/8/8/8/8/4K3 w q - 0 1";
    const position = parseFen(fen);
    const captures = generateMoves(position).filter(
      (move) => move.to === parseSquareName("a8") && (move.flags & FLAG_PROMOTION) !== 0,
    );
    expect(captures).toHaveLength(4);

    const queen = findMove(captures, (move) => move.promotion === QUEEN, "bxa8=Q");
    expect(queen.captured).toBe(ROOK | BLACK);

    const undo = makeMove(position, queen);
    expect(toFen(position)).toBe("Q3k3/8/8/8/8/8/8/4K3 b - - 0 1");

    unmakeMove(position, queen, undo);
    expect(toFen(position)).toBe(fen);
  });
});
