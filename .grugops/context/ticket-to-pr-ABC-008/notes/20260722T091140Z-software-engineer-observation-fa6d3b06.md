---
id: 20260722T091140Z-software-engineer-observation-fa6d3b06
kind: observation
by: software-engineer
at: 2026-07-22T09:11:40Z
verified_by: 
confidence: medium
refs:
  - ABC-008
  - EPIC-004
  - NFR-001
  - NFR-005
  - RISK-002
  - spike/perft-bench.ts
supersedes: 
---

Measured throughput for the representative chess hot loop on the real stack.

**Environment:** Node v24.12.0, darwin/arm64, Apple M3. Depth 5 from the start position. Reported exactly as it ran.

| Metric | Nodes | Generations | Elapsed | Rate |
|--------|-------|-------------|---------|------|
| A — perft-shaped (leaves free) | 4,896,998 | 207,065 | 0.161 s | 30,394,529 leaf/sec |
| B — search-shaped (leaves evaluate) | 4,896,998 | 5,104,063 | 1.855 s | **2,639,455 nodes/sec** |

**Metric B is the answer; metric A is a trap I initially fell into.** The first version of this benchmark reported only metric A and printed **43,112,690 nodes/sec**. That number is not wrong arithmetically, it is wrong *as a measure of engine throughput*: in classic perft the leaf nodes return immediately without generating or evaluating anything, and ~96% of counted nodes are leaves. The rate is dominated by work that never happened. Comparing it to NFR-001 would have produced a wildly over-confident GO on a number roughly 16x inflated.

The benchmark was corrected to also run a search-shaped walk where leaves perform generation work, standing in for the evaluation and quiescence cost a real search pays at every leaf. Both metrics are now printed side by side, with metric A explicitly labelled as not comparable to an NFR target — so the next person cannot repeat the mistake.

**Against the targets, using metric B:**
- `NFR-001` ≥ 1,000,000 nodes/sec (generation) → at 2.64M, **above target with ~2.6x headroom**.
- `NFR-005` ≥ 500,000 nodes/sec (with eval) → at 2.64M, **above target with ~5x headroom**.

**Bias runs in both directions, which is why this is a proxy and not a prediction:**
- *Optimistic*: no legality filtering, no castling/en-passant/promotion. The real generator does strictly more work per node. Expect a real implementation to land materially below 2.64M.
- *Pessimistic*: no alpha-beta pruning, no transposition table, no move ordering. A real search reaches a given depth visiting far fewer nodes than this exhaustive walk, which buys back a large multiple.

**Machine caveat:** an Apple M3 is fast. On older or low-power hardware, assume 2-3x slower. Even at 3x slower and with a 3x penalty for real generation work, metric B lands near ~300k nodes/sec — below NFR-005's 500k on weak hardware. That is the scenario worth watching, and it is an argument for the per-move time budget (NFR-004) being adaptive rather than a fixed depth.

Recorded as an `observation`, not a `finding`: this is a measured fact on one machine, not a gate-verified result. No `§14-gate#<id>` stamp exists for it and none was invented.
