import { readdirSync, readFileSync } from "node:fs";
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
    const fen = "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1";
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

/**
 * ABC-010 / ADR-0033: grammatically perfect FENs that describe a board no game can reach. Each is
 * rejected with a FenError whose message names the rule, the right / square / field, and why.
 */
describe('FEN semantic rejection — the fault is named, never a bare "invalid FEN"', () => {
  const cases: ReadonlyArray<[label: string, fen: string, expected: RegExp]> = [
    [
      "castling rights with no king on its home square",
      "4k3/8/8/8/8/8/8/K7 w KQ - 0 1",
      /^castling right "K" is inconsistent with the board: no white king on e1$/,
    ],
    [
      "a castling right with no rook on its home square",
      "4k3/8/8/8/8/8/8/4K3 w K - 0 1",
      /^castling right "K" is inconsistent with the board: no white rook on h1$/,
    ],
    [
      "a black castling right with no rook on a8",
      "4k3/8/8/8/8/8/8/4K3 b q - 0 1",
      /^castling right "q" is inconsistent with the board: no black rook on a8$/,
    ],
    [
      "the side not to move already in check",
      "4k3/8/4Q3/8/8/8/8/4K3 w - - 0 1",
      /^side not to move \(black\) is in check: its king on e8 is attacked$/,
    ],
    [
      "white in check with black to move",
      "4k3/8/8/8/8/8/4q3/4K3 b - - 0 1",
      /^side not to move \(white\) is in check: its king on e1 is attacked$/,
    ],
    [
      "a pawn on rank 1",
      "4k3/8/8/8/8/8/8/P3K3 w - - 0 1",
      /^pawn on a1: no pawn can stand on rank 1$/,
    ],
    [
      "a pawn on rank 8",
      "p3k3/8/8/8/8/8/8/4K3 w - - 0 1",
      /^pawn on a8: no pawn can stand on rank 8$/,
    ],
    [
      "an en-passant square with no pawn that could have double-pushed to it",
      "4k3/8/8/8/8/8/8/4K3 w - e6 0 1",
      /^en-passant square e6 is inconsistent with the board: no black pawn on e5$/,
    ],
    [
      "an en-passant square on the wrong rank for the side to move",
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq e3 0 1",
      /^en-passant square e3 is inconsistent with the board: it must be on rank 6 when white is to move$/,
    ],
    [
      "an occupied en-passant square",
      "4k3/8/4n3/4p3/8/8/8/4K3 w - e6 0 1",
      /^en-passant square e6 is inconsistent with the board: e6 is occupied$/,
    ],
    [
      "an en-passant square whose origin square is occupied",
      "4k3/4n3/8/4p3/8/8/8/4K3 w - e6 0 1",
      /^en-passant square e6 is inconsistent with the board: e7 is occupied$/,
    ],
    [
      "a halfmove clock of 400 nines (overflows to Infinity)",
      `4k3/8/8/8/8/8/8/4K3 w - - ${"9".repeat(400)} 1`,
      /^halfmove clock "9{24}…" does not round-trip: it reads back as "Infinity"$/,
    ],
    [
      "a fullmove number of 10^21 (serializes as 1e+21)",
      "4k3/8/8/8/8/8/8/4K3 w - - 0 1000000000000000000000",
      /^fullmove number "1000000000000000000000" does not round-trip: it reads back as "1e\+21"$/,
    ],
    [
      "a halfmove clock with a leading zero",
      "4k3/8/8/8/8/8/8/4K3 w - - 00 1",
      /^halfmove clock "00" does not round-trip: it reads back as "0"$/,
    ],
  ];

  it.each(cases)("rejects %s", (_label, fen, expected) => {
    expect(() => parseFen(fen)).toThrow(FenError);
    expect(() => parseFen(fen)).toThrow(expected);
  });

  it("checks in ADR-0033's order: the first fault found is the one thrown", () => {
    // Pawn on h1, a right with no rook, a bogus en-passant square and black in check, all at once.
    expect(() => parseFen("4k3/8/4Q3/8/8/8/8/4K2P w K e6 0 1")).toThrow(/^pawn on h1/);
    expect(() => parseFen("4k3/8/4Q3/8/8/8/8/4K3 w K e6 0 1")).toThrow(/^castling right "K"/);
    expect(() => parseFen("4k3/8/4Q3/8/8/8/8/4K3 w - e6 0 1")).toThrow(/^en-passant square e6/);
  });

  it.each([
    ["null", null],
    ["undefined", undefined],
    ["a number", 42],
    ["an object", {}],
    ["an array", []],
  ])("rejects %s as non-string input with a FenError, never a raw TypeError", (name, input) => {
    let thrown: unknown;
    try {
      parseFen(input as unknown as string);
    } catch (error) {
      thrown = error;
    }
    expect(thrown instanceof FenError).toBe(true);
    expect((thrown as Error).message).toBe(`FEN must be a string, found ${name}`);
  });

  it("accepts a legal en-passant square with no capturer (ADR-0005: not normalised)", () => {
    const fen = "4k3/8/8/4p3/8/8/8/4K3 w - e6 0 2";
    expect(toFen(parseFen(fen))).toBe(fen);
  });
});

/**
 * QE (`qe-ABC-010`): the rows the table above leaves to chance. Each was a surviving mutant of
 * `src/fen.ts` — the whole suite stayed green with the rule dropped or loosened — so each row names
 * the mutant it kills. Every right, both halves; the home-square identity tests (colour, not only
 * kind); en passant with black to move; and the rule order inside the pawn and castling scans.
 */
describe("FEN semantic rejection — every right, both colours, black to move (QE)", () => {
  const cases: ReadonlyArray<[label: string, fen: string, expected: RegExp]> = [
    [
      'right "Q" with no king on e1 (drop-"Q" mutant)',
      "4k3/8/8/8/8/8/8/R4K2 w Q - 0 1",
      /^castling right "Q" is inconsistent with the board: no white king on e1$/,
    ],
    [
      'right "Q" with no rook on a1 (drop-"Q" mutant)',
      "4k3/8/8/8/8/8/8/4K3 w Q - 0 1",
      /^castling right "Q" is inconsistent with the board: no white rook on a1$/,
    ],
    [
      'right "k" with no king on e8 (drop-"k" mutant)',
      "5k1r/8/8/8/8/8/8/4K3 w k - 0 1",
      /^castling right "k" is inconsistent with the board: no black king on e8$/,
    ],
    [
      'right "k" with no rook on h8 (drop-"k" mutant)',
      "4k3/8/8/8/8/8/8/4K3 w k - 0 1",
      /^castling right "k" is inconsistent with the board: no black rook on h8$/,
    ],
    [
      'right "q" with no king on e8',
      "r4k2/8/8/8/8/8/8/4K3 w q - 0 1",
      /^castling right "q" is inconsistent with the board: no black king on e8$/,
    ],
    [
      'right "K" with the BLACK king on e1 (king-of-either-colour mutant)',
      "4K3/8/8/8/8/8/8/4k2R b K - 0 1",
      /^castling right "K" is inconsistent with the board: no white king on e1$/,
    ],
    [
      'right "K" with a BLACK rook on h1 (rook-of-either-colour mutant)',
      "4k3/8/8/8/8/8/8/4K1Nr w K - 0 1",
      /^castling right "K" is inconsistent with the board: no white rook on h1$/,
    ],
    [
      "black to move, no white pawn in front of e3 (ep-only-when-white-moves mutant)",
      "4k3/8/8/8/8/8/8/4K3 b - e3 0 1",
      /^en-passant square e3 is inconsistent with the board: no white pawn on e4$/,
    ],
    [
      "black to move, an en-passant square on rank 6",
      "4k3/8/8/8/8/8/8/4K3 b - e6 0 1",
      /^en-passant square e6 is inconsistent with the board: it must be on rank 3 when black is to move$/,
    ],
    [
      "black to move, the en-passant square occupied",
      "4k3/8/8/8/4P3/4N3/8/4K3 b - e3 0 1",
      /^en-passant square e3 is inconsistent with the board: e3 is occupied$/,
    ],
    [
      "black to move, the double push's origin occupied",
      "4k3/8/8/8/4P3/8/4N3/4K3 b - e3 0 1",
      /^en-passant square e3 is inconsistent with the board: e2 is occupied$/,
    ],
    [
      "white to move, a WHITE pawn in front of e6 (pushed-pawn-of-either-colour mutant)",
      "4k3/8/8/4P3/8/8/8/4K3 w - e6 0 1",
      /^en-passant square e6 is inconsistent with the board: no black pawn on e5$/,
    ],
    [
      "pawns on a8 and h1: rank 1 is scanned first, though FEN prints rank 8 first",
      "p3k3/8/8/8/8/8/8/4K2P w - - 0 1",
      /^pawn on h1: no pawn can stand on rank 1$/,
    ],
    [
      'rights "K" and "Q" both unsupported: "K" is named first',
      "4k3/8/8/8/8/8/8/4K3 w KQ - 0 1",
      /^castling right "K" is inconsistent with the board: no white rook on h1$/,
    ],
    [
      'rights "Q" and "k" both unsupported: "Q" is named first',
      "4k3/8/8/8/8/8/8/4K3 w Qk - 0 1",
      /^castling right "Q" is inconsistent with the board: no white rook on a1$/,
    ],
    [
      'rights "k" and "q" both unsupported: "k" is named first',
      "4k3/8/8/8/8/8/8/4K3 w kq - 0 1",
      /^castling right "k" is inconsistent with the board: no black rook on h8$/,
    ],
  ];

  it.each(cases)("rejects %s", (_label, fen, expected) => {
    expect(() => parseFen(fen)).toThrow(FenError);
    expect(() => parseFen(fen)).toThrow(expected);
  });

  it.each([
    "4k3/8/8/8/8/8/8/R3K3 w Q - 0 1",
    "r3k3/8/8/8/8/8/8/4K3 b q - 0 1",
    "4k2r/8/8/8/8/8/8/4K3 w k - 0 1",
    "4k3/8/8/8/P7/8/8/4K3 b - a3 0 1",
    "4k3/8/8/8/7P/8/8/4K3 b - h3 0 1",
    "8/8/8/4k3/2pP4/8/8/4K3 b - d3 0 1",
  ])("accepts the legal counterpart %s and round-trips it", (fen) => {
    expect(toFen(parseFen(fen))).toBe(fen);
  });
});

describe("FEN round-trip property — parseFen(toFen(p)) holds for every position parseFen returns", () => {
  const ACCEPTED = [
    ...PERFT_FENS,
    "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1",
    "r3k2r/8/8/8/8/8/8/R3K2R w Kq - 5 12",
    "8/8/8/8/8/8/8/K1k5 b - - 0 1",
    "4k3/8/8/4p3/8/8/8/4K3 w - e6 0 2",
    `4k3/8/8/8/8/8/8/4K3 w - - ${Number.MAX_SAFE_INTEGER} ${Number.MAX_SAFE_INTEGER}`,
  ];

  it.each(ACCEPTED)("re-parses its own serialization byte-identically: %s", (fen) => {
    const serialized = toFen(parseFen(fen));
    expect(() => parseFen(serialized)).not.toThrow();
    expect(toFen(parseFen(serialized))).toBe(serialized);
  });
});

/**
 * ADR-0033 decision 2: `parseFenGrammarOnly` exists for rules-core tests only. No production module
 * may name it — every production FEN path goes through the validating `parseFen`.
 */
describe("parseFenGrammarOnly guard — no production module names it", () => {
  it("is absent from every src/*.ts except fen.ts and the tests", () => {
    const directory = new URL(".", import.meta.url).pathname;
    const offenders = readdirSync(directory)
      .filter((name) => name.endsWith(".ts") && !name.endsWith(".test.ts") && name !== "fen.ts")
      .filter((name) =>
        readFileSync(`${directory}${name}`, "utf8").includes("parseFenGrammarOnly"),
      );
    expect(offenders).toEqual([]);
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
