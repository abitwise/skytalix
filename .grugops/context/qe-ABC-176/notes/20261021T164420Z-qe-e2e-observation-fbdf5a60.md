---
id: 20261021T164420Z-qe-e2e-observation-fbdf5a60
kind: observation
by: qe-e2e
at: 2026-10-21T16:44:20Z
verified_by: 
confidence: high
refs:
  - ABC-176
  - grugops/ABC-176
  - 37b8debc
  - 57bb2180
  - 01836fff
  - plans/tickets/ABC-176-a-refused-run-never-reads-as-a-clean-skip-count-or-a-quiet-result-file.md
  - A1
  - A2
  - A3
  - A4
  - SEC-173-1
  - QE-173-d
  - QE-176-a
  - QE-176-c
  - tools/grugops/heap-guard.js
  - tools/grugops/result-file-reporter.js
  - src/cli.test.ts
supersedes: 
seal: sha256:be212417575e5e9c248f862e711d489235905bcb6a14206fac69bafc8158096c
---

# ABC-176 QE mutants: 8 wrong builds against the arms, the 7th reporter row and the suite. The arms kill all 8; the suite misses 3

Each mutant was applied in the scratch copy outside the repository (private TMPDIR) and restored by `cmp` afterwards. Per mutant, three readings were taken: (1) the A1/A2 capture, refusal arm; (2) the `refused` reporter row (exit, file, query); (3) `src/cli.test.ts -t "ABC-176"` at heap 400. The control (unmutated) gave: capture empty / exit 5 / gate exit 1; the row's error line plus the run line; 5 passed.

| mutant | A1/A2 capture | refused row | suite |
|---|---|---|---|
| M0 base guard (`01836fff`, "today's line") | `0`, exit 0, gate `No findings.` BROKEN | only `run    exited exitCode=1` BROKEN | 4 failed |
| M1 capture exits non-zero but prints `0` (the guard's line written on `process.once("exit")`, after the JSON) | `0`, exit 5, gate exit 0 BROKEN | error line present | 2 failed |
| M2a reporter writes a fixed `"heap-guard: refused"` | held | `error  heap-guard: refused` (not the message) BROKEN | **5 passed (survives)** |
| M2b guard hands `catchError` a fixed-string Error | held | fixed string BROKEN | 2 failed |
| M3 READ IT query without its `run` arm | n/a | refused row loses its run line; hang and exit-code-only rows print **0 lines** BROKEN | **cli.test.ts 93/93 passed (survives)** |
| M4 refusal only to stderr: `setup` calls `guard(…, process.stderr)` | `0`, exit 0, gate `No findings.` BROKEN (SEC-173-1 back) | error line present | **5 passed; full `npm test` 59 files / 1992 passed (survives)** |
| M5 no `catchError` hand-off | held | only the run line BROKEN | 2 failed |
| M6 (control for the "cannot look" path) `getPaths` unreadable | no integer | `error  heap-guard: project.vitest.state.getPaths() is gone…` named | n/a |

- **M4 vs the SE's "stderr only" mutant.** The SE's mutant (killed, 2 rows red) changed the write INSIDE `guard`. Mine changes the stream `setup` passes. Every row calls `guard` with a stub stream, so nothing in the suite pins `process.stdout` at the call site. → `QE-176-a`.
- M2a and M3 surviving the suite is the existing `ABC-149` design: the reporter has no in-suite behaviour rows, and its plant table is a hop re-run, not a per-diff gate. The seven-row content comparison kills both. → `QE-176-c` (INFO, not new to this ticket).
