/**
 * ABC-264 acceptance — reverse futility (`ADR-0059`, PROPOSED): `A2`, `A3`, `A4`, and the rows
 * `ADR-0059` decision 7 owes the rule. `A1` compares two builds and runs out of tree (`ABC-208`
 * `A1`'s form); the export lists of `ABC-077` `A6` and `ABC-078` `A4` grow by the three new names.
 *
 * THE BOUNDED ORACLE IS A REGRESSION NET, NOT A PROOF OF THE RULE (`ADR-0059` decision 8). A
 * missing mate-band guard passes every oracle row (the Architect planted it); the "PV nodes too"
 * and "after the null move" variants pass every value row. So the rule is guarded row by row: the
 * predicate's table reds a wrong margin, a wrong depth range and every missing guard, the
 * mate-band guard on both sides included (through a call-through stub of `evaluate`, since a real
 * static score never reaches the band); the source row reds the PV-node and after-the-null-move
 * variants and a fail-soft return; `A4`'s node bar reds the null move tried first.
 *
 * LANES (`N8-LANE`): the default lane holds the predicate's table, the source row, the doors, the
 * divergence rows ("0 child moves searched; the door searches them") and the zugzwang-guard
 * node-equality rows. `SEARCH_DEEP=1` adds `A3`'s oracle (the depth-5 drift in both recursions on
 * the 190 with `ADR-0059`'s 160 cp cap, and the mate floor on the 287) and `A4` (depth 8 on
 * kiwipete and position-6 in both recursions, nodes at most 0.75x the door's). Every row is
 * deterministic: a fixed depth, or `chooseMove` on a frozen clock with `maxDepth`. Unset, the deep
 * cases are NOT DEFINED rather than skipped. `A3`'s zugzwang rows are `ADR-0050` decision 9's
 * seven, which `src/search.null-move.test.ts` already runs on the shipped `chooseMove` at their
 * recorded depths (8 to 12; the three deepest behind `SEARCH_DEEP=1`).
 */

import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { makeMove, unmakeMove } from "./apply.ts";
import { chooseMove, chooseMoveWithoutReverseFutility, type EngineChoice } from "./engine.ts";
import { evaluate } from "./evaluate.ts";
import { parseFen, toFen } from "./fen.ts";
import { gameStatus } from "./gameend.ts";
import { isInCheck, legalMoves } from "./legal.ts";
import {
  EMPTY,
  isBlack,
  isOnBoard,
  KING,
  PAWN,
  type Position,
  pieceType,
  squareName,
} from "./position.ts";
import { MATE_CORPUS } from "./search.mate-corpus.ts";
import { MATE_SCORE, reverseFutilityCut, search, searchWithoutReverseFutility } from "./search.ts";
import { MATE_FLOOR } from "./transposition.ts";

const RUN_DEEP = process.env.SEARCH_DEEP === "1";

/**
 * THE EVALUATION STUB: a call-through module mock of `src/evaluate.ts`. `calls` counts every
 * evaluation; with `value` set, `evaluate` answers it instead, so the predicate's table can hand
 * it a static score inside the mate band — the one input that makes the `beta >= MATE_FLOOR`
 * clause observable. No production hook is added.
 */
const evalStub = vi.hoisted(() => ({ value: null as number | null, calls: 0 }));
vi.mock("./evaluate.ts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./evaluate.ts")>();
  return {
    ...actual,
    evaluate: (position: Position) => {
      evalStub.calls++;
      return evalStub.value ?? actual.evaluate(position);
    },
  };
});

/**
 * THE EVENT LOG (`ADR-0059` decision 7): call-through module mocks of `src/legal.ts`
 * (`legalMoves`) and `src/apply.ts` (`makeMove`, `unmakeMove`). With `log.on`, each call appends
 * one event, so two runs can be compared event for event. Both recursions import these from the
 * same modules, so both are observed. No production counter or hook is added.
 */
const log = vi.hoisted(() => ({ on: false, events: [] as string[] }));
vi.mock("./legal.ts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./legal.ts")>();
  return {
    ...actual,
    legalMoves: (position: Position) => {
      if (log.on) log.events.push(`gen ${toFen(position)}`);
      return actual.legalMoves(position);
    },
  };
});
vi.mock("./apply.ts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./apply.ts")>();
  return {
    ...actual,
    makeMove: (...args: Parameters<typeof actual.makeMove>) => {
      if (log.on) log.events.push("make");
      return actual.makeMove(...args);
    },
    unmakeMove: (...args: Parameters<typeof actual.unmakeMove>) => {
      if (log.on) log.events.push("unmake");
      actual.unmakeMove(...args);
    },
  };
});

afterEach(() => {
  evalStub.value = null;
  evalStub.calls = 0;
  log.on = false;
  log.events = [];
});

/** The events `run` logged. */
function eventsDuring(run: () => unknown): string[] {
  log.events = [];
  log.on = true;
  try {
    run();
  } finally {
    log.on = false;
  }
  return log.events;
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
// The rule (`ADR-0059` decision 2): ONE pure predicate, 120 cp a ply at depth 1 to 3, and five
// guards, each on a board where every other clause would cut.
// ---------------------------------------------------------------------------

describe("reverseFutilityCut — eval - 120 x depth >= beta at depth 1-3; false at the root, above depth 3, in the mate band, in check, below three non-pawn pieces", () => {
  /** White to move, a full army against a bare king and pawns: not in check, seven non-pawn pieces. */
  const WIN = "4k3/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQ - 0 1";
  /** The same, colours reversed, Black to move. */
  const WIN_BLACK = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/4K3 b kq - 0 1";
  /** `WIN` with a black rook on e2: White to move IN CHECK, still the full army. */
  const IN_CHECK = "4k3/pppppppp/8/8/8/8/PPPPrPPP/RNBQKBNR w KQ - 0 1";
  /** White to move with two non-pawn pieces (N, R) against a bare king and pawns. */
  const TWO = "4k3/pppppppp/8/8/8/8/PPPPPPPP/1N2KR2 w - - 0 1";
  /** `WIN`, Black to move: the side to move has none, the other side has seven. */
  const OTHER_SIDE = "4k3/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQ - 0 1";

  /** The real static score of `fen`, read with the stub off. */
  const staticScore = (fen: string): number => evaluate(parseFen(fen));

  it("the fixtures bite: each board really is what its row says, and the margin would cut on each", () => {
    const facts = (fen: string) => {
      const position = parseFen(fen);
      return [isInCheck(position), nonPawnPieces(position)];
    };
    expect(facts(WIN)).toEqual([false, 7]);
    expect(facts(WIN_BLACK)).toEqual([false, 7]);
    expect(facts(IN_CHECK)).toEqual([true, 7]);
    expect(facts(TWO)).toEqual([false, 2]);
    expect(facts(OTHER_SIDE)).toEqual([false, 0]);
    // Every guard row below sits where the margin alone would cut, even at depth 4 (480 cp).
    expect(staticScore(WIN) - 480).toBeGreaterThanOrEqual(0);
    expect(staticScore(WIN_BLACK) - 360).toBeGreaterThanOrEqual(0);
    expect(staticScore(IN_CHECK) - 120).toBeGreaterThanOrEqual(0);
    expect(staticScore(TWO) - 360).toBeGreaterThanOrEqual(0);
    expect(staticScore(OTHER_SIDE) - 120).toBeGreaterThanOrEqual(0 - 5_000);
    // A real static score is never in the mate band (`ADR-0059` decision 2): the stub is needed.
    expect(Math.abs(staticScore(WIN))).toBeLessThan(MATE_FLOOR);
    expect(reverseFutilityCut.length).toBe(4);
  });

  const CUTS: ReadonlyArray<{ why: string; fen: string; depth: number; ply: number }> = [
    { why: "depth 1", fen: WIN, depth: 1, ply: 1 },
    { why: "depth 2", fen: WIN, depth: 2, ply: 1 },
    { why: "depth 3, the deepest", fen: WIN, depth: 3, ply: 1 },
    { why: "far from the root", fen: WIN, depth: 2, ply: 40 },
    { why: "Black to move", fen: WIN_BLACK, depth: 3, ply: 3 },
  ];

  for (const { why, fen, depth, ply } of CUTS) {
    it(`cuts — ${why}: true at beta = eval - ${120 * depth}, false one centipawn above`, () => {
      const position = parseFen(fen);
      const before = toFen(position);
      const margin = staticScore(fen) - 120 * depth;
      expect(reverseFutilityCut(position, depth, ply, 0)).toBe(true);
      expect(reverseFutilityCut(position, depth, ply, margin)).toBe(true);
      expect(reverseFutilityCut(position, depth, ply, margin + 1)).toBe(false);
      expect(toFen(position)).toBe(before); // pure: the board it was handed is unchanged
    });
  }

  /** Each guard, on a board and at a beta where every other clause would cut. */
  const GUARDS: ReadonlyArray<{
    why: string;
    fen: string;
    depth: number;
    ply: number;
    beta: number;
    stub?: number;
  }> = [
    { why: "the root (ply 0)", fen: WIN, depth: 1, ply: 0, beta: 0 },
    { why: "remaining depth 4, above the range", fen: WIN, depth: 4, ply: 1, beta: 0 },
    { why: "remaining depth 20", fen: WIN, depth: 20, ply: 1, beta: 0 - 5_000 },
    { why: "beta at -MATE_FLOOR", fen: WIN, depth: 1, ply: 1, beta: 0 - MATE_FLOOR },
    { why: "beta below -MATE_FLOOR", fen: WIN, depth: 1, ply: 1, beta: 0 - MATE_SCORE + 7 },
    // The upper side: only a static score inside the band could cut against it, so the stub hands
    // the predicate one. Without the guard, 25 000 - 120 >= 20 000 would cut.
    { why: "beta at +MATE_FLOOR", fen: WIN, depth: 1, ply: 1, beta: MATE_FLOOR, stub: 25_000 },
    {
      why: "beta above +MATE_FLOOR",
      fen: WIN,
      depth: 1,
      ply: 1,
      beta: MATE_FLOOR + 5_000,
      stub: 29_999,
    },
    { why: "in check", fen: IN_CHECK, depth: 1, ply: 1, beta: 0 },
    { why: "two non-pawn pieces", fen: TWO, depth: 3, ply: 1, beta: 0 },
    { why: "the OTHER side has the pieces", fen: OTHER_SIDE, depth: 1, ply: 1, beta: 0 - 5_000 },
    { why: "pawns only", fen: ENDGAMES[3]?.fen as string, depth: 1, ply: 1, beta: 0 - 5_000 },
  ];

  for (const { why, fen, depth, ply, beta, stub } of GUARDS) {
    it(`guarded — ${why}: false, and no evaluation is paid`, () => {
      evalStub.value = stub ?? null;
      const would = evaluate(parseFen(fen)) - 120 * depth >= beta;
      expect(would, "the margin alone would cut here").toBe(true);
      evalStub.calls = 0;
      const position = parseFen(fen);
      expect(reverseFutilityCut(position, depth, ply, beta)).toBe(false);
      // The guards come first (`ADR-0059` decision 2): a guarded node pays no evaluation.
      expect(evalStub.calls).toBe(0);
    });
  }

  it("the mate band's edges: one centipawn inside it on either side, the margin decides", () => {
    // Low side: -MATE_FLOOR + 1 is outside the band, and the real score clears it.
    expect(reverseFutilityCut(parseFen(WIN), 1, 1, 0 - MATE_FLOOR + 1)).toBe(true);
    // High side: MATE_FLOOR - 1 is outside the band; the stubbed score clears it, the real one not.
    evalStub.value = 25_000;
    expect(reverseFutilityCut(parseFen(WIN), 1, 1, MATE_FLOOR - 1)).toBe(true);
    evalStub.value = null;
    expect(reverseFutilityCut(parseFen(WIN), 1, 1, MATE_FLOOR - 1)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// The node (`ADR-0059` decision 1): the source row, and the first divergence from the door.
// ---------------------------------------------------------------------------

describe("both recursions try reverse futility through the predicate, at null-window nodes, after the table and before the null move, and return beta", () => {
  const MODULES = [
    { path: "./search.ts", depth: "depth", on: "switches", calls: 2 },
    { path: "./engine.ts", depth: "remaining", on: "budget", calls: 1 },
  ];

  for (const { path, depth, on, calls } of MODULES) {
    it(`${path}: gates on ${on}.reverseFutility and alpha + 1 === beta, calls reverseFutilityCut before the null move, and returns beta`, () => {
      const source = readFileSync(new URL(path, import.meta.url), "utf8");
      expect(source.length, path).toBeGreaterThan(1000); // the module, not nothing
      const flat = source.replace(/\s+/g, " ").replace(/\( /g, "(").replace(/ \)/g, ")");
      // The predicate, called once (search.ts declares it too), with the node's depth, ply and beta.
      expect((flat.match(/reverseFutilityCut\(/g) ?? []).length, path).toBe(calls);
      const gate = `if (${on}.reverseFutility && alpha + 1 === beta && reverseFutilityCut(position, ${depth}, ply, beta)) { return beta; }`;
      expect(flat, path).toContain(gate);
      // The order inside negamax: the table cutoff, then reverse futility, then the null move.
      const at = flat.indexOf(gate);
      expect(flat.lastIndexOf("tableCutoff(", at), path).toBeGreaterThan(-1);
      expect(flat.indexOf(`if (${on}.nullMove && alpha + 1 === beta) {`, at), path).toBeGreaterThan(
        at,
      );
      // Nothing stored and no move generated between the gate and the null move.
      const block = flat.slice(at, flat.indexOf("nullMoveReduction(position", at));
      expect(block, path).not.toContain("storeEntry(");
      expect(block, path).not.toContain("legalMoves(");
      expect(block, path).not.toContain("evaluate(");
    });
  }
});

describe("A2 — a node the predicate cuts searches 0 child moves; the door searches them", () => {
  /**
   * Until the first cut, the shipped path and its door run the same tree, event for event (the
   * predicate has no side effect). At the first cut the shipped path leaves the node it has just
   * entered with no event at all — no move generated, none made — and the door generates its moves
   * and makes the first. Depth 3, because at depth 2 kiwipete has no node to cut: a static score
   * sees no hanging piece, so a cut needs a capture already on the board, two plies in. The door's
   * next event is asserted to be the generation itself, not a null move.
   */
  const firstDivergence = (head: string[], door: string[]) => {
    let at = 0;
    while (at < head.length && head[at] === door[at]) at++;
    return at;
  };

  const RUNS = {
    "search() at depth 3": {
      head: () => search(parseFen(fenOf("kiwipete")), 3),
      door: () => searchWithoutReverseFutility(parseFen(fenOf("kiwipete")), 3),
    },
    "chooseMove deepened to 3": {
      head: () => deepenTo(chooseMove, fenOf("kiwipete"), 3),
      door: () => deepenTo(chooseMoveWithoutReverseFutility, fenOf("kiwipete"), 3),
    },
  };

  for (const [what, { head, door }] of Object.entries(RUNS)) {
    it(`${what} on kiwipete: the shipped path enters the node and leaves it; the door generates and makes a move`, () => {
      const headEvents = eventsDuring(head);
      const doorEvents = eventsDuring(door);
      const at = firstDivergence(headEvents, doorEvents);
      expect(at, "the two runs never diverge: no cut").toBeLessThan(headEvents.length);
      // The shipped path: the parent made the move into the node, and the next event unmakes it.
      expect(headEvents[at - 1]).toBe("make");
      expect(headEvents[at]).toBe("unmake");
      // The door: the same node generates its moves and searches the first.
      const generated = doorEvents[at] as string;
      expect(generated.startsWith("gen ")).toBe(true);
      expect(doorEvents[at + 1]).toBe("make");
      // And it is a node the rule allows: out of check, three or more non-pawn pieces.
      const node = parseFen(generated.slice(4));
      expect(isInCheck(node)).toBe(false);
      expect(nonPawnPieces(node)).toBeGreaterThanOrEqual(3);
      expect(reverseFutilityCut(node, 1, 1, evaluate(node) - 120)).toBe(true);
    });
  }

  it("the cut changes the work: search() at depth 4 on position-6 visits fewer nodes than its door", () => {
    const head = search(parseFen(fenOf("position-6")), 4).nodes;
    const door = searchWithoutReverseFutility(parseFen(fenOf("position-6")), 4).nodes;
    expect(head).toBeLessThan(door);
  });
});

describe("A2 — the zugzwang guard holds in the tree: below three non-pawn pieces for both sides, the shipped path IS the door, node for node", () => {
  /**
   * The endgames of the 190 and `ADR-0050` decision 9's four K+P rows: neither side ever has three
   * non-pawn pieces, so no node passes the guard and nothing may differ.
   */
  const THIN = [
    ...ENDGAMES.map(({ fen }) => fen),
    "2k5/8/1K6/2P5/8/8/8/8 w - - 0 1",
    "3k4/8/2K5/3P4/8/8/8/8 w - - 0 1",
    "4k3/8/3K4/4P3/8/8/8/8 w - - 0 1",
    "5k2/8/4K3/5P2/8/8/8/8 w - - 0 1",
  ];

  it("search() at depth 6 and chooseMove deepened to 6: move, score and nodes equal the door's", () => {
    for (const fen of THIN) {
      const position = parseFen(fen);
      expect(nonPawnPieces(position), fen).toBeLessThan(3);
      position.blackToMove = !position.blackToMove;
      expect(nonPawnPieces(position), fen).toBeLessThan(3);
      const head = search(parseFen(fen), 6);
      const door = searchWithoutReverseFutility(parseFen(fen), 6);
      expect([head.score, head.nodes, head.move], fen).toEqual([door.score, door.nodes, door.move]);
      const headChoice = deepenTo(chooseMove, fen, 6);
      const doorChoice = deepenTo(chooseMoveWithoutReverseFutility, fen, 6);
      expect([headChoice.score, headChoice.nodes, headChoice.move], fen).toEqual([
        doorChoice.score,
        doorChoice.nodes,
        doorChoice.move,
      ]);
    }
  });
});

// ---------------------------------------------------------------------------
// The doors (`ADR-0059` decisions 4 and 5): the new pair is reverse futility off, and every older
// door turns it off too.
// ---------------------------------------------------------------------------

describe("the doors — searchWithoutReverseFutility and chooseMoveWithoutReverseFutility turn reverse futility off, as every older door does", () => {
  it("the doors take what search() and chooseMove take, and no depth on the engine side", () => {
    expect(searchWithoutReverseFutility.length).toBe(2);
    expect(chooseMoveWithoutReverseFutility.length).toBe(2);
  });

  const MODULES = [
    { path: "./search.ts", call: "searchRoot(position, depth, {", on: "search", least: 13 },
    { path: "./engine.ts", call: "deepen(position, options, {", on: "chooseMove", least: 7 },
  ];

  for (const { path, call, on, least } of MODULES) {
    it(`${path}: each exported entry passes exactly one reverseFutility literal, and only ${on}'s is true`, () => {
      const flat = readFileSync(new URL(path, import.meta.url), "utf8").replace(/\s+/g, " ");
      const found: Record<string, string> = {};
      for (const chunk of flat.split("export function ").slice(1)) {
        if (!chunk.includes(call)) continue;
        const name = chunk.slice(0, chunk.indexOf("("));
        const literals = [...chunk.matchAll(/reverseFutility: (true|false)\b/g)].map((m) => m[1]);
        expect(literals, name).toHaveLength(1);
        found[name] = literals[0] as string;
      }
      expect(Object.keys(found).length).toBeGreaterThanOrEqual(least);
      expect(Object.entries(found).filter(([, value]) => value === "true")).toEqual([[on, "true"]]);
    });
  }
});

// ---------------------------------------------------------------------------
// A3 — the bounded oracle (`ADR-0059` decision 8) and A4 — it pays (decision 9). Deep only.
// ---------------------------------------------------------------------------

if (RUN_DEEP) {
  interface Drift {
    readonly compared: number;
    readonly within25: number;
    readonly max: number;
    /** A mate score on either side whose other side has the opposite sign: a BAR, 0. */
    readonly signFlips: number;
    /** Mate <-> no mate on the 190: a REPORT, never a bar. */
    readonly mateFlips: number;
    readonly worst: string;
  }

  const drift = (on: (fen: string) => number, reference: (fen: string) => number): Drift => {
    const deltas: Array<[number, string]> = [];
    let signFlips = 0;
    let mateFlips = 0;
    for (const { name, fen } of corpus()) {
      const ref = reference(fen);
      const got = on(fen);
      if (isMate(ref) || isMate(got)) {
        if (Math.sign(ref) !== Math.sign(got)) signFlips++;
        if (isMate(ref) !== isMate(got)) mateFlips++;
        continue;
      }
      deltas.push([Math.abs(got - ref), `${name}: ${ref} -> ${got}`]);
    }
    deltas.sort((a, b) => b[0] - a[0]);
    return {
      compared: deltas.length,
      within25: deltas.filter(([delta]) => delta <= 25).length / deltas.length,
      max: deltas[0]?.[0] ?? 0,
      signFlips,
      mateFlips,
      worst: deltas[0]?.[1] ?? "",
    };
  };

  const reportAndBar = (what: string, result: Drift): void => {
    console.log(
      `ABC-264 A3 ${what}: ${(100 * result.within25).toFixed(2)}% within 25 cp of ` +
        `${result.compared}, max ${result.max} cp (${result.worst}); mate sign flips ` +
        `${result.signFlips}; mate-status flips ${result.mateFlips} (a report, not a bar)`,
    );
    expect(result.compared).toBeGreaterThanOrEqual(100);
    expect(result.within25).toBeGreaterThanOrEqual(0.95);
    expect(result.max).toBeLessThanOrEqual(160);
    expect(result.signFlips).toBe(0);
  };

  describe("A3 — bounded drift against the reverse-futility doors, depth 5, the 190 [deep, SEARCH_DEEP=1]", () => {
    it("the corpus is the 190", () => {
      expect(corpus()).toHaveLength(190);
    });

    it("search() against searchWithoutReverseFutility at fixed depth 5: >= 95% within 25 cp, none beyond 160 cp, 0 mate sign flips [deep, SEARCH_DEEP=1]", () => {
      reportAndBar(
        "search() d5",
        drift(
          (fen) => search(parseFen(fen), 5).score,
          (fen) => searchWithoutReverseFutility(parseFen(fen), 5).score,
        ),
      );
    }, 600_000);

    it("chooseMove against chooseMoveWithoutReverseFutility deepened to 5: >= 95% within 25 cp, none beyond 160 cp, 0 mate sign flips [deep, SEARCH_DEEP=1]", () => {
      reportAndBar(
        "chooseMove to d5",
        drift(
          (fen) => deepenTo(chooseMove, fen, 5).score,
          (fen) => deepenTo(chooseMoveWithoutReverseFutility, fen, 5).score,
        ),
      );
    }, 600_000);
  });

  describe("A3 — the same-depth mate floor on the 287 [deep, SEARCH_DEEP=1]", () => {
    it("every mate searchWithoutReverseFutility scores at depth 5, search() scores as a mate of the same sign at depth 5 (distance reported) [deep, SEARCH_DEEP=1]", () => {
      let mates = 0;
      let longer = 0;
      let shorter = 0;
      const violations: string[] = [];
      for (const fen of MATE_CORPUS) {
        const ref = searchWithoutReverseFutility(parseFen(fen), 5).score;
        if (!isMate(ref)) continue;
        mates++;
        const got = search(parseFen(fen), 5).score;
        if (!isMate(got) || Math.sign(got) !== Math.sign(ref)) {
          violations.push(`${fen}: ${ref} on the door, ${got} on search(), depth 5`);
        } else if (Math.abs(got) < Math.abs(ref)) {
          longer++;
        } else if (Math.abs(got) > Math.abs(ref)) {
          shorter++;
        }
      }
      console.log(
        `ABC-264 A3 mate floor d5: ${violations.length} of ${mates} violated; ` +
          `${longer} longer, ${shorter} shorter (a report, not a bar)`,
      );
      expect(mates).toBeGreaterThanOrEqual(100);
      expect(violations).toEqual([]);
    }, 300_000);
  });

  describe("A4 — at depth 8 on kiwipete and position-6, nodes <= 0.75x the door's in both recursions [deep, SEARCH_DEEP=1]", () => {
    for (const name of ["kiwipete", "position-6"]) {
      it(`${name}: search() at depth 8 [deep, SEARCH_DEEP=1]`, () => {
        const head = search(parseFen(fenOf(name)), 8).nodes;
        const door = searchWithoutReverseFutility(parseFen(fenOf(name)), 8).nodes;
        console.log(
          `ABC-264 A4 search() ${name} d8: ${head} / ${door} = ${(head / door).toFixed(4)}x`,
        );
        expect(head).toBeLessThanOrEqual(0.75 * door);
      }, 120_000);

      it(`${name}: chooseMove deepened to 8 on a frozen clock [deep, SEARCH_DEEP=1]`, () => {
        const head = deepenTo(chooseMove, fenOf(name), 8);
        const door = deepenTo(chooseMoveWithoutReverseFutility, fenOf(name), 8);
        expect([head.depth, door.depth]).toEqual([8, 8]);
        console.log(
          `ABC-264 A4 chooseMove ${name} to 8: ${head.nodes} / ${door.nodes} = ${(head.nodes / door.nodes).toFixed(4)}x`,
        );
        expect(head.nodes).toBeLessThanOrEqual(0.75 * door.nodes);
      }, 120_000);
    }
  });
}
