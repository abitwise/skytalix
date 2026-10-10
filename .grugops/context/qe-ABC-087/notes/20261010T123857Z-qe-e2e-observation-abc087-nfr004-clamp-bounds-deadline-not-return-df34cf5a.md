---
id: 20261010T123857Z-qe-e2e-observation-abc087-nfr004-clamp-bounds-deadline-not-return-df34cf5a
kind: observation
by: qe-e2e
at: 2026-10-10T12:38:57Z
verified_by:
confidence: high
refs:
  - ABC-087
  - NFR-004
  - AR-NFR004-A
  - ADR-0032
  - src/levels.ts
  - 20261010T115230Z-software-engineer-claim-abc087-agents-md-line-nfr004-wording-a4-bias-53ebd6d1
  - .grugops/context/qe-ABC-087/probe/out-harness-head.txt
supersedes:
---

# For Security/NFR: the level layer's clamp bounds the blunder path's DEADLINE at 5 000 ms, not its return. Measured on the real clock: 5 015 ms and 5 005 ms. That is `AR-NFR004-A`'s shape, and nothing live reaches it

Hand-authored, unsealed. These are facts for the `NFR-004` wording, which is Security/NFR's to make.
QE does not rule on it.

- **What the code does** (`src/levels.ts:123`, `:144`): `B = min(level budget, HARD_CEILING_MS)`, and
  child i's deadline is `start + B·(i+1)/N`. QE's `I5` checked the last child's deadline to
  1e-9: it is exactly start + 5 000, for a 20 000 ms level and for an `Infinity` level.
- **Virtual clock (step 50):** elapsed 5 150, which is 3 readings past. That is the engine's own
  overrun on the last child plus the level's closing read.
- **Real clock** (`QE_REAL=1`, a 20 000 ms level, rate ≈ 1, 20 children; perft positions 0 and 1;
  the harness file ran at load1 5.68 → 2.91): **5 015 ms and 5 005 ms wall**, the same as the reported `elapsedMs`.
- **So "clamps its own total to `HARD_CEILING_MS`"** (the Engineer's draft sentence, `…53ebd6d1` § 2)
  is true of the deadline. The return overruns by up to the same residual the engine itself carries
  (`AR-NFR004-A`, ≤ 31 ms; ~5 003 ms per call).
- **No level reaches it today.** The hardest is 4 500 ms at rate 0. `A5` on the real clock read 30/30,
  max **4 531 ms** at QE (4 590 at the Engineer's re-hop). A blundering level can sit near the ceiling
  only after a table re-cut (`ABC-085`, `EPIC-006`).
- Gap `QE-087-c` records that no shipped test pins the clamp at all (`M4` survives).
