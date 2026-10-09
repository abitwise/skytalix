---
id: 20261009T164755Z-architect-design-decision-ruling1-row21-mislabelled-replace-the-pair-level-unchanged-f0115510
kind: decision
by: architect-design
at: 2026-10-09T16:47:55Z
verified_by:
confidence: high
refs:
  - ABC-082
  - ABC-079
  - ADR-0028
  - src/quiescence.test.ts
  - 20261009T164755Z-architect-design-observation-row21-hanging-corpus-margins-and-the-replacement-pair-d25a0383
  - 20261009T164755Z-architect-design-observation-scratch-checks-a1-replaced-a2-hit-rates-a4-discard-mutant-39129557
  - 20261009T163130Z-software-engineer-observation-abc082-stop-two-r-levels-red-on-deep-lanes-9bdc69b3
supersedes:
---

# Ruling 1: row 21 is MIS-LABELLED under a pawn-aware evaluator. Replace the pair, keep the level (≤ 1 of 24)

Hand-authored, no `seal`. `ADR-0028` decision 2.

## Ruling

**Under a pawn-aware evaluator, the "losing capture" label on "R takes a pawn a bishop defends"
(and its mirror) is no longer true at depth 3. The build is not defective.**

- **What the engine does.** At depth 3 the engine sees the whole exchange. Rxb2 Bxb2 is K+B v K,
  which `gameStatus` scores as an exact 0. The engine takes that 0 over alternatives it scores −40,
  because R v B+P with Black's b2 passer on its own 7th rank scores −60 statically.
- **Why that is not a horizon error.** A horizon error is what `ABC-079` `A1` exists to catch. Here
  the engine has seen the recapture, so A1's purpose is not engaged. The depth-1 row, which is
  where the horizon is tested, stays green on this pair.
- **The label was always conditional.** At base it held by 50 cp, the thinnest margin of all 24
  rows (`…d25a0383`). Any passed-pawn term that scores a blockaded 7th-rank passer at 60 cp or
  more flips it.
- **Why the build is not changed instead.** Making the label true again would need a
  "blockaded passer" refinement. That is a fourth pawn term, fenced out of `ABC-082` (coding
  rule 5). Re-weighting does not clear it either (Engineer: 60/80/100 all read 2/24).

## What replaces it (`src/quiescence.test.ts`, two FENs; names, `losing` moves and the level unchanged)

| row | old FEN | new FEN |
|---|---|---|
| `:206` "R takes a pawn a bishop defends" | `4k3/8/8/8/8/b7/1p6/1R2K3 w - - 0 1` | `4k3/6p1/8/8/8/b7/1p6/1R2K3 w - - 0 1` |
| `:218` "mirror: r takes a pawn a bishop defends" | `1r2k3/1P6/B7/8/8/8/8/4K3 b - - 0 1` | `1r2k3/1P6/B7/8/8/8/6P1/4K3 b - - 0 1` |

**Why it still guards what `ABC-079` meant.**
- **Same theme:** a rook takes a pawn that a bishop defends.
- **Not in check, and the capture is legal**, on both trees.
- **The bare leaf plays the capture at depth 1** on both trees, so A1's differential (≥ 23/24
  bare) is intact. With quiescence, the engine declines it at depth 1 and at depth 3.
- **The recapture is now genuinely losing at every depth.** It leaves K v K+B+P, and the bishop is
  the right colour for the pawn's queening square. So no deeper search can find a dead draw in
  it, unlike adding a pawn for the capturing side (C1/C3, `…d25a0383`).
- **Margin:** 370 cp on base, 280 cp on the branch, against 50 / −40 for the old pair.

**Its mutant still reds** (`…39129557`):
- With quiescence swapped out of A1's arms, the depth-1 row reads 24 > 1, red.
- With the replacement in place, the whole file is green: 37 / 37 on `SEARCH_DEEP=1`, depth 3 at
  0/24.

**The level stays.** `Math.floor(HANGING_CORPUS.length / 20)` is untouched and the corpus stays at
24, so `A8`'s "no class-R literal edited" still holds for this row. In `A8`'s ledger, row 21 is
recorded as a re-found fixture (F-style), with this note as the measurement.

## Not changed, named

- **Four other pairs recapture into a dead draw.** They hold by 390–655 cp on the branch.
  `ADR-0028` decision 2 applies if `ABC-083` thins them.
- **The "R takes a bishop a pawn defends" pair is in check** (pre-existing). Routed in
  `…33e5e0a3`.
