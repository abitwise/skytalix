/**
 * `ABC-017`'s acceptance criteria, one test each in the ticket's order — `A1`-`A10`.
 *
 * `A11` is a spied CALL COUNT and lives in `src/history-pane.nfr.test.ts`, because a `vi.mock`
 * factory is hoisted to file scope and vitest's module-registry isolation is per FILE: putting it
 * here would re-route the module graph for this whole acceptance table to buy four assertions.
 * `A12`'s two wall-clock parts are measured out of tree with their machine and are asserted NOWHERE
 * in this suite — this project's standing rule — and its third part IS `A11`. `A13` is the frame's
 * composition fit-check and lives in `src/frame.test.ts`, where the arithmetic it checks lives.
 *
 * EVERY ROW IS READ POSITIONALLY, not by substring. The pane's layout is `9999. WWWWWWW BBBBBBB`
 * and `A3`, `A6` and `A7` all turn on WHICH CELL a SAN string landed in — a row that says `27. Nc6`
 * is right when `Nc6` is Black's and wrong when it is in White's column, and no substring test can
 * tell those apart. Move numbers are read as INTEGERS for the same reason: `41.` contains `1.`.
 *
 * THE LINE IN `A3` IS STATED, NOT GENERATED — the ticket writes it out move by move — so it does not
 * move if the move generator's ordering ever does. It is played by from/to coordinates through
 * `legalMoves`, so the SAN strings the pane produces are never compared against SAN this file wrote.
 */
import { describe, expect, it } from "vitest";
import { toFen } from "./fen.ts";
import { type GameHistory, newGame, playMove, takeBack } from "./history.ts";
import { HISTORY_COLS, HISTORY_ROWS, renderHistory } from "./history-pane.ts";
import { legalMoves } from "./legal.ts";
import type { Move } from "./moves.ts";
import { parseSquareName, QUEEN } from "./position.ts";

/** Every test file in this suite declares its own — `ABC-012` forbids a shared constant for it. */
const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/** Plays the named move through `playMove`, throwing if it is not legal in the live position. */
function play(history: GameHistory, from: string, to: string): void {
  const move = legalMoves(history.position).find(
    (candidate) => candidate.from === parseSquareName(from) && candidate.to === parseSquareName(to),
  );
  if (move === undefined) throw new Error(`no legal move ${from}${to}`);
  playMove(history, move);
}

/**
 * `A3`'s 20-ply line, as coordinates:
 * `1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.c3 Nf6 5.d4 exd4 6.cxd4 Bb4+ 7.Nc3 Nxe4 8.O-O Bxc3 9.bxc3 d5
 * 10.Ba3 Be6`. It carries a check, a castle, a piece capture, two pawn captures with the file
 * qualifier, and a window that has already slid.
 */
const THE_LINE: readonly (readonly [string, string])[] = [
  ["e2", "e4"],
  ["e7", "e5"],
  ["g1", "f3"],
  ["b8", "c6"],
  ["f1", "c4"],
  ["f8", "c5"],
  ["c2", "c3"],
  ["g8", "f6"],
  ["d2", "d4"],
  ["e5", "d4"],
  ["c3", "d4"],
  ["c5", "b4"],
  ["b1", "c3"],
  ["f6", "e4"],
  ["e1", "g1"],
  ["b4", "c3"],
  ["b2", "c3"],
  ["d7", "d5"],
  ["c1", "a3"],
  ["c8", "e6"],
];

/** `A3`'s line truncated to `plies`, anchored at `fen`. */
function lineTo(plies: number, fen: string = START_FEN): GameHistory {
  const history = newGame(fen);
  for (const [from, to] of THE_LINE.slice(0, plies)) play(history, from, to);
  return history;
}

/**
 * `ABC-012`'s deterministic pseudo-random game (`src/history.test.ts:74-88`), re-declared here as
 * every test file in this suite re-declares its fixtures. A fixed LCG over the generator's own
 * ordering, so the game is identical on every run and every machine, and it terminates at exactly
 * 378 plies — which is why it is the builder for 40/80/120/300 and cannot produce 2,000.
 */
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

/** The four-ply knight cycle: legal at every ply and never ending, so 2,000 plies is reachable. */
const SHUFFLE: readonly (readonly [string, string])[] = [
  ["g1", "f3"],
  ["g8", "f6"],
  ["f3", "g1"],
  ["f6", "g8"],
];

function shuffleGame(plies: number): GameHistory {
  const history = newGame(START_FEN);
  for (let ply = 0; ply < plies; ply++) {
    const [from, to] = SHUFFLE[ply % SHUFFLE.length] as readonly [string, string];
    play(history, from, to);
  }
  return history;
}

// ---------------------------------------------------------------------------
// Reading a rendered row. The pane's layout is `9999. WWWWWWW BBBBBBB`, pinned here.
// ---------------------------------------------------------------------------

const whiteCell = (row: string): string => row.slice(6, 13);
const blackCell = (row: string): string => row.slice(14, 21);
const isBlank = (row: string): boolean => row.trim() === "";
const normalised = (row: string): string => row.trim().replace(/\s+/g, " ");

/** The move numbers of the non-blank rows, as INTEGERS — never as the substring `41.`. */
const numbersOf = (rows: readonly string[]): number[] =>
  rows.filter((row) => !isBlank(row)).map((row) => Number(row.slice(0, 5).replace(".", "")));

// ---------------------------------------------------------------------------
// The ten lengths of `A1`, built once and shared by `A1`, `A2`, `A9` and `A10`.
// ---------------------------------------------------------------------------

const LENGTH_CASES: readonly (readonly [plies: number, history: GameHistory])[] = [
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

/**
 * A 4-digit move number with a 7-character SAN in the WHITE cell: `9998. dxc8=Q+`. The pawn
 * promotes with a capture and gives check along the c8-e6 diagonal.
 */
const WIDE_WHITE_FEN = "2n5/3P4/4k3/8/8/8/8/4K3 w - - 0 9998";

/**
 * The same in the BLACK cell, on a black-to-move anchor: `9999. <empty> dxc1=Q+`, which is also a
 * leading half-row carrying the widest cell this grammar can produce.
 */
const WIDE_BLACK_FEN = "4k3/8/8/8/8/2K5/3p4/2N5 b - - 0 9999";

function widePromotion(fen: string, from: string, to: string): GameHistory {
  const history = newGame(fen);
  const move = legalMoves(history.position).find(
    (candidate) =>
      candidate.from === parseSquareName(from) &&
      candidate.to === parseSquareName(to) &&
      candidate.promotion === QUEEN,
  );
  if (move === undefined) throw new Error(`no promotion to queen ${from}${to}`);
  playMove(history, move);
  return history;
}

const WIDE_WHITE = widePromotion(WIDE_WHITE_FEN, "d7", "c8");
const WIDE_BLACK = widePromotion(WIDE_BLACK_FEN, "d2", "c1");

/** The anchors of `A6`, built with `newGame(fen)` and never by playing from the start FEN. */
const ANCHOR_27_WHITE = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 27";
const ANCHOR_27_BLACK = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 27";

function anchoredShuffle(fen: string, steps: readonly (readonly [string, string])[]): GameHistory {
  const history = newGame(fen);
  for (const [from, to] of steps) play(history, from, to);
  return history;
}

/** `27.Nc3 Nc6 28.Nb1 Nb8 29.Nc3` — five plies from a white-to-move anchor at fullmove 27. */
const FROM_WHITE_ANCHOR = anchoredShuffle(ANCHOR_27_WHITE, [
  ["b1", "c3"],
  ["b8", "c6"],
  ["c3", "b1"],
  ["c6", "b8"],
  ["b1", "c3"],
]);

/** `27...Nc6 28.Nc3 Nb8 29.Nb1 Nc6` — the same five plies from a BLACK-to-move anchor. */
const FROM_BLACK_ANCHOR = anchoredShuffle(ANCHOR_27_BLACK, [
  ["b8", "c6"],
  ["b1", "c3"],
  ["c6", "b8"],
  ["c3", "b1"],
  ["b8", "c6"],
]);

/** Every history this file builds — `A9` and `A10` are asserted over all of them. */
const ALL_CASES: readonly (readonly [name: string, history: GameHistory])[] = [
  ...LENGTH_CASES.map(([plies, history]) => [`${plies} plies`, history] as const),
  ["4-digit move number, white cell", WIDE_WHITE],
  ["4-digit move number, black cell", WIDE_BLACK],
  ["white-to-move anchor at fullmove 27", FROM_WHITE_ANCHOR],
  ["black-to-move anchor at fullmove 27", FROM_BLACK_ANCHOR],
];

describe("ABC-017 acceptance", () => {
  it("A1 — renders exactly HISTORY_ROWS rows at every one of the ten lengths, and it is 8", () => {
    // HISTORY_ROWS is IMPORTED from the pane's own export and is re-declared nowhere in this file:
    // a build that returns 8 rows and exports no constant must not be able to pass this.
    expect(HISTORY_ROWS).toBe(8);

    for (const [plies, history] of LENGTH_CASES) {
      // The ply count is asserted so a game that ended early cannot silently weaken the case.
      expect(history.moves, `${plies}-ply fixture length`).toHaveLength(plies);
      expect(renderHistory(history), `${plies} plies`).toHaveLength(HISTORY_ROWS);
    }
  });

  it("A2 — every row is exactly HISTORY_COLS characters at every one of the ten lengths", () => {
    for (const [plies, history] of LENGTH_CASES) {
      for (const [index, row] of renderHistory(history).entries()) {
        expect(row, `${plies} plies, row ${index + 1}`).toHaveLength(HISTORY_COLS);
      }
    }
  });

  it("A2 — a blank row is HISTORY_COLS spaces, and at 0 plies all 8 rows are blank", () => {
    const empty = renderHistory(lineTo(0));

    expect(empty).toEqual(new Array<string>(HISTORY_ROWS).fill(" ".repeat(HISTORY_COLS)));
  });

  it("A2 — 300 plies is identical in count and width to 0 plies", () => {
    const empty = renderHistory(lineTo(0));
    const long = renderHistory(deterministicGame(300));

    expect(long).toHaveLength(empty.length);
    expect(long.map((row) => row.length)).toEqual(empty.map((row) => row.length));
  });

  it("A2 — the width does not vary with move-number magnitude or SAN length, and nothing is cut", () => {
    // The stated requirement on HISTORY_COLS: a 4-digit move number and a 7-character SAN, in
    // either cell, with NO truncation. `dxc8=Q+` and `dxc1=Q+` are the longest strings the grammar
    // emits, and 9998/9999 are the widest move numbers reachable by play.
    const white = renderHistory(WIDE_WHITE);
    const black = renderHistory(WIDE_BLACK);

    expect(normalised(white[0] as string)).toBe("9998. dxc8=Q+");
    expect(whiteCell(white[0] as string)).toBe("dxc8=Q+");
    expect(normalised(black[0] as string)).toBe("9999. dxc1=Q+");
    expect(blackCell(black[0] as string)).toBe("dxc1=Q+");
    expect(whiteCell(black[0] as string)).toBe(" ".repeat(7));

    for (const row of [...white, ...black]) expect(row).toHaveLength(HISTORY_COLS);
  });

  it("A3 — the exact eight rows and all sixteen cells of the stated 20-ply line", () => {
    const rows = renderHistory(lineTo(20));

    expect(rows.map(normalised)).toEqual([
      "3. Bc4 Bc5",
      "4. c3 Nf6",
      "5. d4 exd4",
      "6. cxd4 Bb4+",
      "7. Nc3 Nxe4",
      "8. O-O Bxc3",
      "9. bxc3 d5",
      "10. Ba3 Be6",
    ]);
    // Read again as CELLS, so a build that puts the right strings in the wrong columns fails here
    // rather than passing on a whitespace-normalised row.
    expect(rows.map((row) => [whiteCell(row).trim(), blackCell(row).trim()])).toEqual([
      ["Bc4", "Bc5"],
      ["c3", "Nf6"],
      ["d4", "exd4"],
      ["cxd4", "Bb4+"],
      ["Nc3", "Nxe4"],
      ["O-O", "Bxc3"],
      ["bxc3", "d5"],
      ["Ba3", "Be6"],
    ]);
    // Moves 1 and 2 have slid out of the window. Asserted as move NUMBERS and as whole rows —
    // never as the substring `e4`, which is also the tail of `Nxe4` in row 5.
    expect(numbersOf(rows)).toEqual([3, 4, 5, 6, 7, 8, 9, 10]);
    expect(rows.map(normalised)).not.toContain("1. e4 e5");
    expect(rows.map(normalised)).not.toContain("2. Nf3 Nc6");
  });

  it("A4 — 19 plies: the last row carries the white ply ALONE and no black ply sits in a white cell", () => {
    // The only case that separates "the last 8 move NUMBERS" from "the last 16 PLIES". A build
    // windowing plies renders `2. Nc6 Bc4` here — every cell in the wrong column, every number one
    // too low, eight rows, all ASCII.
    const rows = renderHistory(lineTo(19));

    expect(rows.map(normalised)).toEqual([
      "3. Bc4 Bc5",
      "4. c3 Nf6",
      "5. d4 exd4",
      "6. cxd4 Bb4+",
      "7. Nc3 Nxe4",
      "8. O-O Bxc3",
      "9. bxc3 d5",
      "10. Ba3",
    ]);
    expect(whiteCell(rows[7] as string)).toBe("Ba3    ");
    expect(blackCell(rows[7] as string)).toBe(" ".repeat(7));
    expect(numbersOf(rows)).toEqual([3, 4, 5, 6, 7, 8, 9, 10]);

    // Every white cell holds a WHITE ply: the black plies of this line, in the white column, would
    // be the wrong-window build's signature.
    const whites = rows.map((row) => whiteCell(row).trim());
    for (const black of ["Bc5", "Nf6", "exd4", "Bb4+", "Nxe4", "Bxc3", "d5"]) {
      expect(whites, `${black} must not be in a white cell`).not.toContain(black);
    }
  });

  it("A5 — the most recent 8 move numbers of the 80-ply deterministic game: 33..40", () => {
    const rows = renderHistory(deterministicGame(80));

    expect(numbersOf(rows)).toEqual([33, 34, 35, 36, 37, 38, 39, 40]);
  });

  it("A6 — the anchor decides the numbers and the columns, on all three anchors", () => {
    const fromStart = renderHistory(lineTo(20));
    const fromWhite = renderHistory(FROM_WHITE_ANCHOR);
    const fromBlack = renderHistory(FROM_BLACK_ANCHOR);

    expect(normalised(fromStart[0] as string)).toBe("3. Bc4 Bc5");

    expect(fromWhite.slice(0, 3).map(normalised)).toEqual([
      "27. Nc3 Nc6",
      "28. Nb1 Nb8",
      "29. Nc3",
    ]);

    // The third anchor is the one no implementation stumbles into by accident: the FIRST row's
    // white cell is empty and its black cell holds the first ply.
    expect(whiteCell(fromBlack[0] as string)).toBe(" ".repeat(7));
    expect(blackCell(fromBlack[0] as string).trim()).toBe("Nc6");
    expect(numbersOf(fromBlack)).toEqual([27, 28, 29]);
    expect(
      fromBlack.slice(0, 3).map((row) => [whiteCell(row).trim(), blackCell(row).trim()]),
    ).toEqual([
      ["", "Nc6"],
      ["Nc3", "Nb8"],
      ["Nb1", "Nc6"],
    ]);

    // In none of the three does the pane contain a row numbered 1.
    for (const rows of [fromStart, fromWhite, fromBlack]) expect(numbersOf(rows)).not.toContain(1);
  });

  it("A7 — takeBack(2) slides the window by a whole move; takeBack(1) leaves a half-row", () => {
    const undone = deterministicGame(80);
    takeBack(undone, 2);
    const afterTwo = renderHistory(undone);

    expect(undone.moves).toHaveLength(78);
    expect(numbersOf(afterTwo)).toEqual([32, 33, 34, 35, 36, 37, 38, 39]);
    expect(whiteCell(afterTwo[7] as string).trim()).not.toBe("");
    expect(blackCell(afterTwo[7] as string).trim()).not.toBe("");

    const halved = deterministicGame(80);
    takeBack(halved, 1);
    const afterOne = renderHistory(halved);

    expect(halved.moves).toHaveLength(79);
    expect(numbersOf(afterOne)).toEqual([33, 34, 35, 36, 37, 38, 39, 40]);
    expect(whiteCell(afterOne[7] as string).trim()).not.toBe("");
    expect(blackCell(afterOne[7] as string)).toBe(" ".repeat(7));

    for (const row of [...afterTwo, ...afterOne]) expect(row).toHaveLength(HISTORY_COLS);
  });

  it("A8 — content is TOP-aligned: row 1 first, blanks at the bottom", () => {
    const one = renderHistory(lineTo(1));
    expect(normalised(one[0] as string)).toBe("1. e4");
    expect(one.slice(1).every(isBlank)).toBe(true);

    const three = renderHistory(lineTo(3));
    expect(normalised(three[0] as string)).toBe("1. e4 e5");
    expect(normalised(three[1] as string)).toBe("2. Nf3");
    expect(three.slice(2).every(isBlank)).toBe(true);
  });

  it("A9 — byte-identical twice, and the caller's history is untouched by either render", () => {
    for (const [name, history] of ALL_CASES) {
      // The snapshots are taken BEFORE the first render: one taken between two renders is
      // byte-identical across a build that corrupts on EVERY render.
      const fenBefore = toFen(history.position);
      const lengthBefore = history.moves.length;

      const first = renderHistory(history);
      const second = renderHistory(history);

      expect(second, name).toEqual(first);
      expect(toFen(history.position), `${name} position`).toBe(fenBefore);
      expect(history.moves.length, `${name} move count`).toBe(lengthBefore);
    }
  });

  it("A10 — zero code points above U+007F in the pane's own rows, unconditionally", () => {
    for (const [name, history] of ALL_CASES) {
      const above = [...renderHistory(history).join("")].filter(
        (character) => (character.codePointAt(0) as number) > 0x7f,
      );
      expect(above, name).toHaveLength(0);
    }
  });
});
