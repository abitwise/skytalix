---
id: 20260925T080316Z-architect-design-observation-tt-probe-a1-a2-a3-identity-11853121
kind: observation
by: architect-design
at: 2026-09-25T08:03:16Z
verified_by:
confidence: high
refs:
  - ABC-081
  - ABC-080
  - ABC-078
  - ADR-0020
  - NFR-005
  - .grugops/context/ruling-abc080-081/probe/probe.mjs
  - .grugops/context/ruling-abc080-081/probe/identity.mjs
  - .grugops/context/ruling-abc080-081/probe/identity-d4.txt
supersedes:
---

# A prototype table on this codebase: what `A1`/`A2`/`A3` read, and where the ≤ 70% bar sits

Hand-authored, no `seal` (degraded posture per `AGENTS.md`).

**The prototype.** `probe/probe.mjs` builds a table in a JavaScript `Map` keyed by the 64-bit key.
The key comes incrementally via `zobristKeyAfterMove` from a per-ply chain seeded with
`zobristKey(root)`. Each entry stores depth, score, bound flag and best move. Mate scores are
stored ply-adjusted. A draft-dominant hit (`stored depth >= depth`) cuts on EXACT, LOWER ≥ β and
UPPER ≤ α. Only full-width nodes probe and store; quiescence does not. **It has no in-tree
repetition check**, so the readings are the table's alone.

## `A1` — scores unchanged by the table

- Fixed depth 5, table on vs off, with `ABC-080`'s ordering: kiwipete 50 = 50, position-6 35 = 35.
- **Iterative deepening with the table carried across iterations, compared at every completed
  iteration against `search(position, d)`**. The corpus is the six perft roots plus six engine
  endgames (`kq-corner`, `kr-corner`, `kqk-h8`, `kp-vs-k`, `krk-a-file`, `pawn-race`), 48
  (position, depth) pairs at d1–d4:

| configuration | score mismatches | move mismatches |
|---|---|---|
| `ABC-080` ordering only | 0 / 48 | 0 / 48 |
| `ABC-081` table only (unordered) | 0 / 48 | 0 / 48 |
| `ABC-080` + `ABC-081` (hash move first) | 0 / 48 | **1 / 48** |

The single move mismatch is the root hash move choosing a different move among moves of **equal**
score (the score matched). `ABC-078`'s `A3` identity sweep compares move **and** score, so it will
see this.

## `A2` — hit rate

- Fixed depth 5 (one call, no iterative deepening): **19.0%** kiwipete, **18.2%** position-6.
  That is above the ≥ 15% bar, but only narrowly.
- Iterative deepening to depth 6 (the engine's shape): **50.3%** and **58.5%**.

## `A3` — node count, table vs no table (the reading that matters)

| shape | kiwipete | position-6 |
|---|---|---|
| fixed d5, `ABC-080` ordering, table (cutoffs, no hash move) vs none | 126 315 / 157 042 = **80.4%** | 114 374 / 140 781 = **81.2%** |
| ID cumulative to d5, `ABC-080` ordering, table without hash move vs none | 159 247 / 193 826 = **82.2%** | 150 757 / 183 220 = **82.3%** |
| ID cumulative to d5, `ABC-080` ordering, **table + hash move** vs none | 122 577 / 193 826 = **63.2%** | 90 994 / 183 220 = **49.7%** |
| ID cumulative to d4, unordered tree, table vs none (`ABC-081` built alone) | 1 307 861 / 1 412 194 = 92.6% | 1 557 834 / 1 794 148 = 86.8% |

**`A3`'s ≤ 70% is met ONLY in the engine's own shape (iterative deepening) with the hash move
ordered first.** As written ("the same runs", fixed depth 5), the table's own cutoffs read about
80–81% and would FAIL. Most of what a transposition table buys here, it buys through the hash
move, and the hash move is `ABC-080`'s arm.

**Table occupancy** (distinct full-width positions stored in the `Map`): 39 137 (kiwipete, ID to
d6, about 2 s) and 99 063 (kiwipete, ID to d7, about 9 s). The design point in `ADR-0025` is
sized from these counts.
