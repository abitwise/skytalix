// V2: ABC-149's six REGRESSION PLANTS rows, by content. Commands cut from the committed header by program.
// Usage: node v2rows.mjs <copy dir> <label>   (the copy is a git-archive of head, node_modules linked)
import { execSync, spawnSync } from "node:child_process";
import { appendFileSync, readFileSync, writeFileSync, copyFileSync } from "node:fs";
import { join } from "node:path";
const [D, LABEL] = process.argv.slice(2);
const header = readFileSync(join(D, "tools/grugops/result-file-reporter.js"), "utf8");
const lines = header.split("\n");
const start = lines.findIndex((l) => l.startsWith("//   jq -r '"));
let q = []; for (let i = start; ; i++) { q.push(lines[i].replace(/^\/\/ {3}/, "")); if (lines[i].includes(".test-results/last-run.json")) break; }
const QUERY_WITH_BREAKS = q.join("\n");           // pasted as is, line breaks kept (QE-149-a)
const unhandledEg = /e\.g\.\n\/\/\s+`(it\("p", async[\s\S]*?\)\); \}\))`/.exec(header)[1].replace(/\n\/\/\s+/g, " ");
const stampCmd = /take a stamp \(`([^`]+)`\)/.exec(header)[1];
const exitOnlyCmd = /no plant; run `([^`]+)`/.exec(header)[1];
const backup = new Map();
const plant = (f, fn) => { const p = join(D, f); if (!backup.has(p)) backup.set(p, readFileSync(p, "utf8")); writeFileSync(p, fn(readFileSync(p, "utf8"))); };
const restore = () => { for (const [p, s] of backup) writeFileSync(p, s); backup.clear(); };
const run = (cmd) => spawnSync("bash", ["-c", cmd], { cwd: D, encoding: "utf8", maxBuffer: 1 << 28 });
const read = () => JSON.parse(readFileSync(join(D, ".test-results/last-run.json"), "utf8"));
const query = () => { const r = run(QUERY_WITH_BREAKS); return { exit: r.status, lines: r.stdout.split("\n").filter(Boolean).map((l) => l.replace(D + "/", "")).sort() }; };
const rows = [];
function row(name, expectExit, check, expectLines) {
  const f = read(); const qq = query();
  const fieldsOk = check(f);
  const linesOk = JSON.stringify(qq.lines) === JSON.stringify([...expectLines].sort());
  rows.push({ row: name, exit: lastExit, exitOk: lastExit === expectExit, fieldsOk, linesOk, agree: lastExit === expectExit && fieldsOk && linesOk, query: qq.lines,
    fields: { success: f.success, runState: f.runState, exitCode: f.exitCode, numTotalTests: f.numTotalTests, numFailedTests: f.numFailedTests, numFailedTestSuites: f.numFailedTestSuites, unhandled: (f.unhandledErrors ?? []).map((e) => e.message), startTime: f.startTime } });
}
let lastExit;
const npmTest = (extra = "") => { const r = run(`npm test ${extra}`); lastExit = r.status; return r; };
// green
npmTest(); row("green", 0, (f) => f.success === true && f.runState === "exited" && f.exitCode === 0, []);
// hang
const stamp = Number(run(stampCmd).stdout.trim());
plant("src/san.test.ts", (s) => s + `\nit("V2 PLANT hang", () => { while (true) {} });\n`);
npmTest(); restore();
row("hang", 124, (f) => f.success === false && f.runState === "started" && !("exitCode" in f) && f.startTime > stamp, ["run    started exitCode=none, killed"]);
// unhandled: the block's own e.g., verbatim
plant("src/zobrist.test.ts", (s) => s + `\n${unhandledEg}\n`);
npmTest(); restore();
row("unhandled", 1, (f) => f.success === false && f.exitCode === 1 && f.unhandledErrors.some((e) => e.message === "PLANT-timer"), ["error  PLANT-timer", "run    exited exitCode=1"]);
// suite
plant("src/history.test.ts", (s) => s.replace('describe("ABC-012 acceptance", () => {\n', 'describe("ABC-012 acceptance", () => {\n  throw new Error("PLANT-suite");\n'));
npmTest(); restore();
row("suite", 1, (f) => f.success === false && f.numFailedTestSuites === 1 && f.testResults.some((t) => t.name.endsWith("src/history.test.ts") && t.message.includes("PLANT-suite")), ["suite  src/history.test.ts  PLANT-suite", "run    exited exitCode=1"]);
// assertion
plant("src/gameend.test.ts", (s) => s.replace('expect(Object.hasOwn(claimsAt(2, 0), "claimable")).toBe(false);', 'expect(Object.hasOwn(claimsAt(2, 0), "claimable")).toBe(true);'));
npmTest(); restore();
const at = read().testResults.flatMap((t) => t.assertionResults.filter((a) => a.status === "failed").map((a) => `test   ${t.name.replace(D + "/", "")}  ${a.fullName}`));
row("assertion", 1, (f) => f.success === false && f.numFailedTests === 1, [...at, "run    exited exitCode=1"]);
// exit code only
lastExit = run(exitOnlyCmd).status;
row("exit code only", 1, (f) => f.success === false && f.exitCode === 1 && f.numFailedTests === 0 && f.numFailedTestSuites === 0 && f.unhandledErrors.length === 0, ["run    exited exitCode=1"]);
console.log(JSON.stringify({ label: LABEL, stampCmd, exitOnlyCmd, unhandledEg, rows }, null, 1));
