---
subtask: se-ABC-228-ii
role: software-engineer
ticket: ABC-228
ref: .grugops/context/se-ABC-228-ii/
branch: grugops/ABC-228 @ d9c5bcde (worktree .claude/worktrees/agent-a2b69825faac13325); commit on it, forward only
width: ALONE (A9 is a timed read)
---

# SE ABC-228 (ii): build Scope 5, read A9 at 4 000 ms, fold QE's rows

## Why
qe-ABC-228 FAIL, STOPPED at G6: position-6 median depth head 9 vs base 10 (kiwipete 8/8). Finding QE-228-c (HIGH).
Owner's OQ-228-1 = (ii) already covers an A8/G6 miss (ticket § FOLDED; ADR-0053 d10). No new owner word needed.

## Read
- The ticket: Scope 5, A5 "Under (ii)", A6 "Under (ii)", A9, § Test notes 4, § Follow-ups. ADR-0053 d10.
- QE notes on branch grugops/qe-ABC-228 (task `qe-ABC-228`): `…8829bc22` (G6/G11 + node counts), `…70c4723b`
  (verdict), checkpoint `…bcf2fd7c` (QE's 6 rows + QE-C4). QE's G6 script: `.grugops/context/qe-ABC-228/raw/qe-scripts/g6.mjs` on that branch.

## Do
1. Scope 5 exactly as the ticket says (data only: LEVELS[5] → 4 000 ms; rating.ts R literal → 4000; nothing else).
   G9 waived on LEVELS[5] only.
2. A9 ALONE: forecast at 4 000 ms on kiwipete and position-6, bar ≤ 133 %. Wait-clear (no foreign vitest/cutechess)
   before timed reads. Above 133 % on either board: STOP, report; do not tune further.
3. QE-228-b: move QE's 6 rows + QE-C4 into `src/quiescence.test.ts` (test-only).
4. Gates via `npm run …`: lint, typecheck, unit, build; npm test count.

## Fences
No other src/ value changes. Never push, force, amend, rebase, or merge into main. No board edits. Never bare `npx`
or `npm exec`. No host paths in commits. Scratch in your scratchpad `se-228-ii/`.

## Publish
Sealed notes (task `se-ABC-228-ii`, `at` from `date -u`), commit on the branch, `## Result` + 10-cell trace row here,
then move this brief + claim to done/ (tracked copy on your branch if the worktree guard refuses).
