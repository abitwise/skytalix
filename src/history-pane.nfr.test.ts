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
import { spawnSync } from "node:child_process";
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
// THE FRESHNESS PROPERTY IS OWNED IN `src/history-pane.test.ts` FOR FOUR KEYS AND NO OTHER —
// `ABC-017`'s `A14` for a cache that never invalidates, `ABC-028`'s `A1` for one keyed on
// `moves.length`, and `ABC-028`'s `A5` table for one keyed on `moves.length` plus the last ONE
// move identity and for one keyed on it plus the last TWO. A reader looking for the guard against
// a cache with one of THOSE keys finds it there, with this file not loaded at all. Against a
// memoising pane IN GENERAL there is no guard at all: every key on the axis is its own witness.
//
// THE SHARING HERE IS STILL LOAD-BEARING, and the note that used to stand in this place said the
// opposite. Measured on this tree, one step past `A5`'s deepest row: a pane keyed on `moves.length`
// plus the last THREE move identities fails exactly 2 of 752 — both of them the `toSan`
// call-count assertions below — while `src/history-pane.test.ts` ALONE passes 26/26 on it, and
// rebuilding these fixtures per test takes the whole suite to 752/752 GREEN. Tests earlier in this
// file have already rendered `AT_40` and a cache HIT calls `toSan` zero times: THE MECHANISM IS A
// CALL COUNT, NOT A ROW COMPARISON, which is why `A14` never catches such a build. So rebuilding
// these per test STILL LOSES A GUARD — not for `A1`'s or `A5`'s keys, which die in
// `src/history-pane.test.ts` either way, but for every key deeper than their rows reach. It still
// costs ~9.3 ms per rebuild (6.0 ms of it the 2,000-ply shuffle) and buys nothing, so it stays
// declined — as it was at `ABC-017`.
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

/**
 * `ADR-0011` CLAUSE 1 — THE ONE EXPRESSION. Both guards at the bottom of this file derive their
 * scanned set from this function and from nothing else.
 *
 * > A **production module** is every `.ts` file under `src/` that is not a `.test.ts`.
 *
 * No exclusions, no exceptions, no filenames. `history.ts` is one, `perft-bench.ts` is one, and on
 * `ABC-019`'s branch `turn-loop.ts` is one. Each guard then applies exactly ONE named rule about
 * this set — `FRAME_PRODUCERS` for the probe, `LICENSED_DRIVERS` for the regex — and the two rules
 * differ because THE TWO GUARDS HOLD DIFFERENT PROPERTIES. Being a production module is not the
 * same as being in scope for `NFR-002`, and conflating those two was the defect `ABC-029` fixed.
 */
const productionModulesIn = (directory: string): readonly string[] =>
  readdirSync(directory).filter((file) => file.endsWith(".ts") && !file.endsWith(".test.ts"));

/**
 * `ADR-0011` CLAUSE 2 — THE DECLARED FRAME PATH, which is the probe's one named rule about the set
 * above. `NFR-002`'s premise is: `src/history.ts`'s module body is never evaluated in the closure
 * of the frame's producers. No other module set is in scope for that row.
 *
 * IT IS DECLARED, NOT DERIVED, and that is forced rather than chosen: `src/frame.ts` imports
 * NOTHING — its runtime closure is exactly itself — because a frame is composed by INJECTION,
 * `frame.ts` taking rows as data, and nothing in `src/` imports a renderer at all. So no closure of
 * any single module yields the frame path and there is nothing to derive from the module graph.
 *
 * The five entries are the producers of the frame `plans/nfr-catalog.md`'s `NFR-002` row
 * enumerates — board and labels, status panel, history pane, message region — plus the glyph mode
 * the board renders through. Check this list by READING it against that row's `Applies to` cell.
 *
 * IT FAILS OPEN, and that is recorded rather than discovered: a renderer added without being
 * declared here is silently unguarded. `ADR-0009`'s frame-height identity is a PARTIAL tripwire (a
 * renderer that adds no rows would not trip it) and is not claimed as more. Owner: Architect/Design,
 * at the next hop that adds a frame producer. Dated expiry: `EPIC-006`, where the entry point
 * assembles a frame, composition becomes an import, and this declaration is replaced by
 * `closure(<assembly module>)` and DELETED.
 */
const FRAME_PRODUCERS: readonly string[] = [
  "frame.ts",
  "glyph-mode.ts",
  "history-pane.ts",
  "render-seam.ts",
  "render.ts",
  "status-panel.ts",
];

/**
 * `ADR-0011` CLAUSE 3 — THE DECLARED LICENCE, which is the regex guard's one named rule about the
 * same set. `ADR-0002` clause 4: "`gameStatus`'s `positionCounts` gets exactly one supplier: the
 * history module. No other caller constructs that map." A production module may hold a runtime
 * import of the history module only if it is the game-owning driver that rule requires.
 *
 * ONE entry, carrying its citation: `turn-loop.ts` is `ABC-019`'s loop, whose `A3` names
 * `gameStatusOf(history)` as the single repetition-derive site — the loop is where the quantity
 * belongs, and `NFR-002`'s row says so in its own words.
 *
 * `cli.ts` is the composition root (`ABC-042`). It calls `newGame` once to construct the game and,
 * if it needs a status, `gameStatusOf(history)` — never bare `gameStatus`, and it never constructs a
 * `positionCounts` map. `ADR-0002` clause 4's single-supplier rule is therefore untouched, which is
 * the same construction `ABC-019`'s `A3` requires of `turn-loop.ts`. `ADR-0011` clause 4: it exports
 * nothing, so it is never on the frame path and never a probe root.
 *
 * THE LICENCE IS FILTERED TO THE ENTRIES THAT EXIST, so a driver that has not been built yet is
 * vacuous rather than red — this tree has no `turn-loop.ts` and `ABC-019`'s has one, and the guard
 * is green on both. The reach that bounds is named in `ADR-0011` and is NOT a choice: this tree and
 * "`ABC-019`'s tree with `turn-loop.ts` deleted" are the same 16 files, so no guard can be green on
 * the first and red on the second. A licence that goes stale while its file EXISTS is caught, and
 * that is the kill the equality below buys.
 */
const LICENSED_DRIVERS: readonly string[] = ["turn-loop.ts", "cli.ts"];

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

  it("licenses src/history.ts's runtime importers: the set EQUALS the declared licence", () => {
    // The structural half of `A11`, asserted against delivered SOURCE rather than against a reading
    // of the ticket: the pane must import `GameHistory` as a TYPE and nothing else, or `history.ts`
    // and everything it derives are back in the frame's module graph.
    //
    // THIS GUARD IS NOT AN `NFR-002` GUARD AND NEVER WAS (`ADR-0011` clause 3): it holds
    // `ADR-0002` clause 4's WHOLE-TREE single-supplier invariant, which is why it scans every
    // production module — including the ones no frame can reach, `perft-bench.ts` among them.
    //
    // Scope stated plainly: PRODUCTION modules. `src/history.test.ts` and
    // `src/history-pane.test.ts` both import it at runtime to BUILD fixtures — `A7` requires
    // `takeBack` — and a test importer is not what `ADR-0002` clause 4 is about.
    const directory = new URL(".", import.meta.url).pathname;
    const production = productionModulesIn(directory);
    const runtimeImporters = production.filter((file) =>
      /^(?:import|export)\s+(?!type\b)(?:[^;]*from\s+)?"\.\/history\.ts";/m.test(
        readFileSync(`${directory}${file}`, "utf8"),
      ),
    );

    expect(production).toContain("history-pane.ts");
    // AN EQUALITY — not empty, and NOT a subset. Empty is red on `ABC-019`'s correct build, where
    // the licensed driver exists and legitimately imports `history.ts`. A subset ("no UNLICENSED
    // importer") is green on both trees and would silently drop the kill this equality buys: a
    // licence that has gone STALE — its driver still there, no longer importing — leaves an entry
    // asserting something untrue, and only an equality reports it.
    expect(runtimeImporters).toEqual(production.filter((file) => LICENSED_DRIVERS.includes(file)));
    expect(readFileSync(`${directory}history-pane.ts`, "utf8")).toContain(
      'import type { GameHistory } from "./history.ts";',
    );
  });

  /**
   * `ABC-029` `A6.3` AND `A6.4` — THE EXPRESSION ABOVE, WITNESSED IN THE SUITE RATHER THAN OUT OF
   * TREE.
   *
   * Every required verdict `A6.1` and `A6.2` state is a CONSTRUCTED build — one line prepended to a
   * real production module, run out of tree — and QE recorded what that leaves behind: nothing in
   * the committed suite goes red if a later hop regresses this expression, so a row is "only as good
   * as the next person re-running it". The three tests below close that for `A6.3` and `A6.4`: the
   * same constructed sources, the same expression, on every run.
   *
   * THE GUARD'S OWN SITE IS BYTE-UNTOUCHED. `ABC-029` permits zero characters of that expression to
   * change and none did, so what stands below is a SECOND INSTANCE of the literal rather than the
   * literal moved out of the guard. The first test is what stops the two diverging: it asserts the
   * guard's executable site still holds exactly this expression, so a hop that widens the guard
   * cannot leave these witnesses silently measuring a dead copy. Without it a copy would be worse
   * than no witness.
   *
   * `A6.3` RESTS ON A SET CLOSED BY GRAMMAR, AND THE CLOSURE IS THE POINT — four more sampled
   * spellings would be the same defect one level up. After the `type` keyword in a type-only
   * declaration carrying a specifier, TypeScript admits exactly THREE clause shapes — a brace, a
   * namespace `*` with or without `as ns`, and a bare identifier — over TWO keywords. Six cells, of
   * which `export type <Ident> from` is not a form at all; `import type Default, { A } from` is
   * `TS1363` and does not exist either. The table below is that grid with its one hole DECLARED, and
   * the `A6.3` test's first assertion is the accounting — every cell is witnessed or declared not a
   * form. The next reader checks a closure instead of trusting a sample, and there is no seventh
   * cell for a later spelling to arrive in.
   *
   * `A6.4`'s set is closed the same way and is smaller: an ESM re-export admits `*`, `* as ns` and
   * `{ … }`, and all three must be RED. `* as ns` is `A6.4`'s own row; the other two are `A6.1`'s,
   * restated from the closure's side and NOT a second obligation — the same shape as `A6.2`'s
   * `WPERFT-DYN` row restating `A3`'s verdict from the guard's side.
   *
   * WHAT THESE WITNESSES DO NOT WITNESS, so they are not read as more than they are:
   *
   * - They run the EXPRESSION, not the guard. The scanned set, the declared licence and the
   *   `toEqual` equality are the guard's above; `A1` and `A5` are where those are stated.
   * - They read SOURCE TEXT, exactly as the guard does, and never compile a build. That is a real
   *   bound on one cell: `import type H from "./history.ts";` is rejected by `tsc` here with
   *   `TS1192`, because `src/history.ts` has zero default exports — the same root cause as `L4`, and
   *   its trigger is `L4`'s (the first `export default` added to `src/history.ts`). The cell is a
   *   form TypeScript admits, so the closure holds; what this tree cannot supply is a compiling
   *   build of it.
   * - `A6.4` CANNOT FORBID ENUMERATION AS A TECHNIQUE. An enumeration patched with `as <ident>`
   *   passes every row here and, measured, is not wrong. The reason to prefer the generalisation is
   *   historical — `export * as ns from` was added to ESM in ES2020, so the clause set an
   *   enumeration has to track has grown once already.
   * - `L3` AND `L4` STAY OPEN BY DESIGN AND ARE NOT A LICENCE TO WIDEN THIS EXPRESSION. `(?!type\s)`
   *   in place of `(?!type\b)` is green on all six witnesses below, and the only build separating
   *   them — `import type{ … } from "./history.ts";` — is REJECTED by `biome check`, so no
   *   lint-clean witness exists (`L3`). Both limits carry an owner and a trigger in the ticket.
   */
  const WITNESSED_EXPRESSION =
    /^(?:import|export)\s+(?!type\b)(?:[^;]*from\s+)?"\.\/history\.ts";/m;
  const witnessDirectory = new URL(".", import.meta.url).pathname;
  const zobristSource = readFileSync(`${witnessDirectory}zobrist.ts`, "utf8");
  /**
   * The record's own construction: one line prepended to `zobrist.ts` — a production module that is
   * unlicensed and off the frame path, so a match here is exactly the guard above going RED. THE
   * BLANK LINE IS DELIBERATE: a single newline puts the statement against that file's docblock and
   * trips `biome`'s import assist, which is how a false "contained" verdict was produced once.
   */
  const prependedToZobrist = (line: string): string => `${line}\n\n${zobristSource}`;

  const TYPE_ONLY_SHAPES = ["brace", "namespace-star", "bare-identifier"] as const;
  const TYPE_ONLY_KEYWORDS = ["import", "export"] as const;
  const cellOf = (keyword: string, shape: string): string => `${keyword} type ${shape}`;

  /** `A6.2`'s two brace spellings and `A6.3`'s four, each tagged with the grammar cell it covers. */
  const TYPE_ONLY_WITNESSES: readonly (readonly [shape: string, keyword: string, build: string])[] =
    [
      ["brace", "import", 'import type { GameHistory } from "./history.ts";'],
      ["brace", "export", 'export type { GameHistory } from "./history.ts";'],
      ["namespace-star", "import", 'import type * as H from "./history.ts";'],
      ["namespace-star", "export", 'export type * from "./history.ts";'],
      ["namespace-star", "export", 'export type * as history from "./history.ts";'],
      ["bare-identifier", "import", 'import type H from "./history.ts";'],
    ];

  /**
   * THE ONE CELL OF THE GRID TYPESCRIPT DOES NOT ADMIT, declared rather than left as a gap in the
   * table above: there is no `export type <Ident> from "…"` form. Declaring it is what makes the
   * closure checkable — a reader counts 3 x 2 and finds every cell accounted for.
   */
  const NOT_A_TYPE_ONLY_FORM: readonly (readonly [shape: string, keyword: string])[] = [
    ["bare-identifier", "export"],
  ];

  /** The ESM re-export clause set, also closed: `A6.4`'s row plus `A6.1`'s two, all RED. */
  const REEXPORT_WITNESSES: readonly (readonly [shape: string, build: string])[] = [
    ["*", 'export * from "./history.ts";'],
    ["* as ns", 'export * as history from "./history.ts";'],
    ["{ … }", 'export { repetitionCounts } from "./history.ts";'],
  ];

  it("runs the guard's OWN expression — a drift tripwire, not a copy that can go stale", () => {
    // `ABC-029` forbids changing the guard's expression, so the witnesses hold a second instance of
    // the literal instead of moving it out of the guard. THIS is what keeps the two the same: a hop
    // that widens the guard reds this test and is told, at the site, to re-run the witnesses.
    const instrument = readFileSync(`${witnessDirectory}history-pane.nfr.test.ts`, "utf8");

    expect(instrument, "the guard above runs the expression the witnesses below run").toContain(
      `/${WITNESSED_EXPRESSION.source}/${WITNESSED_EXPRESSION.flags}.test(`,
    );
  });

  it("A6.3 — the type-only exclusion is pinned to the WORD, across the CLOSED grammar", () => {
    // The closure itself, asserted rather than argued: the witnesses cover exactly the 3 x 2 grid
    // minus the cell TypeScript does not admit. A new spelling has to land in an existing cell.
    const grid = TYPE_ONLY_SHAPES.flatMap((shape) =>
      TYPE_ONLY_KEYWORDS.map((keyword) => cellOf(keyword, shape)),
    );
    const absent = NOT_A_TYPE_ONLY_FORM.map(([shape, keyword]) => cellOf(keyword, shape));
    const witnessed = [
      ...new Set(TYPE_ONLY_WITNESSES.map(([shape, keyword]) => cellOf(keyword, shape))),
    ];

    expect(witnessed.sort(), "every grammar cell is witnessed or declared not a form").toEqual(
      grid.filter((cell) => !absent.includes(cell)).sort(),
    );

    // ARMING control: a green is worthless without one, the same reason the probe below carries an
    // arming root. The SAME expression on the SAME base is RED on a real runtime importer, so the
    // six greens are the type-only exclusion working and not an expression that matches nothing.
    expect(
      WITNESSED_EXPRESSION.test(prependedToZobrist('import { newGame } from "./history.ts";')),
      "the witness is ARMED",
    ).toBe(true);
    expect(WITNESSED_EXPRESSION.test(zobristSource), "the unmutated control").toBe(false);

    for (const [, , build] of TYPE_ONLY_WITNESSES)
      expect(WITNESSED_EXPRESSION.test(prependedToZobrist(build)), build).toBe(false);
  });

  it("A6.4 — the runtime-importer forms are GENERALISED, across the closed re-export set", () => {
    expect(
      REEXPORT_WITNESSES.map(([shape]) => shape),
      "every ESM re-export clause shape is witnessed",
    ).toEqual(["*", "* as ns", "{ … }"]);

    // FALSIFIABILITY control: the same expression on the same base is GREEN on the type-only
    // counterpart of `A6.4`'s own build, so the reds below are the FORM being detected and not an
    // expression that matches every line beginning `export`.
    expect(
      WITNESSED_EXPRESSION.test(
        prependedToZobrist('export type * as history from "./history.ts";'),
      ),
      "the witness is not matching every export line",
    ).toBe(false);

    for (const [, build] of REEXPORT_WITNESSES)
      expect(WITNESSED_EXPRESSION.test(prependedToZobrist(build)), build).toBe(true);
  });

  /**
   * `NFR-002`'s OWN property, MEASURED rather than pattern-matched — a DIFFERENT property from the
   * guard above, over a DIFFERENT set. Neither is a weaker version of the other and neither may be
   * deleted as redundant (`ADR-0011` clause 3; `ABC-029` `## Out of scope`).
   *
   * The guard above holds `ADR-0002` clause 4's whole-tree licence EQUALITY over every production
   * module. This one holds `NFR-002`'s frame-scoped premise — `history.ts`'s module body is never
   * evaluated in the closure of the DECLARED frame producers. Each catches builds the other cannot,
   * in BOTH directions, and that is a consequence of the properties rather than a coincidence of
   * coverage:
   *
   * - a static pull in `perft-bench.ts` or `zobrist.ts` — off the frame path, unlicensed — is RED
   *   above and green here, because it breaches the licence and not the premise;
   * - a licence that goes STALE is RED above and green here, for the same reason;
   * - a renderer reaching `history.ts` by a DYNAMIC `void import("./history.ts")` or a query
   *   string is green above and RED here. The regex above reads SYNTAX and syntax has a reach:
   *   `/^(?:import|export)\s+(?!type\b)(?:[^;]*from\s+)?"\.\/history\.ts";/m` implements THREE of
   *   the five forms that evaluate a module body — a bindings-carrying `import … from`, a BARE
   *   `import "./history.ts";`, and an `export … from` re-export INCLUDING `export *`.
   *
   *   THE RESIDUAL IS THE TWO DYNAMIC FORMS AND IT IS NAMED HERE RATHER THAN LEFT AS A COMPLETED
   *   LIST, because the earlier silence is what made `WLAUNDER` invisible (`ADR-0011`'s
   *   containment). Re-export was the miss that silence hid: `export { … } from "./history.ts"`
   *   republishes the history module's API from an unlicensed module, so a third module reaches
   *   the repetition machinery WITHOUT EVER NAMING `history.ts`. Stopping at three forms is a
   *   RULING, not an oversight — a pattern reaching the dynamic literal turns `WPERFT-DYN` RED and
   *   `ABC-029`'s `A3` requires it to pass, and a rule that catches only the literal spelling is
   *   evaded by a computed specifier anyway. `ADR-0011`'s `R4` owns the two that stay uncaught.
   *
   *   `(?!type\b)` APPLIES TO BOTH KEYWORDS AND THAT IS LOAD-BEARING. `import type` and
   *   `export type { … } from` are erased at runtime and must stay GREEN. A widening that guards
   *   only the `import` branch passes every RED build above — no production module holds a
   *   type-only re-export today, so this tree cannot witness it — and turns a correct
   *   `export type … from` red. Only a constructed build sees it (`ABC-029` `A6.2`).
   *
   *   (Healthy in the same regex and recorded so nobody re-sweeps it: multi-line `import { … }`
   *   blocks and `import * as ns` ARE matched, because `[^;]*` spans newlines.)
   *
   * So this measurement is blind to none of the five forms and needs no list of syntaxes to keep up
   * to date — and it is scoped to the frame path, not to the whole production graph. A pull into a
   * production module that no frame can reach is not an `NFR-002` breach, and it is the guard above
   * that decides whether it is allowed at all.
   *
   * THE SCOPE IS THE FRAME PATH'S CLOSURE, NOT THIS PROCESS, and that distinction is the whole
   * reason this runs in a child. THIS FILE is itself a runtime importer of `history.ts` — the
   * `vi.mock` + `importOriginal()` at `:43-44` and the `await import` at `:58-60`, which this
   * file's own spies and `A7`'s `takeBack` require — so a probe phrased as "`history.ts` never
   * loads in this process" would fail in the very file that holds it. A child process rooted at
   * the declared frame producers is that scoping made mechanical.
   */
  it("evaluates history.ts's module body NOWHERE ON THE FRAME PATH — measured, not pattern-matched", () => {
    const directory = new URL(".", import.meta.url);
    const production = productionModulesIn(directory.pathname);
    // The one named rule (`ADR-0011` clause 2): root at the DECLARED frame path. The two
    // hand-maintained filename exclusions that stood here are DELETED, not replaced, and NO THIRD
    // ONE IS CREATED — `history.ts` is not a frame producer, so rooting it is not something that
    // has to be refused by name; `perft-bench.ts` exports nothing (`ADR-0011` clause 4) so nothing
    // can import a binding from it and it can never be on this path; and `ABC-019`'s
    // `turn-loop.ts` never appears here at all, which is why the loop is green BY THE PROPERTY
    // rather than by an exemption.
    const roots = production.filter((file) => FRAME_PRODUCERS.includes(file));
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

    // THE REPORT CHANNEL IS PRIVATE TO THE PROBE, and that is `ABC-029`'s `A2`. The child reports
    // on FILE DESCRIPTOR 3 and its stdout is discarded, so a production module that writes to
    // stdout when it is imported can no longer make this guard the sole red of the suite with
    // `is not valid JSON` — a symptom in the wrong place, reported by the guard that exists to stop
    // symptoms appearing in the wrong place. The trigger is dated, not hypothetical: `EPIC-006`'s
    // CLI entry point is the first module that will print at import.
    const probe = `import { registerHooks } from "node:module";
      import { writeSync } from "node:fs";
      let loaded = [];
      registerHooks({ load(url, context, nextLoad) { loaded.push(url); return nextLoad(url, context); } });
      const seen = () => loaded.filter((url) => url.startsWith("file:")).map((url) => url.slice(url.lastIndexOf("/") + 1).replace(/\\?.*$/, ""));
      const [arming, ...roots] = process.argv.slice(1);
      for (const root of roots) await import(root);
      const closure = seen();
      loaded = [];
      await import(arming);
      writeSync(3, JSON.stringify({ closure, armed: seen() }));`;

    // stderr stays PIPED and is surfaced below rather than swallowed, and nothing on it is parsed —
    // so module-scope `console.error` stays correctly invisible and nothing over-reaches onto it.
    const child = spawnSync(
      process.execPath,
      [
        "--input-type=module",
        "-e",
        probe,
        armingRoot,
        ...roots.map((file) => new URL(file, directory).href),
      ],
      { encoding: "utf8", stdio: ["ignore", "ignore", "pipe", "pipe"] },
    );
    // A GUARD MUST NEVER PASS BY BEING UNABLE TO LOOK. `execFileSync` used to throw this for us; a
    // child that dies now says so here, loudly and with its own stderr, instead of arriving as an
    // unreadable empty report. This is the path an older Node without `module.registerHooks` takes,
    // and it is deliberately not wrapped in a skip.
    if (child.status !== 0)
      throw new Error(`probe child failed (${child.status}): ${child.stderr}`);

    const { closure, armed } = JSON.parse(child.output[3] as string) as {
      closure: string[];
      armed: string[];
    };

    // POSITIVE control: the recorder sees what it should, so an empty closure cannot pass here.
    expect(closure, "the probe loaded the pane").toContain("history-pane.ts");
    expect(closure, "the probe loaded the pane's own dependencies").toContain("san.ts");
    // ARMING (negative) control: a zero is worthless without it. The recorder is NOT blind to
    // `history.ts` — when a root's closure contains it, it is reported.
    expect(armed, "the probe is ARMED").toContain("history.ts");

    // The measurement itself.
    expect(closure, "history.ts was evaluated on the frame path").not.toContain("history.ts");
  });
});
