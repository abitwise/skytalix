// qe-ABC-254-a4v2: qe-ABC-254-a4's host.mjs; the one change is marked V2-INFO (evidence only, enters no rule).
// qe-ABC-254 host readings (qe-ABC-229/248 host.mjs pattern). A foreign vitest is found by a BRACKETED pattern
// (`pgrep -f "[/]vitest"`, no shell, never matches itself) and waited on BY PID with kill -0; never a `while pgrep` loop.
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { loadavg } from "node:os";
import { join } from "node:path";
export const pids = (args) => { try { return execFileSync("pgrep", args, { encoding: "utf8" }).trim().split("\n").filter(Boolean).map(Number); } catch { return []; } };
// A RUNNING vitest only: the matched process must itself be node (or vitest). A `flock … ./node_modules/.bin/vitest`
// waiter queued on host-test.lock (and its bash wrapper) is not a running vitest; counting it deadlocks with the
// lock holder (seen 15:53Z: two waiters for our own lock). QE-254 post-PREREG detector fix, disclosed.
const commOf = (pid) => { try { return readFileSync(`/proc/${pid}/comm`, "utf8").trim(); } catch { return ""; } };
export const vitestPids = () => pids(["-f", "[/]vitest"]).filter((pid) => /^(node|vitest)/.test(commOf(pid)));
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
// ── qe-ABC-254-a4 additions (the brief: "no foreign process > 50 % CPU"; real processes only, not flock waiters). ──
// A CPU% read from `ps pcpu` is a lifetime average, so it is not used for gating. Instead two /proc/<pid>/stat snapshots
// (utime+stime ticks, 100 Hz) are diffed over a known wall interval. `exclude` = the pids of this driver and its probe.
export const procSnap = () => {
  const m = new Map();
  for (const d of readdirSync("/proc")) {
    if (!/^\d+$/.test(d)) continue;
    try {
      const s = readFileSync(`/proc/${d}/stat`, "utf8"); const rp = s.lastIndexOf(")");
      const f = s.slice(rp + 2).split(" ");
      // V2-INFO: cticks = cutime+cstime (reaped children's CPU, credited to the parent at wait) — QE-254-d evidence only.
      m.set(Number(d), { comm: s.slice(s.indexOf("(") + 1, rp), ticks: Number(f[11]) + Number(f[12]), cticks: Number(f[13]) + Number(f[14]) });
    } catch { /* exited */ }
  }
  return m;
};
/** Processes alive in both snapshots, above `minPct` % of one core over `wallS`, minus `exclude`: "comm:pid:pct%". */
// V2-INFO: withChildren=true adds the reaped-children ticks (short-lived git/node/sh children show up on their parent).
// foreignHot (the start check) keeps the default false, so the start check behaves exactly as qe-ABC-254-a4's.
export const hotProcs = (a, b, wallS, minPct, exclude = [], withChildren = false) => {
  const out = [];
  for (const [pid, x] of b) {
    if (exclude.includes(pid) || !a.has(pid)) continue;
    const t = (y) => y.ticks + (withChildren ? y.cticks : 0);
    const pct = ((t(x) - t(a.get(pid))) / 100 / wallS) * 100;
    if (pct > minPct) out.push({ pid, comm: x.comm, pct: Math.round(pct) });
  }
  return out.sort((p, q) => q.pct - p.pct).slice(0, 8).map((p) => `${p.comm}:${p.pid}:${p.pct}%`);
};
/** Start-precondition read: foreign processes above 50 % of one core over a 3 s sample. */
export const foreignHot = (sampleMs = 3000) => {
  const a = procSnap(); const t0 = Date.now(); sleepSync(sampleMs); const b = procSnap();
  return hotProcs(a, b, (Date.now() - t0) / 1000, 50, [process.pid]);
};
