/**
 * `ABC-095` — the book in front of the engine's move choice (`src/book-engine.ts`). The ticket's one
 * test file: `A1`, `A3`, `A4`, `A5`'s game half and `A6`. `A2` and the miss-path cost are wall-clock
 * readings and live in the notes, never here (test note 5).
 *
 * THE SEARCH IS COUNTED, NEVER TIMED (test note 2). `ADR-0012` clause 6(c): the decorator takes the
 * inner `EngineSeam` as an argument, so a counting stand-in is the spy and no engine module is mocked
 * or opened. The book is the real checked-in artifact, read here in memory; `A5`'s "no book" is a
 * real ENOENT on a path that does not exist, so `data/opening-book/` is never moved or touched.
 */

import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { type BookProbe, createBookProbe } from "./book.ts";
import { withBook } from "./book-engine.ts";
import { type GameHistory, newGame, playMove } from "./history.ts";
import { legalMoves } from "./legal.ts";
import { seededRandom } from "./levels.ts";
import type { Move } from "./moves.ts";
import { squareName } from "./position.ts";
import { makeRenderSeam } from "./render-seam.ts";
import {
  type EngineSeam,
  type InputSeam,
  type PromptOutcome,
  type RenderSeam,
  runTurnLoop,
} from "./turn-loop.ts";
import { zobristKey } from "./zobrist.ts";

const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const ARTIFACT = new URL("../data/opening-book/book.json", import.meta.url);
const ABSENT = new URL("../data/opening-book/absent-ABC-095.json", import.meta.url);
const BOOK_BYTES = readFileSync(ARTIFACT);
const BOOK = JSON.parse(BOOK_BYTES.toString("utf8")) as {
  positions: Record<string, { m: [string, number][] }>;
};

const uciOf = (move: Move): string =>
  `${squareName(move.from)}${squareName(move.to)}${["", "", "n", "b", "r", "q"][move.promotion] ?? ""}`;

/** The book's own entry for a position, read off the artifact rather than through the probe. */
const bookEntryOf = (history: GameHistory): string[] =>
  (BOOK.positions[zobristKey(history.position).toString(16).padStart(16, "0")]?.m ?? []).map(
    ([uci]) => uci,
  );

const loadedProbe = (seed: number, warn: (line: string) => void = () => {}): BookProbe =>
  createBookProbe({ read: () => BOOK_BYTES, warn, random: seededRandom(seed) });

/** The search's stand-in: counts its calls and answers with a generator-owned legal move. */
const countingSearch = (): EngineSeam & { calls: number; last: Move | undefined } => {
  const seam = Object.assign(
    async (history: GameHistory): Promise<Move> => {
      seam.calls++;
      seam.last = legalMoves(history.position)[0] as Move;
      return seam.last;
    },
    { calls: 0, last: undefined as Move | undefined },
  );
  return seam;
};

const play = (history: GameHistory, uci: string): void => {
  const move = legalMoves(history.position).find((candidate) => uciOf(candidate) === uci);
  if (move === undefined) throw new Error(`not legal here: ${uci}`);
  playMove(history, move);
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe("ABC-095 — the book in front of the engine's move choice", () => {
  it("A1 — a book hit returns one of the book's entries and calls the search exactly 0 times", async () => {
    const history = newGame(START_FEN);
    const entries = bookEntryOf(history);
    expect(entries.length, "the start position is not in the checked-in book").toBeGreaterThan(0);

    const search = countingSearch();
    const move = await withBook(loadedProbe(1), search)(history);

    expect(entries).toContain(uciOf(move));
    expect(search.calls).toBe(0);
  });

  it("A3 — out of book, the search is called exactly once, its move is returned, and nothing is written or warned", async () => {
    const history = newGame(START_FEN);
    for (const uci of ["e2e4", "e7e5", "e1e2"]) play(history, uci);
    expect(bookEntryOf(history), "the precondition: this position must be out of book").toEqual([]);

    const stderr = vi.spyOn(process.stderr, "write");
    const warn = vi.fn();
    const search = countingSearch();
    const move = await withBook(loadedProbe(1, warn), search)(history);

    expect(search.calls).toBe(1);
    expect(move, "the search's own move, passed through untouched").toBe(search.last);
    expect(legalMoves(history.position)).toContainEqual(move);
    expect(stderr).not.toHaveBeenCalled();
    expect(warn).not.toHaveBeenCalled();
  });

  it("A4 — the frame where the game leaves book has the same rows and no extra message line as the one before it", async () => {
    // 1. e4 e5 (book, seeded) 2. Ke2 — out of book at ply 3, so the engine's second move is the first
    // the search makes. The precondition is asserted, not assumed.
    const history = newGame(START_FEN);
    const script = ["e2e4", "e1e2"];
    const input: InputSeam = async (h): Promise<PromptOutcome> => {
      const uci = script.shift();
      if (uci === undefined) return { kind: "quit" };
      const move = legalMoves(h.position).find((candidate) => uciOf(candidate) === uci);
      return { kind: "move", move: move as Move };
    };
    const real = makeRenderSeam("ascii", "white-bottom");
    const frames: { ply: number; rows: readonly string[]; messages: readonly string[] }[] = [];
    const render: RenderSeam = (h, status, thinking, messages) => {
      const rows = real(h, status, thinking, messages);
      frames.push({ ply: h.moves.length, rows: [...rows], messages: [...messages] });
      return rows;
    };
    const writes: string[] = [];
    const search = countingSearch();

    await runTurnLoop({
      history,
      humanColour: "white",
      render,
      input,
      engine: withBook(loadedProbe(95), search),
      sink: { isTTY: false, rows: 0, write: (text) => writes.push(text) },
    });

    expect(uciOf(history.moves[1] as Move), "the precondition: the seeded book reply").toBe("e7e5");
    expect(search.calls, "exactly one move came from the search").toBe(1);
    // Ply 2 is the last position the book answered into; ply 4 is the first the search did.
    const lastInBook = frames.filter((frame) => frame.ply === 2).at(-1);
    const firstOutOfBook = frames.filter((frame) => frame.ply === 4).at(-1);
    expect(lastInBook).toBeDefined();
    expect(firstOutOfBook).toBeDefined();
    expect(firstOutOfBook?.rows.length).toBe(lastInBook?.rows.length);
    expect(firstOutOfBook?.messages.length).toBe(lastInBook?.messages.length);
    // And over the whole game: one row count, and no line anywhere that names the book.
    expect(new Set(frames.map((frame) => frame.rows.length)).size).toBe(1);
    expect(frames.flatMap((frame) => frame.rows).filter((row) => /book/i.test(row))).toEqual([]);
    expect(writes.filter((text) => /book/i.test(text))).toEqual([]);
  });

  it("A5 (game half) — no book: 10 in-book positions all go to the search, one warning, no throw", async () => {
    // Ten positions the checked-in book DOES hold, the start first, walked through the book itself.
    const walker = loadedProbe(3);
    const walk = newGame(START_FEN);
    const positions: GameHistory[] = [];
    for (let ply = 0; ply < 10; ply++) {
      const snapshot = newGame(START_FEN);
      for (const move of walk.moves) play(snapshot, uciOf(move));
      positions.push(snapshot);
      const move = walker.bookMove(walk.position);
      if (move === undefined) throw new Error(`the walk left book at ply ${ply}`);
      playMove(walk, move);
    }
    for (const history of positions) expect(bookEntryOf(history).length).toBeGreaterThan(0);

    const warn = vi.fn();
    const noBook = createBookProbe({
      read: () => readFileSync(ABSENT),
      warn,
      random: seededRandom(1),
    });
    const search = countingSearch();
    const seam = withBook(noBook, search);
    for (const history of positions) await expect(seam(history)).resolves.toBeDefined();

    expect(search.calls).toBe(10);
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it("A6 — the decorator reaches the search only through the seam it is given: it imports two types and nothing else", () => {
    const source = readFileSync(new URL("book-engine.ts", import.meta.url), "utf8");
    const imports = [...source.matchAll(/^import\b[^;]*;/gm)].map(([line]) => line);
    expect(imports).toEqual([
      'import type { BookProbe } from "./book.ts";',
      'import type { EngineSeam } from "./turn-loop.ts";',
    ]);
  });
});
