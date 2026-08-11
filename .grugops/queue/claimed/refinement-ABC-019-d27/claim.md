---
task: refinement-ABC-019-d27
by: ba-pm
at: 2026-08-12T06:30:00Z
---

# Now-running registry record

Claimed per Workflow 17 step 2 by **atomic `mkdir`** of
`.grugops/queue/claimed/refinement-ABC-019-d27/`. The `claimed/` parent already existed (created by
an earlier hop), so no parent create was needed. `scripts/claim.js` is **absent from this repository**
— there is no `scripts/` directory at all — so the claim used the same atomic primitive by hand.
`mkdir` returned success, so the claim is held exclusively; a second claimant would have received
`EEXIST`.

This is the queue ownership record. It is **NOT** a `kind: claim` note and it is not part of the
shared verified context (Workflow 17, "The claim/note seam").
