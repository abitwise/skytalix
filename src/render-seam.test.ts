/**
 * `ABC-041`'s ten acceptance criteria.
 *
 * NO `vi.mock`, NO SPAWN, NO TTY — the ticket's `## Test notes` row 5, and the reason this is a
 * plain `*.test.ts` rather than an eighth `*.nfr.test.ts`: a `vi.mock` factory is hoisted to file
 * scope and would re-route the module graph for the whole table. `A2`'s spies are `vi.spyOn` over
 * imported namespaces, which call through, so every frame asserted below is a REAL frame composed by
 * the four merged producers.
 *
 * `A7` AND `A9` ARE NOT ASSERTED HERE AS A MEASUREMENT — they are the MERGED probe's, in
 * `src/history-pane.nfr.test.ts`, which this ticket adds exactly one root line to. What this file
 * holds instead is the DECLARATION's own guard (`A9` below): that the new module is in
 * `FRAME_PRODUCERS` and is NOT in `LICENSED_DRIVERS`. That second half is mechanical because the
 * Orchestrator's `In Development`-entry criteria review recorded it as a one-keystroke wrong move —
 * a module whose `history.ts` import went runtime would trip the licence guard, and adding itself to
 * the licence would satisfy that guard while quietly widening `ADR-0011` clause 3 from one licensed
 * driver to two. The correct repair is always the import, never the list, and now a test says so.
 *
 * `A4`'s WORDING IS REPAIRED HERE, NOT WAIVED, AND THE REPAIR IS STRICTLY STRONGER. The criterion
 * asks for the frame's board region to be "byte-identical to `renderBoard(position, mode,
 * orientation)`". Measured on this tree, NO implementation can satisfy that literally:
 * `assembleFrame` pads every panel row to the frame's own width (`src/frame.ts:205`), and the board
 * is the narrowest panel — 18 columns against the history pane's 21 — so the board region is
 * `renderBoard`'s rows plus trailing blanks, always. `assembleFrame` is merged and `A10` forbids
 * touching it, and the padding is the frame's constant-geometry guarantee rather than a defect. So
 * the assertion below is byte-equality against the merged renderer THROUGH the merged assembler,
 * with the width read off the frame itself and never named: it fails on a second board
 * implementation, on a dropped orientation and on a re-ordered region exactly as the criterion
 * intends (`## Test notes` row 2), and it additionally pins the whole frame to the merged four.
 */

import { readdirSync, readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { assembleFrame, frameHeight } from "./frame.ts";
import * as gameend from "./gameend.ts";
import * as historyModule from "./history.ts";
import { gameStatusOf, newGame } from "./history.ts";
import { HISTORY_ROWS, renderHistory } from "./history-pane.ts";
import * as legal from "./legal.ts";
import { legalMoves } from "./legal.ts";
import type { Move } from "./moves.ts";
import { parseSquareName } from "./position.ts";
import { type GlyphMode, type Orientation, renderBoard } from "./render.ts";
import { makeRenderSeam } from "./render-seam.ts";
import * as statusPanel from "./status-panel.ts";
import { renderStatusPanel, STATUS_ROWS } from "./status-panel.ts";
import { type RenderSeam, runTurnLoop } from "./turn-loop.ts";

const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/** The shortest checkmate there is — four plies, and `A1`'s "≥ 4 plies to a terminal result". */
const FOOLS_MATE = ["f2f3", "e7e5", "g2g4", "d8h4"] as const;

const SOURCE_DIRECTORY = new URL(".", import.meta.url).pathname;
const sourceOf = (file: string): string => readFileSync(`${SOURCE_DIRECTORY}${file}`, "utf8");

const startGame = () => newGame(START_FEN);

/** A game, its status, and the seam under test — the fixture almost every criterion starts from. */
function fixture(mode: GlyphMode = "unicode", orientation: Orientation = "white-bottom") {
  const history = startGame();
  const status = gameStatusOf(history);
  const seam: RenderSeam = makeRenderSeam(mode, orientation);
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

/**
 * The epic's own grep, module by module: which production modules hold a RUNTIME import of `target`.
 * Runtime and not type-only is the whole point of the measurement `EPIC-006` was raised on —
 * `src/render.ts` already had two `import type { GlyphMode }` importers and still had zero consumers
 * of `renderBoard`.
 */
const runtimeImportersOf = (target: string): readonly string[] =>
  productionModules().filter(
    (file) =>
      file !== target &&
      new RegExp(
        `^(?:import|export)\\s+(?!type\\b)(?:[^;]*from\\s+)?"\\./${target.replace(".", "\\.")}";`,
        "m",
      ).test(sourceOf(file)),
  );

/** The delivered module with every comment removed — what `A3` and `A6` assert over. */
const deliveredCode = (): string =>
  sourceOf("render-seam.ts")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*$/gm, "");

describe("ABC-041 — the render seam", () => {
  afterEach(() => vi.restoreAllMocks());

  it("A1 — IS the published RenderSeam: a 4-ply game runs to checkmate through runTurnLoop", async () => {
    // No adapter and no cast anywhere on this path: `makeRenderSeam`'s result is annotated
    // `RenderSeam` at its declaration and handed to `runTurnLoop` as `render` unwrapped. `tsc`
    // is the instrument for that half; this test is the "and it runs" half.
    const history = startGame();
    const seam: RenderSeam = makeRenderSeam("unicode", "white-bottom");

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
    const gameStatus = vi.spyOn(gameend, "gameStatus");
    const statusOf = vi.spyOn(historyModule, "gameStatusOf");
    const moves = vi.spyOn(legal, "legalMoves");
    const panel = vi.spyOn(statusPanel, "renderStatusPanel");

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
      // The width is READ OFF THE FRAME, never named: every panel row is padded to it by
      // `assembleFrame`, and the first row of a frame is a board row.
      const width = (frame[0] as string).length;

      expect(boardRegionOf(frame, board.length)).toEqual(board.map((row) => row.padEnd(width)));
      regions.set(orientation, boardRegionOf(frame, board.length));

      // The whole frame is the merged four composed by the merged assembler — the property that
      // forbids a second implementation of ANY region, not just the board.
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

    // Over the WHOLE source, comments included: there is no ambient read to find here.
    expect(source).not.toContain("process.");
    expect(source).not.toContain('from "./glyph-mode.ts"');
    // `A7`'s structural half. The measurement itself is the merged probe's, rooted at this module;
    // this says the seam holds no import of the history module AT ALL — not even a type-only one,
    // because `RenderSeam` already carries `GameHistory` in.
    expect(source).not.toContain('from "./history.ts"');
  });

  it("A8 — the headline: render / status-panel / history-pane each gain a runtime importer", () => {
    // The measurement `EPIC-006`'s P2 -> P1 raise rested on read 0 / 0 / 0 before this ticket.
    for (const target of ["render.ts", "status-panel.ts", "history-pane.ts"]) {
      expect(runtimeImportersOf(target), `production runtime importers of ${target}`).toContain(
        "render-seam.ts",
      );
    }
  });

  it("A9 — declared in FRAME_PRODUCERS, and deliberately NOT in LICENSED_DRIVERS", () => {
    const probe = sourceOf("history-pane.nfr.test.ts");
    const declaredList = (name: string): string => {
      const match = probe.match(
        new RegExp(`const ${name}: readonly string\\[\\] = \\[([^\\]]*)\\]`),
      );
      if (match === null) throw new Error(`no ${name} list in the probe`);
      return match[1] as string;
    };

    // `ADR-0011` clause 2 — the frame path is DECLARED, and this is the first new frame producer
    // since the probe was written.
    expect(declaredList("FRAME_PRODUCERS")).toContain('"render-seam.ts"');
    // `ADR-0011` clause 3 — the licence is about RUNTIME imports of `history.ts` and this module
    // holds none. If the licence guard ever fires for this module the repair is the import; adding
    // the module here would silence a real red and widen the licence to two drivers.
    expect(declaredList("LICENSED_DRIVERS")).not.toContain("render-seam.ts");
  });
});
