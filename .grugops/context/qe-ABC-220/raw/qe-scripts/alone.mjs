// qe-ABC-220 ALONE readings (PREREG § 4), one per invocation, wait-clear first, a host sampler every 5 s
// (Tctl, load1, foreign vitest, cutechess). A11 carries the THERMAL STOP: from the 6th sample on, median Tctl
// > 85.0 °C -> SIGTERM, NOT READ. Runs from the worktree (cwd). usage: node alone.mjs <A12|A11|A14a> <outDir>
import { execFileSync, spawn } from "node:child_process";
import { appendFileSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { loadavg } from "node:os";
import { join } from "node:path";

const [what, out] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const ts = () => new Date().toISOString().replace(/\.\d+Z$/, "Z");
const log = (s) => appendFileSync(join(out, `${what}.log`), `${ts()} ${s}\n`);
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
// Our own child is the only vitest allowed during the read; before it starts, any vitest is foreign.
// Foreign = a vitest process whose command line does not name this worktree's cwd.
const foreignVitest = () => {
  try {
    return execFileSync("pgrep", ["-af", "[/]vitest"], { encoding: "utf8" }).trim().split("\n").filter((l) => l && !l.includes(process.cwd()) && !l.includes("./node_modules/vitest")).length;
  } catch {
    return 0;
  }
};
function waitClear() {
  for (let i = 1; i <= 240; i++) {
    const l = loadavg()[0], v = foreignVitest(0), c = count(["-x", "cutechess-cli"]), t = tctl();
    if (v === 0 && c === 0 && l <= 2.0 && t <= 60.0) {
      log(`clear at poll ${i} load1=${l.toFixed(2)} tctl=${t.toFixed(1)}`);
      return;
    }
    log(`wait poll=${i} load1=${l.toFixed(2)} vitest=${v} cutechess=${c} tctl=${t.toFixed(1)}`);
    sleepSync(15_000);
  }
  log("PRECONDITION-NOT-MET after 60 min");
  process.exit(3);
}
const RUNS = {
  A12: { cmd: "npm", args: ["test"], env: {} },
  A11: { cmd: process.execPath, args: ["./node_modules/vitest/vitest.mjs", "run", "src/uci-session.test.ts", "--reporter=verbose"], env: { ENGINE_DEEP: "1", NODE_OPTIONS: "--max-old-space-size=400" } },
  A14b: { cmd: process.execPath, args: [".grugops/context/qe-ABC-220/probe/a14b-probe.mjs", "."], env: {} },
  A14a: { cmd: process.execPath, args: ["./node_modules/vitest/vitest.mjs", "run", "src/uci.real-engine.test.ts", "--reporter=verbose"], env: { UCI_DEEP: "1", NODE_OPTIONS: "--max-old-space-size=400" } },
};
const run = RUNS[what];
waitClear();
const l0 = loadavg()[0], t0c = tctl();
const samples = [];
let stopped = false;
const t0 = performance.now();
const child = spawn(run.cmd, run.args, { env: { ...process.env, ...run.env }, stdio: ["ignore", "pipe", "pipe"] });
let text = "";
child.stdout.on("data", (d) => (text += d));
child.stderr.on("data", (d) => (text += d));
const sampler = setInterval(() => {
  // During the read our own vitest is 1 main process (A12 via npm: same); workers are threads.
  const s = { at: ts(), tctl: tctl(), load1: loadavg()[0], vitest_all: foreignVitest(), cutechess: count(["-x", "cutechess-cli"]) };
  samples.push(s);
  appendFileSync(join(out, `${what}-host.log`), `${s.at} tctl=${s.tctl.toFixed(1)} load1=${s.load1.toFixed(2)} foreign_vitest=${s.vitest_all} cutechess=${s.cutechess}\n`);
  if (what === "A11" && samples.length >= 6) {
    const sorted = samples.map((x) => x.tctl).sort((a, b) => a - b);
    const med = sorted[Math.floor(sorted.length / 2)];
    if (med > 85.0 && !stopped) {
      stopped = true;
      log(`THERMAL STOP median Tctl ${med.toFixed(1)} > 85.0 at sample ${samples.length}`);
      child.kill("SIGTERM");
    }
  }
}, 5_000);
child.on("exit", (code, signal) => {
  const wall = (performance.now() - t0) / 1000;
  clearInterval(sampler);
  const l1 = loadavg()[0];
  writeFileSync(join(out, `${what}.txt`), text);
  const tests = /^\s+Tests\s+(.*)$/m.exec(text)?.[1] ?? "?";
  const dur = /^\s+Duration\s+(\S+)/m.exec(text)?.[1] ?? "?";
  const tc = samples.map((x) => x.tctl).sort((a, b) => a - b);
  const maxVitest = Math.max(0, ...samples.map((x) => x.vitest_all));
  log(
    `${what} rc=${code} signal=${signal} wall=${wall.toFixed(2)}s vitest_duration=${dur} load1_before=${l0.toFixed(2)} load1_after=${l1.toFixed(2)} tctl_before=${t0c.toFixed(1)} tctl_median=${tc.length ? tc[Math.floor(tc.length / 2)].toFixed(1) : "?"} tctl_max=${tc.length ? tc.at(-1).toFixed(1) : "?"} samples=${samples.length} max_foreign_vitest_seen=${maxVitest} thermal_stop=${stopped} :: ${tests}`,
  );
  console.log(readFileSync(join(out, `${what}.log`), "utf8").trim().split("\n").at(-1));
});
