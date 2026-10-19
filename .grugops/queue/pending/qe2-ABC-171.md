---
subtask: qe2-ABC-171
role: qe-e2e
ticket: ABC-171
branch: grugops/ABC-171 @ 5dee231c
ref: .grugops/context/qe2-ABC-171/
---

# QE re-check of ABC-171 after the rows hop (lean)

## Background
- Your first pass, `qe-ABC-171`, was PASS_WITH_GAPS.
- Since then BA/PM amended A8 and added A13a–d (`bapm-adr0045-cut`).
- The SE added those rows at `b62baabc` (tip `5dee231c`). See the done file `ticket-to-pr-ABC-171-rows.md`.

## What to check
1. Each of A8, A13a, A13b, A13c and A13d is present, passes, and kills its named mutant. The mutants are S12, S25, S31, S32, S33, S38 and S39. Re-run your `mutants3.mjs` set on a scratch copy.
2. Rule each gap QE-171-a to QE-171-f as closed, accepted or open.
3. Run the gates at the tip:
   - `last-run.json` shows `success: true` with the full count;
   - integrity at skip 0;
   - `merge-tree` against main is clean.

## Timing
- N8-LANE may be read only in a foreground-verified 180 s quiet window. Otherwise record it as OWED.
- Never estimate it.
- An ABC-173 SE hop may be running lanes in parallel. If so, the window is not quiet.

## Fences
- Work in a scratch detached worktree, `../wt-qe2-ABC-171`, and remove it at the end.
- Do not touch:
  - `src/`
  - `plans/board.md`
  - `plans/traceability.md`
  - `../wt-ABC-171`
  - `../wt-ABC-173`
  - any process you did not start
- Do not fix anything. Never push, merge or self-sign.

## Publish
- Hand-authored, unsealed notes under `ref:` in main's working tree, including a `kind: decision` note authored by `qe-e2e`.
- `.grugops/queue/done/qe2-ABC-171.md` and `.claim.md`, uncommitted. Include the verdict, each gap's state, the mutants, the gates, N8-LANE and a trace row.
