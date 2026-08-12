// `A4`'s LANE CLAUSE, as amended. The absolute (`1 failed, 749 passed` against `750 passed (750)`)
// is struck; what the criterion now asserts is a SHAPE:
//
//   "exactly one failure, it is this criterion, and ZERO pre-existing tests break"
//
// That is the clause whose text moved, so it is re-gated here on the 755 tip. `WPOSMID` is a pane
// that writes to the caller's graph DURING the render and restores before returning — visible to
// `A4`'s watcher, invisible to `A9`'s before/after comparison.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { buildLane, replaceOnce } from "./lane.mjs";

const ANCHOR = "  const position = parseFen(history.initialFen);";
const WPOSMID = `  const position = parseFen(history.initialFen);
  const __midSave = history.position.fullmoveNumber;
  (history.position as { fullmoveNumber: number }).fullmoveNumber = -1;
  (history.position as { fullmoveNumber: number }).fullmoveNumber = __midSave;`;

function suite(lane) {
  const report = join(lane, "__report.json");
  try {
    execFileSync("npx", ["vitest", "run", "--reporter=json", `--outputFile=${report}`], {
      cwd: lane,
      encoding: "utf8",
      stdio: "pipe",
    });
  } catch {
    /* red is the point */
  }
  const json = JSON.parse(readFileSync(report, "utf8"));
  const tests = json.testResults.flatMap((f) => f.assertionResults);
  return { total: json.numTotalTests, files: json.testResults.length, failed: tests.filter((t) => t.status === "failed") };
}

const lane = buildLane("wposmid", {
  editPane: (source) => replaceOnce(source, ANCHOR, WPOSMID, "parseFen line"),
});
const result = suite(lane);
console.log(`WPOSMID: ${result.failed.length} failed / ${result.total} on ${result.files} files`);
for (const test of result.failed) console.log(`  FAIL  ${test.title.slice(0, 120)}`);
console.log(
  `\nSHAPE: exactly one failure? ${result.failed.length === 1}` +
    `   it is A4? ${result.failed.every((t) => t.title.startsWith("A4 —"))}` +
    `   pre-existing broken? ${result.failed.length - result.failed.filter((t) => t.title.startsWith("A4 —")).length}`,
);
