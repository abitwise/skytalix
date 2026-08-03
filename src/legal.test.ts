import { describe, expect, it } from "vitest";
import { makeMove, unmakeMove } from "./apply.ts";
import { parseFen, toFen } from "./fen.ts";
import { hasLegalEnPassant, isInCheck, legalMoves } from "./legal.ts";
import { FLAG_EN_PASSANT, generateMoves, isSquareAttackedBy } from "./moves.ts";
import { BLACK, KING, type Position, parseSquareName } from "./position.ts";

const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/** The six standard perft positions — the widest spread of legal positions to drive the property test over. */
const PERFT_POSITIONS: ReadonlyArray<readonly [name: string, fen: string]> = [
  ["start", START_FEN],
  ["kiwipete", "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1"],
  ["position-3", "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1"],
  ["position-4", "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1"],
  ["position-5", "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8"],
  ["position-6", "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10"],
];

/** The 0x88 square of a side's king — a local copy so the test does not lean on legal.ts internals. */
function kingSquare(position: Position, black: boolean): number {
  const king = KING | (black ? BLACK : 0);
  for (let square = 0; square < 128; square++) {
    if (position.board[square] === king) return square;
  }
  throw new Error("no king");
}

// ---------------------------------------------------------------------------
// Acceptance — the six Given/When/Then criteria on ABC-005. Each asserts the
// observable outcome (a count, an absence, the nature of every returned move).
// ---------------------------------------------------------------------------

describe("ABC-005 acceptance", () => {
  it("returns exactly 20 legal moves from the starting position", () => {
    expect(legalMoves(parseFen(START_FEN))).toHaveLength(20);
  });

  it("returns no move for an absolutely pinned knight", () => {
    // White knight e2 shields the e1 king from the e8 rook; every knight move exposes the king.
    const moves = legalMoves(parseFen("k3r3/8/8/8/8/8/4N3/4K3 w - - 0 1"));
    expect(moves.some((move) => move.from === parseSquareName("e2"))).toBe(false);
    // The king itself can still step off the file.
    expect(moves.some((move) => move.from === parseSquareName("e1"))).toBe(true);
  });

  it("in check from a rook, returns only captures, blocks, or king moves — nothing else", () => {
    // Black rook e8 checks down the open e-file; the a5 rook can interpose on e5, or the king moves.
    const position = parseFen("4r2k/8/8/R7/8/8/8/4K3 w - - 0 1");
    const kingFrom = parseSquareName("e1");
    const checker = parseSquareName("e8");
    const blocks = ["e2", "e3", "e4", "e5", "e6", "e7"].map(parseSquareName);

    const moves = legalMoves(position);
    expect(moves.length).toBeGreaterThan(0);
    for (const move of moves) {
      const resolves = move.from === kingFrom || move.to === checker || blocks.includes(move.to);
      expect(resolves, `unexpected non-evasion: ${JSON.stringify(move)}`).toBe(true);
    }
  });

  it("in check from a knight, allows only captures or king moves — a knight check cannot be blocked", () => {
    // Black knight d3 checks the e1 king. No piece can interpose on a knight check.
    const moves = legalMoves(parseFen("4k3/8/8/8/8/3n4/8/4K3 w - - 0 1"));
    expect(moves.length).toBeGreaterThan(0);
    // Only the king can respond here; that no non-king move survives IS "no block appears".
    expect(moves.every((move) => move.from === parseSquareName("e1"))).toBe(true);
  });

  it("omits the en-passant capture when it would expose the king along the rank", () => {
    // Removing both the d5 and e5 pawns from the rank in one move bares the a5 king to the h5 rook.
    const moves = legalMoves(parseFen("7k/8/8/K2pP2r/8/8/8/8 w - d6 0 1"));
    expect(moves.some((move) => (move.flags & FLAG_EN_PASSANT) !== 0)).toBe(false);
  });

  it("never leaves the mover's own king in check, for every legal move on every perft position", () => {
    for (const [name, fen] of PERFT_POSITIONS) {
      const position = parseFen(fen);
      const moverIsBlack = position.blackToMove;

      for (const move of legalMoves(position)) {
        const undo = makeMove(position, move);
        const attacked = isSquareAttackedBy(
          position,
          kingSquare(position, moverIsBlack),
          !moverIsBlack,
        );
        expect(attacked, `${name}: ${JSON.stringify(move)} left the king in check`).toBe(false);
        unmakeMove(position, move, undo);
      }
    }
  });
});

// ---------------------------------------------------------------------------
// Unit — isInCheck and the filtering logic beneath the acceptance outcomes.
// ---------------------------------------------------------------------------

describe("isInCheck", () => {
  it("is false in the starting position", () => {
    expect(isInCheck(parseFen(START_FEN))).toBe(false);
  });

  it("is true when a rook gives check down an open file", () => {
    expect(isInCheck(parseFen("4r2k/8/8/8/8/8/8/4K3 w - - 0 1"))).toBe(true);
  });

  it("reports check for whichever side is to move", () => {
    // Same geometry mirrored: white rook e1 checks the black king on e8.
    expect(isInCheck(parseFen("4k3/8/8/8/8/8/8/4R1K1 b - - 0 1"))).toBe(true);
  });
});

// QE probes: the diagonal pin, the king that may not walk into check, and the check that a
// capture resolves — paths the rook-pin and knight-check acceptance cases leave open.
describe("ABC-005 QE edge probes", () => {
  it("pins a bishop to its diagonal — it may slide along the pin but never leave it", () => {
    // White bishop d2 shields the e1 king from the a5 bishop along the a5–e1 diagonal.
    const fromD2 = legalMoves(parseFen("k7/8/8/b7/8/8/3B4/4K3 w - - 0 1"))
      .filter((move) => move.from === parseSquareName("d2"))
      .map((move) => move.to);
    // Legal only along the pin: c3, b4, or a5 (capturing the pinner). Never e3/f4/c1 off the line.
    const onPin = ["c3", "b4", "a5"].map(parseSquareName);
    expect(fromD2.length).toBeGreaterThan(0);
    expect(fromD2.every((to) => onPin.includes(to))).toBe(true);
    expect(fromD2).not.toContain(parseSquareName("e3"));
  });

  it("forbids the king from stepping onto an attacked square", () => {
    // Black rook d8 rakes the d-file; the white king on e1 may not step to d1 or d2.
    const moves = legalMoves(parseFen("3r3k/8/8/8/8/8/8/4K3 w - - 0 1"));
    const kingTargets = moves
      .filter((move) => move.from === parseSquareName("e1"))
      .map((move) => move.to);
    expect(kingTargets).not.toContain(parseSquareName("d1"));
    expect(kingTargets).not.toContain(parseSquareName("d2"));
    expect(kingTargets).toContain(parseSquareName("f2")); // an unattacked square is still allowed
  });

  it("lets a capture of the checker resolve the check", () => {
    // Black rook e2 checks the e1 king; the king captures it (it is undefended).
    const position = parseFen("4k3/8/8/8/8/8/4r3/4K3 w - - 0 1");
    const moves = legalMoves(position);
    const capture = moves.find((move) => move.to === parseSquareName("e2"));
    expect(capture).toBeDefined();
    expect(isInCheck(position)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// hasLegalEnPassant — ABC-011. The predicate src/zobrist.ts asks so that the key
// includes the en-passant file only when FIDE 9.2.3 says the position differs.
// `legalMoves(p).some(m => m.flags === FLAG_EN_PASSANT)` is its DEFINITION and its
// oracle; the cases below pin the two apart where a cheaper reading would diverge.
// ---------------------------------------------------------------------------

describe("hasLegalEnPassant — ABC-011", () => {
  it("is true when the ep capture is genuinely playable", () => {
    // White e5 takes d6 en passant; nothing pins the pawn.
    expect(hasLegalEnPassant(parseFen("4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1"))).toBe(true);
  });

  it("is false when no ep square is set", () => {
    expect(hasLegalEnPassant(parseFen("4k3/8/8/3pP3/8/8/8/4K3 w - - 0 1"))).toBe(false);
  });

  it("is false when the ep square is set but no pawn stands beside it", () => {
    // The position one ply after 1.e4: e3 is the target, but Black has nothing on d4 or f4.
    const afterE4 = "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1";
    expect(hasLegalEnPassant(parseFen(afterE4))).toBe(false);
  });

  it("is FALSE when the only ep capture is pseudo-legal but illegal — the strict FIDE reading", () => {
    // c5xd6 clears both c5 and d5 off rank 5 in one move and bares the a5 king to the h5
    // rook. Pseudo-legally the capture exists; FIDE 9.2.3's "possible moves" does not include
    // it, and this case is the whole difference between the two readings of "available".
    const position = parseFen("7k/8/8/K1Pp3r/8/8/8/8 w - d6 0 1");
    expect(hasLegalEnPassant(position)).toBe(false);
    // The generator does offer it, so the predicate is filtering rather than agreeing by luck.
    expect(generateMoves(position).some((m) => (m.flags & FLAG_EN_PASSANT) !== 0)).toBe(true);
  });

  it("agrees with legalMoves — its definition — on every shape above", () => {
    const fens = [
      "4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1",
      "4k3/8/8/3pP3/8/8/8/4K3 w - - 0 1",
      "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1",
      "7k/8/8/K1Pp3r/8/8/8/8 w - d6 0 1",
      "7k/8/8/K2pP2r/8/8/8/8 w - d6 0 1", // the legal.ts acceptance fixture: also illegal
      "rnbqkbnr/ppp1pppp/8/8/3pP3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1", // black d4 takes e3
    ];

    for (const fen of fens) {
      const position = parseFen(fen);
      const oracle = legalMoves(position).some((m) => (m.flags & FLAG_EN_PASSANT) !== 0);
      expect(hasLegalEnPassant(position), fen).toBe(oracle);
    }
  });

  it("leaves the position byte-identical across the call, on every shape above", () => {
    // The predicate plays a move and takes it back, so purity is a property to assert rather
    // than to assume — `legalMoves(...).some(...)` fails this on the second FEN (ABC-009).
    const fens = [
      "4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1",
      "4k3/8/8/3pP3/8/8/8/K7 w KQ d6 0 1", // castling rights with no rook — ABC-009's trigger
      "7k/8/8/K1Pp3r/8/8/8/8 w - d6 0 1",
      "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1",
    ];

    for (const fen of fens) {
      const position = parseFen(fen);
      const before = toFen(position);
      hasLegalEnPassant(position);
      expect(toFen(position), fen).toBe(before);
    }
  });
});

// ---------------------------------------------------------------------------
// ABC-011 QE edge probes. The predicate walks its two candidate from-squares in a fixed
// order (lower file first) and must keep looking when the first one's capture is illegal.
// Nothing above reaches that shape: over an exhaustive walk of the perft table at its own
// `fast` depths — 518,474 nodes — exactly TWO nodes have two pseudo-legal ep capturers at
// all, and in neither is the lower-file one illegal, so the property test cannot get there.
// Confirmed by mutation: replacing `if (legal) return true;` with `return legal;` left the
// whole delivered suite green while making the key COLLAPSE two positions FIDE calls
// different — an over-collapse, which is the unsafe error direction for a repetition key.
// ---------------------------------------------------------------------------

describe("ABC-011 QE edge probes", () => {
  it("keeps looking when the lower-file candidate capturer is pinned — white", () => {
    // Black just played d7-d5. c5xd6 e.p. is pinned by the c8 rook on the c-file; e5xd6 is
    // not, because the c5 pawn stays put and keeps that file blocked.
    const position = parseFen("2r4k/8/8/2PpP3/8/8/8/2K5 w - d6 0 1");
    const pseudo = generateMoves(position).filter((m) => (m.flags & FLAG_EN_PASSANT) !== 0);
    const legal = legalMoves(position).filter((m) => (m.flags & FLAG_EN_PASSANT) !== 0);

    expect(pseudo).toHaveLength(2); // both candidates exist, so the ORDER is what is tested
    expect(legal).toHaveLength(1);
    expect(legal[0]?.from).toBe(parseSquareName("e5")); // the SECOND candidate is the legal one
    expect(hasLegalEnPassant(position)).toBe(true);
  });

  it("keeps looking when the lower-file candidate capturer is pinned — black", () => {
    // The mirror, so the predicate's `black ? target + 16 : target - 16` branch is covered
    // by this shape too: c4xd3 is pinned by the c1 rook, e4xd3 is not.
    const position = parseFen("2k5/8/8/8/2pPp3/8/8/2R4K b - d3 0 1");
    const pseudo = generateMoves(position).filter((m) => (m.flags & FLAG_EN_PASSANT) !== 0);
    const legal = legalMoves(position).filter((m) => (m.flags & FLAG_EN_PASSANT) !== 0);

    expect(pseudo).toHaveLength(2);
    expect(legal).toHaveLength(1);
    expect(legal[0]?.from).toBe(parseSquareName("e4"));
    expect(hasLegalEnPassant(position)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// ABC-011 second pass — the probe move's PRECONDITION.
//
// `hasLegalEnPassant` synthesises its probe Move rather than taking one from the generator,
// and `unmakeMove` is an exact inverse only for a move that is well-formed FOR THIS BOARD:
// `undoSpecial` writes `move.captured` back onto the capture square unconditionally, so where
// the board never held that pawn the "restore" is a permanent CREATION. Ruled at the second
// design hop (ticket, `### ANSWERED 2026-08-03`) after the project owner declined to merge
// carrying it: purity is UNCONDITIONAL, it is bought with a precondition rather than with a
// change to what the predicate means, and the answer off that domain is SPECIFIED — `false`,
// touching nothing — because `generateMoves` is itself unsound there and the oracle cannot be
// the authority on a class it gets wrong.
//
// TWO guards, and neither subsumes the other. Every row names the guard whose removal it
// kills. The last two are the shapes where the shipped predicate was already byte-PURE and
// only its ANSWER was wrong, which is why the empty-target guard cannot be dropped as
// "already covered by the purity one".
// ---------------------------------------------------------------------------

/** Positions whose board CONTRADICTS their en-passant square — the class the ruling specifies. */
const CONTRADICTORY_EP: [label: string, fen: string][] = [
  // The ep target is EMPTY on these three, so the empty-target guard passes cleanly and only
  // the captured-pawn guard stops the probe. Each one corrupts without it, permanently.
  ["no pawn to capture at all", "4k3/8/8/4P3/8/8/8/4K3 w - d6 0 1"],
  ["a WHITE pawn where the captured black one should be", "4k3/8/8/3PP3/8/8/8/4K3 w - d6 0 1"],
  ["an ep square on the wrong rank for the side to move", "4k3/8/8/8/8/8/1P6/4K3 w - a3 0 1"],
  // Target occupied AND the pawn to take absent — either guard alone closes this one.
  ["a white pawn standing ON the ep target", "4k3/8/8/8/3p4/4P3/8/4K3 b - e3 0 1"],
  // The captured pawn IS present here, so make/unmake round-trips byte-exactly and the shipped
  // predicate is PURE — only the answer is wrong, because `generateMoves` reads an occupied ep
  // target as an ordinary capture and never offers the ep move. NOTHING but the empty-target
  // guard closes these two.
  ["the ep target occupied by an enemy knight", "4k3/8/8/8/3pP3/4N3/8/4K3 b - e3 0 1"],
  ["the same, mirrored", "4k3/8/3n4/3pP3/8/8/8/4K3 w - d6 0 1"],
];

/**
 * The FULL state of a Position: all 128 board bytes — the off-board ones included — and every
 * scalar. `toFen` sees neither an off-board write (the ABC-011 Security/NFR gate found a mutant
 * that left a stray pawn on square 15) nor the counters, so purity is compared over the whole
 * object rather than through a serialization of the playable squares.
 */
function fullState(position: Position): string {
  return [
    position.board.join(","),
    position.blackToMove,
    position.castling,
    position.epSquare,
    position.halfmoveClock,
    position.fullmoveNumber,
  ].join("|");
}

describe("hasLegalEnPassant — ABC-011 the probe's precondition", () => {
  it.each(CONTRADICTORY_EP)("answers false and touches nothing (%s)", (_label, fen) => {
    const position = parseFen(fen);
    const before = fullState(position);

    expect(hasLegalEnPassant(position), fen).toBe(false);
    expect(fullState(position), fen).toBe(before);
  });

  it("is pure for EVERY ep square value, not merely the reachable ones", () => {
    // The bar this fix is held to is unconditional, so it is asserted over the whole input
    // space rather than over a handful of FENs: every 0x88 index including the 64 off-board
    // ones, plus values outside the array entirely. This subsumes the two boundary probes the
    // design hop named — a1 on the third board is "an ep square on no ep rank" (kills nothing,
    // and is here as documentation of the boundary rather than as coverage), a3 on that same
    // board is the fourth reproduction. The NO_SQUARE (-1) input is the predicate's own early
    // return and is pinned by "is false when no ep square is set" above and by
    // src/zobrist.nfr.test.ts; every OTHER value is swept here.
    const boards = [
      "4k3/8/8/3pP3/8/8/8/4K3 w - - 0 1", // a real ep pair, white to move
      "4k3/8/8/3pP3/8/8/8/4K3 b - - 0 1", // the same board, black to move
      "4k3/8/8/8/8/8/1P6/4K3 w - - 0 1", // one white pawn on b2 — the a1/a3 boundary board
      "4K3/8/8/8/8/k7/p7/R7 b - - 0 1", // the Security/NFR gate's off-board-write probe
      "rnbqkbnr/ppp1pppp/8/8/3pP3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1", // a full board
    ];
    const outsideTheArray = [-999, -16, -2, 128, 999];
    const targets = [...Array.from({ length: 128 }, (_, square) => square), ...outsideTheArray];

    for (const fen of boards) {
      const position = parseFen(fen);
      for (const target of targets) {
        position.epSquare = target;
        const before = fullState(position);

        hasLegalEnPassant(position);

        expect(fullState(position), `${fen} with epSquare ${target}`).toBe(before);
      }
    }
  });
});
