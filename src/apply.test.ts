import { describe, expect, it } from "vitest";
import { makeMove, type UndoRecord, unmakeMove } from "./apply.ts";
import { parseFen, toFen } from "./fen.ts";
import { generateMoves, type Move } from "./moves.ts";
import { CASTLE_BQ, CASTLE_WK, CASTLE_WQ, EMPTY, NO_SQUARE, parseSquareName } from "./position.ts";

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
