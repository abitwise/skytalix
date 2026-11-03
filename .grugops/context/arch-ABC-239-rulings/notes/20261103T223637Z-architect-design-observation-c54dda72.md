---
id: 20261103T223637Z-architect-design-observation-c54dda72
kind: observation
by: architect-design
at: 2026-11-03T22:36:37Z
verified_by: 
confidence: high
refs:
  - arch-ABC-239-rulings
  - grugops/arch-ABC-239-rulings
  - ABC-239
  - ABC-270
  - ABC-274
  - ABC-269
  - ABC-083
  - ABC-215
  - EPIC-011
  - ADR-0067
  - ADR-0068
  - ADR-0064
  - ADR-0031
  - ADR-0050
  - ADR-0028
  - B-T1
  - B-T2
  - B-T3
  - B-T4
  - B-T5
  - B-T7
  - B-T8
  - F3
  - F4
  - F6
  - Q1
  - se-ABC-239/20261103T220702Z-software-engineer-failed-attempt-f39f6eb5
  - orch-2026-10-30a/20261103T221607Z-orchestrator-decision-42c82347
  - arch-ABC-239-rulings/20261103T222530Z-architect-design-decision-90b469ca
  - da3f8599
  - 03fcaaa0
  - 9eeb0314
  - 77034175
  - 80f128f8
supersedes: 
seal: sha256:ccc7d356af8362f571aab60b0a0fdbec573f8800fa022fbcbd5ab21fea9adb06
---

# arch-ABC-239-rulings owed lines: BA/PM, QE, the Orchestrator and the ABC-270 build. Owner questions: none (one flag)

Architect/Design, task `arch-ABC-239-rulings`. Each line points to `ADR-0067`'s dated block of this task.

- **BA/PM, the `ABC-239` page:**
  - **Dependencies:** `ABC-270` merged before the next fit (`ADR-0068` d7). `da3f8599` is not the fit of record.
  - **The next hop's steps:** decision note § 7.
  - **Test notes:**
    - the two retired rows (the `differ` assertion; B1 (e) whole);
    - B1 (d) kept, with its door literal re-pinned;
    - F3's bound and the one-refit procedure, and the three tool test rows plus the FEN source row;
    - `zugzwang.001` graded as written: e1f1 at d9, never an accept set;
    - own games: six player names, 58 more games.
  - **§ What happens on a miss:** a relation red on the candidate is F3's NOT MET. `zugzwang.001` not e1f1 is F4's NOT MET. Both go to the Architect.
- **BA/PM, the `ABC-270` page:** the phase-24 twins of A2 (b) and A3 (b) (`ADR-0068` d5) must carry their FENs as literal strings in the test file. `tools/tune` pins them by a source row when they become bounds.
- **BA/PM, `EPIC-011`:** no new phase or order. The existing order (`ABC-270` structure → `ABC-239` fit; Q1 before the B-T7 / B-T8 freeze) holds.
- **QE (`qe-ABC-239`):**
  - check that the PR's retired rows are exactly the two named;
  - check every re-pin against B-T4 (the PR table);
  - check the provenance header's bound rows (row, a, right side, μ) against the test files;
  - read B-T5 first, with `zugzwang.001` at e1f1 d9;
  - B-T7 / B-T8 only after Q1 has merged or missed.
- **Orchestrator:** the B1 (e) retirement is an Architect reading of d6. If he reads B1 (e)'s band as a bar, it becomes an owner question: holding it bounds the fit to 5/3 × mg ≤ eg ≤ 2 × mg by rank. The next `se-ABC-239` hop waits on `ABC-270`'s merge.
- **Owner:** none.
