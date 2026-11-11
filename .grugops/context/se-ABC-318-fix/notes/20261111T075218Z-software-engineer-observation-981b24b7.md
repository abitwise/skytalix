---
id: 20261111T075218Z-software-engineer-observation-981b24b7
kind: observation
by: software-engineer
at: 2026-11-11T07:52:18Z
verified_by: 
confidence: high: lint, typecheck and the full suite run after the last edit, each alone under the host lock
refs:
  - se-ABC-318-fix
  - ABC-318
  - ADR-0052
  - ADR-0045
  - src/levels.ts
  - grugops/qe-ABC-318
  - arch-ABC-318/20261111T074415Z-architect-design-observation-1c4c6d88
  - se-ABC-318/20261111T074941Z-software-engineer-observation-ca282d42
supersedes: 
seal: sha256:f81af978246d4990afe1e7cf3a7644ad0b98776eeef7ee2310a3606274d89b16
---

se-ABC-318-fix: the owed src/levels.ts header comment, comment-only, on grugops/qe-ABC-318 (base 405f9c54).

Corrected the three words ADR-0052 D8's dated line (QE-221-b) and ADR-0045's A3 fold and "Owed elsewhere" list name (the brief listed two; the ADR list and the Architect's observation 1c4c6d88 item 1 list three, so all three were done):
- :42 "`NFR-004`'s 3 s" -> "`NFR-004`'s 4 s" (LEVELS[5] and DEFAULT_BUDGET_MS are 4 000 since ABC-228).
- :50 "at least 2 s under it" -> "at least 1 s under it (1 s at level 5)" (5 s ceiling, 4 000 budget).
- :50 "`HARD_CEILING_MS` is the largest of them" -> "The clamp, `HARD_CEILING_MS`, sits at the largest ceiling in force (60 s, `uci-clock-mode`), at or above every level ceiling." (D6's words; engine.ts:211 is 60_000.)
No code, test, README or ADR line changed. One comment line became two.

Gates at the edited tree, each alone under the host lock: npm run lint exit 0 (150 files, no fixes); npm run typecheck exit 0; VITEST_MAX_WORKERS=1 npm test exit 0, 72 files, 2740 passed, 0 failed, no skips reported.

Not checked: deep lanes (comment-only, no behaviour). Left as is, outside the owed list: :43 "`NFR-005`'s reading on `chooseMove` at 3 s" is also stale (NFR-005's referent is 4 000 ms since ABC-228); the Orchestrator rules whether a later diff folds it.
