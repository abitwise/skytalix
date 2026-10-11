/**
 * The opening-book probe (`ABC-094`): position in, a book move or nothing out. No engine, no
 * search, no time budget — `ABC-095` wires it into a turn.
 *
 * The artifact is `ABC-093`'s `data/opening-book/book.json`, in `ADR-0037` D1's format: entries
 * keyed by 16 lowercase hex digits of `zobristKey(position)`, each with `m`, a list of
 * `[uci, positive integer weight]` pairs. "In book" means `m` is non-empty.
 *
 * This module holds no capability (`ADR-0036` clause (b)). Everything with a side effect is
 * injected and bound once at the composition root:
 * - `read` returns the artifact's bytes. It is called at most once, on the first probe, never at
 *   construction (`N-LOAD`: construction performs 0 filesystem operations).
 * - `warn` receives the one warning line, with no trailing newline. The root binds it to stderr;
 *   stdout is the board (`ABC-042`).
 * - `random` returns values in [0, 1) (`ADR-0037` D2). Tests pass `seededRandom(seed)` from
 *   `src/levels.ts`; a session passes `Math.random` (D3). This module imports no generator.
 *
 * Hostile input (the first file this program parses that no human typed): anything wrong with the
 * file — unreadable, over `NFR-006`'s 1 MB, not UTF-8, not JSON, not the schema, or a move that is
 * not legal in its keyed position — switches the book off for the life of the probe, warns exactly
 * once, and every call returns nothing. Nothing throws. The file is only ever `JSON.parse`d, and the
 * warning carries no byte of it.
 */

import { legalMoves } from "./legal.ts";
import type { Move } from "./moves.ts";
import { type Position, squareName } from "./position.ts";
import { zobristKey } from "./zobrist.ts";

/** `NFR-006`'s bar on the artifact. A larger file is refused unparsed. */
export const BOOK_MAX_BYTES = 1_048_576;

export interface BookProbeOptions {
  /** Returns the artifact's bytes; may throw (missing, unreadable). Called at most once. */
  readonly read: () => Uint8Array;
  /** Receives the single warning, without a trailing newline. */
  readonly warn: (message: string) => void;
  /** Values in [0, 1). */
  readonly random: () => number;
}

export interface BookProbe {
  /** True when the book holds at least one move for this position. */
  inBook(position: Position): boolean;
  /** A weighted book move for this position, legal in it, or `undefined` when out of book. */
  bookMove(position: Position): Move | undefined;
}

type BookLine = readonly [uci: string, weight: number];

const KEY = /^[0-9a-f]{16}$/;
const UCI = /^[a-h][1-8][a-h][1-8][nbrq]?$/;
/** Indexed by piece type: KNIGHT 2, BISHOP 3, ROOK 4, QUEEN 5 (as `tools/opening-book/compile.ts`). */
const PROMOTION_LETTER = ["", "", "n", "b", "r", "q"];

/** Thrown inside this module only, with fixed text; caught by the probe and turned into the warning. */
class BookRefused extends Error {}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isBookLine = (pair: unknown): pair is BookLine =>
  Array.isArray(pair) &&
  pair.length === 2 &&
  typeof pair[0] === "string" &&
  UCI.test(pair[0]) &&
  Number.isSafeInteger(pair[1]) &&
  (pair[1] as number) >= 1;

const uciOf = (move: Move): string =>
  `${squareName(move.from)}${squareName(move.to)}${PROMOTION_LETTER[move.promotion] ?? ""}`;

/** Validates the whole file up front; returns only the in-book entries. */
function parseBook(bytes: Uint8Array): Map<string, readonly BookLine[]> {
  if (bytes.length > BOOK_MAX_BYTES)
    throw new BookRefused(`is larger than ${BOOK_MAX_BYTES} bytes`);
  let root: unknown;
  try {
    root = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
  } catch {
    throw new BookRefused("is not valid UTF-8 JSON");
  }
  if (!isRecord(root) || root.format !== 1 || !isRecord(root.positions)) {
    throw new BookRefused("is not a format-1 book");
  }
  const entries = new Map<string, readonly BookLine[]>();
  for (const [key, entry] of Object.entries(root.positions)) {
    if (
      !KEY.test(key) ||
      !isRecord(entry) ||
      !Array.isArray(entry.m) ||
      !entry.m.every(isBookLine)
    ) {
      throw new BookRefused("has an entry that does not match the format");
    }
    const lines = entry.m as BookLine[];
    if (!Number.isSafeInteger(lines.reduce((sum, [, weight]) => sum + weight, 0))) {
      throw new BookRefused("has an entry whose weights overflow");
    }
    if (lines.length > 0) entries.set(key, lines);
  }
  return entries;
}

export function createBookProbe({ read, warn, random }: BookProbeOptions): BookProbe {
  /** `undefined` until the first probe; `null` once the book is switched off. */
  let book: Map<string, readonly BookLine[]> | null | undefined;

  const switchOff = (reason: string): void => {
    book = null;
    warn(`opening book ${reason}; playing on without it`);
  };

  /** The entry's moves, each re-validated against `legalMoves`, with their weights. */
  const bookMoves = (position: Position): { move: Move; weight: number }[] => {
    if (book === undefined) {
      try {
        book = parseBook(read());
      } catch (error) {
        switchOff(error instanceof BookRefused ? error.message : "could not be read");
      }
    }
    if (!book) return [];
    const lines = book.get(zobristKey(position).toString(16).padStart(16, "0"));
    if (lines === undefined) return [];

    const legal = legalMoves(position);
    const moves: { move: Move; weight: number }[] = [];
    for (const [uci, weight] of lines) {
      const move = legal.find((candidate) => uciOf(candidate) === uci);
      if (move === undefined) {
        switchOff("holds a move that is illegal in its position");
        return [];
      }
      moves.push({ move, weight });
    }
    return moves;
  };

  return {
    inBook: (position) => bookMoves(position).length > 0,
    bookMove(position) {
      const moves = bookMoves(position);
      const total = moves.reduce((sum, { weight }) => sum + weight, 0);
      let draw = Math.floor(random() * total);
      for (const { move, weight } of moves) {
        if (draw < weight) return move;
        draw -= weight;
      }
      return undefined;
    },
  };
}
