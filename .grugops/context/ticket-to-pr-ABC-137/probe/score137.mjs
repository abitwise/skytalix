// SE port (ABC-137) of ticket-to-pr-ABC-059/probe/score.mjs, same rule: ADR-0035 decision 1 per-round
// deltas (head-base, twin-base), round 0 discarded, median, sign, order-statistic interval x(k)..x(n+1-k)
// with k the largest index whose binomial coverage >= 92 %; R = larger magnitude of the interval ends.
import { readFileSync } from "node:fs";
const rows = readFileSync(process.argv[2], "utf8").trim().split("\n").slice(1).map((l) => l.split("\t"));
const by = {};
for (const [r, arm, load, , , cpu, wall] of rows) {
  if (r === "0") continue;
  by[r] ??= {};
  by[r][arm] = { cpu: Number(cpu), wall: Number(wall), load: Number(load) };
}
const choose = (n, k) => {
  let c = 1;
  for (let i = 0; i < k; i++) c = (c * (n - i)) / (i + 1);
  return c;
};
const kOf = (n) => {
  let k = 1;
  for (let j = 1; j <= n / 2; j++) {
    let s = 0;
    for (let i = 0; i < j; i++) s += choose(n, i);
    if (1 - (2 * s) / 2 ** n >= 0.92) k = j;
  }
  return k;
};
const median = (a) => {
  const s = [...a].sort((x, y) => x - y);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const rounds = Object.keys(by);
const loads = rows.filter((x) => x[0] !== "0").map((x) => Number(x[2]));
console.log(`n = ${rounds.length} scored rounds, k = ${kOf(rounds.length)}, load1 median ${median(loads).toFixed(2)} (min ${Math.min(...loads)}, max ${Math.max(...loads)})`);
for (const unit of ["cpu", "wall"]) {
  const base = rounds.map((r) => by[r].base[unit]);
  console.log(`${unit}: base median ${median(base).toFixed(3)} s, head ${median(rounds.map((r) => by[r].head[unit])).toFixed(3)} s, twin ${median(rounds.map((r) => by[r].twin[unit])).toFixed(3)} s`);
  for (const arm of ["twin", "head"]) {
    const d = rounds.map((r) => by[r][arm][unit] - by[r].base[unit]).sort((x, y) => x - y);
    const n = d.length;
    const k = kOf(n);
    const lo = d[k - 1];
    const hi = d[n - k];
    const pos = d.filter((x) => x > 0).length;
    const md = median(d);
    console.log(`  ${arm} - base: median ${md >= 0 ? "+" : ""}${md.toFixed(3)} s (${((100 * md) / median(base)).toFixed(2)} %), sign ${pos}/${n} positive, interval ${lo.toFixed(3)}..${hi.toFixed(3)}, R ${Math.max(Math.abs(lo), Math.abs(hi)).toFixed(3)} s; deltas ${d.map((x) => x.toFixed(3)).join(" ")}`);
  }
}
