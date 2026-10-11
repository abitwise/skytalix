// QE ABC-152 V8: `vitest list --json` per lane configuration, base tree vs head tree; compared BY PATH and by
// test id (relative path + full name), never by count alone. Usage: node collect.mjs <baseTree> <headTree> <outdir>
import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [base, head, out] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const LANES = [
  ["default", {}],
  ["PERFT_DEEP", { PERFT_DEEP: "1" }],
  ["SEARCH_DEEP", { SEARCH_DEEP: "1" }],
  ["ENGINE_DEEP", { ENGINE_DEEP: "1" }],
  ["INPUT_DEEP", { INPUT_DEEP: "1", NODE_OPTIONS: "--expose-gc" }],
  ["ZOBRIST_DEEP", { ZOBRIST_DEEP: "1" }],
  ["PUZZLE_DEEP", { PUZZLE_DEEP: "1" }],
  ["CLI_DEEP", { CLI_DEEP: "1" }],
  ["LADDER_DEEP", { LADDER_DEEP: "1" }],
];
function list(tree, lane, env) {
  const file = join(out, `${lane}-${tree === base ? "base" : "head"}.json`);
  const r = spawnSync(join(tree, "node_modules/.bin/vitest"), ["list", `--json=${file}`], {
    cwd: tree, env: { ...process.env, ...env }, encoding: "utf8", timeout: 300000, maxBuffer: 1 << 28,
  });
  const items = JSON.parse(readFileSync(file, "utf8"));
  const rel = (p) => p.replace(`${tree}/`, "");
  return { exit: r.status, files: [...new Set(items.map((i) => rel(i.file)))].sort(), ids: items.map((i) => `${rel(i.file)} > ${i.name}`).sort() };
}
const rows = ["lane\tbase_exit\thead_exit\tfiles_base\tfiles_head\tsame_paths\ttests_base\ttests_head\tonly_base\tonly_head"];
for (const [lane, env] of LANES) {
  const b = list(base, lane, env);
  const h = list(head, lane, env);
  const hs = new Set(h.ids);
  const bs = new Set(b.ids);
  const onlyBase = b.ids.filter((x) => !hs.has(x));
  const onlyHead = h.ids.filter((x) => !bs.has(x));
  rows.push([lane, b.exit, h.exit, b.files.length, h.files.length, JSON.stringify(b.files) === JSON.stringify(h.files), b.ids.length, h.ids.length, JSON.stringify(onlyBase), JSON.stringify(onlyHead)].join("\t"));
  console.log(rows.at(-1));
}
writeFileSync(join(out, "collect.tsv"), `${rows.join("\n")}\n`);
