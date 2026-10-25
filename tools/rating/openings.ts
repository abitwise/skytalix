/**
 * `ABC-204` — draws the rating harness's 100 pinned openings (`tools/rating/openings.epd`) from the
 * in-repo book's CC0 source (`ADR-0023`). The rule is the ABC-204 page's `## Design ruling` Q5.
 *
 *   node tools/rating/openings.ts <dir holding a.tsv … e.tsv at SOURCE_COMMIT>
 *
 * Runs on demand only, never in the test lane. It imports `src/` read-only, as
 * `tools/opening-book/compile.ts` does (`ADR-0037` D1(g)). The TSVs are not checked in.
 *
 * The rule: every position after ply 4 to 8 of every source line, keyed by its four-field EPD.
 * A position with no legal move is dropped, and a position reached at several plies belongs to its
 * lowest ply. In each ply, rank by sha256("ABC-204/openings/v1\n" + EPD) and take the first 20.
 * The file is ply 4's block first, one LF-terminated EPD per line. No PRNG, so no order dependence.
 */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { makeMove } from "../../src/apply.ts";
import { parseFen, toFen } from "../../src/fen.ts";
import { legalMoves } from "../../src/legal.ts";
import { parseSan } from "../../src/san.ts";
import { SOURCE_FILES, SOURCE_SHA256 } from "../opening-book/compile.ts";

/** The sha256 of `openings.epd`. The harness refuses to play if the file differs (Q5). */
export const OPENINGS_SHA256 = "0d7f7a72678cbf54c2c309dc5d664e7aac5de2c15bc54fe4247a437f51e82666";

const FIRST_PLY = 4;
const LAST_PLY = 8;
const PER_PLY = 20;
const RANK_PREFIX = "ABC-204/openings/v1\n";
const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const MOVE_NUMBER = /^\d+\.$/;

const sha256 = (text: string): string => createHash("sha256").update(text).digest("hex");

/** The file's exact text from the five source texts. */
export function drawOpenings(texts: readonly string[]): string {
  const byPly = new Map<number, Set<string>>();
  for (let ply = FIRST_PLY; ply <= LAST_PLY; ply++) byPly.set(ply, new Set());

  texts.forEach((text, fileIndex) => {
    const rows = text.split("\n").filter((row) => row !== "");
    for (let r = 1; r < rows.length; r++) {
      const pgn = (rows[r] as string).split("\t")[2] ?? "";
      const sans = pgn.split(" ").filter((token) => token !== "" && !MOVE_NUMBER.test(token));
      const position = parseFen(START_FEN);
      for (let ply = 1; ply <= Math.min(LAST_PLY, sans.length); ply++) {
        const parsed = parseSan(position, sans[ply - 1] as string);
        if (parsed.outcome !== "move") {
          throw new Error(`${SOURCE_FILES[fileIndex]}:${r + 1}: ply ${ply} is ${parsed.outcome}`);
        }
        makeMove(position, parsed.move);
        if (ply >= FIRST_PLY && legalMoves(position).length > 0) {
          byPly.get(ply)?.add(toFen(position).split(" ").slice(0, 4).join(" "));
        }
      }
    }
  });

  const seen = new Set<string>();
  const picked: string[] = [];
  for (let ply = FIRST_PLY; ply <= LAST_PLY; ply++) {
    const stratum = [...(byPly.get(ply) as Set<string>)].filter((epd) => !seen.has(epd));
    for (const epd of stratum) seen.add(epd);
    const ranked = stratum
      .map((epd) => ({ epd, rank: sha256(RANK_PREFIX + epd) }))
      .sort((a, b) => (a.rank < b.rank ? -1 : 1));
    if (ranked.length < PER_PLY) throw new Error(`ply ${ply}: only ${ranked.length} positions`);
    picked.push(...ranked.slice(0, PER_PLY).map(({ epd }) => epd));
  }
  return `${picked.join("\n")}\n`;
}

if (process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const sourceDir = process.argv[2];
  if (sourceDir === undefined) {
    console.error("usage: node tools/rating/openings.ts <dir holding a.tsv … e.tsv>");
    process.exit(1);
  }
  for (const file of SOURCE_FILES) {
    const actual = createHash("sha256")
      .update(readFileSync(join(sourceDir, file)))
      .digest("hex");
    if (actual !== SOURCE_SHA256[file]) {
      throw new Error(`${file}: sha256 is ${actual}, expected ${SOURCE_SHA256[file]}`);
    }
  }
  const text = drawOpenings(
    SOURCE_FILES.map((file) => readFileSync(join(sourceDir, file), "utf8")),
  );
  if (sha256(text) !== OPENINGS_SHA256) {
    throw new Error(`openings sha256 is ${sha256(text)}, expected ${OPENINGS_SHA256}`);
  }
  writeFileSync(fileURLToPath(new URL("./openings.epd", import.meta.url)), text);
}
