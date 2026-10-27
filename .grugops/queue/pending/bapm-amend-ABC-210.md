---
subtask: bapm-amend-ABC-210
role: ba-pm
ticket: plans/tickets/ABC-210-checks-at-the-horizon-a-check-extension-or-checks-in-quiescence.md
ref: .grugops/context/bapm-amend-ABC-210/
branch: new grugops/bapm-amend-ABC-210 from main, worktree ../wt-bapm-amend-ABC-210
width: 1 of 3 — records only (no npm, vitest, build or timing)
---

# ABC-210: place the Architect's page lines and the pin rulings; DoR re-score

## Do
- Read Orchestrator `orch-2026-10-27f` (this hop's routing note) and Architect `arch-design-ABC-210/…c5d0e464`, `…8e6a40c2`. The page lines are under "BA/PM page lines" in `.grugops/queue/done/arch-design-ABC-210.md`.
- **Place each line on the ABC-210 page as a dated amendment:**
  - `adr:` → ADR-0051 (PROPOSED).
  - Scope 1 and Scope 3.
  - A2: ADR-0051 d8's rows.
  - A3: d6 read against the door; strike "≥ base − 1"; add ADR-0051's drift bars and the same-depth mate floor.
  - A1 is cross-build.
  - Test notes 1 and 3.
- **The pin rulings, as dated lines:**
  - **P1** (`transposition.test.ts` A5 fixture-bites row, re-pinned d3 → d2, −502) is accepted by the Orchestrator. QE re-plants the bug at d2.
  - **P2** (`zugzwang.005` depth 12 → 13) waits on the owner's answer, which comes with ADR-0051's.
- **No criterion's bar is loosened** beyond what ADR-0051 states. If a line would loosen one, stop and say so.
- Re-score DoR. Put the board card lines in your Result: In Design → Ready for Dev if 10/10, noting that the build is held on the owner. Don't edit the board.

## Fences
- Work only in your worktree. No `src/`, and no npm/vitest/timing.
- Never push, force, amend or rebase. Never merge into main.
- Records: class and count only (ADR-0049 d4).

## Publish
- Commit on your branch. Seal notes (task `bapm-amend-ABC-210`) with `at` taken from `date -u`.
- Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
