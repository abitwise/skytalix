// Independent re-score (QE's own code, not the Engineer's score.mjs) of a committed timing TSV under
// ADR-0035 decision 1 (proposed): n scored rounds (round 0 dropped), k from binomial coverage >= 92 %,
// R = max(|x(k)|, |x(n+1-k)|) of the twin's sorted CPU deltas; state at bound b (seconds).
import { readFileSync } from "node:fs";
const [file, b] = [process.argv[2], Number(process.argv[3])];
const rows = readFileSync(file, "utf8").trim().split("\n").slice(1).map((l) => l.split("\t"));
const rounds = new Map();
for (const [r, arm, , , , cpu] of rows) if (r !== "0") (rounds.get(r) ?? rounds.set(r, {}).get(r))[arm] = Number(cpu);
const n = rounds.size;
const binom = (n, i) => { let c = 1; for (let j = 1; j <= i; j++) c = (c * (n - j + 1)) / j; return c; };
let k = 1; for (let c = 1; c <= n / 2; c++) { let s = 0; for (let i = 0; i < c; i++) s += binom(n, i); if (1 - (2 * s) / 2 ** n >= 0.92) k = c; }
const deltas = (arm) => [...rounds.values()].map((x) => x[arm] - x.base).sort((p, q) => p - q);
const med = (a) => (a.length % 2 ? a[(a.length - 1) / 2] : (a[a.length / 2 - 1] + a[a.length / 2]) / 2);
const base = [...rounds.values()].map((x) => x.base).sort((p, q) => p - q);
const tw = deltas("twin"), hd = deltas("head");
const R = Math.max(Math.abs(tw[k - 1]), Math.abs(tw[n - k]));
const nullPct = (100 * med(tw)) / med(base);
const admissible = Math.abs(nullPct) <= 1.5; // sign-at-chance reported, judged by reader
const state = !admissible ? "INADMISSIBLE" : hd[k - 1] > b ? "NOT MET" : R <= b ? (med(hd) <= b ? "MET" : "NOT MET") : "UNRESOLVED";
console.log(`n ${n} k ${k} | null ${med(tw).toFixed(3)} s (${nullPct.toFixed(2)} %), twin sign ${tw.filter((d) => d > 0).length}/${n} | twin R ${R.toFixed(3)} | head median ${med(hd).toFixed(3)} interval ${hd[k - 1].toFixed(3)}..${hd[n - k].toFixed(3)} | at b=${b}: ${state}${state === "UNRESOLVED" ? ` (charge at most +${hd[n - k].toFixed(3)} s)` : ""}`);
