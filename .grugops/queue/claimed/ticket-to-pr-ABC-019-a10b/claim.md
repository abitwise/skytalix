---
task: ticket-to-pr-ABC-019-a10b
by: software-engineer
at: 2026-08-11T21:30:00Z
---

# Now-running registry record

Claimed per `agent-factory/workflows/17-task-claim.md` **by hand** — `scripts/claim.js` does not
exist in this repo. `mkdir .grugops/queue/claimed/ticket-to-pr-ABC-019-a10b/` returned success (not
`EEXIST`), so this is a won claim, not a lost one. The `claimed/` parent already existed.

This is the queue ownership record. It is **not** a `kind: claim` note and it is not shared context.
