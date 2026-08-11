/**
 * `ABC-018`'s acceptance criteria, one test each in the ticket's order, plus the pins the criteria
 * do not reach.
 *
 * NO TEST HERE ATTACHES A TERMINAL. Every assertion is made against a CAPTURED SINK or against the
 * in-memory screen model below — the ticket's first test note, and what epic acceptance `4c` and
 * `EPIC-006`'s pipe-driven end-to-end test both stand on. `process.stdout` is never read and never
 * mutated: the strategy tests mutate the sink handed to the writer, which is what makes the
 * "signals change after construction" criterion able to fail at all.
 *
 * THE TWO UNBUILT PANELS ENTER AS FIXED-HEIGHT STUBS, exactly as the ticket's `## Dependencies`
 * prescribes — `ABC-016` (status, 3 rows) and `ABC-017` (history, 8 rows) do not exist. The BOARD is
 * NOT stubbed: it is the merged `renderBoard` from `ABC-014`, 9 rows of 18 characters, so the
 * `W = 18` the criteria quote as a stub fixture FALLS OUT of the real panel rather than being
 * asserted into existence here. `W` and `H` are derived in every test (`widthOf`, `frameHeight`);
 * `18` and `23` appear only as the epic's reference layout being checked, never as an input.
 */
import { describe, expect, it } from "vitest";
import { makeMove } from "./apply.ts";
import { parseFen } from "./fen.ts";
import {
  assembleFrame,
  beginFrameSession,
  type FrameParts,
  type FrameSink,
  frameHeight,
  MESSAGE_ROWS,
  PROMPT_ROWS,
} from "./frame.ts";
import { HISTORY_ROWS } from "./history-pane.ts";
import { legalMoves } from "./legal.ts";
import type { Move } from "./moves.ts";
import { type Position, parseSquareName, squareName } from "./position.ts";
import { type GlyphMode, renderBoard } from "./render.ts";

const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/**
 * `A13` (`ADR-0009` cl. 5) — the composition fit-check, owed by whichever panel ticket merges
 * SECOND, and MET IN PART here because `ABC-016` has not merged yet.
 *
 * TWO OF THE THREE TERMS NOW READ DELIVERED GEOMETRY — `history` is `ABC-017`'s exported
 * `HISTORY_ROWS`, imported above and re-declared nowhere in this file, and `board` is
 * `renderBoard(...).length`. The third is `status`, and it CANNOT be made
 * live on this branch: `src/status-panel.ts` does not exist on `main`, `tsconfig.json` includes
 * `src/**` and `npm run typecheck` is project-wide `tsc --noEmit` under `gate_enforcement:
 * blocking`, so importing `STATUS_ROWS` here would turn the whole project's typecheck gate red —
 * the exact cost `ADR-0009`'s `## Context` measured and refused to pay. It is left as the shadow it
 * already was, flagged rather than faked.
 *
 * OWED AT THE REBASE ONTO MERGED `ABC-016`, and it is two edits, not one:
 *   1. `const STATUS_ROWS = 3` below becomes `import { STATUS_ROWS } from "./status-panel.ts"`;
 *   2. `statusStub` (below) returns a HARDCODED three-element array while `historyStub` sizes
 *      itself from `HISTORY_ROWS`. Once `STATUS_ROWS` is live the two can disagree, and the failure
 *      surfaces at `expect([...counts]).toEqual([HEIGHT])` pointing at the wrong thing. Size the
 *      stub from the constant, or use the real panel. Leaving it is the trap.
 * Until then M1 (status ships 4) and M6 (status ships 5) are caught by `ABC-016`'s own `A11` and by
 * nothing here; M2, M3, M4 and M5 — including both mutants that make epic `4b` unreachable — are
 * caught by the two live terms. Measured at this hop, not transcribed.
 */
const STATUS_ROWS = 3;
/**
 * `renderBoard`'s DELIVERED geometry, MEASURED rather than restated. `ADR-0009` cl. 6 adds no
 * `BOARD_ROWS` export to `src/render.ts` and does not touch that merged module: `.length` is
 * stronger than a constant would be, and it is the only form that fails a `renderBoard` shipping 10.
 */
const BOARD_ROWS = renderBoard(parseFen(START_FEN), "unicode", "white-bottom").length;

/** The height every test derives, so no test hands the writer a number the assembler disagrees with. */
const HEIGHT = frameHeight({ board: BOARD_ROWS, status: STATUS_ROWS, history: HISTORY_ROWS });

const CURSOR_HOME = "\x1b[H";
const ERASE_TO_END_OF_SCREEN = "\x1b[0J";
/** `ABC-027` / `ADR-0010` cl. 1 — the per-row erase the in-place writer emits between rows. */
const ERASE_TO_END_OF_LINE = "\x1b[K";

// ---------------------------------------------------------------------------
// Fixtures — the real board, stubs for the two unbuilt panels, a real game.
// ---------------------------------------------------------------------------

/** `ABC-016` is unbuilt. Three rows, one of which carries the thinking state. */
const statusStub = (thinking: boolean): string[] => [
  "White to move",
  "check: no",
  thinking ? "thinking..." : "ready",
];

const coordinatesOf = (move: Move): string => `${squareName(move.from)}${squareName(move.to)}`;

/**
 * `ABC-017` is unbuilt. Eight rows, blank-padded, holding the most recent 8 move pairs — the shape
 * its ticket states. Coordinate notation, not SAN: `ABC-013` owns SAN and is unbuilt too.
 */
function historyStub(moves: readonly Move[]): string[] {
  const pairs: string[] = [];
  for (let ply = 0; ply < moves.length; ply += 2) {
    const white = moves[ply] as Move;
    const black = moves[ply + 1];
    const reply = black === undefined ? "" : ` ${coordinatesOf(black)}`;
    pairs.push(`${ply / 2 + 1}. ${coordinatesOf(white)}${reply}`);
  }
  const window = pairs.slice(-HISTORY_ROWS);
  while (window.length < HISTORY_ROWS) window.push("");
  return window;
}

/**
 * The four-ply cycle both knights shuffle around. It is legal at every ply and never ends, so a
 * frame can be assembled at a STATED ply count instead of at a position that merely looks like one.
 */
const SHUFFLE: readonly (readonly [string, string])[] = [
  ["g1", "f3"],
  ["g8", "f6"],
  ["f3", "g1"],
  ["f6", "g8"],
];

interface Game {
  readonly position: Position;
  readonly moves: readonly Move[];
}

/** A legal game of exactly `plies` plies, played from the start position. */
function playTo(plies: number): Game {
  const position = parseFen(START_FEN);
  const moves: Move[] = [];
  for (let ply = 0; ply < plies; ply++) {
    const [from, to] = SHUFFLE[ply % SHUFFLE.length] as readonly [string, string];
    const move = legalMoves(position).find(
      (candidate) =>
        candidate.from === parseSquareName(from) && candidate.to === parseSquareName(to),
    ) as Move;
    makeMove(position, move);
    moves.push(move);
  }
  return { position, moves };
}

interface PartsOptions {
  readonly messages?: readonly string[];
  readonly thinking?: boolean;
  readonly mode?: GlyphMode;
  readonly status?: readonly string[];
}

function partsFor(game: Game, options: PartsOptions = {}): FrameParts {
  return {
    board: renderBoard(game.position, options.mode ?? "unicode", "white-bottom"),
    status: options.status ?? statusStub(options.thinking ?? false),
    history: historyStub(game.moves),
    messages: options.messages ?? [],
  };
}

const widthOf = (frame: readonly string[]): number =>
  frame.reduce((widest, row) => Math.max(widest, row.length), 0);

/** The two message rows: the frame's last rows before the reserved prompt row. */
const messageRegionOf = (frame: readonly string[]): string[] =>
  frame.slice(-(MESSAGE_ROWS + PROMPT_ROWS), -PROMPT_ROWS);

const outsideMessageRegionOf = (frame: readonly string[]): string[] =>
  frame.slice(0, -(MESSAGE_ROWS + PROMPT_ROWS));

const codePointsAbove = (text: string, ceiling: number): string[] =>
  [...text].filter((character) => (character.codePointAt(0) as number) > ceiling);

const occurrences = (text: string, needle: string): number => text.split(needle).length - 1;

// ---------------------------------------------------------------------------
// The captured sink — what every strategy test writes into.
// ---------------------------------------------------------------------------

interface CaptureSink extends FrameSink {
  readonly chunks: string[];
}

function captureSink(isTTY: boolean, rows: number): CaptureSink {
  const chunks: string[] = [];
  return {
    chunks,
    isTTY,
    rows,
    write(text: string): void {
      chunks.push(text);
    },
  };
}

const captured = (sink: CaptureSink): string => sink.chunks.join("");

// ---------------------------------------------------------------------------
// The screen model — the ticket's second test note: "apply the emitted sequences
// to a small in-memory grid and assert the resulting rows".
// ---------------------------------------------------------------------------

interface Screen {
  write(text: string): void;
  lines(): string[];
  cursor(): { row: number; column: number };
}

/**
 * A terminal small enough to reason about. Four behaviours are modelled and each is an assumption
 * stated rather than buried:
 *
 *   - `\n` moves to column 0 of the next row — the ONLCR translation a terminal in cooked mode does,
 *     which is what lets this module write a multi-row frame without emitting a carriage return;
 *   - the wrap at the right margin is DEFERRED, as xterm and Terminal.app do it: a row of exactly
 *     `columnCount` characters leaves the cursor AT the margin and does not move down until the next
 *     printable character. Modelling it eagerly would put a phantom blank row into every frame. THIS
 *     ONE IS MEASURED RATHER THAN ASSUMED, and it is the only one that is: a cursor at the margin
 *     sits ON the last cell, so an erase from there ERASES that cell and the pending wrap survives —
 *     Security/NFR on GNU screen 5.0.2, and `ABC-027`'s `A7` pins it here. The other three bullets
 *     are still assumptions and are NOT promoted by standing next to it;
 *   - moving below the last row scrolls the whole screen up by one — the mechanism the 23/23
 *     boundary criterion exists to catch;
 *   - an escape sequence this model does not implement THROWS. An ignored sequence is how a screen
 *     model quietly certifies a writer that emits something the terminal would have obeyed.
 */
function createScreen(rowCount: number, columnCount: number): Screen {
  const blankRow = (): string[] => new Array<string>(columnCount).fill(" ");
  const grid: string[][] = Array.from({ length: rowCount }, blankRow);
  let row = 0;
  let column = 0;

  const scrollIfBelow = (): void => {
    if (row < rowCount) return;
    grid.shift();
    grid.push(blankRow());
    row = rowCount - 1;
  };

  /**
   * `ABC-027` `A7` — the cursor's REAL column, which is where an erase fires from. With the wrap
   * DEFERRED the cursor sits ON the last cell, not one past it: `column === columnCount` is this
   * model's representation of "at the margin, wrap pending", and erasing from there erases the cell
   * at `columnCount - 1`. Both erase helpers take it, because a real terminal's `ED` erases from the
   * cursor too and a model honest in one helper and not the other disagrees with itself.
   *
   * MEASURED, NOT ASSUMED — the one statement in this model's assumption block that is. `A7` pins it
   * with the Security/NFR gate's own numbers. Leaving it at `column` made the erase a NO-OP at the
   * margin, and that is what let a real regression pass six criteria, a 14-mutant campaign and 681
   * green tests. The `column` variable is deliberately NOT written here: the deferred wrap survives
   * the erase, which is also measured.
   */
  const eraseFrom = (): number => Math.min(column, columnCount - 1);

  const eraseToEndOfScreen = (): void => {
    const current = grid[row] as string[];
    for (let index = eraseFrom(); index < columnCount; index++) current[index] = " ";
    for (let below = row + 1; below < rowCount; below++) grid[below] = blankRow();
  };

  /** `ABC-027` — erase from the cursor to the end of the LINE, cursor unmoved. */
  const eraseToEndOfLine = (): void => {
    const current = grid[row] as string[];
    for (let index = eraseFrom(); index < columnCount; index++) current[index] = " ";
  };

  return {
    write(text: string): void {
      let index = 0;
      while (index < text.length) {
        if (text.startsWith(CURSOR_HOME, index)) {
          row = 0;
          column = 0;
          index += CURSOR_HOME.length;
          continue;
        }
        if (text.startsWith(ERASE_TO_END_OF_SCREEN, index)) {
          eraseToEndOfScreen();
          index += ERASE_TO_END_OF_SCREEN.length;
          continue;
        }
        if (text.startsWith(ERASE_TO_END_OF_LINE, index)) {
          eraseToEndOfLine();
          index += ERASE_TO_END_OF_LINE.length;
          continue;
        }
        const character = text[index] as string;
        index++;
        if (character === "\n") {
          column = 0;
          row++;
          scrollIfBelow();
          continue;
        }
        if (character === "\x1b") {
          throw new Error(
            `screen model: unmodelled escape ${JSON.stringify(text.slice(index - 1))}`,
          );
        }
        if (column >= columnCount) {
          column = 0;
          row++;
          scrollIfBelow();
        }
        (grid[row] as string[])[column] = character;
        column++;
      }
    },
    lines: () => grid.map((cells) => cells.join("")),
    cursor: () => ({ row, column }),
  };
}

/** The rows of `frame` that frame `next` does not also carry — the ones a clean redraw must remove. */
const rowsOnlyIn = (frame: readonly string[], next: readonly string[]): string[] =>
  frame.filter((row) => row.trim() !== "" && !next.includes(row));

// ---------------------------------------------------------------------------
// Acceptance — one test per criterion, in the ticket's order.
// ---------------------------------------------------------------------------

describe("ABC-018 acceptance — the assembled frame", () => {
  it("keeps one row count at EVERY ply of a game played to 80 plies and on to 300", () => {
    const game = playTo(300);
    const position = parseFen(START_FEN);
    const counts = new Set<number>();
    const plies: number[] = [];

    for (let ply = 0; ply <= game.moves.length; ply++) {
      const played = game.moves.slice(0, ply);
      const frame = assembleFrame(
        {
          board: renderBoard(position, "unicode", "white-bottom"),
          status: statusStub(false),
          history: historyStub(played),
          messages: [],
        },
        "unicode",
      );
      counts.add(frame.length);
      plies.push(ply);
      const next = game.moves[ply];
      if (next !== undefined) makeMove(position, next);
    }

    expect(plies).toContain(80);
    expect(plies).toContain(300);
    expect([...counts]).toEqual([HEIGHT]);
    // Epic `4a` verbatim. It was near-vacuous while `HEIGHT`'s three terms were local literals;
    // `A13` made two of them delivered geometry, so this is now the TRIPWIRE — it fails on any
    // change to the board's or the history pane's row count, which is what forces such a change to
    // be deliberate rather than silent. The `<= 24` REQUIREMENT is the other half and lives with
    // the composition test at the end of this block.
    expect(HEIGHT).toBe(23);
  });

  it("keeps one row count across message content x thinking state, all four in the same run", () => {
    const game = playTo(12);
    const rejection = ["no piece on that square", "try again"];

    const counts = [false, true].flatMap((thinking) =>
      [[], rejection].map(
        (messages) => assembleFrame(partsFor(game, { messages, thinking }), "unicode").length,
      ),
    );

    expect(counts).toEqual([HEIGHT, HEIGHT, HEIGHT, HEIGHT]);
  });

  it("shows all 6 candidates that FIT the 2-row region and emits no (+N more) marker", () => {
    const candidates = ["Nbd2", "Nfd2", "Rae1", "Rfe1", "Qxd4", "Rxd4"];
    const frame = assembleFrame(partsFor(playTo(8), { messages: candidates }), "unicode");
    const region = messageRegionOf(frame);
    const width = widthOf(frame);

    // Six 4-character SANs need 29 characters; a 2-row region at W = 18 holds 36.
    expect(width).toBe(18);
    expect(region).toHaveLength(2);
    for (const candidate of candidates) expect(region.join("\n")).toContain(candidate);
    expect(region.join("\n")).not.toContain("more)");
    for (const row of frame) expect(row.length).toBeLessThanOrEqual(width);
    expect(frame).toHaveLength(HEIGHT);
  });

  it("truncates 10 candidates that do NOT fit with (+N more), N counted from the INPUT", () => {
    const candidates = [
      "Nbd2",
      "Nfd2",
      "Rae1",
      "Rfe1",
      "Qxd4",
      "Rxd4",
      "Nxe5",
      "Bxf7",
      "Qh5+",
      "Rd8#",
    ];
    const frame = assembleFrame(partsFor(playTo(8), { messages: candidates }), "unicode");
    const region = messageRegionOf(frame);
    const width = widthOf(frame);
    const text = region.join("\n");

    // Ten 4-character SANs need 49 characters against the 36 a 2-row region at W = 18 holds.
    expect(width).toBe(18);
    expect(region).toHaveLength(2);

    // N is a count of the INPUT, so an implementation that packs differently still passes and one
    // that invents N fails: whatever it chose to show, N is what it did not show IN FULL.
    const shown = candidates.filter((candidate) => text.includes(candidate));
    const hidden = candidates.length - shown.length;
    expect(hidden).toBeGreaterThan(0);
    expect((region[1] as string).trimEnd().endsWith(`(+${hidden} more)`)).toBe(true);

    for (const row of frame) expect(row.length).toBeLessThanOrEqual(width);
    for (const row of outsideMessageRegionOf(frame)) {
      for (const candidate of candidates) expect(row).not.toContain(candidate);
    }
    expect(frame).toHaveLength(HEIGHT);
  });
});

describe("ABC-018 acceptance — writing and redraw", () => {
  it("redraws IN PLACE on a 24-row TTY: cursor home, the frame, exactly one erase to end of screen", () => {
    const first = assembleFrame(partsFor(playTo(81), { messages: ["first"] }), "unicode");
    const second = assembleFrame(
      partsFor(playTo(300), { messages: ["second"], thinking: true }),
      "unicode",
    );
    const width = widthOf(first);
    const sink = captureSink(true, 24);
    const write = beginFrameSession(sink, HEIGHT);
    const screen = createScreen(24, width);

    write(first);
    write(second);
    for (const chunk of sink.chunks) screen.write(chunk);

    const redraw = sink.chunks[1] as string;
    expect(redraw.startsWith(CURSOR_HOME)).toBe(true);
    // `ABC-027` `RF-1` — an erase-in-line precedes EVERY row, so it fires at COLUMN 0 and never at
    // the right margin, and the escape count is `2 + H`. Both counts stay derived from `H`. The
    // count below is MASKED by the assertion above it — that one fails first and this one never
    // reports — so it is corrected here by derivation, not by whatever the runner happened to print.
    expect(redraw).toContain(`${ERASE_TO_END_OF_LINE}${second.join(`\n${ERASE_TO_END_OF_LINE}`)}`);
    expect(occurrences(redraw, ERASE_TO_END_OF_SCREEN)).toBe(1);
    expect(occurrences(redraw, "\x1b")).toBe(2 + HEIGHT);

    const lines = screen.lines();
    expect(lines.slice(0, HEIGHT - 1)).toEqual(second.slice(0, HEIGHT - 1));
    expect(lines.slice(HEIGHT - 1)).toEqual([" ".repeat(width), " ".repeat(width)]);
    expect(lines.filter((line) => rowsOnlyIn(first, second).includes(line))).toEqual([]);
  });

  it("uses IN PLACE at the >= boundary — a 23-row TTY and a 23-row frame — and scrolls nothing", () => {
    const first = assembleFrame(partsFor(playTo(81), { messages: ["first"] }), "unicode");
    const second = assembleFrame(
      partsFor(playTo(300), { messages: ["second"], thinking: true }),
      "unicode",
    );
    const width = widthOf(first);
    const sink = captureSink(true, HEIGHT);
    const write = beginFrameSession(sink, HEIGHT);
    const screen = createScreen(HEIGHT, width);

    write(first);
    write(second);
    for (const chunk of sink.chunks) screen.write(chunk);

    expect((sink.chunks[1] as string).startsWith(CURSOR_HOME)).toBe(true);
    const lines = screen.lines();
    expect(lines[0]).toBe(second[0]);
    expect(lines.slice(0, HEIGHT - 1)).toEqual(second.slice(0, HEIGHT - 1));
    expect(lines.filter((line) => rowsOnlyIn(first, second).includes(line))).toEqual([]);
  });

  it("leaves the cursor at the START of the reserved prompt row, with no newline after it", () => {
    const frame = assembleFrame(partsFor(playTo(8), { messages: ["check"] }), "unicode");
    const width = widthOf(frame);
    const sink = captureSink(true, 24);
    const write = beginFrameSession(sink, HEIGHT);
    const screen = createScreen(24, width);

    write(frame);
    screen.write(captured(sink));

    expect(frame).toHaveLength(HEIGHT);
    expect(frame[HEIGHT - 1]).toBe("");
    const body = captured(sink).slice(CURSOR_HOME.length, -ERASE_TO_END_OF_SCREEN.length);
    // `ABC-027` `RF-1` — same cause as the join above; the reserved prompt row carries a LEADING
    // erase like every other row, and the cursor is still left at that row's start because an
    // erase-in-line does not move the cursor. The `H`-th erase is redundant with the erase to end of
    // screen that follows it at the same row and column, and is kept: see `ERASE_TO_END_OF_LINE`.
    expect(body).toBe(`${ERASE_TO_END_OF_LINE}${frame.join(`\n${ERASE_TO_END_OF_LINE}`)}`);
    expect(screen.cursor()).toEqual({ row: HEIGHT - 1, column: 0 });
  });

  it("writes 80 frames to a NON-TTY sink with zero escape bytes, each frame in full", () => {
    const game = playTo(20);
    const frames = Array.from({ length: 80 }, (_unused, index) =>
      assembleFrame(partsFor(game, { messages: [`message ${index}`] }), "unicode"),
    );
    const sink = captureSink(false, 0);
    const write = beginFrameSession(sink, HEIGHT);

    for (const frame of frames) write(frame);

    const text = captured(sink);
    expect(occurrences(text, "\x1b")).toBe(0);
    const lines = text.split("\n");
    expect(lines).toHaveLength(frames.length * HEIGHT + 1);
    frames.forEach((frame, index) => {
      expect(lines.slice(index * HEIGHT, (index + 1) * HEIGHT)).toEqual(frame);
    });
  });

  it("APPENDS on a 10-row TTY under a 23-row frame, emitting no cursor control at all", () => {
    const frame = assembleFrame(partsFor(playTo(8)), "unicode");
    const sink = captureSink(true, 10);
    const write = beginFrameSession(sink, HEIGHT);

    write(frame);
    write(frame);

    expect(occurrences(captured(sink), "\x1b")).toBe(0);
    expect(captured(sink)).toBe(`${frame.join("\n")}\n${frame.join("\n")}\n`);
  });

  it("keeps the strategy chosen at construction when the SINK's isTTY and rows change after it", () => {
    const frame = assembleFrame(partsFor(playTo(8)), "unicode");
    const sink = captureSink(true, 24);
    const write = beginFrameSession(sink, HEIGHT);

    sink.isTTY = false;
    sink.rows = 10;
    write(frame);
    write(frame);

    expect(sink.chunks).toHaveLength(2);
    for (const chunk of sink.chunks) {
      expect(chunk.startsWith(CURSOR_HOME)).toBe(true);
      expect(occurrences(chunk, ERASE_TO_END_OF_SCREEN)).toBe(1);
    }
  });

  it("APPENDS to a sink whose isTTY and rows are ABSENT — the real pipe shape, and the TTY that reports no size", () => {
    // Node leaves `isTTY` and `rows` UNDEFINED on a stream that is not a terminal, which is the
    // shape `EPIC-006`'s pipe-driven end-to-end test presents. No criterion constructs it: every
    // one of them names a row count. The same gap on `ABC-015` was found by QE, not by the ticket.
    const frame = assembleFrame(partsFor(playTo(8)), "unicode");
    const pipe: FrameSink & { readonly chunks: string[] } = {
      chunks: [],
      write(text: string): void {
        this.chunks.push(text);
      },
    };
    const sizeless: FrameSink & { readonly chunks: string[] } = {
      chunks: [],
      isTTY: true,
      write(text: string): void {
        this.chunks.push(text);
      },
    };
    // Room enough for the frame and no `isTTY` at all: ABSENT is not a terminal, so it appends.
    const roomy: FrameSink & { readonly chunks: string[] } = {
      chunks: [],
      rows: 24,
      write(text: string): void {
        this.chunks.push(text);
      },
    };

    beginFrameSession(pipe, HEIGHT)(frame);
    beginFrameSession(sizeless, HEIGHT)(frame);
    beginFrameSession(roomy, HEIGHT)(frame);

    expect(occurrences(pipe.chunks.join(""), "\x1b")).toBe(0);
    expect(occurrences(sizeless.chunks.join(""), "\x1b")).toBe(0);
    expect(occurrences(roomy.chunks.join(""), "\x1b")).toBe(0);
  });
});

describe("ABC-018 acceptance — the sanitizer, asserted on the EMITTED STREAM", () => {
  it("emits zero escape bytes from a message carrying \\x1b[2J, and does not change the row count", () => {
    const hostile = "\x1b[2Jgone\x1b[31m";
    const frame = assembleFrame(partsFor(playTo(8), { messages: [hostile] }), "unicode");
    const sink = captureSink(false, 0);
    const write = beginFrameSession(sink, HEIGHT);

    write(frame);

    expect(occurrences(captured(sink), "\x1b")).toBe(0);
    expect(captured(sink)).toContain("[2Jgone[31m");
    expect(frame).toHaveLength(HEIGHT);
  });

  it("emits zero code points above U+007F in ASCII mode, message text included", () => {
    const frame = assembleFrame(
      partsFor(playTo(8), { messages: ["caf\u00e9 ♞ e4", "♛"], mode: "ascii" }),
      "ascii",
    );
    const sink = captureSink(false, 0);
    const write = beginFrameSession(sink, HEIGHT);

    write(frame);

    expect(codePointsAbove(captured(sink), 0x7f)).toEqual([]);
    expect(captured(sink)).toContain("caf");
    expect(frame).toHaveLength(HEIGHT);
  });
});

// `NFR-002` — full frame compute + write < 16 ms SUMMED at 40 / 120 / 300 plies — carries NO
// assertion here on purpose. This repo has no in-repo wall-clock bars (`src/zobrist.nfr.test.ts:112`
// states the reason: such an assertion passes or fails on the machine that runs it). Both halves are
// measured out-of-tree, each with its machine and ply count, and recorded in the ticket's
// `## Implementation` section, in `plans/traceability.md` and in this task's context notes.

// ---------------------------------------------------------------------------
// Beyond the acceptance criteria — what the criteria do not reach.
// ---------------------------------------------------------------------------

describe("ABC-018 — pins the acceptance criteria do not reach", () => {
  it("leaves NO character of a longer previous frame on screen when the next frame is shorter", () => {
    const game = playTo(8);
    const wordy = assembleFrame(
      partsFor(game, { messages: ["a rejection long enough"] }),
      "unicode",
    );
    const quiet = assembleFrame(partsFor(game, { messages: [] }), "unicode");
    const width = widthOf(wordy);
    const sink = captureSink(true, 24);
    const write = beginFrameSession(sink, HEIGHT);
    const screen = createScreen(24, width);

    write(wordy);
    write(quiet);
    for (const chunk of sink.chunks) screen.write(chunk);

    // The rows a naive assembler would leave ragged are the message rows; a ragged row keeps the
    // previous frame's tail on screen, which no "is the erase sequence present" assertion can see.
    expect(screen.lines().slice(0, HEIGHT - 1)).toEqual(quiet.slice(0, HEIGHT - 1));
  });

  it("writes each frame with EXACTLY ONE write call, in both strategies", () => {
    const frame = assembleFrame(partsFor(playTo(8)), "unicode");
    const tty = captureSink(true, 24);
    const pipe = captureSink(false, 0);

    beginFrameSession(tty, HEIGHT)(frame);
    beginFrameSession(pipe, HEIGHT)(frame);

    expect(tty.chunks).toHaveLength(1);
    expect(pipe.chunks).toHaveLength(1);
  });

  it("reserves the last row and renders NOTHING into it, whatever the message region holds", () => {
    const game = playTo(8);
    for (const messages of [[], ["one"], ["one", "two", "three", "four", "five", "six", "seven"]]) {
      const frame = assembleFrame(partsFor(game, { messages }), "unicode");
      expect(frame).toHaveLength(HEIGHT);
      expect(frame.at(-1)).toBe("");
      expect(messageRegionOf(frame)).toHaveLength(MESSAGE_ROWS);
    }
  });

  it("takes W from the WIDEST region row, not from 18 and not from any terminal", () => {
    const game = playTo(8);
    const wide = "a status panel 24 wide!!";
    const frame = assembleFrame(
      partsFor(game, { messages: ["Nbd2", "Nfd2", "Rae1", "Rfe1"], status: [wide, "b", "c"] }),
      "unicode",
    );

    expect(wide).toHaveLength(24);
    expect(widthOf(frame)).toBe(24);
    for (const row of frame.slice(0, -PROMPT_ROWS)) expect(row).toHaveLength(24);
    // Four 4-character SANs need 19 characters: they do NOT fit two rows of 18 without a marker,
    // and they DO fit one row of 24. The packing follows W, so the marker is absent here.
    expect(messageRegionOf(frame).join("\n")).not.toContain("more)");
  });

  it("keeps supplied non-ASCII in UNICODE mode and still strips C0 and DEL", () => {
    const frame = assembleFrame(
      partsFor(playTo(8), { messages: ["caf\u00e9 ♞\u0007\u007f"] }),
      "unicode",
    );
    const region = messageRegionOf(frame).join("\n");

    expect(region).toContain("caf\u00e9 ♞");
    expect(region).not.toContain("\u0007");
    expect(region).not.toContain("\u007f");
  });

  it("never splits an item: one too wide for W is dropped whole and counted in N", () => {
    const frame = assembleFrame(
      partsFor(playTo(8), { messages: ["short", "a rejection far too wide for this frame"] }),
      "unicode",
    );
    const region = messageRegionOf(frame).join("\n");

    expect(region).toContain("short");
    expect(region).not.toContain("a rejection far to");
    expect(region.trimEnd().endsWith("(+1 more)")).toBe(true);
  });

  it("derives H from the panels' constant heights — no 23 anywhere in the module", () => {
    expect(frameHeight({ board: BOARD_ROWS, status: STATUS_ROWS, history: HISTORY_ROWS })).toBe(23);
    // `A13`'s REQUIREMENT clause, and it is not a weaker restatement of the `= 23` tripwire: 23 is
    // what the reference layout happens to be, `<= 24` is what epic acceptance `4b` actually needs
    // and what `beginFrameSession` switches on. A row-count change that keeps `H` at 24 breaks the
    // tripwire and NOT the requirement; one that reaches 25 breaks both, and `4b` becomes
    // unreachable because the in-place strategy would emit 25 rows into a 24-row viewport.
    expect(
      frameHeight({ board: BOARD_ROWS, status: STATUS_ROWS, history: HISTORY_ROWS }),
    ).toBeLessThanOrEqual(24);
    expect(frameHeight({ board: 9, status: 4, history: 8 })).toBe(24);
    expect(
      assembleFrame(partsFor(playTo(4), { status: ["a", "b", "c", "d"] }), "unicode"),
    ).toHaveLength(24);
  });
});

// ---------------------------------------------------------------------------
// ADDED BY QE/E2E 2026-08-09 (task `ticket-to-pr-ABC-018`, subtask `qe-abc018-review`).
//
// EACH TEST BELOW IS THE ONLY KILLER OF A MUTANT THAT SURVIVED ALL 297 DELIVERED TESTS. None of
// them found a defect in `src/frame.ts` — the module is byte-identical to the Engineer's commit
// after the whole campaign — so NO PRODUCTION CODE WAS CHANGED HERE. They close holes in the SUITE
// and, in two cases, characterize a behaviour the CRITERIA are silent about so that changing it
// later has to be deliberate.
// ---------------------------------------------------------------------------

describe("ABC-018 — holes QE found by mutation, closed in tests only", () => {
  it("SEPARATES items in the message region — the space the ticket's own arithmetic counts", () => {
    // `SEPARATOR = ""` survives every delivered test: "Nbd2Nfd2Rae1" still CONTAINS each candidate
    // and still ends with the marker, so both region criteria pass while the player is shown one
    // unreadable token. The ticket's arithmetic is what pins it: "six 4-character SANs need 29
    // characters" is 6x4 + 5 SEPARATORS, so the separator is load-bearing in the criteria's own
    // numbers and was asserted by nothing.
    const candidates = ["Nbd2", "Nfd2", "Rae1"];
    const region = messageRegionOf(
      assembleFrame(partsFor(playTo(8), { messages: candidates }), "unicode"),
    );

    expect(region[0]).toBe(`${candidates.join(" ")}    `);
    expect(candidates.join(" ")).toHaveLength(14);
  });

  it("sanitizes the PANEL rows too, not only the message items", () => {
    // The Engineer's decision 4 — "the sanitizer runs over every string placed into the frame,
    // panel rows included" — was recorded with the honest note that the narrower reading "would
    // pass every test in this suite, because the stub panels are ASCII". It did: dropping the
    // panel sanitize survived all 297. `ABC-016` and `ABC-017` are unbuilt, so the first panel
    // that carries text this product did not generate is the first place it matters.
    const frame = assembleFrame(
      partsFor(playTo(8), { status: ["\x1b[2Jstatus", "caf\u00e9 \u0007", "c"], mode: "ascii" }),
      "ascii",
    );
    const sink = captureSink(false, 0);
    beginFrameSession(sink, HEIGHT)(frame);

    expect(occurrences(captured(sink), "\x1b")).toBe(0);
    expect(codePointsAbove(captured(sink), 0x7f)).toEqual([]);
    expect(captured(sink)).toContain("[2Jstatus");
    expect(frame).toHaveLength(HEIGHT);
  });

  it("still emits (+N more) when NOT ONE supplied item fits — the marker is present exactly when N > 0", () => {
    // The `shown === 0` fall-through. Every delivered case leaves at least one item showing, so a
    // build that dropped the marker on that path survived: the region went silently blank and the
    // player was never told anything had been withheld. The ticket's `## Scope` is explicit — "the
    // marker is present exactly when `N > 0`".
    const frame = assembleFrame(
      partsFor(playTo(8), { messages: ["a rejection far too wide for this frame"] }),
      "unicode",
    );
    const region = messageRegionOf(frame);

    expect(region[0]).toBe("".padEnd(widthOf(frame)));
    expect((region[1] as string).trimEnd()).toBe("(+1 more)");
    expect(frame).toHaveLength(HEIGHT);
  });

  it("strips the WHOLE C0 range, not just the escapes the criteria happen to name", () => {
    // The two criteria that exercise the sanitizer supply `\x1b` and `\u0007` / `\u007f`. A
    // that let `U+0000` through passed both. The ticket's measurable bar is a RANGE — "C0 control
    // characters (< U+0020) and U+007F removed" — so the range is what gets asserted.
    const c0 = Array.from({ length: 0x20 }, (_unused, code) => String.fromCodePoint(code)).join("");
    const frame = assembleFrame(partsFor(playTo(8), { messages: [`a${c0}\u007fb`] }), "unicode");
    const sink = captureSink(false, 0);
    beginFrameSession(sink, HEIGHT)(frame);
    const text = captured(sink);

    // The only sub-`U+0020` code point left in the stream is the newline the WRITER emits itself.
    expect([...text].filter((character) => character < " " && character !== "\n")).toEqual([]);
    expect(text).not.toContain("\u007f");
    expect(messageRegionOf(frame)[0]).toBe("ab".padEnd(widthOf(frame)));
  });

  it("APPENDS to a TTY exactly ONE row short of the frame — the other side of the >= boundary", () => {
    // BA/PM's defect-3 correction added the 23/23 case and killed `>` where the rule says `>=`.
    // The EXCLUSIVE side was left open: the only "too short" case in the criteria is 10 rows
    // against 23, thirteen rows short, which a `>= H - 1` slip clears easily. That slip survived
    // all 297 delivered tests, and it is the exact failure `4b` exists to prevent — a 22-row TTY
    // scrolls the frame origin off the top on the first redraw and every later one lands high.
    const frame = assembleFrame(partsFor(playTo(8), { messages: ["check"] }), "unicode");
    const sink = captureSink(true, HEIGHT - 1);
    const write = beginFrameSession(sink, HEIGHT);

    write(frame);
    write(frame);

    expect(occurrences(captured(sink), "\x1b")).toBe(0);
    expect(captured(sink)).toBe(`${frame.join("\n")}\n${frame.join("\n")}\n`);
  });

  it("DISCHARGED by ABC-027: W is still recomputed per frame, and the narrowing frame leaves NO tail", () => {
    // THE TRIPWIRE FIRED, AND THIS IS THE DAY. Until `ABC-027` this test was titled "CHARACTERIZES:
    // `W` is recomputed per frame, so a narrowing frame leaves the wider one's tail" and it ASSERTED
    // THE STALE TAIL WAS PRESENT — deliberately, as a pin that "fails loudly the day someone changes
    // it", with the decision routed to "BA/PM + `ABC-016`/`ABC-017`". That decision arrived:
    // `ADR-0010` ruled the CONSUMER owns frame-width stability (clause 1) and `ABC-027`'s `A6`
    // discharges this test. It is REPLACED, NEVER DELETED — it is the only place in the merged suite
    // that constructs a narrowing, and the property it was pinning is now asserted from the correct
    // side by `A2` below.
    //
    // What did NOT change: `W` is still a per-frame max over the delivered rows (`src/frame.ts:179`,
    // untouched — `ADR-0010` clause 2), so the two width assertions below still hold and `W` is still
    // ALLOWED to vary. What changed is the writer: it now erases each row to the end of the line as
    // it writes it, so nothing of the wider frame survives to the right of the narrower one.
    const game = playTo(8);
    const wide = assembleFrame(
      partsFor(game, { status: ["a status panel 24 wide!!", "b", "c"] }),
      "unicode",
    );
    const narrow = assembleFrame(partsFor(game, { status: ["a", "b", "c"] }), "unicode");
    const sink = captureSink(true, 24);
    const write = beginFrameSession(sink, HEIGHT);
    const screen = createScreen(24, widthOf(wide));

    expect(widthOf(wide)).toBe(24);
    expect(widthOf(narrow)).toBe(18);

    write(wide);
    write(narrow);
    for (const chunk of sink.chunks) screen.write(chunk);

    const stale = screen
      .lines()
      .slice(0, HEIGHT - 1)
      .filter((line, index) => line !== (narrow[index] as string).padEnd(widthOf(wide)));
    // Was `[the narrow frame's row followed by the wide frame's columns beyond W = 18]`. The wide
    // frame's first status row was the only one whose tail was not blank, so it was the only one
    // that showed. Nothing shows now.
    expect(stale).toEqual([]);
  });

  it("CHARACTERIZES: unicode mode keeps the C1 block, which the measurable bar does not name", () => {
    // The bar is "C0 (< U+0020) and U+007F", and the module matches it exactly. `U+009B` is CSI in
    // its 8-bit form; a UTF-8 terminal does not honour it, which is why keeping it is defensible —
    // but the criteria are SILENT, so a build that stripped the whole C1 block was indistinguishable
    // from this one. Recorded here and routed to the Security/NFR gate rather than decided by QE.
    const frame = assembleFrame(partsFor(playTo(8), { messages: ["a\u0080\u009bb"] }), "unicode");
    const ascii = assembleFrame(
      partsFor(playTo(8), { messages: ["a\u0080\u009bb"], mode: "ascii" }),
      "ascii",
    );

    expect(messageRegionOf(frame)[0]).toBe("a\u0080\u009bb".padEnd(widthOf(frame)));
    expect(messageRegionOf(ascii)[0]).toBe("ab".padEnd(widthOf(ascii)));
  });
});

// ---------------------------------------------------------------------------
// ADDED BY `ABC-027` 2026-08-11 (task `ticket-to-pr-ABC-027-dev`), carrying accepted `ADR-0010`
// clause 1: the CONSUMER owns frame-width stability, so the in-place writer clears each row as it
// writes it. `ABC-018` merged 2026-08-09 and is CLOSED; this section edits its test file under a
// ticket of its own rather than in a diff nobody signed for.
//
// THE FORM OF `A2` IS A JUDGEMENT WITH THREE MEASURED WRONG ANSWERS, all recorded so no future hop
// reaches for one:
//   - `F1` (epic `4b` / `rowsOnlyIn` at `:381`+): BLIND at any real terminal width, and it
//     FALSE-POSITIVES on the CORRECT build at the artificial width `W`(frame 1), because it compares
//     rows padded to two different widths. Not reused here, in either direction.
//   - `F2` (untrimmed screen == frame, the `:379`+ form): false-positives on a STEADY pair at 80 and
//     120 columns on a correct build. `A4` is the control that keeps it out.
//   - `F4` (every frame's `W` == the session `W`): FAILS the correct build. `W` varies BY DESIGN
//     under `ADR-0010` clause 1 \u2014 measured {37, 18, 39, 18} over these four frames \u2014 which is why
//     `ABC-027` carries an explicit PROHIBITION on any constant-frame-width criterion here or
//     downstream (`ADR-0010` clauses 5 and 7). None is added.
// `F3` \u2014 screen == frame, TRIMMED, at a real width \u2014 is the only sound form, and `A2` is `F3`.
// ---------------------------------------------------------------------------

/**
 * `ABC-027`'s narrowing fixture: a draw claim offered, then expiring, then a check announcement,
 * then quiet. Only the status stub's THIRD row moves \u2014 every panel keeps its reference row count, so
 * `H` stays 23 and nothing here collides with `ABC-017`'s `A13` or `ADR-0009` clause 9c. `W` is
 * 37, 18, 39, 18: two narrowings and one widening.
 */
const NARROWING_STATUS_ROW = [
  "White may claim: threefold repetition",
  "",
  "check: YES \u2014 White to move out of check",
  "",
] as const;

const narrowingFrames = (): string[][] => {
  const game = playTo(8);
  return NARROWING_STATUS_ROW.map((third) =>
    assembleFrame(partsFor(game, { status: ["White to move", "check: no", third] }), "unicode"),
  );
};

const trimmedRows = (rows: readonly string[]): string[] => rows.map((row) => row.trimEnd());

/**
 * `A2`'s comparison, and the same one `A4` reuses so the false-positive control is checked by the
 * identical form: write every frame through ONE session onto ONE modelled screen and, after EVERY
 * redraw, assert each screen row equals its frame row with trailing spaces trimmed on both sides.
 */
function screenEqualsFrameAfterEveryRedraw(
  frames: readonly (readonly string[])[],
  columns: number,
): void {
  const sink = captureSink(true, 24);
  const write = beginFrameSession(sink, HEIGHT);
  const screen = createScreen(24, columns);

  frames.forEach((frame, index) => {
    write(frame);
    screen.write(sink.chunks[index] as string);
    expect(trimmedRows(screen.lines().slice(0, HEIGHT - 1))).toEqual(
      trimmedRows(frame.slice(0, HEIGHT - 1)),
    );
  });
}

describe("ABC-027 acceptance \u2014 the in-place writer clears each row as it writes it", () => {
  it("A1 \u2014 the emitted redraw byte for byte, and EVERY erase fires at COLUMN 0: home, an erase-in-line, the rows joined by newline + erase-in-line, ONE erase to end of screen", () => {
    const frame = assembleFrame(partsFor(playTo(8), { messages: ["check"] }), "unicode");
    const sink = captureSink(true, 24);

    beginFrameSession(sink, HEIGHT)(frame);

    expect(frame).toHaveLength(HEIGHT);
    expect(sink.chunks).toHaveLength(1);
    const redraw = sink.chunks[0] as string;

    // The UN-cleared emission \u2014 the merged writer's, constructed here so `ADR-0010`'s cost claim is
    // falsifiable rather than quoted. Measured on this fixture: 425 characters becomes 494.
    const uncleared = `${CURSOR_HOME}${frame.join("\n")}${ERASE_TO_END_OF_SCREEN}`;

    expect(redraw).toBe(
      `${CURSOR_HOME}${ERASE_TO_END_OF_LINE}${frame.join(`\n${ERASE_TO_END_OF_LINE}`)}${ERASE_TO_END_OF_SCREEN}`,
    );
    // Every count derived from `H`, never hardcoded \u2014 the merged file's own rule. One erase per row,
    // `H` of them, all LEADING: the reserved prompt row's is redundant with the erase to end of
    // screen and is kept anyway, because `H` is the invariant a reader can restate without an
    // off-by-one and `H - 1` is the asymmetry that put the erase at the margin in the first place.
    expect(occurrences(redraw, ERASE_TO_END_OF_LINE)).toBe(HEIGHT);
    expect(occurrences(redraw, ERASE_TO_END_OF_SCREEN)).toBe(1);
    expect(occurrences(redraw, "\x1b")).toBe(HEIGHT + 2);
    expect(redraw.length - uncleared.length).toBe(HEIGHT * ERASE_TO_END_OF_LINE.length);

    // EVERY ERASE FIRES AT COLUMN 0 \u2014 the clause this project's first gate FAIL bought, and DO NOT
    // read it as a restatement of the `toBe` above. An erase fires where the cursor IS. At the right
    // margin the cursor sits on the LAST CELL with the wrap pending, so `\x1b[K` destroys that cell:
    // measured by Security/NFR on GNU screen 5.0.2 at a window exactly `W` wide, where the
    // erase-after-each-row shape lost the board's whole h-file and its file label on EVERY frame.
    //
    // THE COUNTS ABOVE CANNOT TELL SAFE FROM UNSAFE. QE's mutant `M2` \u2014 `rows.map(row => row + EL)`
    // joined by bare newlines, `H` erases every one of them AT the margin \u2014 matches all four of them
    // EXACTLY: `\x1b[K` = `H`, `\x1b[0J` = 1, `\x1b` = `H + 2`, delta = `H * 3`. Under the old
    // `H - 1` counts the count alone killed it; under these it does not. These two assertions are
    // what kill it now, and they are the only assertions in `A1` that name WHY the order is what it
    // is. A hop that "simplifies" them away removes the criterion's entire defence against the
    // regression this ticket exists to remove.
    expect(redraw.startsWith(`${CURSOR_HOME}${ERASE_TO_END_OF_LINE}`)).toBe(true);
    expect(redraw).not.toContain(`${ERASE_TO_END_OF_LINE}\n`);
  });

  it("A2 \u2014 after EVERY redraw of a NARROWING sequence the screen equals the frame, at 80 AND 120 columns", () => {
    const frames = narrowingFrames();
    const widths = frames.map(widthOf);

    // FIRST, the fixture must actually NARROW. `ADR-0010` measured the merged file's entire fixture
    // space at `W` in {18}, so a fixture that quietly stops moving turns this criterion green
    // forever \u2014 the degenerate mutant this assertion exists to reject.
    expect(frames).toHaveLength(4);
    expect(new Set(widths).size).toBeGreaterThanOrEqual(2);
    expect(widths.some((width, index) => index > 0 && width < (widths[index - 1] as number))).toBe(
      true,
    );
    for (const frame of frames) expect(frame).toHaveLength(HEIGHT);

    for (const columns of [80, 120]) {
      // At a screen width equal to `W`(frame 1) the whole comparison degenerates into a fixture
      // artifact, so both widths are asserted to EXCEED the widest frame \u2014 they are real terminals.
      expect(columns).toBeGreaterThan(Math.max(...widths));
      screenEqualsFrameAfterEveryRedraw(frames, columns);
    }
  });

  it("A3 \u2014 the FIXTURE is proved able to catch the defect: the un-cleared emission leaves the wider frame's tail", () => {
    // A check on the check. `A3` passes on both writers BY CONSTRUCTION \u2014 it exercises the fixture,
    // not the writer \u2014 and fails the day the fixture stops being able to expose the defect, which is
    // the only way `A2` can rot. This project has recorded a bar that cannot fail on the regression
    // it exists to catch six times, most recently in `ADR-0010`'s own cost table.
    const frames = narrowingFrames();
    const screen = createScreen(24, 80);
    let narrowings = 0;

    frames.forEach((frame, index) => {
      // The merged emission, constructed HERE: home, a BARE newline join, one erase to end of screen.
      screen.write(`${CURSOR_HOME}${frame.join("\n")}${ERASE_TO_END_OF_SCREEN}`);

      const previous = frames[index - 1];
      if (previous === undefined || widthOf(previous) <= widthOf(frame)) return;
      narrowings++;

      const differing = trimmedRows(screen.lines().slice(0, HEIGHT - 1)).filter(
        (line, row) => line !== (frame[row] as string).trimEnd(),
      );
      expect(differing.length).toBeGreaterThan(0);

      // The tail is the previous frame's columns beyond the narrower frame's `W` \u2014 `hreefold
      // repetition`, then ` to move out of check`.
      const tails = previous
        .map((row) => row.slice(widthOf(frame)).trimEnd())
        .filter((fragment) => fragment !== "");
      expect(tails.length).toBeGreaterThan(0);
      for (const tail of tails) {
        expect(differing.some((line) => line.includes(tail))).toBe(true);
        expect(frame.join("\n")).not.toContain(tail);
      }
    });

    expect(narrowings).toBe(2);
  });

  it("A4 \u2014 a STEADY pair is NOT flagged: the false-positive control at 80 and 120 columns", () => {
    const game = playTo(8);
    const first = assembleFrame(partsFor(game, { messages: ["first"] }), "unicode");
    const second = assembleFrame(
      partsFor(game, { messages: ["second"], thinking: true }),
      "unicode",
    );

    expect(widthOf(first)).toBe(widthOf(second));
    // UNtrimmed (`F2`) this pair fails on the CORRECT build at both widths, because the screen's rows
    // are padded to the SCREEN's width and the frame's to `W`. This is what stops a future hop
    // reaching for that form.
    for (const columns of [80, 120]) {
      screenEqualsFrameAfterEveryRedraw([first, second], columns);
    }
  });

  it("A5 \u2014 both APPEND strategies and every frame VALUE are untouched: zero escape bytes in either", () => {
    const frame = assembleFrame(partsFor(playTo(8), { messages: ["check"] }), "unicode");
    const pipe = captureSink(false, 0);
    const short = captureSink(true, HEIGHT - 1);

    beginFrameSession(pipe, HEIGHT)(frame);
    beginFrameSession(short, HEIGHT)(frame);

    for (const sink of [pipe, short]) {
      expect(captured(sink)).toBe(`${frame.join("\n")}\n`);
      expect(occurrences(captured(sink), "\x1b")).toBe(0);
    }

    // The VALUE half. The clearing lives in the WRITER and never in `assembleFrame` \u2014 `ADR-0010`
    // clause 2 leaves `W` a per-frame max at `src/frame.ts:179` and its `## Rollback` states every
    // frame value is byte-identical with or without clause 1 \u2014 so no frame carries an escape byte
    // and every row but the reserved prompt row is still exactly `W` wide.
    for (const value of [frame, ...narrowingFrames()]) {
      expect(occurrences(value.join("\n"), "\x1b")).toBe(0);
      expect(value).toHaveLength(HEIGHT);
      expect(value.at(-1)).toBe("");
      for (const row of value.slice(0, -PROMPT_ROWS)) expect(row).toHaveLength(widthOf(value));
    }
  });

  it("A7 — the screen model's RIGHT MARGIN is measured, not assumed: an erase at the margin ERASES the last cell, and the deferred wrap survives it", () => {
    // A CRITERION ON THE TEST DOUBLE, and the one whose absence let a real regression pass six
    // criteria, a 14-mutant campaign with zero survivors and 681 green tests. The model let `column`
    // run to `columnCount` and made the erase a NO-OP there, so it certified a writer that a real
    // terminal punishes.
    //
    // THE ASSERTED BEHAVIOUR IS NOT A READING OF ECMA-48. It is the Security/NFR gate's MEASUREMENT,
    // on GNU screen 5.0.2 driven attached to a pty whose winsize it set with `TIOCSWINSZ` and read
    // back with screen's own `hardcopy`, at a 10-column window. The two controls below ARE that
    // gate's two controls, and they are what make the erased cell attributable to the escape and to
    // nothing else: each control differs from the test by exactly the three bytes of `\x1b[K`, or by
    // exactly one character of content.
    //
    // Every number derives from the screen's own `C`. `H` and `W` do not appear, no frame is
    // assembled, and nothing here asserts any width is constant — see the ticket's `## Out of scope`
    // PROHIBITION, which this criterion was checked against rather than assumed clear of.
    const COLUMNS = 10;
    const full = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".slice(0, COLUMNS);
    const short = full.slice(0, COLUMNS - 1);

    // CONTROL A — exactly `C` characters, NO erase: all `C` cells survive. (`ABCDEFGHIJ`.)
    const intact = createScreen(2, COLUMNS);
    intact.write(full);
    expect(intact.lines()[0]).toBe(full);

    // CONTROL B — `C - 1` characters then the erase: below the margin, the erase harms nothing.
    const belowMargin = createScreen(2, COLUMNS);
    belowMargin.write(`${short}${ERASE_TO_END_OF_LINE}`);
    expect(belowMargin.lines()[0]).toBe(`${short} `);

    // THE TEST — exactly `C` characters then the erase: the cell at `C - 1` is ERASED.
    const atMargin = createScreen(2, COLUMNS);
    atMargin.write(`${full}${ERASE_TO_END_OF_LINE}`);
    expect(atMargin.lines()[0]).toBe(`${short} `);

    // ...and the DEFERRED WRAP SURVIVED the erase: the next printable character lands at column 0 of
    // the NEXT row, not back in the row that was just erased. The gate's fourth payload.
    atMargin.write("x");
    expect(atMargin.lines()[1]).toBe("x".padEnd(COLUMNS));
    expect(atMargin.cursor()).toEqual({ row: 1, column: 1 });
  });
});
