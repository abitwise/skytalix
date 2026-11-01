// qe-EPIC-010-m1-batch-2: per-block report from the tool's records and the watcher log (information).
// usage: node analyse.mjs <out-dir> <watch.log>
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
const [out, watch] = process.argv.slice(2);
const med = (xs) => {
  if (!xs.length) return NaN;
  const s = [...xs].sort((a, b) => a - b), m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const t = (iso) => Date.parse(iso);
const sched = readFileSync(join(out, "schedule.log"), "utf8").trim().split("\n");
const runs = [];
for (const l of sched) {
  const m = /^(\S+) (start|end) block (\d\d) (\w+)/.exec(l);
  if (!m) continue;
  if (m[2] === "start") runs.push({ tag: `${m[4]} b${m[3]}`, build: m[4], b: m[3], s: t(m[1]) });
  else runs.at(-1).e = t(m[1]);
}
const therm = readFileSync(join(out, "thermal.log"), "utf8").trim().split("\n").map((l) => ({
  at: t(l.split(" ")[0]), tctl: Number(/tctl=([\d.]+)/.exec(l)?.[1]), mhz: Number(/busy_mhz=(\d+)/.exec(l)?.[1]),
}));
const ticks = readFileSync(watch, "utf8").split("\n").filter((l) => / tick /.test(l)).map((l) => ({ at: t(l.split(" ")[0]), foreign: l.includes("FOREIGN") }));
const nps = Object.fromEntries(readFileSync(join(out, "nps.log"), "utf8").trim().split("\n").map((l) => {
  const m = /^block (\d\d) (\w+) stockfish_nps_median=(\d+)/.exec(l);
  return [`${m[2]} b${m[1]}`, Number(m[3])];
}));
const rows = [];
let prevNps;
console.log("block-run | wall min | W/L/D | faults | time losses | nps | Δnps vs prev run | Tctl med/max | busy MHz med | foreign ticks");
for (const r of runs) {
  const dir = join(out, r.build, `b${r.b}`);
  const sum = existsSync(join(dir, "summary.txt")) ? readFileSync(join(dir, "summary.txt"), "utf8") : "";
  const wld = /W\/L\/D: (\d+\/\d+\/\d+)/.exec(sum)?.[1] ?? "?";
  const faults = /faults: (\d+)/.exec(sum)?.[1] ?? "?";
  const pgn = existsSync(join(dir, "r.pgn")) ? readFileSync(join(dir, "r.pgn"), "utf8") : "";
  const tl = (pgn.match(/loses on time|Draw by timeout/g) ?? []).length;
  const end = r.e ?? Date.now();
  const th = therm.filter((x) => x.at >= r.s && x.at <= end);
  const tk = ticks.filter((x) => x.at >= r.s && x.at <= end);
  const fg = tk.filter((x) => x.foreign).length;
  const n = nps[r.tag];
  const d = prevNps && n ? `${(((n - prevNps) / prevNps) * 100).toFixed(1)} %` : "-";
  if (n) prevNps = n;
  rows.push({ ...r, n, wall: (end - r.s) / 60000, fg, tk: tk.length });
  console.log(`${r.tag} | ${((end - r.s) / 60000).toFixed(1)} | ${wld} | ${faults} | ${tl} | ${n ?? "-"} | ${d} | ${med(th.map((x) => x.tctl)).toFixed(1)}/${Math.max(...th.map((x) => x.tctl)).toFixed(1)} | ${med(th.map((x) => x.mhz).filter(Number.isFinite))} | ${fg}/${tk.length} (${tk.length ? ((100 * fg) / tk.length).toFixed(0) : 0} %)${tk.length && fg / tk.length > 0.25 ? " >25 %" : ""}`);
}
for (const b of ["base", "candidate"]) {
  const v = rows.filter((r) => r.build === b && r.n).map((r) => r.n);
  if (v.length) console.log(`nps ${b}: n ${v.length} min ${Math.min(...v)} median ${med(v)} max ${Math.max(...v)} spread ${(((Math.max(...v) - Math.min(...v)) / med(v)) * 100).toFixed(1)} % of median`);
}
const all = rows.filter((r) => r.n).map((r) => r.n);
if (all.length) console.log(`nps all: min ${Math.min(...all)} median ${med(all)} max ${Math.max(...all)} spread ${(((Math.max(...all) - Math.min(...all)) / med(all)) * 100).toFixed(1)} %`);
const T = therm.map((x) => x.tctl).filter(Number.isFinite);
console.log(`thermal.log overall: n ${T.length} median ${med(T).toFixed(1)} max ${Math.max(...T).toFixed(1)}; busy MHz median ${med(therm.map((x) => x.mhz).filter(Number.isFinite))}`);
console.log(`watcher ticks: ${ticks.length}, with a foreign process ${ticks.filter((x) => x.foreign).length}`);
