---
id: 20261027T033612Z-ba-pm-observation-3bbfaa07
kind: observation
by: ba-pm
at: 2026-10-27T03:36:12Z
verified_by: 
confidence: high (git and grep reads at 3050d2b4)
refs:
  - ABC-210
  - ABC-209
  - ABC-208
  - ABC-204
  - EPIC-008
  - S1
  - A1
  - A3
  - A4
  - A5
  - G1
  - G6
  - M3
  - NFR-005
  - QE-205-c
  - QE-207-g
  - QE-209-f
  - ADR-0024
  - ADR-0025
  - ADR-0026
  - ADR-0034
  - ADR-0050
  - plans/tickets/ABC-210-checks-at-the-horizon-a-check-extension-or-checks-in-quiescence.md
  - plans/tickets/ABC-208-null-move-pruning-behind-a-test-only-off-door-with-a-zugzwang-guard.md
  - orch-2026-10-27c/20261027T032922Z-orchestrator-decision-9b4c0f76
  - bapm-s1-ABC-209/20261027T032800Z-ba-pm-decision-492fb6ce
  - bapm-ready-ABC-209/20261026T123609Z-ba-pm-decision-955d0031
  - bapm-epic008-g6-rule/20261025T122057Z-ba-pm-decision-8e51ba1e
  - bapm-close-ABC-205/20261025T043809Z-ba-pm-decision-84a05b3a
  - owner-word-2026-10-26b/20261026T132424Z-orchestrator-decision-2ae5fc12
  - owner-word-2026-10-24/20261024T093000Z-orchestrator-decision-4c3f7639
  - owner-word-2026-10-23/20261023T203000Z-orchestrator-decision-7feb0553
  - owner-delegation-2026-10-22/20261022T140148Z-orchestrator-decision-5aaf7cec
  - orch-2026-10-26c/20261026T010824Z-orchestrator-decision-d25ab770
  - grugops/bapm-ready-ABC-210
  - 3050d2b4
  - b5c67ab7
  - 1c5fd14d
supersedes: 
seal: sha256:42e3cfa0a2d808c2a3c1a3617fd6b98cbfe1ac6458bc0cfaa6b792eb8c5570a0
---


# BA/PM re-reads at main 3050d2b4 for the ABC-210 DoR re-score. Records only

Task `bapm-ready-ABC-210`. Branch `grugops/bapm-ready-ABC-210` from `main` `3050d2b4`. No npm, no vitest, no build,
no timing, no `src/` edit.

- **Page cite:** `src/quiescence.ts:21-24` holds. `diff` of `55a8f4ef:src/quiescence.ts` lines 21-24 against the tip:
  identical. The file's only change since the cut is `ABC-206` `5ff2a129` (below the header). It is the page's only
  `file:line` cite (front-matter `adr:` and the banner).
- **History:** `git diff --stat a5306773 HEAD -- src data tools package.json` is empty; `git log b5c67ab7..HEAD -- src
  data tools package.json` is empty. `main`'s code is `ABC-208`'s merge; nothing of `ABC-209` is on it.
- **Sites after null move (`ABC-208`):**
  - frontier `quiesce` calls: `src/search.ts:356`, `src/engine.ts:263`;
  - `QUIESCENCE_MAX_PLY = 8` at `src/quiescence.ts:76`, the guard at `:102`;
  - `lateMoveReduction` reads check at `src/search.ts:278-279` (`ADR-0026` d6); `nullMoveReduction` at `:305`
    (`ADR-0050` d6); `givesCheck` is imported at `:74`;
  - `KEY_ARRAY_CAPACITY = 128` at `src/search.ts:121` (`ADR-0025` d7);
  - `EngineOptions` `now?` at `src/engine.ts:166`, `maxDepth?` at `:173` (the pre-check runs on shipped `chooseMove`).
- **ADRs read:**
  - `ADR-0024` (accepted by the owner 2026-09-19), decision 4: "Still out of scope … delta pruning, SEE, checks in
    quiescence, quiet promotions". Decision 3 is `A3`'s 1.5× headroom precedent;
  - `ADR-0026` decision 10: "The next value-changing heuristic follows the same pattern"; decision 6 the LMR
    predicate; decision 9 the 118 cp bar;
  - `ADR-0050` in force on `main` from `b5c67ab7`; decision 6 the null-move predicate (none in check);
  - `ADR-0034` decision 2: a diff touching any non-evaluation trigger file has no drift class (its `ABC-079` control
    row lists `src/engine.ts`, `src/quiescence.ts`, `src/search.ts`);
  - `ADR-0003`:387 notes a check-heavy search with check extensions gains less from its legality screen (context only).
  - grep of `memory-bank/50-decisions` for "check extension": that one hit; no accepted ADR rules on a check extension.
- **The owner's words read:** `…2ae5fc12` item 2 (G6 "≥ base" graded, option A; `QE-205-c` closed); `…5aaf7cec` item 3
  (new or reversed ADRs and NFR bounds are his); `…7feb0553` item 2 (go-ahead, text reported when it lands);
  `…4c3f7639` (one reading, final). `…d25ab770` is the reading (b) precedent.
- **EPIC-008:** the G6 row bar "≥ the base build's", with the 2026-10-26 rule-A line ("No bound or reading rule
  moves"); `M3` "G6 … green on `main` at close"; the D budget frozen at 1 500 ms; the 2026-10-27 lines list what
  ABC-210's re-score needs.
- **`QE-209-f`** (host power, INFO): the owner's word allows battery. **`QE-207-g`** carried. Both the Orchestrator's.
- **ABC-208 page front-matter** read `status: ready` / `column: Ready`; board has it Done; merged `b5c67ab7`. Synced
  to `done`/`Done` (2 lines; repo convention: 186 pages read `status: done`).
- **The diff:** 2 files, +92/−4. A grep of the diff for personal paths, usernames and hostnames counts 0.
- **Board:** not edited.
