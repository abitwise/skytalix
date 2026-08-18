---
task: ticket-to-pr-ABC-077-2026-08-17
subtask: ticket-to-pr-ABC-077
claimed_by: software-engineer
claimed_at: 2026-08-17T20:15:00Z
branch: grugops/abc077-negamax-alpha-beta
base: main @ bf371d7
---

# Queue claim — `ticket-to-pr-ABC-077`

Taken BY HAND per `AGENTS.md` § Role / workflow files: `mkdir -p .grugops/queue/claimed` for the
parent, then a **bare** `mkdir .grugops/queue/claimed/ticket-to-pr-ABC-077` — that bare `mkdir` is
the atomic act, and it succeeded (no `EEXIST`). `scripts/claim.js` is absent from this install and
was NOT re-derived.

This file is the claim record inside the claimed directory. It is not a context note and carries no
`kind`.
