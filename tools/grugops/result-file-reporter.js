// result-file-reporter.js — `npm test`'s kept result file, `.test-results/last-run.json`, made so
// that it can never read green after a red run.
//
// `ABC-143` (2026-10-11), amending `ABC-142`. `ABC-142` used vitest's built-in JSON reporter. QE
// found two reds on which that file read `success: true` (`QE-142-a`, `QE-142-c`):
//   - an unhandled error (a test that throws from a `setTimeout`): vitest exits 1, but the JSON
//     reporter ignores the errors it is handed, so the file read success true with no error text;
//   - a timeout: `run-bounded.js` SIGKILLs the tree (exit 124) before any reporter writes, so the
//     PREVIOUS run's file stayed, still reading success true.
//
// WHAT THIS DOES. It is vitest's own JsonReporter, with three changes and nothing else:
//   1. At start (`onInit`) it overwrites the file with a "started" marker: `success: false`,
//      `runState: "started"`, and THIS run's `startTime`. A run that is killed leaves the marker,
//      never a stale green.
//   2. It keeps the unhandled errors vitest hands to `onFinished`, as `unhandledErrors`
//      (name, message, stack). Any unhandled error makes `success` false.
//   3. It writes the final file only when the vitest process exits (`process.on("exit")`), with
//      `runState: "exited"` and the real `exitCode`. `success` is true only when vitest's own
//      verdict was success, there was no unhandled error, AND the exit code is 0. So any non-zero
//      exit, for any reason, reads not-success.
// A side effect of 3: vitest's "JSON report written to <path>" console line is no longer printed.
//
// READ IT (one line per recorded red; prints nothing on a green file):
//   jq -r '(.testResults[] | .name as $f | (.assertionResults[] | select(.status=="failed")
//     | "test   \($f)  \(.fullName)"), (select(.status=="failed" and .message!="")
//     | "suite  \(.name)  \(.message)")), (.unhandledErrors[]? | "error  \(.message)"),
//     (select(.success!=true) | "run    \(.runState) exitCode=\(.exitCode // "none, killed")")'
//     .test-results/last-run.json
//
// THE LIMITS, stated rather than smoothed:
//   - A run that never reaches "exit" (the 124 bound's SIGKILL, or a signal vitest does not
//     handle) leaves the "started" marker: it reads not-success, but names no test.
//   - Two `npm test` runs in one checkout at once overwrite each other's file (as at `ABC-142`).
//   - Only `npm test` uses this file. `vitest.config.ts` is untouched, so a direct `npx vitest run`
//     (the `*_DEEP` lanes) writes nothing.
//
// REGRESSION PLANTS (`ABC-149`). Re-run all six rows when a hop changes this file, the `test` script
// in `package.json`, or the installed `vitest` / `@vitest/*` version. It is not a per-diff gate: one
// pass is six `npm test` runs. Plant in a scratch copy OUTSIDE the repository, never in a worktree;
// which test file takes the plant is the hop's choice. Read every file with `jq` or `node -e`, and
// run the READ IT query above on it. A row passes only when its exit code, its file fields AND its
// query lines all match, the lines compared BY CONTENT (in any order). A line count alone is not a
// pass: without its `suite` or `error` arm the query still prints the `run` line on every red file.
// Each row: plant; `npm test` exit; file fields; query lines.
//   green: no plant. Exit 0. `success` true, `runState` "exited", `exitCode` 0. Query: no line.
//   unhandled: a test that throws from a `setTimeout`, e.g. `it("p", () => { setTimeout(() => {
//     throw new Error("PLANT-timer"); }, 0); })`. Exit 1. `success` false, `exitCode` 1,
//     `unhandledErrors[].message` "PLANT-timer". Query: `error  PLANT-timer` and
//     `run    exited exitCode=1`.
//   hang: after a green run, take a stamp (`node -p 'Date.now()'`), then make one test
//     non-terminating (`while (true) {}`). Exit 124. `success` false, `runState` "started", no
//     `exitCode`, `startTime` later than the stamp. Query: exactly
//     `run    started exitCode=none, killed`.
//   suite: `throw new Error("PLANT-suite")` in a `describe` body. Exit 1. `success` false,
//     `numFailedTestSuites` 1, and that file's `testResults` entry carries "PLANT-suite". Query:
//     `suite  <file>  PLANT-suite` and `run    exited exitCode=1`.
//   assertion: one assertion inverted (`ABC-142` `A1`: `toBe(false)` -> `toBe(true)`). Exit 1.
//     `success` false, `numFailedTests` 1. Query: `test   <file>  <full title>` and
//     `run    exited exitCode=1`.
//   exit code only: no plant; run `npm test -- --coverage --coverage.thresholds.lines=100`. Exit 1.
//     `success` false, `exitCode` 1, AND `numFailedTests` 0, `numFailedTestSuites` 0,
//     `unhandledErrors` empty. Query: exactly `run    exited exitCode=1`.
// The exit-code-only row is the one red where the exit code alone decides `success`; every other
// red also fails vitest's verdict or carries an unhandled error. It proves the exit-code check ONLY
// WHILE all four of its fields hold. If lines coverage ever reaches 100 %, the command exits 0 and
// the row must be re-planted with another red that vitest's own verdict calls green.
// What the set catches that `ABC-143` `A1`-`A6` do not (QE, `qe-ABC-143` `…112f11df`): `success`
// computed without the exit code, or the file written at report time with no exit hook, makes the
// exit-code-only row read `success` true; the query without its `run` arm prints no line on the hang
// row.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { JsonReporter } from "vitest/reporters";

export default class ResultFileReporter extends JsonReporter {
  #file;
  #result;
  #unhandled = [];

  constructor(options = {}) {
    super(options);
  }

  onInit(ctx) {
    super.onInit(ctx);
    const outputFile = this.options.outputFile ?? ctx.config.outputFile?.json;
    if (typeof outputFile !== "string") return; // no file named: behave as the JSON reporter
    this.#file = resolve(ctx.config.root, outputFile);
    this.#result = { success: false, runState: "started", startTime: this.start, testResults: [] };
    this.#write();
    process.once("exit", (exitCode) => {
      this.#result.runState = "exited";
      this.#result.exitCode = exitCode;
      if (exitCode !== 0) this.#result.success = false;
      this.#write();
    });
  }

  async onFinished(files, errors = [], coverageMap) {
    this.#unhandled = errors;
    await super.onFinished(files, errors, coverageMap);
  }

  async writeReport(report) {
    if (this.#file === undefined) return super.writeReport(report);
    const result = JSON.parse(report);
    result.unhandledErrors = this.#unhandled.map((error) => ({
      name: error?.name,
      message: String(error?.message ?? error),
      stack: error?.stack,
    }));
    if (result.unhandledErrors.length > 0) result.success = false;
    this.#result = result;
  }

  #write() {
    mkdirSync(dirname(this.#file), { recursive: true });
    writeFileSync(this.#file, JSON.stringify(this.#result), "utf-8");
  }
}
