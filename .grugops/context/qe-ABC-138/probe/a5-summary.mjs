// QE ABC-138: summarise a4.sh output. Round 0 discarded. Usage: node a5-summary.mjs <out>
import { readFileSync } from "node:fs";
const rows = readFileSync(process.argv[2], "utf8").split("\n").filter((l) => /^\d+ (base|head) /.test(l))
  .map((l) => { const [r, t, la, ld, tot] = l.split(" "); return { r: +r, t, la: +la, ld: +ld, tot: +tot }; })
  .filter((x) => x.r > 0);
const med = (a) => { const s = [...a].sort((x, y) => x - y); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
for (const t of ["base", "head"]) {
  const x = rows.filter((y) => y.t === t);
  console.log(`${t} n=${x.length} median total ${med(x.map((y) => y.tot)).toFixed(1)} ms; median load ${med(x.map((y) => y.ld)).toFixed(1)} ms; max ${Math.max(...x.map((y) => y.tot)).toFixed(1)}; >250: ${x.filter((y) => y.tot > 250).length}; median load1 ${med(x.map((y) => y.la)).toFixed(2)} range ${Math.min(...x.map((y) => y.la))}-${Math.max(...x.map((y) => y.la))}`);
}
const d = rows.filter((y) => y.t === "head").map((h) => h.tot - rows.find((b) => b.t === "base" && b.r === h.r).tot);
console.log(`paired head-base deltas ${d.map((v) => v.toFixed(1)).join(" ")} median ${med(d).toFixed(1)}`);
