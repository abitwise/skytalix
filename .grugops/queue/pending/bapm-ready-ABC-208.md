---
subtask: bapm-ready-ABC-208
role: ba-pm
ticket: plans/tickets/ABC-208-null-move-pruning-behind-a-test-only-off-door-with-a-zugzwang-guard.md
ref: .grugops/context/bapm-ready-ABC-208/
branch: new grugops/bapm-ready-ABC-208 from main, worktree ../wt-bapm-ready-ABC-208
width: 1 of 2 (beside arch-source-ABC-211; records only — no npm, vitest or timing)
---

# ABC-208: Ready re-score (trigger met since ABC-206 Done)

## Do
- Per BA/PM `bapm-s1-ABC-207/…f249ca34` and Orchestrator `orch-2026-10-26b`: re-score ABC-208's Definition of Ready at main's tip. Its Ready trigger (ABC-206 Done, `0a9390e5`) has been met since 2026-10-24.
- Re-read its cites against the current `src/`. Line drift is known: `engine.ts:69-71` → `:73-74`. Fold in what EPIC-008 has learned since the cut: the G6 reading rule, the frozen-clock pre-check, the D base after ABC-215, the S1 outcomes of ABC-205/207, and QE-207-g.
- If 10/10 → Ready, with In Design first (a new ADR + an ADR-0026 door, reported to the owner when written). Else, name the missing input.
- Give the board card line in your Result; don't edit the board.

## Fences
- Only your worktree and `<scratchpad>/bapm208/`. No `src/`. Do NOT run npm/vitest/timing. Never push, force, amend or rebase; never merge into main. Records: class and count only (ADR-0049 d4).

## Publish
- Commit on your branch. Seal notes (task bapm-ready-ABC-208). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
