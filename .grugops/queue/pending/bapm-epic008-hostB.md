---
subtask: bapm-epic008-hostB
role: ba-pm
epic: plans/epics/EPIC-008-skytalix-plays-measurably-stronger-at-the-same-levels-and-time-budgets.md
ref: .grugops/context/bapm-epic008-hostB/
branch: new grugops/bapm-epic008-hostB from main, worktree ../wt-bapm-epic008-hostB
width: 2 of 2 — records only (no npm, vitest, build or timing)
---

# EPIC-008: dated M1 line for the host move and option B; close-path step 3 re-worded

## Do
- Read Orchestrator `orch-2026-10-28a/…5dbd717b` (the owner's word) and `orch-2026-10-27o/…e018297c`, plus BA/PM `bapm-s1-ABC-210/…ff16a93d` (the close path).
- **EPIC-008 M1:** add a dated 2026-10-28 line. The agents moved hosts. M1 now uses option B: both R readings are taken on this host, the baseline at `3497aad2` and the close at the sha whose `src/` and `data/` equal `b5c67ab7`. Both use ABC-204 A4's protocol with E = 1 910 frozen and 200 games each, ALONE. **M1 = R(close) − R(baseline), half-width √(Y1² + Y2²).** The previous-host 2 061.3 ± 50.3 stands as a record but is **no longer the comparison**. The +100 target and "interval above 0" (Q1) are unchanged. Keep the old lines; supersede them by date.
- **E band:** E is frozen and has no E step. A reading outside 25–75 % is reported and graded as the page and ABC-204 say. Say plainly what that does to M1's grade. Don't invent a rule the owner hasn't given; if the page is silent, write it as UNKNOWN and route it to the owner via your Result.
- **Close path step 3:** re-word it to match: two R readings (3497aad2 first, then the close sha), PREREG first, one run each, final. M3 gates and G6 "≥ base" use 3497aad2 on this host. About 9 h ALONE. Step 4 grades M1 by the new rule.
- **EPIC-008 § Dependencies:** add a dated line saying the tool pins were re-pinned on this host per ABC-204 § Dependencies 2026-10-28 (`se-tools-rating-host`). Point to it; don't copy hashes.
- Put the board card lines in your Result. Don't edit the board.

## Fences
- Work only in your worktree. No `src/` or `tools/` edits, and no npm/vitest/timing.
- Never push, force, amend or rebase. Never merge into main.
- Records: class and count only (ADR-0049 d4).

## Publish
- Commit on your branch. Seal notes (task `bapm-epic008-hostB`) with `at` from `date -u`, including a `kind: decision`.
- Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
