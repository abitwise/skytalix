---
task: ticket-to-pr-ABC-041
by: software-engineer
at: 2026-08-13T21:14:02Z
---

Queue claim (WF17 step 2) — atomic `mkdir` of this directory IS the claim.
Hand-performed per `AGENTS.md` § Role / workflow files: `mkdir -p .grugops/queue/claimed` for the
parent, then a BARE `mkdir` (no `-p`) of this directory, which exited 0. `EEXIST` would have meant
the claim was lost and the hop would have stopped. `scripts/claim.js` does not exist in this repo or
in the kit.
