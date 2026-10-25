/**
 * ABC-121 acceptance — principal-variation search and late-move reductions, `A1`-`A5`, and the
 * rows `ADR-0026` owes them. `A6` (bounded memory) adds nothing here: PVS and LMR allocate
 * nothing, and `src/transposition.test.ts`'s `A7` reads the shipped `chooseMove`.
 *
 * `ADR-0026` decision 8's identity chain has three links:
 * - `search()` ≈ `searchWithoutReductions`, BOUNDED (`A1`, below) — late-move reductions change
 *   the VALUE, so no identity survives them;
 * - `searchWithoutReductions` ≡ `searchWithoutPvsOrReductions` (the PVS identity link, below);
 * - `searchWithoutPvsOrReductions` ≡ every older door and the unpruned search — every merged row of
 *   `ABC-077`–`ABC-081`, re-pointed at the pre-`ABC-121` doors.
 *
 * `A3` stands before `A1` and `A2` (test note 1). THE BOUNDED ORACLE IS A REGRESSION NET, NOT A
 * PROOF OF THE RULE (`ADR-0026` decision 9): the review planted six wrong LMRs and the drift bars
 * alone missed three. The rule is guarded row by row: `A3`'s table reds `tactical`, `early` and
 * `r2`; `A4` reds `noLmrResearch` and `noResearch`; the depth-5 drift reds `noResearch`, `early`
 * and PVS window bugs; the mate floor reds `r2` and PVS window bugs.
 *
 * THE CORPUS is the ruling's 190 positions (`.grugops/context/ruling-abc121-lmr-oracle/probe/`):
 * the six perft roots, every in-progress position one legal move from each, and `ABC-078`'s six
 * endgames. THE MATE CORPUS is `src/search.mate-corpus.ts` (287 positions, frozen).
 *
 * LANES (`N8-LANE`, measured at this build, plain node, reported in the ticket's context notes):
 * the depth-4 PVS identity pass (21 s), the depth-5 drift in both recursions (54 s fixed), the mate
 * floor (1 s + 4 s), and the depth-7 clock-free companion run under `SEARCH_DEEP=1`; `A2`'s
 * wall-clock reading runs under `ENGINE_DEEP=1`. The default lane holds `A3`, `A4`, `A5`'s
 * position-3 guard, the corpus pins, the one-position PVS identity guard and the two door bites;
 * every planted variant stays red in it (the `N8-LANE` re-hop's default-lane ledger). The mate
 * floor has no default-lane row: its seven-seed subset reddened nothing no other default row did.
 * Unset, the deep cases are NOT DEFINED rather than skipped, so the gate's skip count stays 0.
 */

import { readFileSync } from "node:fs";
import { loadavg } from "node:os";
import { afterEach, describe, expect, it, vi } from "vitest";
import { makeMove, unmakeMove } from "./apply.ts";
import {
  chooseMove,
  chooseMoveWithoutPvsOrReductions,
  chooseMoveWithoutReductions,
  DEFAULT_BUDGET_MS,
  type EngineChoice,
} from "./engine.ts";
import { parseFen, toFen } from "./fen.ts";
import { gameStatus } from "./gameend.ts";
import { isInCheck, legalMoves } from "./legal.ts";
import type { Move } from "./moves.ts";
import { EMPTY, KNIGHT, type Position, squareName } from "./position.ts";
import { MATE_CORPUS, MATE_CORPUS_SEEDS } from "./search.mate-corpus.ts";
import {
  lateMoveReduction,
  MATE_SCORE,
  search,
  searchWithoutPvsOrReductions,
  searchWithoutReductions,
} from "./search.ts";
import { BOUND_UPPER } from "./transposition.ts";

const RUN_DEEP = process.env.SEARCH_DEEP === "1";
const RUN_ENGINE_DEEP = process.env.ENGINE_DEEP === "1";

/**
 * THE INSTRUMENT, the same shape as `src/transposition.test.ts`'s: `storeEntry` and `boundOf` are
 * wrapped so a test can see every node a search stores — its key, depth, ply, bound, and the window
 * `(alphaIn, beta)` it was entered with (`boundOf` is called with exactly that, as `storeEntry`'s
 * argument) — and can stop `chooseMove` the moment a chosen iteration completes. With `trace.on`
 * false and no `onRootStore`, every call is the real one. Both recursions import both functions from
 * `./transposition.ts`, so both are observed.
 */
const trace = vi.hoisted(() => ({
  on: false,
  window: [0, 0] as [number, number],
  stores: [] as Array<{
    key: bigint;
    depth: number;
    ply: number;
    bound: number;
    alphaIn: number;
    beta: number;
  }>,
  /** Called with the depth of every ROOT store: one per completed iteration or search. */
  onRootStore: null as ((depth: number) => void) | null,
}));
vi.mock("./transposition.ts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./transposition.ts")>();
  return {
    ...actual,
    boundOf: (best: number, alphaIn: number, beta: number) => {
      trace.window = [alphaIn, beta];
      return actual.boundOf(best, alphaIn, beta);
    },
    storeEntry: (...args: Parameters<typeof actual.storeEntry>) => {
      const [key, depth, bound, , ply] = args;
      if (ply === 0) trace.onRootStore?.(depth);
      else if (trace.on) {
        const [alphaIn, beta] = trace.window;
        trace.stores.push({ key, depth, ply, bound, alphaIn, beta });
      }
      actual.storeEntry(...args);
    },
  };
});

afterEach(() => {
  trace.on = false;
  trace.stores = [];
  trace.onRootStore = null;
});

/**
 * `choose` (one of `chooseMove`'s three shapes) run until iteration `depth` COMPLETES and not a node
 * further — `src/transposition.test.ts`'s `deepenTo`: the clock reads 0 until the root of iteration
 * `depth` is stored, then far past any deadline. Clock-free, so the same on every machine.
 */
function deepenTo(
  choose: typeof chooseMove,
  position: Position,
  depth: number,
): { score: number; move: Move; nodes: number; depth: number } {
  let done = false;
  trace.onRootStore = (stored) => {
    if (stored === depth) done = true;
  };
  const choice = choose(position, {
    budgetMs: 1_000,
    now: () => (done ? Number.MAX_SAFE_INTEGER : 0),
  }) as EngineChoice;
  trace.onRootStore = null;
  return choice;
}

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

/** The ruling's 190: each root, then its in-progress children in generation order; then the endgames. */
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

/** Every position whose two scores differ at `depth`, as a readable line. */
function pvsDivergences(positions: ReadonlyArray<{ name: string; fen: string }>, depth: number) {
  const out: string[] = [];
  for (const { name, fen } of positions) {
    const pvs = searchWithoutReductions(parseFen(fen), depth).score;
    const base = searchWithoutPvsOrReductions(parseFen(fen), depth).score;
    if (pvs !== base) out.push(`${name}: ${pvs} with PVS, ${base} without`);
  }
  return out;
}

// ---------------------------------------------------------------------------
// The PVS identity link (`ADR-0026` decision 8): PVS changes the WORK and not the VALUE.
// ---------------------------------------------------------------------------

describe("PVS identity — searchWithoutReductions scores what searchWithoutPvsOrReductions scores", () => {
  it("the corpus is the ruling's 190 positions", () => {
    expect(corpus()).toHaveLength(190);
  });

  /**
   * kp-vs-k is the one position of the former seven-position guard (the six endgames and
   * position-3, all in the 190 below) on which a REDUCING `searchWithoutReductions` scores apart
   * from `searchWithoutPvsOrReductions` (130 against 110), so it alone reds mutant
   * `door-withoutReductions-reduces`. The other six moved to the deep lane at the `N8-LANE` re-hop.
   */
  it("kp-vs-k at depth 4 — the default lane's standing guard", () => {
    const positions = ENDGAMES.filter(({ name }) => name === "kp-vs-k");
    expect(positions).toHaveLength(1);
    expect(pvsDivergences(positions, 4)).toEqual([]);
  });

  it("the default-lane guard bites: PVS really does change the work at depth 4", () => {
    // Identity of the scores means nothing if the two doors are one search. Position-3 at depth 4.
    const fen = (ROOTS[2] as { fen: string }).fen;
    expect(searchWithoutReductions(parseFen(fen), 4).nodes).not.toBe(
      searchWithoutPvsOrReductions(parseFen(fen), 4).nodes,
    );
  });

  /**
   * The ENGINE'S reference is really unreduced. Without this, `chooseMoveWithoutReductions` wired to
   * reduce is `chooseMove` itself, and the engine drift and `A4`'s engine row compare it with itself
   * and stay green (mutant `engine-door-withoutReductions-reduces` survived every lane before this
   * row). kp-vs-k deepened to depth 6: the reference scores what the pre-`ABC-121` engine scores,
   * and spends a different number of nodes from `chooseMove`.
   */
  it("the engine doors bite: chooseMoveWithoutReductions is the unreduced engine, not chooseMove", () => {
    const fen = (ENDGAMES.find(({ name }) => name === "kp-vs-k") as { fen: string }).fen;
    const shipped = deepenTo(chooseMove, parseFen(fen), 6);
    const unreduced = deepenTo(chooseMoveWithoutReductions, parseFen(fen), 6);
    const pre = deepenTo(chooseMoveWithoutPvsOrReductions, parseFen(fen), 6);
    expect(unreduced.score).toBe(pre.score);
    expect(unreduced.nodes).not.toBe(shipped.nodes);
  });

  if (RUN_DEEP) {
    it("all 190 positions at depth 4 [deep, SEARCH_DEEP=1]", () => {
      expect(pvsDivergences(corpus(), 4)).toEqual([]);
    }, 300_000);
  }
});

// ---------------------------------------------------------------------------
// A3 — the reduction rule is ONE pure predicate, it never reduces a move that must be searched at
// full depth, and both recursions subtract exactly what it returns. Written before A1/A2 (test
// note 1): a reduction applied where it must not be is a silent tactical-strength bug that node
// counts and drift percentages can both miss.
// ---------------------------------------------------------------------------

/** Long algebraic; a promotion appends its piece type (`KNIGHT` is 2, so b7-b8=N is "b7b82"). */
const label = (move: Move): string =>
  `${squareName(move.from)}${squareName(move.to)}${move.promotion === EMPTY ? "" : move.promotion}`;

/** The legal move `name` (long algebraic, promotion piece appended) of `fen`, on a fresh board. */
function moveOf(fen: string, name: string): { position: ReturnType<typeof parseFen>; move: Move } {
  const position = parseFen(fen);
  const move = legalMoves(position).find((candidate) => label(candidate) === name);
  if (move === undefined) throw new Error(`${name} is not a legal move of ${fen}`);
  return { position, move };
}

describe("A3 — lateMoveReduction: one ply for a late quiet move, and never for a move that must be searched", () => {
  /**
   * White to move, not in check: Kh1 is quiet and gives no check; Rxa5 captures; Re1+ checks the
   * king on e8 along the open e-file; b8=N promotes (to a knight, which does NOT check e8, so the
   * row isolates the promotion).
   */
  const ALL_KINDS = "4k3/1P6/8/p7/8/8/8/R5K1 w - - 0 1";
  /** White to move IN CHECK from the rook on e1; Kg2 is quiet and gives no check. */
  const IN_CHECK = "4k3/8/8/8/8/8/8/4r1K1 w - - 0 1";

  const TABLE: ReadonlyArray<{
    why: string;
    fen: string;
    move: string;
    depth: number;
    index: number;
    root: boolean;
    plies: number;
  }> = [
    {
      why: "the allowed case, at the thresholds",
      fen: ALL_KINDS,
      move: "g1h1",
      depth: 3,
      index: 3,
      root: false,
      plies: 1,
    },
    {
      why: "the allowed case, far above them — still exactly one ply",
      fen: ALL_KINDS,
      move: "g1h1",
      depth: 9,
      index: 30,
      root: false,
      plies: 1,
    },
    { why: "a capture", fen: ALL_KINDS, move: "a1a5", depth: 9, index: 30, root: false, plies: 0 },
    {
      why: "a promotion",
      fen: ALL_KINDS,
      move: "b7b82",
      depth: 9,
      index: 30,
      root: false,
      plies: 0,
    },
    {
      why: "a checking move",
      fen: ALL_KINDS,
      move: "a1e1",
      depth: 9,
      index: 30,
      root: false,
      plies: 0,
    },
    {
      why: "a move made while in check",
      fen: IN_CHECK,
      move: "g1g2",
      depth: 9,
      index: 30,
      root: false,
      plies: 0,
    },
    {
      why: "move index 2, below 3",
      fen: ALL_KINDS,
      move: "g1h1",
      depth: 9,
      index: 2,
      root: false,
      plies: 0,
    },
    {
      why: "remaining depth 2, below 3",
      fen: ALL_KINDS,
      move: "g1h1",
      depth: 2,
      index: 30,
      root: false,
      plies: 0,
    },
    { why: "the root", fen: ALL_KINDS, move: "g1h1", depth: 9, index: 30, root: true, plies: 0 },
  ];

  for (const { why, fen, move: name, depth, index, root, plies } of TABLE) {
    it(`${why}: ${name} at depth ${depth}, index ${index}${root ? ", root" : ""} -> ${plies}`, () => {
      const { position, move } = moveOf(fen, name);
      const before = toFen(position);
      expect(lateMoveReduction(position, move, depth, index, root)).toBe(plies);
      expect(toFen(position)).toBe(before); // pure: the board it was handed is unchanged
    });
  }

  it("the fixtures bite: each row's move really is what the row says it is", () => {
    // Each 0 above must be the predicate's own classification, so each fixture must really be
    // what its row says. The check facts are read here with the move made, not assumed.
    const givesCheck = (fen: string, name: string): boolean => {
      const { position, move } = moveOf(fen, name);
      makeMove(position, move);
      return isInCheck(position);
    };
    expect(givesCheck(ALL_KINDS, "a1e1")).toBe(true);
    expect(givesCheck(ALL_KINDS, "g1h1")).toBe(false);
    expect(givesCheck(ALL_KINDS, "b7b82")).toBe(false);
    expect(moveOf(ALL_KINDS, "b7b82").move.promotion).toBe(KNIGHT);
    expect(moveOf(ALL_KINDS, "a1a5").move.captured).not.toBe(EMPTY);
    expect(isInCheck(parseFen(ALL_KINDS))).toBe(false);
    expect(isInCheck(parseFen(IN_CHECK))).toBe(true);
  });
});

describe("A3 — both recursions route every reduction through the predicate, subtracting what it returns", () => {
  const MODULES = [
    { path: "./search.ts", depth: "depth" },
    { path: "./engine.ts", depth: "remaining" },
  ];

  for (const { path, depth } of MODULES) {
    it(`${path}: calls lateMoveReduction and subtracts its value, never a literal`, () => {
      const source = readFileSync(new URL(path, import.meta.url), "utf8");
      expect(source.length, path).toBeGreaterThan(1000); // the module, not nothing
      // Where the reduction comes from: the predicate, at the root and below, and nowhere else.
      const assigned = source.match(/const reduction = [^;]+;/g) ?? [];
      expect(assigned.length, path).toBeGreaterThanOrEqual(2);
      for (const line of assigned) expect(line, path).toMatch(/lateMoveReduction\(/);
      // What is done with it: subtracted from the ply step, exactly once.
      expect(source, path).toContain(`${depth} - 1 - reduction`);
      // No reduction spelt as a literal: the child depth is the node's minus 1, or minus the value.
      // Code only — Biome spaces a binary minus, and prose such as "depth-3" does not.
      expect(source, path).not.toMatch(new RegExp(`${depth} - (?:[2-9]|1 - [1-9])`));
    });
  }
});

// ---------------------------------------------------------------------------
// A4 — a fail-high re-search actually happens, at a NULL-WINDOW node, and is correct.
// ---------------------------------------------------------------------------

/**
 * `A4`'s position, CONSTRUCTED rather than found (test note 2): generated from `position-3` and its
 * neighbours, then kept only where the ruling's own reference recursion said a build without the
 * reduced-move re-search goes WRONG and the correct rule does not
 * (`.grugops/context/ticket-to-pr-ABC-121/probe/a4scan.ts`, `a4engine.ts`). position-3 after
 * 1. Rb1, black to move. At depth 4, fixed and deepened alike, PVS alone and the correct PVS+LMR
 * both read 95 with h5e5; `noLmrResearch` and `noResearch` both read 30 with d6d5.
 *
 * RE-FOUND at `ABC-083` for BOTH rows (king safety and mobility, an evaluator change). On the old
 * position the deepened shape no longer bites `noLmrResearch` (both read 68 / h5e5), nor does the
 * `search()` fixture below in either shape (40 / b1c1 throughout). The same probes, re-run on the
 * build (`.grugops/context/ticket-to-pr-ABC-083/probe/a4scan-branch-d4.jsonl`, 467 positions, 8
 * hits; `a4engine-branch-d4.jsonl` for both shapes), found this one, which bites both variants in
 * BOTH shapes: position-3 after 1. Rb3 Rd5, white to move. At depth 4, fixed and deepened alike,
 * PVS alone and the correct PVS+LMR read 19 with b3f3; `noLmrResearch` and `noResearch` read 8
 * with b3h3. One position now serves both rows.
 *
 * RE-FOUND at `ABC-215` for the `chooseMove` row (the evaluation values made by rule; `ADR-0028`
 * decision 2). On 1. Rb3 Rd5 the deepened shape no longer re-searches a reduced fail-high at a
 * null-window node (0 re-searches), and in the reference recursion no variant goes wrong there.
 * The same probes, re-run on base and build (467 positions; `a4scan.ts` with the deepened shape,
 * 1 hit on the build), found this one: position-3 after 1. Rb3 Rc5, white to move. Deepened to
 * depth 4, PVS alone and the correct PVS+LMR read −7 with b3f3; `noLmrResearch` and `noResearch`
 * read −12 with b3h3. It does not bite at fixed depth, so the `search()` row keeps 1. Rb3 Rd5
 * (below).
 *
 * RE-PINNED at `ABC-207` (mobility weighted per piece, the early-queen term) for the `chooseMove`
 * row: on 1. Rb3 Rc5 the deepened shape still re-searches a reduced fail-high at a null-window
 * node, and the answer still equals the unreduced one. The pin −7 / b3f3 became −12 / b3h3.
 */
const A4_FEN = "8/2p5/3p4/KPr5/5p1k/1R6/4P1P1/8 w - - 2 2";
const A4_DEPTH = 4;

/**
 * RE-FOUND at `ABC-082` for the `search()` row only. The pawn-structure term moved the tree: at
 * fixed depth 4 on `A4_FEN`, `noLmrResearch` now reads the correct 95 / h5e5 (`noResearch` still
 * reads 50 / d6d5), so the fixed shape no longer needs the reduced-move re-search to be right there.
 * The deepened shape still does (both variants read 50 / d6d5), so `A4_FEN` keeps the `chooseMove`
 * row. The same probe (`a4scan.ts` at depth 4, 467 positions, 4 hits; `a4engine.ts` for both shapes)
 * found no position that bites both variants in BOTH shapes on this build. This one, position-3
 * after 1. Rb1 Rh6, white to move, bites both at fixed depth 4: the correct rule and PVS alone read
 * 10 with b1c1, and `noLmrResearch` and `noResearch` both read −20 with b1b4.
 * Superseded at `ABC-083`: that position bites neither variant on the build, and `A4_FEN`'s new
 * position bites both in both shapes (its docblock), so the `search()` row reads it too.
 *
 * RE-PINNED at `ABC-215` (the evaluation values made by rule): `A4_FEN` moved for the `chooseMove`
 * row (its docblock), and this row keeps `ABC-083`'s position, position-3 after 1. Rb3 Rd5. At
 * fixed depth 4 it still re-searches a reduced fail-high at a null-window node and still bites
 * both variants: PVS alone and the correct PVS+LMR read 4 with b3f3 (19 on base), and
 * `noLmrResearch` and `noResearch` read 0 with b3c3.
 *
 * RE-FOUND at `ABC-207` (mobility weighted per piece, the early-queen term; `ADR-0028` decision 2)
 * for the `search()` row. On 1. Rb3 Rd5 the premise is lost: `search()` reads 10, the unreduced
 * reference 2. The same probe (`a4scan.ts` at fixed depth 4, 467 positions, 2 hits on the build)
 * found this one: position-3 after 1. Rb3 Kg5, white to move. At fixed depth 4, PVS alone and the
 * correct PVS+LMR read −1 with b3c3; `noLmrResearch` and `noResearch` read −12 with g2g3.
 */
const A4_SEARCH_FEN = "8/2p5/3p4/KP4kr/5p2/1R6/4P1P1/8 w - - 2 2";

type Store = (typeof trace.stores)[number];

/**
 * Every LMR re-search the trace shows at a NULL-WINDOW parent: a child stored with an UPPER bound
 * (it failed low, so its parent's REDUCED search failed high), then the same child at the same ply
 * one ply DEEPER with the same null window (the full-depth re-search), with no store at the
 * parent's ply between them; and the parent's own store, the next at its ply, entered with
 * `beta - alpha === 1`.
 */
function nullWindowReSearches(stores: readonly Store[]): string[] {
  const found: string[] = [];
  for (let i = 0; i < stores.length; i++) {
    const reduced = stores[i] as Store;
    if (reduced.bound !== BOUND_UPPER || reduced.beta - reduced.alphaIn !== 1) continue;
    for (let j = i + 1; j < stores.length; j++) {
      const next = stores[j] as Store;
      if (next.ply < reduced.ply) break; // the parent finished: no re-search of this child
      if (next.ply !== reduced.ply || next.key !== reduced.key) continue;
      if (next.depth !== reduced.depth + 1 || next.alphaIn !== reduced.alphaIn) break;
      const parent = stores.slice(j + 1).find((store) => store.ply < reduced.ply);
      if (parent?.ply === reduced.ply - 1 && parent.beta - parent.alphaIn === 1) {
        found.push(
          `ply ${parent.ply} depth ${parent.depth}: child re-searched ${reduced.depth} -> ${next.depth}`,
        );
      }
      break;
    }
  }
  return found;
}

describe("A4 — the reduced move fails high at a null-window node, is re-searched at full depth, and the answer is the unreduced one", () => {
  it("search(): a null-window reduced fail-high is re-searched, and score and move equal searchWithoutReductions", () => {
    trace.on = true;
    const shipped = search(parseFen(A4_SEARCH_FEN), A4_DEPTH);
    trace.on = false;
    const reSearches = nullWindowReSearches(trace.stores);
    const reference = searchWithoutReductions(parseFen(A4_SEARCH_FEN), A4_DEPTH);

    expect(
      reSearches.length,
      "no reduced fail-high was re-searched at a null-window node",
    ).toBeGreaterThan(0);
    expect(shipped.score).toBe(reference.score);
    expect(label(shipped.move as Move)).toBe(label(reference.move as Move));
    expect([shipped.score, label(shipped.move as Move)]).toEqual([-1, "b3c3"]);
  });

  it("chooseMove(): the same, deepened to depth 4 in the engine's own recursion", () => {
    trace.on = true;
    const shipped = deepenTo(chooseMove, parseFen(A4_FEN), A4_DEPTH);
    trace.on = false;
    const reSearches = nullWindowReSearches(trace.stores);
    const reference = deepenTo(chooseMoveWithoutReductions, parseFen(A4_FEN), A4_DEPTH);

    expect(shipped.depth).toBe(A4_DEPTH);
    expect(
      reSearches.length,
      "no reduced fail-high was re-searched at a null-window node",
    ).toBeGreaterThan(0);
    expect(shipped.score).toBe(reference.score);
    expect(label(shipped.move)).toBe(label(reference.move));
    expect([shipped.score, label(shipped.move)]).toEqual([-12, "b3h3"]);
  });
});

// ---------------------------------------------------------------------------
// A5 — the node count falls on the two NAMED positions (not "every position": position-4 grows).
// ---------------------------------------------------------------------------

describe("A5 — search() visits fewer nodes than searchWithoutPvsOrReductions at depth 4", () => {
  /** `search()` nodes and `searchWithoutPvsOrReductions` nodes at depth 4, printed. */
  const nodesAtDepth4 = (fen: string, name: string): { shipped: number; pre: number } => {
    const shipped = search(parseFen(fen), 4).nodes;
    const pre = searchWithoutPvsOrReductions(parseFen(fen), 4).nodes;
    console.log(
      `ABC-121 A5 ${name} d4: ${shipped} / ${pre} = ${((100 * shipped) / pre).toFixed(1)}%`,
    );
    return { shipped, pre };
  };

  /**
   * The DEFAULT lane's standing guard, not the criterion: position-3 at depth 4, measured at this
   * build at 758 / 1 123 nodes. The criterion's two positions cost ~1.3 s here under the runner and
   * run under `SEARCH_DEEP=1`. PVS alone also saves nodes, so this is the "it does something" check
   * only; `A4` is what proves the reduction is right.
   */
  it("position-3 at depth 4 — the default lane's standing guard", () => {
    const { shipped, pre } = nodesAtDepth4((ROOTS[2] as { fen: string }).fen, "position-3");
    expect(shipped).toBeLessThan(pre);
  });

  if (RUN_DEEP) {
    // Measured at this build: kiwipete 17 911 / 22 323 = 80.2%, position-6 20 402 / 28 829 =
    // 70.8% — the ticket's figures. Position-4 is the named counter-case and is NOT asserted.
    for (const name of ["kiwipete", "position-6"]) {
      it(`${name} at depth 4 — the criterion's own positions [deep, SEARCH_DEEP=1]`, () => {
        const fen = (ROOTS.find((root) => root.name === name) as { fen: string }).fen;
        const { shipped, pre } = nodesAtDepth4(fen, name);
        expect(shipped).toBeLessThan(pre);
      }, 60_000);
    }
  }
});

// ---------------------------------------------------------------------------
// A1 — game quality does not regress: BOUNDED drift at depth 5 in both recursions, and a
// one-extra-ply mate floor on the mate-rich corpus. A regression net, not a proof (header).
// ---------------------------------------------------------------------------

interface Drift {
  readonly compared: number;
  readonly within25: number;
  readonly max: number;
  /** Mate <-> no mate, or sign, on the 190 — a REPORT, never a bar (`ADR-0026` decision 9). */
  readonly mateFlips: number;
  readonly worst: string;
}

/** `A1`'s bars over `positions`, reading `on` against `reference` per position. */
function drift(
  positions: ReadonlyArray<{ name: string; fen: string }>,
  on: (fen: string) => number,
  reference: (fen: string) => number,
): Drift {
  const deltas: Array<[number, string]> = [];
  let mateFlips = 0;
  for (const { name, fen } of positions) {
    const ref = reference(fen);
    const got = on(fen);
    if (isMate(ref) || isMate(got)) {
      if (isMate(ref) !== isMate(got) || Math.sign(ref) !== Math.sign(got)) mateFlips++;
      continue;
    }
    deltas.push([Math.abs(got - ref), `${name}: ${ref} -> ${got}`]);
  }
  deltas.sort((a, b) => b[0] - a[0]);
  const within = deltas.filter(([delta]) => delta <= 25).length;
  return {
    compared: deltas.length,
    within25: within / deltas.length,
    max: deltas[0]?.[0] ?? 0,
    mateFlips,
    worst: deltas[0]?.[1] ?? "",
  };
}

function reportAndBar(what: string, result: Drift): void {
  console.log(
    `ABC-121 A1 ${what}: ${(100 * result.within25).toFixed(2)}% within 25 cp of ` +
      `${result.compared}, max ${result.max} cp (${result.worst}); mate-status flips on the 190: ` +
      `${result.mateFlips} (a report, not a bar)`,
  );
  expect(result.compared).toBeGreaterThanOrEqual(100);
  expect(result.within25).toBeGreaterThanOrEqual(0.95);
  expect(result.max).toBeLessThanOrEqual(75);
}

/** Every mate-floor violation: a reference mate at `depth` that `search()` at `depth + 1` loses or lengthens. */
function mateFloor(
  fens: readonly string[],
  depth: number,
): { mates: number; violations: string[] } {
  let mates = 0;
  const violations: string[] = [];
  for (const fen of fens) {
    const ref = searchWithoutReductions(parseFen(fen), depth).score;
    if (!isMate(ref)) continue;
    mates++;
    const got = search(parseFen(fen), depth + 1).score;
    // Same sign, and no longer: a mate n plies away reads MATE_SCORE - n, so "no longer" is |got| >= |ref|.
    if (!isMate(got) || Math.sign(got) !== Math.sign(ref) || Math.abs(got) < Math.abs(ref)) {
      violations.push(`${fen}: ${ref} at depth ${depth}, ${got} at depth ${depth + 1}`);
    }
  }
  return { mates, violations };
}

describe("A1 — the mate-rich corpus is frozen, and the mate floor holds one ply deeper", () => {
  it("src/search.mate-corpus.ts holds 287 positions, the seven seeds among them — the length pin", () => {
    expect(MATE_CORPUS).toHaveLength(287);
    expect(new Set(MATE_CORPUS).size).toBe(287);
    for (const seed of MATE_CORPUS_SEEDS) expect(MATE_CORPUS).toContain(seed);
  });

  if (RUN_DEEP) {
    /**
     * Deep since the `N8-LANE` re-hop: in the default lane it reddened no planted variant that
     * another default row does not (only `no-unmake-in-predicate`, which `A3` reds), and never
     * `r2` — the 287 below is what reds that.
     */
    it("the seven seeds at depth 4 [deep, SEARCH_DEEP=1]", () => {
      const { mates, violations } = mateFloor(MATE_CORPUS_SEEDS, 4);
      expect(mates).toBeGreaterThanOrEqual(3); // not vacuous: the three mate-row seeds are mates at 4
      expect(violations).toEqual([]);
    });

    it("all 287: every mate searchWithoutReductions sees at depth 4, search() sees at depth 5, same sign, no longer [deep, SEARCH_DEEP=1]", () => {
      const { mates, violations } = mateFloor(MATE_CORPUS, 4);
      console.log(`ABC-121 A1 mate floor d4 -> d5: ${violations.length} of ${mates} violated`);
      expect(mates).toBeGreaterThanOrEqual(100);
      expect(violations).toEqual([]);
    }, 120_000);
  }
});

if (RUN_DEEP) {
  describe("A1 — bounded drift, search() against searchWithoutReductions and chooseMove against chooseMoveWithoutReductions [deep, SEARCH_DEEP=1]", () => {
    it("search() at fixed depth 5 on the 190: >= 95% within 25 cp, none beyond 75 cp [deep, SEARCH_DEEP=1]", () => {
      reportAndBar(
        "search() d5",
        drift(
          corpus(),
          (fen) => search(parseFen(fen), 5).score,
          (fen) => searchWithoutReductions(parseFen(fen), 5).score,
        ),
      );
    }, 600_000);

    it("chooseMove iterated to depth 5 on the 190: >= 95% within 25 cp, none beyond 75 cp [deep, SEARCH_DEEP=1]", () => {
      reportAndBar(
        "chooseMove to d5",
        drift(
          corpus(),
          (fen) => deepenTo(chooseMove, parseFen(fen), 5).score,
          (fen) => deepenTo(chooseMoveWithoutReductions, parseFen(fen), 5).score,
        ),
      );
    }, 600_000);
  });
}

// ---------------------------------------------------------------------------
// A2 — depth gained in budget. The binding reading is plain node (NFR-005's runner), taken by the
// build's node script and reported in the context notes; these are the suite's readings.
// ---------------------------------------------------------------------------

if (RUN_DEEP) {
  describe("A2 — the clock-free companion: cumulative deepening nodes to depth 7 [deep, SEARCH_DEEP=1]", () => {
    for (const name of ["kiwipete", "position-6"]) {
      it(`${name}: chooseMove reaches depth 7 in fewer nodes than chooseMoveWithoutPvsOrReductions [deep, SEARCH_DEEP=1]`, () => {
        const fen = (ROOTS.find((root) => root.name === name) as { fen: string }).fen;
        const shipped = deepenTo(chooseMove, parseFen(fen), 7);
        const pre = deepenTo(chooseMoveWithoutPvsOrReductions, parseFen(fen), 7);
        console.log(
          `ABC-121 A2 ${name}: cumulative nodes to depth 7 ${shipped.nodes} (chooseMove) vs ` +
            `${pre.nodes} (chooseMoveWithoutPvsOrReductions)`,
        );
        expect(shipped.depth).toBe(7);
        expect(pre.depth).toBe(7);
        expect(shipped.nodes).toBeLessThan(pre.nodes);
      }, 300_000);
    }
  });
}

if (RUN_ENGINE_DEEP) {
  describe("A2 — depth completed in the default budget on a real clock, REPORTED [deep, ENGINE_DEEP=1]", () => {
    it("kiwipete and position-6, this build vs the pre-ABC-121 engine, three rounds, with load [deep, ENGINE_DEEP=1]", () => {
      for (let round = 1; round <= 3; round++) {
        for (const name of ["kiwipete", "position-6"]) {
          const fen = (ROOTS.find((root) => root.name === name) as { fen: string }).fen;
          for (const [door, choose] of [
            ["chooseMove", chooseMove],
            ["chooseMoveWithoutPvsOrReductions", chooseMoveWithoutPvsOrReductions],
          ] as const) {
            const load = loadavg()[0]?.toFixed(2);
            const choice = choose(parseFen(fen), { budgetMs: DEFAULT_BUDGET_MS }) as EngineChoice;
            console.log(
              `ABC-121 A2 round ${round} ${name} ${door}: depth ${choice.depth}, ` +
                `${choice.nodes} nodes, ${choice.elapsedMs} ms, load1 ${load}`,
            );
            expect(choice.depth).toBeGreaterThanOrEqual(1); // a measurement, not a verdict
          }
        }
      }
    }, 120_000);
  });
}
