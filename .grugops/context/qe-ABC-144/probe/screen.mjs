// QE ABC-144 A6 screen: consecutive `npm test` runs at a tree; a COUNT screen, no timing recorded.
// usage: node screen.mjs <treeDir> <target-consecutive> <max-runs> <outTsv>
import { spawnSync } from "node:child_process";
import { appendFileSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import { join } from "node:path";

const [tree, target, maxRuns, out] = process.argv.slice(2);
const want = Number(target);
const cap = Number(maxRuns);
writeFileSync(out, "run\tload1_before\texit\tfiles\ttests\tpassed\tfailed\tskipped\ttodo\tnfr_files\tnfr_passed\tunhandled\tstreak\n");
let streak = 0;
for (let i = 1; i <= cap && streak < want; i++) {
  const load1 = os.loadavg()[0].toFixed(2);
  const report = join(tree, ".test-results/last-run.json");
  rmSync(report, { force: true });
  const r = spawnSync("npm", ["test"], { cwd: tree, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  let j = null;
  try {
    j = JSON.parse(readFileSync(report, "utf8"));
  } catch {}
  const files = j?.testResults?.length ?? "NA";
  const nfr = (j?.testResults ?? []).filter((t) => /\.nfr\.test\.ts$/.test(t.name));
  const nfrPassed = nfr.filter((t) => t.status === "passed").length;
  const green =
    r.status === 0 && j && j.numFailedTests === 0 && j.numPendingTests === 0 && j.numTodoTests === 0 && nfr.length > 0 && nfrPassed === nfr.length;
  streak = green ? streak + 1 : 0;
  const row = [i, load1, r.status, files, j?.numTotalTests ?? "NA", j?.numPassedTests ?? "NA", j?.numFailedTests ?? "NA", j?.numPendingTests ?? "NA", j?.numTodoTests ?? "NA", nfr.length, nfrPassed, (j?.unhandledErrors ?? []).length ?? "NA", streak];
  appendFileSync(out, `${row.join("\t")}\n`);
  if (!green) appendFileSync(out, `# run ${i} NOT GREEN; tail:\n# ${(r.stdout + r.stderr).split("\n").filter((l) => /FAIL|Error|×|exit/.test(l)).slice(0, 12).join("\n# ")}\n`);
}
appendFileSync(out, `# done: streak=${streak} target=${want}\n`);
