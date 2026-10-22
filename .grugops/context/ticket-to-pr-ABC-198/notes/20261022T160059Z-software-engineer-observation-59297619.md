---
id: 20261022T160059Z-software-engineer-observation-59297619
kind: observation
by: software-engineer
at: 2026-10-22T16:00:59Z
verified_by: 
confidence: high (each command run by SE on 2026-10-22; outputs read; one exit-code-only transient marked UNKNOWN - verify)
refs:
  - ABC-198
  - ABC-192
  - ABC-176
  - ABC-149
  - ABC-143
  - RISK-ABC143-01
  - RISK-ABC173-STATE
  - QE-176-b
  - 4952425a
  - a42f4bbb
  - 20261022T154813Z-ba-pm-decision-1a123d24
supersedes: 
seal: sha256:ce421636cbd79082b795cebd07cb12d914741ab26354238de1f301a774952a5e
---

# ABC-198 BUMP_RERUN_LIST (1)–(3) re-run on vitest 4.1.12 / vite 7.3.7: every item reads as it did on 4.1.11. This note is what licenses re-pinning `CAPTURE_ARM_READ_ON_VITEST` to "4.1.12"

Software Engineer, task `ticket-to-pr-ABC-198`, 2026-10-22. Branch `grugops/ABC-198`, with lock commit `a42f4bbb` on `main` `4952425a`. Node v26.11.1, npm 11.20.0. The installed versions were read from `node_modules`: vitest 4.1.12, @vitest/mocker 4.1.12, vite 7.3.7. No timing is claimed.

## Red first (A4)
- At `a42f4bbb` (lock bumped, literal still "4.1.11"), `npm test` exits 1 with Test Files 1 failed | 59 passed (60) and Tests 1 failed | 1994 passed (1995).
- The one red is `src/cli.test.ts > ABC-192 … > A2 — the installed vitest is the version the capture arm was last read on (QE-176-b)`. Its message is the full `BUMP_RERUN_LIST` text, with Expected "4.1.11" and Received "4.1.12".
- The sorted test-name list equals base's (60 files, 1995 tests), except that this one row's status is `failed`.

## (1) The ABC-176 capture arm (worktree, `NODE_OPTIONS` unset)
- **SUITE refusal**, from `npx vitest run --reporter=json 2>/dev/null`:
  - Raw stdout line 1 is `heap-guard: refused. This run's V8 heap_size_limit is 4192 MiB, above the SUITE row of 224 MiB (60 test files; …). Prefix the command with NODE_OPTIONS=--max-old-space-size=128, …`, and line 2 is the JSON report. vitest exits 1.
  - Through `| jq '.numPendingTests + .numTodoTests'` the capture is empty (no integer) and the pipe exits 5. jq reads `parse error: Invalid numeric literal at line 1, column 11`.
  - `test-skip-integrity.js --skip-count ""` reads `Skip count was not provided (UNKNOWN - verify); …` and exits 1.
- **ONE-FILE refusal**, on `src/glyph-mode.test.ts`: line 1 is `heap-guard: refused. … above the ONE-FILE row of 496 MiB (1 test file; …) … --max-old-space-size=400`, and line 2 is the JSON. vitest exits 1. The capture is empty, the pipe exits 5 with the same jq error, and the gate reads `Skip count was not provided`, exit 1.
- **Green arms:**
  - SUITE, as spelled with prefix 128: exactly one line `0`, pipe exit 0. This ran at the red-first head, so vitest's own verdict was red on the A2 row; the capture still printed one integer.
  - ONE-FILE with prefix 400: exactly one line `0`, pipe exit 0. The gate reads `No findings.`, exit 0.

## (2) The reporter header's seven rows (scratch clone OUTSIDE the repo)
- **Set-up.** The scratch is a clone of `a42f4bbb` after `npm ci --ignore-scripts`. The literal was set to "4.1.12" in the scratch only, so that the green row is green. The plant file is `src/glyph-mode.test.ts`. Each file was read with node and with the header's READ IT query.
- **green:** exit 0. `success` true, `runState` exited, `exitCode` 0, 60 files, 1995 tests. Query: no line.
- **unhandled** (awaited `setTimeout` throw): exit 1. `success` false, `exitCode` 1, `unhandledErrors[].message` PLANT-timer. Query: `error  PLANT-timer` and `run    exited exitCode=1`.
- **hang** (`while (true) {}` before glyph-mode:133, after a green run and a stamp): exit 124. `success` false, `runState` started, no `exitCode`, and `startTime` 1792684736782 is later than the stamp 1792684736425. Query: exactly `run    started exitCode=none, killed`. No vitest process was left over.
- **suite** (a `describe` body throws PLANT-suite): exit 1. `success` false, `numFailedTestSuites` 1, and the file's entry carries PLANT-suite. Query: `suite  <glyph-mode file>  PLANT-suite` and `run    exited exitCode=1`.
- **assertion** (glyph-mode:133 `toBe("ascii")` → `toBe("unicode")`): exit 1. `success` false, `numFailedTests` 1. Query: `test   <glyph-mode file>  ABC-015 acceptance …` and `run    exited exitCode=1`. `numFailedTestSuites` read 2; the header does not pin that field.
- **exit code only** (`npm test -- --coverage --coverage.thresholds.lines=100`): exit 1. `success` false, `exitCode` 1, `numFailedTests` 0, `numFailedTestSuites` 0, `unhandledErrors` empty. Query: exactly `run    exited exitCode=1`, and the console reads `Coverage for lines (99.25%) does not meet global threshold (100%)`.
  - This held on 4 of 5 head runs. On the FIRST head run, 1 test failed: a row of `src/engine.test.ts` `ABC-170 A2 — maxNodes aborts…`. The file still read `success` false, `exitCode` 1, and the query named that test, so the reporter told the truth.
  - That run's log was overwritten before it was read, so the failure's message and cause are `UNKNOWN - verify`. The same row on the base clone (vitest 4.1.11) met every field 3 of 3.
  - It is recorded as an observation for QE, not fixed and not called a flake.
- **refused** (the test script with its `NODE_OPTIONS` prefix removed, `node_modules/.bin` on PATH): exit 1. `success` false, `exitCode` 1, `numTotalTests` 0, and `unhandledErrors[].message` is the guard's thrown message verbatim (`heap-guard: refused. … SUITE row of 224 MiB (60 test files; …)`). Query: `error  heap-guard: refused. …` (that whole message) and `run    exited exitCode=1`.

## (3) RISK-ABC173-STATE and RISK-ABC143-01
- **Static.** Between vitest 4.1.11 (base clone) and 4.1.12 (worktree), these are byte-identical:
  - `StateManager.getPaths()` and `StateManager.catchError(error, type)`;
  - the whole `class JsonReporter` (109 lines).
- **Load.** `JsonReporter.prototype.onInit`, `writeReport` and `onTestRunEnd` are all `function` on 4.1.12. Those are the reporter's two load-time asserted hooks plus `onInit`.
- **Live.** The guard's `getPaths` count reads 60 files on SUITE and 1 on ONE-FILE in (1). `catchError` delivers the refusal into `unhandledErrors` in (2) refused.
  - `RISK-ABC143-01`: the reporter loads, writes `success` true on green, and writes false on every red row.
  - `RISK-ABC173-STATE`: unchanged.
- **The heap-guard refusal is unchanged** from ABC-176's readings: the same text shape, the same 4192 MiB limit read, and pipe exit 5.

## Result
Items (1)–(3) PASS on 4.1.12. Item (4), re-pinning `CAPTURE_ARM_READ_ON_VITEST` to "4.1.12", is licensed by this note.
