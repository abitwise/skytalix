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
 *
 * ABC-127 appends harder rows (mate-in-3, more win-material, each tagged with why it is there)
 * and adds: a default-lane row for their shape, tags and colour mirrors (`A1`); two
 * `PUZZLE_DEEP=1` oracle rows that re-prove every mate-in-3 set and every win-material set,
 * ABC-084's six included (`A2`); and per-row `NEWLY-MISSED` / `NEWLY-SOLVED` lines against the
 * baseline's recorded unsolved rows (`A5`). The gate is still the count.
 */

import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import { makeMove, unmakeMove } from "./apply.ts";
import type { EngineChoice, EngineOptions } from "./engine.ts";
import { parseFen } from "./fen.ts";
import { isInCheck, legalMoves } from "./legal.ts";
import type { Move } from "./moves.ts";
import { EMPTY, isBlack, isOnBoard, type Position, pieceType, squareName } from "./position.ts";
import { HANGING_CORPUS, PUZZLES, type Puzzle, type PuzzleTag } from "./puzzle-corpus.ts";
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

// ---------------------------------------------------------------------------
// ABC-127 A2 — the win-material rows' answer: material only, never the engine's evaluation.
// ---------------------------------------------------------------------------

/** P1 N3 B3 R5 Q9, indexed by piece type (EMPTY, PAWN, KNIGHT, BISHOP, ROOK, QUEEN, KING). */
const MATERIAL = [0, 1, 3, 3, 5, 9, 0];
const MATERIAL_MATE = 1_000;

/** Material balance in pawns, positive for the side to move. */
function material(position: Position): number {
  let balance = 0;
  for (let square = 0; square < 128; square++) {
    const piece = position.board[square] as number;
    if (!isOnBoard(square) || piece === EMPTY) continue;
    const value = MATERIAL[pieceType(piece)] as number;
    balance += isBlack(piece) ? -value : value;
  }
  return position.blackToMove ? -balance : balance;
}

/** Captures (and promotions) first, the larger victim first: it changes no value, only the speed. */
function capturesFirst(moves: readonly Move[]): Move[] {
  const key = (move: Move) =>
    move.captured === EMPTY && move.promotion === EMPTY
      ? -100
      : 10 * (MATERIAL[pieceType(move.captured)] as number) + (MATERIAL[move.promotion] as number);
  return [...moves].sort((a, b) => key(b) - key(a));
}

/** Within `n` capture plies: stand pat or capture; in check, every evasion and no stand pat. */
function materialCaptures(position: Position, alpha: number, beta: number, n: number): number {
  const moves = legalMoves(position);
  const check = isInCheck(position);
  if (moves.length === 0) return check ? -MATERIAL_MATE : 0;
  if (!check) {
    const standPat = material(position);
    if (standPat >= beta || n <= 0) return standPat;
    if (standPat > alpha) alpha = standPat;
  }
  for (const move of capturesFirst(moves)) {
    if (!check && move.captured === EMPTY && move.promotion === EMPTY) continue;
    const undo = makeMove(position, move);
    const score = -materialCaptures(position, -beta, -alpha, n - 1);
    unmakeMove(position, move, undo);
    if (score >= beta) return score;
    if (score > alpha) alpha = score;
  }
  return alpha;
}

/** Full-width material negamax, `depth` plies, then the capture search (8 plies). */
function materialSearch(
  position: Position,
  depth: number,
  alpha: number,
  beta: number,
  ply: number,
): number {
  const moves = legalMoves(position);
  if (moves.length === 0) return isInCheck(position) ? -(MATERIAL_MATE - ply) : 0;
  if (depth === 0) return materialCaptures(position, alpha, beta, 8);
  for (const move of capturesFirst(moves)) {
    const undo = makeMove(position, move);
    const score = -materialSearch(position, depth - 1, -beta, -alpha, ply + 1);
    unmakeMove(position, move, undo);
    if (score >= beta) return score;
    if (score > alpha) alpha = score;
  }
  return alpha;
}

/**
 * The material gain of the best move at 4 plies plus captures, and EXACTLY the moves that reach
 * it: the best by alpha-beta, then one null-window test per move (scores are whole pawns, so
 * "scores >= best" is a window of one).
 */
function materialBest(fen: string): { gain: number; moves: string[] } {
  const position = parseFen(fen);
  const before = material(position);
  const moves = capturesFirst(legalMoves(position));
  const scoreOf = (move: Move, alpha: number, beta: number) => {
    const undo = makeMove(position, move);
    const score = -materialSearch(position, 3, -beta, -alpha, 1);
    unmakeMove(position, move, undo);
    return score;
  };
  let best = Number.NEGATIVE_INFINITY;
  for (const move of moves) best = Math.max(best, scoreOf(move, best, Number.POSITIVE_INFINITY));
  const reaching = moves.filter((move) => scoreOf(move, best - 1, best) >= best);
  return { gain: best - before, moves: reaching.map(label) };
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
// ABC-127 A1 — the harder rows: how many, which classes, why each is there, no colour mirrors.
// ---------------------------------------------------------------------------

/** Placement and side to move, and the same position with the colours swapped and the board flipped. */
const placementAndSide = (fen: string): string => fen.split(" ").slice(0, 2).join(" ");
function colourMirror(fen: string): string {
  const [placement = "", side] = fen.split(" ");
  const swapped = placement
    .split("/")
    .reverse()
    .map((rank) =>
      rank.replace(/[a-z]/gi, (c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase())),
    )
    .join("/");
  return `${swapped} ${side === "w" ? "b" : "w"}`;
}

/** A row solved by playing one of its accepted moves (every class but do-not-hang). */
type Answered = Extract<Puzzle, { readonly accept: readonly string[] }>;

describe("ABC-127 A1 — the harder rows", () => {
  const added = PUZZLES.filter(
    (p): p is Answered => p.kind !== "do-not-hang" && p.tags !== undefined,
  );
  const tagged = (tag: PuzzleTag) => added.filter((p) => p.tags?.includes(tag));

  it(">= 16 rows after ABC-084's 40, each tagged: >= 6 mate-in-3, >= 6 win-material (>= 3 black to move), >= 4 quiet-key, >= 4 depth≥5, >= 4 quiescence", () => {
    expect(PUZZLES.slice(0, 40).every((p) => !("tags" in p))).toBe(true);
    expect(PUZZLES.slice(40)).toEqual(added);
    expect(added.length).toBeGreaterThanOrEqual(16);
    for (const p of added) expect(p.tags?.length, p.name).toBeGreaterThan(0);
    const win = added.filter((p) => p.kind === "win-material");
    expect(added.filter((p) => p.kind === "mate-in-3").length).toBeGreaterThanOrEqual(6);
    expect(win.length).toBeGreaterThanOrEqual(6);
    expect(win.filter((p) => p.fen.split(" ")[1] === "b").length).toBeGreaterThanOrEqual(3);
    expect(tagged("quiet-key").length).toBeGreaterThanOrEqual(4);
    expect(tagged("depth≥5").length).toBeGreaterThanOrEqual(4);
    expect(tagged("quiescence").length).toBeGreaterThanOrEqual(4);
  });

  it("every quiet-key row's accepted moves are neither a capture, a check nor a promotion", () => {
    for (const puzzle of tagged("quiet-key")) {
      const position = parseFen(puzzle.fen);
      for (const move of legalMoves(position)) {
        if (!puzzle.accept.includes(label(move))) continue;
        expect(move.captured, `${puzzle.name}: ${label(move)}`).toBe(EMPTY);
        expect(move.promotion, `${puzzle.name}: ${label(move)}`).toBe(EMPTY);
        const undo = makeMove(position, move);
        expect(isInCheck(position), `${puzzle.name}: ${label(move)}`).toBe(false);
        unmakeMove(position, move, undo);
      }
    }
  });

  it("no new row repeats, or is the colour mirror of, any row of the corpus", () => {
    for (const puzzle of added) {
      const others = new Set(
        PUZZLES.filter((p) => p !== puzzle).map((p) => placementAndSide(p.fen)),
      );
      expect(others.has(placementAndSide(puzzle.fen)), puzzle.name).toBe(false);
      expect(others.has(colourMirror(puzzle.fen)), puzzle.name).toBe(false);
    }
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
  /** The rows the recorded run did not solve (ABC-127 `A5`). */
  readonly unsolved: readonly string[];
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
      // ABC-127 A5: below the ceiling a lost row can hide behind a gained one, so every row
      // whose state differs from the recorded run is named. The gate is still the count.
      const recorded = new Set(baseline.unsolved);
      for (const r of run.results) {
        if (r.solved === recorded.has(r.name)) {
          console.log(
            `${r.solved ? "NEWLY-SOLVED" : "NEWLY-MISSED"}\t${r.kind}\t${r.chosen}\t${r.name}`,
          );
        }
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

      // ABC-127 A2: the answers re-proven here, by searches that import no engine code.
      it("ABC-127 A2 — each mate-in-3 row has no mate in <= 2, and its accepted moves are EXACTLY the moves that mate in 3", () => {
        const started = performance.now();
        const rows = PUZZLES.filter((p): p is Answered => p.kind === "mate-in-3");
        for (const puzzle of rows) {
          expect(matingMoves(puzzle.fen, 2), puzzle.name).toEqual([]);
          expect(matingMoves(puzzle.fen, 3).sort(), puzzle.name).toEqual([...puzzle.accept].sort());
        }
        const wall = (performance.now() - started) / 1_000;
        console.log(`ORACLE mate-in-3: ${rows.length} rows, wall ${wall.toFixed(2)} s`);
      }, 300_000);

      it("ABC-127 A2 — each win-material row (ABC-084's six included) accepts EXACTLY the material-best moves, and they gain", () => {
        const started = performance.now();
        const rows = PUZZLES.filter((p): p is Answered => p.kind === "win-material");
        for (const puzzle of rows) {
          const { gain, moves } = materialBest(puzzle.fen);
          expect(gain, puzzle.name).toBeGreaterThan(0);
          expect(moves.sort(), puzzle.name).toEqual([...puzzle.accept].sort());
        }
        const wall = (performance.now() - started) / 1_000;
        console.log(`ORACLE win-material: ${rows.length} rows, wall ${wall.toFixed(2)} s`);
      }, 300_000);
    }

    if (MODE === "weakened") {
      it("A3 — the weakened engine solves FEWER than the baseline (so the gate row above is red)", async () => {
        expect((await gatingRun()).solved).toBeLessThan(baseline.solved);
      }, 300_000);
    }
  });
}
