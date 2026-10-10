// Analyse cost-<label>.tsv: per round, delta = arm CPU - base CPU (user+sys); rounds 1..8 scored.
// R per ADR-0035 at n = 8: k = 2, drop the most extreme delta at each end, take the larger magnitude left.
import { readFileSync } from "node:fs";
const rows = readFileSync(process.argv[2], "utf8").trim().split("\n").filter((l) => l !== "done").map((l) => l.split("\t"));
const cpu = {}; const tests = new Set(); const loads = []; const rcs = new Set();
for (const [r, arm, rc, u, s, , load, t] of rows) { (cpu[r] ??= {})[arm] = +u + +s; tests.add(`${arm}: ${t}`); loads.push(+load); rcs.add(rc); }
const scored = Object.keys(cpu).filter((r) => r !== "0");
const d = (arm) => scored.map((r) => cpu[r][arm] - cpu[r].base).sort((a, b) => a - b);
const med = (a) => (a.length % 2 ? a[(a.length - 1) / 2] : (a[a.length / 2 - 1] + a[a.length / 2]) / 2);
const baseCpu = med(scored.map((r) => cpu[r].base).sort((a, b) => a - b));
const twin = d("twin"), head = d("head"), n = twin.length, k = 2;
const R = Math.max(Math.abs(twin[k - 1]), Math.abs(twin[n - k]));
console.log(`n ${n}; exit codes ${[...rcs]}; counts ${[...tests].join(" | ")}`);
console.log(`load1 median ${med([...loads].sort((a, b) => a - b)).toFixed(2)} (min ${Math.min(...loads)}, max ${Math.max(...loads)})`);
console.log(`base CPU median ${baseCpu.toFixed(3)} s`);
console.log(`twin - base: median ${med(twin).toFixed(3)} s (${((100 * med(twin)) / baseCpu).toFixed(2)} %), positives ${twin.filter((x) => x > 0).length}/${n}, R ${R.toFixed(3)} s; admissible (<= 1.5 %): ${Math.abs(med(twin)) <= 0.015 * baseCpu}`);
console.log(`head - base: median ${med(head).toFixed(3)} s, interval x(k)..x(n+1-k) ${head[k - 1].toFixed(3)}..${head[n - k].toFixed(3)} s, positives ${head.filter((x) => x > 0).length}/${n}`);
