// QE ABC-151 A6: does each opt-in lane COLLECT the same files and tests at base and head? Times nothing.
// usage: node collect.mjs <baseDir> <headDir> <outDir>
// Adapted from .grugops/context/qe-ABC-144/probe/collect.mjs. ABC-151 renames the A7 pin's titles
// ("3-worker"/"3 threads" -> "2-worker"/"2 threads") and adds no `it`, so EQUAL here means: equal file
// set, equal test count, and the only differing ids are that one renamed pin, once on each side.
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const [base, head, out] = process.argv.slice(2);
const lanes = [
  ["DEFAULT", {}],
  ["PERFT_DEEP", { PERFT_DEEP: "1" }],
  ["SEARCH_DEEP", { SEARCH_DEEP: "1" }],
  ["ENGINE_DEEP", { ENGINE_DEEP: "1" }],
  ["INPUT_DEEP", { INPUT_DEEP: "1", NODE_OPTIONS: "--expose-gc" }],
  ["ZOBRIST_DEEP", { ZOBRIST_DEEP: "1" }],
  ["PUZZLE_DEEP", { PUZZLE_DEEP: "1" }],
  ["CLI_DEEP", { CLI_DEEP: "1" }],
  ["LADDER_DEEP=1", { LADDER_DEEP: "1" }],
  ["LADDER_DEEP=verdict", { LADDER_DEEP: "verdict" }],
];

function list(dir, tag, env) {
  const file = join(out, `${tag}.${dir === base ? "base" : "head"}.json`);
  const r = spawnSync("npx", ["vitest", "list", `--json=${file}`], { cwd: dir, env: { ...process.env, ...env }, encoding: "utf8" });
  const items = JSON.parse(readFileSync(file, "utf8"));
  const ids = items.map((t) => `${relative(dir, t.file)} :: ${t.name}`).sort();
  const files = [...new Set(items.map((t) => relative(dir, t.file)))].sort();
  return { exit: r.status, files, tests: ids.length, ids };
}

const pin = (k) => (x) => x.startsWith("src/cli.test.ts :: ") && x.includes(`ABC-144 A7`) && x.includes(`${k}-worker cap`) && x.includes(`${k} threads workers`);
const rows = ["lane\tbase_exit\thead_exit\tbase_files\thead_files\tsame_file_set\tbase_tests\thead_tests\tonly_base\tonly_head\tverdict"];
for (const [tag, env] of lanes) {
  const b = list(base, tag, env);
  const h = list(head, tag, env);
  const hs = new Set(h.ids);
  const bs = new Set(b.ids);
  const onlyB = b.ids.filter((x) => !hs.has(x));
  const onlyH = h.ids.filter((x) => !bs.has(x));
  const sameFiles = b.files.join("|") === h.files.join("|");
  const verdict =
    b.exit === 0 && h.exit === 0 && sameFiles && b.tests === h.tests && onlyB.length === 1 && onlyH.length === 1 && pin(3)(onlyB[0]) && pin(2)(onlyH[0])
      ? "EQUAL (only the renamed A7 pin differs)"
      : "DIFF";
  rows.push([tag, b.exit, h.exit, b.files.length, h.files.length, sameFiles, b.tests, h.tests, `${onlyB.length}${onlyB.length ? ` (${onlyB.map((x) => x.slice(0, 100)).join(" | ")})` : ""}`, `${onlyH.length}${onlyH.length ? ` (${onlyH.map((x) => x.slice(0, 100)).join(" | ")})` : ""}`, verdict].join("\t"));
}
writeFileSync(join(out, "collect.tsv"), `${rows.join("\n")}\n`);
console.log(rows.join("\n"));
