---
subtask: bapm-q3c-oq228ii-fold
role: ba-pm
ref: .grugops/context/bapm-q3c-oq228ii-fold/
branch: new grugops/bapm-q3c-oq228ii-fold from main, own worktree
---

# BA/PM: cut the Q3 (c) ticket; fold OQ-228-1 (ii) into ABC-228; fix EPIC-010

Source: the owner note `orch-2026-10-29g/…c4ab73de`, and the Architect's `arch-q3c-oq228ii/…b86f7d93` (with the
ADR-0020 § AMENDMENT 2026-10-30 and ADR-0053 decision 10 on main).

## Do
1. **Cut the Q3 (c) ticket** (next free id after ABC-240): S, P2, EPIC-010 M1, value-changing (10 D + 10 R smoke with
   the repetition-ending count), waits on ABC-230's merge. Scope C1–C4 from the amendment. Its acceptance comes from
   the tests the amendment lists, including `turn-loop.ts` claimShortfall counting the same list. DoR scored.
2. **Fold (ii) into ABC-228:** the re-forecast at 4 000 ms with its ≤ 133 % bar (above → back to the owner); the
   conditional G9 waiver on LEVELS[5] only; G5, G6 and G11 under (ii); the trend-pool close and the 4 000 ms batches. Decide and
   record which ticket carries the `tools/rating/rating.ts` R literal 3000 → 4000 (only on a miss; it must land before
   ABC-228's R smoke). Note that ABC-225 is Blocked (thermal), so ABC-228 is likely the carrier. List the re-reads the
   ADR names.
3. **EPIC-010:** Q3 answered (c) (Out of scope ep line, § B item 3, owner-questions table, ticket table); the header
   line that still says "pending the owner" → (ii).

## Fences
- plans/epics, plans/tickets and your context only. No ADR, src/, tools/, data/ or board edits. An SE is building ABC-230
  in parallel: don't edit the ABC-230 page.
- Never push, force, amend or rebase. Never merge into main. No host paths. Never bare `npx`.

## Publish
- Seal notes (task `bapm-q3c-oq228ii-fold`) with `at` from `date -u`. Commit on your branch. Write `## Result` plus a 10-cell
  trace row into this brief, then move it and its claim.md to done/.
