---
task: security-nfr-ABC-019
by: security-nfr
at: 2026-08-12T00:00:00Z
worktree: ../cli-chess-abc019-sec
branch: grugops/security-nfr-ABC-019
---

Now-running registry record per Workflow 17 step 2.

Claimed by hand: `scripts/claim.js` does NOT exist in this repo, so the atomic
`mkdirSync` of `claimed/security-nfr-ABC-019/` was performed directly with
`mkdir` (no `-p` on the task dir, so an existing dir would have failed as
EEXIST = claim lost). The claim directory's existence IS the claim.
