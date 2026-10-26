---
subtask: bapm-close-ABC-211
role: ba-pm
ticket: plans/tickets/ABC-211-the-opening-book-goes-deeper-in-the-english-lines.md
ref: .grugops/context/bapm-close-ABC-211/
branch: new grugops/bapm-close-ABC-211 from main, worktree ../wt-bapm-close-ABC-211
width: 1 of 3 — records only (no npm, vitest, build or timing; qe-ABC-208 is reading ALONE beside you)
---

# ABC-211 closed under the owner's O0; ABC-208 page notes ADR-0050 accepted

## Do
- Read Orchestrator `owner-word-2026-10-26/…58bcd17c` and Architect `arch-source-ABC-211/…7bb8daf1`.
- **Close the ABC-211 page undelivered:**
  - Frontmatter `status: dropped`, `column: Done` (the ABC-205/207 convention). Add a dated banner and a `## Close` section.
  - Reason: the owner picked O0, so there is no new source, and the pinned source has no line reaching 3...b6. QE-207-f: base already plays 4.d3 here.
  - This is the owner's own pick, so no veto line is needed.
- **ABC-208 page:** one dated line saying ADR-0050 was accepted by the owner (`…58bcd17c`). Update the `adr:` frontmatter to match. The reading (`qe-ABC-208`) is running. No criterion changes.
- **EPIC-008:** dated lines under the tickets table and in § Scope:
  - ABC-211 is closed (O0).
  - ADR-0050 is accepted, and ABC-208 is in its reading.
  - ABC-209/210 stay chained.
  - Don't touch the gate rows, table cells or NFR-005.
- Put the board card lines in your Result. Don't edit the board.

## Fences
- Work only in your worktree. No `src/`, and no npm/vitest/timing.
- Never push, force, amend or rebase. Never merge into main.
- Records: class and count only (ADR-0049 d4).

## Publish
- Commit on your branch. Seal notes (task `bapm-close-ABC-211`) with `at` taken from `date -u`.
- Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
