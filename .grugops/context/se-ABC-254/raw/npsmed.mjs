import { readFileSync } from "node:fs";
const all = readFileSync(process.argv[2], "utf8").trim().split("\n").map((l) => JSON.parse(l));
const rows = all.filter((r) => r.board);
const med = (xs) => { const s = [...xs].sort((a, b) => a - b); const n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
for (const board of ["kiwipete", "position-6", "start", "position-4"]) {
  const m = ["base", "head"].map((t) => med(rows.filter((r) => r.board === board && r.tree === t).map((r) => r.nps)));
  const ds = ["base", "head"].map((t) => rows.filter((r) => r.board === board && r.tree === t).map((r) => r.depth).join(","));
  const l = rows.filter((r) => r.board === board).map((r) => r.load1);
  console.log(`${board}: base ${m[0]} (d ${ds[0]}) | head ${m[1]} (d ${ds[1]}) | ratio ${(m[1] / m[0]).toFixed(3)} | load1 ${Math.min(...l).toFixed(2)}-${Math.max(...l).toFixed(2)}`);
}
const tc = rows.map((r) => Number(r.tctl)).filter((x) => !Number.isNaN(x));
console.log(`Tctl ${Math.min(...tc)}-${Math.max(...tc)} C, runs ${rows.length}`);
for (const r of all.filter((r) => !r.board)) console.log(JSON.stringify(r));
