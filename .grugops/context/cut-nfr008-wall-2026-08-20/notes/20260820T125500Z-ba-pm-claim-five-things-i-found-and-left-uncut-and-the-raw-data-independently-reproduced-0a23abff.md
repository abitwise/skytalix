---
id: 20260820T125500Z-ba-pm-claim-five-things-i-found-and-left-uncut-and-the-raw-data-independently-reproduced-0a23abff
kind: claim
by: ba-pm
at: 2026-08-20T12:55:00Z
verified_by:
confidence: high
refs:
  - ABC-111
  - ABC-110
  - ABC-108
  - ABC-105
  - ABC-086
  - NFR-008
  - N8-LANE
  - ADR-0014
  - AR-N8LANE-078
supersedes:
---

# **Architect/Design's nine published statistics REPRODUCE EXACTLY from the raw TSVs**, and **five things I found and deliberately did NOT cut**

**This is not a stamp.** Hand-authored `claim`; no `finding` is admissible on this install.

## 0. The check my derived numbers rest on, run because they would otherwise rest on a guess

**The raw TSVs at `design-oq1-lane-budget-2026-08-19` carry NO header row.** My CPU/wall ratios in the
sibling `observation` note depend entirely on reading them as
`round | condition | wall | user | sys | status | loadavg` (sample 1) and
`run | load_before | wall | user | sys | status | load_after` (sample 2). **That is an inference, so I
tested it against every statistic Architect/Design published from the same files:**

```
                          published        recomputed from my column reading
A  wall / CPU medians     2.805 / 14.760   2.805 / 14.760   MATCH
N  wall / CPU medians     2.785 / 14.795   2.785 / 14.795   MATCH
P  wall / CPU medians     2.880 / 16.120   2.880 / 16.120   MATCH
cooled wall / CPU         3.120 / 14.480   3.120 / 14.480   MATCH
null control N-A          +15 ms, sign 5/8 +15 ms, sign 5/8  MATCH  (deltas +20 -120 -80 +10 +90 +60 -220 +60 ms)
slope probe P-A           +1230 ms, 8/8    +1230 ms, 8/8     MATCH
per-file slope            153.7 ms         153.75 ms         MATCH (published figure is truncated, not rounded)
```

**Nine of nine, on an independent implementation.** The column reading is right, and the published
reading is arithmetically sound end to end — **which is a second, unasked-for result of this hop: the
2026-08-19 measurement has now been re-derived from its own raw data by a different role.**

**The one process point, and it is small: a raw artifact published as evidence with no header row is
one misread away from a wrong derived number.** Context notes are append-only so those files are not
edited. **Not cut as a ticket** — the cost is a header line on the next harness, not a work item —
**but `ABC-111`'s harness should emit one, and this note is where a later reader finds the column
meanings if it does not.**

## Five things I found and deliberately did NOT cut

**One ticket was authorised and `ABC-111` is it.** Each of these is named and left standing, which is
the Orchestrator's to route — exactly as `ABC-111` itself was.

1. **THE RULED CPU FIGURE RESTS ON THE NON-CONFORMANT SAMPLE, and nobody has said so.** `ADR-0014`
   rules the CPU clause on **14.480 s — the cooled sample, `n = 6` against the row's own `≥ 7`, with
   no identity null control at all** — while the **protocol-conformant** sample reads **14.760 s**.
   **The RULING is not in doubt** (both are over 13 s, and ruling on the lower was a deliberate,
   correct choice by Architect/Design so the verdict would not depend on sample preference). **What
   is odd is that the FIGURE OF RECORD is the one the row's own protocol would not admit.** **Not
   cut:** it is an amendment to a ruling by the role that owns it, not a ticket, and **`ABC-111` `A7`
   already forces the number into the open.** Recommended: Architect/Design restates the ruled figure
   on the settled protocol when `ABC-111` closes. **This is the same fact as the 1.480 s / 1.760 s
   deficit dependency, seen from the ruling's side rather than `ABC-110`'s.**
2. **THE PROCESS FAILURE — still the highest-value thing on this list, still uncut, and now one hop
   older.** `NFR-008` item 6 wrote the restatement rule (*when files land, restate by arithmetic, do
   not re-measure*) and published its own forecast — *"USE ~7 AS THE PLANNING NUMBER AND ~16 AS THE
   CEILING"*, *"tight, not comfortable"*. **Eleven files landed against a planning number of seven and
   nobody ran the one line of arithmetic at any cut.** **No role re-runs that restatement when a test
   file lands, and nothing observes that it was not run** — the same shape as `ABC-105` (nothing
   observes the QE hop). **I recommended it on 2026-08-19, it was not routed, and I am recording that
   plainly rather than quietly re-recommending it.** Size `S`, priced against `ABC-105`'s design
   rather than from scratch. **It is a detector/process ticket and it is not a remedy.**
3. **Re-deriving `N8-LANE`'s 5% against today's plan** — `NFR-008`'s own standing invitation, still
   unexercised after two rulings and one more hop. `XS`/`S`. **It creates NO headroom** — it changes
   what a *ticket* may spend, not what the *lane* already costs — and cutting it beside `ABC-110`
   invites exactly the misreading `ADR-0014` warned about. **Not cut, and it is already on `ABC-110`
   `## Out of scope` with that sentence attached.**
4. **NEW, and it generalises `ABC-111`: no NFR row on this project states a REPRODUCTION TOLERANCE for
   its own protocol.** `NFR-008` specifies instrument, statistic, `n`, machine and an admissibility
   control — and says nothing about how closely two independent runs of it must agree. **`ABC-111`
   `A5` invents that requirement for one clause of one row** (*same side of 3 s, difference stated in
   ms*). **The straddle happened because the row was silent, and every other row is silent in the
   same way.** **Not cut:** it is a cross-cutting amendment to `plans/nfr-catalog.md`, that file is
   the row owners', and cutting it before `ABC-111` demonstrates the shape on one row would be
   generalising from zero examples. **Recommended AFTER `ABC-111` closes**, sized `S`, and `ABC-111`
   is its worked example.
5. **`ABC-086`'s trace row still carries the stale 79.9% lane figure and I left it standing again.**
   It reads *"`NFR-008` is at 79.9% of its CPU clause at 28 files"*; the clause is at 111.4%. **Its
   DIRECTION was right and has been vindicated — the warning was correct and the number merely
   understates it now** — and re-cutting other tickets' lane lines is not this hop's. **Recorded a
   second time so the next reader knows 79.9% is a 2026-08-13 figure.**

## And one thing I was forbidden and did not do, recorded so the absence is legible

**`plans/nfr-catalog.md` and `ADR-0014` were NOT opened for writing** — the eight rows
`NFR-001`–`NFR-008` hash **`sha256 63f66795…ca31`**, verified from disk before and after. **No
`N8-LANE ≤ 650 ms` line was re-cut**, **`AR-N8LANE-078` was not re-opened**, **`NFR-008`'s 3 s and
13 s levels were not moved**, **the wall clause was not ruled**, **no board column was moved**, and
**`ABC-110` / `ABC-108` / `ABC-109` were not re-scored** — `ABC-110` keeps DoR 8/10 ⚠️x2 and the only
edit to its page is one in-place annotation inside `## Dependencies`.
