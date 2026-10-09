/**
 * ABC-078 acceptance — iterative deepening against a wall clock, criteria `A1`-`A7`.
 *
 * EVERY DEFAULT-LANE ASSERTION RUNS ON AN INJECTED CLOCK. `plans/nfr-catalog.md` carries the
 * standing rule — *"no wall-clock assertion belongs in the suite"*, because it is a test that
 * passes or fails on the machine that runs it — and `N8-LANE` is <= 650 ms CPU, which a 3 s
 * budget cannot fit under in any case. So the suite injects virtual time: a clock that advances
 * a fixed step on every consultation, which makes `A2`, `A3`, `A5` and `A7` deterministic and
 * fast instead of slow and flaky. `A1` is a wall-clock MEASUREMENT and lives in the opt-in lane.
 *
 * TWO LANES, on the `PERFT_DEEP` / `SEARCH_DEEP` precedent. `ENGINE_DEEP=1` registers the
 * real-clock lane and the expensive REPETITIONS of the injected-clock ones: `A1`'s 30 positions
 * at the 3 s default budget, `NFR-005`'s depth-in-budget measurement, the full `A3` identity
 * sweep, and the real-clock repetitions of `A2`, `A3`, `A5` and `A7` — 33 tests in 120 s at the
 * repair tip, against 24 tests in ~256 ms of test time in the default lane (17 tests / 49 ms
 * before the repair; the ~206 ms is the price of the three guards below actually guarding, and
 * it is charged to `N8-LANE` knowingly). Unset, the deep cases are NOT DEFINED rather than
 * skipped, so the gate's skip count stays 0.
 *
 * WHAT AN INJECTED CLOCK CANNOT SEE, said plainly. Virtual time advances per CONSULTATION, not
 * per node, so "elapsed" in the default lane cannot by itself expose an engine that checks the
 * clock only between iterations — such a build consults rarely and therefore appears fast. `A2`
 * is written to catch it a different way: it bounds the NODES visited. THAT ONLY WORKS IF THE
 * FIXTURE'S CLOCK STEP IS FINE ENOUGH FOR AN ITERATION TO BE ENTERED AND ABORTED FROM INSIDE —
 * at a 25 ms step it was not, and the criterion was blind to the exact build it was written for
 * (`ABC-078` QE, gap `G1`). At 10 ms the between-iterations build enters depths 3, 4 and 5 on a
 * clock that says there is time left and reports 1 280 509 nodes against a bound of 10 240.
 *
 * `A6`'s "src/turn-loop.ts is byte-identical" IS NOT ASSERTED HERE, deliberately. The evidence
 * is `git diff` against the branch base, recorded in this ticket's context notes; a hash pinned
 * in a test would red every later ticket that legitimately edits that file (`ABC-037` will).
 * What this file asserts is the half a test can hold: the implementation IS an `EngineSeam`, and
 * `runTurnLoop` drives it end to end.
 */

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { makeMove, unmakeMove } from "./apply.ts";
import * as engineModule from "./engine.ts";
import {
  type Clock,
  chooseMove,
  chooseMoveWithoutPvsOrReductions,
  chooseMoveWithoutReductions,
  createEngine,
  DEFAULT_BUDGET_MS,
  type EngineChoice,
  HARD_CEILING_MS,
  NODES_PER_CLOCK_CHECK,
} from "./engine.ts";
import { parseFen, toFen } from "./fen.ts";
import type { FrameSink } from "./frame.ts";
import { gameStatus } from "./gameend.ts";
import { type GameHistory, newGame } from "./history.ts";
import { legalMoves } from "./legal.ts";
import type { Move } from "./moves.ts";
import { type Position, squareName } from "./position.ts";
import { MATE_SCORE, searchWithoutReductions } from "./search.ts";
import {
  type EngineSeam,
  type InputSeam,
  type PromptOutcome,
  type RenderSeam,
  runTurnLoop,
} from "./turn-loop.ts";
import { virtualClock } from "./virtual-clock.ts";

/**
 * `ENGINE_DEEP=1` registers the real-clock lane. Unset, those cases are not defined at all —
 * same shape as `PERFT_DEEP` in `perft.test.ts` and `SEARCH_DEEP` in `search.test.ts`, and for
 * the same reason: a skipped test moves the gate's test-integrity count, an undefined one does not.
 */
const RUN_DEEP = process.env.ENGINE_DEEP === "1";

/** The six standing benchmark positions — `src/search.test.ts`'s corpus, same FENs. */
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
 * MATE- AND STALEMATE-ADJACENT ENDGAMES. The six benchmark roots never reach a mate or a
 * stalemate leaf inside depths 1-3, so they CANNOT see a scoring drift in the mate/stalemate
 * branch no matter how many of them are compared (`ABC-078` QE, gap `G4`). These can: the three
 * corner positions each have a stalemate available in ONE move and a forced mate a few plies
 * further, and the two pawn endgames are sparse enough to reach depth 6-7 on a virtual clock in
 * milliseconds.
 *
 * They serve two criteria: the identity sweep below (`search` vs `chooseMove`, move AND score)
 * and `A4`'s behavioural depth guard.
 */
const ENDGAME_CORPUS: ReadonlyArray<{ name: string; fen: string }> = [
  // Stalemate in one (Qc7), mate in three plies (Qb7#) — the pair that separates a correct
  // mate/stalemate branch from one that scores a stalemate as a loss.
  { name: "kq-corner", fen: "k7/8/1K6/8/8/8/8/1Q6 w - - 0 1" },
  { name: "kr-corner", fen: "k7/8/1K6/8/8/8/8/1R6 w - - 0 1" },
  { name: "kqk-h8", fen: "7k/8/6K1/8/8/8/8/6Q1 w - - 0 1" },
  // No mate and no stalemate inside the horizon: breadth, and the cheapest deep position here.
  { name: "kp-vs-k", fen: "8/8/8/4k3/8/8/4P3/4K3 w - - 0 1" },
  { name: "krk-a-file", fen: "8/8/8/8/8/k7/8/KR6 w - - 0 1" },
  { name: "pawn-race", fen: "8/6p1/8/8/8/8/1P6/k1K5 w - - 0 1" },
];

const endgameFen = (name: string): string =>
  (ENDGAME_CORPUS.find((entry) => entry.name === name) as { fen: string }).fen;

const fenOf = (name: string): string =>
  (PERFT_CORPUS.find((entry) => entry.name === name) as { fen: string }).fen;

const label = (move: Move): string => `${squareName(move.from)}${squareName(move.to)}`;

/**
 * A clock that advances `stepMs` on every consultation. VIRTUAL time — nothing waits, and the
 * step is what makes each test's abort point exact rather than a race with the machine.
 */
function tickingClock(stepMs: number): Clock {
  let ticks = 0;
  return () => {
    const reading = ticks;
    ticks += stepMs;
    return reading;
  };
}

/** Every field of a `Position`, as a comparable snapshot — `src/search.test.ts`'s definition. */
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

/** Move identity by value: `legalMoves` builds fresh objects, so `===` cannot serve. */
const sameMove = (a: Move, b: Move): boolean =>
  a.from === b.from && a.to === b.to && a.promotion === b.promotion && a.flags === b.flags;

/**
 * Every position reachable from `root` in up to `plies` legal moves, each an independent object
 * (round-tripped through FEN, so nothing shares a board with the position it came from).
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

const childrenOf = (name: string, root: Position) => expandFrom(name, root, 1);

/**
 * `A7`'s corpus: the six roots, every position one legal move from each, and enough of
 * `position-3` two plies deep to clear the criterion's 200 — terminal positions filtered out,
 * because they have no move to return.
 *
 * The top-up comes from the sparse endgame for the same reason `src/search.test.ts` takes its
 * breadth there: it is the cheapest position in the corpus to expand. It is CAPPED rather than
 * taken whole (389 positions, and this lane is `N8-LANE`'s), and the cap is deterministic —
 * nothing is sampled.
 */
function broadCorpus(): { name: string; position: Position }[] {
  const position3 = PERFT_CORPUS[2] as { name: string; fen: string };
  const roots = PERFT_CORPUS.flatMap(({ name, fen }) => [
    { name, position: parseFen(fen) },
    ...childrenOf(name, parseFen(fen)),
  ]);
  const grandchildren = expandFrom(position3.name, parseFen(position3.fen), 2)
    .filter(({ name }) => name.includes("/", name.indexOf("/") + 1))
    // Every fifth, so the cap spreads across the endgame's first moves rather than taking the
    // whole subtree of the first one — a depth-first prefix would be one move's descendants.
    .filter((_, index) => index % 5 === 0)
    .slice(0, 25);

  return [...roots, ...grandchildren].filter(
    ({ position }) => gameStatus(position).result === "in-progress",
  );
}

/**
 * `A1`'s 30: the six roots plus the first four children of each — opening, middlegame, endgame.
 * Shared by `ABC-078` `A1` (deep lane) and `ABC-086` `A1` (both lanes), so it lives outside the
 * deep block.
 */
const thirtyPositions = (): { name: string; position: Position }[] =>
  PERFT_CORPUS.flatMap(({ name, fen }) => [
    { name, position: parseFen(fen) },
    ...childrenOf(name, parseFen(fen)).slice(0, 4),
  ]);

// ---------------------------------------------------------------------------
// A2 — the budget is honoured under an adversarial clock. The criterion that
// proves the clock is consulted INSIDE the recursion.
// ---------------------------------------------------------------------------

describe("A2 — a budget far below one iteration's cost still returns a move, and stops near it", () => {
  const BUDGET_MS = 50;
  /**
   * 10 ms, NOT 25 — and the step is the whole criterion (`G1`, `ABC-078` QE).
   *
   * At a 25 ms step this fixture consumed its budget in three consultations, all of them at an
   * ITERATION BOUNDARY: the in-recursion check was never reached, so a build that consults the
   * clock only between iterations produced the SAME depth, the SAME 360 nodes and the SAME 4
   * consultations as the delivered one. `A2` bounded a number the defect does not move, and the
   * mutant died on `A3` instead — the criterion written for the bug was byte-identically blind
   * to it.
   *
   * A 10 ms step buys five consultations against the same 50 ms budget, so the deepening enters
   * an iteration (depth 3, ~9 000 nodes) that costs far more than `NODES_PER_CLOCK_CHECK` and
   * the abort has to come from INSIDE the recursion. Measured below.
   */
  const STEP_MS = 10;

  /** ONE run, three assertions on it: the searches are the cost and repeating them buys nothing. */
  const choice = chooseMove(parseFen(fenOf("kiwipete")), {
    budgetMs: BUDGET_MS,
    now: tickingClock(STEP_MS),
  }) as { move: Move; elapsedMs: number; nodes: number };

  it("returns a legal move at a 50 ms budget in the middlegame position", () => {
    expect(choice).not.toBeNull();
    const legal = legalMoves(parseFen(fenOf("kiwipete")));
    expect(legal.some((move) => sameMove(move, choice.move))).toBe(true);
  });

  it("stops within 2x the budget on the clock it was given", () => {
    expect(choice.elapsedMs).toBeLessThanOrEqual(2 * BUDGET_MS);
  });

  it("visits only a bounded number of nodes past the deadline — the in-recursion check", () => {
    // THIS is the assertion that fails an engine which consults the clock only between
    // iterations, and BOTH numbers below are measured on THIS fixture at the branch tip rather
    // than transcribed from another one — the previous pair were not (`G1`).
    //
    //   delivered build (in-recursion check present):       depth 1,      9 973 nodes
    //   in-recursion check DELETED (QE's `M1`):             depth 5, 36 951 122 nodes
    //
    // Re-measured at `ABC-079` (`ADR-0024`): the UNABORTABLE depth-1 iteration now carries an
    // MVV-LVA-ordered quiescence (5 878 nodes on kiwipete, was 49 bare), so the delivered
    // build is stopped INSIDE depth 2 by the fourth in-recursion consultation, 267 nodes under
    // the bound. The mutant sees time remaining at every iteration boundary — virtual time
    // advances per consultation — so it finishes depths 2 to 5, three orders of magnitude
    // above the bound. The bound itself is unchanged; it held, so it was not moved.
    expect(choice.nodes).toBeLessThanOrEqual(10 * NODES_PER_CLOCK_CHECK);
  });
});

// ---------------------------------------------------------------------------
// A3 — a partial iteration is DISCARDED, and the fixture is one where that changes the answer.
// ---------------------------------------------------------------------------

/**
 * `A3`'s fixture: the position after 1. g4 d5, white to move. Its best move CHANGES with depth
 * under the delivered leaf — e2e3 at depths 1 and 2, g4g5 at depth 3 — so a build that kept an
 * aborted depth-3 iteration's best-so-far can be told apart from one that discarded it, which a
 * fixture with a stable best move cannot do.
 *
 * RE-FIXTURED at `ABC-079` (`ADR-0024`): `position-6` carried this role until quiescence, but
 * with a quiescence leaf its best move is c3d5 at depths 1, 2 AND 3 — the premise, not just the
 * node count, was gone. Chosen from a scan of the six perft roots, their one-ply children, two
 * plies under `startpos` and `position-3`, and the endgame corpus: measured at this branch tip
 * depth 1 = 38 nodes, depth 2 = 382, depth 3 = 9 871, so ten in-recursion consultations fall
 * inside depth 3 and every budget from 3 to 12 on a 1 ms tick completes depth 2 and aborts
 * inside depth 3; 8 is the middle of that window. An emulated keep-the-best-so-far mutant was
 * caught at all ten abort points (its best-so-far is never e2e3 at −80).
 *
 * RE-MEASURED at `ABC-080` (move ordering): the premise holds — e2e3 at depths 1 and 2, g4g5 at
 * depth 3 — but ordering made depth 3 cheaper: depth 1 = 38 nodes, depth 2 = 153, depth 3 =
 * 2 551. Only budgets 3 and 4 on a 1 ms tick now complete depth 2 and abort inside depth 3
 * (budget 5 completes depth 3), so the fixture's budget moved from 8 to 4.
 *
 * RE-MEASURED at `ABC-081` (the transposition table): the premise holds — `search` still reads
 * e2e3 at depths 1 and 2 and g4g5 at depth 3, at the same 38 / 153 / 2 551 nodes, because a
 * fresh-table search this shallow has no transposition to use. The ENGINE got cheaper: it keeps
 * the table across iterations, so each iteration opens on the previous one's hash moves, and
 * budget 4 now completes depth 3 (1 408 nodes). Only budget 3 completes depth 2 (131 nodes) and
 * aborts inside depth 3 (at 1 061), so the fixture's budget moved from 4 to 3.
 */
const A3_FEN = "rnbqkbnr/ppp1pppp/8/3p4/6P1/8/PPPPPP1P/RNBQKBNR w KQkq d6 0 2";

describe("A3 — an aborted iteration's move is discarded, not returned", () => {
  const position = () => parseFen(A3_FEN);
  const choice = chooseMove(position(), { budgetMs: 3, now: tickingClock(1) }) as {
    move: Move;
    score: number;
    depth: number;
    nodes: number;
  };

  it("aborts INSIDE depth 3 — the run really did enter the iteration it discards", () => {
    expect(choice.depth).toBe(2);
    // Depths 1 and 2 cost 38 + 153 nodes; anything above that was spent inside the aborted
    // depth-3 iteration. Without this the criterion is satisfiable by never deepening at all.
    // The reference is `searchWithoutReductions` since `ABC-121` (`ADR-0026` decision 5): the
    // engine side stays the shipped `chooseMove`, whose abort this row is about.
    expect(choice.nodes).toBeGreaterThan(
      searchWithoutReductions(position(), 1).nodes + searchWithoutReductions(position(), 2).nodes,
    );
  });

  it("returns the completed depth-2 move, which is NOT the depth-3 move", () => {
    // The MOVE half of the coupling, at this one fixture. The SCORE half, and the breadth that
    // makes either of them bite, are the identity sweep below: an opening position with no mate
    // or stalemate inside a depth-2 horizon, so a scoring drift in the mate/stalemate branch
    // agrees with `search` here completely (`ABC-078` QE, gap `G4`).
    const reference = searchWithoutReductions(position(), 2) as {
      move: Move | null;
      score: number;
    };
    expect(label(choice.move)).toBe(label(reference.move as Move));
    expect(choice.score).toBe(reference.score);
    // `search(A3_FEN, 3).move` is `g4g5`, measured at the ABC-080 branch tip (2 551 nodes; 9 871
    // before ordering). It is a LITERAL here rather than a call so the default lane pays for
    // the aborted run only; the computed form of this same assertion runs in the deep lane
    // below, so a drift between the literal and the search is red there rather than unnoticed.
    expect(label(choice.move)).not.toBe("g4g5");
  });
});

// ---------------------------------------------------------------------------
// A3 (identity) — the ~55 lines this module duplicates from src/search.ts are held together by
// THIS, and by nothing else: the completed iteration must equal search() in move AND score.
// ---------------------------------------------------------------------------

/**
 * Compare `chooseMove`'s completed iteration against `search(position, thatDepth)` on both
 * fields, at every budget given, and return every divergence as a readable line.
 *
 * WHY THE COMPLETED DEPTH IS READ BACK rather than fixed: `chooseMove` has no depth parameter
 * (`A4`), so the only honest reference is the depth it reports having completed. That also makes
 * the sweep hardware-independent — the injected clock advances per CONSULTATION, so the depth
 * reached is a function of the node counts alone and is the same on every machine.
 *
 * WHY BOTH FIELDS: a move-only comparison is blind to score drift at exactly the depth it runs.
 * QE measured a mate-distance drift in this module's copy giving 39 score mismatches and ZERO
 * move mismatches at depth 2 (`ABC-078`, gap `G4`).
 *
 * WHY SEVERAL BUDGETS: the two survivors show at different horizons. A stalemate scored as a
 * loss diverges once the stalemate leaf is inside the horizon; a lost mate distance diverges
 * only when the MATE sits exactly at the leaf, which is one ply shallower here.
 *
 * AMENDED AT `ABC-081`, the move half only (ticket test note 6, `ADR-0025` Consequences): the
 * engine keeps its table across iterations, so its root tries the previous iteration's best move
 * first, where `search()` starts from an empty table. Among moves of EQUAL score that can pick a
 * different one — the first in order wins a tie. So a different move is accepted when, and only
 * when, its OWN score at that depth equals `search()`'s score. The score half is NOT relaxed.
 *
 * RE-POINTED at `ABC-121` (`ADR-0026` decision 5): both sides are the `…WithoutReductions` doors —
 * `chooseMoveWithoutReductions` against `searchWithoutReductions` — so principal-variation search
 * sits under this sweep in both recursions, while the late-move reductions, which make the value
 * depend on move order and so on the warm table, do not. Every `search()` above and below in this
 * sweep reads `searchWithoutReductions`.
 */
function identityDivergences(
  corpus: ReadonlyArray<{ name: string; fen: string }>,
  budgets: readonly number[],
): string[] {
  const out: string[] = [];
  for (const { name, fen } of corpus) {
    for (const budgetMs of budgets) {
      const choice = chooseMoveWithoutReductions(parseFen(fen), {
        budgetMs,
        now: tickingClock(1),
      }) as {
        move: Move;
        score: number;
        depth: number;
      };
      const reference = searchWithoutReductions(parseFen(fen), choice.depth) as {
        move: Move | null;
        score: number;
      };
      const at = `${name} @ depth ${choice.depth}`;
      if (label(choice.move) !== label(reference.move as Move)) {
        const own = rootMoveScore(fen, choice.move, choice.depth);
        if (own !== reference.score) {
          out.push(
            `${at}: move ${label(choice.move)} (scores ${own}) vs search ` +
              `${label(reference.move as Move)} (scores ${reference.score})`,
          );
        }
      }
      if (choice.score !== reference.score) {
        out.push(`${at}: score ${choice.score} vs search ${reference.score}`);
      }
    }
  }
  return out;
}

/**
 * The score `move` earns at the root of `fen` searched to `depth`, in `search()`'s convention: the
 * negated score of the position after it, searched one ply less. A mate `n` plies below that
 * position is `n + 1` below the root, so a mate score steps one ply further from zero.
 */
function rootMoveScore(fen: string, move: Move, depth: number): number {
  const position = parseFen(fen);
  makeMove(position, legalMoves(position).find((candidate) => sameMove(candidate, move)) as Move);
  const score = 0 - searchWithoutReductions(position, depth - 1).score;
  if (score > MATE_SCORE - 1_000) return score - 1;
  if (score < 0 - (MATE_SCORE - 1_000)) return score + 1;
  return score;
}

describe("A3 (identity) — the completed iteration equals search() in move AND score", () => {
  /**
   * The cheap 90%: three corner endgames where a stalemate is one move away and a mate is a few
   * plies further, plus one pawn endgame with neither for breadth. The full sweep — every one of
   * these plus every position one legal move from each, and the six benchmark roots on top — is
   * in the deep lane below, because `N8-LANE` is 650 ms and that sweep is seconds.
   *
   * `position-6` is NOT repeated here: `A3` above already compares it on both fields, at the
   * budget it was already running. Nothing is measured twice in this lane.
   */
  const DEFAULT_LANE_CORPUS = ENDGAME_CORPUS.filter(({ name }) =>
    ["kq-corner", "kr-corner", "kqk-h8", "kp-vs-k"].includes(name),
  );

  it("agrees with search() on move and score across the mate/stalemate endgames", () => {
    // Budget 3 reaches depth 3 on the corner positions (the mate sits AT the leaf) and budget 5
    // reaches depth 4 (the stalemate is inside the horizon). Both are needed: neither budget
    // alone reds both of the drift mutants QE found surviving the delivered suite.
    expect(identityDivergences(DEFAULT_LANE_CORPUS, [3, 5])).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// A4 — RISK-002 as a criterion: the entry point takes TIME, and no depth constant
// drives a per-move decision.
// ---------------------------------------------------------------------------

describe("A4 — no fixed depth anywhere in the delivered engine", () => {
  const SOURCE_URL = new URL("./engine.ts", import.meta.url);
  const source = readFileSync(SOURCE_URL, "utf8");

  it("reads the delivered module — src/engine.ts, not nothing", () => {
    expect(source.length).toBeGreaterThan(1000);
    expect(source).toContain("export function chooseMove(");
  });

  it("exports the two entry points and the two named values, and nothing that takes a depth", () => {
    // `ABC-121` added two TEST-ONLY doors of `chooseMove`'s own shape (`ADR-0026` decision 2):
    // a position and options, a TIME budget, no depth.
    expect(Object.keys(engineModule).sort()).toEqual([
      "DEFAULT_BUDGET_MS",
      "HARD_CEILING_MS",
      "NODES_PER_CLOCK_CHECK",
      "chooseMove",
      "chooseMoveWithoutPvsOrReductions",
      "chooseMoveWithoutReductions",
      "createEngine",
    ]);
    // `Function.length` counts parameters before the first defaulted one: a third, defaulted
    // depth parameter cannot hide behind these numbers.
    expect(chooseMove.length).toBe(2);
    expect(chooseMoveWithoutReductions.length).toBe(2);
    expect(chooseMoveWithoutPvsOrReductions.length).toBe(2);
    expect(createEngine.length).toBe(1);
    expect(source).not.toMatch(/export function \w+\([^)]*depth/i);
  });

  it("takes a TIME budget, in milliseconds, and requires it", () => {
    expect(source).toMatch(/readonly budgetMs: number;/);
    // A defaulted budget would make the ticket's "the budget arrives as a parameter" untrue.
    expect(source).not.toMatch(/budgetMs\s*\??\s*(:\s*[\w<>[\]| ]+)?\s*=[^=>]/);
    expect(DEFAULT_BUDGET_MS).toBe(3_000);
  });

  it("carries no depth default and no depth constant", () => {
    expect(source).not.toMatch(/depth\s*\??\s*(:\s*[\w<>[\]| ]+)?\s*=[^=>]/i);
    expect(source).not.toMatch(/default_?depth|max_?depth|fixed_?depth/i);
  });

  it("is driven by the clock and not by a ceiling — the deepening loop has no upper bound", () => {
    // The `for` that deepens is bounded by `now() < budget.deadline` and by nothing else. A
    // `iteration <= SOMETHING` clause here would be the depth constant this criterion forbids.
    expect(source).toMatch(/for \(let iteration = 2; now\(\) < budget\.deadline; iteration\+\+\)/);
  });

  /**
   * THE BEHAVIOURAL HALF, and it is here because the four checks above are all TEXTUAL (`G2`,
   * `ABC-078` QE). A two-line cap in the loop BODY — `if (iteration > 4) break;` as its first
   * statement — passes every one of them: the loop HEADER is untouched, the constant is an
   * anonymous `4` that matches neither `depth…=` nor `max_?depth`, and `A5` never observes a
   * depth above 4, so it cannot see a ceiling at 4 either. It passed 1 016 tests, the 23
   * `ENGINE_DEEP` tests, `tsc` and lint — and it made `A1`'s reported numbers look BETTER
   * (5/30 over 3 s instead of 29/30), which is the reward structure this test exists to remove.
   *
   * A grep cannot see a `break`. This RUNS a search and looks at the depth that comes back.
   *
   * NO ABSOLUTE HARDWARE DEPTH IS ASSERTED, so ticket test note 4 is honoured: the clock is
   * INJECTED and advances per consultation, so the depths below are a function of node counts
   * alone and are identical on every machine. They are also a LOWER bound — move ordering
   * (`ABC-080`), quiescence (`ABC-079`) and the transposition table (`ABC-081`) can only make
   * this position go deeper, never shallower.
   */
  it("goes DEEPER than any small hard-coded ceiling would allow — the behavioural half", () => {
    const sparse = () => parseFen(endgameFen("kp-vs-k"));
    const depthAt = (budgetMs: number): number =>
      (chooseMove(sparse(), { budgetMs, now: tickingClock(1) }) as { depth: number }).depth;

    const shallow = depthAt(5);
    const deep = depthAt(10);

    // Delivered: 4 then 6. With `if (iteration > 4) break;` in the loop body: 4 then 4 — both
    // assertions red. A ceiling anywhere at or below 5 is caught the same way.
    expect(deep).toBeGreaterThan(shallow);
    expect(deep).toBeGreaterThanOrEqual(6);
  });
});

// ---------------------------------------------------------------------------
// RF-1 — NFR-004 clause B: the 5 s hard ceiling, enforced by the MECHANISM.
// ---------------------------------------------------------------------------

/**
 * `NFR-004`'s ceiling holds *"at any difficulty"*, so it is the module's to honour and not the
 * caller's to respect — ruled at `ABC-078`'s security/NFR gate (`plans/nfr-catalog.md`,
 * `NFR-004` clause B, required fix `RF-1`). Before the clamp, `chooseMove` contained no
 * reference to 5 000 of any kind and `budgetMs = 6000` returned at 6 004 ms.
 *
 * ON THE INJECTED CLOCK, NOT THE WALL. A real-clock version of this costs 5 s of lane time and
 * is machine-dependent, which `plans/nfr-catalog.md`'s standing rule keeps out of the suite.
 * With virtual time it is deterministic, millisecond-cheap, and it reds the moment the
 * `Math.min` is removed.
 *
 * WHAT IS NOT ASSERTED, AND DELIBERATELY: that a 10 s budget returns within 5 000 ms EXACTLY.
 * The clamp bounds the deadline, not the abort granularity, so the real-clock answer is
 * ~5 003 ms — accepted risk `AR-NFR004-A`, stated rather than papered over with a safety margin.
 */
describe("RF-1 — a budget above the hard ceiling is CAPPED at it, not honoured", () => {
  /** A coarse step on purpose: three searches for the price of one, and the deadline is the
   * subject here, not the depth. */
  const STEP_MS = 2_500;

  /**
   * A ticking clock WITH A FUSE, and the fuse is what makes this criterion reportable.
   *
   * Remove the clamp and the `Infinity` case below does not fail — it HANGS: `deadline` is
   * `Infinity`, the deepening loop has no other exit, and a synchronous CPU loop is not
   * interruptible by a test timeout, so the whole FILE stops reporting and every other
   * criterion in it goes silent with it. The fuse turns that into a thrown error at a
   * consultation count these runs cannot legitimately reach — the clamped build uses four of
   * the sixty-four.
   */
  const fusedClock = (stepMs: number, maxConsultations: number): Clock => {
    const tick = tickingClock(stepMs);
    let consultations = 0;
    return () => {
      consultations++;
      if (consultations > maxConsultations) {
        throw new Error(
          `the clock was consulted ${consultations} times: the deepening loop is unbounded, ` +
            "which is what removing the HARD_CEILING_MS clamp does to an infinite budget",
        );
      }
      return tick();
    };
  };

  const run = (budgetMs: number) =>
    chooseMove(parseFen(fenOf("startpos")), { budgetMs, now: fusedClock(STEP_MS, 64) }) as {
      move: Move;
      score: number;
      depth: number;
      nodes: number;
      elapsedMs: number;
    };

  /**
   * Each run is called INSIDE its `it` rather than once at describe scope, which is the shape
   * `A2` and `A3` use. Here the fuse can throw, and a throw during collection takes down the
   * whole file instead of naming the criterion that failed. At this step a run is ~4 ms.
   */

  it("names the ceiling as an exported constant", () => {
    expect(HARD_CEILING_MS).toBe(5_000);
  });

  it("stops at start + HARD_CEILING_MS when handed twice that budget", () => {
    // The deepening stops at the first reading at or past the deadline, and the return reading
    // is one step later — so the ceiling plus one step is the tightest true bound. Unclamped
    // this run stops at 10 000 and returns 12 500, which is what reds here.
    expect(run(2 * HARD_CEILING_MS).elapsedMs).toBeLessThanOrEqual(HARD_CEILING_MS + STEP_MS);
  });

  it("makes any budget above the ceiling indistinguishable from the ceiling itself", () => {
    // Not just "stops sooner" — the SAME search. Move, score, depth, nodes and elapsed all.
    expect(run(2 * HARD_CEILING_MS)).toEqual(run(HARD_CEILING_MS));
  });

  it("terminates on an infinite budget — the module's only unbounded path, closed", () => {
    // Unclamped, `deadline` is `Infinity` and the deepening loop has no other exit: this call
    // never returns. The fuse in the clock above is what turns that hang into this failure.
    expect(run(Number.POSITIVE_INFINITY)).toEqual(run(HARD_CEILING_MS));
  });

  it("leaves every degenerate budget exactly as it was — Math.min, not an if", () => {
    // `Math.min(NaN, 5000)` is `NaN`, so both deadline comparisons stay false and depth 1 comes
    // back as before; 0 and negatives are already below the ceiling and are untouched. This is
    // the reason the fix is a `Math.min` and not a conditional.
    for (const budgetMs of [Number.NaN, 0, -1, -1e9]) {
      const choice = chooseMove(parseFen(fenOf("startpos")), {
        budgetMs,
        now: tickingClock(STEP_MS),
      }) as { depth: number };
      expect(choice.depth).toBe(1);
    }
  });
});

// ---------------------------------------------------------------------------
// A5 — deeper when given longer. A clock that is checked but never lets the search
// go deeper passes A1-A3.
// ---------------------------------------------------------------------------

describe("A5 — the completed depth is monotonically non-decreasing in the budget", () => {
  const BUDGETS = [100, 1_000, 3_000] as const;

  /**
   * A 500 ms step, which is coarse on purpose: it buys the criterion's three budgets for 10 ms
   * of work (depths 1 / 2 / 3 here) instead of 140 ms, and this file's whole default lane is
   * charged to `N8-LANE`. The fine-grained repetition — a 100 ms step, which reaches depths
   * 1 / 3 / 4 — runs in the deep lane below.
   */
  const depths = BUDGETS.map(
    (budgetMs) =>
      (
        chooseMove(parseFen(fenOf("startpos")), {
          budgetMs,
          now: tickingClock(500),
        }) as { depth: number }
      ).depth,
  );

  it("never goes shallower as the budget grows", () => {
    expect(depths[1] as number).toBeGreaterThanOrEqual(depths[0] as number);
    expect(depths[2] as number).toBeGreaterThanOrEqual(depths[1] as number);
  });

  it("actually goes deeper somewhere across the three budgets", () => {
    // Non-decreasing alone is satisfied by an engine pinned at depth 1. Absolute depths are
    // hardware and are not asserted (ticket test note 4) — only that the number MOVED.
    expect(depths[2] as number).toBeGreaterThan(depths[0] as number);
  });
});

// ---------------------------------------------------------------------------
// A6 — it satisfies the merged seam, and the loop drives it end to end.
// ---------------------------------------------------------------------------

describe("A6 — the implementation IS an EngineSeam, and runTurnLoop drives it", () => {
  /** The engine as the loop takes it. The annotation is the assignability assertion. */
  const seamUnderTest: EngineSeam = createEngine({ budgetMs: 2, now: tickingClock(1) });

  it("is assignable to EngineSeam and answers with a Promise<Move>", async () => {
    const history = newGame(fenOf("startpos"));
    const move = await seamUnderTest(history);
    expect(legalMoves(history.position).some((candidate) => sameMove(candidate, move))).toBe(true);
  });

  it("plays a scripted game to end-of-input with the loop driving it", async () => {
    const history = newGame(fenOf("startpos"));
    const engineMoves: string[] = [];
    let humanPlies = 0;

    const render: RenderSeam = () => ["frame"];
    const writes: string[] = [];
    const sink: FrameSink = {
      isTTY: false,
      rows: 0,
      write(text: string) {
        writes.push(text);
      },
    };

    /** The human: the first legal move, three times, then end-of-input. */
    const input: InputSeam = async (h): Promise<PromptOutcome> => {
      if (humanPlies === 3) return { kind: "eof" };
      humanPlies++;
      return { kind: "move", move: legalMoves(h.position)[0] as Move };
    };

    const engine: EngineSeam = async (h: GameHistory) => {
      const move = await seamUnderTest(h);
      engineMoves.push(label(move));
      return move;
    };

    const outcome = await runTurnLoop({
      history,
      humanColour: "white",
      render,
      input,
      engine,
      sink,
    });

    // The loop terminated on end-of-input, not on `engine-failure`: every move the engine
    // returned passed the loop's own `wasGenerated` membership test on the live position.
    expect(outcome).toEqual({ result: null, reason: null, exitCode: 0 });
    expect(engineMoves).toHaveLength(3);
    expect(history.moves).toHaveLength(6);
    expect(writes.join("")).toContain("input ended");
  });
});

// ---------------------------------------------------------------------------
// A7 — always legal, never null, at a budget that is already spent.
// ---------------------------------------------------------------------------

describe("A7 — a legal move comes back at a budget with nothing left in it", () => {
  /**
   * The shape of every real timeout: the budget expires before the first iteration is over. The
   * clock reads 0 once (the entry reading) and then a value far past the deadline, so iteration
   * 1 is the only one that runs — which is exactly why iteration 1 is unabortable.
   */
  const spentBudget = () => ({ budgetMs: 1, now: tickingClock(1_000_000) });

  const run = () => {
    const corpus = broadCorpus();
    const illegal: string[] = [];
    const mutated: string[] = [];

    for (const { name, position } of corpus) {
      const before = snapshot(position);
      const choice = chooseMove(position, spentBudget());

      if (choice === null || !legalMoves(position).some((m) => sameMove(m, choice.move))) {
        illegal.push(`${name}: ${choice === null ? "null" : label(choice.move)}`);
      }
      if (!matchesSnapshot(position, before)) mutated.push(name);
    }
    return { size: corpus.length, illegal, mutated };
  };

  const result = run();

  it("covers 200+ positions — the denominator, asserted rather than trusted", () => {
    expect(result.size).toBeGreaterThanOrEqual(200);
  });

  it("returns a legal move in every one of them — never null, never a throw", () => {
    expect(result.illegal).toEqual([]);
  });

  it("leaves every searched position byte-identical, aborted iteration or not", () => {
    expect(result.mutated).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// ABC-086 — deterministic mode: the shipped engine on the SHIPPED virtual clock
// (`src/virtual-clock.ts`, `ADR-0027`). Every row here imports that module, never `tickingClock`
// above — a test-local clock proves nothing about what the `ABC-084`/`ABC-085`/`ABC-087`
// harnesses can reach. The full `A1` and `A2` are in the deep lane at the bottom of this file.
// ---------------------------------------------------------------------------

/** `ABC-086` `A1`: `runs` searches of one position, each on a FRESH clock from the shipped module. */
function deterministicRuns(position: Position, budgetMs: number, runs: number): string[] {
  return Array.from({ length: runs }, () => {
    const choice = chooseMove(parseFen(toFen(position)), { budgetMs, now: virtualClock(1) });
    return choice === null ? "null" : `${label(choice.move)}${choice.move.promotion ?? ""}`;
  });
}

/** The positions of `ABC-086` `A1` whose runs did not all choose the same move. */
function nonIdentical(budgetMs: number, runs: number): string[] {
  return thirtyPositions()
    .map(({ name, position }) => ({ name, moves: deterministicRuns(position, budgetMs, runs) }))
    .filter(({ moves }) => moves.some((move) => move !== moves[0]))
    .map(({ name, moves }) => `${name}: ${moves.join(" ")}`);
}

describe("ABC-086 A1 — the same position, budget and fresh virtual clock choose the same move", () => {
  it("is identical 2/2 over the 30 positions — the default-lane slice of the deep 300/300", () => {
    expect(thirtyPositions()).toHaveLength(30);
    expect(nonIdentical(2, 2)).toEqual([]);
  });
});

describe("ABC-086 A5 — the virtual clock stays off the shipped path", () => {
  const cliSource = readFileSync(new URL("./cli.ts", import.meta.url), "utf8");

  it("(i) the shipped construction passes a budget and no clock", () => {
    expect(cliSource).toContain("createEngine({ budgetMs: DEFAULT_BUDGET_MS })");
  });

  it("(ii) src/cli.ts does not import the virtual-clock module, directly or transitively", () => {
    // Every relative specifier in a static import/export, a type-only one, or a dynamic import —
    // over-inclusive on purpose: a type-only edge counted here can only make this stricter.
    const specifier = /(?:\bfrom\s*|\bimport\s*\(?\s*)["'](\.{1,2}\/[^"']+)["']/g;
    const reached = new Set<string>();
    const queue = [new URL("./cli.ts", import.meta.url).href];
    while (queue.length > 0) {
      const href = queue.pop() as string;
      if (reached.has(href)) continue;
      reached.add(href);
      for (const match of readFileSync(new URL(href), "utf8").matchAll(specifier)) {
        queue.push(new URL(match[1] as string, href).href);
      }
    }
    const names = [...reached].map((href) => href.slice(href.lastIndexOf("/") + 1));
    // The denominator: the walk really reached the engine, so an empty walk cannot pass.
    expect(names).toContain("engine.ts");
    expect(names).not.toContain("virtual-clock.ts");
  });
});

describe("ABC-086 A6 — two engines on their own virtual clocks, interleaved, do not interfere", () => {
  /**
   * Different BUDGETS, so equal output is not the trivial case: on this corpus the two disagree
   * on three positions (`position-3/e2e4`, `position-4/d2d4`, `position-4/f3d4`), asserted below.
   * Cheap families on purpose — the default lane is `N8-LANE`'s.
   */
  const corpus = [PERFT_CORPUS[2], PERFT_CORPUS[3]].flatMap((entry) => {
    const { name, fen } = entry as { name: string; fen: string };
    return [{ name, position: parseFen(fen) }, ...childrenOf(name, parseFen(fen)).slice(0, 4)];
  });
  const makeA = () => createEngine({ budgetMs: 1, now: virtualClock(1) });
  const makeB = () => createEngine({ budgetMs: 3, now: virtualClock(1) });

  it("each engine chooses 10/10 what it chooses alone", async () => {
    expect(corpus).toHaveLength(10);
    const alone = async (engine: EngineSeam) => {
      const moves: string[] = [];
      for (const { position } of corpus) moves.push(label(await engine(newGame(toFen(position)))));
      return moves;
    };
    const aloneA = await alone(makeA());
    const aloneB = await alone(makeB());

    const engineA = makeA();
    const engineB = makeB();
    const interleavedA: string[] = [];
    const interleavedB: string[] = [];
    for (const { position } of corpus) {
      interleavedA.push(label(await engineA(newGame(toFen(position)))));
      interleavedB.push(label(await engineB(newGame(toFen(position)))));
    }

    expect(aloneA.filter((move, index) => move !== aloneB[index]).length).toBeGreaterThan(0);
    expect(interleavedA).toEqual(aloneA);
    expect(interleavedB).toEqual(aloneB);
  });

  it("keeps each clock's state in its own instance — a second clock starts at 0", () => {
    const first = virtualClock(1);
    first();
    first();
    const second = virtualClock(1);
    expect(second()).toBe(0);
    expect(first()).toBe(2);
  });
});

describe("ABC-086 A7 — the step guard and the reading shape, asserted at the factory", () => {
  // Never at the engine: a frozen clock hangs the lane instead of failing it (ticket note 5).
  it("throws on a step that is not finite or not greater than 0 — 5/5", () => {
    for (const step of [0, -1, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]) {
      expect(() => virtualClock(step), `step ${step}`).toThrow(RangeError);
    }
  });

  it("reads exactly 0, 0.5, 1 at a step of 0.5", () => {
    const clock = virtualClock(0.5);
    expect([clock(), clock(), clock()]).toEqual([0, 0.5, 1]);
  });

  it("reads exactly 0, 1, 2 at a step of 1", () => {
    const clock = virtualClock(1);
    expect([clock(), clock(), clock()]).toEqual([0, 1, 2]);
  });
});

describe("ABC-086 A4 — the virtual-clock module reads no real clock and no entropy", () => {
  it("carries no real-clock read and no entropy source", () => {
    const source = readFileSync(new URL("./virtual-clock.ts", import.meta.url), "utf8");
    expect(source).toContain("export function virtualClock(");
    expect(source).not.toMatch(/Math\.random|Date\.now|performance\.now|hrtime/);
  });
});

// ---------------------------------------------------------------------------
// A1 and NFR-005 — the real clock. OPT-IN: `ENGINE_DEEP=1`.
// ---------------------------------------------------------------------------

if (RUN_DEEP) {
  /**
   * WHAT THIS LANE MEASURED AT THE `ABC-078` BRANCH TIP, on Apple M3 (Mac15,13) — true of that
   * machine and of nothing else (`ABC-074` owns the off-machine generalisation and is `Blocked`):
   *
   *   `A1`   worst case 3 027 ms at completed depth 4 (`position-4/f3d4`); 0/30 over the 5 s
   *          ceiling; 29/30 over 3 000 ms, every one of them by the abort granularity rather
   *          than by an iteration — the overshoot is +27 ms worst case, 0.9% of the budget.
   *          THE ASSERTION BELOW IS THE 5 s CEILING ONLY, and the 3 s count is PRINTED rather
   *          than asserted, deliberately: a run that returns at `budget + one clock check` is
   *          what this construction promises, and pretending otherwise would need a safety
   *          margin nobody asked for. Recorded as a criterion nuance in this ticket's notes.
   *   `NFR-005` kiwipete completed depth 4 (81 968 nodes), `position-6` completed depth 3
   *          (101 422 nodes) at the 3 s budget. REPORTED, NOT RULED — and both are below that
   *          row's depth-6 FAIL floor, with move ordering (`ABC-080`), quiescence (`ABC-079`)
   *          and the transposition table (`ABC-081`) all still unbuilt.
   */
  describe("A1 — 30 positions at the default budget, on a real clock [deep, ENGINE_DEEP=1]", () => {
    it("returns within the 5 s hard ceiling every time, and reports the worst case", () => {
      const positions = thirtyPositions();
      expect(positions).toHaveLength(30);

      let worst = { name: "", ms: 0, depth: 0 };
      const overCeiling: string[] = [];
      const overBudget: string[] = [];

      for (const { name, position } of positions) {
        const started = Date.now();
        const choice = chooseMove(position, { budgetMs: DEFAULT_BUDGET_MS });
        const ms = Date.now() - started;

        expect(choice).not.toBeNull();
        if (ms > 5_000) overCeiling.push(`${name}: ${ms} ms`);
        if (ms > 3_000) overBudget.push(`${name}: ${ms} ms`);
        if (ms > worst.ms) worst = { name, ms, depth: (choice as { depth: number }).depth };
      }

      // Reported, not asserted off this machine: the number is true of the machine that ran it
      // and of nothing else (`ABC-074` owns the off-machine generalisation and is Blocked).
      console.log(
        `A1 worst case: ${worst.name} ${worst.ms} ms at completed depth ${worst.depth}; ` +
          `over 3 s: ${overBudget.length}/30`,
      );
      expect(overCeiling).toEqual([]);
    }, 300_000);
  });

  describe("NFR-005 — depth-in-budget, MEASURED and reported [deep, ENGINE_DEEP=1]", () => {
    it("records the completed depth on kiwipete and position-6 at the 3 s budget", () => {
      // A MEASUREMENT, not a verdict. The depth-7 level is PROVISIONAL until `ABC-074` reports
      // from a non-M3 machine, and nothing here rules it.
      for (const name of ["kiwipete", "position-6"]) {
        const started = Date.now();
        const choice = chooseMove(parseFen(fenOf(name)), { budgetMs: DEFAULT_BUDGET_MS }) as {
          depth: number;
          nodes: number;
        };
        console.log(
          `NFR-005 ${name}: completed depth ${choice.depth}, ${choice.nodes} nodes, ` +
            `${Date.now() - started} ms`,
        );
        expect(choice.depth).toBeGreaterThanOrEqual(1);
      }
    }, 60_000);
  });

  describe("A5 — the fine-grained repetition, on a 100 ms step [deep, ENGINE_DEEP=1]", () => {
    it("still never goes shallower as the budget grows, at a tenth of the lane's step", () => {
      const depths = [100, 1_000, 3_000].map(
        (budgetMs) =>
          (
            chooseMove(parseFen(fenOf("startpos")), {
              budgetMs,
              now: tickingClock(100),
            }) as { depth: number }
          ).depth,
      );
      expect(depths[1] as number).toBeGreaterThanOrEqual(depths[0] as number);
      expect(depths[2] as number).toBeGreaterThanOrEqual(depths[1] as number);
      expect(depths[2] as number).toBeGreaterThan(depths[0] as number);
    }, 30_000);
  });

  describe("A3 (identity) — the full sweep, with breadth [deep, ENGINE_DEEP=1]", () => {
    /** Every endgame plus every position one legal move from each — terminal positions dropped. */
    const endgamesWithChildren = (): { name: string; fen: string }[] =>
      ENDGAME_CORPUS.flatMap(({ name, fen }) => [
        { name, fen },
        ...childrenOf(name, parseFen(fen))
          .filter(({ position }) => gameStatus(position).result === "in-progress")
          .map(({ name: childName, position }) => ({ name: childName, fen: toFen(position) })),
      ]);

    it("agrees with search() on move and score over the whole endgame corpus", () => {
      const corpus = endgamesWithChildren();
      // The denominator, asserted rather than trusted — a sweep over an empty corpus is green.
      // 92 at this branch tip: the six roots and every non-terminal position one move from them.
      expect(corpus.length).toBeGreaterThanOrEqual(90);
      expect(identityDivergences(corpus, [3, 5])).toEqual([]);
    }, 120_000);

    it("agrees with search() on move and score over the six benchmark roots and their children", () => {
      // These CANNOT see a mate/stalemate drift — no such leaf is inside depths 1-3 from any of
      // them — and they are here for the opposite property: the two recursions must not diverge
      // in ordinary middlegame play either. Both halves of the coupling, on their own corpora.
      const corpus = broadCorpus().map(({ name, position }) => ({ name, fen: toFen(position) }));
      expect(corpus.length).toBeGreaterThanOrEqual(200);
      expect(identityDivergences(corpus, [5])).toEqual([]);
    }, 300_000);
  });

  describe("A4 — the behavioural depth guard, further out [deep, ENGINE_DEEP=1]", () => {
    it("keeps deepening well past any small ceiling on the sparse endgame", () => {
      const depths = [5, 10, 40].map(
        (budgetMs) =>
          (
            chooseMove(parseFen(endgameFen("kp-vs-k")), {
              budgetMs,
              now: tickingClock(1),
            }) as { depth: number }
          ).depth,
      );
      // Delivered: 4 / 6 / 7. Injected clock, so these are node counts and not this machine.
      expect(depths[1] as number).toBeGreaterThan(depths[0] as number);
      expect(depths[2] as number).toBeGreaterThan(depths[1] as number);
      expect(depths[2] as number).toBeGreaterThanOrEqual(7);
    }, 30_000);
  });

  describe("A3 — the depth-3 move the default lane carries as a literal [deep, ENGINE_DEEP=1]", () => {
    it("computes search(A3_FEN, 3).move and confirms it is g4g5", () => {
      expect(label(searchWithoutReductions(parseFen(A3_FEN), 3).move as Move)).toBe("g4g5");
    }, 30_000);
  });

  describe("A2/A7 on the real clock [deep, ENGINE_DEEP=1]", () => {
    it("A2 — a 50 ms budget returns inside 100 ms in the middlegame position", () => {
      const started = Date.now();
      const choice = chooseMove(parseFen(fenOf("kiwipete")), { budgetMs: 50 });
      const ms = Date.now() - started;
      console.log(
        `A2 real clock: ${ms} ms at completed depth ${(choice as { depth: number }).depth}`,
      );
      expect(choice).not.toBeNull();
      expect(ms).toBeLessThanOrEqual(100);
    });

    it("A7 — a 1 ms budget returns a legal move in every corpus position", () => {
      const failures: string[] = [];
      for (const { name, position } of broadCorpus()) {
        const choice = chooseMove(position, { budgetMs: 1 });
        if (choice === null || !legalMoves(position).some((m) => sameMove(m, choice.move))) {
          failures.push(name);
        }
      }
      expect(failures).toEqual([]);
    }, 120_000);
  });

  describe("ABC-086 A1 — 30 positions x 10 fresh virtual clocks: 300/300 [deep, ENGINE_DEEP=1]", () => {
    /**
     * 24 virtual ms at a 1 ms step: the criterion needs at least half the positions to complete
     * root depth >= 4, so that LMR acts. Measured 27/30 at the `ABC-086` base (15/30 at 8, 16/30
     * at 16), and the floor is ASSERTED below rather than trusted.
     */
    const BUDGET_MS = 24;

    it("completes root depth >= 4 on at least 15 of the 30 positions", () => {
      const deep = thirtyPositions().filter(
        ({ position }) =>
          (chooseMove(position, { budgetMs: BUDGET_MS, now: virtualClock(1) }) as { depth: number })
            .depth >= 4,
      );
      expect(deep.length).toBeGreaterThanOrEqual(15);
    }, 60_000);

    it("chooses the identical move in all 10 runs of every position — 300/300", () => {
      expect(nonIdentical(BUDGET_MS, 10)).toEqual([]);
    }, 300_000);
  });

  describe("ABC-086 A2 — the shipped wall clock: legal, depth reported [deep, ENGINE_DEEP=1]", () => {
    /**
     * THIS ROW DOES NOT ASSERT AN IDENTICAL MOVE, AND MUST NEVER BE "STRENGTHENED" TO. On the
     * wall clock the depth reached depends on machine load, so the move can differ between runs;
     * asserting identity would pass on an idle machine and fail on a loaded one — the class of
     * test `plans/nfr-catalog.md` forbids. Reproducibility is a property of deterministic mode
     * (`ABC-086` `A1`, the virtual clock), never of the shipped default (`ADR-0027`).
     */
    it("returns a legal move in each of 10 runs at the default budget, and reports each depth", () => {
      const position = parseFen(fenOf("kiwipete"));
      const reports: string[] = [];
      for (let run = 0; run < 10; run++) {
        const choice = chooseMove(position, { budgetMs: DEFAULT_BUDGET_MS });
        expect(choice).not.toBeNull();
        const { move, depth, elapsedMs } = choice as EngineChoice;
        expect(legalMoves(position).some((candidate) => sameMove(candidate, move))).toBe(true);
        reports.push(`${label(move)}@d${depth}/${elapsedMs}ms`);
      }
      console.log(`ABC-086 A2 kiwipete x10 on the wall clock: ${reports.join(" ")}`);
    }, 120_000);
  });
}
