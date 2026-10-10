// Usage: node rescore.mjs <timing.tsv>. Independent re-score per ADR-0035 decision 1 (proposed):
// paired per-round deltas, round 0 discarded, k = largest index with two-sided binomial coverage >= 92 %.
import { readFileSync } from "node:fs";
const rows = readFileSync(process.argv[2], "utf8").trim().split("\n").slice(1).map((l) => l.split("\t"));
const by = {};
for (const [r, arm, load, , , cpu, wall, tests] of rows) if (r !== "0") ((by[r] ??= {})[arm] = { cpu: +cpu, wall: +wall, load: +load, tests: +tests });
const rounds = Object.values(by);
const n = rounds.length;
const C = (a, b) => { let x = 1; for (let i = 0; i < b; i++) x = (x * (a - i)) / (i + 1); return x; };
let k = 1;
for (let c = 1; c <= n / 2; c++) { let tail = 0; for (let i = 0; i < c; i++) tail += C(n, i); if (1 - (2 * tail) / 2 ** n >= 0.92) k = c; }
const med = (xs) => { const s = [...xs].sort((a, b) => a - b); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const loads = rows.map((r) => +r[2]);
console.log(`n = ${n}, k = ${k}, load1 median ${med(loads).toFixed(2)} (min ${Math.min(...loads)}, max ${Math.max(...loads)})`);
for (const unit of ["cpu", "wall"]) {
  const base = med(rounds.map((r) => r.base[unit]));
  for (const arm of ["twin", "head"]) {
    const d = rounds.map((r) => r[arm][unit] - r.base[unit]).sort((a, b) => a - b);
    const lo = d[k - 1], hi = d[n - k];
    console.log(`${unit} ${arm} - base: median ${med(d) >= 0 ? "+" : ""}${med(d).toFixed(3)} s (${((100 * med(d)) / base).toFixed(2)} %), sign ${d.filter((x) => x > 0).length}/${n}, interval ${lo.toFixed(3)}..${hi.toFixed(3)}, R ${Math.max(Math.abs(lo), Math.abs(hi)).toFixed(3)} s`);
  }
}
