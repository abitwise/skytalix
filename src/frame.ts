/**
 * ABC-018 — the frame a player actually sees: one assembler that composes the regions into a
 * constant-height value, and one writer that emits it, choosing its strategy exactly once.
 *
 * THIS MODULE IS TWO THINGS AND THE SPLIT IS DELIBERATE, the same split `ABC-015` draws between its
 * rule and its session:
 *
 *   - `assembleFrame(parts, mode)` is the VALUE. It takes the three panels' rows, the message
 *     region's items and the glyph mode, and returns one frame of constant height. It writes
 *     nothing, reads nothing ambient, and can be asserted without a terminal — which is what epic
 *     acceptance `4c` and `EPIC-006`'s pipe-driven end-to-end test stand on.
 *   - `beginFrameSession(sink, height)` is the SESSION. It reads the sink's two signals ONCE, picks
 *     the strategy, and closes over it. The strategy is chosen at startup and never re-chosen, which
 *     is only well defined because the frame's height `H` is a session constant known before the
 *     first frame.
 *
 * THE GLYPH MODE IS AN ARGUMENT AND NOTHING ELSE — `RISK-005`'s build obligation, spelled out in the
 * ticket's `## Dependencies`. This is the first thing in `EPIC-002` a player can see, so it is the
 * first place the fallback could be retrofitted rather than built in. The mode is a REQUIRED
 * parameter with no default; this module never hardcodes a mode, never re-derives one from
 * `process.env` or `process.stdout`, and imports nothing from `glyph-mode.ts` — `ABC-015` owns the
 * rule and runs it once at startup, and its answer arrives here the same way it arrives at
 * `renderBoard`.
 *
 * THE TERMINAL'S WIDTH IS NEVER READ. `process.stdout.columns` does not exist in append mode — the
 * mode `EPIC-006`'s end-to-end test runs in — and the frame is a session constant by the epic's
 * SIGWINCH ruling. The frame has ONE width `W`: the widest row the assembled regions emit. Every row
 * except the reserved prompt row is padded to exactly `W`, so each row overwrites its predecessor in
 * full — but `W` is a per-frame MAX over the delivered rows (`assembleFrame` below), so it SHRINKS
 * whenever the widest row does, and padding alone then leaves the previous frame's columns to the
 * right of the narrowed row. `ADR-0010` clause 1: the in-place redraw emits a per-row erase, and THAT
 * is what makes it leave no character of the previous frame behind.
 *
 * Widths are counted in UTF-16 units (`String.length`), which equals the code-point count for
 * everything this frame can carry: ASCII mode strips every code point above `U+007F`, and the
 * Unicode glyph table is `U+2654`-`U+265F`. A terminal's DISPLAY columns are a third quantity (a
 * wide CJK glyph occupies two) and nothing in this epic supplies one.
 */

import type { GlyphMode } from "./render.ts";

/** The message region is a fixed 2 rows: content longer than it is truncated, never grown into. */
export const MESSAGE_ROWS = 2;

/**
 * The reserved prompt row: the frame's last row, inside `H`, rendered by NOBODY. `EPIC-003` types
 * into it, which is why the in-place write leaves the cursor at its start with no newline after it —
 * without the row, "the TTY reports at least as many rows as the frame" is short by exactly the row
 * the player types into and the first keystroke scrolls the frame origin off the top.
 */
export const PROMPT_ROWS = 1;

/** One space between two items in the message region — the separator the ticket's arithmetic counts. */
const SEPARATOR = " ";

/** CSI H — cursor to row 1, column 1. */
const CURSOR_HOME = "\x1b[H";

/**
 * CSI 0 J — erase from the cursor to the end of the screen, in ONE operation. Not
 * cursor-up-by-counted-lines: a counted redraw is correct only while consecutive frames have equal
 * height, and it is the exact mechanism that produces the stale rows `4b` exists to prevent.
 */
const ERASE_TO_END_OF_SCREEN = "\x1b[0J";

/**
 * CSI K — erase from the cursor to the end of the LINE, cursor unmoved. `ADR-0010` clause 1: `W` is a
 * per-frame max, so a narrowing frame's rows are shorter than the ones they overwrite, and
 * `ERASE_TO_END_OF_SCREEN` erases downward from the end of the frame and NEVER rightward. Emitted
 * once per row join — `H - 1` of them, +3 characters each. A trailing one on the last row is
 * redundant: the erase to end of screen already clears the rest of the cursor's row.
 */
const ERASE_TO_END_OF_LINE = "\x1b[K";

/** The regions a frame is composed of. The panels arrive as rows; this module renders none of them. */
export interface FrameParts {
  /** `ABC-014`'s board — `renderBoard`'s rows. */
  readonly board: readonly string[];
  /** `ABC-016`'s status panel. */
  readonly status: readonly string[];
  /** `ABC-017`'s bounded move-history pane. */
  readonly history: readonly string[];
  /**
   * The message region's items — rejection lines, ambiguity candidates. A LIST, never one blob with
   * newlines in it: a newline is a C0 character and the sanitizer below removes it. Each item is
   * placed whole or not at all.
   */
  readonly messages: readonly string[];
}

/**
 * The frame's constant height: the panels' constant heights plus the 3 rows this ticket owns. `H` is
 * NEVER hardcoded — the 23 of the epic's reference layout is `9 + 3 + 8` through this function, and
 * it is what a session needs before its first frame to choose a strategy once.
 */
export function frameHeight(panelRows: {
  readonly board: number;
  readonly status: number;
  readonly history: number;
}): number {
  return panelRows.board + panelRows.status + panelRows.history + MESSAGE_ROWS + PROMPT_ROWS;
}

/**
 * Drop what must not reach a terminal. C0 controls and `U+007F` always — a player who types an ANSI
 * escape would otherwise get it written to their own terminal, where it can move the cursor, clear
 * the screen, or corrupt every subsequent in-place redraw. In ASCII glyph mode, everything above
 * `U+007F` as well, because epic acceptance `2a` asserts zero of those over the WHOLE emitted stream
 * and the message region is the one part of that stream carrying text this product did not generate.
 * In Unicode mode they survive: a UTF-8 terminal can draw them, and ASCII mode exists for the one
 * that cannot.
 */
function sanitize(text: string, mode: GlyphMode): string {
  let kept = "";
  for (const character of text) {
    const code = character.codePointAt(0) as number;
    if (code < 0x20 || code === 0x7f) continue;
    if (mode === "ascii" && code > 0x7f) continue;
    kept += character;
  }
  return kept;
}

const markerFor = (hidden: number): string => `(+${hidden} more)`;

const withMarker = (rows: string[], hidden: number): string[] => {
  if (hidden === 0) return rows;
  const last = rows.length - 1;
  const current = rows[last] as string;
  rows[last] = current === "" ? markerFor(hidden) : `${current}${SEPARATOR}${markerFor(hidden)}`;
  return rows;
};

/**
 * Place `items` into the region's rows, reserving room on the last row for the `(+N more)` marker
 * that `hidden` implies. Returns `null` when an item does not fit — an item is placed whole or not
 * at all, so "does not fit" is the caller's signal to show one item fewer.
 */
function packRegion(items: readonly string[], hidden: number, width: number): string[] | null {
  const rows = new Array<string>(MESSAGE_ROWS).fill("");
  const reserved = hidden === 0 ? 0 : markerFor(hidden).length + SEPARATOR.length;
  let row = 0;

  for (const item of items) {
    let placed = false;
    while (!placed) {
      if (row >= MESSAGE_ROWS) return null;
      const current = rows[row] as string;
      const capacity = width - (row === MESSAGE_ROWS - 1 ? reserved : 0);
      const candidate = current === "" ? item : `${current}${SEPARATOR}${item}`;
      if (candidate.length <= capacity) {
        rows[row] = candidate;
        placed = true;
      } else if (current === "") {
        return null; // an empty row cannot hold it, so no row can
      } else {
        row++;
      }
    }
  }
  return withMarker(rows, hidden);
}

/**
 * The message region: `MESSAGE_ROWS` rows, whatever it is given.
 *
 * WHICH items fit is this module's packing and the ticket leaves it here. `N` is NOT: it is the
 * count of supplied items the region does not show in full, so an implementation that packs
 * differently still agrees on `N`. The search runs downward because the two are coupled — dropping
 * an item raises `N`, which can lengthen the marker, which can drop another item.
 */
function layoutMessageRegion(items: readonly string[], width: number): string[] {
  for (let shown = items.length; shown > 0; shown--) {
    const rows = packRegion(items.slice(0, shown), items.length - shown, width);
    if (rows !== null) return rows;
  }
  return withMarker(new Array<string>(MESSAGE_ROWS).fill(""), items.length);
}

/**
 * One frame of `frameHeight(...)` rows: board, status, history, the 2-row message region, and the
 * reserved prompt row last. Every row but the prompt row is exactly `W` wide.
 */
export function assembleFrame(parts: FrameParts, mode: GlyphMode): string[] {
  const panels = [...parts.board, ...parts.status, ...parts.history].map((row) =>
    sanitize(row, mode),
  );
  // `W` cannot be taken over the message rows too: a long rejection would then widen the frame,
  // which is the one way content can break `4a`'s constant geometry. The panels set `W`; the
  // message region is bounded BY it.
  const width = panels.reduce((widest, row) => Math.max(widest, row.length), 0);
  const messages = parts.messages.map((item) => sanitize(item, mode));

  const rows = [...panels, ...layoutMessageRegion(messages, width)].map((row) => row.padEnd(width));
  rows.push(""); // PROMPT_ROWS — reserved, and deliberately NOT padded: see `beginFrameSession`.
  return rows;
}

/** Where a frame is written. `process.stdout` satisfies it; this module never reaches for it. */
export interface FrameSink {
  write(text: string): void;
  isTTY?: boolean;
  rows?: number;
}

export type FrameWriter = (frame: readonly string[]) => void;

/**
 * Begin the session: read the sink's two signals ONCE, choose the strategy, and hold it.
 *
 * In place when the sink is a TTY AND reports at least as many rows as the frame — `>=`, the epic's
 * own rule, so a TTY of exactly `H` rows redraws in place. The frame's last row is the reserved
 * prompt row and is written with NO newline after it, so the cursor is left at that row's start and
 * nothing scrolls at exactly that size; the erase then clears the rest of that row (which is where
 * `EPIC-003`'s echo of the previous input sits) and everything below it.
 *
 * Append otherwise — not a TTY, or a TTY too short for the frame, where in-place redraw is undefined
 * and so is not attempted. Zero cursor control, one newline after the frame.
 *
 * Both strategies emit each frame in exactly ONE write: `NFR-007` puts the first frame inside the
 * `npx`-to-first-board window and nothing here may block on I/O beyond that single write.
 */
export function beginFrameSession(sink: FrameSink, height: number): FrameWriter {
  const inPlace = Boolean(sink.isTTY) && (sink.rows ?? 0) >= height;

  if (inPlace) {
    return (frame) => {
      sink.write(
        `${CURSOR_HOME}${frame.join(`${ERASE_TO_END_OF_LINE}\n`)}${ERASE_TO_END_OF_SCREEN}`,
      );
    };
  }
  return (frame) => {
    sink.write(`${frame.join("\n")}\n`);
  };
}
