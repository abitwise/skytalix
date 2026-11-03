/**
 * ABC-268 acceptance — futility pruning (`ADR-0061`, PROPOSED): `A2`, `A3` and `A4`, and the rows
 * `ADR-0061` decision 7 owes the rule. `A1` compares two builds and runs out of tree (`ABC-208`
 * `A1`'s form); the export lists of `ABC-077` `A6` and `ABC-078` `A4` grow by the four new names.
 * `A3` (d), the cut audit, is a QE scratch reading with a sampling hook that never enters `src/`.
 *
 * THE BOUNDED ORACLE IS A REGRESSION NET, NOT A PROOF OF THE RULE (`ADR-0061` decision 8). So the
 * rule is guarded row by row: `futilityNode`'s boundary rows red a margin off by one at each depth;
 * its guard rows red each missing clause on a node where every other clause would prune (the
 * lower mate band through a call-through stub of `evaluate`, since a real static score never
 * reaches it); `futileMove`'s rows red each missing move clause; the source rows red the rule wired
 * in the wrong place, with the wrong window, or without advancing the index; `A4`'s node bars red
 * the switch left unwired.
 *
 * LANES (`N8-LANE`): the default lane holds the predicates' tables, the purity rows, the constant
 * and source rows, the doors and the work rows. `SEARCH_DEEP=1` adds `A3`'s oracle (the depth-5
 * drift in both recursions on the 190 with the 25 cp cap, the mate floor on the 287, and the
 * zugzwang node report) and `A4` (depth 8 on kiwipete and position-6 in both recursions, and the
 * reach at 47 000 nodes on the 190). Every row is deterministic: a fixed depth, or `chooseMove` on
 * a frozen clock with `maxDepth` or `maxNodes`. Unset, the deep cases are NOT DEFINED rather than
 * skipped. `A3`'s zugzwang BAR is `ADR-0050` decision 9's seven rows, which
 * `src/search.null-move.test.ts` already runs on the shipped `chooseMove` at their recorded depths
 * (8 to 12; the two deepest behind `SEARCH_DEEP=1`); no depth is re-pinned.
 */

import { readdirSync, readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { makeMove, unmakeMove } from "./apply.ts";
import {
  chooseMove,
  chooseMoveWithoutFutility,
  chooseMoveWithoutTaper,
  type EngineChoice,
} from "./engine.ts";
import { evaluate, phaseOf } from "./evaluate.ts";
import { parseFen, toFen } from "./fen.ts";
import { gameStatus } from "./gameend.ts";
import { givesCheck, isInCheck, legalMoves } from "./legal.ts";
import { FLAG_CASTLE, FLAG_EN_PASSANT, type Move } from "./moves.ts";
import { EMPTY, type Position, squareName } from "./position.ts";
import { MATE_CORPUS } from "./search.mate-corpus.ts";
import {
  futileMove,
  futilityNode,
  MATE_SCORE,
  orderMoves,
  search,
  searchWithoutFutility,
  searchWithoutTaper,
} from "./search.ts";
import { MATE_FLOOR, probeTable, tableCutoff } from "./transposition.ts";
import { zobristKey } from "./zobrist.ts";

const RUN_DEEP = process.env.SEARCH_DEEP === "1";

/**
 * THE EVALUATION STUB: a call-through module mock of `src/evaluate.ts`. `calls` counts every
 * evaluation; with `value` set, `evaluate` answers it instead, so the node test can be handed a
 * static score far below the mate band — the one input that makes the lower `alphaIn` clause
 * observable on its own. No production hook is added. `evaluateAtPhase` (`ABC-269` cut C1) is the
 * tapered entry `futilityNode` reads, so it is stubbed the same way, on the same counter.
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
    evaluateAtPhase: (position: Position, phase: number) => {
      evalStub.calls++;
      return evalStub.value ?? actual.evaluateAtPhase(position, phase);
    },
  };
});

afterEach(() => {
  evalStub.value = null;
  evalStub.calls = 0;
});

/** The margins `ADR-0061` decision 1 names, written here and not read from the module. */
const M = [0, 150, 350, 550] as const;

/** `chooseMove`-shaped `choose` on a frozen clock, deepened to `depth` exactly. */
const deepenTo = (choose: typeof chooseMove, fen: string, depth: number): EngineChoice =>
  choose(parseFen(fen), { budgetMs: 1_000, now: () => 0, maxDepth: depth }) as EngineChoice;

const isMate = (score: number): boolean => Math.abs(score) > MATE_SCORE - 1_000;

const label = (move: Move | null | undefined): string =>
  move ? `${squareName(move.from)}${squareName(move.to)}` : "-";

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
        out.push({ name: `${name}/${label(move)}`, fen: toFen(position) });
      }
      unmakeMove(position, move, undo);
    }
  }
  return [...out, ...ENDGAMES];
}

const fenOf = (name: string): string =>
  (ROOTS.find((root) => root.name === name) as { fen: string }).fen;

// ---------------------------------------------------------------------------
// The node test (`ADR-0061` decisions 1, 2 and 7): `futilityNode`, called directly.
// ---------------------------------------------------------------------------

describe("futilityNode — eval + 150 / 350 / 550 <= alpha at a null-window node of depth 1-3; false at the root, at a PV window, at depth 0 and 4, in check, and with alpha or beta in the mate band", () => {
  /** position-6, White to move, not in check. */
  const QUIET = fenOf("position-6");
  /** startpos after 1.e4, Black to move, not in check. */
  const QUIET_BLACK = "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1";
  /** White to move IN CHECK from a rook on e2. */
  const IN_CHECK = "4k3/8/8/8/8/8/4r3/4K3 w - - 0 1";

  /** The real static score of `fen`, read with the stub off. */
  const staticScore = (fen: string): number => evaluate(parseFen(fen));

  it("the fixtures bite: each board really is what its row says", () => {
    expect(isInCheck(parseFen(QUIET))).toBe(false);
    expect(isInCheck(parseFen(QUIET_BLACK))).toBe(false);
    expect(parseFen(QUIET_BLACK).blackToMove).toBe(true);
    expect(isInCheck(parseFen(IN_CHECK))).toBe(true);
    // A real static score is far from the mate band: the lower alpha row needs the stub.
    expect(Math.abs(staticScore(QUIET))).toBeLessThan(MATE_FLOOR - 1_000);
    expect(futilityNode.length).toBe(7); // ABC-269 adds `taper`, and cut C1 the carried `phase`
  });

  const BOUNDARY: ReadonlyArray<{ fen: string; depth: 1 | 2 | 3; ply: number; side: string }> = [
    { fen: QUIET, depth: 1, ply: 1, side: "White" },
    { fen: QUIET, depth: 2, ply: 1, side: "White" },
    { fen: QUIET, depth: 3, ply: 1, side: "White" },
    { fen: QUIET_BLACK, depth: 1, ply: 3, side: "Black" },
    { fen: QUIET_BLACK, depth: 2, ply: 3, side: "Black" },
    { fen: QUIET_BLACK, depth: 3, ply: 40, side: "Black" },
  ];

  for (const { fen, depth, ply, side } of BOUNDARY) {
    it(`depth ${depth}, ply ${ply}, ${side} to move: true at alpha = eval + ${M[depth]} exactly, false at alpha - 1`, () => {
      const alpha = staticScore(fen) + M[depth];
      const position = parseFen(fen);
      expect(futilityNode(position, depth, ply, alpha, alpha + 1, true, phaseOf(position))).toBe(
        true,
      );
      expect(futilityNode(position, depth, ply, alpha - 1, alpha, true, phaseOf(position))).toBe(
        false,
      );
      // Far below alpha it still prunes; the margin is the only boundary.
      expect(
        futilityNode(position, depth, ply, alpha + 900, alpha + 901, true, phaseOf(position)),
      ).toBe(true);
    });
  }

  /**
   * Each clause, on a node where every other clause would prune: the margin alone clears alpha
   * (asserted per row), and only the named clause stands in the way.
   */
  const GUARDS: ReadonlyArray<{
    why: string;
    fen: string;
    depth: number;
    ply: number;
    alpha: (score: number) => number;
    beta: (alpha: number) => number;
    stub?: number;
  }> = [
    {
      why: "the root (ply 0)",
      fen: QUIET,
      depth: 1,
      ply: 0,
      alpha: (s) => s + 200,
      beta: (a) => a + 1,
    },
    {
      why: "a PV window (alphaIn + 1 < beta)",
      fen: QUIET,
      depth: 1,
      ply: 1,
      alpha: (s) => s + 200,
      beta: (a) => a + 2,
    },
    {
      why: "remaining depth 0",
      fen: QUIET,
      depth: 0,
      ply: 1,
      alpha: (s) => s + 200,
      beta: (a) => a + 1,
    },
    // Clear of any margin a fourth depth could carry (750, `ADR-0061` § Alternatives).
    {
      why: "remaining depth 4",
      fen: QUIET,
      depth: 4,
      ply: 1,
      alpha: (s) => s + 1_000,
      beta: (a) => a + 1,
    },
    {
      why: "the side to move in check",
      fen: IN_CHECK,
      depth: 1,
      ply: 1,
      alpha: (s) => s + 200,
      beta: (a) => a + 1,
    },
    // Alpha alone in the band: a stubbed static score far below it, beta one centipawn inside.
    {
      why: "alpha in the mate band (alphaIn = -MATE_FLOOR)",
      fen: QUIET,
      depth: 1,
      ply: 1,
      alpha: () => 0 - MATE_FLOOR,
      beta: (a) => a + 1,
      stub: 0 - 25_000,
    },
    // Beta alone in the band: alpha one centipawn inside, the real score far below it.
    {
      why: "beta in the mate band (beta = MATE_FLOOR)",
      fen: QUIET,
      depth: 1,
      ply: 1,
      alpha: () => MATE_FLOOR - 1,
      beta: (a) => a + 1,
    },
  ];

  for (const { why, fen, depth, ply, alpha: alphaOf, beta: betaOf, stub } of GUARDS) {
    it(`guarded — ${why}: false, and no evaluation is paid`, () => {
      evalStub.value = stub ?? null;
      const alpha = alphaOf(evaluate(parseFen(fen)));
      const beta = betaOf(alpha);
      const margin = M[Math.min(Math.max(depth, 1), 3)] as number;
      expect(evaluate(parseFen(fen)) + margin <= alpha, "the margin alone would prune here").toBe(
        true,
      );
      evalStub.calls = 0;
      const position = parseFen(fen);
      expect(futilityNode(position, depth, ply, alpha, beta, true, phaseOf(position))).toBe(false);
      // The guards come first: a guarded node pays no evaluation.
      expect(evalStub.calls).toBe(0);
    });
  }

  it("the mate band's edges: one centipawn inside it on either side, the margin decides", () => {
    evalStub.value = 0 - 25_000;
    expect(
      futilityNode(
        parseFen(QUIET),
        1,
        1,
        0 - MATE_FLOOR + 1,
        0 - MATE_FLOOR + 2,
        true,
        phaseOf(parseFen(QUIET)),
      ),
    ).toBe(true);
    evalStub.value = null;
    expect(
      futilityNode(
        parseFen(QUIET),
        1,
        1,
        MATE_FLOOR - 2,
        MATE_FLOOR - 1,
        true,
        phaseOf(parseFen(QUIET)),
      ),
    ).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// The move test (`ADR-0061` decisions 1, 2 and 7): `futileMove`, called directly.
// ---------------------------------------------------------------------------

describe("futileMove — true for a quiet, non-checking move at index >= 1; false at index 0, for a capture, a promotion and a quiet check", () => {
  /**
   * White K e1, Q d1, P a7; Black K h7, N d4. Qd3+ is a quiet check (d3-h7), Qxd4 a capture that
   * does not check, a8=N and a8=Q promotions that neither capture nor check, Qb3 quiet and silent.
   */
  const FIXTURE = "8/P6k/8/8/3n4/8/8/3QK3 w - - 0 1";
  const find = (position: Position, from: string, to: string, promotion = EMPTY): Move => {
    const move = legalMoves(position).find(
      (m) =>
        squareName(m.from) === from &&
        squareName(m.to) === to &&
        (promotion === EMPTY ? m.promotion === EMPTY : m.promotion === promotion),
    );
    if (move === undefined) throw new Error(`no ${from}${to} in ${toFen(position)}`);
    return move;
  };
  const position = parseFen(FIXTURE);
  const all = legalMoves(position);
  const promotions = all.filter((m) => squareName(m.from) === "a7");
  const quietCheck = find(position, "d1", "d3");
  const capture = find(position, "d1", "d4");
  const quiet = find(position, "d1", "b3");

  it("the fixtures bite: each move really is what its row says", () => {
    expect(isInCheck(position)).toBe(false);
    expect([quietCheck.captured, quietCheck.promotion, givesCheck(position, quietCheck)]).toEqual([
      EMPTY,
      EMPTY,
      true,
    ]);
    expect([capture.captured !== EMPTY, givesCheck(position, capture)]).toEqual([true, false]);
    expect([quiet.captured, quiet.promotion, givesCheck(position, quiet)]).toEqual([
      EMPTY,
      EMPTY,
      false,
    ]);
    expect(promotions).toHaveLength(4);
    for (const promotion of promotions) {
      expect([promotion.captured, givesCheck(position, promotion)]).toEqual([EMPTY, false]);
      expect(promotion.promotion).not.toBe(EMPTY);
    }
    expect(futileMove.length).toBe(3);
  });

  it("a quiet, non-checking move: true at index 1 and later, false at index 0", () => {
    expect(futileMove(position, quiet, 0)).toBe(false);
    expect(futileMove(position, quiet, 1)).toBe(true);
    expect(futileMove(position, quiet, 2)).toBe(true);
    expect(futileMove(position, quiet, 40)).toBe(true);
  });

  it("a capture: false, at any index", () => {
    expect(futileMove(position, capture, 1)).toBe(false);
    expect(futileMove(position, capture, 7)).toBe(false);
  });

  it("each promotion (none captures, none checks): false, at any index", () => {
    for (const promotion of promotions) {
      expect(futileMove(position, promotion, 1)).toBe(false);
      expect(futileMove(position, promotion, 9)).toBe(false);
    }
  });

  it("a quiet move that gives check: false, at any index", () => {
    expect(futileMove(position, quietCheck, 1)).toBe(false);
    expect(futileMove(position, quietCheck, 9)).toBe(false);
  });
});

describe("QE-268-c — futileMove on the other move kinds: en passant is a capture (false); a quiet pawn push, a quiet king move and castling are quiet (true at index >= 1)", () => {
  /**
   * White K e1, R h1, P a2, P e5; Black K a8, P d5 just played (en passant on d6). None of exd6,
   * a3, Kd2 and O-O gives check; exd6 is the only capture.
   */
  const FIXTURE = "k7/8/8/3pP3/8/8/P7/4K2R w K d6 0 1";
  const position = parseFen(FIXTURE);
  const find = (from: string, to: string): Move => {
    const move = legalMoves(position).find(
      (m) => squareName(m.from) === from && squareName(m.to) === to,
    );
    if (move === undefined) throw new Error(`no ${from}${to} in ${FIXTURE}`);
    return move;
  };
  const enPassant = find("e5", "d6");
  const pawnPush = find("a2", "a3");
  const kingMove = find("e1", "d2");
  const castle = find("e1", "g1");

  it("the fixtures bite: each move really is what its row says", () => {
    expect(isInCheck(position)).toBe(false);
    // En passant: the captured pawn is not on the target square, but the move still captures.
    expect(position.board[enPassant.to]).toBe(EMPTY);
    expect([enPassant.captured !== EMPTY, enPassant.flags, enPassant.promotion]).toEqual([
      true,
      FLAG_EN_PASSANT,
      EMPTY,
    ]);
    expect(castle.flags).toBe(FLAG_CASTLE);
    for (const move of [enPassant, pawnPush, kingMove, castle]) {
      expect(givesCheck(position, move), label(move)).toBe(false);
    }
    for (const move of [pawnPush, kingMove, castle]) {
      expect([move.captured, move.promotion], label(move)).toEqual([EMPTY, EMPTY]);
    }
  });

  it("en passant: false, at any index — it captures", () => {
    expect(futileMove(position, enPassant, 1)).toBe(false);
    expect(futileMove(position, enPassant, 9)).toBe(false);
  });

  it("a quiet pawn push, a quiet king move and castling: true at index 1 and later, false at index 0", () => {
    for (const move of [pawnPush, kingMove, castle]) {
      expect(futileMove(position, move, 0), label(move)).toBe(false);
      expect(futileMove(position, move, 1), label(move)).toBe(true);
      expect(futileMove(position, move, 9), label(move)).toBe(true);
    }
  });
});

describe("purity — each predicate leaves the position byte-identical (ADR-0061 decision 2)", () => {
  it("futilityNode on a pruning node and a guarded one, and futileMove on every legal move of five boards", () => {
    for (const { fen } of [...ROOTS.slice(1), { fen: "8/P6k/8/8/3n4/8/8/3QK3 w - - 0 1" }]) {
      const position = parseFen(fen);
      const before = structuredClone(position);
      const score = evaluate(position);
      futilityNode(position, 2, 1, score + 400, score + 401, true, phaseOf(position));
      futilityNode(position, 2, 0, score + 400, score + 401, true, phaseOf(position));
      expect(position, fen).toEqual(before);
      legalMoves(position).forEach((move, index) => {
        futileMove(position, move, index);
      });
      expect(position, fen).toEqual(before);
      expect(toFen(position)).toBe(toFen(parseFen(fen)));
    }
  });
});

// ---------------------------------------------------------------------------
// The constant and the node (`ADR-0061` decisions 1-3 and 7): source rows.
// ---------------------------------------------------------------------------

/** The production modules of `src/` (tests excluded), read as text. */
const productionSources = (): Array<[string, string]> =>
  readdirSync(new URL(".", import.meta.url))
    .filter((name) => name.endsWith(".ts") && !name.includes(".test."))
    .map((name) => [name, readFileSync(new URL(name, import.meta.url), "utf8")]);

describe("FUTILITY_MARGIN reads [0, 150, 350, 550], is module-private, and no line in src/ writes it after load", () => {
  it("the declaration, in src/search.ts", () => {
    const source = readFileSync(new URL("./search.ts", import.meta.url), "utf8");
    expect(source).toContain("const FUTILITY_MARGIN: readonly number[] = [0, 150, 350, 550];");
    expect(source).not.toMatch(/export\s+const\s+FUTILITY_MARGIN/);
  });

  it("no production module assigns to it, to an element of it, or calls a mutating method on it", () => {
    const sources = productionSources();
    expect(sources.length).toBeGreaterThan(20);
    const writes =
      /FUTILITY_MARGIN\s*(\[[^\]]*\])?\s*(=(?!=)|\+=|-=|\*=|\/=|\+\+|--)|FUTILITY_MARGIN\s*\.\s*(push|pop|shift|unshift|splice|fill|sort|reverse|copyWithin|length\s*=)|(\+\+|--)\s*FUTILITY_MARGIN/;
    for (const [name, source] of sources) {
      expect(source.match(writes)?.[0] ?? null, name).toBeNull();
      if (name !== "search.ts") expect(source.includes("FUTILITY_MARGIN"), name).toBe(false);
    }
  });
});

describe("both recursions test the node once, with the entry window, after the table probe and the null move, and skip exactly the moves futileMove names", () => {
  const MODULES = [
    { path: "./search.ts", depth: "depth", on: "switches", calls: 2, moveCalls: 2 },
    { path: "./engine.ts", depth: "remaining", on: "budget", calls: 1, moveCalls: 1 },
  ];

  for (const { path, depth, on, calls, moveCalls } of MODULES) {
    it(`${path}: one futilityNode call gated on ${on}.futility, before the move loop, after the null move; futileMove skips and advances the index`, () => {
      const source = readFileSync(new URL(path, import.meta.url), "utf8");
      expect(source.length, path).toBeGreaterThan(1000); // the module, not nothing
      const flat = source.replace(/\s+/g, " ").replace(/\( /g, "(").replace(/ \)/g, ")");
      // The predicates, called once each (search.ts declares them too).
      expect((flat.match(/futilityNode\(/g) ?? []).length, path).toBe(calls);
      expect((flat.match(/futileMove\(/g) ?? []).length, path).toBe(moveCalls);
      // The node test: once per node, with the ENTRY window (alphaIn), the remaining depth and ply.
      const node = `const futile = ${on}.futility && futilityNode(position, ${depth}, ply, alphaIn, beta, ${on}.taper, phase);`;
      expect(flat, path).toContain(node);
      const at = flat.indexOf(node);
      // After the table cutoff and the null move, after the move list and the entry window exist.
      expect(flat.lastIndexOf("tableCutoff(", at), path).toBeGreaterThan(-1);
      expect(flat.lastIndexOf("nullMoveReduction(position", at), path).toBeGreaterThan(
        flat.lastIndexOf("tableCutoff(", at),
      );
      expect(flat.lastIndexOf("const moves = legalMoves(position);", at), path).toBeGreaterThan(
        flat.lastIndexOf("nullMoveReduction(position", at),
      );
      expect(flat.lastIndexOf("const alphaIn = alpha;", at), path).toBeGreaterThan(
        flat.lastIndexOf("const moves = legalMoves(position);", at),
      );
      // The move loop opens next, and its first statement skips the futile move, advancing the index.
      const loop = flat.indexOf("for (const move of ", at);
      expect(loop, path).toBeGreaterThan(at);
      const body = flat.slice(loop, flat.indexOf("storeEntry(", loop));
      const skip =
        "{ if (futile && futileMove(position, move, index)) { index++; continue; } const reduction";
      expect(body, path).toContain(skip);
      // Nothing between the node test and the loop makes a move or stores.
      const between = flat.slice(at, loop);
      expect(between, path).not.toContain("makeMove(");
      expect(between, path).not.toContain("storeEntry(");
      // The node still stores through the existing path, with the entry window.
      expect(flat.slice(loop), path).toContain(
        "boundOf(best, alphaIn, beta), best, ply, bestMove)",
      );
    });
  }

  it("futility is a field of Switches and Heuristics and of nothing else: no module state, no option, no search() parameter", () => {
    const search = readFileSync(new URL("./search.ts", import.meta.url), "utf8");
    const engine = readFileSync(new URL("./engine.ts", import.meta.url), "utf8");
    const field = /readonly futility: boolean;/g;
    expect(search.match(field)).toHaveLength(1);
    expect(engine.match(field)).toHaveLength(1);
    const switches = search.slice(search.indexOf("interface Switches {"));
    expect(switches.slice(0, switches.indexOf("\n}")).includes("readonly futility: boolean;")).toBe(
      true,
    );
    const heuristics = engine.slice(engine.indexOf("interface Heuristics {"));
    expect(
      heuristics.slice(0, heuristics.indexOf("\n}")).includes("readonly futility: boolean;"),
    ).toBe(true);
    const options = engine.slice(engine.indexOf("export interface EngineOptions {"));
    expect(options.slice(0, options.indexOf("\n}")).includes("futility")).toBe(false);
    for (const source of [search, engine]) {
      expect(source).not.toMatch(/^(let|var|const)\s+futility\b/m);
    }
    expect(search).toContain(
      "export function search(position: Position, depth: number): SearchResult {",
    );
  });
});

// ---------------------------------------------------------------------------
// The doors (`ADR-0061` decisions 4 and 5): the new pair is futility off, and every older door
// turns it off too.
// ---------------------------------------------------------------------------

describe("the doors — searchWithoutFutility and chooseMoveWithoutFutility turn futility off, as every older door does", () => {
  it("the doors take what search() and chooseMove take, and no depth on the engine side", () => {
    expect(searchWithoutFutility.length).toBe(2);
    expect(chooseMoveWithoutFutility.length).toBe(2);
  });

  // `ABC-269`'s door (`ADR-0064` decision 7) is the shipped path less the taper, futility on;
  // `ABC-279`'s (`ADR-0069` decision 8) is the shipped path less the SEE skip, futility on.
  const MODULES = [
    {
      path: "./search.ts",
      call: "searchRoot(position, depth, {",
      on: "search",
      see: "searchWithoutSeePruning",
      tap: "searchWithoutTaper",
      least: 14,
    },
    {
      path: "./engine.ts",
      call: "deepen(position, options, {",
      on: "chooseMove",
      see: "chooseMoveWithoutSeePruning",
      tap: "chooseMoveWithoutTaper",
      least: 8,
    },
  ];

  for (const { path, call, on, see, tap, least } of MODULES) {
    it(`${path}: each exported entry passes exactly one futility literal, and only ${on}'s, ${see}'s and ${tap}'s are true`, () => {
      const flat = readFileSync(new URL(path, import.meta.url), "utf8").replace(/\s+/g, " ");
      const found: Record<string, string> = {};
      for (const chunk of flat.split("export function ").slice(1)) {
        if (!chunk.includes(call)) continue;
        const name = chunk.slice(0, chunk.indexOf("("));
        const literals = [...chunk.matchAll(/\bfutility: (true|false)\b/g)].map((m) => m[1]);
        expect(literals, name).toHaveLength(1);
        found[name] = literals[0] as string;
      }
      expect(Object.keys(found).length).toBeGreaterThanOrEqual(least);
      expect(Object.entries(found).filter(([, value]) => value === "true")).toEqual([
        [on, "true"],
        [see, "true"],
        [tap, "true"],
      ]);
    });
  }

  it("the rule changes the work: search() at depth 4 and chooseMove deepened to 4 on position-6 visit fewer nodes than their doors", () => {
    const fen = fenOf("position-6");
    const head = search(parseFen(fen), 4).nodes;
    const door = searchWithoutFutility(parseFen(fen), 4).nodes;
    expect(head).toBeLessThan(door);
    const headChoice = deepenTo(chooseMove, fen, 4);
    const doorChoice = deepenTo(chooseMoveWithoutFutility, fen, 4);
    expect(headChoice.nodes).toBeLessThan(doorChoice.nodes);
  });

  // `ABC-269` (`ADR-0064` decision 7): the shipped side re-points to `searchWithoutTaper`, the
  // shipped path less the taper, so the row keeps measuring futility alone.
  it("depth 1 has no null-window node below the root: searchWithoutTaper at depth 1 IS its door, node for node, on the 190's roots", () => {
    for (const { fen } of [...ROOTS, ...ENDGAMES]) {
      const head = searchWithoutTaper(parseFen(fen), 1);
      const door = searchWithoutFutility(parseFen(fen), 1);
      expect([head.score, head.nodes, label(head.move)], fen).toEqual([
        door.score,
        door.nodes,
        label(door.move),
      ]);
    }
  });
});

// ---------------------------------------------------------------------------
// QE-268-b — fail-soft at a futile node, in both recursions. The futile node's own table entry,
// read back after the search through the module's public probe, holds the best score among the
// moves it searched — not its entry alpha.
// ---------------------------------------------------------------------------

describe("QE-268-b — a futile node returns the best score among the moves it searched, fail-soft: below its alpha, never alpha itself", () => {
  /**
   * White K e1, Q d1; Black K e8, R d5 hanging. Qxd5 is the root's first move and scores 1010.
   * After the later root move Qd3 and the reply Rxd3, White (K e1 against K e8, R d3) stands at
   * ply 2 with one ply left and the null window (1010, 1011) — futile at 150 cp. Its first move
   * Ke2 is searched; Kf1 and Kf2 are quiet and skipped. Nothing re-searches the node: Black's
   * null-window node above it cuts on Rxd3, and the root move it answers fails low.
   */
  //
  // `ABC-269` (`ADR-0064` decision 7): the row measures futility alone, so it re-points to the
  // shipped path less the taper (`searchWithoutTaper`, `chooseMoveWithoutTaper`, `futilityNode`'s
  // `taper` false), and its figures do not change. On the tapered scale the fixture no longer
  // bites: the searched Ke2 and the full-width node both read -532, so no skipped move is better.
  const ROOT = "4k3/8/8/3r4/8/8/8/3QK3 w - - 0 1";
  const NODE = "4k3/8/8/8/8/3r4/8/4K3 w - - 0 2";
  const ALPHA = 1010;

  /** The node's stored entry at depth 1, ply 2, read as an upper bound: `null` if it is none. */
  const storedUpper = (): number | null => {
    const slot = probeTable(zobristKey(parseFen(NODE)));
    expect(slot, "the futile node has an entry").not.toBe(-1);
    // A lower or exact entry would settle a window below every score; an upper bound settles none.
    expect(tableCutoff(slot, 1, -1_000_001, -1_000_000, 2), "not a lower bound").toBeNull();
    return tableCutoff(slot, 1, ALPHA, ALPHA + 1, 2);
  };

  /** The best score among the moves the futile node searches: index 0, and nothing futileMove skips. */
  const bestSearched = (): { best: number; searched: string[]; skipped: string[] } => {
    const position = parseFen(NODE);
    let best = Number.NEGATIVE_INFINITY;
    const searched: string[] = [];
    const skipped: string[] = [];
    orderMoves(legalMoves(position), [], null).forEach((move, index) => {
      if (futileMove(position, move, index)) {
        skipped.push(label(move));
        return;
      }
      searched.push(label(move));
      const undo = makeMove(position, move);
      best = Math.max(best, 0 - searchWithoutTaper(position, 0).score);
      unmakeMove(position, move, undo);
    });
    return { best, searched, skipped };
  };

  it("the fixture bites: the node is futile at the window its parent hands it, and the skipped moves hold a better score", () => {
    expect(
      futilityNode(parseFen(NODE), 1, 2, ALPHA, ALPHA + 1, false, phaseOf(parseFen(NODE))),
    ).toBe(true);
    const root = searchWithoutTaper(parseFen(ROOT), 3);
    expect([root.score, label(root.move)]).toEqual([ALPHA, "d1d5"]);
    const { best, searched, skipped } = bestSearched();
    expect([best, searched, skipped]).toEqual([-554, ["e1e2"], ["e1f1", "e1f2"]]);
    // Full width the node scores higher: the skipped moves were better, and the rule did skip them.
    expect(searchWithoutTaper(parseFen(NODE), 1).score).toBe(-544);
  });

  for (const [name, run] of [
    ["searchWithoutTaper at depth 3", () => searchWithoutTaper(parseFen(ROOT), 3)],
    ["chooseMoveWithoutTaper deepened to 3", () => deepenTo(chooseMoveWithoutTaper, ROOT, 3)],
  ] as const) {
    it(`${name}: the futile node's entry is an upper bound of -554, Ke2's score, strictly below its alpha of ${ALPHA}`, () => {
      const result = run();
      expect([result.score, label(result.move)]).toEqual([ALPHA, "d1d5"]);
      const stored = storedUpper();
      expect(stored).toBe(-554);
      expect(stored).toBeLessThan(ALPHA);
      expect(stored).toBe(bestSearched().best);
    });
  }
});

// ---------------------------------------------------------------------------
// A3 — the bounded oracle (`ADR-0061` decision 8) and A4 — it pays (decision 9). Deep only.
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
      `ABC-268 A3 ${what}: ${(100 * result.within25).toFixed(2)}% within 25 cp of ` +
        `${result.compared}, max ${result.max} cp (${result.worst}); mate sign flips ` +
        `${result.signFlips}; mate-status flips ${result.mateFlips} (a report, not a bar)`,
    );
    expect(result.compared).toBeGreaterThanOrEqual(100);
    // Every non-mate score within 25 cp (`ADR-0061` decision 8): no looser cap is admissible.
    expect(result.within25).toBe(1);
    expect(result.max).toBeLessThanOrEqual(25);
    expect(result.signFlips).toBe(0);
  };

  // `ABC-269` (`ADR-0064` decision 7): A3 (a), A4 (a) and A4 (b) measure futility alone against
  // its doors, so their shipped side re-points to the shipped path less the taper
  // (`searchWithoutTaper`, `chooseMoveWithoutTaper`); their figures do not change. A3 (b) and
  // A3 (c) (the mate floor, zugzwang) are value and behaviour rows and stay on the shipped path.
  describe("A3 (a) — bounded drift against the futility doors, depth 5, the 190 [deep, SEARCH_DEEP=1]", () => {
    it("the corpus is the 190", () => {
      expect(corpus()).toHaveLength(190);
    });

    it("searchWithoutTaper against searchWithoutFutility at fixed depth 5: every non-mate score within 25 cp, 0 mate sign flips [deep, SEARCH_DEEP=1]", () => {
      reportAndBar(
        "searchWithoutTaper d5",
        drift(
          (fen) => searchWithoutTaper(parseFen(fen), 5).score,
          (fen) => searchWithoutFutility(parseFen(fen), 5).score,
        ),
      );
    }, 600_000);

    it("chooseMoveWithoutTaper against chooseMoveWithoutFutility deepened to 5: every non-mate score within 25 cp, 0 mate sign flips [deep, SEARCH_DEEP=1]", () => {
      reportAndBar(
        "chooseMoveWithoutTaper to d5",
        drift(
          (fen) => deepenTo(chooseMoveWithoutTaper, fen, 5).score,
          (fen) => deepenTo(chooseMoveWithoutFutility, fen, 5).score,
        ),
      );
    }, 600_000);
  });

  describe("A3 (b) — the same-depth mate floor on the 287 [deep, SEARCH_DEEP=1]", () => {
    it("every mate searchWithoutFutility scores at depth 5, search() scores as a mate of the same sign at depth 5 (distance reported) [deep, SEARCH_DEEP=1]", () => {
      let mates = 0;
      let longer = 0;
      let shorter = 0;
      const violations: string[] = [];
      for (const fen of MATE_CORPUS) {
        const ref = searchWithoutFutility(parseFen(fen), 5).score;
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
        `ABC-268 A3 mate floor d5: ${violations.length} of ${mates} violated; ` +
          `${longer} longer, ${shorter} shorter (a report, not a bar)`,
      );
      expect(mates).toBeGreaterThanOrEqual(100);
      expect(violations).toEqual([]);
    }, 300_000);
  });

  describe("A3 (c) — the zugzwang rows' node counts against the door, at their recorded depths (a report; the bar is src/search.null-move.test.ts's) [deep, SEARCH_DEEP=1]", () => {
    const ROWS = [
      ["zugzwang.001", "8/8/p1p5/1p5p/1P5p/8/PPP2K1p/4R1rk w - - 0 1", "e1f1", 9],
      ["zugzwang.004", "8/6B1/p5p1/Pp4kp/1P5r/5P1Q/4q1PK/8 w - - 0 32", "h3h4", 11],
      ["zugzwang.005", "8/8/1p1r1k2/p1pPN1p1/P3KnP1/1P6/8/3R4 b - - 0 1", "f4d5", 12],
      ["kpk-b6c6", "2k5/8/1K6/2P5/8/8/8/8 w - - 0 1", "b6c6", 8],
      ["kpk-c6d6", "3k4/8/2K5/3P4/8/8/8/8 w - - 0 1", "c6d6", 8],
      ["kpk-d6e6", "4k3/8/3K4/4P3/8/8/8/8 w - - 0 1", "d6e6", 8],
      ["kpk-e6f6", "5k2/8/4K3/5P2/8/8/8/8 w - - 0 1", "e6f6", 8],
    ] as const;

    for (const [name, fen, move, depth] of ROWS) {
      it(`${name}: chooseMove to ${depth} plays ${move}; nodes against chooseMoveWithoutFutility reported [deep, SEARCH_DEEP=1]`, () => {
        const head = deepenTo(chooseMove, fen, depth);
        const door = deepenTo(chooseMoveWithoutFutility, fen, depth);
        console.log(
          `ABC-268 A3 zugzwang ${name} d${depth}: head ${label(head.move)} ${head.nodes} / door ` +
            `${label(door.move)} ${door.nodes} = ${(head.nodes / door.nodes).toFixed(3)}x`,
        );
        expect(head.depth).toBe(depth);
        expect(label(head.move)).toBe(move);
      }, 300_000);
    }
  });

  describe("A4 (a) — at depth 8 on kiwipete and position-6, nodes <= 0.88x the door's in both recursions [deep, SEARCH_DEEP=1]", () => {
    for (const name of ["kiwipete", "position-6"]) {
      it(`${name}: searchWithoutTaper at depth 8 [deep, SEARCH_DEEP=1]`, () => {
        const head = searchWithoutTaper(parseFen(fenOf(name)), 8);
        const door = searchWithoutFutility(parseFen(fenOf(name)), 8);
        console.log(
          `ABC-268 A4 searchWithoutTaper ${name} d8: ${head.nodes} / ${door.nodes} = ` +
            `${(head.nodes / door.nodes).toFixed(4)}x; head ${label(head.move)} ${head.score}, ` +
            `door ${label(door.move)} ${door.score}`,
        );
        expect(head.nodes).toBeLessThanOrEqual(0.88 * door.nodes);
      }, 300_000);

      it(`${name}: chooseMoveWithoutTaper deepened to 8 on a frozen clock [deep, SEARCH_DEEP=1]`, () => {
        const head = deepenTo(chooseMoveWithoutTaper, fenOf(name), 8);
        const door = deepenTo(chooseMoveWithoutFutility, fenOf(name), 8);
        expect([head.depth, door.depth]).toEqual([8, 8]);
        console.log(
          `ABC-268 A4 chooseMoveWithoutTaper ${name} to 8: ${head.nodes} / ${door.nodes} = ` +
            `${(head.nodes / door.nodes).toFixed(4)}x; head ${label(head.move)} ${head.score}, ` +
            `door ${label(door.move)} ${door.score}`,
        );
        expect(head.nodes).toBeLessThanOrEqual(0.88 * door.nodes);
      }, 300_000);
    }
  });

  describe("A4 (b) — the mean completed depth at 47 000 nodes on the 190 is >= the door's + 0.20 ply [deep, SEARCH_DEEP=1]", () => {
    it("chooseMoveWithoutTaper against chooseMoveWithoutFutility, maxNodes 47 000, frozen clock [deep, SEARCH_DEEP=1]", () => {
      const rows = corpus();
      const reach = (choose: typeof chooseMove) =>
        rows.map(({ fen }) => {
          const choice = choose(parseFen(fen), {
            budgetMs: 1_000,
            now: () => 0,
            maxNodes: 47_000,
          }) as EngineChoice;
          return { depth: choice.depth, move: label(choice.move) };
        });
      const door = reach(chooseMoveWithoutFutility);
      const head = reach(chooseMoveWithoutTaper);
      const mean = (xs: Array<{ depth: number }>) =>
        xs.reduce((sum, x) => sum + x.depth, 0) / xs.length;
      const deeper = head.filter((x, i) => x.depth > (door[i] as { depth: number }).depth).length;
      const shallower = head.filter(
        (x, i) => x.depth < (door[i] as { depth: number }).depth,
      ).length;
      const moved = head.filter((x, i) => x.move !== (door[i] as { move: string }).move).length;
      console.log(
        `ABC-268 A4 reach at 47 000 nodes on ${rows.length}: door ${mean(door).toFixed(3)} -> head ` +
          `${mean(head).toFixed(3)} (+${(mean(head) - mean(door)).toFixed(3)}); ${deeper} deeper, ` +
          `${shallower} shallower, ${moved} root moves differ`,
      );
      expect(rows).toHaveLength(190);
      expect(mean(head)).toBeGreaterThanOrEqual(mean(door) + 0.2);
    }, 600_000);
  });
}
