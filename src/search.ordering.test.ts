/**
 * ABC-080 acceptance — move ordering (MVV-LVA, killers, hash move first), criteria `A1`-`A7`.
 *
 * `A2` (the ordered list is a permutation, not a filter) is written FIRST and stands first
 * below, per the ticket's test note 1: every catastrophic ordering bug is a lost or duplicated
 * move, and `A1` at a shallow depth can miss it.
 *
 * TWO LANES, on the `SEARCH_DEEP` precedent (`N8-LANE`). The unordered search is the expensive
 * side of every comparison here — kiwipete at depth 4 is 990 122 nodes unordered, ~3.4 s — so
 * the criteria's own positions and depths run under `SEARCH_DEEP=1`, and the default lane holds
 * the cheap standing guard for each criterion. Unset, the deep cases are NOT DEFINED rather than
 * skipped, so the gate's skip count stays 0.
 *
 * `A7` (depth in a 3 s budget, against the pre-ordering build in the same process) is a
 * wall-clock measurement of TWO builds and cannot be a test in this tree, which holds only one
 * of them. It is measured by a node script beside this ticket's context notes, and reported.
 * `ENGINE_DEEP=1`'s `NFR-005` case prints this build's side of it.
 */

import { afterEach, describe, expect, it, vi } from "vitest";
import { makeMove, unmakeMove } from "./apply.ts";
import { chooseMove } from "./engine.ts";
import { parseFen, toFen } from "./fen.ts";
import { gameStatus } from "./gameend.ts";
import { legalMoves } from "./legal.ts";
import type { Move } from "./moves.ts";
import { EMPTY, type Position, squareName } from "./position.ts";
import {
  KillerTable,
  orderMoves,
  search,
  searchWithoutKillers,
  searchWithoutOrdering,
  searchWithoutTable,
} from "./search.ts";

const RUN_DEEP = process.env.SEARCH_DEEP === "1";

/**
 * `A6`'s instrument: how many moves are made and not yet unmade — which, at a full-width node,
 * IS that node's ply. Both recursions import `makeMove`/`unmakeMove` from `./apply.ts`, so
 * wrapping them here lets the test know the ply a killer is really offered at, rather than
 * trusting the argument the code passes. The wrap only counts; every move is still the real one.
 */
const made = vi.hoisted(() => ({ outstanding: 0 }));
vi.mock("./apply.ts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./apply.ts")>();
  return {
    ...actual,
    makeMove: (...args: Parameters<typeof actual.makeMove>) => {
      made.outstanding++;
      return actual.makeMove(...args);
    },
    unmakeMove: (...args: Parameters<typeof actual.unmakeMove>) => {
      made.outstanding--;
      actual.unmakeMove(...args);
    },
  };
});

/** The six perft positions — `src/search.test.ts`'s corpus, same FENs. */
const PERFT_CORPUS: ReadonlyArray<{ name: string; fen: string }> = [
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

const fenOf = (name: string): string =>
  (PERFT_CORPUS.find((entry) => entry.name === name) as { fen: string }).fen;

/** Long algebraic, promotion piece included — the identity a multiset comparison needs. */
const label = (move: Move): string =>
  `${squareName(move.from)}${squareName(move.to)}${move.promotion === EMPTY ? "" : move.promotion}`;

/**
 * `ABC-079` QE's `G4` fixture: a capturing promotion (bxa8=Q, knight victim) against a queen
 * capture (Rxd5). The promotion term in `mvvLvaKey` is the only thing that orders the pawn first.
 */
const PROMOTION_CAPTURE_FEN = "n3k3/1P6/8/3q4/8/8/8/3RK3 w - - 0 1";

const isTactical = (move: Move): boolean => move.captured !== EMPTY || move.promotion !== EMPTY;

/** Every position reachable from `root` in up to `plies` legal moves, as independent objects. */
function expandFrom(name: string, root: Position, plies: number): { name: string; fen: string }[] {
  const out: { name: string; fen: string }[] = [];
  const walk = (parentName: string, parent: Position, left: number) => {
    if (left === 0) return;
    for (const move of legalMoves(parent)) {
      const undo = makeMove(parent, move);
      const childName = `${parentName}/${label(move)}`;
      out.push({ name: childName, fen: toFen(parent) });
      walk(childName, parent, left - 1);
      unmakeMove(parent, move, undo);
    }
  };
  walk(name, root, plies);
  return out;
}

/**
 * `A2`'s corpus: the six roots, every position one legal move from each, and `position-3`'s
 * second ply (`src/search.test.ts`'s sparse-endgame weighting) — capture-dense (kiwipete,
 * position-4/5/6) as well as quiet, with promotions (position-4/5).
 */
const PERMUTATION_CORPUS = [
  ...PERFT_CORPUS.flatMap(({ name, fen }) => [
    { name, fen },
    ...expandFrom(name, parseFen(fen), 1),
  ]),
  ...expandFrom("position-3", parseFen(fenOf("position-3")), 2).filter(({ name }) =>
    name.includes("/", name.indexOf("/") + 1),
  ),
].filter(({ fen }) => gameStatus(parseFen(fen)).result === "in-progress");

// ---------------------------------------------------------------------------
// A2 — the ordered list is an exact multiset permutation of legalMoves. Written first.
// ---------------------------------------------------------------------------

describe("A2 — the ordered move list is a permutation of legalMoves, not a filter", () => {
  /**
   * Three inputs per position, so each arm of the comparator is exercised with something to do:
   * no killer and no hash move (MVV-LVA alone); two killers, one legal here and one a move from
   * ANOTHER position, as a sibling's killer is; and a hash move that is legal here plus one that
   * is not. A comparator that dropped, duplicated or injected a move would show on one of them.
   */
  const variants = (fen: string): Array<{ killers: Move[]; hashMove: Move | null }> => {
    const legal = legalMoves(parseFen(fen));
    const quiet = legal.filter((move) => !isTactical(move));
    const foreign = legalMoves(parseFen(fenOf("position-3")))[0] as Move;
    const middle = legal[legal.length >> 1] as Move;
    return [
      { killers: [], hashMove: null },
      { killers: [quiet[quiet.length - 1] ?? middle, foreign], hashMove: null },
      { killers: [quiet[0] ?? middle], hashMove: middle },
      { killers: [], hashMove: foreign },
    ];
  };

  it("covers 200+ positions — the denominator, asserted rather than trusted", () => {
    expect(PERMUTATION_CORPUS.length).toBeGreaterThanOrEqual(200);
    expect(new Set(PERMUTATION_CORPUS.map(({ name }) => name)).size).toBe(
      PERMUTATION_CORPUS.length,
    );
  });

  it("returns the same moves, each exactly once, in every position and every variant", () => {
    const failures: string[] = [];
    for (const { name, fen } of PERMUTATION_CORPUS) {
      const legal = legalMoves(parseFen(fen));
      const expected = legal.map(label).sort();
      for (const [index, { killers, hashMove }] of variants(fen).entries()) {
        const ordered = orderMoves(legal, killers, hashMove);
        const actual = ordered.map(label).sort();
        if (ordered.length !== legal.length || actual.join() !== expected.join()) {
          failures.push(`${name} variant ${index}: ${ordered.length} of ${legal.length}`);
        }
        // Not a copy of a move, the move itself: the recursion makes what it is handed.
        if (!ordered.every((move) => legal.includes(move)))
          failures.push(`${name}: foreign object`);
      }
    }
    expect(failures).toEqual([]);
  });

  it("does not reorder or mutate the list it was handed", () => {
    const legal = legalMoves(parseFen(fenOf("kiwipete")));
    const before = legal.map(label);
    orderMoves(legal, [], null);
    expect(legal.map(label)).toEqual(before);
  });
});

// ---------------------------------------------------------------------------
// The comparator's arms — the logic beneath A3/A4, one arm per case.
// ---------------------------------------------------------------------------

describe("the comparator — hash move, then MVV-LVA, then killers, then generation order", () => {
  const kiwipete = () => legalMoves(parseFen(fenOf("kiwipete")));

  it("puts every capture and promotion ahead of every quiet move, most valuable victim first", () => {
    const ordered = orderMoves(kiwipete(), [], null);
    const firstQuiet = ordered.findIndex((move) => !isTactical(move));
    expect(firstQuiet).toBeGreaterThan(0);
    expect(ordered.slice(firstQuiet).every((move) => !isTactical(move))).toBe(true);
    // Victim value never increases down the capture list (kiwipete has no promotion to add).
    const victims = ordered.slice(0, firstQuiet).map((move) => move.captured & 7);
    const value = [0, 100, 320, 330, 500, 900, 0];
    for (let i = 1; i < victims.length; i++) {
      expect(value[victims[i] as number]).toBeLessThanOrEqual(
        value[victims[i - 1] as number] as number,
      );
    }
  });

  it("keeps generation order among quiet moves with no killer — the sort is stable", () => {
    const legal = kiwipete();
    const quietInOrder = legal.filter((move) => !isTactical(move)).map(label);
    const ordered = orderMoves(legal, [], null).filter((move) => !isTactical(move));
    expect(ordered.map(label)).toEqual(quietInOrder);
  });

  it("puts the killers first among the quiet moves, most recent first, and after every capture", () => {
    const legal = kiwipete();
    const quiet = legal.filter((move) => !isTactical(move));
    const older = quiet[3] as Move;
    const newer = quiet[7] as Move;
    const ordered = orderMoves(legal, [newer, older], null);
    const firstQuiet = ordered.findIndex((move) => !isTactical(move));
    expect(label(ordered[firstQuiet] as Move)).toBe(label(newer));
    expect(label(ordered[firstQuiet + 1] as Move)).toBe(label(older));
  });

  it("matches a killer by squares and promotion, not by object — killers come from siblings", () => {
    const legal = kiwipete();
    const quiet = legal.filter((move) => !isTactical(move));
    const copy = { ...(quiet[5] as Move) };
    const ordered = orderMoves(legal, [copy], null);
    const firstQuiet = ordered.findIndex((move) => !isTactical(move));
    expect(ordered[firstQuiet]).toBe(quiet[5]);
  });

  it("puts the hash move before everything, captures included", () => {
    const legal = kiwipete();
    const quiet = legal.filter((move) => !isTactical(move));
    const hash = quiet[quiet.length - 1] as Move;
    expect(orderMoves(legal, [], hash)[0]).toBe(hash);
  });

  it("orders a capturing promotion by its victim PLUS the piece it becomes (ABC-079 QE G4)", () => {
    // bxa8=Q takes a KNIGHT (320) and makes a queen (900): 1 219.9. Rxd5 takes a QUEEN: 899.5.
    // Only the promotion term puts the pawn first; drop it and the rook's capture leads.
    const position = parseFen(PROMOTION_CAPTURE_FEN);
    const first = orderMoves(legalMoves(position), [], null)[0] as Move;
    expect(label(first)).toBe("b7a85"); // bxa8=Q
  });
});

// ---------------------------------------------------------------------------
// The killer table — two slots per ply, quiet moves only.
// ---------------------------------------------------------------------------

describe("KillerTable — two quiet killers per ply, most recent first", () => {
  const quiet = legalMoves(parseFen(fenOf("startpos")));
  const [a, b, c] = quiet as [Move, Move, Move];

  it("offers nothing at a ply where nothing was recorded", () => {
    expect(new KillerTable().at(3)).toEqual([]);
  });

  it("keeps the two most recent, newest first, and never the same move twice", () => {
    const table = new KillerTable();
    table.record(2, a);
    table.record(2, b);
    table.record(2, b);
    expect(table.at(2).map(label)).toEqual([label(b), label(a)]);
    table.record(2, c);
    expect(table.at(2).map(label)).toEqual([label(c), label(b)]);
  });

  it("keeps each ply's killers to that ply", () => {
    const table = new KillerTable();
    table.record(2, a);
    expect(table.at(1)).toEqual([]);
    expect(table.at(3)).toEqual([]);
  });

  it("does not record a capture or a promotion — MVV-LVA already orders those", () => {
    const table = new KillerTable();
    const capture = legalMoves(parseFen(fenOf("kiwipete"))).find(
      (move) => move.captured !== EMPTY,
    ) as Move;
    table.record(1, capture);
    expect(table.at(1)).toEqual([]);
  });
});

/** One search per (door, position, depth), memoised: the unordered side is the whole cost. */
const results = new Map<string, { nodes: number; score: number }>();
function measure(
  door: typeof search,
  doorName: string,
  name: string,
  depth: number,
): { nodes: number; score: number } {
  const key = `${doorName}|${name}|${depth}`;
  const cached = results.get(key);
  if (cached !== undefined) return cached;
  const { nodes, score } = door(parseFen(fenOf(name)), depth);
  results.set(key, { nodes, score });
  return { nodes, score };
}
const none = (name: string, depth: number) => measure(searchWithoutOrdering, "none", name, depth);
const mvvLva = (name: string, depth: number) => measure(searchWithoutKillers, "mvv", name, depth);
const full = (name: string, depth: number) => measure(search, "full", name, depth);
/** `ABC-080`'s own full ordering — killers, no hash move — which is `ABC-081`'s table-off door. */
const killers = (name: string, depth: number) =>
  measure(searchWithoutTable, "killers", name, depth);

// ---------------------------------------------------------------------------
// A1 — ordering changes the WORK and not the VALUE.
// ---------------------------------------------------------------------------

/**
 * The positions whose unordered depth-3 search is cheap enough for the default lane. The rest,
 * and every depth-4 pair, run under `SEARCH_DEEP=1`.
 */
const DEFAULT_LANE_AT_DEPTH_3 = new Set(["startpos", "position-3"]);

describe("A1 — ordered and unordered scores are identical", () => {
  for (const { name } of PERFT_CORPUS) {
    for (const depth of [3, 4]) {
      const deep = depth === 4 || !DEFAULT_LANE_AT_DEPTH_3.has(name);
      if (deep && !RUN_DEEP) continue; // absent in the default run, not skipped
      it(
        `${name} at depth ${depth}${deep ? " [deep, SEARCH_DEEP=1]" : ""}`,
        () => {
          const unordered = none(name, depth).score;
          expect(full(name, depth).score).toBe(unordered);
          expect(mvvLva(name, depth).score).toBe(unordered);
        },
        deep ? 120_000 : undefined,
      );
    }
  }
});

// ---------------------------------------------------------------------------
// Scope — BOTH recursions consume the comparator, the root included (ruling `…f7e66060`, R1.3).
// ---------------------------------------------------------------------------

describe("Scope — the engine orders its root exactly as search() does", () => {
  /**
   * position-6 after 1. Bxf7+, black to move: Rxf7 and Qxf7 both take the bishop and tie at 230
   * at depth 1. Generation order tries Qxf7 first; MVV-LVA tries the LEAST valuable attacker
   * first, Rxf7 — and the incumbent of a tie is whichever is searched first. So an engine whose
   * root list were unordered would return a different move from `search()` here, with the same
   * score, which is exactly the drift the move-and-score identity sweep exists to catch and which
   * none of its positions can show (ABC-080 mutant M11 survived them all).
   */
  const TIE_FEN = "r4rk1/1pp1qBpp/p1np1n2/2b1p1B1/4P1b1/P1NP1N2/1PP1QPPP/R4RK1 b - - 0 10";

  it("the fixture bites: ordered and unordered depth-1 searches break the tie differently", () => {
    const ordered = search(parseFen(TIE_FEN), 1);
    const unordered = searchWithoutOrdering(parseFen(TIE_FEN), 1);
    expect(label(ordered.move as Move)).toBe("f8f7");
    expect(label(unordered.move as Move)).toBe("e7f7");
    expect(ordered.score).toBe(unordered.score);
  });

  it("chooseMove's completed depth-1 iteration returns search()'s move, f8f7", () => {
    let ticks = 0;
    const choice = chooseMove(parseFen(TIE_FEN), { budgetMs: 1, now: () => ticks++ }) as {
      move: Move;
      depth: number;
    };
    expect(choice.depth).toBe(1);
    expect(label(choice.move)).toBe("f8f7");
  });
});

// ---------------------------------------------------------------------------
// A3 — it prunes materially harder: <= 4% of the unordered nodes at depth 4.
// ---------------------------------------------------------------------------

describe("A3 — ordered search visits a small fraction of the unordered nodes", () => {
  /**
   * The DEFAULT lane's standing guard: one of the criterion's positions at depth 2, where the
   * unordered side is cheap (and shared with `A4`'s pin below). Measured at the ABC-080 branch
   * tip: position-6 2 467 / 9 804 = 25.2% (kiwipete, not run here: 2 772 / 10 249 = 27.0%).
   * The bar is 1.5x the larger reading (`ADR-0024` decision 3's headroom rule, as `A3`'s own bar
   * is): 40.5%. A comparator that stopped ordering reads 100%.
   */
  it("position-6 at depth 2 — the default lane's standing guard", () => {
    expect(full("position-6", 2).nodes / none("position-6", 2).nodes).toBeLessThanOrEqual(0.405);
  });

  if (RUN_DEEP) {
    // The criterion's own reading. ABC-080 branch tip: kiwipete 26 175 / 990 122 = 2.64%,
    // position-6 34 885 / 1 663 808 = 2.10% — the ruling's prototype figures, to the node.
    for (const name of ["kiwipete", "position-6"]) {
      it(`${name} at depth 4: <= 4% of the unordered nodes [deep, SEARCH_DEEP=1]`, () => {
        const ratio = full(name, 4).nodes / none(name, 4).nodes;
        console.log(
          `ABC-080 A3 ${name} d4: ${full(name, 4).nodes} / ${none(name, 4).nodes} = ` +
            `${(100 * ratio).toFixed(2)}%`,
        );
        expect(full(name, 4).score).toBe(none(name, 4).score);
        expect(ratio).toBeLessThanOrEqual(0.04);
      }, 120_000);
    }
  }
});

// ---------------------------------------------------------------------------
// A4 — each heuristic earns its place. Reported per configuration; delete rule on depth 5.
// ---------------------------------------------------------------------------

describe("A4 — each heuristic's node count, and the delete rule", () => {
  /**
   * The DEFAULT lane's standing guard: position-6 at depth 2, exact, per configuration —
   * measured at the ABC-080 branch tip. Node counts are deterministic, so an exact pin is the
   * cheapest detector of a comparator or killer drift that stays lossless (which `A1` cannot
   * see). The killers earn 27% here; at kiwipete depth 2 they earn nothing (2 772 either way),
   * which is exactly why the delete rule is not judged at a shallow depth.
   */
  it("position-6 at depth 2: none 9 804, MVV-LVA 3 391, + killers 2 467", () => {
    expect(none("position-6", 2).nodes).toBe(9_804);
    expect(mvvLva("position-6", 2).nodes).toBe(3_391);
    expect(full("position-6", 2).nodes).toBe(2_467);
  });

  /**
   * `ABC-079` QE's `G4`, closed inside this measurement (the ticket's test note 5): on a board
   * where a capturing promotion competes with a queen capture, the promotion term in the shared
   * `mvvLvaKey` decides which is searched first, in the full-width tree and in `quiesce` alike.
   * Measured at the ABC-080 branch tip: 275 nodes at depth 3. Dropping the term moves it.
   *
   * RE-MEASURED at `ABC-081`: 261. The table saves 14 nodes here, and it is a real transposition,
   * found by listing every ply-2 key: bxa8=Q, =R, =B and =N each answered by ...Qxa8 reach ONE
   * position four ways. The promotion term still decides what is searched first; the mutant
   * ledger at `ABC-081` re-ran the dropped-term mutant against this pin.
   */
  it("the promotion-capture fixture at depth 3 visits 261 nodes (ABC-079 QE G4)", () => {
    expect(search(parseFen(PROMOTION_CAPTURE_FEN), 3).nodes).toBe(261);
  });

  if (RUN_DEEP) {
    /**
     * The criterion's reading, at depths 4 and 5 on both positions. The hash-move configuration
     * needed a table, which `ABC-081` built: it is `search()` now, and `+ killers` — `ABC-080`'s
     * own full ordering, with no hash move — is `searchWithoutTable`. The three lower rungs carry
     * no table, so each column is one lever more than the one before it.
     *
     * THE UNORDERED SEARCH IS NOT RUN AT DEPTH 5 IN THE SUITE: kiwipete alone is 35 538 933 nodes
     * and 85.6 s under plain node (ABC-080 branch tip, Apple M3), which would take this lane from
     * ~23 s to many minutes. Its depth-5 count is measured by the node script beside this
     * ticket's context notes and reported there. The delete rule is judged on depth 5 for the
     * killers — the heuristic the depth-4 reading would falsely condemn — and MVV-LVA's own
     * increment is asserted at depth 4, where it is already 38x (kiwipete) and 45x (position-6).
     */
    for (const name of ["kiwipete", "position-6"]) {
      it(`${name} at depths 4 and 5, per configuration; the delete rule on depth 5 [deep, SEARCH_DEEP=1]`, () => {
        console.log(
          `ABC-080 A4 ${name} d4: none ${none(name, 4).nodes} / MVV-LVA ${mvvLva(name, 4).nodes}` +
            ` / + killers ${killers(name, 4).nodes} / + hash move (ABC-081's table) ` +
            `${full(name, 4).nodes}`,
        );
        console.log(
          `ABC-080 A4 ${name} d5: none (not run in-suite, see the context notes) / MVV-LVA ` +
            `${mvvLva(name, 5).nodes} / + killers ${killers(name, 5).nodes} / + hash move ` +
            `(ABC-081's table) ${full(name, 5).nodes}`,
        );
        expect(mvvLva(name, 4).nodes).toBeLessThan(none(name, 4).nodes);
        expect(killers(name, 5).score).toBe(mvvLva(name, 5).score);
        expect(killers(name, 5).nodes).toBeLessThan(mvvLva(name, 5).nodes); // the delete rule
      }, 120_000);
    }
  }
});

// ---------------------------------------------------------------------------
// A5 — correct with no hash move. Written when there was no table, so every search here was that
// case. Since ABC-081 it is every door below `search()` — `searchWithoutOrdering`,
// `searchWithoutKillers` and `searchWithoutTable` — and ABC-081's own `A1` asserts `search()`
// scores what `searchWithoutTable` scores. A2 runs the comparator with no hash move and with one.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// A6 — killers are per ply and do not leak between searches. An instrumented run.
// ---------------------------------------------------------------------------

describe("A6 — a killer is offered only at the ply it was recorded at, and only in its own search", () => {
  interface Event {
    readonly table: KillerTable;
    readonly kind: "at" | "record";
    /** The ply the code passed. */
    readonly ply: number;
    /** The ply the node really is at: moves made and not yet unmade. */
    readonly actual: number;
    readonly moves: readonly Move[];
  }

  const originalAt = KillerTable.prototype.at;
  const originalRecord = KillerTable.prototype.record;

  /** Run `body` with every table's `at` and `record` observed, and return what was seen. */
  function observe(body: () => void): Event[] {
    const events: Event[] = [];
    vi.spyOn(KillerTable.prototype, "at").mockImplementation(function (this: KillerTable, ply) {
      const moves = originalAt.call(this, ply);
      events.push({ table: this, kind: "at", ply, actual: made.outstanding, moves: [...moves] });
      return moves;
    });
    vi.spyOn(KillerTable.prototype, "record").mockImplementation(function (
      this: KillerTable,
      ply,
      move,
    ) {
      events.push({ table: this, kind: "record", ply, actual: made.outstanding, moves: [move] });
      originalRecord.call(this, ply, move);
    });
    made.outstanding = 0;
    body();
    return events;
  }

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const same = (a: Move, b: Move) =>
    a.from === b.from && a.to === b.to && a.promotion === b.promotion;

  /** Every offer that is not a move recorded earlier on the SAME table at the SAME ply. */
  function strayOffers(events: Event[]): string[] {
    const stray: string[] = [];
    const recorded = new Map<KillerTable, Move[][]>();
    for (const event of events) {
      if (event.ply !== event.actual) {
        stray.push(`${event.kind} at ply ${event.ply} from a node at ply ${event.actual}`);
      }
      const byPly = recorded.get(event.table) ?? [];
      recorded.set(event.table, byPly);
      if (event.kind === "record") {
        byPly[event.ply] = [...(byPly[event.ply] ?? []), event.moves[0] as Move];
        continue;
      }
      for (const move of event.moves) {
        if (!(byPly[event.ply] ?? []).some((earlier) => same(earlier, move))) {
          stray.push(`offered ${label(move)} at ply ${event.ply}, never recorded there`);
        }
      }
    }
    return stray;
  }

  /** The plies at which a killer was actually offered — more than one, or "per ply" is vacuous. */
  const offeredAt = (events: Event[]) =>
    new Set(events.filter((e) => e.kind === "at" && e.moves.length > 0).map((e) => e.ply));

  /**
   * position-3 at depth 4: 1 299 nodes, and killers recorded and offered at plies 1, 2 and 3 —
   * cheap, and deep enough for a killer to have a wrong ply to leak to.
   */
  const SUBJECT = "position-3";

  it("search(): every killer offered was recorded at that ply of that search, and killers ARE offered", () => {
    const events = observe(() => {
      search(parseFen(fenOf(SUBJECT)), 4);
    });
    expect(strayOffers(events)).toEqual([]);
    expect(offeredAt(events).size).toBeGreaterThanOrEqual(2); // not vacuous
  });

  it("search(): each search starts from its own, empty table", () => {
    const events = observe(() => {
      search(parseFen(fenOf(SUBJECT)), 4);
      search(parseFen(fenOf(SUBJECT)), 4);
    });
    const tables = [...new Set(events.map((event) => event.table))];
    expect(tables).toHaveLength(2);
    // And the second search's work is the first's: nothing it learned was carried over.
    const counts = tables.map((table) => events.filter((event) => event.table === table).length);
    expect(counts[1]).toBe(counts[0]);
  });

  it("chooseMove(): one table per call, kept across its iterations, never across calls", () => {
    const clock = () => {
      let ticks = 0;
      return () => ticks++;
    };
    const events = observe(() => {
      chooseMove(parseFen(fenOf(SUBJECT)), { budgetMs: 4, now: clock() });
      chooseMove(parseFen(fenOf(SUBJECT)), { budgetMs: 4, now: clock() });
    });
    expect(strayOffers(events)).toEqual([]);
    expect(offeredAt(events).size).toBeGreaterThanOrEqual(2);
    expect(new Set(events.map((event) => event.table)).size).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// G1 (ABC-080 QE) — the ENGINE records a killer on a beta cutoff only. Closed at ABC-081.
// ---------------------------------------------------------------------------

describe("G1 — chooseMove records a killer only on a beta cutoff", () => {
  /**
   * QE's mutant `N3` moved `budget.killers.record(ply, move)` in `src/engine.ts` out of the cutoff
   * guard, so every move tried was recorded, and it survived both lanes: `A6` above asserts every
   * offered killer was recorded at its ply, not that it caused a cutoff, and the identity sweep
   * cannot see a lossless reordering. The same rule IS caught in `src/search.ts` by node-count pins,
   * and this is that pin for the engine: an exact node count at a fixed injected-clock budget.
   * MEASURED at the `ABC-081` build: position-3 at 3 ticks completes depth 3 in 358 nodes; `N3`
   * reads 355. The count moves with any change to the engine's tree, which is the point — re-pin
   * it from a measurement, never from the failure message alone.
   */
  it("position-3 at 3 injected ticks: depth 3 in exactly 358 nodes", () => {
    let ticks = 0;
    const choice = chooseMove(parseFen(fenOf("position-3")), {
      budgetMs: 3,
      now: () => ticks++,
    }) as { depth: number; nodes: number };
    expect(choice.depth).toBe(3);
    expect(choice.nodes).toBe(358);
  });
});
