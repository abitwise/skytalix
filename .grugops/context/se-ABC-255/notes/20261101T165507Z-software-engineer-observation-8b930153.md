---
id: 20261101T165507Z-software-engineer-observation-8b930153
kind: observation
by: software-engineer
at: 2026-11-01T16:55:07Z
verified_by: 
confidence: high
refs:
  - ABC-255
  - EPIC-011
  - EPIC-010
  - ADR-0056
  - grugops/ABC-255
  - 78cd2415
  - 8f2fc9b5
  - tools/rating/rating.ts
  - tools/rating/pair-check.ts
  - NFR-008
  - A7
supersedes: 
seal: sha256:1f754a83e1b589652c8701537efb49c2020e4f905169e6193fea62daa6a0ef42
---

# SE observation, se-ABC-255: gates, pair-check and mutations (A7)

Raw: `.grugops/context/se-ABC-255/raw/gates.txt`, `pair-check.txt`, `npm-test.txt`, `mutations.txt`. All under the host lock; load1 7.0–7.7 at the run (foreign hops; not a timing read).

- `npm run lint` exit 0 (first run exit 1: biome format on three long call lines in pair-check.ts; fixed by `biome check --write`, format only), `typecheck` 0, `build` 0.
- `npm test`: 63 files, 2 362 passed, 0 skipped, rc 0 (9.5 s wall; informal). Lane unchanged: no lane file touched, 0 new lane rows (NFR-008; pair-check.ts is not `*.test.*`).
- `test-skip-integrity` (--skip-count 0) "No findings."; `lane-inventory` "No findings.".
- `node --test tools/rating/pair-check.ts`: 32/32 pass, 0 skipped (was 25; +7 ABC-255 rows: d@100 at 50/200 rounds exact vector; d defaults + 5 budgets exact; r@500 exact; r default + rpair st=4/timemargin=1000; A6 keys; timemarginMs table; refusals).
- Mutations (each restored): margin rule → 5 000 − ms: 3 red; r accepts any budget: 1 red; r ignores budget (hard 4 000): 1 red; d without 100: 2 red.
- Real games: none run (A3, A4, A5 are QE's, host ALONE).
