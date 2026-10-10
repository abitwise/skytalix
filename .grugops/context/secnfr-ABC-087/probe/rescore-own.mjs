// Security/NFR's own re-score of an ADR-0035 narrow-set TSV (round 0 discarded, n = 8, k = 2).
import { readFileSync } from "node:fs";
const rows = readFileSync(process.argv[2], "utf8").trim().split("\n").slice(1).map((l) => l.split("\t"));
const by = {};
for (const [round, arm, load1, , , cpu, passed] of rows) {
  if (round === "0") continue;
  (by[round] ??= {})[arm] = { cpu: Number(cpu), passed, load1: Number(load1) };
}
const rounds = Object.keys(by).sort((a, b) => a - b);
const d = (a, b) => rounds.map((r) => by[r][a].cpu - by[r][b].cpu).sort((x, y) => x - y);
const med = (xs) => (xs.length % 2 ? xs[(xs.length - 1) / 2] : (xs[xs.length / 2 - 1] + xs[xs.length / 2]) / 2);
const treat = d("head", "base"), twin = d("twin", "head");
const headMed = med(rounds.map((r) => by[r].head.cpu).sort((x, y) => x - y));
const k = 2, n = rounds.length;
const R = Math.max(Math.abs(twin[k - 1]), Math.abs(twin[n - k]));
const loads = rows.filter((r) => r[0] !== "0").map((r) => Number(r[2])).sort((x, y) => x - y);
console.log(`n=${n} treatment median ${med(treat).toFixed(3)} s, interval [${treat[k - 1].toFixed(2)}, ${treat[n - k].toFixed(2)}], sign ${treat.filter((x) => x > 0).length}/${n}`);
console.log(`twin median ${med(twin).toFixed(3)} s = ${((100 * med(twin)) / headMed).toFixed(2)} % of head ${headMed.toFixed(2)} s, sign ${twin.filter((x) => x > 0).length}/${n}, R ${R.toFixed(3)} s`);
console.log(`passed counts: ${[...new Set(rows.map((r) => r[0] === "0" ? "" : `${r[1]}:${r[6]}`).filter(Boolean))].join(" ")}; load1 min/median/max ${loads[0]} / ${med(loads)} / ${loads.at(-1)}`);
