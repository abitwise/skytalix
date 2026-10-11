---
id: 20261011T212237Z-qe-e2e-observation-abc152-v2-reporter-rows-0d5f42fb
kind: observation
by: qe-e2e
at: 2026-10-11T21:22:37Z
verified_by:
confidence: high
refs:
  - ABC-152
  - ABC-149
  - ABC-143
  - ABC-142
  - RISK-ABC143-01
  - RISK-ABC152-NEGWORKERS
  - QE-149-a
  - QE-149-c
  - QE-152-a
  - QE-152-b
  - QE-152-c
  - tools/grugops/result-file-reporter.js
  - .grugops/context/qe-ABC-152/probe/v2rows.mjs
  - .grugops/context/qe-ABC-152/probe/v2/
  - 20261011T203648Z-software-engineer-observation-abc152-v2-reporter-rows-7d490dfe
  - 20261011T164844Z-qe-e2e-observation-abc149-mutants-918a2941
supersedes:
---

# QE `ABC-152` `V2`: all six rows AGREE by content at head on QE's own plants; `M9b` is killed by the exit-code-only row alone; the `onFinished` route fails the unhandled row. One `ABC-143` `A5` sub-clause is not met (a console line), and `RISK-ABC152-NEGWORKERS` is confirmed and wider

This note is hand-authored and unsealed. **No timing was read.**

## Method (`probe/v2rows.mjs`)

- **Copies.** Each row runs on a fresh `git archive a99e9845` copy outside the repository. `node_modules` is an
  APFS clone of QE's worktree's own `npm ci` (4.1.11), not a symlink. Each copy was deleted after its row.
- **The commands are cut from the committed header by program, never retyped** (`probe/v2/cut-commands.txt`):
  - the **READ IT query is cut WITH its line breaks** (the `//` prefixes stripped) and run under `bash` as pasted.
    That is `QE-149-a`'s case;
  - the stamp is `node -p 'Date.now()'`;
  - the exit-code-only command is `npm test -- --coverage --coverage.thresholds.lines=100`;
  - the unhandled plant is the block's own new `e.g.`, verbatim (the awaited form).
- **QE's plant files differ from the SE's and from `QE-149`'s** (both used `san`, `zobrist`, `history` and
  `gameend`):

| row | file | plant |
|---|---|---|
| unhandled | `src/apply.test.ts`, appended | the block's `e.g.`, verbatim |
| suite | `src/fen.test.ts`, first line of `describe("FEN round-trip")` | `throw new Error("PLANT-suite")` |
| assertion | `src/legal.test.ts:101` | `isInCheck(start)` `toBe(false)` → `toBe(true)` |
| hang | `src/moves.test.ts`, appended after the green run and the stamp | `it("QE152 hang", () => { while (true) {} })` |

- **Grading:** the exit code, the row's file fields, and the query's lines, compared as sets **by content**.

## Head `a99e9845`: every row AGREES (`probe/v2/v2-head.json`)

| row | exit | file | query lines (by content) |
|---|---|---|---|
| green | 0 | `success` true, `exited`, `exitCode` 0; 56 files, 1741 passed, 0 pending, 0 todo | none |
| unhandled | 1 | `success` false, `exitCode` 1, `unhandledErrors` [`PLANT-timer`]; 1742 passed, 0 failed | `error  PLANT-timer`, `run    exited exitCode=1` |
| suite | 1 | `success` false, `numFailedTestSuites` 1; the `fen.test.ts` entry carries `PLANT-suite` | `suite  …/src/fen.test.ts  PLANT-suite`, `run    exited exitCode=1` |
| assertion | 1 | `success` false, `numFailedTests` 1 | `test   …/src/legal.test.ts  isInCheck is false in the starting position`, `run    exited exitCode=1` |
| exit code only | 1 | `success` false, `exitCode` 1, failed 0, failed suites 0, `unhandledErrors` [] | exactly `run    exited exitCode=1` |
| hang | 124 | `success` false, `runState` started, no `exitCode`, `startTime` after the stamp | exactly `run    started exitCode=none, killed` |

- **`QE-149-a` is closed.** Pasted with its line breaks, the joined READ IT query printed every row's lines.
- **Exit-code-only precondition:** the console read `Coverage for lines (99.43%) does not meet global threshold
  (100%)`. On 3.2.7 it read 38.48% (`QE-149`). **The margin is now 0.57 points** (`QE-152-c`).

## Reporter mutants (QE's copies; only the reporter differs)

| mutant | green | unhandled | suite | assertion | **exit code only** | hang |
|---|---|---|---|---|---|---|
| `M9b` (`QE-149-c`): exit hook deleted; `runState` / `exitCode` written at report time from `process.exitCode` | agree | agree | agree | agree | **DISAGREE**: exit 1, but the file reads `success` **true**, `exitCode` **0**, and the query prints **0** lines | agree |
| `onFinished`: the 3.x route on 4.1 (`onTestRunEnd` replaced by `onFinished`) | agree | **DISAGREE**: exit 1, `unhandledErrors` [], and the query prints only the `run` line | — | — | — | — |

- **`M9b` is killed by the exit-code-only row alone**, as `QE-149-c` and ruling 5 require.
- **The load-time check, QE's own probe.** QE deleted the hook from `JsonReporter.prototype` (via `vitest/node`, the
  same class) and then imported the reporter:
  - with `onTestRunEnd` deleted, the import throws `JsonReporter.prototype.onTestRunEnd is gone; re-read
    RISK-ABC143-01`;
  - with `writeReport` deleted, it throws likewise;
  - intact, it loads.
- **The route change is what makes the unhandled row pass on 4.1.** That matches the SE's control (`…7d490dfe`),
  on different plant files.

## `ABC-143` `A1`–`A6`, read from the same head row files (in addition to the rows, never instead of one)

- **`A1`:** the unhandled row exits 1, `success` is not true, and `PLANT-timer` is in the file.
- **`A2`:** the hang row exits 124, the file reads not-success, and `startTime` is after the stamp.
- **`A3`:** the suite row names `fen.test.ts` and the message.
- **`A4`:** the query names every red and prints 0 lines on green.
- **`A5`:**
  - counts hold (1741 = the console's `1741 passed (1741)`);
  - `git status --porcelain` is empty after the worktree's `npm test`.
  - **The "console gains no line" clause is NOT met.** Every `npm test` on 4.1 prints `Importing from
    "vitest/reporters" is deprecated since Vitest 4.1. Please use "vitest/node" instead.` The reporter's import
    specifier triggers it (`node_modules/vitest/dist/reporters.js:26`, a `console.warn` at module load).
  - **Fix shape, proven on a scratch copy and not applied:** `vitest/node` exports the **same** `JsonReporter`
    class (`===` true, both hooks are functions). With `import { JsonReporter } from "vitest/node"`, `npm test`
    exits 0 with 56 / 1741, the green file is unchanged, and the line count is **0**. See `QE-152-a`.
- **`A6`** fences `ABC-143`'s own diff. This ticket changes `vitest.config.ts` and `package.json` by design, so
  those two bullets do not transfer. The parts that do transfer hold:
  - 0 production `src/` lines;
  - the `ABC-042` `A10` pin is green, with `scripts.test` byte-unchanged;
  - the skip capture returns `0`;
  - counts are base + 1, which `V3` declares.

## `RISK-ABC152-NEGWORKERS`, re-run by QE: confirmed, and it is a class

- **The narrow run** (`VITEST_MAX_WORKERS=-1 vitest run src/cli.test.ts -t …`): exit **0**, no test ran, and
  vitest's own JSON reporter wrote **no file at all**.
- **`VITEST_MAX_WORKERS=-1 npm test`, the full lane:**
  - exit **0**;
  - the console shows only `RUN v4.1.11 …`;
  - the result file reads `success` **false**, `runState` exited, `exitCode` **0**, `testResults` 0, with null
    counts;
  - READ IT prints `run    exited exitCode=0`.
  - So the file stays truthful, and only an exit-code-only reader is fooled.
- **`-2` behaves the same** (exit 0, nothing run). **Any negative value does, not just −1.**
- The resolver reads `maxWorkers: -1` and `effectiveWorkers: -1`. The pin cannot see it, because nothing runs.
- **QE keeps the residual** (`QE-152-b`), so the ticket's test note 6 applies: the Scribe's `AGENTS.md` line.
