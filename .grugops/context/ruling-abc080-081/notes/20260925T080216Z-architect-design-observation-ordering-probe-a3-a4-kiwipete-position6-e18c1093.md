---
id: 20260925T080216Z-architect-design-observation-ordering-probe-a3-a4-kiwipete-position6-e18c1093
kind: observation
by: architect-design
at: 2026-09-25T08:02:16Z
verified_by:
confidence: high
refs:
  - ABC-080
  - ADR-0024
  - NFR-005
  - src/search.ts
  - src/quiescence.ts
  - .grugops/context/ruling-abc080-081/probe/probe.mjs
  - .grugops/context/ruling-abc080-081/probe/nodes-parallel4.jsonl
supersedes:
---

# Full-width ordering on this codebase: MVV-LVA alone cuts depth-4 nodes to 2.2–2.7%

Hand-authored per `agent-factory/contracts/context-note.md`, no `seal` (the degraded posture
`AGENTS.md` records; not re-derived).

## The instrument

`probe/probe.mjs` is an out-of-tree copy of `src/search.ts`'s negamax, its root and leaf
(`gameStatus` + a copy of `quiesce`, same node counting). It imports the wave tree's `src/`
read-only at `49c58c3` and writes nothing. It has switches for each lever.
**Faithfulness was checked before any reading was taken.** With every switch off it reproduces
`search(position, d)` to the node and the score:

| position | d | `search.ts` score / nodes | probe | fused-leaf probe |
|---|---|---|---|---|
| kiwipete | 1 | 145 / 5 878 | 145 / 5 878 | 145 / 5 878 |
| kiwipete | 2 | 70 / 10 249 | 70 / 10 249 | 70 / 10 249 |
| kiwipete | 3 | 50 / 405 945 | 50 / 405 945 | 50 / 405 945 |
| position-6 | 1 | 10 / 297 | same | same |
| position-6 | 2 | 30 / 9 804 | same | same |
| position-6 | 3 | 30 / 120 239 | same | same |

**How ordering works in the probe.** It uses one comparator. The hash move comes first, then
captures and promotions by `mvvLvaKey` (reused from `src/quiescence.ts`, not re-derived), then
killer 1, then killer 2, then everything else in generation order (stable). There are two killers
per ply, recorded on a quiet-move beta cutoff and kept across iterative-deepening iterations. The
root is ordered too.

## `A3` — fixed depth 4, ordered vs unordered (node counts deterministic)

| position | unordered | MVV-LVA | + killers (= `ABC-080` without a table) | ratio |
|---|---|---|---|---|
| kiwipete | 990 122 | 26 227 | 26 175 | **2.64%** |
| position-6 | 1 663 808 | 36 624 | 34 885 | **2.10%** |

Scores are identical in every configuration (kiwipete 50, position-6 30). `A3`'s written bar is
**≤ 40%**. The reading is about **15x–19x better** than that bar, so the bar cannot detect a
regression that loses most of the ordering.

## `A4` — each heuristic's increment, and where it shows

| reading | kiwipete | position-6 |
|---|---|---|
| d4 fixed, killers over MVV-LVA | 26 227 → 26 175 (**−0.2%**) | 36 624 → 34 885 (−4.7%) |
| d5 fixed, killers over MVV-LVA | 166 490 → 157 042 (**−5.7%**) | 177 146 → 140 781 (**−20.5%**) |
| d6 ID iteration, killers over MVV-LVA | 691 936 → 683 317 (−1.2%) | 1 383 847 → 930 110 (**−32.8%**) |
| d4 ID iteration, hash move over killers (table holds moves only, no cutoffs) | 26 175 → 22 492 (−14.1%) | 34 885 → 30 001 (−14.0%) |
| d6 ID iteration, hash move over killers | 683 317 → 599 067 (−12.3%) | 930 110 → 757 130 (−18.6%) |

**`A4` as written (kiwipete, depth 4 only) would report killers as doing nothing (−0.2%) and
invoke the delete rule on a heuristic that earns 20–33% on position-6 at depths 5–6.**

## Conditions

Apple M3, node v24.12.0. Four probe processes ran in parallel on a machine at load average
3.6–4.5. Node counts do not depend on load; any millisecond figure in
`nodes-parallel4.jsonl` does, and the depth readings use the sequential file instead.
