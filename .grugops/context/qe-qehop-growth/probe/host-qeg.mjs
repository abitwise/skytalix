// qe-qehop-growth: Linux host reads for the T-QEHOP-GROWTH window (oeselg-dev). Derived from qe-ABC-248 qe-scripts/host.mjs
// (tctl, the bracketed pgrep). Added: a vitest is FOREIGN when its /proc/<pid>/cwd is not under this window's arms root
// (the macOS sampler excluded by test-file name; on Linux the pool is threads and cwd is the reliable owner), and the
// cutechess-cli / oeselg-labs/platform counts. No process is ever signalled here except kill -0 (a liveness read).
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, readlinkSync } from "node:fs";
import { join } from "node:path";

export const pids = (args) => {
  try {
    return execFileSync("pgrep", args, { encoding: "utf8" }).trim().split("\n").filter(Boolean).map(Number);
  } catch {
    return [];
  }
};
export const vitestPids = () => pids(["-f", "[/]vitest"]);
export const cutechessCount = () => pids(["-x", "cutechess-cli"]).length;
export const platformCount = () => pids(["-f", "[o]eselg-labs/platform"]).length;
const cwdOf = (pid) => {
  try {
    return readlinkSync(`/proc/${pid}/cwd`);
  } catch {
    return "?";
  }
};
const cmdOf = (pid) => {
  try {
    return readFileSync(`/proc/${pid}/cmdline`, "utf8").replace(/\0/g, " ").trim();
  } catch {
    return "?";
  }
};
/** vitest processes whose cwd is not under armsRoot (armsRoot "" = every vitest is foreign). */
export const foreignVitest = (armsRoot) =>
  vitestPids()
    .map((pid) => ({ pid, cwd: cwdOf(pid), cmd: cmdOf(pid) }))
    .filter((p) => !(armsRoot && p.cwd.startsWith(`${armsRoot}/`)));
export const tctl = () => {
  for (const h of readdirSync("/sys/class/hwmon")) {
    const p = join("/sys/class/hwmon", h);
    if (readFileSync(join(p, "name"), "utf8").trim() === "k10temp") return Number(readFileSync(join(p, "temp1_input"), "utf8")) / 1000;
  }
  return Number.NaN;
};
export const load1 = () => Number(readFileSync("/proc/loadavg", "utf8").split(" ")[0]);
export const sleepSync = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
export const ts = () => new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
