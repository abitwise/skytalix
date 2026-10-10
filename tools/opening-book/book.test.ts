/**
 * `ABC-093` — the opening book artifact and its compiler (`ADR-0037` D1).
 *
 * ONE file on purpose (`NFR-008`: the file count is the lane's lever, not the `it` count).
 * `A1` and `A8` run the compiler on small fixtures written here; `A2`–`A6` read the REAL
 * checked-in artifact, so regenerating the book from a newer source never turns this red unless
 * the new book breaks a property. No snapshot, no exact entry count (ticket test note 3).
 */
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, describe, expect, it, vi } from "vitest";
import { makeMove } from "../../src/apply.ts";
import { parseFen } from "../../src/fen.ts";
import { legalMoves } from "../../src/legal.ts";
import type { Position } from "../../src/position.ts";
import { zobristKey } from "../../src/zobrist.ts";
import { SOURCE_COMMIT, SOURCE_FILES, toUci, writeBook } from "./compile.ts";

const BOOK_DIR = fileURLToPath(new URL("../../data/opening-book/", import.meta.url));
const BOOK_PATH = join(BOOK_DIR, "book.json");
const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const NFR_006_BYTES = 1_048_576;

interface Book {
  format: number;
  source: { repo: string; commit: string };
  attribution: string;
  maxPly: number;
  positions: Record<string, { m: [string, number][]; n?: string }>;
}

const keyOf = (position: Position): string => zobristKey(position).toString(16).padStart(16, "0");

const scratch = mkdtempSync(join(tmpdir(), "abc093-"));
afterAll(() => rmSync(scratch, { recursive: true, force: true }));

const HEADER = "eco\tname\tpgn";
const GOOD_ROWS = [
  "C20\tKing's Pawn Game\t1. e4 e5",
  "C40\tKing's Knight Opening\t1. e4 e5 2. Nf3",
  "B20\tSicilian Defense\t1. e4 c5",
  "D00\tQueen's Pawn Game\t1. d4 d5",
  "C50\tItalian Game\t1. e4 e5 2. Nf3 Nc6 3. Bc4",
];

/** Writes `a.tsv` with `body` and the other four files header-only; returns the directory. */
function fixture(label: string, body: string): string {
  const dir = join(scratch, label);
  mkdirSync(dir);
  for (const file of SOURCE_FILES) {
    writeFileSync(join(dir, file), file === "a.tsv" ? body : `${HEADER}\n`);
  }
  return dir;
}

describe("A1 — two compiles of the same source are byte-identical", () => {
  it("emits the same bytes twice, with no timestamp and no absolute path", () => {
    const dir = fixture("a1", `${HEADER}\n${GOOD_ROWS.join("\n")}\n`);
    const first = join(scratch, "a1-first.json");
    const second = join(scratch, "a1-second.json");
    writeBook(dir, first, "0".repeat(40));
    writeBook(dir, second, "0".repeat(40));
    const a = readFileSync(first);
    const b = readFileSync(second);
    expect(a.length).toBeGreaterThan(0);
    expect(a.equals(b)).toBe(true);
    expect(a.toString("utf8")).not.toContain(scratch);
  });

  // QE (ABC-093): the sorts in D1(e) were unguarded — removing either kept the test above green,
  // because insertion order is deterministic for one row order. Leading with the 1. d4 row
  // inserts both the start position's moves and the entries in a different order.
  it("emits the same bytes whatever order the source rows arrive in", () => {
    const forward = fixture("a1-forward", `${HEADER}\n${GOOD_ROWS.join("\n")}\n`);
    const reordered = fixture(
      "a1-reordered",
      `${HEADER}\n${[...GOOD_ROWS].sort().reverse().join("\n")}\n`,
    );
    const first = join(scratch, "a1-forward.json");
    const second = join(scratch, "a1-reordered.json");
    writeBook(forward, first, "0".repeat(40));
    writeBook(reordered, second, "0".repeat(40));
    expect(readFileSync(first).equals(readFileSync(second))).toBe(true);
  });
});

// QE (ABC-093): D1(f)'s sixth refusal cannot be built from real chess, so a stub key that maps
// every position to one value builds it. Scoped to this test: doMock + a fresh module registry.
describe("D1(f) — a key carrying two different positions is refused", () => {
  it("refuses the compile and writes no artifact", async () => {
    vi.resetModules();
    vi.doMock("../../src/zobrist.ts", () => ({ zobristKey: () => 0n }));
    try {
      const stubbed = await import("./compile.ts");
      const dir = fixture("d1f-collision", `${HEADER}\n${GOOD_ROWS[0]}\n`);
      const out = join(scratch, "d1f-collision.json");
      expect(() => stubbed.writeBook(dir, out, "0".repeat(40))).toThrow(/carries two positions/);
      expect(existsSync(out)).toBe(false);
    } finally {
      vi.doUnmock("../../src/zobrist.ts");
      vi.resetModules();
    }
  });
});

describe("A8 — a malformed source never ships", () => {
  const defects: [string, string, RegExp][] = [
    ["a wrong header row", `eco\tname\tmoves\n${GOOD_ROWS[0]}\n`, /header/],
    ["a row without 3 columns", `${HEADER}\n${GOOD_ROWS[0]}\nC21\tCenter Game\n`, /2 columns/],
    [
      "a SAN that does not resolve to exactly one move",
      `${HEADER}\nC20\tBroken\t1. e4 e5 2. Ke3\n`,
      /"Ke3" is rejected/,
    ],
    [
      // QE (ABC-093): D1(f) says EVERY SAN, and the book keeps only 12 plies. Ply 13 here.
      "a SAN past maxPly that does not resolve",
      `${HEADER}\nC54\tBroken\t1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. c3 Nf6 5. d4 exd4 6. cxd4 Bb4+ 7. Ke3\n`,
      /"Ke3" is rejected/,
    ],
    [
      "a position carrying two names",
      `${HEADER}\nC20\tKing's Pawn Game\t1. e4 e5\nC20\tOther\t1. e4 e5\n`,
      /named both/,
    ],
    ["a C0 byte in a name", `${HEADER}\nC20\tKing's\u0007Pawn\t1. e4 e5\n`, /control byte/],
    ["a DEL byte in a name", `${HEADER}\nC20\tKing's\u007fPawn\t1. e4 e5\n`, /control byte/],
    ["an ESC byte in a name", `${HEADER}\nC20\t\u001b[31mRed\t1. e4 e5\n`, /control byte/],
  ];

  it.each(defects)("refuses %s and writes no artifact", (label, body, reason) => {
    const dir = fixture(`a8-${label.replace(/\W+/g, "-")}`, body);
    const out = join(scratch, `a8-${label.replace(/\W+/g, "-")}.json`);
    expect(() => writeBook(dir, out, "0".repeat(40))).toThrow(reason);
    expect(existsSync(out)).toBe(false);
  });
});

describe("the delivered artifact (data/opening-book/book.json)", () => {
  const text = readFileSync(BOOK_PATH, "utf8");
  const book = JSON.parse(text) as Book;
  const entries = Object.keys(book.positions);

  /** Breadth-first from the start position, so each entry is reached at its shortest ply. */
  function walkBook() {
    const seen = new Set<string>();
    let moves = 0;
    let illegal = 0;
    let badWeights = 0;
    let longest = 0;
    let frontier: Position[] = [parseFen(START_FEN)];
    for (let ply = 0; frontier.length > 0; ply++) {
      const next: Position[] = [];
      for (const position of frontier) {
        const key = keyOf(position);
        const entry = book.positions[key];
        if (entry === undefined || seen.has(key)) continue;
        seen.add(key);
        if (entry.m.length > 0) longest = Math.max(longest, ply + 1);
        const legal = legalMoves(position);
        for (const [uci, weight] of entry.m) {
          moves++;
          if (!Number.isSafeInteger(weight) || weight < 1) badWeights++;
          const move = legal.find((candidate) => toUci(candidate) === uci);
          if (move === undefined) {
            illegal++;
            continue;
          }
          const child = { ...position, board: new Uint8Array(position.board) };
          makeMove(child, move);
          next.push(child);
        }
      }
      frontier = next;
    }
    return { examined: seen.size, moves, illegal, badWeights, longest };
  }
  const walked = walkBook();

  it("A2 — every book move is legal in its keyed position, over every entry", () => {
    const { examined, moves, illegal, badWeights } = walked;
    console.log(
      `ABC-093 A2: examined ${examined} entries of ${entries.length}; ${moves} moves; ${illegal} illegal`,
    );
    expect(examined).toBeGreaterThan(0);
    expect(examined).toBe(entries.length);
    expect(illegal).toBe(0);
    expect(badWeights).toBe(0);
  });

  it("A3 — the longest line is >= 8 plies and never deeper than maxPly (<= 12)", () => {
    console.log(`ABC-093 A3: longest book line ${walked.longest} plies; maxPly ${book.maxPly}`);
    expect(book.maxPly).toBeLessThanOrEqual(12);
    expect(walked.longest).toBeGreaterThanOrEqual(8);
    expect(walked.longest).toBeLessThanOrEqual(book.maxPly);
  });

  it("A4 — after 1. e4 the book carries >= 3 distinct replies with non-zero weight", () => {
    const position = parseFen(START_FEN);
    const e4 = legalMoves(position).find((move) => toUci(move) === "e2e4");
    if (e4 === undefined) throw new Error("e2e4 is not legal from the start position");
    makeMove(position, e4);
    const replies = (book.positions[keyOf(position)]?.m ?? []).filter(([, weight]) => weight > 0);
    console.log(`ABC-093 A4: ${replies.length} weighted replies to 1. e4`);
    expect(new Set(replies.map(([uci]) => uci)).size).toBeGreaterThanOrEqual(3);
  });

  it("A5 — NFR-006: the artifact on disk is <= 1,048,576 bytes", () => {
    const bytes = statSync(BOOK_PATH).size;
    console.log(
      `ABC-093 A5: ${bytes} bytes of ${NFR_006_BYTES} (${((100 * bytes) / NFR_006_BYTES).toFixed(1)}%)`,
    );
    expect(bytes).toBeLessThanOrEqual(NFR_006_BYTES);
  });

  it("A6/A7 — the artifact points at its attribution file, and its directory holds no code", () => {
    const attribution = join(BOOK_DIR, book.attribution);
    expect(book.attribution).toBe("ATTRIBUTION.md");
    expect(readFileSync(attribution, "utf8")).toContain(book.source.commit);
    expect(readdirSync(BOOK_DIR).filter((name) => /\.(c|m)?(t|j)s$/.test(name))).toEqual([]);
  });

  // QE (ABC-093): D1(e)'s shape rules, read on the real file. Properties only (test note 3).
  it("D1(e) — sorted keys and moves, no empty unnamed entry, no control byte, the pinned commit", () => {
    const unsortedMoves = entries.filter((key) => {
      const ucis = book.positions[key]?.m.map(([uci]) => uci) ?? [];
      return ucis.some((uci, i) => i > 0 && (ucis[i - 1] as string) >= uci);
    });
    const emptyUnnamed = entries.filter(
      (key) => book.positions[key]?.m.length === 0 && book.positions[key]?.n === undefined,
    );
    const controlNames = entries.filter((key) =>
      [...(book.positions[key]?.n ?? "")].some(
        (c) => c.charCodeAt(0) < 0x20 || c.charCodeAt(0) === 0x7f,
      ),
    );
    expect(book.format).toBe(1);
    expect(book.source.commit).toBe(SOURCE_COMMIT);
    expect(
      entries.every(
        (key, i) => /^[0-9a-f]{16}$/.test(key) && (i === 0 || (entries[i - 1] as string) < key),
      ),
    ).toBe(true);
    expect(unsortedMoves).toEqual([]);
    expect(emptyUnnamed).toEqual([]);
    expect(controlNames).toEqual([]);
  });
});
