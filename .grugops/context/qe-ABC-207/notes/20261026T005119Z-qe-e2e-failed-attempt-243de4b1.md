---
id: 20261026T005119Z-qe-e2e-failed-attempt-243de4b1
kind: failed-attempt
by: qe-e2e
at: 2026-10-26T00:51:19Z
verified_by: 
confidence: high
refs:
  - ABC-207
  - EPIC-008
  - NFR-005
  - NFR-004
  - NFR-008
  - ADR-0028
  - ADR-0031
  - ADR-0049
  - plans/tickets/ABC-207-mobility-is-weighted-per-piece-and-an-early-queen-trip-costs.md
  - owner-word-2026-10-24/20261024T093000Z-orchestrator-decision-4c3f7639
  - qe-ABC-205/20261025T034500Z-orchestrator-decision-10e61802
  - orch-2026-10-25ab/20261025T125052Z-orchestrator-decision-9bd65e3c
  - orch-2026-10-25aa/20261025T123439Z-orchestrator-decision-6eda769c
  - arch-design-ABC-207/20261025T123306Z-architect-design-decision-a21b7cc9
  - arch-design-ABC-207/20261025T123306Z-architect-design-observation-439d6f8c
  - ticket-to-pr-ABC-207/20261025T124944Z-software-engineer-decision-71735f56
  - ticket-to-pr-ABC-207/20261025T124944Z-software-engineer-decision-84f82342
  - ticket-to-pr-ABC-207/20261025T124944Z-software-engineer-observation-723cbf60
  - grugops/qe-ABC-207
  - 3d39c8ff
  - 7020cca3
  - 5477df21
  - S1
  - A5
  - G6
  - QE-207-a
supersedes: 
seal: sha256:1e1e1c6c8ef4dc92bc655d90c1d50c320d42a9d847bb31080ced537a08a3beba
---

# Failed attempt: ABC-207 at 3d39c8ff (mobility N4 B4 R2 Q1 K4, early-queen 25 cp) is not GAIN under S1: d1 −15.6 ± 22.8, pooled 800 games −18.3 ± 16.5 (LOSS). Do not re-read it as is

- **What was tried:** the ABC-207 build as ruled (`…a21b7cc9`) and built (`5050cce9`), merged with `main` at `3d39c8ff`,
  against its merge-base `7020cca3` (= `ABC-215`'s `src`). D under ABC-204's pins at B = 1 500 ms, 400 games, then S1's one
  extension of 400 more, pooled.
- **What happened:** d1 NEUTRAL −15.6 ± 22.8 (81/99/220); d2 NEUTRAL −20.9 ± 23.8 (86/110/204); pooled 167/209/424,
  **−18.26 ± 16.49, LOSS** (X + Y = −1.8). 0 faults, 0 foreign-vitest overlap; without the load1 > 8 games pooled −18.1 ±
  16.8, the same grade. Every gate before D passed: `A1`–`A3` MET, `G6` MET (kiwipete 7 = 7, position-6 8 = 8), `G2` 660.7 /
  661.7 ns.
- **What it rules out, as measured:** this weight set plus this term does not make the engine stronger against its base
  at this time control on this host; both halves of the reading point the same way. The tree got smaller (position-6 d8
  −18 %), `G6` kept its depth and `G2` rose only 3 %, so lost depth or speed does not explain it at 3 s; at D's 1.5 s it
  was not read. The cause is otherwise not measured. Which half costs (the weights carry every node change; the queen
  term alone moves no count, `…439d6f8c`) was not read either: one reading, no split.
- **Under `…4c3f7639` this reading is final.** It is not to be repeated on this build. Per S1 the branch is not merged and
  the ticket goes back to BA/PM, who allows at most one re-tune round and then closes or re-cuts it.
