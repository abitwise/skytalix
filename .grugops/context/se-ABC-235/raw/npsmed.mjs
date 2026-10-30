// usage: node npsmed.mjs <out.jsonl>  -> per board, per tree: median nps, ratio last/first tree, load1 range
import { readFileSync } from "node:fs";
const rows = readFileSync(process.argv[2], "utf8").trim().split("\n").map((l) => JSON.parse(l));
const med = (xs) => { const s = [...xs].sort((a, b) => a - b); const n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const trees = [...new Set(rows.map((r) => r.tree))];
for (const board of ["kiwipete", "position-6", "start"]) {
  const m = trees.map((t) => med(rows.filter((r) => r.board === board && r.tree === t).map((r) => r.nps)));
  const ds = trees.map((t) => rows.filter((r) => r.board === board && r.tree === t).map((r) => r.depth).join(","));
  console.log(`${board}: ${trees.map((t, i) => `${t} ${m[i]} (d ${ds[i]})`).join(" | ")} | ratio ${(m[1] / m[0]).toFixed(4)}`);
}
const l = rows.map((r) => r.load1);
console.log(`load1 ${Math.min(...l).toFixed(2)}-${Math.max(...l).toFixed(2)}, runs ${rows.length}`);
