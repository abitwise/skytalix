---
task: refinement-ABC-017-a3
by: ba-pm
at: 2026-08-12T04:00:00Z
---

Claimed by atomic `mkdir` of `claimed/refinement-ABC-017-a3/` per Workflow 17 step 2.
`scripts/claim.js` does not exist in this repo or in the kit
(`$GRUGOPS_HOME/agent-factory/scripts/` does not exist at all), so the `mkdir` was run
directly and this registry record was written by hand.

**The `claimed/` parent was ABSENT and was created first — this is the FIFTH recorded
occurrence** (the Engineer's `ticket-to-pr-ABC-017-dev` claim recorded the third). The
parent is absent because `done/` transitions leave `claimed/` empty and something removes
it; a `mkdir -p` of the parent before the atomic child `mkdir` is the standing workaround.
Note that the atomicity guarantee lives in the CHILD `mkdir`, which was run without `-p`
and returned 0 — the claim is genuinely exclusive.
