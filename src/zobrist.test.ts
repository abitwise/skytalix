import { describe, expect, it } from "vitest";
import { makeMove, unmakeMove } from "./apply.ts";
import { parseFen, toFen } from "./fen.ts";
import { legalMoves } from "./legal.ts";
import { FLAG_EN_PASSANT, generateMoves, type Move } from "./moves.ts";
import { NO_SQUARE, PAWN, type Position, parseSquareName, pieceType } from "./position.ts";
import { zobristKey } from "./zobrist.ts";

const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/** The key of `position` as if it carried no en-passant square. Restores the field it borrows. */
function keyWithoutEpSquare(position: Position): bigint {
  const epSquare = position.epSquare;
  position.epSquare = NO_SQUARE;
  const key = zobristKey(position);
  position.epSquare = epSquare;
  return key;
}

describe("zobristKey", () => {
  it("is deterministic — the same position hashes to the same key", () => {
    expect(zobristKey(parseFen(START_FEN))).toBe(zobristKey(parseFen(START_FEN)));
  });

  it("ignores the move counters, which do not affect repetition", () => {
    const a = parseFen(START_FEN);
    const b = parseFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 7 20");
    expect(zobristKey(a)).toBe(zobristKey(b));
  });

  it("depends on the side to move", () => {
    const white = zobristKey(parseFen(START_FEN));
    const black = zobristKey(parseFen(START_FEN.replace(" w ", " b ")));
    expect(white).not.toBe(black);
  });

  it("depends on castling rights", () => {
    const all = zobristKey(parseFen("r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1"));
    const some = zobristKey(parseFen("r3k2r/8/8/8/8/8/8/R3K2R w Kkq - 0 1"));
    expect(all).not.toBe(some);
  });

  it("depends on en-passant availability", () => {
    const withEp = zobristKey(parseFen("4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1"));
    const withoutEp = zobristKey(parseFen("4k3/8/8/3pP3/8/8/8/4K3 w - - 0 1"));
    expect(withEp).not.toBe(withoutEp);
  });

  it("ignores an ep square no capture can use — the ABC-011 defect pair", () => {
    // One ply after 1.e4. No black pawn on d4 or f4, so nothing can take en passant and FIDE
    // 9.2.3 calls these the same position. Before ABC-011 the keys differed.
    const withEp = zobristKey(
      parseFen("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1"),
    );
    const withoutEp = zobristKey(
      parseFen("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1"),
    );
    expect(withEp).toBe(withoutEp);
  });

  it("still separates the pair where the ep capture is real — the ABC-011 regression guard", () => {
    // Same position with a black pawn on d4, so d4xe3 is a genuine capture and the two
    // positions genuinely differ. The fix must collapse the pair above without collapsing this one.
    const withEp = zobristKey(
      parseFen("rnbqkbnr/ppp1pppp/8/8/3pP3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1"),
    );
    const withoutEp = zobristKey(
      parseFen("rnbqkbnr/ppp1pppp/8/8/3pP3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1"),
    );
    expect(withEp).not.toBe(withoutEp);
  });

  it("ignores an ep square whose only capture is illegal — the strict-FIDE reading", () => {
    // c5xd6 is pseudo-legal but leaves the a5 king bare to the h5 rook along rank 5, so it is
    // not one of FIDE 9.2.3's "possible moves". This is the pair the design hop's ruling
    // decides and the one a board-only reading would have left different.
    const withEp = zobristKey(parseFen("7k/8/8/K1Pp3r/8/8/8/8 w - d6 0 1"));
    const withoutEp = zobristKey(parseFen("7k/8/8/K1Pp3r/8/8/8/8 w - - 0 1"));
    expect(withEp).toBe(withoutEp);
  });

  it("restores the key exactly after a move is made and unmade", () => {
    const position = parseFen(START_FEN);
    const before = zobristKey(position);
    const move = generateMoves(position).find(
      (candidate) =>
        candidate.from === parseSquareName("e2") && candidate.to === parseSquareName("e4"),
    );
    if (move === undefined) throw new Error("expected e2-e4");

    const undo = makeMove(position, move);
    expect(zobristKey(position)).not.toBe(before); // the position genuinely changed
    unmakeMove(position, move, undo);
    expect(zobristKey(position)).toBe(before); // and comes all the way back
  });
});

// ---------------------------------------------------------------------------
// ABC-011 property test — the guard that generalizes past the hand-picked FENs.
// Two hand-picked pairs cannot see the case that actually shipped, and the ep
// predicate re-derives pawn geometry src/moves.ts also owns, so the oracle here is
// `legalMoves(...)` itself rather than a written-down expectation: if the two ever
// drift apart, this is what notices.
// ---------------------------------------------------------------------------

/** The six perft positions, mirroring the table in src/perft.test.ts — a local copy, as legal.test.ts keeps. */
const PERFT_POSITIONS: ReadonlyArray<readonly [name: string, fen: string]> = [
  ["startpos", START_FEN],
  ["kiwipete", "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1"],
  ["position-3", "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1"],
  ["position-4", "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1"],
  ["position-5", "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8"],
  ["position-6", "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10"],
];

/** Two ranks in 0x88 — the signed distance apply.ts uses to recognise a double push. */
const DOUBLE_PUSH = 32;

const isDoublePush = (move: Move): boolean =>
  pieceType(move.piece) === PAWN && Math.abs(move.to - move.from) === DOUBLE_PUSH;

/**
 * Plays every legal line `plies` deep from `position` and, at each double push, compares the
 * key of the resulting position against the key of that same position with its `epSquare`
 * cleared. They must be equal exactly when no legal en-passant capture answers the push.
 * Returns how many double pushes it checked, so the caller can assert the walk saw something.
 */
function checkDoublePushes(position: Position, plies: number): { checked: number; ep: number } {
  let checked = 0;
  let ep = 0;

  for (const move of legalMoves(position)) {
    const undo = makeMove(position, move);

    if (isDoublePush(move)) {
      const available = legalMoves(position).some((m) => (m.flags & FLAG_EN_PASSANT) !== 0);
      const collapsed = zobristKey(position) === keyWithoutEpSquare(position);
      // Built eagerly: toFen over a few thousand nodes is cheaper than the walk around it.
      expect(collapsed, `${toFen(position)} — legal ep capture available: ${available}`).toBe(
        !available,
      );
      checked++;
      if (available) ep++;
    }

    if (plies > 1) {
      const deeper = checkDoublePushes(position, plies - 1);
      checked += deeper.checked;
      ep += deeper.ep;
    }

    unmakeMove(position, move, undo);
  }

  return { checked, ep };
}

describe("ABC-011 property — the ep component tracks availability, not the ep field", () => {
  it("holds for every legal double push within 2 plies of every perft position", () => {
    let checked = 0;
    let answered = 0;

    for (const [, fen] of PERFT_POSITIONS) {
      const walked = checkDoublePushes(parseFen(fen), 2);
      checked += walked.checked;
      answered += walked.ep;
    }

    // Neither half of the criterion may go unexercised. The walk must have played double
    // pushes at all (the collapse case) and at least one that a legal ep capture answers
    // (the stays-different case) — a vacuous walk would otherwise pass green.
    expect(checked).toBeGreaterThan(0);
    expect(answered).toBeGreaterThan(0);
  });
});
