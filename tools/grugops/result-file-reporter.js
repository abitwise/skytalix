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
