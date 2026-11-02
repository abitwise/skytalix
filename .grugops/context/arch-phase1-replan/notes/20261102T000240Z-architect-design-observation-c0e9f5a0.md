---
id: 20261102T000240Z-architect-design-observation-c0e9f5a0
kind: observation
by: architect-design
at: 2026-11-02T00:02:40Z
verified_by: 
confidence: high: deterministic fixed-depth readings under the host lock; the instrumented tree reproduces se-ABC-238's node counts to the node (1 109 987 / 1 116 785, 1 595 656 / 1 602 457) and its d6 hit count (262 545)
refs:
  - arch-phase1-replan
  - EPIC-011
  - ABC-238
  - ABC-237
  - ABC-257
  - ABC-258
  - ADR-0058
  - ADR-0025
  - ADR-0056
  - se-ABC-238/20261101T233711Z-software-engineer-failed-attempt-db17e44b
  - se-ABC-238/20261101T233711Z-software-engineer-observation-3beb1ada
  - grugops/arch-phase1-replan
  - 772153a7
  - NFR-005
  - NFR-009
  - ABC-209
supersedes: 
seal: sha256:3c59c2526a671f2df21d2053955f1add4babb2c7fc8fb4cd8a1f1e6a392540c0
---

# arch-phase1-replan: the four variants measured. T1 alone 0.994x, T1+T2 0.994x, T2 alone 1.000x at fixed depth 8; T1+T2+T3 across a short game 0.885x pooled

## Instrument (scratch, outside the repo, deleted after)
- A copy of grugops/ABC-238 772153a7 src/, patched in three files:
  - src/transposition.ts: counters on probeTable / tableCutoff / storeEntry; a per-slot record of the storing ply, root depth, path null-move and LMR reductions, and search id; and an unbounded shadow map of the deepest result ever stored per key.
  - Switches: T2 (the ADR-0025 amendment's rule (a)-(c)), T3 (clearTable keeps the table), and TT_BITS.
  - src/search.ts, src/engine.ts: one context call at negamax entry, one at each root iteration.
  - Node counts are unchanged by the patch (checked against se-ABC-238).
- Every run is plain node, deterministic (fixed depth, or chooseMove with maxDepth on a frozen clock), and under flock of the session's host lock; each run took 7-90 s.
- The door is the pre-ABC-238 search: T1 off, T2 off, the table cleared per search.
- The game set (variant c and the extras): three 16-ply lines from kiwipete, position-6 and startpos, each played by the door chooseMove at maxDepth 6. The engine side (plies 0, 2, ..., 16) is searched: 9 searches a game, 27 in all, chooseMove at fixed depth 8. With T3, the table is kept across a game's 9 searches.

## Fixed depth 8, nodes / door (kiwipete / position-6)
| variant | search() | chooseMove to 8 |
|---|---|---|
| (a) T1 alone | 0.9939 / 0.9958 | 0.9587 / 0.9986 |
| (b) T1 + T2 | 0.9943 / 0.9950 | 0.9466 / 1.0013 |
| (d) T2 alone | 1.0004 / 1.0028 | 0.9940 / 1.0012 |
Score and move are unchanged in every row.

## The game set, depth 8: pooled sum / geometric mean of 27 per-search ratios / searches 2-9 pooled
- (a) T1: 0.9763 / 0.9740 / -
- (b) T1+T2: 0.9532 / 0.9591 / -
- **(c) T1+T2+T3: 0.8851 / 0.9163 / 0.8772** (kiwipete 0.8485, position-6 0.9136, startpos 0.9242)
- (d) T2: 0.9726 / 0.9834 / -
- extra, T3 alone: 0.9754 / 0.9720 / 0.9727
- extra, T1+T3: 0.9101 / 0.9085 / 0.9038 (games, searches 2-9: 0.8738, 0.9313, 0.9219)
- extra, T2+T3: 0.9296 / 0.9385 / -
- **Noise:** the per-search sd of log(ratio) is 0.12-0.25. Single searches ranged from 0.56x to 1.83x. Any table change reorders moves, and node counts at depth 8 are chaotic, so a two-position bar is fragile for an effect under about 10 %.

## The game set, depth 6 (about what 100 ms reaches): pooled / geometric mean
- (a) 0.9953 / 0.9857
- (b) 0.9947 / 0.9862
- (c) 0.9633 / 0.9653
- (d) 0.9980 / 0.9981
- T3 alone 0.9604 / 0.9444
- T1+T3 0.9618 / 0.9596
- At depth 6, T1 adds nothing over T3.

## Probe statistics, depth 6 on ABC-121's 190 (non-root probes)
- **search(), door:** 1 132 357 probes, 278 519 hits.
  - A deeper result for the probed key had been stored earlier in the search on 3 275 probes (0.289 %).
  - Of those, the entry was present for 2 551, evicted by another key for 12, and overwritten by the same key at a shallower depth for 712.
- **(a):** 2 367 deeper cuts / 1 114 142 probes = 0.212 %. Evicted 8; same-key-shallower 60.
- **(b):** 2 367 / 1 113 838 = 0.213 %. Evicted 2; T2 dropped 886 of 805 589 stores.
- **(d):** 0 deeper cuts (exact depth); evicted 6.
- Nodes / door: (a) 0.9945, (b) 0.9944, (d) 0.9999.
- **chooseMove to 6, door:** a deeper result existed on 1 999 / 891 417 probes (0.224 %): present 1 369, evicted 11, same-key-shallower 619.
  - (a) 1 541 / 875 617 = 0.176 %; (b) 1 543 / 875 028 = 0.176 %, evicted 0; (d) 0.
  - Nodes / door: (a) 0.9962, (b) 0.9957, (d) 0.9995.
- **Depth 8, search() door (kiwipete / position-6):**
  - probes 60 966 / 117 453 of 1.12 M / 1.60 M nodes;
  - a deeper result existed on 79 / 599 probes, evicted 1 / 22;
  - under T1, deeper cuts 42 / 420 (0.069 % / 0.362 % of probes).

## Scope
Measurements only. Nothing committed to src/; the scratch tree, scripts and outputs are deleted.

## Risks
- The game set is three lines; per-search noise is large (above). Pooled figures carry about ±4 % (1 SE, estimate from the per-search sd).
- Variant (c) keeps the table with no age and no game token, and passes no priorKeys. The measurement says nothing about ABC-257's correctness re-checks.
