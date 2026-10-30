// usage: node analyse.mjs <sessionDir>  -> G2, G2cold, G6, A3 and per-cut medians and grades
import { readFileSync, existsSync } from "node:fs";
const d = process.argv[2];
const rd = (f) => (existsSync(`${d}/${f}`) ? readFileSync(`${d}/${f}`, "utf8").trim().split("\n").filter(Boolean).map((l) => JSON.parse(l)) : []);
const med = (xs) => { const s = [...xs].sort((a, b) => a - b); const n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const avg = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;
for (const f of ["g2.jsonl", "g2cold.jsonl"]) {
  const rows = rd(f);
  console.log(`== ${f}`);
  for (const r of rows) console.log(`  ${r.tree}: mean ${r.mean} ns  [${["startpos","kiwipete","position-3","position-4","position-5","position-6"].map((k) => r[k]).join(" / ")}]  load1 ${r.load1_before}->${r.load1_after}`);
  const b = rows.filter((r) => r.tree === "base").map((r) => r.mean), t = rows.filter((r) => r.tree === "tip").map((r) => r.mean);
  if (b.length && t.length) console.log(`  base avg ${avg(b).toFixed(1)}  tip avg ${avg(t).toFixed(1)}  tip/base ${(avg(t) / avg(b)).toFixed(3)}  tip max ${Math.max(...t)} (bar 1100)`);
}
for (const reading of ["g6", "a3", "cut1", "cut3", "cut5"]) {
  const rows = rd(`${reading}.jsonl`);
  if (!rows.length) continue;
  const trees = [...new Set(rows.map((r) => r.tree))];
  // A = first-named (odd rounds first) tree
  const A = rows.find((r) => r.round === 1).tree; const B = trees.find((t) => t !== A);
  console.log(`== ${reading}: ${A} vs ${B}, runs ${rows.length}, load1 ${Math.min(...rows.map((r) => r.load1)).toFixed(2)}-${Math.max(...rows.map((r) => r.load1)).toFixed(2)}, wall ${Math.min(...rows.map((r) => r.wallMs)).toFixed(1)}-${Math.max(...rows.map((r) => r.wallMs)).toFixed(1)} ms`);
  for (const board of [...new Set(rows.map((r) => r.board))]) {
    const g = (t) => rows.filter((r) => r.board === board && r.tree === t).sort((x, y) => x.round - y.round);
    const a = g(A), b = g(B);
    const ma = med(a.map((r) => r.nps)), mb = med(b.map((r) => r.nps));
    const da = med(a.map((r) => r.depth)), db = med(b.map((r) => r.depth));
    console.log(`  ${board}: ${A} nps ${a.map((r) => r.nps).join(" ")} med ${ma} | ${B} nps ${b.map((r) => r.nps).join(" ")} med ${mb} | ratio ${(mb / ma).toFixed(4)}`);
    console.log(`  ${board}: depth ${A} ${a.map((r) => r.depth).join(" ")} med ${da} | ${B} ${b.map((r) => r.depth).join(" ")} med ${db} | min ${B} ${Math.min(...b.map((r) => r.depth))} | moves ${A} ${[...new Set(a.map((r) => r.move))].join(",")} ${B} ${[...new Set(b.map((r) => r.move))].join(",")}`);
  }
}
