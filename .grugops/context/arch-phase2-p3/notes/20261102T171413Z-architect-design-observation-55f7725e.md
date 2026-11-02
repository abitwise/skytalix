---
id: 20261102T171413Z-architect-design-observation-55f7725e
kind: observation
by: architect-design
at: 2026-11-02T17:14:13Z
verified_by: 
confidence: high (deterministic fixed-depth, maxDepth and maxNodes runs on a scratch copy of main src f2388e40; the door reproduces ADR-0059's door counts and the rebuilt reverse-futility knob 4d1c0616's head counts to the node); the audit samples the 190-row corpus, not games
refs:
  - arch-phase2-p3
  - grugops/arch-phase2-p3
  - EPIC-011
  - P3
  - P4
  - P5
  - P6
  - P1
  - P2
  - ADR-0061
  - ADR-0056
  - ADR-0059
  - ADR-0060
  - ADR-0050
  - ADR-0026
  - ABC-264
  - ABC-121
  - ABC-233
  - f2388e40
  - cfff6993
  - 4d1c0616
  - arch-phase2-rebase/20261102T151839Z-architect-design-decision-f9f440c9
  - arch-phase2-p1/20261102T144713Z-architect-design-observation-35bd3967
  - NFR-005
  - NFR-008
supersedes: 
seal: sha256:4f7aceab02f7585dc6a5faebbde55a81235afd29dfc69063f5c259b7e281e620
---

# Phase 2 on main, each item alone: P3 futility (150/350/550, d<=3) 0.79-0.83x at depth 8, +0.279 ply at 47 000 nodes, every safety row clean; P4 drifts (87.7 %) with 11.5 % audit flips; P5 depth-gated (+0.06 ply); P6 loses zugzwang.004 and drifts 345 cp. A cut audit finds reverse futility (ABC-264) right at 99.92 % of its cuts

## Instrument (scratch, outside the repo, deleted after)
- `git archive` of the branch `src/` (tree f2388e40 = main at dispatch cfff6993 and at commit), patched by `raw/probe/patch_p3.py` with knobs in BOTH recursions; all knobs 0 = main node for node. Driver `raw/probe/probe3.ts`.
- Door check: 1 116 785 / 1 602 457 (search() d8 kiwipete / position-6), 1 575 537 / 476 244 (chooseMove to 8): ADR-0059's door counts. Reach door 5.558 at 47 000 nodes (= ADR-0060's main figure). G1 door 54/58.
- Calibration: a rebuilt reverse-futility knob (120 cp a ply) reproduces 4d1c0616's head counts to the node: 658 971 / 1 021 190 / 972 596 / 299 183.
- Deterministic runs only, each under flock of the host lock with timeout 300; no timing. Two batches queued behind another agent's lock holder; nothing of theirs was touched.

## Per item (depth 8 search() kiwi/pos6 | chooseMove kiwi/pos6 | reach +ply at 47k | drift d5 search()/chooseMove | mate d5 | zugzwang | audit flips; >=200 cp)
- P3 futility 150/350/550 d<=3 (chosen): 0.7958/0.7876 | 0.8295/0.8220 (888 786 / 1 262 046 / 1 306 981 / 391 451) | +0.279 (5.558 -> 5.837; 54 deeper, 1 shallower, 6 moves differ); 20k: +0.416 | 100 %, max 10 / 100 %, max 0 | 0/189 | 7/7 | 0 of 2 943; 0 | G1 54/58 no NEWLY. Fire d6 on the 190: 0.803x nodes, 30 272 fire nodes, 901 655 moves skipped.
- P3 variants: 150/350/550/750 d<=4 0.752/0.774 | 0.799/0.798 | +0.321 | 100 %, 10 / 100 %, 0 | 0 | 7/7 | 0 of 3 021. 100/200 0.797/0.801 | 0.871/0.837 | +0.268 | 100 %, 0 | 0 | 7/7 | 3 of 3 227 (d2 0.27 %, max 110 cp) | G1 54/58. 200/400/600 0.813/0.809 | 0.844/0.830 | +0.263 | audit 1 of 2 700 (111 cp). 150/300 0.832/0.819 | 0.858/0.855 | +0.226. 150/350 0.840/0.835 | 0.867/0.872 | +0.210 | 0 of 2 880. 150 d=1 0.952/0.947 | 0.953/0.948 | +0.079 | 0 of 1 895.
- P4 move-count (limit 3 + d^2): d<=3 0.721/0.756 | 0.801/0.687 | +0.426 (38 root moves differ) | 87.7 %, 79 / 95.7 %, 82 | 0 | 7/7 | 11.5 %; 8. d<=2 0.817/0.973 | 0.922/0.754 | +0.342 | 89.3 % / 95.7 % | 0 | 7/7 | 11.9 %; 15. d=1 0.986/1.030 | 0.946/1.096. (3+d^2)/2 d<=3 0.683/0.654 | 0.771/0.636 | +0.500 (44 differ). Depth-8 root scores swing up to 38 cp.
- P5 null move: R = 3 + floor(d/4) 0.947/0.930 | 0.925/0.883 | +0.058 | 100 %, 0 | 0 | 7/7 | 0 of 2 076 (door noise 1.25 %). floor(d/3) 0.936/0.927 | 0.922/0.644 | +0.089. Eval term only (1 per 200 cp, cap 2) 0.997-0.998. Fire d6 0.950x.
- P6 razoring: 250/450/650 d<=3 0.792/0.812 | 0.793/0.833 | +0.305 | 95.7 %, max 345 (position-5/h1f1) / 97.3 %, 92 | 0 | 6/7 (zugzwang.004 plays g7f6) | 1.98 %; 6 (one missed mate, 29 495). 300/500 0.875/0.884 | 0.858/0.903 | +0.221 | 97.9 % / 98.4 %, 92 | 0 | 6/7 | 1.43 %; 4. 300 d=1 0.962/0.960 | 0.936/0.975 | +0.084.
- Zugzwang node counts, chosen P3 vs door at recorded depths: zugzwang.004 905 900 vs 587 282 (1.54x, still h3h4); zugzwang.005 1 310 019 vs 2 412 618; the other five 0.71-0.87x.

## The cut audit (the tactical check)
- search() at depth 6 over the 190 + 6 endgames; every N-th node where the rule fires is recorded (FEN, depth, window); each sampled node is searched fresh three times (rule on at its null window, rule off at the same window, rule off full-window = reference v). A flip = rule and door on opposite sides of alpha; error = v beyond the claimed bound.
- Reverse futility 120 cp/ply (ABC-264's rule), 28 486 sampled cuts: 24 flips (0.08 %); 5 >= 100 cp, 1 >= 200 cp (201), 0 >= 300 cp; d1 23/24 380, d2 1/3 731, d3 0/375. Sensitivity: 40 cp/ply 0.25 % (one 386 cp promotion threat), 0 cp 0.42 %; 120 cp to depth 6 0.15 %.
- Reading: at its cut nodes reverse futility agreed with the depth-d search it replaced 99.92 % of the time and was never wrong by a piece. ADR-0059 item 4's "skipped forks" judgement is not supported by this instrument.

## Scope
Measurements only. Nothing committed to src/. Scratch tree deleted; patch, driver, scripts and outputs kept under raw/probe/ (README).

## Risks
- Node ratios and reach are proxies; strength is C2's to read (+-48 Elo at 95 %). P2 bought 2.5x this reach and lost.
- The audit samples the 190-row corpus (perft-style roots and children), not game positions; it is a guard against a class, not a strength predictor.
- Fresh node searches at ply 1 drop the repetition context and the in-tree table state; the door's own noise (null-window vs full-window disagreement) read 0 for every pruning item and 1.25 % for P5's deeper nodes.
