---
id: 20261103T125721Z-software-engineer-observation-512109eb
kind: observation
by: software-engineer
at: 2026-11-03T12:57:21Z
verified_by: 
confidence: high
refs:
  - ABC-275
  - EPIC-011
  - grugops/ABC-275
  - b3436c3a
  - tools/rating/rating.ts
  - tools/rating/pair-check.ts
supersedes: 
seal: sha256:7893f307c4ceed074837fdd301f52d79e655e1f82c419b34ba3620d16a090bb8
---

# SE branch and files (recorded as an observation; there is no gate verdict for an artifact-ref), se-ABC-275: branch, files, rows

- **Branch:** `grugops/ABC-275` (worktree `.claude/worktrees/se-ABC-275`), from `main` `9c098064`. Code commit `b3436c3a`. Not pushed and not merged.
- **Files:** `tools/rating/rating.ts` (+19 −5): `R_SHORT_BUDGET_MS`, `R_BUDGETS_MS`, `R_SHORT_ELO_MAX`, `stockfishSt`, the refusal and E guard in `main`, and the `control:` line. `tools/rating/pair-check.ts` (+130 −6): header line, the new `ABC-275` describe with 6 rows, and the one `ABC-255` refusal row inverted.
- **Tests added:** 6 `node --test` rows (A1 ×2 whole-vector, A4, A3 ×2, A5), none in the lane (`NFR-008`).
- **Commands:** `node --test tools/rating/pair-check.ts`, `npm run lint`, `npm run typecheck`, `npm run build`, `npm test`, and the A2 before/after print diff. All went under the host lock.
- **Remaining:** A6 is read at R1 (`ABC-273`, QE). The usage text's stale "R 500 only" is optional. Review and QE verdict are next (tools only, no UAT).
