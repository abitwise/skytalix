---
subtask: se-ABC-228
role: software-engineer
ticket: ABC-228
ref: .grugops/context/se-ABC-228/
workflow: agent-factory/workflows/ticket-to-pr (SE hop; QE follows with the smoke pair)
branch: new grugops/ABC-228 from main (24f3e322 or later), own worktree
width: ALONE (A8 forecast is a timing read)
---

# ABC-228: in check, quiescence searches every evasion; none means mate (ADR-0053, ACCEPTED)

Build ABC-228 to its ticket page (FOLDED blocks, DoR 10/10) and ADR-0053 (ACCEPTED 2026-10-30; decision 10 records the
owner's OQ-228-1 answer (ii)). Main now has ABC-235, ABC-240 and ABC-230.

## Do
- **A8 first:** decision 9's G6 forecast on today's main, as the ADR describes, ALONE. Record load1 and Tctl, with no
  cutechess and no foreign vitest (`pgrep -f "[/]vitest"`; wait-clear).
  - ≤ 100 % on both boards: build as designed; G6 is read by its rule.
  - Above 100 %: A9, the re-forecast at 4 000 ms (head at 4/3 of base's time), with a ≤ 133 % bar.
    - ≤ 133 %: build with (ii) as the ticket's Scope 5 says (LEVELS[5] and DEFAULT_BUDGET_MS → 4 000; test pins; the
      `tools/rating/rating.ts` R literal 3000 → 4000 in the same branch; G9 waived on LEVELS[5] only).
    - Above 133 %: STOP and report. That goes back to the owner.
- Decisions 2–4 and 6–9 with their off-door pairs; the acceptance rows in the existing test files; deep rows behind the
  existing flags. Plant faults and see them red.
- Gates: lint, typecheck, `npm test` and build green at every commit; G1, G5, G7, G8 and G9 as the ticket states. Leave G6's
  graded read and the smokes (A7) to QE.

## Fences
- `src/` (and `tools/rating/rating.ts` line 405 ONLY under (ii)) plus tests, the ticket's dated result line, and your context.
  No data/ edits. Own `npm ci --ignore-scripts`. Linters only via `npm run …`. **Never a bare `npx`.** No games.
- Never push, force, amend or rebase. Never merge into main. No board edits. **No host paths in any commit**, intermediate
  ones included.
- Keep scratch files in your own scratchpad subdirectory (`se-228/`). The scratchpad is shared.

## Publish
- Seal notes (task `se-ABC-228`) with `at` from `date -u`: the A8 (and A9) reading, the build, the gates. Commit on your
  branch. Write `## Result` plus a 10-cell trace row into this brief, then move it and its claim.md to done/. If the worktree
  guard refuses the main checkout's queue, put the done/ move on your branch's tracked copy and say so.
