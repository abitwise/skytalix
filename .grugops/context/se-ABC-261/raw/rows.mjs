// se-ABC-261 A8: summed duration of the two ABC-261 rows per head run, and the median. usage: node rows.mjs <json...>
import { readFileSync } from "node:fs";
const titles = ["hasLegalMove out of check stops at the first legal king move: at most 2 attack tests",
  "equals the full filter in check: a non-blocking promotion is absent, a blocking one present"];
const sums = [];
for (const f of process.argv.slice(2)) {
  const j = JSON.parse(readFileSync(f, "utf8"));
  let sum = 0, found = 0, skipped = 0;
  for (const r of j.testResults) for (const a of r.assertionResults) {
    if (a.status !== "passed") skipped += a.status === "skipped" || a.status === "pending" ? 1 : 0;
    if (titles.includes(a.title)) { sum += a.duration; found++; console.log(f.split("/").pop(), a.status, a.duration.toFixed(2), a.title.slice(0, 40)); }
  }
  console.log(`found=${found} sum=${sum.toFixed(2)}ms total=${j.numTotalTests} skipped=${j.numPendingTests} todo=${j.numTodoTests}`);
  sums.push(sum);
}
sums.sort((a, b) => a - b);
console.log("median sum ms:", sums[Math.floor(sums.length / 2)].toFixed(2), "sums:", sums.map((s) => s.toFixed(2)).join(" "));
