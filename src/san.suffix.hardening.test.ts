/**
 * ABC-025 QE gate — the rows that close the ONE gap this hop measured: the qualifier and the
 * check/mate suffix are never asserted TOGETHER anywhere in this repository.
 *
 * THE MEASUREMENT, not an opinion. Over the whole repository, at the delivered tree:
 *
 *   hand-typed rows in `src/san.test.ts` (52) + `src/san.qualifier.hardening.test.ts` (63)   111
 *   of those, rows carrying BOTH a qualifier and a `+`/`#`                                     0
 *   qualified MOVES in ABC-025's 207-position corpus that also give check                     32
 *   qualified MOVES in that corpus that also give MATE                                         0
 *
 * `A1` strips a trailing `+`/`#` before it reads the qualifier back out (it must — it is a
 * qualifier property), so it is blind to the suffix by construction. `A4`/injectivity does not
 * see a dropped suffix either: two rivals that both check still carry different qualifiers, so
 * the strings stay distinct. The SAN-shape property accepts a suffix-free string. The result was
 * measured with two mutants, both applied to a copy of `src/` outside the repository:
 *
 *   QS2  the check/mate suffix is dropped when the move carries a qualifier   672/672  SURVIVED
 *   QS3  a MATE by a qualified move loses its `#`, the `+` case left correct  672/672  SURVIVED
 *
 * Both die on the rows below. This is the same species of hole as the one `ABC-025` itself was cut
 * for — a net that is exercised on one feature at a time and never on two at once — one axis
 * further out: `ABC-025` added the missing (piece type x colour x capture-ness x rung) cells, and
 * this file adds the missing (rung x suffix) ones.
 *
 * NOTHING HERE TOUCHES ANY EXISTING FILE. `src/san.test.ts` and `src/san.qualifier.hardening.test.ts`
 * are byte-identical to their delivered state; these five positions are their own table, so
 * `ABC-013`'s `A18`/`A19` (which quantify over "the 18 named positions") and `ABC-025`'s `A5`
 * (which asserts its table holds exactly 23) keep their meaning — the ticket's `## Test notes`
 * note 1, applied to this hop rather than quoted at it.
 *
 * Every string below was typed by hand from its FEN's geometry and then put to `chess.js@1.4.0`,
 * installed with `npm install` in a scratchpad OUTSIDE the repository: 5 positions offered / 0
 * refused, 11 strings / 0 disputed, 115 legal moves compared move-for-move / 0 mismatches, and
 * `package.json` / `package-lock.json` md5-identical before and after. No dependency was added.
 */
import { describe, expect, it } from "vitest";
import { parseFen, toFen } from "./fen.ts";
import { legalMoves } from "./legal.ts";
import type { Move } from "./moves.ts";
import { EMPTY, type Position, parseSquareName } from "./position.ts";
import { toSan } from "./san.ts";

/**
 * Five positions, each carrying a QUALIFIED move that also carries a suffix. The three check
 * positions walk the whole ladder — two knights that share neither axis (file rung), two that
 * share a file (rank rung), and `ABC-013`'s three-queen arrangement moved next to a black king so
 * that the full-square rung also gives check.
 */
const POSITIONS = {
  /** Black knights b6 and f4 both reach d5; d5 checks the white king on e3. FILE rung. */
  "QE-CHK-FILE": "k7/8/1n6/8/5n2/4K3/8/8 b - - 0 1",
  /** The same arrangement with a white pawn on d5: a qualified CAPTURE that also gives check. */
  "QE-CHK-FILE-X": "k7/8/1n6/3P4/5n2/4K3/8/8 b - - 0 1",
  /** Black knights b3 and b5 share the b-file, so the RANK rung is forced; d4 checks e2. */
  "QE-CHK-RANK": "k7/8/8/1n6/8/1n6/4K3/8 b - - 0 1",
  /** Three white queens reach e1 and e1 checks the black king on a5. The SQUARE rung. */
  "QE-CHK-SQUARE": "8/8/8/k7/4Q2Q/8/8/K6Q w - - 0 1",
  /** Both white knights reach f7 and f7 is smothered mate. The only qualified MATE in the repo. */
  "QE-MATE-FILE": "6rk/6pp/3N3N/8/8/8/8/K7 w - - 0 1",
} as const;

type PositionId = keyof typeof POSITIONS;

/** One row: a named position, the move by `from`-`to`, and the exact string. */
type Row = readonly [id: PositionId, from: string, to: string, expected: string];

/**
 * The move `from`-`to` TAKEN OUT OF `legalMoves(position)` and asserted to name EXACTLY ONE legal
 * move before any string is read — `ADR-0004` clause 2b, and `ABC-009`'s `expectImpostorSetup`
 * lesson. Never a hand-built `Move` literal.
 */
function moveFor(position: Position, from: string, to: string): Move {
  const fromSquare = parseSquareName(from);
  const toSquare = parseSquareName(to);
  const matches = legalMoves(position).filter(
    (move) => move.from === fromSquare && move.to === toSquare && move.promotion === EMPTY,
  );

  expect(matches, `${from}-${to} must name exactly one legal move`).toHaveLength(1);
  return matches[0] as Move;
}

/** Asserts a row in BOTH call forms, and that the render left the position byte-identical. */
function expectRows(rows: readonly Row[]): void {
  for (const [id, from, to, expected] of rows) {
    const fen = POSITIONS[id];
    const position = parseFen(fen);
    const legal = legalMoves(position);
    const move = moveFor(position, from, to);

    expect(toSan(position, move), `${id} ${from}-${to}`).toBe(expected);
    expect(toSan(position, move, legal), `${id} ${from}-${to} with the legal list`).toBe(expected);
    expect(toFen(position), `${id} ${from}-${to} left the position changed`).toBe(fen);
  }
}

/** Every row of this file, so the coverage guard below quantifies over the same set the tests do. */
const CHECK_ROWS: readonly Row[] = [
  ["QE-CHK-FILE", "b6", "d5", "Nbd5+"],
  ["QE-CHK-FILE", "f4", "d5", "Nfd5+"],
  ["QE-CHK-RANK", "b3", "d4", "N3d4+"],
  ["QE-CHK-RANK", "b5", "d4", "N5d4+"],
  ["QE-CHK-SQUARE", "e4", "e1", "Qee1+"],
  ["QE-CHK-SQUARE", "h1", "e1", "Q1e1+"],
  ["QE-CHK-SQUARE", "h4", "e1", "Qh4e1+"],
];

const CAPTURE_ROWS: readonly Row[] = [
  ["QE-CHK-FILE-X", "b6", "d5", "Nbxd5+"],
  ["QE-CHK-FILE-X", "f4", "d5", "Nfxd5+"],
];

const MATE_ROWS: readonly Row[] = [
  ["QE-MATE-FILE", "d6", "f7", "Ndf7#"],
  ["QE-MATE-FILE", "h6", "f7", "Nhf7#"],
];

const ALL_ROWS: readonly Row[] = [...CHECK_ROWS, ...CAPTURE_ROWS, ...MATE_ROWS];

describe("ABC-025 QE — a qualifier and a suffix on the SAME string", () => {
  it("keeps both the qualifier and the `+` at all three rungs of the ladder", () => {
    // Kills QS2 (the suffix dropped whenever a qualifier is emitted). Rung by rung, because a
    // build could be wrong on one rung only — which is exactly what ABC-025's own census exists
    // to make impossible on the other four axes.
    expectRows(CHECK_ROWS);
  });

  it("keeps the `x` as well when the qualified checking move is a capture", () => {
    expectRows(CAPTURE_ROWS);
  });

  it("keeps both the qualifier and the `#` on a qualified MATE", () => {
    // Kills QS3. This is the only qualified mate anywhere in the repository: ABC-025's
    // 207-position corpus contains 32 qualified checks and ZERO qualified mates, measured.
    expectRows(MATE_ROWS);
  });

  it("is not vacuous: every row really does carry a qualifier AND a suffix, at every rung", () => {
    // The anti-vacuity guard, and it is ABC-025's `A2` lesson applied to this axis: a row that
    // silently stopped carrying both would leave QS2/QS3 alive again while staying green. The
    // qualifier is read back OUT of the expected string — nothing here asks `src/san.ts` for it,
    // because `A20` pins that module to one export.
    const rungs = new Set<string>();
    const suffixes = new Set<string>();

    for (const [, , , expected] of ALL_ROWS) {
      const suffix = expected.slice(-1);
      const bare = expected.slice(0, -1);
      const qualifier = bare.slice(1, -2).replace(/x$/, "");

      expect(["+", "#"], `${expected} carries no suffix`).toContain(suffix);
      expect(qualifier.length, `${expected} carries no qualifier`).toBeGreaterThan(0);

      rungs.add(qualifier.length === 2 ? "square" : /[a-h]/.test(qualifier) ? "file" : "rank");
      suffixes.add(suffix);
    }

    expect(ALL_ROWS).toHaveLength(11);
    expect([...rungs].sort()).toEqual(["file", "rank", "square"]);
    expect([...suffixes].sort()).toEqual(["#", "+"]);
    expect(Object.keys(POSITIONS)).toHaveLength(5);

    for (const [id, fen] of Object.entries(POSITIONS)) {
      expect(toFen(parseFen(fen)), `${id} round-trips through toFen`).toBe(fen);
    }
  });
});
