---
id: 20260820T124500Z-ba-pm-decision-the-wall-clause-ticket-is-cut-and-its-id-is-abc-111-9957c8b6
kind: decision
by: ba-pm
at: 2026-08-20T12:45:00Z
verified_by:
confidence: high
refs:
  - ABC-111
  - ABC-110
  - ABC-108
  - ABC-109
  - NFR-008
  - N8-LANE
  - N8-SPAWN
  - ADR-0014
  - AR-N8LANE-078
  - plans/tickets/ABC-111-settle-the-warm-cold-protocol-for-nfr008s-wall-clause.md
supersedes:
---

# **THE ID IS `ABC-111`.** The `NFR-008` WALL-clause ticket is CUT — `M`, `P1`, DoR **9/10 ⚠️x1**, **pullable today** — and its deliverable is the **PROTOCOL question settled**, not the clause ruled

**This is not a stamp.** Hand-authored `decision`; no `finding` is admissible on this install.

## The id, stated explicitly so `ABC-110` `## Dependencies` can be closed on it

> **`ABC-111` — "Settle the warm/cold measurement protocol for `NFR-008`'s wall clause — a verdict
> that flips with the cache is not a verdict."**
> `plans/tickets/ABC-111-settle-the-warm-cold-protocol-for-nfr008s-wall-clause.md`, **`Backlog`**,
> **size `M`, priority `P1`, DoR 9 of 10 with one ⚠️**, owner at execution: **Architect/Design**, as
> `NFR-008`'s owner.

This is the ticket BA/PM recommended at `cut-lane-remedy-2026-08-19` and named the Orchestrator's to
route. **It was routed and it is cut.** `ABC-110`'s `## Dependencies` bullet is annotated in place
with the id — **the same shape in which `ABC-108` `A5`'s stated gap was closed by `ABC-110`'s
existence.**

## What the ticket delivers, and the line it is fenced behind

**Deliverable: the warm/cold question SETTLED, with testable acceptance.** Eight criteria; the two
that carry the weight:

- **`A5` is the whole test of "settled".** The settled protocol, run **twice, in separate sessions
  ≥ 1 h apart, at the same commit**, must place both medians **on the same side of 3 s**, with the
  difference stated in milliseconds. **The defect this ticket exists to fix is a verdict that flips**
  — so if the two runs land on opposite sides, the protocol has NOT settled the question, that is the
  recorded result, and it escalates rather than being resolved by choosing a run.
- **`A1`/`A2` make the two states comparable for the first time.** Each state gets its **own identity
  null control** at `n ≥ 8`, and the warm/cold delta is called an effect **only if it exceeds that
  null's own spread**. The 2026-08-19 cooled sample has `n = 6` against the row's `≥ 7` and **no null
  control at all** — so it enters `ABC-111` as a **motivation, not a datum**, and the page says so.

**NOT ruled here and NOT ruled by the ticket:** MET/BREACHED on the wall clause is Architect/Design's
as the row's owner, on the settled protocol. **Cutting a ticket is not ruling a clause, and the page
says that in its own `## Out of scope`.**

## Size `M` and priority `P1` — both arguments, both directions

**`M`, not `S`:** four to five conditions at `n ≥ 8` plus a gap-length arm plus a **second independent
session**, and the reproduction is not optional because it *is* the criterion. **Not `L`:** one
instrument, one question, no coverage re-homing, no blocking owner escalation, nothing under `src/`.
**`ABC-108` is the named comparator** — one measurement question, one protocol, one hand-off — and the
harness shape, the null control and the out-of-tree method are all **reused, not designed**.
**Split trigger named:** if the host will not expose the machine state `A3` needs, `A3` splits out as
its own `S` and the ticket closes on the rest.

**`P1`. Not `P0`:** the clause is **UNRULED, not BREACHED** — one sample of six, below the row's own
`n`, with no null control, is not a breach; nothing is stopped today; and **`ABC-110` `A1`–`A4` are
pullable without this**, so it blocks nothing currently pullable. **Not `P2`:** it gates the
admissibility of `ABC-110` `A6`'s closing wall figure, it is **the first time this lane has ever gone
over on wall**, and it is **cheap and unblocked today while `ABC-110` waits on a human**.

**`P0` promotion trigger, pre-registered so a later hop need not argue it:** a **protocol-conformant
reading at `n ≥ 8` with an admissible null control whose median wall exceeds 3 s** makes the wall
clause BREACHED, and a second breached clause on the same row is `P0` — the same shape as `ABC-108`'s
own trigger. **Demotion trigger:** `P2` if the owner moves the 3 s level under `ABC-110` `A5`, **on
his words and their date** — never on an agent deciding the question is moot.

## The one ⚠️, not smoothed

**Item 3, INVEST/estimable.** `A1`, `A2`, `A4`–`A8` are independent, small, testable and priced.
**`A3`'s effort depends on how much machine state is reachable from userspace on this host, and that
was unknown at the cut.** It is priced at `M` with the split trigger above, and **"undetermined" is
written into `A3` as an admissible outcome so the ticket cannot stall on it.**

**Item 10 is ✅ and deliberately so, and it is the sentence that should decide the routing: there is
no human decision and no environmental precondition on this ticket.** `ABC-110` waits on the owner;
this does not. The machine's failure to go quiet is **sized**, not blocking — `A1` reuses the sizing
shape that worked, not `ABC-108` `A1`'s unsatisfiable quiet threshold.

## What was NOT touched, recorded so the absence is legible

- **`plans/nfr-catalog.md` and `ADR-0014` were NOT opened for writing.** The eight rows
  `NFR-001`–`NFR-008` hash **`sha256 63f66795…ca31`**, verified from disk before and after this hop.
- **`NFR-008`'s 3 s and 13 s levels were not moved, not re-derived and not argued obsolete.**
- **`AR-N8LANE-078` was not re-opened** and **no ticket's `N8-LANE ≤ 650 ms` line was re-cut** —
  `ADR-0014` decision 4 left them standing on purpose.
- **`ABC-110`, `ABC-108` and `ABC-109` were NOT re-scored.** `ABC-110` keeps DoR 8/10 ⚠️x2; the only
  change to its page is one annotation inside `## Dependencies` (the id, and the `A2` figure
  dependency in the sibling `observation` note). **`ABC-108` and `ABC-109` were not opened at all.**
- **No board column moved, no WIP limit touched, nothing archived, nothing merged, nothing deployed.**
- **0 files under `src/`.** `git diff --name-only` under `src/` is empty for this branch.
