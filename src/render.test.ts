/**
 * ABC-014's acceptance criteria, one test each, plus the snapshot matrix the ticket's and the
 * epic's `## Test notes` both call for.
 *
 * THE FRAME IS ASSERTED AS A VALUE. No test in this file attaches a terminal, reads `isTTY` or
 * writes to stdout — epic acceptance `4c` and `EPIC-006`'s pipe-driven end-to-end test both stand
 * on that being possible, and the ticket's third test-note trap requires it.
 *
 * The other two traps are honoured literally: the orientation test asserts the FILE ORDER and the
 * bottom row's piece letters rather than merely that the two frames differ (a one-axis flip yields
 * a different frame that is wrong), and the ASCII test counts CODE POINTS through the spread,
 * never `charCodeAt` over a possible surrogate pair.
 *
 * The geometry constants and helpers below RESTATE the layout `render.ts` chose — epic acceptance
 * `4a` gives a reference layout and then leaves "the exact split" to the engineer. They are
 * declared here rather than exported from `render.ts` so these tests pin the layout instead of
 * reading it back from the code under test.
 */
import { describe, expect, it } from "vitest";
import { parseFen, toFen } from "./fen.ts";
import { EMPTY, squareAt } from "./position.ts";
import { type GlyphMode, type Orientation, renderBoard } from "./render.ts";

const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/**
 * The standing perft FEN table, transcribed from `src/perft.test.ts:14-56`. Two acceptance
 * criteria are written over "every position in the standing perft FEN table", and a test file
 * cannot import another test file's private const. Six literals rather than a new shared fixture
 * module: every test file in this suite already declares its own FENs (AGENTS.md rules 5 and 9).
 */
const PERFT_FENS: ReadonlyArray<{ name: string; fen: string }> = [
  { name: "startpos", fen: START_FEN },
  { name: "kiwipete", fen: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1" },
  { name: "position-3", fen: "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1" },
  { name: "position-4", fen: "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1" },
  { name: "position-5", fen: "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8" },
  {
    name: "position-6",
    fen: "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
  },
];

const MODES: readonly GlyphMode[] = ["unicode", "ascii"];
const ORIENTATIONS: readonly Orientation[] = ["white-bottom", "black-bottom"];

/** `"8 "` — the rank label plus its separator, in front of every board row. */
const RANK_LABEL_WIDTH = 2;
/** Shading character + piece glyph, or the shading character twice on an empty square. */
const CELL_WIDTH = 2;

const render = (fen: string, mode: GlyphMode, orientation: Orientation): string[] =>
  renderBoard(parseFen(fen), mode, orientation);

/** The eight rows that carry squares — the ones a rank label opens. */
const boardRowsOf = (frame: readonly string[]): string[] =>
  frame.filter((row) => /^[1-8] /.test(row));

/** The one row that carries no rank label. */
const fileLabelRowOf = (frame: readonly string[]): string =>
  frame.filter((row) => !/^[1-8] /.test(row)).join("|");

/** Every square cell in the frame, reading rows top to bottom and cells left to right. */
function cellsOf(frame: readonly string[]): string[] {
  const cells: string[] = [];
  for (const row of boardRowsOf(frame)) {
    for (let start = RANK_LABEL_WIDTH; start < row.length; start += CELL_WIDTH) {
      cells.push(row.slice(start, start + CELL_WIDTH));
    }
  }
  return cells;
}

/**
 * The cell drawn for a named square, located from the ORIENTATION RULE rather than from the
 * module: white at the bottom puts rank 7 in the first row and file 0 in the first column, black
 * at the bottom puts rank 0 in the first row and file 7 in the first column.
 */
function cellAt(frame: readonly string[], orientation: Orientation, square: string): string {
  const file = "abcdefgh".indexOf(square[0] as string);
  const rank = Number(square[1]) - 1;
  const whiteBottom = orientation === "white-bottom";
  const row = boardRowsOf(frame)[whiteBottom ? 7 - rank : rank] as string;
  const start = RANK_LABEL_WIDTH + (whiteBottom ? file : 7 - file) * CELL_WIDTH;
  return row.slice(start, start + CELL_WIDTH);
}

/** A cell's shading character — present on EVERY square, occupied or not. */
const shadeOf = (cell: string): string => cell.slice(0, 1);
/** A cell's second character: the piece glyph, or the shading character again when empty. */
const glyphOf = (cell: string): string => cell.slice(1);

/**
 * The piece glyphs of one DRAWN row, left to right, empty squares skipped — the row in the order a
 * player reads it. Screen order is the point: it is what tells a both-axes flip from a one-axis
 * one, which is invisible to any assertion made per named square.
 */
function glyphsAcrossRow(frame: readonly string[], rowIndex: number): string {
  const row = boardRowsOf(frame)[rowIndex] as string;
  let glyphs = "";
  for (let start = RANK_LABEL_WIDTH; start < row.length; start += CELL_WIDTH) {
    const cell = row.slice(start, start + CELL_WIDTH);
    if (glyphOf(cell) !== shadeOf(cell)) glyphs += glyphOf(cell);
  }
  return glyphs;
}

// ---------------------------------------------------------------------------
// Acceptance — one test per criterion, in the ticket's order.
// ---------------------------------------------------------------------------

describe("ABC-014 acceptance — the board frame", () => {
  it("draws 64 cells, the file row a..h and the rank labels 8..1 with white at the bottom", () => {
    for (const mode of MODES) {
      const frame = render(START_FEN, mode, "white-bottom");

      const cells = cellsOf(frame);
      expect(cells, mode).toHaveLength(64);
      expect(
        cells.every((cell) => cell.length === CELL_WIDTH),
        mode,
      ).toBe(true);

      expect(fileLabelRowOf(frame).trim(), mode).toBe("a b c d e f g h");
      expect(
        boardRowsOf(frame).map((row) => row[0]),
        mode,
      ).toEqual(["8", "7", "6", "5", "4", "3", "2", "1"]);
    }
  });

  it("flips BOTH axes with black at the bottom — file row h..a, ranks 1..8, king before queen", () => {
    const white = render(START_FEN, "ascii", "white-bottom");
    const black = render(START_FEN, "ascii", "black-bottom");

    expect(fileLabelRowOf(black).trim()).toBe("h g f e d c b a");
    expect(boardRowsOf(black).map((row) => row[0])).toEqual([
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
    ]);

    // The one-axis-flip trap, asserted directly: reversing the rows alone leaves the files in
    // a..h order, so White's back rank would still read RNBQKBNR left to right. Flipping both
    // axes puts the king before the queen. A frame reading RNBQKBNR here looks plausible and is
    // wrong. Rank 1 is the LAST drawn row with white at the bottom and the FIRST with black.
    expect(glyphsAcrossRow(black, 0)).toBe("RNBKQBNR");
    expect(glyphsAcrossRow(white, 7)).toBe("RNBQKBNR");

    expect(black).not.toEqual([...white].reverse());
  });

  it("emits ZERO code points above U+007F in ASCII mode, on every standing perft FEN", () => {
    for (const { name, fen } of PERFT_FENS) {
      for (const orientation of ORIENTATIONS) {
        const frame = render(fen, "ascii", orientation).join("\n");
        // Code POINTS, via the spread — `charCodeAt` over a surrogate pair reports the wrong thing.
        const above = [...frame].filter((char) => (char.codePointAt(0) as number) > 0x7f);
        expect(above, `${name} ${orientation}`).toHaveLength(0);
      }
    }
  });

  it("draws Unicode piece cells inside U+2654-U+265F, white and black on different code points", () => {
    const frame = render(START_FEN, "unicode", "white-bottom");

    for (const file of [..."abcdefgh"]) {
      for (const rank of [1, 2, 7, 8]) {
        const glyph = glyphOf(cellAt(frame, "white-bottom", `${file}${rank}`));
        const point = glyph.codePointAt(0) as number;
        expect(point, `${file}${rank}`).toBeGreaterThanOrEqual(0x2654);
        expect(point, `${file}${rank}`).toBeLessThanOrEqual(0x265f);
      }
    }

    // All six types: rook, knight, bishop, queen, king from the back ranks, pawn from the second.
    for (const [white, black] of [
      ["a1", "a8"],
      ["b1", "b8"],
      ["c1", "c8"],
      ["d1", "d8"],
      ["e1", "e8"],
      ["a2", "a7"],
    ]) {
      const whiteGlyph = glyphOf(cellAt(frame, "white-bottom", white as string));
      const blackGlyph = glyphOf(cellAt(frame, "white-bottom", black as string));
      expect(whiteGlyph, `${white} vs ${black}`).not.toBe(blackGlyph);
    }
  });

  it("draws ASCII pieces with case as the only colour marker", () => {
    // Rows 0, 1, 6, 7 are ranks 8, 7, 2, 1 — the order the first test pins.
    const frame = render(START_FEN, "ascii", "white-bottom");

    expect(glyphsAcrossRow(frame, 7)).toBe("RNBQKBNR");
    expect(glyphsAcrossRow(frame, 6)).toBe("PPPPPPPP");
    expect(glyphsAcrossRow(frame, 0)).toBe("rnbqkbnr");
    expect(glyphsAcrossRow(frame, 1)).toBe("pppppppp");
  });

  it("shades adjacent squares differently and gives a1 and h8 the same (dark) character", () => {
    for (const mode of MODES) {
      for (const orientation of ORIENTATIONS) {
        const frame = render(START_FEN, mode, orientation);
        const where = `${mode} ${orientation}`;

        for (const rank of [1, 2, 3, 4, 5, 6, 7, 8]) {
          for (let file = 0; file < 7; file++) {
            const left = cellAt(frame, orientation, `${"abcdefgh"[file]}${rank}`);
            const right = cellAt(frame, orientation, `${"abcdefgh"[file + 1]}${rank}`);
            expect(shadeOf(left), `${where} ${"abcdefgh"[file]}${rank}`).not.toBe(shadeOf(right));
          }
        }

        // a1 and h8 are DARK, and "dark" is only assertable by naming the character: every
        // property that does not name it — corners equal, adjacent differ, two characters in all
        // — is symmetric under swapping the two, so a board with the whole colouring inverted
        // satisfies all of them. Measured, not assumed: two mutants (shading taken from the
        // screen position instead of the square, and the two characters swapped) passed this test
        // until this line existed. `:` is the denser of the two, which is the whole content of
        // "dark" on a character-shaded board.
        expect(shadeOf(cellAt(frame, orientation, "a1")), where).toBe(":");
        expect(shadeOf(cellAt(frame, orientation, "h8")), where).toBe(":");
        expect(shadeOf(cellAt(frame, orientation, "a8")), where).toBe(".");
        expect(new Set(cellsOf(frame).map(shadeOf)), where).toEqual(new Set([":", "."]));
      }
    }
  });

  it("leaves an empty square holding only its shading character, identically in both modes", () => {
    const fen = "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1";
    const position = parseFen(fen);
    const ascii = render(fen, "ascii", "white-bottom");
    const unicode = render(fen, "unicode", "white-bottom");

    let empties = 0;
    for (let rank = 0; rank < 8; rank++) {
      for (let file = 0; file < 8; file++) {
        if (position.board[squareAt(file, rank)] !== EMPTY) continue;
        empties++;

        const square = `${"abcdefgh"[file]}${rank + 1}`;
        const cell = cellAt(ascii, "white-bottom", square);
        expect(new Set([...cell]), square).toEqual(new Set([shadeOf(cell)]));
        expect(cell.trim(), square).toHaveLength(CELL_WIDTH); // never blanked to spaces
        // The mode must not change the shading — that is the divergence the criterion names.
        expect(cellAt(unicode, "white-bottom", square), square).toBe(cell);
      }
    }
    expect(empties).toBe(64 - 10); // position-3 holds ten pieces
  });

  it("renders byte-identically on a repeat and leaves the position untouched", () => {
    for (const mode of MODES) {
      for (const orientation of ORIENTATIONS) {
        const position = parseFen(
          "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1",
        );
        const before = toFen(position);

        const first = renderBoard(position, mode, orientation).join("\n");
        const second = renderBoard(position, mode, orientation).join("\n");

        expect(second, `${mode} ${orientation}`).toBe(first);
        expect(toFen(position), `${mode} ${orientation}`).toBe(before);
      }
    }
  });

  it("keeps one row count and one row width across every perft FEN, mode and orientation", () => {
    const rowCounts = new Set<number>();
    const rowWidths = new Set<number>();

    for (const { fen } of PERFT_FENS) {
      for (const mode of MODES) {
        for (const orientation of ORIENTATIONS) {
          const frame = render(fen, mode, orientation);
          rowCounts.add(frame.length);
          for (const row of frame) rowWidths.add(row.length);
        }
      }
    }

    // Constant geometry is what ABC-018 and epic acceptance 4a stand on: 8 board rows + 1
    // file-label row, every row 2 label columns + 8 cells of 2 characters wide.
    expect(rowCounts).toEqual(new Set([9]));
    expect(rowWidths).toEqual(new Set([RANK_LABEL_WIDTH + 8 * CELL_WIDTH]));
  });
});

// ---------------------------------------------------------------------------
// The frames themselves — two written out by hand, so a human reads the layout in the diff
// rather than trusting a generated snapshot, and 24 generated ones for regression cover.
// ---------------------------------------------------------------------------

describe("ABC-014 — the rendered frame", () => {
  it("draws the start position with white at the bottom", () => {
    expect(render(START_FEN, "ascii", "white-bottom")).toEqual([
      "8 .r:n.b:q.k:b.n:r",
      "7 :p.p:p.p:p.p:p.p",
      "6 ..::..::..::..::",
      "5 ::..::..::..::..",
      "4 ..::..::..::..::",
      "3 ::..::..::..::..",
      "2 .P:P.P:P.P:P.P:P",
      "1 :R.N:B.Q:K.B:N.R",
      "   a b c d e f g h",
    ]);

    expect(render(START_FEN, "unicode", "white-bottom")).toEqual([
      "8 .♜:♞.♝:♛.♚:♝.♞:♜",
      "7 :♟.♟:♟.♟:♟.♟:♟.♟",
      "6 ..::..::..::..::",
      "5 ::..::..::..::..",
      "4 ..::..::..::..::",
      "3 ::..::..::..::..",
      "2 .♙:♙.♙:♙.♙:♙.♙:♙",
      "1 :♖.♘:♗.♕:♔.♗:♘.♖",
      "   a b c d e f g h",
    ]);
  });

  it("draws the start position with black at the bottom", () => {
    expect(render(START_FEN, "ascii", "black-bottom")).toEqual([
      "1 .R:N.B:K.Q:B.N:R",
      "2 :P.P:P.P:P.P:P.P",
      "3 ..::..::..::..::",
      "4 ::..::..::..::..",
      "5 ..::..::..::..::",
      "6 ::..::..::..::..",
      "7 .p:p.p:p.p:p.p:p",
      "8 :r.n:b.k:q.b:n.r",
      "   h g f e d c b a",
    ]);
  });

  for (const { name, fen } of PERFT_FENS) {
    it(`matches its snapshot in both modes and both orientations — ${name}`, () => {
      for (const mode of MODES) {
        for (const orientation of ORIENTATIONS) {
          expect(render(fen, mode, orientation).join("\n")).toMatchSnapshot(
            `${name} ${mode} ${orientation}`,
          );
        }
      }
    });
  }
});
