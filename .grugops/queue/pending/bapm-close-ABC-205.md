---
subtask: bapm-close-ABC-205
role: ba-pm
ticket: plans/tickets/ABC-205-king-safety-bites-while-queens-are-on-and-the-king-table-is-tapered.md
ref: .grugops/context/bapm-close-ABC-205/
branch: new grugops/bapm-close-ABC-205 from main, worktree ../wt-bapm-close-ABC-205
width: 1 of 3 (beside arch-adr0031-status; records only — no npm, vitest or timing)
---

# Close ABC-205 unmerged under S1; unblock ABC-207 / ABC-215

## Do
- Read Orchestrator `arch-rule-ABC-205-g6/…154f2ced`, Architect `…912bcb0d`, QE `qe-ABC-205/…234d9814`.
- ABC-205 page: dated close line (closed unmerged under S1: G6 "≥ base" missed on position-6; D not run, not owed; forms kept on `grugops/ABC-205-final`; re-open path). Frontmatter status → closed per repo convention.
- EPIC-008: dated lines (proposal 1 not shipped; M1 baseline stands; M2/M3 untouched).
- ABC-207 and ABC-215: check their "ABC-205 closed under S1" Ready trigger and DoR; move to Ready if met (say which), else name the missing input. Add to each a process line (no bound): before its one real-clock reading, QE reports frozen-clock nodes to depths 7 and 8 on kiwipete and position-6 for base and head.
- Do not touch NFR-005 or EPIC-008's G6 text (owner question open). Give the board card lines in your Result; don't edit the board.

## Fences
- Only your worktree and `<scratchpad>/bapm205close/`. No `src/`. Do NOT run npm/vitest. Never push, force, amend or rebase; never merge into main. Records: class and count only (ADR-0049 d4).

## Publish
- Commit on your branch. Seal notes (task bapm-close-ABC-205). `## Result` + 10-cell trace rows into this brief in main's queue, then move it and its claim.md to done/.
