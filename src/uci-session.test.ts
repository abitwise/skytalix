/**
 * `ABC-167` — the UCI protocol as a pure module (`ADR-0044` D2-D4, D12). Every row drives
 * `handleLine` with strings, collects `write`'s lines and injects a ticking virtual clock
 * (`ADR-0027`), so every figure below is exact on every host and no row reads the wall clock.
 */

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parseFen } from "./fen.ts";
import { isInCheck, legalMoves } from "./legal.ts";
import type { Move } from "./moves.ts";
import { squareName } from "./position.ts";
import { MATE_SCORE } from "./search.ts";
import { createUciSession } from "./uci-session.ts";
import { virtualClock } from "./virtual-clock.ts";

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
}

/** Test note 1: lines in, lines out. One session per script, on its own ticking clock. */
function dialogue(lines: readonly string[], stepMs = 10): Dialogue {
  const out: string[] = [];
  const session = createUciSession({ write: (line) => out.push(line), now: virtualClock(stepMs) });
  const results = lines.map((line) => session.handleLine(line));
  return { out, results };
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

describe("ABC-167 A1-A2 — handshake and ready", () => {
  it("A1: uci writes exactly id name, id author, uciok", () => {
    expect(talk(["uci"]).out).toEqual(["id name skytalix", "id author Olger Oeselg", "uciok"]);
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
    ["movetime 100", `position fen ${START_FEN}`, 100, 1],
    ["white reads wtime", "position startpos", 50, 1],
    ["black reads btime", "position startpos moves e2e4", 450, 10],
    ["a short clock", "position startpos", 1, 1],
    ["capped by level 3", "position startpos", 3_000, 100],
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
});

describe("ABC-167 A6 — infinite waits for stop", () => {
  for (const release of ["stop", "ponderhit"]) {
    it(`go infinite holds the bestmove until ${release}; a second ${release} writes nothing`, () => {
      const held = talk(["position startpos", "go infinite"], 100).out;
      expect(held.filter((line) => line.startsWith("bestmove"))).toEqual([]);
      const { out } = talk(["position startpos", "go infinite", release], 100);
      const bestmoves = out.filter((line) => line.startsWith("bestmove"));
      expect(bestmoves).toHaveLength(1);
      expect(out.at(-1)).toBe(bestmoves[0]);
      const twice = talk(["position startpos", "go infinite", release, release], 100).out;
      expect(twice).toEqual(out);
    });
  }

  it("a stop with nothing held writes nothing", () => {
    expect(talk(["stop", "ponderhit"]).out).toEqual([]);
  });
});

describe("ABC-167 A7 — the D12 limits", () => {
  it("go depth 3 reports depth 3 on a clock where an unlimited go reaches depth >= 5", () => {
    const free = parseInfo(talk(["position startpos", "go"], 50).out[0]);
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
      const { out } = talk(["position startpos", go], 100);
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
});

describe("ABC-167 A8 — mate scores", () => {
  it("being mated next move reports score mate -1", () => {
    const position = parseFen(MATED_NEXT);
    expect(legalMoves(position).map(coordinateOf)).toEqual(["h8g8"]); // test note 3: derived
    const { out } = talk([`position fen ${MATED_NEXT}`, "go movetime 500"]);
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
});

describe("ABC-167 A10 — quit", () => {
  it('handleLine("quit") returns "quit" and writes nothing', () => {
    const { out, results } = talk(["isready", "quit"]);
    expect(results).toEqual(["continue", "quit"]);
    expect(out).toEqual(["readyok"]);
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

  it("imports none of the fenced modules", () => {
    const imports = [...source.matchAll(/from "(\.\/[^"]+)"/g)].map((m) => m[1]);
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
