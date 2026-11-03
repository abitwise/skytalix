/**
 * ABC-079 acceptance — quiescence search on captures, criteria `A1`-`A6`.
 *
 * `A2` (stand-pat is a lower bound, not a replacement) is written FIRST and stands first below,
 * per the ticket's own test note: it is the cheapest correctness check, and a quiescence that
 * REPLACED the static evaluation with the capture search would pass `A1` while scoring every
 * quiet leaf wrong.
 *
 * TWO LANES, on the `PERFT_DEEP` / `SEARCH_DEEP` precedent: every criterion is answered in the
 * DEFAULT lane; the expensive REPETITIONS — the depth-2/3 multipliers, the depth-3 corpus arm,
 * the full one-ply expansion of the capture-dense perft roots — run under `SEARCH_DEEP=1`.
 * Unset, those cases are not defined at all: absent from the run, never marked skipped.
 *
 * `A1` IS A DIFFERENTIAL: the same corpus, the same depth, the same `search()` with and without
 * the quiescence leaf (`searchWithoutQuiescence` is the TEST-ONLY door, the same shape as
 * `searchWithoutPruning`). Green says quiescence changed the CHOICE; the baseline arm is what
 * makes the number mean anything.
 *
 * `A5` IS A STOP CONDITION AND IT IS ASSERTED, NOT ADMIRED. The ticket's original 4x tripped at
 * 62x–1 540x and was RULED (`ADR-0024`): the build is sound, the multiplier was UNORDERED
 * captures, and `A5` is re-stated at 1.5x the MVV-LVA-ORDERED reading per position and depth.
 * The multiplier is printed with its node counts and the assertion holds the bar; a red here is
 * the ticket saying "stop and report to Architect/Design", and the number is not to be tuned to
 * fit. Losing the sort reads 6x–30x over the level, which is what the stop must catch.
 *
 * `ABC-228` (`ADR-0053`, the evasion rule) has its rows at the end of this file: `Q-SET`'s in-check
 * and capture-mate rows, the rule rows, the doors and the source rows in the default lane; the
 * node bar, the bounded drift oracle in both recursions and the mate floor under `SEARCH_DEEP=1`.
 * Direct `quiesce` calls above pass the shipped rules; a work reading passes the pre-ticket record.
 */

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { makeMove, unmakeMove } from "./apply.ts";
import {
  chooseMove,
  chooseMoveWithoutFutility,
  chooseMoveWithoutQuiescenceEvasions,
  chooseMoveWithoutQuietPromotions,
  chooseMoveWithoutTaper,
  type EngineChoice,
} from "./engine.ts";
import { evaluate, evaluateWithoutTaper } from "./evaluate.ts";
import { parseFen, toFen } from "./fen.ts";
import { gameStatus } from "./gameend.ts";
import { isInCheck, legalCaptures, legalCapturesAndQueenPromotions, legalMoves } from "./legal.ts";
import type { Move } from "./moves.ts";
import { EMPTY, type Position, QUEEN, squareName } from "./position.ts";
import { HANGING_CORPUS } from "./puzzle-corpus.ts";
import {
  captureScratchByteLength,
  mvvLvaKey,
  orderCaptures,
  QUIESCENCE_MAX_PLY,
  type QuiescenceRules,
  quiesce,
} from "./quiescence.ts";
import { MATE_CORPUS } from "./search.mate-corpus.ts";
import {
  MATE_SCORE,
  search,
  searchWithoutFutility,
  searchWithoutPvsOrReductions,
  searchWithoutQuiescence,
  searchWithoutQuiescenceEvasions,
  searchWithoutQuietPromotions,
  searchWithoutTaper,
} from "./search.ts";

/** The six perft positions — `src/search.test.ts`'s corpus, the capture-dense ones included. */
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

/**
 * `SEARCH_DEEP=1` registers the expensive repetitions. Unset, they are not defined at all —
 * absent from the run, never skipped — so the gate's test-integrity skip count stays 0.
 */
const RUN_DEEP = process.env.SEARCH_DEEP === "1";

/** The shipped quiescence rules (`ABC-228`, `ABC-229`): a direct call passes them, as both recursions do. */
const SHIPPED: QuiescenceRules = { evasions: true, quietPromotions: true };

const label = (move: Move | null): string =>
  move === null ? "null" : `${squareName(move.from)}${squareName(move.to)}`;

/** Every field of a `Position`, as a comparable snapshot — `A6`'s definition of byte-identical. */
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

interface QuiesceRun {
  readonly score: number;
  /** Quiescence nodes entered through a capture. 0 when the position stood pat at once. */
  readonly nodes: number;
  /** The deepest capture ply the recursion reached past the leaf. */
  readonly deepest: number;
}

/** One full-window quiescence search of `position`, with what `A2`/`A3` need observed. */
function quiesceFully(position: Position): QuiesceRun {
  let nodes = 0;
  let deepest = 0;
  const score = quiesce(
    position,
    Number.NEGATIVE_INFINITY,
    Number.POSITIVE_INFINITY,
    0,
    0,
    SHIPPED,
    (qply) => {
      nodes++;
      if (qply > deepest) deepest = qply;
    },
  );
  return { score, nodes, deepest };
}

/** Every position one legal move from `root`, each an independent object. */
function childrenOf(name: string, root: Position): { name: string; position: Position }[] {
  const out: { name: string; position: Position }[] = [];
  for (const move of legalMoves(root)) {
    const undo = makeMove(root, move);
    out.push({ name: `${name}/${label(move)}`, position: parseFen(toFen(root)) });
    unmakeMove(root, move, undo);
  }
  return out;
}

const inProgress = (entries: { name: string; position: Position }[]) =>
  entries.filter(({ position }) => gameStatus(position).result === "in-progress");

/**
 * The DEFAULT-lane corpus for `A3`/`A6`: >= 200 positions — all six perft roots (the
 * capture-dense ones included, each searched from a full window), startpos one ply deep, and
 * `position-3` two plies deep. The one-ply expansion of the FOUR dense roots is the deep lane's:
 * measured at 515 ms for that sweep alone, which is most of `N8-LANE` by itself.
 */
function defaultCorpus(): { name: string; position: Position }[] {
  const roots = PERFT_CORPUS.map(({ name, fen }) => ({ name, position: parseFen(fen) }));
  const startposChildren = childrenOf("startpos", parseFen(fenOf("startpos")));
  const position3Children = childrenOf("position-3", parseFen(fenOf("position-3")));
  const position3Grandchildren = position3Children.flatMap(({ name, position }) =>
    childrenOf(name, position),
  );
  return inProgress([
    ...roots,
    ...startposChildren,
    ...position3Children,
    ...position3Grandchildren,
  ]);
}

/** The DEEP-lane corpus: the six roots and every position one legal move from each. */
function broadCorpus(): { name: string; position: Position }[] {
  return inProgress(
    PERFT_CORPUS.flatMap(({ name, fen }) => [
      { name, position: parseFen(fen) },
      ...childrenOf(name, parseFen(fen)),
    ]),
  );
}

interface CorpusSweep {
  readonly size: number;
  /** The deepest quiescence ply observed over the whole corpus. `A3` bounds it. */
  readonly deepest: number;
  /** Names whose `Position` differed after the search returned. `A6` wants []. */
  readonly mutated: string[];
}

const sweeps = new Map<string, CorpusSweep>();

/** One full-window quiescence search per corpus position, memoised: `A3` and `A6` read it. */
function sweep(kind: "default" | "broad"): CorpusSweep {
  const cached = sweeps.get(kind);
  if (cached !== undefined) return cached;

  const corpus = kind === "default" ? defaultCorpus() : broadCorpus();
  let deepest = 0;
  const mutated: string[] = [];
  for (const { name, position } of corpus) {
    const before = snapshot(position);
    const run = quiesceFully(position);
    if (run.deepest > deepest) deepest = run.deepest;
    if (!matchesSnapshot(position, before)) mutated.push(name);
  }

  const result: CorpusSweep = { size: corpus.length, deepest, mutated };
  sweeps.set(kind, result);
  return result;
}

// ---------------------------------------------------------------------------
// The hanging-piece corpus — A1's fixture set, `HANGING_CORPUS`: its 24 rows live in
// `src/puzzle-corpus.ts` since ABC-084, which extends that corpus there (imported above).
// ---------------------------------------------------------------------------

interface HangingArm {
  /** How many rows chose the losing capture. */
  readonly losing: number;
  readonly chosen: string[];
  /** Names whose `Position` differed after the search returned — `A6` on this corpus too. */
  readonly mutated: string[];
}

function hangingArm(
  searcher: (position: Position, depth: number) => { move: Move | null },
  depth: number,
): HangingArm {
  let losing = 0;
  const chosen: string[] = [];
  const mutated: string[] = [];
  for (const { name, fen, losing: losingMove } of HANGING_CORPUS) {
    const position = parseFen(fen);
    const before = snapshot(position);
    const move = label(searcher(position, depth).move);
    if (!matchesSnapshot(position, before)) mutated.push(name);
    chosen.push(`${name}: ${move}`);
    if (move === losingMove) losing++;
  }
  return { losing, chosen, mutated };
}

// ---------------------------------------------------------------------------
// A2 — stand-pat is a LOWER BOUND, not a replacement. Written first, on purpose.
// ---------------------------------------------------------------------------

describe("A2 — stand-pat is a lower bound on the quiescence value, never a replacement", () => {
  const QUIET: ReadonlyArray<{ name: string; fen: string }> = [
    { name: "king and pawn vs king", fen: "8/8/8/4k3/8/8/4P3/4K3 w - - 0 1" },
    { name: "the start position", fen: fenOf("startpos") },
    // RE-PLACED at `ABC-228`: this row's board was `4k3/8/8/8/8/8/8/Q3K2r w`, where Rh1 gives
    // check. Its premise (quiet, nothing en prise) did not hold, and with evasions in quiescence
    // it reads −544, not the static 423: the king must step off the first rank and Rxa1 follows.
    // The rook moves one square, to h2, so nothing checks; the old board is an `ABC-228` A2 row.
    { name: "queen vs rook, nothing en prise", fen: "4k3/8/8/8/8/8/7r/Q3K3 w - - 0 1" },
    {
      name: "rook vs rook, nothing en prise, black to move",
      fen: "4k3/7r/8/8/8/8/8/R3K3 b - - 0 1",
    },
  ];

  for (const { name, fen } of QUIET) {
    it(`${name}: a quiet position's quiescence value IS the static evaluation, exactly`, () => {
      const position = parseFen(fen);
      const run = quiesceFully(position);

      // `toBe` is Object.is: a `-0` from a stray negation would fail here, as it should.
      expect(run.score).toBe(evaluateWithoutTaper(position));
      expect(run.nodes).toBe(0); // it stood pat: no capture was searched, none existed
      // Through the seam too: a depth-0 search is the leaf itself, quiescence and all — the shipped
      // leaf stands pat on the tapered evaluation (`ABC-269`), its door on the pre-ticket one.
      expect(search(position, 0).score).toBe(evaluate(position));
      expect(searchWithoutTaper(position, 0).score).toBe(evaluateWithoutTaper(position));
    });
  }

  it("a hanging pawn makes the quiescence value STRICTLY greater than the static evaluation", () => {
    // Qd1 takes the undefended d5 pawn; nothing recaptures. Stand-pat is 775 for white; taking
    // the pawn is worth more, and the quiescence value must say so rather than stand pat.
    const position = parseFen("4k3/8/8/3p4/8/8/8/3QK3 w - - 0 1");
    const run = quiesceFully(position);

    expect(run.score).toBeGreaterThan(evaluateWithoutTaper(position));
    expect(run.nodes).toBeGreaterThan(0);
    expect(search(position, 0).score).toBe(run.score);
  });

  it("a DEFENDED pawn does not raise the value: the recapture is seen and the capture declined", () => {
    // Qa1xe5 is answered by Re7xe5. Standing pat (declining) is the quiescence value: the side
    // to move is never forced to capture, which is the whole point of the lower bound.
    const position = parseFen("4k3/4r3/8/4p3/8/8/8/Q3K3 w - - 0 1");
    const run = quiesceFully(position);

    expect(run.score).toBe(evaluateWithoutTaper(position));
    expect(run.nodes).toBeGreaterThan(0); // the capture WAS searched, and rejected
  });
});

// ---------------------------------------------------------------------------
// A1 — the hanging-piece criterion: the losing capture is not chosen, and the baseline is worse.
// ---------------------------------------------------------------------------

describe("A1 — the losing capture is not chosen in >= 19 of 20, and the bare leaf is strictly worse", () => {
  it("carries at least 20 positions, none of them in check for the side to move", () => {
    expect(HANGING_CORPUS.length).toBeGreaterThanOrEqual(20);
    for (const { name, fen, losing } of HANGING_CORPUS) {
      const position = parseFen(fen);
      expect(isInCheck(position), `${name}: the side to move must not be in check`).toBe(false);
      const legal = legalMoves(position).map((move) => label(move));
      expect(legal, `${name}: the losing capture ${losing} must be legal`).toContain(losing);
    }
  });

  it("both arms at depth 1 — with quiescence the losing move is avoided, without it it is played", () => {
    const withQuiescence = hangingArm(search, 1);
    const bareLeaf = hangingArm(searchWithoutQuiescence, 1);
    const size = HANGING_CORPUS.length;

    // >= 19 of 20, scaled to the corpus: at most 1 losing choice per 20 rows.
    expect(withQuiescence.losing, withQuiescence.chosen.join("\n")).toBeLessThanOrEqual(
      Math.floor(size / 20),
    );
    // The baseline must be STRICTLY worse, or the number above says nothing about the change. A
    // comparison of the shipped path with a door, so since `ABC-121` its quiescence side is the
    // pre-`ABC-121` search (`ADR-0026` decision 4); the count above stays on `search()`.
    const preAbc121 = hangingArm(searchWithoutPvsOrReductions, 1);
    expect(bareLeaf.losing).toBeGreaterThan(preAbc121.losing);
    // Measured at this branch tip: 24 of 24 for the bare leaf, 0 of 24 with quiescence. The
    // bare leaf takes the material in EVERY row — the horizon effect in its purest form.
    expect(bareLeaf.losing).toBeGreaterThanOrEqual(size - Math.floor(size / 20));
  });

  if (RUN_DEEP) {
    it("with quiescence the losing move is still avoided at depth 3 [deep, SEARCH_DEEP=1]", () => {
      // At depth 3 the bare leaf sees the recapture too, so the baseline arm is REPORTED here
      // rather than asserted worse: measured 0 of 24 for both arms at this branch tip.
      const withQuiescence = hangingArm(search, 3);
      const bareLeaf = hangingArm(searchWithoutQuiescence, 3);
      console.log(
        `A1 depth 3: losing capture chosen ${withQuiescence.losing}/${HANGING_CORPUS.length} with ` +
          `quiescence, ${bareLeaf.losing}/${HANGING_CORPUS.length} without`,
      );
      expect(withQuiescence.losing).toBeLessThanOrEqual(Math.floor(HANGING_CORPUS.length / 20));
    }, 60_000);
  }
});

// ---------------------------------------------------------------------------
// A3 — it terminates, and the recursion never exceeds the stated cap.
// ---------------------------------------------------------------------------

describe("A3 — quiescence returns on 200+ corpus positions and never exceeds QUIESCENCE_MAX_PLY", () => {
  it("returns on every one of 200+ positions, the capture-dense roots included, under the cap", () => {
    const run = sweep("default");

    expect(run.size).toBeGreaterThanOrEqual(200);
    expect(run.deepest).toBeLessThanOrEqual(QUIESCENCE_MAX_PLY);
  });

  it("the cap BINDS on a runaway rig — twenty queens on alternating squares — and is not exceeded", () => {
    // A board built to capture forever: every queen is attacked and defended many times over.
    // Without the guard this leaf would be a search of its own; with it the recursion reaches
    // the cap exactly and stands pat there. The black king stands on e3, out of every queen's
    // line (on h8 it was in check with white to move, which parseFen rejects since ABC-010).
    // Measured: deepest 8, 4 798 nodes, ~41 ms.
    // RE-FOUND at ABC-083: under king safety and mobility that rig stands pat at ply 4 after 8
    // nodes, so the cap no longer binds there. A fifth rank of black queens on rank 4, kings on
    // a1/e1, binds it on the base, king-safety-only and shipped evaluators alike: deepest 8, 6 878
    // nodes, ~36 ms (`.grugops/context/ticket-to-pr-ABC-083/probe/rigscan.out.jsonl`).
    const rig = parseFen("q1q1q1q1/1Q1Q1Q1Q/q1q1q1q1/1Q1Q1Q1Q/q1q1q1q1/8/8/K3k3 w - - 0 1");
    const run = quiesceFully(rig);

    expect(run.deepest).toBe(QUIESCENCE_MAX_PLY);
    expect(Number.isFinite(run.score)).toBe(true);
  });

  if (RUN_DEEP) {
    it("returns on the six roots and every one-ply child, under the cap [deep, SEARCH_DEEP=1]", () => {
      const run = sweep("broad");

      expect(run.size).toBeGreaterThanOrEqual(100);
      expect(run.deepest).toBeLessThanOrEqual(QUIESCENCE_MAX_PLY);
    }, 60_000);
  }
});

// ---------------------------------------------------------------------------
// A4 — quiet positions score IDENTICALLY to the pre-quiescence build.
// ---------------------------------------------------------------------------

describe("A4 — a position with no capture anywhere near the leaves scores exactly as before", () => {
  /**
   * No capture is reachable inside the horizon OR at any leaf: kings and pawns too far apart
   * to meet within the depth. `searchWithoutQuiescence` is the pre-`ABC-079` leaf by
   * construction; equal NODE counts are the proof that no quiescence node was ever entered.
   */
  const QUIET: ReadonlyArray<{ name: string; fen: string; depths: number[] }> = [
    { name: "bare kings", fen: "4k3/8/8/8/8/8/8/4K3 w - - 0 1", depths: [1, 2, 3, 4] },
    // The black king is four king-moves from anything: no capture is reachable inside 4 plies.
    {
      name: "king and pawn vs a far king",
      fen: "7k/8/8/8/8/8/4P3/4K3 w - - 0 1",
      depths: [1, 2, 3, 4],
    },
    { name: "two far-apart pawns", fen: "8/p7/8/8/8/8/P7/K6k w - - 0 1", depths: [1, 2, 3, 4] },
    { name: "the start position", fen: fenOf("startpos"), depths: [1] },
  ];

  for (const { name, fen, depths } of QUIET) {
    for (const depth of depths) {
      // The pre-`ABC-121` search since `ABC-121`: a node-count row (`ADR-0026` decision 4).
      it(`${name} at depth ${depth}: same score, same move, same node count`, () => {
        const withQuiescence = searchWithoutPvsOrReductions(parseFen(fen), depth);
        const bareLeaf = searchWithoutQuiescence(parseFen(fen), depth);

        expect(withQuiescence.score).toBe(bareLeaf.score);
        expect(label(withQuiescence.move)).toBe(label(bareLeaf.move));
        expect(withQuiescence.nodes).toBe(bareLeaf.nodes);
      });
    }
  }

  it("the bare-leaf door IS the pre-quiescence build: position-6 at depth 2 reproduces its recorded fingerprint", () => {
    // `src/engine.test.ts` recorded the merged (pre-quiescence) search on position-6 at depth 2
    // as 562 nodes choosing g5f6, measured at the ABC-078 branch tip. The door must reproduce
    // both, or "identical to the pre-quiescence build" is being asserted against nothing.
    // RE-MEASURED at ABC-080: the door orders its moves like `search` (it must — `A4` above
    // compares their node counts), so the same search reads 136 nodes and the SAME move, g5f6.
    // 562 is the unordered figure and nothing in the tree reproduces it any more.
    const result = searchWithoutQuiescence(parseFen(fenOf("position-6")), 2);

    expect(result.nodes).toBe(136);
    expect(label(result.move)).toBe("g5f6");
  });

  if (RUN_DEEP) {
    it("position-6 at depth 3 reproduces the recorded 2 398 nodes and c3d5 [deep, SEARCH_DEEP=1]", () => {
      // 14 565 unordered; 2 273 ordered at ABC-080, the same move.
      // RE-MEASURED at ABC-083 (king safety and mobility move the bare leaf): 2 355, the same
      // move (`.grugops/context/ticket-to-pr-ABC-083/probe/rows.ts`, DEEP=1; base 2 273).
      // RE-PINNED at ABC-215 (the evaluation values made by rule move the bare leaf): 2 398, the
      // same move (a node script on base and build; base 2 355).
      const result = searchWithoutQuiescence(parseFen(fenOf("position-6")), 3);

      expect(result.nodes).toBe(2_398);
      expect(label(result.move)).toBe("c3d5");
    }, 30_000);
  }
});

// ---------------------------------------------------------------------------
// A5 — the cost is bounded and REPORTED. Above the level the ticket stops; this is where it stops.
// ---------------------------------------------------------------------------

describe("A5 — the node-count multiplier on kiwipete and position-6 is reported, and bounded per ADR-0024", () => {
  /**
   * `ADR-0024` decision 3: 1.5x the ORDERED figure the ruling measured (kiwipete 120.2x / 33.2x /
   * 45.0x, position-6 6.3x / 17.4x / 8.3x at depths 1–3), indexed `[depth]`. Node counts are
   * deterministic, so the headroom absorbs legitimate evaluator changes, not noise. Not a number
   * to tune: over the level, halt and report to Architect/Design.
   *
   * RE-LEVELLED at `ABC-083` on the owner's word (`ADR-0039` decision 3, accepted 2026-10-11):
   * position-6 depth 2 only, 26x → 42x, 1.5x the mobility build's 3 871 / 136 = 28.46x. Every other
   * cell is unchanged. Quiescence with its MVV-LVA sort removed reads 572.57x there, still red.
   */
  const STOP_LEVEL: Readonly<Record<string, readonly number[]>> = {
    kiwipete: [Number.NaN, 180, 50, 70],
    "position-6": [Number.NaN, 10, 42, 13],
  };
  const stopLevel = (name: string, depth: number): number =>
    (STOP_LEVEL[name] as readonly number[])[depth] as number;

  /**
   * The depth-3 ANSWER on both boards, pinned beside the ratio (ABC-079 G1/G2 ruling,
   * `.grugops/context/ruling-abc079-g1g2/`). These are the retired unpruned quiescence oracle's
   * answers: that ruling ran `searchWithoutPruning(p, 3)` offline and it equals `search(p, 3)` on
   * score AND move on both boards. They close QE's G1 — a depth-3 window reaching a quiescence
   * leaf on a capture-dense board — which no differential row covers: the seeded window slips
   * `R2b`/`R2c` move kiwipete to e5g6 / 205 and position-6 to 120 and red nothing else. Like
   * that oracle, they check the main tree and the window it hands the leaf, not `quiesce`'s own
   * inner alpha-beta. Node counts are deliberately NOT pinned: the levels above govern cost and
   * tolerate evaluator drift on purpose. These values WILL legitimately move on an evaluator or
   * move-generation change. Then re-run `searchWithoutPruning(parseFen(<fen>), 3)` in plain node
   * (~160 s kiwipete, ~28 s position-6) and re-pin ONLY when it equals `search()` on both score
   * and move. Re-pinning to whatever `search()` says, with no oracle run, is a defect.
   *
   * RE-PINNED at `ABC-082` (the pawn-structure term, an evaluator change) by that rule: the oracle
   * was re-run in plain node on the build and equals `searchWithoutPvsOrReductions` AND `search()`
   * on score and move on both boards — kiwipete 55 / e2a6 (was 50; 282 s), position-6 55 / c3d5
   * (was 30; 38 s). The moves did not change.
   *
   * RE-PINNED at `ABC-083` (king safety and mobility) by the same rule: the oracle, re-run in plain
   * node on the build, equals `searchWithoutPvsOrReductions` AND `search()` on score and move on
   * both boards — kiwipete 70 / e2a6 (was 55; 398 s), position-6 84 / c3d5 (was 55; 63 s)
   * (`.grugops/context/ticket-to-pr-ABC-083/probe/oracle-branch.jsonl`). The moves did not change.
   *
   * RE-PINNED at `ABC-215` (the evaluation values made by rule) by the same rule: the oracle, re-run
   * in plain node on the build, equals `searchWithoutPvsOrReductions` AND `search()` on score and
   * move on both boards — kiwipete 8 / e2a6 (was 70; 68 705 431 oracle nodes), position-6 85 / c3d5
   * (was 84; 12 929 308). The moves did not change.
   */
  const ORACLE_AT_DEPTH_3: Readonly<Record<string, { score: number; move: string }>> = {
    kiwipete: { score: 8, move: "e2a6" },
    "position-6": { score: 85, move: "c3d5" },
  };

  /**
   * One search per call: the ratio, and the result the depth-3 pin reads off it. Since `ABC-121`
   * the quiescence side is the pre-`ABC-121` search, `searchWithoutPvsOrReductions` (`ADR-0026`
   * decision 4) — the search the levels and the oracle-checked answers were measured on.
   */
  function multiplier(
    name: string,
    depth: number,
  ): { ratio: number; result: ReturnType<typeof search> } {
    const position = parseFen(fenOf(name));
    const bareLeaf = searchWithoutQuiescence(position, depth);
    const withQuiescence = searchWithoutPvsOrReductions(position, depth);
    const ratio = withQuiescence.nodes / bareLeaf.nodes;
    console.log(
      `A5 ${name} depth ${depth}: ${withQuiescence.nodes} nodes with quiescence / ` +
        `${bareLeaf.nodes} without = ${ratio.toFixed(2)}x`,
    );
    return { ratio, result: withQuiescence };
  }

  for (const name of ["kiwipete", "position-6"]) {
    it(`${name} at depth 1 — the default lane's cheap reading, level ${stopLevel(name, 1)}x`, () => {
      expect(multiplier(name, 1).ratio).toBeLessThanOrEqual(stopLevel(name, 1));
    });
  }

  if (RUN_DEEP) {
    for (const name of ["kiwipete", "position-6"]) {
      it(`${name} at depth 2, level ${stopLevel(name, 2)}x [deep, SEARCH_DEEP=1]`, () => {
        expect(multiplier(name, 2).ratio).toBeLessThanOrEqual(stopLevel(name, 2));
      }, 120_000);

      const oracle = ORACLE_AT_DEPTH_3[name] as { score: number; move: string };
      it(`${name} at depth 3, level ${stopLevel(name, 3)}x, and the oracle-checked answer ${oracle.score} / ${oracle.move} [deep, SEARCH_DEEP=1]`, () => {
        const { ratio, result } = multiplier(name, 3);

        expect(ratio).toBeLessThanOrEqual(stopLevel(name, 3));
        expect(result.score).toBe(oracle.score);
        expect(label(result.move)).toBe(oracle.move);
      }, 120_000);
    }
  }
});

// ---------------------------------------------------------------------------
// A6 — the input position is byte-identical after every search, over the corpus.
// ---------------------------------------------------------------------------

describe("A6 — the searched position is unchanged on return", () => {
  it("leaves every one of the 200+ corpus positions byte-identical after a quiescence search", () => {
    const run = sweep("default");

    expect(run.size).toBeGreaterThanOrEqual(200);
    expect(run.mutated).toEqual([]);
  });

  it("leaves every hanging-piece position byte-identical after a depth-1 search, both arms", () => {
    expect(hangingArm(search, 1).mutated).toEqual([]);
    expect(hangingArm(searchWithoutQuiescence, 1).mutated).toEqual([]);
  });

  it("leaves the position byte-identical when the visitor THROWS mid-sequence — the engine's abort path", () => {
    // `src/engine.ts` aborts by throwing from inside the recursion; the capture on the board
    // when it throws must still be unmade on the way out.
    const position = parseFen(fenOf("kiwipete"));
    const before = snapshot(position);
    const abort = new Error("test abort");

    expect(() =>
      quiesce(
        position,
        Number.NEGATIVE_INFINITY,
        Number.POSITIVE_INFINITY,
        0,
        0,
        SHIPPED,
        (qply) => {
          if (qply >= 3) throw abort;
        },
      ),
    ).toThrow(abort);
    expect(snapshot(position)).toEqual(before);
  });

  if (RUN_DEEP) {
    it("leaves the broad corpus byte-identical [deep, SEARCH_DEEP=1]", () => {
      expect(sweep("broad").mutated).toEqual([]);
    }, 60_000);
  }
});

// ---------------------------------------------------------------------------
// ABC-240 (P2) — the capture sort without a per-comparison key equals today's stable sort.
// The walk is ABC-206 A2's: the perft roots and its terminal FENs, depth 1 in the lane and
// depth 3 (285 074 positions) under `ENGINE_DEEP=1`. C1 and C2 have a targeted row each.
// ---------------------------------------------------------------------------

/** `ABC-240`'s walk to depth 3 is the `ENGINE_DEEP` lane's (`arch-ABC-235` cut 6). */
const RUN_ENGINE_DEEP = process.env.ENGINE_DEEP === "1";

/** THE REFERENCE: quiescence's sort before `ABC-240` (merge base `0e0ef856`), verbatim. */
const referenceOrderCaptures = (captures: Move[]): void => {
  captures.sort((a, b) => mvvLvaKey(b) - mvvLvaKey(a));
};

/** ABC-206 A2's terminal and clock FENs (`src/legal.test.ts`), walked with the perft roots. */
const WALK_TERMINAL_FENS: ReadonlyArray<{ name: string; fen: string }> = [
  { name: "checkmate", fen: "4Q2k/6pp/8/8/8/8/8/6K1 b - - 100 80" },
  { name: "stalemate, thin", fen: "7k/5K2/5N2/8/8/8/8/8 b - - 0 1" },
  { name: "stalemate, queen", fen: "k7/8/1K6/8/8/8/8/2Q5 b - - 0 1" },
  { name: "insufficient material", fen: "4k3/8/8/8/8/8/8/4K3 w - - 0 1" },
  { name: "seventy-five moves", fen: "r3k3/8/8/8/8/8/8/4K2R w - - 150 120" },
  { name: "fifty-move claim, in progress", fen: "r3k3/8/8/8/8/8/8/4K2R w - - 100 120" },
];

/** Both orders hold the same `Move` objects in the same slots. */
const sameOrder = (a: readonly Move[], b: readonly Move[]): boolean =>
  a.length === b.length && a.every((move, i) => move === b[i]);

/**
 * Every node of the walk, to `depth` plies: `orderCaptures` on the legal captures in generation
 * order, and on the same list reversed (ties in a non-generation order), each equal to the
 * reference by `Move` identity, element by element. Returns the nodes and captures seen.
 */
function walkCaptureOrder(depth: number): { nodes: number; captures: number; failures: string[] } {
  let nodes = 0;
  let captures = 0;
  const failures: string[] = [];
  const visit = (position: Position, where: string, left: number): void => {
    nodes++;
    const generated = legalCaptures(position);
    captures += generated.length;
    for (const [variant, input] of [generated, generated.slice().reverse()].entries()) {
      const want = input.slice();
      referenceOrderCaptures(want);
      const got = input.slice();
      orderCaptures(got);
      if (!sameOrder(got, want)) failures.push(`${where} variant ${variant}: order differs`);
    }
    if (left === 0) return;
    for (const move of legalMoves(position)) {
      const undo = makeMove(position, move);
      visit(position, `${where}/${label(move)}`, left - 1);
      unmakeMove(position, move, undo);
    }
  };
  for (const { name, fen } of [...PERFT_CORPUS, ...WALK_TERMINAL_FENS])
    visit(parseFen(fen), name, depth);
  return { nodes, captures, failures };
}

describe("ABC-240 (P2) — quiescence's capture order equals today's stable sort", () => {
  it("on every node of the perft roots and terminal FENs to depth 1, as given and reversed", () => {
    const { nodes, captures, failures } = walkCaptureOrder(1);
    expect(failures).toEqual([]);
    expect(nodes).toBeGreaterThan(200); // the denominators, asserted
    expect(captures).toBeGreaterThan(500);
  });

  if (RUN_ENGINE_DEEP) {
    it("on ABC-206's 285 074-position walk to depth 3 [deep, ENGINE_DEEP=1]", () => {
      const { nodes, captures, failures } = walkCaptureOrder(3);
      expect(failures).toEqual([]);
      expect(nodes).toBe(285_074);
      expect(captures).toBeGreaterThan(1_000_000);
    }, 600_000);
  }

  it("C1: captures with one key keep their given order, both ways round", () => {
    const captures = legalCaptures(parseFen(fenOf("kiwipete")));
    const tied = captures.find((move) =>
      captures.some((other) => other !== move && mvvLvaKey(other) === mvvLvaKey(move)),
    ) as Move;
    const twins = captures.filter((move) => mvvLvaKey(move) === mvvLvaKey(tied));
    expect(twins.length).toBeGreaterThanOrEqual(2);
    for (const input of [twins, twins.slice().reverse()]) {
      const got = input.slice();
      orderCaptures(got);
      expect(sameOrder(got, input)).toBe(true);
    }
  });

  it("C2: NxP before BxP before QxP of one pawn, whatever the given order", () => {
    // Keys 100 - 0.32, 100 - 0.33, 100 - 0.9: an int32 key merges all three. (Without the
    // full-width tier's 1 000 000 a float32 key still parts them; the walk above catches it.)
    const captures = legalCaptures(parseFen("4k3/8/8/3p4/8/2N5/B7/3QK3 w - - 0 1"));
    expect(captures.length).toBe(3);
    for (const input of [captures, captures.slice().reverse()]) {
      const got = input.slice();
      orderCaptures(got);
      expect(got.map((move) => move.piece & 7)).toEqual([2, 3, 5]);
      const want = input.slice();
      referenceOrderCaptures(want);
      expect(sameOrder(got, want)).toBe(true);
    }
  });

  it("sorts the list it is handed in place, keeping exactly its moves, with a fixed scratch", () => {
    const captures = legalCaptures(parseFen(fenOf("kiwipete")));
    const before = new Set(captures);
    orderCaptures(captures);
    expect(captures.length).toBe(before.size);
    expect(captures.every((move) => before.has(move))).toBe(true);
    expect(captureScratchByteLength()).toBe(256 * 8);
  });
});

// ---------------------------------------------------------------------------
// ABC-228 (`ADR-0053` decisions 2-4 and 6-9) — in check, quiescence searches every evasion and
// scores none as mate. `Q-SET`'s rows, the rule rows, the doors, the source rows; the node bar,
// the bounded drift oracle and the mate floor in the deep lane.
// ---------------------------------------------------------------------------

/** The pre-`ABC-228` rules (and so pre-`ABC-229`): a work reading and the reference arm pass these. */
const PRE_ABC228: QuiescenceRules = { evasions: false, quietPromotions: false };
/** The pre-`ABC-229` rules, evasions on: what `ABC-229`'s doors hand `quiesce` (`ADR-0053` decision 6). */
const PRE_ABC229: QuiescenceRules = { evasions: true, quietPromotions: false };

/** A full-window `quiesce` at `qply` 0 under `rules`, the leaf `ply` plies from the root. */
const quiesceAt = (fen: string, rules: QuiescenceRules, ply = 0, qply = 0): number =>
  quiesce(
    parseFen(fen),
    Number.NEGATIVE_INFINITY,
    Number.POSITIVE_INFINITY,
    qply,
    ply,
    rules,
    () => {},
  );

/**
 * THE BRUTE-FORCE REFERENCE (`ABC-228` test note 2): the evasion rule as plain minimax, with no
 * window, no cutoff and no ordering, written here and not in `src/`. In check below the cap every
 * legal move is tried and none is mate at `ply + qply`; otherwise the static score, raised by any
 * capture. Its value is the exact one a full-window fail-soft `quiesce` must return.
 *
 * `ABC-229`'s twin: with `rules.quietPromotions`, out of check the quiet promotions to a queen are
 * tried too, found here by filtering `legalMoves` — an independent derivation, not the one-pass
 * generator `quiesce` uses.
 */
function bruteForce(position: Position, qply: number, ply: number, rules: QuiescenceRules): number {
  if (rules.evasions && qply < QUIESCENCE_MAX_PLY && isInCheck(position)) {
    const evasions = legalMoves(position);
    if (evasions.length === 0) return 0 - (MATE_SCORE - (ply + qply));
    let best = Number.NEGATIVE_INFINITY;
    for (const move of evasions) {
      const undo = makeMove(position, move);
      const score = 0 - bruteForce(position, qply + 1, ply, rules);
      unmakeMove(position, move, undo);
      if (score > best) best = score;
    }
    return best;
  }
  let best = evaluateWithoutTaper(position);
  if (qply >= QUIESCENCE_MAX_PLY) return best;
  const moves = rules.quietPromotions
    ? legalMoves(position).filter((m) => m.captured !== EMPTY || m.promotion === QUEEN)
    : legalCaptures(position);
  for (const move of moves) {
    const undo = makeMove(position, move);
    const score = 0 - bruteForce(position, qply + 1, ply, rules);
    unmakeMove(position, move, undo);
    if (score > best) best = score;
  }
  return best;
}

/**
 * `Q-SET`, in check (`ADR-0053` decision 9, `A2`): the side to move is in check at `qply` 0. Q2 is
 * the SA's probe row; the others cover the kinds the ADR names. NOT FROZEN BY QE before this build
 * (`EPIC-010` § Common gates asks it to be): the SE wrote them. QE's freeze-review (`qe-ABC-228`)
 * held all of them, and QE's own rows are `QE_IN_CHECK` and `QE-M1`..`QE-M3` below.
 */
const Q_SET_IN_CHECK: ReadonlyArray<{ name: string; fen: string; evasions: number }> = [
  {
    name: "Q2: a quiet king move is the only kind of evasion",
    fen: "4k3/8/8/8/8/8/4R3/4K3 b - - 0 1",
    evasions: 4,
  },
  {
    name: "a block by interposition, Bf1, the only evasion",
    fen: "6k1/5ppp/8/8/2B5/8/5PPP/r5K1 w - - 0 1",
    evasions: 1,
  },
  {
    name: "a capture of the checker, Qxd2 or Kxd2",
    fen: "4k3/8/8/8/8/8/3q4/3QK3 w - - 0 1",
    evasions: 3,
  },
  // `ABC-079` `A2`'s old "queen vs rook" board: the king steps off the rank and Rxa1 follows.
  {
    name: "an evasion that loses material to a follow-up capture",
    fen: "4k3/8/8/8/8/8/8/Q3K2r w - - 0 1",
    evasions: 3,
  },
  {
    name: "a double check: Rxb5 does not evade, only king moves do",
    fen: "4k3/8/8/rB6/8/8/8/4R1K1 b - - 0 1",
    evasions: 3,
  },
  {
    name: "an evasion that is itself a promotion, e8 blocking the rook",
    fen: "K6r/4P3/8/8/8/8/8/k7 w - - 0 1",
    evasions: 6,
  },
];

/**
 * `Q-SET`, a capture that mates (`A3`): each reads `±(MATE_SCORE - (ply + qply))`. `ply` is 0 on a
 * direct call; the last row runs through `search()` at depth 1. Same freeze note as above.
 */
const Q_SET_MATES: ReadonlyArray<{ name: string; fen: string; score: number }> = [
  {
    name: "Q1: Qxf7 mates at qply 1",
    fen: "r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4",
    score: MATE_SCORE - 1,
  },
  {
    name: "after a two-capture exchange: Rxf8+ Qxf8 Rxf8 mates at qply 3",
    fen: "5r1k/6pp/3q4/8/8/8/5RPP/5RK1 w - - 0 1",
    score: MATE_SCORE - 3,
  },
  {
    name: "a capturing promotion: cxd8=Q mates",
    fen: "k2r4/ppP5/8/8/8/8/8/7K w - - 0 1",
    score: MATE_SCORE - 1,
  },
  {
    name: "an en-passant capture: exd6 opens the e-file and mates",
    fen: "3rkr2/5p2/1N6/3pP3/8/8/8/4R2K w - d6 0 2",
    score: MATE_SCORE - 1,
  },
];

/** `A3`: Rxe8+ leaves Kh7 as black's ONE evasion, so this row must NOT read a mate score. */
const ONE_EVASION = "4n1k1/5pp1/8/8/8/8/5PPP/4R1K1 w - - 0 1";
/** `A3` through `search()`: Rd8+ (full width) Ne8 (an evasion in quiescence) Rxe8 mates, 3 plies. */
const MATE_THROUGH_SEARCH = "6k1/2n2ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1";

const deepenWith = (choose: typeof chooseMove, fen: string, depth: number): EngineChoice =>
  choose(parseFen(fen), { budgetMs: 1_000, now: () => 0, maxDepth: depth }) as EngineChoice;

describe("ABC-228 A2 — in check, quiesce searches every evasion: Q-SET's in-check rows", () => {
  it("carries six rows, Q2 among them, each with the side to move in check", () => {
    expect(Q_SET_IN_CHECK).toHaveLength(6);
    expect(Q_SET_IN_CHECK.some(({ fen }) => fen === "4k3/8/8/8/8/8/4R3/4K3 b - - 0 1")).toBe(true);
    for (const { name, fen, evasions } of Q_SET_IN_CHECK) {
      expect(isInCheck(parseFen(fen)), name).toBe(true);
      expect(legalMoves(parseFen(fen)), name).toHaveLength(evasions);
    }
    // The kinds the rows claim: a promotion among the evasions, and a capture of the checker.
    expect(
      legalMoves(parseFen(Q_SET_IN_CHECK[5]?.fen as string)).some((m) => m.promotion !== 0),
    ).toBe(true);
    expect(
      legalMoves(parseFen(Q_SET_IN_CHECK[2]?.fen as string)).some((m) => m.captured !== 0),
    ).toBe(true);
  });

  for (const { name, fen } of Q_SET_IN_CHECK) {
    it(`${name}: differs from the static score, equals the best evasion's and the brute force`, () => {
      const position = parseFen(fen);
      const score = quiesceAt(fen, SHIPPED);
      expect(score).not.toBe(evaluateWithoutTaper(position));
      // The best evasion's quiescence score, one ply deeper, each searched from a full window.
      let best = Number.NEGATIVE_INFINITY;
      for (const move of legalMoves(position)) {
        const undo = makeMove(position, move);
        best = Math.max(
          best,
          0 -
            quiesce(
              position,
              Number.NEGATIVE_INFINITY,
              Number.POSITIVE_INFINITY,
              1,
              0,
              SHIPPED,
              () => {},
            ),
        );
        unmakeMove(position, move, undo);
      }
      expect(score).toBe(best);
      expect(score).toBe(bruteForce(parseFen(fen), 0, 0, SHIPPED));
    });
  }

  it("Q2 reads −536 where the static score is −548, and the pre-ticket rules stand pat at −548", () => {
    // `ADR-0053` finding 1, probe Q2.
    expect(quiesceAt("4k3/8/8/8/8/8/4R3/4K3 b - - 0 1", SHIPPED)).toBe(-536);
    expect(quiesceAt("4k3/8/8/8/8/8/4R3/4K3 b - - 0 1", PRE_ABC228)).toBe(-548);
  });
});

describe("ABC-228 A3 — a capture that mates scores mate, at the right sign and distance", () => {
  it("carries six rows: Q1, the exchange, the promotion, en passant, one evasion, and search()", () => {
    expect(Q_SET_MATES).toHaveLength(4);
    expect([...Q_SET_MATES.map(({ fen }) => fen), ONE_EVASION, MATE_THROUGH_SEARCH]).toHaveLength(
      6,
    );
    expect(Q_SET_MATES[0]?.fen).toBe(
      "r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4",
    );
    for (const { name, fen } of [...Q_SET_MATES, { name: "one", fen: ONE_EVASION }]) {
      expect(isInCheck(parseFen(fen)), name).toBe(false);
    }
  });

  for (const { name, fen, score } of Q_SET_MATES) {
    it(`${name}: quiesce reads ${score}, the brute force agrees, the pre-ticket rules do not`, () => {
      expect(quiesceAt(fen, SHIPPED)).toBe(score);
      expect(bruteForce(parseFen(fen), 0, 0, SHIPPED)).toBe(score);
      expect(Math.abs(quiesceAt(fen, PRE_ABC228))).toBeLessThan(MATE_SCORE - 1_000);
    });

    it(`${name}: the same mate from a leaf 5 plies down reads 5 plies further`, () => {
      expect(quiesceAt(fen, SHIPPED, 5)).toBe(score - 5);
    });
  }

  it("the mated side reads the negated score: Q1 after Qxf7, black at qply 1, is −(MATE_SCORE − 1)", () => {
    const position = parseFen(Q_SET_MATES[0]?.fen as string);
    const qxf7 = legalCaptures(position).find((m) => label(m) === "h5f7") as Move;
    makeMove(position, qxf7);
    expect(legalMoves(position)).toHaveLength(0);
    expect(
      quiesce(
        position,
        Number.NEGATIVE_INFINITY,
        Number.POSITIVE_INFINITY,
        1,
        0,
        SHIPPED,
        () => {},
      ),
    ).toBe(0 - (MATE_SCORE - 1));
  });

  it("exactly one evasion is not mate: Rxe8+ Kh7, and the score is the brute force's", () => {
    const position = parseFen(ONE_EVASION);
    const rxe8 = legalCaptures(position).find((m) => label(m) === "e1e8") as Move;
    makeMove(position, rxe8);
    expect(isInCheck(position)).toBe(true);
    expect(legalMoves(position).map(label)).toEqual(["g8h7"]);
    const score = quiesceAt(ONE_EVASION, SHIPPED);
    expect(Math.abs(score)).toBeLessThan(MATE_SCORE - 1_000);
    expect(score).toBe(bruteForce(parseFen(ONE_EVASION), 0, 0, SHIPPED));
  });

  it("through search() at depth 1: Rd8+ Ne8 Rxe8 mates three plies from the root, MATE_SCORE − 3", () => {
    const result = search(parseFen(MATE_THROUGH_SEARCH), 1);
    expect(result.score).toBe(MATE_SCORE - 3);
    expect(label(result.move as Move)).toBe("d1d8");
    // The door, the pre-`ABC-228` search, does not see it at depth 1.
    expect(
      Math.abs(searchWithoutQuiescenceEvasions(parseFen(MATE_THROUGH_SEARCH), 1).score),
    ).toBeLessThan(MATE_SCORE - 1_000);
  });
});

/**
 * `Q-SET`, QE's rows (`qe-ABC-228`, gap `QE-228-b`): frozen by QE before its reading and read there
 * against QE's own brute force. `QE-C4` is the discriminating row (`QE-228-a`): the best evasion
 * is a capture of the checker, yet the pre-ticket rule (stand pat, then captures) reads a
 * DIFFERENT value, so a regression to that rule reds it. `C1` and `C2` read the same value under
 * both rules, which is why `C4` is here.
 */
const QE_IN_CHECK: ReadonlyArray<{
  name: string;
  fen: string;
  score: number;
  stat: number;
  pre: number;
}> = [
  {
    name: "QE-C1: knight check, the checker taken by a pawn",
    fen: "4k3/2p5/3N4/8/8/8/8/4K3 b - - 0 1",
    score: 131,
    stat: -292,
    pre: 131,
  },
  {
    name: "QE-C2: pawn check, evaded by an en-passant capture of the checker",
    fen: "4k3/8/8/3pP3/4K3/8/8/8 w - d6 0 1",
    score: 181,
    stat: 14,
    pre: 181,
  },
  {
    name: "QE-C3: the checker taken by a capturing promotion",
    fen: "3r3k/4P3/8/8/8/8/8/3K4 w - - 0 1",
    score: 940,
    stat: -349,
    pre: 938,
  },
  {
    name: "QE-C4: Nf2+ forks Kh1 and Qd1; Rxf2 is the best evasion, the pre-ticket rule misses it",
    fen: "5rk1/6pp/8/8/8/8/PPP2n2/3Q1R1K w - - 0 1",
    score: 475,
    stat: 652,
    pre: 652,
  },
];

/** `QE-M1`: black is in check (Rb8+); the one evasion Rd8 is met by Rxd8 mate, two qplies on. */
const QE_M1 = "1R4k1/5ppp/8/8/8/8/7K/3r4 b - - 0 1";
/** `QE-M2`: a smothered mate by a knight capture, Nxf7. */
const QE_M2 = "6rk/5bpp/8/6N1/8/8/8/6K1 w - - 0 1";
/** `QE-M3`: the side to move is already checkmated. */
const QE_M3 = "4R1k1/5ppp/8/8/8/8/8/6K1 b - - 0 1";

describe("ABC-228 QE-228-b — QE's Q-SET rows (qe-ABC-228), in src", () => {
  for (const { name, fen, score, stat, pre } of QE_IN_CHECK) {
    it(`${name}: reads ${score} (static ${stat}, pre-ticket ${pre}), the brute force agrees`, () => {
      expect(isInCheck(parseFen(fen))).toBe(true);
      expect(evaluateWithoutTaper(parseFen(fen))).toBe(stat);
      expect(quiesceAt(fen, SHIPPED)).toBe(score);
      expect(bruteForce(parseFen(fen), 0, 0, SHIPPED)).toBe(score);
      expect(quiesceAt(fen, PRE_ABC228)).toBe(pre);
    });
  }

  it("QE-C4 discriminates: the shipped rule and the pre-ticket rule read different values", () => {
    const row = QE_IN_CHECK[3] as (typeof QE_IN_CHECK)[number];
    expect(quiesceAt(row.fen, SHIPPED)).not.toBe(quiesceAt(row.fen, PRE_ABC228));
    // Rxf2 is the best evasion: its own quiescence score, one ply on, is the node's.
    const position = parseFen(row.fen);
    const rxf2 = legalMoves(position).find((m) => label(m) === "f1f2") as Move;
    makeMove(position, rxf2);
    expect(
      0 -
        quiesce(
          position,
          Number.NEGATIVE_INFINITY,
          Number.POSITIVE_INFINITY,
          1,
          0,
          SHIPPED,
          () => {},
        ),
    ).toBe(row.score);
  });

  it("QE-M1: mated in quiescence with a negative sign, −(MATE_SCORE − 2), and search agrees at depths 1–3", () => {
    expect(quiesceAt(QE_M1, SHIPPED)).toBe(0 - (MATE_SCORE - 2));
    expect(bruteForce(parseFen(QE_M1), 0, 0, SHIPPED)).toBe(0 - (MATE_SCORE - 2));
    for (const depth of [1, 2, 3]) {
      expect(search(parseFen(QE_M1), depth).score, `search d${depth}`).toBe(0 - (MATE_SCORE - 2));
      expect(deepenWith(chooseMove, QE_M1, depth).score, `chooseMove d${depth}`).toBe(
        0 - (MATE_SCORE - 2),
      );
    }
    expect(Math.abs(searchWithoutQuiescenceEvasions(parseFen(QE_M1), 1).score)).toBeLessThan(
      MATE_SCORE - 1_000,
    );
  });

  it("QE-M2: Nxf7 smothers, MATE_SCORE − 1, and MATE_SCORE − 6 from a leaf 5 plies down", () => {
    expect(isInCheck(parseFen(QE_M2))).toBe(false);
    expect(quiesceAt(QE_M2, SHIPPED)).toBe(MATE_SCORE - 1);
    expect(bruteForce(parseFen(QE_M2), 0, 0, SHIPPED)).toBe(MATE_SCORE - 1);
    expect(quiesceAt(QE_M2, SHIPPED, 5)).toBe(MATE_SCORE - 6);
    expect(Math.abs(quiesceAt(QE_M2, PRE_ABC228))).toBeLessThan(MATE_SCORE - 1_000);
  });

  it("QE-M3: a checkmated node reads −MATE_SCORE at ply 0, −(MATE_SCORE − 3) at ply 3, static at the cap", () => {
    expect(legalMoves(parseFen(QE_M3))).toHaveLength(0);
    expect(isInCheck(parseFen(QE_M3))).toBe(true);
    expect(quiesceAt(QE_M3, SHIPPED)).toBe(0 - MATE_SCORE);
    expect(quiesceAt(QE_M3, SHIPPED, 3)).toBe(0 - (MATE_SCORE - 3));
    expect(quiesceAt(QE_M3, SHIPPED, 0, QUIESCENCE_MAX_PLY)).toBe(
      evaluateWithoutTaper(parseFen(QE_M3)),
    );
  });
});

describe("ABC-228 — the rule rows (`ADR-0053` decision 9; each reds a planted fault)", () => {
  // `ABC-229` (`ADR-0053` decision 7): the shipped rules now search Q3's quiet promotion (977,
  // `QP-1`), so this row reads the pre-`ABC-229` record, evasions on: it still reds evasions
  // searched out of check, which is the fault it was written for.
  it("out of check the node still stands pat: Q3's free quiet promotion is not searched (pre-ABC-229 rules)", () => {
    const q3 = "8/P6k/8/8/8/8/8/K7 w - - 0 1";
    expect(isInCheck(parseFen(q3))).toBe(false);
    expect(quiesceAt(q3, PRE_ABC229)).toBe(evaluateWithoutTaper(parseFen(q3)));
  });

  it("in check below the cap the static score is never returned: every in-check row, every qply 0..7", () => {
    for (const { name, fen } of Q_SET_IN_CHECK) {
      for (let qply = 0; qply < QUIESCENCE_MAX_PLY; qply++) {
        expect(quiesceAt(fen, SHIPPED, 0, qply), `${name} @ qply ${qply}`).not.toBe(
          evaluateWithoutTaper(parseFen(fen)),
        );
      }
    }
  });

  it("at the cap a node stands pat, in check or not: Q2 at qply 8 reads its static score, no node entered", () => {
    let entered = 0;
    const position = parseFen("4k3/8/8/8/8/8/4R3/4K3 b - - 0 1");
    const score = quiesce(
      position,
      Number.NEGATIVE_INFINITY,
      Number.POSITIVE_INFINITY,
      QUIESCENCE_MAX_PLY,
      0,
      SHIPPED,
      () => entered++,
    );
    expect(score).toBe(-548);
    expect(entered).toBe(1); // the node itself, at qply 8; nothing past it
  });

  it("stalemate (no legal move, not in check) still stands pat, never a mate score", () => {
    const stalemate = "k7/8/1Q6/8/8/8/8/7K b - - 0 1";
    expect(legalMoves(parseFen(stalemate))).toHaveLength(0);
    expect(isInCheck(parseFen(stalemate))).toBe(false);
    expect(quiesceAt(stalemate, SHIPPED)).toBe(evaluateWithoutTaper(parseFen(stalemate)));
  });

  it("no node past qply 8 is visited with evasions on, on every Q-SET row", () => {
    for (const { fen } of [...Q_SET_IN_CHECK, ...Q_SET_MATES]) {
      expect(quiesceFully(parseFen(fen)).deepest).toBeLessThanOrEqual(QUIESCENCE_MAX_PLY);
    }
  });

  it("a mate found in quiescence survives the table's store and restore: MATE_SCORE − 3 at every depth", () => {
    // `ADR-0025` decision 3: the table stores a mate relative to the node and restores it at the
    // probing ply. `chooseMove` keeps its table across iterations, so each deeper iteration probes
    // what the shallower one stored, at other plies.
    for (let depth = 1; depth <= 4; depth++) {
      expect(search(parseFen(MATE_THROUGH_SEARCH), depth).score, `search d${depth}`).toBe(
        MATE_SCORE - 3,
      );
      expect(deepenWith(chooseMove, MATE_THROUGH_SEARCH, depth).score, `chooseMove d${depth}`).toBe(
        MATE_SCORE - 3,
      );
    }
  });

  for (const path of ["./search.ts", "./engine.ts"]) {
    it(`${path}: the leaf passes its ply and its rules record to quiesce, the record a module constant`, () => {
      const flat = readFileSync(new URL(path, import.meta.url), "utf8").replace(/\s+/g, " ");
      // `ABC-229` adds the second switch: four constant records, picked by both switches.
      expect(flat).toContain(
        "const RULES_SHIPPED: QuiescenceRules = { evasions: true, quietPromotions: true };",
      );
      expect(flat).toContain(
        "const RULES_NO_QUIET_PROMOTIONS: QuiescenceRules = { evasions: true, quietPromotions: false };",
      );
      expect(flat).toContain(
        "const RULES_NO_EVASIONS: QuiescenceRules = { evasions: false, quietPromotions: true };",
      );
      expect(flat).toContain(
        "const RULES_NEITHER: QuiescenceRules = { evasions: false, quietPromotions: false };",
      );
      // `ABC-269` puts the tapered record first, picked by `taper` (on only where both switches are).
      expect(flat).toContain(
        "const RULES_TAPERED: QuiescenceRules = { evasions: true, quietPromotions: true, taper: true };",
      );
      expect(flat).toMatch(
        /const rules = (switches|budget)\.taper \? RULES_TAPERED : \1\.quiescenceEvasions \? \1\.quietPromotions \? RULES_SHIPPED : RULES_NO_QUIET_PROMOTIONS : \1\.quietPromotions \? RULES_NO_EVASIONS : RULES_NEITHER;/,
      );
      const calls = [...flat.matchAll(/quiesce\(([^;]*?)\);/g)].map((m) => m[1]);
      expect(calls).toHaveLength(1);
      expect(calls[0]).toMatch(/^position, alpha, beta, 0, ply, rules, /);
    });
  }
});

/** The two recursions' exported entries, the shipped one, and `ABC-229`'s door. */
const SWITCH_MODULES = [
  {
    path: "./search.ts",
    call: "searchRoot(position, depth, {",
    on: "search",
    door: "searchWithoutQuietPromotions",
    /** `ABC-268`'s door (`ADR-0061` decision 4): the shipped path less futility, both quiescence switches on. */
    fut: "searchWithoutFutility",
    /** `ABC-269`'s door (`ADR-0064` decision 7): the shipped path less the taper, every other switch on. */
    tap: "searchWithoutTaper",
  },
  {
    path: "./engine.ts",
    call: "deepen(position, options, {",
    on: "chooseMove",
    door: "chooseMoveWithoutQuietPromotions",
    fut: "chooseMoveWithoutFutility",
    tap: "chooseMoveWithoutTaper",
  },
];

/** Each exported entry of `path` that calls its recursion, mapped to its one `switchName` literal. */
function switchLiterals(path: string, switchName: string): Record<string, string> {
  const { call } = SWITCH_MODULES.find((entry) => entry.path === path) as { call: string };
  const flat = readFileSync(new URL(path, import.meta.url), "utf8").replace(/\s+/g, " ");
  const found: Record<string, string> = {};
  for (const chunk of flat.split("export function ").slice(1)) {
    if (!chunk.includes(call)) continue;
    const name = chunk.slice(0, chunk.indexOf("("));
    const literals = [...chunk.matchAll(new RegExp(`${switchName}: (true|false)\\b`, "g"))].map(
      (m) => m[1],
    );
    expect(literals, name).toHaveLength(1);
    found[name] = literals[0] as string;
  }
  return found;
}

describe("ABC-228 — the doors: searchWithoutQuiescenceEvasions and chooseMoveWithoutQuiescenceEvasions", () => {
  it("take what search() and chooseMove take, and no depth on the engine side", () => {
    expect(searchWithoutQuiescenceEvasions.length).toBe(2);
    expect(chooseMoveWithoutQuiescenceEvasions.length).toBe(2);
  });

  // `ABC-269` (`ADR-0064` decision 7): the shipped side re-points to `searchWithoutTaper`, the
  // shipped path less the taper; the figures do not change (`search()` itself reads −524).
  it("Q2 through the depth-0 seam: searchWithoutTaper reads −536, its door the pre-ticket −548", () => {
    expect(searchWithoutTaper(parseFen("4k3/8/8/8/8/8/4R3/4K3 b - - 0 1"), 0).score).toBe(-536);
    expect(
      searchWithoutQuiescenceEvasions(parseFen("4k3/8/8/8/8/8/4R3/4K3 b - - 0 1"), 0).score,
    ).toBe(-548);
  });

  it("chooseMove sees the quiescence mate at depth 1, its door does not", () => {
    expect(deepenWith(chooseMove, MATE_THROUGH_SEARCH, 1).score).toBe(MATE_SCORE - 3);
    expect(
      Math.abs(deepenWith(chooseMoveWithoutQuiescenceEvasions, MATE_THROUGH_SEARCH, 1).score),
    ).toBeLessThan(MATE_SCORE - 1_000);
  });

  // The sibling of `QE-208-c`: one `quiescenceEvasions` literal per entry, true on the shipped
  // pair only (`ADR-0053` decision 7) — and, since `ABC-229`, on its doors, which keep evasions on;
  // and, since `ABC-268`, on its doors, which keep both quiescence switches on (`ADR-0061` d4).
  for (const { path, on, door, fut, tap } of SWITCH_MODULES) {
    it(`${path}: each exported entry passes exactly one quiescenceEvasions literal, true on ${on}, ${tap}, ${fut} and ${door} only`, () => {
      const found = switchLiterals(path, "quiescenceEvasions");
      expect(Object.keys(found).length).toBeGreaterThanOrEqual(path === "./search.ts" ? 12 : 6);
      expect(Object.entries(found).filter(([, value]) => value === "true")).toEqual([
        [on, "true"],
        [tap, "true"],
        [fut, "true"],
        [door, "true"],
      ]);
    });
  }
});

// ---------------------------------------------------------------------------
// ABC-229 (`ADR-0053` decisions 5-8) — out of check, quiescence also searches the legal quiet
// promotions to a queen. `Q-SET`'s quiet-promotion rows (QE-frozen), the doors, the source rows;
// the node bar and the bounded drift oracle in the deep lane.
// ---------------------------------------------------------------------------

/**
 * `Q-SET`, quiet promotions (`ABC-229` `A2`, `ADR-0053` decision 9). FROZEN BY QE before this build
 * (`qe-ABC-229-qset`, fixture `qset-229-frozen.json`, sha256 `7ba64d89…`): every value here is
 * QE's, read on `main` `a649fbc4`. `old` is the pre-`ABC-229` rules (evasions on), which is what
 * the doors hand `quiesce`; `new` is the shipped rules.
 */
const Q_SET_PROMOTIONS: ReadonlyArray<{
  id: string;
  kind: string;
  fen: string;
  stat: number;
  old: number;
  new: number;
  safe: boolean;
}> = [
  {
    id: "QP-1",
    kind: "Q3, a safe quiet promotion",
    fen: "8/P6k/8/8/8/8/8/K7 w - - 0 1",
    stat: 212,
    old: 212,
    new: 977,
    safe: true,
  },
  {
    id: "QP-2",
    kind: "the promotion square is controlled (Rb2 takes on b8)",
    fen: "8/1P5k/8/8/8/8/1r6/7K w - - 0 1",
    stat: -370,
    old: -370,
    new: -370,
    safe: false,
  },
  {
    id: "QP-3",
    kind: "in check, a quiet queen promotion blocks (decision 2's path)",
    fen: "K6r/4P3/8/8/7k/8/8/4R3 w - - 0 1",
    stat: 220,
    old: 544,
    new: 544,
    safe: false,
  },
  {
    id: "QP-4",
    kind: "only an under-promotion wins (e8=N+), and it stays unseen",
    fen: "8/4P1k1/3q4/8/8/8/5PPP/3B2K1 w - - 0 1",
    stat: -52,
    old: -52,
    new: -52,
    safe: false,
  },
  {
    id: "QP-5",
    kind: "a capturing under-promotion (exf8=N+), unchanged",
    fen: "5r2/3qP2k/8/8/8/8/5PPP/3B2K1 w - - 0 1",
    stat: -570,
    old: 1_073,
    new: 1_073,
    safe: false,
  },
  {
    id: "QP-6",
    kind: "KPK, c8=Q+ defended by Kb7",
    fen: "8/1KPk4/8/8/8/8/8/8 w - - 0 1",
    stat: 196,
    old: 196,
    new: 947,
    safe: true,
  },
  {
    id: "QP-7",
    kind: "a quiet queen promotion mates (c8=Q#)",
    fen: "k7/2P5/1K6/8/8/8/8/8 w - - 0 1",
    stat: 186,
    old: 186,
    new: MATE_SCORE - 1,
    safe: true,
  },
  {
    id: "QP-8",
    kind: "the quiet promotion arrives at qply 2 (bxa7+, a king move, a8=Q)",
    fen: "1k6/r7/1P6/8/4B3/8/8/R6K w - - 0 1",
    stat: 554,
    old: 1_152,
    new: 1_885,
    safe: false,
  },
  {
    id: "QP-9",
    kind: "QP-1 colour-flipped, black promotes",
    fen: "k7/8/8/8/8/8/p6K/8 b - - 0 1",
    stat: 212,
    old: 212,
    new: 977,
    safe: true,
  },
];

const qpRow = (id: string) =>
  Q_SET_PROMOTIONS.find((row) => row.id === id) as (typeof Q_SET_PROMOTIONS)[number];

/** `Q-SET`'s INFO row through `search()` at depth 8: the `ADR-0053` probe's `kpk-b6c6`, 186 → 902. */
const KPK_B6C6 = "2k5/8/1K6/2P5/8/8/8/8 w - - 0 1";

describe("ABC-229 A2 — quiescence sees the queen: Q-SET's quiet-promotion rows (QE-frozen)", () => {
  it("carries nine rows, Q3 among them, covering ADR-0053 decision 9's six kinds", () => {
    expect(Q_SET_PROMOTIONS).toHaveLength(9);
    expect(qpRow("QP-1").fen).toBe("8/P6k/8/8/8/8/8/K7 w - - 0 1");
    // The kinds the rows claim, checked on the board rather than trusted.
    expect(isInCheck(parseFen(qpRow("QP-3").fen))).toBe(true);
    for (const id of ["QP-1", "QP-2", "QP-4", "QP-5", "QP-6", "QP-7", "QP-9"]) {
      const moves = legalMoves(parseFen(qpRow(id).fen));
      expect(isInCheck(parseFen(qpRow(id).fen)), id).toBe(false);
      expect(
        moves.some((m) => m.captured === EMPTY && m.promotion === QUEEN),
        `${id} has a quiet queen promotion`,
      ).toBe(true);
    }
    // QP-8: no quiet promotion at the root; it only appears below it.
    expect(legalMoves(parseFen(qpRow("QP-8").fen)).some((m) => m.promotion !== EMPTY)).toBe(false);
    // QP-5: the capturing under-promotion is in the capture list already.
    expect(
      legalCaptures(parseFen(qpRow("QP-5").fen)).some(
        (m) => m.captured !== EMPTY && m.promotion !== EMPTY && m.promotion !== QUEEN,
      ),
    ).toBe(true);
  });

  for (const row of Q_SET_PROMOTIONS) {
    it(`${row.id} (${row.kind}): static ${row.stat}, pre-ABC-229 ${row.old}, shipped ${row.new}, and the brute force agrees`, () => {
      expect(evaluateWithoutTaper(parseFen(row.fen))).toBe(row.stat);
      expect(quiesceAt(row.fen, SHIPPED)).toBe(row.new);
      expect(quiesceAt(row.fen, PRE_ABC229)).toBe(row.old);
      expect(bruteForce(parseFen(row.fen), 0, 0, SHIPPED)).toBe(row.new);
      expect(bruteForce(parseFen(row.fen), 0, 0, PRE_ABC229)).toBe(row.old);
    });
  }

  it("every safe row reads at least static + 600 cp, and the pre-ABC-229 rules read the static score", () => {
    const safe = Q_SET_PROMOTIONS.filter((row) => row.safe);
    expect(safe.map((row) => row.id)).toEqual(["QP-1", "QP-6", "QP-7", "QP-9"]);
    for (const row of safe) {
      expect(quiesceAt(row.fen, SHIPPED), row.id).toBeGreaterThanOrEqual(row.stat + 600);
      expect(quiesceAt(row.fen, PRE_ABC229), row.id).toBe(evaluateWithoutTaper(parseFen(row.fen)));
    }
  });

  it("five rows separate the rules (QP-1, QP-6, QP-7, QP-8, QP-9); the four that must not move do not", () => {
    const separating = Q_SET_PROMOTIONS.filter(
      (row) => quiesceAt(row.fen, SHIPPED) !== quiesceAt(row.fen, PRE_ABC229),
    ).map((row) => row.id);
    expect(separating).toEqual(["QP-1", "QP-6", "QP-7", "QP-8", "QP-9"]);
  });

  it("QP-7's mate is distance-correct: MATE_SCORE − 6 from a leaf 5 plies down", () => {
    expect(quiesceAt(qpRow("QP-7").fen, SHIPPED, 5)).toBe(29_994);
  });

  it("QP-2: a controlled square is not read as a free queen", () => {
    const row = qpRow("QP-2");
    expect(quiesceAt(row.fen, SHIPPED)).toBe(row.stat);
  });

  it("no node past qply 8 is visited with quiet promotions on, on every row", () => {
    for (const { id, fen } of Q_SET_PROMOTIONS) {
      let deepest = 0;
      quiesce(
        parseFen(fen),
        Number.NEGATIVE_INFINITY,
        Number.POSITIVE_INFINITY,
        0,
        0,
        SHIPPED,
        (qply) => {
          if (qply > deepest) deepest = qply;
        },
      );
      expect(deepest, id).toBeLessThanOrEqual(QUIESCENCE_MAX_PLY);
    }
  });

  it("leaves every row's position byte-identical", () => {
    for (const { id, fen } of Q_SET_PROMOTIONS) {
      const position = parseFen(fen);
      const before = snapshot(position);
      quiesce(
        position,
        Number.NEGATIVE_INFINITY,
        Number.POSITIVE_INFINITY,
        0,
        0,
        SHIPPED,
        () => {},
      );
      expect(matchesSnapshot(position, before), id).toBe(true);
    }
  });
});

describe("ABC-229 — the one-pass list: legalCapturesAndQueenPromotions", () => {
  // Every position the file reads, plus the perft roots: the list equals the legal captures in
  // their order, then the legal quiet queen promotions in generation order.
  const fens = [
    ...PERFT_CORPUS.map(({ fen }) => fen),
    ...Q_SET_PROMOTIONS.map(({ fen }) => fen),
    "8/8/8/8/8/8/1p5k/5K2 b - - 0 1", // a black pawn one push from queening
    "4k3/1P6/8/8/8/8/8/1R2K3 w - - 0 1", // b7 with b8 empty: the push is legal
    "1n2k3/1P6/8/8/8/8/8/4K3 w - - 0 1", // b8 occupied by a knight: no push, nothing to take
    "4k3/8/1P6/8/8/8/8/4K3 w - - 0 1", // a pawn on the 6th: nothing appended
    "7k/2P5/8/8/8/8/8/2r1K3 w - - 0 1", // c7 pawn, not pinned (king on e1)
    "2b4k/3P4/8/8/8/8/8/K7 w - - 0 1", // d7xc8 capture-promotions and the quiet d8=Q
  ];

  it("is the legal captures, then the legal quiet queen promotions, on every position", () => {
    for (const fen of fens) {
      const position = parseFen(fen);
      const legal = legalMoves(position);
      const want = [
        ...legal.filter((m) => m.captured !== EMPTY),
        ...legal.filter((m) => m.captured === EMPTY && m.promotion === QUEEN),
      ];
      expect(legalCapturesAndQueenPromotions(position), fen).toEqual(want);
    }
  });

  it("drops a quiet queen promotion that would expose its own king (a pinned pawn)", () => {
    // The e7 pawn is pinned along the 7th rank by the rook on a7 against the king on h7, so e8=Q
    // would leave its own king in check.
    const pinned = "8/r3P2K/8/8/8/8/8/k7 w - - 0 1";
    const position = parseFen(pinned);
    expect(isInCheck(position)).toBe(false);
    expect(legalMoves(position).some((m) => m.promotion !== EMPTY)).toBe(false);
    expect(legalCapturesAndQueenPromotions(position)).toEqual([]);
  });
});

describe("ABC-229 — the doors: searchWithoutQuietPromotions and chooseMoveWithoutQuietPromotions", () => {
  it("take what search() and chooseMove take, and no depth on the engine side", () => {
    expect(searchWithoutQuietPromotions.length).toBe(2);
    expect(chooseMoveWithoutQuietPromotions.length).toBe(2);
  });

  // `ABC-269`: the shipped side re-points to `searchWithoutTaper`, figures unchanged (`search()` 957).
  it("Q3 through the depth-0 seam: searchWithoutTaper reads 977, its door the pre-ticket 212", () => {
    expect(searchWithoutTaper(parseFen(qpRow("QP-1").fen), 0).score).toBe(977);
    expect(searchWithoutQuietPromotions(parseFen(qpRow("QP-1").fen), 0).score).toBe(212);
  });

  // `ABC-269`: the shipped side re-points to `searchWithoutTaper`, figures unchanged (`search()` 917).
  it("Q-SET's INFO row kpk-b6c6 through searchWithoutTaper at depth 8: 902 shipped, 186 on the door, both b6c6", () => {
    const head = searchWithoutTaper(parseFen(KPK_B6C6), 8);
    const door = searchWithoutQuietPromotions(parseFen(KPK_B6C6), 8);
    expect([head.score, label(head.move)]).toEqual([902, "b6c6"]);
    expect([door.score, label(door.move)]).toEqual([186, "b6c6"]);
    // `ADR-0053` decision 6's ladder: the evasion door is pre-`ABC-229` too.
    expect(searchWithoutQuiescenceEvasions(parseFen(KPK_B6C6), 8).score).toBe(186);
  });

  // `ABC-269`: re-pointed to `chooseMoveWithoutTaper`, figures unchanged (`chooseMove` 917).
  it("chooseMoveWithoutTaper reads the INFO row the same way at depth 8; its door does not see the queen", () => {
    expect(deepenWith(chooseMoveWithoutTaper, KPK_B6C6, 8).score).toBe(902);
    expect(deepenWith(chooseMoveWithoutQuietPromotions, KPK_B6C6, 8).score).toBe(186);
  });

  // The sibling of `QE-208-c` for the second switch: one `quietPromotions` literal per entry, true
  // on the shipped pair only (`ADR-0053` decision 7) — and, since `ABC-268`, on its doors, the
  // shipped path less futility (`ADR-0061` decision 4); and, since `ABC-269`, on its doors, the
  // shipped path less the taper (`ADR-0064` decision 7).
  for (const { path, on, fut, tap } of SWITCH_MODULES) {
    it(`${path}: each exported entry passes exactly one quietPromotions literal, and only ${on}'s, ${tap}'s and ${fut}'s are true`, () => {
      const found = switchLiterals(path, "quietPromotions");
      expect(Object.keys(found).length).toBeGreaterThanOrEqual(path === "./search.ts" ? 12 : 6);
      expect(Object.entries(found).filter(([, value]) => value === "true")).toEqual([
        [on, "true"],
        [tap, "true"],
        [fut, "true"],
      ]);
    });
  }
});

if (RUN_DEEP) {
  /** `src/engine.test.ts`'s mate- and stalemate-adjacent endgames: the 190's last six. */
  const ENDGAMES = [
    "k7/8/1K6/8/8/8/8/1Q6 w - - 0 1",
    "k7/8/1K6/8/8/8/8/1R6 w - - 0 1",
    "7k/8/6K1/8/8/8/8/6Q1 w - - 0 1",
    "8/8/8/4k3/8/8/4P3/4K3 w - - 0 1",
    "8/8/8/8/8/k7/8/KR6 w - - 0 1",
    "8/6p1/8/8/8/8/1P6/k1K5 w - - 0 1",
  ];
  /** `ABC-121`'s 190: the six roots, their in-progress children, the endgames. */
  const corpus190 = (): { name: string; fen: string }[] => [
    ...broadCorpus().map(({ name, position }) => ({ name, fen: toFen(position) })),
    ...ENDGAMES.map((fen, i) => ({ name: `endgame-${i}`, fen })),
  ];
  const isMate = (score: number): boolean => Math.abs(score) > MATE_SCORE - 1_000;

  /** The d5 drift of `on` against `reference` on the 190 (`ADR-0053` decision 8). */
  const drift = (
    on: (fen: string) => number,
    reference: (fen: string) => number,
    what: string,
    bars: { within25: number; max: number; ticket: string } = {
      within25: 0.83,
      max: 177,
      ticket: "ABC-228",
    },
  ) => {
    const deltas: Array<[number, string]> = [];
    let mateFlips = 0;
    for (const { name, fen } of corpus190()) {
      const ref = reference(fen);
      const got = on(fen);
      if (isMate(ref) || isMate(got)) {
        if (isMate(ref) !== isMate(got) || Math.sign(ref) !== Math.sign(got)) mateFlips++;
        continue;
      }
      deltas.push([Math.abs(got - ref), `${name}: ${ref} -> ${got}`]);
    }
    deltas.sort((a, b) => b[0] - a[0]);
    const within25 = deltas.filter(([delta]) => delta <= 25).length / deltas.length;
    const max = deltas[0]?.[0] ?? 0;
    console.log(
      `${bars.ticket} ${what}: ${(100 * within25).toFixed(2)}% within 25 cp of ${deltas.length}, max ${max} cp ` +
        `(${deltas[0]?.[1] ?? ""}); mate-status flips on the 190: ${mateFlips} (a report, not a bar)`,
    );
    expect(within25).toBeGreaterThanOrEqual(bars.within25);
    expect(max).toBeLessThanOrEqual(bars.max);
  };

  describe("ABC-228 A4 — search(…, 6).nodes <= 1.5x the door on kiwipete and position-6 [deep, SEARCH_DEEP=1]", () => {
    for (const name of ["kiwipete", "position-6"]) {
      it(`${name} at depth 6 [deep, SEARCH_DEEP=1]`, () => {
        // `ABC-229` (`ADR-0053` decision 7): the shipped side reads `ABC-229`'s door, so the ratio
        // keeps measuring evasions alone.
        const head = searchWithoutQuietPromotions(parseFen(fenOf(name)), 6).nodes;
        const door = searchWithoutQuiescenceEvasions(parseFen(fenOf(name)), 6).nodes;
        console.log(`ABC-228 A4 ${name} d6: ${head} / ${door} = ${(head / door).toFixed(3)}x`);
        expect(head).toBeLessThanOrEqual(1.5 * door);
        expect(head).toBeGreaterThan(door); // the evasion loop is alive (`ADR-0053` § Rollback)
      }, 120_000);
    }
  });

  describe("ABC-228 — bounded drift against the evasion doors, depth 5, the 190 [deep, SEARCH_DEEP=1]", () => {
    it("the corpus is the 190", () => {
      expect(corpus190()).toHaveLength(190);
    });

    // `ABC-229` (`ADR-0053` decision 7): the shipped side of both rows reads `ABC-229`'s doors.
    it("searchWithoutQuietPromotions against searchWithoutQuiescenceEvasions at fixed depth 5: >= 83% within 25 cp, none beyond 177 cp [deep, SEARCH_DEEP=1]", () => {
      drift(
        (fen) => searchWithoutQuietPromotions(parseFen(fen), 5).score,
        (fen) => searchWithoutQuiescenceEvasions(parseFen(fen), 5).score,
        "search() d5",
      );
    }, 600_000);

    it("chooseMoveWithoutQuietPromotions against chooseMoveWithoutQuiescenceEvasions deepened to 5: >= 83% within 25 cp, none beyond 177 cp [deep, SEARCH_DEEP=1]", () => {
      drift(
        (fen) => deepenWith(chooseMoveWithoutQuietPromotions, fen, 5).score,
        (fen) => deepenWith(chooseMoveWithoutQuiescenceEvasions, fen, 5).score,
        "chooseMove to d5",
      );
    }, 600_000);
  });

  describe("ABC-228 — the same-depth mate floor on the 287 [deep, SEARCH_DEEP=1]", () => {
    // `ABC-229` (`ADR-0053` decision 7): the shipped side reads `searchWithoutQuietPromotions`.
    it("every mate searchWithoutQuiescenceEvasions scores at depth 5, searchWithoutQuietPromotions scores at depth 5: same sign, no longer [deep, SEARCH_DEEP=1]", () => {
      let mates = 0;
      const violations: string[] = [];
      for (const fen of MATE_CORPUS) {
        const ref = searchWithoutQuiescenceEvasions(parseFen(fen), 5).score;
        if (!isMate(ref)) continue;
        mates++;
        const got = searchWithoutQuietPromotions(parseFen(fen), 5).score;
        if (!isMate(got) || Math.sign(got) !== Math.sign(ref) || Math.abs(got) < Math.abs(ref)) {
          violations.push(`${fen}: ${ref} on the door, ${got} on the ABC-229 door, depth 5`);
        }
      }
      console.log(`ABC-228 mate floor d5: ${violations.length} of ${mates} violated`);
      expect(mates).toBeGreaterThanOrEqual(100);
      expect(violations).toEqual([]);
    }, 300_000);
  });
  describe("ABC-229 A3 — search(…, 6).nodes <= 1.2x its door on kiwipete and position-6 [deep, SEARCH_DEEP=1]", () => {
    for (const name of ["kiwipete", "position-6"]) {
      it(`${name} at depth 6 [deep, SEARCH_DEEP=1]`, () => {
        // `ABC-268` (`ADR-0061` decision 6): the shipped side reads `ABC-268`'s door, the
        // pre-`ABC-268` `search()`, so the ratio keeps measuring quiet promotions alone.
        const head = searchWithoutFutility(parseFen(fenOf(name)), 6).nodes;
        const door = searchWithoutQuietPromotions(parseFen(fenOf(name)), 6).nodes;
        console.log(`ABC-229 A3 ${name} d6: ${head} / ${door} = ${(head / door).toFixed(3)}x`);
        expect(head).toBeLessThanOrEqual(1.2 * door);
      }, 120_000);
    }
  });

  describe("ABC-229 — bounded drift against the quiet-promotion doors, depth 5, the 190 [deep, SEARCH_DEEP=1]", () => {
    const bars = { within25: 0.95, max: 12, ticket: "ABC-229" };

    // `ABC-268` (`ADR-0061` decision 6): the shipped side of both rows reads `ABC-268`'s doors,
    // the pre-`ABC-268` shipped path, so 12 cp keeps measuring quiet promotions alone.
    it("searchWithoutFutility against searchWithoutQuietPromotions at fixed depth 5: >= 95% within 25 cp, none beyond 12 cp [deep, SEARCH_DEEP=1]", () => {
      drift(
        (fen) => searchWithoutFutility(parseFen(fen), 5).score,
        (fen) => searchWithoutQuietPromotions(parseFen(fen), 5).score,
        "search() d5",
        bars,
      );
    }, 600_000);

    it("chooseMoveWithoutFutility against chooseMoveWithoutQuietPromotions deepened to 5: >= 95% within 25 cp, none beyond 12 cp [deep, SEARCH_DEEP=1]", () => {
      drift(
        (fen) => deepenWith(chooseMoveWithoutFutility, fen, 5).score,
        (fen) => deepenWith(chooseMoveWithoutQuietPromotions, fen, 5).score,
        "chooseMove to d5",
        bars,
      );
    }, 600_000);
  });
}
