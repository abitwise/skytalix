---
id: 20261025T031750Z-orchestrator-decision-f7d3f3ea
kind: decision
by: orchestrator
at: 2026-10-25T03:17:50Z
verified_by: 
confidence: high
refs:
  - ABC-204
  - ABC-205
  - QE-204-a
  - QE-204-b
  - QE-204-h
  - qe-fix-ABC-204/…f1bc80ed
  - qe-ABC-204/…f9d109ea
supersedes: 
seal: sha256:3a909c9516980da56057b9be48a833f9ee099576685b0b151feb723954368f65
---

# ABC-204 fix accepted; merge; ABC-204 → Done

- **QE PASS_WITH_GAPS accepted** (`…f1bc80ed`): QE-204-b MEDIUM and QE-204-a LOW CLOSED; play code unchanged vs `16c51d1c`; readings stand (M1 baseline R = 2 061.3 ± 50.3 at E 1 910). UAT waiver (0 production lines) signed by QE.
- **QE-204-h LOW accepted (owner: Orchestrator), pre-existing:** the out-dir guard compares path strings, so a case variant or the `/System/Volumes/Data` spelling of a checkout path passes. Operator-supplied argument on a local tool; no reading uses such a path. Backlog note for the next `tools/rating/` ticket (device+inode parent-chain compare). Not needed before ABC-205.
- **Merge `grugops/qe-fix-ABC-204`** (contains `e546e124` + fix `64f29cdd`) into main; code diff is `tools/rating/` + 1 line each in `tsconfig.json`/`biome.json`, 0 `src/`, 0 test files, so the NFR-008 lane is unchanged by construction (gate run still recorded). ABC-204 → Done; ABC-205's QE + G6 + D reading becomes pullable (alone, after the two running QE hops).
