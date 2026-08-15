---
id: 20260815T083500Z-architect-design-decision-the-spawn-account-as-written-70859c9b
kind: decision
by: architect-design
at: 2026-08-15T08:35:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - G1
  - N8-LANE
  - N8-SPAWN
  - NFR-008
  - ADR-0008
  - plans/nfr-catalog.md
supersedes: 
---

# `N8-SPAWN` is written into `NFR-008` — the charging test, the four exclusions, the three stops

**The owner's instruction is writable honestly, so this hop wrote it rather than stopping.** That was
the named stop condition and it is discharged, not skipped: an account can be worded so that a role
under time pressure applies it without a second question, without moving `NFR-008`'s level, without
re-deriving the 5%, and without letting the 13 s total be exceeded. All four held. Where they would
have collided is recorded in my limitations note, not hidden here.

## The one test that decides a charge, and why it is the floor account's test

The floor account carves out a cost class on one sentence: *"The floor is the runner's cost, not the
ticket's; charging a ticket for it makes a bar that two EMPTY files trip."* **The symmetry Security/NFR
recommended is real, and I checked it rather than accepted it:** the floor is a cost the ticket cannot
influence at all; a criteria-forced child is a cost the ticket cannot influence **without deleting one
of its own accepted criteria**. Those are not the same sentence, and the difference is the entire
danger — *"the ticket cannot influence it"* is a property of the world, while *"the ticket cannot
influence it without changing its criteria"* is a property of a document the ticket's own author
writes. **So the account is not written on "spawning is exempt". It is written on a three-part test
whose second and third parts fence exactly that gap:**

1. a **child process**, charged at its **own measured CPU**, child by child, beside the criterion that
   forces it — median of ≥ 5 direct timings on the reference machine;
2. **named by an accepted criterion or security bar**, and **countable off the criterion text before
   the build exists**;
3. **deleting the child would require deleting or weakening that criterion.**

Part 2 is the load-bearing one and it is not my invention: **it is what Security/NFR actually did at
the gate** — *"the ten children are countable off the criteria … and I verified the count against the
criterion text rather than against the build"* — promoted from a thing one careful checker did into
the thing the account requires. A count that can only be taken from the build is a count the build can
grow.

## The four exclusions, each aimed at a specific way this becomes a drawer

1. **In-process cost stays on the ticket.** Transform, collect, sweeps, source reads, fixtures. In the
   only measured case on record this is the difference between charging ~1070 ms and charging the
   whole ~1300 ms — the residual is content and content is what `N8-LANE` is for.
2. **A child that proves what an in-process assertion could prove is a convenience, and the ticket pays
   for it.** Without this clause, "spawn it instead of importing it" becomes free.
3. **No child beyond the count the criterion text forces** — repeats, retries, replicates, loops, or a
   child added after the cut. This is what makes part 2 enforceable rather than decorative.
4. **The per-file floor of the file holding the children is the FLOOR account's.** Nothing is charged
   to two accounts. Without this, a spawning ticket nets 160 ms twice.

## Owner and checker: BOTH UNCHANGED, and that is deliberate

`N8-LANE` names **BA/PM at each cut** and **Security/NFR at each gate**, and **the account changes
neither.** It creates no new role, no new hop and no new artifact. I considered giving BA/PM an
explicit cut-time duty to publish the forced-child list and **rejected it**: it is a new obligation on
another role's hop, the count is already derivable from criterion text that BA/PM writes anyway, and
the checker demonstrably derived it unaided. A rule that adds a step to someone else's hop should have
to earn it, and this one had not.

**Two things the account does fix for the checker**, both stated in the catalog: the count comes from
the criterion text and not from the build, and **a delivered spawn that no criterion names is a finding
against the ticket, never a charge to the account.**

## The three stops, and where each number comes from

**Stop 1 — the total, absolutely.** A charge that would put the lane's measured median over 13 s CPU
(or 3 s wall) is a breach of `NFR-008` itself and the account gives no relief. **This is the clause
that keeps the owner's answer inside its own bounds:** the owner authorized an account, not a larger
budget, and an account that could be spent past the total would have been a budget increase wearing an
attribution's name.

**Stop 2 — the criterion text is the ceiling on a single charge**, fixed at the cut, before anyone can
know what the measurement will say. A ceiling chosen after the number is known is not a ceiling.

**Stop 3 — two trip-wires, both denominated in the FIXED total.** Denominating either of them in the
lane as it stands would have re-created the geometric denominator this whole row exists to have
killed, so both are fractions of the 13 s CPU clause:

```
per-ticket wire   > 650 ms  =  one full N8-LANE slice   =  5% of the CPU clause  -> REPORT, never net silently
cumulative wire   > 1.3 s   =  two slices               = 10% of the CPU clause  -> account CLOSED until restated
```

**Why 10% for the cumulative wire, shown so it can be disagreed with rather than inherited.** Two
slices is the first figure at which the account is spending the budget faster than the bar it bypasses
would allow a single ticket to — and it is calibrated against the one measured child-set on record
(Security/NFR's child-by-child table, ten children, 1070 ms): **one such ticket does not close the
account and a second one does.** That is the intended calibration and it is **not a verdict on any
ticket** — what any ticket's charge actually is under the three-part test is the checker's to compute
at a gate. The measured headroom at the last reading (2.410 s remaining under the CPU clause) is the
reason the wire is set where a second such ticket trips it rather than a fifth: at that headroom, two
of them is most of what is left.

**CLOSED is defined, because an undefined stop is not a stop:** while the account is closed, a ticket's
forced children are charged to the ticket under `N8-LANE` as though the account did not exist. It
reverts to the status quo ante rather than blocking work, and only Architect/Design restating the
account against a fresh lane reading re-opens it.

## Attribution, recorded the way the floor account records its own

**Recommended by Security/NFR** (`ABC-042` gate, ruling 4, option 2), which explicitly declined to
create it — *"I have no authority to and I am not going to invent one at a gate"* — and that decline is
not overturned by this hop; what changed is the authority, not the reasoning. **Authorized by the
project owner, Olger Oeselg, in session 2026-08-15**, verbatim *"My decision: create a spawn account
and merge"*. **Written by Architect/Design**, which owns `NFR-008` and owns the floor account it is
modelled on. All three appear in the catalog section itself, not only here.

## What I deliberately did not do

- **No verdict, ratio or prediction about `ABC-042` is written anywhere in the catalog.** Applying the
  account to that ticket is Security/NFR's at the re-grade and its result is not assumed here. The
  account was written against the criterion-text test, **not tuned to make a number come out.**
- **The 5% is not re-derived** — the owner did not choose that option and BA/PM's cut-hop invitation
  stays open.
- **`N8-LANE`'s instrument, statistic, null-control and floor clauses are byte-identical**, hashed
  bullet by bullet before and after.
- **`ADR-0008` is not opened.** The account is fully writable without it, which is the subtask's own
  condition for touching it.
- **`plans/tickets/ABC-042-…md` was not opened**, `plans/board.md` was not moved, and
  `plans/traceability.md`'s `ABC-042` row was left alone — its `NFRs` cell carries two parallel
  Security/NFR writes and reconciling them is Security/NFR's next hop. **My role file tells me to
  append a trace row; the subtask forbids it on that row, and the subtask is authoritative for this
  hop.** The trace consequence of this write is therefore carried by these notes and by the catalog
  section's own dated heading, and it is named for the Orchestrator in my artifact note.
- **Zero bytes under `src/`.**
