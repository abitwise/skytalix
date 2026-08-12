// `src/history-pane.test.ts:493` claims, in the PRESENT TENSE and as the load-bearing reason for
// calling `buildAllCases()` inside each test:
//
//   "`WPOS` — a pane that corrupts the caller's `history.position` once per object and changes no
//    rendered byte — passes 732/732 on 26 files against the shared fixtures, with zero catchers
//    anywhere in the project, and fails here."
//
// The suite is 755 on this tip, so the DENOMINATOR is stale. This builds the mutant so the rest of
// the sentence is measured rather than assumed — the same courtesy BA/PM could not extend to
// `nfr.test.ts:115`'s numerator, and which this hop extends to both.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { buildLane, replaceOnce } from "./lane.mjs";

// The pane never READS `history.position` — it parses `initialFen` itself — so corrupting the
// caller's object cannot change a rendered byte. Once per object, exactly as the comment says.
const ANCHOR = "  const position = parseFen(history.initialFen);";
const WPOS = `  const position = parseFen(history.initialFen);
  if (!__wposSeen.has(history)) {
    __wposSeen.add(history);
    (history.position as { fullmoveNumber: number }).fullmoveNumber = 9999;
  }`;

const mutate = (source) => {
  const withSet = replaceOnce(
    source,
    "export function renderHistory(history: GameHistory): string[] {",
    "const __wposSeen = new WeakSet<GameHistory>();\nexport function renderHistory(history: GameHistory): string[] {",
    "renderHistory signature",
  );
  return replaceOnce(withSet, ANCHOR, WPOS, "parseFen line");
};

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

const lane = buildLane("wpos", { editPane: mutate });
const result = suite(lane);
console.log(`WPOS on this tip: ${result.failed.length} failed / ${result.total} on ${result.files} files`);
for (const test of result.failed) console.log(`  FAIL  ${test.title.slice(0, 120)}`);
