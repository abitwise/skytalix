/** `ABC-017` `A1`'s ten lengths, rebuilt verbatim from `src/history-pane.test.ts:139-152`. */
import { type GameHistory, newGame, playMove } from "../src/history.ts";
import { legalMoves } from "../src/legal.ts";
import type { Move } from "../src/moves.ts";
import { parseSquareName } from "../src/position.ts";

export const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
export const ANCHOR_27_BLACK = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 27";

function play(history: GameHistory, from: string, to: string): void {
  const move = legalMoves(history.position).find(
    (candidate) =>
      candidate.from === parseSquareName(from) && candidate.to === parseSquareName(to),
  );
  if (move === undefined) throw new Error(`no legal move ${from}${to}`);
  playMove(history, move);
}

const THE_LINE: readonly (readonly [string, string])[] = [
  ["e2", "e4"], ["e7", "e5"], ["g1", "f3"], ["b8", "c6"], ["f1", "c4"], ["f8", "c5"],
  ["c2", "c3"], ["g8", "f6"], ["d2", "d4"], ["e5", "d4"], ["c3", "d4"], ["c5", "b4"],
  ["b1", "c3"], ["f6", "e4"], ["e1", "g1"], ["b4", "c3"], ["b2", "c3"], ["d7", "d5"],
  ["c1", "a3"], ["c8", "e6"],
];

function lineTo(plies: number, fen: string = START_FEN): GameHistory {
  const history = newGame(fen);
  for (const [from, to] of THE_LINE.slice(0, plies)) play(history, from, to);
  return history;
}

function deterministicGame(plies: number): GameHistory {
  const history = newGame(START_FEN);
  let seed = 0x2f6e2b1;
  for (let ply = 0; ply < plies; ply++) {
    const moves = legalMoves(history.position);
    if (moves.length === 0) return history;
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    playMove(history, moves[seed % moves.length] as Move);
  }
  return history;
}

const SHUFFLE: readonly (readonly [string, string])[] = [
  ["g1", "f3"], ["g8", "f6"], ["f3", "g1"], ["f6", "g8"],
];

function shuffleGame(plies: number, fen: string = START_FEN): GameHistory {
  const history = newGame(fen);
  for (let ply = 0; ply < plies; ply++) {
    const [from, to] = SHUFFLE[ply % SHUFFLE.length] as readonly [string, string];
    play(history, from, to);
  }
  return history;
}

/** `A1`'s ten lengths — the exact `Given` of `A4`. Fresh objects on every call. */
export function buildLengthCases(): readonly (readonly [plies: number, history: GameHistory])[] {
  return [
    [0, lineTo(0)],
    [1, lineTo(1)],
    [3, lineTo(3)],
    [19, lineTo(19)],
    [20, lineTo(20)],
    [40, deterministicGame(40)],
    [80, deterministicGame(80)],
    [120, deterministicGame(120)],
    [300, deterministicGame(300)],
    [2000, shuffleGame(2000)],
  ];
}
