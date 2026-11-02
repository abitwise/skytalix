---
id: 20261102T144713Z-architect-design-observation-35bd3967
kind: observation
by: architect-design
at: 2026-11-02T14:47:13Z
verified_by: 
confidence: high (deterministic fixed-depth, maxDepth and maxNodes runs on a scratch copy of 4d1c0616; door counts reproduce ADR-0059's head counts to the node); P3/P5 forms untuned, ranking only
refs:
  - arch-phase2-p1
  - grugops/arch-phase2-p1
  - EPIC-011
  - P1
  - ADR-0060
  - ADR-0026
  - ADR-0056
  - ADR-0059
  - ADR-0050
  - ABC-121
  - ABC-233
  - ABC-264
  - 4d1c0616
  - NFR-005
  - NFR-008
  - NFR-009
supersedes: 
seal: sha256:6ca3a559eea2addda727a8bb14911e9a4fb07b4d1612ff739a26df6ff611207b
---

# P1 probe: a log-table LMR (1.0 + ln d x ln m / 2.0, PV -1, cap 2 plies, child depth >= 1) needs 0.68-0.80x the flat rule's nodes at depth 8 in both recursions and reaches +0.305 ply at 47 000 nodes; drift 100 % (max 18 cp), mate floor 0/163 one ply deeper, zugzwang 7/7, G1 54/58. P3 and P5 save less (0.88-0.91x, 0.83-0.99x)

## Instrument (scratch, outside the repo, deleted after)
- `git archive 4d1c0616 src` (grugops/ABC-264-fix, reverse futility in), patched with one switchable reduction predicate called in both negamax bodies (`raw/probe/patch.py`, driver `raw/probe/probe.ts`). Door = the flat ABC-121 rule = the ABC-264-fix shipped path.
- Deterministic runs only: fixed depth; chooseMove with maxDepth or maxNodes on a frozen clock (now: () => 0). Every run under flock of the host lock, each batch <= 5 min. No timing read.
- Instrument check: door counts at depth 8 reproduce ADR-0059's head counts to the node: search() kiwipete 658 971, position-6 1 021 190; chooseMove 972 596 / 299 183.

## The chosen rule (ADR-0060 decision 1)
- r = max(0, min(floor(1.0 + ln d * ln m / 2.0) - (pvNode ? 1 : 0), 2, d - 2)); m = index + 1; eligibility = the flat rule's (not root, d >= 3, index >= 3, not capture/promotion, not in check, not giving check); pvNode = alphaIn + 1 !== beta.
- Depth 8, head / door: search() kiwipete 0.7238 (476 991), position-6 0.7086 (723 582); chooseMove kiwipete 0.6795 (660 887), position-6 0.8020 (239 944). Root moves unchanged; kiwipete chooseMove score -59 -> -68, others equal.
- Depth 8 other roots (search()/chooseMove): position-4 0.799/0.702, position-5 0.768/0.762, startpos 0.563/0.565. Depth 6: kiwipete 0.596/0.741, position-6 0.935/0.829.
- Reach, chooseMove on the 190 with maxNodes: 47 000 -> mean completed depth 6.237 -> 6.542 (+0.305), 53 deeper, 3 shallower, 13 root moves differ; 20 000 -> 5.132 -> 5.374 (+0.242), 45 deeper, 2 shallower.
- Firing, search() depth 6 on the 190: 239 565 of 1 992 931 non-first moves reduced (12.0 %), 41.8 % of them by 2; door 10.9 %, all by 1; nodes 0.8819x.
- Drift d5 on the 190 vs the door: 100 % of 187 non-mate within 25 cp both recursions; max 16 (search(), startpos/b2b4 60 -> 76), 18 (chooseMove, startpos/g2g4 54 -> 36); 0 mate flips, 0 sign flips.
- Mate floor on the 287: door d4 vs head d5, 0 of 163 violations; same depth d5, 2 of 189 door mates not mates.
- ADR-0050 d9 zugzwang rows at recorded depths: 7/7; zugzwang.004 at d11 627 208 nodes (door 587 282; door finds it already at d10, head at d11).
- G1 (the puzzle runner's rule, 25 ms budget, 1 ms step): 54/58, no NEWLY line (door 54/58).

## Variants (d8 search() kiwi/pos6 | chooseMove kiwi/pos6 | reach at 47k | same-depth mate loss | zugzwang | G1)
- uncapped (same formula, no killer term): 0.575/0.681 | 0.538/0.723 | +0.337 | 2/189 | 6/7 | 54/58. zugzwang.004 found only at d13, 2 526 967 nodes = 4.30x the door's d11.
- uncapped, killer -1: 0.580/0.683 | 0.542/0.761 | +0.331 | 2/189 | 6/7 | 54/58.
- textbook 0.75 + lnd lnm / 2.25, PV -1, killer -1: 0.672/0.711 | 0.624/0.934 | +0.126 | 0/189 | 6/7.
- no PV or killer term (0.75 / 2.25): 0.618/0.666 | 0.565/0.637 | +0.352 | 14/189 | 6/7 | 53/58 (NEWLY-MISSED win material seed 5180).
- 1.0 / 1.75, PV -1, killer -1: 0.543/0.654 | 0.508/0.714 | +0.374 | 5/189 | 6/7.
- flat 2 at non-PV, 1 at PV, cap 2: 0.772/0.787 | 0.695/0.862 | +0.174 | 0/189 | 6/7 (zugzwang.004) | 54/58; drift max 30.
- textbook with floor 1: 0.660/0.752 | 0.593/0.910. 0.5 / 2.5: 0.822/0.870 | 0.743/1.059. 0.25 / 3.0: 1.130/1.357 | 1.070/1.268. textbook child depth >= 0: 0.665/0.524 | 0.631/0.945. index >= 2 (uncapped, killer -1): reach +0.347.
- Every variant's d5 drift: >= 99.47 % within 25 cp, max <= 30: the drift bar does not separate them.
- Cap sweep on zugzwang.004 (d11): every capped-at-3-or-more or uncapped log variant plays g7f6; cap 2 plays h3h4.

## Ranking-only (same instrument, each alone over the ABC-264-fix door, depth 8, search() kiwi/pos6 | chooseMove kiwi/pos6)
- P3 futility, null-window, depth <= 2, quiet non-checking moves after the first, eval + margin*depth <= alpha: 100 cp 0.883/0.880 | 0.895/0.902; 150 cp 0.907/0.887 | 0.909/0.912.
- P5 null move R = 3 + floor(depth/4): 0.958/0.947 | 0.933/0.828; R = 3 + floor(depth/6): 0.980/0.987 | 0.948/0.865.

## Scope
Measurements only. Nothing committed to src/. The scratch tree is deleted; the patch, driver and outputs are kept under raw/probe/ for reproduction.

## Risks
- The base is ABC-264-fix 4d1c0616, not main. If ABC-264 merges at a different tree, the exact counts must be re-read on main first (ADR-0060 decision 9).
- Node ratios at fixed depth and depth reached at a node budget are proxies. Strength is C2's to read (+-48 Elo at 95 %).
- The P3/P5 comparison used one untuned form each; it ranks per-depth saving, not Elo.
