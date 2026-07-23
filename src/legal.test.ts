import { describe, expect, it } from "vitest";
import { makeMove, unmakeMove } from "./apply.ts";
import { parseFen } from "./fen.ts";
import { isInCheck, legalMoves } from "./legal.ts";
import { FLAG_EN_PASSANT, isSquareAttackedBy } from "./moves.ts";
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
