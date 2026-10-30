// qe-ABC-230 deep lanes, one at a time, from the worktree (cwd): G1 PUZZLE_DEEP, G5 ENGINE_DEEP levels + engine,
// G7 ENGINE_DEEP transposition. ./node_modules/.bin/vitest, never a bare npx. usage: node deep.mjs <outDir>
import { spawnSync, execFileSync } from "node:child_process";
import { appendFileSync, readFileSync, writeFileSync } from "node:fs";
import { loadavg } from "node:os";
import { join } from "node:path";

const out = process.argv[2];
const log = (s) => appendFileSync(join(out, "runs.log"), `${new Date().toISOString().replace(/\.\d+Z$/, "Z")} ${s}\n`);
const vitestCount = () => {
  try {
    return execFileSync("pgrep", ["-f", "[/]vitest"], { encoding: "utf8" }).trim().split("\n").length;
  } catch {
    return 0;
  }
};
const LANES = [
  ["PUZZLE_DEEP", "src/puzzle-suite.test.ts"],
  ["ENGINE_DEEP", "src/levels.test.ts"],
  ["ENGINE_DEEP", "src/engine.test.ts"],
  ["ENGINE_DEEP", "src/transposition.test.ts"],
];
for (const [flag, file] of LANES) {
  const name = `${flag}-${file.replace(/^src\//, "").replace(/\.test\.ts$/, "")}`;
  log(`${name} start load1=${loadavg()[0].toFixed(2)} foreign_vitest=${vitestCount()}`);
  const t0 = Date.now();
  const r = spawnSync("./node_modules/.bin/vitest", ["run", file, "--reporter=verbose"], {
    env: { ...process.env, [flag]: "1", NODE_OPTIONS: "--max-old-space-size=400" },
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  writeFileSync(join(out, `${name}.txt`), `${r.stdout}${r.stderr}`);
  const text = readFileSync(join(out, `${name}.txt`), "utf8");
  const tests = /^\s+Tests\s+(.*)$/m.exec(text)?.[1] ?? "?";
  log(`${name} end rc=${r.status} wall=${((Date.now() - t0) / 1000).toFixed(1)}s load1=${loadavg()[0].toFixed(2)} :: ${tests}`);
}
log("DONE");
