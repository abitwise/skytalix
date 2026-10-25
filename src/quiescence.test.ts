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
 */

import { describe, expect, it } from "vitest";
import { makeMove, unmakeMove } from "./apply.ts";
import { evaluate } from "./evaluate.ts";
import { parseFen, toFen } from "./fen.ts";
import { gameStatus } from "./gameend.ts";
import { isInCheck, legalMoves } from "./legal.ts";
import type { Move } from "./moves.ts";
import { type Position, squareName } from "./position.ts";
import { HANGING_CORPUS } from "./puzzle-corpus.ts";
import { QUIESCENCE_MAX_PLY, quiesce } from "./quiescence.ts";
import { search, searchWithoutPvsOrReductions, searchWithoutQuiescence } from "./search.ts";

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
  const score = quiesce(position, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, 0, (qply) => {
    nodes++;
    if (qply > deepest) deepest = qply;
  });
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
    { name: "queen vs rook, nothing en prise", fen: "4k3/8/8/8/8/8/8/Q3K2r w - - 0 1" },
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
      expect(run.score).toBe(evaluate(position));
      expect(run.nodes).toBe(0); // it stood pat: no capture was searched, none existed
      // Through the seam too: a depth-0 search is the leaf itself, quiescence and all.
      expect(search(position, 0).score).toBe(evaluate(position));
    });
  }

  it("a hanging pawn makes the quiescence value STRICTLY greater than the static evaluation", () => {
    // Qd1 takes the undefended d5 pawn; nothing recaptures. Stand-pat is 775 for white; taking
    // the pawn is worth more, and the quiescence value must say so rather than stand pat.
    const position = parseFen("4k3/8/8/3p4/8/8/8/3QK3 w - - 0 1");
    const run = quiesceFully(position);

    expect(run.score).toBeGreaterThan(evaluate(position));
    expect(run.nodes).toBeGreaterThan(0);
    expect(search(position, 0).score).toBe(run.score);
  });

  it("a DEFENDED pawn does not raise the value: the recapture is seen and the capture declined", () => {
    // Qa1xe5 is answered by Re7xe5. Standing pat (declining) is the quiescence value: the side
    // to move is never forced to capture, which is the whole point of the lower bound.
    const position = parseFen("4k3/4r3/8/4p3/8/8/8/Q3K3 w - - 0 1");
    const run = quiesceFully(position);

    expect(run.score).toBe(evaluate(position));
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
    it("position-6 at depth 3 reproduces the recorded 2 315 nodes and c3d5 [deep, SEARCH_DEEP=1]", () => {
      // 14 565 unordered; 2 273 ordered at ABC-080, the same move.
      // RE-MEASURED at ABC-083 (king safety and mobility move the bare leaf): 2 355, the same
      // move (`.grugops/context/ticket-to-pr-ABC-083/probe/rows.ts`, DEEP=1; base 2 273).
      // RE-MEASURED at ABC-205 (queen-scaled king safety, tapered king square): 2 315, the same move.
      const result = searchWithoutQuiescence(parseFen(fenOf("position-6")), 3);

      expect(result.nodes).toBe(2_315);
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
   *
   * RE-LEVELLED at `ABC-205` on the owner's word (`OD-205-1`, `ADR-0031` § Addendum `A6`, accepted
   * 2026-10-24): position-6 depth 1 only, 10x → 16x, ⌊1.5x the build's 515 / 47 = 10.96x⌋. Every
   * other cell is unchanged. The sort-removed mutant reads 52.19x there, still red.
   */
  const STOP_LEVEL: Readonly<Record<string, readonly number[]>> = {
    kiwipete: [Number.NaN, 180, 50, 70],
    "position-6": [Number.NaN, 16, 42, 13],
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
   * RE-PINNED at `ABC-205` (queen-scaled king safety, tapered king square) by the same rule: the
   * oracle, re-run in plain node on the build, equals `searchWithoutPvsOrReductions` AND `search()`
   * on score and move on both boards — kiwipete 40 / e2a6 (was 70; 387 s), position-6 160 / c3d5
   * (was 84; 46 s). The moves did not change.
   */
  const ORACLE_AT_DEPTH_3: Readonly<Record<string, { score: number; move: string }>> = {
    kiwipete: { score: 40, move: "e2a6" },
    "position-6": { score: 160, move: "c3d5" },
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
      quiesce(position, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, 0, (qply) => {
        if (qply >= 3) throw abort;
      }),
    ).toThrow(abort);
    expect(snapshot(position)).toEqual(before);
  });

  if (RUN_DEEP) {
    it("leaves the broad corpus byte-identical [deep, SEARCH_DEEP=1]", () => {
      expect(sweep("broad").mutated).toEqual([]);
    }, 60_000);
  }
});
