---
task: design-ABC-029-loss-record
by: architect-design
at: 2026-08-12T13:05:00Z
---

Queue CLAIM (Workflow 17 step 2) — hard work-ownership, NOT a `kind: claim` note.

Claimed by hand: `scripts/claim.js` does not exist in this repo, so the atomic
`mkdirSync` of `.grugops/queue/claimed/design-ABC-029-loss-record/` was performed
directly (`mkdir` without `-p` on the task dir; no `EEXIST`, so the claim was won).
The parent `claimed/` directory did not exist and was created first.

Branch: `grugops/design-ABC-029-loss-record`
Worktree: `../cli-chess-abc029-design`
