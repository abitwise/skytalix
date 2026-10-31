/**
 * `ABC-167` — the UCI protocol as a pure module (`ADR-0044` D2-D4, D12). Every row drives
 * `handleLine` with strings, collects `write`'s lines and injects a ticking virtual clock
 * (`ADR-0027`), so every figure below is exact on every host and no row reads the wall clock.
 */

import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { makeMove } from "./apply.ts";
import { type BookProbe, createBookProbe } from "./book.ts";
import { chooseMove, HARD_CEILING_MS, trimPriorKeys } from "./engine.ts";
import { parseFen, toFen } from "./fen.ts";
import { keyHistory, newGame, playMove, repetitionKeyHistory } from "./history.ts";
import { isInCheck, legalMoves } from "./legal.ts";
import { createLevelSeam } from "./level-seam.ts";
import { createLevel, DEFAULT_LEVEL, HARDEST_LEVEL, LEVELS, seededRandom } from "./levels.ts";
import type { Move } from "./moves.ts";
import { type Position, squareName } from "./position.ts";
import { MATE_SCORE } from "./search.ts";
import { createUciSession, type UciSessionOptions } from "./uci-session.ts";
import { virtualClock } from "./virtual-clock.ts";
import { zobristKey } from "./zobrist.ts";

/**
 * `ABC-212` `A12`'s budget-read arm (`AR-212-LANE`). It CALLS THROUGH (`vi.mock(p, { spy: true })`,
 * the `command-input.test.ts` precedent): no row's behaviour changes. Only the `ABC-212` A9 rows
 * replace `chooseMove`, one row at a time, to read the budget a `go` hands the engine.
 */
vi.mock("./engine.ts", { spy: true });

const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const KIWIPETE = "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1";
const SMOTHERED = "5r1k/6pp/7N/3Q4/8/8/8/6K1 w - - 0 1"; // src/puzzle-corpus.ts:128
const MATED_NEXT = "7k/8/6K1/8/8/8/8/R7 b - - 1 1"; // corpus row :127 after f6g6
const STALEMATE = "7k/5Q2/6K1/8/8/8/8/8 b - - 0 1";

const INFO_LINE =
  /^info depth (\d+) score (cp -?\d+|mate -?\d+) nodes (\d+) time (\d+) nps (\d+) pv ([a-h][1-8][a-h][1-8][qrbn]?)$/;

interface Dialogue {
  readonly out: string[];
  readonly results: string[];
  /** The lines each input line wrote, by index. */
  readonly perLine: string[][];
}

/** `ABC-094` format-1 bytes over the given entries, built in memory (`ABC-171` test note 1). */
function bookBytes(positions: Record<string, unknown>): Uint8Array {
  return new TextEncoder().encode(JSON.stringify({ format: 1, maxPly: 12, positions }));
}

/**
 * `ABC-171` gave the session `random` and `book`. The `ABC-167` rows get a real probe over an
 * empty, valid book (never a hit, never a warning) and a seeded `random` that the default level
 * (rate 0) never calls,
 * so each of those rows reads exactly as it did before.
 */
function emptyBook(): BookProbe {
  return createBookProbe({ read: () => bookBytes({}), warn: () => {}, random: seededRandom(1) });
}

/** Test note 1: lines in, lines out. One session per script, on its own ticking clock. */
function dialogue(lines: readonly string[], stepMs = 10): Dialogue {
  const out: string[] = [];
  const session = createUciSession({
    write: (line) => out.push(line),
    now: virtualClock(stepMs),
    random: seededRandom(1),
    book: emptyBook(),
  });
  const perLine: string[][] = [];
  const results = lines.map((line) => {
    const before = out.length;
    const result = session.handleLine(line);
    perLine.push(out.slice(before));
    return result;
  });
  return { out, results, perLine };
}

/** Every line written by every dialogue in this file, for `A11`'s M4 sweep. */
const everyLine: string[] = [];
function talk(lines: readonly string[], stepMs?: number): Dialogue {
  const result = dialogue(lines, stepMs);
  everyLine.push(...result.out);
  for (const [index, line] of lines.entries()) {
    // `A10`: only `quit` returns "quit".
    expect(result.results[index]).toBe(line === "quit" ? "quit" : "continue");
  }
  return result;
}

function parseInfo(line: string | undefined) {
  const match = INFO_LINE.exec(line ?? "");
  expect(match, `not an info line: ${line}`).not.toBeNull();
  const m = match as RegExpExecArray;
  return {
    depth: Number(m[1]),
    score: m[2] as string,
    nodes: Number(m[3]),
    time: Number(m[4]),
    nps: Number(m[5]),
    move: m[6] as string,
  };
}

const PROMOTION_LETTERS = ["", "", "n", "b", "r", "q"];

/** The test's own long-algebraic spelling, independent of the module's. */
function coordinateOf(move: Move): string {
  return `${squareName(move.from)}${squareName(move.to)}${PROMOTION_LETTERS[move.promotion] ?? ""}`;
}

function legalFrom(fen: string): string[] {
  return legalMoves(parseFen(fen)).map(coordinateOf);
}

/** "Printable" (QE-167-a): no code point below U+0020 and no U+007F. */
function expectPrintable(line: string | undefined): void {
  for (const character of line ?? "") {
    const code = character.codePointAt(0) as number;
    expect(code >= 0x20 && code !== 0x7f).toBe(true);
  }
}

describe("ABC-167 A1-A2 — handshake and ready", () => {
  // Re-pinned by ABC-220 (ADR-0052 D1): the TimeMode line follows Skill Level, before uciok.
  it("A1: uci writes id name, id author, then (ABC-171 A1, ABC-220 A1) the three option lines, then uciok", () => {
    expect(talk(["uci"]).out).toEqual([
      "id name skytalix",
      "id author Olger Oeselg",
      "option name OwnBook type check default true",
      "option name Skill Level type spin default 5 min 1 max 7",
      "option name TimeMode type combo default level var level var simple-tournament",
      "uciok",
    ]);
  });

  it("A2: isready writes exactly readyok", () => {
    expect(talk(["isready"]).out).toEqual(["readyok"]);
  });
});

describe("ABC-167 A3 — a move from a position", () => {
  it("writes one info line then one bestmove, the same legal move", () => {
    const { out } = talk(["position startpos moves e2e4 e7e5", "go movetime 100"]);
    expect(out).toHaveLength(2);
    const info = parseInfo(out[0]);
    expect(out[1]).toBe(`bestmove ${info.move}`);
    const position = parseFen("rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2");
    expect(legalMoves(position).map(coordinateOf)).toContain(info.move);
  });

  it("A3-h1: nps = round(N x 1000 / max(1, T))", () => {
    const { out } = talk(["position startpos moves e2e4 e7e5", "go movetime 100"]);
    const info = parseInfo(out[0]);
    expect(info.nps).toBe(Math.round((info.nodes * 1000) / Math.max(1, info.time)));
    expect(info.nps).not.toBe(info.nodes);
  });
});

describe("ABC-167 A4 — bad input holds no position", () => {
  for (const bad of ["position fen 8/8/8 w - - 0 1", "position startpos moves e2e5"]) {
    it(`${bad}: one printable info string, then go answers bestmove 0000`, () => {
      const refused = talk([bad]).out;
      expect(refused).toHaveLength(1);
      expect(refused[0]).toMatch(/^info string /);
      for (const character of refused[0] as string) {
        const code = character.codePointAt(0) as number;
        expect(code >= 0x20 && code !== 0x7f).toBe(true);
      }
      const { out } = talk([bad, "go movetime 100"]);
      expect(out.slice(1)).toEqual(["bestmove 0000"]);
    });
  }

  it("a control character in a refused FEN is filtered from the info string", () => {
    const { out } = talk(["position fen 8/8/8\x1b[31m w - - 0 1"]);
    expect(out).toHaveLength(1);
    expect(out[0]).not.toContain("\u001b");
  });

  it("A4-a1: an echoed control character is dropped from the info string", () => {
    const { perLine } = talk(["position startpos moves e2e4\x1b[31m", "go movetime 100"]);
    expect(perLine[0]).toHaveLength(1);
    expect(perLine[0]?.[0]).toMatch(/^info string /);
    expectPrintable(perLine[0]?.[0]);
    expect(perLine[0]?.[0]).toContain("e2e4[31m");
    expect(perLine[1]).toEqual(["bestmove 0000"]);
  });

  it("A4-a2: an echoed control character in a go value is dropped from the info string", () => {
    const { perLine } = talk(["position startpos", "go depth \x1b[31m"], 100);
    const lines = perLine[1] as string[];
    expect(lines).toHaveLength(3);
    expect(lines[0]).toMatch(/^info string /);
    expectPrintable(lines[0]);
    expect(lines[0]).toContain("[31m");
    const info = parseInfo(lines[1]);
    expect(lines[2]).toBe(`bestmove ${info.move}`);
    expect(legalFrom(START_FEN)).toContain(info.move);
  });

  it("a held stalemate answers go with bestmove 0000", () => {
    const position = parseFen(STALEMATE);
    expect(legalMoves(position)).toHaveLength(0); // test note 5: checked here, not assumed
    expect(isInCheck(position)).toBe(false);
    const { out } = talk([`position fen ${STALEMATE}`, "go movetime 100"]);
    expect(out).toEqual(["bestmove 0000"]);
  });
});

describe("ABC-167 A5 — the D4 time rule, read from the info line's time", () => {
  /**
   * The "within" bound is the engine's own overshoot on a ticking clock of step `s`: the first
   * reading at or past the deadline is at most one step late, and the reading at return adds
   * one more, so `G <= time <= G + 2s`.
   */
  const rows: ReadonlyArray<readonly [string, string, number, number]> = [
    ["movetime 100", `position fen ${START_FEN}`, 100, 10], // step 10: ABC-173, owner 2026-10-19
    ["white reads wtime", "position startpos", 50, 1],
    ["black reads btime", "position startpos moves e2e4", 450, 10],
    ["a short clock", "position startpos", 1, 1],
    // ABC-228 (ADR-0053 d10, reading (ii)): level 5 is 4 000, so G = 3 500 binds, not the level.
    ["G = 3 500, under the default level 5's 4 000", "position startpos", 3_500, 100],
    ["a bare go", "position startpos", 4_000, 100],
  ];
  const goes = [
    "go movetime 100",
    "go wtime 1000 btime 9000",
    "go wtime 1000 btime 9000",
    "go wtime 40 btime 40",
    "go wtime 60000 btime 60000 winc 1000 binc 1000",
    "go",
  ];
  for (const [index, [name, position, budget, step]] of rows.entries()) {
    const go = goes[index] as string;
    it(`${name}: ${go} -> ${budget} ms (within 2 x ${step} ms)`, () => {
      const { out } = talk([position, go], step);
      expect(out).toHaveLength(2);
      const { time } = parseInfo(out[0]);
      expect(time).toBeGreaterThanOrEqual(budget);
      expect(time).toBeLessThanOrEqual(budget + 2 * step);
    });
  }

  /**
   * QE-167-b/c, steps per bapm-amend2-ABC-167: the coarsest step s in {1, 10, 100} for which
   * every wrong build the row names (G = W) falls outside G <= time <= G + 2s, i.e. |W - G| > 2s.
   */
  const pinned: ReadonlyArray<readonly [string, string, string, number, number]> = [
    ["A5-b1", "position startpos", "go wtime 2000 btime 2000 winc 1000 binc 0", 600, 100],
    [
      "A5-b2",
      "position startpos moves e2e4",
      "go wtime 2000 btime 2000 winc 1000 binc 0",
      100,
      100,
    ],
    ["A5-b3", "position startpos", "go wtime 1000 btime 1000 movestogo 5", 200, 10],
    ["A5-b4", "position startpos", "go wtime 1000 btime 1000 movetime 300", 300, 100],
    ["A5-b5", "position startpos", "go movetime 300 wtime 60000 btime 60000", 300, 100],
    ["A5-c1", "position startpos", "go wtime 100 btime 100 winc 1000 binc 1000", 50, 10],
  ];
  for (const [row, position, go, budget, step] of pinned) {
    it(`${row}: ${position}, ${go} -> ${budget} ms (within 2 x ${step} ms)`, () => {
      const { out } = talk([position, go], step);
      expect(out).toHaveLength(2);
      const { time } = parseInfo(out[0]);
      expect(time).toBeGreaterThanOrEqual(budget);
      expect(time).toBeLessThanOrEqual(budget + 2 * step);
    });
  }
});

describe("ABC-167 A6 — infinite waits for stop", () => {
  for (const release of ["stop", "ponderhit"]) {
    it(`go infinite holds the bestmove until ${release}; a second ${release} writes nothing`, () => {
      // ABC-177 (ADR-0046 D2a): one dialogue; the two it replaced were exact prefixes of it.
      const { perLine } = talk(["position startpos", "go infinite", release, release], 1_000);
      for (const held of perLine.slice(0, 2)) {
        expect(held.filter((line) => line.startsWith("bestmove"))).toEqual([]);
      }
      const released = perLine[2] as string[];
      const bestmoves = released.filter((line) => line.startsWith("bestmove"));
      expect(bestmoves).toHaveLength(1);
      expect(released.at(-1)).toBe(bestmoves[0]);
      expect(perLine[3]).toEqual([]);
    });
  }

  it("a stop with nothing held writes nothing", () => {
    expect(talk(["stop", "ponderhit"]).out).toEqual([]);
  });

  // ABC-178 R1 (QE-177-a): two `talk`s, two sessions. Session 1 is left holding, never released.
  it("ABC-178 R1: a hold left in one session is not released by a fresh session", () => {
    const held = talk(["position startpos", "go infinite"], 1_000);
    expect(held.out.filter((line) => line.startsWith("bestmove"))).toEqual([]);
    expect(talk(["stop", "ponderhit"]).out).toEqual([]);
    // QE-178-b: re-read session 1 after session 2 ran; a fresh session's release must not reach it.
    expect(held.out.filter((line) => line.startsWith("bestmove"))).toEqual([]);
  });

  it("A6-d1: go ponder holds at the capped ceiling; ponderhit releases once", () => {
    const { perLine } = talk(["position startpos", "go ponder", "ponderhit", "ponderhit"], 100);
    expect(perLine[1]).toHaveLength(1);
    const info = parseInfo(perLine[1]?.[0]);
    expect(info.time).toBeGreaterThanOrEqual(4_000);
    expect(info.time).toBeLessThanOrEqual(4_000 + 2 * 100);
    expect(perLine[2]).toEqual([`bestmove ${info.move}`]);
    expect(perLine[3]).toEqual([]);
  });

  it("A6-e1: a new go writes the held bestmove first; two bestmoves in all", () => {
    const { out, perLine } = talk(
      ["position startpos", "go infinite", "go movetime 100", "stop"],
      1_000,
    );
    const lines = perLine[2] as string[];
    expect(lines).toHaveLength(3);
    expect(lines[0]).toMatch(/^bestmove /);
    const info = parseInfo(lines[1]);
    expect(lines[2]).toBe(`bestmove ${info.move}`);
    expect(perLine[3]).toEqual([]);
    expect(out.filter((line) => line.startsWith("bestmove"))).toHaveLength(2);
  });

  for (const [row, command] of [
    ["A6-e2", "position startpos"],
    ["A6-e3", "ucinewgame"],
  ] as const) {
    it(`${row}: ${command} writes the held bestmove first, in the position it searched`, () => {
      expect(legalFrom(MATED_NEXT)).toEqual(["h8g8"]);
      const { perLine } = talk(
        [`position fen ${MATED_NEXT}`, "go infinite", command, "stop", "go movetime 100"],
        100,
      );
      expect(perLine[2]).toEqual(["bestmove h8g8"]);
      expect(perLine[3]).toEqual([]);
      const last = perLine[4] as string[];
      expect(last).toHaveLength(2);
      const move = (last[1] as string).replace(/^bestmove /, "");
      expect(legalFrom(START_FEN)).toContain(move);
    });
  }

  it("A6-j1: a refused position writes the held bestmove first, then its info string", () => {
    const { perLine } = talk(["position startpos", "go infinite", "position fen nonsense"], 1_000);
    const lines = perLine[2] as string[];
    expect(lines).toHaveLength(2);
    expect(lines[0]).toMatch(/^bestmove [a-h][1-8][a-h][1-8]$/);
    expect(lines[1]).toMatch(/^info string position refused: /);
  });

  it("A6-e4: quit writes the held bestmove and returns quit", () => {
    const { perLine, results } = talk(["position startpos", "go infinite", "quit"], 1_000);
    expect(results[2]).toBe("quit");
    expect(perLine[2]).toHaveLength(1);
    expect(perLine[2]?.[0]).toMatch(/^bestmove [a-h][1-8][a-h][1-8]$/);
  });

  it("A6-e5: isready, an unknown line and setoption leave the bestmove held", () => {
    const { perLine } = talk(
      [
        "position startpos",
        "go infinite",
        "isready",
        "foo",
        "setoption name Hash value 64",
        "stop",
      ],
      1_000,
    );
    expect(perLine[2]).toEqual(["readyok"]);
    expect(perLine[3]).toEqual([]);
    expect(perLine[4]).toEqual([]);
    expect(perLine[5]).toHaveLength(1);
    expect(perLine[5]?.[0]).toMatch(/^bestmove /);
  });
});

describe("ABC-167 A7 — the D12 limits", () => {
  it("go depth 3 reports depth 3 on a clock where an unlimited go reaches depth >= 5", () => {
    // THE UNLIMITED `go` ON A 100 MS STEP SINCE `ABC-199` (`QE-198-a`; owner, 2026-10-19,
    // `…6e1d9b47`: "Lighten the rows, keep cap"). On step 50 it searched depth 6 on 55 317 nodes,
    // the heaviest row in the suite, and it timed out at the 5 s default under coverage and load.
    // Step 100 is in `ADR-0046`'s set, and this row is its class C (the step is a precondition):
    // on step 100 the unlimited `go` still reaches depth 5, on 25 621 nodes, so the floor stays 5.
    // `go depth 3` keeps step 50. Ignoring `depth`, or searching to depth + 1, still reds the row
    // (scratch census and plants, ABC-199).
    const free = parseInfo(talk(["position startpos", "go"], 100).out[0]);
    expect(free.depth).toBeGreaterThanOrEqual(5);
    const capped = talk(["position startpos", "go depth 3"], 50).out;
    expect(capped).toHaveLength(2);
    expect(parseInfo(capped[0]).depth).toBe(3);
  });

  it("go nodes 20000 -> nodes <= 21 024, unless depth 1 alone took more", () => {
    const depthOne = parseInfo(talk(["position startpos", "go depth 1"]).out[0]).nodes;
    const { out } = talk(["position startpos", "go nodes 20000"]);
    expect(out).toHaveLength(2);
    expect(parseInfo(out[0]).nodes).toBeLessThanOrEqual(Math.max(20_000, depthOne) + 1_024);
  });

  it("QE-170-g: a tiny go nodes 1 still writes one info line and a legal depth-1 bestmove", () => {
    const { out } = talk(["position startpos", "go nodes 1"]);
    expect(out).toHaveLength(2);
    const info = parseInfo(out[0]);
    expect(info.depth).toBe(1);
    expect(info.nodes).toBeGreaterThan(1); // the first iteration always completes
    expect(legalFrom(START_FEN)).toContain(info.move);
  });

  it("go mate 2 on the smothered mate -> score mate 2 and bestmove d5g8", () => {
    const { out } = talk([`position fen ${SMOTHERED}`, "go mate 2"]);
    expect(out).toHaveLength(2);
    const info = parseInfo(out[0]);
    expect(info.depth).toBe(3); // 2N - 1
    expect(info.score).toBe("mate 2");
    expect(out[1]).toBe("bestmove d5g8");
  });

  it("go depth 3 mate 5 -> depth 3 (the smaller one wins)", () => {
    const { out } = talk(["position startpos", "go depth 3 mate 5"]);
    expect(parseInfo(out[0]).depth).toBe(3);
    const reversed = talk(["position startpos", "go mate 1 depth 5"]).out;
    expect(parseInfo(reversed[0]).depth).toBe(1);
  });

  for (const go of [
    "go depth 0",
    "go nodes x",
    "go depth 2.5",
    "go mate 0",
    "go nodes -5",
    "go depth",
  ]) {
    it(`${go}: one info string, the token dropped, one bestmove`, () => {
      const { out } = talk(["position startpos", go], 1_000);
      expect(out).toHaveLength(3);
      expect(out[0]).toMatch(/^info string /);
      const info = parseInfo(out[1]);
      expect(info.time).toBeGreaterThanOrEqual(4_000); // dropped: no limit, G is the capped ceiling
      expect(out[2]).toBe(`bestmove ${info.move}`);
    });
  }

  // ABC-197 R2 (QE-177-b): step 100 pins the dropped-token G to [4 000, 4 200], not U7's 1 000 band.
  // ABC-228 (ADR-0053 d10): the capped ceiling is level 5's 4 000 (was 3 000).
  it("ABC-197 R2: go depth 0 on step 100 searches G = 4 000, time in [4 000, 4 200]", () => {
    const { out } = talk(["position startpos", "go depth 0"], 100);
    expect(out).toHaveLength(3);
    expect(out[0]).toMatch(/^info string /);
    const info = parseInfo(out[1]);
    expect(info.time).toBeGreaterThanOrEqual(4_000);
    expect(info.time).toBeLessThanOrEqual(4_200);
    expect(out[2]).toBe(`bestmove ${info.move}`);
  });

  it("go movetime 1000 searchmoves e2e4 -> one info string, all moves searched", () => {
    const { out } = talk(["position startpos", "go movetime 1000 searchmoves e2e4"], 50);
    expect(out).toHaveLength(3);
    expect(out[0]).toMatch(/^info string /);
    const info = parseInfo(out[1]);
    expect(info.time).toBeGreaterThanOrEqual(1_000);
    expect(out[2]).toBe(`bestmove ${info.move}`);
    // All moves searched: the answer is the unrestricted one, on the same clock.
    const free = parseInfo(talk(["position startpos", "go movetime 1000"], 50).out[0]);
    expect(info.move).toBe(free.move);
  });

  /** One info string, then one info line with `time` in [low, high], then its bestmove. */
  function expectWarnedSearch(lines: string[] | undefined, low: number, high: number): string {
    const written = lines ?? [];
    expect(written).toHaveLength(3);
    expect(written[0]).toMatch(/^info string /);
    const info = parseInfo(written[1]);
    expect(info.time).toBeGreaterThanOrEqual(low);
    expect(info.time).toBeLessThanOrEqual(high);
    expect(written[2]).toBe(`bestmove ${info.move}`);
    return written[0] as string;
  }

  it("A7-f1: a keyword is never a value (go depth movetime 100)", () => {
    const { perLine } = talk(["position startpos", "go depth movetime 100"], 100);
    expect(expectWarnedSearch(perLine[1], 100, 100 + 2 * 100)).toContain("depth");
  });

  it("A7-f2: go movetime with no value searches as a bare go", () => {
    const { perLine } = talk(["position startpos", "go movetime"], 100);
    expectWarnedSearch(perLine[1], 4_000, 4_000 + 2 * 100);
  });

  it("A7-f3: go movetime 1e2 and movestogo 0 are dropped with one info string", () => {
    const bare = talk(["position startpos", "go movetime 1e2"], 100).perLine[1];
    expectWarnedSearch(bare, 4_000, 4_000 + 2 * 100);
    const { perLine } = talk(["position startpos", "go wtime 1000 btime 1000 movestogo 0"], 100);
    expectWarnedSearch(perLine[1], 50, 50 + 2 * 100);
  });

  it("A7-h1: searchmoves stops at the next go keyword, so movetime is honoured", () => {
    const { perLine } = talk(["position startpos", "go searchmoves e2e4 d2d4 movetime 100"], 100);
    expectWarnedSearch(perLine[1], 100, 100 + 2 * 100);
  });

  /** QE-167-i: the keyword rule for every group and every following keyword, step 100. */
  it("A7-i1: go movetime depth 3 -> one info string naming movetime, then depth 3", () => {
    const { perLine } = talk(["position startpos", "go movetime depth 3"], 100);
    const lines = perLine[1] as string[];
    expect(lines).toHaveLength(3);
    expect(lines[0]).toMatch(/^info string go movetime .*nothing/);
    const info = parseInfo(lines[1]);
    expect(info.depth).toBe(3);
    expect(lines[2]).toBe(`bestmove ${info.move}`);
  });

  it("A7-i2: go wtime 1000 btime 1000 movestogo movetime 300 -> 300 ms", () => {
    const { perLine } = talk(
      ["position startpos", "go wtime 1000 btime 1000 movestogo movetime 300"],
      100,
    );
    expect(expectWarnedSearch(perLine[1], 300, 300 + 2 * 100)).toMatch(/movestogo .*nothing/);
  });

  it("A7-i3: go wtime 1000 btime 1000 depth winc 1000 -> 550 ms", () => {
    const { perLine } = talk(
      ["position startpos", "go wtime 1000 btime 1000 depth winc 1000"],
      100,
    );
    expect(expectWarnedSearch(perLine[1], 550, 550 + 2 * 100)).toMatch(/depth .*nothing/);
  });

  it("A7-i4: go searchmoves e2e4 depth 3 -> searchmoves stops at depth, so depth 3", () => {
    const { perLine } = talk(["position startpos", "go searchmoves e2e4 depth 3"], 100);
    const lines = perLine[1] as string[];
    expect(lines).toHaveLength(3);
    expect(lines[0]).toMatch(/^info string searchmoves/);
    const info = parseInfo(lines[1]);
    expect(info.depth).toBe(3);
    expect(lines[2]).toBe(`bestmove ${info.move}`);
  });

  for (const [row, go] of [
    ["A7-i5", "go depth infinite"],
    ["A7-i6", "go searchmoves e2e4 infinite"],
  ] as const) {
    it(`${row}: ${go} holds the bestmove until stop`, () => {
      const { perLine } = talk(["position startpos", go, "stop"], 1_000);
      const searched = perLine[1] as string[];
      expect(searched).toHaveLength(2);
      expect(searched[0]).toMatch(/^info string /);
      const info = parseInfo(searched[1]);
      expect(perLine[2]).toEqual([`bestmove ${info.move}`]);
    });
  }
});

describe("ABC-167 A8 — mate scores", () => {
  it("being mated next move reports score mate -1", () => {
    const position = parseFen(MATED_NEXT);
    expect(legalMoves(position).map(coordinateOf)).toEqual(["h8g8"]); // test note 3: derived
    const { out } = talk([`position fen ${MATED_NEXT}`, "go movetime 500"], 100);
    expect(parseInfo(out[0]).score).toBe("mate -1");
  });

  it("M = ceil((MATE_SCORE - |score|) / 2) is the rule both rows read", () => {
    expect(Math.ceil((MATE_SCORE - (MATE_SCORE - 3)) / 2)).toBe(2);
    expect(Math.ceil((MATE_SCORE - (MATE_SCORE - 2)) / 2)).toBe(1);
  });
});

describe("ABC-167 A9 — ignored and reset", () => {
  it("setoption, debug, register, an unknown command and an empty line write nothing", () => {
    const { out } = talk(["setoption name Hash value 64", "debug on", "register later", "foo", ""]);
    expect(out).toEqual([]);
  });

  it("ucinewgame sets the position back to the start", () => {
    const { out } = talk([`position fen ${KIWIPETE}`, "ucinewgame", "go movetime 100"]);
    expect(out).toHaveLength(2);
    const move = (out[1] as string).replace(/^bestmove /, "");
    expect(legalFrom(START_FEN)).toContain(move);
  });

  it("A9-h1: a new session with no position line starts at the start position", () => {
    const { out } = talk(["go movetime 100"]);
    expect(out).toHaveLength(2);
    const info = parseInfo(out[0]);
    expect(out[1]).toBe(`bestmove ${info.move}`);
    expect(legalFrom(START_FEN)).toContain(info.move);
  });
});

describe("ABC-167 A10 — quit", () => {
  it('handleLine("quit") returns "quit" and writes nothing', () => {
    const { out, results } = talk(["isready", "quit"]);
    expect(results).toEqual(["continue", "quit"]);
    expect(out).toEqual(["readyok"]);
  });
});

// ---------------------------------------------------------------------------------------------
// ABC-171 — `OwnBook` and `Skill Level` (`ADR-0044` D3, D10, D11). Every row below drives
// `handleLine` on a ticking virtual clock, with `random = seededRandom(k)` behind a call counter
// and a REAL `createBookProbe` over in-memory bytes behind a `read` counter (test note 1).
// ---------------------------------------------------------------------------------------------

/** The level path's info line (D3): no score, no nps. */
const LEVEL_INFO = /^info depth (\d+) nodes (\d+) time (\d+) pv ([a-h][1-8][a-h][1-8][qrbn]?)$/;

const hexKey = (position: Position): string => zobristKey(position).toString(16).padStart(16, "0");

function afterMoves(fen: string, moves: readonly string[]): Position {
  const position = parseFen(fen);
  for (const text of moves) {
    const move = legalMoves(position).find((m) => coordinateOf(m) === text);
    if (move === undefined) throw new Error(`test setup: ${text} is not legal`);
    makeMove(position, move);
  }
  return position;
}

/** `A3`'s book: the start position holds the single reply `e2e4`. */
const START_BOOK = (): Uint8Array =>
  bookBytes({ [hexKey(parseFen(START_FEN))]: { m: [["e2e4", 1]] } });

/** The `go` of `A6`: G = 60000 / 20 + 1000 / 2 = 3500 ms. */
const GO_G3500 = "go wtime 60000 btime 60000 winc 1000 binc 1000";

/** D11's seed rule, re-derived here: the first blunder draw of the `n`th `go` under `seededRandom(k)`. */
function firstDraws(k: number, n: number): number[] {
  const random = seededRandom(k);
  return Array.from({ length: n }, () => seededRandom(Math.floor(random() * 2 ** 32))());
}

interface RigOptions {
  readonly stepMs?: number;
  readonly k?: number;
  readonly read?: () => Uint8Array;
}

/** One session with counted `random` draws, counted book reads and recorded book warnings. */
function rig({ stepMs = 100, k = 1, read = () => bookBytes({}) }: RigOptions = {}) {
  const out: string[] = [];
  const warnings: string[] = [];
  const reads = { count: 0 };
  const draws = { count: 0 };
  const generator = seededRandom(k);
  const options: UciSessionOptions = {
    write: (line) => out.push(line),
    now: virtualClock(stepMs),
    random: () => {
      draws.count++;
      return generator();
    },
    book: createBookProbe({
      read: () => {
        reads.count++;
        return read();
      },
      warn: (message) => warnings.push(message),
      random: seededRandom(7),
    }),
  };
  const session = createUciSession(options);
  /** The lines this one input line wrote. */
  const send = (line: string): string[] => {
    const before = out.length;
    const result = session.handleLine(line);
    expect(result).toBe(line === "quit" ? "quit" : "continue");
    const written = out.slice(before);
    everyLine.push(...written);
    return written;
  };
  return { out, warnings, reads, draws, send, now: options.now };
}

function parseLevelInfo(line: string | undefined) {
  const match = LEVEL_INFO.exec(line ?? "");
  expect(match, `not a level info line: ${line}`).not.toBeNull();
  const m = match as RegExpExecArray;
  return { depth: Number(m[1]), nodes: Number(m[2]), time: Number(m[3]), move: m[4] as string };
}

/** `A6`'s reading: the info line's `time` for `GO_G3500` from the start position, step 100. */
function levelTime(send: (line: string) => string[], level: keyof typeof LEVELS): number {
  send("position startpos");
  const lines = send(GO_G3500);
  expect(lines).toHaveLength(2);
  const info = LEVELS[level].blunderRate > 0 ? parseLevelInfo(lines[0]) : parseInfo(lines[0]);
  expect(lines[1]).toBe(`bestmove ${info.move}`);
  return info.time;
}

/** `ABC-167` `A5`'s bound for step `s` (test note 3): `G <= time <= G + 2s`. */
function expectWithin(time: number, budget: number, step = 100): void {
  expect(time).toBeGreaterThanOrEqual(budget);
  expect(time).toBeLessThanOrEqual(budget + 2 * step);
}

describe("ABC-171 A1 — the option lines", () => {
  // Re-pinned by ABC-220 (ADR-0052 D1): 6 lines, the TimeMode line third of the options.
  it("uci writes exactly 6 lines, the three options after the id lines and before uciok", () => {
    const { send } = rig();
    expect(send("uci")).toEqual([
      "id name skytalix",
      "id author Olger Oeselg",
      "option name OwnBook type check default true",
      "option name Skill Level type spin default 5 min 1 max 7",
      "option name TimeMode type combo default level var level var simple-tournament",
      "uciok",
    ]);
  });
});

describe("ABC-171 A2 — setoption", () => {
  it("precondition: under seededRandom(1) the first level-1 go takes the engine path", () => {
    expect(firstDraws(1, 1)[0]).toBeGreaterThanOrEqual(LEVELS[1].blunderRate);
  });

  it("setoption name skill level value 1 (lower case) writes nothing and sets level 1", () => {
    const { send } = rig({ k: 1 });
    expect(send("setoption name skill level value 1")).toEqual([]);
    expectWithin(levelTime(send, 1), 100);
  });

  it("setoption name OwnBook value false writes nothing (A4 holds afterwards, in A4)", () => {
    const { send } = rig({ read: START_BOOK });
    expect(send("setoption name OwnBook value false")).toEqual([]);
  });

  for (const value of ["0", "8", "2.5", "x", "constructor"]) {
    it(`Skill Level value ${value}: one info string, the old value (1) kept`, () => {
      const { send } = rig({ k: 1 });
      expect(send("setoption name Skill Level value 1")).toEqual([]);
      const written = send(`setoption name Skill Level value ${value}`);
      expect(written).toHaveLength(1);
      expect(written[0]).toMatch(/^info string /);
      expectWithin(levelTime(send, 1), 100);
    });
  }

  it("OwnBook value maybe: one info string, the old value (false) kept", () => {
    const { send, reads } = rig({ read: START_BOOK });
    expect(send("setoption name OwnBook value false")).toEqual([]);
    const written = send("setoption name OwnBook value maybe");
    expect(written).toHaveLength(1);
    expect(written[0]).toMatch(/^info string /);
    send("position startpos");
    const lines = send("go movetime 1000");
    expect(lines).toHaveLength(2);
    parseInfo(lines[0]);
    expect(reads.count).toBe(0);
  });

  it("setoption name Hash value 64 writes nothing and changes nothing", () => {
    const booked = rig({ read: START_BOOK });
    expect(booked.send("setoption name Hash value 64")).toEqual([]);
    booked.send("position startpos");
    expect(booked.send("go movetime 1000")).toEqual(["info string book", "bestmove e2e4"]);

    // Still the default level 5. `ABC-243` A1: a bare `go` searches the level's own budget, and the
    // seven levels' budgets all differ, so a silent move to any other level leaves the bound.
    const level = rig();
    expect(level.send("setoption name Hash value 64")).toEqual([]);
    level.send("position startpos");
    const lines = level.send("go");
    expect(lines).toHaveLength(2);
    const time = / time (\d+) /.exec(lines[0] ?? "");
    expect(time, `no time on: ${lines[0]}`).not.toBeNull();
    expectWithin(Number(time?.[1]), LEVELS[5].budgetMs);
    expect(lines[1]).toMatch(/^bestmove [a-h][1-8][a-h][1-8]/);
  });
});

describe("ABC-171 A3 — a book hit (EPIC-007 M6)", () => {
  it("position startpos, go movetime 1000 -> exactly info string book, bestmove e2e4", () => {
    const { send, out } = rig({ read: START_BOOK });
    expect(send("position startpos")).toEqual([]);
    expect(send("go movetime 1000")).toEqual(["info string book", "bestmove e2e4"]);
    expect(out.some((line) => line.startsWith("info depth"))).toBe(false);
  });

  it("position fen <the start FEN> hits the same entry (keyed by position, not move list)", () => {
    const { send } = rig({ read: START_BOOK });
    expect(send(`position fen ${START_FEN}`)).toEqual([]);
    expect(send("go movetime 1000")).toEqual(["info string book", "bestmove e2e4"]);
  });

  it("the position after the moves is probed (D10)", () => {
    const afterE4 = hexKey(afterMoves(START_FEN, ["e2e4"]));
    const { send } = rig({ read: () => bookBytes({ [afterE4]: { m: [["e7e5", 1]] } }) });
    send("position startpos moves e2e4");
    expect(send("go movetime 1000")).toEqual(["info string book", "bestmove e7e5"]);
  });
});

describe("ABC-171 A4 — OwnBook off", () => {
  it("OwnBook false before isready/go: a search, no book line, read called 0 times", () => {
    const { send, out, reads } = rig({ read: START_BOOK });
    send("uci");
    send("setoption name OwnBook value false");
    expect(send("isready")).toEqual(["readyok"]);
    send("position startpos");
    const lines = send("go movetime 1000");
    expect(lines).toHaveLength(2);
    const info = parseInfo(lines[0]);
    expect(lines[1]).toBe(`bestmove ${info.move}`);
    send("ucinewgame");
    send("isready");
    expect(out).not.toContain("info string book");
    expect(reads.count).toBe(0);
  });
});

describe("ABC-171 A5 — the book is read once, and at the right time", () => {
  it("0 after uci, 1 after the first isready, still 1 after isready, go and ucinewgame", () => {
    const { send, reads } = rig({ read: START_BOOK });
    send("uci");
    expect(reads.count).toBe(0);
    send("isready");
    expect(reads.count).toBe(1);
    for (const line of ["isready", "position startpos", "go movetime 1000", "ucinewgame"]) {
      send(line);
    }
    send("isready");
    send("go movetime 1000");
    expect(reads.count).toBe(1);
  });

  it("a session that never gets isready reads at the first go", () => {
    const { send, reads } = rig({ read: START_BOOK });
    send("uci");
    send("position startpos");
    expect(reads.count).toBe(0);
    expect(send("go movetime 1000")).toEqual(["info string book", "bestmove e2e4"]);
    expect(reads.count).toBe(1);
  });

  it("the first isready WITH OwnBook on reads; one with it off does not", () => {
    const { send, reads } = rig({ read: START_BOOK });
    send("setoption name OwnBook value false");
    send("isready");
    expect(reads.count).toBe(0);
    send("setoption name ownbook value true");
    send("isready");
    expect(reads.count).toBe(1);
  });
});

describe("ABC-171 A6 — a level change is observable (EPIC-007 M7)", () => {
  // G = 3500. Budget min(G, LEVELS[skill].budgetMs), step 100, ABC-167 A5's bound.
  // ABC-174: min(3500, 330) at level 3 and min(3500, 3000) at level 5 (ADR-0045 D1).
  // ABC-228 (ADR-0053 d10): level 5 is 4 000, so min(3500, 4000) = 3 500 at level 5.
  for (const [level, budget] of [
    [1, 100],
    [3, 330],
    [5, 3_500],
  ] as const) {
    it(`level ${level}: ${GO_G3500} -> ${budget} ms (within 2 x 100 ms)`, () => {
      // A blunder level's first go must take the engine path, so the time is the budget's.
      if (LEVELS[level].blunderRate > 0) {
        expect(firstDraws(1, 1)[0]).toBeGreaterThanOrEqual(LEVELS[level].blunderRate);
      }
      const { send } = rig({ k: 1 });
      expect(send(`setoption name Skill Level value ${level}`)).toEqual([]);
      expectWithin(levelTime(send, level), budget);
    });
  }
});

describe("ABC-171 A7 — the blunder path", () => {
  const goes = [
    "position startpos",
    "go movetime 1000",
    "position startpos moves e2e4 e7e5",
    "go movetime 1000",
    `position fen ${KIWIPETE}`,
    "go movetime 1000",
  ];

  /** The bestmove sequence of level 1 under `seededRandom(k)`, each go's info line checked. */
  function levelOneMoves(k: number): string[] {
    const { send } = rig({ k, stepMs: 100 });
    send("setoption name Skill Level value 1");
    const moves: string[] = [];
    for (const line of goes) {
      const written = send(line);
      if (!line.startsWith("go")) continue;
      expect(written).toHaveLength(2);
      expect(written[0]).not.toContain(" score ");
      const info = parseLevelInfo(written[0]);
      expect(written[1]).toBe(`bestmove ${info.move}`);
      moves.push(info.move);
    }
    return moves;
  }

  it("precondition: seededRandom(2)'s three gos take both paths (blunder, engine, engine)", () => {
    const draws = firstDraws(2, 3);
    expect(draws.some((d) => d < LEVELS[1].blunderRate)).toBe(true);
    expect(draws.some((d) => d >= LEVELS[1].blunderRate)).toBe(true);
  });

  it("two sessions on the same seededRandom(k) write the same bestmove sequence", () => {
    const first = levelOneMoves(2);
    expect(first).toHaveLength(3);
    expect(levelOneMoves(2)).toEqual(first);
    expect(levelOneMoves(3)).toHaveLength(3); // a different k may differ; nothing asserted on it
  });

  it("go depth 3 at level 1: one info string naming the dropped limit, then a bestmove", () => {
    const { send } = rig({ k: 1, stepMs: 10 });
    send("setoption name Skill Level value 1");
    send("position startpos");
    const lines = send("go depth 3");
    expect(lines).toHaveLength(3);
    expect(lines[0]).toMatch(/^info string .*depth/);
    const info = parseLevelInfo(lines[1]);
    expect(lines[2]).toBe(`bestmove ${info.move}`);
    expect(legalFrom(START_FEN)).toContain(info.move);
  });

  it("go depth 3 at level 5 reports depth 3 (ABC-167 A7; level 3 now drops the limit)", () => {
    const { send } = rig({ stepMs: 50 });
    send("setoption name Skill Level value 5");
    send("position startpos");
    const lines = send("go depth 3");
    expect(lines).toHaveLength(2);
    expect(parseInfo(lines[0]).depth).toBe(3);
  });
});

/** The levels that blunder (`LEVELS[n].blunderRate > 0`), read from the table, not by number. */
const BLUNDER_LEVELS = (Object.keys(LEVELS) as `${keyof typeof LEVELS}`[])
  .map((key) => Number(key) as keyof typeof LEVELS)
  .filter((n) => LEVELS[n].blunderRate > 0);

describe("ABC-171 A8 — no reseed, and one draw per blunder-level search", () => {
  it("ucinewgame draws 0 times; each level-1 go draws exactly one seed; level 5 draws none", () => {
    const { send, draws } = rig({ k: 1 });
    send("setoption name Skill Level value 1");
    send("ucinewgame");
    expect(draws.count).toBe(0);
    send("position startpos");
    send("go movetime 1000");
    expect(draws.count).toBe(1);
    send("ucinewgame");
    expect(draws.count).toBe(1);
    send("go movetime 1000");
    expect(draws.count).toBe(2);
    send("setoption name Skill Level value 5");
    send("go movetime 100");
    expect(draws.count).toBe(2);
  });

  it("every blunder level's searched go draws exactly one seed (a book hit draws 0: A13b)", () => {
    expect(BLUNDER_LEVELS.length).toBeGreaterThan(0);
    const { send, draws } = rig({ k: 1 });
    send("position startpos");
    for (const [index, level] of BLUNDER_LEVELS.entries()) {
      send(`setoption name Skill Level value ${level}`);
      const lines = send("go movetime 1000");
      expect(lines.at(-1)).toMatch(/^bestmove [a-h][1-8][a-h][1-8]/);
      expect(draws.count).toBe(index + 1);
    }
  });
});

describe("ABC-174 A5 — UCI reads the re-cut table (ADR-0045 D4, D11, D12)", () => {
  it("the Skill Level line's default is DEFAULT_LEVEL, built from the constant", () => {
    const { send } = rig();
    expect(send("uci")).toContain(
      `option name Skill Level type spin default ${DEFAULT_LEVEL} min 1 max 7`,
    );
  });

  it("the Skill Level line is literally default 5 min 1 max 7", () => {
    const { send } = rig();
    expect(send("uci")).toContain("option name Skill Level type spin default 5 min 1 max 7");
  });

  it("at the default, a bare go takes the chooseMove path: score, and time within 4 000 ms", () => {
    const { send, draws } = rig();
    send("position startpos");
    const lines = send("go");
    expect(lines).toHaveLength(2);
    const info = parseInfo(lines[0]);
    expect(lines[0]).toContain(" score ");
    expectWithin(info.time, 4_000);
    expect(lines[1]).toBe(`bestmove ${info.move}`);
    expect(draws.count).toBe(0);
  });

  it("at the default, go depth 3 reports depth 3 (D12)", () => {
    const { send } = rig({ stepMs: 50 });
    send("position startpos");
    const lines = send("go depth 3");
    expect(lines).toHaveLength(2);
    expect(parseInfo(lines[0]).depth).toBe(3);
  });

  for (const level of [3, 4] as const) {
    it(`at skill ${level}, go depth 3: one info string naming depth, a level line with no score, bestmove`, () => {
      const { send } = rig({ k: 1 });
      expect(send(`setoption name Skill Level value ${level}`)).toEqual([]);
      send("position startpos");
      const lines = send("go depth 3");
      expect(lines).toHaveLength(3);
      expect(lines[0]).toMatch(/^info string .*depth/);
      expect(lines[1]).not.toContain(" score ");
      const info = parseLevelInfo(lines[1]);
      expect(lines[2]).toBe(`bestmove ${info.move}`);
      expect(legalFrom(START_FEN)).toContain(info.move);
    });
  }
});

// ---------------------------------------------------------------------------------------------
// `ABC-212` A9 (`ADR-0045` § AMENDMENT A4) — `Skill Level` 6 and 7, under `A12`'s two arms
// (§ Amendment 2026-10-24 item 2). No level-6 or level-7 search runs on the real clock here.
// - SEARCH arm: the bare `go` at 7 runs the real engine on the virtual clock at step = G ÷ 30, read
//   against `ABC-167` `A5`'s bound, G <= time <= G + 2 · step. It is the row that crosses the
//   engine's own clamp (`HARD_CEILING_MS`), so it keeps the search. `go depth 3` stops at depth 3.
// - BUDGET-READ arm (`AR-212-LANE`, `NFR-008`): every other row reads the budget `go` hands to
//   `chooseMove` and does not search. That budget is exactly G; the time the engine then takes to
//   honour a budget is `ABC-167` `A5`'s row, at levels 1-5 and at the bare `go` at 7 above.
// ---------------------------------------------------------------------------------------------

describe("ABC-212 A9 — Skill Level reaches 7, and levels 6-7 take the rate-0 path", () => {
  // The budget-read rows replace `chooseMove` for one call; restore the call-through after each row
  // so no stub can leak into a later row, even one that failed before its `go`.
  afterEach(() => {
    vi.mocked(chooseMove).mockReset();
  });

  /** One fresh session at `level`, step G ÷ 30; the info line of `go` from the start position. */
  const searchAt = (level: 6 | 7, go: string, expectedG: number) => {
    const step = Math.floor(expectedG / 30);
    const { send, draws } = rig({ stepMs: step });
    expect(send(`setoption name Skill Level value ${level}`)).toEqual([]);
    send("position startpos");
    const lines = send(go);
    expect(lines).toHaveLength(2);
    // D11: rate 0 is `chooseMove` with a score, and draws no seed.
    expect(lines[0]).toContain(" score ");
    const info = parseInfo(lines[0]);
    expect(lines[1]).toBe(`bestmove ${info.move}`);
    expect(draws.count).toBe(0);
    return { info, step };
  };

  /**
   * `A12`'s budget-read arm: the options `go` hands to `chooseMove`, with no search. The stub
   * answers 1. e4 so the session still writes its info and bestmove lines from the engine's answer.
   */
  const budgetAt = (setup: readonly string[], go: string) => {
    const { send, draws, now } = rig({ stepMs: 1_000 });
    const handed: Array<{ budgetMs: number; maxDepth?: number; maxNodes?: number }> = [];
    const clocks: unknown[] = [];
    const e2e4 = legalMoves(parseFen(START_FEN)).find((m) => coordinateOf(m) === "e2e4") as Move;
    vi.mocked(chooseMove).mockImplementation((_position, options) => {
      clocks.push(options.now);
      handed.push({
        budgetMs: options.budgetMs,
        ...(options.maxDepth === undefined ? {} : { maxDepth: options.maxDepth }),
        ...(options.maxNodes === undefined ? {} : { maxNodes: options.maxNodes }),
      });
      return { move: e2e4, score: 0, depth: 1, nodes: 1, elapsedMs: options.budgetMs };
    });
    const setupLines = setup.map((line) => send(line));
    send("position startpos");
    const lines = send(go);
    // One engine call per `go`, on the rate-0 path: `chooseMove` itself, and no seed drawn (D11).
    expect(handed).toHaveLength(1);
    // ABC-217 A3 (QE-212L-a): the engine reads the session's one injected clock, on every shape.
    expect(clocks[0]).toBe(now);
    expect(draws.count).toBe(0);
    expect(lines.at(-1)).toBe("bestmove e2e4");
    return { handed: handed[0] as (typeof handed)[number], setupLines };
  };

  it("uci lists Skill Level default 5 min 1 max 7, max read from HARDEST_LEVEL", () => {
    const { send } = rig();
    expect(send("uci")).toContain("option name Skill Level type spin default 5 min 1 max 7");
    expect(HARDEST_LEVEL).toBe(7);
  });

  it("setoption name Skill Level value 7 sets 7: a bare go searches 30 000 ms", () => {
    const { info, step } = searchAt(7, "go", 30_000);
    expectWithin(info.time, 30_000, step);
  });

  it("a bare go at 6 hands the engine 5 000 ms", () => {
    const { handed, setupLines } = budgetAt(["setoption name Skill Level value 6"], "go");
    expect(setupLines).toEqual([[]]);
    expect(handed).toEqual({ budgetMs: 5_000 });
  });

  it("go movetime 60000 at 7 hands the engine 30 000 (the level caps G)", () => {
    const { handed } = budgetAt(["setoption name Skill Level value 7"], "go movetime 60000");
    expect(handed).toEqual({ budgetMs: 30_000 });
  });

  it("go movetime 1000 at 7 hands the engine 1 000 (G caps the level)", () => {
    const { handed } = budgetAt(["setoption name Skill Level value 7"], "go movetime 1000");
    expect(handed).toEqual({ budgetMs: 1_000 });
  });

  it("go wtime 600000 btime 600000 at 7 hands the engine min(600 000 ÷ 20, 30 000) = 30 000", () => {
    const { handed } = budgetAt(
      ["setoption name Skill Level value 7"],
      "go wtime 600000 btime 600000",
    );
    expect(handed).toEqual({ budgetMs: 30_000 });
  });

  it("go depth 3 at 7 stops at depth 3 (D12: rate 0), and the info line carries a score", () => {
    const { info } = searchAt(7, "go depth 3", 30_000);
    expect(info.depth).toBe(3);
  });

  for (const value of ["0", "8"]) {
    it(`Skill Level value ${value} at 7 keeps 7, with the 1-7 info string`, () => {
      const { handed, setupLines } = budgetAt(
        ["setoption name Skill Level value 7", `setoption name Skill Level value ${value}`],
        "go",
      );
      expect(setupLines).toEqual([
        [],
        [`info string Skill Level takes an integer 1-7, got ${value}; kept 7`],
      ]);
      expect(handed).toEqual({ budgetMs: 30_000 });
    });
  }
});

describe("ABC-171 A9 — a bad book", () => {
  const bad: ReadonlyArray<readonly [string, () => Uint8Array]> = [
    [
      "read throws",
      () => {
        throw new Error("ENOENT");
      },
    ],
    ["bytes that are not the schema", () => new TextEncoder().encode('{"format":2}')],
  ];
  for (const [name, read] of bad) {
    it(`${name}: three gos each write one legal bestmove, never throw, warn exactly once`, () => {
      const { send, warnings } = rig({ read });
      for (let i = 0; i < 3; i++) {
        let written: string[] = [];
        expect(() => {
          send("position startpos");
          written = send("go movetime 100");
        }).not.toThrow();
        const bestmoves = written.filter((line) => line.startsWith("bestmove "));
        expect(bestmoves).toHaveLength(1);
        expect(legalFrom(START_FEN)).toContain((bestmoves[0] as string).slice("bestmove ".length));
      }
      expect(warnings).toHaveLength(1);
    });
  }
});

describe("ABC-171 A10 — infinite with a book hit", () => {
  it("go infinite writes info string book and holds bestmove until stop", () => {
    const { send } = rig({ read: START_BOOK });
    send("position startpos");
    expect(send("go infinite")).toEqual(["info string book"]);
    expect(send("stop")).toEqual(["bestmove e2e4"]);
    expect(send("stop")).toEqual([]);
  });
});

// `A13` (the QE-171-a..d rows, added 2026-10-19). Step 100 wherever a search runs.

/** `A13a`'s oracle: level 1's move from the start position under `seed`, on a fresh step-100 clock. */
function levelOneOracle(seed: number): string {
  const choice = createLevel(
    { budgetMs: 100, blunderRate: LEVELS[1].blunderRate },
    { seed, now: virtualClock(100) },
  )(parseFen(START_FEN));
  if (choice === null) throw new Error("test setup: the start position has a legal move");
  return coordinateOf(choice.move);
}

describe("ABC-171 A13a — the seed oracle floor(random() * 2^32) (QE-171-a)", () => {
  const ks = [1, 2, 3, 4, 5, 6, 7, 8];
  const oracle = ks.map((k) => levelOneOracle(Math.floor(seededRandom(k)() * 2 ** 32)));

  it("non-vacuous: the oracle's moves are not all equal over k = 1..8", () => {
    expect(new Set(oracle).size).toBeGreaterThan(1);
  });

  it("non-vacuous: on some k the 2^16 seed gives a different move from the oracle's", () => {
    const scaled = ks.map((k) => levelOneOracle(Math.floor(seededRandom(k)() * 2 ** 16)));
    expect(scaled.some((move, index) => move !== oracle[index])).toBe(true);
  });

  for (const [index, k] of ks.entries()) {
    it(`seededRandom(${k}): level 1's bestmove equals the oracle's`, () => {
      const { send } = rig({ k });
      send("setoption name Skill Level value 1");
      send("position startpos");
      const lines = send("go movetime 1000");
      expect(lines).toHaveLength(2);
      const info = parseLevelInfo(lines[0]);
      expect(lines[1]).toBe(`bestmove ${info.move}`);
      expect(info.move).toBe(oracle[index]);
    });
  }
});

describe("ABC-171 A13b — a book hit at a blunder level draws 0 seeds (QE-171-b)", () => {
  it("precondition: at least one level blunders", () => {
    expect(BLUNDER_LEVELS.length).toBeGreaterThan(0);
  });

  for (const level of BLUNDER_LEVELS) {
    it(`level ${level}: exactly info string book, bestmove e2e4; no search; random drawn 0 times`, () => {
      const { send, out, draws } = rig({ k: 1, read: START_BOOK });
      expect(send(`setoption name Skill Level value ${level}`)).toEqual([]);
      send("position startpos");
      expect(send("go movetime 1000")).toEqual(["info string book", "bestmove e2e4"]);
      expect(out.some((line) => line.startsWith("info depth"))).toBe(false);
      expect(draws.count).toBe(0);
    });
  }
});

describe("ABC-171 A13c — the dropped-limit line names nodes and mate, as one line (QE-171-c)", () => {
  /** Level 1 on the start position: the lines `go` writes, with the level line and bestmove checked. */
  function droppedLines(go: string): string {
    const { send } = rig({ k: 1 });
    send("setoption name Skill Level value 1");
    send("position startpos");
    const lines = send(go);
    expect(lines).toHaveLength(3);
    expect(lines.filter((line) => line.startsWith("info string "))).toHaveLength(1);
    expect(lines[0]).toMatch(/^info string /);
    expect(lines[1]).not.toContain(" score ");
    const info = parseLevelInfo(lines[1]);
    expect(lines[2]).toBe(`bestmove ${info.move}`);
    return lines[0] as string;
  }

  it("go nodes 100: one info string naming nodes, a level info line, a bestmove", () => {
    expect(droppedLines("go nodes 100")).toMatch(/\bnodes\b/);
  });

  it("go depth 3 nodes 100 mate 2: exactly one info string naming depth, nodes and mate", () => {
    const line = droppedLines("go depth 3 nodes 100 mate 2");
    for (const token of ["depth", "nodes", "mate"])
      expect(line).toMatch(new RegExp(`\\b${token}\\b`));
  });
});

describe("ABC-171 A13d — an invalid OwnBook keeps true (QE-171-d)", () => {
  it("OwnBook value maybe on a fresh session: one info string, then the book still answers", () => {
    const { send } = rig({ read: START_BOOK });
    const written = send("setoption name OwnBook value maybe");
    expect(written).toHaveLength(1);
    expect(written[0]).toMatch(/^info string /);
    send("position startpos");
    expect(send("go movetime 1000")).toEqual(["info string book", "bestmove e2e4"]);
  });
});

describe("ABC-171 A11 — book.ts is a type-only import", () => {
  const source = readFileSync(new URL("./uci-session.ts", import.meta.url), "utf8");
  it("every import from ./book.ts is import type", () => {
    const lines = source.split("\n").filter((line) => /["']\.\/book\.ts["']/.test(line));
    expect(lines.length).toBeGreaterThan(0);
    for (const line of lines) expect(line).toMatch(/^import type \{[^}]*\} from "\.\/book\.ts";$/);
  });
});

// ---------------------------------------------------------------------------------------------
// `ABC-230` (`ADR-0054` decision 2, the `ADR-0044` D2 amendment) — `position … moves …` keeps the
// keys it replays through, and the search reads them. The engine spy calls through.
// ---------------------------------------------------------------------------------------------

describe("ABC-230 A2, A3, A5 — the session hands the search the game's prior keys", () => {
  /** `src/engine.test.ts`'s `A1` fixtures: `repeat` returns to a position that stood twice. */
  const THIRD_OCCURRENCE = [
    ["4k3/8/8/8/8/8/8/Q3K3 w - - 0 1", "a1a2 e8d8 a2a1 d8e8 a1a2 e8d8 a2a1", "d8e8"],
    ["q3k3/8/8/8/8/8/8/4K3 b - - 0 1", "a8a7 e1d1 a7a8 d1e1 a8a7 e1d1 a7a8", "d1e1"],
    ["4k3/8/8/8/8/8/8/R3K3 w - - 0 1", "a1a2 e8d8 a2a1 d8e8 a1a2 e8d8 a2a1", "d8e8"],
    ["r3k3/8/8/8/8/8/8/4K3 b - - 0 1", "a8a7 e1d1 a7a8 d1e1 a8a7 e1d1 a7a8", "d1e1"],
  ] as const;
  // `ABC-244` (`ADR-0046` § Addendum 2026-10-30, R2/R3): 1 000 here and in the CLI rows.
  /** The CLI's step in `src/cli.test.ts`'s `ABC-230` rows: one clock pattern on both surfaces. */
  const STEP_MS = 1_000;

  /** The test's own replay: the position after `moves`, and every key it passed through. */
  function replay(fen: string, moves: readonly string[]) {
    const game = newGame(fen);
    for (const text of moves) {
      const move = legalMoves(game.position).find((m) => coordinateOf(m) === text);
      if (move === undefined) throw new Error(`fixture: ${text} is not legal`);
      playMove(game, move);
    }
    return game;
  }

  /** The `priorKeys` the session handed its last `chooseMove` call. */
  const lastHanded = () => vi.mocked(chooseMove).mock.calls.at(-1)?.[1].priorKeys;

  it("A2: `position fen F moves …` then `go depth 4` plays the third occurrence at cp 0", () => {
    for (const [fen, moves, repeat] of THIRD_OCCURRENCE) {
      const { perLine } = talk([`position fen ${fen} moves ${moves}`, "go depth 4"]);
      const info = parseInfo(perLine[1]?.[0]);
      expect(info.score, fen).toBe("cp 0");
      expect(perLine[1]?.at(-1)).toBe(`bestmove ${repeat}`);
      // The same root as a bare FEN carries no history: base's move, which is not the repetition.
      const root = toFen(replay(fen, moves.split(" ")).position);
      const bare = talk([`position fen ${root}`, "go depth 4"]).perLine[1];
      expect(parseInfo(bare?.[0]).score, root).not.toBe("cp 0");
      expect(bare?.at(-1)).not.toBe(`bestmove ${repeat}`);
    }
  });

  it("A2: bestmove is byte-equal to the CLI level seam's move on the same game and clock", async () => {
    for (const [fen, moves] of THIRD_OCCURRENCE) {
      const game = replay(fen, moves.split(" "));
      const seam = createLevelSeam(
        DEFAULT_LEVEL,
        { seed: 1, now: virtualClock(STEP_MS) },
        keyHistory,
      );
      const cli = coordinateOf(await seam(game));
      const { perLine } = talk([`position fen ${fen} moves ${moves}`, "go"], STEP_MS);
      expect(perLine[1]?.at(-1), fen).toBe(`bestmove ${cli}`);
      expect(parseInfo(perLine[1]?.[0]).score).toBe("cp 0");
    }
  });

  it("A2: `position startpos moves …` hands the replayed keys, trimmed, and the search reads them", () => {
    const moves = "g1f3 g8f6 f3g1 f6g8 g1f3 g8f6 f3g1".split(" ");
    const game = replay(START_FEN, moves);
    const lines = talk([`position startpos moves ${moves.join(" ")}`, "go depth 4"]).perLine[1];
    expect(lastHanded()).toEqual(trimPriorKeys(keyHistory(game), game.position.halfmoveClock));
    expect(lastHanded()).toHaveLength(7);
    // Probe H3: same move and score as the bare root, fewer nodes (a once-seen position is cut
    // from the work, never scored a draw).
    const bare = talk([`position fen ${toFen(game.position)}`, "go depth 4"]).perLine[1];
    const [withKeys, without] = [parseInfo(lines?.[0]), parseInfo(bare?.[0])];
    expect({ move: withKeys.move, score: withKeys.score }).toEqual({
      move: without.move,
      score: without.score,
    });
    expect(withKeys.nodes).not.toBe(without.nodes);
  });

  it("A3: a bare FEN, a bare startpos and `ucinewgame` hand an empty list", () => {
    const [fen, moves] = THIRD_OCCURRENCE[0];
    talk([`position fen ${fen}`, "go depth 1"]);
    expect(lastHanded()).toEqual([]);
    talk(["position startpos", "go depth 1"]);
    expect(lastHanded()).toEqual([]);
    talk([`position fen ${fen} moves ${moves}`, "ucinewgame", "go depth 1"]);
    expect(lastHanded()).toEqual([]);
  });

  it("A3: a refused `position` holds no position and no keys; `go` does not search", () => {
    const [fen, moves] = THIRD_OCCURRENCE[0];
    vi.mocked(chooseMove).mockClear();
    const { perLine } = talk([
      `position fen ${fen} moves ${moves}`,
      `position fen ${fen} moves ${moves} e1e1`,
      "go depth 1",
    ]);
    expect(perLine[1]?.[0]).toMatch(/^info string position refused: illegal move e1e1$/);
    expect(perLine[2]).toEqual(["bestmove 0000"]);
    expect(vi.mocked(chooseMove)).not.toHaveBeenCalled();
  });

  it("A5: from a 600-ply move list, only the last 100 keys before the root are handed", () => {
    const moves = Array.from({ length: 150 }, () => "g1f3 g8f6 f3g1 f6g8")
      .join(" ")
      .split(" ");
    expect(moves).toHaveLength(600);
    const game = replay(START_FEN, moves);
    talk([`position startpos moves ${moves.join(" ")}`, "go depth 1"]);
    const keys = keyHistory(game);
    expect(lastHanded()).toHaveLength(100);
    expect(lastHanded()).toEqual(keys.slice(500, 600));
  });

  it("A5: the window starts at the last pawn move; a castling-rights change does not cut it", () => {
    const shuffle = Array.from({ length: 140 }, () => "g1f3 g8f6 f3g1 f6g8").join(" ");
    const moves = `${shuffle} e2e4 e7e5 e1e2 e8e7 e2e1 e7e8 g1f3 g8f6 f3g1 f6g8`.split(" ");
    const game = replay(START_FEN, moves);
    expect(game.position.halfmoveClock).toBe(8);
    expect(game.position.castling).toBe(0);
    talk([`position startpos moves ${moves.join(" ")}`, "go depth 1"]);
    // The 8 keys since `e7e5`, the king moves that lost the castling rights among them.
    // `ABC-241` (`ADR-0020` § AMENDMENT 2026-10-30 C3) moved the oracle: every prior key is a
    // repetition key. The oldest, after `e7e5`, carries e6 and no white pawn can take there, so it
    // is the only one of the 8 that differs from the hash list.
    expect(lastHanded()).toEqual(repetitionKeyHistory(game).slice(-9, -1));
    const differs = keyHistory(game)
      .slice(-9, -1)
      .map((key, i) => key !== lastHanded()?.[i]);
    expect(differs).toEqual([true, false, false, false, false, false, false, false]);
  });
});

// ---------------------------------------------------------------------------------------------
// `ABC-241` (`ADR-0020` § AMENDMENT 2026-10-30 C3, prior keys) — every key `parsePosition` keeps is a
// repetition key. Black's h7h5 leaves h6 with no white pawn to take it, so that position's first
// occurrence counts with its recurrences, and d8e8 makes the third. The engine spy calls through.
// ---------------------------------------------------------------------------------------------

describe("ABC-241 A4, A5 — UCI: the prior keys are repetition keys", () => {
  const FEN = "4k3/7p/8/8/8/8/8/Q3K3 b - - 0 1";
  /** The same board with a white pawn on g5: g5xh6 e.p. is legal after h7h5. */
  const TWIN = "4k3/7p/8/6P1/8/8/8/Q3K3 b - - 0 1";
  const MOVES = "h7h5 a1a2 e8d8 a2a1 d8e8 a1a2 e8d8 a2a1";
  // `ABC-244` (`ADR-0046` § Addendum 2026-10-30, R3): 100 kept, as in the CLI half.
  const STEP_MS = 100;
  const lastHanded = () => vi.mocked(chooseMove).mock.calls.at(-1)?.[1].priorKeys;
  const gameOf = (fen: string) => {
    const game = newGame(fen);
    for (const text of MOVES.split(" ")) {
      const move = legalMoves(game.position).find((m) => coordinateOf(m) === text);
      if (move === undefined) throw new Error(`fixture: ${text} is not legal`);
      playMove(game, move);
    }
    return game;
  };

  it("A4: the move that makes the third occurrence scores exactly 0; with a legal ep capture, no draw", () => {
    const { perLine } = talk([`position fen ${FEN} moves ${MOVES}`, "go depth 4"]);
    expect(parseInfo(perLine[1]?.[0]).score).toBe("cp 0");
    expect(perLine[1]?.at(-1)).toBe("bestmove d8e8");
    const twin = talk([`position fen ${TWIN} moves ${MOVES}`, "go depth 4"]).perLine[1];
    expect(parseInfo(twin?.[0]).score).not.toBe("cp 0");
    // Base's list (the hash keys) at the same root, the same depth: not a draw either.
    const game = gameOf(FEN);
    const base = chooseMove(parseFen(toFen(game.position)), {
      budgetMs: 1e9,
      maxDepth: 4,
      priorKeys: trimPriorKeys(keyHistory(game), game.position.halfmoveClock),
    });
    expect(base?.score).not.toBe(0);
  });

  it("A5: the list handed is the repetition-key list, trimmed: the h7h5 key normalised, the rest raw", () => {
    const game = gameOf(FEN);
    talk([`position fen ${FEN} moves ${MOVES}`, "go depth 1"]);
    const handed = lastHanded();
    expect(handed).toEqual(trimPriorKeys(repetitionKeyHistory(game), game.position.halfmoveClock));
    expect(handed).toHaveLength(7);
    const raw = trimPriorKeys(keyHistory(game), game.position.halfmoveClock);
    expect(handed?.map((key, i) => key !== raw[i])).toEqual([
      true,
      false,
      false,
      false,
      false,
      false,
      false,
    ]);
    // The twin's h6 can be taken: its list is the hash list, key for key.
    const twin = gameOf(TWIN);
    talk([`position fen ${TWIN} moves ${MOVES}`, "go depth 1"]);
    expect(lastHanded()).toEqual(trimPriorKeys(keyHistory(twin), twin.position.halfmoveClock));
  });

  it("A5: the CLI level seam's injected list equals UCI's, key for key, and both play d8e8", async () => {
    const game = gameOf(FEN);
    const seam = createLevelSeam(
      DEFAULT_LEVEL,
      { seed: 1, now: virtualClock(STEP_MS) },
      repetitionKeyHistory,
    );
    const cli = coordinateOf(await seam(game));
    const fromCli = lastHanded();
    const { perLine } = talk([`position fen ${FEN} moves ${MOVES}`, "go"], STEP_MS);
    expect(lastHanded()).toEqual(fromCli);
    expect(fromCli).toHaveLength(7);
    expect(cli).toBe("d8e8");
    expect(perLine[1]?.at(-1)).toBe("bestmove d8e8");
    expect(parseInfo(perLine[1]?.[0]).score).toBe("cp 0");
  });

  // `ABC-243` A6 (QE-241-a): the FEN's own key. Its a3 has no black pawn to take on it, so the FEN's
  // board recurs after d1e1 (ply 4) and d1e1 makes the third occurrence (ply 8). Under the raw hash
  // list the FEN's key carries a3 and matches neither, so base does not see the draw.
  it("A6: a FEN carrying an uncapturable ep square: its own key counts, d1e1 scores exactly 0; base's list does not", () => {
    const fen = "4k2q/8/8/8/P7/8/8/4K3 b - a3 0 1";
    const moves = "h8h7 e1d1 h7h8 d1e1 h8h7 e1d1 h7h8";
    const { perLine } = talk([`position fen ${fen} moves ${moves}`, "go depth 4"]);
    expect(parseInfo(perLine[1]?.[0]).score).toBe("cp 0");
    expect(perLine[1]?.at(-1)).toBe("bestmove d1e1");
    // Base's list (the hash keys) at the same root, the same depth: not a draw.
    const game = newGame(fen);
    for (const text of moves.split(" ")) {
      const move = legalMoves(game.position).find((m) => coordinateOf(m) === text);
      if (move === undefined) throw new Error(`fixture: ${text} is not legal`);
      playMove(game, move);
    }
    const base = chooseMove(parseFen(toFen(game.position)), {
      budgetMs: 1e9,
      maxDepth: 4,
      priorKeys: trimPriorKeys(keyHistory(game), game.position.halfmoveClock),
    });
    expect(base?.score).not.toBe(0);
  });

  it("A8: the session's one new import is gameend.ts (`ADR-0044` D2, the dated line)", () => {
    const code = readFileSync(new URL("./uci-session.ts", import.meta.url), "utf8");
    const imports = [...code.matchAll(/^import[^;]*?from\s+"(\.\/[^"]+)";/gm)].map((m) => m[1]);
    expect(imports.sort()).toEqual([
      "./apply.ts",
      "./book.ts",
      "./coordinate-move.ts",
      "./engine.ts",
      "./fen.ts",
      "./gameend.ts",
      "./levels.ts",
      "./position.ts",
      "./search.ts",
      "./transposition.ts",
      "./zobrist.ts",
    ]);
  });
});

// ---------------------------------------------------------------------------------------------
// `ABC-242` A4 (`ADR-0054` § Proposed amendment 2026-10-30) — at `Skill Level` 1, `go` plays the
// blunder that scores the third occurrence 0. Three callers on one seed, budget, virtual clock,
// position and trimmed key list: the CLI seam, the session and a direct `createLevel` call.
// Neither surface prints the scored list, so the direct call's list is where the 0 is read.
// ---------------------------------------------------------------------------------------------

describe("ABC-242 A4 — Skill Level 1: the CLI seam, UCI and a direct createLevel call agree", () => {
  /** `src/levels.test.ts`'s `ABC-242` fixtures: after `moves`, `repeat` makes the third occurrence. */
  const THIRD = [
    ["4k3/8/8/8/8/8/8/1Q2K3 w - - 0 1", "b1b2 e8d8 b2b1 d8e8 b1b2 e8d8 b2b1", "d8e8"],
    ["8/3k4/8/8/8/8/8/Q3K3 w - - 0 1", "a1a2 d7e8 a2a1 e8d7 a1a2 d7e8 a2a1", "e8d7"],
    ["q3k3/8/8/8/8/8/8/4K3 b - - 0 1", "a8a7 e1d1 a7a8 d1e1 a8a7 e1d1 a7a8", "d1e1"],
    ["8/8/8/4k3/8/7p/7P/6KR b - - 0 1", "e5d5 g1f1 d5e5 f1g1 e5f5 g1f1 f5e5", "f1g1"],
    ["6kr/7p/7P/8/4K3/8/8/8 w - - 0 1", "e4d4 g8f8 d4e4 f8g8 e4f4 g8f8 f4e4", "f8g8"],
  ] as const;
  // `ADR-0046` § Addendum 2026-10-30 R3: one step on all three callers, here and in the other file.
  /** Level 1's 100 ms at the coarsest kill-set-preserving step (the build note's R1 census). */
  const STEP_MS = 10;
  /** `seededRandom(7)`'s first draw is 0.0117, under level 1's 0.4: the move is a blunder. */
  const SEED = 7;

  it("A4: the same move from all three; UCI's nodes and depth are the direct call's, whose list carries the 0", async () => {
    expect(seededRandom(SEED)()).toBeLessThan(LEVELS[1].blunderRate);
    for (const [fen, moves, repeat] of THIRD) {
      const game = newGame(fen);
      for (const text of moves.split(" ")) {
        const move = legalMoves(game.position).find((m) => coordinateOf(m) === text);
        if (move === undefined) throw new Error(`fixture: ${text} is not legal`);
        playMove(game, move);
      }
      const root = toFen(game.position);
      const direct = createLevel(LEVELS[1], { seed: SEED, now: virtualClock(STEP_MS) })(
        parseFen(root),
        trimPriorKeys(repetitionKeyHistory(game), game.position.halfmoveClock),
      );
      expect(direct?.kind, root).toBe("blunder");
      expect(direct?.scored?.find((s) => coordinateOf(s.move) === repeat)?.score, root).toBe(0);
      const seam = createLevelSeam(
        1,
        { seed: SEED, now: virtualClock(STEP_MS) },
        repetitionKeyHistory,
      );
      const cli = coordinateOf(await seam(game));
      // The session draws its seed as floor(random() * 2^32): this `random` gives SEED exactly.
      const out: string[] = [];
      const session = createUciSession({
        write: (line) => out.push(line),
        now: virtualClock(STEP_MS),
        random: () => SEED / 2 ** 32,
        book: emptyBook(),
      });
      for (const line of [
        "setoption name Skill Level value 1",
        `position fen ${fen} moves ${moves}`,
        "go",
      ]) {
        expect(session.handleLine(line)).toBe("continue");
      }
      everyLine.push(...out);
      expect(out).toHaveLength(2);
      const info = parseLevelInfo(out[0]);
      expect(out[1]).toBe(`bestmove ${info.move}`);
      expect({ move: info.move, depth: info.depth, nodes: info.nodes }, root).toEqual({
        move: direct && coordinateOf(direct.move),
        depth: direct?.depth,
        nodes: direct?.nodes,
      });
      expect(cli, root).toBe(info.move);
    }
  });
});

// ---------------------------------------------------------------------------------------------
// ABC-220 — `TimeMode` `simple-tournament` over UCI (`ADR-0052` D1-D3, D7, as amended 2026-10-30:
// T = 22 000 ms, which is also its ceiling). Every default-lane row below runs on the virtual clock
// (`ADR-0027`); `A12`: none reads the wall clock. The clock rows replay one GUI clock: each searched
// move costs the budget the session hands `chooseMove` plus 31 ms (`AR-NFR004-A`'s bound), and a
// book move costs 0 ms. The expected figures are `ADR-0052`'s arithmetic (`raw/alloc.txt`).
// ---------------------------------------------------------------------------------------------

/** "The setting" (`ABC-220` § Acceptance criteria). */
const SIMPLE_TOURNAMENT = "setoption name TimeMode value simple-tournament";
/** `ADR-0052` D3: T, and the ceiling it equals. */
const T_MS = 22_000;
/** `AR-NFR004-A`'s overshoot bound: what each simulated search costs on top of its budget. */
const DELTA_MS = 31;
/** One 40/15 period. */
const PERIOD_MS = 900_000;

/** `ADR-0052` D2's `C`, re-derived here: the oracle the period rows check `min(T, C)` against. */
function oracleShare(time: number, increment: number, movesToGo: number): number {
  return Math.max(
    1,
    Math.min((time - 1_000 - movesToGo * 100) / movesToGo + increment, time - 1_000 - 100),
  );
}

/** `ADR-0044` D4.1-D4.2, re-derived here: base's budget at a level, for `A8`'s identity. */
function oracleLevelBudget(time: number, movesToGo: number, level: keyof typeof LEVELS): number {
  const g = Math.max(1, Math.min(time / movesToGo, time - 50));
  return Math.min(g, LEVELS[level].budgetMs);
}

interface Handed {
  readonly budgetMs: number;
  readonly maxDepth?: number;
}

/**
 * One session for the `ABC-220` rows: a counted `random` (`random` given, or `seededRandom(1)`),
 * a real book probe over `read`'s bytes, and a virtual clock. With `stub`, `chooseMove` records what
 * it is handed and answers the position's first legal move at once (the `ABC-212` budget-read arm,
 * reset after each row); without it, the real engine searches.
 */
function session220({
  stub = true,
  stepMs = 1_000,
  random = seededRandom(1),
  read = () => bookBytes({}),
}: {
  stub?: boolean;
  stepMs?: number;
  random?: () => number;
  read?: () => Uint8Array;
} = {}) {
  const out: string[] = [];
  const draws = { count: 0 };
  const handed: Handed[] = [];
  if (stub) {
    vi.mocked(chooseMove).mockImplementation((position, options) => {
      handed.push({
        budgetMs: options.budgetMs,
        ...(options.maxDepth === undefined ? {} : { maxDepth: options.maxDepth }),
      });
      const move = legalMoves(position)[0] as Move;
      return { move, score: 0, depth: 1, nodes: 1, elapsedMs: options.budgetMs };
    });
  }
  const session = createUciSession({
    write: (line) => out.push(line),
    now: virtualClock(stepMs),
    random: () => {
      draws.count++;
      return random();
    },
    book: createBookProbe({ read, warn: () => {}, random: seededRandom(7) }),
  });
  const send = (line: string): string[] => {
    const before = out.length;
    expect(session.handleLine(line)).toBe(line === "quit" ? "quit" : "continue");
    const written = out.slice(before);
    everyLine.push(...written);
    return written;
  };
  return { send, handed, draws, out };
}

interface ClockRow {
  /** What the session handed `chooseMove`, or `undefined` for a book move. */
  readonly budget: number | undefined;
  /** The clock `t` the `go` carried. */
  readonly sent: number;
  /** The clock left after the move. */
  readonly left: number;
}

/**
 * Replays one GUI clock over `plies` engine moves. Ply `p` sends `position startpos` while
 * `p <= bookPlies` (the `START_BOOK` hit) and `position startpos moves e2e4` otherwise (never in a
 * book), then `goFor(t, p)`. The clock falls by budget + `DELTA_MS` on a searched move and by 0 on a
 * book move; `addAfter` adds a period's time after the given ply.
 */
function replayClock(
  rig220: ReturnType<typeof session220>,
  plies: number,
  goFor: (time: number, ply: number) => string,
  {
    start,
    bookPlies = 0,
    addAfter = {},
  }: { start: number; bookPlies?: number; addAfter?: Record<number, number> },
): ClockRow[] {
  const { send, handed } = rig220;
  const rows: ClockRow[] = [];
  let time = start;
  for (let ply = 1; ply <= plies; ply++) {
    const before = handed.length;
    expect(send(ply <= bookPlies ? "position startpos" : "position startpos moves e2e4")).toEqual(
      [],
    );
    const lines = send(goFor(time, ply));
    expect(lines.at(-1)).toMatch(/^bestmove [a-h][1-8][a-h][1-8]/);
    expect(handed.length - before, `ply ${ply}: engine calls`).toBe(ply <= bookPlies ? 0 : 1);
    const budget = ply <= bookPlies ? undefined : (handed[before] as Handed).budgetMs;
    const sent = time;
    time -= budget === undefined ? 0 : budget + DELTA_MS;
    rows.push({ budget, sent, left: time });
    time += addAfter[ply] ?? 0;
  }
  return rows;
}

/** 40/15 with `movestogo`: ply `p` of a period carries `movestogo` 41 - p. */
const periodGo = (time: number, ply: number): string =>
  `go wtime ${time} btime ${time} movestogo ${40 - ((ply - 1) % 40)}`;

describe("ABC-220 — TimeMode simple-tournament over UCI (ADR-0052)", () => {
  afterEach(() => {
    vi.mocked(chooseMove).mockReset();
  });

  describe("A1 — offered, off by default", () => {
    it("uci writes the TimeMode combo byte-exact, after Skill Level (byte-identical) and before uciok", () => {
      const { send } = session220();
      const reply = send("uci");
      const at = reply.indexOf(
        "option name TimeMode type combo default level var level var simple-tournament",
      );
      expect(at).toBeGreaterThan(-1);
      expect(reply[at - 1]).toBe("option name Skill Level type spin default 5 min 1 max 7");
      expect(reply[at + 1]).toBe("uciok");
      expect(reply.filter((line) => line.includes("TimeMode"))).toHaveLength(1);
    });

    it("uci-clock-mode is not offered at this build (ABC-221)", () => {
      const { send } = session220();
      expect(send("uci").join("\n")).not.toContain("uci-clock-mode");
    });
  });

  describe("A2 — no clock gives T", () => {
    for (const go of ["go", "go infinite", "go depth 4"]) {
      it(`${go} hands the search 22 000 ms`, () => {
        const rig220 = session220();
        rig220.send(SIMPLE_TOURNAMENT);
        rig220.send("position startpos moves e2e4");
        rig220.send(go);
        if (go === "go infinite") expect(rig220.send("stop")).toHaveLength(1);
        expect(rig220.handed.map(({ budgetMs }) => budgetMs)).toEqual([T_MS]);
      });
    }
  });

  describe("A3-A5 — whole periods on one replayed clock", () => {
    it("A3: one 40/15 period from 900 000 ms, movestogo 40..1, no book: T on every move, 18 760 ms left, 97.9 % used", () => {
      const rig220 = session220();
      rig220.send(SIMPLE_TOURNAMENT);
      const rows = replayClock(rig220, 40, periodGo, { start: PERIOD_MS });
      expect(rows.map(({ budget }) => budget)).toEqual(Array(40).fill(T_MS));
      // C starts at 22 375 and only grows, so T binds on every move.
      const shares = rows.map(({ sent }, index) => oracleShare(sent, 0, 40 - index));
      expect(shares[0]).toBe(22_375);
      for (let index = 1; index < shares.length; index++) {
        expect(shares[index] as number).toBeGreaterThanOrEqual(shares[index - 1] as number);
      }
      expect(rows.at(-1)?.left).toBe(18_760);
      expect(Math.min(...rows.map(({ left }) => left))).toBeGreaterThanOrEqual(18_000);
      for (const { left } of rows) expect(left).toBeGreaterThanOrEqual(1_000);
      const used = (PERIOD_MS - (rows.at(-1)?.left as number)) / PERIOD_MS;
      expect(used).toBeGreaterThanOrEqual(0.75);
      expect(used.toFixed(3)).toBe("0.979");
    });

    it("A4: the same period with its first 6 moves from the book: 83.2 % used, every move leaves >= 18 000 ms", () => {
      const rig220 = session220({ read: START_BOOK });
      rig220.send(SIMPLE_TOURNAMENT);
      const rows = replayClock(rig220, 40, periodGo, { start: PERIOD_MS, bookPlies: 6 });
      expect(rows.slice(0, 6).map(({ budget }) => budget)).toEqual(Array(6).fill(undefined));
      expect(rows.slice(6).map(({ budget }) => budget)).toEqual(Array(34).fill(T_MS));
      for (const { left } of rows) expect(left).toBeGreaterThanOrEqual(18_000);
      const used = (PERIOD_MS - (rows.at(-1)?.left as number)) / PERIOD_MS;
      expect(used).toBeGreaterThanOrEqual(0.75);
      expect(used.toFixed(3)).toBe("0.832");
    });

    it("A5: no movestogo, 40 moves from 900 000 ms: every move leaves >= 1 000 ms, >= 75 % used; T binds for 21 moves, then C", () => {
      const rig220 = session220();
      rig220.send(SIMPLE_TOURNAMENT);
      const rows = replayClock(rig220, 40, (time) => `go wtime ${time} btime ${time}`, {
        start: PERIOD_MS,
      });
      for (const { left } of rows) expect(left).toBeGreaterThanOrEqual(1_000);
      // T binds while C = (t - 3 000) / 20 >= 22 000; afterwards the budget is C itself.
      expect(rows.slice(0, 21).map(({ budget }) => budget)).toEqual(Array(21).fill(T_MS));
      for (const { budget, sent } of rows.slice(21)) {
        expect(budget).toBe(oracleShare(sent, 0, 20));
        expect(budget as number).toBeLessThan(T_MS);
      }
      const left = rows.at(-1)?.left as number;
      expect((PERIOD_MS - left) / PERIOD_MS).toBeGreaterThanOrEqual(0.75);
      // The record (BA/PM: "about 166 s"): the clock left after move 40, to the ms (166 517.12).
      expect(Math.round(left)).toBe(166_517);
    });
  });

  describe("A6 — the hard ceiling: no go hands the search more than 22 000 ms", () => {
    const rows: ReadonlyArray<readonly [string, number]> = [
      ["go movetime 30000", T_MS],
      ["go infinite", T_MS],
      ["go", T_MS],
      ["go wtime 3600000 btime 3600000 movestogo 40", T_MS],
      ["go movetime 5000", 5_000],
    ];
    for (const [go, budget] of rows) {
      it(`${go} -> ${budget}; the engine's deadline is start + ${budget} <= start + 22 000`, () => {
        const rig220 = session220();
        rig220.send(SIMPLE_TOURNAMENT);
        rig220.send("position startpos moves e2e4");
        rig220.send(go);
        if (go === "go infinite") rig220.send("stop");
        expect(rig220.handed.map(({ budgetMs }) => budgetMs)).toEqual([budget]);
        // The deadline the engine is handed is start + min(budgetMs, HARD_CEILING_MS) (engine.ts).
        expect(Math.min(budget, HARD_CEILING_MS)).toBeLessThanOrEqual(T_MS);
      });
    }

    it("the 1-hour clock's C is 89 875, so T binds there", () => {
      expect(oracleShare(3_600_000, 0, 40)).toBe(89_875);
    });

    it("the real engine on a step-1 000 clock: a bare go reports time in [22 000, 22 000 + 2 x 1 000]", () => {
      const { send } = session220({ stub: false, stepMs: 1_000 });
      send(SIMPLE_TOURNAMENT);
      send("position startpos moves e2e4");
      const lines = send("go");
      expect(lines).toHaveLength(2);
      const info = parseInfo(lines[0]);
      expectWithin(info.time, T_MS, 1_000);
      expect(lines[1]).toBe(`bestmove ${info.move}`);
    });
  });

  describe("A7 — the safe share C binds a short clock", () => {
    it("go wtime 3000 btime 3000 movestogo 1 -> 1 900 ms, and the move leaves 1 069 ms", () => {
      const rig220 = session220();
      rig220.send(SIMPLE_TOURNAMENT);
      const [row] = replayClock(rig220, 1, () => "go wtime 3000 btime 3000 movestogo 1", {
        start: 3_000,
      });
      expect(row?.budget).toBe(1_900);
      expect(row?.left).toBe(1_069);
    });

    it("the increment comes back whole: go wtime 10000 btime 10000 winc 2000 binc 2000 movestogo 10 -> 2 800 ms", () => {
      const rig220 = session220();
      rig220.send(SIMPLE_TOURNAMENT);
      rig220.send("position startpos moves e2e4");
      rig220.send("go wtime 10000 btime 10000 winc 2000 binc 2000 movestogo 10");
      expect(rig220.handed.map(({ budgetMs }) => budgetMs)).toEqual([2_800]);
      expect(oracleShare(10_000, 2_000, 10)).toBe(2_800);
    });

    it("the side to move's clock: black reads btime and binc (go wtime 900000 btime 3000 winc 9000 binc 0 movestogo 1 -> 1 900)", () => {
      const rig220 = session220();
      rig220.send(SIMPLE_TOURNAMENT);
      rig220.send("position startpos moves e2e4");
      rig220.send("go wtime 900000 btime 3000 winc 9000 binc 0 movestogo 1");
      expect(rig220.handed.map(({ budgetMs }) => budgetMs)).toEqual([1_900]);
    });

    it("the hard stop on the clock left: go wtime 3000 btime 3000 winc 500 binc 500 movestogo 1 -> 1 900, not the spread's 2 400", () => {
      const rig220 = session220();
      rig220.send(SIMPLE_TOURNAMENT);
      rig220.send("position startpos moves e2e4");
      rig220.send("go wtime 3000 btime 3000 winc 500 binc 500 movestogo 1");
      expect(rig220.handed.map(({ budgetMs }) => budgetMs)).toEqual([1_900]);
    });

    it("go wtime 800 btime 800 -> 1 ms", () => {
      const rig220 = session220();
      rig220.send(SIMPLE_TOURNAMENT);
      rig220.send("position startpos moves e2e4");
      rig220.send("go wtime 800 btime 800");
      expect(rig220.handed.map(({ budgetMs }) => budgetMs)).toEqual([1]);
    });

    it("go wtime 800 btime 800 on the real engine still returns a legal move (its unabortable depth 1)", () => {
      const { send } = session220({ stub: false, stepMs: 10 });
      send(SIMPLE_TOURNAMENT);
      send("position startpos moves e2e4");
      const lines = send("go wtime 800 btime 800");
      expect(lines).toHaveLength(2);
      const info = parseInfo(lines[0]);
      expect(info.depth).toBeGreaterThanOrEqual(1);
      expect(lines[1]).toBe(`bestmove ${info.move}`);
      expect(legalMoves(afterMoves(START_FEN, ["e2e4"])).map(coordinateOf)).toContain(info.move);
    });

    it("tc=40/60 over 3 periods (60 000 ms, movestogo 40..1, +60 000 after moves 40 and 80): C binds on every move, every move leaves >= 1 000 ms", () => {
      const rig220 = session220();
      rig220.send(SIMPLE_TOURNAMENT);
      const rows = replayClock(rig220, 120, periodGo, {
        start: 60_000,
        addAfter: { 40: 60_000, 80: 60_000 },
      });
      for (const [index, { budget, sent, left }] of rows.entries()) {
        expect(budget).toBe(oracleShare(sent, 0, 40 - (index % 40)));
        expect(budget as number).toBeLessThan(T_MS);
        expect(left).toBeGreaterThanOrEqual(1_000);
      }
      // The closest call is each period's last move: RESERVE + OVERHEAD - 31.
      for (const ply of [40, 80, 120]) {
        expect(rows[ply - 1]?.left).toBeCloseTo(1_069, 6);
      }
    });
  });

  describe("A8 — levels unchanged (EPIC-009 M3)", () => {
    it("LEVELS, DEFAULT_LEVEL, the Skill Level default and HARD_CEILING_MS hold their base values", () => {
      expect(
        Object.entries(LEVELS).map(([level, { budgetMs, blunderRate }]) => [
          level,
          budgetMs,
          blunderRate,
        ]),
      ).toEqual([
        ["1", 100, 0.4],
        ["2", 180, 0.2],
        ["3", 330, 0.1],
        ["4", 1_000, 0.05],
        ["5", 4_000, 0],
        ["6", 5_000, 0],
        ["7", 30_000, 0],
      ]);
      expect(DEFAULT_LEVEL).toBe(5);
      expect(HARD_CEILING_MS).toBe(32_000);
      const { send } = session220();
      expect(send("uci")).toContain("option name Skill Level type spin default 5 min 1 max 7");
    });

    /**
     * A constant `random` makes every `go`'s seed the same; this one's first draw is at or above
     * every level's blunder rate, so each level's every `go` takes `createLevel`'s engine path and
     * hands `chooseMove` exactly the budget the session computed.
     */
    const NO_BLUNDER = 0.5;

    it("precondition: NO_BLUNDER's seed draws above every blunder rate", () => {
      const first = seededRandom(Math.floor(NO_BLUNDER * 2 ** 32))();
      for (const { blunderRate } of Object.values(LEVELS)) {
        expect(first).toBeGreaterThanOrEqual(blunderRate);
      }
    });

    for (const setup of [[], ["setoption name TimeMode value level"]] as const) {
      for (const level of [1, 2, 3, 4, 5, 6, 7] as const) {
        const how = setup.length === 0 ? "TimeMode unset" : "TimeMode level";
        it(`${how}, Skill Level ${level}: A3's period gives base's budget on every go, row for row`, () => {
          const rig220 = session220({ random: () => NO_BLUNDER });
          for (const line of setup) expect(rig220.send(line)).toEqual([]);
          expect(rig220.send(`setoption name Skill Level value ${level}`)).toEqual([]);
          const rows = replayClock(rig220, 40, periodGo, { start: PERIOD_MS });
          expect(rows.map(({ budget }) => budget)).toEqual(
            rows.map(({ sent }, index) => oracleLevelBudget(sent, 40 - index, level)),
          );
        });
      }
    }
  });

  describe("A9 — rate 0: Skill Level is not read while TimeMode is not level", () => {
    it("Skill Level 1, 10 non-book moves of A3's period: random is called 0 times, every budget is A3's", () => {
      const rig220 = session220();
      rig220.send(SIMPLE_TOURNAMENT);
      expect(rig220.send("setoption name Skill Level value 1")).toEqual([]);
      const rows = replayClock(rig220, 10, periodGo, { start: PERIOD_MS });
      expect(rig220.draws.count).toBe(0);
      expect(rows.map(({ budget }) => budget)).toEqual(Array(10).fill(T_MS));
      expect(rows.map(({ left }) => left)).toEqual(
        Array.from({ length: 10 }, (_, index) => PERIOD_MS - (index + 1) * (T_MS + DELTA_MS)),
      );
    });

    it("Skill Level 7: go movetime 30000 is capped by T, not by the level's 30 000", () => {
      const rig220 = session220();
      rig220.send(SIMPLE_TOURNAMENT);
      rig220.send("setoption name Skill Level value 7");
      rig220.send("position startpos moves e2e4");
      rig220.send("go movetime 30000");
      expect(rig220.handed.map(({ budgetMs }) => budgetMs)).toEqual([T_MS]);
    });

    it("Skill Level 1, go depth 3 on the real engine: the rate-0 line (a score), depth <= 3, no dropped-limit line, no draw", () => {
      const rig220 = session220({ stub: false, stepMs: 100 });
      rig220.send(SIMPLE_TOURNAMENT);
      rig220.send("setoption name Skill Level value 1");
      rig220.send("position startpos moves e2e4");
      const lines = rig220.send("go depth 3");
      expect(lines).toHaveLength(2);
      const info = parseInfo(lines[0]);
      expect(info.depth).toBeLessThanOrEqual(3);
      expect(lines[1]).toBe(`bestmove ${info.move}`);
      expect(rig220.draws.count).toBe(0);
    });

    it("Skill Level 6 set in the setting takes effect when TimeMode returns to level: a bare go is level 6's 5 000", () => {
      const rig220 = session220();
      rig220.send(SIMPLE_TOURNAMENT);
      expect(rig220.send("setoption name Skill Level value 6")).toEqual([]);
      rig220.send("position startpos moves e2e4");
      rig220.send("go");
      expect(rig220.send("setoption name TimeMode value level")).toEqual([]);
      rig220.send("go");
      expect(rig220.handed.map(({ budgetMs }) => budgetMs)).toEqual([T_MS, 5_000]);
    });
  });

  describe("A10 — the option's refusals", () => {
    it("setoption name timemode value simple-tournament (lower-case name) is accepted, silently", () => {
      const rig220 = session220();
      expect(rig220.send("setoption name timemode value simple-tournament")).toEqual([]);
      rig220.send("position startpos moves e2e4");
      rig220.send("go");
      expect(rig220.handed.map(({ budgetMs }) => budgetMs)).toEqual([T_MS]);
    });

    for (const value of ["Simple-Tournament", "uci-clock-mode", "7"]) {
      for (const from of ["level", "simple-tournament"] as const) {
        it(`value ${value} from ${from}: exactly one info string naming the offered values and the value got; ${from} kept`, () => {
          const rig220 = session220();
          if (from === "simple-tournament") rig220.send(SIMPLE_TOURNAMENT);
          expect(rig220.send(`setoption name TimeMode value ${value}`)).toEqual([
            `info string TimeMode takes level or simple-tournament, got ${value}; kept ${from}`,
          ]);
          rig220.send("position startpos moves e2e4");
          rig220.send("go");
          // Kept: T in the setting; the default level 5's 4 000 otherwise.
          expect(rig220.handed.map(({ budgetMs }) => budgetMs)).toEqual([
            from === "level" ? 4_000 : T_MS,
          ]);
        });
      }
    }

    it("no value: one info string naming nothing; a control character in a value is dropped from the line", () => {
      const rig220 = session220();
      expect(rig220.send("setoption name TimeMode")).toEqual([
        "info string TimeMode takes level or simple-tournament, got nothing; kept level",
      ]);
      const lines = rig220.send("setoption name TimeMode value simple-tournament\x1b[31m");
      expect(lines).toHaveLength(1);
      expectPrintable(lines[0]);
      expect(lines[0]).toBe(
        "info string TimeMode takes level or simple-tournament, got simple-tournament[31m; kept level",
      );
    });

    it("the setting survives ucinewgame", () => {
      const rig220 = session220();
      rig220.send(SIMPLE_TOURNAMENT);
      expect(rig220.send("ucinewgame")).toEqual([]);
      rig220.send("position startpos moves e2e4");
      rig220.send("go");
      expect(rig220.handed.map(({ budgetMs }) => budgetMs)).toEqual([T_MS]);
    });
  });

  describe("A13 — busy isready (ADR-0052 D7), default lane", () => {
    it("isready that arrives mid-search is answered once, after the bestmove, in order", () => {
      // The `src/uci.ts` shape: input lines queue while `go` runs on the one thread. The clock puts
      // `isready` on the queue at its 3rd reading inside the real search, as a GUI would send it.
      const queue = [SIMPLE_TOURNAMENT, "position startpos moves e2e4", "go"];
      const clock = virtualClock(500);
      let searching = false;
      let readings = 0;
      let queuedMidSearch = false;
      const out: string[] = [];
      const session = createUciSession({
        write: (line) => out.push(line),
        now: () => {
          if (searching && ++readings === 3) {
            queue.push("isready");
            queuedMidSearch = true;
          }
          return clock();
        },
        random: seededRandom(1),
        book: emptyBook(),
      });
      while (queue.length > 0) {
        const line = queue.shift() as string;
        searching = line === "go";
        session.handleLine(line);
        searching = false;
      }
      everyLine.push(...out);
      expect(queuedMidSearch).toBe(true);
      expect(out).toHaveLength(3);
      const info = parseInfo(out[0]);
      expectWithin(info.time, T_MS, 500);
      expect(out.slice(1)).toEqual([`bestmove ${info.move}`, "readyok"]);
    });
  });
});

/**
 * `ABC-220` `A11` — `simple-tournament`'s wall on the REAL clock. OPT-IN: `ENGINE_DEEP=1`, never in
 * the default lane, run ALONE (~2 min: 5 searches of 22 s). Unset, these cases are NOT DEFINED (the
 * `ABC-119` form). Each fixed position is searched once through the session at T on `Date.now`;
 * each must return in < 22 500 ms of wall (22 s read to the whole second, the 2026-10-30 reading).
 * The max and its excess over 22 000 ms (the overshoot, set against `AR-NFR004-A`'s ~31 ms) are
 * printed for the record.
 */
const RUN_ENGINE_DEEP = process.env.ENGINE_DEEP === "1";

if (RUN_ENGINE_DEEP) {
  describe("ABC-220 A11 — five searches at T = 22 000 on the real clock [deep, ENGINE_DEEP=1]", () => {
    const fixtures: ReadonlyArray<readonly [string, string]> = [
      ["start", START_FEN],
      ["after 1. e4 e5", "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2"],
      ["italian", "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4"],
      ["kiwipete", KIWIPETE],
      ["cpw position 4", "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1"],
    ];
    const walls: number[] = [];
    for (const [name, fen] of fixtures) {
      it(`${name}: returns in < 22 500 ms of wall`, () => {
        const out: string[] = [];
        const session = createUciSession({
          write: (line) => out.push(line),
          now: Date.now,
          random: seededRandom(1),
          book: emptyBook(),
        });
        session.handleLine(SIMPLE_TOURNAMENT);
        session.handleLine(`position fen ${fen}`);
        const started = performance.now();
        session.handleLine("go");
        const wall = performance.now() - started;
        walls.push(wall);
        console.log(`ABC-220 A11 ${name}: wall ${wall.toFixed(1)} ms; ${out[0]}`);
        expect(out.at(-1)).toMatch(/^bestmove [a-h][1-8][a-h][1-8]/);
        expect(wall).toBeLessThan(22_500);
      }, 60_000);
    }

    it("reports the max wall and its excess over 22 000 ms (the overshoot, against AR-NFR004-A)", () => {
      expect(walls).toHaveLength(5);
      const max = Math.max(...walls);
      console.log(
        `ABC-220 A11 max wall ${max.toFixed(1)} ms, excess over 22 000 ms ${(max - T_MS).toFixed(1)} ms`,
      );
      expect(max).toBeLessThan(22_500);
    });
  });
}

describe("ABC-167 A11 — capability-free, and M4", () => {
  const source = readFileSync(new URL("./uci-session.ts", import.meta.url), "utf8");

  for (const token of [
    "process.",
    'from "node:',
    "spawn",
    "exec(",
    "fetch(",
    "eval(",
    "new Function",
    "Date.now",
    "Math.random",
  ]) {
    it(`holds no ${token}`, () => {
      expect(source.includes(token)).toBe(false);
    });
  }

  it("A11-g1: imports none of the fenced modules, in any import form or quote", () => {
    // `from "<m>"`, the side-effect `import "<m>"` and `import("<m>")`, with either quote.
    const imports = [...source.matchAll(/\b(?:from|import)\s*\(?\s*["'](\.\/[^"']+)["']/g)].map(
      (m) => m[1],
    );
    expect(imports.length).toBeGreaterThan(0);
    for (const fenced of [
      "history.ts",
      "turn-loop.ts",
      "book-engine.ts",
      "level-seam.ts",
      "book-file.ts",
      "line-input.ts",
    ]) {
      expect(imports).not.toContain(`./${fenced}`);
    }
  });

  // Declared last, so it reads the lines every row above wrote (vitest runs a file in order).
  it("every line written in every row starts with an M4 prefix", () => {
    expect(everyLine.length).toBeGreaterThan(0);
    for (const line of everyLine) {
      expect(line).toMatch(/^(id|option|uciok|readyok|info|bestmove)( |$)/);
    }
  });
});
