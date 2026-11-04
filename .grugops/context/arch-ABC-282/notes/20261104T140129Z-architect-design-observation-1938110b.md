---
id: 20261104T140129Z-architect-design-observation-1938110b
kind: observation
by: architect-design
at: 2026-11-04T14:01:29Z
verified_by: 
confidence: high: deterministic node counts on scratch copies of main 5853d17f (src tree 4fb3da04) under the host lock, per PREREG 5dbc040d; the Monte Carlo clock-use rows were added after the PREREG and are labelled a report; the harness finding is read from tools/rating/rating.ts on main
refs:
  - arch-ABC-282
  - ABC-282
  - ADR-0071
  - EPIC-011
  - EPIC-009
  - ABC-078
  - ABC-283
  - ABC-223
  - ABC-222
  - ABC-255
  - ABC-275
  - ADR-0052
  - ADR-0056
  - ADR-0066
  - ADR-0026
  - NFR-004
  - NFR-005
  - NFR-008
  - NFR-009
  - R-0071-1
  - R-0071-2
  - R-0071-3
  - R-0071-4
  - OQ-0071-1
  - src/engine.ts
  - src/uci-session.ts
  - src/engine.test.ts
  - tools/rating/rating.ts
  - arch-ABC-282/20261104T134523Z-architect-design-decision-5dbc040d
  - bapm-W1-bundle-cut/20261104T130931Z-ba-pm-decision-a5a31e4c
  - bapm-W1-bundle-cut/20261104T130931Z-ba-pm-observation-206f5a66
  - orch-2026-10-30a/20261104T130054Z-orchestrator-decision-4c4cb03d
  - qe-tc-depth-probe/raw/named.json
  - qe-tc-depth-probe/raw/positions.json
  - 5853d17f
  - 6424c272
supersedes: 
seal: sha256:9ae79f06bff04efc87a0ceb09b85e48194d823e3bf0233ae2004c679d018a092
---

# Readings for ADR-0071 (W1), under PREREG …5dbc040d, and the harness check

These are scratch probes on `git archive` copies of `main` `5853d17f` (`src/` tree `4fb3da04`), Node v26.12.1, under
the host lock, one at a time. They count nodes only. P1+P2 took 77 s and P3 took 145 s; both exited 0. Nothing in the
repository's `src/` or `tools/` was written. The scratch copies were removed afterwards. Raw files: `raw/` (`p1p2.jsonl`,
`p1-analysis.txt`, `p3.jsonl`, `p3-analysis.txt`, `alloc.txt`, `alloc-mc.txt`, `proto.diff`, the scripts).

## P1: iteration growth (K25, frozen clock, d = 1–10)

- **b = 2.3.** The pooled median of N(d) / N(d − 1) over d = 4–10 is 2.3319: n 175, p25 2.003, p75 2.880, p10 1.654,
  p90 3.966.
- The per-d medians for d = 4–10 are 2.763, 2.129, 2.621, 2.332, 2.212, 2.242 and 2.252. Odd d reads 2.251 (n 75) and
  even d 2.350 (n 100). The per-row range is 1.30–10.19.
- The stop band [1.5, 6.0] did not fire. All 25 positions have ≥ 2 legal moves.

## P2: A0 reference counts (`main`)

- **Frozen clock, maxDepth d:**
  - kiwipete d6 e2a6 −59 144 120; d7 d5e6 −82 346 458; d8 d5e6 −89 766 275;
  - position-6 d6 c3d5 87 15 209; d7 c3d5 79 35 436; d8 c3d5 71 87 475.
- **`virtualClock(1)`:**
  - kiwipete 50 ms: depth 4, e2a6, 8, 48 408 nodes; 200 ms: depth 6, e2a6, −59, 199 960;
  - position-6 50 ms: depth 7, c3d5, 79, 44 105; 200 ms: depth 8, c3d5, 71, 196 681.

## P3: the rule prototyped (K25 × H 25/50/100/200/400 on `virtualClock(1)`, softMs = H / 2.3)

- **I0:** the patched build without `softMs` equals unpatched `main` on 125 of 125 rows (move, score, depth, nodes).
- **Thrown share** (A1 (c) forecast):
  - base: median **0.3766**, mean 0.3875, p25 0.2212, p75 0.5254;
  - head: median **0.0000**, mean 0.0902, p75 0, p90 0.6257.
  
  Aborted searches: base 124 of 125, head 16.
- **Depth, head − base:** 0 on 103 rows and −1 on 22. The mean depth goes from 7.352 to 7.176, at a fixed budget with
  no re-spread.
- **Head clock use** (elapsed / H): min 0.4375, p10 0.491, p25 0.545, median 0.640, mean 0.689, p75 0.820, max 1.040.
  The base's median is 1.010.
- **Partial moves:** kept on 3 of 16 aborted head rows. 4 moves differ from base, 3 of them partial.
- **The first root move was the incumbent** in every iteration: 0 exceptions, base and head.
- Candidate A2 fixtures:
  - `candidate/b06#3` at H 50: base b1c3 d5 +95; head d1a4 d5 +56, partial;
  - `candidate/b06#3` at H 200, partial;
  - `base/b08#7` at H 200, partial.

## Arithmetic A (`uci-clock-mode` `C`, three 40-move periods, δ = 31 ms)

The table gives the share of each period used, and the closest call.

| clock | f (share of the budget spent) | book 0 | book 6 | closest call |
|---|---|---|---|---|
| 40/15 | 1 / 2.3 | 72.51 / 85.75 / 91.58 % | 69.02 / 87.23 / 92.34 % | 247 s |
| 40/15 | 0.64 | 92.79 / 98.59 / 99.72 % | 90.67 / 100.3 / 100.06 % | — |
| 40/15 | 1.0 | 99.88 % | 99.88 % | 1 069 ms |
| 40/8 | 1 / 2.3 | 74.95 / 96.81 / 99.59 % | — | 2 004 ms |
| 40/8 | 0.64 | 82.43 % (period 1) | — | — |
| 40/8 | 1.0 | 86.64 % (period 1) | — | 1 069 ms |

- **Added after the PREREG'd rows, a report only:** f drawn per move from P3's 125 head-use values, over 10 000 seeded
  games.
  - 40/15: period 1 min **87.77 %**, p01 90.48 %, median 95.37 % (book 6: 85.17 / 88.02 / 93.87 %).
  - 40/8: period 1 min 78.67 %.
  - The closest call is 1 069 ms in every case.
  - Constant f 0.49 (P3's p10) at 40/15: 79.18 % (75.86 % with book 6).
- **40/8 per move** (f 1): 75 ms at a period's first move, 368 ms at its last. A side spends 10.7–11.8 s over 69 moves.
- **`simple-tournament` at 40/15 under W1:** 40 × (f × 22 000 + 31) gives 62.7 % at f 0.64 and 42.6 % at f 1 / 2.3.

## The harness: it cannot play a clock read on `main`

`tools/rating/rating.ts` (`cutechessArgs`) gives every skytalix engine `st=<ms/1000>` and `timemargin=`. `d` takes
`--budget-ms` 3000 / 2500 / 2000 / 1500 / 1000 / 100 only. A grep of `tools/` finds no `tc=` and no `TimeMode`.
`ABC-222` and `ABC-223` played 40/15 from QE scratch `cutechess-cli` commands. `FAULT_TEXT` already counts "loses on
time" as a fault.
