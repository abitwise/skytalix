---
by: software-engineer
at: 2026-09-25T13:58:56Z
task: ticket-to-pr-ABC-122
---
Claimed by hand per AGENTS.md (no `scripts/claim.js` on this install): `mkdir -p
.grugops/queue/claimed` then a bare `mkdir .grugops/queue/claimed/ticket-to-pr-ABC-122`.
Worktree `.claude/worktrees/ABC-122-gate-hardening`, branch `grugops/ABC-122-gate-hardening`
from `66a45d1`. `at` is this machine's `date -u` at the claim; the queue file's own
`enqueued_at: 20:10Z` is later than it — clock skew between hops, recorded, not corrected.
