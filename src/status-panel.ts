/**
 * ABC-016 — the status panel: what turns a board picture into a game.
 *
 * IT RETURNS EXACTLY `STATUS_ROWS` ROWS AS A VALUE AND WRITES NOTHING, the same posture
 * `renderBoard` takes. `ABC-018` owns writing, the frame's width and the message region; nothing
 * here reads `isTTY`, `process.env` or the terminal size.
 *
 * THE PANEL DERIVES NOTHING ABOUT THE GAME'S STATE. `status` is a PARAMETER, because `ABC-019`'s
 * loop already evaluates it once per ply before it renders (*append to history → derive counts →
 * `gameStatus` → render*), and a panel that derived its own claims would make two of that ticket's
 * acceptance criteria false by construction — re-emitting a frame is what runs this function.
 * Measured on merged `src/` at the ticket's refinement: a `gameStatusOf(history)` here costs
 * 47.93 µs at 120 plies and 95.64 µs at 300, which would be 91% of this panel's whole cost. So
 * `gameStatusOf`, `repetitionCounts`, `keyHistory` and `gameStatus` are called exactly zero times
 * from this module, and `src/status-panel.nfr.test.ts` is where that is a spied call count rather
 * than a timing with an order of magnitude of headroom.
 *
 * THERE IS NO `GlyphMode` PARAMETER, and that is a decision rather than an omission. The panel
 * renders no piece glyph and no box character, so it emits ASCII unconditionally and epic
 * acceptance `2a` holds for this region by construction rather than by vigilance — the same move
 * `src/render.ts:102` made when it kept both shading characters ASCII in both modes. An argument no
 * output depends on is an invitation to make some cell depend on it later.
 *
 * IT ADDS NO RUNTIME IMPORTER OF `src/history.ts` — `GameHistory` is a type-only import and the
 * replay below goes through `fen.ts` and `apply.ts` over the history's own two fields. That is
 * load-bearing beyond style: `NFR-002`'s `O(window)` boundary condition was verified STRUCTURALLY
 * at `ABC-012`'s gate on the ground that nothing pulls the repetition derive into a frame, and this
 * module is the first thing that could have expired that verification.
 *
 * THE SEVEN ITEMS PACK INTO THREE ROWS AND THE SPLIT IS THIS MODULE'S CHOICE, which epic acceptance
 * `4a` explicitly leaves to the engineer ("the invariant is the criterion; the exact split is the
 * engineer's"). The invariant that matters is the total, `STATUS_ROWS`, in every state:
 *
 *     White to move  27.  CHECK
 *     last: Nf3  material: +8
 *     thinking...  White may claim: threefold repetition, fifty-move rule
 */

import { makeMove } from "./apply.ts";
import { parseFen } from "./fen.ts";
import type { ClaimableDraw, GameStatus } from "./gameend.ts";
import type { GameHistory } from "./history.ts";
import { isInCheck } from "./legal.ts";
import type { Move } from "./moves.ts";
import {
  BISHOP,
  EMPTY,
  isBlack,
  KING,
  KNIGHT,
  PAWN,
  type Position,
  pieceType,
  QUEEN,
  ROOK,
  squareAt,
} from "./position.ts";
import { toSan } from "./san.ts";

/**
 * The panel's height, in rows. EXPORTED because `ABC-018`'s `frameHeight` consumes it as a session
 * constant read once before the first frame (`src/frame.ts:84`, `:211`) and a consumer must never
 * restate it — a restated term cannot fail on the panel it restates (`ADR-0009` clauses 1 and 5).
 *
 * THREE IS NOT A FREE CHOICE. `frameHeight({ board: 9, status: N, history: 8 })` is 21/22/23/24/25
 * for `N` = 1/2/3/4/5, and `beginFrameSession` on a standard 24-row TTY takes the append path at
 * 25 — at which point epic acceptance `4b`, the in-place redraw with no stale rows, is unreachable
 * with nothing failing anywhere. Three is the epic's reference number (`4a`); four is the last
 * value that still fits.
 */
export const STATUS_ROWS = 3;

/**
 * P 1 · N 3 · B 3 · R 5 · Q 9 · K 0. The king's value is unobservable — both sides always have
 * exactly one — and is fixed at 0 so that nobody has to wonder.
 */
const PIECE_VALUES: Readonly<Record<number, number>> = {
  [PAWN]: 1,
  [KNIGHT]: 3,
  [BISHOP]: 3,
  [ROOK]: 5,
  [QUEEN]: 9,
  [KING]: 0,
};

/** How each claimable draw is named to a player. FIDE 9.2 and 9.3, in the player's words. */
const DRAW_NAMES: Readonly<Record<ClaimableDraw, string>> = {
  "threefold-repetition": "threefold repetition",
  "fifty-move": "fifty-move rule",
};

/** Two spaces between two cells on a row — enough to read as a gap, never a column layout. */
const CELL_GAP = "  ";

/**
 * The engine-thinking text. Its WIDTH is reserved when the engine is idle rather than the cell
 * being dropped: the panel's widest row is the frame's `W` (`src/frame.ts:179`), so a cell that
 * shrinks when the engine stops makes the whole frame breathe. `A7` asserts the width, which is
 * what makes "blank but reserved" mean something.
 */
const THINKING = "thinking...";

/** The cells of one row, gapped — an empty cell contributes nothing, not a double gap. */
const rowOf = (cells: readonly string[]): string =>
  cells.filter((cell) => cell !== "").join(CELL_GAP);

/**
 * The balance from White's point of view, by scanning the 64 squares of the live board.
 *
 * A 64-SQUARE SCAN AND NEVER A DIFF against the standard starting complement: after any promotion
 * the diff is wrong, and it is wrong in a way that looks right for the first twenty moves.
 */
function materialBalance(position: Position): number {
  let balance = 0;

  for (let rank = 0; rank < 8; rank++) {
    for (let file = 0; file < 8; file++) {
      const piece = position.board[squareAt(file, rank)] as number;
      if (piece === EMPTY) continue;
      const value = PIECE_VALUES[pieceType(piece)] as number;
      balance += isBlack(piece) ? -value : value;
    }
  }

  return balance;
}

/**
 * The last move in SAN, or "" before the first move.
 *
 * SAN NEEDS THE POSITION BEFORE THE MOVE, and there is exactly one way to obtain it: replay
 * `initialFen` forward through every ply but the last. `ADR-0002` clause 2 forbids an undo stack,
 * nothing in `src/` clones a `Position`, and the obvious alternative is worse than unavailable —
 * `toSan(history.position, lastMove)` emits the CORRECT string and permanently corrupts the live
 * board, leaving a phantom knight behind, because SAN's suffix makes and unmakes the move on the
 * position it is given.
 *
 * The replay position is this function's own throwaway. The caller's live position is never read
 * here and never touched.
 */
function lastMoveSan(history: GameHistory): string {
  const moves = history.moves;
  if (moves.length === 0) return "";

  const position = parseFen(history.initialFen);
  for (let ply = 0; ply < moves.length - 1; ply++) makeMove(position, moves[ply] as Move);

  return `last: ${toSan(position, moves[moves.length - 1] as Move)}`;
}

/**
 * What the SIDE TO MOVE may claim, read from the status the caller supplies. Blank when nothing is
 * claimable, and the cell exists in every frame either way.
 *
 * The claimant is `claimable.by` and is never inferred: under FIDE 9.2.1/9.3.1 the claim belongs to
 * whoever has the move, this panel renders on the engine's plies too, and a panel that said "you"
 * would reproduce the exact defect `ABC-020` exists to fix where nobody is watching. The order of
 * `draws` is `src/gameend.ts:53`'s own — threefold first, then fifty-move — and is never re-sorted,
 * because a second sort is a second opinion.
 */
function claimCell(status: GameStatus): string {
  const claimable = status.claimable;
  if (claimable === undefined) return "";

  const side = claimable.by === "white" ? "White" : "Black";
  const rules = claimable.draws.map((draw) => DRAW_NAMES[draw]).join(", ");
  return `${side} may claim: ${rules}`;
}

/**
 * The status panel for `history`, as exactly `STATUS_ROWS` rows.
 *
 * `status` is the game's state as the caller already evaluated it this ply, and `thinking` is the
 * flag the loop owns. Both are parameters and neither is derived here.
 */
export function renderStatusPanel(
  history: GameHistory,
  status: GameStatus,
  thinking: boolean,
): string[] {
  const position = history.position;
  const side = position.blackToMove ? "Black" : "White";
  // `makeMove` increments `fullmoveNumber` when the side that just moved was black, BEFORE the
  // flip (`src/apply.ts:145`), so the live value is the number of the move the side to move is
  // ABOUT to play — which is what a player reads. Never the history length: `parseFen` accepts any
  // fullmove >= 1 and `EPIC-003` will accept a FEN from a user.
  const moveNumber = position.blackToMove
    ? `${position.fullmoveNumber}...`
    : `${position.fullmoveNumber}.`;

  // `isInCheck` reports whether THE SIDE TO MOVE is in check and nothing else, which is exactly
  // what epic acceptance #3 asks for. It is a second, independent call from the one `gameStatus`
  // makes inside its zero-legal-moves branch; at a measured 0.06-0.11 µs it is free, and it is the
  // honest reading of a criterion about the rendered board rather than about the terminal check.
  const check = isInCheck(position) ? "CHECK" : "";

  const balance = materialBalance(position);
  const material = `material: ${balance > 0 ? `+${balance}` : balance}`;

  return [
    rowOf([`${side} to move`, moveNumber, check]),
    rowOf([lastMoveSan(history), material]),
    rowOf([thinking ? THINKING : " ".repeat(THINKING.length), claimCell(status)]),
  ];
}
