---
subtask: se-fix-ABC-208
role: software-engineer
ticket: plans/tickets/ABC-208-null-move-pruning-behind-a-test-only-off-door-with-a-zugzwang-guard.md
ref: .grugops/context/se-fix-ABC-208/
branch: grugops/ABC-208 (continue from 80345eb9), worktree ../wt-ABC-208
width: 1 of 2 (test-only; no real-clock timing)
---

# ABC-208: three test-only rows for QE-208-a/b/c

## Do
- Per QE `qe-gate-ABC-208/…8c4f3e57`, `…98174381` (the plants and why they survive) and Orchestrator `orch-2026-10-26h`, add test rows so that each of these plants goes red:
  - **QE-208-a (MEDIUM):** the engine's `finally` around the null-move unmake is removed. Abort at a depth where a null move is tried (deeper than d2); the root position must come back byte-identical, with the side to move unchanged.
  - **QE-208-b (MEDIUM):** the null child's key write (`keys[ply + 1] = zobristKeyAfterNullMove(…)`) is dropped, in each recursion separately.
  - **QE-208-c (LOW):** null move is wired on in each PVS-off door (`searchWithoutPvsOrReductions`, `searchWithoutTable`, `chooseMoveWithoutPvsOrReductions`).
- Show each plant red, and green at head. Prefer deterministic rows; put a row in a deep lane only if it can't be made fast.
- Gates: lint, typecheck, build, `npm test` + `last-run.json` (Duration; NFR-008 headroom), skips, SEARCH_DEEP null-move lane.

## Fences
- Tests only. No production line changes, and no value pin, relation, level or bound moves (if one is needed → STOP). Only your worktree and `<scratchpad>/se208fix/`. Never push, force, amend or rebase; never merge into main; no board edits. Records: class and count only.

## Publish
- Commit on grugops/ABC-208. Seal notes (task se-fix-ABC-208). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
