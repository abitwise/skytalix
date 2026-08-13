---
task: security-nfr-ABC-041
by: security-nfr
at: 2026-08-14T00:36:00Z
---

Queue claim (WF17 step 2) — atomic `mkdir` of this directory IS the claim.
Hand-performed per `AGENTS.md` § Role / workflow files: the `claimed/` parent already existed, then a
BARE `mkdir` (no `-p`) of this directory, which exited 0. `EEXIST` would have meant the claim was lost
and this hop would have stopped. `scripts/claim.js` does not exist in this repo or in the kit.

Sibling `quality-gate-ABC-041` is claimed in parallel by QE against the same tip (`ac17fe2`) in
`../cli-chess-qe041`. Two claims held, `queue.claim_cap` is 2 — at cap, not over it.
