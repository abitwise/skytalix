---
id: 20261102T003352Z-architect-design-observation-1e9c2549
kind: observation
by: architect-design
at: 2026-11-02T00:33:52Z
verified_by: 
confidence: high (deterministic fixed-depth and frozen-clock runs on a scratch copy of main ecc0331f; door counts reproduce se-ABC-238's to the node); wall times informal
refs:
  - arch-ABC-264
  - grugops/arch-ABC-264
  - ecc0331f
  - ABC-264
  - EPIC-011
  - ADR-0059
  - ADR-0050
  - ADR-0058
  - ADR-0026
  - NFR-005
  - NFR-008
  - ABC-121
  - ABC-208
  - se-ABC-238
  - arch-phase1-replan/20261102T000240Z-architect-design-observation-c0e9f5a0
supersedes: 
seal: sha256:0951e3b1e4598eb59304c4d9b001019e30cffad97c6d59b78d95c3d35137a2c2
---

# ABC-264 probe: reverse futility at 120 cp a ply, depth 1-3, guard 3, returning beta at null-window nodes needs 0.59-0.64x the door's nodes at depth 8 (both recursions); drift 97.33 % within 25 cp, max 107; mate floor 0/189; zugzwang 7/7; G1 54/58

## Instrument (scratch, outside the repo, deleted after)
- A copy of main ecc0331f src/ with one switchable predicate (margin, depth range, guard count, return, PV/null-window, order against null move) called in both negamax bodies, after the table probe. Door = the predicate off = today's search() / chooseMove.
- Deterministic runs only (fixed depth; chooseMove with maxDepth on a frozen clock), each under flock of the host lock, each <= 45 s. Door counts at depth 8 reproduce se-ABC-238: kiwipete 1 116 785, position-6 1 602 457.

## Chosen rule (120 cp x depth, depth 1-3, fewer than three non-pawn pieces guard, |beta| < MATE_FLOOR, not in check, null-window only, before the null move, returns beta, stores nothing)
- Depth 8, head / door: search() kiwipete 0.5901 (658 971), position-6 0.6373 (1 021 190); chooseMove kiwipete 0.6173 (972 596 / 1 575 537), position-6 0.6282 (299 183 / 476 244). Root move and score unchanged (kiwipete search() -60 -> -59).
- Also: position-4 0.4584 / 0.3470, position-5 0.3651 / 0.4273, startpos 0.9259 / 1.0350 (level position, margin rarely holds: 2 747 cuts of 40 156 tries; noise).
- Drift d5 on ABC-121's 190 vs the door: 97.33 % of 187 within 25 cp in both recursions; max 107 cp (kiwipete/f3g4 1142 -> 1035); 0 mate-status flips, 0 sign flips.
- Mate floor, 287 corpus, search() d5: 189 door mates, 0 violations, 0 longer.
- ADR-0050 d9 zugzwang rows (chooseMove at 9/11/12/8/8/8/8): 7/7 played.
- G1 (PUZZLE_DEEP=1, scratch, rule on): 54/58, baseline 54/58, no NEWLY line.
- Firing, search() d6 on the 190: 571 398 cuts / 893 168 tries; 5.8 % of 9 917 583 head nodes; nodes 0.556x the door.
- Wall, informal (search() d8, 3 runs each): kiwipete 1 255 -> 783 ms (0.62x), position-6 1 867 -> 1 250 ms (0.67x).

## Variants (A4 search() kiwi/pos6 | chooseMove kiwi/pos6 | drift search()/chooseMove within 25; max | zugzwang)
- 75 cp: 0.514/0.530 | 0.448/0.535 | 95.72/95.19 %; 107 | 7/7
- 100 cp: 0.557/0.578 | 0.557/0.634 | 96.26/95.72 %; 107 | 7/7
- 150 cp: 0.644/0.672 | 0.709/0.660 | 97.86/97.86 %; 99 | 7/7
- 120 depth 1-5: 0.581/0.631 | 0.617/0.618 | 97.33 %; 107 | 7/7. 150 depth 1-5: 0.635/0.669 | 0.709/0.654 | 97.86 %; 99
- guard 0 or 1 piece (100 cp): zugzwang.004 lost (Bf6). Guard 2: zugzwang.005 lost (Ne2). Guard 3: 7/7.
- return static score (120): 0.566/0.550 | 0.685/0.629 | 94.65/95.19 %; max 166 (search()).
- PV nodes too (120): 0.590/0.637 | 0.637/0.628 | 96.79 %; 107.
- after the null move (120): 0.737/0.718 | 0.778/0.740 | 97.33 %; 107.
- planted no mate-band guard (120): identical to the chosen rule on every instrument (blind spot).
- planted no check guard (120): 0.581/0.624 | 0.616/0.618 | 93.58/95.19 %; max 345/365.
- Every variant: mate floor 0 violations.

## Scope
Measurements only. Nothing committed to src/; the scratch tree, driver and outputs are deleted.

## Risks
- Two-position A4 readings; deterministic, but a different rule implementation changes counts. The build's counts should equal the head counts above to the node.
- The 120 cp margin is in today's evaluation scale; E1/E2 re-scale it.
- Wall ratios are informal (not G6).
