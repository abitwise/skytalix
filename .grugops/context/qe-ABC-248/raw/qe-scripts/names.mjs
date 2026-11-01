// qe-ABC-248 A3: names and counts from npm test's last-run.json (base run vs head run). usage: node names.mjs <B.json> <H.json>
import { readFileSync } from "node:fs";
const [bp, hp] = process.argv.slice(2);
const read = (p) => { const j = JSON.parse(readFileSync(p, "utf8")); const rows = j.testResults.flatMap((f) => f.assertionResults.map((a) => ({ file: f.name.replace(/^.*\/qe-248\/[BH]\//, ""), name: [...a.ancestorTitles, a.title].join(" > "), status: a.status }))); return { j, rows }; };
const B = read(bp), H = read(hp);
for (const [k, x] of [["B", B], ["H", H]]) console.log(`${k}: files ${x.j.testResults.length} total ${x.j.numTotalTests} passed ${x.j.numPassedTests} failed ${x.j.numFailedTests} pending ${x.j.numPendingTests} todo ${x.j.numTodoTests} -> skip count ${x.j.numPendingTests + x.j.numTodoTests}`);
const files = [...new Set([...B.rows, ...H.rows].map((r) => r.file))].sort();
for (const f of files) {
  const b = B.rows.filter((r) => r.file === f).map((r) => r.name).sort(), h = H.rows.filter((r) => r.file === f).map((r) => r.name).sort();
  if (JSON.stringify(b) === JSON.stringify(h)) continue;
  console.log(`${f}: B ${b.length} H ${h.length}`);
  for (const n of b.filter((x) => !h.includes(x))) console.log(`  only B: ${n}`);
  for (const n of h.filter((x) => !b.includes(x))) console.log(`  only H: ${n}`);
}
console.log(`files whose sorted names differ: listed above; all other ${files.length} files equal`);
