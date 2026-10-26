---
subtask: bapm-s1-ABC-207
role: ba-pm
ticket: plans/tickets/ABC-207-mobility-is-weighted-per-piece-and-an-early-queen-trip-costs.md
ref: .grugops/context/bapm-s1-ABC-207/
branch: new grugops/bapm-s1-ABC-207 from main, worktree ../wt-bapm-s1-ABC-207
width: 1 of 3 (records only — no npm, vitest or timing)
---

# ABC-207: S1 re-tune-or-close call after D LOSS

## Do
- Read Orchestrator `orch-2026-10-26a/…5c59d85e` and QE `qe-ABC-207/…cc744e8c`, `…243de4b1`, `…138c1740` (findings QE-207-a/-b/-c/-f).
- Make EPIC-008 S1's call for ABC-207. The delivery default is **close unmerged under S1**: a re-tune needs a second real-clock reading, which is beyond the owner's one-reading-per-ticket scope reading (`…4c3f7639`). If you judge a re-tune worth it, write it as a **question for the owner** (what would change, why it could reach GAIN, its cost of ~6–12 h), not as a decision.
- ABC-207 page: a dated close line (or a held-for-owner line); frontmatter per repo convention (as ABC-205). EPIC-008: dated lines (proposal 4 not shipped; M2/M3 effect; the remaining EPIC-008 tickets and whether any are pullable).
- Give the board card lines in your Result; don't edit the board.

## Fences
- Only your worktree and `<scratchpad>/bapm207s1/`. No `src/`. Do NOT run npm/vitest/timing. Never push, force, amend or rebase; never merge into main. Records: class and count only (ADR-0049 d4).

## Publish
- Commit on your branch. Seal notes (task bapm-s1-ABC-207). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
