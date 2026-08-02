---
task: ticket-to-pr-ABC-011-qe
by: qe-e2e
at: 2026-08-03T10:00:00Z
---

Claimed BY HAND. This install has no `scripts/claim.js`, so Workflow 17 step 2's atomic
`mkdirSync` claim could not be executed as specified. Width is 1 and no contention is
possible; the manual `mkdir -p` + this registry record stand in for the atomic claim and are
recorded here as a degraded substitute, not as an equivalent.
