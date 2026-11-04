// secnfr-nfr008-1104 census: per-file slot and per-row in-thread duration, medians over the scored runs of the named arms.
// Usage: node census.cjs <out dir of n8.sh> <arms, comma-separated> [top files] [top rows]
const fs = require("fs");
const [dir, armsArg, topF, topR] = process.argv.slice(2);
const arms = armsArg.split(",");
const rows = fs.readFileSync(`${dir}/a8.tsv`, "utf8").trim().split("\n").map((l) => l.split("\t"));
const hd = rows.shift();
const ix = (k) => hd.indexOf(k);
const used = rows.filter((r) => r[ix("scored")] === "1" && arms.includes(r[ix("arm")]));
const med = (a) => { const s = [...a].sort((x, y) => x - y); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const per = {}, tests = {}, sums = {};
const strip = (n) => n.replace(/.*\/arms\/[^/]+\//, "");
for (const r of used) {
  const j = JSON.parse(fs.readFileSync(`${dir}/runs/json-${r[ix("seq")]}-${r[ix("arm")]}.json`, "utf8"));
  for (const f of j.testResults) {
    const n = strip(f.name);
    (per[n] ??= []).push(f.endTime - f.startTime);
    let s = 0;
    for (const a of f.assertionResults) { s += a.duration || 0; (tests[`${n} :: ${a.fullName}`] ??= []).push(a.duration || 0); }
    (sums[n] ??= []).push(s);
  }
}
const fr = Object.keys(per).map((k) => [k, med(per[k]), med(sums[k]), per[k].length]).sort((a, b) => b[1] - a[1]);
console.log(`runs used ${used.length} (arms ${arms}); files ${fr.length}; sum of file slots ${fr.reduce((s, r) => s + r[1], 0).toFixed(0)} ms; sum of in-thread ${fr.reduce((s, r) => s + r[2], 0).toFixed(0)} ms`);
console.log("file\tslot_ms\tin_thread_ms\tn");
for (const r of fr.slice(0, +topF || 25)) console.log(`${r[0]}\t${r[1].toFixed(0)}\t${r[2].toFixed(0)}\t${r[3]}`);
const tr = Object.keys(tests).map((k) => [k, med(tests[k])]).sort((a, b) => b[1] - a[1]);
console.log("\nslowest rows (median in-thread ms)");
for (const t of tr.slice(0, +topR || 50)) console.log(`${t[1].toFixed(0)}\t${t[0].slice(0, 230)}`);
