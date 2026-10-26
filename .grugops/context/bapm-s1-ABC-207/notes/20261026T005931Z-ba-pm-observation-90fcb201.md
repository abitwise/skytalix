---
id: 20261026T005931Z-ba-pm-observation-90fcb201
kind: observation
by: ba-pm
at: 2026-10-26T00:59:31Z
verified_by: 
confidence: high (git reads at 23181cc2; grep outputs)
refs:
  - ABC-207
  - ABC-208
  - ABC-209
  - ABC-210
  - ABC-211
  - EPIC-008
  - S1
  - A5
  - M1
  - M2
  - M3
  - QE-207-a
  - QE-207-b
  - QE-207-c
  - QE-207-f
  - plans/tickets/ABC-207-mobility-is-weighted-per-piece-and-an-early-queen-trip-costs.md
  - plans/epics/EPIC-008-skytalix-plays-measurably-stronger-at-the-same-levels-and-time-budgets.md
  - orch-2026-10-26a/20261026T005347Z-orchestrator-decision-5c59d85e
  - qe-ABC-207/20261026T005119Z-qe-e2e-decision-cc744e8c
  - qe-ABC-207/20261026T005119Z-qe-e2e-failed-attempt-243de4b1
  - qe-ABC-207/20261026T005119Z-qe-e2e-observation-138c1740
  - owner-word-2026-10-24/20261024T093000Z-orchestrator-decision-4c3f7639
  - owner-delegation-2026-10-22/20261022T140148Z-orchestrator-decision-5aaf7cec
  - bapm-close-ABC-205/20261025T043809Z-ba-pm-decision-84a05b3a
  - grugops/bapm-s1-ABC-207
  - 23181cc2
  - 5477df21
  - ab39b73f
  - 7020cca3
  - 0a9390e5
supersedes: 
seal: sha256:91a90e91be3a7c6c5088cffeb9574d88f211a4b84201a591933d85d7a878ac9f
---

# BA/PM re-reads at main 23181cc2 for the ABC-207 S1 close and the EPIC-008 pull check. Records only

Task `bapm-s1-ABC-207`. Branch `grugops/bapm-s1-ABC-207` from `main` `23181cc2`. No npm, no vitest, no timing.
No `src/` edit. Scratch: `<scratchpad>/bapm207s1/`.

- `git diff 7020cca3 23181cc2 -- src data tools` is empty, and so is `git diff 5c91e2e4 23181cc2 -- src data tools`.
  So `main` carries none of ABC-207's code, and no revert is owed.
- `src/evaluate.ts` on `main` has `const MOBILITY_WEIGHT = 4;` (a scalar) and no `EARLY_QUEEN_PENALTY`. At `5477df21`
  it is the array `[0, 0, 4, 4, 2, 1, 4]`, plus `EARLY_QUEEN_PENALTY = 25`.
- `5477df21` is not an ancestor of `main`. `grugops/ABC-207` = `5477df21`, `grugops/qe-ABC-207` = `ab39b73f`.
  `git diff --stat 7020cca3 5477df21 -- src` shows 6 files changed, +226/−31.
- `ABC-206` merged as `0a9390e5` (2026-10-24). That is `ABC-208`'s Ready trigger. No note under `.grugops/context/`
  after `bapm-cut-engine-strength` names `ABC-208`.
- `ABC-208`'s cite `src/engine.ts:69-71` ("null-move pruning and threading (none requested …)") is `:73-74` on `main`.
  The text is unchanged.
- `ABC-209` waits on `ABC-208`, and `ABC-210` on `ABC-209`. `ABC-211`'s trigger is "the source ruling lands", and no
  Architect/Design source-ruling task for it exists in `.grugops/context/`.
- Convention for a close without delivery: `status: dropped`, `column: Done` (as `ABC-205`).
