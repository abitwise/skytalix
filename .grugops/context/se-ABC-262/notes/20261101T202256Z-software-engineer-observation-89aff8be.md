---
id: 20261101T202256Z-software-engineer-observation-89aff8be
kind: observation
by: software-engineer
at: 2026-11-01T20:22:56Z
verified_by: 
confidence: high: pointer note (filed as observation; artifact-ref needs gate_run)
refs:
  - se-ABC-262
  - ABC-262
  - ABC-261
  - ABC-254
  - EPIC-011
  - QE-261-a
  - QE-261-b
  - NFR-008
supersedes: 
seal: sha256:07baff255bc11a8c67446ce14d8b29c0e72d2196297ca8cdbe54666c3318727b
---

# se-ABC-262 artifacts: branch grugops/ABC-262, code 39a6237e, two test files

- Branch `grugops/ABC-262` in worktree `.claude/worktrees/se-ABC-262`, from main `767a2e3e`. Not pushed, not merged.
- `3ea272c0` claim (queue only). `39a6237e` code: `src/gameend.nfr.test.ts` (+21 −1: one row, `PAWN` import), `src/legal.test.ts` (+31: one describe/row).
- Tests added: "hasLegalMove out of check answers a pawn-first board at once: at most 1 attack test"; "equals the full filter with black in check: a non-blocking promotion is absent, a blocking one present".
- Evidence: `.grugops/context/se-ABC-262/raw/` (plants, probe2, gates, scripts).
- Rollback: revert `39a6237e`.
