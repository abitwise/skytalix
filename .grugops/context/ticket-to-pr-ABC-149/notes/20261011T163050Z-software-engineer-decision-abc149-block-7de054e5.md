---
id: 20261011T163050Z-software-engineer-decision-abc149-block-7de054e5
kind: decision
by: software-engineer
at: 2026-10-11T16:30:50Z
verified_by:
confidence: high
refs:
  - ABC-149
  - QE-143-a
  - QE-143-b
  - RISK-ABC143-01
  - tools/grugops/result-file-reporter.js
  - 20261011T105337Z-qe-e2e-observation-abc143-mutants-112f11df
supersedes:
---

# SE `ABC-149`: where the REGRESSION PLANTS block sits and how its rows are written

This note is hand-authored and unsealed. AGENTS.md says no `finding` is admissible on this install.

- **Placement.** The block is the last paragraph of the reporter's header, after THE LIMITS and
  before the imports. It sits directly below READ IT, the query each row runs. It is comment-only,
  with no code byte changed.
- **Triggers in the block.** A change to the reporter, the `test` script, or the installed
  `vitest` / `@vitest/*` version. The block says it is not a per-diff gate.
- **Row form.** Each row starts `//   <label>:`, so the `A1` grep counts exactly six. Each row then
  gives the plant, the exit code, the file fields and the query lines. The plant forms are QE's
  shapes with neutral texts (`PLANT-timer`, `PLANT-suite`). The block says that which file takes the
  plant is the hop's choice.
- **By content.** The block says a row passes on exit code, fields and query lines, with the lines
  compared by content in any order, and that a line count alone is not a pass.
- **`A3` caveat in the block.** The exit-code-only row proves the exit-code check only while
  `numFailedTests` 0, `numFailedTestSuites` 0, an empty `unhandledErrors` and `exitCode` 1 all hold.
  If lines coverage reaches 100 %, the row must be re-planted with another red that vitest's verdict
  calls green.
- **Stamp command.** The hang row's stamp is `node -p 'Date.now()'`, quoted. The first draft said
  `node -p Date.now()`, which is a bash syntax error. The first scratch run caught it, and the
  commit was amended before any row was graded.
- **`M9` shape used for `A4`.** The literal reading of QE's definition: the `process.once("exit")`
  block deleted, and `this.#write()` added after `this.#result = result;` in `writeReport`. Nothing
  else changed. This shape still passes `ABC-143` `A1`–`A6` as written, because those criteria
  never read `runState` or `exitCode`. So it is consistent with QE's "survives `A1`–`A6`".
- **Rejected.** An executable runner script committed to the repository, which the ticket fences
  out. The grader I used lived in the session scratchpad only.
