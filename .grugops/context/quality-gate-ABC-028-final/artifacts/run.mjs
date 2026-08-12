// The lane runner: build -> output-identity gate -> typecheck -> suite verdict, per build.
// Every number this hop reports comes out of here; nothing is transcribed.
import { execFileSync } from "node:child_process";
import { copyFileSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { buildLane } from "./mk.mjs";

const HERE = dirname(new URL(import.meta.url).pathname);

function run(command, args, cwd) {
  try {
    return { code: 0, out: execFileSync(command, args, { cwd, encoding: "utf8", stdio: "pipe" }) };
  } catch (error) {
    return { code: error.status ?? -1, out: `${error.stdout ?? ""}${error.stderr ?? ""}` };
  }
}

function suite(lane, only) {
  const report = join(lane, "__report.json");
  const args = ["vitest", "run", "--reporter=json", `--outputFile=${report}`];
  if (only !== undefined) args.push(only);
  run("npx", args, lane);
  const json = JSON.parse(readFileSync(report, "utf8"));
  const failed = json.testResults
    .flatMap((file) => file.assertionResults)
    .filter((test) => test.status === "failed")
    .map((test) => `${test.ancestorTitles.join(" > ")} > ${test.title}`);
  return {
    total: json.numTotalTests,
    passed: json.numPassedTests,
    failed: json.numFailedTests,
    pending: json.numPendingTests + json.numTodoTests,
    files: json.testResults.length,
    names: failed,
  };
}

const [name, spec, transform, lanes] = process.argv.slice(2);
const lane = buildLane(name, { key: spec === "-" ? null : spec, perTest: transform === "perTest" });
copyFileSync(join(HERE, "identity.ts"), join(lane, "__identity.ts"));

const identity = run("node", ["__identity.ts"], lane);
const typecheck = run("npx", ["tsc", "--noEmit"], lane);

console.log(`build       ${name}  key=${spec}  transform=${transform}`);
console.log(`identity    ${identity.out.trim() || identity.out}`);
console.log(`typecheck   exit ${typecheck.code}`);

const wanted = (lanes ?? "full,owned").split(",");
for (const which of wanted) {
  const only = which === "owned" ? "src/history-pane.test.ts" : undefined;
  const result = suite(lane, only);
  console.log(
    `${which.padEnd(10)}  ${result.failed} failed / ${result.total} (${result.files} files, skip ${result.pending})`,
  );
  for (const failure of result.names) console.log(`             KILL  ${failure}`);
}
