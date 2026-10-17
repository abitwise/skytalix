---
task: wave-2026-09-25
subtask: bapm-amend-ABC-056
role: ba-pm
ticket: plans/tickets/ABC-056-ar-1-accepted-risk-has-drifted.md
ref: .grugops/context/bapm-amend-ABC-056/
enqueued_by: orchestrator
enqueued_at: 2026-10-17T00:00:00Z
branch: grugops/ABC-056-restate-ar-1 (tip 10e7aab6) — work on THIS branch, in its existing worktree
---

# Subtask: rule on ABC-056 A3 check 5. Width 3: QE on ABC-155 and SE on ABC-039 run beside you.

The Release Manager stopped (`…/ticket-to-pr-ABC-056/notes/…abc056-a3-blocked-0d45639e.md` on the branch). The A3 fifth check, run as
written on 2026-10-17, prints `from "node:fs"` (`src/book-file.ts:13`, added by ABC-095 `09740ea4` after the 2026-10-12 re-score). With
`grep -vE "['\"](\./|node:)"` it is empty; no `require`/`createRequire`/non-literal `import(` in non-test `src/`.

Decide, on the page, with the reason:
1. Whether check 5 excludes `node:` built-ins (it measures "no npm package loaded at runtime"), and its exact command.
2. Whether a built-in on the runtime path changes how AR-1 must be re-stated (e.g. should the record name the built-in set it read,
   so its trigger also fires when a new specifier appears).
Re-check DoR. Amend only the ABC-056 page and append a traceability row. No other file. Commit on the branch. Never merge, push,
--force, --amend or rebase. If this needs the owner, STOP and give the exact question.
Finish with `.grugops/queue/done/bapm-amend-ABC-056.md` and its `.claim.md`, uncommitted on main.
