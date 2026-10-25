---
id: 20261025T042840Z-architect-design-observation-00c6a18d
kind: observation
by: architect-design
at: 2026-10-25T04:28:40Z
verified_by: 
confidence: high (deterministic frozen-clock counts; identity tree equals base); the throughput figures are an estimate, UNKNOWN - verify
refs:
  - ABC-205
  - EPIC-008
  - NFR-005
  - ADR-0031
  - ABC-083
  - ABC-207
  - ABC-215
  - G6
  - S1
  - QE-205-a
  - QE-205-b
  - QE-205-c
  - plans/tickets/ABC-205-king-safety-bites-while-queens-are-on-and-the-king-table-is-tapered.md
  - qe-ABC-205/20261025T041540Z-qe-e2e-decision-234d9814
  - qe-ABC-205/20261025T041540Z-qe-e2e-observation-35de132c
  - qe-ABC-205/20261025T041540Z-qe-e2e-failed-attempt-a44d9079
  - qe-ABC-205/20261025T041730Z-orchestrator-decision-4561be39
  - owner-word-2026-10-24/20261024T093000Z-orchestrator-decision-4c3f7639
  - grugops/arch-rule-ABC-205-g6
  - ffa0a5e8
  - b5d5cea5
  - d5690c5c
supersedes: 
seal: sha256:5609f4364491a259462d9c56bccb79c2881706797e7491487892562afa15bc3a
---

# Architect/Design: ABC-205 G6 STOP probes. Frozen-clock node counts for 11 variants of the forms, plus relation values. No timing

Task `arch-rule-ABC-205-g6`, records only. Branch `grugops/arch-rule-ABC-205-g6` from `grugops/qe-ABC-205` `ffa0a5e8`.
Trees: `git archive` of base `d5690c5c` and head `b5d5cea5`, into `<scratchpad>/arch205g6/trees/`. Never `src/`.
Plain node v26.11.1. No real-clock search, no G6 run, no game. The 3-s node figures below are QE's (`…35de132c`,
`raw/g6/g6.jsonl`), read again here.

## How the variants are made
- Each variant is the head tree with up to three one-line edits in `src/evaluate.ts`:
  - **scale:** `KING_EXPOSURE_QUEEN_SCALE` set to 1, 2 or 3;
  - **no blend (B off):** `kingSquare` returns the gated middlegame value (untapered);
  - **no gate (G off):** `middlegame = table` (the castled bonus is paid whatever the shelter).
- Names: `s<scale>` plus `-B` (blend on) and `-G` (gate on). Head is `s3-BG`.
- **Identity check:** `s1` (scale 1, no blend, no gate) equals base in all 6 cells and in every relation value.
  `head`, `s3` and `s1-BG` reproduce QE's head, scale-only and taper-only counts exactly.
- Scripts: QE's `nodes.mts`, `values.mts` and `qcell.mts`, plus `mk.sh` and `run.sh`, in `<scratchpad>/arch205g6/probe/`.
  Not committed.

## Nodes to complete depth k (`chooseMove`, `now: () => 0`, `maxDepth: k`)
| tree | kiwipete d6 / d7 / d8 | position-6 d6 / d7 / d8 | position-6 d8 against base |
|---|---|---|---|
| base | 231 536 / 566 233 / 1 638 196 | 169 685 / 644 469 / 1 451 759 | — |
| head `s3-BG` | 210 025 / 526 814 / 1 584 428 | 165 967 / 618 633 / 1 522 790 | +4.89 % |
| `s3-G` | 210 130 / 528 664 / 1 587 642 | 166 132 / 618 829 / 1 519 473 | +4.66 % |
| `s3-B` | 211 335 / 530 216 / 1 594 250 | 168 764 / 626 794 / **1 444 376** | **−0.51 %** |
| `s3` (scale only) | 211 646 / 530 989 / 1 592 628 | 168 430 / 626 574 / 1 450 539 | −0.08 % |
| `s2-BG` | 209 603 / 544 652 / 1 607 868 | 169 726 / 620 752 / 1 511 329 | +4.10 % |
| `s2-G` | 209 613 / 543 549 / 1 615 110 | 168 154 / 618 552 / 1 499 047 | +3.26 % |
| `s2-B` | 209 764 / 545 178 / 1 590 387 | 171 300 / 628 010 / 1 524 617 | +5.02 % |
| `s2` | 209 759 / 545 676 / 1 599 309 | 170 965 / 628 140 / 1 524 326 | +5.00 % |
| `s1-BG` (taper only) | 230 383 / 565 053 / 1 636 838 | 168 797 / 617 409 / 1 498 231 | +3.20 % |
| `s1-G` | 231 091 / 562 742 / 1 633 807 | 167 993 / 617 556 / 1 515 439 | +4.39 % |
| `s1-B` | 231 898 / 566 457 / 1 643 189 | 169 794 / 644 574 / 1 456 149 | +0.30 % |
| `s1` (identity) | = base | = base | 0 |

- **The gate carries the depth-8 growth on position-6, not the blend.** Each gate-on row is +3.2 to +5.0 %. With the
  gate off, scale 3 reads −0.08 % and −0.51 %, and scale 1 reads 0 % and +0.30 %. QE's "the taper carries most" is the
  gate half of the taper.
- **The tree size does not move monotonically with the constant.** Scale 2 alone is +5.00 %; scale 3 alone is −0.08 %.
  Picking a constant for this board would tune to the gate's benchmark, not to strength.
- **Every variant completes depth 7 in fewer nodes than base on both boards** (position-6 d7 −2.5 to −4.1 %).
- **No build reaches depth 8 on kiwipete.** Every variant needs 1.58–1.64 M nodes; base and head searched
  1.22–1.29 M in 3 s.

## What a variant needs to tie base on position-6 (an estimate, not a reading)
- Base's 3-s runs searched 1 444 505–1 457 817 nodes (median 1 452 697). Its depth-8 need is 1 451 759, so it sits
  within ±0.5 % of its edge. It reached 8 in 3 of 5 runs.
- Head searched 1.84 % fewer nodes than base in 3 s on position-6 (mean 1 424 365 against 1 451 059). On kiwipete the
  figure is 4.03 %. That is the throughput cost of the eval, with `G2` +7.2 % / +8.6 %.
- A variant reaches depth 8 in the median run only if its throughput cost is below 1 − (its d8 need / 1 452 697):
  - **`s3-B`: below 0.57 %**;
  - **`s3`: below 0.15 %**;
  - every gate-on variant: only if it searches faster than base (its need is above base's best run, 1 457 817).
- Each variant's throughput cost is `UNKNOWN - verify`: it needs a real-clock reading. This task takes none.
  - Head's cost is 1.84 %. The blend is part of head's cost.
  - A scale-only build still adds the two queen flags and a multiply per king.
  - **So every variant is predicted to miss "≥ base" on position-6 whenever base's median is 8.**
  - This is a prediction from deterministic counts and QE's one reading.

## Relation values (`evaluate`, deterministic; the page's `A1`–`A3b`)
| tree | `A1` strict (q > r) | `A2` ending e4 > g1 | `A3` drops > base (31, 87) | `A3b` > 21 | quiescence position-6 d1 (level 16x) |
|---|---|---|---|---|---|
| head | 8 of 8 | 65 > −2 MET | 111, 187 MET | 40 MET | 10.96x |
| `s3-B` | 8 of 8 | 65 > −2 MET | 101, 157 MET | **21, red** | 10.87x |
| `s3` | 8 of 8 | **−85 < −7, red** | 101, 157 MET | **21, red** | 11.02x |
| `s2-BG` | 8 of 8 | 65 > −2 MET | 76, 152 MET | 40 MET | 10.04x |
| `s1-BG` | **4 of 8** (e1 rows equal) | 65 > −2 MET | 41, 117 MET | 40 MET | 9.26x |

- `s3-B` drops the gate: `A3b` reds, as the design's gate-off mutant does. That removes scope item 2's second sentence.
- `s3` drops the taper: `A2` and `A3b` red. That removes scope item 2.
- `OD-205-1`'s accepted 16x cell holds on every variant. The `OD-205-2` drift maximum (118 cp) is not re-read on the
  variants (the 190-position corpus run is not taken here): `UNKNOWN - verify`.

## Not run
- Any real-clock search, `G2`, `G6`, `G11`, D, a deep lane, or the drift corpus.
