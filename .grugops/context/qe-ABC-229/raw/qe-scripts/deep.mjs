// qe-ABC-229 (from qe-ABC-228-ii deep.mjs; wait-clear moved to host.mjs; +1 lane: ENGINE_DEEP uci-session, ABC-220's,
// reported) deep lanes, one file at a time, from the worktree (cwd), via the local vitest entry
// (`node ./node_modules/vitest/vitest.mjs`, heap 400; never npx, never npm exec). usage: node deep.mjs <outDir> [filter]
import { spawnSync } from "node:child_process";
import { appendFileSync, readFileSync, writeFileSync } from "node:fs";
import { loadavg } from "node:os";
import { join } from "node:path";
import { tctl, vitestPids, waitClear } from "./host.mjs";

const [out, filter] = process.argv.slice(2);
const ts = () => new Date().toISOString().replace(/\.\d+Z$/, "Z");
const log = (s) => appendFileSync(join(out, "runs.log"), `${ts()} ${s}\n`);
const LANES = [
  ["SEARCH_DEEP", "src/quiescence.test.ts"],
  ["SEARCH_DEEP", "src/search.null-move.test.ts"],
  ["SEARCH_DEEP", "src/search.test.ts"],
  ["SEARCH_DEEP", "src/search.ordering.test.ts"],
  ["SEARCH_DEEP", "src/search.pvs-lmr.test.ts"],
  ["SEARCH_DEEP", "src/transposition.test.ts"],
  ["ENGINE_DEEP", "src/quiescence.test.ts"],
  ["ENGINE_DEEP", "src/search.ordering.test.ts"],
  ["ENGINE_DEEP", "src/search.pvs-lmr.test.ts"],
  ["ENGINE_DEEP", "src/transposition.test.ts"],
  ["PUZZLE_DEEP", "src/puzzle-suite.test.ts"],
  ["ENGINE_DEEP", "src/engine.test.ts"],
  ["ENGINE_DEEP", "src/levels.test.ts"],
  ["CLI_DEEP", "src/cli.real-engine.test.ts"],
  ["UCI_DEEP", "src/uci.real-engine.test.ts"],
  ["ENGINE_DEEP", "src/uci-session.test.ts"],
];
for (const [flag, file] of LANES) {
  const name = `${flag}-${file.replace(/^src\//, "").replace(/\.test\.ts$/, "")}`;
  if (filter && !name.includes(filter)) continue;
  waitClear(name, log);
  log(`${name} start load1=${loadavg()[0].toFixed(2)} tctl=${tctl().toFixed(1)} foreign_vitest=${vitestPids().length}`);
  const t0 = Date.now();
  const r = spawnSync(process.execPath, ["./node_modules/vitest/vitest.mjs", "run", file, "--reporter=verbose"], {
    env: { ...process.env, [flag]: "1", NODE_OPTIONS: "--max-old-space-size=400" },
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  writeFileSync(join(out, `${name}.txt`), `${r.stdout}${r.stderr}`);
  const text = readFileSync(join(out, `${name}.txt`), "utf8");
  const tests = /^\s+Tests\s+(.*)$/m.exec(text)?.[1] ?? "?";
  log(`${name} end rc=${r.status} wall=${((Date.now() - t0) / 1000).toFixed(1)}s load1=${loadavg()[0].toFixed(2)} tctl=${tctl().toFixed(1)} :: ${tests}`);
}
log("DONE");
