import { readFileSync } from "node:fs";
const ev = readFileSync(process.argv[2], "utf8").trim().split("\n").map((l) => JSON.parse(l));
const procs = new Map(); // pid -> {kind, ppid}
for (const e of ev) if (e.ev === "start" && e.tid === 0) procs.set(e.pid, e);
const mainPid = [...procs.values()].find((p) => /vitest/.test(p.kind) && !/npm/.test(p.kind))?.pid;
const isDesc = (pid) => { let p = procs.get(pid); while (p) { if (p.ppid === mainPid) return true; p = procs.get(p.ppid); } return false; };
const lanePid = ev[0].pid; const cls = (e) => e.tid > 0 ? "worker" : e.pid === mainPid ? "main" : e.pid === lanePid ? "lane-npm" : /run-bounded/.test(e.kind) ? "wrapper" : "child";
const live = new Map(); const max = {}; const mibs = {}; const starts = {};
let peak = 0, peakAt = null;
for (const e of ev) {
  if (e.ev === "start") { const c = cls(e); (mibs[c] ??= new Set()).add(e.mib); starts[c] = (starts[c] ?? 0) + 1; if (c !== "worker") live.set("p" + e.pid, c); }
  if (e.ev === "end") live.delete("p" + e.pid);
  if (e.ev === "W+") live.set("w" + e.id, "worker");
  if (e.ev === "W-") live.delete("w" + e.id);
  const by = {}; for (const c of live.values()) by[c] = (by[c] ?? 0) + 1;
  for (const [c, n] of Object.entries(by)) max[c] = Math.max(max[c] ?? 0, n);
  const counted = [...live.values()].filter((c) => c !== "lane-npm").length;
  if (counted > peak) { peak = counted; peakAt = by; }
}
console.log(JSON.stringify({ starts, maxLiveByClass: max, peakCountedExclLaneNpm: peak, compositionAtPeak: peakAt, heapMiB: Object.fromEntries(Object.entries(mibs).map(([k, v]) => [k, [...v]])), unended: live.size }));
