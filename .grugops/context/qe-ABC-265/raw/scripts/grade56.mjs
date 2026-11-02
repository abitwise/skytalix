// qe-ABC-264 G6 (graded) / G5 (instrument part) / G11 (reported) from g6.mjs output. usage: node grade56.mjs <outDir>
import { readFileSync, existsSync } from "node:fs";
const [O] = process.argv.slice(2);
const rd = (f) => existsSync(`${O}/${f}`) ? readFileSync(`${O}/${f}`, "utf8").trim().split("\n").filter(Boolean).map(JSON.parse) : [];
const g6 = rd("g6.jsonl"), g11 = rd("g11.jsonl");
const med = (a) => { const s = [...a].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const res = { g6: {} };
for (const pos of ["kiwipete", "position-6"]) {
  const d = (t) => g6.filter((r) => r.pos === pos && r.tree === t).map((r) => r.depth);
  const B = d("base"), H = d("head");
  res.g6[pos] = { B, H, medB: med(B), medH: med(H), geBase: med(H) >= med(B), min: Math.min(...B, ...H), warn: [...B, ...H].filter((x) => x < 7).length,
    nodesMedB: med(g6.filter((r) => r.pos === pos && r.tree === "base").map((r) => r.nodes)), nodesMedH: med(g6.filter((r) => r.pos === pos && r.tree === "head").map((r) => r.nodes)) };
}
res.g6Met = g6.length === 20 && Object.values(res.g6).every((x) => x.geBase && x.min >= 6);
const all = [...g6, ...g11];
res.g5 = { reads: all.length, maxMs: Math.max(...all.map((r) => r.ms)), over4000: all.filter((r) => r.ms > 4000).length, over5000: all.filter((r) => r.ms > 5000).length };
res.g11 = g11.map((r) => `${r.pos} ${r.tree} ${r.san} d${r.depth} ${r.score}`);
res.host = { load1: [Math.min(...all.map((r) => r.load1_before)), Math.max(...all.map((r) => r.load1_before))], tctlMax: Math.max(...all.flatMap((r) => [r.tctl_before, r.tctl_after])) };
console.log(JSON.stringify(res, null, 1));
