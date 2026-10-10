/**
 * ABC-087 — difficulty levels, the MECHANISM: a level table, a seeded blunder draw, and the
 * `ADR-0032` blunder construction (every root move scored by the shipped `chooseMove` on its
 * child, the strict second-best played).
 *
 * WHY TWO CORPORA. A blunder move runs one `chooseMove` per legal root move, and even a depth-1
 * `chooseMove` costs about 3 ms on a middlegame position (measured: ~600 nodes, the cost is the
 * legality checks). A blunder on the perft corpus costs 100-300 ms, so `A4`'s ≥ 200 moves there
 * cost about 30 s of CPU — fifty times `N8-LANE`'s 650 ms. The default lane therefore walks
 * `ENDGAMES` (light positions, ~1 ms per blunder) and the perft + puzzle corpus runs under
 * `ENGINE_DEEP=1`. The criteria fix counts, not position types; the deep `A4` is the reading on
 * the positions a game actually reaches.
 *
 * LANES, on the `ENGINE_DEEP` precedent (`N8-LANE`):
 * - DEFAULT (`npm test`): `A1`, `A4`, `A6`, `A7`, `A8`, `A9`, `A10` on `ENDGAMES`, on a virtual
 *   clock with a COARSE step (one reading per level budget, so every search is depth 1). None of
 *   these is about budget fidelity; the step is the dial.
 * - `ENGINE_DEEP=1`: `A4` again on the perft + puzzle corpus; `A2` (budget fidelity on a FINE
 *   virtual step — test note 3, never the wall clock); `A5` (the hardest level on the REAL clock,
 *   `NFR-004`'s 5 s); `A3` (easiest vs default on `ABC-084`'s puzzles, deterministic). Unset, those
 *   cases are NOT DEFINED, not skipped, so the gate's skip count stays 0.
 */

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { makeMove, unmakeMove } from "./apply.ts";
import { type Clock, chooseMove, DEFAULT_BUDGET_MS, HARD_CEILING_MS } from "./engine.ts";
import { parseFen, toFen } from "./fen.ts";
import { legalMoves } from "./legal.ts";
import {
  createLevel,
  DEFAULT_LEVEL,
  EASIEST_LEVEL,
  HARDEST_LEVEL,
  LEVELS,
  type Level,
  type LevelChoice,
  seededRandom,
} from "./levels.ts";
import type { Move } from "./moves.ts";
import { squareName } from "./position.ts";
import { virtualClock } from "./virtual-clock.ts";

const RUN_DEEP = process.env.ENGINE_DEEP === "1";

const label = (move: Move): string => `${squareName(move.from)}${squareName(move.to)}`;

const easiest = LEVELS[EASIEST_LEVEL];

/**
 * Each FEN, then every position one legal ply from it — `buildCorpus`'s shape — less any with no
 * legal move (a mate or stalemate one ply on).
 */
function withChildren(roots: readonly string[]): string[] {
  const fens: string[] = [];
  for (const root of roots) {
    const position = parseFen(root);
    fens.push(root);
    for (const move of legalMoves(position)) {
      const undo = makeMove(position, move);
      if (legalMoves(position).length > 0) fens.push(toFen(position));
      unmakeMove(position, move, undo);
    }
  }
  return fens;
}

/** Light positions, both colours to move: the default lane's corpus. */
const ENDGAMES = withChildren([
  "8/8/4k3/8/8/4K3/4P3/8 w - - 0 1",
  "8/8/8/3k4/8/8/8/R3K3 w - - 0 1",
  "6k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1",
  "8/5k2/8/8/8/2B5/3N4/4K3 w - - 0 1",
  "8/1p3k2/8/8/8/8/1P3K2/3R4 w - - 0 1",
  "8/8/2k5/8/8/8/3Q4/4K3 w - - 0 1",
  "8/pp3k2/8/8/8/8/PP3K2/8 w - - 0 1",
  "8/8/8/4k3/8/8/2PPP3/4K3 w - - 0 1",
  "6k1/8/8/8/8/8/1R6/6K1 b - - 0 1",
  "8/3k4/8/2n5/8/5B2/3K4/8 w - - 0 1",
  "8/p4k2/1p6/8/8/1P6/P4K2/8 w - - 0 1",
  "8/5pk1/6p1/8/8/6P1/5PK1/8 b - - 0 1",
  "8/8/4k3/8/2b5/8/4PK2/8 w - - 0 1",
  "8/4k3/8/3n4/8/2P5/3K4/8 w - - 0 1",
]);

/** ≥ 30 positions for `A6` / `A7` / `A9` / `A10`: the first 30 endgame positions with ≤ 8 legal moves. */
const THIRTY = ENDGAMES.filter((fen) => legalMoves(parseFen(fen)).length <= 8).slice(0, 30);

/** One clock reading per level budget: depth 1 on the engine path, depth 1 per child. */
const coarseClock = (level: Level): Clock => virtualClock(level.budgetMs);

/** One move per FEN from a fresh position, through ONE level instance (one generator). */
function playAll(level: Level, seed: number, fens: readonly string[]): LevelChoice[] {
  const choose = createLevel(level, { seed, now: coarseClock(level) });
  return fens.map((fen) => {
    const choice = choose(parseFen(fen));
    if (choice === null) throw new Error(`no legal move in a corpus position: ${fen}`);
    return choice;
  });
}

/** A blunder-decision sequence (`A9`): per position, whether a blunder was played and which. */
const decisions = (choices: readonly LevelChoice[]): string[] =>
  choices.map((c) => (c.kind === "blunder" ? `B:${label(c.move)}` : `-:${c.kind}`));

/** `A4`, every clause, on one run of the easiest level over `fens`. */
function assertA4(lane: string, fens: readonly string[], choices: readonly LevelChoice[]): void {
  // ≥ 200 moves, every one legal.
  expect(choices.length).toBeGreaterThanOrEqual(200);
  fens.forEach((fen, i) => {
    const choice = choices[i] as LevelChoice;
    const legal = legalMoves(parseFen(fen)).map(label);
    expect(legal).toContain(label(choice.move));
    // The scored list is every legal root move, in `legalMoves` order.
    if (choice.kind !== "engine") expect(choice.scored?.map((s) => label(s.move))).toEqual(legal);
  });

  // The rate ±5 pp: blunders played ÷ moves, no-candidate moves out of the denominator.
  const blunders = choices.filter((c) => c.kind === "blunder").length;
  const noCandidate = choices.filter((c) => c.kind === "no-candidate").length;
  const frequency = blunders / (choices.length - noCandidate);
  console.log(
    `A4 [${lane}]: ${blunders} blunders / (${choices.length} moves - ${noCandidate} ` +
      `no-candidate) = ${(frequency * 100).toFixed(1)}% against ${easiest.blunderRate * 100}%`,
  );
  expect(blunders).toBeGreaterThan(0);
  expect(Math.abs(frequency - easiest.blunderRate)).toBeLessThanOrEqual(0.05);

  for (const choice of choices) {
    if (choice.kind === "engine") {
      // A non-blunder move carries no list; the clause does not apply.
      expect(choice.scored).toBeNull();
      continue;
    }
    const scored = choice.scored ?? [];
    const scores = scored.map((s) => s.score);
    const [min, max] = [Math.min(...scores), Math.max(...scores)];
    const played = scored.find((s) => s.move === choice.move);
    // Never the worst class of that move's own list (when the list is not all one score).
    if (min < max) expect(played?.score).toBeGreaterThan(min);
    // The STRICT second-best, ties to the first scored; no candidate → the first best.
    const between = scored.filter((s) => s.score < max && s.score > min);
    if (choice.kind === "blunder") {
      const second = Math.max(...between.map((s) => s.score));
      expect(played).toBe(between.find((s) => s.score === second));
    } else {
      expect(between).toEqual([]);
      expect(played).toBe(scored.find((s) => s.score === max));
    }
  }
}

// ---------------------------------------------------------------------------
// A1 — levels are data, the endpoints are named.
// ---------------------------------------------------------------------------

describe("A1 — the level table", () => {
  it("is keyed 1-5, weakest to strongest, easiest 1, default 3, hardest 5", () => {
    expect(Object.keys(LEVELS)).toEqual(["1", "2", "3", "4", "5"]);
    expect([EASIEST_LEVEL, DEFAULT_LEVEL, HARDEST_LEVEL]).toEqual([1, 3, 5]);
  });

  it("gives every level a budget and a blunder rate, and nothing else", () => {
    for (const level of Object.values(LEVELS)) {
      expect(Object.keys(level).sort()).toEqual(["blunderRate", "budgetMs"]);
      expect(level.budgetMs).toBeGreaterThan(0);
      expect(level.blunderRate).toBeGreaterThanOrEqual(0);
      expect(level.blunderRate).toBeLessThan(1);
    }
  });

  it("orders the table weakest to strongest: budgets never fall, rates never rise", () => {
    const ordered = ([1, 2, 3, 4, 5] as const).map((id) => LEVELS[id]);
    for (let i = 1; i < ordered.length; i++) {
      const [weaker, stronger] = [ordered[i - 1] as Level, ordered[i] as Level];
      expect(stronger.budgetMs).toBeGreaterThanOrEqual(weaker.budgetMs);
      expect(stronger.blunderRate).toBeLessThanOrEqual(weaker.blunderRate);
      expect(stronger.budgetMs > weaker.budgetMs || stronger.blunderRate < weaker.blunderRate).toBe(
        true,
      );
    }
  });

  it("is frozen — data, not session state", () => {
    expect(Object.isFrozen(LEVELS)).toBe(true);
    for (const level of Object.values(LEVELS)) expect(Object.isFrozen(level)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// A6 — the default is the 3 s level, and a rate-0 level IS the shipped engine.
// ---------------------------------------------------------------------------

describe("A6 — the default level", () => {
  it("has the 3 s budget (`NFR-004`), the engine's own `DEFAULT_BUDGET_MS`", () => {
    expect(LEVELS[DEFAULT_LEVEL].budgetMs).toBe(3_000);
    expect(LEVELS[DEFAULT_LEVEL].budgetMs).toBe(DEFAULT_BUDGET_MS);
  });

  it("never blunders, so `NFR-005`'s reading on `chooseMove` at 3 s IS this level's reading", () => {
    expect(LEVELS[DEFAULT_LEVEL].blunderRate).toBe(0);
  });

  it("at rate 0 returns `chooseMove`'s move, depth, nodes and elapsed on the same clock", () => {
    const level = LEVELS[DEFAULT_LEVEL];
    const step = level.budgetMs / 3;
    for (const fen of THIRTY.slice(0, 6)) {
      const viaLevel = createLevel(level, { seed: 7, now: virtualClock(step) })(parseFen(fen));
      const viaEngine = chooseMove(parseFen(fen), {
        budgetMs: level.budgetMs,
        now: virtualClock(step),
      });
      expect(viaLevel?.kind).toBe("engine");
      expect(viaLevel?.move).toEqual(viaEngine?.move);
      expect(viaLevel?.depth).toBe(viaEngine?.depth);
      expect(viaLevel?.nodes).toBe(viaEngine?.nodes);
      expect(viaLevel?.elapsedMs).toBe(viaEngine?.elapsedMs);
    }
  });
});

// ---------------------------------------------------------------------------
// A4 — the blunder is a mistake, not chaos. The criterion that means something (test note 2).
// ---------------------------------------------------------------------------

describe("A4 — the easiest level over ≥ 200 moves", () => {
  it("every move legal; rate ±5 pp; never the worst; the strict second-best", () => {
    assertA4("default lane, ENDGAMES", ENDGAMES, playAll(easiest, 87, ENDGAMES));
  });

  it("hands the borrowed position back byte-identical after a blunder", () => {
    const always: Level = { budgetMs: 100, blunderRate: 0.999_999 };
    for (const fen of ENDGAMES.slice(0, 20)) {
      const position = parseFen(fen);
      expect(createLevel(always, { seed: 1, now: virtualClock(100) })(position)?.kind).not.toBe(
        "engine",
      );
      expect(toFen(position)).toBe(fen);
    }
  });
});

describe("the blunder path's edge cases (ADR-0032 decisions 1-2)", () => {
  /** A rate of (just under) 1: every draw calls for a blunder. */
  const always: Level = { budgetMs: 100, blunderRate: 0.999_999 };
  const play = (fen: string): LevelChoice | null =>
    createLevel(always, { seed: 1, now: virtualClock(100) })(parseFen(fen));

  it("scores a mating child MATE_SCORE − 1, and the mate is not played as the second best", () => {
    // A back-rank mate, Ra8#, among the other rook, king and pawn moves.
    const choice = play("6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1");
    expect(choice?.scored?.find((s) => label(s.move) === "a1a8")?.score).toBe(30_000 - 1);
    expect(choice?.kind).toBe("blunder");
    expect(label(choice?.move as Move)).not.toBe("a1a8");
  });

  it("scores a stalemating child 0", () => {
    // Qf7 leaves the black king on h8 with no move and not in check.
    const choice = play("7k/8/5QK1/8/8/8/8/8 w - - 0 1");
    expect(choice?.scored?.find((s) => label(s.move) === "f6f7")?.score).toBe(0);
  });

  it("returns null on a position with no legal move", () => {
    expect(play("R5k1/5ppp/8/8/8/8/5PPP/6K1 b - - 0 1")).toBeNull();
  });

  it("with a single legal move there is no candidate, and it is played", () => {
    const choice = play("k7/8/8/8/8/7P/2q5/K7 w - - 0 1"); // h3h4 only: the queen holds a2, b1, b2
    expect(choice?.kind).toBe("no-candidate");
    expect(choice?.scored).toHaveLength(1);
    expect(label(choice?.move as Move)).toBe("h3h4");
  });
});

// ---------------------------------------------------------------------------
// The generator (`ADR-0027` decision 2) — and A9 BEFORE A7 (test note 5).
// ---------------------------------------------------------------------------

describe("seededRandom — the generator", () => {
  it("returns numbers in [0, 1), the same sequence for the same seed", () => {
    const [a, b] = [seededRandom(42), seededRandom(42)];
    for (let i = 0; i < 1_000; i++) {
      const x = a();
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThan(1);
      expect(b()).toBe(x);
    }
  });

  it("rejects a seed that is not an integer (a NaN would silently collapse to one seed)", () => {
    for (const bad of [Number.NaN, 1.5, Number.POSITIVE_INFINITY]) {
      expect(() => seededRandom(bad)).toThrow(RangeError);
    }
  });
});

describe("A9 — different seeds actually differ", () => {
  it("≥ 5 seeds over the same ≥ 30 positions give ≥ 2 distinct blunder-decision sequences", () => {
    expect(THIRTY).toHaveLength(30);
    const sequences = [1, 2, 3, 4, 5].map((seed) =>
      decisions(playAll(easiest, seed, THIRTY)).join(),
    );
    console.log(`A9: ${new Set(sequences).size} distinct sequences over 5 seeds`);
    expect(new Set(sequences).size).toBeGreaterThanOrEqual(2);
  });
});

describe("A7 — seeded, in deterministic mode", () => {
  it("a fixed seed gives identical blunder decisions across runs", () => {
    const first = decisions(playAll(easiest, 2026, THIRTY));
    expect(first.some((d) => d.startsWith("B:"))).toBe(true);
    expect(decisions(playAll(easiest, 2026, THIRTY))).toEqual(first);
  });
});

describe("A10 — the seed is threaded, not global", () => {
  it("two instances, different seeds, called A, B, A, B, … play as each alone: 10/10 each", () => {
    const fens = THIRTY.slice(0, 10);
    const alone = (seed: number): string[] =>
      playAll(easiest, seed, fens).map((c) => label(c.move));
    const a = createLevel(easiest, { seed: 11, now: coarseClock(easiest) });
    const b = createLevel(easiest, { seed: 12, now: coarseClock(easiest) });
    const [movesA, movesB]: [string[], string[]] = [[], []];
    for (const fen of fens) {
      movesA.push(label((a(parseFen(fen)) as LevelChoice).move));
      movesB.push(label((b(parseFen(fen)) as LevelChoice).move));
    }
    expect(movesA).toEqual(alone(11));
    expect(movesB).toEqual(alone(12));
    // The two seeds must lead to different play, or the interleaving proves nothing.
    expect(movesA).not.toEqual(movesB);
  });
});

// ---------------------------------------------------------------------------
// A8 — no user interface, and the engine is not touched. The diff half is the PR's numstat.
// ---------------------------------------------------------------------------

describe("A8 — the level module's boundary", () => {
  const source = readFileSync(new URL("./levels.ts", import.meta.url), "utf8");
  const code = source.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "");
  const imports = [...code.matchAll(/from\s+"([^"]+)"/g)].map((m) => m[1]);

  it("does not import the virtual clock, the CLI, the turn loop or any I/O module", () => {
    expect(imports.sort()).toEqual([
      "./apply.ts",
      "./engine.ts",
      "./gameend.ts",
      "./legal.ts",
      "./moves.ts",
      "./position.ts",
      "./search.ts",
    ]);
  });

  it("holds no argv parsing and no prompt", () => {
    expect(code).not.toMatch(/process\.|argv|readline|prompt|stdin|stdout|console\./);
  });
});

// ---------------------------------------------------------------------------
// A4 (deep corpus), A2, A5, A3 — OPT-IN: `ENGINE_DEEP=1`.
// ---------------------------------------------------------------------------

if (RUN_DEEP) {
  // Loaded here, not at the top: the default lane never pays for the deep corpora (`N8-LANE`).
  const { buildCorpus } = await import("./evaluate.mirror-corpus.ts");
  const { PUZZLES } = await import("./puzzle-corpus.ts");

  /** The perft corpus (184) and the puzzles: the deep lane's corpus. */
  const deepCorpus = (): string[] => [
    ...buildCorpus().map((entry) => toFen(entry.position)),
    ...PUZZLES.map((puzzle) => puzzle.fen),
  ];

  describe("A4 — the easiest level over the perft corpus and the puzzles [deep]", () => {
    it("every move legal; rate ±5 pp; never the worst; the strict second-best", () => {
      const fens = deepCorpus();
      assertA4("ENGINE_DEEP, perft + puzzles", fens, playAll(easiest, 87, fens));
    }, 300_000);
  });

  /** Positions spread across the perft corpus: every sixth, 31 in all. */
  const spread = buildCorpus()
    .filter((_, i) => i % 6 === 0)
    .map((entry) => toFen(entry.position));

  describe("A2 — the budget reaches the engine, ±20% on a fine virtual step [deep]", () => {
    /**
     * The shipped path overruns its deadline by about two readings, so 50 readings per move
     * resolve ±20% with room. A blunder pays about four fixed readings per child, so it needs
     * 300: a 44-move position still gives each child ~7.
     */
    const shippedStep = (level: Level): number => level.budgetMs / 50;
    const blunderStep = (level: Level): number => level.budgetMs / 300;

    it("every level, on the shipped path, uses its budget ±20% and never more than 5 s", () => {
      for (const id of [1, 2, 3, 4, 5] as const) {
        const level = LEVELS[id];
        // A seed whose first draw does not blunder, so this row reads the shipped path.
        const seed = [...Array(50).keys()].find((s) => seededRandom(s)() >= level.blunderRate);
        const choose = createLevel(level, {
          seed: seed as number,
          now: virtualClock(shippedStep(level)),
        });
        const choice = choose(parseFen(spread[3] as string));
        console.log(`A2 level ${id}: ${choice?.kind}, ${choice?.elapsedMs} / ${level.budgetMs}`);
        expect(choice?.kind).toBe("engine");
        const elapsed = choice?.elapsedMs as number;
        expect(Math.abs(elapsed - level.budgetMs)).toBeLessThanOrEqual(level.budgetMs * 0.2);
        expect(elapsed).toBeLessThanOrEqual(HARD_CEILING_MS);
      }
    }, 300_000);

    it("a blunder move at the easiest level uses the level budget ±20% (the clamped sum)", () => {
      const seed = [...Array(50).keys()].find((s) => seededRandom(s)() < easiest.blunderRate);
      // One position with 20 legal moves and one with 43 (measured): the narrow and the wide.
      for (const fen of [spread[0], spread[4]] as string[]) {
        const choose = createLevel(easiest, {
          seed: seed as number,
          now: virtualClock(blunderStep(easiest)),
        });
        const choice = choose(parseFen(fen));
        console.log(
          `A2 blunder path: ${choice?.kind} over ${choice?.scored?.length} children, ` +
            `${choice?.elapsedMs} / ${easiest.budgetMs}`,
        );
        expect(choice?.kind).not.toBe("engine");
        const elapsed = choice?.elapsedMs as number;
        expect(Math.abs(elapsed - easiest.budgetMs)).toBeLessThanOrEqual(easiest.budgetMs * 0.2);
      }
    }, 300_000);
  });

  describe("A5 — the hardest level, 30 positions, every move ≤ 5 s on the REAL clock [deep]", () => {
    it("returns within 5 000 ms on 30/30", () => {
      const hardest = LEVELS[HARDEST_LEVEL];
      // The hardest level never blunders, so A5's blunder clause has nothing to cover.
      expect(hardest.blunderRate).toBe(0);
      const elapsed: number[] = [];
      for (const fen of spread.slice(0, 30)) {
        const start = Date.now();
        const choice = createLevel(hardest, { seed: 5 })(parseFen(fen));
        elapsed.push(Date.now() - start);
        expect(choice).not.toBeNull();
      }
      console.log(`A5: ${elapsed.length} moves, max ${Math.max(...elapsed)} ms: ${elapsed}`);
      expect(elapsed).toHaveLength(30);
      expect(Math.max(...elapsed)).toBeLessThanOrEqual(HARD_CEILING_MS);
    }, 300_000);
  });

  describe("A3 — the easiest level solves strictly fewer puzzles than the default [deep]", () => {
    /**
     * `ABC-084`'s runner rule — a fresh virtual clock per move; solved = an accepted move, or not
     * the losing one — at ONE step for both levels, so they differ by budget and rate only.
     * 120 virtual ms per reading puts the default level on 25 readings, which is `ABC-084`'s own
     * gating configuration (budget 25, step 1), and the easiest level under one reading per child.
     * (Step 10 was tried first: 35/62 vs 61/62, but 322 s, over the 300 s guard.) A measurement,
     * not the gate (`ADR-0034`); the baseline JSON is neither read nor touched.
     */
    const STEP_MS = 120;

    const solvedBy = (level: Level, seed: number): number => {
      let solved = 0;
      for (const puzzle of PUZZLES) {
        const choose = createLevel(level, { seed, now: virtualClock(STEP_MS) });
        const choice = choose(parseFen(puzzle.fen));
        const chosen = choice === null ? "null" : label(choice.move);
        const ok =
          puzzle.kind === "do-not-hang" ? chosen !== puzzle.losing : puzzle.accept.includes(chosen);
        if (ok) solved++;
      }
      return solved;
    };

    it("counts both on one run of the suite in the tree", () => {
      const easy = solvedBy(easiest, 87);
      const normal = solvedBy(LEVELS[DEFAULT_LEVEL], 87);
      console.log(`A3: easiest ${easy}/${PUZZLES.length}, default ${normal}/${PUZZLES.length}`);
      expect(easy).toBeLessThan(normal);
    }, 300_000);
  });
}
