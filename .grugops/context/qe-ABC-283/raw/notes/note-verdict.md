# qe-ABC-283 VERDICT: **PASS_WITH_GAPS, no blocking gap.** Every ABC-283 bar (B1–B4) is MET on `ab0a37b6` (`src/` `d051784f`). B4: **C2′ 59 / 27 / 14 = 66.0 / 100 ≥ 50.0, MET** (+115.2 ± 67.0). The Levels deep lane is 58 / 58. This verdict signs UAT under the owner's delegation (2026-10-22), and B5's pass branch applies

QE/E2E, task `qe-ABC-283`. PREREG `…f774e6d9` was sealed and committed (`840a343d`) before any game or QE run. C2′ and S′ were each played once, as written.

| bar | reading | state |
|---|---|---|
| B1 P0 | all-off doors = base `main`, 6 / 6 byte-equal (nodes, score, move, depth; kiwipete, position-6; d6–d8; both recursions) | MET |
| B2 (a) mate floor | `search()` d5 0 / 190, `chooseMove` d5 0 / 188, against the all-off doors AND base `main`; older rows 0 / 189, 0 / 190, 0 / 189, 0 / 163; committed rows green | MET |
| B2 (b) zugzwang | 7 / 7 at the recorded depths, none re-pinned | MET |
| B2 (c) G1 | 54 / 58, none newly missed (vs the baseline file and vs base `main`'s own run) | MET |
| B3 NFR-008 | graded twin read: H median 9.60 s [9.52, 9.71] ≤ 10 s; twin admissible | MET (R-N8H-1 → MEDIUM) |
| B4 C2′ | 100 / 100, W/L/D 59 / 27 / 14, **66.0 ≥ 50.0**, 0 faults, 0 time losses, Elo +115.2 ± 67.0 | **MET** |
| Levels deep lane (`…3851bf43` 1) | exit 0, 58 / 58 | MET |
| R-281-a four `-t` lines | 4 / 1 / 1 / 1 passed, none short | MET |
| gates | typecheck, lint, build 0; skip count 0; integrity "No findings."; `npm test` 2 665 / 2 665 | MET |
| game-free deep lanes | 28 lanes (27 + Levels) exit 0, 0 failed | MET |
| re-pins (`…c7609f51`) | the order row, the KRK aspiration row 5 → 6, the d8 information row: each a pin, not a bar | confirmed |
| S′ (information) | 6 / 4 / 0 = 6.0 / 10; 1 880.4 ± 268.9 | reported |
| NFR-005 / G6 (reported) | no run below depth 9; medians 9 / 9 and 12 / 12 | MET |
| drift (information) | max 28 / 27 cp (≤ 42) | reported |

- **Gaps (gaps note):** 0 blocking, 0 high.
  - MEDIUM: QE-283-a. NFR-008 headroom is 0.40 s; R-N8H-1 returns to MEDIUM and a Security/NFR hop follows the merge (`…c7609f51` 3).
  - LOW: QE-283-b (R-283-LMR carried: d6 2 / 209, probe d6 1 / 30) and QE-283-c (no row has a mate found at iteration 5 exactly).
  - INFO: QE-283-d (QE's driver defect, fixed), e, f, g and h.
- **UAT:** this verdict signs it (the owner's delegation, AGENTS.md § Standing rulings 2026-10-22). The production diff is not zero, so no waiver applies. The Orchestrator records the `decision` naming this note.
- **B5:** pass. Per the ticket, the branch merges on green, and `ADR-0063`, `ADR-0065` and `ADR-0066` are accepted as a bundle. The merge and the ADR status lines are the Orchestrator's and the Architect's, not QE's.
- **Next:**
  - Orchestrator: the UAT decision; the merge on green (`main`'s `src/` is still `4fb3da04`, the merge-base's, so no re-base is owed); route the Security/NFR hop for R-N8H-1 (QE-283-a); the ticket front matter (QE-283-g).
  - `ABC-282` and `ABC-288` (held on this ticket) may unhold after the merge.
