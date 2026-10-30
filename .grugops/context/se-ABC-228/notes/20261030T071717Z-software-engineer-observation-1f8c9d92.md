---
id: 20261030T071717Z-software-engineer-observation-1f8c9d92
kind: observation
by: software-engineer
at: 2026-10-30T07:17:17Z
verified_by: 
confidence: high: one ALONE real-clock read per board on base; head counts are deterministic and equal the ADR's reference; the 1.09 factor is the ADR's, indicative
refs:
  - se-ABC-228
  - ABC-228
  - EPIC-010
  - ADR-0053
  - grugops/ABC-228
  - 9bd3c519
  - 61d5d629
  - OQ-228-1
  - NFR-005
  - G6
supersedes: 
seal: sha256:7c43106caf45ed4120b9d65ed77c1309fa17886a1f7fe0323598990ca91d77a0
---

# Software Engineer observation, se-ABC-228: the A8 forecast reads 64.7 % and 98.3 %, both at or below 100 %. G6 is read by its rule; (ii) is not built; A9 does not run

`ADR-0053` decision 9's `G6` forecast (`ABC-228` `A8`), on this ticket's own base: `main` `61d5d629`, which carries `ABC-235`, `ABC-240` and `ABC-230`. It ran ALONE, before any graded `G6` or smoke, in plain `node`. No cutechess ran and no game was played. The method and the readings are in `raw/` (`a8-base.jsonl`, `a8-head-frozen.jsonl`, `scripts/timed.mjs`, `scripts/forecast.mjs`).

## Host (ALONE)
- At start: load1 0.20, Tctl 35.2 °C, 0 `cutechess-cli`, 0 vitest (`pgrep -f "[/]vitest"`).
- Between the two boards: load1 0.33, Tctl 66.6 °C. After both: load1 0.39, Tctl 68.5 °C. The host was clear throughout.

## Base, the real clock, one `chooseMove` per board at 3 000 ms (`git archive 61d5d629`)
| board | completed depth | nodes | elapsed | move, score |
|---|---:|---:|---:|---|
| kiwipete | 8 | 2 600 813 | 3 000 ms | 20-80, −84 |
| position-6 | 10 | 2 594 402 | 3 000 ms | 34-67, 73 |

## Head, a frozen clock (`now: () => 0`, `maxDepth` = base's depth), on the build's production code, read before its tests were written and re-read at `9bd3c519` with identical counts
| board | head nodes | door nodes (= base frozen) | head / door | head × 1.09 / base's 3 s nodes |
|---|---:|---:|---:|---:|
| kiwipete, d8 | 1 543 477 | 1 259 463 | 1.226× | **64.7 %** |
| position-6, d10 | 2 340 431 | 1 765 861 | 1.325× | **98.3 %** |

- Head's nodes equal the ADR's reference build exactly, on both boards (finding 4: 1 543 477 and 2 340 431). The door equals base's frozen `chooseMove` on both boards, nodes and score.
- The node rate rose. Base now completes kiwipete in 2.60 M nodes and position-6 in 2.59 M nodes at 3 s. The ADR's reference was 1.81 M and 1.88 M.

## The rule's branch
- **Both boards are ≤ 100 %.** By decision 9, `G6` is read by its rule, and `OQ-228-1`'s "3s to 4s" clause does not apply.
- **Scope 5 (reading (ii)) is NOT built.** `LEVELS`, `DEFAULT_BUDGET_MS`, `HARD_CEILING_MS` and `tools/rating/rating.ts` are untouched. **`A9` does not run.** The 133 % stop is not reached.
- **The position-6 margin is thin:** 98.3 % rests on one real-clock run and on the ADR's indicative 1.09 CPU-per-node factor. The graded `G6` (5 interleaved runs, the median) is QE's. It decides, and a FAIL there is the ticket's NFR-005 risk, not this forecast's.
