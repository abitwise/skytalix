// secnfr-ABC-101 plants. Each plant: a fresh `git archive 98ea0a84` under ROOT/<name>, exact-string edits
// (every old string asserted to occur exactly once), one node_modules link inside the copy, then
// `npx tsc --noEmit` and the full `npx vitest run` (deep lanes unset). The copy is removed by its exact path.
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const REPO = "/Users/olgeroeselg/Projects/hacks/grugops-examples/wt-secnfr-ABC-101";
const NODE_MODULES = "/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-example/node_modules";
const ROOT = process.argv[2];
const only = process.argv.slice(3);
const REV = "98ea0a84";

const SEED_OLD = "{ seed: Math.floor(Math.random() * 2 ** 32) }";
const FIND_OLD = "      const value = DIFFICULTY_VALUES.find((candidate) => candidate === next);";
const PLANTS = {
  control: [],
  S1_parseInt_range: [["src/cli-options.ts", FIND_OLD,
    '      const parsed = Number.parseInt(next ?? "", 10);\n      const value = parsed >= 1 && parsed <= 5 ? String(parsed) : undefined;']],
  S2_regex_anchored: [["src/cli-options.ts", FIND_OLD,
    '      const value = /^[1-5]$/.test(next ?? "") ? next : undefined;']],
  S2b_regex_anchored_no_literal: [["src/cli-options.ts", FIND_OLD,
    "      const value = next !== undefined && /^[1-5]$/.test(next) ? next : undefined;"]],
  S2c_regex_multiline_flag: [["src/cli-options.ts", FIND_OLD,
    "      const value = next !== undefined && /^[1-5]$/m.test(next) ? next : undefined;"]],
  S3_regex_unanchored_end: [["src/cli-options.ts", FIND_OLD,
    '      const value = /^[1-5]/.test(next ?? "") ? next : undefined;']],
  S8_equals_form: [["src/cli-options.ts", "    if (token === DIFFICULTY) {",
    "    if (token.startsWith(`${DIFFICULTY}=`)) {\n      const word = token.slice(DIFFICULTY.length + 1);\n      const value = DIFFICULTY_VALUES.find((candidate) => candidate === word);\n      if (value === undefined) return reject(MISSING_DIFFICULTY, token);\n      difficulty = Number(value) as Difficulty;\n      continue;\n    }\n    if (token === DIFFICULTY) {"]],
  S4_second_parser_in_cli: [["src/cli.ts", "  const { colour, orientation, flags, difficulty } = resolution.options;",
    '  const { colour, orientation, flags } = resolution.options;\n  const at = process.argv.indexOf("--difficulty");\n  const difficulty = at === -1 ? 3 : Number(process.argv[at + 1]);']],
  S5_guard_removed: [["src/level-seam.ts",
    "  if (!Object.hasOwn(LEVELS, level)) throw new RangeError(`level-seam: no level ${level}`);\n", ""]],
  S6_seed_from_env: [["src/cli.ts", SEED_OLD,
    "{ seed: Number(process.env.CHESS_SEED ?? Math.floor(Math.random() * 2 ** 32)) }"]],
  S7_seed_from_input: [["src/cli.ts", SEED_OLD, "{ seed: difficulty }"]],
};

const count = () => (existsSync(ROOT) ? readdirSync(ROOT).length : 0);
mkdirSync(ROOT, { recursive: true });
for (const [name, edits] of Object.entries(PLANTS)) {
  if (only.length && !only.includes(name)) continue;
  const dir = join(ROOT, name);
  console.log(`\n=== ${name} — plant dirs before: ${count()}`);
  mkdirSync(dir);
  execFileSync("sh", ["-c", `git -C '${REPO}' archive ${REV} | tar -x -C '${dir}'`]);
  symlinkSync(NODE_MODULES, join(dir, "node_modules"));
  for (const [file, oldS, newS] of edits) {
    const p = join(dir, file);
    const text = readFileSync(p, "utf8");
    const n = text.split(oldS).length - 1;
    if (n !== 1) throw new Error(`${name}: ${file}: old string occurs ${n} times`);
    writeFileSync(p, text.replace(oldS, newS));
    console.log(`edit ${file}: -${JSON.stringify(oldS)}\n          +${JSON.stringify(newS)}`);
  }
  const tsc = spawnSync("npx", ["tsc", "--noEmit"], { cwd: dir, encoding: "utf8" });
  console.log(`tsc exit ${tsc.status}${tsc.status ? `\n${tsc.stdout.slice(0, 1500)}` : ""}`);
  const env = { ...process.env };
  for (const k of ["CLI_DEEP", "ENGINE_DEEP", "SEARCH_DEEP", "PUZZLE_DEEP", "LADDER_DEEP", "INPUT_DEEP", "ZOBRIST_DEEP", "PERFT_DEEP"]) delete env[k];
  const vt = spawnSync("npx", ["vitest", "run", "--reporter=json", "--outputFile=vt.json"], { cwd: dir, encoding: "utf8", env, maxBuffer: 1 << 28 });
  let summary = `vitest exit ${vt.status}`;
  try {
    const r = JSON.parse(readFileSync(join(dir, "vt.json"), "utf8"));
    summary += `; files ${r.numTotalTestSuites ?? "?"}; tests ${r.numTotalTests}, passed ${r.numPassedTests}, failed ${r.numFailedTests}, pending ${r.numPendingTests + r.numTodoTests}`;
    const failed = [];
    for (const f of r.testResults) for (const t of f.assertionResults) if (t.status === "failed")
      failed.push(`  RED ${f.name.replace(dir + "/", "")} :: ${t.fullName}\n      ${String(t.failureMessages[0] ?? "").split("\n")[0].slice(0, 200)}`);
    summary += failed.length ? `\n${failed.join("\n")}` : "\n  (no red row)";
  } catch (e) { summary += `; no json: ${e.message}\n${vt.stderr.slice(-1500)}`; }
  console.log(summary);
  if (name === "S2c_regex_multiline_flag") {
    const child = spawnSync("node", [join(dir, "src/cli.ts"), "--difficulty", "3\nx", "--ascii"], { cwd: dir, encoding: "utf8", input: "quit\n", timeout: 60000 });
    console.log(`child node src/cli.ts --difficulty $'3\\nx' --ascii (stdin quit): exit ${child.status}; stdout ${Buffer.byteLength(child.stdout)} B; stderr ${JSON.stringify(child.stderr)}`);
  }
  rmSync(dir, { recursive: true, force: true });
  console.log(`removed ${dir}; plant dirs after: ${count()}`);
}
