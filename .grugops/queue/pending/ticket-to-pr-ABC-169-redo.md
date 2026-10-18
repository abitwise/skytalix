---
subtask: ticket-to-pr-ABC-169-redo
role: software-engineer
ticket: ABC-169
page: plans/tickets/ABC-169-declare-the-engine-private.md (as amended on main b40a2f77)
branch: grugops/ABC-169 (existing, tip 4a0a075f)
worktree: ../wt-ABC-169 (existing)
---

# ABC-169 redo: the one-line AT_HEAD edit (amended Scope 4)

Read the amended page on main, and your own hop record `.grugops/queue/done/ticket-to-pr-ABC-169.md`.

1. In `../wt-ABC-169`, merge main (`git merge --no-ff main`) so the branch carries the amended page. Keep both sides on any trace
   conflict.
2. Add exactly one commit with the `"license",` element in `AT_HEAD` (`src/cli.test.ts`), and nothing else.
3. Take A6's "still bites" reading: with only the `"license"` line removed from `package.json` (working tree only, then restored),
   `A10` is the only red row.
4. Re-run all gates and re-state A1–A6, the A3 comment-only measurement and the waiver grep against the merge base.

There are no timing readings, and the other rules from the first brief still apply. When you are done, write
`.grugops/queue/done/ticket-to-pr-ABC-169-redo.md` and `.claim.md`, uncommitted, in main's working tree.
