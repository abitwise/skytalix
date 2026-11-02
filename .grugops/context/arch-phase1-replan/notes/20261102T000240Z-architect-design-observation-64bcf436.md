---
id: 20261102T000240Z-architect-design-observation-64bcf436
kind: observation
by: architect-design
at: 2026-11-02T00:02:40Z
verified_by: 
confidence: high on the counts (an exact per-hit decomposition, 0 mismatches); medium on the mechanism reading
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
supersedes: 
seal: sha256:5f9aa5ccc7b6fdc2f33f463bd032cbbe70cdecf6af96df2b7c073fe0846c4fc0
---

# Why deeper entries are rare: each source searches shallow first; LMR transpositions make 65-80 % of deeper cuts and transpositions across plies 20-35 %; eviction loses almost none

## Method
- For every hit whose stored depth exceeds the requested depth, the excess is split exactly into four terms (0 mismatches):
  - (root depth at the store - root depth at the probe): 0 within one iteration, negative across iterations;
  - (probe ply - store ply);
  - (null-move reduction on the probe's path - on the store's path);
  - (LMR on the probe's path - on the store's path).
- Each hit is attributed to every positive term.

## Counts (deeper hits that cut, under T1)
- **search(), depth 6, the 190 (2 367):**
  - LMR 1 892 (80 %); a transposition across plies 461 (19 %); both 14. Null move 0.
  - search() is one fixed-depth call, so there is no cross-iteration source.
- **chooseMove to 6, the 190 (1 541):**
  - LMR 997 (65 %); across plies 535 (35 %), of which 143 are cross-iteration; ply+LMR 9. Null move 0.
  - Every cross-iteration cut needed a transposition across plies.
- **Depth 8, chooseMove:**
  - kiwipete (63): ply+null 29, ply+null+LMR 16 (26 of the 45 cross-iteration), LMR 17, null 1;
  - position-6 (36): ply+null 18, LMR 12, ply+null+LMR 6.
- **Depth 8, search():**
  - kiwipete (42): LMR 29, ply+null(+LMR) 13;
  - position-6 (420): LMR 394, the rest 26.

## Reading
- **ADR-0058's three sources each search the shallow copy first:**
  - LMR searches the reduced child, then re-searches the same key at full depth. The re-search finds a shallower entry.
  - Iterative deepening runs depth 1 before depth 2. The same ply one iteration later asks for one ply more.
  - Null move searches its reduced subtree before the moves.
- **So a deeper-then-shallower order needs two different lines to one key,** the first less reduced than the second:
  - **LMR:** a transposition between sibling subtrees, where the later line carries one more LMR reduction;
  - **across plies:** a tempo-losing transposition to a later ply. At depth 8 a null move supplies the lost tempo, alone or with an earlier iteration;
  - **a null-move path alone:** rare (0-45 a search).
- **The rate is low:** at depth 6 on the 190, a deeper result for the probed key existed on only 0.22-0.29 % of probes.
- **Eviction is not the cause.** Another key evicted 0.4 % of those entries (12 of 3 275); at depth 8 it was 0-1 a search. The SE hypothesis's eviction half (se-ABC-238 ...db17e44b) is refuted.
  - 22 % (712) were lost to the same key re-stored shallower. That is the always-replace same-key case, which T2's rule (b) keeps.
  - Under T1 that loss falls to 60, because the deeper entry cuts first.
- **Where T1 does fire, the cuts sit low in the tree.** About 95 % of nodes are quiescence nodes, which neither probe nor store: probes are 5-7 % of nodes at depth 8.
  - Indicative saving per cut at depth 8 (door minus head, divided by cuts): about 160 nodes (search kiwipete) to about 1 000 (chooseMove kiwipete). It is chaotic, so treat it as a report.
- **Across moves the picture changes.** With the table kept (variant c), 68-72 % of deeper cuts come from entries of earlier moves:
  - kiwipete 1 891 of 2 613;
  - position-6 1 339 of 1 971.
  T1's real source is the previous move's search.

## Scope
Measured on scratch patches; nothing committed to src/.

## Risks
The attribution treats a hit with two positive terms as both. It names lines, not positions.
