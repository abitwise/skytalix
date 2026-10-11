---
id: 20261011T105337Z-qe-e2e-observation-abc143-readings-e1e5acd5
kind: observation
by: qe-e2e
at: 2026-10-11T10:53:37Z
verified_by:
confidence: high
refs:
  - ABC-143
  - ABC-142
  - ABC-042
  - NFR-008
  - QE-142-a
  - QE-142-b
  - QE-142-c
  - 20261011T101734Z-software-engineer-observation-abc143-readings-67c12026
supersedes:
---

# QE `ABC-143`: readings for `A1`–`A6` and the gates (code `f97ad60b`, tip `14cd1cf0`, base `117c1c8e`)

This note is hand-authored and unsealed. AGENTS.md says no `finding` is admissible on this install.
QE ran every reading itself on 2026-10-11, on macOS with Node v26.11.0 and vitest 3.2.7. load1 was
4.5 to 11 across the hop, with other agents running vitest. No timing is graded.

Copies came from `git archive 117c1c8e` and `git archive 14cd1cf0`. They sat in the session
scratchpad, outside the repository, each with `node_modules` linked. `f97ad60b..14cd1cf0` changes
no code path. QE planted in different files from the SE's (`…67c12026` used `src/zobrist.test.ts`
and `src/san.test.ts`). Every file was read with `node -e` or `jq`. The `A4` query was cut verbatim
from the page's § Delivery (the one line that starts `jq -r`) and run as a file.

## Plants

| id | file | plant |
|---|---|---|
| `A1` | `src/legal.test.ts`, appended | `qeIt("QE143 unhandled timer", () => { setTimeout(() => { throw new Error("QE143-UNHANDLED-timer-boom"); }, 0); })` |
| `A2` | `src/history.test.ts`, appended after a green run | `qeIt("QE143 hang", () => { while (true) {} })` |
| `A3` | `src/moves.test.ts`, first line of the `describe("ABC-002 acceptance")` body | `throw new Error("QE143-SUITE-describe-boom")` |
| `ABC-142` `A1` | `src/fen.test.ts:54` | `toBe(false)` → `toBe(true)` |

## Base first, then head (test note 3)

- **`A1`.** Base: exit 1, `Tests 1681 passed`, `Errors 1 error`. The file read `success` true and
  failed 0. The message count in the file was 0. **Head: MET.** Exit 1. The file read `success`
  false, `runState` `exited`, `exitCode` 1, failed 0, and `unhandledErrors` =
  [`QE143-UNHANDLED-timer-boom`]. The message count was 2 (message and stack).
- **`A2`.** Base: green exit 0 with `startTime` 1791714165628. The hang gave exit 124, and the file
  still read `success` true with `startTime` 1791714165628, the green run's. **Head: MET.** Green
  exit 0, then a stamp of 1791714244031 was taken, then the hang. Exit 124 with the last line
  `run-bounded: timed out after 60000 ms …`. The file read `success` false, `runState` `started`,
  no `exitCode`, 0 `testResults`, and `startTime` 1791714244434, later than the stamp. No orphan
  was found by `pgrep` on either side.
- **`A3` MET.** Exit 1, `Test Files 1 failed | 52 passed`, `Tests 1647 passed`. The file read
  `success` false, `numFailedTestSuites` 1, and the `testResults` entry for `…/src/moves.test.ts`
  carried `QE143-SUITE-describe-boom`.
- **`A4` MET**, read by content, not by line count:
  - `A1` file: `error  QE143-UNHANDLED-timer-boom` and `run    exited exitCode=1`.
  - `A3` file: `suite  …/src/moves.test.ts  QE143-SUITE-describe-boom` and `run …`.
  - `ABC-142` `A1` file (exit 1, `1 failed | 1679 passed`):
    `test   …/src/fen.test.ts  FEN field parsing parses the side to move` and `run …`.
  - `A2` marker: one line, `run    started exitCode=none, killed`.
  - Green file (the worktree's `A5` run): 0 lines.
  - The `ABC-142` page carries the pointer to the new query.
- **`A5` MET**, in the worktree at `14cd1cf0`. Porcelain was empty before the run. Exit 0,
  `Test Files 53 passed (53)`, `Tests 1680 passed (1680)`. The file read `success` true,
  `runState` `exited`, `exitCode` 0, failed 0, passed 1680, total 1680, 53 `testResults`, and 0
  `unhandledErrors`. `git status --porcelain` was empty afterwards, and `check-ignore` gave
  `.gitignore:21`.
  - **Console.** QE compared base green and head green with timings stripped, lines sorted and the
    load-dependent slow-test sub-lines dropped, because file order varies between runs. Two lines
    differ: npm's echo of the script, and the removed `JSON report written to <path>` line. **No
    line is added.** The worktree console equals the head copy's under the same normalisation.
- **`A6` MET.**
  - Over both `117c1c8e..f97ad60b` and `117c1c8e..14cd1cf0`, the production-`src/` filter is
    empty, `--numstat -- src/` is `1 1 src/cli.test.ts`, and `vitest.config.ts` is unchanged.
  - `run-bounded.js` with line 10 deleted on both sides gives an empty `/usr/bin/diff`.
  - `src/cli.test.ts:1667` contains the JSON-quoted `scripts.test` (`includes` true), and so does
    `run-bounded.js:10`. The assertion at `:1685` is still `toBe(command)`.
  - On a copy, `npx vitest run src/cli.test.ts` gave 67 passed. With `X` appended to the script it
    gave exit 1, `1 failed | 66 passed (67)`, and the failure was `ABC-042 — the shape of what was
    delivered > A10 — …`.
  - The base green copy read 53 files and 1680 tests, the same as head. The skip-count capture
    returned `0`.

## Beyond the criteria (same head, other red shapes)

- **A non-`Error` throw** (`throw "QE143-THROWN-STRING"` from a timer): exit 1, `unhandledErrors`
  = [`QE143-THROWN-STRING`], and the query names it.
- **An unhandled rejection** (`Promise.reject(new Error(…))`, not awaited): exit 1, and the error
  is named.
- **Coverage threshold** (`npm test -- --coverage --coverage.thresholds.lines=100`): exit 1, with
  vitest's verdict green (1680 passed) and no unhandled error. The file read `success` false and
  `exitCode` 1. The query prints only `run    exited exitCode=1`, because the file recorded nothing
  else. This is the only plant QE found that exercises the exit-code conjunct alone
  (`…112f11df`).
- **SIGTERM** to the run's own `run-bounded` mid-run (hang plant): exit 143. vitest's non-TTY
  `run` mode does not handle the signal, so no `exit` hook ran, and the `started` marker stayed,
  reading not-success. The query prints `run    started exitCode=none, killed`, the same line as
  a 124.
- **Two runs in one checkout** (`npm test -- src/search.test.ts` green, started 0.3 s before
  `npm test -- src/legal.test.ts` with the `A1` plant): the red exited 1 first. The green exited 0
  later and its file won: `success` true, 1 `testResults` entry, query 0 lines. That is the named
  limit (`…da133511`).
- A `src/cli.test.ts` fixture leaves a `sh -c … mkfifo … sleep 10` writer alive for up to 10 s
  after a run. It is the suite's own fixture, it is gone within 10 s, and it is not the reporter's.

## Gates (worktree, `14cd1cf0`)

- lint 0 (103 files), typecheck 0, build 0, `npm test` 0 (53 / 1680).
- Skip count `0`. `test-skip-integrity.js --skip-count 0` printed `No findings.`, exit 0.
- `lane-inventory.js`: 53 / 53, `No findings.`, exit 0. `run-bounded.proof.js`: `all rows held`,
  exit 0.
- `host-protection.js` exited 2: `UNKNOWN - verify` (gh returned no readable HTTP status).
- uat-spec-integrity is not applicable (0 `*.uat.spec.ts` files). E2E and
  `check-uat-oracles.js` are `UNKNOWN - verify` (no command; the script is absent).
- Count pin (`NFR-008` R-1): 0 test files, 0 tests and 0 spawns were added. The reporter imports
  no `child_process`. No timing is graded.
