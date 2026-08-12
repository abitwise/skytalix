// IS THE FORBIDDEN-FORMULATION RULE ENFORCEABLE? The ledger bans four SENTENCE SHAPES in the file
// comment. This makes the smallest possible edit that puts the banned generalisation back — comment
// text only, every changed line begins `//` — and then runs every gate the project has.
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { buildLane } from "./mk.mjs";

const lane = buildLane("RESTORED-FALSE-SENTENCE", {});
const path = join(lane, "src/history-pane.nfr.test.ts");
let text = readFileSync(path, "utf8");

const edits = [
  ["THE SHARING HERE IS STILL LOAD-BEARING", "THE SHARING HERE IS NO LONGER LOAD-BEARING"],
  ["these per test STILL LOSES A GUARD", "these per test loses NOTHING — the class is closed"],
];
for (const [from, to] of edits) {
  if (!text.includes(from)) throw new Error(`anchor missing: ${from}`);
  text = text.replaceAll(from, to);
}
writeFileSync(path, text);

const before = readFileSync(join(lane, "src/history-pane.nfr.test.ts"), "utf8");
const changed = before
  .split("\n")
  .filter((line, index) => line !== readFileSync(path, "utf8").split("\n")[index]);
console.log(`edited ${edits.length} sentences, comment text only`);

for (const [label, command, args] of [
  ["lint", "npx", ["biome", "check", "."]],
  ["typecheck", "npx", ["tsc", "--noEmit"]],
]) {
  try {
    execFileSync(command, args, { cwd: lane, stdio: "pipe" });
    console.log(`${label.padEnd(10)} exit 0`);
  } catch (error) {
    console.log(`${label.padEnd(10)} exit ${error.status}`);
  }
}
const report = join(lane, "__report.json");
try {
  execFileSync("npx", ["vitest", "run", "--reporter=json", `--outputFile=${report}`], {
    cwd: lane,
    stdio: "pipe",
  });
} catch { /* red is a possible outcome and is the question */ }
const json = JSON.parse(readFileSync(report, "utf8"));
console.log(
  `unit       ${json.numFailedTests} failed / ${json.numTotalTests} on ${json.testResults.length} files, skip ${json.numPendingTests + json.numTodoTests}`,
);
console.log(`grep       "no longer load-bearing" now present in the tree: ${readFileSync(path, "utf8").includes("NO LONGER LOAD-BEARING")}`);
