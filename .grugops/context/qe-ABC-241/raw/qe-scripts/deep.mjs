// qe-ABC-241 (from qe-ABC-228 deep.mjs; adds wait-clear before every lane) deep lanes, one file at a time, from the worktree (cwd), via the local vitest entry
// (`node ./node_modules/vitest/vitest.mjs`, heap 400; never npx, never npm exec). usage: node deep.mjs <outDir>
import { execFileSync, spawnSync } from "node:child_process";
import { appendFileSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { loadavg } from "node:os";
import { join } from "node:path";

const out = process.argv[2];
const ts = () => new Date().toISOString().replace(/\.\d+Z$/, "Z");
const log = (s) => appendFileSync(join(out, "runs.log"), `${ts()} ${s}\n`);
const vitestCount = () => {
  try {
    return execFileSync("pgrep", ["-f", "[/]vitest"], { encoding: "utf8" }).trim().split("\n").length;
  } catch {
    return 0;
  }
};
const tctl = () => {
  for (const h of readdirSync("/sys/class/hwmon")) {
    const p = join("/sys/class/hwmon", h);
    if (readFileSync(join(p, "name"), "utf8").trim() === "k10temp") return (Number(readFileSync(join(p, "temp1_input"), "utf8")) / 1000).toFixed(1);
  }
  return "?";
};
const sleepSync = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
const cutechessCount = () => {
  try {
    return execFileSync("pgrep", ["-x", "cutechess-cli"], { encoding: "utf8" }).trim().split("\n").length;
  } catch {
    return 0;
  }
};
// Wait-clear before every lane: 0 foreign vitest, 0 cutechess-cli, load1 <= 2.0, Tctl <= 60.0; poll 15 s, up to 60 min.
function waitClear(label) {
  for (let i = 1; i <= 240; i++) {
    const l = loadavg()[0], v = vitestCount(), c = cutechessCount(), t = Number(tctl());
    if (v === 0 && c === 0 && l <= 2.0 && t <= 60.0) {
      if (i > 1) log(`${label} clear after poll ${i}`);
      return;
    }
    log(`${label} wait poll=${i} load1=${l.toFixed(2)} vitest=${v} cutechess=${c} tctl=${t.toFixed(1)}`);
    sleepSync(15_000);
  }
  log(`${label} PRECONDITION-NOT-MET after 60 min`);
  process.exit(3);
}
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
];
for (const [flag, file] of LANES) {
  const name = `${flag}-${file.replace(/^src\//, "").replace(/\.test\.ts$/, "")}`;
  waitClear(name);
  log(`${name} start load1=${loadavg()[0].toFixed(2)} tctl=${tctl()} foreign_vitest=${vitestCount()}`);
  const t0 = Date.now();
  const r = spawnSync(process.execPath, ["./node_modules/vitest/vitest.mjs", "run", file, "--reporter=verbose"], {
    env: { ...process.env, [flag]: "1", NODE_OPTIONS: "--max-old-space-size=400" },
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  writeFileSync(join(out, `${name}.txt`), `${r.stdout}${r.stderr}`);
  const text = readFileSync(join(out, `${name}.txt`), "utf8");
  const tests = /^\s+Tests\s+(.*)$/m.exec(text)?.[1] ?? "?";
  log(`${name} end rc=${r.status} wall=${((Date.now() - t0) / 1000).toFixed(1)}s load1=${loadavg()[0].toFixed(2)} tctl=${tctl()} :: ${tests}`);
}
log("DONE");
