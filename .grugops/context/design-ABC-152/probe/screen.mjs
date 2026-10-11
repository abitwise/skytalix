// design-ABC-152 D3 correctness screen driver. One full default lane per call, in a scratch tree.
// Records exit code, counts, every red test by name, every file that never finished, and every collected
// file path. Reads NO clock: durations are stripped before anything is kept.
// Usage: TREE=<scratch tree> ARM=<name> OUT=<dir outside the repo> node screen.mjs
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const { TREE, ARM, OUT } = process.env;
if (!TREE || !ARM || !OUT) throw new Error("TREE, ARM and OUT are required");
const HERE = dirname(fileURLToPath(import.meta.url));
mkdirSync(OUT, { recursive: true });
const json = join(OUT, `${ARM}.vitest.json`);
const progress = join(OUT, `${ARM}.progress.txt`);
rmSync(json, { force: true });
rmSync(progress, { force: true });

const env = { ...process.env, PROGRESS: progress };
delete env.NODE_OPTIONS;
for (const k of Object.keys(env)) if (k.endsWith("_DEEP")) delete env[k];
const r = spawnSync(
  "node",
  [
    "tools/grugops/run-bounded.js",
    "300000",
    "vitest",
    "run",
    "--reporter=dot",
    "--reporter=json",
    `--outputFile.json=${json}`,
    `--reporter=${join(HERE, "progress-reporter.mjs")}`,
  ],
  { cwd: TREE, env, encoding: "utf8", maxBuffer: 1 << 28 },
);

const rel = (p) => relative(TREE, p);
const j = existsSync(json) ? JSON.parse(readFileSync(json, "utf8")) : null;
const lines = existsSync(progress) ? readFileSync(progress, "utf8").trim().split("\n") : [];
const started = new Set(lines.filter((l) => l.startsWith("start ")).map((l) => rel(l.slice(6))));
const ended = new Map(
  lines.filter((l) => l.startsWith("end ")).map((l) => {
    const [, f, s] = l.split(" ");
    return [rel(f), s];
  }),
);
const unfinished = [...started].filter((f) => !ended.has(f)).sort();
const red = [];
for (const f of j?.testResults ?? []) {
  if (f.status === "failed" && f.message) red.push({ file: rel(f.name), kind: "suite", title: "", first: f.message.split("\n")[0] });
  for (const a of f.assertionResults)
    if (a.status === "failed")
      red.push({ file: rel(f.name), kind: "test", title: a.fullName, first: (a.failureMessages[0] ?? "").split("\n")[0] });
}
const summary = {
  arm: ARM,
  tree: TREE,
  exit: r.status,
  signal: r.signal,
  jsonWritten: j !== null,
  files: j ? j.testResults.length : null,
  tests: j?.numTotalTests ?? null,
  passed: j?.numPassedTests ?? null,
  failed: j?.numFailedTests ?? null,
  skippedOrPending: j ? j.numPendingTests + j.numTodoTests : null,
  failedSuites: j?.numFailedTestSuites ?? null,
  success: j?.success ?? null,
  filesStarted: started.size,
  filesEnded: ended.size,
  unfinished,
  redFiles: [...new Set(red.map((x) => x.file))].sort(),
  red,
  collected: [...started].sort(),
};
writeFileSync(join(OUT, `${ARM}.summary.json`), `${JSON.stringify(summary, null, 2)}\n`);
// keep the console tail (no durations are graded; the tail is kept only for error text)
const tail = `${r.stdout ?? ""}\n${r.stderr ?? ""}`
  .split("\n")
  .filter((l) => !/Duration|Start at|\d+ms\b/.test(l))
  .slice(-120)
  .join("\n");
writeFileSync(join(OUT, `${ARM}.console-tail.txt`), tail);
rmSync(json, { force: true }); // the raw JSON carries durations; only the summary is kept
console.log(JSON.stringify({ ...summary, red: summary.red.length, collected: summary.collected.length }));
