---
id: 20261024T080705Z-software-engineer-observation-12af0d93
kind: observation
by: software-engineer
at: 2026-10-24T08:07:05Z
verified_by: 
confidence: high (deterministic node counts; one host, battery power, load1 ~4-6)
refs:
  - ABC-205
  - OD-205-1
  - OD-205-2
  - ADR-0031
  - ADR-0026
  - ADR-0028
  - ADR-0024
  - ABC-121
  - ABC-081
  - ABC-079
  - 18a0570e
  - 4f650a45
  - grugops/ABC-205
  - arch-rule-ABC-205-stop/20261023T230351Z-architect-design-decision-3809d451
  - owner-word-2026-10-24/20261024T105800Z-orchestrator-decision-fb0468ff
  - plans/tickets/ABC-205-king-safety-bites-while-queens-are-on-and-the-king-table-is-tapered.md
supersedes: 
seal: sha256:1a31691d7bcd3063685f35af2b524e9a106eecfcb6e4479d2ccba341d1dfc35b
---

# Software Engineer: ABC-205 readings and gates on 18a0570e. All green

Logs are in the session scratchpad `se205/` (not committed). Node counts are deterministic, so no timing is quoted.

## Readings
- **Drift (pvs-lmr A1, SEARCH_DEEP):**
  - `search() d5: 96.79% within 25 cp of 187, max 79 cp (position-6/e2d2: 56 -> 135); mate-status flips on the 190: 0`
  - `chooseMove to d5: 97.33% within 25 cp of 187, max 79 cp (position-6/e2d2: 56 -> 135); mate-status flips on the 190: 0`
  - Both are under the 118 cp bar. They equal the Architect's build row exactly.
- **Mate floor:** `ABC-121 A1 mate floor d4 -> d5: 0 of 180 violated`.
- **Quiescence cell (A5 position-6 d1):** 515 / 47 = **10.96x**. The old level was 10x (red), and the new level is 16x (green).
  - The other cells are unchanged: kiwipete 16.06 / 22.04 / 3.97x, and position-6 29.36 / 5.16x at d2 and d3.
- **Transposition A4 (SEARCH_DEEP):** the renamed row passes.

## Gates (worktree ../wt-ABC-205)
- SEARCH_DEEP transposition: 40/40 passed.
- SEARCH_DEEP pvs-lmr: 29/29 passed (about 222 s).
- quiescence, default lane: 29/29 passed. Before the edit it was 28 passed and 1 failed (the OD-205-1 cell). SEARCH_DEEP quiescence: 37/37.
- lint (`biome check .`, 125 files), typecheck and build all exit 0.
- `npm test`: 62 files, 2 054 tests, 2 054 passed, 0 failed. `.test-results/last-run.json` reads success true, with 0 pending and 0 todo.
- Skip capture: 0. `test-skip-integrity.js --skip-count 0` reports "No findings.", exit 0.

## Not done here (Orchestrator's)
- Merge to main. main carries the restore 7c9cd9b9, so a plain merge will not bring the build back (`…c3d204a5`).
- G6, which needs width 1 and an AC-powered host. This host was on battery.
- The QE hop.
