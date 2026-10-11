---
id: 20261011T105337Z-qe-e2e-observation-abc143-mutants-112f11df
kind: observation
by: qe-e2e
at: 2026-10-11T10:53:37Z
verified_by:
confidence: high
refs:
  - ABC-143
  - QE-143-a
  - QE-143-b
  - tools/grugops/result-file-reporter.js
  - 20261011T101734Z-software-engineer-decision-abc143-mechanism-04de13d2
  - 20261011T105337Z-qe-e2e-observation-abc143-readings-e1e5acd5
supersedes:
---

# QE `ABC-143`: reporter and query mutants. Six of nine reporter mutants die to `A1`–`A6`; three do not

This note is hand-authored and unsealed. Every row was RUN on 2026-10-11 against the full plant set,
on fresh copies of `14cd1cf0` outside the repository, with only `tools/grugops/result-file-reporter.js`
replaced. Each replacement was checked to hit exactly once and to pass `node --check`.

**The plant set:** green then hang (`A5` and `A2`), `A1`, `A3`, the `ABC-142` inverted assertion
(`A4`), and QE's coverage-threshold red. The coverage red is `npm test -- --coverage
--coverage.thresholds.lines=100`: exit 1, vitest's verdict green, no unhandled error. It holds the
Scope sentence "after any exit other than 0, the file never reads `success: true`". It is not one
of `A1`–`A6`.

**Control.** The unmutated reporter met every check.

## Reporter mutants

| mutant | change | result | killed by |
|---|---|---|---|
| `M1` | `success` computed without the exit code (`if (exitCode !== 0) … = false` deleted) | **survives `A1`–`A6`** | only the coverage red: exit 1, `success` **true** |
| `M2` | start marker never written | killed | `A2`: exit 124, `success` true, `startTime` = the green run's (the `QE-142-c` lie returns) |
| `M3` | unhandled errors dropped (`#unhandled = []`) | killed | `A1`: text count 0 (`success` stays false through the exit code); `A4` on `A1`: only the `run` line |
| `M4` | exit hook not registered | killed | `A5` (`success` false, `runState` `started`, query 1 line on green); `A1`; `A3`; `A4` ×3 |
| `M5` (QE) | `beforeExit` instead of `exit` | **survives everything**: equivalent | — |
| `M6` (QE) | async `promises.writeFile` in the exit hook | killed | as `M4`: the write never lands, and every file is the marker |
| `M7` (QE) | marker written `success: true` | killed | `A2`: exit 124, `success` true (new `startTime`); the query prints 0 lines |
| `M8` (QE) | unhandled errors do not set `success` false, and `M1` | killed | `A1`: `success` true with the text present; coverage red |
| `M9` (QE) | final file written at report time, no exit hook (the SE's rejected design) | **survives `A1`–`A6`** | only the coverage red: exit 1, `success` **true** |

- **`M1` and `M9`.** The exit-code conjunct, and with it the SE's reason for writing at exit and not
  at report time, is exercised by no acceptance criterion. Every criterion's red also fails
  vitest's own verdict or carries an unhandled error, so the other two conjuncts already make the
  file read red. The head holds the coverage red (`…e1e5acd5`). Gap `QE-143-a`.
- **`M5` is equivalent for this lane.** vitest's `run` mode ends by draining the event loop, not by
  calling `process.exit()`, so `beforeExit` fires on every plant. On SIGTERM, neither `exit` nor
  `beforeExit` fires, and both leave the not-success marker (exit 143). The paths where they would
  differ (`process.exit()` on teardown timeout, a main-process unhandled rejection, a startup
  error) leave the marker under `M5`, which still reads not-success. No gap.
- **`M3` is also the vitest 4.x reading.** On 4.1.11, `onFinished` is never called on a reporter
  (`…4f652dad`).

## Query mutants (on the head's saved files; lines per file)

| query | `A1` | `A3` | `ABC-142` `A1` | `A2` marker | green |
|---|---|---|---|---|---|
| as on the page | 2 | 2 | 2 | 1 | 0 |
| without the `run` arm | 1 | 1 | 1 | **0** | 0 |
| without the `suite` arm | 2 | 1 (`run` only) | 2 | 1 | 0 |
| without the `error` arm | 1 (`run` only) | 2 | 2 | 1 | 0 |

- **Without the `run` arm, the query passes `A4` as written**, but a timeout file then prints 0
  lines, the same as a green file. `A4`'s list of files leaves out the `A2` marker. Gap `QE-143-b`.
- Without the `suite` arm or the `error` arm, the query still prints at least one line on every red
  file, because the `run` arm fires on any not-success file. `A4` catches these mutants only if
  it is read by content ("naming the red"). A line-count reading would not catch them.
