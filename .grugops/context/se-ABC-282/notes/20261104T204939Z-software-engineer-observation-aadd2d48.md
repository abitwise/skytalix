---
id: 20261104T204939Z-software-engineer-observation-aadd2d48
kind: observation
by: software-engineer
at: 2026-11-04T20:49:39Z
verified_by: 
confidence: high: measured on the base by the pre-registered scripts, unedited; raw files committed
refs:
  - se-ABC-282
  - ABC-282
  - ADR-0071
  - ABC-283
  - ADR-0066
  - 22931005
supersedes: 
seal: sha256:a1bb19af47a1e2e9850454caab8e0d051c348cc577122ec72695226a268d72dc
---

# b re-read on the new base, and A0's counts, sealed BEFORE A1 (c) runs (ADR-0071 D12 items 3 and 4)

Base: `main` `22931005`, `src/` tree `845f5662`. Read from a `git archive` copy in scratch, under the host lock, before any W1 line was run. The scripts are `arch-ABC-282` `raw/p1p2.mjs` and `raw/an1.mjs`, unedited. K25's hashes match the ADR (`e41a4914…0479`, `63d88b2a…0570`).

## b (item 3): 2.3, unchanged

- P1's method: frozen-clock cumulative node ratios on K25, pooled over d = 4–10: 175 ratios, median **2.3043** (p25 1.967, p75 2.834), rounded to 0.1 = **2.3**.
- Old → new: **2.3 → 2.3** (the unrounded median 2.3319 → 2.3043).
- Per depth, d = 4–10: 2.688, 2.206, 2.595, 2.208, 2.256, 2.290, 2.175. Odd d 2.262, even d 2.361.
- Inside [1.5, 6.0]. Frozen. It is not tuned; F3 binds.

## A0-1 (frozen clock, `budgetMs: 60000`, `maxDepth` d)

| position | d | move | score | nodes |
|---|---|---|---|---|
| kiwipete | 6 | e2a6 | −59 | 140 341 |
| kiwipete | 7 | d5e6 | −82 | 330 628 |
| kiwipete | 8 | d5e6 | −89 | 707 548 |
| position-6 | 6 | c3d5 | 87 | 14 570 |
| position-6 | 7 | c3d5 | 79 | 32 165 |
| position-6 | 8 | c3d5 | 71 | 101 425 |

## A0-2 (`virtualClock(1)`, `softMs` absent)

| position | budgetMs | depth | move | score | nodes |
|---|---|---|---|---|---|
| kiwipete | 50 | 5 | e2a6 | −59 | 47 384 |
| kiwipete | 200 | 6 | e2a6 | −59 | 199 960 |
| position-6 | 50 | 7 | c3d5 | 79 | 44 105 |
| position-6 | 200 | 8 | c3d5 | 71 | 196 681 |

## A0-3 (position-6, `virtualClock(1)`, `OwnBook false`, one fresh session a row)

| mode | go | line | bestmove |
|---|---|---|---|
| `level` | `go movetime 200` | depth 8, cp 71, nodes 196 681, time 201 | c3d5 |
| `level` | `go wtime 4000 btime 4000` | depth 8, cp 71, nodes 196 681, time 201 | c3d5 |
| `simple-tournament` | `go movetime 200` | depth 8, cp 71, nodes 196 681, time 201 | c3d5 |
| `simple-tournament` | `go wtime 8000 btime 8000 movestogo 40` | depth 7, cp 79, nodes 69 705, time 76 | c3d5 |
| `uci-clock-mode` | `go movetime 200` | depth 8, cp 71, nodes 196 681, time 201 | c3d5 |
| `uci-clock-mode` | `go depth 6` | depth 6, cp 87, nodes 14 570, time 21 | c3d5 |
| `uci-clock-mode` (D3's row, the base's reading) | `go wtime 8000 btime 8000 movestogo 40` | depth 7, cp 79, nodes 69 705, time 76 | c3d5 |

Raw: `raw/p1p2-22931005.jsonl`, `raw/p1-analysis-22931005.txt`, `raw/a0-3-22931005.jsonl`, `raw/a0-3.mjs`.
