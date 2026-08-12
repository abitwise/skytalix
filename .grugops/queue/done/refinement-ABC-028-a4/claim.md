---
by: ba-pm
at: 2026-08-12T06:32:02Z
task: refinement-ABC-028-a4
---

Now-running registry record for the queue CLAIM (Workflow 17 step 2). This is NOT a
`kind: claim` context note — it carries work-ownership only.

Claimed by hand: `scripts/claim.js` does not exist in this repo (there is no `scripts/`
directory at all), so `claimTask` could not be called. The atomicity property was preserved by
using a bare `mkdir` (no `-p`) of `.grugops/queue/claimed/refinement-ABC-028-a4/` — a second
claimant would have received `EEXIST` and lost. The parent `claimed/` directory did not exist
and was created first with `mkdir -p`, so the atomic create had a live parent and could not
fail with a spurious parent-missing error.

Claimed in the `../cli-chess-ABC-029` worktree on branch `grugops/refinement-ABC-028-a4`. The
main worktree's copy of the queue was not touched.
