import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
const [json, label, dir] = process.argv.slice(2);
const r = JSON.parse(readFileSync(json, "utf8"));
console.log(label, "success", r.success, "total", r.numTotalTests, "passed", r.numPassedTests, "failed", r.numFailedTests, "pending", r.numPendingTests, "todo", r.numTodoTests);
for (const file of ["src/cli.test.ts", "src/uci-session.test.ts"]) {
  const f = r.testResults.find((t) => t.name.endsWith(`/${file}`));
  const names = f.assertionResults.map((a) => [...a.ancestorTitles, a.title].join(" > ")).sort();
  const statuses = {};
  for (const a of f.assertionResults) statuses[a.status] = (statuses[a.status] ?? 0) + 1;
  const body = names.join("\n") + "\n";
  writeFileSync(`${dir}/sorted-${label}-${file.split("/")[1]}.txt`, body);
  console.log(" ", file, names.length, JSON.stringify(statuses), createHash("sha256").update(body).digest("hex"));
}
