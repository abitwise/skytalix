---
id: 20261011T101734Z-software-engineer-observation-abc143-readings-67c12026
kind: observation
by: software-engineer
at: 2026-10-11T10:17:34Z
verified_by:
confidence: high
refs:
  - ABC-143
  - ABC-142
  - ABC-042
  - NFR-008
  - ADR-0035
  - QE-142-a
  - QE-142-b
  - QE-142-c
supersedes:
---

# SE `ABC-143`: readings for `A1`–`A6`, the gates and cost (code `f97ad60b`, base `117c1c8e`)

This note is hand-authored and unsealed. Every reading below was RUN on 2026-10-11 on macOS with
Node v26.11.0 and vitest 3.2.7. Plants were made in copies in the session scratchpad, outside the
repository: `git archive 117c1c8e` for base and an rsync of the worktree for head, each with
`node_modules` linked. Every file read used `node -e` or `jq`.

## Base first (test note 3): both defects reproduce at `117c1c8e`

- **`A1` plant.** This test was appended to `src/zobrist.test.ts`:
  `it("PLANT-143 unhandled", () => { setTimeout(() => { throw new Error("PLANT-143-UNHANDLED-boom") }, 0) })`.
  Exit 1. Console: `Tests 1681 passed (1681)`, `Errors 1 error`. The file read `success` true,
  failed 0, total 1681. `grep -c` of the message gave 0.
- **`A2` plant.** A green `npm test` gave exit 0, `success` true, `startTime` 1791713457501. Then
  `it("PLANT-143 hang", () => { while (true) {} })` was appended and the run repeated. Exit 124,
  last line `run-bounded: timed out after 60000 ms …`. The file read `success` true with
  `startTime` 1791713457501 (unchanged). `pgrep` found no orphan.

## Head `f97ad60b`, same plants

- **`A1` MET.** Exit 1. Console: `1681 passed`, `Errors 1 error`. The file read `success` false,
  `runState` `exited`, `exitCode` 1, failed 0, `unhandledErrors[].message` =
  `PLANT-143-UNHANDLED-boom`. The message text appears twice in the file (message and stack).
- **`A2` MET.** Green: exit 0, `success` true, `runState` `exited`, `startTime` 1791713595680.
  Then the hang plant: a `Date.now()` stamp of 1791713601855 was taken just before the run. Exit
  124. The file read `success` false, `runState` `started`, no `exitCode`, `startTime`
  1791713602213 (the new run's). `pgrep` found no orphan.
- **`A3` MET.** `throw new Error("PLANT-143-SUITE-boom")` was placed as the first line of the
  `describe("ABC-013 acceptance")` body in `src/san.test.ts`. Exit 1. Console: `Test Files 1 failed
  | 52 passed`, `Tests 1658 passed`. File: `success` false, `numFailedTestSuites` 1, `exitCode` 1.
  The query printed `suite  …/src/san.test.ts  PLANT-143-SUITE-boom`.
- **`A4` MET.** The query was extracted from the page's § Delivery text and run.
  - `A1` file: 2 lines (`error  PLANT-143-UNHANDLED-boom`, `run    exited exitCode=1`).
  - `A3` file: 2 lines (`suite`, `run`).
  - `ABC-142` `A1` plant (`src/fen.test.ts:54` `toBe(false)` → `toBe(true)`, exit 1, `1 failed |
    1679 passed`): 2 lines (`test   …/src/fen.test.ts  FEN field parsing parses the side to move`,
    `run`).
  - `A2` marker: 1 line (`run    started exitCode=none, killed`).
  - Green file: 0 lines.
- **`A5` MET.** In the worktree at the commit: exit 0, `Test Files 53 passed (53)`,
  `Tests 1680 passed (1680)`. The file read `success` true, `runState` `exited`, `exitCode` 0,
  failed 0, passed 1680, total 1680, 53 `testResults`, 0 `unhandledErrors`. `git status --porcelain`
  was empty afterwards. Console diff against the base green, timings normalized, gave three
  differences: npm's script echo, the copy's `RUN` path, and the removed
  `JSON report written to …` line. No line was added.
- **`A6` MET.**
  - `git diff --name-only -- src/ | grep -v '\.test\.ts$'` is empty.
  - `--numstat -- src/` gives `1 1 src/cli.test.ts`.
  - `vitest.config.ts` is unchanged.
  - `run-bounded.js` has one hunk, `@@ -10 +10 @@`.
  - With `X` appended to the `test` script in a copy, `npx vitest run src/cli.test.ts` gave
    `1 failed | 66 passed (67)`, and the failure was `ABC-042 — the shape of what was delivered >
    A10 — …`. The assertion is still `toBe(command)`.
  - The skip-count capture returned `0`. The counts are 53 / 1680, equal to the base.

## Gates and side tools (worktree)

- lint 0 (103 files), typecheck 0, build 0, `npm test` 0.
- `test-skip-integrity.js --skip-count 0`: `No findings.`, exit 0.
- `lane-inventory.js`: 53 / 53, `No findings.`, exit 0.
- `run-bounded.proof.js`: `all rows held`, exit 0.

## Cost (`ADR-0035` d3): 0 test files, 0 tests, 0 spawns added

Green `Duration` was 6.07 s and 6.02 s at load1 about 5 to 7, against 6.26 s on base (the `A1`
copy). Other hops were running on the machine. Loaded machine, not graded. Two runs is not a
paired measure.

## Limits

- A run that never reaches exit leaves the marker. It reads not-success but names no test.
- Two runs in one checkout overwrite each other's file.
- The A1 count of 2 includes the stack. The message field alone counts 1.
