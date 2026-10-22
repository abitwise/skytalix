/**
 * `ABC-167` — the UCI protocol as a pure module (`ADR-0044` D2-D4, D12). Every row drives
 * `handleLine` with strings, collects `write`'s lines and injects a ticking virtual clock
 * (`ADR-0027`), so every figure below is exact on every host and no row reads the wall clock.
 */

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { makeMove } from "./apply.ts";
import { type BookProbe, createBookProbe } from "./book.ts";
import { parseFen } from "./fen.ts";
import { isInCheck, legalMoves } from "./legal.ts";
import { createLevel, DEFAULT_LEVEL, LEVELS, seededRandom } from "./levels.ts";
import type { Move } from "./moves.ts";
import { type Position, squareName } from "./position.ts";
import { MATE_SCORE } from "./search.ts";
import { createUciSession, type UciSessionOptions } from "./uci-session.ts";
import { virtualClock } from "./virtual-clock.ts";
import { zobristKey } from "./zobrist.ts";

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
  it("A1: uci writes id name, id author, then (ABC-171 A1) the two option lines, then uciok", () => {
    expect(talk(["uci"]).out).toEqual([
      "id name skytalix",
      "id author Olger Oeselg",
      "option name OwnBook type check default true",
      "option name Skill Level type spin default 5 min 1 max 5",
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
    ["capped by the default level 5", "position startpos", 3_000, 100],
    ["a bare go", "position startpos", 3_000, 100],
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

  it("A6-d1: go ponder holds at the capped ceiling; ponderhit releases once", () => {
    const { perLine } = talk(["position startpos", "go ponder", "ponderhit", "ponderhit"], 100);
    expect(perLine[1]).toHaveLength(1);
    const info = parseInfo(perLine[1]?.[0]);
    expect(info.time).toBeGreaterThanOrEqual(3_000);
    expect(info.time).toBeLessThanOrEqual(3_000 + 2 * 100);
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
      expect(info.time).toBeGreaterThanOrEqual(3_000); // dropped: no limit, G is the capped ceiling
      expect(out[2]).toBe(`bestmove ${info.move}`);
    });
  }

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
    expectWarnedSearch(perLine[1], 3_000, 3_000 + 2 * 100);
  });

  it("A7-f3: go movetime 1e2 and movestogo 0 are dropped with one info string", () => {
    const bare = talk(["position startpos", "go movetime 1e2"], 100).perLine[1];
    expectWarnedSearch(bare, 3_000, 3_000 + 2 * 100);
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
  return { out, warnings, reads, draws, send };
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
  it("uci writes exactly 5 lines, the two options after the id lines and before uciok", () => {
    const { send } = rig();
    expect(send("uci")).toEqual([
      "id name skytalix",
      "id author Olger Oeselg",
      "option name OwnBook type check default true",
      "option name Skill Level type spin default 5 min 1 max 5",
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

  for (const value of ["0", "6", "2.5", "x", "constructor"]) {
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

    const level = rig();
    expect(level.send("setoption name Hash value 64")).toEqual([]);
    expectWithin(levelTime(level.send, 5), 3_000); // still the default level 5
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
  for (const [level, budget] of [
    [1, 100],
    [3, 330],
    [5, 3_000],
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
      `option name Skill Level type spin default ${DEFAULT_LEVEL} min 1 max 5`,
    );
  });

  it("the Skill Level line is literally default 5 min 1 max 5", () => {
    const { send } = rig();
    expect(send("uci")).toContain("option name Skill Level type spin default 5 min 1 max 5");
  });

  it("at the default, a bare go takes the chooseMove path: score, and time within 3 000 ms", () => {
    const { send, draws } = rig();
    send("position startpos");
    const lines = send("go");
    expect(lines).toHaveLength(2);
    const info = parseInfo(lines[0]);
    expect(lines[0]).toContain(" score ");
    expectWithin(info.time, 3_000);
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
