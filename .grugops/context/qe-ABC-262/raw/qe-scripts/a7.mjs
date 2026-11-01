// qe-ABC-262 A7/A8 counts: the two ABC-262 rows' durations and the totals from each G8 run's vitest JSON.
// usage: node a7.mjs <g8 outDir>
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
const dir = process.argv[2];
const titles = ["hasLegalMove out of check answers a pawn-first board at once: at most 1 attack test",
  "equals the full filter with black in check: a non-blocking promotion is absent, a blocking one present"];
const sums = [];
for (const f of readdirSync(dir).filter((n) => /^g8-\d-(head|base)\.last-run\.json$/.test(n)).sort()) {
  const j = JSON.parse(readFileSync(join(dir, f), "utf8"));
  const all = j.testResults.flatMap((r) => r.assertionResults.map((a) => ({ ...a, file: r.name })));
  const rows = titles.map((t) => all.filter((a) => a.title === t && (t.startsWith("equals") ? a.ancestorTitles.some((x) => x.startsWith("ABC-262")) : true)));
  const d = rows.map((r) => (r.length === 1 ? `${r[0].status} ${r[0].duration.toFixed(2)}ms` : `n=${r.length}`));
  const sum = rows.every((r) => r.length === 1) ? rows[0][0].duration + rows[1][0].duration : Number.NaN;
  if (f.includes("head")) sums.push(sum);
  console.log(`${f}: total=${j.numTotalTests} passed=${j.numPassedTests} failed=${j.numFailedTests} pending=${j.numPendingTests} todo=${j.numTodoTests} files=${j.numTotalTestSuites} :: rows ${d.join(" | ")} :: sum ${Number.isNaN(sum) ? "-" : sum.toFixed(2) + "ms"}`);
}
const s = [...sums].sort((a, b) => a - b);
console.log(`head row-sum median: ${s[(s.length - 1) >> 1]?.toFixed(2)} ms over ${s.length} runs (${sums.map((x) => x.toFixed(2)).join(" / ")})`);
