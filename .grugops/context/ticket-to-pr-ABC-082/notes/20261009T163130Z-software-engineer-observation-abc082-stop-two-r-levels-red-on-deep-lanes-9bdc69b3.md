---
id: 20261009T163130Z-software-engineer-observation-abc082-stop-two-r-levels-red-on-deep-lanes-9bdc69b3
kind: observation
by: software-engineer
at: 2026-10-09T16:31:30Z
verified_by:
confidence: high
refs:
  - ABC-082
  - ABC-079
  - ABC-081
  - ADR-0024
  - src/quiescence.test.ts
  - src/transposition.test.ts
  - .grugops/context/ticket-to-pr-ABC-082/probe/hanging.ts
  - .grugops/context/ticket-to-pr-ABC-082/probe/r-rows-diagnosis.txt
supersedes:
---

# STOP: two class-R levels are red on the `SEARCH_DEEP` lanes. Handed up to Architect/Design. No level touched, no weight tuned around them

The brief's stop condition ("any LEVEL goes red → stop, report, Architect/Design rules") has
fired. Both reds are on opt-in lanes. The default lane is green (49 / 1504 / 0 skipped).

## Red 1: § Merged bars row 21, `ABC-079` `A1` deep

- **Row:** `src/quiescence.test.ts`, "with quiescence the losing move is still avoided at
  depth 3". Level: ≤ `floor(24/20)` = 1.
- **Reading:** base 0/24, branch **2/24** (`expected 2 to be less than or equal to 1`).
- **The two rows are one position and its mirror:** "R takes a pawn a bishop defends",
  `4k3/8/8/8/8/b7/1p6/1R2K3 w - - 0 1`.
  - At depth 3 the engine plays Rxb2, score **0**; e1f1 −40, e1e2 −60. Static eval −60.
  - Black's b2 is a passer on its 7th rank and now carries the 100 cp bonus.
  - Rxb2 Bxb2 leaves K+B vs K, which is insufficient material and an exact 0. So the engine gives
    the exchange for a dead draw.
- **Reading, not a ruling:** this may be a legitimate change of choice rather than a blunder.
  Whether the corpus row's "losing" label still holds under a pawn-aware evaluator is a fixture
  or level question, and it is Architect/Design's.
- The default-lane depth-1 row stays green. Its exact counts were not read separately here
  (`UNKNOWN - verify`).

## Red 2: § Merged bars row 17, `ABC-081` `A2` deep

- **Row:** `src/transposition.test.ts`, "position-6 at depth 5". Level: hit rate ≥ 15%.
- **Reading:** base kiwipete 15.95%, position-6 15.38%. Branch kiwipete 15.63%, position-6
  **14.46%**.
- The base margin was 0.38 pp; the row's own comment calls it "narrowly" above the bar.

## Sensitivity (scratch copies, NOT applied)

`r-rows-diagnosis.txt`:
- **7th-rank passed bonus 80 or 60:** still 2/24, and still 14.46%.
- **Passed term off:** 0/24, still 14.46%.

**What this means:**
- Red 1 comes from the passed term as such, not from one oversized weight.
- Red 2 comes from the doubled/isolated terms changing position-6's tree.
- Neither can be honestly cleared by re-weighting. Choosing weights to dodge a level would be
  tuning around it, which the page and the brief forbid.

## What the ruling needs to decide (not decided here)

1. **Row 21:** keep the level and re-label or replace the "R takes a pawn a bishop defends"
   pair, or rule the level, or require a term change.
2. **Row 17:** the hit-rate level on position-6 at depth 5 under an evaluator change.

`ADR-0024` decision 3's 1.5x headroom covers the `A5` ratio levels only. It does not cover
either of these.
