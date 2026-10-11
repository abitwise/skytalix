---
id: ABC-143
title: A red `npm test` can leave a result file that reads green — an unhandled error (exit 1) and a timeout (exit 124) both do
status: backlog
column: Backlog
size: S
priority: P2
epic: —
feature: —
---

# ABC-143 — after any non-zero `npm test` exit, the kept result file never reads green, and the documented query names every red it records

> **Cut 2026-10-11 by BA/PM** (task `wave-2026-09-25`, subtask `bapm-batch-2026-10-11`, Workflow 07),
> from `ABC-142`'s QE gap register (`.grugops/context/qe-ABC-142/notes/…68f78a28`):
> - **`QE-142-a`** (MEDIUM) is the reason for this ticket;
> - **`QE-142-c`** (LOW) is folded in, because it is the same lie in the same file and would edit the
>   same pinned script line;
> - **`QE-142-b`** (LOW) is folded in as `A4`, the read query.
>
> Every reading below is QE's (`…298ed173`), cited, not re-run. This hop measured nothing.

## Problem

*User*: every hop that reads `.test-results/last-run.json` to name a red `npm test` run. That
reader is the one `ABC-142` created and sent to the file: Software Engineer, QE/E2E, Security/NFR,
and the next reader who has to tell a flake from a regression.

*Pain*: **the file can read `success: true` after a run that exited red.** QE planted three red
shapes at `ABC-142`'s tip:
- **Unhandled error (`QE-142-a`).** A test that throws from a `setTimeout`. `npm test` exits **1**,
  and the console shows `Errors 1 error` with all 1681 tests passed. **The file reads
  `success: true`, failed 0, and has no trace of the error text** (`grep -c` 0). Vitest's JSON reporter
  does not record unhandled errors. A timer-driven throw is a plausible flake shape under load.
- **Timeout (`QE-142-c`).** A non-terminating test. `run-bounded.js` exits **124** and SIGKILLs the
  tree before the reporter writes. **The previous run's file stays, unchanged `startTime`, reading
  `success: true`.** The console's last line names the timeout, so a `tail` shows it. A reader of the
  file alone is misled.
- **Suite-level red (`QE-142-b`).** A `throw` in a `describe` body. The file is honest
  (`numFailedTestSuites` 1, and `testResults[].status == "failed"` carries the file and message).
  **But the read query documented on `ABC-142` prints nothing for it**, because it reads only
  `assertionResults`.

**A file that reads green after a red exit is worse than no file.** It answers the question
`ABC-142` sent the reader to it for, and it answers wrong.

*Value*: `ABC-142`'s promise, *"the next sighting is named"*, holds for every red shape `npm test`
can exit with, not only for an assertion failure.

## Scope

- After **any** `npm test` exit other than 0, the file at `.test-results/last-run.json` (the path
  is unchanged):
  - **never reads `success: true`**. It reads a not-success state, or it is absent;
  - **names what the run recorded**: failed tests (file and full title), failed suites (file and
    message), and **unhandled errors (message text)**.
- **The documented read query** prints one line per recorded red of all three kinds.
- **The mechanism is the engineer's.** It must stay inside `ABC-142`'s fences:
  - `package.json`'s `test` script, plus a reporter module **outside `src/`** if one is needed
    (for example under `tools/grugops/`);
  - the `ABC-042` A10 pinned literal at `src/cli.test.ts:1667`, if the script string changes;
  - the `run-bounded.js:10` header comment that quotes it.
- **Feasibility, read and not run.** The installed vitest is 3.2.7. Its reporter type declares
  `onTestRunEnd(testModules, unhandledErrors, reason)` (`node_modules/vitest/dist/chunks/reporters.d.*.d.ts`).
  So the unhandled errors reach a reporter. Whether a built-in reporter writes them is
  `UNKNOWN - verify` (the JSON one does not, per QE).

## Out of scope

- **`vitest.config.ts`.** As on `ABC-142`, a config-level reporter would also run in every direct
  `npx vitest run`, including the `*_DEEP` lanes. **`ABC-144` may edit that file for workers**, and
  this ticket stays out of it.
- **`run-bounded.js`'s code and its exit contract** (own code / 124 / 128+n / 2). It may not learn
  about vitest's file. **A wrapper that deletes a runner's output** is the same "generic wrapper
  rewriting its own argv" route that `ABC-142` refused.
- Any production line under `src/`.
- Finding, retrying or quarantining any flaky test. **No retry flag.**
- `AGENTS.md`. A pointer to the query is the Scribe's call (967 B of headroom at `506550f3`).
- Concurrency: two `npm test` runs in one checkout still overwrite each other's file (`ABC-142`
  § Dependencies). That is unchanged and named.

## Acceptance (Given/When/Then)

All plants are made in a **scratch copy outside the repository** (`ABC-142` test note 1). Each
criterion reads the file with `jq` or `node -e`, never by eye.

- **`A1` (an unhandled error is not green).** **Given** a scratch copy with one test that throws
  from a `setTimeout` (QE's plant), **when** `npm test` runs, **then** it exits **1**, **and** the
  file does not read `success: true`, **and** the file contains the thrown error's message text
  (a count of it in the file is **≥ 1**).
- **`A2` (a timeout leaves no green file behind).** **Given** a scratch copy where a green
  `npm test` has just written the file, and one test is then made non-terminating, **when**
  `npm test` runs and exits **124**, **then** the file at the path is **absent or reads a
  not-success state**. It must never read `success: true` with the earlier run's `startTime`.
  *(If the mechanism writes a "started" marker, the marker carries the new run's start time.)*
- **`A3` (a suite-level red stays named).** **Given** a scratch copy with a `throw` in a `describe`
  body, **when** `npm test` runs, **then** it exits **1**, and the file names that test file and the
  thrown message. *(It does today; this keeps it true through the mechanism change.)*
- **`A4` (the documented query prints every red — `QE-142-b`).** **Given** the files from `A1`,
  `A3` and `ABC-142` `A1`'s inverted-assertion plant, **when** the query in this ticket's
  § Delivery runs on each, **then** each prints **≥ 1** line naming the red:
  - for a test failure: the file and the full title;
  - for a suite failure: the file and the message;
  - for an unhandled error: the message.
  On a green file it prints **0** lines. The `ABC-142` page carries a pointer to the new query.
- **`A5` (a green run is unchanged).** **Given** the unmodified tree, **when** `npm test` runs,
  **then** it exits 0, the file reads `success: true` and failed 0, passed and total equal the
  console's summary counts (`ABC-142` `A3`), and `git status --porcelain` is empty afterwards
  (`ABC-142` `A4`).
  - **The console gains no line** beyond `ABC-142`'s accepted `JSON report written to …` line. If
    the mechanism removes that line, that is allowed and is stated in the delivery note.
- **`A6` (fences).**
  - **Zero production `src/` lines.** `git diff --name-only -- src/ | grep -v '\.test\.ts$'` is
    empty.
  - `git diff --numstat -- src/` is empty, or one row `1 1 src/cli.test.ts` (the `SCRIPTS_AT_HEAD.test`
    literal).
  - `vitest.config.ts` is unchanged.
  - `run-bounded.js`'s code is byte-unchanged; only its line-10 quote may change.
  - The `ABC-042` A10 pin still equals the `test` script **byte for byte**, still asserted with
    `toBe`. Appending one character to the script on a scratch copy turns `A10` red (`ABC-142`
    `A6`'s check).
  - **The lane's test file count and test count equal the base's**, and the skip count is 0. The
    AGENTS.md skip-count capture still returns an integer.

## Dependencies

- **`ABC-142` — `Done`** (merged `addbc328`). This ticket amends its mechanism.
- **`ABC-144` — named overlap, merge order only.** If the Architect puts `ABC-144`'s worker settings
  in the `test` script rather than in `vitest.config.ts`, both tickets edit the same byte-pinned
  line (`src/cli.test.ts:1667`) and the `run-bounded.js:10` quote. The second to merge rebases the
  pin. There is no design conflict.
- None blocking. Pullable today.

## Security / NFR triggers

- **`NFR-008` (R-1, wall ≤ 10 s at load1 ≤ 8; CPU reported).** **The count is the pin**
  (`ADR-0035` decision 3): **0 test files, 0 tests, 0 spawns added.** No timing bound is written. A
  reporter runs in the main process, and its cost is reported, not bounded.
- **Security:** the file holds test titles, paths and error messages from this repo only. It is
  git-ignored. An error message may carry an absolute path, the same class `QE-142-e` already
  accepted (276 tracked files carry it). No network, no input surface, no dependency added.

## Test notes

1. **Plant every red in a scratch copy, never in the worktree.** Each criterion's plant is QE's,
   named in `…298ed173`.
2. **`A2` must start from a green file.** A timeout on a tree with no file proves nothing about a
   stale one.
3. **Show `A1` and `A2` going green → red.** Show each on the base first (the file reads green, the
   defect) and then on the head (the file does not), with the same plant.
4. **Mandatory gates:** lint, typecheck, build, `npm test`. The QE hop is owed. With zero production
   `src/` lines the UAT waiver is expected; it is measured at the exit, never asserted here.

## Size and priority

**`S`:** a reporter-level change (likely a small reporter module, `UNKNOWN - verify` until the
engineer reads the API), the script line and its pin, and five plant runs.
- **Not `XS`:** `ABC-142` added a built-in reporter with flags only. This one probably needs code that
  reads unhandled errors and handles a killed run.
- **Not `M`:** no harness, no production code, no new test file.

**`P2`:**
- **Not `P3`:** `QE-142-a` is MEDIUM. The file lies on the blocking gate, and a timer-driven throw is
  a plausible flake shape under the load this machine runs at.
- **Not `P1`:** nothing is blocked, the console still names both reds above the truncation point,
  and no player sees anything.
- **Promotion trigger:** a red `npm test` sighting where the file read green.

## Definition of Ready

BA/PM, 2026-10-11. **Result: 10 of 10.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** three QE plants, each with its exit code and what the file said |
| 2 | scope and out-of-scope clear | **✅** one file and one query; `vitest.config.ts`, `run-bounded.js` code, production `src/`, retry and `AGENTS.md` fenced out |
| 3 | INVEST-shaped | **✅** independent of every open ticket; small; testable by planted reds |
| 4 | acceptance testable and measurable | **✅** exit 1 / 124 / 0, `success` never `true` after a red, error text count ≥ 1, query lines ≥ 1 / 0, `numstat`, a byte-exact pin, equal counts |
| 5 | dependencies known | **✅** `ABC-142` `Done`; `ABC-144` overlap on the pinned line named as merge order |
| 6 | security/NFR triggers with a measurable target | **✅** count pin 0 / 0 / 0; git-ignored; path class already accepted |
| 7 | test notes present | **✅** four |
| 8 | size assigned | **✅** `S` |
| 9 | priority assigned | **✅** `P2`, both directions argued, promotion trigger named |
| 10 | no major unresolved blocker | **✅** none; feasibility read from the installed reporter API |

Column moves are the Orchestrator's.

## Delivery

Software Engineer, 2026-10-11 (subtask `ticket-to-pr-ABC-143`). Branch
`grugops/ABC-143-result-file-reads-red`, code commit `f97ad60b`, base `117c1c8e`. The readings are in
`.grugops/context/ticket-to-pr-ABC-143/notes/`. QE is owed.

- **Mechanism.** `tools/grugops/result-file-reporter.js` subclasses vitest's own `JsonReporter`
  (`vitest/reporters`, 3.2.7). The `test` script swaps `--reporter=json` for
  `--reporter=./tools/grugops/result-file-reporter.js`. The path and `--outputFile.json` are
  unchanged. It makes three changes:
  - **At start** (`onInit`), it overwrites the file with a marker: `success: false`,
    `runState: "started"`, and this run's `startTime`. A run killed by the 124 bound leaves the
    marker (`QE-142-c`).
  - **It keeps the unhandled errors** that vitest passes to `onFinished`, and the built-in reporter
    drops. They go in `unhandledErrors[]` (`name`, `message`, `stack`). Any one of them sets
    `success: false` (`QE-142-a`).
  - **It writes the final file on process exit**, with `runState: "exited"` and the real
    `exitCode`. `success` is `true` only when vitest's own verdict was success, there was no
    unhandled error, and the exit code is 0.
- **Read it** (this replaces both `ABC-142` queries; one line per recorded red, 0 lines on a green
  file):

  ```sh
  jq -r '(.testResults[] | .name as $f | (.assertionResults[] | select(.status=="failed") | "test   \($f)  \(.fullName)"), (select(.status=="failed" and .message!="") | "suite  \(.name)  \(.message)")), (.unhandledErrors[]? | "error  \(.message)"), (select(.success!=true) | "run    \(.runState) exitCode=\(.exitCode // "none, killed")")' .test-results/last-run.json
  ```

  Every red file also prints one `run` line. `run    started exitCode=none, killed` means the run never
  reached exit, which is the timeout case.
- **Console delta.** No line is added. Vitest's `JSON report written to <path>` line, which `ABC-142`
  added, is gone because the file is written at exit and not by the built-in reporter. Apart from
  timings, the green console now matches the pre-`ABC-142` console, except for npm's echo of the
  script.
- **Diff.** `package.json` (the `test` script), `src/cli.test.ts` (the `SCRIPTS_AT_HEAD.test`
  literal, `1 1`), `tools/grugops/run-bounded.js` (line 10 only), and
  `tools/grugops/result-file-reporter.js` (new, outside `src/`). It has 0 production `src/` lines.
  `vitest.config.ts` is untouched.
- **Limits.**
  - A run that never reaches exit (SIGKILL, or a signal vitest does not handle) leaves the marker.
    It reads not-success but names no test. The console's last line names the timeout.
  - Two runs in one checkout still overwrite each other's file.
  - Direct `npx vitest run` (the `*_DEEP` lanes) writes no file, as before.
- **Readings.** All were run on 2026-10-11 on macOS with Node v26.11.0 and vitest 3.2.7, with the
  plants in copies outside the repository.

  | criterion | base `117c1c8e` | head `f97ad60b` |
  |---|---|---|
  | `A1` setTimeout throw | exit 1, `success` true, error text count 0 | exit 1, `success` false, `exitCode` 1, `unhandledErrors` = [`PLANT-143-UNHANDLED-boom`], text count 2 |
  | `A2` green, then `while (true) {}` | green exit 0, then 124; file `success` true, `startTime` unchanged | green exit 0, then 124; file `success` false, `runState` `started`, new `startTime` (later than a stamp taken just before the run) |
  | `A3` `throw` in a `describe` body (`src/san.test.ts`) | (not re-run; QE's `…298ed173`) | exit 1, `numFailedTestSuites` 1, query names `src/san.test.ts  PLANT-143-SUITE-boom` |
  | `A4` query | — | `A1` 2 lines (`error`, `run`); `A3` 2 lines (`suite`, `run`); `ABC-142`-`A1` inverted `src/fen.test.ts:54`, 2 lines (`test … FEN field parsing parses the side to move`, `run`); `A2` marker, 1 line; green, 0 lines |
  | `A5` green | 53 / 1680 | exit 0, `success` true, failed 0, 1680 / 1680 = console, 53 files; porcelain empty; no `JSON report` line |
  | `A6` fences | — | production `src/` filter is empty; `numstat` `1 1 src/cli.test.ts`; `vitest.config.ts` unchanged; `run-bounded.js` one hunk `@@ -10 +10 @@`; `X` appended to the script gives `A10` red (`1 failed \| 66 passed (67)`); skip-count `0`; 53 / 1680 as at base |

- **Gates** (worktree, at the commit). lint 0 (103 files), typecheck 0, build 0, `npm test` 0
  (53 / 1680). `test-skip-integrity.js --skip-count 0` printed `No findings.` `lane-inventory.js`
  read 53 / 53, `No findings.` `run-bounded.proof.js` held all rows.
- **Cost** (`ADR-0035` d3; the count is the pin). 0 test files, 0 tests and 0 spawns were added.
  The reporter runs in vitest's main process and does one extra small write at start. Green
  `Duration` was 6.02 to 6.07 s at load1 5 to 7 on a loaded machine. This is not graded.
- **UAT.** A waiver is expected (0 production `src/` lines). It is measured at exit.

## QE

**2026-10-11, QE/E2E** (subtask `qe-ABC-143`).
- Range: base `117c1c8e`, code `f97ad60b`, reviewed tip `14cd1cf0`.
- Every reading is QE's own, with plants in other files than the SE's. The detail is in
  `.grugops/context/qe-ABC-143/notes/`: `…efb34d57` (verdict), `…e1e5acd5` (readings), `…112f11df`
  (mutants), `…4f652dad` (vitest coupling), `…da133511` (gaps and the two rulings). It is not
  restated here.

**PASS_WITH_GAPS.**
- `A1`: base exit 1 reads `success` true with text count 0. Head exit 1 reads `success` false, and
  `unhandledErrors` names `QE143-UNHANDLED-timer-boom`.
- `A2`: base 124 leaves the green run's `startTime` reading `success` true. Head 124 leaves the
  `started` marker, `success` false, with a `startTime` later than a pre-run stamp.
- `A3`: exit 1. The file names `src/moves.test.ts` and `QE143-SUITE-describe-boom`.
- `A4`: the page's query, run verbatim, names each red by content. The `ABC-142` page points to it.
  - `A1`: an `error` line and a `run` line.
  - `A3`: a `suite` line and a `run` line.
  - `ABC-142` `A1`: a `test` line and a `run` line.
  - Green: 0 lines.
- `A5`: exit 0, 1680 / 1680, 53 files, porcelain empty. The console has no added line; only the
  `JSON report written` line is gone.
- `A6`: all fences hold. Appending `X` to the script turns `A10` red (`1 failed | 66 passed`).
  Counts are 53 / 1680 / 0, the same as base.
- **Mutants:**
  - The start marker dropped, unhandled errors dropped and the exit hook dropped are each killed
    by `A1`–`A6`.
  - **`success` without the exit code survives `A1`–`A6`.** Only QE's coverage-threshold red kills
    it. The head holds that red.
- **Gaps:** 3 LOW and 3 INFO, none blocking:
  - `QE-143-a`: the exit-code conjunct is pinned by no criterion.
  - `QE-143-b`: `A4` omits the `A2` marker, so the query's `run` arm is unpinned.
  - `QE-143-c`: vitest 4.x silently drops unhandled errors, and 5.x drops both `vitest/reporters`
    and `writeReport`. Only `^3.0.0` and the lockfile hold it.
- **Rulings on the SE's limits:**
  - The killed-run marker that names no test is not an acceptance gap (`QE-143-d`, INFO).
  - Two runs in one checkout is fenced out and unchanged (`QE-143-e`, INFO).
- **UAT waiver applies** on QE's reading (0 production `src/` lines). QE recommends the `In Review`
  exit. Not merged, not pushed.
