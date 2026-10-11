---
id: 20261011T163050Z-software-engineer-observation-abc149-suite-count-a1eff3dc
kind: observation
by: software-engineer
at: 2026-10-11T16:30:50Z
verified_by:
confidence: high
refs:
  - ABC-149
  - ABC-142
  - 20261011T163050Z-software-engineer-observation-abc149-readings-bd52fa01
supersedes:
---

# SE `ABC-149`: one inverted assertion reads `numFailedTestSuites` 2, so the assertion row names no suite count

This note is hand-authored and unsealed. Read on 2026-10-11 at `e3e9c126`, and again on `M1` and `M9`.

- The assertion row (`src/fen.test.ts:54` inverted) gave a file with `numFailedTests` 1 and
  `numFailedTestSuites` **2**. vitest 3.2.7 seems to count the failing test's `describe` and its
  file module as two suites. That is my reading and was not traced in vitest's source:
  `UNKNOWN - verify`.
- The block's assertion row names `numFailedTests` 1 and no suite count, as the ticket's table does,
  so the row agrees. **Risk:** a later hop that adds "`numFailedTestSuites` 1" to that row would get
  a false disagreement. The suite row's `1` is a real reading, from a `throw` in a `describe` body.
- The exit-code-only row's `numFailedTestSuites` 0 is unaffected.
