/**
 * ABC-085 — the self-play ladder (`RISK-003`, `EPIC-004`'s first acceptance criterion).
 *
 * Plays the difficulty levels of `src/levels.ts` against each other, alternating colours, and
 * reports a RELATIVE score per pair. No Elo, no external engine, no opening book: the harness
 * drives `createLevel`, which no book wraps (`ADR-0012`). Every rule is the merged one —
 * termination is `gameStatusOf` (`src/gameend.ts`), legality is `legalMoves` / `makeMove`.
 *
 * THE STEP (`ADR-0038`, accepted). The step belongs to the RUN, never to a level:
 * - both sides of every game use one step, each on its own `virtualClock(step)` instance;
 * - every level plays at its `LEVELS` budget verbatim — budgets are never scaled;
 * - the steps are the two named constants below, never computed from a timing at run time.
 *
 * THREE LANES, on the `PUZZLE_DEEP` precedent:
 * - DEFAULT (`npm test`): the step constants, the one-step guard, the claim policy on a scripted
 *   repetition, the ply-cap-as-error rule, the scorer, the game counts / ply cap / run plan, the
 *   budgets passed verbatim, the colour schedule and the pair report's arithmetic on synthetic
 *   records. 0 ladder games, pinned by the last row.
 * - `LADDER_DEEP=1`: the short mode, step 120. Claims `A3`, `A4`, `A5` and an early `A2` signal on
 *   3v4 and 4v5, and NOTHING ELSE: at step 120 level 1 sits on the depth-1 floor. Every number it
 *   prints is labelled "short mode, step 120".
 * - `LADDER_DEEP=verdict`: the verdict mode, step 4 — `A1` (100 games) and `A2` (20 per adjacent
 *   pair). About 10 machine-hours (`ADR-0038` § Consequences, an estimate). It is taken on a tree
 *   that contains `ABC-083`'s merge, on the Orchestrator's schedule, never routinely.
 * Unset, the deep rows are not defined at all — absent from the run, never skipped.
 *
 * One `it` per pair, so `-t "3v4"` re-runs one pair, and `A5` makes the re-run reproduce it.
 * `A1` / `A2` are MEASURED AND REPORTED as MET or RED: a RED is `ABC-087`'s finding, not a
 * harness failure, so the score is printed, never asserted. `A3` and `A4` ARE asserted.
 */

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { loadavg } from "node:os";
import { performance } from "node:perf_hooks";
import { describe, expect, it } from "vitest";
import type { Clock } from "./engine.ts";
import { type GameHistory, gameStatusOf, newGame, playMove } from "./history.ts";
import { legalMoves } from "./legal.ts";
import { createLevel, LEVELS, seededRandom } from "./levels.ts";
import type { Move } from "./moves.ts";
import { squareName } from "./position.ts";
import { virtualClock } from "./virtual-clock.ts";

const MODE = process.env.LADDER_DEEP;

/** The short step (`ADR-0038` decision 3): routine, cheap, never a verdict. */
const SHORT_STEP = 120;
/** The verdict step (`ADR-0038` decision 3, the owner's "step 4"). */
const VERDICT_STEP = 4;

/** Games per pair. Even, so each side plays half as white. */
const VERDICT_A1_GAMES = 100;
const VERDICT_A2_GAMES = 20;
const SHORT_A1_GAMES = 10;
const SHORT_A2_GAMES = 4;

/** A game still running at this many plies is an ERROR, never a draw (`A3`, test note 2). */
const PLY_CAP = 600;
/** Plies chosen by the seeded generator before the levels take over (`A5`'s opening diversity). */
const OPENING_PLIES = 4;

const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

type LevelId = keyof typeof LEVELS;

/** `LADDER_DEEP`'s value → the run's one step. Anything else is refused. */
function stepForMode(mode: string): number {
  if (mode === "1") return SHORT_STEP;
  if (mode === "verdict") return VERDICT_STEP;
  throw new RangeError(`LADDER_DEEP must be "1" or "verdict", got ${JSON.stringify(mode)}`);
}

interface Side {
  readonly level: LevelId;
  /** The step this side's clock was built with — recorded at the one place the clock is made. */
  readonly step: number;
  readonly now: Clock;
  readonly choose: ReturnType<typeof createLevel>;
}

/**
 * One side: its own clock instance, its own seeded generator, its level's budget verbatim.
 * `make` is `createLevel`; a default row hands a spy to see the `LEVELS` entry passed as is.
 */
function makeSide(
  level: LevelId,
  seed: number,
  step: number,
  make: typeof createLevel = createLevel,
): Side {
  const now = virtualClock(step);
  return { level, step, now, choose: make(LEVELS[level], { seed, now }) };
}

/**
 * `ADR-0038` decisions 1–2, checked before any move: the run's step is a named constant, and both
 * sides were handed exactly it.
 */
function checkOneStep(white: Side, black: Side, step: number): void {
  if (step !== SHORT_STEP && step !== VERDICT_STEP) {
    throw new RangeError(
      `ladder: step ${step} is not a named step (${SHORT_STEP}, ${VERDICT_STEP})`,
    );
  }
  if (white.step !== step || black.step !== step) {
    throw new RangeError(
      `ladder: one step per run — run ${step}, white ${white.step}, black ${black.step}`,
    );
  }
}

type Ending = { readonly result: "white-wins" | "black-wins" | "draw"; readonly reason: string };

/**
 * The game's end, or null while it runs. CLAIM POLICY (`A3`, BA/PM's ruling): every claimable
 * draw is claimed at the first offer, and recorded as `<draw> (claimed)`, distinct from the
 * automatic `fivefold-repetition` / `seventy-five-move`.
 */
function adjudicate(history: GameHistory): Ending | null {
  const status = gameStatusOf(history);
  if (status.result !== "in-progress") return { result: status.result, reason: status.reason };
  if (status.claimable !== undefined) {
    return { result: "draw", reason: `${status.claimable.draws[0]} (claimed)` };
  }
  return null;
}

interface GameRecord {
  readonly result: Ending["result"] | "error";
  readonly reason: string;
  readonly moves: readonly Move[];
}

/** The game loop: adjudicate after every ply, stop at the first ending or at the cap. */
function runGame(
  history: GameHistory,
  nextMove: (history: GameHistory) => Move,
  plyCap: number,
): GameRecord {
  for (;;) {
    const ending = adjudicate(history);
    if (ending !== null) return { ...ending, moves: [...history.moves] };
    if (history.moves.length >= plyCap) {
      return { result: "error", reason: "ply-cap", moves: [...history.moves] };
    }
    playMove(history, nextMove(history));
  }
}

interface LadderGame extends GameRecord {
  readonly seed: number;
  readonly white: LevelId;
  readonly black: LevelId;
  readonly wallMs: number;
}

/** Ladder games played in this file's process — the default lane's pin reads it. */
let ladderGamesPlayed = 0;

/** One ladder game: the seeded opening, then the two levels on one step. */
function playLadderGame(white: LevelId, black: LevelId, seed: number, step: number): LadderGame {
  const sides = [
    makeSide(white, seed * 10 + white, step),
    makeSide(black, seed * 10 + black, step),
  ];
  checkOneStep(sides[0] as Side, sides[1] as Side, step);
  ladderGamesPlayed++;
  const opening = seededRandom(seed);
  const history = newGame(START_FEN);
  const t0 = performance.now();
  const record = runGame(
    history,
    (h) => {
      if (h.moves.length < OPENING_PLIES) {
        const moves = legalMoves(h.position);
        return moves[Math.floor(opening() * moves.length)] as Move;
      }
      const choice = (sides[h.position.blackToMove ? 1 : 0] as Side).choose(h.position);
      if (choice === null) throw new Error("ladder: a level returned no move in a running game");
      return choice.move;
    },
    PLY_CAP,
  );
  return { ...record, seed, white, black, wallMs: performance.now() - t0 };
}

/**
 * `A4`: the move list replays from the start position, every move in `legalMoves` of the position
 * it was played in, no ending before the last ply (so a claim was taken at its FIRST offer), and
 * the replayed ending equals the recorded one. Returns the first fault, or null.
 */
function replayFault(game: GameRecord): string | null {
  const history = newGame(START_FEN);
  for (const [ply, move] of game.moves.entries()) {
    if (adjudicate(history) !== null) return `ply ${ply}: played past an ending`;
    const key = JSON.stringify(move);
    if (!legalMoves(history.position).some((m) => JSON.stringify(m) === key)) {
      return `ply ${ply}: ${label(move)} is not legal`;
    }
    playMove(history, move);
  }
  const ending = adjudicate(history);
  if (game.result === "error") return ending === null ? null : "error recorded at an ending";
  if (ending === null || ending.result !== game.result || ending.reason !== game.reason) {
    return `ending ${JSON.stringify(ending)} != recorded ${game.result} / ${game.reason}`;
  }
  return null;
}

const label = (move: Move): string =>
  `${squareName(move.from)}${squareName(move.to)}${move.promotion === 0 ? "" : `=${move.promotion}`}`;

/** Win 1, draw 0.5, loss 0 for `level`. A ply-capped game has no score: it is an error. */
function scoreFor(game: LadderGame, level: LevelId): number {
  if (game.result === "error") throw new Error(`ladder: game seed ${game.seed} hit the ply cap`);
  if (game.result === "draw") return 0.5;
  return (game.result === "white-wins") === (game.white === level) ? 1 : 0;
}

interface Pairing {
  readonly seed: number;
  readonly white: LevelId;
  readonly black: LevelId;
}

/** Seeds 1..n/2; each seed's opening is played twice, the stronger level white then black. */
function colourSchedule(weaker: LevelId, stronger: LevelId, games: number): Pairing[] {
  if (!Number.isInteger(games / 2) || games <= 0) {
    throw new RangeError(`ladder: a pair plays a positive even number of games, got ${games}`);
  }
  const out: Pairing[] = [];
  for (let seed = 1; seed <= games / 2; seed++) {
    out.push({ seed, white: stronger, black: weaker });
    out.push({ seed, white: weaker, black: stronger });
  }
  return out;
}

function playPair(weaker: LevelId, stronger: LevelId, games: number, step: number): LadderGame[] {
  return colourSchedule(weaker, stronger, games).map(({ seed, white, black }) =>
    playLadderGame(white, black, seed, step),
  );
}

type Criterion = "A1" | "A2";

/** The run's pairs: 3v4 and 4v5 first (test note 5), then the rest of `A2`, then `A1`. */
function ladderPlan(
  verdict: boolean,
): readonly { weaker: LevelId; stronger: LevelId; games: number; criterion: Criterion }[] {
  const a1 = verdict ? VERDICT_A1_GAMES : SHORT_A1_GAMES;
  const a2 = verdict ? VERDICT_A2_GAMES : SHORT_A2_GAMES;
  return [
    { weaker: 3, stronger: 4, games: a2, criterion: "A2" },
    { weaker: 4, stronger: 5, games: a2, criterion: "A2" },
    { weaker: 2, stronger: 3, games: a2, criterion: "A2" },
    { weaker: 1, stronger: 2, games: a2, criterion: "A2" },
    { weaker: 1, stronger: 5, games: a1, criterion: "A1" },
  ];
}

interface PairSummary {
  readonly score: number;
  readonly wins: number;
  readonly draws: number;
  readonly losses: number;
  readonly claimed: number;
  readonly pct: number;
  /** `A1`'s bar is >= 90%, `A2`'s is > 50%, both for the STRONGER level. */
  readonly met: boolean;
  readonly reasons: Readonly<Record<string, number>>;
}

/** The pair's report arithmetic, for the stronger level. Pure: the deep row prints it. */
function summarizePair(
  played: readonly LadderGame[],
  stronger: LevelId,
  criterion: Criterion,
): PairSummary {
  const score = played.reduce((sum, g) => sum + scoreFor(g, stronger), 0);
  const wins = played.filter((g) => scoreFor(g, stronger) === 1).length;
  const draws = played.filter((g) => g.result === "draw").length;
  const reasons: Record<string, number> = {};
  for (const g of played) reasons[g.reason] = (reasons[g.reason] ?? 0) + 1;
  const claimed = played.filter((g) => g.reason.endsWith("(claimed)")).length;
  const pct = (100 * score) / played.length;
  const met = criterion === "A1" ? pct >= 90 : pct > 50;
  return { score, wins, draws, losses: played.length - wins - draws, claimed, pct, met, reasons };
}

const digest = (games: readonly LadderGame[]): string =>
  createHash("sha256")
    .update(games.map((g) => g.moves.map(label).join(" ")).join("\n"))
    .digest("hex")
    .slice(0, 16);

function commitOf(): string {
  try {
    const sha = execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
    const dirty = execFileSync("git", ["status", "--porcelain", "--", "src"], { encoding: "utf8" });
    return dirty.trim() === "" ? sha : `${sha}+dirty-src`;
  } catch {
    return "UNKNOWN - verify";
  }
}

// ---------------------------------------------------------------------------
// DEFAULT LANE — no ladder game.
// ---------------------------------------------------------------------------

describe("ABC-085 ladder — the step is one named constant per run (test note 6)", () => {
  it("LADDER_DEEP=1 is the short step 120, =verdict the verdict step 4, anything else refused", () => {
    expect([SHORT_STEP, VERDICT_STEP]).toEqual([120, 4]);
    expect(stepForMode("1")).toBe(SHORT_STEP);
    expect(stepForMode("verdict")).toBe(VERDICT_STEP);
    for (const bad of ["", "0", "true", "4", "120", "VERDICT"]) {
      expect(() => stepForMode(bad)).toThrow(RangeError);
    }
  });

  it("both sides read the run's one step, each on its own clock instance", () => {
    for (const step of [SHORT_STEP, VERDICT_STEP]) {
      const white = makeSide(5, 1, step);
      const black = makeSide(1, 2, step);
      expect(() => checkOneStep(white, black, step)).not.toThrow();
      expect([white.now(), white.now(), white.now()]).toEqual([0, step, 2 * step]);
      expect([black.now(), black.now()]).toEqual([0, step]); // white's readings did not move it
    }
  });

  it("refuses, before any move, a side handed a different step or a step not named", () => {
    const before = ladderGamesPlayed;
    expect(() => checkOneStep(makeSide(4, 1, SHORT_STEP), makeSide(3, 2, VERDICT_STEP), 4)).toThrow(
      /one step per run/,
    );
    expect(() => checkOneStep(makeSide(4, 1, 4), makeSide(3, 2, 4), SHORT_STEP)).toThrow(
      /one step per run/,
    );
    // A step computed from a timing is not one of the two literals, so it is refused.
    for (const derived of [30, 10, 119.99999, 4.000001]) {
      expect(() => checkOneStep(makeSide(4, 1, derived), makeSide(3, 2, derived), derived)).toThrow(
        /not a named step/,
      );
      expect(() => playLadderGame(4, 3, 1, derived)).toThrow(/not a named step/);
    }
    expect(ladderGamesPlayed).toBe(before);
  });
});

describe("ABC-085 ladder — the claim policy and the ply cap (A3, test notes 2 and 7)", () => {
  /** Nf3 Nf6 Ng1 Ng8, repeated: the start position recurs every 4 plies. No engine. */
  const shuffle = (h: GameHistory): Move => {
    const [from, to] = [
      ["g1", "f3"],
      ["g8", "f6"],
      ["f3", "g1"],
      ["f6", "g8"],
    ][h.moves.length % 4] as [string, string];
    const move = legalMoves(h.position).find(
      (m) => squareName(m.from) === from && squareName(m.to) === to,
    );
    if (move === undefined) throw new Error(`shuffle: ${from}${to} not legal`);
    return move;
  };

  /** Ra1-a2, a quiet move: from a halfmove clock of 99 it makes the fifty-move draw claimable. */
  const rookA1A2 = (h: GameHistory): Move => {
    const move = legalMoves(h.position).find(
      (m) => squareName(m.from) === "a1" && squareName(m.to) === "a2",
    );
    if (move === undefined) throw new Error("rookA1A2: a1a2 not legal");
    return move;
  };

  it("a threefold repetition ends as 'threefold-repetition (claimed)' at the first offer", () => {
    const record = runGame(newGame(START_FEN), shuffle, PLY_CAP);
    // The start position's third occurrence is after ply 8; the first claimable ply.
    expect(record).toMatchObject({ result: "draw", reason: "threefold-repetition (claimed)" });
    expect(record.moves).toHaveLength(8);
    expect(replayFault(record)).toBeNull();

    // Without the claim the same shuffle runs to the automatic fivefold, a distinct reason.
    const unclaimed = newGame(START_FEN);
    while (gameStatusOf(unclaimed).result === "in-progress")
      playMove(unclaimed, shuffle(unclaimed));
    expect(unclaimed.moves).toHaveLength(16);
    expect(gameStatusOf(unclaimed).reason).toBe("fivefold-repetition");
  });

  it("a fifty-move draw ends as 'fifty-move (claimed)' at the first offer", () => {
    const record = runGame(newGame("4k3/8/8/8/8/8/8/R3K3 w - - 99 80"), rookA1A2, PLY_CAP);
    expect(record).toMatchObject({ result: "draw", reason: "fifty-move (claimed)" });
    expect(record.moves).toHaveLength(1);
  });

  it("a game at the ply cap is an ERROR with no score, never a draw", () => {
    const record = runGame(newGame(START_FEN), shuffle, 4);
    expect(record).toMatchObject({ result: "error", reason: "ply-cap" });
    expect(record.moves).toHaveLength(4);
    const game: LadderGame = { ...record, seed: 1, white: 5, black: 1, wallMs: 0 };
    expect(() => scoreFor(game, 5)).toThrow(/ply cap/);
  });

  it("scores win 1, draw 0.5, loss 0 for the named level, from either chair", () => {
    const g = (white: LevelId, black: LevelId, result: Ending["result"]): LadderGame => ({
      result,
      reason: "checkmate",
      moves: [],
      seed: 1,
      white,
      black,
      wallMs: 0,
    });
    expect(scoreFor(g(5, 1, "white-wins"), 5)).toBe(1);
    expect(scoreFor(g(1, 5, "white-wins"), 5)).toBe(0);
    expect(scoreFor(g(1, 5, "black-wins"), 5)).toBe(1);
    expect(scoreFor(g(5, 1, "draw"), 5)).toBe(0.5);
  });

  it("A4's replay check refuses an illegal move and a move played past an ending", () => {
    const record = runGame(newGame(START_FEN), shuffle, PLY_CAP);
    const [first, ...rest] = record.moves as Move[];
    const illegal = { ...record, moves: [{ ...(first as Move), to: 0 }, ...rest] };
    expect(replayFault(illegal)).toMatch(/ply 0: .* is not legal/);
    const past = { ...record, moves: [...record.moves, shuffle(newGame(START_FEN))] };
    expect(replayFault(past)).toMatch(/ply 8: played past an ending/);
  });
});

describe("ABC-085 ladder — the run's constants and its report arithmetic (A1, A2, A5, A6)", () => {
  it("the game counts, the ply cap and the run plan are the stated constants", () => {
    expect({ VERDICT_A1_GAMES, VERDICT_A2_GAMES, SHORT_A1_GAMES, SHORT_A2_GAMES }).toEqual({
      VERDICT_A1_GAMES: 100,
      VERDICT_A2_GAMES: 20,
      SHORT_A1_GAMES: 10,
      SHORT_A2_GAMES: 4,
    });
    // The only hang guard on the deep rows (they carry no wall timeout).
    expect(PLY_CAP).toBe(600);
    const pairs = (verdict: boolean) =>
      ladderPlan(verdict).map((p) => `${p.weaker}v${p.stronger} ${p.games} ${p.criterion}`);
    expect(pairs(true)).toEqual(["3v4 20 A2", "4v5 20 A2", "2v3 20 A2", "1v2 20 A2", "1v5 100 A1"]);
    expect(pairs(false)).toEqual(["3v4 4 A2", "4v5 4 A2", "2v3 4 A2", "1v2 4 A2", "1v5 10 A1"]);
  });

  it("every level is built from its LEVELS entry itself — budgets are never scaled", () => {
    for (const level of [1, 2, 3, 4, 5] as const) {
      const seen: Parameters<typeof createLevel>[] = [];
      const spy: typeof createLevel = (...args) => {
        seen.push(args);
        return createLevel(...args);
      };
      const side = makeSide(level, 7, SHORT_STEP, spy);
      expect(seen).toHaveLength(1);
      const [config, options] = seen[0] as Parameters<typeof createLevel>;
      expect(config).toBe(LEVELS[level]);
      expect(options).toMatchObject({ seed: 7 });
      expect(options?.now).toBe(side.now);
    }
  });

  it("each seed is played in both chairs, stronger white first: half the games as white", () => {
    expect(colourSchedule(3, 4, 4)).toEqual([
      { seed: 1, white: 4, black: 3 },
      { seed: 1, white: 3, black: 4 },
      { seed: 2, white: 4, black: 3 },
      { seed: 2, white: 3, black: 4 },
    ]);
    const a1 = colourSchedule(1, 5, VERDICT_A1_GAMES);
    expect(a1).toHaveLength(100);
    expect(a1.filter((p) => p.white === 5)).toHaveLength(50);
    for (let seed = 1; seed <= 50; seed++) {
      const both = a1.filter((p) => p.seed === seed).map((p) => `${p.white}-${p.black}`);
      expect(both).toEqual(["5-1", "1-5"]);
    }
    for (const odd of [0, 3, 99]) expect(() => colourSchedule(1, 5, odd)).toThrow(RangeError);
  });

  it("the pair's score, W-D-L, claimed draws and MET/RED are for the stronger level", () => {
    const g = (
      white: LevelId,
      black: LevelId,
      result: Ending["result"],
      reason = "checkmate",
    ): LadderGame => ({ result, reason, moves: [], seed: 1, white, black, wallMs: 0 });
    // A1, 1v5, 10 games: level 5 wins 8 (both chairs), loses 0, draws 2 — 9/10 is exactly 90%.
    const a1 = [
      ...Array.from({ length: 4 }, () => g(5, 1, "white-wins")),
      ...Array.from({ length: 4 }, () => g(1, 5, "black-wins")),
      g(5, 1, "draw", "threefold-repetition (claimed)"),
      g(1, 5, "draw", "stalemate"),
    ];
    expect(summarizePair(a1, 5, "A1")).toEqual({
      score: 9,
      wins: 8,
      draws: 2,
      losses: 0,
      claimed: 1,
      pct: 90,
      met: true,
      reasons: { checkmate: 8, "threefold-repetition (claimed)": 1, stalemate: 1 },
    });
    // One more loss in place of a win: 8.5/10 is RED.
    const a1Red = [...a1.slice(1), g(1, 5, "white-wins")];
    expect(summarizePair(a1Red, 5, "A1")).toMatchObject({ score: 8, losses: 1, met: false });

    // A2, 4 games: 2/4 is RED (the bar is strictly over 50%); 2.5/4 is MET. Weaker level 3 wins one.
    const even = [
      g(4, 3, "white-wins"),
      g(4, 3, "black-wins"),
      g(3, 4, "black-wins"),
      g(3, 4, "white-wins"),
    ];
    expect(summarizePair(even, 4, "A2")).toMatchObject({
      score: 2,
      wins: 2,
      losses: 2,
      met: false,
    });
    const over = [...even.slice(0, 3), g(3, 4, "draw", "fifty-move (claimed)")];
    expect(summarizePair(over, 4, "A2")).toMatchObject({
      score: 2.5,
      wins: 2,
      draws: 1,
      losses: 1,
      claimed: 1,
      pct: 62.5,
      met: true,
    });
    // Automatic draws are draws, never claimed draws.
    const auto = [g(4, 3, "draw", "fivefold-repetition"), g(3, 4, "draw", "seventy-five-move")];
    expect(summarizePair(auto, 4, "A2")).toMatchObject({ draws: 2, claimed: 0, met: false });
  });
});

// ---------------------------------------------------------------------------
// LADDER_DEEP lanes — the games. Not defined when unset.
// ---------------------------------------------------------------------------

if (MODE !== undefined) {
  const step = stepForMode(MODE);
  const verdict = step === VERDICT_STEP;
  const modeLabel = verdict
    ? `verdict mode, step ${VERDICT_STEP}`
    : `short mode, step ${SHORT_STEP}`;
  const commit = commitOf();

  const plan = ladderPlan(verdict);

  /**
   * NO wall timeout (vitest's 0). A game is synchronous, so vitest's timer cannot pre-empt it: a
   * timeout only turns a slow pair that DID finish red (seen: 4v5 at 248.9 s against a 240 s
   * guard). The hang guard is `PLY_CAP`, and a capped game fails `A3`. No wall bound is a bar.
   */
  const NO_TIMEOUT = 0;

  describe(`ABC-085 ladder — ${modeLabel} (LADDER_DEEP=${MODE})`, () => {
    for (const { weaker, stronger, games, criterion } of plan) {
      const pair = `${weaker}v${stronger}`;
      it(
        `${pair}: level ${stronger} vs level ${weaker}, ${games} games, ${modeLabel}`,
        () => {
          const load1Start = loadavg()[0] as number;
          const t0 = performance.now();
          const played = playPair(weaker, stronger, games, step);
          const wallS = (performance.now() - t0) / 1_000;
          expect(played).toHaveLength(games);

          for (const game of played) {
            console.log(
              `LADDER GAME ${JSON.stringify({
                mode: modeLabel,
                pair,
                seed: game.seed,
                white: game.white,
                black: game.black,
                plies: game.moves.length,
                result: game.result,
                reason: game.reason,
                wallS: Number((game.wallMs / 1_000).toFixed(1)),
              })}`,
            );
          }

          // A3: every game reached an ending; none hit the cap.
          const errors = played.filter((g) => g.result === "error");
          expect(errors.map((g) => `seed ${g.seed} ${g.white}-${g.black}`)).toEqual([]);
          // A4: every move list replays legally, and every claim was at its first offer.
          expect(played.map(replayFault).filter((f) => f !== null)).toEqual([]);

          const { score, wins, draws, losses, claimed, pct, met, reasons } = summarizePair(
            played,
            stronger,
            criterion,
          );
          console.log(
            `LADDER PAIR ${JSON.stringify({
              mode: modeLabel,
              criterion: verdict ? criterion : `none — ${modeLabel} is never ${criterion}`,
              pair,
              stronger,
              commit,
              step,
              seeds: `1..${games / 2}, both colours each`,
              games,
              stronger_w_d_l: [wins, draws, losses],
              score: `${score}/${games}`,
              scorePct: Number(pct.toFixed(1)),
              bar: criterion === "A1" ? ">= 90%" : "> 50%",
              verdict: verdict ? (met ? "MET" : "RED") : "not graded (short mode)",
              claimedDraws: claimed,
              reasons,
              digest: digest(played),
              wallS: Number(wallS.toFixed(1)),
              load1: [Number(load1Start.toFixed(2)), Number((loadavg()[0] as number).toFixed(2))],
            })}`,
          );
        },
        NO_TIMEOUT,
      );
    }

    if (!verdict) {
      // A5: the same seed and the same build play the same games and the same score. 1v2 is the
      // cheap pair that exercises both levels' seeded blunder draws as well as the opening choice.
      it(
        `A5 1v2 reproduces: same move lists, same score, ${SHORT_A2_GAMES} games twice`,
        () => {
          const first = playPair(1, 2, SHORT_A2_GAMES, step);
          const second = playPair(1, 2, SHORT_A2_GAMES, step);
          expect(second.map((g) => g.moves)).toEqual(first.map((g) => g.moves));
          const total = (games: LadderGame[]) => games.reduce((s, g) => s + scoreFor(g, 2), 0);
          expect(total(second)).toBe(total(first));
          console.log(`LADDER A5 ${JSON.stringify({ mode: modeLabel, digest: digest(first) })}`);
        },
        NO_TIMEOUT,
      );
    }
  });
}

// The default lane plays no ladder game (`ADR-0038` decision 5) — pinned by a count. Last row.
if (MODE === undefined) {
  it("ABC-085 ladder — the default lane played 0 ladder games", () => {
    expect(ladderGamesPlayed).toBe(0);
  });
}
