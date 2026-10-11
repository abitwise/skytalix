---
id: 20261011T164844Z-qe-e2e-observation-abc149-readings-1d736a15
kind: observation
by: qe-e2e
at: 2026-10-11T16:48:44Z
verified_by:
confidence: high
refs:
  - ABC-149
  - ABC-143
  - ABC-142
  - NFR-008
  - QE-143-a
  - QE-143-b
  - tools/grugops/result-file-reporter.js
  - 20261011T163050Z-software-engineer-observation-abc149-readings-bd52fa01
  - 20261011T163050Z-software-engineer-observation-abc149-gates-43ac7ab4
  - 20261011T163050Z-software-engineer-observation-abc149-suite-count-a1eff3dc
supersedes:
---

# QE `ABC-149`: the six rows re-earned at tip `9a309fb4` with QE's own plants; every row AGREES; gates and fences

This note is hand-authored and unsealed. AGENTS.md says no `finding` is admissible on this install.
QE ran every reading itself on 2026-10-11, on macOS with Node v26.11.0 and vitest 3.2.7. load1 was
about 5 to 25, with QE `ABC-151` and Architect `ABC-152` running at the same time. **No timing is
read or graded.**

## Method

- **Copies.** `git archive 9a309fb4` (the tip; `e3e9c126..9a309fb4` changes no code) and
  `git archive 4973d8e0` (base). Each was untarred into the session scratchpad, outside the
  repository, with `node_modules` linked. QE's grader and plant scripts sat in a separate
  directory. Nothing was planted in a worktree.
- **The block's commands, cut from the committed header by program, not retyped.** The READ IT query
  is header lines 24-28 with the `//` prefixes stripped, joined into one line. The hang stamp is
  the backticked text after "take a stamp (". The exit-code-only command is the backticked text
  after "run ". Each ran under `bash` exactly as cut: `node -p 'Date.now()'` printed a number (the
  SE's quoting fix holds), and `npm test -- --coverage --coverage.thresholds.lines=100` ran.
- **Grading.** A `node` grader checked each row's exit code and the row's named fields. It compared
  the query's lines as sorted arrays, **by content**, never by count.
- **Plants: different files from the SE's** (the SE used `legal`, `moves` and `fen`):

| row | file | plant |
|---|---|---|
| hang | `src/san.test.ts`, appended after the green run and the stamp | `it("QE149 hang", () => { while (true) {} })` |
| unhandled | `src/zobrist.test.ts`, appended | `it(…, () => { setTimeout(() => { throw new Error("QE149-PLANT-timer"); }, 0); })` |
| suite | `src/history.test.ts`, first line of the `describe("ABC-012 acceptance")` body | `throw new Error("QE149-PLANT-suite")` |
| assertion | `src/gameend.test.ts:280` | `toBe(false)` → `toBe(true)` |

## `A2` / `A3`: the unmodified tip, every row AGREES

| row | exit | file | query lines (by content) |
|---|---|---|---|
| green | 0 | `success` true, `runState` exited, `exitCode` 0; 56 files, 1740 tests, 0 pending, 0 todo | none |
| hang | 124 | `success` false, `runState` started, `exitCode` absent, 0 `testResults`; `startTime` 1791736576848 > stamp 1791736576133 | `run    started exitCode=none, killed` |
| unhandled | 1 | `success` false, `exitCode` 1, `unhandledErrors` [`QE149-PLANT-timer`] (1741 passed, 0 failed) | `error  QE149-PLANT-timer`, `run    exited exitCode=1` |
| suite | 1 | `success` false, `numFailedTestSuites` 1; the `…/src/history.test.ts` entry message is `QE149-PLANT-suite` | `suite  …/src/history.test.ts  QE149-PLANT-suite`, `run    exited exitCode=1` |
| assertion | 1 | `success` false, `numFailedTests` 1 (`numFailedTestSuites` 2) | `test   …/src/gameend.test.ts  the claimable set omits the claimable property entirely rather than carrying an empty one`, `run    exited exitCode=1` |
| exit code only | 1 | `success` false, `exitCode` 1, `numFailedTests` 0, `numFailedTestSuites` 0, `unhandledErrors` [] | `run    exited exitCode=1` |

- **`A3`.** On the exit-code-only run the console read `56 passed (56)`, `1740 passed (1740)` and
  `ERROR: Coverage for lines (38.48%) does not meet global threshold (100%)`. All four precondition
  fields hold, so the row is red on the exit code alone. The block states the precondition and the
  re-plant rule at lines 63-66.
- **The block's own unhandled example, verbatim.** QE cut the `e.g.` text from header lines 46-47
  (`it("p", () => { setTimeout(() => { throw new Error("PLANT-timer"); }, 0); })`) and appended it
  to `src/zobrist.test.ts`. Result: exit 1, `success` false, `exitCode` 1, `unhandledErrors`
  [`PLANT-timer`]. The query printed exactly `error  PLANT-timer` and `run    exited exitCode=1`,
  word for word as the row says.
- **The suite row holds wherever the hop plants it.** A throw in a NESTED `describe` body (QE's
  `describe("QE149 outer")` › `describe("QE149 inner")`, with a passing sibling test) also read
  `numFailedTestSuites` 1 and `numFailedTests` 0. The `zobrist` entry message was
  `QE149-PLANT-nested-suite`, and the query printed the `suite` line and the `run` line. A
  collection error fails the whole file.
- **The ABC-143 view, same files.** `A1`–`A5`'s file readings hold at the tip (`…918a2941` has the
  per-mutant table).

## `A1` and `A6` (worktree `wt-qe-ABC-149` at `9a309fb4`; base `4973d8e0`)

- **`A1`.** The `grep -cE` printed **6**. The six matches are header lines 45, 46, 50, 54, 57 and
  60, one per label.
- **`A6`, comment-only.** The ticket's filter printed nothing, and `node --check` exited 0.
  **The filter itself was mutation-tested** with `git diff --no-index` against the base reporter.
  It printed the line every time, for three code edits:
  - `M1`'s deleted line;
  - the line commented out (`// if (exitCode !== 0) …`), which shows as its `-` line;
  - `const QE = 1;` put in front of the block's first comment line.
- **`A6`, fences.** The `git diff --name-only 4973d8e0 -- src/ package.json package-lock.json
  vitest.config.ts tools/grugops/run-bounded.js AGENTS.md` printed nothing. The production filter
  `git diff --name-only 4973d8e0 HEAD | grep -v '\.test\.ts$' | grep '^src/'` was empty (exit 1).
- **`A6`, the `ABC-143` page.** One hunk, `@@ -298,0 +299 @@`. By `cmp`, lines 1-298 and everything
  after the inserted line 299 are byte-identical to the base. Line 299 is the pointer.
- **`A6`, counts.** Base copy `npm test`: exit 0, `56 passed (56)`, `1740 passed (1740)`, file 56
  `testResults`, 0 pending, 0 todo. Worktree at tip: the same. They are equal.

## Gates (worktree at `9a309fb4`)

- lint 0 (`Checked 107 files … No fixes applied`), typecheck 0, build 0.
- `npm test` 0: `56 passed (56)` and `1740 passed (1740)`. The file read `success` true, `exited`,
  `exitCode` 0, 0 pending, 0 todo.
- The AGENTS.md skip-count capture returned `0`. `test-skip-integrity.js --skip-count 0` printed
  `No findings.`, exit 0. `lane-inventory.js`: `The lane collects 56 test files; git tracks 56.`,
  `No findings.`, exit 0.
- `git status --porcelain` was empty before and after.
- **Not run:**
  - `run-bounded.proof.js` and `host-protection.js` (no code path they cover changed);
  - every deep lane (no `src/` file changed);
  - the puzzle suite (no engine code touched, so its trigger does not fire).
  - E2E and acceptance are `UNKNOWN - verify` (there is no command).
- **Orphans.** After each batch, `pgrep -fl '[q]e149/copies'` matched only the suite's own
  `mkfifo … sleep 10` CLI fixture (named at `QE-143`, `…da133511`). It was gone on the next read
  (exit 1).

## Cost (`NFR-008`, reported, not bounded)

QE made 30 scratch `npm test` runs:
- head: six rows plus five probes (three assertion shapes, the verbatim example, the nested suite);
- `M1`, `M9` and `M9b`: six rows each;
- one base run.

Four of them were 60 s hang rows and four ran with coverage. There was also one worktree `npm test`
and one skip-count capture. QE added no test file, test or spawn: the count pin is 0 / 0 / 0.
