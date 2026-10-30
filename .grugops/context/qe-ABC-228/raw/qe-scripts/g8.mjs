// qe-ABC-228 G8: `npm test` wall, base and head in the same session, interleaved b h h b b h.
// usage: node g8.mjs <headDir> <baseDir> <outDir>
import { execFileSync, spawnSync } from "node:child_process";
import { appendFileSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { loadavg } from "node:os";
import { join } from "node:path";

const [head, base, out] = process.argv.slice(2);
const ORDER = ["base", "head", "head", "base", "base", "head"];
const res = { base: [], head: [] };
// resume edit (qe-ABC-228, 2026-10-30): wait-clear before every run (0 foreign vitest, 0 cutechess-cli, load1 <= 2.0,
// Tctl <= 60.0; poll 15 s, up to 60 min), the PREREG's timing preconditions.
const count = (args) => {
  try {
    return execFileSync("pgrep", args, { encoding: "utf8" }).trim().split("\n").length;
  } catch {
    return 0;
  }
};
const tctl = () => {
  for (const h of readdirSync("/sys/class/hwmon")) {
    const p = join("/sys/class/hwmon", h);
    if (readFileSync(join(p, "name"), "utf8").trim() === "k10temp") return Number(readFileSync(join(p, "temp1_input"), "utf8")) / 1000;
  }
  return Number.NaN;
};
const sleepSync = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
function waitClear(label) {
  for (let i = 1; i <= 240; i++) {
    const l = loadavg()[0], v = count(["-f", "[/]vitest"]), c = count(["-x", "cutechess-cli"]), t = tctl();
    if (v === 0 && c === 0 && l <= 2.0 && t <= 60.0) return t;
    appendFileSync(join(out, "g8-wait.log"), `${new Date().toISOString()} ${label} wait poll=${i} load1=${l.toFixed(2)} vitest=${v} cutechess=${c} tctl=${t.toFixed(1)}\n`);
    sleepSync(15_000);
  }
  console.log("PRECONDITION-NOT-MET");
  process.exit(3);
}
ORDER.forEach((tree, i) => {
  const cwd = tree === "head" ? head : base;
  const t0c = waitClear(`run ${i + 1} ${tree}`);
  const l0 = loadavg()[0];
  const t0 = performance.now();
  const r = spawnSync("npm", ["test"], { cwd, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  const wall = (performance.now() - t0) / 1000;
  const text = `${r.stdout}${r.stderr}`;
  writeFileSync(join(out, `g8-${i + 1}-${tree}.txt`), text);
  const tests = /^\s+Tests\s+(.*)$/m.exec(text)?.[1] ?? "?";
  const dur = /^\s+Duration\s+(\S+)/m.exec(text)?.[1] ?? "?";
  res[tree].push(wall);
  const line = `run ${i + 1} ${tree} rc=${r.status} wall=${wall.toFixed(2)}s vitest_duration=${dur} load1_before=${l0.toFixed(2)} tctl_before=${t0c.toFixed(1)} :: ${tests}`;
  appendFileSync(join(out, "g8.log"), `${new Date().toISOString()} ${line}\n`);
  console.log(line);
});
const med = (a) => [...a].sort((x, y) => x - y)[1];
console.log(`median wall: base ${med(res.base).toFixed(2)} s, head ${med(res.head).toFixed(2)} s, delta ${(med(res.head) - med(res.base)).toFixed(2)} s`);
