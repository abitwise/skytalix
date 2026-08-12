---
task: ticket-to-pr-ABC-028-t493
by: software-engineer
at: 2026-08-13T07:00:00Z
---

# Now-running registry record (Workflow 17 step 2)

Claimed BY HAND. `scripts/claim.js` does **not** exist in this repository — there is no
`scripts/` directory at all, checked at source this hop — so `claimTask` could not be called.
The atomic act was performed directly:

```
mkdir .grugops/queue/claimed                                 # missing parent, created first
mkdir .grugops/queue/claimed/ticket-to-pr-ABC-028-t493       # THE ATOMIC CLAIM (no -p)
```

Neither `mkdir` used `-p`, so an `EEXIST` on the task directory would have been a real lost
claim rather than a silent success. No `EEXIST` was raised: this hop won the claim.

`pending → claimed` and `claimed → done` are plain `mv`; the queue files are untracked in this
worktree, so `git mv` refuses.

This record is **not** a `kind: claim` note. It is the queue ownership record per Workflow 17's
claim/note seam.

Worktree: `../cli-chess-abc028-t493`
Branch:   `grugops/ABC-028-t493`
