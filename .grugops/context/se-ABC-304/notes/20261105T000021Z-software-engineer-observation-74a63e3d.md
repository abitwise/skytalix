---
id: 20261105T000021Z-software-engineer-observation-74a63e3d
kind: observation
by: software-engineer
at: 2026-11-05T00:00:21Z
verified_by: 
confidence: high (git, as run); observation because artifact-ref needs a section-14 gate_run this hop does not have
refs:
  - se-ABC-304
  - ABC-304
  - ABC-271
  - ABC-279
  - ABC-283
  - ADR-0070
  - ADR-0069
  - ADR-0072
  - ADR-0063
  - NFR-009
  - arch-ABC-303-open/20261104T233941Z-architect-design-decision-e28552ac
  - bapm-K0-cut/20261104T235027Z-ba-pm-decision-555a9a9e
  - grugops/ABC-304
  - df426688
  - 9e0d4044
  - ADR-0058
  - 7a6c8884
  - src/evaluate.passer.test.ts
  - src/see.test.ts
  - src/transposition.test.ts
  - EPIC-011
supersedes: 
seal: sha256:4552dbf7b89c51bb76796f59bb6b1240614e150ea0f52948c82cdbad597600b6
---

# se-ABC-304 observation (artifact record): the ABC-304 build

Sealed as an observation because `artifact-ref` needs a § 14 `gate_run` this hop does not have.

- **Branch:** `grugops/ABC-304` (worktree `.claude/worktrees/se-ABC-304`), from `main` `df426688`.
- **Commits:** `7a6c8884` claim; `9e0d4044` test; then records.
- **Files:** `src/evaluate.passer.test.ts`, `src/see.test.ts`, `src/transposition.test.ts`. No production line. `src/evaluate.passer-fixtures.json` untouched.
- **A5, the nine re-pointed rows (`ADR-0058` d5):**
  1. `kiwipete_chooseMove_d8` -> `chooseMoveWithoutBundle`
  2. `kiwipete_chooseMove_d9` -> `chooseMoveWithoutBundle`
  3. `pos6_chooseMove_d8` -> `chooseMoveWithoutBundle`
  4. `pos6_chooseMove_d9` -> `chooseMoveWithoutBundle`
  5. `pos6_chooseMove_d10` -> `chooseMoveWithoutBundle`
  6. `kiwipete_search_d8` -> `searchWithoutBundle`
  7. `pos6_search_d8` -> `searchWithoutBundle`
  8. A3 (a) "search() against searchWithoutSeePruning at depth 5 …" -> `searchWithoutBundle`
  9. A3 (a) "chooseMove against chooseMoveWithoutSeePruning deepened to 5 …" -> `chooseMoveWithoutBundle`
- **Raw evidence (`raw/`):** `passer-deep.txt`, `see-deep.txt`, `transposition-search-deep.txt`, `transposition-engine-deep.txt`, `default-lane.txt`, `exits.txt`, `gates.txt`, and the two scripts `lanes.sh`, `gates.sh`. Host paths are replaced by placeholders.
- **Remaining:** the QE hop, then merge on green. UAT is waived by A4. If `main` moves first, the merge re-read runs the deep lane of any test file the other side brings (`…681c6363` 3).
