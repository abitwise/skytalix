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
 * - DEFAULT (`npm test`, 19 tests): `A1`, `A6`, `A7`, `A8`, `A9`, `A10`, `A4`'s byte-identity row
 *   and the edge cases, on `ENDGAMES` with a virtual clock on a COARSE step (one reading per level
 *   budget, so every search is depth 1). `A9`'s moves also carry `A4`'s per-move clauses (test
 *   note 7), a guard and not `A4`'s evidence.
 * - `ENGINE_DEEP=1`: `A4`'s ≥ 200-move `ENDGAMES` run (moved here, `rule-abc087-cost` option (a),
 *   for `N8-LANE`) and `A4` on the perft + puzzle corpus; `A2` (budget fidelity on a FINE
 *   virtual step — test note 3, never the wall clock); `A5` (the hardest level on the REAL clock,
 *   `NFR-004`'s 5 s); `A3` (easiest vs default on `ABC-084`'s puzzles, deterministic). Unset, those
 *   cases are NOT DEFINED, not skipped, so the gate's skip count stays 0.
 */

import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
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

/**
 * QE-087-a: every `chooseMove` call the level module makes is recorded, its options copied, and
 * passed through to the real engine unchanged. A pass-through, so every other row reads the real
 * engine; it costs no search. `vi.hoisted` because `vi.mock` is hoisted above the imports.
 */
const engineCalls = vi.hoisted(() => [] as { budgetMs: number; now: unknown; keys: string[] }[]);
vi.mock("./engine.ts", async (importOriginal) => {
  const real = await importOriginal<typeof import("./engine.ts")>();
  return {
    ...real,
    chooseMove: (...args: Parameters<typeof real.chooseMove>) => {
      const [, options] = args;
      engineCalls.push({
        budgetMs: options.budgetMs,
        now: options.now,
        keys: Object.keys(options).sort(),
      });
      return real.chooseMove(...args);
    },
  };
});

const RUN_DEEP = process.env.ENGINE_DEEP === "1";

const label = (move: Move): string => `${squareName(move.from)}${squareName(move.to)}`;

const easiest = LEVELS[EASIEST_LEVEL];

/**
 * `ceiling(L)`, from `NFR-004`'s accepted text (`ADR-0045` § AMENDMENT 2026-10-24, `ABC-212`
 * § Design ruling 1): 5 s at levels 1-5, 7 s at 6, 32 s at 7. A TEST-LOCAL transcription, never
 * a production export: the engine holds one clamp, and each level's ceiling is held by its budget.
 */
const CEILING_MS = {
  1: 5_000,
  2: 5_000,
  3: 5_000,
  4: 5_000,
  5: 5_000,
  6: 7_000,
  7: 32_000,
} as const satisfies Record<keyof typeof LEVELS, number>;

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

/**
 * `A4`'s per-move clauses on every move of one run (test note 7 reuses this on `A9`'s moves): legal;
 * a non-engine move's list is every legal root move in `legalMoves` order; never the worst class of
 * that list; a blunder is the STRICT second-best (ties to the first scored); a no-candidate move's
 * list has fewer than three distinct scores and the first best is played.
 */
function assertPerMove(fens: readonly string[], choices: readonly LevelChoice[]): void {
  fens.forEach((fen, i) => {
    const choice = choices[i] as LevelChoice;
    const legal = legalMoves(parseFen(fen)).map(label);
    expect(legal).toContain(label(choice.move));
    if (choice.kind === "engine") {
      // A non-blunder move carries no list; the clause does not apply.
      expect(choice.scored).toBeNull();
      return;
    }
    const scored = choice.scored ?? [];
    expect(scored.map((s) => label(s.move))).toEqual(legal);
    const scores = scored.map((s) => s.score);
    const [min, max] = [Math.min(...scores), Math.max(...scores)];
    const played = scored.find((s) => s.move === choice.move);
    // Never the worst class of that move's own list (when the list is not all one score).
    if (min < max) expect(played?.score).toBeGreaterThan(min);
    const between = scored.filter((s) => s.score < max && s.score > min);
    if (choice.kind === "blunder") {
      const second = Math.max(...between.map((s) => s.score));
      expect(played).toBe(between.find((s) => s.score === second));
    } else {
      // The label must be true by the move's own list, so a skipped blunder cannot hide under it.
      expect(new Set(scores).size).toBeLessThan(3);
      expect(between).toEqual([]);
      expect(played).toBe(scored.find((s) => s.score === max));
    }
  });
}

/** `A4`, every clause, on one run of the easiest level over `fens`. */
function assertA4(lane: string, fens: readonly string[], choices: readonly LevelChoice[]): void {
  expect(choices.length).toBeGreaterThanOrEqual(200);
  assertPerMove(fens, choices);

  // The rate ±5 pp (re-worded 2026-10-10, `rule-abc087-cost`): every move whose draw fired,
  // (blunder + no-candidate) ÷ moves. Blunders played ÷ moves is reported beside it.
  const blunders = choices.filter((c) => c.kind === "blunder").length;
  const noCandidate = choices.filter((c) => c.kind === "no-candidate").length;
  const frequency = (blunders + noCandidate) / choices.length;
  const played = blunders / choices.length;
  console.log(
    `A4 [${lane}]: (${blunders} blunders + ${noCandidate} no-candidate) / ${choices.length} moves = ` +
      `${(frequency * 100).toFixed(1)}% against ${easiest.blunderRate * 100}%; ` +
      `blunders played / moves = ${(played * 100).toFixed(1)}%`,
  );
  expect(blunders).toBeGreaterThan(0);
  expect(Math.abs(frequency - easiest.blunderRate)).toBeLessThanOrEqual(0.05);
}

// ---------------------------------------------------------------------------
// A1 — levels are data, the endpoints are named.
// ---------------------------------------------------------------------------

describe("A1 — the level table", () => {
  it("is keyed 1-7, weakest to strongest, easiest 1, default 5, hardest 7 (ADR-0045 A2)", () => {
    expect(Object.keys(LEVELS)).toEqual(["1", "2", "3", "4", "5", "6", "7"]);
    expect([EASIEST_LEVEL, DEFAULT_LEVEL, HARDEST_LEVEL]).toEqual([1, 5, 7]);
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
// ABC-174 (ADR-0045 D1-D3) — the re-cut table, the default at the top, and its time budget.
// Data rows, plus A3's 30 positions on a coarse step (budget / 3, the A6 row's step).
// ---------------------------------------------------------------------------

describe("ABC-174 A1 — the table is ADR-0045 D1's", () => {
  it("deep-equals D1, and the table and each entry are frozen", () => {
    expect(LEVELS).toEqual({
      1: { budgetMs: 100, blunderRate: 0.4 },
      2: { budgetMs: 180, blunderRate: 0.2 },
      3: { budgetMs: 330, blunderRate: 0.1 },
      4: { budgetMs: 1_000, blunderRate: 0.05 },
      5: { budgetMs: 3_000, blunderRate: 0 },
      6: { budgetMs: 5_000, blunderRate: 0 },
      7: { budgetMs: 30_000, blunderRate: 0 },
    });
    expect(Object.isFrozen(LEVELS)).toBe(true);
    for (const id of [1, 2, 3, 4, 5] as const) expect(Object.isFrozen(LEVELS[id])).toBe(true);
  });
});

describe("ABC-174 A2 — the default is level 5 (ABC-212: no longer the top)", () => {
  it("[EASIEST, DEFAULT, HARDEST] is [1, 5, 7], and the default is { DEFAULT_BUDGET_MS, 0 }", () => {
    expect([EASIEST_LEVEL, DEFAULT_LEVEL, HARDEST_LEVEL]).toEqual([1, 5, 7]);
    expect(DEFAULT_LEVEL).toBe(5);
    expect(HARDEST_LEVEL).toBe(7);
    expect(LEVELS[DEFAULT_LEVEL]).toEqual({ budgetMs: DEFAULT_BUDGET_MS, blunderRate: 0 });
  });
});

describe("ABC-212 A1 — levels 6 and 7 above the default (ADR-0045 § AMENDMENT A1-A2)", () => {
  it("LEVELS[6] is { 5 000, 0 } and LEVELS[7] is { 30 000, 0 }", () => {
    expect(LEVELS[6]).toEqual({ budgetMs: 5_000, blunderRate: 0 });
    expect(LEVELS[7]).toEqual({ budgetMs: 30_000, blunderRate: 0 });
  });

  it("LEVELS[1..5] are base's, value for value", () => {
    const base = [
      [100, 0.4],
      [180, 0.2],
      [330, 0.1],
      [1_000, 0.05],
      [3_000, 0],
    ];
    ([1, 2, 3, 4, 5] as const).forEach((id, i) => {
      const [budgetMs, blunderRate] = base[i] as [number, number];
      expect(LEVELS[id], `level ${id}`).toEqual({ budgetMs, blunderRate });
    });
  });

  it("the ordering row holds over 1..7: budgets never fall, rates never rise, each step improves one", () => {
    const ordered = ([1, 2, 3, 4, 5, 6, 7] as const).map((id) => LEVELS[id]);
    for (let i = 1; i < ordered.length; i++) {
      const [weaker, stronger] = [ordered[i - 1] as Level, ordered[i] as Level];
      expect(stronger.budgetMs).toBeGreaterThanOrEqual(weaker.budgetMs);
      expect(stronger.blunderRate).toBeLessThanOrEqual(weaker.blunderRate);
      expect(stronger.budgetMs > weaker.budgetMs || stronger.blunderRate < weaker.blunderRate).toBe(
        true,
      );
    }
  });

  it("levels 6 and 7 are frozen", () => {
    expect(Object.isFrozen(LEVELS[6])).toBe(true);
    expect(Object.isFrozen(LEVELS[7])).toBe(true);
  });
});

describe("ABC-174 A3 — the default plays as today: chooseMove at 3 000 ms, the old level 3", () => {
  const level = LEVELS[DEFAULT_LEVEL];
  const step = level.budgetMs / 3;

  it("move, depth and nodes are equal on 30 of 30 positions, for each of two seeds", () => {
    expect(THIRTY).toHaveLength(30);
    const reference = THIRTY.map((fen) =>
      chooseMove(parseFen(fen), { budgetMs: 3_000, now: virtualClock(step) }),
    );
    for (const seed of [1, 87]) {
      const equal = THIRTY.filter((fen, i) => {
        const viaLevel = createLevel(level, { seed, now: virtualClock(step) })(parseFen(fen));
        const viaEngine = reference[i];
        return (
          viaLevel !== null &&
          viaEngine != null &&
          viaLevel.kind === "engine" &&
          label(viaLevel.move) === label(viaEngine.move) &&
          viaLevel.depth === viaEngine.depth &&
          viaLevel.nodes === viaEngine.nodes
        );
      });
      expect(equal, `seed ${seed}`).toHaveLength(30);
    }
  });
});

describe("ABC-174 A4 — the mechanism's shape: a budget and a rate per level", () => {
  it("every level's keys are exactly [blunderRate, budgetMs]", () => {
    for (const id of [1, 2, 3, 4, 5, 6, 7] as const) {
      expect(Object.keys(LEVELS[id]).sort(), `level ${id}`).toEqual(["blunderRate", "budgetMs"]);
    }
  });
});

describe("ABC-174 A7 — the time budget, from the data (NFR-004; ADR-0038 decision 3)", () => {
  const budgets = ([1, 2, 3, 4, 5, 6, 7] as const).map((id) => LEVELS[id].budgetMs);

  it("clause A: the default's budget is DEFAULT_BUDGET_MS, which is 3 000", () => {
    expect(LEVELS[DEFAULT_LEVEL].budgetMs).toBe(DEFAULT_BUDGET_MS);
    expect(DEFAULT_BUDGET_MS).toBe(3_000);
  });

  it("clause B, per level (ABC-212 A5): budgetMs <= ceiling(L) over 1..7, < 5 000 over 1..5, clamp 32 000", () => {
    // `ADR-0045` § AMENDMENT A3: one clamp at the largest ceiling; each level's own ceiling is
    // held by its budget, with at least 2 000 ms of margin.
    ([1, 2, 3, 4, 5, 6, 7] as const).forEach((id, i) => {
      expect(budgets[i], `level ${id}`).toBeLessThanOrEqual(CEILING_MS[id]);
      expect(CEILING_MS[id] - (budgets[i] as number), `level ${id}`).toBeGreaterThanOrEqual(2_000);
    });
    for (const id of [1, 2, 3, 4, 5] as const) expect(LEVELS[id].budgetMs).toBeLessThan(5_000);
    expect(HARD_CEILING_MS).toBe(32_000);
    expect(Math.max(...Object.values(CEILING_MS))).toBe(HARD_CEILING_MS);
  });

  it("the verdict's step 4 is admitted: 4 <= LEVELS[1].budgetMs / 10, which is 10", () => {
    expect(LEVELS[1].budgetMs / 10).toBe(10);
    expect(4).toBeLessThanOrEqual(LEVELS[1].budgetMs / 10);
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

describe("QE-087-a — the seed never reaches the engine (ADR-0027 d1)", () => {
  it("every call is `{ budgetMs, now }`; the engine path gets the level budget for any seed", () => {
    const fen = THIRTY[0] as string;
    for (const seed of [1, 2, 3, 5, 7, 11, 13, 2026]) {
      // Rate 0: the engine path, whatever the seed.
      const level = LEVELS[DEFAULT_LEVEL];
      const clock = coarseClock(level);
      engineCalls.length = 0;
      createLevel(level, { seed, now: clock })(parseFen(fen));
      expect(engineCalls).toHaveLength(1);
      expect(engineCalls[0]).toEqual({
        budgetMs: level.budgetMs,
        now: clock,
        keys: ["budgetMs", "now"],
      });
      // A blunder: one call per root move, each with the same two keys and the caller's clock.
      const always: Level = { budgetMs: 100, blunderRate: 0.999_999 };
      const blunderClock = virtualClock(100);
      engineCalls.length = 0;
      const choice = createLevel(always, { seed, now: blunderClock })(parseFen(fen));
      expect(engineCalls).toHaveLength(choice?.scored?.length as number);
      for (const call of engineCalls) {
        expect(call.keys).toEqual(["budgetMs", "now"]);
        expect(call.now).toBe(blunderClock);
      }
    }
  });
});

describe("QE-087-b — the scored list is the engine's, not a self-consistent lie", () => {
  it("each child's score is minus the real `chooseMove`'s depth-1 score on that child", () => {
    // White wins the black queen with Qxd5: the honest list puts d1d5 alone at the top.
    const fen = "4k3/8/8/3q4/8/8/8/3QK3 w - - 0 1";
    const always: Level = { budgetMs: 100, blunderRate: 0.999_999 };
    // Coarse clock: every child runs depth 1 only, so the re-derivation is exact.
    const choice = createLevel(always, { seed: 1, now: virtualClock(100) })(parseFen(fen));
    const scored = choice?.scored ?? [];
    expect(scored.length).toBe(legalMoves(parseFen(fen)).length);
    const position = parseFen(fen);
    for (const entry of scored) {
      const undo = makeMove(position, entry.move);
      const child = chooseMove(position, { budgetMs: 0, now: virtualClock(100) });
      unmakeMove(position, entry.move, undo);
      expect(child?.depth).toBe(1);
      expect(entry.score).toBe(-(child?.score as number));
    }
    const top = Math.max(...scored.map((s) => s.score));
    expect(scored.filter((s) => s.score === top).map((s) => label(s.move))).toEqual(["d1d5"]);
  });
});

describe("Security/NFR R1 (QE-087-c) — the level clamps its own total to HARD_CEILING_MS", () => {
  it("a blundering level at twice the ceiling spends at most the ceiling plus a few readings", () => {
    // Five legal moves. `ABC-212` § Design ruling 4: the fixture scales with the clamp (at a
    // fixed 20 s it went vacuous once the clamp moved to 32 000). Probe: a removed level clamp
    // reds this at 68 800 > 38 400.
    const fen = "6k1/8/8/8/8/8/1R6/6K1 b - - 0 1";
    const step = HARD_CEILING_MS / 20;
    const level: Level = { budgetMs: 2 * HARD_CEILING_MS, blunderRate: 1 };
    const choice = createLevel(level, { seed: 1, now: virtualClock(step) })(parseFen(fen));
    expect(choice?.kind).not.toBe("engine");
    expect(choice?.elapsedMs).toBeLessThanOrEqual(HARD_CEILING_MS + 4 * step);
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
    const choice = play("7k/8/6K1/5Q2/8/8/8/8 w - - 0 1");
    expect(choice?.scored?.find((s) => label(s.move) === "f5f7")?.score).toBe(0);
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
    const sequences = [1, 2, 3, 4, 5].map((seed) => {
      const choices = playAll(easiest, seed, THIRTY);
      // Test note 7: `A4`'s per-move clauses on the moves already played. No new search.
      assertPerMove(THIRTY, choices);
      // QE-087-d: one draw per move (`ADR-0032` d2). Move k fires iff the k-th draw of a fresh
      // generator on the same seed is below the rate; an extra draw anywhere desynchronises it.
      const draws = seededRandom(seed);
      for (const choice of choices) {
        expect(choice.kind !== "engine").toBe(draws() < easiest.blunderRate);
      }
      return decisions(choices).join();
    });
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

  describe("A4 — the easiest level over ≥ 200 moves [deep]", () => {
    // Moved from the default lane unchanged (`rule-abc087-cost`, option (a)): `N8-LANE`.
    it("every move legal; rate ±5 pp; never the worst; the strict second-best [deep]", () => {
      assertA4("ENGINE_DEEP, ENDGAMES", ENDGAMES, playAll(easiest, 87, ENDGAMES));
    });
  });

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

    it("every level, on the shipped path, uses its budget ±20% and never more than its ceiling", () => {
      for (const id of [1, 2, 3, 4, 5, 6, 7] as const) {
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
        expect(elapsed).toBeLessThanOrEqual(CEILING_MS[id]);
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

  describe("A5 — level 5, 30 positions, every move ≤ 5 s on the REAL clock [deep]", () => {
    it("returns within 5 000 ms on 30/30", () => {
      // `ABC-212` A4: read by number. "The hardest" was level 5 when this row was written; it is
      // now 7, which has its own rows below.
      const hardest = LEVELS[5];
      // Level 5 never blunders, so A5's blunder clause has nothing to cover.
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
      expect(Math.max(...elapsed)).toBeLessThanOrEqual(5_000);
    }, 300_000);
  });

  /**
   * `ABC-212` A4: levels 6 and 7 on the REAL clock, `A5`'s positions. Each move spends its budget
   * (no early stop, § "Up to 30 s") and stays inside its `NFR-004` ceiling. About 2.5 min and
   * 5 min of wall: run at width 1 on a quiet host, never beside an `EPIC-008` reading. The log
   * carries the max and the max completed depth (a depth of 100 or more goes to Architect/Design,
   * `KEY_ARRAY_CAPACITY`).
   */
  describe("ABC-212 A4 — levels 6 and 7 spend their budget, inside their ceiling, on the REAL clock [deep]", () => {
    for (const [id, count, timeout] of [
      [6, 30, 300_000],
      [7, 10, 420_000],
    ] as const) {
      it(
        `level ${id}: ${count} of ${count} moves take >= ${LEVELS[id].budgetMs} and <= ${CEILING_MS[id]} ms`,
        () => {
          const level = LEVELS[id];
          expect(level.blunderRate).toBe(0);
          const elapsed: number[] = [];
          const depths: number[] = [];
          for (const fen of spread.slice(0, count)) {
            const start = Date.now();
            const choice = createLevel(level, { seed: 5 })(parseFen(fen));
            elapsed.push(Date.now() - start);
            expect(choice).not.toBeNull();
            depths.push(choice?.depth as number);
          }
          console.log(
            `ABC-212 A4 level ${id}: ${elapsed.length} moves, max ${Math.max(...elapsed)} ms, ` +
              `max depth ${Math.max(...depths)}: ${elapsed}`,
          );
          expect(elapsed).toHaveLength(count);
          expect(Math.min(...elapsed)).toBeGreaterThanOrEqual(level.budgetMs);
          expect(Math.max(...elapsed)).toBeLessThanOrEqual(CEILING_MS[id]);
        },
        timeout,
      );
    }
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
