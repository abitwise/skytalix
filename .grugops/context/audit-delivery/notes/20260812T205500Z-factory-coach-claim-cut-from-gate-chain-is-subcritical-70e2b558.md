---
id: 20260812T205500Z-factory-coach-claim-cut-from-gate-chain-is-subcritical-70e2b558
kind: claim
by: factory-coach
at: 2026-08-12T20:55:00Z
verified_by:
confidence: high
refs:
  - delivery-audit-2026-08-12
  - plans/metrics.md
  - ABC-009
  - ABC-010
  - ABC-011
  - ABC-013
  - ABC-016
  - ABC-017
  - ABC-022
  - ABC-023
  - ABC-024
  - ABC-025
  - ABC-026
  - ABC-027
  - ABC-028
  - ABC-029
  - ABC-030
  - ADR-0010
supersedes:
---

# The cut-from-a-gate chain is a DECAYING net, not a loop — 18 → 7 → 4 → 1 → 0, branching factor 0.48

I was told to verify the chain rather than repeat it from the brief. I did, from the tickets' own
opening prose and from the commits that created the files — **and the brief has one error.**

## THE CHAIN, VERIFIED — with two additions the brief did not name and one correction

| Cut ticket | Cut from | Verified against | Status |
|---|---|---|---|
| `ABC-009`, `ABC-010` | **an architecture-audit hop after `EPIC-001` closed** — not a ticket's gate | creating commit `a8bee67` 2026-07-29 *"docs(architecture): grug audit architecture, correct NFR-005, cut ABC-009/010"* | `Done` / **`Backlog`** |
| `ABC-011` | **an ADR/design hop** (`ADR-0002`/`ADR-0003` ratification round) | creating commit `4d00cb1` 2026-07-30 | `Done` |
| `ABC-022` | **`ABC-011`'s hops** — routed by THREE roles and cut by none of them: Architect/Design at the 2nd design hop (08-03), the Engineer during the fix, QE/E2E at the 2nd review | `ABC-022` ticket header, task `refinement-2026-08-04` | `Done` |
| `ABC-023` | **`ABC-009`'s last verification hop**, cut before `ABC-009` closed *(the brief did not name this link)* | `ABC-023` header: task `ticket-to-pr-ABC-009`, subtask `bapm-abc009-a13-verify` | `Done` |
| `ABC-024` | **`ABC-023`'s QE hop** | board row, BA/PM, "HARDENING not a defect" | **`Backlog`** |
| `ABC-025` | **`ABC-013`'s close / QE hop** — owed by `RISK-ABC013-04`; that QE hop reported five wrong builds and the cutting hop found a sixth *(the brief did not name this link)* | `ABC-025` header, task `ticket-to-pr-ABC-025` | `Done` |
| `ABC-026` | **`ABC-025`'s Security/NFR gate, risk #9** | board row: *"cut from ABC-025's Security/NFR gate risk #9 by BA/PM at the `N5` ruling hop"* | **`Backlog`** |
| `ABC-027` | **`ADR-0010`, at `ABC-016`'s review cycle** — hop 9, *"ADR-0010 accepted and merged; the frame-clearing change routed to a NEW ticket"* | `ABC-016` board history | `Done` |
| `ABC-028` | **`ABC-017`'s MERGE**, BA/PM at task `abc017-cut-2026-08-12` | board row + ticket header | `Done` |
| `ABC-029` | **`ABC-017`'s MERGE — the SAME task `abc017-cut-2026-08-12`, cut together with `ABC-028`** | board row: *"cut from `ABC-017`'s MERGE by BA/PM at task `abc017-cut…`"* | `Done` |
| `ABC-030` | **`ABC-028`'s shape hunt** (hop 21, task `abc028-shape-2026-08-13`) | board `Backlog` row | **`Backlog`** |

**CORRECTION TO MY BRIEF.** The brief says *"`ABC-029` and `ABC-030` from `ABC-028`'s hops."*
`ABC-030` yes. **`ABC-029` no** — `ABC-029` is `ABC-028`'s SIBLING, not its child: both were cut at
the same hop from the same parent (`ABC-017`'s merge). This matters for the loop question, because
a sibling is fan-out from one gate and a child is another generation of chain. Reading them as
parent-and-child makes the chain look one generation deeper than it is.

## THE COUNT I WAS ASKED FOR

**Of the 25 `Done` tickets, 8 were themselves cut from another ticket's gate, audit or review hop:**
`ABC-009`, `ABC-011`, `ABC-022`, `ABC-023`, `ABC-025`, `ABC-027`, `ABC-028`, `ABC-029` — **32%.**

Narrowing to *"cut from another **ticket's** gate"* (excluding `ABC-009`/`ABC-011`, which came from
a standalone architecture audit and an ADR hop rather than from a ticket): **6 of 25 = 24%.**

Across all 30 tickets, **12 originated at an inspection hop rather than at an epic decomposition —
40%.** Four of those twelve are still open (`ABC-010`, `ABC-024`, `ABC-026`, `ABC-030`).

## THE LOOP TEST — measured, not argued

A gate-cutting process is a branching process. It is a **loop** if each ticket's gates produce ≥1
new ticket on average (`b ≥ 1`, the population never dies out) and a **decaying net** if `b < 1`
(every branch terminates). So I counted generations.

| Generation | Origin | Tickets | Count |
|---|---|---|---|
| **Gen 0** | epic decomposition | `ABC-001`…`ABC-008`, `ABC-012`…`ABC-021` | **18** |
| **Gen 1** | cut from a gen-0 ticket's gate/audit | `ABC-009`, `ABC-010`, `ABC-011`, `ABC-025`, `ABC-027`, `ABC-028`, `ABC-029` | **7** |
| **Gen 2** | cut from a gen-1 ticket | `ABC-022`, `ABC-023`, `ABC-026`, `ABC-030` | **4** |
| **Gen 3** | cut from a gen-2 ticket | `ABC-024` | **1** |
| **Gen 4** | — | none | **0** |

**Per-generation branching factor: 7/18 = 0.39, then 4/7 = 0.57, then 1/4 = 0.25, then 0.**
**Overall b = 12/25 = 0.48.** Every generation is subcritical, the absolute sizes decay
monotonically (**18 → 7 → 4 → 1 → 0**), and no cut has ever pointed back at an ancestor — there is
no cycle in the graph, only a tree that is running out of leaves.

**Severity decays with depth too, which is what a healthy net looks like and a loop does not.**
Gen 0 is mostly `P0`/`M`–`L`. Gen 1 is `P1`/`S`–`M`. Gen 2 is `P2`/`S`. Gen 3 (`ABC-024`) is
`P2`/`S`. The most recent cut of all, `ABC-030`, is **`XS`/`P3`** — one line of comment maintenance.
**The chain is not producing ever-more work; it is producing ever-smaller work and then stopping.**

## DID THE 2026-07-31 `WIP`-ROW WARNING COME TRUE? NO — AND THAT IS THE DIRECT ANSWER

That row warned: *"a backlog growing at 10 tickets in two days with a delivery rate of zero"* and
*"`Ready` is a buffer feeding `In Development`, and a buffer that fills while the column it feeds is
empty is a queue, not a pipeline."*

Open tickets (created minus done), recomputed from creation and merge dates:

**8 → 0 (07-24) → 3 → 13 (07-31, the peak the warning was written at) → 12 → 11 → 9 → 7 → 10 → 5 (today).**

`Ready` went from **6/8** to **0/8**. The peak was 13; it is 5. **The queue drained.** The warning
was correctly raised and it did not materialise — which is worth recording as loudly as a warning
that did, because a factory that never closes out its own alarms learns to ignore them.

## THE RULING — healthy net, with one named reservation

**This is a gate catching real gaps, not a factory feeding itself.** The evidence:

1. **`b = 0.48`, subcritical at every generation.** Arithmetically, this chain terminates.
2. **The gate-cut work drains FASTER than the planned work.** Median lead time for a gate-cut
   ticket is **1 day**; for an epic-decomposed ticket, **9 days**. The self-generated backlog is
   not the bottleneck — it is the *fastest-moving* work in the factory.
3. **The gaps were real and three of them were behavioural.** `ABC-009`, `ABC-011` and `ABC-022`
   were defects in code already merged as `Done` — an illegal castle offered by `legalMoves`, a
   Zobrist key that under-detects repetition, en-passant offered against its own preconditions.
   Those were found by the audit/gate chain. Without it they would be in the engine today.
4. **No cycle, decaying size, decaying priority.** The terminal leaf is an `XS`/`P3` comment fix.

**The reservation, and it is the one thing I would watch:** gen 1→2 had the *highest* branching
factor (**0.57**), and every gen-2 and gen-3 ticket is HARDENING with a **zero** production diff.
The chain is not exploding, but its tail is entirely test-and-record work of falling priority. **If
a future generation ever branches above 1.0, or if a gate cuts a ticket at depth 4, that is the
signal to stop cutting and start deferring.** Neither has happened. Today the answer is: the net
is working.
