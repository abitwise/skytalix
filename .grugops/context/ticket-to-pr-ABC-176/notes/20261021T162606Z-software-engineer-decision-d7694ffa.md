---
id: 20261021T162606Z-software-engineer-decision-d7694ffa
kind: decision
by: software-engineer
at: 2026-10-21T16:26:06Z
verified_by: 
confidence: high
refs:
  - ABC-176
  - grugops/ABC-176
  - 01836fff
  - ffd53f41
  - plans/tickets/ABC-176-a-refused-run-never-reads-as-a-clean-skip-count-or-a-quiet-result-file.md
  - tools/grugops/heap-guard.js
  - tools/grugops/result-file-reporter.js
  - src/cli.test.ts
  - SEC-173-1
  - QE-173-d
  - ABC-149
  - RISK-ABC143-01
  - A1
  - A2
  - A3
  - A4
supersedes: 
seal: sha256:ab3222017ff10fad59460fd4a81e76974db531ce96c395d68c0863bdbbcfbcf9
---

# ABC-176: one wrapper in `heap-guard.js` names the refusal on stdout and to vitest. The reporter's code is unchanged. A2 is feasible

- **What.** `heap-guard.js` exports `guard(project, heapStatistics, out)`, which wraps `admit`. Whatever `admit` throws (a
  refusal, or a "cannot look" throw) is first written as one line to `out`: the thrown message verbatim. It is then
  handed to `project.vitest.state.catchError(error, "Heap Guard Refusal")` when that is a function, and re-thrown.
  `setup` calls `guard(project, v8.getHeapStatistics(), process.stdout)`. An admitted run writes nothing and records
  nothing, so the green path does no new work.
- **Why stdout (A1, A2).** In vitest 4.1.11, `globalSetup` runs inside `runFiles` before the pool. When it throws, the
  `finally` still calls `_testRun.end` and the JSON reporter writes its report to stdout (`cli-api.CnMVyzaz.js` ~13655,
  13668-13672). The guard's line comes first on the same stream, so `jq` meets a non-JSON first token. It prints
  nothing and exits 5. This covers the OLD verbatim text and the AGENTS.md line with its prefix removed (the same
  string). So A2 is **feasible** inside the public surface (Node's `process.stdout`), and option (b) stands. No
  return to BA/PM.
- **Why `catchError` (A3).** `runFiles`' `finally` passes `state.getUnhandledErrors()` to `onTestRunEnd`. The
  reporter already keeps those as `unhandledErrors[]` (`ABC-143`), and the READ IT query's `error` arm already prints
  them. So the result file carries the thrown error's own message in a documented field with no reporter code change.
  The reporter reads nothing new, so `RISK-ABC143-01` does not move. `catchError` is typed on `StateManager`
  (`reporters.d.DtoKVV2s.d.ts:1161`) and is the call vitest's own pool makes (`:2810`, `:3517`).
- **Rejected:** a global symbol shared by the guard and the reporter (a hidden channel, plus a reporter change);
  making the reporter recognise the refusal by text (that is the hard-coded-string wrong build).
- **Reporter header:** the seventh `ABC-149` plant row, `refused`, with the same four parts. The re-run trigger now
  also names `heap-guard.js`.
- **Tests:** five rows in `src/cli.test.ts`, in process, using a stub project and a stub stream, as `ABC-173` `A5`
  does. The real arms spawn a refused vitest, so they are hop readings, not rows (NFR-008).
