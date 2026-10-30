// qe-ABC-229 (from qe-ABC-228-ii driver.mjs; preconditions via host.mjs, foreign vitest waited on by PID with kill -0)
// qe-ABC-230 smoke driver (node port of driver.sh; the sandbox refuses `bash <script>`). D or R, width 1, ALONE,
// with the pre-registered preconditions, host log and THERMAL STOP. Run from the worktree (cwd).
// usage: node driver.mjs <reading-dir> d <cand> <base>  -> rating.ts d <cand> <base> <dir>/out --budget-ms 1500 --rounds 5 --concurrency 1
//        node driver.mjs <reading-dir> r <cand>         -> rating.ts r <cand> <dir>/out --elo 1910 --rounds 5 --concurrency 1
// Tool paths come from CUTECHESS_CLI / STOCKFISH in the environment; this file writes none.
import { execFileSync, spawn } from "node:child_process";
import { appendFileSync, existsSync, mkdirSync, openSync, readdirSync, readFileSync, readSync, closeSync, statSync } from "node:fs";
import { loadavg } from "node:os";
import { join } from "node:path";
import { waitClear as hostWaitClear, vitestPids } from "./host.mjs";

// `--env=<file>` (optional, any position): `export NAME=value` lines read into this process's environment, so the
// tool paths reach the harness without a shell `source` (the sandbox refuses it). Nothing from the file is logged.
const argv = process.argv.slice(2);
const envArg = argv.find((a) => a.startsWith("--env="));
if (envArg) {
  for (const line of readFileSync(envArg.slice(6), "utf8").split("\n")) {
    const m = /^\s*(?:export\s+)?([A-Z_][A-Z0-9_]*)=["']?(.*?)["']?\s*$/.exec(line);
    if (m) process.env[m[1]] = m[2];
  }
}
const [dir, mode, cand, base] = argv.filter((a) => !a.startsWith("--env="));
const mon = join(dir, "mon");
const out = join(dir, "out");
mkdirSync(mon, { recursive: true });
const ts = () => new Date().toISOString().replace(/\.\d+Z$/, "Z");
const log = (file, s) => appendFileSync(join(mon, file), `${ts()} ${s}\n`);
const count = (args) => {
  try {
    return execFileSync("pgrep", args, { encoding: "utf8" }).trim().split("\n").length;
  } catch {
    return 0;
  }
};
const vitest = () => vitestPids().length;
const cutechess = () => count(["-x", "cutechess-cli"]);
const tctl = () => {
  for (const h of readdirSync("/sys/class/hwmon")) {
    const p = join("/sys/class/hwmon", h);
    if (readFileSync(join(p, "name"), "utf8").trim() === "k10temp") return Number(readFileSync(join(p, "temp1_input"), "utf8")) / 1000;
  }
  return Number.NaN;
};
const busyMhz = () => {
  let max = 0;
  for (const c of readdirSync("/sys/devices/system/cpu").filter((d) => /^cpu\d+$/.test(d))) {
    const f = join("/sys/devices/system/cpu", c, "cpufreq/cpuinfo_avg_freq");
    if (existsSync(f)) max = Math.max(max, Math.round(Number(readFileSync(f, "utf8")) / 1000));
  }
  return max;
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const median = (a) => {
  const s = [...a].sort((x, y) => x - y);
  const n = s.length;
  return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
};

// Preconditions: 0 cutechess-cli, 0 foreign vitest (waited on by PID), load1 <= 2.0, Tctl <= 60.0; poll 15 s, up to 60 min.
hostWaitClear("smoke", (line) => log("wait.log", line));
log("wait.log", "PRECONDITIONS-MET");

const args =
  mode === "d"
    ? ["d", cand, base, out, "--budget-ms", "1500", "--rounds", "5", "--concurrency", "1"]
    : ["r", cand, out, "--elo", "1910", "--rounds", "5", "--concurrency", "1"];
log("wait.log", `harness start: ${args.join(" ").replace(out, "<out>")}`);
const hfd = openSync(join(mon, "harness.stdout"), "w");
const harness = spawn(process.execPath, ["tools/rating/rating.ts", ...args], { stdio: ["ignore", hfd, hfd] });
let exited = null;
harness.on("exit", (code, signal) => {
  exited = { code, signal };
});

const temps = [];
const mhz = [];
let offset = 0;
let pending = "";
let stopped = false;
while (exited === null) {
  await sleep(10_000);
  const t = tctl();
  const m = busyMhz();
  const v = vitest();
  temps.push(t);
  mhz.push(m);
  log("sampler.log", `load1=${loadavg()[0].toFixed(2)} tctl=${t.toFixed(1)} vitest=${v} cutechess=${cutechess()} busy_mhz=${m}`);
  if (v > 0) log("sampler.log", `FOREIGN-VITEST count=${v}`);
  const outFile = join(out, `${mode}.out`);
  if (existsSync(outFile)) {
    const size = statSync(outFile).size;
    if (size > offset) {
      const buf = Buffer.alloc(size - offset);
      const fd = openSync(outFile, "r");
      readSync(fd, buf, 0, buf.length, offset);
      closeSync(fd);
      offset = size;
      const lines = (pending + buf.toString()).split("\n");
      pending = lines.pop() ?? "";
      for (const line of lines) if (/^(Started|Finished) game/.test(line)) log("games.log", line);
    }
  }
  const med = median(temps);
  log("thermal-watch.log", `running-median ${med.toFixed(2)} samples=${temps.length}`);
  if (!stopped && temps.length >= 6 && med > 85.0) {
    stopped = true;
    log("thermal-watch.log", `THERMAL-STOP median=${med.toFixed(2)} samples=${temps.length}`);
    log("wait.log", `THERMAL-STOP median=${med.toFixed(2)} samples=${temps.length}`);
    try {
      execFileSync("pkill", ["-TERM", "-x", "cutechess-cli"]);
    } catch {}
    harness.kill("SIGTERM");
  }
}
closeSync(hfd);
const first6 = median(mhz.slice(0, 6));
const all = median(mhz);
log(
  "wait.log",
  `harness end code=${exited.code} signal=${exited.signal} samples=${temps.length} tctl_median=${median(temps).toFixed(2)} tctl_max=${Math.max(...temps).toFixed(1)} busy_mhz_first6=${first6} busy_mhz_median=${all} fall=${((1 - all / first6) * 100).toFixed(2)}% thermal_stop=${stopped}`,
);
await sleep(3000);
log("wait.log", `after: cutechess=${cutechess()} stockfish=${count(["-x", "stockfish"])}`);
process.exit(stopped ? 9 : (exited.code ?? 1));
