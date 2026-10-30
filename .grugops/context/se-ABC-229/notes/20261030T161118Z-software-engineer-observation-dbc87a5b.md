---
id: 20261030T161118Z-software-engineer-observation-dbc87a5b
kind: observation
by: software-engineer
at: 2026-10-30T16:11:18Z
verified_by: 
confidence: high for node counts (deterministic, door equals base); medium for the real-clock base read (one ALONE run per board) and the indicative CPU factor
refs:
  - se-ABC-229
  - ABC-229
  - EPIC-010
  - ADR-0053
  - grugops/ABC-229
  - f6ff1c4a
  - 01c37946
  - G6
  - NFR-005
  - A3
supersedes: 
seal: sha256:ad059fbba269f91604e9c59319ec151bba8d1d4dcaccf7739f0bb9c5c9c1d934
---

# Software Engineer observation, se-ABC-229: the G6 forecast at 4 000 ms reads 54.8 % and 79.7 %, both at or below 100 %. No stop

`ABC-229` `A3`'s frozen-clock pre-check, by `ADR-0053` decision 9's method, with both sides at 4 000 ms (each build's own `LEVELS[5]`; ticket RE-SCORED 2026-10-30). Base is `main` `01c37946`; head is `grugops/ABC-229` `f6ff1c4a`. Both are `git archive` trees in plain `node`. It ran ALONE, before any graded `G6` or smoke. No cutechess ran and no game was played. Raw files: `raw/forecast-base.jsonl`, `raw/forecast-head-frozen.jsonl`, `raw/forecast-head-real-info.jsonl`, `raw/host.txt`, `raw/scripts/timed.mjs`, `raw/scripts/forecast.mjs`.

## Host (ALONE)
- A foreign `vitest` run in another repository was live at first. The SE waited on its pid with `kill -0` until it exited.
- Then: 0 vitest and 0 cutechess, load1 1.09 at the start and 1.08 at the end of the base read.

## Base, the real clock, one `chooseMove` per board at 4 000 ms
| board | completed depth | nodes | elapsed | move, score |
|---|---:|---:|---:|---|
| kiwipete | 8 | 3 131 880 | 4 002 ms | 20-80, −59 |
| position-6 | 10 | 3 200 795 | 4 000 ms | 34-67, 73 |

## Head, a frozen clock (`now: () => 0`, `maxDepth` = base's depth)
| board | head nodes | door nodes (= base frozen) | head / door | CPU per node, head / door (indicative) | head × 1.09 / base's 4 s nodes |
|---|---:|---:|---:|---:|---:|
| kiwipete, d8 | 1 575 537 | 1 543 477 | 1.0208× | 0.967 | **54.8 %** |
| position-6, d10 | 2 340 567 | 2 340 431 | 1.0001× | 1.012 | **79.7 %** |

- The door equals base's frozen `chooseMove` on both boards, in nodes and score. Head's move and score equal the door's on both boards: 20-80 at −59, and 34-67 at 73.
- The 1.09 factor is the ADR's evasion figure, kept as the conservative method. The measured CPU per node for this change is about 1.0, so the readings with that factor are 50.3 % and 74.0 %.
- Informative only, not the forecast: head's own real-clock `chooseMove` at 4 000 ms, run once, completed d8 (3 022 573 nodes) and d10 (3 089 179 nodes). That is base's depth on both boards.

## The rule's branch
- **Both boards are ≤ 100 %: no STOP.** `G6` is QE's to grade: 5 interleaved runs, both sides at 4 000 ms.
- The reference was 1.019× / 1.000× (`ADR-0053` d9). This build reads 1.021× / 1.000× on the engine path at G6 depth.
