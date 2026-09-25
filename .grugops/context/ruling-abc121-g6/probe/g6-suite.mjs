/**
 * PROBE (ruling-abc121-g6): which suite rows red a castling-rights key bug? Same mutations as
 * g6-bite.mjs, same harness shape as ticket-to-pr-ABC-121/probe/mutants.mjs: copy the tree to a
 * scratch dir OUTSIDE the repository, mutate `src/zobrist.ts` there, symlink node_modules, run
 * vitest on the key and table files, print every failed test title. Default lane and SEARCH_DEEP.
 *
 * Usage: node g6-suite.mjs <scratch-dir> <repo-root>
 */
import { spawnSync } from "node:child_process";
import { cpSync, mkdirSync, readFileSync, realpathSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [scratch, repo] = process.argv.slice(2);
const FULL = "    if ((position.castling & (CASTLE_FLAGS[i] as number)) !== 0) key ^= CASTLE_KEYS[i] as bigint;";
const DELTA = "      if ((castlingChanged & (CASTLE_FLAGS[i] as number)) !== 0) key ^= CASTLE_KEYS[i] as bigint;";
const VARIANTS = {
  clean: [],
  "drop-rights": [[FULL, "    void i;"], [DELTA, "      void i;"]],
  "delta-ignores-rights": [[DELTA, "      void i;"]],
};
const FILES = ["src/zobrist.test.ts", "src/transposition.test.ts"];

for (const [variant, edits] of Object.entries(VARIANTS)) {
  const dir = join(scratch, `suite-${variant}`);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  for (const f of ["src", "package.json", "tsconfig.json", "vitest.config.ts", "tools"]) {
    cpSync(join(repo, f), join(dir, f), { recursive: true });
  }
  symlinkSync(realpathSync(join(repo, "node_modules")), join(dir, "node_modules"));
  const file = join(dir, "src", "zobrist.ts");
  let text = readFileSync(file, "utf8");
  for (const [from, to] of edits) {
    const n = text.split(from).length - 1;
    if (n !== 1) throw new Error(`${variant}: pattern matched ${n} times`);
    text = text.replace(from, to);
  }
  writeFileSync(file, text);
  for (const lane of ["default", "SEARCH_DEEP"]) {
    const out = join(dir, `${lane}.json`);
    const env = { ...process.env, ...(lane === "SEARCH_DEEP" ? { SEARCH_DEEP: "1" } : {}) };
    spawnSync("npx", ["vitest", "run", "--reporter=json", `--outputFile=${out}`, ...FILES], {
      cwd: dir,
      encoding: "utf8",
      env,
      maxBuffer: 256 * 1024 * 1024,
    });
    const r = JSON.parse(readFileSync(out, "utf8"));
    const failed = r.testResults.flatMap((t) =>
      t.assertionResults.filter((a) => a.status === "failed").map((a) => `${t.name.split("/src/")[1]} :: ${a.fullName}`),
    );
    console.log(JSON.stringify({ variant, lane, total: r.numTotalTests, failed: failed.length, rows: failed }));
  }
}
