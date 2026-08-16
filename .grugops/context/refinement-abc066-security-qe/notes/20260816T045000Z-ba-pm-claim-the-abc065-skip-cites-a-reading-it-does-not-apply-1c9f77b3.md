---
id: 20260816T045000Z-ba-pm-claim-the-abc065-skip-cites-a-reading-it-does-not-apply-1c9f77b3
kind: claim
by: ba-pm
at: 2026-08-16T04:50:00Z
verified_by: 
confidence: UNKNOWN - verify
refs:
  - ABC-065
  - ABC-072
  - .grugops/context/pull-abc065-066-2026-08-16/notes/20260816T030000Z-orchestrator-decision-abc065-merged-and-why-security-nfr-was-skipped-9f2b81d4.md
  - .grugops/context/security-nfr-ABC-066/notes/20260816T011500Z-security-nfr-decision-abc041-four-clauses-and-the-clause-b-misreading-4c1e77a3.md
supersedes: 
---

# The `ABC-065` Security/NFR skip **cites `S1`'s state reading and then applies a file-touched test**

**Recorded as a `claim` with `confidence: UNKNOWN - verify`, deliberately.** It is a reading of
another role's routing decision, it is not gate-adjudicable on this install, and **it is explicitly
non-load-bearing**: nothing in `ABC-072` or `ABC-073` depends on it being right. The subtask asked me
to say so in the ticket if I found it, and `ABC-072` `A5` is where it is carried as a question for the
Orchestrator to answer.

## What the two documents say

Security/NFR's `S1`: clause (b) is a **STATE** predicate over the tree — *"Fires if any non-`.test.ts`
file under `src/` … **reads** `process.`"* — and **7 production files read `process.` today**, so it
fires.

The Orchestrator's skip paragraph, in the same breath as citing that reading: *"Security/NFR's own
`S1` established that clause (b) is a **state** predicate, not a delta — but its subject is
*non-`.test.ts` files under `src/`*, and **this ticket touches none**."*

## The tension, stated plainly

**"Touches none" is a file-touched test.** Under the state reading `S1` established, the predicate
ranges over the **tree**, not over the diff — and the tree still holds those 7 files whatever
`ABC-065` touches. So under the reading the paragraph cites, **(b) fires on `ABC-065` too**, and the
gate would have run and — on all available evidence — **cleared it immediately**: `ABC-065` touched
**0** production files (measured by the Orchestrator), its capability delta is nil.

**Three things this claim is NOT:**

1. **Not a claim that anything unsafe merged.** `ABC-065`'s production surface is unchanged; the
   likely outcome of the un-run gate is the same PASS. **I am not asking for a merge to be re-opened.**
2. **Not an overturning of `S1`.** `S1`'s reading is right; I re-measured it independently and agree.
   The subtask's stop condition — *"`S1`'s state-vs-delta reading looks wrong → stop"* — **did not
   fire**.
3. **Not a Security/NFR verdict.** No verdict is being re-run or re-decided; that is out of my hands
   by instruction and by role.

## Why it matters enough to write down

The Orchestrator's own paragraph invites this: *"If the owner disagrees, this is the paragraph to
argue with — I would rather be told I skipped a gate than have the skip be invisible."* **This is that
argument, made from inside the same evidence.** It also demonstrates the cost of the unresolved
STATE-vs-DELTA question: **the routing decision was made twice, two days apart, on two different
readings of one clause.** If the ruling lands on DELTA, the skip is straightforwardly correct and this
claim evaporates; if it lands on STATE, the skip needs a sentence saying "(b) fired and was cleared on
the merits without a column move" rather than "(b) does not apply".

**Severity: MEDIUM. Owner: the Orchestrator** (the routing decision is his), with the shape question
routed to Architect/Design via `ABC-072` `A1`.
