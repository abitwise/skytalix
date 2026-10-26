---
subtask: bapm-amend-ABC-208
role: ba-pm
ticket: plans/tickets/ABC-208-null-move-pruning-behind-a-test-only-off-door-with-a-zugzwang-guard.md
ref: .grugops/context/bapm-amend-ABC-208/
branch: new grugops/bapm-amend-ABC-208 from main, worktree ../wt-bapm-amend-ABC-208
width: 1 of 3 (records only — no npm, vitest or timing)
---

# ABC-208: page lines from the design ruling (before Ready for Dev)

## Do
- Per Architect `arch-design-ABC-208/…012b1053` and Orchestrator `orch-2026-10-26e`: add dated amendment lines to the ABC-208 page. No criterion's bar changes.
  1. Scope 2's fourth guard: "fewer than three non-pawn pieces".
  2. A2 is read at a per-row depth, with the 7 rows named in the ruling.
  3. A3's mate clause is read at the same depth, 5.
  4. A1 is a cross-build check that QE runs out of tree.
  5. Scope 1 adds `src/apply.ts` and `src/zobrist.ts`.
- Re-score the DoR. If 10/10, say Ready for Dev. Note in the page that ADR-0050 is PROPOSED: the build may proceed, but the real-clock reading and the merge wait on the owner's acceptance.
- Give the board card line in your Result; don't edit the board.

## Fences
- Only your worktree and `<scratchpad>/bapm208amend/`. No `src/`. Do NOT run npm/vitest/timing. Never push, force, amend or rebase; never merge into main. Records: class and count only (ADR-0049 d4).

## Publish
- Commit on your branch. Seal notes (task bapm-amend-ABC-208). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
