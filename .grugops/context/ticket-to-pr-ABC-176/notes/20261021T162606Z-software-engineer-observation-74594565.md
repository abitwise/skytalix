---
id: 20261021T162606Z-software-engineer-observation-74594565
kind: observation
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
  - RISK-ABC173-STATE
  - RISK-ABC143-01
  - ABC-173
supersedes: 
seal: sha256:d171a770e3287efd56ec244b1f9bc61d6bb709121299133af6028e7880f6a32b
---

# ABC-176 residuals: the guard leans on one more vitest member and on one ordering. A refused `npm test` prints its message three times

- **`RISK-ABC173-STATE` widens (LOW).** The guard now also calls `project.vitest.state.catchError`, on top of
  `getPaths`. It fails safe in one direction: when `catchError` is missing, the run is still refused and the stdout
  line is still written (row "A3 — a 'cannot look' throw…"); only `last-run.json` loses the name, back to the
  `QE-173-d` reading. Re-read it at any vitest bump, as for `getPaths`. Owner: Security/NFR, as for that risk.
  `RISK-ABC143-01` does not move, because the reporter reads nothing new.
- **Ordering (LOW).** A1/A2 depend on the guard's line reaching stdout before the JSON report. Both use
  `process.stdout`, and `globalSetup` runs before `onTestRunEnd`. Read at the tip on SUITE and ONE-FILE shapes. A
  vitest that wrote its report before `globalSetup`, or on another stream, would bring the `0` back. The reporter
  header's re-run trigger now names `heap-guard.js`, and its `refused` row reads A3.
- **Noise (INFO).** A refused `npm test` prints the message three times: the guard's stdout line, vitest's
  "Unhandled Errors" block (type `Heap Guard Refusal`), and the existing `startVitest` rethrow print. The
  `ABC-173` `A4` refusal regex still matches (the message is unchanged; `A5` rows green).
- **Not measured:** the `*_DEEP` lanes' own output (out of scope); a refusal under `--reporter=json` with an
  `outputFile` (no AGENTS.md line spells it).
