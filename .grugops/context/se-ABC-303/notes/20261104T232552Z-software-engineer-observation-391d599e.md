---
id: 20261104T232552Z-software-engineer-observation-391d599e
kind: observation
by: software-engineer
at: 2026-11-04T23:25:52Z
verified_by: 
confidence: high on the list; UNKNOWN - verify on whether ABC-279 A3 (a) may re-point, which is the Architect's
refs:
  - ABC-303
  - ABC-286
  - ABC-288
  - EPIC-011
  - ADR-0056
  - ADR-0072
  - ADR-0073
  - R-BUNDLE-1
  - R-283-LMR
  - NFR-005
  - NFR-008
  - NFR-009
  - orch-2026-10-30a/20261104T222400Z-orchestrator-decision-3c67d3c4
  - orch-2026-10-30a/20261103T221607Z-orchestrator-decision-42c82347
supersedes: 
seal: sha256:7572906458587d9d298a68c62bf3114803221fa18b3706012fb2640ecd517560
---

# se-ABC-303 observation: the rows moved. No score, node or move pin moved old → new; four rows re-point with figures unchanged; source rows follow the new text; two source counts move. One re-point is for the Architect

**Pins moved old → new.** No shipped-path score, node count or chosen move needed ruling `…42c82347`. Zugzwang, mate floor, `G1`, identity and relation rows are untouched. The only numbers that moved count source occurrences:
- `src/search.futility.test.ts`, `futileMove(` occurrences: `search.ts` 3 → 5, `engine.ts` 1 → 2. It is now also P4's move test, in each recursion and the malus (`ADR-0072` d3, d4).
- Export lists: `ABC-077` A6 31 → 38 names (seven, `ADR-0072` d6), `ABC-078` A4 17 → 20 (three). As the ADR says.

**Re-points to the all-off doors, figures and bars unchanged (`ADR-0072` d6, d7).**
1. `src/search.bundle.test.ts`, `ABC-283`'s bundle counts at d8: head `search` / `chooseMove` → `…WithoutQuietBundle`. Figures 523 847 / 234 214, 707 548 / 101 425 stand, and are ABC-303's P0 rows.
2. `src/search.bundle.test.ts`, `ABC-283` (a) "iterations 1-4 are the door's": head → `chooseMoveWithoutQuietBundle`. `chooseMoveWithoutAspiration` is an older door, so both parts are off on it. On the shipped path it read 2 197 against 3 461.
3. `src/engine.test.ts` A3, the discarded iteration: `chooseMove` → `chooseMoveWithoutQuietBundle`. With both parts on, budget 3 on a 1 ms tick completes depth 3, so the shipped path no longer enters the iteration the row discards. The abort rows elsewhere stay shipped.
4. **`src/see.test.ts`, `ABC-279` A3 (a), both recursions: head → `…WithoutQuietBundle`. FOR THE ARCHITECT.** On the shipped path the `chooseMove` row read **90.91 % within 25 cp, max 96 cp, 0 sign changes, against ≥ 93 %**. It is `ADR-0069` F1's drift bar, not a count. I re-pointed it because the row measures `ABC-279`'s skip, `ABC-283` did the same for A4 (a), and `ADR-0072` d6 has older rows re-point; the block's R1 reports this bundle's drift. `ADR-0072` d7's sentence names only "rows that pin shipped-path counts", so the records do not name this row. If the Architect reads it as staying on the shipped path, it is a red and the override does not name it. No bar moved. It is not a row of table 1.

**Source rows that follow the new text, same assertion:** `src/search.bundle.test.ts` (the cutoff call, the clear), `src/evaluate.taper.test.ts` C1 P5 (null child ends `phase, null`), `src/search.null-move.test.ts` (the null child's arguments, the flag now third from last), `src/search.futility.test.ts` (the statement after the futile skip).

**Door ladders grown:** `src/quiescence.test.ts`, `src/search.futility.test.ts`, `src/evaluate.taper.test.ts`, `src/search.null-move.test.ts`, `src/see.test.ts`. The three new doors keep every older switch on.

**Rows added:** 24 default-lane rows and 6 deep rows (the head counts and the two floors, `ADR-0072` d7) in `src/search.bundle.test.ts`; none in `src/cli.test.ts`, no new file.
