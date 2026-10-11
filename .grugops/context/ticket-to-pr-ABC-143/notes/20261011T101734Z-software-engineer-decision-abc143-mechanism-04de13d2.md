---
id: 20261011T101734Z-software-engineer-decision-abc143-mechanism-04de13d2
kind: decision
by: software-engineer
at: 2026-10-11T10:17:34Z
verified_by:
confidence: high
refs:
  - ABC-143
  - ABC-142
  - ABC-042
  - QE-142-a
  - QE-142-b
  - QE-142-c
  - package.json
  - tools/grugops/result-file-reporter.js
  - tools/grugops/run-bounded.js
  - src/cli.test.ts
supersedes:
---

# SE `ABC-143`: the mechanism is a subclass of vitest's `JsonReporter` that writes a marker at start and the final file at exit

This note is hand-authored and unsealed.

- **Read first (feasibility).** In vitest 3.2.7, `JsonReporter.onFinished(files, _errors, coverageMap)`
  receives the unhandled errors and ignores them. That is `QE-142-a`'s cause. `writeReport(report)` is
  the single write point. `run-bounded.js`'s SIGKILL means no reporter hook runs on a 124. That is
  `QE-142-c`'s cause.
- **Chosen.** `tools/grugops/result-file-reporter.js` extends `JsonReporter`:
  - `onInit` writes a marker: `success: false`, `runState: "started"`, this run's `startTime`.
  - `onFinished` keeps the errors.
  - `writeReport` adds `unhandledErrors[]` (`name`, `message`, `stack`) and holds the result in
    memory. Any unhandled error sets `success` false.
  - `process.once("exit")` writes the final file with `runState: "exited"` and `exitCode`.
    A non-zero code forces `success` false.

  So `success: true` on disk requires vitest's verdict, no unhandled error, and exit 0.
- **Why at exit, not at report time.** The rule is "any non-zero exit never reads green". Writing at
  report time would leave a green file if the run were killed after reporting, for example during
  teardown. Writing at exit covers that case and every other non-zero exit without listing them.
- **Script.** Only `--reporter=json` changes, to `--reporter=./tools/grugops/result-file-reporter.js`.
  `--outputFile.json` is kept, and the reporter reads it. The `A10` pin and the `run-bounded.js:10`
  quote follow it byte for byte.
- **Console.** The `JSON report written to <path>` line is no longer printed. The ticket allows that
  if it is stated. No line is added.
- **Rejected.**
  - A second reporter beside the built-in `json`: vitest calls reporters through `Promise.all`, so
    the order between the two writers is not fixed.
  - `vitest.config.ts`: fenced (`ABC-144`).
  - A wrapper that deletes the file: fenced (`ABC-142`'s refusal).
  - A retry flag: fenced.
