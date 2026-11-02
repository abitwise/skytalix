# arch-phase2-rebase probe: ADR-0060's rule on main misses A3's 27 cp cap (63 cp, search(), position-6/g5h6) and A4 (a) on chooseMove position-6 (0.8699 > 0.85); A4 (b) holds by 0.0026 ply (+0.2526). Reverse futility (4d1c0616) buys +0.70 ply at 47 000 nodes yet read -41.9 Elo

## Instrument (scratch, outside the repo, deleted after)
- ADR-0060 on main: `git archive` of main `5ffbae25` src (equal to `0b73f51d`, no reverse futility) + arch-phase2-p1's `probe.ts` unchanged; `patch_main.py` = arch-phase2-p1's patch with the P3/P5 knobs removed (they gated on reverse futility). The P1 predicate and both call sites are unchanged.
- Reverse futility reach: `git archive 4d1c0616` (unpatched, 120 cp) and a copy with `REVERSE_FUTILITY_MARGIN = 150`; `rf.ts` reads `chooseMove` vs `chooseMoveWithoutReverseFutility` at `maxNodes`, frozen clock, on the 184 non-endgame rows of ABC-121's 190.
- Every batch under `flock <host-test.lock> timeout 300`; deterministic counts only; no timing. Raw: `raw/probe/` (README, patch, driver, runs, outputs m1-m6, r1, d1).
- Instrument check: the main door reproduces 1 116 785 / 1 602 457 (search() d8 kiwipete / position-6) and 1 575 537 / 476 244 (chooseMove to 8), ADR-0059's QE-confirmed door counts, to the node.

## ADR-0060 decision 1 on main (bars unchanged)
- A4 (a) d8 head / door: search() kiwipete 0.7605 (849 358), position-6 0.7385 (1 183 439); chooseMove kiwipete 0.7334 (1 155 460), **position-6 0.8699 (414 286 / 476 244): MISSES <= 0.85**. On 4d1c0616: 0.7238 / 0.7086 / 0.6795 / 0.8020.
- A4 (b) reach on the 190 at 47 000 nodes: 5.558 -> 5.811 (+0.2526; sums 1 056 / 1 104), 44 deeper, 2 shallower, 15 moves differ: met by 0.0026 (bar +0.25). 20 000 nodes: 4.426 -> 4.642 (+0.216). On 4d1c0616: +0.305.
- A3 drift d5 vs door: search() 99.47 % within 25 cp, **max 63 cp (position-6/g5h6 319 -> 382): MISSES the 27 cp cap**; chooseMove 100 %, max 18 (startpos/g2g4). 0 sign flips, 0 mate-status flips both.
- A3 mate floor door d4 vs head d5: 0 / 163. Same-depth report 2 / 189.
- A3 zugzwang: 7 / 7 (node counts identical to 4d1c0616; zugzwang.004 h3h4 at d11, 627 208; at d10 head g7f6, door h3h4).
- A5 G1: 54 / 58, no NEWLY line (door 54 / 58).
- Reports: d8 position-4 0.814 / 0.712, position-5 0.660 / 0.796, startpos 0.627 / 0.748 (search() / chooseMove); d6 kiwipete 0.580 / 0.661, position-6 0.817 / 0.835. Firing d6 on the 190: 11.0 % of non-first moves reduced, 40.9 % of them by 2 (door 9.9 %); nodes 0.843x.

## Variants on main (d8 search() kiwi/pos6 | chooseMove kiwi/pos6 | drift max search()/chooseMove)
- uncapped 0.685/0.693 | 0.599/0.769 | 63/18. uncapped killer -1 0.694/0.726 | 0.612/0.826 | 63/21. textbook 0.770/0.746 | 0.695/0.975 | 28/26. no PV/killer 0.715/0.686 | 0.638/0.686 | 63/23. 1.0/1.75 0.653/0.599 | 0.578/0.770 | 63/11. flat 2/1 0.799/0.908 | 0.738/0.867 | 30/21. textbook floor 1 0.753/0.791 | 0.672/0.895 | 30/21. None meets both missed bars. All >= 98.93 % within 25 cp, 0 sign flips.
- Diagnostic (not a candidate), decision 1 with PV -2: the 63 cp row goes (max 28 / 26), so it comes from 2-ply reductions at PV nodes; position-6 saves nothing (search() 1.037x, chooseMove 0.930x; kiwipete 0.842 / 0.772).

## Reverse futility reach (for the ABC-264 retry ruling)
- 120 cp (ABC-264 as built): 47 000 nodes 5.451 -> 6.152 (+0.701), 112 deeper, 0 shallower, 9 moves differ; 20 000 nodes +0.728. Over all 190 (the six endgames cannot fire: < 3 non-pawn pieces) +0.68.
- 150 cp (F1's fallback): 47 000 nodes +0.614 (103 deeper); 20 000 nodes +0.668.

## Scope
Measurements only; nothing committed to src/. Scratch trees deleted.

## Risks
- Two-board A4 bars and a 1.5x-of-max drift cap are fragile across bases: one board and one position decide both misses here.
- The reach driver for reverse futility covers 184 rows; the 190 figure is by argument (guard), not read.
- Node ratios and reach are proxies; strength is C2′'s.
