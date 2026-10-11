---
id: 20261011T203648Z-software-engineer-observation-abc152-v2-reporter-rows-7d490dfe
kind: observation
by: software-engineer
at: 2026-10-11T20:36:48Z
verified_by:
confidence: high
refs:
  - ABC-152
  - ABC-149
  - ABC-143
  - RISK-ABC143-01
  - QE-149-a
  - QE-149-c
  - tools/grugops/result-file-reporter.js
  - .grugops/context/ticket-to-pr-ABC-152/probe/v2rows.mjs
  - .grugops/context/ticket-to-pr-ABC-152/probe/v2-rows-head.json
  - .grugops/context/ticket-to-pr-ABC-152/probe/v2-rows-m9b.json
  - .grugops/context/ticket-to-pr-ABC-152/probe/v2-rows-old.json
  - .grugops/context/ticket-to-pr-ABC-152/probe/reporter-loadcheck.mjs
  - .grugops/context/qe-ABC-149/notes/20261011T164844Z-qe-e2e-observation-abc149-mutants-918a2941.md
supersedes:
---

# SE `ABC-152` `V2`: all six rows AGREE by content at head. `M9b` is killed by the exit-code-only row alone. `main`'s `onFinished` code on 4.1 fails the unhandled row. The load-time check throws on either missing hook

This note is hand-authored and unsealed. These readings are SE's own, made during the build. `V2` is QE's to grade,
and QE re-runs it with its own plants. **No timing was read.**

## Method (`probe/v2rows.mjs`)

- **Copies.** One `git archive 23c5521a` per arm, outside the repository, with `node_modules` linked to the
  worktree's (4.1.11).
- **The block's commands are cut from the committed header by program, not retyped.**
  - The READ IT query is cut **with its line breaks** (the `//   ` prefixes stripped) and run under `bash` as
    pasted. That is `QE-149-a`'s case.
  - The stamp command is `node -p 'Date.now()'`.
  - The exit-code-only command is `npm test -- --coverage --coverage.thresholds.lines=100`.
  - The unhandled plant is the block's own new `e.g.`, verbatim.
- **Plants:**
  - hang: `src/san.test.ts`, appended after the green run and the stamp;
  - unhandled: `src/zobrist.test.ts`, appended;
  - suite: `src/history.test.ts`, the first line of `describe("ABC-012 acceptance")`;
  - assertion: `src/gameend.test.ts`, `toBe(false)` → `toBe(true)`.
- **Grading.** Each row checks the exit code, the row's fields, and the query lines compared as sorted arrays, **by
  content**.

## Head (`v2-rows-head.json`)

| row | exit | file | query lines |
|---|---|---|---|
| green | 0 | `success` true, `runState` exited, `exitCode` 0, 1741 tests | none |
| hang | 124 | `success` false, `runState` started, no `exitCode`; `startTime` after the stamp | `run    started exitCode=none, killed` |
| unhandled | 1 | `success` false, `exitCode` 1, `unhandledErrors` [`PLANT-timer`], 0 failed tests | `error  PLANT-timer`, `run    exited exitCode=1` |
| suite | 1 | `success` false, `numFailedTestSuites` 1, and the `history.test.ts` entry carries `PLANT-suite` | `suite  src/history.test.ts  PLANT-suite`, `run    exited exitCode=1` |
| assertion | 1 | `success` false, `numFailedTests` 1 (`numFailedTestSuites` 2, as `QE-149-b` explains) | `test   src/gameend.test.ts  the claimable set omits …`, `run    exited exitCode=1` |
| exit code only | 1 | `success` false, `exitCode` 1, `numFailedTests` 0, `numFailedTestSuites` 0, `unhandledErrors` [] | exactly `run    exited exitCode=1` |

**All six AGREE.** The joined READ IT query works as pasted: it printed every row's lines by content.

## `M9b` (`QE-149-c`): the exit hook deleted, `runState` / `exitCode` written at report time from `process.exitCode`

- Five rows AGREE.
- **The exit-code-only row DISAGREES:** exit 1, but `success` **true**, `exitCode` **0**, and the query prints 0 lines.
- So it is killed by that row alone, as QE predicted.

## Control: `main`'s reporter code (`onFinished`, no check) under the new header, on the same head

- **The unhandled row DISAGREES:** exit 1, `unhandledErrors` [], and the query prints only the `run` line.
- The other five rows agree.
- So the route change is what makes the row pass on 4.1, and the row kills its absence.

## The load-time check (`probe/reporter-loadcheck.mjs`)

- With `JsonReporter.prototype.onTestRunEnd` deleted, importing the reporter **throws**:
  `result-file-reporter: JsonReporter.prototype.onTestRunEnd is gone; re-read RISK-ABC143-01`.
- With `writeReport` deleted, it throws likewise.
- Intact, it loads.

## `ABC-143` `A1`–`A6`, read from the same head row files (never instead of a row)

- `A1`: the unhandled row exits 1, `success` is false, and `PLANT-timer` is in the file.
- `A2`: the hang row exits 124, `success` is false, and `startTime` is after the stamp.
- `A3`: the suite row names the file and the message.
- `A4`: the query names every red and prints nothing on green.
- `A5`: the green file reads 1741 passed, 0 failed, which equals the console's `1741 passed (1741)` from the gate run.
- `A6` is `ABC-143`'s own diff fences. It is not re-applicable to this diff as written. **`UNKNOWN - verify`: QE's
  reading.**

## Seen, not changed

- On 4.1, `vitest/reporters` prints `Importing from "vitest/reporters" is deprecated since Vitest 4.1. Please use
  "vitest/node" instead.` once per `npm test` (`node_modules/vitest/dist/reporters.js:26`).
- It is a fifth-surface drift of `RISK-ABC143-01`: the export is still present, and now deprecated. Ruling 5 does
  not name the specifier, so the import is left alone. The hand-off routes it.
- `RISK-ABC152-NEGWORKERS` was not re-run here.
