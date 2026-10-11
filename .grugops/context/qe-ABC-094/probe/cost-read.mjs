// Reads a cost.sh TSV per ADR-0035 decision 1 (n = 8 scored rounds, k = 2). Usage: node cost-read.mjs <runs.tsv>
import { readFileSync } from "node:fs";
const rows = readFileSync(process.argv[2], "utf8").trim().split("\n").slice(1).map((l) => l.split("\t"));
const cpu = {};
const loads = [];
for (const [r, arm, load1, , , c] of rows) {
  if (r === "0") continue;
  (cpu[arm] ??= {})[r] = Number(c);
  loads.push(Number(load1));
}
const rounds = Object.keys(cpu.base).sort();
const med = (xs) => { const s = [...xs].sort((a, b) => a - b); const n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const f = (x) => (x >= 0 ? "+" : "") + x.toFixed(3);
const pair = (a, b) => rounds.map((r) => cpu[a][r] - cpu[b][r]);
const k = 2;
const read = (name, d) => {
  const s = [...d].sort((a, b) => a - b);
  const pos = d.filter((x) => x > 0).length, neg = d.filter((x) => x < 0).length;
  return { name, median: med(d), lo: s[k - 1], hi: s[s.length - k], R: Math.max(Math.abs(s[k - 1]), Math.abs(s[s.length - k])), signs: `${pos}+/${neg}-/${d.length - pos - neg} zero`, sorted: s.map(f).join(" ") };
};
const headCpu = med(rounds.map((r) => cpu.head[r]));
const twin = read("twin - head (identity null)", pair("twin", "head"));
const treat = read("head - base (QE final, 35 tests)", pair("head", "base"));
const se = read("se - base (8cf395fc, 26 tests)", pair("se", "base"));
for (const x of [twin, treat, se]) console.log(`${x.name}: median ${f(x.median)} s, x(2)..x(7) ${f(x.lo)}..${f(x.hi)}, R ${x.R.toFixed(3)} s, signs ${x.signs}; sorted ${x.sorted}`);
const pct = (100 * twin.median) / headCpu;
console.log(`head file CPU median ${headCpu.toFixed(3)} s; twin median = ${pct.toFixed(2)} % of it (admissible needs <= 1.5 % with sign at chance)`);
console.log(`load1 over scored runs: min ${Math.min(...loads)}, median ${med(loads)}, max ${Math.max(...loads)}`);
const adm = Math.abs(pct) <= 1.5;
const b = 0.65;
let state = "INADMISSIBLE (no state)";
if (adm) {
  if (treat.lo > b) state = "NOT MET (lower end above 650 ms)";
  else if (twin.R <= b) state = treat.median <= b ? "MET" : "NOT MET";
  else state = `UNRESOLVED (twin R ${twin.R.toFixed(3)} s > 650 ms; charge at most ${f(treat.hi)} s)`;
}
console.log(`ADR-0035 reading against b = 650 ms: ${state}`);
