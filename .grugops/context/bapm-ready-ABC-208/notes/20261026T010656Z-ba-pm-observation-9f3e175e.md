---
id: 20261026T010656Z-ba-pm-observation-9f3e175e
kind: observation
by: ba-pm
at: 2026-10-26T01:06:56Z
verified_by: 
confidence: high (git and grep reads at 1df54ba6)
refs:
  - ABC-208
  - ABC-206
  - ABC-204
  - ABC-209
  - ABC-210
  - ABC-211
  - ABC-215
  - ABC-217
  - EPIC-008
  - S1
  - A5
  - G1
  - G6
  - QE-205-c
  - QE-207-g
  - ADR-0026
  - ADR-0034
  - plans/tickets/ABC-208-null-move-pruning-behind-a-test-only-off-door-with-a-zugzwang-guard.md
  - bapm-s1-ABC-207/20261026T005931Z-ba-pm-decision-f249ca34
  - bapm-epic008-g6-rule/20261025T122057Z-ba-pm-decision-8e51ba1e
  - bapm-close-ABC-205/20261025T043809Z-ba-pm-decision-84a05b3a
  - orch-2026-10-26a/20261026T005347Z-orchestrator-decision-5c59d85e
  - owner-word-2026-10-24/20261024T093000Z-orchestrator-decision-4c3f7639
  - owner-word-2026-10-23/20261023T203000Z-orchestrator-decision-7feb0553
  - owner-delegation-2026-10-22/20261022T140148Z-orchestrator-decision-5aaf7cec
  - grugops/bapm-ready-ABC-208
  - 1df54ba6
  - 0a9390e5
  - 5c91e2e4
supersedes: 
seal: sha256:6ebb1ec6129910576338906d09407782d08758e4e6e9ee17fd65d23bb8a51a2b
---

# BA/PM re-reads at main 1df54ba6 for the ABC-208 DoR re-score. Records only

Task `bapm-ready-ABC-208`. Branch `grugops/bapm-ready-ABC-208` from `main` `1df54ba6`. No npm, no vitest, no timing.
No `src/` edit. Scratch: `<scratchpad>/bapm208/` (note bodies and the seal script).

- `src/engine.ts:73-74` holds "aspiration windows, null-move pruning and threading (none requested …)". The only
  null-move mention in non-test `src/` is that line.
- Test-only doors today: `src/search.ts` has 9 `search…Without…` doors; `src/engine.ts` has 2
  (`chooseMoveWithoutReductions`, `chooseMoveWithoutPvsOrReductions`); `src/evaluate.ts` has
  `evaluateWithoutMobility`.
- `EngineOptions` carries `maxDepth?` and `now?`, so A2's fixed depth and the frozen-clock pre-check are readable on
  the shipped `chooseMove`.
- `ADR-0026`: decision 3 is the ladder rule (every older door turns the new rung off); decision 9's drift maximum is
  118 cp since the 2026-10-24 amendment; decision 10 names null move as the next heuristic in the pattern.
- `ADR-0034` decision 2: only an evaluation-only diff gets the drift class; any other trigger-list file makes every
  missed row class B.
- `ADR-0025` decision 6 (both recursions consume one module) is the precedent the page cites; unchanged.
- `git merge-base --is-ancestor`: `0a9390e5` (ABC-206) and `5c91e2e4` (ABC-215) are both on `main`.
  `git log 0a9390e5..1df54ba6 -- src data` lists 2 commits: ABC-215's values and ABC-217 (test-only).
- `src/puzzle-suite.baseline.json`: solved 54 of 58; the 4 unsolved are mate-in-3 rows.
- The owner's words read: `…7feb0553` item 2 (go-ahead for the ADR work, text reported when it lands); `…5aaf7cec`
  item 3 (a new ADR stays the owner's); `…4c3f7639` (one reading per ticket, final). `ADR-0031`'s 2026-10-24
  addendum was owner-ACCEPTED before `ABC-205`'s planned merge.
- The page diff: 1 file, +48/−2. A grep for personal paths, usernames and hostnames over the diff counts 0.
