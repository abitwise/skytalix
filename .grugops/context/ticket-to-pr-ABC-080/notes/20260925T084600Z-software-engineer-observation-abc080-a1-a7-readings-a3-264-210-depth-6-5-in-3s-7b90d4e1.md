---
id: 20260925T084600Z-software-engineer-observation-abc080-a1-a7-readings-a3-264-210-depth-6-5-in-3s-7b90d4e1
kind: observation
by: software-engineer
at: 2026-09-25T08:46:00Z
verified_by:
confidence: high
refs:
  - ABC-080
  - NFR-005
  - ADR-0024
  - src/search.ordering.test.ts
  - .grugops/context/ticket-to-pr-ABC-080/probe/a3a4.mjs
  - .grugops/context/ticket-to-pr-ABC-080/probe/a7.mjs
  - .grugops/context/ticket-to-pr-ABC-080/probe/a4-d5.txt
  - .grugops/context/ticket-to-pr-ABC-080/probe/a7-out.jsonl
supersedes:
---

# ABC-080 criteria as measured at `ac5215c`: A1–A7 each MET; A4's hash column not yet measurable

Hand-authored, no `seal` (degraded posture per `AGENTS.md`). Node counts are deterministic.
Milliseconds and depths-in-budget come from Apple M3 (Mac15,13), node v24.12.0, under background
load (figures below).

| # | reading | verdict |
|---|---|---|
| `A1` | Ordered, MVV-LVA-only and unordered scores are identical on all six perft roots at d3 and d4. Default lane: startpos and position-3 at d3; the other ten pairs run under `SEARCH_DEEP=1` | **MET** |
| `A2` | **375 positions** (six roots, their children, position-3's second ply; counted by `probe/a2count.mjs`; the test asserts ≥ 200), four comparator inputs each (no killer/hash; two killers, one foreign; a legal hash move; a foreign hash move). 0 lost, duplicated or foreign moves | **MET** |
| `A3` | d4: **kiwipete 26 175 / 990 122 = 2.64%**, **position-6 34 885 / 1 663 808 = 2.10%**; bar ≤ 4%; scores 50 / 30 identical. Reproduces the ruling's prototype to the node | **MET** |
| `A4` | See the table below | **MET for MVV-LVA and killers; hash move NOT YET MEASURABLE (`ABC-081`), as the ticket provides** |
| `A5` | No table exists, so every search here is the no-hash-move case; both recursions pass `null`. `A1`–`A3` hold on it | **MET** |
| `A6` | Instrumented run (the decision note describes it): every offered killer was recorded at the same ply of the same table, and offered at the node's real ply. One table per `search()`, one per `chooseMove()`, never shared | **MET** |
| `A7` | Completed depth at the 3 s default budget, same process, pre-ordering `4f74acc` vs this build, 3 alternating rounds: **kiwipete 3 → 6, position-6 3 → 5, in 3/3 rounds** | **MET** |

## `A4` — nodes at fixed depth per configuration (scores identical within each row)

| position | d | none | MVV-LVA | + killers | + hash move |
|---|---|---|---|---|---|
| kiwipete | 4 | 990 122 | 26 227 | 26 175 (−0.2%) | not yet measurable |
| kiwipete | 5 | 35 538 933 ¹ | 166 490 | 157 042 (**−5.7%**) | not yet measurable |
| position-6 | 4 | 1 663 808 | 36 624 | 34 885 (−4.8%) | not yet measurable |
| position-6 | 5 | 19 426 355 ¹ | 177 146 | 140 781 (**−20.5%**) | not yet measurable |

¹ Probe only (`probe/a3a4.mjs`, plain node: 85.6 s and 56.9 s). Not run in any test lane.

**Delete rule, judged on depth 5: neither heuristic is a deletion candidate.** MVV-LVA cuts
d5 nodes 213x (kiwipete) and 110x (position-6). Killers cut them by a further 5.7% and 20.5%.

**`ABC-079` QE's `G4` is closed.** The fixture `n3k3/1P6/8/3q4/8/8/8/3RK3 w - - 0 1` (bxa8=Q
against Rxd5) reads 275 nodes at d3. Dropping the promotion term reds that pin and the comparator's
first-move row (mutant M13).

## Depth reached in 3 s (`chooseMove` at `DEFAULT_BUDGET_MS`)

- **Plain node, `probe/a7.mjs`:** kiwipete **depth 6** (907 018 – 928 522 nodes), position-6 **depth 5**
  (888 094 – 907 550). The base engine in the same process reads 3 / 3. Load 2.6–3.1.
- **Under vitest (`ENGINE_DEEP=1`'s `NFR-005` case):** kiwipete **depth 4** (152 330 nodes,
  3 014 ms), position-6 **depth 4** (143 646, 3 007 ms). Load 3.5–4.0. The vitest reading is
  lower, in line with QE's earlier observation (`ABC-079 (qe)`). Neither reading is an `NFR-005`
  verdict. The depth-6 floor is not met on position-6, and `ABC-081` is the next lever.

## Lanes run

- Default: 44 files, **1 418 passed, 0 skipped** (1 395 at the base). Integrity `No findings.`
- `SEARCH_DEEP=1` on `search.test.ts`, `search.ordering.test.ts`, `quiescence.test.ts` and
  `search.qe.test.ts`: **137/137, exit 0, 151.0 s** (before the memo refactor).
  `search.ordering.test.ts` alone after it: **37/37, 94.2 s**.
- `ENGINE_DEEP=1` on `engine.test.ts`: **33/33, exit 0, 118.3 s**. The identity sweeps hold on
  the endgame corpus and the 200+ broad corpus. `A1` worst case is 3 024 ms at depth 4, with
  30/30 over 3 000 ms (29/30 at `ABC-078`) by the abort granularity, and 0/30 over the 5 s ceiling.
