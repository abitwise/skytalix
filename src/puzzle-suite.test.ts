/**
 * ABC-084 — the tactical puzzle suite, a strength regression gate (`RISK-003`).
 *
 * The runner searches every puzzle of `src/puzzle-corpus.ts` with the SHIPPED engine in
 * `ADR-0027` deterministic mode — `chooseMove(position, { budgetMs, now: virtualClock(step) })`,
 * a FRESH clock per move — and counts solved / total. The budget, the step and the baseline
 * count come from `src/puzzle-suite.baseline.json`; a run that solves fewer than the baseline is
 * red. Solved: for `mate-in-2` and `win-material`, the chosen move is one of the accepted moves;
 * for `do-not-hang`, the chosen move is not the losing move.
 *
 * THREE LANES, on the `PERFT_DEEP` precedent:
 * - DEFAULT (`npm test`): the corpus shape, the provenance oracle for the mates (`A6`) and the
 *   runner's step guard (`A4`). No engine search.
 * - `PUZZLE_DEEP=1`: the gating run (`A1`, `A2`, `A5`, the gate rule). Opt-in, ≤ 60 s.
 * - `PUZZLE_DEEP=weakened`: the SAME gating run against the shipped engine with `evaluate`
 *   returning 0 — a vitest module mock, no production door (`A3`). The gate row goes RED and the
 *   process exits non-zero; that red is the demonstration. Never part of any green lane.
 * Unset, the deep rows are not defined at all — absent from the run, never skipped.
 */

import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import { makeMove, unmakeMove } from "./apply.ts";
import type { EngineChoice, EngineOptions } from "./engine.ts";
import { parseFen } from "./fen.ts";
import { isInCheck, legalMoves } from "./legal.ts";
import type { Move } from "./moves.ts";
import { type Position, squareName } from "./position.ts";
import { HANGING_CORPUS, PUZZLES, type Puzzle } from "./puzzle-corpus.ts";
import { virtualClock } from "./virtual-clock.ts";

const MODE = process.env.PUZZLE_DEEP;

const label = (move: Move): string => `${squareName(move.from)}${squareName(move.to)}`;

type Choose = (position: Position, options: EngineOptions) => EngineChoice | null;

interface SuiteConfig {
  readonly budgetMs: number;
  readonly stepMs: number;
}

interface PuzzleResult {
  readonly name: string;
  readonly kind: Puzzle["kind"];
  readonly chosen: string;
  readonly solved: boolean;
  readonly depth: number;
  readonly nodes: number;
}

/**
 * The runner. Refuses, BEFORE any search, a step below `budgetMs / 1 000` (more than 1 000
 * virtual readings per move): the engine's cost is about 1 020 × budget / step nodes per move,
 * so a units slip is a silent multi-second search per puzzle (`ABC-086` QE G-QE-2).
 */
function runSuite(puzzles: readonly Puzzle[], config: SuiteConfig, choose: Choose) {
  const { budgetMs, stepMs } = config;
  if (!(stepMs >= budgetMs / 1_000)) {
    throw new RangeError(
      `puzzle suite: step must be >= budgetMs / 1000 (${budgetMs / 1_000}), got ${stepMs}`,
    );
  }
  const results: PuzzleResult[] = puzzles.map((puzzle) => {
    const choice = choose(parseFen(puzzle.fen), { budgetMs, now: virtualClock(stepMs) });
    const chosen = choice === null ? "null" : label(choice.move);
    const solved =
      puzzle.kind === "do-not-hang" ? chosen !== puzzle.losing : puzzle.accept.includes(chosen);
    return {
      name: puzzle.name,
      kind: puzzle.kind,
      chosen,
      solved,
      depth: choice?.depth ?? 0,
      nodes: choice?.nodes ?? 0,
    };
  });
  return { solved: results.filter((r) => r.solved).length, total: results.length, results };
}

// ---------------------------------------------------------------------------
// A6 — the mate rows' answers are the rules' answer, not the engine's.
// ---------------------------------------------------------------------------

/** True when the side to move is mated now, or every reply leaves a mate within `n - 1` moves. */
function defenderLost(position: Position, n: number): boolean {
  const replies = legalMoves(position);
  if (replies.length === 0) return isInCheck(position); // stalemate is not a mate
  if (n <= 1) return false;
  return replies.every((reply) => {
    const undo = makeMove(position, reply);
    const mates = legalMoves(position).some((move) => {
      const undo2 = makeMove(position, move);
      const lost = defenderLost(position, n - 1);
      unmakeMove(position, move, undo2);
      return lost;
    });
    unmakeMove(position, reply, undo);
    return mates;
  });
}

/** Every first move that forces mate within `n` moves — exhaustive over the legal moves. */
function matingMoves(fen: string, n: number): string[] {
  const position = parseFen(fen);
  return legalMoves(position)
    .filter((move) => {
      const undo = makeMove(position, move);
      const lost = defenderLost(position, n);
      unmakeMove(position, move, undo);
      return lost;
    })
    .map(label);
}

describe("A6 — every puzzle carries its provenance, and the mates are the rules' answer", () => {
  it("holds >= 40 puzzles: >= 10 mate-in-2, >= 6 win-material, >= 20 do-not-hang", () => {
    const count = (kind: Puzzle["kind"]) => PUZZLES.filter((p) => p.kind === kind).length;
    expect(PUZZLES.length).toBeGreaterThanOrEqual(40);
    expect(count("mate-in-2")).toBeGreaterThanOrEqual(10);
    expect(count("win-material")).toBeGreaterThanOrEqual(6);
    expect(count("do-not-hang")).toBeGreaterThanOrEqual(20);
    expect(new Set(PUZZLES.map((p) => p.name)).size).toBe(PUZZLES.length);
  });

  it("every row names its source and its moves are legal; no added row starts in check", () => {
    for (const puzzle of PUZZLES) {
      expect(puzzle.source.length, puzzle.name).toBeGreaterThan(0);
      const position = parseFen(puzzle.fen);
      // ABC-079's rows are not held to this: two of them (the "R takes a bishop a pawn defends"
      // pair) start in check from the bishop they capture. Still valid rows — the losing capture
      // is legal — and they move byte-identical, so it is reported, not fixed (ADR-0028).
      if (puzzle.kind !== "do-not-hang") expect(isInCheck(position), puzzle.name).toBe(false);
      const legal = legalMoves(position).map(label);
      const named = puzzle.kind === "do-not-hang" ? [puzzle.losing] : puzzle.accept;
      expect(named.length, puzzle.name).toBeGreaterThan(0);
      for (const move of named) expect(legal, `${puzzle.name}: ${move}`).toContain(move);
    }
  });

  it("each mate row has no mate in 1, and its accepted moves are EXACTLY the moves that mate in 2", () => {
    for (const puzzle of PUZZLES) {
      if (puzzle.kind !== "mate-in-2") continue;
      expect(matingMoves(puzzle.fen, 1), puzzle.name).toEqual([]);
      expect(matingMoves(puzzle.fen, 2).sort(), puzzle.name).toEqual([...puzzle.accept].sort());
    }
  });

  it("the do-not-hang class starts with ABC-079's 24 rows, and ABC-079 still reads exactly those 24", () => {
    expect(HANGING_CORPUS.length).toBe(24);
    const hang = PUZZLES.filter((p) => p.kind === "do-not-hang");
    expect(hang.slice(0, 24).map(({ name, fen, losing }) => ({ name, fen, losing }))).toEqual(
      HANGING_CORPUS,
    );
  });
});

// ---------------------------------------------------------------------------
// A4 (second half) — the runner refuses a step below budgetMs / 1 000 before any search.
// ---------------------------------------------------------------------------

describe("A4 — the runner refuses a step below budgetMs / 1 000, before any search", () => {
  const neverSearch: Choose = () => {
    throw new Error("searched");
  };

  for (const [budgetMs, stepMs] of [
    [50, 0.049],
    [2, 0.001],
    [50, Number.NaN],
    [50, 0],
  ] as const) {
    it(`budget ${budgetMs}, step ${stepMs}: RangeError, no search`, () => {
      expect(() => runSuite(PUZZLES, { budgetMs, stepMs }, neverSearch)).toThrow(RangeError);
    });
  }

  it("the bound itself (step = budgetMs / 1 000) is accepted and searches", () => {
    let searched = 0;
    const counting: Choose = () => {
      searched++;
      return null;
    };
    runSuite(PUZZLES.slice(0, 1), { budgetMs: 50, stepMs: 0.05 }, counting);
    expect(searched).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// The gating run — PUZZLE_DEEP=1 (shipped engine) or PUZZLE_DEEP=weakened (A3).
// ---------------------------------------------------------------------------

interface Baseline extends SuiteConfig {
  readonly solved: number;
  readonly total: number;
}

if (MODE === "1" || MODE === "weakened") {
  const baseline = JSON.parse(
    readFileSync(new URL("./puzzle-suite.baseline.json", import.meta.url), "utf8"),
  ) as Baseline;

  /** The engine under test: the shipped one, or (A3) the shipped one with `evaluate` returning 0. */
  async function engineUnderTest(): Promise<Choose> {
    if (MODE === "weakened") {
      vi.doMock("./evaluate.ts", async (importOriginal) => ({
        ...(await importOriginal<typeof import("./evaluate.ts")>()),
        evaluate: () => 0,
      }));
    }
    return (await import("./engine.ts")).chooseMove;
  }

  let run: ReturnType<typeof runSuite> | undefined;
  async function gatingRun() {
    if (run === undefined) {
      const choose = await engineUnderTest();
      const started = performance.now();
      run = runSuite(PUZZLES, baseline, choose);
      const wall = (performance.now() - started) / 1_000;
      for (const r of run.results) {
        console.log(
          `${r.solved ? "SOLVED" : "MISSED"}\t${r.kind}\t${r.chosen}\td${r.depth}\tn${r.nodes}\t${r.name}`,
        );
      }
      console.log(
        `PUZZLES ${MODE === "weakened" ? "weakened (evaluate = 0)" : "shipped"}: solved ` +
          `${run.solved}/${run.total}, baseline ${baseline.solved}/${baseline.total}, budget ` +
          `${baseline.budgetMs} step ${baseline.stepMs}, wall ${wall.toFixed(2)} s`,
      );
    }
    return run;
  }

  describe(`the gating run [deep, PUZZLE_DEEP=${MODE}]`, () => {
    it("the gate: solved >= the recorded baseline", async () => {
      const { solved, total } = await gatingRun();
      expect(total).toBe(baseline.total);
      expect(solved).toBeGreaterThanOrEqual(baseline.solved);
    }, 300_000);

    if (MODE === "1") {
      it("A1 — every mate in 2 is found (10/10 or better)", async () => {
        const mates = (await gatingRun()).results.filter((r) => r.kind === "mate-in-2");
        expect(mates.length).toBeGreaterThanOrEqual(10);
        expect(mates.filter((r) => !r.solved).map((r) => r.name)).toEqual([]);
      });

      it("A2 — the losing move is not played in >= 19 of 20 do-not-hang rows", async () => {
        const hang = (await gatingRun()).results.filter((r) => r.kind === "do-not-hang");
        expect(hang.length).toBeGreaterThanOrEqual(20);
        const losing = hang.filter((r) => !r.solved).length;
        expect(losing).toBeLessThanOrEqual(Math.floor(hang.length / 20));
      });
    }

    if (MODE === "weakened") {
      it("A3 — the weakened engine solves FEWER than the baseline (so the gate row above is red)", async () => {
        expect((await gatingRun()).solved).toBeLessThan(baseline.solved);
      }, 300_000);
    }
  });
}
