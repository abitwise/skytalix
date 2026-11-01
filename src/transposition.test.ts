/**
 * ABC-081 acceptance — the transposition table and in-tree repetition, criteria `A1`-`A7`
 * (`A8` is a byte-identity check on three files, read off git at the gate, not a test).
 *
 * `A4` (mate scores stored relative to the node) stands FIRST below, per the ticket's test note 1:
 * it is the bug that survives every other test and makes the engine claim mates that are not
 * there.
 *
 * THE INSTRUMENT. `probeTable` and `storeEntry` are wrapped (`vi.mock`, below) so a test can count
 * probes and verified hits (`A2`), switch the table off INSIDE the engine (`A3`'s baseline: the
 * same iterative deepening with the table off and the ordering still on), and stop `chooseMove`
 * exactly when a chosen iteration completes. The wrap only counts and switches; with the switch
 * off, every probe and store is the real one. `tableCutoff` is wrapped too, call-through, to count
 * the nodes a deeper entry settles (`ABC-238`, `ADR-0058` decision 9). Both recursions import both functions from
 * `./transposition.ts`, so both are observed.
 *
 * LANES, on the `SEARCH_DEEP` / `ENGINE_DEEP` precedent (`N8-LANE`). The criteria's own positions
 * and depths (depth 4 over the whole perft corpus, depth 5 on kiwipete and position-6, the
 * depth-10 mate fixture) run under `SEARCH_DEEP=1`, on an injected clock. `A7`'s memory reading is
 * WALL-CLOCK (a 1 s and a `DEFAULT_BUDGET_MS` (4 s) search) and runs under `ENGINE_DEEP=1`, the lane that holds every
 * wall-clock case. The default lane holds the cheap standing guard for each criterion. Unset, the
 * deep cases are NOT DEFINED rather than skipped, so the gate's skip count stays 0.
 */

import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { makeMove, unmakeMove } from "./apply.ts";
import {
  chooseMove,
  chooseMoveWithoutDeeperCutoffs,
  chooseMoveWithoutPvsOrReductions,
  DEFAULT_BUDGET_MS,
  type EngineChoice,
} from "./engine.ts";
import { pawnCacheByteLength } from "./evaluate.ts";
import { parseFen, toFen } from "./fen.ts";
import { gameStatus } from "./gameend.ts";
import { legalMoves } from "./legal.ts";
import type { Move } from "./moves.ts";
import { EMPTY, squareName } from "./position.ts";
import { captureScratchByteLength, QUIESCENCE_MAX_PLY } from "./quiescence.ts";
import { MATE_CORPUS } from "./search.mate-corpus.ts";
import {
  KEY_ARRAY_CAPACITY,
  MATE_SCORE,
  orderScratchByteLength,
  search,
  searchWithoutDeeperCutoffs,
  searchWithoutPvsOrReductions,
  searchWithoutTable,
} from "./search.ts";
import {
  BOUND_EXACT,
  BOUND_LOWER,
  BOUND_UPPER,
  boundOf,
  clearTable,
  entryMove,
  MATE_FLOOR,
  probeTable,
  storeEntry,
  TABLE_ENTRIES,
  tableByteLength,
  tableCutoff,
} from "./transposition.ts";
import { zobristKey } from "./zobrist.ts";

const RUN_SEARCH_DEEP = process.env.SEARCH_DEEP === "1";
const RUN_ENGINE_DEEP = process.env.ENGINE_DEEP === "1";

/** What the wrapped table saw, and the two switches a test may throw. */
const seen = vi.hoisted(() => ({
  probes: 0,
  hits: 0,
  /** True: every probe misses and every store is dropped — the table is off, everywhere. */
  off: false,
  /** Called with the depth of every ROOT store: one per completed iteration or search. */
  onRootStore: null as ((depth: number) => void) | null,
  /**
   * `ABC-238` (`ADR-0058` decision 9): nodes settled by a DEEPER entry — `tableCutoff` with the
   * switch on returned a score that the exact-depth rule would not have. A test-side count, never
   * a production counter.
   */
  deeperCuts: 0,
}));
vi.mock("./transposition.ts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./transposition.ts")>();
  return {
    ...actual,
    probeTable: (key: bigint) => {
      if (seen.off) return -1;
      seen.probes++;
      const slot = actual.probeTable(key);
      if (slot !== -1) seen.hits++;
      return slot;
    },
    tableCutoff: (...args: Parameters<typeof actual.tableCutoff>) => {
      const settled = actual.tableCutoff(...args);
      if (settled !== null && args[5]) {
        const [slot, depth, alpha, beta, ply] = args;
        if (actual.tableCutoff(slot, depth, alpha, beta, ply, false) === null) seen.deeperCuts++;
      }
      return settled;
    },
    storeEntry: (...args: Parameters<typeof actual.storeEntry>) => {
      if (args[4] === 0) seen.onRootStore?.(args[1]);
      if (!seen.off) actual.storeEntry(...args);
    },
  };
});

afterEach(() => {
  seen.off = false;
  seen.onRootStore = null;
  vi.unstubAllGlobals();
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

/**
 * `ABC-238`'s default-lane board and depth: where both recursions settle nodes by a deeper entry
 * (the rule alive) at a lane-cheap cost. Measured at the build: kiwipete's `search()` settles none
 * even at depth 6, so the rule's liveness is read on the endgame.
 */
const DEEPER_FEN = "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1"; // position-3: 4 and 3 deeper cuts at the build
const DEEPER_DEPTH = 5;

const fenOf = (name: string): string =>
  (PERFT_CORPUS.find((entry) => entry.name === name) as { fen: string }).fen;

const label = (move: Move | null): string =>
  move === null
    ? "null"
    : `${squareName(move.from)}${squareName(move.to)}${move.promotion === EMPTY ? "" : move.promotion}`;

/**
 * `chooseMove` run until iteration `depth` COMPLETES and not a node further: the clock reads 0
 * until the root of iteration `depth` is stored, then reads far past any deadline, so the deepening
 * loop's next check stops it. Node counts are therefore the engine's own cumulative
 * iterative-deepening counts to exactly that depth — `A3`'s shape — on every machine.
 *
 * Since `ABC-121` it runs the pre-`ABC-121` engine, `chooseMoveWithoutPvsOrReductions`: every row
 * that reads it is a work reading (`ADR-0026` decision 4), and not one bar moved.
 */
function deepenTo(fen: string, depth: number): { nodes: number; depth: number; score: number } {
  let done = false;
  seen.onRootStore = (stored) => {
    if (stored === depth) done = true;
  };
  const choice = chooseMoveWithoutPvsOrReductions(parseFen(fen), {
    budgetMs: 1_000,
    now: () => (done ? Number.MAX_SAFE_INTEGER : 0),
  }) as { nodes: number; depth: number; score: number };
  seen.onRootStore = null;
  return choice;
}

/** The fraction of probes that found a verified entry, over `body`. */
function hitRate(body: () => void): number {
  seen.probes = 0;
  seen.hits = 0;
  body();
  return seen.hits / seen.probes;
}

// ---------------------------------------------------------------------------
// A4 — mate scores are stored relative to the node and restored relative to the root. FIRST.
// ---------------------------------------------------------------------------

describe("A4 — a mate score is correct at every ply the position is reached at", () => {
  /**
   * The logic beneath the criterion, at the table: a MATE-IN-2 position (the side to move mates
   * on its third ply) stored when reached at one ply, and read back when reached at another. At
   * ply `p` the root-relative score of that mate is `MATE_SCORE - (p + 3)`. Stored raw, the entry
   * would report the first ply's distance at every ply — a mate two plies closer or further than
   * it is.
   */
  it("a mate-in-2 stored at ply 1 reads MATE_SCORE - 4 at ply 1 and MATE_SCORE - 6 at ply 3", () => {
    clearTable();
    const key = zobristKey(parseFen(fenOf("startpos")));
    const move = legalMoves(parseFen(fenOf("startpos")))[0] as Move;
    storeEntry(key, 3, BOUND_EXACT, MATE_SCORE - 4, 1, move);
    const slot = probeTable(key);
    for (const deeper of [false, true]) {
      expect(tableCutoff(slot, 3, -Infinity, Infinity, 1, deeper)).toBe(MATE_SCORE - 4);
      expect(tableCutoff(slot, 3, -Infinity, Infinity, 3, deeper)).toBe(MATE_SCORE - 6);
    }
  });

  it("a mated-in-2 stored at ply 2 reads -(MATE_SCORE - 6) at ply 2 and -(MATE_SCORE - 8) at ply 4", () => {
    clearTable();
    const key = zobristKey(parseFen(fenOf("kiwipete")));
    const move = legalMoves(parseFen(fenOf("kiwipete")))[0] as Move;
    storeEntry(key, 4, BOUND_EXACT, 0 - (MATE_SCORE - 6), 2, move);
    const slot = probeTable(key);
    for (const deeper of [false, true]) {
      expect(tableCutoff(slot, 4, -Infinity, Infinity, 2, deeper)).toBe(0 - (MATE_SCORE - 6));
      expect(tableCutoff(slot, 4, -Infinity, Infinity, 4, deeper)).toBe(0 - (MATE_SCORE - 8));
    }
  });

  it("leaves an ordinary score alone at every ply", () => {
    clearTable();
    const key = zobristKey(parseFen(fenOf("position-3")));
    const move = legalMoves(parseFen(fenOf("position-3")))[0] as Move;
    storeEntry(key, 2, BOUND_EXACT, 9_000, 3, move);
    for (const deeper of [false, true]) {
      expect(tableCutoff(probeTable(key), 2, -Infinity, Infinity, 7, deeper)).toBe(9_000);
    }
  });

  it("MATE_FLOOR sits below every mate score the search can report", () => {
    // The deepest mate: the key array's capacity plus the quiescence plies past it.
    expect(MATE_SCORE - (KEY_ARRAY_CAPACITY + QUIESCENCE_MAX_PLY)).toBeGreaterThan(MATE_FLOOR);
    expect(MATE_FLOOR).toBeGreaterThan(10_000); // a static evaluation stays under 10 000
  });

  if (RUN_SEARCH_DEEP) {
    /**
     * The criterion in the search, where the table actually reuses a mate score at a second ply.
     * With the cutoff taken only at the depth an entry was searched to, a fixed-depth search reuses
     * an entry only at the ply it was stored at, so the reuse happens ACROSS the engine's
     * iterations. On this rook ending, at 160 injected ticks (depth 10), iteration 6 stores a
     * position whose side to move mates next move at ply 5, and iteration 10 cuts on it at ply 9.
     * MEASURED at this ticket's build: the build reports −29 992 (mated at ply 8), which is
     * `searchWithoutTable`'s own depth-10 answer (1 583 085 nodes). A table that drops the ±ply
     * adjustment reports −29 994: a mate two plies SHORTER than there is. It was the only one of
     * 182 endgame positions and four budgets where the dropped adjustment changed the answer, and
     * the reused entry there is a mate-in-ONE position; no reused mate-in-2 entry changed a root
     * score in that scan, so the mate-in-2 wording of the criterion is answered at the table, above.
     *
     * SPLIT at `ABC-121`, as `ADR-0026` decision 7 names this row: the depth reached at 160 ticks is
     * a node count in disguise, so the measurement above — depth 10, the door comparison — reads the
     * pre-`ABC-121` engine, unchanged. The LITERAL stays on the shipped `chooseMove`, which now
     * completes depth 11 at the same budget (fewer nodes per iteration) and still reads −29 992.
     */
    it("reports the table-free mate distance where the engine reuses a mate score at a second ply [deep, SEARCH_DEEP=1]", () => {
      const fen = "k7/8/8/K7/8/8/8/1R6 b - - 1 1";
      let ticks = 0;
      const choice = chooseMoveWithoutPvsOrReductions(parseFen(fen), {
        budgetMs: 160,
        now: () => ticks++,
      }) as {
        depth: number;
        score: number;
      };
      expect(choice.depth).toBe(10);
      expect(choice.score).toBe(searchWithoutTable(parseFen(fen), 10).score);
      expect(choice.score).toBe(0 - (MATE_SCORE - 8));

      ticks = 0;
      const shipped = chooseMove(parseFen(fen), { budgetMs: 160, now: () => ticks++ }) as {
        depth: number;
        score: number;
      };
      expect(shipped.depth).toBeGreaterThanOrEqual(10);
      expect(shipped.score).toBe(0 - (MATE_SCORE - 8));
    }, 60_000);
  }
});

// ---------------------------------------------------------------------------
// ABC-238 (`ADR-0058` decisions 1 and 6) — a deeper stored entry settles a shallower node, with
// the bound rules unchanged; the predicate rows the rule's correctness rests on, the switch on and
// off. The search-level oracle (drift, the mate sign floor, `A4`) is in `src/search.deeper-cutoffs.test.ts`.
// ---------------------------------------------------------------------------

describe("ABC-238 — a deeper stored entry may cut off a shallower search (the predicate)", () => {
  const position = () => parseFen(fenOf("position-3"));
  const key = () => zobristKey(position());
  const move = () => legalMoves(position())[0] as Move;
  const store = (depth: number, bound: number, score: number, ply = 0): number => {
    clearTable();
    storeEntry(key(), depth, bound, score, ply, move());
    return probeTable(key());
  };

  it("A2: an exact entry stored at depth 8 settles a depth-5 probe with the stored score; the door's rule does not", () => {
    const slot = store(8, BOUND_EXACT, 40);
    expect(tableCutoff(slot, 5, -Infinity, Infinity, 0, true)).toBe(40);
    expect(tableCutoff(slot, 5, -Infinity, Infinity, 0, false)).toBeNull();
  });

  it("a shallower entry never settles a node, switch on or off", () => {
    const slot = store(3, BOUND_EXACT, 40);
    for (const deeper of [false, true]) {
      expect(tableCutoff(slot, 4, -Infinity, Infinity, 0, deeper)).toBeNull();
      expect(tableCutoff(slot, 8, -Infinity, Infinity, 0, deeper)).toBeNull();
    }
  });

  it("at the stored depth the two rules agree, every bound", () => {
    for (const bound of [BOUND_EXACT, BOUND_LOWER, BOUND_UPPER]) {
      const slot = store(5, bound, 50);
      for (const [alpha, beta] of [
        [0, 50],
        [0, 51],
        [50, 100],
        [49, 100],
        [-Infinity, Infinity],
      ] as const) {
        expect(tableCutoff(slot, 5, alpha, beta, 0, true)).toBe(
          tableCutoff(slot, 5, alpha, beta, 0, false),
        );
      }
    }
  });

  it("a deeper exact entry returns its score whatever the window, fail-soft, never clamped", () => {
    const slot = store(8, BOUND_EXACT, 50);
    expect(tableCutoff(slot, 5, 100, 200, 0, true)).toBe(50);
    expect(tableCutoff(slot, 5, -200, -100, 0, true)).toBe(50);
  });

  it("a deeper lower bound cuts only at or above beta, as stored; never at or below alpha", () => {
    const slot = store(8, BOUND_LOWER, 50);
    expect(tableCutoff(slot, 5, 0, 50, 0, true)).toBe(50);
    expect(tableCutoff(slot, 5, 0, 40, 0, true)).toBe(50); // fail-soft: 50, not beta's 40
    expect(tableCutoff(slot, 5, 0, 51, 0, true)).toBeNull();
    expect(tableCutoff(slot, 5, 60, 100, 0, true)).toBeNull(); // below alpha: a lower bound says nothing
    for (const beta of [40, 50, 51]) expect(tableCutoff(slot, 5, 0, beta, 0, false)).toBeNull();
  });

  it("a deeper upper bound cuts only at or below alpha, as stored; never at or above beta", () => {
    const slot = store(8, BOUND_UPPER, 50);
    expect(tableCutoff(slot, 5, 50, 100, 0, true)).toBe(50);
    expect(tableCutoff(slot, 5, 60, 100, 0, true)).toBe(50); // fail-soft: 50, not alpha's 60
    expect(tableCutoff(slot, 5, 49, 100, 0, true)).toBeNull();
    expect(tableCutoff(slot, 5, 0, 40, 0, true)).toBeNull(); // above beta: an upper bound says nothing
    for (const alpha of [60, 50, 49]) expect(tableCutoff(slot, 5, alpha, 100, 0, false)).toBeNull();
  });

  it("a deeper mate entry is restored to the probing ply: mate-in-2 stored at ply 1, depth 8, reads MATE_SCORE - 6 at ply 3, depth 5", () => {
    const slot = store(8, BOUND_EXACT, MATE_SCORE - 4, 1);
    expect(tableCutoff(slot, 5, -Infinity, Infinity, 3, true)).toBe(MATE_SCORE - 6);
    expect(tableCutoff(slot, 5, -Infinity, Infinity, 3, false)).toBeNull();
    const mated = store(8, BOUND_UPPER, 0 - (MATE_SCORE - 6), 2);
    expect(tableCutoff(mated, 1, 0, 1, 4, true)).toBe(0 - (MATE_SCORE - 8));
  });
});

// ---------------------------------------------------------------------------
// The table itself — the logic beneath A1/A2/A7, one rule per case.
// ---------------------------------------------------------------------------

describe("the table — verified keys, always-replace, and with deeper cutoffs off (the doors) cutoffs only at the stored depth", () => {
  const position = () => parseFen(fenOf("position-3"));
  const key = () => zobristKey(position());
  const move = () => legalMoves(position())[0] as Move;

  it("finds an entry by its own key, and not by another key that shares its slot", () => {
    clearTable();
    storeEntry(key(), 2, BOUND_EXACT, 40, 0, move());
    expect(probeTable(key())).not.toBe(-1);
    // Same low bits, so the same slot; a different 64-bit key, so a different position.
    expect(probeTable(key() ^ (1n << 40n))).toBe(-1);
  });

  it("always replaces: a second position in the slot evicts the first", () => {
    clearTable();
    const other = key() ^ (1n << 50n);
    storeEntry(key(), 9, BOUND_EXACT, 40, 0, move());
    storeEntry(other, 1, BOUND_EXACT, 10, 0, move());
    expect(probeTable(key())).toBe(-1);
    expect(probeTable(other)).not.toBe(-1);
  });

  it("is empty after clearTable", () => {
    storeEntry(key(), 2, BOUND_EXACT, 40, 0, move());
    clearTable();
    expect(probeTable(key())).toBe(-1);
  });

  it("with deeper cutoffs off, settles a node only at the depth the entry was searched to", () => {
    clearTable();
    storeEntry(key(), 3, BOUND_EXACT, 40, 0, move());
    const slot = probeTable(key());
    expect(tableCutoff(slot, 3, -Infinity, Infinity, 0, false)).toBe(40);
    expect(tableCutoff(slot, 2, -Infinity, Infinity, 0, false)).toBeNull();
    expect(tableCutoff(slot, 4, -Infinity, Infinity, 0, false)).toBeNull();
  });

  it("cuts on a lower bound only at or above beta, on an upper bound only at or below alpha", () => {
    clearTable();
    for (const deeper of [false, true]) {
      storeEntry(key(), 2, BOUND_LOWER, 50, 0, move());
      expect(tableCutoff(probeTable(key()), 2, 0, 50, 0, deeper)).toBe(50);
      expect(tableCutoff(probeTable(key()), 2, 0, 51, 0, deeper)).toBeNull();
      storeEntry(key(), 2, BOUND_UPPER, 50, 0, move());
      expect(tableCutoff(probeTable(key()), 2, 50, 100, 0, deeper)).toBe(50);
      expect(tableCutoff(probeTable(key()), 2, 49, 100, 0, deeper)).toBeNull();
    }
  });

  it("classifies a fail-soft result against the window the node was entered with", () => {
    expect(boundOf(10, 10, 20)).toBe(BOUND_UPPER);
    expect(boundOf(20, 10, 20)).toBe(BOUND_LOWER);
    expect(boundOf(15, 10, 20)).toBe(BOUND_EXACT);
  });

  it("returns the stored best move from the node's own list, underpromotion kept distinct", () => {
    // bxa8=N and bxa8=Q share their squares; only the promotion tells the hash move apart.
    const promotion = parseFen("n3k3/1P6/8/3q4/8/8/8/3RK3 w - - 0 1");
    const moves = legalMoves(promotion);
    const knight = moves.find((m) => label(m) === "b7a82") as Move;
    clearTable();
    storeEntry(zobristKey(promotion), 1, BOUND_EXACT, 0, 0, knight);
    expect(entryMove(probeTable(zobristKey(promotion)), moves)).toBe(knight);
  });
});

// ---------------------------------------------------------------------------
// A1 — the table changes the WORK and not the VALUE. `ADR-0006` falsifier G6 inside it.
// ---------------------------------------------------------------------------

/**
 * `ADR-0006`'s `knight-g1` pair (test note 5): the same placement and the same legal moves NOW, one
 * castling right apart — unusable now, usable once the knight leaves g1. Their subtrees differ, so
 * their scores differ (830 vs 820 at depth 4 on the pre-`ABC-121` search). That is all the score
 * pair records: the premise that the subtrees differ. It does not detect a key bug, because the
 * table lives one search (`ADR-0025` decision 4), so the two roots never share a table. `G6`'s
 * guard is the key rows, which no search switch reaches: "G6 bites" below, and `zobrist.test.ts`'s
 * castling-rights rows ("depends on castling rights"; `ABC-075` `A4`). See the `ADR-0006` `G6`
 * erratum of 2026-09-26 (`ruling-abc121-g6` `…ea306e58` §3–§4).
 *
 * RE-MEASURED at `ABC-083` (king safety and mobility act on pawnless boards too): both read 894 at
 * depth 4, table on and off, so at this depth the score pair no longer shows the premise. The
 * subtrees still differ: at depth 5 the pair reads 928 vs 910
 * (`.grugops/context/ticket-to-pr-ABC-083/probe/g6.out.jsonl`). The guard is unaffected; it is the
 * key row below and `zobrist.test.ts`'s castling-rights rows, as stated above.
 * RE-PINNED at `ABC-215` (the evaluation values made by rule): 894 became 939, both rows, table on
 * and off. Depth 5 now reads 939 twice as well; the guard is still the key row, as stated above.
 */
const KNIGHT_G1_PAIR = [
  { name: "knight-g1 w K", fen: "4k3/8/8/8/8/8/8/4K1NR w K - 0 1", score: 939 },
  { name: "knight-g1 w -", fen: "4k3/8/8/8/8/8/8/4K1NR w - - 0 1", score: 939 },
];

describe("A1 — table-on and table-off scores are identical", () => {
  if (RUN_SEARCH_DEEP) {
    // position-3 is in the default lane, in the node-count row at the end of this block.
    for (const { name, fen } of PERFT_CORPUS.filter(({ name }) => name !== "position-3")) {
      // The pre-`ABC-121` search since `ABC-121` (`ADR-0026` decision 4): LMR changes the value.
      it(`${name} at depth 4 [deep, SEARCH_DEEP=1]`, () => {
        expect(searchWithoutPvsOrReductions(parseFen(fen), 4).score).toBe(
          searchWithoutTable(parseFen(fen), 4).score,
        );
      }, 60_000);
    }
  }

  /**
   * RE-POINTED at `ABC-121` to the pre-`ABC-121` search, with both literals unchanged — `ABC-081`
   * `A1`'s row, so `ADR-0026` decision 4's. Decision 7 listed this pair as a shipped-path VALUE row,
   * but at depth 4 the late-move reductions move `knight-g1 w -` from 820 to 830, in this build and
   * in the ruling's own reference recursion. The pair then reads 830 twice on `search()`, so it
   * re-points under decision 4 (ruling `ruling-abc121-g6`, which strikes it from decision 7). G6's
   * bite was never this score pair, because the table lives one search. It is the key row below
   * and `zobrist.test.ts`'s castling-rights rows, which no search switch reaches.
   * Measured, not argued: `.grugops/context/ticket-to-pr-ABC-121/probe/g6.ts`.
   */
  for (const { name, fen, score } of KNIGHT_G1_PAIR) {
    it(`${name} at depth 4 — G6: ${score} with the table on and off`, () => {
      expect(searchWithoutPvsOrReductions(parseFen(fen), 4).score).toBe(score);
      expect(searchWithoutTable(parseFen(fen), 4).score).toBe(score);
    });
  }

  it("G6 bites: the knight-g1 pair keys differently — the subtrees differ, so they must", () => {
    const [withRight, without] = KNIGHT_G1_PAIR.map(({ fen }) => zobristKey(parseFen(fen)));
    expect(withRight).not.toBe(without);
  });

  /**
   * The other half of "changes the work": it DOES change it, and the door really is table-free.
   * Exact, measured at this ticket's build: position-3 at depth 4 visits 1 123 nodes with the
   * table and 1 299 without it. A table-off door that quietly used the table reads 1 123 twice.
   * RE-MEASURED at `ABC-082` (the pawn-structure term moves the tree): 1 319 and 1 474.
   * RE-MEASURED at `ABC-083` (king safety and mobility): 1 325 and 1 523 (`probe/rows.ts`).
   * RE-PINNED at `ABC-215` (the evaluation values made by rule): 1 377 and 1 533.
   */
  it("position-3 at depth 4 — the same score, and the work changes: 1 377 nodes with the table, 1 533 without", () => {
    // The pre-`ABC-121` search since `ABC-121` (`ADR-0026` decision 4); both pins are unchanged.
    const on = searchWithoutPvsOrReductions(parseFen(fenOf("position-3")), 4);
    const off = searchWithoutTable(parseFen(fenOf("position-3")), 4);
    expect(on.score).toBe(off.score);
    expect(on.nodes).toBe(1_377);
    expect(off.nodes).toBe(1_533);
  });
});

// ---------------------------------------------------------------------------
// A2 — the table hits, and the hit rate is reported.
// ---------------------------------------------------------------------------

describe("A2 — the hit rate is reported and is at least 10%", () => {
  /**
   * The DEFAULT lane's standing guard: position-3 at fixed depth 4, measured at this ticket's
   * build at 21.8% of probes finding a verified entry. A table that never hits reads 0.
   * Re-read at `ABC-082` (pawn-aware evaluator): 16.22%. Bar re-levelled >= 15% -> >= 10% under
   * `ADR-0028` (ruling …8c0fee21: 15.38% merge figure / 1.5, `ADR-0024` decision 3) — PENDING
   * the owner's acceptance of `ADR-0028`; if refused, this commit is reverted.
   */
  // The pre-`ABC-121` search since `ABC-121` (`ADR-0026` decision 4), here and in the deep rows.
  it("position-3 at depth 4 — the default lane's standing guard", () => {
    expect(
      hitRate(() => searchWithoutPvsOrReductions(parseFen(fenOf("position-3")), 4)),
    ).toBeGreaterThanOrEqual(0.1);
  });

  if (RUN_SEARCH_DEEP) {
    /**
     * The criterion's own positions and depth, as ONE fixed-depth search each — the stricter of
     * the two readings. MEASURED at this ticket's build: kiwipete 988 / 6 196 = 15.95%, position-6
     * 1 075 / 6 988 = 15.38% — above the bar, narrowly. In the engine's own shape (iterative
     * deepening to depth 5, printed alongside) the same table reads 39.6% and 45.1%.
     * Re-read at `ABC-082` (pawn-aware evaluator): kiwipete 15.63%, position-6 14.46% (engine
     * shape 40.54% / 44.98%). Bar re-levelled >= 15% -> >= 10% under `ADR-0028` (ruling
     * …8c0fee21) — PENDING the owner's acceptance of `ADR-0028`; if refused, revert this commit.
     */
    for (const name of ["kiwipete", "position-6"]) {
      it(`${name} at depth 5 [deep, SEARCH_DEEP=1]`, () => {
        const fixed = hitRate(() => searchWithoutPvsOrReductions(parseFen(fenOf(name)), 5));
        const deepened = hitRate(() => deepenTo(fenOf(name), 5));
        console.log(
          `ABC-081 A2 ${name}: fixed depth 5 ${(100 * fixed).toFixed(2)}%, ` +
            `iterative deepening to 5 ${(100 * deepened).toFixed(2)}%`,
        );
        expect(fixed).toBeGreaterThanOrEqual(0.1);
      }, 60_000);
    }
  }
});

// ---------------------------------------------------------------------------
// A3 — the node count falls, measured in the engine's own shape.
// ---------------------------------------------------------------------------

describe("A3 — iterative deepening with the table visits <= 70% of the nodes it visits without", () => {
  /** Cumulative nodes to `depth` with the table on, and with it off — the ordering on in both. */
  function onAndOff(name: string, depth: number) {
    const on = deepenTo(fenOf(name), depth);
    seen.off = true;
    const off = deepenTo(fenOf(name), depth);
    seen.off = false;
    return { on, off, ratio: on.nodes / off.nodes };
  }

  /**
   * The DEFAULT lane's standing guard: position-3 deepened to depth 4, measured at this ticket's
   * build: 1 137 / 1 820 = 62.5%. A table that stopped handing out hash moves reads near 100%.
   * (position-6 to depth 3 reads 47.2% and would be the criterion's own position, at about five
   * times the lane cost.)
   */
  it("position-3 deepened to depth 4 — the default lane's standing guard", () => {
    const { on, off, ratio } = onAndOff("position-3", 4);
    expect(on.depth).toBe(4);
    expect(off.depth).toBe(4);
    expect(on.score).toBe(off.score);
    expect(ratio).toBeLessThanOrEqual(0.7);
  });

  if (RUN_SEARCH_DEEP) {
    // MEASURED at this ticket's build: kiwipete 123 920 / 193 821 = 63.94%, position-6
    // 91 420 / 183 215 = 49.90% — the ruling's prototype read 63.2% / 49.7%.
    for (const name of ["kiwipete", "position-6"]) {
      it(`${name} deepened to depth 5: <= 70% [deep, SEARCH_DEEP=1]`, () => {
        const { on, off, ratio } = onAndOff(name, 5);
        console.log(
          `ABC-081 A3 ${name} to depth 5: ${on.nodes} / ${off.nodes} = ${(100 * ratio).toFixed(2)}%`,
        );
        expect(on.depth).toBe(5);
        expect(on.score).toBe(off.score);
        expect(ratio).toBeLessThanOrEqual(0.7);
      }, 60_000);
    }
  }
});

// ---------------------------------------------------------------------------
// A5 — a repetition inside the search path scores exactly 0.
// ---------------------------------------------------------------------------

/**
 * CONSTRUCTED, not found (test note 3): generated, then kept only where the search itself said
 * exactly one White move saves the game. White is a rook and two pawns down and has one saving
 * line, a perpetual on the black king boxed in by its own pawns: Qf8+ Kh7, Qf7+ Kh8, Qf8+ … —
 * the king has no other square and no black piece can block or take.
 *
 * `REPEATS_AT_PLY_4` starts INSIDE the cycle, queen already on f7: 1. Qf8+ Kh7 2. Qf7+ Kh8 is
 * the root again at ply 4, so depth 4 sees it and depth 3 does not (−470). Measured at this
 * ticket's build: depth 4 scores 0 with Qf8+ in 7 241 nodes; every other White move scores −490
 * or worse; a search that scores a repetition as a loss reads −475.
 *
 * `PERPETUAL` starts one move OUTSIDE it (queen on a3): the position after 1. Qf8+ stands again
 * at ply 5. Every other White move scores −485 or worse at depth 5. The twin is the same position
 * with the colours flipped, Black to move: "a win for EITHER side" is asserted from both.
 */
const REPEATS_AT_PLY_4 = "7k/5Q2/6pp/qr6/8/8/6PP/7K w - - 0 1";

const PERPETUAL = [
  { name: "white to move", fen: "7k/8/6pp/qr6/8/Q7/6PP/7K w - - 0 1", saving: "a3f8" },
  { name: "black to move", fen: "7k/6pp/q7/8/QR6/6PP/8/7K b - - 0 1", saving: "a6f1" },
];

describe("A5 — the only non-losing line repeats, and it scores exactly 0", () => {
  /**
   * The DEFAULT lane, table ON in both recursions (the ruling's condition — a table can carry a
   * repetition's 0 to a path where it is not one). The node count is pinned too: it is the
   * cheapest detector of `search()` dropping the hash move, which changes no score here.
   */
  it("search(), depth 4: the perpetual scores exactly 0 and is played — in 7 295 nodes", () => {
    const result = search(parseFen(REPEATS_AT_PLY_4), 4);
    expect(result.score).toBe(0); // `toBe` is Object.is: a -0 fails here
    expect(label(result.move)).toBe("f7f8");
    // The node pin is a work reading: the pre-`ABC-121` search since `ABC-121` (`ADR-0026`
    // decisions 4 and 7), unchanged. The score and the move stay on the shipped search.
    // RE-MEASURED at `ABC-082` (the pawn-structure term moves the tree): 7 241 became 7 251.
    // RE-MEASURED at `ABC-083` (king safety and mobility): 7 251 became 7 832 (`probe/rows.ts`).
    // RE-PINNED at `ABC-215` (the evaluation values made by rule): 7 832 became 7 295.
    expect(searchWithoutPvsOrReductions(parseFen(REPEATS_AT_PLY_4), 4).nodes).toBe(7_295);
  });

  it("the fixture bites: at depth 3 the repetition is past the horizon, and the rook down shows", () => {
    // RE-MEASURED at `ABC-083` (king safety and mobility): −470 became −488 (`probe/rows.ts`).
    // RE-PINNED at `ABC-215` (the evaluation values made by rule): −488 became −485.
    // RE-PINNED at `ABC-228` (evasions in quiescence; `ADR-0053` decision 7, measured in its
    // finding 6): −485 became −392. The premise holds: the material deficit still shows.
    expect(search(parseFen(REPEATS_AT_PLY_4), 3).score).toBe(-392);
  });

  /**
   * The engine's own repetition line and its root hash move, on the same fixture. Measured at this
   * ticket's build: depth 4 at 6 injected ticks, score 0, Qf8+. An engine blind to repetition
   * reads −390; one whose root ignores the hash move is still at depth 3 (−470) at this budget.
   */
  it("chooseMove(), 6 ticks: depth 4, the perpetual played and scored exactly 0", () => {
    let ticks = 0;
    const choice = chooseMove(parseFen(REPEATS_AT_PLY_4), { budgetMs: 6, now: () => ticks++ }) as {
      move: Move;
      score: number;
      depth: number;
    };
    expect(choice.depth).toBe(4);
    expect(choice.score).toBe(0);
    expect(label(choice.move)).toBe("f7f8");
  });

  if (RUN_SEARCH_DEEP) {
    it("white to move, one move outside the cycle: the engine reaches depth 5 and scores 0 [deep, SEARCH_DEEP=1]", () => {
      const { fen, saving } = PERPETUAL[0] as (typeof PERPETUAL)[number];
      let ticks = 0;
      const choice = chooseMove(parseFen(fen), { budgetMs: 10, now: () => ticks++ }) as {
        move: Move;
        score: number;
        depth: number;
      };
      expect(choice.depth).toBeGreaterThanOrEqual(5);
      expect(choice.score).toBe(0);
      expect(label(choice.move)).toBe(saving);
    });

    for (const { name, fen, saving } of PERPETUAL) {
      it(`${name}: 0 at depths 5 and 6, table on and off, and the saving move played [deep, SEARCH_DEEP=1]`, () => {
        for (const depth of [5, 6]) {
          const on = search(parseFen(fen), depth);
          expect(on.score).toBe(0);
          expect(label(on.move)).toBe(saving);
          expect(searchWithoutTable(parseFen(fen), depth).score).toBe(0);
        }
      }, 60_000);

      it(`${name}: the fixture bites — at depth 4 the repetition is past the horizon and it loses [deep, SEARCH_DEEP=1]`, () => {
        // Ply 5 is where the position repeats; at depth 4 it is not reached, and the rook shows.
        expect(search(parseFen(fen), 4).score).toBeLessThan(-300);
      });
    }
  }
});

// ---------------------------------------------------------------------------
// A6 — the key array is the search's own: no history import, allocated once per search.
// ---------------------------------------------------------------------------

describe("A6 — the per-ply key array is the search's own", () => {
  const DELIVERED = ["./search.ts", "./engine.ts", "./transposition.ts", "./quiescence.ts"];

  it("no delivered search module imports src/history.ts (ADR-0002 clause 3)", () => {
    for (const path of DELIVERED) {
      const source = readFileSync(new URL(path, import.meta.url), "utf8");
      expect(source.length, path).toBeGreaterThan(1000); // the module, not nothing
      expect(source, path).not.toMatch(/from\s+["']\.\/history(\.ts)?["']/);
    }
  });

  /** How many `BigUint64Array`s `body` constructs. */
  function allocations(body: () => void): number {
    let count = 0;
    class Counted extends BigUint64Array {
      constructor(length: number) {
        super(length);
        count++;
      }
    }
    vi.stubGlobal("BigUint64Array", Counted);
    body();
    vi.unstubAllGlobals();
    return count;
  }

  it("search() allocates ONE key array per call, whatever the depth and node count", () => {
    search(parseFen(fenOf("position-3")), 1); // the table's own once-per-process allocation
    expect(allocations(() => search(parseFen(fenOf("position-3")), 1))).toBe(1);
    expect(allocations(() => search(parseFen(fenOf("position-3")), 4))).toBe(1);
  });

  it("chooseMove() allocates ONE key array per call, across all its iterations", () => {
    search(parseFen(fenOf("position-3")), 1);
    let ticks = 0;
    let depth = 0;
    const count = allocations(() => {
      depth = (
        chooseMove(parseFen(fenOf("position-3")), { budgetMs: 3, now: () => ticks++ }) as {
          depth: number;
        }
      ).depth;
    });
    expect(depth).toBeGreaterThanOrEqual(3); // several iterations, one array
    expect(count).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// A7 — the table's memory is a fixed bound (`NFR-009`), never a growing structure.
// ---------------------------------------------------------------------------

describe("A7 — the table holds a fixed 4 MiB, whatever the search", () => {
  const FOUR_MIB = 4 * 1024 * 1024;

  it("is 2^18 slots of 16 bytes: exactly 4 MiB, before and after searches of any size", () => {
    expect(TABLE_ENTRIES).toBe(2 ** 18);
    search(parseFen(fenOf("position-3")), 1);
    expect(tableByteLength()).toBe(FOUR_MIB);
    search(parseFen(fenOf("position-3")), 4);
    let ticks = 0;
    chooseMove(parseFen(fenOf("position-3")), { budgetMs: 3, now: () => ticks++ });
    expect(tableByteLength()).toBe(FOUR_MIB);
  });

  it("stays inside NFR-009's 16 MiB with the key array, the pawn memo and the ordering scratch", () => {
    const keyArrayBytes = (KEY_ARRAY_CAPACITY + 1) * 8;
    // ABC-235 cut 5: the pawn-structure memo is fixed at 384 KiB and counted in (a)'s sum.
    expect(pawnCacheByteLength()).toBe(384 * 1024);
    // ABC-240: orderMoves' and quiescence's float64 key scratches are fixed at 256 slots each
    // and counted in (a)'s sum.
    expect(orderScratchByteLength()).toBe(256 * 8);
    expect(captureScratchByteLength()).toBe(256 * 8);
    expect(
      tableByteLength() +
        keyArrayBytes +
        pawnCacheByteLength() +
        orderScratchByteLength() +
        captureScratchByteLength(),
    ).toBeLessThanOrEqual(16 * 1024 * 1024);
  });

  if (RUN_ENGINE_DEEP) {
    /**
     * `NFR-009`'s own measurement: a 1 s and a `DEFAULT_BUDGET_MS` (4 s) `chooseMove` on kiwipete, each read after
     * `gc()`; `heapUsed` and `arrayBuffers` each move by no more than 1 MiB between them. It runs in
     * a CHILD process started with `--expose-gc`, so the reading needs no flag on the runner and
     * is taken from a process nothing else has touched. `heapUsed` is the read that catches a
     * growing `Map` — a `Map`-backed table grows with search time there and not in `arrayBuffers`
     * — and it was watched going RED against exactly that mutant before this was kept.
     */
    it("heapUsed and arrayBuffers each grow <= 1 MiB between a 1 s and a DEFAULT_BUDGET_MS (4 s) search [deep, ENGINE_DEEP=1]", () => {
      const engineUrl = new URL("./engine.ts", import.meta.url).href;
      const fenUrl = new URL("./fen.ts", import.meta.url).href;
      const script = `
        const { chooseMove } = await import(${JSON.stringify(engineUrl)});
        const { parseFen } = await import(${JSON.stringify(fenUrl)});
        const fen = ${JSON.stringify(fenOf("kiwipete"))};
        const read = () => { gc(); gc(); const m = process.memoryUsage(); return { heapUsed: m.heapUsed, arrayBuffers: m.arrayBuffers }; };
        const one = chooseMove(parseFen(fen), { budgetMs: 1000 }); const a = read();
        const three = chooseMove(parseFen(fen), { budgetMs: ${DEFAULT_BUDGET_MS} }); const b = read();
        console.log(JSON.stringify({ a, b, depths: [one.depth, three.depth] }));
      `;
      const run = spawnSync(
        process.execPath,
        ["--expose-gc", "--input-type=module", "-e", script],
        {
          encoding: "utf8",
        },
      );
      expect(run.status, run.stderr).toBe(0);
      const { a, b, depths } = JSON.parse(run.stdout.trim().split("\n").pop() as string) as {
        a: { heapUsed: number; arrayBuffers: number };
        b: { heapUsed: number; arrayBuffers: number };
        depths: number[];
      };
      const mib = (bytes: number) => (bytes / (1024 * 1024)).toFixed(2);
      console.log(
        `ABC-081 A7 / NFR-009 kiwipete: 1 s (depth ${depths[0]}) heapUsed ${mib(a.heapUsed)} MiB, ` +
          `arrayBuffers ${mib(a.arrayBuffers)} MiB; 3 s (depth ${depths[1]}) heapUsed ` +
          `${mib(b.heapUsed)} MiB, arrayBuffers ${mib(b.arrayBuffers)} MiB`,
      );
      const MIB = 1024 * 1024;
      expect(b.heapUsed - a.heapUsed).toBeLessThanOrEqual(MIB);
      expect(b.arrayBuffers - a.arrayBuffers).toBeLessThanOrEqual(MIB);
      expect(b.arrayBuffers).toBeLessThanOrEqual(16 * MIB);
    }, 60_000);
  }
});

// ---------------------------------------------------------------------------
// ABC-238 (`ADR-0058`) in the search — the switch literals, the rule alive in both recursions, and,
// under `SEARCH_DEEP=1`, the bounded oracle (decision 6), `A4`, and the firing rate (decision 9).
// `A1` (the doors node for node against the pre-ticket shipped path, `G4`) compares two builds and
// runs out of tree, as `ABC-208` / `ABC-229`'s did.
// ---------------------------------------------------------------------------

/** `chooseMove`-shaped `choose` on a frozen clock, deepened to exactly `depth`. */
const deepenWith = (choose: typeof chooseMove, fen: string, depth: number): EngineChoice =>
  choose(parseFen(fen), { budgetMs: 1_000, now: () => 0, maxDepth: depth }) as EngineChoice;

/** Nodes a deeper entry settled while `body` ran. */
function deeperCutsDuring(body: () => unknown): number {
  seen.deeperCuts = 0;
  body();
  return seen.deeperCuts;
}

describe("ABC-238 — deeperCutoffs is on in search() and chooseMove only, and a deeper entry settles nodes there", () => {
  const ENTRIES = [
    { path: "./search.ts", call: "searchRoot(position, depth, {", on: "search" },
    { path: "./engine.ts", call: "deepen(position, options, {", on: "chooseMove" },
  ];
  for (const { path, call, on } of ENTRIES) {
    it(`${path}: each exported entry passes exactly one deeperCutoffs literal, and only ${on}'s is true`, () => {
      const flat = readFileSync(new URL(path, import.meta.url), "utf8").replace(/\s+/g, " ");
      const found: Array<[string, string]> = [];
      for (const chunk of flat.split("export function ").slice(1)) {
        if (!chunk.includes(call)) continue;
        const literals = [...chunk.matchAll(/deeperCutoffs: (true|false)\b/g)].map((m) => m[1]);
        const name = chunk.slice(0, chunk.indexOf("("));
        expect(literals, name).toHaveLength(1);
        found.push([name, literals[0] as string]);
      }
      expect(found.length).toBeGreaterThanOrEqual(path === "./search.ts" ? 13 : 7);
      expect(found.filter(([, value]) => value === "true")).toEqual([[on, "true"]]);
    });
  }

  it("search() and chooseMove settle nodes by a deeper entry on DEEPER_FEN; their doors settle none", () => {
    expect(deeperCutsDuring(() => search(parseFen(DEEPER_FEN), DEEPER_DEPTH))).toBeGreaterThan(0);
    expect(
      deeperCutsDuring(() => searchWithoutDeeperCutoffs(parseFen(DEEPER_FEN), DEEPER_DEPTH)),
    ).toBe(0);
    expect(
      deeperCutsDuring(() => deepenWith(chooseMove, DEEPER_FEN, DEEPER_DEPTH)),
    ).toBeGreaterThan(0);
    expect(
      deeperCutsDuring(() => deepenWith(chooseMoveWithoutDeeperCutoffs, DEEPER_FEN, DEEPER_DEPTH)),
    ).toBe(0);
  });
});

if (RUN_SEARCH_DEEP) {
  const isMate = (score: number): boolean => Math.abs(score) > MATE_SCORE - 1_000;

  /** `src/engine.test.ts`'s mate- and stalemate-adjacent endgames: the 190's last six. */
  const ENDGAMES = [
    "k7/8/1K6/8/8/8/8/1Q6 w - - 0 1",
    "k7/8/1K6/8/8/8/8/1R6 w - - 0 1",
    "7k/8/6K1/8/8/8/8/6Q1 w - - 0 1",
    "8/8/8/4k3/8/8/4P3/4K3 w - - 0 1",
    "8/8/8/8/8/k7/8/KR6 w - - 0 1",
    "8/6p1/8/8/8/8/1P6/k1K5 w - - 0 1",
  ];

  /** `ABC-121`'s 190: the six roots, each one's in-progress children, the endgames. */
  const corpus190 = (): { name: string; fen: string }[] => {
    const out: { name: string; fen: string }[] = [];
    for (const { name, fen } of PERFT_CORPUS) {
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
    return [...out, ...ENDGAMES.map((fen, i) => ({ name: `endgame-${i}`, fen }))];
  };

  /**
   * `A3`'s bar on the 190: >= 95 % of the non-mate rows within 25 cp of the door, and no score
   * where either side is a mate changes sign. The largest drift is a REPORT (`ADR-0058` decision 6:
   * a deeper entry legitimately reports what a deeper search saw), as is the mate-status count.
   */
  const driftBar = (
    on: (fen: string) => number,
    door: (fen: string) => number,
    what: string,
  ): void => {
    const deltas: Array<[number, string]> = [];
    const signFlips: string[] = [];
    let statusChanges = 0;
    for (const { name, fen } of corpus190()) {
      const ref = door(fen);
      const got = on(fen);
      if (isMate(ref) || isMate(got)) {
        if (Math.sign(ref) !== Math.sign(got)) signFlips.push(`${name}: ${ref} -> ${got}`);
        if (isMate(ref) !== isMate(got)) statusChanges++;
        continue;
      }
      deltas.push([Math.abs(got - ref), `${name}: ${ref} -> ${got}`]);
    }
    deltas.sort((a, b) => b[0] - a[0]);
    const within25 = deltas.filter(([delta]) => delta <= 25).length / deltas.length;
    console.log(
      `ABC-238 A3 ${what}: ${(100 * within25).toFixed(2)}% within 25 cp of ${deltas.length}, ` +
        `max ${deltas[0]?.[0] ?? 0} cp (${deltas[0]?.[1] ?? ""}), a report; ` +
        `moved ${deltas.filter(([delta]) => delta > 0).length}; mate sign flips ${signFlips.length}; ` +
        `mate-status changes ${statusChanges} (a report)`,
    );
    expect(deltas.length).toBeGreaterThanOrEqual(100);
    expect(within25).toBeGreaterThanOrEqual(0.95);
    expect(signFlips).toEqual([]);
  };

  describe("ABC-238 A3 — bounded drift against the deeper-cutoff doors, depth 5, the 190 [deep, SEARCH_DEEP=1]", () => {
    it("the corpus is the 190", () => {
      expect(corpus190()).toHaveLength(190);
    });

    it("search() against searchWithoutDeeperCutoffs at fixed depth 5: >= 95% within 25 cp, 0 mate sign flips [deep, SEARCH_DEEP=1]", () => {
      driftBar(
        (fen) => search(parseFen(fen), 5).score,
        (fen) => searchWithoutDeeperCutoffs(parseFen(fen), 5).score,
        "search() d5",
      );
    }, 600_000);

    it("chooseMove against chooseMoveWithoutDeeperCutoffs deepened to 5: >= 95% within 25 cp, 0 mate sign flips [deep, SEARCH_DEEP=1]", () => {
      driftBar(
        (fen) => deepenWith(chooseMove, fen, 5).score,
        (fen) => deepenWith(chooseMoveWithoutDeeperCutoffs, fen, 5).score,
        "chooseMove to d5",
      );
    }, 600_000);
  });

  describe("ABC-238 — the mate sign floor on the 287 at depth 5 [deep, SEARCH_DEEP=1]", () => {
    it("every mate searchWithoutDeeperCutoffs scores at depth 5, search() scores as a mate of the same sign; the distance is reported [deep, SEARCH_DEEP=1]", () => {
      let mates = 0;
      let distanceChanged = 0;
      const violations: string[] = [];
      for (const fen of MATE_CORPUS) {
        const ref = searchWithoutDeeperCutoffs(parseFen(fen), 5).score;
        if (!isMate(ref)) continue;
        mates++;
        const got = search(parseFen(fen), 5).score;
        if (!isMate(got) || Math.sign(got) !== Math.sign(ref)) {
          violations.push(`${fen}: ${ref} on the door, ${got} shipped, depth 5`);
        } else if (got !== ref) {
          distanceChanged++;
        }
      }
      console.log(
        `ABC-238 mate sign floor d5: ${violations.length} of ${mates} violated; ` +
          `${distanceChanged} mate distances changed (a report)`,
      );
      expect(mates).toBeGreaterThanOrEqual(100);
      expect(violations).toEqual([]);
    }, 300_000);
  });

  describe("ABC-238 A4 — search(…, 8).nodes against the door on kiwipete and position-6, REPORTED [deep, SEARCH_DEEP=1]", () => {
    /**
     * `A4`'s bar is nodes <= 0.95 x the door's on both boards (`ADR-0058` falsifier F4). It is NOT
     * MET at this build: kiwipete 1 109 987 / 1 116 785 = 0.9939 x, position-6 1 595 656 /
     * 1 602 457 = 0.9958 x (`se-ABC-238`). The ratio is printed and the row holds only that the
     * rule never adds work here and leaves score and move alone; the 0.95 x verdict is recorded in
     * the notes, not hidden in a re-levelled bar.
     */
    for (const name of ["kiwipete", "position-6"]) {
      it(`${name} at depth 8 [deep, SEARCH_DEEP=1]`, () => {
        const head = search(parseFen(fenOf(name)), 8);
        const door = searchWithoutDeeperCutoffs(parseFen(fenOf(name)), 8);
        console.log(
          `ABC-238 A4 ${name} d8: ${head.nodes} / ${door.nodes} = ${(head.nodes / door.nodes).toFixed(4)}x ` +
            `(bar 0.95x); score ${door.score} -> ${head.score}`,
        );
        expect(head.nodes).toBeLessThan(door.nodes);
      }, 120_000);
    }
  });

  describe("ABC-238 — the firing rate at depth 6 on the 190, REPORTED (ADR-0058 decision 9) [deep, SEARCH_DEEP=1]", () => {
    it("the share of probes a deeper entry settles, search() at fixed depth 6 and chooseMove deepened to 6 [deep, SEARCH_DEEP=1]", () => {
      for (const [what, run] of [
        ["search() d6", (fen: string) => search(parseFen(fen), 6)],
        ["chooseMove to d6", (fen: string) => deepenWith(chooseMove, fen, 6)],
      ] as const) {
        let probes = 0;
        let hits = 0;
        let cuts = 0;
        for (const { fen } of corpus190()) {
          seen.probes = 0;
          seen.hits = 0;
          cuts += deeperCutsDuring(() => run(fen));
          probes += seen.probes;
          hits += seen.hits;
        }
        console.log(
          `ABC-238 firing rate ${what}: ${cuts} deeper cuts / ${probes} probes = ` +
            `${((100 * cuts) / probes).toFixed(3)}% (${((100 * cuts) / hits).toFixed(3)}% of ${hits} hits)`,
        );
        expect(cuts).toBeGreaterThan(0);
      }
    }, 600_000);
  });
}
