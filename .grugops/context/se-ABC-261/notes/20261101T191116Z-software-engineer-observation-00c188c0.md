---
id: 20261101T191116Z-software-engineer-observation-00c188c0
kind: observation
by: software-engineer
at: 2026-11-01T19:11:16Z
verified_by: 
confidence: high: pointer note (filed as observation; artifact-ref needs gate_run)
refs:
  - se-ABC-261
  - ABC-261
  - ABC-254
  - EPIC-010
  - ADR-0003
  - NFR-008
  - NFR-001
  - QE-254-b
  - QE-254-c
  - grugops/ABC-261
  - dd8b17ea
  - ceb28780
  - src/legal.test.ts
  - src/gameend.nfr.test.ts
  - qe-ABC-254/20261101T172756Z-qe-e2e-observation-dede949b
supersedes: 
seal: sha256:2cf6c9ac7b1bcb914de810bb25e721a095a964dd8d9006823adf81fdd09b94b4
---

# ABC-261 artifacts: branch grugops/ABC-261, code dd8b17ea from main ceb28780; two test files, two rows

- **Branch:** `grugops/ABC-261`, in worktree `.claude/worktrees/se-ABC-261`, from `main` `ceb28780`. Not pushed, not merged.
- **Code commit:** `dd8b17ea`, `test(ABC-261): …`.
- **Files and rows:**
  - `src/gameend.nfr.test.ts`: adds the `isSquareAttackedBy` spy to the `./moves.ts` mock, and one row, "hasLegalMove out of check stops at the first legal king move: at most 2 attack tests".
  - `src/legal.test.ts`: one row in a new describe, "ABC-261 — legalCapturesAndQueenPromotions in check tests its quiet queen promotions".
- **Commands** (each test, build and lint run under `flock …/scratchpad/host-test.lock`):
  - `npm ci`;
  - single-file `vitest run` with `NODE_OPTIONS=--max-old-space-size=400`;
  - `npm test` three times on head and once on base;
  - `npm run lint|typecheck|build`;
  - `test-skip-integrity.js .grugops/test-skips.md --skip-count 0`;
  - `lane-inventory.js`.
- **Production lines:** none. `src/legal.ts` is unchanged, so there is no smoke and no UAT; QE's verdict is the gate (`qe-e2e` hop owed).
- **Remaining:** QE re-read of A3–A5 and A9.
