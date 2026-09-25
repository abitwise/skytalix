/**
 * PROBE (ruling-abc121-g6): does the G6 knight-g1 pair bite a castling-rights key bug, on the
 * shipped `search()` and on the pre-ABC-121 door, at depths 3-6?
 *
 * Copies `src/` to a scratch tree OUTSIDE the repository (argv[2]), applies one exact-string
 * mutation per variant (asserting it matched exactly once), and prints the pair's scores under
 * `search`, `searchWithoutPvsOrReductions`, `searchWithoutReductions` and `searchWithoutTable`.
 * No `src/` file in the repository is touched.
 *
 * Usage: node g6-bite.mjs <scratch-dir> <repo-root>
 */
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [scratch, repo] = process.argv.slice(2);
const FULL = "    if ((position.castling & (CASTLE_FLAGS[i] as number)) !== 0) key ^= CASTLE_KEYS[i] as bigint;";
const DELTA = "      if ((castlingChanged & (CASTLE_FLAGS[i] as number)) !== 0) key ^= CASTLE_KEYS[i] as bigint;";
const VARIANTS = {
  clean: [],
  // The key forgets castling rights altogether: G6's FAIL (an availability key collides this pair too).
  "drop-rights": [[FULL, "    void i;"], [DELTA, "      void i;"]],
  // The full key is right; the incremental update forgets a lost right (stale key after Rh1 moves).
  "delta-ignores-rights": [[DELTA, "      void i;"]],
};
const PAIR = [
  ["w K", "4k3/8/8/8/8/8/8/4K1NR w K - 0 1"],
  ["w -", "4k3/8/8/8/8/8/8/4K1NR w - - 0 1"],
];

for (const [variant, edits] of Object.entries(VARIANTS)) {
  const dir = join(scratch, variant);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  cpSync(join(repo, "src"), join(dir, "src"), { recursive: true });
  const file = join(dir, "src", "zobrist.ts");
  let text = readFileSync(file, "utf8");
  for (const [from, to] of edits) {
    const n = text.split(from).length - 1;
    if (n !== 1) throw new Error(`${variant}: pattern matched ${n} times`);
    text = text.replace(from, to);
  }
  writeFileSync(file, text);
  const { parseFen } = await import(join(dir, "src", "fen.ts"));
  const s = await import(join(dir, "src", "search.ts"));
  for (let d = 3; d <= 6; d++) {
    const row = { variant, d };
    for (const [name, fen] of PAIR) {
      row[name] = {
        search: s.search(parseFen(fen), d).score,
        pre121: s.searchWithoutPvsOrReductions(parseFen(fen), d).score,
        withoutReductions: s.searchWithoutReductions(parseFen(fen), d).score,
        withoutTable: s.searchWithoutTable(parseFen(fen), d).score,
      };
    }
    console.log(JSON.stringify(row));
  }
}
