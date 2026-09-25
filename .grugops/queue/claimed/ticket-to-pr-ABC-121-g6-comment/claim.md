---
task: ticket-to-pr-ABC-121-g6-comment
by: software-engineer
at: 2026-09-25T20:48:12Z
---

Hand-authored claim per Workflow 17 (`scripts/claim.js` absent on this install — see
`AGENTS.md`'s "No `finding` is admissible on this install" paragraph). This directory's atomic
`mkdir` (no `-p`) is the claim act. (`at` is the host wall clock; it reads earlier than the
enqueue's `enqueued_at`, which was hand-written ahead of the clock.)
