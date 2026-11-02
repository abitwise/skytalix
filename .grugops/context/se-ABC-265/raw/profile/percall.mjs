import { readFileSync } from "node:fs";
const S = process.argv[2];
const ratio = { kiwipete: { p: 0.0636, s: 0.0367 }, "position-6": { p: 0.0859, s: 0.0504 } };
const txt = readFileSync(`${S}/analysis.txt`, "utf8").split("\n").filter((l) => / run [12]:/.test(l));
const trees = ["base", "base", "base", "base", "head", "head", "head", "head"];
const agg = {};
txt.forEach((l, i) => {
  const [, board, run] = l.match(/^(\S+) run (\d)/);
  const tree = trees[i];
  const r = JSON.parse(readFileSync(`${S}/${tree}/${board}-${run}.json`, "utf8"));
  const pct = (n) => Number(l.match(new RegExp(` ${n}=([\\d.]+)%`))[1]);
  const pP = pct("probeTable"), pS = pct("storeEntry");
  const pNs = (pP / 100 * r.elapsedMs * 1e6) / (r.nodes * ratio[board].p);
  const sNs = (pS / 100 * r.elapsedMs * 1e6) / (r.nodes * ratio[board].s);
  console.log(`${tree} ${board} run ${run}: nodes ${r.nodes} depth ${r.depth} | probeTable ${pP}% ~${pNs.toFixed(0)} ns/call | storeEntry ${pS}% ~${sNs.toFixed(0)} ns/call`);
  const k = `${tree} ${board}`; (agg[k] ??= []).push([pNs, sNs]);
});
for (const [k, v] of Object.entries(agg)) console.log(`MEAN ${k}: probeTable ~${(v.reduce((a, x) => a + x[0], 0) / v.length).toFixed(0)} ns/call, storeEntry ~${(v.reduce((a, x) => a + x[1], 0) / v.length).toFixed(0)} ns/call`);
