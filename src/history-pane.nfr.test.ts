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
import { execFileSync } from "node:child_process";
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
//
// THE SHARING HERE IS NO LONGER LOAD-BEARING, and that is now measured rather than argued. These
// objects being module-scope singletons used to be the ONLY thing killing a pane that memoises
// rows per `GameHistory` — so the obvious tidy-up to per-test fixtures would have silently removed
// a guard nobody knew was here. `A14` now owns that property explicitly, with its own deliberately
// shared object, and it kills a caching pane with THIS FILE not even loaded. So these may be
// rebuilt per test freely; measured, doing so costs ~9.3 ms per rebuild (6.0 ms of it the
// 2,000-ply shuffle) and buys nothing, which is why it was declined rather than forgotten.
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

  /**
   * The same property MEASURED rather than pattern-matched, because the assertion above reads
   * SYNTAX and syntax has a reach.
   *
   * Its regex `/^import\s+(?!type\b)[^;]*from\s+"\.\/history\.ts";/m` implements ONE of the five
   * forms that evaluate a module body. A production module carrying `void import("./history.ts")`
   * or a bare `import "./history.ts";` is a genuine runtime pull that voids `NFR-002`'s premise,
   * and the regex sees neither — the second because it requires a `from` clause. Both survive the
   * whole suite. (Healthy in the same regex and recorded so nobody re-sweeps it: multi-line
   * `import { … }` blocks and `import * as ns` ARE matched, because `[^;]*` spans newlines.)
   *
   * So this asserts the property `NFR-002` actually depends on — `history.ts`'s module body is
   * never EVALUATED — over the production module graph. It is blind to none of the five forms and
   * needs no list of syntaxes to keep up to date.
   *
   * THE SCOPE IS THE PRODUCTION CLOSURE, NOT THIS PROCESS, and that distinction is the whole
   * reason this runs in a child. THIS FILE is itself a runtime importer of `history.ts` — the
   * `vi.mock` + `importOriginal()` at `:43-44` and the `await import` at `:58-60`, which this
   * file's own spies and `A7`'s `takeBack` require — so a probe phrased as "`history.ts` never
   * loads in this process" would fail in the very file that holds it. A child process rooted at
   * the production modules is that scoping made mechanical.
   */
  it("evaluates history.ts's module body in NO production closure — measured, not pattern-matched", () => {
    const directory = new URL(".", import.meta.url);
    const production = readdirSync(directory.pathname).filter(
      (file) => file.endsWith(".ts") && !file.endsWith(".test.ts"),
    );
    // `history.ts` itself would be a self-inflicted load and proves nothing; `perft-bench.ts` runs
    // a benchmark at module scope (`:114`).
    const roots = production.filter((file) => file !== "history.ts" && file !== "perft-bench.ts");
    // The arming control is a root whose closure DOES contain `history.ts`, reached the same way a
    // real regression would reach it — as a DEPENDENCY of the root, not as the root itself.
    //
    // THE `?arming` QUERY IS LOAD-BEARING and it is here because the first version of this probe
    // reported the wrong failure. A distinct URL is a distinct module instance, so the arming
    // import always produces a fresh load event. Without it, a build that really does pull
    // `history.ts` warms the module cache during the closure phase, the arming import then loads
    // nothing, and the test fails with "the probe is not armed" while the truth is "history.ts WAS
    // evaluated" — a symptom reported in the wrong place, which is the exact misdiagnosis this
    // ticket keeps paying for. Measured on `WDYNIMP` and `WBAREIMP` before and after.
    const armingRoot = `data:text/javascript,${encodeURIComponent(`import ${JSON.stringify(new URL("history.ts?arming", directory).href)};`)}`;

    const probe = `import { registerHooks } from "node:module";
      let loaded = [];
      registerHooks({ load(url, context, nextLoad) { loaded.push(url); return nextLoad(url, context); } });
      const seen = () => loaded.filter((url) => url.startsWith("file:")).map((url) => url.slice(url.lastIndexOf("/") + 1).replace(/\\?.*$/, ""));
      const [arming, ...roots] = process.argv.slice(1);
      for (const root of roots) await import(root);
      const closure = seen();
      loaded = [];
      await import(arming);
      console.log(JSON.stringify({ closure, armed: seen() }));`;

    const { closure, armed } = JSON.parse(
      execFileSync(
        process.execPath,
        [
          "--input-type=module",
          "-e",
          probe,
          armingRoot,
          ...roots.map((file) => new URL(file, directory).href),
        ],
        { encoding: "utf8" },
      ),
    ) as { closure: string[]; armed: string[] };

    // POSITIVE control: the recorder sees what it should, so an empty closure cannot pass here.
    expect(closure, "the probe loaded the pane").toContain("history-pane.ts");
    expect(closure, "the probe loaded the pane's own dependencies").toContain("san.ts");
    // ARMING (negative) control: a zero is worthless without it. The recorder is NOT blind to
    // `history.ts` — when a root's closure contains it, it is reported.
    expect(armed, "the probe is ARMED").toContain("history.ts");

    // The measurement itself.
    expect(closure, "history.ts was evaluated in a production closure").not.toContain("history.ts");
  });
});
