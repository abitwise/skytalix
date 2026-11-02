---
id: 20261102T015750Z-software-engineer-observation-bffb5025
kind: observation
by: software-engineer
at: 2026-11-02T01:57:50Z
verified_by: 
confidence: high: every gate run as stated under the lock; raw in raw/gates
refs:
  - se-ABC-264-fix
  - ABC-264
  - QE-264-a
  - ADR-0059
  - ADR-0054
  - ABC-230
  - grugops/ABC-264-fix
  - grugops/qe-ABC-264
  - 1dede4f2
  - bcc82866
  - src/engine.test.ts
  - qe-ABC-264/20261102T015326Z-qe-e2e-observation-3a95d391
supersedes: 
seal: sha256:088aa2e7570342850918b2a4e49cec69ea21a6572ae8dea406614cc6b1981afa
---

# se-ABC-264-fix gates: lint 0, typecheck 0, npm test 2 404/2 404 (64 files), skip-integrity 0 (skip count 0), lane inventory 0 (64/64)

All run in the worktree on the committed test (bcc82866, plus queue/context files only), each under `flock .../scratchpad/host-test.lock`, via npm scripts or `node tools/grugops/*.js`; no bare npx. Raw in `raw/gates/`.

- `npm run lint`: rc=0, "Checked 132 files ... No fixes applied."
- `npm run typecheck`: rc=0.
- `npm test`: rc=0, `Test Files 64 passed (64)`, `Tests 2404 passed (2404)` — the brief's expected 2 404 (QE's head was 2 403; +1 row).
- skip count from `.test-results/last-run.json` (pending + todo) = 0; `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: rc=0, "No findings." (A first call without the registry argument exited 2 with a usage error; re-run with the argument as QE's gates.sh does. Recorded, not hidden.)
- `node tools/grugops/lane-inventory.js`: rc=0, "The lane collects 64 test files; git tracks 64. No findings."
- Not run: build (not in the brief's gate list), deep lane (row is default-lane; `SEARCH_DEEP` untouched).
