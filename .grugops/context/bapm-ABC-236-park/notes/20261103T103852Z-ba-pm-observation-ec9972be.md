---
id: 20261103T103852Z-ba-pm-observation-ec9972be
kind: observation
by: ba-pm
at: 2026-11-03T10:38:52Z
verified_by: 
confidence: high: each figure and line ref checked against the sources and src/engine.ts at main 06d4d0ee and the pages at 78f41d21
refs:
  - bapm-ABC-236-park
  - grugops/bapm-ABC-236-park
  - ABC-236
  - EPIC-011
  - S1
  - ADR-0066
  - ADR-0056
  - ABC-257
  - ABC-239
  - NFR-005
  - 06d4d0ee
  - 74b4aafa
  - 78f41d21
  - 781c11a2
  - orch-2026-10-30a/20261103T103555Z-orchestrator-decision-38f865c3
  - arch-ABC-236/20261103T101543Z-architect-design-decision-0886976b
  - arch-ABC-236/20261103T101543Z-architect-design-observation-22d9d55f
  - arch-ABC-236/20261103T095821Z-architect-design-decision-69cfcb4a
  - arch-adr0056-fold-1103/20261103T101952Z-architect-design-decision-df88abcf
supersedes: 
seal: sha256:b6772bf98ead172edb6f357bf07408f2b1ecb289dd961fe78ebad382903e58d8
---

# bapm-ABC-236-park checks: each page line was read against `arch-ABC-236` `…0886976b` § 7, results `…22d9d55f`, `ADR-0066` § Status and decision 9, and the Orchestrator's sealed `…38f865c3` (on `main` at `06d4d0ee`) before editing

- Figures copied, not derived: A100 `chooseMove` d8 0.9836 / 0.9913; d7 over the 190 0.9779; d9 A100 0.9546 / 0.9962, A50 0.9448 / 0.9798; firing 70.4 % at 47 000 (186 / 190 rows), 51.3 % at 20 000; swing p90 63–67 cp at iterations 5–6; `A2` 1 of 535 (`G1` "win material, seed 1811", 835 → 567), > 100 cp 7 rows at d6; effort S-M, 0.5–1 Engineer day.
- The `781c11a2` merge message and the board line read "0.9836/0.9619" (A100 kiwipete with A25 position-6); the pages carry the corrected pair from `…38f865c3`.
- Line refs re-located at `06d4d0ee`: `src/engine.ts` `function runIteration(` at line 546; header "aspiration windows and threading (none requested;" at line 105. The page cites `runIteration` by name and `:105`.
- The `EPIC-011` rows `…0886976b` named by number (473, 742, 790) had moved; re-located at `06d4d0ee` by grep: Phases row S1 (was 518), Tickets row 9 (was 789), Dedupe audit row (was 837), § Dependencies (976).
- Lines changed in `78f41d21`: `ABC-236` page +51 / −7; `EPIC-011` +21 / −3. `plans/traceability.md`: one appended row (next commit).
