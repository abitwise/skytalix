---
id: 20261011T105337Z-qe-e2e-observation-abc143-gap-register-da133511
kind: observation
by: qe-e2e
at: 2026-10-11T10:53:37Z
verified_by:
confidence: high
refs:
  - ABC-143
  - ABC-142
  - QE-143-a
  - QE-143-b
  - QE-143-c
  - QE-143-d
  - QE-143-e
  - QE-143-f
  - QE-142-c
  - 20261011T105337Z-qe-e2e-observation-abc143-readings-e1e5acd5
  - 20261011T105337Z-qe-e2e-observation-abc143-mutants-112f11df
  - 20261011T105337Z-qe-e2e-observation-abc143-vitest-coupling-4f652dad
supersedes:
---

# QE `ABC-143`: gap register (3 LOW, 3 INFO; none is an unmet criterion, none blocks) and rulings on the SE's two limits

This note is hand-authored and unsealed. The readings are in `…e1e5acd5`, `…112f11df` and `…4f652dad`.

| id | severity | owner | gap |
|---|---|---|---|
| `QE-143-a` | LOW | BA/PM (add the plant to the ticket's regression set) | **No criterion exercises the exit-code conjunct.** Mutants `M1` (`success` without the exit code) and `M9` (write at report time, no exit hook) pass `A1`–`A6`. Every criterion's red also fails vitest's own verdict or carries an unhandled error. Only QE's coverage-threshold red kills them (exit 1 with a green verdict → `success` **true**). The head holds that red. The conjunct is also what keeps a vitest 4.x bump from reopening the full `QE-142-a` lie (`QE-143-c`). No test can be added: the count pin is 0 / 0 / 0, so the guard lives in the plant set |
| `QE-143-b` | LOW | BA/PM (`A4`'s file list) | **`A4` leaves out the `A2` marker.** If the query loses its `run` arm, it still passes `A4`, but a timeout file then prints 0 lines, the same as green, so the query tells the reader "nothing red". Read `A4` by content: the `run` arm prints a line on every not-success file, so a line count also lets the suite-arm and error-arm mutants through |
| `QE-143-c` | LOW | BA/PM (attach to any vitest-bump ticket); Software Engineer (the fix) | **The vitest coupling breaks silently on a major bump.** On 4.1.11, `onFinished` is no longer called, so unhandled errors are dropped and the gate stays green. On 5.0.3, the `vitest/reporters` export and `writeReport` are gone: loud at load, then every file reads not-success and names nothing. Only `^3.0.0` and the lockfile (3.2.7) hold it. No test or guard does. Read, not run. Promotion trigger: any vitest major bump pulled |
| `QE-143-d` | INFO | BA/PM (promotion only) | **Ruling on limit 1 (a killed-before-exit marker that names no test): not an acceptance gap.** `A2` asks for "absent or not-success, with the new `startTime`", and the marker meets that exactly. The Scope's "names what the run recorded" holds vacuously, because a killed run recorded nothing. The residue is real but small. On a 124, neither the file nor the console names the hung test: the console lists 52 of 53 files, so the file is found only by elimination, and the title is nowhere. That falls short of the Value line ("holds for every red shape"). A SIGTERM (exit 143) leaves the same marker line as a 124. Promotion trigger: a 124 sighting whose hung test cannot be named by elimination |
| `QE-143-e` | INFO | none (fenced out by the ticket) | **Ruling on limit 2 (two runs in one checkout overwrite each other): not a gap of this ticket.** The ticket's Out of scope names it as unchanged, and QE confirmed it: a red run's file was overwritten by a concurrent green run, which read `success` true with a 0-line query. The kind of lie is the same as at `ABC-142`; the marker adds no new green path, because only a run whose own exit was 0 writes `success` true. A reader can still see it in the file: 1 `testResults` entry instead of 53. The standing mitigation is one worktree per hop |
| `QE-143-f` | INFO | human (git host) | `host-protection.js` exit 2: `UNKNOWN - verify` (gh returned no readable HTTP status). Environmental, the same as `QE-142-f` |

**No gap:** `M5` (`beforeExit`) is equivalent for this lane (`…112f11df`). The `sleep 10` FIFO
writer is the suite's own fixture.

**Closed on QE's reading:** `QE-142-a` (the unhandled error is now named and reads red), `QE-142-b`
(the query prints the suite red), and `QE-142-c` (a 124 no longer leaves a stale green).
