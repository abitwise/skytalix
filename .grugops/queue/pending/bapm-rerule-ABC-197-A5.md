---
subtask: bapm-rerule-ABC-197-A5
role: ba-pm
ticket: plans/tickets/ABC-197-one-step-100-uci-row-restores-the-dropped-token-budget-band-qe-177-b.md
ref: .grugops/context/bapm-rerule-ABC-197-A5/
inputs: SE …ba08acdc (the A5 problem), …eeec2b5f (G scan, plants), …3c9e5d2b in .grugops/context/ticket-to-pr-ABC-197/notes/ (copied from ../wt-ABC-197, where they stay uncommitted to keep A2's file list); branch grugops/ABC-197 @ 20e397c8; Security/NFR …d0c770b5 (headroom 0.990 s); Architect …578a9290
width: 1
---

# Re-rule ABC-197's A5: two of its four plants cannot go red under A1's bound

## The problem (the SE's reading; verify it from the code, not only the note)
- **QP6-3300:** `go` clips with `Math.min(request.budgetMs, level.budgetMs)`, and no level allows more than 3 000. Any G above 3 000 is output-identical to the correct build, so no test row on any level can catch it.
- **QP6-2900:** at step 100, G 2 900 reads `time 3000`, which passes `≥ 3 000`. R2 catches G ≤ 2 800 and misses about [2 850, 3 000).
- The page's Problem line has the same slip ("caught any G at or below 2 900 ms").

## Do
- Verify both claims by reading `src/` and the SE's evidence (`/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/se197/`). Do not run timing; small scratch test runs to confirm a plant are allowed.
- Re-rule A5. Options:
  - drop QP6-3300 as unkillable by design, with a reason;
  - move the 2 900 probe to a G the row can catch;
  - tighten A1's bound, if that is within the ticket's scope and costs no new spawn;
  - your call.
- Correct the Problem line with a dated erratum. Refresh the stale headroom cost line (0.605 → 0.990 s, `…d0c770b5`).
- Keep DoR 10/10. If the fix needs code beyond the built row, say whether the SE must re-build. If a bound or requirement would move, STOP and raise it as an owner question.

## Fences
- Records only, plus scratch confirmations under `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/bapm197/`. Work on `grugops/bapm-rerule-ABC-197-A5` (worktree `../wt-bapm-rerule-ABC-197-A5` from `main`). No `src/`, `tools/`, `package*.json` or `AGENTS.md`. On `plans/board.md`: one `_Updated` line. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `bapm-rerule-ABC-197-A5`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.
