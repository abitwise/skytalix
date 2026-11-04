import { readFileSync } from "node:fs";
const L = readFileSync(process.argv[2], "utf8").trim().split("\n").map((l) => JSON.parse(l));
const q = (a, p) => { const s = [...a].sort((x, y) => x - y); if (!s.length) return NaN; const i = (s.length - 1) * p; const lo = Math.floor(i), hi = Math.ceil(i); return s[lo] + (s[hi] - s[lo]) * (i - lo); };
const pooled = []; const perD = {};
for (const r of L.filter((x) => x.probe === "P1")) {
  const ds = r.rows.map((x) => x.d).at(-1);
  const rat = [];
  for (let i = 1; i < r.rows.length; i++) { const d = r.rows[i].d; const v = r.rows[i].nodes / r.rows[i - 1].nodes; rat.push(v.toFixed(2)); if (r.legal > 1 && d >= 4) { pooled.push(v); (perD[d] ??= []).push(v); } }
  console.log(r.name.padEnd(22), "legal", String(r.legal).padStart(2), "dmax", ds, "N", r.rows.at(-1).nodes, "r(2..)", rat.join(" "));
}
console.log("pooled n", pooled.length, "median", q(pooled, 0.5).toFixed(4), "p25", q(pooled, .25).toFixed(3), "p75", q(pooled, .75).toFixed(3), "p10", q(pooled,.1).toFixed(3), "p90", q(pooled,.9).toFixed(3));
for (const d of Object.keys(perD)) console.log("d", d, "n", perD[d].length, "median", q(perD[d], .5).toFixed(3), "p25", q(perD[d], .25).toFixed(3), "p75", q(perD[d], .75).toFixed(3));
const odd = Object.entries(perD).filter(([d]) => d % 2).flatMap(([, v]) => v), even = Object.entries(perD).filter(([d]) => d % 2 === 0).flatMap(([, v]) => v);
console.log("odd d median", q(odd, .5).toFixed(3), "n", odd.length, "even d median", q(even, .5).toFixed(3), "n", even.length);
for (const r of L.filter((x) => x.probe === "P1" && (x.name === "kiwipete" || x.name === "position-6"))) for (const x of r.rows.filter((x) => x.d >= 6 && x.d <= 8)) console.log("P2f", r.name, JSON.stringify(x));
for (const r of L.filter((x) => x.probe === "P2v")) console.log(JSON.stringify(r));
