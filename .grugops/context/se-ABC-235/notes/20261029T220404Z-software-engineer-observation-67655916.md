---
id: 20261029T220404Z-software-engineer-observation-67655916
kind: observation
by: software-engineer
at: 2026-10-29T22:04:04Z
verified_by: 
confidence: medium (indicative; one host under load1 2-4; QE reading decides A3)
refs:
  - ABC-235
  - EPIC-010
  - arch-ABC-235/20261029T205200Z-architect-design-decision-7fc1b90c
  - arch-ABC-235/20261029T205200Z-architect-design-decision-eebca902
  - grugops/ABC-235
  - a37f1d87
  - dcbad73d
  - 7f3f0fda
  - f9576af3
  - ABC-227
  - NFR-005
  - ADR-0003
  - OD-235-1
supersedes: 
seal: sha256:6c3f91d88b78a3a69e0f3fe68b4c19af2d99a867be556d7baff432c882367bac
---

# Software Engineer observation, se-ABC-235: A3 nps per cut, indicative (QE's interleaved reading at the tip decides)

Method (`ABC-227`'s): one fresh process per search, `chooseMove` at 3 000 ms on the real clock, `nps = nodes / elapsedMs`. Single processes only, never two at once. Builds interleaved (previous, current) 5 times per board, boards kiwipete, position-6, start. `pgrep -x cutechess-cli` was empty before every run (checked by the script, which aborts otherwise). load1 recorded per run. Host: Linux, 24 cores, Node v26.12.1; other agents' work was running, so the load is not zero. Medians below, per board.

| cut | against | kiwipete | position-6 | start | load1 | bar ≥ 3 % | kept |
|---|---|---|---|---|---|---|---|
| 1 king square | base `a37f1d87` | 574 906 → 618 788 (**1.076x**) | 605 046 → 659 318 (**1.090x**) | 479 921 → 510 812 (**1.064x**) | 2.23-3.61 | all three | yes |
| 3 generateCaptures | cut 1 `dcbad73d` | 623 908 → 682 276 (**1.094x**) | 668 875 → 704 139 (**1.053x**) | 500 060 → 530 262 (**1.060x**) | 2.11-3.78 | all three | yes |
| 5 pawn memo | cut 3 `7f3f0fda` | 676 132 → 758 394 (**1.122x**) | 698 230 → 784 246 (**1.123x**) | 525 826 → 555 356 (**1.056x**) | 2.73-4.27 | all three | yes |
| tip | base | 544 879 → 692 858 (**1.272x**) | 612 555 → 786 032 (**1.283x**) | 473 619 → 550 577 (**1.163x**) | 2.74-3.45 | A3 bar ≥ 1.10x on two, ≥ 1.00x on third: met in this reading | — |

Completed depth was equal in every pair: kiwipete 8, position-6 10 and start 10, in all 5 runs of every build. This is indicative of G6 ("≥ base", floor 6) only. G6's graded reading is QE's 5 interleaved runs per its pre-registration.

Cut 1 re-opens the hoist `ADR-0003` § Context recorded at 0.99x / 1.08x per `legalMoves` call. Under ABC-235's ≥ 3 % per-board bar it moved every board's median by 6.4-9.0 % here, so the drop rule did not fire. `OD-235-1` stays the owner's INFO with the veto open; on a veto, cut 1 drops and 3 and 5 stand.

Raw: scratch `se-235/nps-cut1.jsonl`, `nps-cut3.jsonl`, `nps-cut5.jsonl`, `nps-tip.jsonl` (not committed; host-specific).
