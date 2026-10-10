// QE re-score of an ADR-0035 narrow-set TSV (round, arm, load1, user, sys, cpu, passed). Round 0 discarded, k = 2 at n = 8.
import { readFileSync } from "node:fs";
const rows = readFileSync(process.argv[2], "utf8").trim().split("\n").slice(1).map((l) => l.split("\t"));
const by = {};
for (const [r, arm, load, , , cpu, passed] of rows) { if (r === "0") continue; (by[r] ??= {})[arm] = { cpu: +cpu, load: +load, passed: +passed }; }
const rounds = Object.values(by);
const n = rounds.length, k = 2;
const sortd = (a) => [...a].sort((x, y) => x - y);
const med = (a) => { const s = sortd(a); return (s[(s.length - 1) >> 1] + s[s.length >> 1]) / 2; };
const treat = rounds.map((x) => x.head.cpu - x.base.cpu);
const nul = rounds.map((x) => x.twin.cpu - x.head.cpu);
const st = sortd(treat), sn = sortd(nul);
const headMed = med(rounds.map((x) => x.head.cpu));
const R = Math.max(Math.abs(sn[k - 1]), Math.abs(sn[n - k]));
const fmt = (v) => v.toFixed(3);
console.log({ n, counts: [...new Set(rows.map((r) => `${r[1]}:${r[6]}`))],
  treatMedian: fmt(med(treat)), treatSign: `${treat.filter((d) => d > 0).length}/${n}`, treatInterval: [fmt(st[k - 1]), fmt(st[n - k])],
  nullMedian: fmt(med(nul)), nullPctOfHead: `${(100 * med(nul) / headMed).toFixed(2)}%`, nullSign: `${nul.filter((d) => d > 0).length}/${n}`,
  R: fmt(R), load1: [Math.min(...rows.map((r) => +r[2])), Math.max(...rows.map((r) => +r[2]))] });
