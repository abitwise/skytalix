// secnfr-census-1105 timeline: vitest's phase totals (console line) and the file timeline (JSON startTime / endTime), per scored run.
// Usage: node timeline.cjs <out dir> <arms, comma-separated> [top]
// Two workers: a greedy replay gives each file to the first worker whose last slot ended before the file's startTime, so a
// file's gap (its startTime minus that worker's previous endTime) is the time its worker spent on start-up and collect.
const fs = require("fs");
const [dir, armsArg, topArg] = process.argv.slice(2);
const arms = armsArg.split(","); const top = +topArg || 14;
const rows = fs.readFileSync(`${dir}/a8.tsv`, "utf8").trim().split("\n").map((l) => l.split("\t"));
const hd = rows.shift(); const ix = (k) => hd.indexOf(k);
const used = rows.filter((r) => r[ix("scored")] === "1" && arms.includes(r[ix("arm")]));
const med = (a) => { const s = [...a].sort((x, y) => x - y); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const strip = (n) => n.replace(/.*\/arms\/[^/]+\//, "");
const ph = {}, end = {}, startF = {}, gap = {}, last = {}, wTot = [], span = [], tailF = {}, wEnd = [];
const clean = (s) => s.replace(/\x1b\[[0-9;]*m/g, "");
for (const r of used) {
  const out = clean(fs.readFileSync(`${dir}/runs/out-${r[ix("seq")]}.txt`, "utf8"));
  const m = out.match(/Duration\s+([\d.]+)(ms|s)\s*\(([^)]*)\)/);
  if (m) {
    (ph.duration ??= []).push(+m[1] * (m[2] === "s" ? 1000 : 1));
    for (const p of m[3].split(",")) { const q = p.trim().match(/^(\w+)\s+([\d.]+)(ms|s)$/); if (q) (ph[q[1]] ??= []).push(+q[2] * (q[3] === "s" ? 1000 : 1)); }
  }
  const j = JSON.parse(fs.readFileSync(`${dir}/runs/json-${r[ix("seq")]}-${r[ix("arm")]}.json`, "utf8"));
  const fsr = j.testResults.map((f) => ({ n: strip(f.name), s: f.startTime, e: f.endTime })).sort((a, b) => a.s - b.s);
  const t0 = j.startTime ?? fsr[0].s; const t1 = Math.max(...fsr.map((f) => f.e));
  const w = [t0, t0]; const busy = [0, 0];
  for (const f of fsr) {
    const i = w[0] <= w[1] ? 0 : 1;
    (gap[f.n] ??= []).push(f.s - w[i]); (startF[f.n] ??= []).push(f.s - t0); (end[f.n] ??= []).push(f.e - t0);
    w[i] = f.e; busy[i] += f.e - f.s;
  }
  span.push(t1 - t0); wTot.push(busy[0] + busy[1]);
  const lastF = fsr.reduce((a, b) => (b.e > a.e ? b : a)); tailF[lastF.n] = (tailF[lastF.n] ?? 0) + 1;
  wEnd.push(Math.abs(w[0] - w[1]));
}
console.log(`runs ${used.length}, arms ${arms}`);
console.log("vitest phases, median ms: " + Object.keys(ph).map((k) => `${k} ${med(ph[k]).toFixed(0)}`).join(", "));
console.log(`first file start to last file end, median ${med(span).toFixed(0)} ms; sum of slots ${med(wTot).toFixed(0)} ms; the two replayed workers end ${med(wEnd).toFixed(0)} ms apart`);
console.log("last file to end, count of runs: " + JSON.stringify(tailF));
const ks = Object.keys(gap).map((k) => [k, med(gap[k]), med(startF[k]), med(end[k])]);
console.log("\nlargest gaps before a file's first test (start-up and collect on its worker), median ms");
console.log("file\tgap\tstart\tend");
for (const k of ks.sort((a, b) => b[1] - a[1]).slice(0, top)) console.log(`${k[0]}\t${k[1].toFixed(0)}\t${k[2].toFixed(0)}\t${k[3].toFixed(0)}`);
console.log("\nlast files to end, median ms");
for (const k of ks.sort((a, b) => b[3] - a[3]).slice(0, top)) console.log(`${k[0]}\t${k[1].toFixed(0)}\t${k[2].toFixed(0)}\t${k[3].toFixed(0)}`);
