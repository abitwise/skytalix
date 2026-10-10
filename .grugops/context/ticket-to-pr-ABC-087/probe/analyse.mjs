// Median of paired per-round deltas, sign test, and ADR-0035 R (n=8 -> k=2) from the twin.
import { readFileSync } from "node:fs";
const rows = readFileSync(process.argv[2], "utf8").trim().split("\n").slice(1).map((l) => l.split("\t"));
const by = {}; for (const [r, arm, load1, , , cpu, passed] of rows) { (by[r] ??= {})[arm] = { cpu: +cpu, load1: +load1, passed: +passed }; }
const rounds = Object.keys(by).filter((r) => r !== "0");
const med = (a) => { const s = [...a].sort((x, y) => x - y); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const treat = rounds.map((r) => by[r].head.cpu - by[r].base.cpu);
const nul = rounds.map((r) => by[r].twin.cpu - by[r].head.cpu);
const sorted = [...nul].sort((a, b) => a - b); const n = sorted.length; const k = 2;
const R = Math.max(Math.abs(sorted[k - 1]), Math.abs(sorted[n - k]));
const ts = [...treat].sort((a, b) => a - b);
const headCpu = med(rounds.map((r) => by[r].head.cpu));
console.log({ n, counts: [...new Set(rows.map((r) => `${r[1]}:${r[6]}`))],
  treatMedian: med(treat).toFixed(3), treatSign: `${treat.filter((d) => d > 0).length}/${n}`, treatInterval: [ts[k - 1], ts[n - k]].map((x) => x.toFixed(2)),
  nullMedian: med(nul).toFixed(3), nullPctOfHead: ((med(nul) / headCpu) * 100).toFixed(2) + "%", nullSign: `${nul.filter((d) => d > 0).length}/${n}`, R: R.toFixed(3),
  load1: [Math.min(...rows.map((r) => +r[2])), med(rows.map((r) => +r[2])), Math.max(...rows.map((r) => +r[2]))] });
