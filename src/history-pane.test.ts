/**
 * `ABC-017`'s acceptance criteria, in the ticket's order — `A1`-`A10`, plus `A14`.
 *
 * A CRITERION TAKES MORE THAN ONE `it` WHERE ITS CLAUSES WOULD MASK EACH OTHER. A failing
 * assertion ends the test, so a clause that states the REQUIREMENT and a clause that acts as a
 * TRIPWIRE never share an `it`: `A1` is two for that reason and `A9` is three, and the reason is
 * written at each split. `A2` is four because its cases are unrelated. `A6` is two because its
 * fourth anchor is a different INPUT CLASS rather than a different clause — its three assertions
 * share one `it` on the ticket's own ruling, being requirements that discriminate different builds.
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
// The ten lengths of `A1`, built once and shared by `A1`, `A2` and `A10`.
//
// THE FIXTURES ARE BUILDERS AND NOT SINGLETONS. `A9` asserts over a `GameHistory` no earlier test
// has passed to `renderHistory`, so it calls the builder again rather than reusing the shared
// objects — see the D23 note on `A9` below for the survivor that made this necessary.
// ---------------------------------------------------------------------------

function buildLengthCases(): readonly (readonly [plies: number, history: GameHistory])[] {
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

const LENGTH_CASES = buildLengthCases();

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
const WHITE_ANCHOR_PLIES: readonly (readonly [string, string])[] = [
  ["b1", "c3"],
  ["b8", "c6"],
  ["c3", "b1"],
  ["c6", "b8"],
  ["b1", "c3"],
];

/** `27...Nc6 28.Nc3 Nb8 29.Nb1 Nc6` — the same five plies from a BLACK-to-move anchor. */
const BLACK_ANCHOR_PLIES: readonly (readonly [string, string])[] = [
  ["b8", "c6"],
  ["b1", "c3"],
  ["c6", "b8"],
  ["c3", "b1"],
  ["b8", "c6"],
];

const FROM_WHITE_ANCHOR = anchoredShuffle(ANCHOR_27_WHITE, WHITE_ANCHOR_PLIES);
const FROM_BLACK_ANCHOR = anchoredShuffle(ANCHOR_27_BLACK, BLACK_ANCHOR_PLIES);

/**
 * The SAME cycle from the SAME black-to-move anchor, carried to `plies` so the window SLIDES —
 * `BLACK_ANCHOR_PLIES` is its first five plies and the cycle repeats every four.
 *
 * The first three anchors are five plies each, so three rows in a pane of eight: their windows
 * never move, and the pane's leading-half-row correction is a no-op until `rowsInGame` exceeds
 * `HISTORY_ROWS`. A fresh object every call, because `A14` plays a move on its own.
 */
function blackAnchorTo(plies: number): GameHistory {
  const cycle = BLACK_ANCHOR_PLIES.slice(0, 4);
  return anchoredShuffle(
    ANCHOR_27_BLACK,
    Array.from(
      { length: plies },
      (_, ply) => cycle[ply % cycle.length] as readonly [string, string],
    ),
  );
}

const FROM_BLACK_ANCHOR_20 = blackAnchorTo(20);

/**
 * Every history this file builds, FRESH on every call — `A9` needs objects nothing has rendered.
 * One call rebuilds all fourteen, the 2,000-ply shuffle and the 300-ply deterministic game
 * included, and it is the only heavy work this file does more than once.
 */
function buildAllCases(): readonly (readonly [name: string, history: GameHistory])[] {
  return [
    ...buildLengthCases().map(([plies, history]) => [`${plies} plies`, history] as const),
    ["4-digit move number, white cell", widePromotion(WIDE_WHITE_FEN, "d7", "c8")],
    ["4-digit move number, black cell", widePromotion(WIDE_BLACK_FEN, "d2", "c1")],
    ["white-to-move anchor at fullmove 27", anchoredShuffle(ANCHOR_27_WHITE, WHITE_ANCHOR_PLIES)],
    ["black-to-move anchor at fullmove 27", anchoredShuffle(ANCHOR_27_BLACK, BLACK_ANCHOR_PLIES)],
  ];
}

/** The shared set — `A10` asserts a property of the OUTPUT and does not care what has rendered. */
const ALL_CASES: readonly (readonly [name: string, history: GameHistory])[] = [
  ...LENGTH_CASES.map(([plies, history]) => [`${plies} plies`, history] as const),
  ["4-digit move number, white cell", WIDE_WHITE],
  ["4-digit move number, black cell", WIDE_BLACK],
  ["white-to-move anchor at fullmove 27", FROM_WHITE_ANCHOR],
  ["black-to-move anchor at fullmove 27", FROM_BLACK_ANCHOR],
];

describe("ABC-017 acceptance", () => {
  /**
   * `A1`'s TRIPWIRE, in its own `it` — the same split `A13` was given, for the same measured
   * reason. A failing assertion ends the test, so while `HISTORY_ROWS === 8` asserted first in the
   * `it` below, a self-consistent 9-row build (ships 9, exports 9) reported only "expected 9 to be
   * 8" and the row-count REQUIREMENT was never evaluated — the output could not say whether the
   * pane still honoured its own constant.
   */
  it("A1 — HISTORY_ROWS is 8, and it is imported from the pane's own export", () => {
    // Re-declared nowhere in this file: a build that returns 8 rows and exports no constant must
    // not be able to pass the requirement below.
    expect(HISTORY_ROWS).toBe(8);
  });

  it("A1 — renders exactly HISTORY_ROWS rows at every one of the ten lengths", () => {
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
    // D22: the "moves 1 and 2 have slid out" clause was STRUCK from `A3` on 2026-08-12 and its
    // three assertions are gone with it. The eight-row table above is the WHOLE of what this
    // criterion asserts; every statement about what the pane does NOT contain is a consequence of
    // it and can never be the assertion that reports. `A5` guards the slid window non-vacuously.
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
    // The two positional clauses are NOT implied by the normalised table above — normalisation
    // loses position — so they stay. The `numbersOf` clause that stood here WAS implied by it and
    // is gone (D22's shape, recorded in the ticket's `## Test notes`).
    expect(whiteCell(rows[7] as string)).toBe("Ba3    ");
    expect(blackCell(rows[7] as string)).toBe(" ".repeat(7));

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

    // In none of the FIRST three does the pane contain a row numbered 1. The loop is unchanged:
    // it is the sole catcher in this table for `WPHANTOM` — a stray row numbered `1.` emitted into
    // the blank region only for a white-to-move anchor past fullmove 1 — where it fails with
    // "expected [ 27, 28, 29, 1 ] to not include 1". The fourth anchor is asserted separately below
    // and is deliberately NOT added here.
    for (const rows of [fromStart, fromWhite, fromBlack]) expect(numbersOf(rows)).not.toContain(1);
  });

  /**
   * `A6`'s FOURTH anchor, and the three assertions share one `it` on the ticket's own ruling: all
   * three are requirements on the pane's OUTPUT and they discriminate different builds, so each
   * reports on the build it catches and neither masks the other.
   *
   * The gap it closes is the PRODUCT of two dimensions. `A6`'s first three anchors are five plies
   * each, so their windows never slide; `A1`'s ten lengths are all `newGame(START_FEN)`, so they
   * are all white-anchored; `A2`'s black anchor is one ply. So the pane's leading-half-row terms
   * were exercised only where they are no-ops — and `A13` cannot see it either, because `A13`
   * composes the exported CONSTANT `HISTORY_ROWS` and never the pane's output.
   *
   * Twenty plies rather than the minimum sixteen: three whole rows have slid out, so an off-by-one
   * in either correction term is still visible. The same cycle from the WHITE anchor at 20 plies
   * renders 29-36, which is the contrast that makes the ANCHOR, not the length, the thing tested.
   */
  it("A6 — the FOURTH anchor: black-to-move with the window SLID and the leading half-row GONE", () => {
    const rows = renderHistory(FROM_BLACK_ANCHOR_20);

    // A build dropping the leading half-row from `rowsInGame` returns NINE ROWS here, from a pane
    // whose single reason for existing is a constant height.
    expect(rows).toHaveLength(HISTORY_ROWS);
    expect(numbersOf(rows)).toEqual([30, 31, 32, 33, 34, 35, 36, 37]);

    // A build dropping it from `firstVisiblePly` instead puts a phantom EMPTY white cell at the top
    // of every slid black-anchored window — `D5`'s defect class INVERTED, and passed by the
    // criterion added for `D5`. Once the window has slid the leading half-row is GONE, so row 1
    // opens with a white ply. Read positionally: normalisation cannot tell an empty cell from a
    // shifted one.
    expect(whiteCell(rows[0] as string).trim()).toBe("Nc3");
    expect(normalised(rows[7] as string)).toBe("37. Nb1");
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

  /**
   * `A9`, IN TWO `it`s OVER FIXTURES BUILT HERE — D23, and both halves of that are load-bearing.
   *
   * THE FIXTURES. `ALL_CASES` are module-scope singletons that `A1`, `A2` and `A6` have already
   * rendered, so a snapshot taken over them is taken AFTER any first-render corruption — the
   * `ABC-016` defect this criterion exists to prevent, reproduced at FILE scope. Measured: `WPOS`
   * — a pane that corrupts the caller's `history.position` once per object and changes no rendered
   * byte — passes 732/732 on 26 files against the shared fixtures, with zero catchers anywhere in
   * the project, and fails here. `buildAllCases()` is called inside each test for that reason.
   *
   * THE SPLIT. Byte-identical asserts over a whole pane and the non-mutation clauses assert over
   * two scalars, and in one `it` the first one masks the others: on a build that corrupts on every
   * render, `expect(second).toEqual(first)` fails and `moves.length` — the clause the ticket calls
   * "the criterion" — is never evaluated. Same silent-precedence shape as `A1` and `A13`.
   */
  it("A9 — two renders of a history nothing has rendered are byte-identical", () => {
    for (const [name, history] of buildAllCases()) {
      const first = renderHistory(history);
      const second = renderHistory(history);

      expect(second, name).toEqual(first);
    }
  });

  it("A9 — neither render touches the caller's position, its move count or its ANCHOR", () => {
    for (const [name, history] of buildAllCases()) {
      // Snapshotted before this object's FIRST render BY ANYTHING AT ALL: one taken between two
      // renders is byte-identical across a build that corrupts on every render, and one taken over
      // an already-rendered object is blind to a build that corrupts once per object.
      const fenBefore = toFen(history.position);
      const lengthBefore = history.moves.length;
      // `GameHistory` is `{ initialFen, moves, position }` and this criterion named two of the
      // three. `initialFen` is not an incidental third field: it is THE ANCHOR, the input `A6`,
      // `D4` and `D5` all turn on, and the one this pane re-parses on every render. A build that
      // rewrites it on the caller changes no rendered byte of its own output.
      const anchorBefore = history.initialFen;

      renderHistory(history);
      renderHistory(history);

      expect(toFen(history.position), `${name} position`).toBe(fenBefore);
      expect(history.moves.length, `${name} move count`).toBe(lengthBefore);
      expect(history.initialFen, `${name} anchor`).toBe(anchorBefore);
    }
  });

  /**
   * `A9`'s DURING-render clause, in its own `it` because a before/after snapshot cannot express it.
   *
   * The two clauses above are a comparison at the ENDS of a render, so a pane that mutates the
   * caller's array and puts it back is invisible to them: it splices `moves` down to the window and
   * `unshift`s it back, and every snapshot agrees. `A11`'s spies do not see it either — they watch
   * `takeBack` and `playMove`, and raw array operations are neither.
   *
   * The instrument is therefore live ACROSS the call rather than at its ends: freeze the caller's
   * array first, so a mutation THROWS at the moment it happens instead of being tidied away before
   * anyone looks. ESM is strict, so `splice` / `push` / an element write on a frozen array throw
   * `TypeError`. It is the exact inverse of `WFREEZE` — there the PANE freezes the caller's array
   * and bricks it; here the TEST does, and the pane must not care.
   */
  it("A9 — the caller's moves array is not mutated AT ANY POINT DURING a render", () => {
    for (const [name, history] of buildAllCases()) {
      Object.freeze(history.moves);
      // The instrument is armed rather than assumed: `moves` is a real array on the object, not a
      // getter handing out a fresh copy, so freezing it is a guard and not a no-op.
      expect(Object.isFrozen(history.moves), `${name} instrument armed`).toBe(true);

      expect(() => renderHistory(history), `${name} first render`).not.toThrow();
      expect(() => renderHistory(history), `${name} second render`).not.toThrow();
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

  /**
   * `A14` — FRESHNESS, and it is the one property here that REQUIRES a shared object.
   *
   * Nothing else on this ticket ever USED a `GameHistory` after rendering it, and two wrong builds
   * live in that gap: one freezes the caller's `moves` and leaves it unable to play another move
   * while satisfying `A9` exactly, and one memoises rows per `GameHistory` and shows move 1
   * forever. The consumer is real — `playMove` mutates in place (`src/history.ts:85-88`), so
   * `ABC-019`'s loop hands the SAME OBJECT to `renderHistory` every frame.
   *
   * SHARING THE OBJECT ACROSS THE TWO RENDERS IS THE ASSERTION, and it is not a `D23` regression.
   * `D23` is about an object an EARLIER, UNRELATED test rendered before a snapshot was taken; this
   * test owns its object, builds it here, and shares it deliberately inside its own criterion. The
   * three properties are distinct: determinism wants any fixture and a cache satisfies it
   * perfectly, non-mutation wants an object nothing has rendered (`A9`, `D23`), and freshness is a
   * statement about a SEQUENCE — a fresh object has no earlier render to be stale against.
   *
   * `WSPLICE` is deliberately NOT this criterion's to catch: it restores what it breaks, so
   * render -> play -> render sees nothing. It belongs to `A9`'s during-render clause above.
   */
  it("A14 — the caller is still USABLE after a render, and the next render is FRESH", () => {
    const history = blackAnchorTo(20);
    const first = renderHistory(history);

    expect(normalised(first[7] as string)).toBe("37. Nb1");

    // A pane that freezes the caller's `moves` satisfies every clause of `A9` — position
    // unchanged, length unchanged, anchor unchanged — and bricks the caller: ESM is strict, so the
    // next `playMove`'s `moves.push` throws `TypeError`. Asserted first because it is the failure
    // that stops the loop dead.
    expect(() => play(history, "b8", "c6"), "playMove after a render").not.toThrow();

    const second = renderHistory(history);

    // A pane that memoises rows per `GameHistory` shows move 1 forever and the game is unreadable
    // from move 2. It satisfies determinism BETTER than the correct build, which is why the
    // criterion that owns determinism cannot be the one that catches it.
    expect(second).not.toEqual(first);
    expect(normalised(second[7] as string)).toBe("37. Nb1 Nc6");
    expect(history.moves).toHaveLength(21);
  });
});
