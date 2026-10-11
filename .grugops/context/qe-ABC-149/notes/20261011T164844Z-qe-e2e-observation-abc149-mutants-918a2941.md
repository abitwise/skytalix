---
id: 20261011T164844Z-qe-e2e-observation-abc149-mutants-918a2941
kind: observation
by: qe-e2e
at: 2026-10-11T16:48:44Z
verified_by:
confidence: high
refs:
  - ABC-149
  - ABC-143
  - ABC-152
  - QE-143-a
  - QE-143-b
  - RISK-ABC143-01
  - tools/grugops/result-file-reporter.js
  - 20261011T105337Z-qe-e2e-observation-abc143-mutants-112f11df
  - 20261011T163050Z-software-engineer-observation-abc149-readings-bd52fa01
  - 20261011T164844Z-qe-e2e-observation-abc149-readings-1d736a15
supersedes:
---

# QE `ABC-149`: `M1`, `M9` and QE's `M9b` each meet `ABC-143` `A1`–`A5` and are killed by the set; the query without its `run` / `suite` / `error` arm disagrees by content

This note is hand-authored and unsealed. Each mutant copy is a fresh `git archive 9a309fb4`, outside
the repository. `/usr/bin/diff -rq` against the head copy (excluding `node_modules`, `.test-results`
and `coverage`) differs in `tools/grugops/result-file-reporter.js` only. Each edit was checked to
hit exactly once and to pass `node --check`. The plants are those in `…1d736a15`.

## Reporter mutants: the six rows run in full on each

| mutant | change | green | hang | unhandled | suite | assertion | **exit code only** | `ABC-143` `A1`–`A5` |
|---|---|---|---|---|---|---|---|---|
| none (control) | — | agree | agree | agree | agree | agree | agree | all MET |
| `M1` | `if (exitCode !== 0) this.#result.success = false;` deleted | agree | agree | agree | agree | agree | **DISAGREE**: exit 1, `success` **true**, `exitCode` 1, query **0** lines | all MET |
| `M9` | `process.once("exit", …)` block deleted; `this.#write();` after `this.#result = result;` (the SE's shape) | DISAGREE: no `runState`, no `exitCode` | agree | DISAGREE: `run    null exitCode=none, killed` | DISAGREE: same `run` line | DISAGREE: same `run` line | **DISAGREE**: exit 1, `success` **true**, query **0** lines | all MET |
| **`M9b` (QE)** | `M9`, plus at report time `result.runState = "exited"`, `result.exitCode = process.exitCode ?? 0`, and `success` false when that is non-zero | agree | agree | agree | agree | agree | **DISAGREE**: exit 1, `success` **true**, `exitCode` **0**, query **0** lines | all MET |

- **`A4` is MET.** `M1` and `M9` each read `success` **true** on the exit-code-only row, and the
  unmutated tip agrees on every row (the control). On each mutant, `ABC-143` `A1`–`A5`'s file
  readings were re-read by a program from the same row files:
  - `A1`: exit 1, not `success` true, text count ≥ 1;
  - `A2`: exit 124, not `success` true, `startTime` after the stamp;
  - `A3`: exit 1, the file and the message are named;
  - `A4`: the query names each red, and prints 0 lines on green;
  - `A5`: exit 0, `success` true, failed 0, passed and total equal the console's.

  All held. `ABC-143`'s `A6` fences hold by construction, because only the reporter differs. So
  each mutant passes `ABC-143` and fails this set. That is test note 3.
- **`M9b` is QE's own mutant, and the strongest reading of the hop.** It is the plausible way to
  "simplify away the exit hook": write at report time and fill in `runState` and `exitCode` from
  `process.exitCode`. It agrees with **five of six rows** and meets `ABC-143` `A1`–`A5`. On the
  unhandled, suite and assertion rows, `process.exitCode` is already 1 at report time. On the
  coverage-threshold red it is not: the file says `exitCode` 0 and `success` true while `npm test`
  exits 1. **Only the exit-code-only row kills it.** That is the exact lie `QE-143-a` named, now in
  a shape that also looks complete on the green row. It bears on `ABC-152` (vitest 4.1, where the
  reporter's surfaces move, `RISK-ABC143-01`): the row is the one guard against this rewrite.

## Query mutants (each arm removed from the cut query, run in place right after each row)

| query | green | hang | unhandled | suite | assertion | exit code only |
|---|---|---|---|---|---|---|
| without the `run` arm | agree | **DISAGREE: 0 lines** | DISAGREE: `error` only | DISAGREE: `suite` only | DISAGREE: `test` only | DISAGREE: 0 lines |
| without the `suite` arm | agree | agree | agree | **DISAGREE: `run    exited exitCode=1` only, no `suite` line** | agree | agree |
| without the `error` arm | agree | agree | **DISAGREE: `run` only** | agree | agree | agree |

- **`A4`, query.** Without its `run` arm, the query prints **0** lines on the hang marker, where the
  row expects the one `run` line. That is `QE-143-b`'s mutant, killed.
- **`A5` is MET.** Without its `suite` arm, the suite row prints a `run` line and no `suite` line,
  and the row reads as a disagreement **by content**. It would pass `ABC-143` `A4`'s "≥ 1 line".
  The block states the by-content rule at header lines 41-43.
- These readings reproduce the SE's tables (`…bd52fa01`) cell for cell, from different plant files.
