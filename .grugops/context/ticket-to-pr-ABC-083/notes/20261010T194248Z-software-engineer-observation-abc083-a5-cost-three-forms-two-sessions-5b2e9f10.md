---
id: 20261010T194248Z-software-engineer-observation-abc083-a5-cost-three-forms-two-sessions-5b2e9f10
kind: observation
by: software-engineer
at: 2026-10-10T19:42:48Z
verified_by:
confidence: high
refs:
  - ABC-083
  - ADR-0031
  - ADR-0003
  - NFR-005
  - NFR-001
  - .grugops/context/ticket-to-pr-ABC-083/probe/cost.mjs
  - .grugops/context/ticket-to-pr-ABC-083/probe/cost.out.jsonl
supersedes:
---

# `A5`: the complete evaluation, every form, measured BEFORE any tuning. Attack-map MEETS 1,100 ns

Apple M3 (8 cores), Darwin 25.5.0, Node v26.11.0, plain node. `ABC-076`'s method: best of 5 × N
per root after an N/10 warm-up, the six perft roots, one variant per fresh process (N = 1,000,000;
legal 100,000). Purity asserted inside every timing (board, side, ep, castling identical after).
Mean of the six roots, ns per call:

| complete evaluation | S1 fwd | S1 rev | S2 rev | S2 fwd | verdict |
|---|---:|---:|---:|---:|---|
| base (`ABC-076` + `ABC-082`, `489c549e`) | 374.4 | 369.7 | 373.5 | 382.6 | — |
| king safety alone | 463.2 | 445.4 | 456.2 | 454.7 | meets |
| **+ attack-map mobility (the build)** | **1,072.1*** | 673.6 | 684.5 | 672.8 | **775.8 (mean of the session means 872.9 / 678.7): MEETS** |
| + pseudo-legal count (`generateMoves` × 2) | 1,766.5 | 1,693.0 | 1,737.0 | 1,574.4 | misses |
| + legal count (`legalMoves` × 2) | 10,860.8 | 10,764.8 | 10,558.6 | 10,057.3 | misses |

- \*S1's first attack-map run straddled a load spike (load1 4.41 → **82.61** within the run;
  position-3 read 1,112 ns there and 383 ns in every other run). It sits in the 990–1,210 band, so
  `ADR-0031` decision 3's second session was run in reverse order; the verdict is the mean of the two.
- Load1 per run 2.8–8.5 outside the spike. Worst cell outside the spike: 805.6 ns (kiwipete).
- **Committed build `79248602`** (the door added; the weight passed as a parameter), session 3,
  load1 3.7–4.2: base 347.3 / 345.6, build **636.4 / 635.9**, worst cell 710.5 (position-6).
- `NFR-001`: the attack-map form calls no generator; **0 `legalMoves` / `generateMoves` calls per
  leaf**. The `gameend.nfr.test.ts` call-count guards are green on the default lane.
- `ADR-0031`'s mobility cut does NOT fire on `A5`.
