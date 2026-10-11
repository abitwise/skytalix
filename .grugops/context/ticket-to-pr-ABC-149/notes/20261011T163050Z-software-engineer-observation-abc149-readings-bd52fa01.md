---
id: 20261011T163050Z-software-engineer-observation-abc149-readings-bd52fa01
kind: observation
by: software-engineer
at: 2026-10-11T16:30:50Z
verified_by:
confidence: high
refs:
  - ABC-149
  - ABC-143
  - QE-143-a
  - QE-143-b
  - NFR-008
  - 20261011T163050Z-software-engineer-decision-abc149-block-7de054e5
supersedes:
---

# SE `ABC-149`: the six rows earned at head `e3e9c126`, then `M1`, `M9` and three query mutants

This note is hand-authored and unsealed. Every reading was RUN on 2026-10-11 on macOS with Node
v26.11.0 and vitest 3.2.7. load1 was about 6.8 to 8, with two Architect hops running in parallel.
No timing is graded.

**Method.** Each copy came from `git archive e3e9c126`, untarred into the session scratchpad
outside the repository, with `node_modules` linked. One shell script ran the six rows in order:
green, then a stamp, then hang, unhandled, suite, assertion and exit-code-only. Each plant file was
restored from a saved copy between rows. Each `last-run.json` was saved and graded by a `node`
script, against the block's row. The script checks the exit code and the named fields, and runs the
query with `jq -r -f`. The query was cut from lines 24-27 of the committed reporter, with the `//`
prefixes and the `jq -r '…'` wrapper removed. Its lines were compared as sorted arrays, by content.

**Plants:** hang = `it("ABC149 hang", () => { while (true) {} })` appended to `src/legal.test.ts`;
unhandled = a `setTimeout` throwing `ABC149-PLANT-timer`, appended to `src/legal.test.ts`;
suite = `throw new Error("ABC149-PLANT-suite")` as the first line of `src/moves.test.ts`'s
`describe("ABC-002 acceptance")` body; assertion = `src/fen.test.ts:54` `toBe(false)` → `toBe(true)`.

## `A2`/`A3`: the unmutated head (control), every row AGREES

| row | exit | file | query lines |
|---|---|---|---|
| green | 0 | `success` true, `runState` exited, `exitCode` 0 | none |
| hang | 124 | `success` false, `runState` started, no `exitCode`, `startTime` 1791735770621 > stamp 1791735770250 | `run    started exitCode=none, killed` |
| unhandled | 1 | `success` false, `exitCode` 1, `unhandledErrors` [`ABC149-PLANT-timer`] (console `1741 passed`) | `error  ABC149-PLANT-timer`, `run    exited exitCode=1` |
| suite | 1 | `success` false, `numFailedTestSuites` 1, `…/src/moves.test.ts` entry message `ABC149-PLANT-suite` | `suite  …/src/moves.test.ts  ABC149-PLANT-suite`, `run    exited exitCode=1` |
| assertion | 1 | `success` false, `numFailedTests` 1 | `test   …/src/fen.test.ts  FEN field parsing parses the side to move`, `run    exited exitCode=1` |
| exit code only | 1 | `success` false, `exitCode` 1, `numFailedTests` 0, `numFailedTestSuites` 0, `unhandledErrors` [] | `run    exited exitCode=1` |

- **Exit-code-only row, `A3`.** The console read `56 passed (56)`, `1740 passed (1740)` and
  `ERROR: Coverage for lines (38.48%) does not meet global threshold (100%)`. All four precondition
  fields hold, so the row is red for the exit code alone.
- The assertion row's file reads `numFailedTestSuites` **2** for one inverted assertion. The block
  names no suite count on that row, so the row agrees. See `…a1eff3dc`.

## `A4`: reporter mutants, the set run in full on each

- **`M1`** (`if (exitCode !== 0) this.#result.success = false;` deleted): five rows AGREE.
  **exit code only DISAGREES**: exit 1, `success` **true**, `exitCode` 1, and the query prints **0**
  lines instead of the `run` line.
- **`M9`** (exit hook deleted, `this.#write()` at the end of `writeReport`): **exit code only
  DISAGREES**: exit 1, `success` **true**, query 0 lines. Four more rows disagree too, because the
  file never gets `runState` or `exitCode`:
  - green: `runState` and `exitCode` are absent, though the query prints 0 lines;
  - unhandled, suite and assertion each print `run    null exitCode=none, killed`.
  - The hang row agrees, because the marker is still written.
- On both mutants, the unhandled, suite and assertion files still read not-success and are named by
  the query. The green file reads `success` true and the query prints 0 lines on it. The hang
  marker carries the new `startTime`. So each mutant still meets `ABC-143` `A1`–`A4`'s file readings,
  as QE found (`…112f11df`). `A5`'s counts and porcelain, and the `A6` fences, were not re-read on
  the mutants; they are QE's.

## `A4`/`A5`: query mutants, on the head's saved files

| query | green | hang | unhandled | suite | assertion | exit code only |
|---|---|---|---|---|---|---|
| without the `run` arm | agree | **DISAGREE: 0 lines** | DISAGREE (`error` only) | DISAGREE (`suite` only) | DISAGREE (`test` only) | DISAGREE: 0 lines |
| without the `suite` arm | agree | agree | agree | **DISAGREE: `run    exited exitCode=1` only, no `suite` line** | agree | agree |
| without the `error` arm | agree | agree | **DISAGREE: `run` only** | agree | agree | agree |

- **`A5`.** Without its `suite` arm, the query still prints the `run` line on the suite file, and
  that passes `ABC-143` `A4`'s "≥ 1 line". Read by content, the row disagrees. An exact count
  would also differ here (1 against 2), but a count names nothing, so the block makes content the
  only pass.
- **Orphans.** After all 18 scratch runs, `pgrep -fl '[a]bc149/copies'` matched nothing (exit 1).

## Cost (`NFR-008`, reported and not bounded)

There were 18 scratch `npm test` runs: six rows on each of head, `M1` and `M9`. Three were 60 s
hang rows, and three ran with coverage. There was also one base copy run, for counts. No test file,
test or spawn was added to the lane.
