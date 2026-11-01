// qe-ABC-254 host readings (qe-ABC-229/248 host.mjs pattern). A foreign vitest is found by a BRACKETED pattern
// (`pgrep -f "[/]vitest"`, no shell, never matches itself) and waited on BY PID with kill -0; never a `while pgrep` loop.
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { loadavg } from "node:os";
import { join } from "node:path";
export const pids = (args) => { try { return execFileSync("pgrep", args, { encoding: "utf8" }).trim().split("\n").filter(Boolean).map(Number); } catch { return []; } };
export const vitestPids = () => pids(["-f", "[/]vitest"]);
export const cutechessCount = () => pids(["-x", "cutechess-cli"]).length;
export const load1 = () => loadavg()[0];
export const tctl = () => {
  for (const h of readdirSync("/sys/class/hwmon")) {
    const p = join("/sys/class/hwmon", h);
    if (readFileSync(join(p, "name"), "utf8").trim() === "k10temp") return Number(readFileSync(join(p, "temp1_input"), "utf8")) / 1000;
  }
  return Number.NaN;
};
/** Busy jiffies of the whole host (all CPUs), from /proc/stat: user+nice+system+irq+softirq+steal. 100 Hz. */
export const busyJiffies = () => {
  const f = readFileSync("/proc/stat", "utf8").split("\n")[0].trim().split(/\s+/).slice(1).map(Number);
  return f[0] + f[1] + f[2] + f[5] + f[6] + f[7];
};
export const sleepSync = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
export const alive = (pid) => { try { process.kill(pid, 0); return true; } catch (e) { return e.code === "EPERM"; } };
export const busyProcs = () => {
  try {
    return execFileSync("ps", ["-eo", "pid,pcpu,etimes,comm", "--sort=-pcpu"], { encoding: "utf8" }).trim().split("\n").slice(1)
      .map((l) => l.trim().split(/\s+/)).filter((f) => Number(f[1]) > 20 && Number(f[0]) !== process.pid).slice(0, 5).map((f) => `${f[3]}:${f[0]}:${f[1]}%`).join(" ");
  } catch { return ""; }
};
