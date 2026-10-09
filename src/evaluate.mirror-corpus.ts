/**
 * The evaluation suites' MIRROR CORPUS and MIRROR HELPER — TEST-ONLY, shared (ABC-082 `A7`).
 *
 * Lifted out of `src/evaluate.test.ts` unchanged, so that ABC-076's suite and ABC-082's suite (and
 * ABC-083's after it) read ONE corpus and ONE mirror helper instead of a fork each. Not named
 * `*.test.ts`, so vitest does not collect it and Biome's `noExportsInTest` does not apply; under
 * `src/`, so `tsc` and Biome check it. No production module imports it — ABC-082 `A7` asserts that.
 * Same shape as `src/search.mate-corpus.ts` (`ADR-0026` decision 9).
 */

import { makeMove, unmakeMove } from "./apply.ts";
import { parseFen } from "./fen.ts";
import { legalMoves } from "./legal.ts";
import {
  BLACK,
  CASTLE_BK,
  CASTLE_BQ,
  CASTLE_WK,
  CASTLE_WQ,
  EMPTY,
  fileOf,
  NO_SQUARE,
  type Position,
  rankOf,
  squareAt,
} from "./position.ts";

export const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/**
 * The six PERFT_SUITE positions, transcribed with their depth-1 counts. The counts are here so
 * the one-ply expansion can be checked position by position, not only in total — a wrong total
 * that happens to sum correctly is not a thing this lets through.
 */
export const PERFT_POSITIONS: ReadonlyArray<{ name: string; fen: string; depth1: number }> = [
  { name: "startpos", fen: START_FEN, depth1: 20 },
  {
    name: "kiwipete",
    fen: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
    depth1: 48,
  },
  { name: "position-3", fen: "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1", depth1: 14 },
  {
    name: "position-4",
    fen: "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1",
    depth1: 6,
  },
  {
    name: "position-5",
    fen: "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8",
    depth1: 44,
  },
  {
    name: "position-6",
    fen: "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
    depth1: 46,
  },
];

/** A detached copy — `makeMove` works in place, so a corpus entry must not alias the position. */
export function clonePosition(position: Position): Position {
  return {
    board: Uint8Array.from(position.board),
    blackToMove: position.blackToMove,
    castling: position.castling,
    epSquare: position.epSquare,
    halfmoveClock: position.halfmoveClock,
    fullmoveNumber: position.fullmoveNumber,
  };
}

/** The rank-flipped partner of a 0x88 square: a1 <-> a8, e4 <-> e5. Files never move. */
const mirrorSquare = (square: number): number => squareAt(fileOf(square), 7 - rankOf(square));

/**
 * The colour-mirrored twin of a position: every piece moved to its rank-flipped square with its
 * colour flipped, the side to move flipped, castling rights swapped side for side, and the
 * en-passant square rank-flipped.
 *
 * The last two are not decoration. The corpus includes one-ply children, so it contains double
 * pawn pushes (which set `epSquare`) and king and rook moves (which clear castling rights); a
 * twin that dropped either would be mirroring a DIFFERENT position and A1 would be asserting
 * something weaker than it says. Today's evaluation reads neither field — that is exactly why
 * the helper must carry them now, while nothing depends on it, for ABC-082 and ABC-083.
 *
 * `halfmoveClock` and `fullmoveNumber` are copied unchanged: they have no colour and no rank.
 */
export function mirrorPosition(position: Position): Position {
  const board = new Uint8Array(128);
  for (let rank = 0; rank < 8; rank++) {
    for (let file = 0; file < 8; file++) {
      const square = squareAt(file, rank);
      const piece = position.board[square] as number;
      if (piece !== EMPTY) board[mirrorSquare(square)] = piece ^ BLACK;
    }
  }

  const castling = position.castling;
  const mirroredCastling =
    ((castling & CASTLE_WK) !== 0 ? CASTLE_BK : 0) |
    ((castling & CASTLE_WQ) !== 0 ? CASTLE_BQ : 0) |
    ((castling & CASTLE_BK) !== 0 ? CASTLE_WK : 0) |
    ((castling & CASTLE_BQ) !== 0 ? CASTLE_WQ : 0);

  return {
    board,
    blackToMove: !position.blackToMove,
    castling: mirroredCastling,
    epSquare: position.epSquare === NO_SQUARE ? NO_SQUARE : mirrorSquare(position.epSquare),
    halfmoveClock: position.halfmoveClock,
    fullmoveNumber: position.fullmoveNumber,
  };
}

/**
 * The six perft positions plus every position one legal ply from each — 184 in all. Built with
 * the merged generator and make/unmake, so nothing new has to be trusted, and deterministic, so
 * the number is stable rather than a sampling target.
 */
export function buildCorpus(): { name: string; position: Position }[] {
  const corpus: { name: string; position: Position }[] = [];

  for (const entry of PERFT_POSITIONS) {
    const root = parseFen(entry.fen);
    corpus.push({ name: entry.name, position: clonePosition(root) });

    let childIndex = 0;
    for (const move of legalMoves(root)) {
      const undo = makeMove(root, move);
      corpus.push({ name: `${entry.name} child ${childIndex++}`, position: clonePosition(root) });
      unmakeMove(root, move, undo);
    }
  }

  return corpus;
}
