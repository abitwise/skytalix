/**
 * `ABC-041`'s eleven acceptance criteria (`A11` was cut by BA/PM after the QE gate).
 *
 * NO `vi.mock` FACTORY, NO SPAWN, NO TTY — the ticket's `## Test notes` row 5, and why this is a
 * plain `*.test.ts` rather than an eighth `*.nfr.test.ts`: a `vi.mock` factory is hoisted to file
 * scope and would re-route the module graph for the whole table. `A2`'s spies are file-top
 * `vi.mock(p, { spy: true })` automocks, calling through: each frame asserted is REAL, composed by
 * the four merged producers.
 *
 * `A7` AND `A9` ARE NOT ASSERTED HERE AS A MEASUREMENT — they are the MERGED probe's, in
 * `src/history-pane.nfr.test.ts`, which this ticket adds exactly one root line to. What this file
 * holds instead is the DECLARATION's own guard (`A9` below): that the new module is the probe's
 * `COMPOSITION_ROOT` and is NOT in `LICENSED_DRIVERS`. That second half is mechanical because the
 * Orchestrator's `In Development`-entry criteria review recorded it as a one-keystroke wrong move —
 * a module whose `history.ts` import went runtime would trip the licence guard, and adding itself to
 * the licence would satisfy that guard while quietly widening `ADR-0011` clause 3 from one licensed
 * driver to two. The correct repair is always the import, never the list, and now a test says so.
 *
 * `A4`'s WIDTH IS DERIVED FROM THE PANELS, AND THIS FILE'S EARLIER "STRICTLY STRONGER" ACCOUNT OF
 * ITSELF IS WITHDRAWN. The premise stands: measured on this tree, no build satisfies `A4`'s original
 * "byte-identical to `renderBoard(position, mode, orientation)`" literally, because `assembleFrame`
 * pads every panel row to the widest panel (`src/frame.ts:194-208`) and the board is never the
 * widest — 18 columns against the history pane's 21. BA/PM repaired the criterion on that premise.
 * What does NOT stand is what this file claimed for itself. A criterion that rejects EVERY build is
 * maximally strong, so nothing can be strictly stronger than it; and the width this file used to
 * read off `frame[0]` was CIRCULAR, because `frame[0]` IS a board row — a seam that padded the board
 * itself inflated both sides of the comparison at once and walked straight through (QE's mutant
 * `X2`: 8 passed, with the adjacent whole-frame equality removed). The width below is now computed
 * from the three panels, which is where `assembleFrame` takes it from, and is never read off the
 * frame or off the board region — the repaired `A4`'s own clause.
 *
 * BYTE-EQUALITY DOES NOT FORBID A SECOND BOARD IMPLEMENTATION, AND THIS FILE NO LONGER SAYS IT DOES.
 * A copy of `renderBoard` in its own module renders the same bytes and is invisible to every
 * comparison here — measured at 824/824 green with `renderBoard` never called (QE's mutant `X3b`).
 * What catches it inside this seam is `A11`'s call count, below. Since `ABC-054`, `A8` counts
 * runtime CONSUMERS (`ADR-0030` decision 2), so `X3b` — `render.ts` left with only `type`
 * specifiers — reds `A8` too. A copy shipped BESIDE a consumed `renderBoard` is still green: a
 * consumer count is necessary, not sufficient, and `ADR-0030` decision 3 adopts nothing stronger.
 */

import { readdirSync, readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { type BookProbe, createBookProbe } from "./book.ts";
import * as frameModule from "./frame.ts";
import { assembleFrame, frameHeight, MESSAGE_ROWS, PROMPT_ROWS } from "./frame.ts";
import * as gameend from "./gameend.ts";
import * as historyModule from "./history.ts";
import { gameStatusOf, newGame, playMove, takeBack } from "./history.ts";
import * as historyPane from "./history-pane.ts";
import { HISTORY_COLS, HISTORY_ROWS, renderHistory } from "./history-pane.ts";
import * as legal from "./legal.ts";
import { legalMoves } from "./legal.ts";
import type { Move } from "./moves.ts";
import { parseSquareName } from "./position.ts";
import * as render from "./render.ts";
import { type GlyphMode, type Orientation, renderBoard } from "./render.ts";
import { makeRenderSeam } from "./render-seam.ts";
import * as statusPanel from "./status-panel.ts";
import { renderStatusPanel, STATUS_ROWS } from "./status-panel.ts";
import { type RenderSeam, runTurnLoop } from "./turn-loop.ts";
import { zobristKey } from "./zobrist.ts";

vi.mock("./frame.ts", { spy: true });
vi.mock("./gameend.ts", { spy: true });
vi.mock("./history.ts", { spy: true });
vi.mock("./history-pane.ts", { spy: true });
vi.mock("./legal.ts", { spy: true });
vi.mock("./render.ts", { spy: true });
vi.mock("./status-panel.ts", { spy: true });

/** R1: a `{ spy: true }` automock spy, cleared at the point the original `vi.spyOn` was installed. */
function spyFrom<T extends (...args: never[]) => unknown>(fn: T) {
  const spy = vi.mocked(fn);
  spy.mockClear();
  return spy;
}

const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/** The shortest checkmate there is — four plies, and `A1`'s "≥ 4 plies to a terminal result". */
const FOOLS_MATE = ["f2f3", "e7e5", "g2g4", "d8h4"] as const;

const SOURCE_DIRECTORY = new URL(".", import.meta.url).pathname;
const sourceOf = (file: string): string => readFileSync(`${SOURCE_DIRECTORY}${file}`, "utf8");

const startGame = () => newGame(START_FEN);

/** `ABC-096`: the seam's third parameter, as a book that names no position. */
const NO_NAMES = { openingName: () => undefined };

/** A game, its status, and the seam under test — the fixture almost every criterion starts from. */
function fixture(mode: GlyphMode = "unicode", orientation: Orientation = "white-bottom") {
  const history = startGame();
  const status = gameStatusOf(history);
  const seam: RenderSeam = makeRenderSeam(mode, orientation, NO_NAMES);
  return { history, status, seam };
}

/** The board region of a frame: its first rows, which is where `assembleFrame` places the board. */
const boardRegionOf = (frame: readonly string[], boardRows: number): readonly string[] =>
  frame.slice(0, boardRows);

const codePointsOf = (rows: readonly string[]): number[] =>
  [...rows.join("")].map((character) => character.codePointAt(0) as number);

/**
 * `ADR-0011` clause 1's own expression, restated for `A8`'s measurement: a production module is
 * every `.ts` under `src/` that is not a `.test.ts`.
 */
const productionModules = (): readonly string[] =>
  readdirSync(SOURCE_DIRECTORY).filter(
    (file) => file.endsWith(".ts") && !file.endsWith(".test.ts"),
  );

/** `source` with every `/* … *\/` block and `// …` line comment removed. */
const withoutComments = (source: string): string =>
  source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");

/**
 * `ADR-0030` decision 2, read off the SPECIFIER LIST: does `source` hold an `import` from
 * `./<target>` that binds at least one VALUE — a default binding, a namespace binding, or a brace
 * specifier not prefixed `type`? `import type`, an all-`type` brace list, a bare `import "…"` and an
 * `export … from` re-export bind none. `[^;"]*` reads a statement across lines, as 12 production
 * files spell theirs (`ABC-054` test note 3), and EVERY matching statement in the file is read.
 *
 * COMMENTS ARE NOT READ (`ABC-135`, `QE-054-a`): a comment is neither a specifier nor a statement,
 * so the source is stripped of comments before it is matched. The strip is naive — a `/*` or `//`
 * inside a string literal would hide code — and is held to the real tree by the base's consumer map
 * (1,190 ordered pairs, 92 consumers at `ABC-135`'s pull), never by these rows alone.
 *
 * This is CONSUMPTION, not evaluation. `import { type X, type Y }` EVALUATES the target under
 * `verbatimModuleSyntax`, which is why the licence guard in `src/history-pane.nfr.test.ts` counts it
 * and this does not. Residuals `C1` (a value bound but never called counts) and `C2` (a re-export
 * chain under-counts, failing RED) are `ADR-0030`'s, with their triggers.
 */
const bindsAValueFrom = (source: string, target: string): boolean =>
  [
    ...withoutComments(source).matchAll(
      new RegExp(`^import\\s+([^;"]*?)\\s*from\\s+"\\./${target.replace(".", "\\.")}";`, "gm"),
    ),
  ].some(([, clause = ""]) => {
    if (/^type\s/.test(clause)) return false;
    // Outside the braces only a default or a namespace binding can stand; either binds a value.
    const outsideBraces = clause
      .replace(/\{[^}]*\}/, "")
      .replace(/,/g, "")
      .trim();
    if (outsideBraces !== "") return true;
    return (clause.match(/\{([^}]*)\}/)?.[1] ?? "")
      .split(",")
      .map((specifier) => specifier.trim())
      .some((specifier) => specifier !== "" && !/^type\s/.test(specifier));
  });

/**
 * The epic's own measurement, module by module: which production modules are RUNTIME CONSUMERS of
 * `target` (`ADR-0030` decision 2, above). Consumption, not import, is the whole point of the
 * measurement `EPIC-006` was raised on — `src/render.ts` already had two `import type { GlyphMode }`
 * importers and still had zero consumers of `renderBoard`.
 */
const runtimeConsumersOf = (target: string): readonly string[] =>
  productionModules().filter((file) => file !== target && bindsAValueFrom(sourceOf(file), target));

/** The delivered module with every comment removed — what `A3` and `A6` assert over. */
const deliveredCode = (): string => withoutComments(sourceOf("render-seam.ts"));

describe("ABC-041 — the render seam", () => {
  afterEach(() => vi.restoreAllMocks());

  it("A1 — IS the published RenderSeam: a 4-ply game runs to checkmate through runTurnLoop", async () => {
    // No adapter and no cast anywhere on this path: `makeRenderSeam`'s result is annotated
    // `RenderSeam` at its declaration and handed to `runTurnLoop` as `render` unwrapped. `tsc`
    // is the instrument for that half; this test is the "and it runs" half.
    const history = startGame();
    const seam: RenderSeam = makeRenderSeam("unicode", "white-bottom", NO_NAMES);

    let cursor = 0;
    const scripted = (game: historyModule.GameHistory): Move => {
      const token = FOOLS_MATE[cursor++] as string;
      const from = parseSquareName(token.slice(0, 2));
      const to = parseSquareName(token.slice(2, 4));
      const move = legalMoves(game.position).find(
        (candidate) => candidate.from === from && candidate.to === to,
      );
      // A fixture that runs out fails loudly rather than playing an undefined move.
      if (move === undefined) throw new Error(`fixture: no legal move ${token}`);
      return move;
    };

    const writes: string[] = [];
    const outcome = await runTurnLoop({
      history,
      humanColour: "white",
      render: seam,
      input: async (game) => ({ kind: "move", move: scripted(game) }),
      engine: async (game) => scripted(game),
      sink: { write: (text) => void writes.push(text), isTTY: false, rows: 0 },
    });

    expect(outcome).toEqual({ result: "black-wins", reason: "checkmate", exitCode: 0 });
    expect(history.moves).toHaveLength(FOOLS_MATE.length);
    // `1 + plies` frames — the initial position is rendered before the first act.
    expect(writes).toHaveLength(FOOLS_MATE.length + 1);

    // ALL FOUR REAL PANELS IN PLACE, asserted against the merged producers rather than against
    // remembered text: every row the three renderers produce for the final position appears in the
    // final frame. Padding only ever APPENDS blanks, so an unpadded row is a substring of its
    // padded self.
    const finalFrame = writes[writes.length - 1] as string;
    const terminal = gameStatusOf(history);
    const panelRows = [
      ...renderBoard(history.position, "unicode", "white-bottom"),
      ...renderStatusPanel(history, terminal, false),
      ...renderHistory(history),
    ];
    for (const row of panelRows) expect(finalFrame).toContain(row);
  });

  it("A2 — derives NOTHING: gameStatus / gameStatusOf / legalMoves are 0 over three calls", () => {
    const { history, status, seam } = fixture();

    // Spies over the imported namespaces, call-through. Installed AFTER the fixture's own derive,
    // so what they count is the seam's and nothing else.
    const gameStatus = spyFrom(gameend.gameStatus);
    const statusOf = spyFrom(historyModule.gameStatusOf);
    const moves = spyFrom(legal.legalMoves);
    const panel = spyFrom(statusPanel.renderStatusPanel);

    for (let call = 0; call < 3; call++) seam(history, status, false, []);

    expect(gameStatus).toHaveBeenCalledTimes(0);
    expect(statusOf).toHaveBeenCalledTimes(0);
    expect(moves).toHaveBeenCalledTimes(0);

    // REFERENCE IDENTITY, never equality: a build that re-derives an equal status passes every
    // content assertion in this file and fails only here. `toBe` on the second argument of every
    // call the panel received.
    expect(panel).toHaveBeenCalledTimes(3);
    for (const call of panel.mock.calls) expect(call[1]).toBe(status);
  });

  it("A3 — one height across 10 cases, equal to frameHeight, with no row count in the module", () => {
    const messageCases: readonly (readonly string[])[] = [
      [],
      ["one"],
      ["one", "two", "three", "four"],
      Array.from({ length: 200 }, (_, index) => `item ${index}`),
      // `ADR-0009`'s own probe: the message region can never grow the frame.
      ["x".repeat(100_000)],
    ];

    const heights = new Set<number>();
    for (const mode of ["unicode", "ascii"] as const) {
      const { history, status, seam } = fixture(mode);
      for (const messages of messageCases) {
        heights.add(seam(history, status, false, messages).length);
      }
    }

    expect(heights.size).toBe(1);
    const { history } = fixture();
    expect([...heights][0]).toBe(
      frameHeight({
        board: renderBoard(history.position, "unicode", "white-bottom").length,
        status: STATUS_ROWS,
        history: HISTORY_ROWS,
      }),
    );

    // `ADR-0009` clause 9 — the module names no row count. Asserted over the delivered source with
    // its comments removed: the executable text contains no digit at all, so there is no literal
    // there to drift from `frameHeight`'s arithmetic.
    expect(deliveredCode()).not.toMatch(/\d/);
  });

  it("A4 — the board region is the merged renderer's, and the two orientations differ", () => {
    const regions = new Map<Orientation, readonly string[]>();

    for (const orientation of ["white-bottom", "black-bottom"] as const) {
      const { history, status, seam } = fixture("unicode", orientation);
      const frame = seam(history, status, false, []);
      const board = renderBoard(history.position, "unicode", orientation);
      // THE WIDTH COMES FROM THE PANELS — the repaired `A4`'s own clause, and never read off the
      // frame or off the board region. `assembleFrame` takes `W` over board + status + history
      // (`src/frame.ts:195-201`); `frame[0]` IS a board row, so reading `W` off it would let a seam
      // that padded the board ITSELF inflate both sides of the comparison at once (mutant `X2`).
      const width = Math.max(
        ...[...board, ...renderStatusPanel(history, status, false), ...renderHistory(history)].map(
          (row) => row.length,
        ),
      );

      expect(boardRegionOf(frame, board.length)).toEqual(board.map((row) => row.padEnd(width)));
      regions.set(orientation, boardRegionOf(frame, board.length));

      // The whole frame is the merged four composed by the merged assembler. It is what caught
      // `X2` while the width above was still circular, and it is kept for that reach. It does NOT
      // forbid a second implementation of any region — a byte-identical copy passes every
      // comparison here (`X3b`, measured). That property is `A11`'s.
      expect(frame).toEqual(
        assembleFrame(
          {
            board,
            status: renderStatusPanel(history, status, false),
            history: renderHistory(history),
            messages: [],
          },
          "unicode",
        ),
      );
    }

    // The arming half: a seam that ignored the bound orientation would pass everything above.
    expect(regions.get("white-bottom")).not.toEqual(regions.get("black-bottom"));
  });

  it("A5 — one bound mode reaches BOTH consumers: the sanitizer and the board", () => {
    const knight = "\u265E";

    const ascii = fixture("ascii");
    const asciiFrame = ascii.seam(ascii.history, ascii.status, false, [knight]);
    // ZERO code points above U+007F over the WHOLE frame, message region included — which is what
    // proves the mode reached `assembleFrame`'s sanitizer and not only `renderBoard`.
    expect(Math.max(...codePointsOf(asciiFrame))).toBeLessThanOrEqual(0x7f);

    const unicode = fixture("unicode");
    const unicodeFrame = unicode.seam(unicode.history, unicode.status, false, []);
    const board = renderBoard(unicode.history.position, "unicode", "white-bottom");
    const glyphs = codePointsOf(boardRegionOf(unicodeFrame, board.length)).filter(
      (code) => code >= 0x2654 && code <= 0x265f,
    );
    expect(glyphs.length).toBeGreaterThan(0);
  });

  it("A6 / A7 — no ambient reads, no glyph-mode import, and history.ts imported nowhere", () => {
    const source = sourceOf("render-seam.ts");

    // Over the WHOLE source, comments included: there is no ambient read to find here. ALL FOUR
    // spellings `A6` names, not just the first — `process.` alone is one keystroke wide, and an
    // ambient read reached through `globalThis["process"]` shipped GREEN against it (mutant `X8`,
    // measured at the re-gate and again here). The bare-word line subsumes the `process.` line and
    // is deliberately a substring, not a word boundary: stronger than the criterion, never weaker.
    expect(source).not.toContain("process.");
    expect(source).not.toContain("process");
    expect(source).not.toContain("globalThis");
    expect(source).not.toContain("import.meta");
    expect(source).not.toContain('from "./glyph-mode.ts"');
    // `A7`'s structural half. The measurement itself is the merged probe's, rooted at this module;
    // this says the seam holds no import of the history module AT ALL — not even a type-only one,
    // because `RenderSeam` already carries `GameHistory` in.
    expect(source).not.toContain('from "./history.ts"');
  });

  it("A8 — the headline: render / status-panel / history-pane each gain a runtime consumer", () => {
    // The measurement `EPIC-006`'s P2 -> P1 raise rested on read 0 / 0 / 0 before this ticket.
    for (const target of ["render.ts", "status-panel.ts", "history-pane.ts"]) {
      expect(runtimeConsumersOf(target), `production runtime consumers of ${target}`).toContain(
        "render-seam.ts",
      );
    }
  });

  it("A8's instrument — ADR-0030's eight spellings: exactly four bind a value, four do not", () => {
    // `ABC-054` `A1`. The boundary pair is the inline all-`type` brace (evaluates the module under
    // `verbatimModuleSyntax`, binds nothing: NOT a consumer) and the mixed brace (a consumer).
    const spellings: readonly (readonly [spelling: string, consumes: boolean])[] = [
      ['import { f } from "./m.ts";', true],
      ['import { type X, f } from "./m.ts";', true],
      ['import D from "./m.ts";', true],
      ['import * as ns from "./m.ts";', true],
      ['import type { X } from "./m.ts";', false],
      ['import { type X, type Y } from "./m.ts";', false],
      ['import "./m.ts";', false],
      ['export { f } from "./m.ts";', false],
    ];

    for (const [spelling, consumes] of spellings)
      expect(bindsAValueFrom(spelling, "m.ts"), spelling).toBe(consumes);
    expect(spellings.filter(([, consumes]) => consumes)).toHaveLength(4);
  });

  it("A8's instrument — a comment is not a specifier; it reads across lines and every statement", () => {
    // `ABC-135`. The four `false` rows are `QE-054-a`'s: a comment is neither a specifier nor a
    // statement, so none of them binds a value (`ADR-0030` decision 2). `A8` is `toContain`, so
    // only these rows can see that over-count. The two `true` rows are `QE-054-c`'s: one statement
    // across lines, and a value-binding statement that is not the file's first from the target.
    // String literals only. Biome's autofix would rewrite three of the four into `import type`.
    const spellings: readonly (readonly [spelling: string, consumes: boolean])[] = [
      ['import { /* c */ type X } from "./m.ts";', false],
      ['import {\n  type X, // c\n} from "./m.ts";', false],
      ['import {\n  type X,\n  // f,\n} from "./m.ts";', false],
      ['/*\nimport { f } from "./m.ts";\n*/', false],
      ['import {\n  type X,\n  f,\n} from "./m.ts";', true],
      ['import type { X } from "./m.ts";\nimport { f } from "./m.ts";', true],
    ];

    for (const [spelling, consumes] of spellings)
      expect(bindsAValueFrom(spelling, "m.ts"), spelling).toBe(consumes);
  });

  it("A8's instrument — the comment strip eats no code: a consumer beside a comment still counts", () => {
    // `ABC-135` QE. The rows above only see a strip that removes too LITTLE. These see one that
    // removes too much: a line comment read to end of file, a whole line dropped for its trailing
    // comment, or the line strip run before the block strip (it cuts a `*/` behind a URL). Each
    // leaves today's real-tree map unchanged, so only rows can catch it.
    const spellings: readonly string[] = [
      '// c\nimport { f } from "./m.ts";',
      'import { f } from "./m.ts"; // c',
      '/* see http://x */\nimport { f } from "./m.ts";\n/* c */',
    ];

    for (const spelling of spellings)
      expect(bindsAValueFrom(spelling, "m.ts"), spelling).toBe(true);
  });

  it("A9 — the declared COMPOSITION_ROOT, and deliberately NOT in LICENSED_DRIVERS", () => {
    const probe = sourceOf("history-pane.nfr.test.ts");
    const declaredList = (name: string): string => {
      const match = probe.match(
        new RegExp(`const ${name}: readonly string\\[\\] = \\[([^\\]]*)\\]`),
      );
      if (match === null) throw new Error(`no ${name} list in the probe`);
      return match[1] as string;
    };

    // `ADR-0029` decision 2 — the frame path is DERIVED from ONE declared composition root, and
    // this module is it (`ADR-0009` clause 9b).
    expect(probe).toMatch(/^const COMPOSITION_ROOT = "render-seam\.ts";$/m);
    // `ADR-0011` clause 3 — the licence is about RUNTIME imports of `history.ts` and this module
    // holds none. If the licence guard ever fires for this module the repair is the import; adding
    // the module here would silence a real red and widen the licence to two drivers.
    expect(declaredList("LICENSED_DRIVERS")).not.toContain("render-seam.ts");
  });

  /**
   * THE THREE ROWS BELOW WERE ADDED BY THE QE GATE (`quality-gate-ABC-041`), each because a mutant
   * built against the delivered module SURVIVED every assertion above. They add no file — the lane
   * allotment of 1 was already spent by this file itself. The first of them was written as
   * "`A4` (purpose)"; BA/PM has since deleted that false purpose clause and cut the property as the
   * ticket's own `A11`, which is what the row is now named for.
   *
   * A FOURTH — "`A4` (width)" — WAS DELETED BY THE SAME GATE AT ITS RE-GATE, and it was measured
   * before it was cut. It was written while `A4` above read its width off `frame[0]`; now that `A4`
   * derives the width from the panels for BOTH orientations it is a white-bottom-only restatement
   * of that clause, and `fixture()` defaults to exactly `A4`'s first iteration. Measured on the
   * padding mutant `X2`, the orientation mutant `X1` and a black-bottom-only padding mutant `X2b`:
   * dropping it loses NO kill — every one still reds `A4` — and `X2b` reds `A4` while that row
   * stayed GREEN, so it was strictly weaker than the clause it duplicated. It was not removed to
   * make anything pass: `A4` reds on `X2` on its own with the whole-frame equality deleted.
   */

  it("A11 — the merged four are each CALLED exactly once, never re-implemented", () => {
    // `A4`'s parenthetical used to say byte-equality "is what forbids a second board
    // implementation". It does not: a second implementation that renders the SAME BYTES is green on
    // every equality in this file. Measured — a copy of `renderBoard` in its own module passed
    // 824/824 and `tsc`, with `renderBoard` never called. What forbids it INSIDE THIS SEAM is that
    // the merged four are CALLED, which is a call count rather than a comparison. It does not reach
    // across the repository — a seam could call them for the count and render from a copy — and
    // that repo-wide property is `ABC-054`'s.
    const { history, status, seam } = fixture();
    const board = spyFrom(render.renderBoard);
    const panel = spyFrom(statusPanel.renderStatusPanel);
    const pane = spyFrom(historyPane.renderHistory);
    const assembler = spyFrom(frameModule.assembleFrame);

    seam(history, status, false, []);

    expect(board, "renderBoard").toHaveBeenCalledTimes(1);
    expect(panel, "renderStatusPanel").toHaveBeenCalledTimes(1);
    expect(pane, "renderHistory").toHaveBeenCalledTimes(1);
    expect(assembler, "assembleFrame").toHaveBeenCalledTimes(1);
  });

  it("A1 (messages) — the seam's FOURTH parameter reaches the frame's message region", () => {
    // Nothing above asserts it. `A4` and `A3` pass `[]`; `A5` passes one item and then asserts only
    // that no code point exceeds U+007F — which a seam that DISCARDED the item satisfies best of
    // all. Measured: `messages: []` hardcoded in the composition passes 824/824 and `npm run lint`
    // (exit 0 — `quality.lint.strict` is false, and the one warning it raises is autofixable).
    // `src/turn-loop.ts` names this region the loop's ONLY channel for a rejection line or an
    // ambiguity candidate list, so a seam that drops it loses every one of them silently.
    const { history, status, seam } = fixture();
    const marker = "no such move";

    const frame = seam(history, status, false, [marker]);

    expect(frame.some((row) => row.includes(marker))).toBe(true);
  });

  it("A2 (thinking) — `thinking` reaches renderStatusPanel verbatim, both ways", () => {
    // The ticket's `## Scope` says `status` AND `thinking` are "passed through verbatim". `A2`
    // asserts it of `status` only. Measured: a seam hardcoding `false` passes 824/824 and lint.
    const { history, status, seam } = fixture();
    const panel = spyFrom(statusPanel.renderStatusPanel);

    for (const thinking of [true, false]) seam(history, status, thinking, []);

    expect(panel.mock.calls.map((call) => call[2])).toEqual([true, false]);
  });
});

// ---------------------------------------------------------------------------------------------
// `ABC-096` — the opening name, through the seam (`ADR-0043`). Every display row is asserted on the
// EMITTED FRAME (test note 1). Books are real `createBookProbe`s over in-memory bytes, or one-method
// doubles where the criterion says "a book double"; the shipped artifact is read only for the
// examples the page names.
// ---------------------------------------------------------------------------------------------

describe("ABC-096 — the opening name in the message region", () => {
  afterEach(() => vi.restoreAllMocks());

  const SHIPPED = readFileSync(new URL("../data/opening-book/book.json", import.meta.url));
  const hexKey = (history: historyModule.GameHistory): string =>
    zobristKey(history.position).toString(16).padStart(16, "0");

  /** A game played from the start by UCI tokens. */
  const played = (tokens: readonly string[]): historyModule.GameHistory => {
    const history = startGame();
    for (const token of tokens) playUci(history, token);
    return history;
  };
  const playUci = (history: historyModule.GameHistory, token: string): void => {
    const from = parseSquareName(token.slice(0, 2));
    const to = parseSquareName(token.slice(2, 4));
    const move = legalMoves(history.position).find((m) => m.from === from && m.to === to);
    if (move === undefined) throw new Error(`fixture: no legal move ${token}`);
    playMove(history, move);
  };

  /** A real probe over in-memory bytes, with its warnings and its draws from `random` counted. */
  const probeOver = (positions: Record<string, unknown>, bytes?: Uint8Array) => {
    const warn = vi.fn();
    let draws = 0;
    let reads = 0;
    const probe = createBookProbe({
      read: () => {
        reads++;
        return bytes ?? new TextEncoder().encode(JSON.stringify({ format: 1, positions }));
      },
      warn,
      random: () => {
        draws++;
        return 0;
      },
    });
    return { probe, warn, draws: () => draws, reads: () => reads };
  };

  const named = (name: string): Pick<BookProbe, "openingName"> => ({ openingName: () => name });

  const frameOf = (
    history: historyModule.GameHistory,
    book: Pick<BookProbe, "openingName">,
    mode: GlyphMode = "ascii",
    messages: readonly string[] = [],
  ): readonly string[] =>
    makeRenderSeam(mode, "white-bottom", book)(history, gameStatusOf(history), false, messages);

  /** The 2-row message region: the rows just above the reserved prompt row. */
  const regionOf = (frame: readonly string[]): readonly string[] =>
    frame.slice(frame.length - PROMPT_ROWS - MESSAGE_ROWS, frame.length - PROMPT_ROWS);

  /** `W`: every row but the prompt row is padded to it. */
  const widthOf = (frame: readonly string[]): number => (frame[0] as string).length;

  /** What the region holds for a shown name `shown`: row 1 the name, row 2 blank, both padded. */
  const regionShowing = (frame: readonly string[], shown: string): readonly string[] => [
    shown.padEnd(widthOf(frame)),
    "".padEnd(widthOf(frame)),
  ];

  const blankRegion = (frame: readonly string[]): readonly string[] => regionShowing(frame, "");

  const HEIGHT_ON_MAIN = (): number =>
    frameHeight({
      board: renderBoard(startGame().position, "ascii", "white-bottom").length,
      status: STATUS_ROWS,
      history: HISTORY_ROWS,
    });

  it("A1 — the family is shown, whole when it fits HISTORY_COLS, else cut to 18 code units plus '...'", () => {
    const history = startGame();
    const cases: readonly (readonly [name: string, shown: string | undefined])[] = [
      ["Ruy Lopez: Berlin Defense, l'Hermet Variation", "Ruy Lopez"],
      ["Ruy Lopez", "Ruy Lopez"],
      // Exactly HISTORY_COLS is whole; one more is cut.
      ["King's Knight Opening: Normal Variation", "King's Knight Opening"],
      ["King's Gambit Accepted: Bishop's Gambit", "King's Gambit Acce..."],
      ["Queen's Indian Defense, with e3, Bb4+ Line", "Queen's Indian Def..."],
      // An empty family is no name.
      [": a variation with no family", undefined],
    ];
    expect(HISTORY_COLS).toBe(21);
    for (const [name, shown] of cases) {
      const frame = frameOf(history, named(name));
      if (shown === undefined) {
        expect(regionOf(frame), name).toEqual(blankRegion(frame));
        expect(frame, name).toEqual(frameOf(history, NO_NAMES));
      } else {
        expect(regionOf(frame), name).toEqual(regionShowing(frame, shown));
        expect(shown.length).toBeLessThanOrEqual(HISTORY_COLS);
      }
    }
  });

  it("A1 — the shipped book: key 75a8cd2e62c99edd shows Ruy Lopez, and the line to it shows each position's own family", () => {
    const { probe } = probeOver({}, SHIPPED);
    const line = ["e2e4", "e7e5", "g1f3", "b8c6", "f1b5"];
    const expected = ["King's Pawn Game", "King's Pawn Game", "King's Knight Opening"];
    const history = startGame();
    // The start position is not named (`ADR-0043` § Context).
    expect(regionOf(frameOf(history, probe))).toEqual(blankRegion(frameOf(history, probe)));
    const shown: string[] = [];
    for (const token of line) {
      playUci(history, token);
      shown.push((regionOf(frameOf(history, probe))[0] as string).trimEnd());
    }
    expect(hexKey(history)).toBe("75a8cd2e62c99edd");
    // The page's UAT observation 1 names these three families on the way to the Ruy Lopez.
    for (const family of expected) expect(shown).toContain(family);
    expect(shown.at(-1)).toBe("Ruy Lopez");
  });

  it("A2 — known name, no name, out of book: one row count, the 23 on main before this ticket", () => {
    const { probe } = probeOver({}, SHIPPED);
    const known = played(["e2e4", "e7e5", "g1f3", "b8c6", "f1b5"]);
    const none = startGame();
    // 1. e4 e5 2. Ke2 — `src/book-engine.test.ts` `A4`'s out-of-book line.
    const outOfBook = played(["e2e4", "e7e5", "e1e2"]);
    expect(probe.openingName(known.position)).toBe("Ruy Lopez");
    expect(probe.openingName(none.position)).toBeUndefined();
    expect(probe.inBook(outOfBook.position)).toBe(false);
    for (const mode of ["ascii", "unicode"] as const) {
      const heights = [known, none, outOfBook].map((h) => frameOf(h, probe, mode).length);
      expect(heights).toEqual([23, 23, 23]);
      expect(heights[0]).toBe(HEIGHT_ON_MAIN());
    }
  });

  it("A3 — ESC, C0, U+007F, above U+007F and a newline in the name: none reaches the emitted frame", () => {
    const hostile = "\u001b[2J\u0007Evil\u007fé\nName";
    const history = startGame();
    for (const mode of ["ascii", "unicode"] as const) {
      const frame = frameOf(history, named(hostile), mode);
      const codes = codePointsOf(frame);
      expect(
        codes.filter((code) => code === 0x1b),
        `${mode}: ESC`,
      ).toEqual([]);
      expect(
        codes.filter((code) => code < 0x20),
        `${mode}: C0`,
      ).toEqual([]);
      expect(
        codes.filter((code) => code === 0x7f),
        `${mode}: U+007F`,
      ).toEqual([]);
      if (mode === "ascii")
        expect(
          codes.filter((code) => code > 0x7f),
          "ascii: above U+007F",
        ).toEqual([]);
      expect(frame.length, `${mode}: rows`).toBe(frameOf(history, NO_NAMES, mode).length);
      // NON-VACUITY: the name WAS rendered, as what `sanitize` leaves of it.
      expect((regionOf(frame)[0] as string).trimEnd(), mode).toBe(
        mode === "ascii" ? "[2JEvilName" : "[2JEviléName",
      );
    }
  });

  it("A4 — a 100,000-character name: shown <= 21 code units, W and the row count unchanged, in each mode", () => {
    const history = startGame();
    const long = "x".repeat(100_000);
    for (const mode of ["ascii", "unicode"] as const) {
      const without = frameOf(history, NO_NAMES, mode);
      const frame = frameOf(history, named(long), mode);
      expect(regionOf(frame), mode).toEqual(regionShowing(frame, `${"x".repeat(18)}...`));
      expect((regionOf(frame)[0] as string).trimEnd().length).toBeLessThanOrEqual(HISTORY_COLS);
      expect(widthOf(frame), `${mode}: W`).toBe(widthOf(without));
      expect(frame.length, `${mode}: rows`).toBe(without.length);
    }
  });

  it("A4 — astral code points in unicode mode: whole code points, no '(+N more)', no lone surrogate", () => {
    const history = startGame();
    const clef = "\u{1D11E}";
    const loneSurrogate = /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/;
    for (const length of [100_000, 21, 11, 10]) {
      const frame = frameOf(history, named(clef.repeat(length)), "unicode");
      const without = frameOf(history, NO_NAMES, "unicode");
      // 10 astral code points are 20 code units and fit whole; 11 are 22 and are cut to 9 + "...".
      const shown = length <= 10 ? clef.repeat(length) : `${clef.repeat(9)}...`;
      expect(regionOf(frame), `${length}`).toEqual(regionShowing(frame, shown));
      expect(frame.join("\n"), `${length}: marker`).not.toContain("more)");
      for (const row of frame) expect(row, `${length}: lone surrogate`).not.toMatch(loneSurrogate);
      expect(widthOf(frame)).toBe(widthOf(without));
      expect(frame.length).toBe(without.length);
    }
  });

  it("A5 — leaving book: each ply shows its own position's name or nothing, the line end included", () => {
    // A book built for the line, keyed by the real `zobristKey`. Ply 2 and 3 are in book and unnamed;
    // ply 5 is a named line end (`m` empty); ply 6 is not in the book at all.
    const line = ["e2e4", "e7e5", "g1f3", "b8c6", "f1b5", "a7a6"];
    const entries: Record<string, unknown>[] = [
      { m: [["e2e4", 1]] },
      { m: [["e7e5", 1]], n: "King's Pawn Game" },
      { m: [["g1f3", 1]] },
      { m: [["b8c6", 1]] },
      { m: [["f1b5", 1]], n: "King's Knight Opening: Normal Variation" },
      { m: [], n: "Ruy Lopez" },
    ];
    const positions: Record<string, unknown> = {};
    const walk = startGame();
    entries.forEach((entry, ply) => {
      positions[hexKey(walk)] = entry;
      if (ply < line.length) playUci(walk, line[ply] as string);
    });
    const { probe, warn } = probeOver(positions);
    const expected = [
      undefined,
      "King's Pawn Game",
      undefined,
      undefined,
      "King's Knight Opening",
      "Ruy Lopez",
      undefined,
    ];

    const history = startGame();
    const seam = makeRenderSeam("ascii", "white-bottom", probe);
    const noNames = makeRenderSeam("ascii", "white-bottom", NO_NAMES);
    for (let ply = 0; ply <= line.length; ply++) {
      if (ply > 0) playUci(history, line[ply - 1] as string);
      const frame = seam(history, gameStatusOf(history), false, []);
      const shown = expected[ply];
      if (shown === undefined)
        expect(frame, `ply ${ply}`).toEqual(noNames(history, gameStatusOf(history), false, []));
      else expect(regionOf(frame), `ply ${ply}`).toEqual(regionShowing(frame, shown));
    }
    // The line end is out of book and still named.
    const lineEnd = played(line.slice(0, 5));
    expect(probe.inBook(lineEnd.position)).toBe(false);
    expect(probe.bookMove(lineEnd.position)).toBeUndefined();
    expect(warn).not.toHaveBeenCalled();
  });

  it("A5 — no state between frames: a take-back or a new game to an unnamed position shows nothing", () => {
    const { probe } = probeOver({}, SHIPPED);
    const seam = makeRenderSeam("ascii", "white-bottom", probe);
    const noNames = makeRenderSeam("ascii", "white-bottom", NO_NAMES);
    const frame = (h: historyModule.GameHistory) => seam(h, gameStatusOf(h), false, []);
    const blank = (h: historyModule.GameHistory) => noNames(h, gameStatusOf(h), false, []);

    const history = played(["e2e4", "e7e5", "g1f3", "b8c6", "f1b5"]);
    expect(regionOf(frame(history))[0]?.trimEnd()).toBe("Ruy Lopez");
    takeBack(history, 5);
    expect(frame(history), "take-back to the unnamed start").toEqual(blank(history));
    for (const token of ["e2e4", "e7e5", "g1f3", "b8c6", "f1b5"]) playUci(history, token);
    expect(regionOf(frame(history))[0]?.trimEnd(), "its own name again").toBe("Ruy Lopez");
    const fresh = startGame();
    expect(frame(fresh), "a new game").toEqual(blank(fresh));
  });

  it("A6 — names on entries with an empty m; inBook / bookMove unchanged there; framing draws random 0 times", () => {
    const start = startGame();
    const afterE4 = played(["e2e4"]);
    const { probe, draws, warn } = probeOver({
      [hexKey(start)]: { m: [["e2e4", 1]], n: "Start" },
      [hexKey(afterE4)]: { m: [], n: "King's Pawn Game" },
    });
    expect(probe.openingName(afterE4.position)).toBe("King's Pawn Game");
    expect(probe.inBook(afterE4.position)).toBe(false);
    expect(probe.bookMove(afterE4.position)).toBeUndefined();
    expect(probe.inBook(start.position)).toBe(true);
    const before = draws();
    // The statuses are the loop's, derived before the spy, so what it counts is the frames'.
    const games = [start, afterE4].map((h) => ({ h, status: gameStatusOf(h) }));
    const moves = spyFrom(legal.legalMoves);
    const seam = makeRenderSeam("unicode", "white-bottom", probe);
    for (let frame = 0; frame < 50; frame++) {
      for (const { h, status } of games) seam(h, status, false, []);
    }
    expect(draws() - before, "draws from random while framing").toBe(0);
    expect(moves, "legalMoves while framing").toHaveBeenCalledTimes(0);
    expect(warn).not.toHaveBeenCalled();
  });

  it("A7 — n as a number, an object or an empty string is no name: moves still served, 0 warnings", () => {
    const history = startGame();
    for (const n of [7, { family: "Ruy Lopez" }, ""]) {
      const { probe, warn } = probeOver({ [hexKey(history)]: { m: [["e2e4", 1]], n } });
      const frame = frameOf(history, probe);
      expect(frame, JSON.stringify(n)).toEqual(frameOf(history, NO_NAMES));
      expect(probe.openingName(history.position)).toBeUndefined();
      expect(probe.bookMove(history.position), "the artifact is not refused").toBeDefined();
      expect(warn, JSON.stringify(n)).not.toHaveBeenCalled();
    }
  });

  it('A8 — the third parameter is required and typed Pick<BookProbe, "openingName">, imported as a type', () => {
    const source = sourceOf("render-seam.ts");
    expect(deliveredCode()).toMatch(
      /export function makeRenderSeam\(\s*mode: GlyphMode,\s*orientation: Orientation,\s*book: Pick<BookProbe, "openingName">,?\s*\): RenderSeam/,
    );
    expect(source).toContain('import type { BookProbe } from "./book.ts";');
    expect(bindsAValueFrom(source, "book.ts"), "a value import of book.ts").toBe(false);
    // The typecheck is the instrument for "required"; this never runs.
    const _unbuildable = () =>
      // @ts-expect-error — the seam cannot be built without the session's probe.
      makeRenderSeam("ascii", "white-bottom");
    expect(typeof _unbuildable).toBe("function");
  });

  it("A9 — the loop's message items win: byte-identical frames and 0 lookups; [] looks once and shows the name", () => {
    const history = played(["e2e4", "e7e5", "g1f3", "b8c6", "f1b5"]);
    const { probe } = probeOver({}, SHIPPED);
    const lookup = vi.fn(probe.openingName);
    const book = { openingName: lookup };
    const itemSets: readonly (readonly string[])[] = [
      ["no such move: zzz"],
      ["ambiguous: Nbd2", "Nfd2"],
      ["took back 2 plies"],
      Array.from({ length: 40 }, (_, index) => `item ${index}`),
    ];
    for (const mode of ["ascii", "unicode"] as const) {
      for (const messages of itemSets) {
        lookup.mockClear();
        const frame = frameOf(history, book, mode, messages);
        expect(frame).toEqual(frameOf(history, NO_NAMES, mode, messages));
        expect(lookup, `${messages[0]}: lookups`).toHaveBeenCalledTimes(0);
      }
      lookup.mockClear();
      const frame = frameOf(history, book, mode, []);
      expect(lookup).toHaveBeenCalledTimes(1);
      expect(regionOf(frame)).toEqual(regionShowing(frame, "Ruy Lopez"));
      expect(frame.join("\n")).not.toContain("more)");
    }
  });
});
