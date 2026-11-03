---
id: 20261103T101543Z-architect-design-observation-22d9d55f
kind: observation
by: architect-design
at: 2026-11-03T10:15:43Z
verified_by: 
confidence: high (deterministic maxDepth and maxNodes chooseMove runs on a scratch copy of main's src 58fa3eb4; the door reproduces ADR-0061 d9's and ADR-0065's counts to the node; 51 jobs, every exit 0)
refs:
  - arch-ABC-236
  - grugops/arch-ABC-236
  - ABC-236
  - EPIC-011
  - S1
  - ADR-0066
  - 70db0e7f
  - d5d360e1
  - arch-ABC-236/20261103T095821Z-architect-design-decision-69cfcb4a
  - ADR-0056
  - ADR-0061
  - ADR-0065
  - ADR-0050
supersedes: 
seal: sha256:1078b5e0f448864a61c1b58239332f35e3d0b06b6a7ffdcb68356294db85b6e8
---

# arch-ABC-236 results: S1 (root aspiration windows, `chooseMove`) on `main` (src `58fa3eb4`, futility in force). Every form is safe, but every form misses the pay gate. The closest, A100, reads d8 0.9836 / 0.9913 (≤ 0.95 needed on both). The mechanism fires at 100 ms: 70.4 % of nodes at 47 000 are inside aspiration passes

Architect/Design, task `arch-ABC-236`, `grugops/arch-ABC-236` from `main` `70db0e7f`. PREREG `…69cfcb4a`, committed `d5d360e1` before batch 1. Three batches under `flock <host-test.lock> timeout 3000`, one job at a time, 51 jobs, every exit 0. Counts only, no timing. Raw is under `.grugops/context/arch-ABC-236/raw/probe/` (`out1/`, `out2/`, `out3/`).

## Instrument checks (all exact)
- The door: `chooseMove` d8 1 306 981 / 391 451 (kiwipete / position-6); reach 5.837 at 47 000; zugzwang 7 / 7 with 905 900 (`.004`) and 1 310 019 (`.005`); `G1` 54 / 58. All equal `ADR-0061` d9's and `ADR-0065`'s.
- The head's iterations 1-4 equal the door's (windows start at iteration 5).

## Pay gate (`A3`): `chooseMove` maxDepth 8, head / door
| form | kiwipete | position-6 | six roots pooled |
|---|---|---|---|
| A25 (δ 25, doubling) | 0.9985 | 0.9619 | 1.0130 |
| A50 (δ 50, doubling) | 0.9950 | 0.9632 | 0.9867 |
| A100 (δ 100, doubling) | 0.9836 | 0.9913 | 0.9884 |
| A50F (δ 50, one step) | 0.9976 | 0.9632 | 0.9882 |
- **Every form misses on both roots.** The root move and score at d8 are unchanged on all six roots for every form.
- Other roots, A100: startpos 0.9978, position-3 0.9991, position-4 0.9995, position-5 0.9995. A25: startpos 1.2306, position-5 1.1682.

## Rates at maxDepth 7 over the 190 (561 windowed iterations, 9 mate-guarded)
| form | d7 ratio | fail low / high per windowed iter | iterations re-searched | wasted nodes | max passes |
|---|---|---|---|---|---|
| A25 | 1.0201 | 9.6 % / 33.3 % | 37.6 % | 14.5 % | 4 |
| A50 | 0.9887 | 2.1 % / 12.1 % | 14.1 % | 5.7 % | 3 |
| A100 | 0.9779 | 0.2 % / 2.0 % | 2.1 % | 0.9 % | 2 |
| A50F | 1.0018 | 2.0 % / 12.1 % | 14.1 % | 5.6 % | 2 |
- **Flips (a fail high then a fail low on one iteration): 0** in every run.
- **Re-search correctness** (per iteration ≥ 5, head vs door at the same depth): A50 scores 559 / 570 equal and moves 567 / 570; on its 79 re-searched iterations, 77 scores and 79 moves equal. Max difference 54 cp (position-5/d1d2 at d6, 187 → 241), in A25 / A50 / A50F. A100: 569 / 570 scores (max 5 cp), 570 / 570 moves. Mate iterations equal 9 / 9 in every form.
- **Door score swings |s_d − s_{d−1}|** (non-mate, 187 rows): d5 p50 16 / p75 40 / p90 63 / p95 82 (> 50 cp: 36, > 100 cp: 5); d6 19 / 42 / 67 / 92 (30, 7); d7 8 / 26 / 42 / 50 (9, 0).

## Reach and firing at 100 ms (47 000 nodes, the 190)
| form | reach (door 5.837) | deeper / shallower / moves differ | nodes inside aspiration passes | in failed passes |
|---|---|---|---|---|
| A25 | 5.821 (−0.016) | 6 / 9 / 10 | 70.37 % | 8.66 % |
| A50 | 5.853 (+0.016) | 4 / 1 / 1 | 70.37 % | 2.32 % |
| A100 | 5.842 (+0.005) | 1 / 0 / 1 | 70.37 % | 0.66 % |
| A50F | 5.853 (+0.016) | 4 / 1 / 1 | 70.37 % | 2.30 % |
- 186 of 190 rows start a windowed iteration. Iterations ≥ 5 hold 71.9 % of all nodes at 47 000 (51.3 % at 20 000).
- **By the pre-registered rule (≥ 10 %) it fires at 100 ms**, so a re-open's intent is GAIN.

## Safety gate (every form passes)
| form | zugzwang | `G1` | mate d5 / d6 (viol; exact) | drift d5 (within 25; max) | drift d6 (within 25; max; moves differ) | `A2` |
|---|---|---|---|---|---|---|
| A25 | 7 / 7 | 54 / 58, none newly missed | 0 of 188, 188 exact / 0 of 210, 210 exact | 99.47 %; 28 | 98.93 %; 54; 8 | 1 / 1 exact |
| A50 | 7 / 7 | 54 / 58 | same | 100 %; 0 | 98.93 %; 54; 1 | 1 / 1 exact |
| A100 | 7 / 7 | 54 / 58 | same | 100 %; 0 | 100 %; 0; 0 | 1 / 1 exact |
| A50F | 7 / 7 | 54 / 58 | same | 100 %; 0 | 98.93 %; 54; 1 | 1 / 1 exact |
- 0 mate sign changes and 0 mate / non-mate flips anywhere.
- **`A2`: only 1 of 535 positions** (the 190, `G1`'s 58, the mate corpus's 287) moves ≥ 200 cp from iteration 5 to 6 with no mate: `G1` "win material, seed 1811" (835 → 567, f1b1). Every form scores it 567 with f1b1, after 1-3 fails. The shortfall of 5 is reported, as pre-registered.
- Zugzwang scores: `zugzwang.005` reads 57 for the door at d12 and 68-80 for the heads (move unchanged); its nodes are 1.29-2.26 M against 1.31 M.

## Reports
- d7: A100 0.9904 / 0.9837; A50 1.0165 / 0.9318; A25 1.0257 / 0.9301; A50F 1.0217 / 0.9318.
- d9: A100 0.9546 / 0.9962; A50 0.9448 / 0.9798; A25 1.0083 / 0.9740; A50F 0.9460 / 0.9798.
- Reach at 20 000 (door 4.842): A100 4.842, A50 4.826, A50F 4.816, A25 4.784.
