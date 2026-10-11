// QE ABC-152 V2: ABC-149's six REGRESSION PLANT rows, graded by content, on fresh copies.
// Usage: node v2rows.mjs <pristine-tree> <node_modules-src> <outdir> <label> <mutant: none|m9b|onfinished> <rows csv>
// Commands are CUT FROM THE COMMITTED HEADER of tools/grugops/result-file-reporter.js by program, never retyped.
// QE's plant files differ from the SE's (san/zobrist/history/gameend) and QE-149's (same four).
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [pristine, nmSrc, outdir, label, mutant, rowsCsv] = process.argv.slice(2);
mkdirSync(outdir, { recursive: true });
const REP = "tools/grugops/result-file-reporter.js";
const header = readFileSync(join(pristine, REP), "utf8").split("\n");
const strip = (l) => l.replace(/^\/\/\s*/, "");

// READ IT: the comment lines after "// READ IT" up to the next bare "//", prefixes stripped, LINE BREAKS KEPT.
const r0 = header.findIndex((l) => l.startsWith("// READ IT"));
const readIt = [];
for (let i = r0 + 1; header[i].trim() !== "//"; i++) readIt.push(strip(header[i]));
const READ_IT = readIt.join("\n");
const joined = header.slice(0, 72).map(strip).join(" ");
const after = (marker) => {
  const i = joined.indexOf(marker);
  if (i < 0) throw new Error(`marker not found: ${marker}`);
  const a = joined.indexOf("`", i + marker.length);
  return joined.slice(a + 1, joined.indexOf("`", a + 1));
};
const STAMP = after("take a stamp (");
const EXIT_ONLY = after("exit code only: no plant; run ");
const UNHANDLED_EG = after("then awaits a timer, e.g.");
writeFileSync(join(outdir, `cut-commands.txt`), `READ_IT (with line breaks):\n${READ_IT}\n\nSTAMP: ${STAMP}\nEXIT_ONLY: ${EXIT_ONLY}\nUNHANDLED_EG: ${UNHANDLED_EG}\n`);

const once = (src, find, replace, file) => {
  const n = src.split(find).length - 1;
  if (n !== 1) throw new Error(`anchor hit ${n} times in ${file}: ${JSON.stringify(find)}`);
  return src.replace(find, replace);
};
const edit = (dir, file, find, replace) => {
  const p = join(dir, file);
  writeFileSync(p, once(readFileSync(p, "utf8"), find, replace, file));
};

function mutate(dir) {
  if (mutant === "none") return;
  if (mutant === "m9b") {
    // M9b (QE-149-c): no exit hook; write at report time, filling runState / exitCode from process.exitCode.
    edit(dir, REP, `    process.once("exit", (exitCode) => {\n      this.#result.runState = "exited";\n      this.#result.exitCode = exitCode;\n      if (exitCode !== 0) this.#result.success = false;\n      this.#write();\n    });\n`, "");
    edit(dir, REP, "    this.#result = result;\n", "    this.#result = result;\n    result.runState = \"exited\";\n    result.exitCode = process.exitCode ?? 0;\n    if (result.exitCode !== 0) result.success = false;\n    this.#write();\n");
  } else if (mutant === "onfinished") {
    // the 3.x route on 4.1: onFinished instead of onTestRunEnd (load-time check kept, it does not name onFinished)
    edit(dir, REP, "  async onTestRunEnd(testModules, unhandledErrors = [], reason) {\n    this.#unhandled = unhandledErrors;\n    await super.onTestRunEnd(testModules, unhandledErrors, reason);\n  }\n", "  async onFinished(files, errors = [], coverageMap) {\n    this.#unhandled = errors;\n    await super.onFinished?.(files, errors, coverageMap);\n  }\n");
  } else throw new Error(`unknown mutant ${mutant}`);
}

const sh = (cwd, cmd, timeout = 300000) => spawnSync("/bin/bash", ["-c", cmd], { cwd, encoding: "utf8", timeout, maxBuffer: 1 << 28 });
const fresh = (row) => {
  const dir = join(outdir, "trees", `${label}-${row}`);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(join(outdir, "trees"), { recursive: true });
  execFileSync("cp", ["-Rc", pristine, dir]);
  execFileSync("cp", ["-Rc", nmSrc, join(dir, "node_modules")]);
  mutate(dir);
  return dir;
};
const readFile = (dir) => {
  const p = join(dir, ".test-results/last-run.json");
  return existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : null;
};
const query = (dir) => {
  const r = sh(dir, READ_IT);
  return { exit: r.status, lines: r.stdout.split("\n").filter((l) => l !== ""), stderr: r.stderr.trim() };
};
const sameSet = (a, b) => JSON.stringify([...a].sort()) === JSON.stringify([...b].sort());

const rows = {
  green: (dir) => ({ cmd: "npm test", want: { exit: 0, lines: [] }, fields: (f) => f?.success === true && f.runState === "exited" && f.exitCode === 0 }),
  unhandled: (dir) => {
    const p = join(dir, "src/apply.test.ts");
    writeFileSync(p, `${readFileSync(p, "utf8")}\n${UNHANDLED_EG}\n`);
    return {
      cmd: "npm test",
      want: { exit: 1, lines: ["error  PLANT-timer", "run    exited exitCode=1"] },
      fields: (f) => f?.success === false && f.exitCode === 1 && (f.unhandledErrors ?? []).some((e) => e.message === "PLANT-timer"),
    };
  },
  suite: (dir) => {
    const file = "src/fen.test.ts";
    const src = readFileSync(join(dir, file), "utf8");
    const m = src.match(/^describe\("([^"]+)", \(\) => \{\n/m);
    edit(dir, file, m[0], `${m[0]}  throw new Error("PLANT-suite");\n`);
    const abs = join(dir, file);
    return {
      cmd: "npm test",
      want: { exit: 1, lines: [`suite  ${abs}  PLANT-suite`, "run    exited exitCode=1"] },
      fields: (f) => f?.success === false && f.numFailedTestSuites === 1 && f.testResults.some((t) => t.name === abs && /PLANT-suite/.test(t.message)),
    };
  },
  assertion: (dir) => {
    const file = "src/legal.test.ts";
    edit(dir, file, "    expect(isInCheck(parseFen(START_FEN))).toBe(false);\n", "    expect(isInCheck(parseFen(START_FEN))).toBe(true);\n");
    const abs = join(dir, file);
    return {
      cmd: "npm test",
      want: { exit: 1, linesFn: (f) => [...f.testResults.filter((t) => t.name === abs).flatMap((t) => t.assertionResults.filter((a) => a.status === "failed").map((a) => `test   ${abs}  ${a.fullName}`)), "run    exited exitCode=1"] },
      fields: (f) => f?.success === false && f.numFailedTests === 1 && f.testResults.find((t) => t.name === abs)?.assertionResults.filter((a) => a.status === "failed").length === 1,
    };
  },
  hang: (dir) => ({ hang: true, cmd: "npm test", want: { exit: 124, lines: ["run    started exitCode=none, killed"] } }),
  exitonly: (dir) => ({
    cmd: EXIT_ONLY,
    want: { exit: 1, lines: ["run    exited exitCode=1"] },
    fields: (f) => f?.success === false && f.exitCode === 1 && f.numFailedTests === 0 && f.numFailedTestSuites === 0 && (f.unhandledErrors ?? []).length === 0,
  }),
};

const out = [];
for (const row of rowsCsv.split(",")) {
  const dir = fresh(row);
  let spec;
  let stamp = null;
  if (row === "hang") {
    const g = sh(dir, "npm test");
    if (g.status !== 0) throw new Error(`hang row's green pre-run exited ${g.status}`);
    stamp = Number(sh(dir, STAMP).stdout.trim());
    const p = join(dir, "src/moves.test.ts");
    writeFileSync(p, `${readFileSync(p, "utf8")}\nit("QE152 hang", () => {\n  while (true) {}\n});\n`);
    spec = rows.hang(dir);
    spec.fields = (f) => f?.success === false && f.runState === "started" && f.exitCode === undefined && f.startTime > stamp;
  } else spec = rows[row](dir);
  const run = sh(dir, spec.cmd, 300000);
  const f = readFile(dir);
  const q = query(dir);
  const wantLines = spec.want.linesFn ? spec.want.linesFn(f) : spec.want.lines;
  const exitOk = run.status === spec.want.exit;
  const fieldsOk = Boolean(spec.fields(f));
  const linesOk = sameSet(q.lines, wantLines);
  const verdict = exitOk && fieldsOk && linesOk ? "AGREE" : "DISAGREE";
  const summary = f && {
    success: f.success, runState: f.runState, exitCode: f.exitCode, startTime: f.startTime, stamp,
    numTotalTests: f.numTotalTests, numPassedTests: f.numPassedTests, numFailedTests: f.numFailedTests,
    numFailedTestSuites: f.numFailedTestSuites, numPendingTests: f.numPendingTests, numTodoTests: f.numTodoTests,
    files: f.testResults?.length, unhandled: (f.unhandledErrors ?? []).map((e) => e.message),
  };
  const rec = { label, mutant, row, exit: run.status, wantExit: spec.want.exit, exitOk, fieldsOk, linesOk, verdict, lines: q.lines, wantLines, queryExit: q.exit, queryStderr: q.stderr, file: summary, consoleTail: (run.stdout + run.stderr).split("\n").filter((l) => /Test Files|Tests |ERROR|Coverage for|deprecated/.test(l)).slice(-6) };
  out.push(rec);
  console.log(`${label}\t${mutant}\t${row}\texit ${run.status}/${spec.want.exit}\tfields ${fieldsOk}\tlines ${linesOk}\t${verdict}\t${JSON.stringify(q.lines)}`);
  rmSync(dir, { recursive: true, force: true });
}
writeFileSync(join(outdir, `v2-${label}.json`), JSON.stringify(out, null, 2));
