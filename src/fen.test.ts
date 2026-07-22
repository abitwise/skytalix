import { describe, expect, it } from "vitest";
import { FenError, parseFen, toFen } from "./fen.ts";
import { CASTLE_BK, CASTLE_BQ, CASTLE_WK, CASTLE_WQ, NO_SQUARE, squareName } from "./position.ts";

/** The six standard perft positions. ABC-006 uses these; ABC-001 must round-trip them. */
const PERFT_FENS = [
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1",
  "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1",
  "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8",
  "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
];

const START_FEN = PERFT_FENS[0] as string;

describe("FEN round-trip", () => {
  it("round-trips the starting position byte-identically", () => {
    expect(toFen(parseFen(START_FEN))).toBe(START_FEN);
  });

  it.each(PERFT_FENS)("round-trips perft position byte-identically: %s", (fen) => {
    expect(toFen(parseFen(fen))).toBe(fen);
  });
});

describe("FEN field parsing", () => {
  it("parses and preserves an en-passant target square", () => {
    const fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq e3 0 1";
    const position = parseFen(fen);

    expect(squareName(position.epSquare)).toBe("e3");
    expect(toFen(position)).toBe(fen);
  });

  it("parses partial castling rights and both clocks", () => {
    const fen = "r3k2r/8/8/8/8/8/8/R3K2R w Kq - 5 12";
    const position = parseFen(fen);

    expect(position.castling & CASTLE_WK).toBeTruthy();
    expect(position.castling & CASTLE_BQ).toBeTruthy();
    expect(position.castling & CASTLE_WQ).toBeFalsy();
    expect(position.castling & CASTLE_BK).toBeFalsy();
    expect(position.halfmoveClock).toBe(5);
    expect(position.fullmoveNumber).toBe(12);
  });

  it("represents an absent en-passant square as NO_SQUARE", () => {
    expect(parseFen(START_FEN).epSquare).toBe(NO_SQUARE);
  });

  it("parses the side to move", () => {
    expect(parseFen(START_FEN).blackToMove).toBe(false);
    expect(parseFen("8/8/8/8/8/8/8/K1k5 b - - 0 1").blackToMove).toBe(true);
  });
});

describe("FEN rejection — each fault named, never a silent partial parse", () => {
  const cases: ReadonlyArray<[label: string, fen: string, expected: RegExp]> = [
    [
      "five fields instead of six",
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0",
      /field/i,
    ],
    [
      "a rank summing to nine squares",
      "rnbqkbnr/ppppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1",
      /rank/i,
    ],
    [
      "a rank summing to seven squares",
      "rnbqkbnr/ppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1",
      /rank/i,
    ],
    [
      "an illegal character in the placement field",
      "rnbqkbnr/pppxpppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1",
      /character/i,
    ],
    ["seven ranks instead of eight", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP w - - 0 1", /rank/i],
    ["no white king", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQ1BNR w - - 0 1", /king/i],
    ["no black king", "rnbq1bnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1", /king/i],
    [
      "an invalid side-to-move",
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR x - - 0 1",
      /side to move/i,
    ],
    [
      "an invalid castling field",
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w XQkq - 0 1",
      /castling/i,
    ],
    [
      "an invalid en-passant square",
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq z9 0 1",
      /en.passant/i,
    ],
    [
      "a non-numeric halfmove clock",
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - x 1",
      /halfmove/i,
    ],
    [
      "a non-numeric fullmove number",
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 x",
      /fullmove/i,
    ],
    [
      "a fullmove number of zero (games start at 1)",
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 0",
      /fullmove/i,
    ],
    [
      "an en-passant field of the wrong length",
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq e33 0 1",
      /en.passant/i,
    ],
    [
      "an en-passant square with an out-of-range rank",
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq e9 0 1",
      /en.passant/i,
    ],
  ];

  it.each(cases)("rejects %s", (_label, fen, expected) => {
    expect(() => parseFen(fen)).toThrow(FenError);
    expect(() => parseFen(fen)).toThrow(expected);
  });
});

describe("square naming", () => {
  it("names the corners correctly", () => {
    const position = parseFen(START_FEN);
    // a1 holds a white rook, h8 holds a black rook — proves rank orientation is not flipped.
    expect(squareName(0)).toBe("a1");
    expect(squareName(7)).toBe("h1");
    expect(squareName(112)).toBe("a8");
    expect(squareName(119)).toBe("h8");
    expect(position.board[0]).not.toBe(position.board[112]);
  });
});
