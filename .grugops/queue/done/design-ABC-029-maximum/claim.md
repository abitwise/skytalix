---
task: design-ABC-029-maximum
by: architect-design
at: 2026-08-12T15:45:00Z
---

# Now-running registry record — Workflow 17 step 2

Hand-rolled. **`scripts/claim.js` does not exist** in this worktree — there is no `scripts/`
directory at all (checked at source this hop, not inherited from BA/PM's note). So `claimTask` was
executed by hand and the protocol's guarantee was preserved rather than approximated:

- the `claimed/` **parent** did not exist and was created first (a plain `mkdir`, rc 0);
- the **task directory itself** was a bare `mkdir` with **no `-p`** — rc 0, so this claim WON. A
  second claimant would have taken `EEXIST` (rc 1) and, per Workflow 17 step 2, would treat that as
  claim-lost rather than as an error.

Then `claim.md` (this file), then the subtask file moved `pending/ → claimed/` by `mv` (atomic
rename, Workflow 17 step 3). Both are moved to `done/` at the end of the hop — a claim directory
left behind is reclaimed by the stale sweep and resurrects finished work.

This record is **not** a `kind: claim` note. Workflow 17's claim/note seam: the queue owns
ownership, Workflow 16 owns memory.
