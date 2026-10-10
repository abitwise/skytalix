---
id: ABC-142
title: Two one-test `npm test` failures went unnamed because each run's console output was truncated — make every run keep the failing test's name on disk
status: in-development
column: In Development
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
- **The mechanism is the engineer's.** One candidate is a second vitest reporter with an output file,
  passed through the `run-bounded.js` argv. It is named here only as an example.

## Out of scope

- Finding, fixing, retrying or quarantining the flaky test. **No retry flag.** A retry hides exactly
  what this ticket exists to expose.
- Any change under `src/`, any test, `vitest.config.ts`'s `exclude`, `isolate`, or the pool.
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
  - The diff touches at most `package.json`'s `test` script, `.gitignore`, and
    `tools/grugops/run-bounded.js` (only if the argv needs it).
  - `git diff --name-only -- src/` is **empty**.
  - `run-bounded.js`'s documented exit contract (own code / 124 / 128+n / 2) is byte-unchanged in its
    header.
  - The skip-count capture command in `AGENTS.md` still returns an integer.

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
   owed. The diff carries no `src/` line, so the UAT waiver is expected to apply; that is measured at
   the exit, never asserted here.

## Size and priority

**`XS`:** one script line, one ignore line, and three red/green runs.
- Not `S`: no harness, no load induction, no test is written.

**`P2`:**
- **Not `P3`:** two unnamed reds in one day, on the blocking gate, and the practice ask already failed
  twice.
- **Not `P1`:** both reds were followed by green, nothing is blocked, and no player sees anything.
- **Promotion trigger:** a third unnamed red before this lands.
- **Close trigger:** if a named failure arrives first by hand, QE-141-a's own trigger fires, and this
  ticket still stands. One name does not make the next one kept.

## Definition of Ready

BA/PM, 2026-10-10. **Result: 10 of 10.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** two dated, cited sightings, and the loss mechanism (truncated capture) named |
| 2 | scope and out-of-scope clear | **✅** one kept file; retry, quarantine, `src/` and the deep lanes fenced out |
| 3 | INVEST-shaped | **✅** independent, small, testable by planted red and green runs |
| 4 | acceptance testable and measurable | **✅** exit codes, a named title, failed = 1 / 0, counts equal to the console, an empty `git status` |
| 5 | dependencies known | **✅** none blocking; the concurrency limit named |
| 6 | security/NFR triggers with a measurable target | **✅** count pin 0/0/0; git-ignored, no surface |
| 7 | test notes present | **✅** three |
| 8 | size assigned | **✅** `XS` |
| 9 | priority assigned | **✅** `P2`, with both directions and the triggers |
| 10 | no major unresolved blocker | **✅** none |

Column moves are the Orchestrator's.
