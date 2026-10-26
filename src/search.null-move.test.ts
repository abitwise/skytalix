/**
 * ABC-208 acceptance — null-move pruning (`ADR-0050`, PROPOSED): `A2`, `A3`, and the rows
 * `ADR-0050`'s Consequences owe the rule. `A1` compares two builds and runs out of tree (the page's
 * 2026-10-26 line); the export lists of `ABC-077` `A6` and `ABC-078` `A4` grow by the new names.
 *
 * THE BOUNDED ORACLE IS A REGRESSION NET, NOT A PROOF OF THE RULE (`ADR-0050` decision 8). On the
 * 190, R = 3, 4 and 5 score alike at depth 5; null move in check, a second null move in a row and a
 * missing halfmove reset pass it, and returning the null score passes everything but the source
 * row. So the rule is guarded row by row: the predicate's table reds a wrong R and every missing or
 * wrong-sized guard; the source row reds the null-everywhere and mate-score variants; the null-move
 * unit rows red a missing halfmove reset and a wrong key; `A2`'s rows red the guard; the instrument
 * reds a null move in check or below three pieces.
 *
 * LANES (`N8-LANE`): the default lane holds the unit rows, the predicate's table, the source row,
 * the doors, the instrument, and `A2`'s five cheap rows. `SEARCH_DEEP=1` adds `A2`'s depth-11 and
 * depth-12 rows and `A3`'s oracle (the depth-5 drift in both recursions on the 190, and the mate
 * floor on the 287). Every deep row is deterministic: a fixed depth, or `chooseMove` on a frozen
 * clock with `maxDepth`. Unset, the deep cases are NOT DEFINED rather than skipped.
 */

import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { makeMove, makeNullMove, unmakeMove, unmakeNullMove } from "./apply.ts";
import {
  chooseMove,
  chooseMoveWithoutNullMove,
  chooseMoveWithoutReductions,
  type EngineChoice,
} from "./engine.ts";
import { parseFen, toFen } from "./fen.ts";
import { gameStatus } from "./gameend.ts";
import { isInCheck, legalMoves } from "./legal.ts";
import {
  EMPTY,
  isBlack,
  isOnBoard,
  KING,
  NO_SQUARE,
  PAWN,
  type Position,
  pieceType,
  squareName,
} from "./position.ts";
import { MATE_CORPUS } from "./search.mate-corpus.ts";
import {
  MATE_SCORE,
  nullMoveReduction,
  search,
  searchWithoutNullMove,
  searchWithoutReductions,
} from "./search.ts";
import { zobristKey, zobristKeyAfterNullMove } from "./zobrist.ts";

const RUN_DEEP = process.env.SEARCH_DEEP === "1";

/**
 * THE INSTRUMENT (`ADR-0050` decision 9): a call-through module mock of `src/apply.ts`. With
 * `instrument.on`, every `makeNullMove` keeps a copy of the position it is handed, so a row can ask
 * whether that side was in check and how many non-pawn pieces it had. No production counter or hook
 * is added; both recursions import `makeNullMove` from `./apply.ts`, so both are observed.
 */
const instrument = vi.hoisted(() => ({ on: false, made: [] as Position[] }));
vi.mock("./apply.ts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./apply.ts")>();
  return {
    ...actual,
    makeNullMove: (position: Position) => {
      if (instrument.on) instrument.made.push(structuredClone(position));
      return actual.makeNullMove(position);
    },
  };
});

afterEach(() => {
  instrument.on = false;
  instrument.made = [];
});

/** The positions `run` made a null move in. */
function nullMovesDuring(run: () => unknown): Position[] {
  instrument.made = [];
  instrument.on = true;
  try {
    run();
  } finally {
    instrument.on = false;
  }
  return instrument.made;
}

/** Knights, bishops, rooks and queens of the side to move, counted here and not by the predicate. */
function nonPawnPieces(position: Position): number {
  let pieces = 0;
  for (let square = 0; square < 128; square++) {
    const piece = position.board[square] as number;
    if (!isOnBoard(square) || piece === EMPTY || isBlack(piece) !== position.blackToMove) continue;
    if (pieceType(piece) !== PAWN && pieceType(piece) !== KING) pieces++;
  }
  return pieces;
}

/** `chooseMove`-shaped `choose` on a frozen clock, deepened to `depth` exactly. */
const deepenTo = (choose: typeof chooseMove, fen: string, depth: number): EngineChoice =>
  choose(parseFen(fen), { budgetMs: 1_000, now: () => 0, maxDepth: depth }) as EngineChoice;

const isMate = (score: number): boolean => Math.abs(score) > MATE_SCORE - 1_000;

const ROOTS: ReadonlyArray<{ name: string; fen: string }> = [
  { name: "startpos", fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" },
  { name: "kiwipete", fen: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1" },
  { name: "position-3", fen: "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1" },
  { name: "position-4", fen: "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1" },
  { name: "position-5", fen: "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8" },
  {
    name: "position-6",
    fen: "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
  },
];

/** `src/engine.test.ts`'s mate- and stalemate-adjacent endgames, same FENs. */
const ENDGAMES: ReadonlyArray<{ name: string; fen: string }> = [
  { name: "kq-corner", fen: "k7/8/1K6/8/8/8/8/1Q6 w - - 0 1" },
  { name: "kr-corner", fen: "k7/8/1K6/8/8/8/8/1R6 w - - 0 1" },
  { name: "kqk-h8", fen: "7k/8/6K1/8/8/8/8/6Q1 w - - 0 1" },
  { name: "kp-vs-k", fen: "8/8/8/4k3/8/8/4P3/4K3 w - - 0 1" },
  { name: "krk-a-file", fen: "8/8/8/8/8/k7/8/KR6 w - - 0 1" },
  { name: "pawn-race", fen: "8/6p1/8/8/8/8/1P6/k1K5 w - - 0 1" },
];

/** `ABC-121`'s 190 (`src/search.pvs-lmr.test.ts`): each root, its in-progress children, the endgames. */
function corpus(): { name: string; fen: string }[] {
  const out: { name: string; fen: string }[] = [];
  for (const { name, fen } of ROOTS) {
    out.push({ name, fen });
    const position = parseFen(fen);
    for (const move of legalMoves(position)) {
      const undo = makeMove(position, move);
      if (gameStatus(position).result === "in-progress") {
        out.push({
          name: `${name}/${squareName(move.from)}${squareName(move.to)}`,
          fen: toFen(position),
        });
      }
      unmakeMove(position, move, undo);
    }
  }
  return [...out, ...ENDGAMES];
}

const fenOf = (name: string): string =>
  (ROOTS.find((root) => root.name === name) as { fen: string }).fen;

// ---------------------------------------------------------------------------
// The null move itself (`ADR-0050` decision 7): make and unmake, the halfmove reset, the key delta.
// ---------------------------------------------------------------------------

describe("the null move — makeNullMove / unmakeNullMove and zobristKeyAfterNullMove", () => {
  /** The six roots and every position one legal move from them: 190 less the endgames. */
  const positions = corpus().slice(0, -ENDGAMES.length);

  it("passes: the side flips, the ep square clears, the halfmove clock is 0, fullmove moves as makeMove's", () => {
    let withEp = 0;
    let withClock = 0;
    for (const { name, fen } of positions) {
      const position = parseFen(fen);
      const before = structuredClone(position);
      if (before.epSquare !== NO_SQUARE) withEp++;
      if (before.halfmoveClock > 0) withClock++;
      makeNullMove(position);
      expect(position.blackToMove, name).toBe(!before.blackToMove);
      expect(position.epSquare, name).toBe(NO_SQUARE);
      expect(position.halfmoveClock, name).toBe(0);
      expect(position.fullmoveNumber, name).toBe(
        before.fullmoveNumber + (before.blackToMove ? 1 : 0),
      );
      expect(position.board, name).toEqual(before.board);
      expect(position.castling, name).toBe(before.castling);
    }
    // Not vacuous: the corpus carries both fields the null move overwrites.
    expect(withEp).toBeGreaterThan(0);
    expect(withClock).toBeGreaterThan(0);
  });

  it("unmakeNullMove leaves every position byte-identical", () => {
    for (const { name, fen } of positions) {
      const position = parseFen(fen);
      const before = structuredClone(position);
      unmakeNullMove(position, makeNullMove(position));
      expect(position, name).toEqual(before);
    }
  });

  it("zobristKeyAfterNullMove(zobristKey(before), undo) === zobristKey(after), ep square or not", () => {
    for (const { name, fen } of positions) {
      const position = parseFen(fen);
      const keyBefore = zobristKey(position);
      const undo = makeNullMove(position);
      expect(zobristKeyAfterNullMove(keyBefore, undo), name).toBe(zobristKey(position));
    }
  });
});

// ---------------------------------------------------------------------------
// The rule (`ADR-0050` decision 6): ONE pure predicate, R exactly 3, and five cases of 0.
// ---------------------------------------------------------------------------

describe("nullMoveReduction — R is 3, and 0 at the root, after a null, below depth 2, in check, below three non-pawn pieces", () => {
  /** White to move with exactly three non-pawn pieces (N, B, R), not in check; Black has none. */
  const THREE = "4k3/pppppppp/8/8/8/8/PPPPPPPP/1NB1KR2 w - - 0 1";
  /** The same board, Black to move: the side to move has none, White still has three. */
  const THREE_OTHER_SIDE = "4k3/pppppppp/8/8/8/8/PPPPPPPP/1NB1KR2 b - - 0 1";
  /** White to move with two (N, R) and eight pawns; Black has four. */
  const TWO = "rnbqk3/pppppppp/8/8/8/8/PPPPPPPP/1N2KR2 w - - 0 1";
  /** Black to move with three (N, B, R); White has none. */
  const BLACK_THREE = "1nb1kr2/pppppppp/8/8/8/8/PPPPPPPP/4K3 b - - 0 1";
  /** White to move IN CHECK from the rook on e2, with three non-pawn pieces (R, N, B). */
  const IN_CHECK = "4k3/8/8/8/8/8/4r3/RNB1K3 w - - 0 1";
  const PAWNS_ONLY = "8/8/8/4k3/8/8/4P3/4K3 w - - 0 1";

  const TABLE: ReadonlyArray<{
    why: string;
    fen: string;
    depth: number;
    ply: number;
    afterNull: boolean;
    plies: number;
  }> = [
    {
      why: "the allowed case, at the thresholds",
      fen: THREE,
      depth: 2,
      ply: 1,
      afterNull: false,
      plies: 3,
    },
    {
      why: "far above them — still exactly 3",
      fen: THREE,
      depth: 20,
      ply: 30,
      afterNull: false,
      plies: 3,
    },
    {
      why: "Black to move with three",
      fen: BLACK_THREE,
      depth: 6,
      ply: 3,
      afterNull: false,
      plies: 3,
    },
    { why: "a middlegame", fen: fenOf("kiwipete"), depth: 5, ply: 2, afterNull: false, plies: 3 },
    { why: "the root", fen: THREE, depth: 6, ply: 0, afterNull: false, plies: 0 },
    { why: "directly after a null move", fen: THREE, depth: 6, ply: 3, afterNull: true, plies: 0 },
    { why: "remaining depth 1, below 2", fen: THREE, depth: 1, ply: 3, afterNull: false, plies: 0 },
    { why: "in check", fen: IN_CHECK, depth: 6, ply: 3, afterNull: false, plies: 0 },
    { why: "two non-pawn pieces", fen: TWO, depth: 6, ply: 3, afterNull: false, plies: 0 },
    {
      why: "the OTHER side has the three",
      fen: THREE_OTHER_SIDE,
      depth: 6,
      ply: 3,
      afterNull: false,
      plies: 0,
    },
    { why: "pawns only", fen: PAWNS_ONLY, depth: 6, ply: 3, afterNull: false, plies: 0 },
  ];

  for (const { why, fen, depth, ply, afterNull, plies } of TABLE) {
    it(`${why}: depth ${depth}, ply ${ply}${afterNull ? ", after a null" : ""} -> ${plies}`, () => {
      const position = parseFen(fen);
      const before = toFen(position);
      expect(nullMoveReduction(position, depth, ply, afterNull)).toBe(plies);
      expect(toFen(position)).toBe(before); // pure: the board it was handed is unchanged
    });
  }

  it("the fixtures bite: each board really is what its row says", () => {
    const facts = (fen: string) => {
      const position = parseFen(fen);
      return [isInCheck(position), nonPawnPieces(position)];
    };
    expect(facts(THREE)).toEqual([false, 3]);
    expect(facts(THREE_OTHER_SIDE)).toEqual([false, 0]);
    expect(facts(TWO)).toEqual([false, 2]);
    expect(facts(BLACK_THREE)).toEqual([false, 3]);
    expect(facts(IN_CHECK)).toEqual([true, 3]);
    expect(facts(PAWNS_ONLY)).toEqual([false, 0]);
    expect(nullMoveReduction.length).toBe(4);
  });
});

describe("both recursions try the null move through the predicate, at null-window nodes, and return beta", () => {
  const MODULES = [
    { path: "./search.ts", depth: "depth", on: "switches.nullMove" },
    { path: "./engine.ts", depth: "remaining", on: "budget.nullMove" },
  ];

  for (const { path, depth, on } of MODULES) {
    it(`${path}: calls nullMoveReduction once, gates on alpha + 1 === beta, subtracts its value and returns beta`, () => {
      const source = readFileSync(new URL(path, import.meta.url), "utf8");
      expect(source.length, path).toBeGreaterThan(1000); // the module, not nothing
      const flat = source.replace(/\s+/g, " ");
      // The gate: the switch, and a null window, and nothing else.
      expect(flat, path).toContain(`if (${on} && alpha + 1 === beta) {`);
      // The rule: the predicate, called once, with the node's own depth, ply and parent flag.
      const calls = flat.match(/nullMoveReduction\(/g) ?? [];
      expect(calls.length, path).toBe(path === "./search.ts" ? 2 : 1); // search.ts declares it too
      expect(flat, path).toContain(
        `const nullReduction = nullMoveReduction(position, ${depth}, ply, afterNull);`,
      );
      // The child: negated, R plies shallower than a normal child, the window (-beta, -beta + 1),
      // and flagged as a null move's.
      const nullChild = new RegExp(
        `nullScore = 0 - negamax\\( ?position, ${depth} - 1 - nullReduction, 0 - beta, 0 - beta \\+ 1, ply \\+ 1, [^)]*\\btrue,? ?\\)`,
      );
      expect(flat, path).toMatch(nullChild);
      // Every other child is a real move's: the flag is false on each of them. (Calls only — the
      // declaration, `function negamax(`, is not one.)
      const flags = [...flat.matchAll(/(?<!function) negamax\(([^)]*)\)/g)].map(
        (match) => (match[1] as string).replace(/,\s*$/, "").split(",").at(-1)?.trim() ?? "",
      );
      expect(flags.length, path).toBeGreaterThanOrEqual(5);
      expect(
        flags.filter((flag) => flag === "true"),
        path,
      ).toHaveLength(1);
      expect(flags.filter((flag) => flag === "false").length, path).toBe(flags.length - 1);
      // The cut: beta, never the null score, and no table store between the gate and the moves.
      expect(flat, path).toContain("if (nullScore >= beta) return beta;");
      const block = flat.slice(flat.indexOf(`if (${on} &&`), flat.indexOf("legalMoves(position);"));
      expect(block, path).not.toContain("storeEntry(");
      expect(block, path).not.toMatch(/return nullScore/);
    });
  }
});

// ---------------------------------------------------------------------------
// The doors (`ADR-0050` decisions 2 and 3): the new pair is null move off, and every older door
// turns it off too.
// ---------------------------------------------------------------------------

describe("the doors — searchWithoutNullMove and chooseMoveWithoutNullMove turn null move off, as every older door does", () => {
  it("the doors take what search() and chooseMove take, and no depth on the engine side", () => {
    expect(searchWithoutNullMove.length).toBe(2);
    expect(chooseMoveWithoutNullMove.length).toBe(2);
  });

  it("search() makes null moves on position-6 at depth 4, and changes the work", () => {
    const fen = fenOf("position-6");
    let shipped = 0;
    expect(
      nullMovesDuring(() => (shipped = search(parseFen(fen), 4).nodes)).length,
    ).toBeGreaterThan(0);
    expect(shipped).not.toBe(searchWithoutNullMove(parseFen(fen), 4).nodes);
  });

  it("chooseMove makes null moves on position-6 deepened to 4, and changes the work", () => {
    const fen = fenOf("position-6");
    let shipped = 0;
    expect(
      nullMovesDuring(() => (shipped = deepenTo(chooseMove, fen, 4).nodes)).length,
    ).toBeGreaterThan(0);
    expect(shipped).not.toBe(deepenTo(chooseMoveWithoutNullMove, fen, 4).nodes);
  });

  /**
   * Only the doors with `pvs` on are listed. Every door older than `ABC-121` has `pvs` off: the
   * root's beta is infinite, and without the null window every child inherits an infinite bound,
   * so none of their nodes is a null-window node and the switch cannot show. Their `nullMove` is
   * off all the same (`ADR-0050` decision 3), and `A1`'s cross-build run holds them node-equal.
   */
  const SEARCH_DOORS = { searchWithoutNullMove, searchWithoutReductions };
  for (const [name, door] of Object.entries(SEARCH_DOORS)) {
    it(`${name} makes no null move on position-6 at depth 4`, () => {
      expect(nullMovesDuring(() => door(parseFen(fenOf("position-6")), 4))).toHaveLength(0);
    });
  }

  const ENGINE_DOORS = { chooseMoveWithoutNullMove, chooseMoveWithoutReductions };
  for (const [name, door] of Object.entries(ENGINE_DOORS)) {
    it(`${name} makes no null move on position-6 deepened to 4`, () => {
      expect(nullMovesDuring(() => deepenTo(door, fenOf("position-6"), 4))).toHaveLength(0);
    });
  }
});

// ---------------------------------------------------------------------------
// A2 — the zugzwang guard holds: the seven sourced rows, each at its own fixed depth, and the
// instrumented search makes no null move in check or below three non-pawn pieces.
// ---------------------------------------------------------------------------

/**
 * `ADR-0050` decision 9's seven rows. Each depth is the one base solves the row at (8–12). The CPW
 * rows keep non-pawn material and test the guard's size; the four K+P v K rows are opposition wins
 * where any pass misleads, and test that a side with no non-pawn piece never passes.
 */
const A2_ROWS: ReadonlyArray<{
  name: string;
  fen: string;
  move: string;
  depth: number;
  source: string;
  deep: boolean;
}> = [
  {
    name: "zugzwang.001",
    fen: "8/8/p1p5/1p5p/1P5p/8/PPP2K1p/4R1rk w - - 0 1",
    move: "e1f1",
    depth: 9,
    source: 'CPW "Null Move Test-Positions"',
    deep: false,
  },
  {
    name: "zugzwang.004",
    fen: "8/6B1/p5p1/Pp4kp/1P5r/5P1Q/4q1PK/8 w - - 0 32",
    move: "h3h4",
    depth: 11,
    source: 'CPW "Null Move Test-Positions"',
    deep: true,
  },
  {
    name: "zugzwang.005",
    fen: "8/8/1p1r1k2/p1pPN1p1/P3KnP1/1P6/8/3R4 b - - 0 1",
    move: "f4d5",
    depth: 12,
    source: 'CPW "Null Move Test-Positions" (the suite\'s best move)',
    deep: true,
  },
  {
    name: "kpk-b6c6",
    fen: "2k5/8/1K6/2P5/8/8/8/8 w - - 0 1",
    move: "b6c6",
    depth: 8,
    source: "Lichess Syzygy tablebase: the only winning move",
    deep: false,
  },
  {
    name: "kpk-c6d6",
    fen: "3k4/8/2K5/3P4/8/8/8/8 w - - 0 1",
    move: "c6d6",
    depth: 8,
    source: "Lichess Syzygy tablebase: the only winning move",
    deep: false,
  },
  {
    name: "kpk-d6e6",
    fen: "4k3/8/3K4/4P3/8/8/8/8 w - - 0 1",
    move: "d6e6",
    depth: 8,
    source: "Lichess Syzygy tablebase: the only winning move",
    deep: false,
  },
  {
    name: "kpk-e6f6",
    fen: "5k2/8/4K3/5P2/8/8/8/8 w - - 0 1",
    move: "e6f6",
    depth: 8,
    source: "Lichess Syzygy tablebase: the only winning move",
    deep: false,
  },
];

describe("A2 — the shipped engine plays the recorded move in every zugzwang row, at the row's depth", () => {
  it("seven rows, each with its source, at depths 8 to 12", () => {
    expect(A2_ROWS).toHaveLength(7);
    for (const row of A2_ROWS) {
      expect(row.source.length, row.name).toBeGreaterThan(0);
      expect(row.depth, row.name).toBeGreaterThanOrEqual(8);
      expect(row.depth, row.name).toBeLessThanOrEqual(12);
    }
  });

  for (const { name, fen, move, depth, deep } of A2_ROWS) {
    if (deep && !RUN_DEEP) continue;
    it(`${name}: chooseMove on a frozen clock to depth ${depth} plays ${move}${deep ? " [deep, SEARCH_DEEP=1]" : ""}`, () => {
      let choice: EngineChoice | undefined;
      const nulls = nullMovesDuring(() => (choice = deepenTo(chooseMove, fen, depth)));
      expect(choice?.depth).toBe(depth);
      const played = choice as EngineChoice;
      expect(`${squareName(played.move.from)}${squareName(played.move.to)}`).toBe(move);
      // A side with no non-pawn piece never passes: the K+P rows make no null move at all.
      if (name.startsWith("kpk-")) expect(nulls).toHaveLength(0);
    }, 120_000);
  }
});

describe("A2 — the instrumented search makes 0 null moves in check, and 0 below three non-pawn pieces", () => {
  /**
   * Every null move the shipped search makes, in both recursions, on the six roots, an in-check
   * root, and the pawn-only endgames, is checked where it is made. Not vacuous: the middlegame
   * roots make hundreds, and their trees hold checks and thin material below the root.
   */
  const IN_CHECK_ROOT = "r3k2r/p1pp1pb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBqPPP/R3K2R w KQkq - 0 2";

  it("search() to depth 4 and chooseMove deepened to 4: every null move is made out of check, with three or more pieces", () => {
    const made: Position[] = [];
    for (const fen of [...ROOTS.map((root) => root.fen), IN_CHECK_ROOT]) {
      made.push(...nullMovesDuring(() => search(parseFen(fen), 4)));
      made.push(...nullMovesDuring(() => deepenTo(chooseMove, fen, 4)));
    }
    expect(made.length).toBeGreaterThan(100);
    expect(made.filter((position) => isInCheck(position)).map((p) => toFen(p))).toEqual([]);
    expect(made.filter((position) => nonPawnPieces(position) < 3).map((p) => toFen(p))).toEqual([]);
  });

  it("the in-check root really is in check, and its search still finds null-window nodes to pass at", () => {
    expect(isInCheck(parseFen(IN_CHECK_ROOT))).toBe(true);
    expect(nullMovesDuring(() => search(parseFen(IN_CHECK_ROOT), 4)).length).toBeGreaterThan(0);
  });

  it("the pawn-only endgames: no null move at all, in either recursion, to depth 6", () => {
    for (const fen of [ENDGAMES[3]?.fen, ENDGAMES[5]?.fen] as string[]) {
      expect(nonPawnPieces(parseFen(fen))).toBe(0);
      expect(nullMovesDuring(() => search(parseFen(fen), 6))).toHaveLength(0);
      expect(nullMovesDuring(() => deepenTo(chooseMove, fen, 6))).toHaveLength(0);
    }
  });
});

// ---------------------------------------------------------------------------
// A3 — bounded drift (`ADR-0050` decision 8): depth 5 on the 190 in both recursions, >= 95 %
// within 25 cp and none beyond 37 cp; a same-depth mate floor on the 287. A regression net.
// ---------------------------------------------------------------------------

if (RUN_DEEP) {
  interface Drift {
    readonly compared: number;
    readonly within25: number;
    readonly max: number;
    /** Mate <-> no mate, or sign, on the 190 — a REPORT, never a bar (`ADR-0050` decision 8). */
    readonly mateFlips: number;
    readonly worst: string;
  }

  const drift = (on: (fen: string) => number, reference: (fen: string) => number): Drift => {
    const deltas: Array<[number, string]> = [];
    let mateFlips = 0;
    for (const { name, fen } of corpus()) {
      const ref = reference(fen);
      const got = on(fen);
      if (isMate(ref) || isMate(got)) {
        if (isMate(ref) !== isMate(got) || Math.sign(ref) !== Math.sign(got)) mateFlips++;
        continue;
      }
      deltas.push([Math.abs(got - ref), `${name}: ${ref} -> ${got}`]);
    }
    deltas.sort((a, b) => b[0] - a[0]);
    return {
      compared: deltas.length,
      within25: deltas.filter(([delta]) => delta <= 25).length / deltas.length,
      max: deltas[0]?.[0] ?? 0,
      mateFlips,
      worst: deltas[0]?.[1] ?? "",
    };
  };

  const reportAndBar = (what: string, result: Drift): void => {
    console.log(
      `ABC-208 A3 ${what}: ${(100 * result.within25).toFixed(2)}% within 25 cp of ` +
        `${result.compared}, max ${result.max} cp (${result.worst}); mate-status flips on the 190: ` +
        `${result.mateFlips} (a report, not a bar)`,
    );
    expect(result.compared).toBeGreaterThanOrEqual(100);
    expect(result.within25).toBeGreaterThanOrEqual(0.95);
    expect(result.max).toBeLessThanOrEqual(37);
  };

  describe("A3 — bounded drift against the null-move-off doors, depth 5, the 190 [deep, SEARCH_DEEP=1]", () => {
    it("the corpus is the 190", () => {
      expect(corpus()).toHaveLength(190);
    });

    it("search() against searchWithoutNullMove at fixed depth 5: >= 95% within 25 cp, none beyond 37 cp [deep, SEARCH_DEEP=1]", () => {
      reportAndBar(
        "search() d5",
        drift(
          (fen) => search(parseFen(fen), 5).score,
          (fen) => searchWithoutNullMove(parseFen(fen), 5).score,
        ),
      );
    }, 600_000);

    it("chooseMove against chooseMoveWithoutNullMove deepened to 5: >= 95% within 25 cp, none beyond 37 cp [deep, SEARCH_DEEP=1]", () => {
      reportAndBar(
        "chooseMove to d5",
        drift(
          (fen) => deepenTo(chooseMove, fen, 5).score,
          (fen) => deepenTo(chooseMoveWithoutNullMove, fen, 5).score,
        ),
      );
    }, 600_000);
  });

  describe("A3 — the same-depth mate floor on the 287 [deep, SEARCH_DEEP=1]", () => {
    it("every mate searchWithoutNullMove scores at depth 5, search() scores at depth 5: same sign, no longer [deep, SEARCH_DEEP=1]", () => {
      let mates = 0;
      const violations: string[] = [];
      for (const fen of MATE_CORPUS) {
        const ref = searchWithoutNullMove(parseFen(fen), 5).score;
        if (!isMate(ref)) continue;
        mates++;
        const got = search(parseFen(fen), 5).score;
        // A mate n plies away reads MATE_SCORE - n, so "no longer" is |got| >= |ref|.
        if (!isMate(got) || Math.sign(got) !== Math.sign(ref) || Math.abs(got) < Math.abs(ref)) {
          violations.push(`${fen}: ${ref} without null move, ${got} with it, depth 5`);
        }
      }
      console.log(`ABC-208 A3 mate floor d5 -> d5: ${violations.length} of ${mates} violated`);
      expect(mates).toBeGreaterThanOrEqual(100);
      expect(violations).toEqual([]);
    }, 300_000);
  });
}
