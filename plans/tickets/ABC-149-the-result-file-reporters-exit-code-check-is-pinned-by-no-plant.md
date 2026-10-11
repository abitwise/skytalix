---
id: ABC-149
title: "The result-file reporter's exit-code check is pinned by no plant, and its read query's `run` arm by no file. Write the regression plant set where a reporter change will meet it"
status: backlog
column: Backlog
size: XS
priority: P3
epic: —
feature: —
---

# ABC-149 — six plants, each with its exit code, its file fields and its query lines read by content, written into the reporter's header: ZERO code bytes, ZERO production lines, ZERO tests

> **Cut 2026-10-11 by BA/PM** (task `wave-2026-09-25`, subtask `bapm-fold-qe143-2026-10-11`, Workflow 07),
> from `ABC-143`'s QE gap register (`.grugops/context/qe-ABC-143/notes/…da133511`):
> - **`QE-143-a`** (LOW, owner BA/PM) is the reason for this ticket;
> - **`QE-143-b`** (LOW, owner BA/PM) is folded in, because it is the same plant set read one more way.
>
> No existing ticket fits. `ABC-144` (In Review) edits `vitest.config.ts`, not the reporter. `ABC-147` is a
> read-only probe. `ABC-056` decides an upgrade and performs none. Every reading below is QE's
> (`…e1e5acd5`, `…112f11df`), cited, not re-run. **This hop measured nothing.**

## Problem

*User*: the next hop that changes `tools/grugops/result-file-reporter.js`, the `test` script in
`package.json`, or the installed vitest. That hop has to show the kept result file still never reads
green after a red run.

*Pain*: two parts of `ABC-143`'s mechanism are pinned by no criterion, and the only record of how to
pin them is in a QE note.
- **The exit-code check (`QE-143-a`).** The reporter sets `success` true only when vitest's verdict is
  success, no unhandled error was recorded, **and** the exit code is 0. Every red in `ABC-143` `A1`–`A6`
  also fails vitest's verdict or carries an unhandled error, so the third check is never the one that
  decides. QE's mutants `M1` (`success` computed without the exit code) and `M9` (the final file
  written at report time, with no exit hook) **pass `A1`–`A6`** (`…112f11df`). Only QE's
  coverage-threshold red kills them: `npm test -- --coverage --coverage.thresholds.lines=100` exits 1
  with vitest's verdict green and no unhandled error. **That check is also what keeps a vitest 4.x
  bump from reopening the full `QE-142-a` lie** (`QE-143-c`, `RISK-ABC143-01`).
- **The query's `run` arm (`QE-143-b`).** `ABC-143` `A4` runs the read query on three red files and a
  green one, but not on the `A2` timeout marker. A query without its `run` arm passes `A4`, yet it
  prints **0 lines** on a timeout file, the same as on a green file. Without the `suite` arm or the
  `error` arm the query still prints a `run` line on every red file, so only a read **by content**
  catches those two mutants. A line count lets them through (`…112f11df`, § Query mutants).

No test can carry either guard. `NFR-008` R-1 pins the count at 0 test files, 0 tests and 0 spawns,
and nothing in the default lane runs `npm test` on itself. So the guard is a plant set: a written list
that a hop re-runs in a scratch copy.

*Value*: a hop that touches the reporter, the script or vitest re-runs one list and learns whether
the file still tells the truth. That includes the one red shape that only the exit code reports.

## Scope

- **A "REGRESSION PLANTS" block in the header comment of `tools/grugops/result-file-reporter.js`.**
  The header already holds the read query and the limits, and a hop that changes the reporter opens
  that file. Six rows, one per plant. Each row gives:
  - the plant, as a shape plus its exact form (which file it goes in is the hop's choice);
  - the expected `npm test` exit code;
  - the expected file fields (`success`, `runState`, `exitCode`, and the named text where there is one);
  - the expected query output **as line contents**, not as a count.
- **The six rows:**

  | row | plant | exit | file | query lines, by content |
  |---|---|---|---|---|
  | green | none | 0 | `success` true, `runState` `exited`, `exitCode` 0 | none |
  | unhandled | a test that throws from a `setTimeout` | 1 | `success` false, `exitCode` 1, `unhandledErrors[].message` = the thrown text | `error  <text>`, `run    exited exitCode=1` |
  | hang | after a green run, one test made non-terminating | 124 | `success` false, `runState` `started`, no `exitCode`, `startTime` later than a stamp taken just before the run | exactly `run    started exitCode=none, killed` |
  | suite | a `throw` in a `describe` body | 1 | `success` false, `numFailedTestSuites` 1, the file's `testResults` entry carries the message | `suite  <file>  <message>`, `run    exited exitCode=1` |
  | assertion | one assertion inverted (`ABC-142` `A1`'s shape) | 1 | `success` false, `numFailedTests` 1 | `test   <file>  <full title>`, `run    exited exitCode=1` |
  | **exit code only** | no plant; run `npm test -- --coverage --coverage.thresholds.lines=100` | 1 | `success` false, `exitCode` 1, **and** `numFailedTests` 0, `numFailedTestSuites` 0, `unhandledErrors` empty | exactly `run    exited exitCode=1` |

- **The block names its own triggers.** Re-run the set when a hop changes the reporter, the `test`
  script, or the installed `vitest` / `@vitest/*` version. It is not a per-diff gate.
- **Each row is earned by one run at the repair hop**, in a scratch copy outside the repository, and
  never copied from QE's notes. The values in the table above are QE's readings at `14cd1cf0`, and
  they are the expectation the hop checks against.
- A one-line pointer to the block in `ABC-143`'s page, under § Follow-ups.

## Out of scope

- **Any code byte of the reporter.** QE's 4.x-safe route (read unhandled errors from `onTestRunEnd`,
  and check at load that `writeReport` exists) belongs to the vitest-bump ticket under
  `RISK-ABC143-01`, not here.
- **An executable proof script** (in the style of `run-bounded.proof.js`). One run of the set is about
  six `npm test` runs. Wiring that into every gate spends the CPU the owner asked `ABC-144` to cut. If
  a trigger fires often enough to want automation, that is a new ticket.
- **A test, a spawn or a lane file.** The count pin stays 0 / 0 / 0.
- `package.json`, `vitest.config.ts`, `run-bounded.js`, `src/`, `AGENTS.md`.
- `QE-143-d` (a 124 names no hung test) and `QE-143-e` (two runs in one checkout overwrite each other).
  Both are accepted with triggers on `ABC-143`'s page (`AR-143-HANG`, `AR-143-OVERWRITE`). The hang
  row checks the marker, not the test's name.
- Any timing reading.

## Acceptance (Given/When/Then)

All plants are made in a **scratch copy outside the repository** (`ABC-142` test note 1). Every file
is read with `jq` or `node -e`, never by eye. Every query line is compared by content.

- **`A1` (the set is written where a reporter change meets it).** **Given** the head,
  **when** a reader opens `tools/grugops/result-file-reporter.js`, **then** its header holds a block
  headed `REGRESSION PLANTS` with **exactly six rows**: the six in § Scope. Each row starts with its
  label and a colon, and carries its exit code, its file fields, and its query lines.
  `grep -cE '^//\s+(green|unhandled|hang|suite|assertion|exit code only):' tools/grugops/result-file-reporter.js`
  prints **6**.
- **`A2` (each row is earned at head).** **Given** a scratch copy of the head, **when** each row is run
  once, **then** the exit code, the file fields and the query lines all match the block's row, and the
  delivery note records each reading. A row that does not match is a defect in the reporter or in the
  block, and it is reported, never smoothed.
- **`A3` (the exit-code row is red for the right reason).** **Given** the "exit code only" row's run,
  **then** the file reads `numFailedTests` 0, `numFailedTestSuites` 0, an empty `unhandledErrors` and
  `exitCode` 1, **and** the block says that the row proves the exit-code check **only while** all of
  that holds. *(If lines coverage ever reaches 100 %, the command exits 0 and the row has to be
  re-planted. The block says so.)*
- **`A4` (the set kills what `ABC-143` `A1`–`A6` let through).** **Given** three scratch copies of the
  head (`M1`, `M9` as defined in `…112f11df`, and the query with its `run` arm removed), **when** the
  set runs on each, **then** at least one row disagrees with the block for each:
  - `M1` and `M9`: the "exit code only" row reads `success` **true**;
  - the query without its `run` arm: the "hang" row prints **0** lines instead of the one `run` line.
  The unmutated head agrees on every row (the control).
- **`A5` (read by content, never by count).** The block states that a row passes on its line
  **contents**, and that a line count alone is not a pass. **Given** the query without its `suite`
  arm, **when** the "suite" row runs, **then** it prints a `run` line and no `suite` line, and the row
  reads as a disagreement. *(That is the mutant a line count passes.)*
- **`A6` (fences).**
  - The reporter's diff is comment-only: `git diff -U0 <base> -- tools/grugops/result-file-reporter.js
    | grep -E '^[+-][^+-]' | grep -vE '^[+-]\s*//'` prints nothing, and `node --check` on the file exits 0.
  - `git diff --name-only <base> -- src/ package.json package-lock.json vitest.config.ts
    tools/grugops/run-bounded.js AGENTS.md` prints nothing.
  - The lane's test file count, test count and skip count at head equal the base's.
  - The `ABC-143` page gains one pointer line and loses no byte above it.

## Dependencies

- **`ABC-143` — `Done`** (merged `7aaa99b9`). This ticket writes down its regression set.
- **`ABC-144` — no file overlap.** It edits `vitest.config.ts` (`ADR-0040`). If it merges first, the
  set runs under its worker cap, and nothing in the set depends on the worker count.
- **A vitest-bump ticket, when one is cut, depends on this one** (`RISK-ABC143-01`). See the promotion
  trigger.
- None blocking. Pullable today.

## Security / NFR triggers

- **`NFR-008` (R-1).** The count is the pin: **0 test files, 0 tests, 0 spawns added.** The default
  lane does not change. One run of the set is about six `npm test` runs in scratch copies, at the
  repair hop and at QE only. Their cost is reported, not bounded (`ADR-0035` decision 3).
- **Security:** no input surface, network or dependency added. Comments only.

## Test notes

1. **Plant in scratch copies, never in the worktree.** The "hang" row must start from a green file
   (`ABC-143` test note 2).
2. **Not under a no-other-hop window.** The set runs `npm test` six times. Never run it inside an
   `ABC-144` Window B or another measurement window, and grade no timing from it.
3. **`A4` is the criterion that makes the set worth having.** Show each mutant agreeing with
   `ABC-143` `A1`–`A6` (QE did: `…112f11df`) and disagreeing with this set. The control row is the
   unmutated head.
4. **Mandatory gates:** lint, typecheck, build, `npm test`. A QE hop is owed. With zero production
   `src/` lines and a comment-only reporter diff, the UAT waiver is expected. It is measured at the
   exit, never asserted here.

## Size and priority

**`XS`:** one comment block, six scratch runs, three mutant copies.
- **Not `S`:** no code, no script, no new file.

**`P3`:**
- **Not `P2`:** `QE-143-a` and `-b` are LOW. The file is honest today on every red shape QE planted,
  including the coverage red, because the head carries the exit-code check. The gap is that nothing
  stops a later change from removing it.
- **Promotion trigger: `P2`, and merge first,** when a ticket that changes the reporter, the `test`
  script, or the vitest / `@vitest/*` major version is cut or pulled (`RISK-ABC143-01`, `ABC-056`'s
  coverage-v8 question).

## Definition of Ready

BA/PM, 2026-10-11. **Result: 10 of 10.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** two named mutants pass `A1`–`A6`; a query mutant passes `A4`; QE's readings cited |
| 2 | scope and out-of-scope clear | **✅** one comment block of six rows and one page pointer; code, a proof script, tests, the script, the config and `AGENTS.md` fenced out |
| 3 | INVEST-shaped | **✅** independent of every open ticket; small; testable by planted reds and mutants |
| 4 | acceptance testable and measurable | **✅** six rows with exit codes and fields; `grep -c` = 1 per row; three mutants each disagreeing on a named row; comment-only diff by command; equal counts |
| 5 | dependencies known | **✅** `ABC-143` `Done`; `ABC-144` no overlap; a future vitest-bump ticket depends on this one |
| 6 | security/NFR triggers with a measurable target | **✅** count pin 0 / 0 / 0; no surface added |
| 7 | test notes present | **✅** four |
| 8 | size assigned | **✅** `XS` |
| 9 | priority assigned | **✅** `P3`, both directions argued, promotion trigger named |
| 10 | no major unresolved blocker | **✅** none; the coverage red and all three mutants are already defined and run by QE |

Column moves are the Orchestrator's.

## Delivery

**2026-10-11, Software Engineer** (task `wave-2026-09-25`, subtask `ticket-to-pr-ABC-149`). Branch
`grugops/ABC-149-reporter-plants`, code `e3e9c126`, base `4973d8e0`. Not merged.

- **Built.** The REGRESSION PLANTS block in `tools/grugops/result-file-reporter.js`, comments only, and
  one pointer line on the `ABC-143` page.
- **`A1`–`A6`: met on the SE's reading.** All six rows agree at head. `M1`, `M9` and the query without
  its `run` arm each disagree on the named row. The query without its `suite` arm disagrees on the
  suite row by content. The fences hold, and the counts equal the base's (56 / 1740 / 0).
- **One reading to keep.** One inverted assertion reads `numFailedTestSuites` 2, so the assertion row
  names no suite count (`…a1eff3dc`).
- Readings, mutants and gates are in `.grugops/context/ticket-to-pr-ABC-149/notes/`. QE is owed.

## QE

**2026-10-11, QE/E2E** (subtask `qe-ABC-149`).
- Range: base `4973d8e0`, code `e3e9c126`, reviewed tip `9a309fb4`.
- Every reading is QE's own, with plants in other files than the SE's and the block's commands cut
  from the header by program. The detail is in `.grugops/context/qe-ABC-149/notes/`: `…1835132a`
  (verdict), `…1d736a15` (readings), `…918a2941` (mutants), `…179b8018` (gaps). It is not restated
  here.

**PASS_WITH_GAPS.**
- **`A1`–`A6` are MET.**
  - All six rows agree at the tip.
  - `M1` and `M9` read `success` true on the exit-code-only row. Each still meets `ABC-143`
    `A1`–`A5`.
  - Without its `run` arm, the query prints 0 lines on the hang row. Without its `suite` arm, it
    disagrees by content on the suite row.
  - The fences and counts hold (56 / 1740 / 0).
  - The gates are green.
- **Gaps:**
  - `QE-149-a` LOW: READ IT, pasted with its line breaks, exits 126 and prints nothing. Joined into
    one line it is correct. The fix is comment-only.
  - `QE-149-b` INFO: the SE's suite count is resolved. It is 1 for the file plus 1 per enclosing
    `describe`.
  - `QE-149-c` INFO: QE's `M9b` mutant is killed only by the exit-code-only row. It goes to
    `ABC-152` `V2`.
- UAT waiver: the production filter is empty, so on QE's reading the waiver applies. The Orchestrator
  applies it at the exit.
