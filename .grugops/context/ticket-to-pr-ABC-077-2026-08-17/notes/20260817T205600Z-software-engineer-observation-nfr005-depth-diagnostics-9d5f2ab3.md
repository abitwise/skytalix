---
id: 20260817T205600Z-software-engineer-observation-nfr005-depth-diagnostics-9d5f2ab3
kind: observation
by: software-engineer
at: 2026-08-17T20:56:00Z
verified_by:
confidence: medium
refs:
  - ABC-077
  - ABC-078
  - NFR-005
  - RISK-002
  - src/search.ts
supersedes:
---

# `NFR-005` — depth diagnostics. **Figures only. NO DEPTH VERDICT IS TAKEN HERE.**

`ABC-078` owns the 3 s per-move budget these levels would have to be read against, and `RISK-002`
requires that budget to be TIME-based. **Nothing below says what depth this engine should search,
and nothing below may be quoted as a level having been reached or met.**

## What a "node" is, exactly

**One entry into a position: one invocation of the recursion, root included, leaves and terminal
positions included.** It is NOT perft's leaf count. A perft node is a free leaf; a node here pays
for a legal-move generation (interior) or a `gameStatus` + `evaluate` (leaf), so **this rate is not
comparable with the perft harness's inflated nodes/sec** — `ABC-008` recorded why that figure runs
high, and this is the other side of the same coin.

## The machine and the conditions

Apple M3, 8 cores, 16 GB, macOS 25.5.0 (arm64), node v24.12.0, run directly (not under vitest).
**1-minute load average 24.77 on 8 cores while these ran** — other agent work was live on this
machine. Times are wall, single-threaded, one run each, no warm-up discarded. **Treat them as an
order of magnitude, not as a benchmark.**

## Alpha-beta, pruning on, generation-order moves, no quiescence, no table

```
kiwipete   r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1
  depth 1          49 nodes        4 ms      14 knodes/s     score  435
  depth 2         313 nodes        7 ms      42 knodes/s     score   70
  depth 3       9 016 nodes       68 ms     133 knodes/s     score  400
  depth 4      38 023 nodes      221 ms     172 knodes/s     score   50
  depth 5   1 233 113 nodes    7 877 ms     157 knodes/s     score  315

position-6 r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10
  depth 1          47 nodes        0 ms     156 knodes/s     score  330
  depth 2         562 nodes        3 ms     205 knodes/s     score  -10
  depth 3      14 565 nodes       85 ms     172 knodes/s     score  240
  depth 4     222 697 nodes    1 018 ms     219 knodes/s     score -110
  depth 5   5 321 750 nodes   30 447 ms     175 knodes/s     score  155
```

Unpruned (the `A1`/`A2` oracle), for the branching-factor comparison: kiwipete depth 3 is 99 950
nodes / ~634 ms, position-6 depth 3 is 92 016 / ~547 ms.

## The three readings that are legitimate, and the one that is not

1. **The rate is roughly 150-220 knodes/s** on this machine, at these depths, in these two
   positions, under this load.
2. **The effective branching factor is high because there is no move ordering** — `ABC-080` is the
   ticket that changes this number, and every figure above should be expected to move when it lands.
   The same goes for `ABC-079` (quiescence, which will make leaves cost more) and `ABC-081` (the
   table, which will make them cost less).
3. **Depth 5 is seconds, not milliseconds, in both positions.** That is the shape of the curve, not
   a budget statement.
4. **NOT legitimate: reading "depth 4 in ~1 s" as "the engine reaches depth 4".** There is no clock
   in this module, no iterative deepening, and no per-move budget — by design, and `A6` enforces it.
   Whoever takes that verdict does it in `ABC-078`, against a wall clock, on a machine they name.
