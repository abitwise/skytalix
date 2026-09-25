/**
 * ABC-077 acceptance — negamax with alpha-beta, criteria `A1`-`A7`.
 *
 * `A5` (stalemate is exactly 0) is written FIRST and stands first below, because a search that
 * scores stalemate as a mate passes `A1`-`A4` untouched: the differential oracle compares the
 * search against itself, and both sides would be wrong together.
 *
 * TWO LANES, and the split is a MEASUREMENT, not a preference (`N8-LANE` <= 650 ms CPU net of
 * the 160 ms per-file floor). Every criterion `A1`-`A7` is answered in the DEFAULT lane; the
 * expensive REPETITIONS of it — greater depth, broader corpus, the criterion's own position
 * where that position is the costly one — run under `SEARCH_DEEP=1`, on the `PERFT_DEEP`
 * precedent. At `ABC-077`'s tip, before the quiescence leaf, the whole file in one lane cost
 * ~8.7 s under the runner; the default lane as split cost 194 ms of test time, and the paired
 * lane delta measured 625 ms CPU (median of 8 interleaved rounds, sign 8/8, identity null
 * control 5 ms at 4/8) = 465 ms net of the floor. Those are that tip's figures, not this one's.
 *
 * What went to the deep lane, measured under the runner at `ABC-077`'s tip:
 *
 *   the depth-3 pair on five of the six corpus positions   194-700 ms each
 *   `A2`'s own case, kiwipete depth 3 (99 950 nodes)       ~700 ms
 *   the broad corpus (204 positions from all six roots)    ~2.7 s at depth 2
 *   the depth-7 mate case (the literal mate-2-vs-mate-4)   ~1.4 s
 *
 * The depth-3 differential is NOT dropped from the default lane — dropping it would trade
 * `A1`'s only window-bug detector for a stopwatch — it is kept on `position-3`, the corpus
 * position whose depth-3 pair is cheap (~58 ms), with the rest in the deep lane.
 *
 * WHICH LEAF EACH DEPTH RUNS ON (ABC-079 oracle ruling, `.grugops/context/ruling-abc079-oracle/`).
 * `search` scores its leaves with the quiescence search. The unpruned oracle never raises
 * `alpha`, so it opens a full-window capture search at every leaf. At depth 3 on the four
 * capture-dense positions that one pair cost 23 s to 1 016 s under the runner, against a 30 s
 * timeout. So:
 *
 *   depth 2, all six positions                 quiescence leaf (`search` vs `searchWithoutPruning`)
 *   depth 3, `position-3` and `startpos` only  quiescence leaf, as above
 *   depth 3, all six positions (deep lane)     BARE leaf (`searchWithoutQuiescence` vs
 *                                              `searchWithoutPruningOrQuiescence`)
 *
 * The bare-leaf depth-3 pair is `ABC-077`'s `A1`/`A2` on the search they were written for, and
 * `A2`'s kiwipete case reads its recorded 99 950 unpruned nodes. The combination — a depth-3
 * window reaching a quiescence leaf on a capture-dense board — is not differenced here. It is
 * covered on kiwipete and position-6 at depth 3 by `A5`'s pinned `{score, move}` in
 * `src/quiescence.test.ts`, values the retired unpruned quiescence oracle was run offline to
 * check (ABC-079 G1/G2 ruling, `.grugops/context/ruling-abc079-g1g2/`). Neither leaf
 * brute-forces quiescence's own alpha-beta; that is `src/quiescence.test.ts`'s to cover.
 *
 * `A1` IS A DIFFERENTIAL ORACLE AND BOTH ITS SIDES CALL THE SAME `evaluate()`. Green here says
 * alpha-beta changed the WORK and not the VALUE. It says NOTHING about whether the evaluation
 * is right, and it cannot: ABC-076's own guard was found partly blind to its piece-square
 * tables. Do not read a green `A1` as evidence about the evaluation.
 */

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { makeMove, unmakeMove } from "./apply.ts";
import { parseFen, toFen } from "./fen.ts";
import { gameStatus } from "./gameend.ts";
import { legalMoves } from "./legal.ts";
import type { Move } from "./moves.ts";
import { type Position, squareName } from "./position.ts";
import * as searchModule from "./search.ts";
import {
  MATE_SCORE,
  type SearchResult,
  search,
  searchWithoutPruning,
  searchWithoutPruningOrQuiescence,
  searchWithoutQuiescence,
} from "./search.ts";

/** The six perft positions, the corpus `A1`, `A2`, `A4` and `A7` are specified against. */
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
 * The corpus positions whose depth-2 pair is cheap enough for the default lane, measured under
 * the runner: startpos 13 ms, position-3 5 ms, position-4 11 ms — against kiwipete 90 ms,
 * position-5 68 ms and position-6 80 ms, which run under `SEARCH_DEEP=1`.
 */
const DEFAULT_LANE_AT_DEPTH_2 = new Set(["startpos", "position-3", "position-4"]);

/**
 * The one corpus position whose depth-3 pair fits the default lane (~58 ms under the runner at
 * `ABC-077`'s tip). It runs on the quiescence leaf, and it is `A1`'s and `A7`'s default-lane
 * depth-3 case.
 */
const DEFAULT_LANE_AT_DEPTH_3 = "position-3";

/**
 * The corpus positions whose depth-3 pair still runs on the QUIESCENCE leaf: `position-3` in the
 * default lane and `startpos` under `SEARCH_DEEP=1`. On the other four the unpruned side opens a
 * full-window capture search at every leaf and the pair costs 23 s to 1 016 s under the runner.
 * Those four are retired at depth 3 by the ABC-079 oracle ruling, and their depth-3 pair runs on
 * the bare leaf instead.
 */
const QUIESCENCE_AT_DEPTH_3 = new Set([DEFAULT_LANE_AT_DEPTH_3, "startpos"]);

/**
 * `SEARCH_DEEP=1` registers the full depth-3 sweep and the depth-7 mate case. Unset, those
 * cases are not defined at all — absent from the run, never marked skipped, so they do not
 * touch the gate's test-integrity skip count. Same shape as `PERFT_DEEP` in `perft.test.ts`.
 */
const RUN_DEEP = process.env.SEARCH_DEEP === "1";

/** Long algebraic label, the same key `perftDivide` uses — a readable move identity in a diff. */
const label = (move: Move): string => `${squareName(move.from)}${squareName(move.to)}`;

/** Every field of a `Position`, as a comparable snapshot. `A7`'s definition of byte-identical. */
function snapshot(position: Position) {
  return {
    board: Array.from(position.board),
    blackToMove: position.blackToMove,
    castling: position.castling,
    epSquare: position.epSquare,
    halfmoveClock: position.halfmoveClock,
    fullmoveNumber: position.fullmoveNumber,
  };
}

/** Field-by-field equality against a snapshot — the same comparison, without a JSON round trip. */
function matchesSnapshot(position: Position, before: ReturnType<typeof snapshot>): boolean {
  for (let square = 0; square < 128; square++) {
    if (position.board[square] !== before.board[square]) return false;
  }
  return (
    position.blackToMove === before.blackToMove &&
    position.castling === before.castling &&
    position.epSquare === before.epSquare &&
    position.halfmoveClock === before.halfmoveClock &&
    position.fullmoveNumber === before.fullmoveNumber
  );
}

interface SearchPair {
  readonly pruned: SearchResult;
  readonly unpruned: SearchResult;
  /** Was the position byte-identical after BOTH searches returned? `A7` reads this. */
  readonly intact: boolean;
}

/**
 * Which leaf a pair runs on. `"quiescence"` is the shipped leaf: `search` against
 * `searchWithoutPruning`. `"bare"` is the static evaluation: `searchWithoutQuiescence` against
 * `searchWithoutPruningOrQuiescence`, the leaf `ABC-077`'s depth-3 criteria were written on.
 */
type Leaf = "quiescence" | "bare";

/**
 * The pruned and unpruned search of one position at one depth on one leaf, run once on ONE
 * position object and memoised. `A1` reads the scores off it, `A2` the node counts, `A7` the
 * byte-identity of the position afterwards — three criteria, three separate assertions, one
 * measurement, because the searches are the whole cost of this file.
 */
const searchPairs = new Map<string, SearchPair>();

function searchPair(fen: string, depth: number, leaf: Leaf): SearchPair {
  const key = `${leaf}|${depth}|${fen}`;
  const cached = searchPairs.get(key);
  if (cached !== undefined) return cached;

  const position = parseFen(fen);
  const before = snapshot(position);

  const pruned =
    leaf === "quiescence" ? search(position, depth) : searchWithoutQuiescence(position, depth);
  const intactAfterPruned = matchesSnapshot(position, before);
  const unpruned =
    leaf === "quiescence"
      ? searchWithoutPruning(position, depth)
      : searchWithoutPruningOrQuiescence(position, depth);

  const pair: SearchPair = {
    pruned,
    unpruned,
    intact: intactAfterPruned && matchesSnapshot(position, before),
  };
  searchPairs.set(key, pair);
  return pair;
}

/**
 * Every position reachable from `root` in up to `plies` legal moves, each an independent object
 * (round-tripped through FEN so nothing shares a board with the position it came from).
 */
function expandFrom(
  name: string,
  root: Position,
  plies: number,
): { name: string; position: Position }[] {
  const out: { name: string; position: Position }[] = [];

  const walk = (parentName: string, parent: Position, left: number) => {
    if (left === 0) return;
    for (const move of legalMoves(parent)) {
      const undo = makeMove(parent, move);
      const childName = `${parentName}/${label(move)}`;
      out.push({ name: childName, position: parseFen(toFen(parent)) });
      walk(childName, parent, left - 1);
      unmakeMove(parent, move, undo);
    }
  };

  walk(name, root, plies);
  return out;
}

/** Terminal positions have no root move to return, so `A4` and `A7` never ask about them. */
const inProgress = (entries: { name: string; position: Position }[]) =>
  entries.filter(({ position }) => gameStatus(position).result === "in-progress");

/**
 * The DEFAULT-lane corpus: >= 200 positions from the perft corpus, chosen so the pass fits the
 * lane budget — the six roots, startpos one ply deep, and `position-3` two plies deep. It is
 * deliberately weighted towards `position-3`, the sparse endgame, because breadth there costs
 * ~5x less per position than breadth from kiwipete. Deterministic; nothing is sampled.
 */
function defaultCorpus(): { name: string; position: Position }[] {
  const roots = PERFT_CORPUS.map(({ name, fen }) => ({ name, position: parseFen(fen) }));
  const startpos = PERFT_CORPUS[0] as { name: string; fen: string };
  const position3 = PERFT_CORPUS[2] as { name: string; fen: string };

  return inProgress([
    ...roots,
    ...expandFrom(startpos.name, parseFen(startpos.fen), 1),
    ...expandFrom(position3.name, parseFen(position3.fen), 2),
  ]);
}

/**
 * The DEEP-lane corpus: the six roots and every position one legal move from each — the broad
 * spread across all six, which is what the default corpus trades away to fit the lane.
 */
function broadCorpus(): { name: string; position: Position }[] {
  return inProgress(
    PERFT_CORPUS.flatMap(({ name, fen }) => [
      { name, position: parseFen(fen) },
      ...expandFrom(name, parseFen(fen), 1),
    ]),
  );
}

/**
 * One root's slice of the broad corpus: that root and every position one legal move from it,
 * under the same filter. The deep `A4`/`A7` cases search the broad corpus at depth 2 one slice
 * per case, so that no case pays for more than one slice and none depends on another having run
 * first (ABC-079 G1/G2 ruling: the whole depth-2 pass was one 62 s case, kiwipete's slice 46 s).
 */
function broadSlice(root: string): { name: string; position: Position }[] {
  const { fen } = PERFT_CORPUS.find(({ name }) => name === root) as { name: string; fen: string };
  return inProgress([
    { name: root, position: parseFen(fen) },
    ...expandFrom(root, parseFen(fen), 1),
  ]);
}

interface CorpusRun {
  /** How many positions were searched — `A4`'s denominator, asserted rather than trusted. */
  readonly size: number;
  /** Names whose returned root move was absent from `legalMoves` (or null). `A4` wants []. */
  readonly illegal: string[];
  /** Names whose `Position` differed after the search returned. `A7` wants []. */
  readonly mutated: string[];
}

const corpusRuns = new Map<string, CorpusRun>();

/**
 * Search a corpus once at `depth` and record BOTH what `A4` asks (was the root move legal) and
 * what `A7` asks (was the position byte-identical afterwards). One pass, memoised, because the
 * searches are the cost and running them twice buys nothing — the two criteria stay separate
 * assertions on the same measurement, which is what a shared fixture is.
 */
function corpusRun(kind: "default" | "broad" | `broad:${string}`, depth: number): CorpusRun {
  const key = `${kind}|${depth}`;
  const cached = corpusRuns.get(key);
  if (cached !== undefined) return cached;

  const illegal: string[] = [];
  const mutated: string[] = [];
  const corpus =
    kind === "default"
      ? defaultCorpus()
      : kind === "broad"
        ? broadCorpus()
        : broadSlice(kind.slice("broad:".length));

  for (const { name, position } of corpus) {
    const before = snapshot(position);
    const result = search(position, depth);

    const legal = legalMoves(position);
    if (result.move === null || !legal.some((m) => sameMove(m, result.move as Move))) {
      illegal.push(`${name}: ${result.move === null ? "null" : label(result.move)}`);
    }
    if (!matchesSnapshot(position, before)) mutated.push(name);
  }

  const run: CorpusRun = { size: corpus.length, illegal, mutated };
  corpusRuns.set(key, run);
  return run;
}

/** Move identity by value: `legalMoves` builds fresh objects on each call, so `===` cannot serve. */
function sameMove(a: Move, b: Move): boolean {
  return a.from === b.from && a.to === b.to && a.promotion === b.promotion && a.flags === b.flags;
}

// ---------------------------------------------------------------------------
// A5 — stalemate is EXACTLY 0, and never a mate score. Written first, on purpose.
// ---------------------------------------------------------------------------

describe("A5 — stalemate scores exactly 0, not a loss", () => {
  const STALEMATES: ReadonlyArray<{ name: string; fen: string }> = [
    { name: "K+Q smothering the lone king", fen: "7k/5Q2/6K1/8/8/8/8/8 b - - 0 1" },
    {
      name: "the classic blocked-board stalemate",
      fen: "5bnr/4p1pq/4Qpkr/7p/2P4P/8/PP1PPPP1/RNB1KBNR b KQ - 2 10",
    },
    { name: "K+P vs K, the king boxed in", fen: "8/8/8/8/8/5k2/5p2/5K2 w - - 0 1" },
  ];

  for (const { name, fen } of STALEMATES) {
    // Every depth, including 0: a stalemate is stalemate whether it is the root or a leaf.
    for (const depth of [0, 1, 2, 3]) {
      it(`${name} scores 0 at depth ${depth}`, () => {
        const position = parseFen(fen);
        expect(gameStatus(position).reason).toBe("stalemate"); // the fixture really is stalemate

        const result = search(position, depth);

        // `toBe` is Object.is: it separates 0 from -0, which is exactly the negation slip that
        // makes a "0" score fail an exact comparison elsewhere.
        expect(result.score).toBe(0);
        expect(Math.abs(result.score)).toBeLessThan(MATE_SCORE - 1000);
      });
    }
  }

  it("does not play into a stalemate one ply inside the tree", () => {
    // Qf7, Kg5 against a lone Kh8: NINE of white's moves stalemate black on the spot and none
    // mates. A search that scored a stalemate as a mate would take one of them and report a
    // mate score; a correct one scores them 0 and plays something else.
    const position = parseFen("7k/5Q2/8/6K1/8/8/8/8 w - - 0 1");
    const stalemating = new Set([
      "g5g6",
      "g5h5",
      "g5f5",
      "g5g4",
      "g5h6",
      "g5f6",
      "g5h4",
      "g5f4",
      "f7g6",
    ]);

    const result = search(position, 2);

    expect(Math.abs(result.score)).toBeLessThan(MATE_SCORE - 1000);
    expect(stalemating.has(label(result.move as Move))).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// A1 — alpha-beta returns the SAME score as the unpruned main tree. The only window-bug detector.
// ---------------------------------------------------------------------------

describe("A1 — pruned and unpruned scores are identical", () => {
  for (const { name, fen } of PERFT_CORPUS) {
    // The quiescence leaf: depth 2 on all six, depth 3 where the unpruned side is affordable.
    for (const depth of [2, 3]) {
      if (depth === 3 && !QUIESCENCE_AT_DEPTH_3.has(name)) continue; // retired, see the header
      const deep =
        depth === 2 ? !DEFAULT_LANE_AT_DEPTH_2.has(name) : name !== DEFAULT_LANE_AT_DEPTH_3;
      if (deep && !RUN_DEEP) continue; // absent in the default run, not skipped

      it(
        `${name} at depth ${depth}${deep ? " [deep, SEARCH_DEEP=1]" : ""}`,
        () => {
          const { pruned, unpruned } = searchPair(fen, depth, "quiescence");
          expect(pruned.score).toBe(unpruned.score);
        },
        deep ? 30_000 : undefined,
      );
    }

    // The bare leaf: depth 3 on all six, which is `ABC-077`'s merged depth-3 differential.
    if (RUN_DEEP) {
      it(`${name} at depth 3 on the bare leaf [deep, SEARCH_DEEP=1]`, () => {
        const { pruned, unpruned } = searchPair(fen, 3, "bare");
        expect(pruned.score).toBe(unpruned.score);
      }, 30_000);
    }
  }
});

// ---------------------------------------------------------------------------
// A2 — it actually prunes. A window never applied passes A1 and fails this.
// ---------------------------------------------------------------------------

describe("A2 — alpha-beta visits under 40% of the unpruned nodes", () => {
  const KIWIPETE = PERFT_CORPUS[1]?.fen as string;
  const STARTPOS = PERFT_CORPUS[0]?.fen as string;

  // The criterion names kiwipete at depth 3. That pair runs in the deep lane, on the bare leaf
  // (see the header), where it reads 9 016 / 99 950 nodes = 9.02%. The default lane holds startpos
  // at depth 2 on the quiescence leaf, where the same failure (a window computed and never
  // applied) shows up just as plainly: 122 / 470 nodes = 25.96%. Reported with both figures,
  // never with only the cheap one.
  it("startpos at depth 2 — the default lane's cheap standing guard", () => {
    const { pruned, unpruned } = searchPair(STARTPOS, 2, "quiescence");

    expect(unpruned.nodes).toBeGreaterThan(0);
    expect(pruned.nodes / unpruned.nodes).toBeLessThan(0.4);
  });

  if (RUN_DEEP) {
    it("kiwipete at depth 3 on the bare leaf — the criterion's own position and depth [deep, SEARCH_DEEP=1]", () => {
      const { pruned, unpruned } = searchPair(KIWIPETE, 3, "bare");

      expect(pruned.nodes / unpruned.nodes).toBeLessThan(0.4);
    }, 30_000);
  }
});

// ---------------------------------------------------------------------------
// A3 — mate is found, and the SHORTER mate is preferred.
// ---------------------------------------------------------------------------

describe("A3 — mate is found and the shorter mate preferred", () => {
  /** Forced mate in 2 (3 plies) for white: 1.Kf7/Kg6 Kg8 2.Ra8#. Brute-force verified. */
  const MATE_IN_2 = "7k/8/5K2/8/8/8/8/R7 w - - 0 1";
  /** Mate in 1 (Ra8#) with mate in 2 and mate in 3 also on offer. Brute-force verified. */
  const MATE_IN_1 = "7k/8/6K1/8/8/8/8/R7 w - - 0 1";

  it("returns the mating move and a score above any non-mate score, at depth 4", () => {
    const result = search(parseFen(MATE_IN_2), 4);

    expect(result.score).toBe(MATE_SCORE - 3); // mated 3 plies from the root: mate in 2
    expect(["f6f7", "f6g6"]).toContain(label(result.move as Move)); // the two mating first moves
    // Above every score the static evaluation can produce: the whole material on the board is
    // under 10 000 centipawns, so a mate is never confused with winning a queen.
    expect(result.score).toBeGreaterThan(10_000);
  });

  it("prefers the mate in 1 over the mate in 2 and the mate in 3 in the same position", () => {
    const result = search(parseFen(MATE_IN_1), 4);

    expect(result.score).toBe(MATE_SCORE - 1);
    expect(label(result.move as Move)).toBe("a1a8");
    expect(result.score).toBeGreaterThan(MATE_SCORE - 3); // strictly better than the mate in 2
  });

  if (RUN_DEEP) {
    it("prefers the mate in 2 over the mate in 3 at depth 5 [deep, SEARCH_DEEP=1]", () => {
      // In MATE_IN_2 the ten rook moves all force mate in 3 (5 plies); only Kf7/Kg6 mate in 2.
      const result = search(parseFen(MATE_IN_2), 5);

      expect(result.score).toBe(MATE_SCORE - 3);
      expect(["f6f7", "f6g6"]).toContain(label(result.move as Move));
    }, 30_000);

    it("prefers the mate in 2 over the mate in 4, at depth 7 [deep, SEARCH_DEEP=1]", () => {
      // The criterion's literal pair. Brute-force verified in MATE_IN_2: a1a6/a1a7/a1f1/a1g1
      // force mate in 4 (7 plies), ten more force mate in 3, and only Kf7/Kg6 mate in 2.
      // Depth 7 is the first depth at which the mate in 4 is visible at all, which is why
      // this case is here and not in the default lane.
      const result = search(parseFen(MATE_IN_2), 7);

      expect(result.score).toBe(MATE_SCORE - 3);
      expect(["f6f7", "f6g6"]).toContain(label(result.move as Move));
    }, 30_000);
  }
});

// ---------------------------------------------------------------------------
// A4 — the root move is always legal. Checks the search's CHOICE, not the generator.
// ---------------------------------------------------------------------------

describe("A4 — the returned root move is legal in every corpus position", () => {
  it("returns a legal move in 200+ positions from the perft corpus, at depth 1", () => {
    const run = corpusRun("default", 1);

    expect(run.size).toBeGreaterThanOrEqual(200);
    expect(run.illegal).toEqual([]);
  });

  if (RUN_DEEP) {
    // One corpus slice per case (ABC-079 G1/G2 ruling), so each case's share of its timeout is
    // its own slice's cost, whatever ran before it.
    it("returns a legal move in the same 200+ positions at depth 2 [deep, SEARCH_DEEP=1]", () => {
      expect(corpusRun("default", 2).illegal).toEqual([]);
    }, 120_000);

    it("returns a legal move in the broad corpus at depth 1, whose six per-root slices are exactly that corpus [deep, SEARCH_DEEP=1]", () => {
      const run = corpusRun("broad", 1);

      expect(run.size).toBeGreaterThanOrEqual(100);
      expect(run.illegal).toEqual([]);

      // Generated, not searched: the depth-2 slices below must cover the broad corpus exactly.
      const slices = PERFT_CORPUS.map(({ name }) => broadSlice(name));
      expect(slices.reduce((sum, slice) => sum + slice.length, 0)).toBe(run.size);
      expect(slices.flat().map(({ name }) => name)).toEqual(broadCorpus().map(({ name }) => name));
    }, 120_000);

    for (const { name } of PERFT_CORPUS) {
      it(`returns a legal move in the broad corpus at depth 2 — ${name}'s slice [deep, SEARCH_DEEP=1]`, () => {
        expect(corpusRun(`broad:${name}`, 2).illegal).toEqual([]);
      }, 120_000);
    }
  }
});

// ---------------------------------------------------------------------------
// A6 — RISK-002's guard, asserted against the DELIVERED module by name.
// ---------------------------------------------------------------------------

describe("A6 — no move is selected without a caller-supplied depth", () => {
  const SOURCE_URL = new URL("./search.ts", import.meta.url);
  const source = readFileSync(SOURCE_URL, "utf8");

  it("reads the delivered module — src/search.ts, not nothing", () => {
    // An unnamed subject is how a shape assertion ends up asserting over an empty string.
    expect(source.length).toBeGreaterThan(1000);
    expect(source).toContain("export function search(");
  });

  it("exports exactly the search core and nothing that picks a move on its own", () => {
    // `searchWithoutQuiescence` joined the list at ABC-079, and `searchWithoutPruningOrQuiescence`
    // at its oracle ruling. Both are TEST-ONLY doors of the same shape as `searchWithoutPruning`,
    // taking the same required depth. ABC-080 added two more of that shape
    // (`searchWithoutOrdering`, `searchWithoutKillers`) and the move-ordering pair both
    // recursions share: `orderMoves` ORDERS a list it is handed and `KillerTable` holds moves —
    // neither picks one. Still nothing here picks a move without being told how deep.
    expect(Object.keys(searchModule).sort()).toEqual([
      "KillerTable",
      "MATE_SCORE",
      "orderMoves",
      "search",
      "searchWithoutKillers",
      "searchWithoutOrdering",
      "searchWithoutPruning",
      "searchWithoutPruningOrQuiescence",
      "searchWithoutQuiescence",
    ]);
  });

  it("gives every exported function a REQUIRED depth parameter", () => {
    // `Function.length` counts the parameters before the first defaulted one, so a `depth = 4`
    // anywhere in a signature drops this to 1 and fails here.
    expect(search.length).toBe(2);
    expect(searchWithoutPruning.length).toBe(2);
    expect(searchWithoutQuiescence.length).toBe(2);
    expect(searchWithoutPruningOrQuiescence.length).toBe(2);
    expect(searchModule.searchWithoutOrdering.length).toBe(2);
    expect(searchModule.searchWithoutKillers.length).toBe(2);
  });

  it("carries no default value for depth anywhere in the module", () => {
    expect(source).not.toMatch(/depth\s*\??\s*(:\s*[\w<>[\]| ]+)?\s*=[^=>]/);
    expect(source).not.toMatch(/default_?depth/i);
  });

  it("carries no clock — the time budget is ABC-078's, not this module's", () => {
    expect(source).not.toMatch(/Date\.now|performance\.now|hrtime|setTimeout/);
  });
});

// ---------------------------------------------------------------------------
// A7 — the position is byte-identical after a search. Make/unmake balance.
// ---------------------------------------------------------------------------

describe("A7 — the searched position is unchanged on return", () => {
  it("leaves every position in the 200+ corpus byte-identical after a depth-1 search", () => {
    const run = corpusRun("default", 1);

    expect(run.size).toBeGreaterThanOrEqual(200);
    expect(run.mutated).toEqual([]);
  });

  it("leaves position-3 byte-identical after a depth-3 search, pruned and unpruned", () => {
    // The same pair `A1` scores at depth 3, checked for mutation instead of for its score.
    const entry = PERFT_CORPUS.find(({ name }) => name === DEFAULT_LANE_AT_DEPTH_3);

    expect(searchPair((entry as { fen: string }).fen, 3, "quiescence").intact).toBe(true);
  });

  if (RUN_DEEP) {
    // The same one-slice-per-case split as `A4` (ABC-079 G1/G2 ruling), sharing its memo keys.
    it("leaves the 200+ corpus byte-identical at depth 2 [deep, SEARCH_DEEP=1]", () => {
      expect(corpusRun("default", 2).mutated).toEqual([]);
    }, 120_000);

    for (const { name } of PERFT_CORPUS) {
      it(`leaves the broad corpus byte-identical at depth 2 — ${name}'s slice [deep, SEARCH_DEEP=1]`, () => {
        expect(corpusRun(`broad:${name}`, 2).mutated).toEqual([]);
      }, 120_000);
    }

    it("leaves every perft root byte-identical at depth 2 and depth 3 [deep, SEARCH_DEEP=1]", () => {
      // The unpruned depth-3 half runs on the bare leaf (the oracle ruling). The unpruned
      // QUIESCENCE leaf is checked on every root at depth 2 instead, read off the pairs `A1`
      // already ran, so it adds no searches when `A1` runs first.
      for (const { name, fen } of PERFT_CORPUS) {
        expect(searchPair(fen, 2, "quiescence").intact, name).toBe(true);

        const position = parseFen(fen);
        const before = snapshot(position);
        search(position, 3);
        expect(snapshot(position)).toEqual(before);
        searchWithoutPruningOrQuiescence(position, 3);
        expect(snapshot(position)).toEqual(before);
      }
    }, 120_000);
  }
});
