/**
 * ABC-025 — the SAN qualifier minimality net.
 *
 * `ABC-013`'s acceptance table exercises the disambiguation ladder on WHITE KNIGHTS and WHITE QUEENS,
 * on QUIET moves, and on nothing else — all 18 of its FENs are white to move. BA/PM measured what
 * that costs at the cutting hop: **six wrong builds of `toSan` pass all 652 tests on 20 files**, five
 * of them emitting an over-qualified string (`Ra1b1` where `Rab1` is right) and the sixth dropping
 * the `x` from a black piece capture. This file is the net that sees them. It adds no production
 * line: `src/san.ts` is correct on every row below, and `A6` pins that.
 *
 * NOTHING HERE TOUCHES `src/san.test.ts`. Its `POSITIONS` map is deliberately NOT widened — `ABC-013`
 * `A18`/`A19` quantify over *"the 18 named positions"* and iterate that map, so adding to it would
 * silently redefine two of `ABC-013`'s criteria and make `A5` below unfalsifiable (the two tickets'
 * criteria would be re-asserting each other). That is the ticket's `## Test notes` note 1, and it is
 * a criteria conflict rather than a preference. The six perft FENs and the one-ply corpus builder are
 * therefore RE-DERIVED here rather than imported: importing a `*.test.ts` file would execute its
 * `describe` blocks a second time, and lifting them into a shared module would put a non-test file
 * under `src/`, which `A6` forbids.
 *
 * THE FOUR CRITERIA IN THIS FILE, and what each one is FOR — the point is which wrong builds die, not
 * that a property exists:
 *
 *   `A1`  the minimality property, written as a LADDER SEARCH over `["", file, rank, square]`.
 *         Kills `Q33` `Q34` `Q35` `Q27` `Q38`. BLIND to `Q28'` by construction, which is why `A3`
 *         exists as a criterion in its own right rather than as decoration on this one.
 *   `A2`  the census — `A1` is not allowed to be vacuous. No mutation of `src/san.ts` can turn it
 *         red (it is computed from the legal move list, never from `toSan`); its witness is a
 *         NARROWED corpus, and both discriminating directions are asserted below.
 *   `A3`  63 hand-typed strings at the cells `A1` cannot see. Kills `Q28'`, and eight more.
 *   `A4`  injectivity, given an owner. It is the SOLE guard on `Q13` `Q14` `Q36` and no criterion of
 *         `ABC-013` requires it, so deleting `src/san.test.ts:347` today turns nothing red.
 *   `A5`  purity and the `legal` argument over BLACK-to-move positions — black castling, black en
 *         passant and black promotion make and unmake moves no `ABC-013` witness ever exercised.
 *         Corroboration, not a mutant-killer, and recorded as such.
 *
 * `A6` (no production change, additions only, gates green) is verified with `git diff -U0` and `md5`
 * at the gate, NOT in this suite, and that is deliberate: the ticket's own hash pin *"goes stale the
 * moment any ticket changes `src/san.ts`"*, and `EPIC-003` adds `parseSan` to that same file. An
 * in-suite md5 assertion would turn a sanctioned edit red and teach the next engineer to delete a
 * guard.
 *
 * TWO RULES THIS FILE OBEYS THAT ARE EASY TO BREAK. (1) `A1`'s expectation is a SEARCH over the
 * ladder — *"the shortest qualifier for which exactly one legal move of this piece byte reaches this
 * square"* — never a second copy of `src/san.ts`'s two accumulated flags, which would agree with the
 * code by construction and could not falsify it. (2) The qualifier is read back OUT of the emitted
 * string; nothing here asks the module for it, because `toSan` exports one function and `A20`
 * requires that it stay that way.
 */
import { describe, expect, it } from "vitest";
import { makeMove, unmakeMove } from "./apply.ts";
import { parseFen, toFen } from "./fen.ts";
import { legalMoves } from "./legal.ts";
import { FLAG_CASTLE, type Move } from "./moves.ts";
import {
  BISHOP,
  EMPTY,
  fileOf,
  isBlack,
  KNIGHT,
  PAWN,
  type Position,
  parseSquareName,
  pieceType,
  QUEEN,
  ROOK,
  rankOf,
  squareName,
} from "./position.ts";
import { toSan } from "./san.ts";

// ---------------------------------------------------------------------------
// The positions. Sixteen ladders and seven black-side corners — the ticket's
// table, transcribed, and every expected string re-derived by hand from its
// FEN's geometry before this file was run.
// ---------------------------------------------------------------------------

/**
 * One ladder per (piece type × colour), each carrying EVERY rung that piece can require in a single
 * FEN, each paired with an `-X` capture variant that is the same arrangement with an enemy piece on
 * the destination. That is how 44 grid cells cost 16 positions instead of 44.
 *
 * `L-Q-W` IS `ABC-013`'s `P-QUEENS`, reused rather than re-invented. The three-bishop and
 * three-queen arrangements are legal by promotion.
 */
const LADDER_POSITIONS = {
  "L-N-W": "4k3/8/8/1N3N2/8/1N6/8/4K3 w - - 0 1",
  "L-N-W-X": "4k3/8/8/1N3N2/3p4/1N6/8/4K3 w - - 0 1",
  "L-N-B": "4k3/8/1n6/8/1n3n2/8/8/4K3 b - - 0 1",
  "L-N-B-X": "4k3/8/1n6/3P4/1n3n2/8/8/4K3 b - - 0 1",
  "L-B-W": "4k3/8/8/4B3/8/2B1B3/8/4K3 w - - 0 1",
  "L-B-W-X": "4k3/8/8/4B3/3p4/2B1B3/8/4K3 w - - 0 1",
  "L-B-B": "4k3/8/2b1b3/8/4b3/8/8/4K3 b - - 0 1",
  "L-B-B-X": "4k3/8/2b1b3/3P4/4b3/8/8/4K3 b - - 0 1",
  "L-R-W": "4k3/3R4/8/8/R7/8/8/3RK3 w - - 0 1",
  "L-R-W-X": "4k3/3R4/8/8/R2p4/8/8/3RK3 w - - 0 1",
  "L-R-B": "3rk3/8/8/r7/8/8/3r4/4K3 b - - 0 1",
  "L-R-B-X": "3rk3/8/8/r2P4/8/8/3r4/4K3 b - - 0 1",
  "L-Q-W": "6k1/8/8/8/4Q2Q/8/8/K6Q w - - 0 1",
  "L-Q-W-X": "6k1/8/8/8/4Q2Q/8/8/K3n2Q w - - 0 1",
  "L-Q-B": "k6q/8/8/4q2q/8/8/8/6K1 b - - 0 1",
  "L-Q-B-X": "k3N2q/8/8/4q2q/8/8/8/6K1 b - - 0 1",
} as const;

/**
 * The black-side mirror of every colour-sensitive `ABC-013` criterion — castling (`A3`), pawn capture
 * and push (`A9`), en passant (`A10`), promotion (`A12`), check (`A13`), mate (`A14`) and stalemate
 * (`A17`). NONE of them has a black witness anywhere else in this repository.
 */
const BLACK_CORNER_POSITIONS = {
  "L-BK-CASTLE": "r3k2r/8/8/8/8/8/8/4K3 b kq - 0 1",
  "L-BK-PAWN": "4k3/8/8/8/8/4p3/3P4/6K1 b - - 0 1",
  "L-BK-EP": "4k3/8/8/8/3Pp3/8/8/4K3 b - d3 0 1",
  "L-BK-PROMO": "4k3/8/8/8/8/8/4p3/3R3K b - - 0 1",
  "L-BK-CHECK": "r3k3/8/8/8/8/8/8/4K3 b - - 0 1",
  "L-BK-MATE": "r5k1/8/8/8/8/8/5PPP/6K1 b - - 0 1",
  "L-BK-STALE": "k7/8/8/6q1/8/8/8/7K b - - 0 1",
} as const;

const ABC025_POSITIONS = { ...LADDER_POSITIONS, ...BLACK_CORNER_POSITIONS } as const;

type PositionId = keyof typeof ABC025_POSITIONS;

/** One row: a named position, the move by `from`-`to`(`-promotion`), and the exact string. */
type Row = readonly [
  id: PositionId,
  from: string,
  to: string,
  expected: string,
  promotion?: number,
];

// ---------------------------------------------------------------------------
// The corpus: `src/san.test.ts`'s six perft positions and their one-ply
// children, PLUS this ticket's 23. The first half alone fills 5 of the 44
// reachable cells, which is the whole reason the second half exists.
// ---------------------------------------------------------------------------

/** The six standard perft positions — re-derived here rather than imported (see the file header). */
const PERFT_FENS = [
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1",
  "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1",
  "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8",
  "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
] as const;

/** A corpus entry: the FEN it was built from, so a failure names a position rather than an index. */
interface Entry {
  readonly label: string;
  readonly fen: string;
}

/** The six perft positions and every position one legal move away from them — none of it SAN-picked. */
function derivedEntries(): Entry[] {
  const entries: Entry[] = [];

  for (const fen of PERFT_FENS) {
    const position = parseFen(fen);
    entries.push({ label: "derived", fen });

    for (const move of legalMoves(position)) {
      const undo = makeMove(position, move);
      entries.push({ label: "derived", fen: toFen(position) });
      unmakeMove(position, move, undo);
    }
  }

  return entries;
}

const TICKET_ENTRIES: readonly Entry[] = Object.entries(ABC025_POSITIONS).map(([label, fen]) => ({
  label,
  fen,
}));

/**
 * Built ONCE for the whole file rather than per `it`. `N5` bars the tests this ticket adds at 5% of
 * the default `npm test` wall clock, and rebuilding 184 positions six times is the easy way to spend
 * that budget on nothing.
 */
const DERIVED_ENTRIES: readonly Entry[] = derivedEntries();
const CORPUS: readonly Entry[] = [...DERIVED_ENTRIES, ...TICKET_ENTRIES];

// ---------------------------------------------------------------------------
// The instrument: a ladder SEARCH, and a reader that takes the qualifier back
// out of the emitted string. Neither is a copy of `src/san.ts`.
// ---------------------------------------------------------------------------

/** `["", file, rank, square]` by index, for the census's rung axis. */
const RUNG_NAMES = ["none", "file", "rank", "square"] as const;

/** What a ladder that never resolved reports. It cannot equal any real qualifier, which is the point. */
const UNRESOLVED = { rung: -1, text: "<the ladder never resolved>" } as const;

/**
 * The qualifier `ABC-025` demands, as the thing the qualifier is FOR: the FIRST entry of the ladder
 * `["", origin file, origin rank, origin square]` for which EXACTLY ONE legal move of the same piece
 * BYTE (type and colour) reaches this destination.
 *
 * This is a search, and that is not a stylistic choice — `src/san.ts` computes the same answer from
 * two accumulated flags (`sharesFile` / `sharesRank`), and a second copy of that procedure would
 * agree with the code by construction and could falsify nothing.
 */
function minimalQualifier(move: Move, legal: readonly Move[]): { rung: number; text: string } {
  const reaching = legal.filter((other) => other.piece === move.piece && other.to === move.to);
  const origin = squareName(move.from);
  const ladder = [
    { text: "", admits: () => true },
    { text: origin[0] as string, admits: (from: number) => fileOf(from) === fileOf(move.from) },
    { text: origin[1] as string, admits: (from: number) => rankOf(from) === rankOf(move.from) },
    { text: origin, admits: (from: number) => from === move.from },
  ];

  const rung = ladder.findIndex(
    (entry) => reaching.filter((other) => entry.admits(other.from)).length === 1,
  );

  return rung === -1 ? UNRESOLVED : { rung, text: ladder[rung]?.text as string };
}

/**
 * The qualifier read back OUT of the emitted string (`## Test notes` note 3): strip a trailing
 * `+`/`#`, drop the piece letter, drop the two-character destination and a preceding `x`. Only ever
 * called on a piece move, where that decomposition is total.
 */
function qualifierOf(san: string): string {
  const bare = san.replace(/[+#]$/, "");
  const head = bare.slice(1, -2);
  return head.endsWith("x") ? head.slice(0, -1) : head;
}

/** The moves `A1` quantifies over: every legal move that is neither a pawn move nor a castle. */
function qualifiableMoves(legal: readonly Move[]): Move[] {
  return legal.filter((move) => pieceType(move.piece) !== PAWN && (move.flags & FLAG_CASTLE) === 0);
}

/**
 * The move `from`-`to`(`-promotion`) TAKEN OUT OF `legalMoves(position)`, asserted to name EXACTLY
 * ONE legal move before anything reads a string off it. `ADR-0004` clause 2b forbids a hand-built
 * `Move` literal; `ABC-009`'s `expectImpostorSetup` lesson is why the count is asserted first.
 */
function moveFor(position: Position, from: string, to: string, promotion = EMPTY): Move {
  const fromSquare = parseSquareName(from);
  const toSquare = parseSquareName(to);
  const matches = legalMoves(position).filter(
    (move) => move.from === fromSquare && move.to === toSquare && move.promotion === promotion,
  );

  expect(matches, `${from}-${to} must name exactly one legal move`).toHaveLength(1);
  return matches[0] as Move;
}

/** Asserts every row of one criterion, labelled so a failure names the row rather than the criterion. */
function expectRows(rows: readonly Row[]): void {
  for (const [id, from, to, expected, promotion] of rows) {
    const position = parseFen(ABC025_POSITIONS[id]);
    const move = moveFor(position, from, to, promotion);
    expect(toSan(position, move), `${id} ${from}-${to}`).toBe(expected);
  }
}

/**
 * Reports a mismatch COUNT with the first few spelled out, rather than one `expect` per move. Over
 * 7,314 renders the per-move form is a measurable share of `N5`'s budget, and a count is what a
 * mutation run compares against anyway.
 */
function expectNoMismatches(mismatches: readonly string[], what: string): void {
  expect(mismatches.length, `${what}\n${mismatches.slice(0, 5).join("\n")}`).toBe(0);
}

// ---------------------------------------------------------------------------
// A1 — the minimality property, over the whole corpus, in both call forms.
// ---------------------------------------------------------------------------

describe("ABC-025 A1 — the qualifier is the shortest ladder entry that names exactly one move", () => {
  it("holds for every non-pawn, non-castle legal move of all 207 corpus positions, both call forms", () => {
    // The discriminating requirement, and it is the requirement rather than "the property exists":
    // Q33 (rooks), Q34 (bishops), Q35 (qualified captures), Q27 (black) and Q38 (black on the rank
    // rung) must each turn this red, and the four behaviour-equivalent controls Q22, Q24, Q29 and
    // Q40 must leave it green. A row that kills an equivalent mutant pins implementation shape
    // rather than behaviour.
    const mismatches: string[] = [];
    let checked = 0;

    for (const { fen } of CORPUS) {
      const position = parseFen(fen);
      const legal = legalMoves(position);

      for (const move of qualifiableMoves(legal)) {
        checked += 1;
        const expected = minimalQualifier(move, legal);
        const assisted = toSan(position, move, legal);
        const unassisted = toSan(position, move);

        // The decomposition `qualifierOf` performs is only meaningful if the last two characters
        // really are the destination `toSan` was asked for. Asserted here rather than assumed,
        // because a garbled read would otherwise make this criterion green by accident.
        const destination = squareName(move.to);
        if (!assisted.replace(/[+#]$/, "").endsWith(destination)) {
          mismatches.push(`${fen} "${assisted}" does not end in the destination ${destination}`);
          continue;
        }

        if (qualifierOf(assisted) !== expected.text || qualifierOf(unassisted) !== expected.text) {
          mismatches.push(
            `${fen} ${squareName(move.from)}-${destination}: ` +
              `"${assisted}" / "${unassisted}" carry ` +
              `"${qualifierOf(assisted)}" / "${qualifierOf(unassisted)}", ` +
              `the ${RUNG_NAMES[expected.rung] ?? "unresolved"} rung is "${expected.text}"`,
          );
        }
      }
    }

    expectNoMismatches(mismatches, "over-qualified or under-qualified renders");
    // Non-vacuity: a corpus that silently stopped producing moves would satisfy the loop above.
    expect(checked, "qualifiable moves examined").toBeGreaterThan(3000);
  });
});

// ---------------------------------------------------------------------------
// A2 — the census. A1 over a corpus with no qualified bishop is green on a
// build that mis-qualifies every bishop, and that is not a hypothetical: it is
// exactly what Q34 and Q38 do to the corpus `src/san.test.ts` has today.
// ---------------------------------------------------------------------------

const CELL_TYPES: ReadonlyArray<readonly [letter: string, type: number]> = [
  ["N", KNIGHT],
  ["B", BISHOP],
  ["R", ROOK],
  ["Q", QUEEN],
];

/** The 48 cells of `piece type × colour × capture-ness × rung`. The king is excluded by construction. */
function allCells(): string[] {
  const cells: string[] = [];
  for (const [letter] of CELL_TYPES) {
    for (const colour of ["white", "black"]) {
      for (const captureness of ["quiet", "capture"]) {
        for (const rung of ["file", "rank", "square"]) {
          cells.push(`${letter} ${colour} ${captureness} ${rung}`);
        }
      }
    }
  }
  return cells;
}

/**
 * A ROOK can never require the full-square rung, and it is a theorem rather than an observation: a
 * rook at `(f,r)` reaching `(F,R)` has `f == F` or `r == R`; if it stands on file `F`, every rival
 * that also reaches `(F,R)` either shares that file or lies on rank `R`, and a rival on rank `R`
 * shares neither the mover's file nor its rank. So `sharesFile` and `sharesRank` are never both true.
 */
const UNREACHABLE_CELLS = allCells().filter(
  (cell) => cell.startsWith("R ") && cell.endsWith(" square"),
);
const REACHABLE_CELLS = allCells().filter((cell) => !UNREACHABLE_CELLS.includes(cell));

/**
 * The cells one position's QUALIFIED moves occupy — computed from the legal move list and the ladder
 * search, NEVER from `toSan`. That is what makes `A2` un-witnessable by a wrong build, and it is
 * stated in the criterion rather than glossed: its witness is a narrowed corpus, below.
 */
function cellsOf(fen: string): Set<string> {
  const position = parseFen(fen);
  const legal = legalMoves(position);
  const cells = new Set<string>();

  for (const move of qualifiableMoves(legal)) {
    const { rung } = minimalQualifier(move, legal);
    if (rung < 1) continue;

    const letter = CELL_TYPES.find(([, type]) => type === pieceType(move.piece))?.[0];
    if (letter === undefined) continue; // a king, which never has a same-byte rival

    const colour = isBlack(move.piece) ? "black" : "white";
    const captureness = move.captured !== EMPTY ? "capture" : "quiet";
    cells.add(`${letter} ${colour} ${captureness} ${RUNG_NAMES[rung]}`);
  }

  return cells;
}

/** One pass over the corpus, reused by all four census assertions — see `N5`. */
const CORPUS_CELLS: ReadonlyArray<{ entry: Entry; cells: Set<string> }> = CORPUS.map((entry) => ({
  entry,
  cells: cellsOf(entry.fen),
}));

function filledBy(subset: ReadonlyArray<{ cells: Set<string> }>): Set<string> {
  const filled = new Set<string>();
  for (const { cells } of subset) {
    for (const cell of cells) filled.add(cell);
  }
  return filled;
}

describe("ABC-025 A2 — the corpus is rich enough for A1 to be discriminating, and says so", () => {
  it("fills every one of the 44 reachable cells of piece type × colour × capture-ness × rung", () => {
    const filled = filledBy(CORPUS_CELLS);
    const empty = REACHABLE_CELLS.filter((cell) => !filled.has(cell));

    expect(empty, `${REACHABLE_CELLS.length - empty.length} of 44 cells filled`).toEqual([]);
  });

  it("leaves the four ROOK × square cells EXACTLY empty, so it cannot pass by having nothing to say", () => {
    // The other direction of the same census. A rook that ever carried a two-character qualifier
    // would be a wrong build, and the assertion above could not tell.
    const filled = filledBy(CORPUS_CELLS);

    expect(UNREACHABLE_CELLS).toHaveLength(4);
    expect(UNREACHABLE_CELLS.filter((cell) => filled.has(cell))).toEqual([]);
  });

  it("is witnessed by a NARROWED corpus: without this ticket's positions, ≥ 35 of 44 cells are empty", () => {
    // A2's discriminating requirement. No mutation of `src/san.ts` can turn this criterion red — it
    // is computed from the legal move list, not from `toSan` — so its witness has to be the corpus
    // itself. Mechanical widening does not fix it: expanding the same six FENs two plies buys four
    // cells and nothing else, because derived play is overwhelmingly file-rung rooks and knights.
    const derived = CORPUS_CELLS.filter(({ entry }) => entry.label === "derived");
    const filled = filledBy(derived);
    const reachableFilled = REACHABLE_CELLS.filter((cell) => filled.has(cell));

    expect(derived.length, "the derived half of the corpus").toBe(184);
    expect(
      reachableFilled.length,
      `the derived corpus alone fills ${reachableFilled.length} of 44: ${reachableFilled.join(", ")}`,
    ).toBeLessThanOrEqual(9);
  });

  it("needs every one of the 16 ladder positions: deleting any single one empties a cell", () => {
    // The second half of A2's discriminating requirement. Without it the census could stay green
    // while a ladder position silently stopped contributing anything.
    const ladderIds = Object.keys(LADDER_POSITIONS);
    const survivors: string[] = [];

    for (const id of ladderIds) {
      const filled = filledBy(CORPUS_CELLS.filter(({ entry }) => entry.label !== id));
      if (REACHABLE_CELLS.every((cell) => filled.has(cell))) survivors.push(id);
    }

    expect(ladderIds).toHaveLength(16);
    expect(survivors, "ladder positions the census would not miss").toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// A3 — the 63 hand-typed strings. The instrument A1 cannot be: A1 computes its
// expectation from the same rival set the code uses, so a wrong build whose
// defect is not in the rival set is invisible to it. Q28' is that build — it
// passes the suite, injectivity AND A1, and dies only here.
// ---------------------------------------------------------------------------

describe("ABC-025 A3 — 63 hand-typed strings at the cells A1 cannot see", () => {
  it("KNIGHTS, white: the whole ladder in one position, quiet and capture", () => {
    expectRows([
      ["L-N-W", "b3", "d4", "N3d4"],
      ["L-N-W", "b5", "d4", "Nb5d4"],
      ["L-N-W", "f5", "d4", "Nfd4"],
      ["L-N-W-X", "b3", "d4", "N3xd4"],
      ["L-N-W-X", "b5", "d4", "Nb5xd4"],
      ["L-N-W-X", "f5", "d4", "Nfxd4"],
    ]);
  });

  it("KNIGHTS, black — the colour ABC-013 has no witness for", () => {
    expectRows([
      ["L-N-B", "b6", "d5", "N6d5"],
      ["L-N-B", "b4", "d5", "Nb4d5"],
      ["L-N-B", "f4", "d5", "Nfd5"],
      ["L-N-B-X", "b6", "d5", "N6xd5"],
      ["L-N-B-X", "b4", "d5", "Nb4xd5"],
      ["L-N-B-X", "f4", "d5", "Nfxd5"],
    ]);
  });

  it("BISHOPS, white — a piece type no ABC-013 criterion ever disambiguates", () => {
    expectRows([
      ["L-B-W", "c3", "d4", "Bcd4"],
      ["L-B-W", "e3", "d4", "Be3d4"],
      ["L-B-W", "e5", "d4", "B5d4"],
      ["L-B-W-X", "c3", "d4", "Bcxd4"],
      ["L-B-W-X", "e3", "d4", "Be3xd4"],
      ["L-B-W-X", "e5", "d4", "B5xd4"],
    ]);
  });

  it("BISHOPS, black", () => {
    expectRows([
      ["L-B-B", "c6", "d5", "Bcd5"],
      ["L-B-B", "e6", "d5", "Be6d5"],
      ["L-B-B", "e4", "d5", "B4d5"],
      ["L-B-B-X", "c6", "d5", "Bcxd5"],
      ["L-B-B-X", "e6", "d5", "Be6xd5"],
      ["L-B-B-X", "e4", "d5", "B4xd5"],
    ]);
  });

  it("ROOKS, white — two rungs only, and the third is a theorem rather than an omission", () => {
    expectRows([
      ["L-R-W", "d1", "d4", "R1d4"],
      ["L-R-W", "d7", "d4", "R7d4"],
      ["L-R-W", "a4", "d4", "Rad4"],
      ["L-R-W-X", "d1", "d4", "R1xd4"],
      ["L-R-W-X", "d7", "d4", "R7xd4"],
      ["L-R-W-X", "a4", "d4", "Raxd4"],
    ]);
  });

  it("ROOKS, black", () => {
    expectRows([
      ["L-R-B", "d8", "d5", "R8d5"],
      ["L-R-B", "d2", "d5", "R2d5"],
      ["L-R-B", "a5", "d5", "Rad5"],
      ["L-R-B-X", "d8", "d5", "R8xd5"],
      ["L-R-B-X", "d2", "d5", "R2xd5"],
      ["L-R-B-X", "a5", "d5", "Raxd5"],
    ]);
  });

  it("QUEENS, white — the quiet ladder is ABC-013's A6, and the capture ladder is not", () => {
    expectRows([
      ["L-Q-W", "e4", "e1", "Qee1"],
      ["L-Q-W", "h1", "e1", "Q1e1"],
      ["L-Q-W", "h4", "e1", "Qh4e1"],
      ["L-Q-W-X", "e4", "e1", "Qexe1"],
      ["L-Q-W-X", "h1", "e1", "Q1xe1"],
      ["L-Q-W-X", "h4", "e1", "Qh4xe1"],
    ]);
  });

  it("QUEENS, black", () => {
    expectRows([
      ["L-Q-B", "e5", "e8", "Qee8"],
      ["L-Q-B", "h8", "e8", "Q8e8"],
      ["L-Q-B", "h5", "e8", "Qh5e8"],
      ["L-Q-B-X", "e5", "e8", "Qexe8"],
      ["L-Q-B-X", "h8", "e8", "Q8xe8"],
      ["L-Q-B-X", "h5", "e8", "Qh5xe8"],
    ]);
  });

  it("BLACK castling, and the rook move its own king blocks the rival from", () => {
    // `Rf8` and `Rd8` carry NO qualifier, and that is the row that makes this position work: the a8
    // rook cannot reach f8 and the h8 rook cannot reach d8, because the black king stands on e8.
    expectRows([
      ["L-BK-CASTLE", "e8", "g8", "O-O"],
      ["L-BK-CASTLE", "e8", "c8", "O-O-O"],
      ["L-BK-CASTLE", "h8", "f8", "Rf8"],
      ["L-BK-CASTLE", "a8", "d8", "Rd8"],
    ]);
  });

  it("BLACK pawn capture and push, black en passant", () => {
    expectRows([
      ["L-BK-PAWN", "e3", "d2", "exd2"],
      ["L-BK-PAWN", "e3", "e2", "e2"],
      ["L-BK-EP", "e4", "d3", "exd3"],
      ["L-BK-EP", "e4", "e3", "e3"],
    ]);
  });

  it("BLACK promotion, including an under-promotion that does NOT give check", () => {
    expectRows([
      ["L-BK-PROMO", "e2", "d1", "exd1=Q+", QUEEN],
      ["L-BK-PROMO", "e2", "e1", "e1=Q+", QUEEN],
      ["L-BK-PROMO", "e2", "e1", "e1=N", KNIGHT],
    ]);
  });

  it("BLACK check, mate and stalemate — and stalemate has no suffix", () => {
    expectRows([
      ["L-BK-CHECK", "a8", "a1", "Ra1+"],
      ["L-BK-MATE", "a8", "a1", "Ra1#"],
      ["L-BK-STALE", "g5", "g3", "Qg3"],
      ["L-BK-STALE", "g5", "g2", "Qg2+"],
    ]);
  });
});

// ---------------------------------------------------------------------------
// A4 — injectivity, given an owner. `src/san.test.ts:347` is the SOLE guard on
// Q13, Q14 and Q36, and no criterion of ABC-013 requires it: A1-A22 never name
// it, so deleting it there turns nothing red. This assertion is this ticket's
// own, over this ticket's own corpus.
// ---------------------------------------------------------------------------

describe("ABC-025 A4 — every legal move of a position renders to a DISTINCT string", () => {
  it("holds over all 207 corpus positions, with one shared legal list", () => {
    // Q13 (castle side from the absolute destination), Q14 (qualifier skipped on a capture) and Q36
    // (rooks under-qualified) must each turn this red. Two legal moves that render alike are a move
    // a reader — and EPIC-003's parser — cannot name.
    const collisions: string[] = [];

    for (const { fen } of CORPUS) {
      const position = parseFen(fen);
      const legal = legalMoves(position);
      const rendered = legal.map((move) => toSan(position, move, legal));

      if (new Set(rendered).size !== legal.length) {
        const seen = new Set<string>();
        const repeated = rendered.filter((san) => !seen.add(san));
        collisions.push(`${fen} → ${[...new Set(repeated)].join(" ")}`);
      }
    }

    expectNoMismatches(collisions, "positions whose moves do not render distinctly");
  });
});

// ---------------------------------------------------------------------------
// A5 — purity and the `legal` argument, over the positions ABC-013 could not
// reach. Corroboration rather than a mutant-killer, and recorded as such: no
// mutant in the ticket's set turns it red.
// ---------------------------------------------------------------------------

describe("ABC-025 A5 — purity and the `legal` argument over BLACK-to-move positions", () => {
  it("leaves `toFen` byte-identical and both call forms equal, over every legal move of all 23", () => {
    // ABC-013's A18 and A19 over black castling, black en passant and black promotion — make/unmake
    // paths no ABC-013 witness ever exercised, because all 18 of its FENs are white to move. Its
    // `POSITIONS` map is NOT widened to get this; this loop is its own. Both clauses share one pass
    // because the unassisted render is the expensive half and paying for it twice buys nothing.
    const impure: string[] = [];
    const divergent: string[] = [];

    for (const [id, fen] of Object.entries(ABC025_POSITIONS)) {
      const position = parseFen(fen);
      const legal = legalMoves(position);

      for (const move of legal) {
        const supplied = toSan(position, move, legal);
        if (toFen(position) !== fen) impure.push(`${id} ${supplied} with the legal list`);

        const computed = toSan(position, move);
        if (toFen(position) !== fen) impure.push(`${id} ${computed} without the legal list`);
        if (supplied !== computed) divergent.push(`${id} "${supplied}" / "${computed}"`);
      }
    }

    expectNoMismatches(impure, "calls that left `toFen(position)` changed");
    expectNoMismatches(divergent, "moves the `legal` argument changed the string of");
  });

  it("offers 23 positions whose named moves are each exactly one legal move", () => {
    // The setup assertion behind the whole table: 23 FENs that round-trip byte-identically and
    // between them supply the 63 rows above.
    expect(Object.keys(ABC025_POSITIONS)).toHaveLength(23);

    for (const [id, fen] of Object.entries(ABC025_POSITIONS)) {
      expect(toFen(parseFen(fen)), `${id} round-trips through toFen`).toBe(fen);
    }
  });
});
