// qe-ABC-245 (copied from qe-ABC-242 names.mjs, tree regex qe-242 -> qe-245): per-file counts and sorted full names from two last-run.json files (B vs H); prints the set difference. Post-PREREG harness fix: the first copy missed the escaped slash, so the regex still read qe-242 (no expectation changed).
// usage: node names.mjs <base last-run.json> <head last-run.json>
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
const load = (p) => {
  const j = JSON.parse(readFileSync(p, "utf8"));
  const per = {}, all = [];
  let pending = 0;
  for (const f of j.testResults) {
    const name = f.name.replace(/^.*\/qe-245\/[BH]\//, "");
    per[name] = f.assertionResults.length;
    for (const a of f.assertionResults) { all.push(`${name} > ${a.fullName}`); if (a.status !== "passed") pending += a.status === "failed" ? 0 : 1; }
  }
  return { per, all: all.sort(), total: j.numTotalTests, failed: j.numFailedTests, skipped: j.numPendingTests + j.numTodoTests, pending };
};
const [b, h] = process.argv.slice(2).map(load);
const sha = (a) => createHash("sha256").update(a.join("\n")).digest("hex").slice(0, 12);
console.log(`base total ${b.total} failed ${b.failed} skipped ${b.skipped}; head total ${h.total} failed ${h.failed} skipped ${h.skipped}`);
for (const f of new Set([...Object.keys(b.per), ...Object.keys(h.per)])) if (b.per[f] !== h.per[f]) console.log(`count differs: ${f} ${b.per[f]} -> ${h.per[f]}`);
const bs = new Set(b.all), hs = new Set(h.all);
const onlyH = h.all.filter((n) => !bs.has(n)), onlyB = b.all.filter((n) => !hs.has(n));
console.log(`only at head (${onlyH.length}):`); for (const n of onlyH) console.log(`  + ${n}`);
console.log(`only at base (${onlyB.length}):`); for (const n of onlyB) console.log(`  - ${n}`);
const strip = (a, x) => a.filter((n) => !x.includes(n));
console.log(`sorted names sha256/12: base ${sha(b.all)}, head minus added ${sha(strip(h.all, onlyH))} (equal = nothing else moved)`);
