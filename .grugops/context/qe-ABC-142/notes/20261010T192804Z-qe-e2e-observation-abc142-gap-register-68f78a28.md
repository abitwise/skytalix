---
id: 20261010T192804Z-qe-e2e-observation-abc142-gap-register-68f78a28
kind: observation
by: qe-e2e
at: 2026-10-10T19:28:04Z
verified_by:
confidence: high
refs:
  - ABC-142
  - QE-142-a
  - QE-142-b
  - QE-142-c
  - QE-142-d
  - QE-142-e
  - QE-142-f
  - QE-141-a
supersedes:
---

# QE `ABC-142`: gap register (1 MEDIUM, 2 LOW, 3 INFO; none is an acceptance criterion, none blocks)

This note is hand-authored and unsealed. The readings are in `…298ed173`.

| id | severity | owner | gap |
|---|---|---|---|
| `QE-142-a` | MEDIUM | BA/PM (follow-up cut) | **An unhandled-error red leaves a file that says green.** A test that throws from a timer makes `npm test` exit 1 (`Errors 1 error`, with all tests passed). The file reads `success: true` and failed 0, and has no trace of the error. Vitest's JSON reporter does not record unhandled errors. A timer-driven error is a plausible flake shape under load. For that red, the ticket's promise that "the next sighting is named" does not hold. The console still names it, but only above the truncation point. Outside `A1`–`A6`, which are test-failure shaped. The fix would need a reporter that records errors, which is beyond the amended `A5` fence |
| `QE-142-b` | LOW | Software Engineer / AGENTS.md Scribe (where the read query lands) | **The documented read query misses a suite-level red.** A `throw` in a `describe` body (or a failing import) gives `numFailedTests` 0 and `numFailedTestSuites` 1. The ticket § Delivery `jq` prints nothing, but the file does carry the file and the message under `testResults[] \| select(.status=="failed")`. If the query is printed anywhere, it should also print `.testResults[] \| select(.status=="failed") \| "\(.name)  \(.message)"` |
| `QE-142-c` | LOW | none (named by the SE, accepted by the ticket) | **Exit 124 leaves the previous run's file.** QE confirmed it: `startTime` was unchanged and the file read `success: true`. The console's last line is the `run-bounded: timed out` line, so a `tail` does show it. A reader of the file alone should compare `startTime` |
| `QE-142-d` | INFO | Orchestrator (ruling) | **The console's `tail -N` windows show one line fewer.** No committed consumer reads `npm test`'s console (`…e8b64469`). `tail -3` shows no count before or after the change |
| `QE-142-e` | INFO | none | **Absolute paths.** The console line and `testResults[].name` carry the checkout's absolute path. This is not new exposure: 276 tracked files already carry it, and the file is git-ignored |
| `QE-142-f` | INFO | human (git host) | **`host-protection.js` exit 2.** `UNKNOWN - verify`: gh returned no readable HTTP status. This is environmental and not the ticket's |

QE-141-a's re-rate trigger ("re-rate if a named failure recurs") now has a carrier for test-level reds.
No red occurred during this hop's green runs, so the flake remains unnamed.
