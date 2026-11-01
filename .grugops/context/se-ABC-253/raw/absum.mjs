import { readFileSync } from "node:fs";
const L = readFileSync(process.argv[2], "utf8").trim().split("\n");
const by = {};
for (const l of L) { const m = l.match(/r(\d) (\S+) (base|probe) .*\| (\{.*\})/); if (!m) continue; const r = JSON.parse(m[4]); ((by[m[2]] ??= {})[m[3]] ??= []).push(r.nps); }
const med = (a) => { const s = [...a].sort((x, y) => x - y); return s[s.length >> 1]; };
const spread = (a) => ((Math.max(...a) - Math.min(...a)) / med(a) * 100).toFixed(1);
for (const [b, v] of Object.entries(by)) console.log(`${b}: base med ${med(v.base)} spread ${spread(v.base)}% | probe med ${med(v.probe)} spread ${spread(v.probe)}% | ratio ${(med(v.probe) / med(v.base)).toFixed(3)}  base=[${v.base}] probe=[${v.probe}]`);
