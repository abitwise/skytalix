---
id: 20261021T100411Z-qe-e2e-observation-58c9dbc8
kind: observation
by: qe-e2e
at: 2026-10-21T10:04:11Z
verified_by: 
confidence: high
refs:
  - ABC-181
  - qe-ABC-181
  - grugops/ABC-181
  - 8f8c88b3
  - 18b3c993
  - 19abbdb1
  - QE-179-a
  - QE-181-a
  - plans/tickets/ABC-181-status-panel-header-credits-the-catalog-with-a-lesson-it-does-not-hold.md
  - src/status-panel.nfr.test.ts
  - src/gameend.nfr.test.ts
  - plans/nfr-catalog.md
supersedes: 
seal: sha256:c7c8a60762e70ffd6b9807db66683087472dada39bcaf1ed5e4739402c291801
---

# ABC-181 QE artifacts and trace row (an observation, not an artifact-ref)

- **Why not an artifact-ref:** the writer refuses one without `sha`, `gate_run` and `content_hash`. No §14-gate verdict exists for this run, so a `gate_run` would be invented. Recorded as an observation instead.
- **Under test:** `src/status-panel.nfr.test.ts` @ `8f8c88b3` (header `:12`, 6 tests). QE added no tests.
- **Sources read:** `src/gameend.nfr.test.ts:11-13` (the lesson) and `plans/nfr-catalog.md:25` and `:49` (the count move).
- **Trace row:** | ABC-181 | QE-179-a | src/status-panel.nfr.test.ts:12 (comment only, 8f8c88b3) | existing 6 tests in src/status-panel.nfr.test.ts; npm test 59/1987 = base, skips 0; CLI_DEEP 11, PERFT_DEEP 32 | QE PASS_WITH_GAPS (QE-181-a INFO); UAT waiver holds | In Review |
