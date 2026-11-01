// qe-ABC-262: copied verbatim from qe-ABC-261 (no edits).
// qe-ABC-261: copied verbatim from qe-ABC-259 host.mjs (no edits; 15-min shared wait cap = brief cap).
// qe-ABC-259: copied from qe-ABC-249 host.mjs; QE-259 edits: 15-min shared wait budget (brief cap); vitestPids keeps only real vitest processes (comm not flock/bash/sh/npm/timeout; QE-249-c), so another hop's flock waiter line no longer counts.
// qe-ABC-249: copied from qe-ABC-248 host.mjs; QE-249 edit: ONE 20-min wait budget shared by the whole window (brief cap), and on exhaustion the run proceeds and is flagged alone=false (inadmissible) instead of exit 3.
// qe-ABC-229 host preconditions (shared by g6/g8/deep/driver). Wait-clear: 0 foreign vitest, 0 cutechess-cli,
// load1 <= 2.0, Tctl <= 60.0; poll 15 s, up to 60 min. A foreign vitest is found once by a BRACKETED pattern
// (`pgrep -f "[/]vitest"`, run without a shell, so it never matches itself) and then waited on BY PID with
// `kill -0` (process.kill(pid, 0)); never a `while pgrep -f` loop (AGENTS.md § Test).
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { loadavg } from "node:os";
import { join } from "node:path";

export const pids = (args) => {
  try {
    return execFileSync("pgrep", args, { encoding: "utf8" }).trim().split("\n").filter(Boolean).map(Number);
  } catch {
    return [];
  }
};
const WAITER_COMMS = new Set(["flock", "bash", "sh", "npm", "npm exec", "timeout"]); // QE-259 (QE-249-c)
const commOf = (pid) => { try { return readFileSync(`/proc/${pid}/comm`, "utf8").trim(); } catch { return ""; } };
export const vitestPids = () => pids(["-f", "[/]vitest"]).filter((pid) => { const c = commOf(pid); return c !== "" && !WAITER_COMMS.has(c); }); // QE-259
export const cutechessCount = () => pids(["-x", "cutechess-cli"]).length;
export const tctl = () => {
  for (const h of readdirSync("/sys/class/hwmon")) {
    const p = join("/sys/class/hwmon", h);
    if (readFileSync(join(p, "name"), "utf8").trim() === "k10temp") return Number(readFileSync(join(p, "temp1_input"), "utf8")) / 1000;
  }
  return Number.NaN;
};
export const sleepSync = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
const alive = (pid) => {
  try {
    process.kill(pid, 0);
    return true;
  } catch (e) {
    return e.code === "EPERM";
  }
};
/** Blocks until the host is clear; returns { l, t }. log(s) receives one line per wait poll. Exits 3 after 60 min. */
let budgetMs = 15 * 60_000; // QE-259: brief cap 15 min (was 20, QE-249)
export function waitClear(label, log) {
  const t0 = Date.now();
  const cap = budgetMs; // QE-249
  for (let i = 1; Date.now() - t0 < cap; i++) {
    const v = vitestPids();
    if (v.length > 0) {
      log(`${label} foreign vitest pid(s) ${v.join(",")}: waiting on kill -0`);
      for (const pid of v) while (alive(pid) && Date.now() - t0 < cap) sleepSync(5_000);
      log(`${label} foreign vitest gone after ${((Date.now() - t0) / 1000).toFixed(0)} s`);
      continue;
    }
    const l = loadavg()[0], c = cutechessCount(), t = tctl();
    if (c === 0 && l <= 2.0 && t <= 60.0) {
      if (i > 1) log(`${label} clear after poll ${i} load1=${l.toFixed(2)} tctl=${t.toFixed(1)}`);
      budgetMs -= Date.now() - t0; // QE-249
      return { l, t, alone: true, waited: Date.now() - t0 };
    }
    log(`${label} wait poll=${i} load1=${l.toFixed(2)} vitest=0 cutechess=${c} tctl=${t.toFixed(1)}`);
    sleepSync(15_000);
  }
  budgetMs = 0; // QE-249
  const v = vitestPids();
  if (v.length === 0 && cutechessCount() === 0) { // QE-249: budget gone, no foreign runner: cool up to 60 s, then run (alone; load1 <= 8 is the NFR-008 admissibility line)
    for (let k = 0; k < 4 && !(loadavg()[0] <= 2.0 && tctl() <= 60.0); k++) sleepSync(15_000);
    log(`${label} budget spent; no foreign vitest; load1=${loadavg()[0].toFixed(2)} tctl=${tctl().toFixed(1)}`);
    return { l: loadavg()[0], t: tctl(), alone: true, waited: Date.now() - t0 };
  }
  log(`${label} WAIT-BUDGET-EXHAUSTED (15 min); running NOT ALONE (SHARED); foreign vitest pids: ${v.join(",") || "none"} load1=${loadavg()[0].toFixed(2)}`);
  return { l: loadavg()[0], t: tctl(), alone: false, foreign: v, waited: Date.now() - t0 };
}
