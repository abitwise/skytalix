/**
 * ABC-094 — the book probe: lookup, weighted choice, safe failure. No engine in the room.
 *
 * The probe holds no capability (`ADR-0036` clause (b)): its reader, warn sink and randomness are
 * injected. This file binds them the way `ABC-095`'s composition root will: the reader is a
 * `readFileSync` of the artifact, the randomness is `seededRandom(seed)` (`ADR-0037` D2).
 *
 * Test notes 1 and 6: `A4`'s 8:1:1 entry and `A6`'s corrupt matrix are built in memory; the
 * checked-in artifact is only ever READ. No literal pick from the shipped book is pinned: `A1`
 * reads its expected moves from the file, `A2` compares two runs with each other, `A3` counts.
 */

import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import { makeMove } from "./apply.ts";
import { BOOK_MAX_BYTES, type BookProbeOptions, createBookProbe } from "./book.ts";
import { parseFen } from "./fen.ts";
import { legalMoves } from "./legal.ts";
import { seededRandom } from "./levels.ts";
import type { Move } from "./moves.ts";
import { KNIGHT, type Position, QUEEN, squareName } from "./position.ts";
import { zobristKey } from "./zobrist.ts";

const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const ARTIFACT = new URL("../data/opening-book/book.json", import.meta.url);
const ABSENT = new URL("../data/opening-book/absent-ABC-094.json", import.meta.url);
const BOOK_BYTES = readFileSync(ARTIFACT);
const BOOK = JSON.parse(BOOK_BYTES.toString("utf8")) as {
  positions: Record<string, { m: [string, number][] }>;
};

const PROMOTION_LETTER = ["", "", "n", "b", "r", "q"];
const uci = (move: Move): string =>
  `${squareName(move.from)}${squareName(move.to)}${PROMOTION_LETTER[move.promotion] ?? ""}`;
const hexKey = (position: Position): string => zobristKey(position).toString(16).padStart(16, "0");
const start = (): Position => parseFen(START_FEN);
const play = (position: Position, text: string): Position => {
  const move = legalMoves(position).find((m) => uci(m) === text);
  if (move === undefined) throw new Error(`test setup: ${text} is not legal`);
  makeMove(position, move);
  return position;
};
const encode = (text: string): Uint8Array => new TextEncoder().encode(text);
const fixture = (positions: Record<string, unknown>): Uint8Array =>
  encode(JSON.stringify({ format: 1, maxPly: 12, positions }));

/** A probe with a counting reader and a recording warn sink. */
function probeOver(read: () => Uint8Array, random: () => number = seededRandom(1)) {
  const warnings: string[] = [];
  const reads = { count: 0 };
  const options: BookProbeOptions = {
    read: () => {
      reads.count++;
      return read();
    },
    warn: (message) => warnings.push(message),
    random,
  };
  return { probe: createBookProbe(options), warnings, reads };
}

/** Calls `fn` `times` times and counts what it threw and what it returned. */
function callRepeatedly<T>(times: number, fn: () => T) {
  let thrown = 0;
  const results: T[] = [];
  for (let i = 0; i < times; i++) {
    try {
      results.push(fn());
    } catch {
      thrown++;
    }
  }
  return { thrown, results };
}

describe("ABC-094 A5 — artifact missing: no crash, exactly one warning", () => {
  it("constructs with 0 reads, then 50 calls throw 0, return nothing 50 times, warn exactly once", () => {
    const stdout = vi.spyOn(process.stdout, "write");
    const stderr = vi.spyOn(process.stderr, "write");
    try {
      const { probe, warnings, reads } = probeOver(() => readFileSync(ABSENT));
      expect(reads.count).toBe(0); // N-LOAD: construction touches nothing

      const { thrown, results } = callRepeatedly(50, () => probe.bookMove(start()));
      expect(thrown).toBe(0);
      expect(results.filter((r) => r === undefined)).toHaveLength(50);
      expect(warnings).toHaveLength(1);
      expect(reads.count).toBe(1); // the failed read is not retried per call
      expect(probe.inBook(start())).toBe(false);
      expect(warnings).toHaveLength(1);

      // The probe writes to no stream itself: its one warning goes to the injected sink, which
      // ABC-095's root binds to stderr. stdout (the board) is never touched.
      expect(stdout).not.toHaveBeenCalled();
      expect(stderr).not.toHaveBeenCalled();
    } finally {
      stdout.mockRestore();
      stderr.mockRestore();
    }
  });
});

describe("ABC-094 A6 — corrupt artifact: same outcome across the named matrix", () => {
  const startKey = hexKey(start());
  const text = BOOK_BYTES.toString("utf8");
  const oversize = new Uint8Array(1_048_577).fill(0x20); // spaces: valid JSON once a book is inside
  oversize.set(BOOK_BYTES, 0);

  const matrix: [string, Uint8Array][] = [
    ["empty file", new Uint8Array(0)],
    ["truncated mid-record", BOOK_BYTES.subarray(0, text.indexOf('"m":[', text.length >> 1) + 9)],
    ["valid JSON, not an object", encode("[1,2,3]")],
    ["valid JSON, wrong format number", encode(JSON.stringify({ format: 2, positions: {} }))],
    [
      "garbage payload: key not 16 hex digits",
      fixture({ "99116e498451762": { m: [["e2e4", 1]] } }),
    ],
    ["garbage payload: m not a list of pairs", fixture({ [startKey]: { m: "e2e4" } })],
    ["garbage payload: weight 0", fixture({ [startKey]: { m: [["e2e4", 0]] } })],
    ["garbage payload: weight not an integer", fixture({ [startKey]: { m: [["e2e4", 1.5]] } })],
    ["garbage payload: move not UCI", fixture({ [startKey]: { m: [["e4", 1]] } })],
    [
      "schema-valid move illegal in its keyed position",
      fixture({ [startKey]: { m: [["e2e5", 1]] } }),
    ],
    ["larger than NFR-006's 1 MB", oversize],
    ["invalid UTF-8", Uint8Array.of(0x7b, 0xff, 0x7d)],
  ];

  it.each(matrix)("%s: 50 calls throw 0, return nothing, warn exactly once", (_name, bytes) => {
    const { probe, warnings } = probeOver(() => bytes);
    const { thrown, results } = callRepeatedly(50, () => probe.bookMove(start()));
    expect(thrown).toBe(0);
    expect(results.every((r) => r === undefined)).toBe(true);
    expect(probe.inBook(start())).toBe(false);
    expect(warnings).toHaveLength(1);
  });

  it("the oversize input is the real book padded with whitespace, so only its size refuses it", () => {
    expect(() => JSON.parse(new TextDecoder().decode(oversize))).not.toThrow();
  });

  it("an illegal move is never handed onward, even beside legal moves in the same entry", () => {
    const bytes = fixture({
      [startKey]: {
        m: [
          ["e2e4", 1_000_000],
          ["e2e5", 1],
        ],
      },
    });
    const { probe, warnings } = probeOver(() => bytes);
    const { thrown, results } = callRepeatedly(50, () => probe.bookMove(start()));
    expect(thrown).toBe(0);
    expect(results.every((r) => r === undefined)).toBe(true);
    expect(warnings).toHaveLength(1);
  });

  it("an illegal move found later switches the book off: legal moves before, nothing after, one warning", () => {
    const afterE4 = play(start(), "e2e4");
    const bytes = fixture({
      [startKey]: { m: [["e2e4", 1]] },
      [hexKey(afterE4)]: { m: [["e2e4", 1]] }, // White's move, offered to Black
    });
    const { probe, warnings } = probeOver(() => bytes);
    const first = probe.bookMove(start());
    expect(first && uci(first)).toBe("e2e4");
    expect(warnings).toHaveLength(0);

    const { thrown, results } = callRepeatedly(50, () => probe.bookMove(play(start(), "e2e4")));
    expect(thrown).toBe(0);
    expect(results.every((r) => r === undefined)).toBe(true);
    expect(probe.bookMove(start())).toBeUndefined();
    expect(warnings).toHaveLength(1);
  });

  it("the warning carries no byte of the file: fixed text only", () => {
    const hostile = encode('{"format":1,"positions":{"\u001b[2J":{}}}');
    const { probe, warnings } = probeOver(() => hostile);
    probe.bookMove(start());
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toMatch(/^[\x20-\x7e]+$/);
  });
});

describe("ABC-094 A1 — in book: a legal book move; out of book: nothing", () => {
  it("the start position returns a legal move that is one of the artifact's entries for it", () => {
    const { probe, warnings, reads } = probeOver(() => readFileSync(ARTIFACT));
    expect(reads.count).toBe(0);
    const position = start();
    const move = probe.bookMove(position);
    expect(move).toBeDefined();
    expect(legalMoves(start()).map(uci)).toContain(uci(move as Move));
    const entry = BOOK.positions[hexKey(position)];
    expect(entry?.m.map(([text]) => text)).toContain(uci(move as Move));
    expect(probe.inBook(position)).toBe(true);
    expect(warnings).toHaveLength(0);
    expect(reads.count).toBe(1);
  });

  it("an absent key returns nothing and throws nothing", () => {
    const endgame = parseFen("8/8/8/4k3/8/8/8/4K2R w K - 0 1");
    expect(BOOK.positions[hexKey(endgame)]).toBeUndefined();
    const { probe, warnings } = probeOver(() => readFileSync(ARTIFACT));
    const { thrown, results } = callRepeatedly(10, () => probe.bookMove(endgame));
    expect(thrown).toBe(0);
    expect(results.every((r) => r === undefined)).toBe(true);
    expect(probe.inBook(endgame)).toBe(false);
    expect(warnings).toHaveLength(0);
  });

  it("a present key with an empty m (kept for its name) returns nothing and throws nothing", () => {
    // Breadth-first over book moves to the first entry whose m is empty.
    let frontier: string[][] = [[]];
    let line: string[] | undefined;
    while (line === undefined && frontier.length > 0) {
      const next: string[][] = [];
      for (const moves of frontier) {
        const position = moves.reduce(play, start());
        const entry = BOOK.positions[hexKey(position)];
        if (entry !== undefined && entry.m.length === 0) {
          line = moves;
          break;
        }
        for (const [text] of entry?.m ?? []) next.push([...moves, text]);
      }
      frontier = next;
    }
    expect(line).toBeDefined();
    const position = (line as string[]).reduce(play, start());
    const { probe, warnings } = probeOver(() => readFileSync(ARTIFACT));
    const { thrown, results } = callRepeatedly(10, () => probe.bookMove(position));
    expect(thrown).toBe(0);
    expect(results.every((r) => r === undefined)).toBe(true);
    expect(probe.inBook(position)).toBe(false);
    expect(warnings).toHaveLength(0);
  });
});

describe("ABC-094 A2 — deterministic under a fixed seed", () => {
  it("two fresh module instances, same position, artifact and seed: 100 picks identical element for element", async () => {
    const sequences: string[][] = [];
    for (let run = 0; run < 2; run++) {
      vi.resetModules();
      const fresh = (await import("./book.ts")) as typeof import("./book.ts");
      const probe = fresh.createBookProbe({
        read: () => readFileSync(ARTIFACT),
        warn: () => {},
        random: seededRandom(2026),
      });
      const position = start();
      sequences.push(Array.from({ length: 100 }, () => uci(probe.bookMove(position) as Move)));
    }
    expect(sequences[0]).toHaveLength(100);
    expect(sequences[1]).toEqual(sequences[0]);
  });
});

describe("ABC-094 A3 — variety after 1. e4 on seeds 1 to 10", () => {
  it("ten seeds, one pick each, at least 3 distinct replies", () => {
    const replies = new Set<string>();
    for (let seed = 1; seed <= 10; seed++) {
      const { probe } = probeOver(() => BOOK_BYTES, seededRandom(seed));
      replies.add(uci(probe.bookMove(play(start(), "e2e4")) as Move));
    }
    expect(replies.size).toBeGreaterThanOrEqual(3);
  });
});

describe("ABC-094 A4 — the weights are used", () => {
  it("8:1:1 over 1,000 draws from seed 42: each share within ±5 pp, exact counts recorded", () => {
    const bytes = fixture({
      [hexKey(start())]: {
        m: [
          ["e2e4", 8],
          ["d2d4", 1],
          ["g1f3", 1],
        ],
      },
    });
    const { probe } = probeOver(() => bytes, seededRandom(42));
    const counts = new Map<string, number>();
    for (let i = 0; i < 1000; i++) {
      const text = uci(probe.bookMove(start()) as Move);
      counts.set(text, (counts.get(text) ?? 0) + 1);
    }
    expect(Math.abs((counts.get("e2e4") ?? 0) / 1000 - 0.8)).toBeLessThanOrEqual(0.05);
    expect(Math.abs((counts.get("d2d4") ?? 0) / 1000 - 0.1)).toBeLessThanOrEqual(0.05);
    expect(Math.abs((counts.get("g1f3") ?? 0) / 1000 - 0.1)).toBeLessThanOrEqual(0.05);
    // Re-record if the seed or the generator changes; never widen the tolerance.
    expect(Object.fromEntries(counts)).toEqual({ e2e4: 796, d2d4: 106, g1f3: 98 });
  });

  it("the draw maps [0, 1) onto the cumulative weights: 0 picks the first move, just under 1 the last", () => {
    const bytes = fixture({
      [hexKey(start())]: {
        m: [
          ["e2e4", 8],
          ["d2d4", 1],
          ["g1f3", 1],
        ],
      },
    });
    expect(
      uci(
        probeOver(
          () => bytes,
          () => 0,
        ).probe.bookMove(start()) as Move,
      ),
    ).toBe("e2e4");
    expect(
      uci(
        probeOver(
          () => bytes,
          () => 0.79,
        ).probe.bookMove(start()) as Move,
      ),
    ).toBe("e2e4");
    expect(
      uci(
        probeOver(
          () => bytes,
          () => 0.8,
        ).probe.bookMove(start()) as Move,
      ),
    ).toBe("d2d4");
    expect(
      uci(
        probeOver(
          () => bytes,
          () => 0.9999,
        ).probe.bookMove(start()) as Move,
      ),
    ).toBe("g1f3");
  });
});

describe("ABC-094 A7 — nothing is executed, nothing is fetched, no capability held", () => {
  const code = readFileSync(new URL("./book.ts", import.meta.url), "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*$/gm, "");

  it("contains 0 eval, Function constructors, dynamic import/require, fetch or WebSocket", () => {
    expect(code).not.toMatch(/\beval\b/);
    expect(code).not.toMatch(/\bFunction\s*\(/);
    expect(code).not.toMatch(/\bimport\s*\(/);
    expect(code).not.toMatch(/\brequire\b/);
    expect(code).not.toMatch(/\bfetch\b/);
    expect(code).not.toMatch(/\bWebSocket\b/);
  });

  it("imports only local modules and references no process (ADR-0036 limbs 1 and 2)", () => {
    const specifiers = [...code.matchAll(/\bfrom\s+"([^"]+)"/g)].map((m) => m[1]);
    expect(specifiers.length).toBeGreaterThan(0);
    for (const specifier of specifiers) expect(specifier).toMatch(/^\.\//);
    expect(code).not.toMatch(/\bprocess\b/);
  });
});

describe("ABC-094 QE — gaps closed at qe-ABC-094 (each kills a mutant the suite above left green)", () => {
  const startKey = hexKey(start());

  it("A1: a book position whose key has a leading zero is found (the padStart in the key encoding)", () => {
    let frontier: string[][] = [[]];
    let line: string[] | undefined;
    while (line === undefined && frontier.length > 0) {
      const next: string[][] = [];
      for (const moves of frontier) {
        const key = hexKey(moves.reduce(play, start()));
        const entry = BOOK.positions[key];
        if (entry !== undefined && entry.m.length > 0 && key.startsWith("0")) {
          line = moves;
          break;
        }
        for (const [text] of entry?.m ?? []) next.push([...moves, text]);
      }
      frontier = next;
    }
    expect(line).toBeDefined();
    const position = (line as string[]).reduce(play, start());
    const { probe, warnings } = probeOver(() => BOOK_BYTES);
    expect(probe.inBook(position)).toBe(true);
    const move = probe.bookMove(position);
    expect(move).toBeDefined();
    expect(BOOK.positions[hexKey(position)]?.m.map(([text]) => text)).toContain(uci(move as Move));
    expect(warnings).toHaveLength(0);
  });

  const nameAt = BOOK_BYTES.indexOf(Buffer.from("King's Pawn Game"));
  const badUtf8InString = new Uint8Array(BOOK_BYTES.length + 1);
  badUtf8InString.set(BOOK_BYTES.subarray(0, nameAt), 0);
  badUtf8InString[nameAt] = 0xff;
  badUtf8InString.set(BOOK_BYTES.subarray(nameAt), nameAt + 1);

  const more: [string, Uint8Array][] = [
    ["garbage payload: a triple, not a pair", fixture({ [startKey]: { m: [["e2e4", 1, 1]] } })],
    [
      "garbage payload: key in uppercase hex",
      fixture({ [startKey.toUpperCase()]: { m: [["e2e4", 1]] } }),
    ],
    [
      "garbage payload: weights summing past 2^53",
      fixture({
        [startKey]: {
          m: [
            ["e2e4", 2 ** 53 - 1],
            ["d2d4", 2 ** 53 - 1],
          ],
        },
      }),
    ],
    ["invalid UTF-8 inside a string of the real book", badUtf8InString],
    [
      "garbage payload: a non-UCI move under a key the calls never reach",
      fixture({ [startKey]: { m: [["e2e4", 1]] }, "0000000000000001": { m: [["castle", 1]] } }),
    ],
  ];

  it.each(more)("%s: 50 calls throw 0, return nothing, warn exactly once", (_name, bytes) => {
    const { probe, warnings } = probeOver(() => bytes);
    const { thrown, results } = callRepeatedly(50, () => probe.bookMove(start()));
    expect(thrown).toBe(0);
    expect(results.every((r) => r === undefined)).toBe(true);
    expect(warnings).toHaveLength(1);
  });

  it("a control character that reaches the schema check (JSON-escaped) stays out of the warning", () => {
    const hostile = encode('{"format":1,"positions":{"\\u001b[2J":{"m":[]}}}');
    expect(Object.keys(JSON.parse(new TextDecoder().decode(hostile)).positions)[0]).toBe(
      "\u001b[2J",
    );
    const { probe, warnings } = probeOver(() => hostile);
    probe.bookMove(start());
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toMatch(/^[\x20-\x7e]+$/);
  });

  it("a file of exactly BOOK_MAX_BYTES is not refused for its size", () => {
    const exact = new Uint8Array(BOOK_MAX_BYTES).fill(0x20);
    exact.set(BOOK_BYTES, 0);
    const { probe, warnings } = probeOver(() => exact);
    expect(probe.bookMove(start())).toBeDefined();
    expect(warnings).toHaveLength(0);
  });

  it("promotions are encoded as UCI letters: e7e8q is a queen, e7e8n a knight", () => {
    const fen = "8/4P3/8/8/8/8/k7/4K3 w - - 0 1";
    for (const [text, piece] of [
      ["e7e8q", QUEEN],
      ["e7e8n", KNIGHT],
    ] as const) {
      const { probe, warnings } = probeOver(() =>
        fixture({ [hexKey(parseFen(fen))]: { m: [[text, 1]] } }),
      );
      expect(probe.bookMove(parseFen(fen))?.promotion).toBe(piece);
      expect(warnings).toHaveLength(0);
    }
  });
});
