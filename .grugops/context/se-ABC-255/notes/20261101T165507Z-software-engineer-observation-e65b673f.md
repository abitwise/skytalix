---
id: 20261101T165507Z-software-engineer-observation-e65b673f
kind: observation
by: software-engineer
at: 2026-11-01T16:55:07Z
verified_by: 
confidence: high
refs:
  - ABC-255
  - EPIC-011
  - EPIC-010
  - ADR-0056
  - grugops/ABC-255
  - 78cd2415
  - 8f2fc9b5
  - tools/rating/rating.ts
  - tools/rating/pair-check.ts
supersedes: 
seal: sha256:771200336aa7313e46354ae6578b3a2e24e830d9479a7381253584bd5ec911e2
---

# SE observation, se-ABC-255: branch, files, tests (artifact pointer)

- Branch `grugops/ABC-255` (worktree `.claude/worktrees/se-ABC-255`, from main `8f2fc9b5`), code commit `78cd2415`. Not merged; nothing pushed.
- `tools/rating/rating.ts` (+38 −11): header doc and usage, `D_BUDGETS_MS` + 100, `R_BUDGET_MS`, `R_SMOKE_BUDGET_MS`, `SHORT_MARGIN_MS`, exported `timemarginMs`, `sky()` margin, skytalix ms from `spec.budget`, `r` accepts/refuses `--budget-ms`, machine.txt control line.
- `tools/rating/pair-check.ts` (+186 −1): one describe, 7 tests.
- Owed by QE: A3 (b5c67ab7 vs first parent, 100 games at 100 ms), A4 (identical pair), A5 (one S′ on main, overshoot over 500 ms in ms); A8 reading.
