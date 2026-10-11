---
id: 20261011T223136Z-software-engineer-observation-abc152-ruling12-bounds-gates-1b0bdaa6
kind: observation
by: software-engineer
at: 2026-10-11T22:31:36Z
verified_by:
confidence: high
refs:
  - ABC-152
  - ADR-0042
  - QE-152-i
  - 20261011T222932Z-architect-design-decision-abc152-qe152i-rulings-840a7403
  - 20261011T223136Z-software-engineer-artifact-ref-abc152-ruling12-commit-3c55b965
supersedes:
---

# `ABC-152` ruling 12 bounds and gates at `3c55b965`

Measured in the throwaway worktree at `3c55b965` (vitest 4.1.11, node 26.11.0).

- Old line 6 matched the note's "replace" text byte-exactly before the edit (script refused on mismatch).
- New line 6 is 101 bytes; line 5 unchanged (102 bytes). `src/cli.test.ts` stays 3431 lines; `expect(` stays 324.
- `/usr/bin/diff` old vs new: `6c6` only. `git diff --stat HEAD~1`: 1 file, +1 / −1.
- `npm run lint` (biome check .): exit 0, 107 files, no fixes.
- `npm test`: exit 0, Test Files 56 passed (56), Tests 1741 passed (1741), 0 skipped, 5.89 s.
- Not run (not required by ruling 12): typecheck, build, deep lanes.
