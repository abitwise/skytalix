---
id: 20261104T164437Z-qe-e2e-observation-f8f8c2cc
kind: observation
by: qe-e2e
at: 2026-11-04T16:44:37Z
verified_by: 
confidence: high: each gap tied to a reading or a diff line; none is a build defect; none moves a bar
refs:
  - qe-ABC-283
  - grugops/ABC-283
  - grugops/qe-ABC-283
  - ABC-283
  - EPIC-011
  - O1h
  - O3s
  - S1
  - K3
  - ADR-0063
  - ADR-0065
  - ADR-0066
  - ADR-0064
  - ADR-0056
  - ADR-0050
  - ADR-0035
  - B1
  - B2
  - B3
  - B4
  - B5
  - P0
  - C2-prime
  - S-prime
  - G1
  - G6
  - NFR-005
  - NFR-008
  - R-N8H-1
  - Q-N8H-1
  - R-281-a
  - R-283-LMR
  - ab0a37b6
  - 21ae5819
  - 09694a4e
  - 0f0adfe3
  - d051784f
  - 4fb3da04
  - src/search.ts
  - src/engine.ts
  - src/see.ts
  - src/search.bundle.test.ts
  - src/levels.test.ts
  - orch-2026-10-30a/20261104T130054Z-orchestrator-decision-4c4cb03d
  - orch-2026-10-30a/20261104T133110Z-orchestrator-decision-3851bf43
  - orch-2026-10-30a/20261104T135723Z-orchestrator-decision-19583086
  - orch-2026-10-30a/20261104T142541Z-orchestrator-decision-6c6fb0be
  - orch-2026-10-30a/20261104T151305Z-orchestrator-decision-c7609f51
  - arch-ABC-283-mate/20261104T142415Z-architect-design-decision-05ef9fc9
  - se-ABC-283/20261104T135528Z-software-engineer-decision-d64042c4
  - se-ABC-283/20261104T135528Z-software-engineer-observation-0d3e1e5b
  - se-ABC-283-k3/20261104T151148Z-software-engineer-decision-0ea55b6c
  - se-ABC-283-k3/20261104T151148Z-software-engineer-observation-d1c74042
  - UAT
  - NFR-009
  - 840a343d
  - 5601c33c
  - 8f03fe47
  - ADR-0060
  - ABC-300
  - ABC-271
  - ABC-282
  - ABC-288
  - src/search.futility.test.ts
  - src/see.test.ts
  - src/evaluate.taper.test.ts
  - src/puzzle-suite.test.ts
  - qe-ABC-283/20261104T152150Z-qe-e2e-decision-f774e6d9
supersedes: 
seal: sha256:bdc80bb5f49e0a8a77ebfc8427e35887e7bc51c60d1d2b23b02c9bf99b9fcd52
---

# qe-ABC-283 gaps: **0 blocking, 0 high, 1 medium (QE-283-a, R-N8H-1 back to MEDIUM by its own trigger), 2 low, 5 information.** None is a defect in the build, and none moves a bar

QE/E2E, task `qe-ABC-283`. Each gap is tied to a reading in the games, offline or NFR note, or to a diff line.

| id | severity | gap | owner |
|---|---|---|---|
| QE-283-a | **MEDIUM** (not blocking) | **NFR-008 headroom.** The graded H median is 9.60 s [9.52, 9.71] ≤ 10 s, MET, with 0.40 s of headroom. R-N8H-1's trigger (a median ≥ 9.5 s) fires, so by `…c7609f51` 3 **R-N8H-1 returns to MEDIUM and a Security/NFR hop follows the merge.** Q-N8H-1's ≥ 9.6 s trigger fires at 9.60 exactly. `ABC-271` adds about 0.1 s. | Orchestrator (route the Security/NFR hop after merge) |
| QE-283-b | LOW | **R-283-LMR, the residual, carried.** The d5 floor bar is met (0 / 190, 0 / 188) and holds on QE's fresh KRK/KQK probe (0 / 16, 0 / 16). At d6, `chooseMove` loses 2 / 209 on the 287, and the same 2 rows are lost against base `main` too. On the fresh probe it loses 1 / 30 (KQK; the defending side misses the mate against itself). The floor is order-sensitive through LMR. If a later change re-reddens the d5 floor, the lever is LMR (`ADR-0060` P1), as `…05ef9fc9` says. | Architect/Design (carried risk; not graded here) |
| QE-283-c | LOW | **Re-pin 2 narrows coverage.** After the move to iteration 6, no committed row exercises a mate found at iteration 5 exactly. `ADR-0066` d9's "5 or later" still holds, so this is a pin, not a bar move. The narrower coverage of the iteration-5 fail-high path for mates is a test gap (the non-mate row still fails high at 5). | Software Engineer (an optional row on a later touch) |
| QE-283-d | INFO | **QE's own driver defect, fixed and recorded.** `drv.ts` v1 appended the numeric `promotion` field (0) to every UCI string, so its zugzwang and G1 compares read false. v2 (from + to, as the puzzle suite labels moves) re-read both parts once. The engine's moves, depths and nodes are identical between the two. v1 is kept in `raw/out/offline/v1-formatter-bug/`, and the change is the one diff between `scripts.sha256` and `scripts-final.sha256`. | QE (closed) |
| QE-283-e | INFO | **Harness tree.** C2′ and S′ ran on `tools/rating` at the merge-base (`5601c33c`), not `main`'s `8f03fe47`. `main` adds only `ABC-300`'s `--tc`, and every other argv is byte-equal (`ABC-300`'s title and QE verdict `…fbda2ad6`). The per-change form is unchanged. | none |
| QE-283-f | INFO | **G6 speed.** Head nodes in 4 s are 0.976× (kiwipete) and 0.952× (position-6) of base, with the depth medians equal (9 / 9, 12 / 12). | none |
| QE-283-g | INFO | **The ticket page is on `main` only.** `plans/tickets/ABC-283-…md` was cut on `main` (`835b3db6`) after the branch point, so the branch carries no copy, and its front matter still reads `status: ready` / `column: Ready`. No merge conflict is expected. This hop's `## Result` is in the brief. | Orchestrator (front matter at Done) |
| QE-283-h | INFO | **The Engineer's 9.81 s did not reproduce.** The graded head is 9.60 s against base 9.45 s (the Engineer read 9.43 s base). The graded figure stands. | none |

- **No bar was loosened, and no read was re-played.** C2′ and S′ were each played once.
