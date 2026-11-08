// qe-ABC-298-freeze: every lane's vitest JSON -> one row per test, {lane, file, title, status}, with no duration and
// no host path. A row is "deep" when its file's default-lane run does not hold the same title. A lane that ran 0
// tests, or whose run did not succeed, is a FAIL. usage:
//   node summarise.mjs <vitestDir> <worktree>   > rows.jsonl   (the lane table goes to stderr)
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
const [dir, worktree] = process.argv.slice(2);
const lanes = readdirSync(dir).filter((f) => f.endsWith(".json")).sort();
const read = (f) => JSON.parse(readFileSync(join(dir, f), "utf8"));
const rowsOf = (j) =>
  j.testResults.flatMap((t) =>
    t.assertionResults.map((a) => ({ file: relative(worktree, t.name), title: a.fullName, status: a.status })),
  );
const def = rowsOf(read("default.json"));
const defKey = new Set(def.map((r) => `${r.file}\u0000${r.title}`));
let bad = 0;
for (const f of lanes) {
  const lane = f.replace(/\.json$/, "");
  const j = read(f);
  const rows = rowsOf(j);
  const counts = { total: rows.length, passed: 0, failed: 0, other: 0, deep: 0 };
  for (const r of rows) {
    const deep = lane !== "default" && !defKey.has(`${r.file}\u0000${r.title}`);
    if (r.status === "passed") counts.passed++;
    else if (r.status === "failed") counts.failed++;
    else counts.other++;
    if (deep) counts.deep++;
    process.stdout.write(`${JSON.stringify({ lane, file: r.file, title: r.title, status: r.status, deep })}\n`);
  }
  const ok = j.success === true && rows.length > 0 && counts.failed === 0 && counts.other === 0;
  if (!ok) bad++;
  process.stderr.write(`${ok ? "PASS" : "FAIL"} ${lane} suites ${j.numTotalTestSuites ?? "?"} tests ${counts.total} passed ${counts.passed} failed ${counts.failed} other ${counts.other} deep ${counts.deep}\n`);
}
process.stderr.write(`lanes ${lanes.length} fail ${bad}\n`);
process.exit(bad === 0 ? 0 : 1);
