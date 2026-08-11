/**
 * `ABC-017` — the bounded move-history pane: two-column SAN, constant height, constant width.
 *
 * IT RETURNS ROWS AS A VALUE AND WRITES NOTHING, given the history and nothing else. `ABC-018` owns
 * writing and composition (`FrameParts.history` takes these rows); this module renders a pane.
 *
 * THE BOUND IS THE POINT OF THE TICKET. A conventional 24-row terminal leaves 8 rows for history
 * once the board's 9, the status panel's 3, the message region's 2 and the reserved prompt row are
 * counted, so an unbounded pane overflows the viewport at roughly move 10. This pre-adopts
 * `ADR-0004`'s own answer to its clause-3 trigger — render only the visible window, no cache — and
 * `EPIC-006`'s game-end screen keeps the full list in the product.
 *
 * THE WINDOW IS THE MOST RECENT `HISTORY_ROWS` MOVE NUMBERS, NOT THE MOST RECENT `2 x HISTORY_ROWS`
 * PLIES. The two are identical at every even ply count and differ at every odd one, where windowing
 * plies puts Black's moves in White's column and every move number one too low.
 *
 * THE MOVE NUMBER AND THE COLUMN ARE READ FROM THE REPLAYED POSITION, never computed from the array
 * index. The replay has to reach each visible ply anyway to produce SAN, and the position before ply
 * `i` already carries `fullmoveNumber` and `blackToMove` — which are exactly the move number and the
 * column. Deriving them from the index costs the same and is wrong for any history anchored
 * anywhere but the standard start FEN: `parseFen` accepts a black-to-move anchor and any
 * `fullmoveNumber >= 1`, and `EPIC-006` owns startup and supplies it. That anchor is also why there
 * is a LEADING half-row (a black-to-move anchor's first row has an empty white cell) as well as the
 * TRAILING one (White has moved and Black has not replied).
 *
 * THE PANE TAKES NO GLYPH MODE. Nothing in the output depends on one: SAN is ASCII by construction
 * and so is the layout, and a parameter no output depends on is an invitation to make an output
 * depend on it.
 *
 * IT IMPORTS `GameHistory` AS A TYPE ONLY, so `src/history.ts` keeps its zero runtime importers.
 * That structural fact is what `NFR-002`'s `O(window)` claim rests on: the pane derives nothing —
 * no `gameStatusOf`, no `repetitionCounts`, no `keyHistory`, no `takeBack` — it replays forward from
 * the anchor with the core's own `parseFen` + `makeMove`, exactly as `keyHistory` does. The pane is
 * `O(plies)` in its replay term (measured 7.42 ns/ply) and `O(window)` in its SAN term; the label on
 * the ticket is an approximation and the coefficient is recorded there.
 *
 * NO LEGAL LIST IS PASSED TO `toSan`. `src/san.ts:19-22` makes that parameter a contract rather than
 * a tuning detail — "supply another position's list and the answer is silently wrong" — and this
 * pane holds no such list. It pays one generation per visible ply and that cost is priced in the
 * ticket's NFR bar.
 *
 * `HISTORY_COLS` IS 21 AND THE VALUE IS THIS MODULE'S CHOICE, on epic acceptance `4a`'s own split
 * ("the invariant is the criterion; the exact split is the engineer's"), subject to the one
 * requirement the ticket states: it holds a 4-digit move number and two 7-character SAN strings with
 * no truncation. 7 is the longest SAN this grammar emits (`Qh4xe1#` in shape, `dxc8=Q+` in play) and
 * 4 digits covers every move number reachable under `ABC-020`'s automatic draws. 21 is that
 * requirement exactly and nothing more: under `ADR-0010` clause 2 no panel reserves, pads or
 * declares a FRAME width, so there is no reason to buy columns this pane does not use. Widening it
 * to 24 was measured at `ADR-0010` to MASK the status panel's own width swing behind this pane —
 * green by masking — and `ADR-0010` clause 1 puts frame-width stability on the consumer's writer
 * instead.
 *
 * ACCEPTED LIMITATION, stated rather than silently handled: a loaded FEN whose `fullmoveNumber`
 * exceeds 9,999 renders a row wider than `HISTORY_COLS`. No such position is reachable by play;
 * `parseFen` imposes no upper bound and `ABC-010` is the ticket that would. Nothing is truncated —
 * a wrong move number is worse than a wide row.
 */

import { makeMove } from "./apply.ts";
import { parseFen } from "./fen.ts";
import type { GameHistory } from "./history.ts";
import type { Move } from "./moves.ts";
import { toSan } from "./san.ts";

/**
 * The pane's constant height, EXPORTED because the producer owns its count (`ADR-0009` clause 1)
 * and because `ABC-018`'s `frameHeight` consumes it as a session constant known before the first
 * frame (`src/frame.ts:84`, `:211`). It is 8 because that is what a 24-row viewport leaves.
 */
export const HISTORY_ROWS = 8;

/** `9999` — every move number reachable by play under `ABC-020`'s automatic draws. */
const MOVE_NUMBER_DIGITS = 4;

/** `Qh4xe1#`, `dxc8=Q+` — the longest string `src/san.ts`'s grammar emits. */
const SAN_WIDTH = 7;

/**
 * The pane's constant width: `9999.` then a space, then two SAN cells separated by a space —
 * `  10. Ba3     Be6    `. The cells are FIXED COLUMNS, which is what lets a row state that its
 * white cell is empty rather than merely that it is short.
 */
export const HISTORY_COLS = MOVE_NUMBER_DIGITS + 1 + (1 + SAN_WIDTH) * 2;

/** A blank row is `HISTORY_COLS` spaces — the pane's height never changes, so the rows must exist. */
const BLANK_ROW = " ".repeat(HISTORY_COLS);

/** One rendered row under construction. Either cell may stay empty: both half-rows are real. */
interface MovePair {
  readonly number: number;
  white: string;
  black: string;
}

/**
 * The first ply the window shows, counted in move NUMBERS and not in plies.
 *
 * A black-to-move anchor spends half a row before the first ply, which is the whole of the
 * difference between this and `moves.length - 2 * HISTORY_ROWS`.
 */
function firstVisiblePly(plies: number, blackToMoveAtAnchor: boolean): number {
  const leadingHalfRow = blackToMoveAtAnchor ? 1 : 0;
  const rowsInGame = Math.ceil((plies + leadingHalfRow) / 2);
  const hiddenRows = Math.max(0, rowsInGame - HISTORY_ROWS);
  return Math.max(0, hiddenRows * 2 - leadingHalfRow);
}

/** `padEnd` never truncates, so a cell wider than its column widens the row instead of lying. */
const rowFor = (pair: MovePair): string =>
  `${String(pair.number).padStart(MOVE_NUMBER_DIGITS)}. ` +
  `${pair.white.padEnd(SAN_WIDTH)} ${pair.black.padEnd(SAN_WIDTH)}`;

/**
 * The pane: exactly `HISTORY_ROWS` rows of exactly `HISTORY_COLS` characters, blank-padded at the
 * BOTTOM so the content is top-aligned — the oldest visible pair in row 1, which is the direction a
 * move list a chess player reads grows in.
 */
export function renderHistory(history: GameHistory): string[] {
  // The one `parseFen`: the anchor, parsed once. The replay walks forward from it, and the object
  // it returns is this function's own — the caller's `history.position` is never touched.
  const position = parseFen(history.initialFen);
  const moves = history.moves;
  const firstVisible = firstVisiblePly(moves.length, position.blackToMove);

  for (let ply = 0; ply < firstVisible; ply++) makeMove(position, moves[ply] as Move);

  const pairs: MovePair[] = [];
  for (let ply = firstVisible; ply < moves.length; ply++) {
    const move = moves[ply] as Move;
    const black = position.blackToMove;
    const number = position.fullmoveNumber;
    const san = toSan(position, move);
    makeMove(position, move);

    // A black ply belongs to the row its white ply opened. The only black ply with no open row is
    // the first one of a black-to-move anchor, and that row keeps an empty white cell.
    const open = pairs[pairs.length - 1];
    if (black && open !== undefined) open.black = san;
    else pairs.push({ number, white: black ? "" : san, black: black ? san : "" });
  }

  const rows = pairs.map(rowFor);
  while (rows.length < HISTORY_ROWS) rows.push(BLANK_ROW);
  return rows;
}
