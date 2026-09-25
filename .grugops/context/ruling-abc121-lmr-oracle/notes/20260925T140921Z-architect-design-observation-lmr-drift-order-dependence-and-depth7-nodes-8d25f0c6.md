---
id: 20260925T140921Z-architect-design-observation-lmr-drift-order-dependence-and-depth7-nodes-8d25f0c6
kind: observation
by: architect-design
at: 2026-09-25T14:09:21Z
verified_by:
confidence: medium
refs:
  - ABC-121
  - ABC-078
  - ABC-081
  - ABC-084
  - NFR-005
  - .grugops/context/ruling-abc121-lmr-oracle/probe/lmr-d4.jsonl
  - .grugops/context/ruling-abc121-lmr-oracle/probe/lmr-d5.jsonl
  - .grugops/context/ruling-abc121-lmr-oracle/probe/lmrplain-d4.jsonl
  - .grugops/context/ruling-abc121-lmr-oracle/probe/mates.jsonl
  - .grugops/context/ruling-abc121-lmr-oracle/probe/nodes-to-d7.jsonl
  - .grugops/context/ruling-abc121-lmr-oracle/probe/budget-3000.jsonl
  - .grugops/context/ruling-abc121-lmr-oracle/probe/budget-3000-run2.jsonl
  - .grugops/context/ruling-abc121-lmr-oracle/probe/budget-3000.txt
  - .grugops/context/qe-ABC-081/notes/20260925T110300Z-qe-e2e-observation-abc081-gates-and-deep-lanes-reproduced-independently-b1a4e9f1.md
supersedes:
---

# LMR: how far it moves the score, why no identity survives it, and what it buys in nodes

Hand-authored, no `seal` (degraded posture per `AGENTS.md`). The scores and nodes are exact.
**Confidence is medium** for two reasons. The depth-in-budget conversion leans on a node
CAPACITY measured by another hop (QE at `ABC-081`). And the only wall-clock run here was taken at load average
12.4–12.6 from parallel hops.

The LMR rule is `ABC-121`'s scope exactly:

- reduce by one ply;
- remaining depth >= 3;
- index >= 3, 0-based in the ordered list, which is R5's "move >= 4" (the same thing);
- the move neither captures nor promotes;
- the node is not in check;
- the move does not give check;
- no reduction at the root.

## Score drift, PVS+LMR vs PVS alone, at a fixed depth

PVS alone has the value of the shipped search, 0/190 at depths 3–4 (`…3b7e1a52`). The corpus is
190 positions. 3 of them carry a mate score, so 187 are compared in centipawns.

| | depth 4 | depth 5 |
|---|---|---|
| mate-status flips (mate ↔ no mate, or sign) | **0** | **0** |
| identical score | 93.05% | 95.72% |
| within 10 cp | 95.72% | 98.93% |
| within 25 cp | 98.40% | 99.47% |
| within 50 cp | 100% | 100% |
| p95 / p99 / max | 10 / 35 / **50** | 0 / 20 / **45** |
| root move differs | 5 | 3 |
| worst | startpos 0 → 50; position-5/d1d6 345 → 380 | position-6/f3h4 565 → 610 |
| total nodes, PVS+LMR / PVS | 0.910 | 0.529 |

- **LMR does not fire below root depth 4.** Every node with remaining depth >= 3 sits under a
  depth-4 root.
- **LMR without PVS gives the same scores at depth 4.** Every drift figure matches the table
  above (`lmrplain-d4.jsonl`).

**The ticket's `A1` bar (≤ 50 cp in ≥ 95%) passes, but its max sits AT the bar at depth 4.** That
is no headroom for a bound meant to catch regressions.

## Mate rows: all hold under LMR

The rows are `search.test.ts` `A3`'s four (mate in 2 at depths 4, 5 and 7, mate in 1 at depth 4)
and `transposition.test.ts`'s depth-10 rook ending. Each was read at a fixed depth and deepened,
under base, PVS, PVS+LMR and LMR-plain. **All 20 readings equal the pinned literal**
(`mates.jsonl`). The depth-5 and depth-7 rows are the ones LMR can actually touch.

## Why no identity survives LMR, even with LMR on both sides

Whether a move is reduced depends on its index, and the index depends on the hash move and the
killers.

| shape, LMR on BOTH sides | depth 4 | depth 5 |
|---|---|---|
| deepening vs fixed depth (`ABC-078` `A3`) | **5 / 190 diverge** | **6 / 190** |
| table on vs table off (`ABC-081` `A1`) | 0 / 190 | **3 / 190** |

## Depth 7: cumulative deepening nodes, clock-free and exact

| config | kiwipete to d6 | kiwipete to d7 | position-6 to d6 | position-6 to d7 |
|---|---|---|---|---|
| shipped (base) | 455 301 | 1 922 235 | 623 200 | 1 923 320 |
| PVS | 410 147 | 1 640 040 | 392 358 | 1 452 406 |
| LMR, no PVS | 240 038 | 580 389 | 346 536 | 755 013 |
| **PVS + LMR** | 208 499 | **532 363** | 165 716 | **467 461** |

The deepened scores at depth 7 are identical across all four configs: kiwipete 30, position-6
15, and the same moves.

- **The 3 s capacity.** QE at `ABC-081` (note `…b1a4e9f1`) measured the shipped engine on plain
  node completing **892 682 / 853 278 nodes in 3 001 / 3 006 ms**, with its own script on this
  machine.
- **The conversion.** Dividing by that capacity gives:
  - PVS+LMR reaches depth 7 with a margin of **1.68x (kiwipete) / 1.83x (position-6)**. R5's
    prototype read 1.7x–2.1x.
  - LMR without PVS reaches it with a margin of **1.54x / 1.13x**.
  - PVS alone (0.54x / 0.59x) does not reach depth 7, and neither does the base.
- **This assumes the node rate is unchanged by PVS/LMR.** That is plausible, since the per-node
  work is the same, but it is `UNKNOWN - verify` until `ABC-121`'s own `A2` reads the clock.

**Wall-clock at 3 000 ms, two sequential runs in one process each (node v24.12.0, Apple M3).**
The load came from the parallel hops.

| config | run 1, load 12.4–12.6 (`budget-3000.jsonl`) | run 2, load 5.5–6.2 (`budget-3000-run2.jsonl`) |
|---|---|---|
| shipped (base) | 6 / 6 | 6 / 6 (d6 by 1 641 / 2 083 ms) |
| PVS | 6 / 6 | 6 / 6 (d6 by 1 472 / 1 288 ms) |
| LMR, no PVS | 6 / 6 | **7 / 7** (d7 by 2 128 / 2 412 ms) |
| **PVS + LMR** | 6 / 6 | **7 / 7** (d7 by **2 076 / 1 562 ms**; margin 1.45x / 1.92x) |

The cells are kiwipete / position-6. **Run 2 agrees with the node conversion above. Run 1 shows
how badly load moves the `NFR-005` reading:** at load 12 the rate was about a quarter of
QE's `ABC-081` reading, and nothing reached depth 7. Neither run is a verdict. `NFR-005` binds plain
node, measured by Security/NFR.

## Tactical-suite status

**`ABC-084` does not exist as code.** It is a `Backlog` ticket (P0, DoR 8/10) with no fixtures
in `src/`. The only tactical fixtures in the tree are `quiescence.test.ts`'s 20-position
`HANGING_CORPUS` and the mate rows above.
