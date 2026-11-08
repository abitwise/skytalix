---
id: 20261108T085342Z-orchestrator-decision-e63ff24f
kind: decision
by: orchestrator
at: 2026-11-08T08:53:42Z
verified_by: 
confidence: high
refs:
  - ABC-292
  - ABC-308
  - ABC-289
  - ABC-286
  - ABC-288
  - bapm-ABC-292-accept
  - …d65215d0
  - …98877379
  - …23d30c72
supersedes: 
seal: sha256:7fbc00fc135d48c649df5b2f97c0033ce425671f2800bb4dfdc00e0302834fd6
---

## bapm-ABC-292-accept merged; its calls ruled; d10 step 2 complete

Merged `grugops/bapm-ABC-292-accept` (tip `2875a792`) at `3899d0c9`, path check clean; trace-row conflict kept both rows. Board: `ABC-286`, `ABC-288` Done (delivered by `ABC-303`); `ABC-289` Blocked → Done, closed NOT MET; `ABC-308` (E5c outposts) held in Backlog; `ABC-292` card updated, stays In Design.

**Rulings:**
- J1 (`ABC-292` page to In Design, matching the card) and J2 (the name E5c, S–M): kept.
- **Outposts after a miss on `ABC-292`: the stop covers them on hand values.** I asked the owner "if this term misses, is that the stop for hand values?" and he agreed. Outposts on hand values are on that path, so a miss on `ABC-292` means `ABC-308` does not reopen on hand values without his new word. A reopen inside a tuning pull is not a hand-valued term, but that pull's door needs a merged term, so it is moot after a miss. My reading of his words, not a new question. One dated line on `ABC-308` and EPIC-011 row 60 is owed by BA/PM's next hop (d10 step 5), with no hop of its own.
- `ABC-289`'s "Re-open: a change to P4 on its own ticket, or his word" stands. It is a door, not a route.

**d10 step 2 is met** (merged records: `5253ac39`, `3899d0c9`). **Step 3 next:** `qe-ABC-292-freeze`. The ADR-0024 pointer (…89b7220c) and this line ride the step-4/5 hops.
