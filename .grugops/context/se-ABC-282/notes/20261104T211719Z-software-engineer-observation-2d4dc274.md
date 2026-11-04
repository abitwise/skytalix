---
id: 20261104T211719Z-software-engineer-observation-2d4dc274
kind: observation
by: software-engineer
at: 2026-11-04T21:17:19Z
verified_by: 
confidence: high: every figure as run on the branch; the lane read is ungraded
refs:
  - se-ABC-282
  - ABC-282
  - ADR-0071
  - ABC-078
  - ABC-221
  - ABC-283
  - NFR-004
  - NFR-008
  - R-0071-3
  - src/engine.ts
  - src/uci-session.ts
  - src/engine.test.ts
  - src/uci-session.test.ts
  - grugops/ABC-282
  - 04ebeb7e
supersedes: 
seal: sha256:cb31cf4969102561cda58a5f2696b01a51ebc725aad91e4fecb1fc221d4a850c
---

# ABC-282 readings on the branch

Tip code `04ebeb7e`, base `22931005`. Every run under the host lock. A4 and A6 are not run here: they play games, and they are QE's.

## D12
- **b:** 2.3 → 2.3 (median 2.3319 → 2.3043, 175 ratios), sealed at `…aadd2d48`, committed `9ae02324`, before A1 (c) ran.

## A rows
| row | read |
|---|---|
| A0-1 | 6 rows match the base's counts, with `softMs` absent and with `softMs: 1` |
| A0-2 | 4 rows match the base's counts |
| A0-3 | 6 rows' lines byte-equal the base; D3's row reads depth 7, 32 165 nodes (= N(7)), against the base's 69 705, so `softMs` is handed in |
| A1 (a) | position-6, H = 6: depth 3, nodes = N(3) = 1 514; the base aborts inside depth 4 at 3 145 |
| A1 (b) | position-6, H = 10: boundary reading 4 < 4.35, depth 4 |
| A1 (c) | **base median 0.3476, head median 0.0000**, 125 rows; strictly below. Forecast was 0.3766 / 0.0000. 73.5 s |
| A2 (a), (b), (c) | 4 rows green, plus the row that the incumbent is iteration d's |
| D12 rows | exact in a window, a fail high standing across an aborted pass, an incumbent that failed low: 3 rows green |
| A3 (a) | each A2 row: the head's nodes equal the base's, so the abort point and A2's bound carry |
| A3 (b) | stub rows: 59 500, 1 900 and the 1 ms floor keep the hard limit. Real clock, D3's row: 27 526 ms, depth 12 |
| A5 | null-move deep lane 46 passed (zugzwang), PVS/LMR deep lane 29 passed (mate floor), G1 54/58 = baseline, 0 NEWLY lines |

## Mutants (scratch copy, `raw/mut.py`, the two files' default rows)
16 of 16 killed, control green. `incumbent-once` survived the first pass, so a row was added and it now dies.

## Gates
- typecheck, lint, build: rc 0. Skip count 0. `test-skip-integrity`: No findings. `lane-inventory`: 71 files collected, 71 tracked, No findings.
- `npm test`: **2 709 / 2 709** in 71 files (base 2 684, +25).
- `ENGINE_DEEP` `src/engine.test.ts`: 105 passed. `ENGINE_DEEP` `src/uci-session.test.ts`: 265 passed.
- R-281-a's four lines: 4, 1, 1, 1 passed. ABC-302's nine lines: 1 passed each (`raw/tlines.txt`).

## Lane (ungraded; 6 scored interleaved pairs, the first pair a warm-up; `raw/wall.tsv`)
- H median **9.50 s**, B median **9.425 s**: head minus base **+0.075 s**, inside ≤ +0.10 s.
- The paired median is +0.10 s, on the bar, and the pairs run −0.26 to +0.34 s, so this read cannot separate +0.075 from +0.10. QE grades it.
- Rows added sum to **86.6 ms** in-thread (aim ≤ 90), none ≥ 50 ms (largest 15.0 ms).
