---
id: 20261103T130452Z-architect-design-observation-73129e69
kind: observation
by: architect-design
at: 2026-11-03T13:04:52Z
verified_by: 
confidence: high: every line quoted is read from c131ecd0 by git show or git grep; nothing was run
refs:
  - arch-ABC-274-seam
  - grugops/arch-ABC-274-seam
  - ABC-274
  - ABC-239
  - EPIC-011
  - E2-pre
  - ADR-0067
  - ADR-0064
  - ADR-0026
  - ADR-0002
  - ADR-0062
  - F8
  - A3
  - A4
  - A5
  - A7
  - A9
  - S1
  - S2
  - S3
  - Q1
  - Q2
  - Q3
  - Q4
  - withParametersForTest
  - src/evaluate.ts
  - src/evaluate.taper.test.ts
  - src/evaluate-params.ts
  - c131ecd0
  - 0730e294
  - e2d99bc1
  - se-ABC-274/20261103T125734Z-software-engineer-decision-22e25cea
  - se-ABC-274/20261103T125734Z-software-engineer-observation-3219e70e
  - se-ABC-274/20261103T125734Z-software-engineer-observation-c4eedfc0
  - memory-bank/50-decisions/ADR-0067
supersedes: 
seal: sha256:a6023bb0c88c5d42a4a05b8f28efc7a8f69b1248c3c0ca949aa2b3c855d99eb3
---

# arch-ABC-274-seam reading of the build (by `git show`, nothing run): the seam's code facts the ruling rests on, and the two defects in it, one in the seam (loader outside `try`) and one in A3's mobility counter (E1-dependent)

- **Seam text** (`c131ecd0:src/evaluate.ts`, end of file): `loadParameters(parameters); clearPawnCacheForTest(); try { return run(); } finally { loadParameters(PARAMETERS); clearPawnCacheForTest(); }`. The first `loadParameters` is outside the `try` (S2).
- **What the loader writes:** `PACKED_PIECE_SQUARE` (7 × 64), `KING_EG_DELTA` (64), `PACKED_PASSED` (8), `PACKED_TERMS` (5), `MOBILITY_TERMS` (4). Called at module load (`loadParameters(PARAMETERS)`) and by the seam. Phase constants are imported directly and are not swapped (d6 fixes them).
- **No other module reads the parameter table:** `git grep` of `grugops/ABC-274` finds `src/evaluate-params.ts` imported by `src/evaluate.ts` only among non-test `src/` files; `engine.ts`, `search.ts`, `quiescence.ts` import phase / evaluation entries only. So the seam has no second copy of a value to keep in step.
- **The pawn memo** holds packed parts keyed by pawn masks; the seam empties it on entry and exit, so no offset part survives the scope.
- **Async misuse fails safe:** with an async `run`, the `finally` restores at once, so later awaited calls read the shipped table and A3's expectations go red. No offset table leaks out. Not a condition.
- **A3's mobility counter** (`c131ecd0:src/evaluate.taper.test.ts`, `reach`): `whitePov(p, evaluate(p) − evaluateWithoutMobility(p))`, accepted when |term| < `MOBILITY_CAP.mg`, divided by `MOBILITY_WEIGHT.mg`. `evaluateWithoutMobility` zeroes both mobility halves, so the difference carries the mobility share of the blended Δ as well, which is 0 only while mob_eg = mob_mg. `src/evaluate-params.ts` today: `MOBILITY_WEIGHT { mg: 4, eg: 4 }`, `MOBILITY_CAP { mg: 100, eg: 100 }` (S1). Arithmetic reading, not run: `UNKNOWN - verify` until the repair's rows show it.
- **The other 13 families' shifts** use the test's own board counters and the offset C, and `mg` / Δ are read at the shipped table outside the seam, so they hold for any table.
- **A3's selection** (`CORPUS.filter(phase 1–23, shift ≠ null, shift ≠ 0).slice(0, 6)`) runs before `withParametersForTest` is entered (Q1 is QE's source read of this).
- **C = 24** on the eg half; PSTs offset on files a–d only; `MOBILITY_CAP` offset −72.
