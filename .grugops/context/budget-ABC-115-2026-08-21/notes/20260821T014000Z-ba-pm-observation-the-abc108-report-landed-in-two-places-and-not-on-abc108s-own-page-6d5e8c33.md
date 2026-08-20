---
id: 20260821T014000Z-ba-pm-observation-the-abc108-report-landed-in-two-places-and-not-on-abc108s-own-page-6d5e8c33
kind: observation
by: ba-pm
at: 2026-08-21T01:40:00Z
verified_by:
confidence: medium
refs:
  - ABC-115
  - ABC-108
  - NFR-008
  - N8-LANE
supersedes:
---

# THE `ABC-108` REPORT **DID LAND** — IN TWO PLACES, AND **NOT ON `ABC-108`'S OWN PAGE**. I AM NAMING THE GAP, NOT CLOSING IT

**Confirmed, by looking rather than by asking.** The engineer's lane contribution is recorded twice:

1. **As a context note** — `ticket-to-pr-ABC-115-2026-08-20/notes/…-n8-spawn-cpu-clause-is-breached-…`
   carries `ABC-108` on its `refs` list and states in its body that **+1.14 s wall and +1.02 s CPU are
   handed to `ABC-108` as a measured contribution**, with the base already breached on both clauses
   (**15.43 s CPU / 3.08 s wall** against 13 s / 3 s) before this ticket added a line.
2. **In `plans/traceability.md`**, in `ABC-115`'s row, in the `NFRs` cell, in the same words.

**What is NOT there, and it should be said out loud rather than left to be discovered:**
**`plans/tickets/ABC-108-the-default-test-lanes-own-budget-is-spent.md` contains ZERO occurrences of
`ABC-115`.** `grep -n "ABC-115"` on that file returns nothing. **`ABC-108` is in `Backlog` and its
page has no contributions ledger** — no section where `ABC-110`, `ABC-113`, `ABC-114` or `ABC-115`
have written their slices either. So this is not `ABC-115` failing to report; it is that **the
receiving page has no inbox**, and every contributing ticket to date has reported the same way.

**Is that adequate?** For `ABC-108` as it stands, yes: its own criteria require it to **re-measure the
lane when it is pulled**, and a re-measurement reads the true total regardless of who wrote what
where. The notes and the trace row are the audit trail for **where the growth came from**, which is
what a re-measurement cannot recover on its own.

**The residual, named:** whoever pulls `ABC-108` must read `ABC-110`, `ABC-113`, `ABC-114` and
`ABC-115`'s trace rows to assemble the contribution history, because no single page holds it. **A
contributions ledger on `ABC-108` would be worth cutting.** I am **not** cutting it here — the fence
on this subtask is explicit that `ABC-108` is not to be touched beyond the report already filed, and
a new ticket is not this hop's business.

## AND `NFR-008` IS NOT GRADED HERE

Stated flatly because the temptation is real and I have the numbers in hand. My own runs read the
delivered lane at **~4.2 s wall / ~16.9 s user+sys** against `NFR-008`'s 13 s CPU and 3 s wall, and
the **base at `badf6c3` is already over both** without a line of `ABC-115` in it. **That is a
measurement, not a verdict.** `NFR-008` is `ABC-108`'s to rule and `ABC-111` owns the wall clause's
warm/cold protocol; **neither is ruled, re-scored or moved here, and no `N8-LANE` line is claimed on
`ABC-115`** — same posture as the cut, the amendment, `ABC-110`, `ABC-113` and `ABC-114`. **A 7%
slice of a total that was already spent is not a slice.**
