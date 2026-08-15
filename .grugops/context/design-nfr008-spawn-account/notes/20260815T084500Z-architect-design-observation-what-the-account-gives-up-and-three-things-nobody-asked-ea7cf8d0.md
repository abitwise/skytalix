---
id: 20260815T084500Z-architect-design-observation-what-the-account-gives-up-and-three-things-nobody-asked-ea7cf8d0
kind: observation
by: architect-design
at: 2026-08-15T08:45:00Z
verified_by: 
confidence: high
refs:
  - N8-SPAWN
  - N8-LANE
  - NFR-008
  - ADR-0008
  - plans/nfr-catalog.md
supersedes: 
---

# What `N8-SPAWN` gives up, the total-exceeded check the subtask demanded, and three things nobody asked me about

## 1. The total cannot be exceeded — the check, run rather than asserted

The subtask required this to be answered in a note rather than in the catalog. **It cannot be
exceeded, by construction, and the construction is stop 1:** a charge that would put the lane's
measured median over 13 s CPU (or 3 s wall) is a breach of `NFR-008` itself and the account gives no
relief from it. **Nothing was written that lets an account balance sit outside the total.**

**The residual, stated because it is real.** The cumulative wire fires *after* a charge, so a single
very large ticket can take the account from 0 to most of the remaining headroom before the wire has
anything to close. Stop 1 still catches the total; what would be lost is the *warning*. In that case
the per-ticket wire is the only thing that surfaces it — and it is disclosure, not refusal. **The
account therefore protects the total absolutely and protects the runway only approximately.**

## 2. What the account gives up, plainly

**It removes the only per-ticket instrument that could see spawn cost, and replaces a bar with a
brake.** `N8-LANE` refuses; the wires report and pause. That is a genuine loosening of per-ticket
control and it is exactly what the owner authorized — the account was recommended, escalated and
answered on the record. **It is written down here so nobody later discovers it as a surprise and reads
it as an oversight.**

The compensating controls are the three-part charging test (a child must be *forced*, and forced by
text written before the build), the four exclusions, and both wires. **None of them is a gate.** The
honest summary: `N8-SPAWN` converts a hard per-ticket refusal into a hard total plus a disclosed
attribution.

## 3. NOT ASKED — the FLOOR account has the same unbounded shape and no wire at all

Checked while modelling the new account on it. **`N8-LANE`'s floor clause nets `160 ms × files added`
out of a ticket's own charge with no cap, no wire and no disclosure duty.** A ticket that adds ten
test files nets 1.6 s out of its charge — more than two full slices — and nothing but the 13 s total
notices. The recorded planning number is ~7 more files at today's all-in cost, so this is not
hypothetical arithmetic about a distant lane.

**I did not touch it.** The owner authorized a spawn account, not a floor-account amendment, and
widening a hop's authority because the adjacent text has the same defect is the move this ticket has
caught in others. **Consequence to be honest about: as of today the NEW account has stops the OLDER
one does not**, which is defensible (a child costs 90–220 ms and is discretionary at the cut, a
per-file floor is neither) but is an asymmetry a reader will notice before I explain it.

**The shape of the ask, if the owner wants it acted on:** *should the floor account carry the same
disclosure wire the spawn account now carries?* One clause, no measurement needed, BA/PM cut hop or
Architect/Design. **Not ticketed here** — cutting tickets is not this hop's.

## 4. NOT ASKED — the WALL clause is the clause with no attribution at all, and spawning is the first cost it can see

`NFR-008` has two clauses. The CPU clause now has three accounts. **The 3 s WALL clause has none, and
no per-ticket bar either** — deliberately, because a per-ticket wall bar is unmeasurable by
construction (the row measured it: two added files move wall by −15 to +3 ms, and the identity null
reads *larger* than the signal).

**Spawning breaks that symmetry, and it is the first cost class on this lane that does.** At the gate
the ten serialised children moved the wall by **+620 ms with the sign 7/7** against a null of −1.86% at
3/7 — i.e. the wall clock, which cannot see two added test files, sees children clearly. **So a
spawning ticket's wall cost is attributed to nobody and bounded only by the 3 s total**, and the
account I just wrote is CPU-only and says so.

**No change is asked for and none is made.** It is named because the reasoning that makes a per-ticket
wall bar unmeasurable was derived on file-adding tickets, and a spawning ticket is not one. If
spawning becomes common, that reasoning is worth re-reading rather than inherited. **Owner:
Architect/Design (this row). Trigger: the second ticket whose criteria force child processes.**

## 5. NOT ASKED — two censuses are stale as of this write, and neither is mine to repair quietly

- **`NFR-008`'s own table cell says the budget has TWO ACCOUNTS.** There are now three.
- **`ADR-0008`'s Decision 6 says the same**, in an owner-ratified ADR.

Both are flagged in the catalog section and **neither is edited**. This is the same species as
`ADR-0008`'s *"all four `*.nfr.test.ts` files"* — correct when written, stale at seven, flagged by the
2026-08-12 audit and deliberately not edited. **The repair is a census correction, it is one word in
each place, and it wants a hop with the authority to write inside a ratified row** — which this
subtask explicitly did not grant for `ADR-0008` and which I did not assume for the table cell.

## 6. For the Orchestrator — the subtask's `base:` was one commit stale

`base: grugops/abc042-merge-key @ 6f05887`, but `6f05887` does not contain
`.grugops/context/g1-answered-2026-08-15/` — the `parent_ref:` the same subtask names as the first
thing to read. The cause is mechanical: the subtask file was authored **in** `039766f` and could not
name its own commit. **This branch is based on the tip `039766f`**, a strict superset. Recorded so the
next subtask writer knows the failure mode, not as a complaint: a `base:` sha written into a file that
the same commit creates is always one behind.
