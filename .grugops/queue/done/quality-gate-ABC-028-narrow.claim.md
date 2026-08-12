---
task: quality-gate-ABC-028-narrow
by: qe-e2e
at: 2026-08-12T23:50:00Z
---

# Claim record — narrow re-gate of ABC-028

Claimed by hand per Workflow 17 step 2: `scripts/claim.js` does NOT exist in this repository
(there is no `scripts/` directory at all — checked at source this hop). The atomic act was a
bare `mkdir` (no `-p`) of `.grugops/queue/claimed/quality-gate-ABC-028-narrow/`; the missing
parent `.grugops/queue/claimed/` was created first with `mkdir -p`, which is NOT the racing act.

Worktree: ../cli-chess-abc028-qe3, branch `grugops/quality-gate-ABC-028-narrow`.
The `pending -> claimed` and `claimed -> done` moves are plain `mv`; the queue files are
untracked, so `git mv` refuses.
