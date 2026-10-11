---
id: 20261011T105337Z-qe-e2e-observation-abc143-vitest-coupling-4f652dad
kind: observation
by: qe-e2e
at: 2026-10-11T10:53:37Z
verified_by:
confidence: high
refs:
  - ABC-143
  - QE-143-c
  - QE-142-a
  - package.json
  - package-lock.json
  - tools/grugops/result-file-reporter.js
supersedes:
---

# QE `ABC-143`: the reporter's coupling to vitest 3.2.7. A major bump breaks it silently; only the caret range and the lockfile hold it

This note is hand-authored and unsealed. The 3.2.7 lines were read from the installed
`node_modules`. Versions 4.1.11 (`V4` tag) and 5.0.3 (`latest`) were read from tarballs fetched with
`npm pack` into their own scratch directory. They were grepped and never executed or installed.
The 4.x and 5.x effects below are **read, not run** (`UNKNOWN - verify` until someone runs them).

## What the reporter leans on (3.2.7)

1. `import { JsonReporter } from "vitest/reporters"`: the `./reporters` subpath export.
2. `JsonReporter`'s `this.options`, `this.start` (set in `onInit`), `ctx.config.root`, and
   `ctx.config.outputFile.json`.
3. **`onFinished(files, errors, coverageMap)`**, the only place it receives unhandled errors.
   3.2.7's own `Reporter` type marks it `@deprecated use onTestRunEnd instead`.
4. **`writeReport(report: string)`**, the method `logTasks` calls once with the JSON string. The
   subclass overrides it to hold the result in memory instead of writing it.
5. Node's `process.once("exit")` with `process.exitCode`. This is Node's, not vitest's.

## What breaks on an upgrade

| vitest | read | effect on `last-run.json` | does `npm test`'s exit code show it? |
|---|---|---|---|
| 3.x minors | `onFinished` is still called (deprecated); `writeReport` is public | none expected | — |
| **4.1.11** | `JsonReporter` now implements `onTestRunEnd(testModules)` → `writeReport`. The core no longer calls `onFinished` on reporters (it survives only on the UI WebSocket client) | **the override goes dead, and unhandled errors are silently dropped.** This is mutant `M3`: `A1` NOT MET (text count 0). `success` still reads false, but only through the exit-code conjunct that no criterion pins (`QE-143-a`) | **no**, the gate stays green |
| **5.0.3** | the `./reporters` export is gone (`JsonReporter` is under `./node`). `writeReport` is gone (the write is inline in `onTestRunEnd`) | the import fails, so `npm test` should fail at reporter load on every run. That is loud, but a previous file is left untouched. Once the import is repointed, the `writeReport` override is dead: the built-in writes the file, then the exit hook overwrites it with the marker. **Every file, green included, reads `success` false and names nothing** (as mutants `M4`/`M6`) | the import failure: yes. After the repoint: **no** |

`engines` for 4.1.11 is `^20 || ^22 || >=24`, and for 5.0.3 it is `^22.12 || ^24 || >=26`. This
repository's `>=22` and the installed Node v26.11.0 admit both, so nothing on the Node side refuses
the bump.

## What pins it today

- `package.json` `"vitest": "^3.0.0"`. The caret refuses 4.x and 5.x on `npm install` and on
  `npm update`.
- `package-lock.json` resolves 3.2.7, which `npm ci` and `npm install` honour.
- **Nothing else.** No test imports or exercises the reporter. The `A10` pin holds only the
  script string. There is no `overrides` entry, and the reporter's header comment does not name the
  version. A deliberate major bump (`npm i -D vitest@4`) keeps the suite green and silently reopens
  `QE-142-a`'s unhandled-error half.

## A route that would survive 4.x (QE's reading, not tried)

3.2.7 already calls `onTestRunEnd(testModules, unhandledErrors, reason)` beside `onFinished`
(`Promise.all`), and 4.1.11 keeps that hook. Reading the errors there instead of in `onFinished`
would carry over. A load-time check that `writeReport` exists on `JsonReporter.prototype` would
turn the 5.x break loud. This is `UNKNOWN - verify` and the Software Engineer's call. It is not
asked of this ticket.
