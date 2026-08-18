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
 * real-clock lane: `A1`'s 30 positions at the 3 s default budget, `NFR-005`'s depth-in-budget
 * measurement, and the real-clock repetitions of `A2`, `A3`, `A5` and `A7` — 23 tests in 98.7 s
 * at the branch tip, against 17 tests in 49 ms of test time in the default lane. Unset, those
 * cases are NOT DEFINED rather than skipped, so the gate's skip count stays 0.
 *
 * WHAT AN INJECTED CLOCK CANNOT SEE, said plainly. Virtual time advances per CONSULTATION, not
 * per node, so "elapsed" in the default lane cannot by itself expose an engine that checks the
 * clock only between iterations — such a build consults rarely and therefore appears fast. `A2`
 * is written to catch it a different way: it bounds the NODES visited. A between-iterations
 * build, on `A2`'s fixture, enters depth 3, 4 and 5 on a clock that says there is time left and
 * reports node counts two orders of magnitude above the bound.
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
  createEngine,
  DEFAULT_BUDGET_MS,
  NODES_PER_CLOCK_CHECK,
} from "./engine.ts";
import { parseFen, toFen } from "./fen.ts";
import type { FrameSink } from "./frame.ts";
import { gameStatus } from "./gameend.ts";
import { type GameHistory, newGame } from "./history.ts";
import { legalMoves } from "./legal.ts";
import type { Move } from "./moves.ts";
import { type Position, squareName } from "./position.ts";
import { search } from "./search.ts";
import {
  type EngineSeam,
  type InputSeam,
  type PromptOutcome,
  type RenderSeam,
  runTurnLoop,
} from "./turn-loop.ts";

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

// ---------------------------------------------------------------------------
// A2 — the budget is honoured under an adversarial clock. The criterion that
// proves the clock is consulted INSIDE the recursion.
// ---------------------------------------------------------------------------

describe("A2 — a budget far below one iteration's cost still returns a move, and stops near it", () => {
  const BUDGET_MS = 50;
  const STEP_MS = 25;

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
    // iterations. Such a build, on this fixture, sees time remaining at every boundary (virtual
    // time advances per consultation, and it consults ~once per iteration), so it runs depth 3
    // (9 016 nodes), depth 4 (38 023) and depth 5 — hundreds of thousands of nodes against the
    // bound below. Measured on the delivered build: 3 120.
    expect(choice.nodes).toBeLessThanOrEqual(10 * NODES_PER_CLOCK_CHECK);
  });
});

// ---------------------------------------------------------------------------
// A3 — a partial iteration is DISCARDED, and the fixture is one where that changes the answer.
// ---------------------------------------------------------------------------

describe("A3 — an aborted iteration's move is discarded, not returned", () => {
  // `position-6` is the corpus position whose best move CHANGES with depth: g5f6 at depths 1 and
  // 2, c3d5 at depth 3. So a build that kept an aborted depth-3 iteration's best-so-far can be
  // told apart from one that discarded it, which a fixture with a stable best move cannot do.
  const position = () => parseFen(fenOf("position-6"));
  const choice = chooseMove(position(), { budgetMs: 5, now: tickingClock(1) }) as {
    move: Move;
    depth: number;
    nodes: number;
  };

  it("aborts INSIDE depth 3 — the run really did enter the iteration it discards", () => {
    expect(choice.depth).toBe(2);
    // Depths 1 and 2 cost 47 + 562 nodes; anything above that was spent inside the aborted
    // depth-3 iteration. Without this the criterion is satisfiable by never deepening at all.
    expect(choice.nodes).toBeGreaterThan(search(position(), 1).nodes + search(position(), 2).nodes);
  });

  it("returns the completed depth-2 move, which is NOT the depth-3 move", () => {
    expect(label(choice.move)).toBe(label(search(position(), 2).move as Move));
    // `search(position-6, 3).move` is `c3d5`, measured at this branch tip (14 565 nodes, ~500 ms
    // under the runner). It is a LITERAL here rather than a call because that one call is most
    // of this file's lane budget; the computed form of this same assertion runs in the deep lane
    // below, so a drift between the literal and the search is red there rather than unnoticed.
    expect(label(choice.move)).not.toBe("c3d5");
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
    expect(Object.keys(engineModule).sort()).toEqual([
      "DEFAULT_BUDGET_MS",
      "NODES_PER_CLOCK_CHECK",
      "chooseMove",
      "createEngine",
    ]);
    // `Function.length` counts parameters before the first defaulted one: a third, defaulted
    // depth parameter cannot hide behind these numbers.
    expect(chooseMove.length).toBe(2);
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
// A1 and NFR-005 — the real clock. OPT-IN: `ENGINE_DEEP=1`.
// ---------------------------------------------------------------------------

if (RUN_DEEP) {
  /** `A1`'s 30: the six roots plus the first four children of each — opening, middlegame, endgame. */
  const thirtyPositions = (): { name: string; position: Position }[] =>
    PERFT_CORPUS.flatMap(({ name, fen }) => [
      { name, position: parseFen(fen) },
      ...childrenOf(name, parseFen(fen)).slice(0, 4),
    ]);

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

  describe("A3 — the depth-3 move the default lane carries as a literal [deep, ENGINE_DEEP=1]", () => {
    it("computes search(position-6, 3).move and confirms it is c3d5", () => {
      expect(label(search(parseFen(fenOf("position-6")), 3).move as Move)).toBe("c3d5");
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
}
