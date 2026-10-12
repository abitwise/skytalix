/**
 * `ABC-093` — compiles `lichess-org/chess-openings` (`ADR-0023`, CC0-1.0) into the opening book
 * `data/opening-book/book.json`, in the format `ADR-0037` D1 rules. Cite the ADR; it holds the why.
 *
 *   node tools/opening-book/compile.ts <dir holding a.tsv … e.tsv at SOURCE_COMMIT>
 *
 * Runs on demand only — never in the test lane, never in a player's process. It imports `src/`
 * read-only and lives outside it, so it is not production code (`ADR-0037` D1(g)). The source
 * TSVs are NOT checked in; fetch the five files at `SOURCE_COMMIT` into a directory outside the
 * repository (the raw URLs are in `data/opening-book/ATTRIBUTION.md`).
 *
 * Reproducible by construction (`A1`): keys sorted, moves sorted by UCI, no timestamp, no path.
 * The whole source is validated before a single byte is written (`A8`, D1(f)).
 */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { makeMove } from "../../src/apply.ts";
import { parseFen, toFen } from "../../src/fen.ts";
import type { Move } from "../../src/moves.ts";
import { type Position, squareName } from "../../src/position.ts";
import { parseSan } from "../../src/san.ts";
import { zobristKey } from "../../src/zobrist.ts";

/** The upstream commit this book is compiled from. Change it only with `ATTRIBUTION.md`. */
export const SOURCE_COMMIT = "a6189a30dc273ccb21fc2536a9a2fefd5592a67a";
export const SOURCE_FILES = ["a.tsv", "b.tsv", "c.tsv", "d.tsv", "e.tsv"] as const;
type SourceFile = (typeof SOURCE_FILES)[number];

/**
 * `ABC-145`, `ADR-0037` D1(f) amendment: the sha256 of each source file's raw bytes at
 * `SOURCE_COMMIT`. Change it only with `SOURCE_COMMIT` and `ATTRIBUTION.md`; a lane test pins the
 * five values to that file's table.
 */
export const SOURCE_SHA256: Readonly<Record<SourceFile, string>> = {
  "a.tsv": "3282e4c9155289a29224f9a85fba0decb46efa35c2fa5e39662d2ac48fb0f793",
  "b.tsv": "1d5ed134ebbd87915ead5683416e37583bb3e5ae3582b4d8cb5cb4aa7ef4f623",
  "c.tsv": "45e843c7b7e79a0d04d5bda879c9bd23f5a10974488bd8615e4f4c5d0749986f",
  "d.tsv": "1cf4057a8aece94f27bb3f278ad410ee2844831a642364eeceaafa091dbcceda",
  "e.tsv": "48c6f6645b031a5937c8386839debab0e2e48837251687ba1afb6369677f8546",
};

/**
 * `ADR-0037` D1(c): a move's weight is the number of source lines through it ("line-count").
 * The owner may veto this in favour of "uniform" (every weight 1); this is the one switch.
 */
const WEIGHT_POLICY: "line-count" | "uniform" = "line-count";

/** `A3` / `EPIC-005`: lines are truncated here; a deeper book fails the ticket. */
const MAX_PLY = 12;

const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const HEADER = "eco\tname\tpgn";
const MOVE_NUMBER = /^\d+\.$/;
/** Indexed by piece type: KNIGHT 2, BISHOP 3, ROOK 4, QUEEN 5 (`src/position.ts`). */
const PROMOTION_LETTER = ["", "", "n", "b", "r", "q"];

/** UCI text of a move: from-square, to-square, lowercase promotion letter (`ADR-0037` D1(e)). */
export function toUci(move: Move): string {
  return `${squareName(move.from)}${squareName(move.to)}${PROMOTION_LETTER[move.promotion] ?? ""}`;
}

/** A C0 byte (which includes ESC) or DEL — the test `src/frame.ts` uses. Defence in depth only. */
const hasControlByte = (text: string): boolean =>
  [...text].some((char) => {
    const code = char.charCodeAt(0);
    return code < 0x20 || code === 0x7f;
  });

const keyOf = (position: Position): string => zobristKey(position).toString(16).padStart(16, "0");
const fen4 = (position: Position): string => toFen(position).split(" ").slice(0, 4).join(" ");

interface Entry {
  readonly fen: string;
  readonly moves: Map<string, number>;
  name?: string;
}

/** Compiles the five source texts into the artifact's exact bytes, or throws naming the defect. */
export function compileBook(texts: readonly string[], commit: string): string {
  const entries = new Map<string, Entry>();
  const entryAt = (position: Position, where: string): Entry => {
    const key = keyOf(position);
    const fen = fen4(position);
    const found = entries.get(key);
    if (found === undefined) {
      const entry: Entry = { fen, moves: new Map() };
      entries.set(key, entry);
      return entry;
    }
    if (found.fen !== fen) throw new Error(`${where}: key ${key} carries two positions`);
    return found;
  };

  texts.forEach((text, fileIndex) => {
    const rows = text.split("\n");
    if (rows.at(-1) === "") rows.pop();
    if (rows[0] !== HEADER)
      throw new Error(`${SOURCE_FILES[fileIndex]}: header is not "${HEADER}"`);
    for (let r = 1; r < rows.length; r++) {
      const where = `${SOURCE_FILES[fileIndex]}:${r + 1}`;
      const columns = (rows[r] as string).split("\t");
      if (columns.length !== 3) throw new Error(`${where}: ${columns.length} columns, not 3`);
      const [, name, pgn] = columns as [string, string, string];
      if (hasControlByte(name)) throw new Error(`${where}: control byte in the name`);

      const sans = pgn.split(" ").filter((token) => token !== "" && !MOVE_NUMBER.test(token));
      const position = parseFen(START_FEN);
      sans.forEach((san, ply) => {
        const parsed = parseSan(position, san);
        if (parsed.outcome !== "move") throw new Error(`${where}: "${san}" is ${parsed.outcome}`);
        if (ply < MAX_PLY) {
          const moves = entryAt(position, where).moves;
          const uci = toUci(parsed.move);
          moves.set(uci, (moves.get(uci) ?? 0) + 1);
        }
        makeMove(position, parsed.move);
      });
      if (sans.length > MAX_PLY) continue;

      const end = entryAt(position, where);
      if (end.name !== undefined && end.name !== name) {
        throw new Error(`${where}: position named both "${end.name}" and "${name}"`);
      }
      end.name = name;
    }
  });

  const positions: Record<string, { m: [string, number][]; n?: string }> = {};
  for (const key of [...entries.keys()].sort()) {
    const entry = entries.get(key) as Entry;
    const m = [...entry.moves.entries()]
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([uci, lines]): [string, number] => [uci, WEIGHT_POLICY === "uniform" ? 1 : lines]);
    positions[key] = entry.name === undefined ? { m } : { m, n: entry.name };
  }
  const book = {
    format: 1,
    source: { repo: "lichess-org/chess-openings", commit },
    attribution: "ATTRIBUTION.md",
    maxPly: MAX_PLY,
    positions,
  };
  return `${JSON.stringify(book)}\n`;
}

/** Reads the five files from `sourceDir`, compiles, and only then writes `outPath`. */
export function writeBook(sourceDir: string, outPath: string, commit: string): void {
  const texts = SOURCE_FILES.map((file) => readFileSync(join(sourceDir, file), "utf8"));
  writeFileSync(outPath, compileBook(texts, commit));
}

/**
 * The command-line path: checks every source file's sha256 against `expected`, and only then
 * calls `writeBook`. A mismatch throws naming the file and both hashes; nothing is written.
 */
export function checkThenWriteBook(
  sourceDir: string,
  outPath: string,
  commit: string,
  expected: Readonly<Record<SourceFile, string>>,
): void {
  for (const file of SOURCE_FILES) {
    const actual = createHash("sha256")
      .update(readFileSync(join(sourceDir, file)))
      .digest("hex");
    if (actual !== expected[file]) {
      throw new Error(`${file}: sha256 is ${actual}, expected ${expected[file]}`);
    }
  }
  writeBook(sourceDir, outPath, commit);
}

if (process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const sourceDir = process.argv[2];
  if (sourceDir === undefined) {
    console.error("usage: node tools/opening-book/compile.ts <dir holding a.tsv … e.tsv>");
    process.exit(1);
  }
  const out = fileURLToPath(new URL("../../data/opening-book/book.json", import.meta.url));
  checkThenWriteBook(sourceDir, out, SOURCE_COMMIT, SOURCE_SHA256);
}
