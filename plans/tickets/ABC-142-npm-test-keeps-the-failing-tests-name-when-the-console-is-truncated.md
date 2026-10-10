---
id: ABC-142
title: Two one-test `npm test` failures went unnamed because each run's console output was truncated — make every run keep the failing test's name on disk
status: in-review
column: In Review
size: XS
priority: P2
epic: —
feature: —
---

# ABC-142 — every `npm test` run leaves the failed tests' names on disk, so the next flake is named on first sight

> **Cut 2026-10-10 by BA/PM** (task `wave-2026-09-25`, subtask `bapm-rescore-backlog-r1-2026-10-10`,
> Workflow 07), from two QE gaps: **`QE-141-a`** (LOW) and **`QE-093-e`** (INFO).
> **This ticket does not hunt the flake.** It makes the next sighting name it. Hunting it is a later
> cut, made against a name.
>
> **Amended 2026-10-10 by BA/PM** (subtask `bapm-amend-abc142-2026-10-10`): `A5` had a stale premise.
> `ABC-042` A10 pins `scripts.test` byte-exact at `src/cli.test.ts:1667`, so "zero `src/`" made the
> script edit impossible (SE stop note `…3e7c51a0`). `A5` now allows that one pinned literal, and
> `A6` keeps the pin exact.

## Problem

*User*: every hop that runs the blocking `npm test` gate (Software Engineer, QE/E2E, Security/NFR), and
the next reader who has to tell a flake from a regression.

*Pain*: **two one-test failures were seen on 2026-10-10, and neither was named.**
- **`QE-141-a`:** the SE saw 1662 passed / 1 failed on a JSON-reporter run at the `ABC-141` tip. The
  report was not kept.
- **`QE-093-e`:** QE saw 1 failed of 1,676, in 42 s, at load1 ≈ 183, at `5332f501`. The capture kept
  only the summary tail.

Neither reproduced: 0 failures in 8 later runs, and 0 in 7. **In both cases vitest printed the name. The
hop's own capture threw it away.** QE-141-a's ask ("keep the JSON log, name the test before
rerunning") is a practice with no carrier, and it has now failed twice in one day.

*Value*: a red `npm test` that is re-run until green, with no name, is a skipped test nobody recorded.
`quality.gate_enforcement` is `blocking`. **One kept file per run turns the next sighting into a
named test**, and that is the precondition for QE-141-a's own re-rate trigger ("re-rate if a named
failure recurs").

## Scope

- `npm test` writes, **on every run**, a machine-readable result file at **one fixed, git-ignored path
  per checkout**. It lists each failed test's **file and full title**, plus the run's totals.
- The console output and the exit codes of `npm test` / `tools/grugops/run-bounded.js` are unchanged.
- **The mechanism lives in `package.json`'s `test` script** (for example, a second vitest reporter
  with an output file on that line). The flags are the engineer's choice.
- Two routes are out:
  - **`vitest.config.ts` reporters:** this would also apply to every direct `npx vitest run`,
    including the `*_DEEP` lanes, so it reaches past `npm test`.
  - **`run-bounded.js` injecting flags:** a generic wrapper would be rewriting its own argv, and that
    goes around the A10 pin's intent.

## Out of scope

- Finding, fixing, retrying or quarantining the flaky test. **No retry flag.** A retry hides exactly
  what this ticket exists to expose.
- Any production line under `src/`.
- Any test edit other than the one pinned literal that `A5` names.
- Any change to `vitest.config.ts`.
- The `*_DEEP` lanes. They do not run through `npm test`.
- `AGENTS.md`. A pointer to the file's path is the Scribe's call, within 1,360 B of headroom
  (`QE-093-a`).

## Acceptance (Given/When/Then)

- **`A1` (a red run names its test).**
  - **Given** a scratch copy of the tree with one assertion inverted in one test, **when** `npm test`
    runs, **then** it exits non-zero, **and** the result file exists, **and** it names exactly that
    test's file and full title, with failed count = **1**.
  - The copy is reverted, and `git status --porcelain` is empty afterwards.
- **`A2` (it survives truncation).** **Given** the same red run piped through `| tail -3`, **then** the
  result file still names the test. This is the failure that happened twice.
- **`A3` (a green run is honest too).** **Given** the unmodified tree, **when** `npm test` runs, **then**
  it exits 0, and the file reads failed **0**, with passed and total equal to the console's summary
  counts.
- **`A4` (it does not escape git).** **Then** `git status --porcelain` after `A3` is **empty**: the path
  is git-ignored. **And** the file is not collected as a test, so the lane's file and test counts equal
  the base's.
- **`A5` (nothing else moved).**
  - The diff touches at most four things:
    - `package.json`'s `test` script;
    - `.gitignore`;
    - `src/cli.test.ts`, on **one** line only: the `SCRIPTS_AT_HEAD.test` literal (`ABC-042` A10, line
      1667 at base);
    - the one comment line in `tools/grugops/run-bounded.js`'s header that quotes the `test` script
      (line 10). The comment may only be updated to quote the new value.
  - **Zero production `src/` lines.** `git diff --name-only -- src/ | grep -v '\.test\.ts$'` is
    **empty**, and `git diff --numstat -- src/` has one row: 1 added, 1 deleted, `src/cli.test.ts`.
  - `run-bounded.js`'s code is unchanged, and so is its documented exit contract (own code / 124 /
    128+n / 2). Both are byte-unchanged.
  - The skip-count capture command in `AGENTS.md` still returns an integer.
- **`A6` (the pin still pins).**
  - **Given** the delivered tree, **then** `SCRIPTS_AT_HEAD.test` equals the new `package.json` `test`
    string **byte for byte**. It is still asserted with `toBe` of the full string, with no prefix,
    regex, `toContain`, or `startsWith`. `A10`'s `added` still equals `["chess"]`.
  - **And**, on a scratch copy with one character appended to the `test` script, `npx vitest run
    src/cli.test.ts` fails on `A10`.

## Dependencies

- **None blocking.** Pullable today.
- **Concurrency, named:** two `npm test` runs in **one** checkout at once overwrite each other's file.
  Agent hops run in separate worktrees, one file each. The delivery note states this limit; it does
  not engineer around it.

## Security / NFR triggers

- **`NFR-008` (R-1: wall ≤ 10 s at load1 ≤ 8):** writing one JSON file per run adds no test file. **The
  count is the pin** (`ADR-0035` decision 3): **0 test files, 0 tests, 0 spawns added.** No timing
  bound is written.
- **Security:** the file holds test titles and paths from this repo only. It is git-ignored, so it is
  never committed. No network, no input surface, no dependency added.

## Test notes

1. Plant the red build in a **scratch copy** outside the repository, never in the worktree.
2. Read the file with `jq` or `node -e`, not by eye, and quote the extracted name in the delivery note.
3. Mandatory gates: `npm run lint`, `npm run typecheck`, `npm run build`, `npm test`. The QE hop is
   owed. The diff carries one `.test.ts` line and no production `src/` line, so the UAT waiver is
   expected to apply. Its filter (`grep -v '\.test\.ts$' | grep '^src/'`) should read empty. That is
   measured at the exit, never asserted here.

## Size and priority

**`XS`:** one script line, one ignore line, one pinned test literal, and four red/green runs. Still
`XS` after the amendment.
- Not `S`: no harness, no load induction, no test is written.

**`P2`:**
- **Not `P3`:** two unnamed reds in one day, on the blocking gate, and the practice ask already failed
  twice.
- **Not `P1`:** both reds were followed by green, nothing is blocked, and no player sees anything.
- **Promotion trigger:** a third unnamed red before this lands.
- **Close trigger:** if a named failure arrives first by hand, QE-141-a's own trigger fires, and this
  ticket still stands. One name does not make the next one kept.

## Definition of Ready

BA/PM, 2026-10-10. Re-scored after the `A5` amendment. **Result: 10 of 10.** The first score, also
10 of 10, missed the A10 pin; item 5 now names it.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** two dated, cited sightings, and the loss mechanism (truncated capture) named |
| 2 | scope and out-of-scope clear | **✅** one kept file; retry, quarantine, production `src/`, `vitest.config.ts` and the deep lanes fenced out; the two rejected routes are named |
| 3 | INVEST-shaped | **✅** independent, small, testable by planted red and green runs |
| 4 | acceptance testable and measurable | **✅** exit codes, a named title, failed = 1 / 0, counts equal to the console, an empty `git status`, `numstat` `1 1` on `src/`, and a byte-exact pin (`A6`) |
| 5 | dependencies known | **✅** none blocking; the concurrency limit named; the `ABC-042` A10 pin (`src/cli.test.ts:1667`) and its run-bounded.js header quote named |
| 6 | security/NFR triggers with a measurable target | **✅** count pin 0/0/0; git-ignored, no surface |
| 7 | test notes present | **✅** three |
| 8 | size assigned | **✅** `XS` |
| 9 | priority assigned | **✅** `P2`, with both directions and the triggers |
| 10 | no major unresolved blocker | **✅** none; the A5-vs-A10 conflict the SE stopped on is resolved by this amendment |

Column moves are the Orchestrator's.

## Delivery

Software Engineer, 2026-10-10. Branch `grugops/ABC-142-test-result-file`, code commit `41abc389`, base
`086185d9`. The full readings are in `.grugops/context/ticket-to-pr-ABC-142/notes/`.

- **Mechanism.** Vitest's built-in JSON reporter is added next to the default reporter:
  `--reporter=default --reporter=json --outputFile.json=.test-results/last-run.json`. The path is
  fixed per checkout and git-ignored. Failed tests are the `assertionResults` entries with
  `status == "failed"`; the totals are `numFailedTests`, `numPassedTests` and `numTotalTests`.
- **Read it.** `jq -r '.testResults[] | .name as $f | .assertionResults[] | select(.status=="failed")
  | "\($f)  \(.fullName)"' .test-results/last-run.json`
- **Concurrency limit.** Two `npm test` runs in one checkout at once overwrite each other's file.
  Agent hops use separate worktrees. This is not engineered around.
- **Console delta.** The output gains exactly one line after the summary:
  `JSON report written to <absolute path>`. Vitest prints it and no flag removes it. Every other line
  is equal to the base once timings are normalized. The exit codes are unchanged.
- **Not covered.** On an exit 124 (bound crossed), the tree is SIGKILLed before the reporter writes,
  so no file is written and a stale file from an earlier run can remain.

## QE

**2026-10-10, QE/E2E** (subtask `qe-ABC-142`).
- Range: base `086185d9`, code `41abc389`, reviewed tip `ab8d0088`.
- Every reading is QE's own. The detail is in `.grugops/context/qe-ABC-142/notes/`: `…1828962c`
  (verdict), `…298ed173` (readings), `…e8b64469` (console consumers), `…68f78a28` (gaps). It is not
  restated here.

**PASS_WITH_GAPS.**
- `A1`: QE's own plant in `src/fen.test.ts:54` gave exit 1. The file names
  `FEN field parsing parses the side to move`, with failed 1.
- `A2`: the same red under `| tail -3` gave exit 1, and the file names it.
- `A3`: green gave exit 0, 1680 / 1680, failed 0.
- `A4`: porcelain empty and `check-ignore` matches. 53 / 1680, as at base.
- `A5`: four paths, `numstat` `1 1 src/cli.test.ts`, `run-bounded.js` unchanged apart from line 10, and
  skip-count `0`.
- `A6`: the pin is byte-equal to the script, and appending one character turns `A10` red.
- **Console line.** No consumer breaks or reads a different number. `| tail -N` windows show one line
  fewer. That is ruling input; the ruling is the Orchestrator's.
- Gaps: `QE-142-a` MEDIUM (an unhandled-error red leaves a file reading `success: true`), `QE-142-b`
  LOW (the read query misses a suite-level red), `QE-142-c` LOW (exit 124 leaves a stale file,
  confirmed). `QE-142-d`/`e`/`f` are INFO. None of them is a criterion, so none blocks.
- Gates: lint, typecheck and build exit 0. `npm test` exit 0. Skip-integrity and lane-inventory print
  `No findings.` `CLI_DEEP` 7 passed. `host-protection` exit 2 (`UNKNOWN - verify`).
- On QE's reading, the UAT waiver applies (WAIVED, not accepted). The Orchestrator applies it at `Done`.
