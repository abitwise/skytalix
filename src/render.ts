/**
 * The board frame — 8x8 grid, labels, character shading, orientation, two glyph modes.
 *
 * IT RETURNS A FRAME AS A VALUE AND WRITES NOTHING. `ABC-018` owns writing, the cursor control and
 * the message region; `EPIC-006`'s end-to-end test drives stdout as a pipe and epic acceptance
 * `4c` needs a frame that is producible with no TTY attached, so nothing here reads `isTTY`,
 * `process.env` or the terminal size.
 *
 * Three contracts come from `EPIC-002` and are implemented, not re-decided here:
 *   - shading is by CHARACTER, never by ANSI background colour (scope amendment `[A4]`) — a
 *     character survives a pipe, a snapshot diff and a terminal with no colour;
 *   - the glyph mode is a PARAMETER this module does not choose (amendment `[A1]`, acceptance
 *     `2b`): `ABC-015` owns the five-row selection table and `EPIC-006` owns the `--ascii` /
 *     `--unicode` flags that feed it;
 *   - the frame is a VALUE with CONSTANT GEOMETRY (acceptance `4a`) — always 9 rows of 18
 *     characters, whatever the position, the mode or the orientation.
 *
 * THE LAYOUT IS THIS MODULE'S CHOICE, which acceptance `4a` explicitly leaves to the engineer
 * ("the invariant is the criterion; the exact split is the engineer's"). Its reference split gives
 * the board 8 rows + 1 file-label row, and that is what this is:
 *
 *     8 .r:n.b:q.k:b.n:r
 *     7 :p.p:p.p:p.p:p.p
 *     ...
 *     1 :R.N:B.Q:K.B:N.R
 *        a b c d e f g h
 *
 * Every square is TWO characters — its shading character, then its piece glyph (or the shading
 * character again when the square is empty). Two consequences are load-bearing and neither is
 * accidental. First, EVERY square carries a shading character whether it is occupied or not, so
 * "adjacent squares on a rank are shaded differently" stays true on a full back rank instead of
 * being unassertable there. Second, the two-character pitch puts the file labels exactly under the
 * piece column with a single space between them, so the label row reads `a b c d e f g h` and
 * still measures the same 18 characters as a board row — no trailing padding anywhere in the
 * frame.
 *
 * It draws whatever `position.board` holds and validates nothing: `ABC-009` and `ABC-010` own
 * position validity and neither is in this epic. The honest limit of that is that a board byte
 * outside `EMPTY` and the twelve real pieces — which nothing in merged `src/` can produce — has no
 * glyph and would throw rather than draw a placeholder.
 */

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

/**
 * Which glyph table a frame is drawn with. The mode is decided ONCE per session, before the first
 * frame, by `ABC-015` — this module only consumes the answer.
 */
export type GlyphMode = "unicode" | "ascii";

/**
 * Which colour's pieces sit at the BOTTOM of the frame. Named for the side at the bottom rather
 * than typed as a colour, because "orientation: white" cannot say by itself whether White is at
 * the bottom or the top. `EPIC-006` owns the human's colour and hands the answer in.
 */
export type Orientation = "white-bottom" | "black-bottom";

/** Indexed by piece TYPE (`pieceType`, 1..6); each entry is the white glyph then the black one. */
type GlyphTable = Readonly<Record<number, readonly [white: string, black: string]>>;

const GLYPHS: Readonly<Record<GlyphMode, GlyphTable>> = {
  // White U+265A-U+265F (filled), black U+2654-U+2659 (outline) — ABC-101 `A11`, for a dark
  // terminal; two code points per type, never one glyph recoloured (no colour to recolour with).
  unicode: {
    [PAWN]: ["♟", "♙"],
    [KNIGHT]: ["♞", "♘"],
    [BISHOP]: ["♝", "♗"],
    [ROOK]: ["♜", "♖"],
    [QUEEN]: ["♛", "♕"],
    [KING]: ["♚", "♔"],
  },
  // Case is the ONLY colour marker, matching the FEN convention the rest of `src/` already uses.
  ascii: {
    [PAWN]: ["P", "p"],
    [KNIGHT]: ["N", "n"],
    [BISHOP]: ["B", "b"],
    [ROOK]: ["R", "r"],
    [QUEEN]: ["Q", "q"],
    [KING]: ["K", "k"],
  },
};

/**
 * The shading characters, and they are the SAME PAIR IN BOTH MODES on purpose: the shading must
 * not be one thing in Unicode and another in ASCII, and keeping both of them ASCII is what makes
 * acceptance `2a` — zero code points above U+007F in an ASCII frame — hold by construction rather
 * than by vigilance. Neither is a space: a space-shaded square is indistinguishable from padding
 * and would put trailing whitespace at the end of a row.
 */
const DARK_SQUARE = ":";
const LIGHT_SQUARE = ".";

/** `position.ts` keeps its own copy private; one line here rather than an export on a merged module. */
const FILE_LETTERS = "abcdefgh";

/**
 * The frame for `position`, one string per row, top row first. The caller joins them: `ABC-018`
 * composes these rows with the status panel, the history pane and the message region, so it needs
 * the rows, not a blob.
 */
export function renderBoard(
  position: Position,
  mode: GlyphMode,
  orientation: Orientation,
): string[] {
  const glyphs = GLYPHS[mode];
  const whiteBottom = orientation === "white-bottom";
  const rows: string[] = [];

  for (let row = 0; row < 8; row++) {
    // Both axes rotate together. Flipping the ranks alone yields a left-right mirror in which the
    // king and queen swap files — a board that looks plausible and is wrong.
    const rank = whiteBottom ? 7 - row : row;
    let cells = "";

    for (let column = 0; column < 8; column++) {
      const file = whiteBottom ? column : 7 - column;
      // Shading follows the SQUARE, never the screen position, so a1 and h8 stay dark in both
      // orientations. a1 is file 0 rank 0, and it is dark.
      const shade = (file + rank) % 2 === 0 ? DARK_SQUARE : LIGHT_SQUARE;
      const piece = position.board[squareAt(file, rank)] as number;

      if (piece === EMPTY) {
        cells += shade + shade;
        continue;
      }
      const glyph = glyphs[pieceType(piece)] as readonly [string, string];
      cells += shade + glyph[isBlack(piece) ? 1 : 0];
    }

    rows.push(`${rank + 1} ${cells}`);
  }

  const files = whiteBottom ? FILE_LETTERS : [...FILE_LETTERS].reverse().join("");
  rows.push(`  ${[...files].map((letter) => ` ${letter}`).join("")}`);

  return rows;
}
