import { describe, expect, it } from "vitest";
import { parseFen } from "./fen.ts";
import {
  FLAG_CASTLE,
  FLAG_EN_PASSANT,
  FLAG_PROMOTION,
  generateMoves,
  isSquareAttackedBy,
  type Move,
} from "./moves.ts";
import {
  BISHOP,
  BLACK,
  EMPTY,
  emptyPosition,
  KING,
  KNIGHT,
  PAWN,
  type Position,
  parseSquareName,
  QUEEN,
  ROOK,
  squareName,
} from "./position.ts";

const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/**
 * Places pieces on an otherwise empty board. Deliberately bypasses parseFen: the
 * isolated-piece cases the ticket specifies (a lone rook on d4) are not legal FENs,
 * because parseFen requires exactly one king per side.
 */
function boardWith(pieces: Record<string, number>, blackToMove = false): Position {
  const position = emptyPosition();
  for (const [name, piece] of Object.entries(pieces)) {
    position.board[parseSquareName(name)] = piece;
  }
  position.blackToMove = blackToMove;
  return position;
}

/** Destination squares of every move from `square`, as algebraic names. */
function targetsFrom(moves: Move[], square: string): string[] {
  const from = parseSquareName(square);
  return moves.filter((move) => move.from === from).map((move) => squareName(move.to));
}

// ---------------------------------------------------------------------------
// Acceptance — the five Given/When/Then criteria on ABC-002, one assertion each.
// These assert the observable outcome. The unit block below asserts the logic
// beneath it and does not re-assert these counts.
// ---------------------------------------------------------------------------

describe("ABC-002 acceptance", () => {
  it("returns exactly 20 moves from the starting position", () => {
    expect(generateMoves(parseFen(START_FEN))).toHaveLength(20);
  });

  it("returns exactly 14 moves for a lone rook on d4", () => {
    expect(generateMoves(boardWith({ d4: ROOK }))).toHaveLength(14);
  });

  it("returns exactly 2 moves for a knight on a1 — no edge wrapping", () => {
    expect(generateMoves(boardWith({ a1: KNIGHT }))).toHaveLength(2);
  });

  it("stops a rook's ray before a friendly piece and on an enemy piece", () => {
    const moves = generateMoves(boardWith({ d4: ROOK, d6: PAWN, b4: PAWN | BLACK }));
    const targets = targetsFrom(moves, "d4");

    expect(targets).toContain("d5");
    expect(targets).not.toContain("d6");
    expect(targets).not.toContain("d7");
    expect(targets).toContain("b4");
    expect(targets).not.toContain("a4");
  });

  it("blocks the double push when the single push is blocked", () => {
    const targets = targetsFrom(generateMoves(boardWith({ e2: PAWN, e3: PAWN | BLACK })), "e2");

    expect(targets).not.toContain("e3");
    expect(targets).not.toContain("e4");
  });
});

// ---------------------------------------------------------------------------
// Unit — the logic beneath the acceptance outcomes: per-piece offsets, edge
// masking, colour handling, and the fields carried on a Move.
// ---------------------------------------------------------------------------

describe("pawns", () => {
  it("pushes one or two squares from the starting rank", () => {
    expect(targetsFrom(generateMoves(boardWith({ e2: PAWN })), "e2").sort()).toEqual(["e3", "e4"]);
  });

  it("pushes only one square away from the starting rank", () => {
    expect(targetsFrom(generateMoves(boardWith({ e3: PAWN })), "e3")).toEqual(["e4"]);
  });

  it("captures diagonally forward but not straight ahead", () => {
    const position = boardWith({ e4: PAWN, d5: PAWN | BLACK, e5: PAWN | BLACK, f5: PAWN });

    expect(targetsFrom(generateMoves(position), "e4")).toEqual(["d5"]);
  });

  it("moves down the board for black, from black's starting rank", () => {
    expect(targetsFrom(generateMoves(boardWith({ e7: PAWN | BLACK }, true)), "e7").sort()).toEqual([
      "e5",
      "e6",
    ]);
  });

  it("does not capture around the edge of the board", () => {
    // a4's up-left diagonal lands in 0x88's off-board half; a wrapped capture would
    // reappear on the h-file, which is the bug this pins down.
    expect(targetsFrom(generateMoves(boardWith({ a4: PAWN })), "a4")).toEqual(["a5"]);
  });
});

describe("knights", () => {
  it("reaches all eight squares from the centre", () => {
    expect(generateMoves(boardWith({ d4: KNIGHT }))).toHaveLength(8);
  });

  it("does not land on a friendly piece", () => {
    expect(targetsFrom(generateMoves(boardWith({ a1: KNIGHT, b3: PAWN })), "a1")).toEqual(["c2"]);
  });
});

describe("sliding pieces", () => {
  it("gives a lone bishop on d4 thirteen moves", () => {
    expect(generateMoves(boardWith({ d4: BISHOP }))).toHaveLength(13);
  });

  it("gives a lone queen on d4 twenty-seven moves", () => {
    expect(generateMoves(boardWith({ d4: QUEEN }))).toHaveLength(27);
  });

  it("stops a bishop's diagonal at the board edge without wrapping", () => {
    expect(targetsFrom(generateMoves(boardWith({ h1: BISHOP })), "h1").sort()).toEqual([
      "a8",
      "b7",
      "c6",
      "d5",
      "e4",
      "f3",
      "g2",
    ]);
  });
});

describe("king", () => {
  it("reaches the eight adjacent squares from the centre", () => {
    expect(generateMoves(boardWith({ d4: KING }))).toHaveLength(8);
  });

  it("reaches only three squares from a corner", () => {
    expect(targetsFrom(generateMoves(boardWith({ a1: KING })), "a1").sort()).toEqual([
      "a2",
      "b1",
      "b2",
    ]);
  });
});

describe("side to move", () => {
  it("generates moves only for the side to move", () => {
    const position = boardWith({ e2: PAWN, e7: PAWN | BLACK });

    expect(generateMoves(position).every((move) => move.piece === PAWN)).toBe(true);
  });
});

// QE probes: gaps the acceptance criteria leave open. Each one is a place where a
// bug could hide behind a green suite, not a restatement of a criterion above.
describe("QE edge probes", () => {
  it("returns exactly 20 moves from the starting position for black too", () => {
    // The acceptance criterion only pins White. Colour asymmetry lives in the pawn
    // direction and starting rank, so the mirror is where a one-sided bug survives.
    expect(generateMoves(parseFen(START_FEN.replace(" w ", " b ")))).toHaveLength(20);
  });

  it("returns exactly 2 moves for a knight on h1 — the high-file corner", () => {
    // a1 is covered above. In 0x88 the off-board band sits on the high-file side,
    // so an h-file wrap is the failure the a-file case cannot catch.
    expect(targetsFrom(generateMoves(boardWith({ h1: KNIGHT })), "h1").sort()).toEqual([
      "f2",
      "g3",
    ]);
  });

  it("stops on an enemy in all eight directions at once", () => {
    const ring = ["c3", "c4", "c5", "d3", "d5", "e3", "e4", "e5"];
    const position = boardWith({ d4: QUEEN });
    for (const square of ring) position.board[parseSquareName(square)] = PAWN | BLACK;

    const moves = generateMoves(position).filter((move) => move.from === parseSquareName("d4"));

    expect(moves).toHaveLength(8);
    expect(moves.every((move) => move.captured === (PAWN | BLACK))).toBe(true);
  });
});

describe("the move record", () => {
  it("records the captured piece on a capture and leaves the slot empty otherwise", () => {
    const moves = generateMoves(boardWith({ d4: ROOK, d5: PAWN | BLACK }));
    const to = (square: string) => moves.find((move) => move.to === parseSquareName(square));

    expect(to("d5")).toMatchObject({
      from: parseSquareName("d4"),
      piece: ROOK,
      captured: PAWN | BLACK,
      flags: 0,
    });
    expect(to("c4")).toMatchObject({ piece: ROOK, captured: EMPTY, flags: 0 });
  });
});

// ---------------------------------------------------------------------------
// ABC-004 acceptance — special-move GENERATION. The apply.test.ts sibling block
// covers the make/unmake side; these assert which special moves appear (and, for
// castling, which are correctly withheld). Destinations of castling moves name the
// castle: g1/g8 kingside, c1/c8 queenside.
// ---------------------------------------------------------------------------

const CASTLE_FEN = "r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1";

/** Destination names of the FLAG_CASTLE moves in a list, sorted. */
function castleTargets(moves: Move[]): string[] {
  return moves
    .filter((move) => (move.flags & FLAG_CASTLE) !== 0)
    .map((move) => squareName(move.to))
    .sort();
}

describe("ABC-004 acceptance — castling generation", () => {
  it("offers both castles for White when the ranks are clear and unattacked", () => {
    expect(castleTargets(generateMoves(parseFen(CASTLE_FEN)))).toEqual(["c1", "g1"]);
  });

  it("withholds queenside but keeps kingside when b1 is occupied", () => {
    // A knight on b1 blocks queenside (b1 must be empty) but leaves kingside clear.
    expect(castleTargets(generateMoves(parseFen("r3k2r/8/8/8/8/8/8/RN2K2R w KQkq - 0 1")))).toEqual(
      ["g1"],
    );
  });

  it("withholds kingside when the king would pass through an attacked square", () => {
    // A black rook on f8 rakes the open f-file, attacking f1 — a square the king crosses.
    const targets = castleTargets(generateMoves(parseFen("4kr2/8/8/8/8/8/8/R3K2R w KQ - 0 1")));
    expect(targets).not.toContain("g1");
    expect(targets).toContain("c1");
  });

  it("withholds every castle while the king is in check", () => {
    // A black rook on e8 checks the white king down the open e-file; e1 is attacked.
    expect(castleTargets(generateMoves(parseFen("4r1k1/8/8/8/8/8/8/R3K2R w KQ - 0 1")))).toEqual(
      [],
    );
  });
});

describe("ABC-004 acceptance — en passant and promotion generation", () => {
  it("offers the en-passant capture exactly onto the ep target square", () => {
    // White pawn e5, black pawn d5, ep target d6 — exd6 is available.
    const moves = generateMoves(parseFen("4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1"));
    const ep = moves.filter((move) => (move.flags & FLAG_EN_PASSANT) !== 0);

    expect(ep).toHaveLength(1);
    expect(squareName((ep[0] as Move).to)).toBe("d6");
    expect((ep[0] as Move).captured).toBe(PAWN | BLACK);
  });

  it("offers no en-passant capture once the one-move window is gone", () => {
    // Same pieces, but no ep target set — the capture is not available.
    const moves = generateMoves(parseFen("4k3/8/8/3pP3/8/8/8/4K3 w - - 0 1"));
    expect(moves.filter((move) => (move.flags & FLAG_EN_PASSANT) !== 0)).toHaveLength(0);
  });

  it("generates exactly four promotions, one per piece, for a pawn reaching the last rank", () => {
    const toE8 = generateMoves(parseFen("7k/4P3/8/8/8/8/8/4K3 w - - 0 1")).filter(
      (move) => move.to === parseSquareName("e8"),
    );

    expect(toE8).toHaveLength(4);
    expect(toE8.every((move) => (move.flags & FLAG_PROMOTION) !== 0)).toBe(true);
    expect(toE8.map((move) => move.promotion).sort()).toEqual([KNIGHT, BISHOP, ROOK, QUEEN].sort());
  });
});

describe("ABC-004 — attack detection", () => {
  it("sees a rook attacking along its open file and rank, and colours it correctly", () => {
    const position = parseFen("4k3/8/8/8/8/8/8/R3K3 w - - 0 1"); // white rook a1, white king e1
    expect(isSquareAttackedBy(position, parseSquareName("a8"), false)).toBe(true); // up the open a-file
    expect(isSquareAttackedBy(position, parseSquareName("d1"), false)).toBe(true); // along rank 1, before the king
    expect(isSquareAttackedBy(position, parseSquareName("h1"), false)).toBe(false); // the e1 king blocks the rank
    expect(isSquareAttackedBy(position, parseSquareName("a8"), true)).toBe(false); // not by Black
    expect(isSquareAttackedBy(position, parseSquareName("b2"), false)).toBe(false);
  });

  it("sees pawn and knight attacks in the attacker's own direction", () => {
    // Black pawn d5 attacks c4/e4; black knight g8 attacks f6.
    const position = parseFen("4k1n1/8/8/3p4/8/8/8/4K3 w - - 0 1");
    expect(isSquareAttackedBy(position, parseSquareName("c4"), true)).toBe(true);
    expect(isSquareAttackedBy(position, parseSquareName("e4"), true)).toBe(true);
    expect(isSquareAttackedBy(position, parseSquareName("c4"), false)).toBe(false);
    expect(isSquareAttackedBy(position, parseSquareName("f6"), true)).toBe(true);
  });

  it("sees a bishop raking a diagonal, but not a square off it", () => {
    // A black bishop on a8 rakes the long light diagonal a8–h1.
    const position = parseFen("b3k3/8/8/8/8/8/8/4K3 w - - 0 1");
    expect(isSquareAttackedBy(position, parseSquareName("h1"), true)).toBe(true);
    expect(isSquareAttackedBy(position, parseSquareName("d5"), true)).toBe(true);
    expect(isSquareAttackedBy(position, parseSquareName("a1"), true)).toBe(false); // on the file, not the diagonal
  });

  it("lets a blocker stop a sliding attack", () => {
    // A white pawn on a4 blocks the a1 rook: a8 is unreachable, a3 still attacked.
    const position = parseFen("4k3/8/8/8/P7/8/8/R3K3 w - - 0 1");
    expect(isSquareAttackedBy(position, parseSquareName("a8"), false)).toBe(false);
    expect(isSquareAttackedBy(position, parseSquareName("a3"), false)).toBe(true);
  });
});
