---
task: ticket-to-pr-ABC-022
subtask: ticket-to-pr-ABC-022-bapm2
by: ba-pm
at: 2026-08-09T20:46:34Z
---

Queue claim record (CLAIM-01/CLAIM-02). Atomic `mkdir` of this directory returned exit 0, so this
role is the first and only writer. `scripts/claim.js` does not exist in this install (verified: no
`scripts/` directory in the repository and none under the kit root), so the claim was taken by hand
with a plain atomic `mkdir`. This record is NOT a `kind: claim` note.
