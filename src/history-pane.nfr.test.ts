/**
 * `ABC-017`'s `A11` — the pane derives NOTHING, as a permanent structural guard, and the third and
 * binding part of `A12`'s cost bar.
 *
 * A COUNT, NOT A CLOCK, and the reason is this project's own record: `plans/nfr-catalog.md` has moved
 * a bar off the clock and onto a count five times now, each time because a timing bar with a factor
 * of two of headroom cannot fail on the regression it exists to catch. The ticket measures the same
 * thing from the other side — the UNBOUNDED model costs 95 / 382 / 1,192 µs at 40 / 120 / 300 plies
 * and is caught by the absolute and the ratio with room to spare, while a build that reintroduces
 * the repetition derive or reaches for `takeBack` is caught by NEITHER at any length. `A12`'s parts
 * 1 and 2 are wall-clock bars on named hardware and belong to the Security/NFR gate's out-of-tree
 * measurement; this file is the guard underneath that measurement, not a substitute for it, and no
 * microsecond is asserted here — this project's standing rule.
 *
 * WHAT IT PROTECTS IS `NFR-002`'s `O(window)` CLAIM, which rests on a structural fact verified at
 * `ABC-012`'s gate: nothing pulled the repetition derive into a frame. This pane and `ABC-016`'s
 * status panel are the two tickets on this board that can void it.
 *
 * It lives in its own file for the reason `gameend.nfr.test.ts` and `san.nfr.test.ts` both give: a
 * `vi.mock` factory is hoisted to file scope, so putting these assertions in `history-pane.test.ts`
 * would re-route the module graph for that whole acceptance table.
 */
import { readdirSync, readFileSync } from "node:fs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { GameHistory } from "./history.ts";
import type { Move } from "./moves.ts";

vi.mock("./fen.ts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./fen.ts")>();
  return { ...actual, parseFen: vi.fn(actual.parseFen) };
});

vi.mock("./san.ts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./san.ts")>();
  return { ...actual, toSan: vi.fn(actual.toSan) };
});

vi.mock("./gameend.ts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./gameend.ts")>();
  return { ...actual, gameStatus: vi.fn(actual.gameStatus) };
});

vi.mock("./history.ts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./history.ts")>();
  return {
    ...actual,
    playMove: vi.fn(actual.playMove),
    takeBack: vi.fn(actual.takeBack),
    keyHistory: vi.fn(actual.keyHistory),
    repetitionCounts: vi.fn(actual.repetitionCounts),
    gameStatusOf: vi.fn(actual.gameStatusOf),
  };
});

const { parseFen } = await import("./fen.ts");
const { toSan } = await import("./san.ts");
const { gameStatus } = await import("./gameend.ts");
const { gameStatusOf, keyHistory, newGame, playMove, repetitionCounts, takeBack } = await import(
  "./history.ts"
);
const { HISTORY_ROWS, renderHistory } = await import("./history-pane.ts");
const { legalMoves } = await import("./legal.ts");
const { parseSquareName } = await import("./position.ts");

const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/** `ABC-012`'s deterministic pseudo-random game — the builder for 40 / 120 / 300. */
function deterministicGame(plies: number): GameHistory {
  const history = newGame(START_FEN);
  let seed = 0x2f6e2b1;
  for (let ply = 0; ply < plies; ply++) {
    const moves = legalMoves(history.position);
    if (moves.length === 0) return history;
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    playMove(history, moves[seed % moves.length] as Move);
  }
  return history;
}

const SHUFFLE: readonly (readonly [string, string])[] = [
  ["g1", "f3"],
  ["g8", "f6"],
  ["f3", "g1"],
  ["f6", "g8"],
];

/** A legal game of exactly `plies` plies — the only builder that reaches `A11`'s 2,000. */
function shuffleGame(plies: number): GameHistory {
  const history = newGame(START_FEN);
  for (let ply = 0; ply < plies; ply++) {
    const [from, to] = SHUFFLE[ply % SHUFFLE.length] as readonly [string, string];
    const move = legalMoves(history.position).find(
      (candidate) =>
        candidate.from === parseSquareName(from) && candidate.to === parseSquareName(to),
    );
    if (move === undefined) throw new Error(`no legal move ${from}${to}`);
    playMove(history, move);
  }
  return history;
}

// Built ONCE, before any assertion. `beforeEach` clears every fixture call away, so the counts
// below are the RENDER's and nothing else.
const AT_0 = newGame(START_FEN);
const AT_1 = shuffleGame(1);
const AT_3 = shuffleGame(3);
const AT_19 = shuffleGame(19);
const AT_40 = deterministicGame(40);
const AT_120 = deterministicGame(120);
const AT_300 = deterministicGame(300);
const AT_2000 = shuffleGame(2000);

/** The four lengths `A11` names. */
const LONG_GAMES: readonly (readonly [plies: number, history: GameHistory])[] = [
  [40, AT_40],
  [120, AT_120],
  [300, AT_300],
  [2000, AT_2000],
];

const whiteCell = (row: string): string => row.slice(6, 13).trim();
const blackCell = (row: string): string => row.slice(14, 21).trim();

/** How many plies the pane actually put on screen — the count `toSan` is measured against. */
const renderedPliesOf = (rows: readonly string[]): number =>
  rows.reduce(
    (count, row) => count + (whiteCell(row) === "" ? 0 : 1) + (blackCell(row) === "" ? 0 : 1),
    0,
  );

describe("A11 — the pane derives nothing, and this is a CALL COUNT", () => {
  beforeEach(() => vi.clearAllMocks());

  it("never derives: gameStatusOf / repetitionCounts / keyHistory / gameStatus are 0 at every length", () => {
    // The structural fact `NFR-002`'s `O(window)` claim rests on. A pane that ran the repetition
    // derive would be caught by nothing else in this suite.
    for (const [plies, history] of LONG_GAMES) {
      vi.clearAllMocks();
      renderHistory(history);

      expect(gameStatusOf, `gameStatusOf at ${plies}`).toHaveBeenCalledTimes(0);
      expect(repetitionCounts, `repetitionCounts at ${plies}`).toHaveBeenCalledTimes(0);
      expect(keyHistory, `keyHistory at ${plies}`).toHaveBeenCalledTimes(0);
      expect(gameStatus, `gameStatus at ${plies}`).toHaveBeenCalledTimes(0);
    }
  });

  it("never rewinds the caller's history: takeBack and playMove are 0 at every length", () => {
    // A build that reaches for `takeBack` and RESTORES passes every clause of `A9` — identical
    // output, byte-identical twice, `toFen` unchanged, `moves.length` unchanged — while mutating
    // the caller's authoritative state mid-render. This is the only assertion that sees it.
    for (const [plies, history] of LONG_GAMES) {
      vi.clearAllMocks();
      renderHistory(history);

      expect(takeBack, `takeBack at ${plies}`).toHaveBeenCalledTimes(0);
      expect(playMove, `playMove at ${plies}`).toHaveBeenCalledTimes(0);
    }
  });

  it("parses the anchor AT MOST ONCE per render, on an empty history and on a 2,000-ply one", () => {
    // Catches a build that re-parses the anchor once per visible ply.
    const cases: readonly (readonly [plies: number, history: GameHistory])[] = [
      [0, AT_0],
      ...LONG_GAMES,
    ];

    for (const [plies, history] of cases) {
      vi.clearAllMocks();
      renderHistory(history);

      expect(vi.mocked(parseFen).mock.calls.length, `parseFen at ${plies}`).toBeLessThanOrEqual(1);
    }
  });

  it("calls toSan exactly once per RENDERED ply, and never more than 2 x HISTORY_ROWS", () => {
    // The bound itself, expressed at zero timing sensitivity. The rendered-ply count is the
    // WINDOW's and not the game's, and 0, 1, 3 and 15 are all reachable — so "once per rendered
    // ply" cannot collapse into the constant 16.
    const cases: readonly (readonly [plies: number, history: GameHistory, rendered: number])[] = [
      [0, AT_0, 0],
      [1, AT_1, 1],
      [3, AT_3, 3],
      [19, AT_19, 15],
      [40, AT_40, 16],
      [120, AT_120, 16],
      [300, AT_300, 16],
      [2000, AT_2000, 16],
    ];

    for (const [plies, history, rendered] of cases) {
      vi.clearAllMocks();
      const rows = renderHistory(history);

      expect(renderedPliesOf(rows), `rendered plies at ${plies}`).toBe(rendered);
      expect(toSan, `toSan at ${plies}`).toHaveBeenCalledTimes(rendered);
      expect(rendered, `toSan bound at ${plies}`).toBeLessThanOrEqual(2 * HISTORY_ROWS);
    }
  });

  it("hands toSan no legal move list — the optional parameter is a contract, not a tuning dial", () => {
    // `src/san.ts:19-22`: "supply another position's list and the answer is silently wrong". The
    // pane holds no such list, so it must pass none.
    renderHistory(AT_40);

    expect(toSan).toHaveBeenCalled();
    for (const call of vi.mocked(toSan).mock.calls) expect(call).toHaveLength(2);
  });

  it("still renders the right cells while spied, so the counts above cannot pass vacuously", () => {
    // A pane that had stopped doing anything would satisfy every count above and prove nothing.
    const rows = renderHistory(AT_3);

    expect(rows).toHaveLength(HISTORY_ROWS);
    expect([whiteCell(rows[0] as string), blackCell(rows[0] as string)]).toEqual(["Nf3", "Nf6"]);
    expect([whiteCell(rows[1] as string), blackCell(rows[1] as string)]).toEqual(["Ng1", ""]);
  });

  it("leaves src/history.ts with ZERO runtime importers among the production modules", () => {
    // The structural half of `A11`, asserted against delivered SOURCE rather than against a reading
    // of the ticket: the pane must import `GameHistory` as a TYPE and nothing else, or `history.ts`
    // and everything it derives are back in the frame's module graph.
    //
    // Scope stated plainly: PRODUCTION modules. `src/history.test.ts` and
    // `src/history-pane.test.ts` both import it at runtime to BUILD fixtures — `A7` requires
    // `takeBack` — and a test importer is not what `NFR-002`'s claim is about.
    const directory = new URL(".", import.meta.url).pathname;
    const production = readdirSync(directory).filter(
      (file) => file.endsWith(".ts") && !file.endsWith(".test.ts"),
    );
    const runtimeImporters = production.filter((file) =>
      /^import\s+(?!type\b)[^;]*from\s+"\.\/history\.ts";/m.test(
        readFileSync(`${directory}${file}`, "utf8"),
      ),
    );

    expect(production).toContain("history-pane.ts");
    expect(runtimeImporters).toEqual([]);
    expect(readFileSync(`${directory}history-pane.ts`, "utf8")).toContain(
      'import type { GameHistory } from "./history.ts";',
    );
  });
});
