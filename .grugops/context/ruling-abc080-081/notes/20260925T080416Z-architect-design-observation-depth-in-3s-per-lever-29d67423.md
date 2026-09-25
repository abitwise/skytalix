---
id: 20260925T080416Z-architect-design-observation-depth-in-3s-per-lever-29d67423
kind: observation
by: architect-design
at: 2026-09-25T08:04:16Z
verified_by:
confidence: medium
refs:
  - NFR-005
  - NFR-004
  - ABC-080
  - ABC-081
  - ADR-0024
  - ADR-0003
  - .grugops/context/ruling-abc080-081/probe/timing-sequential.jsonl
  - .grugops/context/ruling-abc080-081/probe/mem.txt
supersedes:
---

# Depth completed within 3 s, per lever, measured with the faithful probe

Hand-authored, no `seal` (degraded posture per `AGENTS.md`). **Confidence is medium, not high.**
Node counts are exact. The milliseconds come from one machine under background load (below).

**The probe's rate is representative of the engine's.** The shipped `chooseMove` at 3 000 ms on
kiwipete reads **depth 3, 1 089 269 nodes, 3 001 ms**, about 363k nodes/s (`mem.txt`). The probe's
unordered iterative deepening reads 422 072 nodes to d3 in 1 069 ms, about 395k nodes/s. The
probe's table is a `Map`, which is slower than the typed-array table `ADR-0025` rules, so the
table rows are if anything pessimistic.

**Cumulative ms for iterative deepening to depth d** (the engine's shape). The depth completed
within 3 000 ms is marked **bold**. The runs were sequential (one process), Apple M3, node
v24.12.0, load average 3.6–3.9 from other work.

| configuration | kiwipete d-by-d (ms) | → depth in 3 s | position-6 d-by-d (ms) | → depth in 3 s |
|---|---|---|---|---|
| today (unordered, = shipped engine) | d3 1 069 · d4 3 859 | **3** | d3 412 · d4 5 445 | **3** |
| + `ABC-080` (MVV-LVA + killers) ¹ | d5 1 017 · d6 3 321 | **5** | d5 1 092 · d6 4 374 | **5** |
| + `ABC-081` (table + hash move) | d6 1 554 · d7 9 149 | **6** | d6 1 981 · d7 8 297 | **6** |
| + fused leaf ² | d6 1 367 · d7 8 687 | 6 | d6 1 755 · d7 7 849 | 6 |
| + PVS | d6 1 286 · d7 8 191 | 6 | d6 1 134 · d7 6 944 | 6 |
| + PVS + null move (R = 2) | d6 980 · d7 3 908 | 6 | d7 2 013 | **7** |
| + PVS + LMR (1 ply, move ≥ 4, quiet, no check) | d7 1 783 | **7** | d7 1 444 | **7** |
| + PVS + null move + LMR | d7 1 464 · d8 4 287 | 7 | d8 1 962 | **8** |

¹ This row came from the four-way parallel run (`nodes-parallel4.jsonl`), so its ms are
inflated. Its node counts are exact.
² Fused leaf: `leafScore` generates legal moves once and hands the list to the capture search,
instead of calling `gameStatus` (one `legalMoves`) and then `quiesce` (a second). It is
value-identical: probe nodes and scores match `search.ts` at d1–d3.

**Margins on the floor with `ABC-080` + `ABC-081`:** kiwipete 3 000 / 1 554 = **1.93x**,
position-6 3 000 / 1 981 = **1.51x**.

**Measured effective branching** with `ABC-080` + `ABC-081` (nodes of iteration d / iteration
d−1):

- kiwipete: 3.6, 2.5, 2.8, 4.7, 3.5, 4.1
- position-6: 3.4, 2.6, 10.8, 2.1, 8.8, 2.1 (odd/even alternation)

This is what a speed-only lever is converted through: a 2x speed-up buys roughly half to one ply.

**Scores at the deepest common depth agree across configurations** (d6: kiwipete 35, position-6
25; d7: 30 / 15, including the null-move and LMR rows). Null move and LMR are not
value-preserving in general, so this agreement is evidence on two positions, not a proof.
