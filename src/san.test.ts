/**
 * ABC-013 — the acceptance table for `toSan`, transcribed from the ticket.
 *
 * The ticket's `## Test notes` fix this file's shape and it is not a free choice: a table of
 * `(fen, move, expected)` triples, every expected string TYPED BY HAND from its FEN, and every
 * `Move` obtained from `legalMoves(position)` and selected by `(from, to, promotion)` — never a
 * hand-built `Move` object literal. `ADR-0004` clause 2b is the reason for the last one: `EPIC-003`
 * adds `parseSan` to `src/san.ts` and owns the identity round-trip
 * `parseSan(position, toSan(position, move, legal), legal).move === move` over ONE shared legal
 * list, so these rows are shaped to be EXTENDED by that hop rather than rebuilt.
 *
 * NOTHING HERE COMPUTES AN EXPECTATION. A test that derives the expected string with the same
 * disambiguation logic it is testing proves nothing, and the ticket forbids it in as many words.
 * The 18 FENs were independently verified on merged `main` (they parse, round-trip through `toFen`
 * byte-identically, are legal positions, and contain every move named below); the 52 expected
 * strings were NOT independently verified when this file was written, and that limit is recorded in
 * the task's shared context rather than hidden here.
 *
 * The criterion ids (`A1`…`A20`) are the ticket's. `A21` (the cost bars) is `san.nfr.test.ts` and
 * the Security/NFR gate's out-of-tree measurement; `A22` (the suite) is the gate itself.
 *
 * The second describe below is the INNER layer and is deliberately not a re-assertion of any row:
 * two table-free properties over a wide corpus, which is the one kind of check a hand-typed oracle
 * cannot supply. If every expected string in the table were wrong in the same direction, the table
 * would still be self-consistent and green — the injectivity property would not be.
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { makeMove, unmakeMove } from "./apply.ts";
import { parseFen, toFen } from "./fen.ts";
import { legalMoves } from "./legal.ts";
import type { Move } from "./moves.ts";
import { BISHOP, EMPTY, KNIGHT, type Position, parseSquareName, QUEEN, ROOK } from "./position.ts";
import { toSan } from "./san.ts";

/** The 18 named positions of `ABC-013`'s acceptance table, verbatim. */
const POSITIONS = {
  "P-START": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  "P-CASTLE": "r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1",
  "P-FILE-SR": "4k3/8/8/8/8/8/8/1N1NK3 w - - 0 1",
  "P-FILE-PREC": "4k3/8/8/3N4/8/8/8/1N2K3 w - - 0 1",
  "P-RANK": "4k3/8/8/2N5/8/2N5/8/4K3 w - - 0 1",
  "P-QUEENS": "6k1/8/8/8/4Q2Q/8/8/K6Q w - - 0 1",
  "P-PIN": "3r3k/8/8/8/8/6N1/3N4/3K4 w - - 0 1",
  "P-PAWNX": "4k3/8/8/3p4/4P3/8/8/4K3 w - - 0 1",
  "P-EP": "4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1",
  "P-PIECEX": "4k3/8/8/4p3/8/5N2/8/4K3 w - - 0 1",
  "P-LETTERS": "4k3/8/8/8/8/8/8/R1BQK1NR w KQ - 0 1",
  "P-PROMO": "3r4/4P3/8/8/8/8/8/K6k w - - 0 1",
  "P-CHECK": "4k3/8/8/8/8/8/8/R3K3 w - - 0 1",
  "P-MATE": "6k1/5ppp/8/8/8/8/8/R5K1 w - - 0 1",
  "P-PROMOMATE": "6k1/P4ppp/8/8/8/8/8/6K1 w - - 0 1",
  "P-CASTLECHK": "5k2/8/8/8/8/8/8/4K2R w K - 0 1",
  "P-CASTLECHKQ": "3k4/8/8/8/8/8/8/R3K3 w Q - 0 1",
  "P-STALE": "7k/8/8/8/6Q1/8/8/K7 w - - 0 1",
} as const;

type PositionId = keyof typeof POSITIONS;

/**
 * One row of the table: a named position, the move by `from`-`to`(`-promotion`), and the exact
 * string. `promotion` is omitted on an ordinary move, where the generator writes EMPTY.
 */
type Row = readonly [
  id: PositionId,
  from: string,
  to: string,
  expected: string,
  promotion?: number,
];

/**
 * The move `from`-`to`(`-promotion`) TAKEN OUT OF `legalMoves(position)` — the ticket's rule 1 and
 * `ADR-0004` clause 2b. Asserts the triple names EXACTLY ONE legal move before returning it, so a
 * row that silently selects the wrong move (or none) fails here rather than in an expected string.
 */
function moveFor(position: Position, from: string, to: string, promotion = EMPTY): Move {
  const fromSquare = parseSquareName(from);
  const toSquare = parseSquareName(to);
  const matches = legalMoves(position).filter(
    (move) => move.from === fromSquare && move.to === toSquare && move.promotion === promotion,
  );

  expect(matches, `${from}-${to} must name exactly one legal move`).toHaveLength(1);
  return matches[0] as Move;
}

/** Asserts every row of one criterion, labelled so a failure names the row rather than the criterion. */
function expectRows(rows: readonly Row[]): void {
  for (const [id, from, to, expected, promotion] of rows) {
    const position = parseFen(POSITIONS[id]);
    const move = moveFor(position, from, to, promotion);
    expect(toSan(position, move), `${id} ${from}-${to}`).toBe(expected);
  }
}

/** `A1`'s exhaustive set — the 20 legal moves of the start position, as the ticket lists them. */
const A1_STRINGS = [
  "a3",
  "a4",
  "b3",
  "b4",
  "c3",
  "c4",
  "d3",
  "d4",
  "e3",
  "e4",
  "f3",
  "f4",
  "g3",
  "g4",
  "h3",
  "h4",
  "Na3",
  "Nc3",
  "Nf3",
  "Nh3",
] as const;

// ---------------------------------------------------------------------------
// Acceptance — the 20 in-suite criteria of ABC-013, one `it` per criterion.
// ---------------------------------------------------------------------------

describe("ABC-013 acceptance", () => {
  it("A1 — the base case, exhaustively: the 20 start-position moves as an exact set", () => {
    const position = parseFen(POSITIONS["P-START"]);
    const legal = legalMoves(position);

    const rendered = legal.map((move) => toSan(position, move, legal));

    expect([...rendered].sort()).toEqual([...A1_STRINGS].sort());
  });

  it("A2 — the piece letters, one quiet move each", () => {
    expectRows([
      ["P-LETTERS", "a1", "a3", "Ra3"],
      ["P-LETTERS", "c1", "d2", "Bd2"],
      ["P-LETTERS", "d1", "d2", "Qd2"],
      ["P-LETTERS", "g1", "f3", "Nf3"],
      ["P-LETTERS", "e1", "f2", "Kf2"],
    ]);
  });

  it("A3 — castling, and a rook capture that gives check", () => {
    expectRows([
      ["P-CASTLE", "e1", "g1", "O-O"],
      ["P-CASTLE", "e1", "c1", "O-O-O"],
      ["P-CASTLE", "h1", "f1", "Rf1"],
      ["P-CASTLE", "a1", "a8", "Rxa8+"],
    ]);
  });

  it("A4 — file disambiguation, and that the file is PREFERRED over the rank", () => {
    expectRows([
      ["P-FILE-PREC", "b1", "c3", "Nbc3"],
      ["P-FILE-PREC", "d5", "c3", "Ndc3"],
      ["P-FILE-SR", "b1", "c3", "Nbc3"],
      ["P-FILE-SR", "d1", "c3", "Ndc3"],
    ]);
  });

  it("A5 — rank disambiguation, used only because the file cannot separate them", () => {
    expectRows([
      ["P-RANK", "c3", "e4", "N3e4"],
      ["P-RANK", "c5", "e4", "N5e4"],
    ]);
  });

  it("A6 — the whole ladder, in one position", () => {
    expectRows([
      ["P-QUEENS", "e4", "e1", "Qee1"],
      ["P-QUEENS", "h1", "e1", "Q1e1"],
      ["P-QUEENS", "h4", "e1", "Qh4e1"],
    ]);
  });

  it("A7 — disambiguation is decided against LEGAL moves, not reachable ones", () => {
    expectRows([["P-PIN", "g3", "e4", "Ne4"]]);
  });

  it("A8 — disambiguation is same-piece-type only", () => {
    expectRows([
      ["P-FILE-SR", "b1", "d2", "Nd2"],
      ["P-FILE-SR", "e1", "d2", "Kd2"],
      ["P-LETTERS", "c1", "d2", "Bd2"],
      ["P-LETTERS", "d1", "d2", "Qd2"],
    ]);
  });

  it("A9 — pawn capture and pawn push, from the same pawn", () => {
    expectRows([
      ["P-PAWNX", "e4", "d5", "exd5"],
      ["P-PAWNX", "e4", "e5", "e5"],
    ]);
  });

  it("A10 — en passant is a pawn capture, onto an EMPTY square", () => {
    expectRows([
      ["P-EP", "e5", "d6", "exd6"],
      ["P-EP", "e5", "e6", "e6"],
    ]);
  });

  it("A11 — piece captures carry `x` and no origin file", () => {
    expectRows([
      ["P-PIECEX", "f3", "e5", "Nxe5"],
      ["P-PIECEX", "f3", "d4", "Nd4"],
    ]);
  });

  it("A12 — promotion, all four pieces, push and capture", () => {
    expectRows([
      ["P-PROMO", "e7", "e8", "e8=Q", QUEEN],
      ["P-PROMO", "e7", "e8", "e8=R", ROOK],
      ["P-PROMO", "e7", "e8", "e8=B", BISHOP],
      ["P-PROMO", "e7", "e8", "e8=N", KNIGHT],
      ["P-PROMO", "e7", "d8", "exd8=Q", QUEEN],
      ["P-PROMO", "e7", "d8", "exd8=R", ROOK],
      ["P-PROMO", "e7", "d8", "exd8=B", BISHOP],
      ["P-PROMO", "e7", "d8", "exd8=N", KNIGHT],
    ]);
  });

  it("A13 — check", () => {
    expectRows([["P-CHECK", "a1", "a8", "Ra8+"]]);
  });

  it("A14 — mate", () => {
    expectRows([["P-MATE", "a1", "a8", "Ra8#"]]);
  });

  it("A15 — promotion mate, and the suffix order", () => {
    expectRows([
      ["P-PROMOMATE", "a7", "a8", "a8=Q#", QUEEN],
      ["P-PROMOMATE", "a7", "a8", "a8=R#", ROOK],
      ["P-PROMOMATE", "a7", "a8", "a8=B", BISHOP],
      ["P-PROMOMATE", "a7", "a8", "a8=N", KNIGHT],
    ]);
  });

  it("A16 — a castle can give check, so the suffix is not skipped by the castle branch", () => {
    expectRows([
      ["P-CASTLECHK", "e1", "g1", "O-O+"],
      ["P-CASTLECHK", "h1", "f1", "Rf1+"],
      ["P-CASTLECHKQ", "e1", "c1", "O-O-O+"],
    ]);
  });

  it("A17 — stalemate is not mate", () => {
    expectRows([
      ["P-STALE", "g4", "g6", "Qg6"],
      ["P-STALE", "g4", "g7", "Qg7+"],
    ]);
  });

  it("A18 — purity: `toFen` is byte-identical across every call, in both forms", () => {
    for (const [id, fen] of Object.entries(POSITIONS)) {
      const position = parseFen(fen);
      const legal = legalMoves(position);

      for (const move of legal) {
        toSan(position, move, legal);
        expect(toFen(position), `${id} with the legal list`).toBe(fen);

        toSan(position, move);
        expect(toFen(position), `${id} without the legal list`).toBe(fen);
      }
    }
  });

  it("A19 — the `legal` argument changes nothing but cost", () => {
    for (const [id, fen] of Object.entries(POSITIONS)) {
      const position = parseFen(fen);
      const legal = legalMoves(position);

      for (const move of legal) {
        const supplied = toSan(position, move, legal);
        const computed = toSan(position, move);
        expect(supplied, `${id} ${supplied} / ${computed}`).toBe(computed);
      }
    }
  });

  it("A20 — the module surface: one export, four imports, and no `parseSan` foreclosure", async () => {
    const namespace = await import("./san.ts");
    expect(Object.keys(namespace)).toEqual(["toSan"]);

    const source = readFileSync(new URL("./san.ts", import.meta.url), "utf8");
    const specifiers = [...source.matchAll(/\bfrom "([^"]+)"/g)].map((match) => match[1] as string);

    expect([...new Set(specifiers)].sort()).toEqual([
      "./apply.ts",
      "./legal.ts",
      "./moves.ts",
      "./position.ts",
    ]);
  });
});

// ---------------------------------------------------------------------------
// The logic beneath the table. Two properties that hold for ANY position, over
// a corpus nobody typed expectations for — the check a hand-built oracle cannot
// be. Neither re-asserts a row above; both would survive a wrong table.
// ---------------------------------------------------------------------------

/** The six standard perft positions — the project's widest spread of legal positions. */
const PERFT_FENS = [
  POSITIONS["P-START"],
  "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1",
  "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1",
  "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8",
  "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
] as const;

/**
 * The six perft positions and every position one legal move away from them. Both colours, every
 * special move, both castle forms, checks and pins — none of it hand-picked for SAN.
 */
function corpus(): Position[] {
  const positions: Position[] = [];

  for (const fen of PERFT_FENS) {
    const position = parseFen(fen);
    positions.push(parseFen(fen));

    for (const move of legalMoves(position)) {
      const undo = makeMove(position, move);
      positions.push(parseFen(toFen(position)));
      unmakeMove(position, move, undo);
    }
  }

  return positions;
}

/**
 * The shape of a SAN move: a castle, a piece move with an optional file and/or rank qualifier, or
 * a pawn move with an optional origin file and promotion piece — each with an optional suffix.
 * A shape check, not a validator: it cannot tell `Nbd2` from `Ncd2`, and it is not asked to.
 */
const SAN_SHAPE =
  /^(?:O-O(?:-O)?|[KQRBN][a-h]?[1-8]?x?[a-h][1-8]|[a-h](?:x[a-h])?[1-8](?:=[QRBN])?)[+#]?$/;

describe("toSan — the logic beneath the table", () => {
  it("gives every legal move of a position a DISTINCT string", () => {
    // This is what disambiguation is FOR, stated without naming a single expected string: two
    // legal moves that render alike are a move a reader — and EPIC-003's parser — cannot name.
    // It falsifies an under-qualifying build on positions nobody chose for it.
    for (const position of corpus()) {
      const legal = legalMoves(position);
      const rendered = legal.map((move) => toSan(position, move, legal));

      expect(new Set(rendered).size, `${toFen(position)} → ${rendered.join(" ")}`).toBe(
        legal.length,
      );
    }
  });

  it("emits only strings of the SAN grammar", () => {
    for (const position of corpus()) {
      const legal = legalMoves(position);

      for (const move of legal) {
        const san = toSan(position, move, legal);
        expect(SAN_SHAPE.test(san), `${toFen(position)} → ${san}`).toBe(true);
      }
    }
  });
});
