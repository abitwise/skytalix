---
id: 20260925T080516Z-architect-design-observation-castling-pairs-subtrees-and-memory-baseline-30cea5d2
kind: observation
by: architect-design
at: 2026-09-25T08:05:16Z
verified_by:
confidence: high
refs:
  - ABC-081
  - ADR-0006
  - ADR-0020
  - .grugops/context/ruling-abc080-081/probe/castle.mjs
  - .grugops/context/ruling-abc080-081/probe/castle.txt
  - .grugops/context/ruling-abc080-081/probe/mem.mjs
  - .grugops/context/ruling-abc080-081/probe/mem.txt
supersedes:
---

# Two probes: `ADR-0006`'s four pairs as TT entries, and the engine's memory baseline

Hand-authored, no `seal` (degraded posture per `AGENTS.md`).

## 1. `ADR-0006`'s four "same position, different rights" pairs, read as SUBTREES

`ADR-0006` built four pairs with identical placement, identical side to move and **identical
current legal-move sets**, differing only in an unusable castling right. A table entry stands for
a subtree, not for the current move list, so the probe runs perft and `search()` below each pair
(`castle.txt`):

| pair | keys differ | legal moves now | perft 3 | perft 4 | `search` d3 | `search` d4 |
|---|---|---|---|---|---|---|
| startpos | yes | 20 / 20 | 8 902 / 8 902 | — | — | — |
| **knight-g1** `4k3/8/8/8/8/8/8/4K1NR w K` vs `w -` | yes | 15 / 15 | **1 335 / 1 320** | **8 072 / 7 982** | **850 / 830** | **830 / 820** |
| in-check `r3K2R` | yes | 3 / 3 | 951 / 951 | 15 899 / 15 899 | −480 / −480 | −480 / −480 |
| f1-attacked | yes | 12 / 12 | 3 671 / 3 671 | 62 874 / 62 874 | 5 / 5 | 0 / 0 |

On `knight-g1` the right is unusable now and usable two plies later, once the knight leaves g1.
The subtrees differ and the **search scores differ by 10–20 cp**. A key that hashed availability
would give both positions the same key, and a table would hand one of them the other's value:
**a wrong answer, not a miss.**

## 2. Memory baseline (`mem.txt`, `node --expose-gc`, reads taken after `global.gc()`)

| moment | rss | heapUsed | external | arrayBuffers |
|---|---|---|---|---|
| after importing `src/engine.ts` | 79.78 MiB | 7.48 | 7.34 | 0.01 |
| after one 3 s `chooseMove` on kiwipete (depth 3, 1 089 269 nodes) | 93.14 MiB | 8.12 | 7.61 | 0.01 |
| after allocating a 2^18-entry table (`BigUint64Array(2^18)` + `Uint32Array(2^19)`) | 93.14 MiB | 8.10 | 11.61 | **4.01** |

- A typed-array table shows in `arrayBuffers` to the byte (4.00 MiB) and not in `heapUsed`.
- A `Map`-backed table would show the opposite way: in `heapUsed`, not in `arrayBuffers`.
- Allocating and clearing the 4 MiB table each cost under 0.1 ms, which is nothing against a
  3 000 ms budget.
