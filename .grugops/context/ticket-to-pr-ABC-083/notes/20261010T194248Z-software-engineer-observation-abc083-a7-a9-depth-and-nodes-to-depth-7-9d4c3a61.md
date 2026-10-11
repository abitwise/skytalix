---
id: 20261010T194248Z-software-engineer-observation-abc083-a7-a9-depth-and-nodes-to-depth-7-9d4c3a61
kind: observation
by: software-engineer
at: 2026-10-10T19:43:21Z
verified_by:
confidence: high
refs:
  - ABC-083
  - NFR-005
  - AR-NFR005-082
  - ADR-0031
  - .grugops/context/ticket-to-pr-ABC-083/probe/depth.mjs
  - .grugops/context/ticket-to-pr-ABC-083/probe/depth.out.jsonl
  - .grugops/context/ticket-to-pr-ABC-083/probe/depth-79248602.out.jsonl
  - .grugops/context/ticket-to-pr-ABC-083/probe/nodes7.mjs
  - .grugops/context/ticket-to-pr-ABC-083/probe/nodes7.out.jsonl
supersedes:
---

# `A7`/`A9`: depth 7 held on both positions at load ~4; position-6's margin fell from ~1.4x to 1.05x, and one spike took it

Apple M3, Darwin 25.5.0, Node v26.11.0. `chooseMove` at `DEFAULT_BUDGET_MS`, plain node, ONE fresh
process per run, rounds alternating order, load1 read before every run.

**Clock-free nodes to complete depth D** (`nodes7.mjs`: a virtual clock ticking once per
consultation, binary-searched budget; it reproduces Security/NFR's base figures to the node):

| position | D | base `489c549e` | king safety alone | build |
|---|---|---:|---:|---:|
| kiwipete | 7 | 610 179 | 607 401 | **566 233 (−7.2%)** |
| kiwipete | 6 | 256 581 | 244 095 | 231 536 |
| position-6 | 7 | 462 871 | 467 730 | **644 469 (+39.2%)** |
| position-6 | 6 | 170 202 | 175 231 | 169 685 |

**Real clock, completed depth:**
- Session 1 (pre-commit build, same values), load1 4.0–4.5, 3 rounds: branch 7/7/7 on both positions;
  base 7/7/7; king safety alone 7/7/7. Nodes in 3 s: branch kiwipete 631–634k, position-6 677–689k.
- Committed build `79248602`, 6 rounds: kiwipete branch **6/6 at depth 7** (629–642k), base 6/6.
  position-6 branch **5/6 at depth 7**; round 3 read **depth 6** (504 473 nodes, 168k n/s, load1
  3.67 before, **43.82** at the next run). Base 6/6, including the run inside that spike (663k).
- **No depth below 6 anywhere: `NFR-005`'s floor holds.** Depth 7 (the level, R2) held in 17 of 18
  branch runs.
- **Margins:** kiwipete 629–642k / 566k = **1.11–1.13x** (base ~1.1x). position-6 672–689k / 644k =
  **1.04–1.07x** (base ~1.4x). The tree, not the node rate, moved on position-6 (branch nodes/s is
  equal to base there; kiwipete's rate fell ~5%).
- **Reading for Security/NFR and the owner, not adjudicated here:** `A7` is met on 17 of 18 runs. The
  one depth-6 run is a load spike. A position-6 margin of 1.05x will lose depth 7 to load the way
  kiwipete did at `ABC-082`. This is `A9`'s trigger shape, now on position-6. If Security/NFR reads it
  as a stop, `ADR-0031` decision 5's order applies: mobility first. King safety alone reads
  467 730 nodes to depth 7 on position-6, which is base's margin.
