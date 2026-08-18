---
id: 20260819T193000Z-ba-pm-decision-abc110-cut-l-p0-dor-8-of-10-options-sized-not-chosen-b7c2d9e1
kind: decision
by: ba-pm
at: 2026-08-19T19:30:00Z
verified_by:
confidence: high
refs:
  - ABC-110
  - ABC-108
  - ADR-0014
  - ADR-0008
  - NFR-008
  - N8-LANE
  - N8-SPAWN
  - OQ-1
supersedes:
---

# `ABC-110` is CUT — **`L` / `P0` / DoR 8 of 10, ⚠️x2**. The remedy `ADR-0014` records as OWED now exists and has an id. **The options are cut WITH THEIR SIZING and NOT CHOSEN**

**This is not a stamp.** Hand-authored `decision`; no `finding` is admissible on this install.
**Every measurement quoted is Architect/Design's, copied and not re-derived** —
`.grugops/context/design-oq1-lane-budget-2026-08-19/notes/` and `plans/nfr-catalog.md`
§ *"`OQ-1` IS RULED"*. **No measurement of my own was taken and none was needed.**

## What was cut

`plans/tickets/ABC-110-close-the-default-lanes-1480-ms-cpu-deficit.md` — *"Close the default lane's
1.480 s CPU deficit — `NFR-008` is BREACHED, and both levers that can close it change something the
owner ruled"*. Board row appended to `## Backlog`; traceability row appended. **No column moved, no
WIP limit touched, nothing archived, nothing merged.**

**`ADR-0014` § Decision 7 said a `P0` remedy ticket was owed and that its id was BA/PM's to assign.
It is `ABC-110`.** Architect/Design declined to invent one and said so in writing rather than
silently; **that refusal was correct and it left a STATED gap, not a hidden one** — `ABC-108` `A5`
required the ruling to name a follow-up id, and inventing `ABC-109` (which already exists, and is a
different ticket entirely) would have fabricated a board state. **The gap is closed by the cut.**

## `P0`, and exactly what the `P0` rests on

**Not on BA/PM's alarm — on `ABC-108`'s own pre-registered promotion trigger.** That page argued
itself DOWN to `P1` in writing (*"nothing is stopped today… what is damaged is the meaning of a
number"*) and named the single condition that would raise it: *"if a restated reading is taken and
comes back over 13 s CPU on a quiet machine, the follow-up remedy ticket is `P0`."*

**The reading came back at 14.480 s against 13 s — 111.4%, over by 1.480 s.** Ruled on the lower of
two samples deliberately; the protocol sample (n = 8, identity null control **+0.10% at sign 5/8 —
admissible**) reads 14.760 s = 113.5%.

**AND THE TRIGGER'S OWN WORDS SAY "ON A QUIET MACHINE", AND THIS WAS NOT ONE. The trigger is met on
SUBSTANCE, not because `A1` passed.** `A1` failed — lowest load observed anywhere was **1.44**
against a threshold of **1.0**. What carries the promotion instead is a **measured bound**:

```
load sensitivity of the instrument, three independent ways
  within one sample, 3.2x load rise                    +1.63% CPU
  across the samples, ~3x load fall                    -1.90% CPU
  the quietest single run of the hop, load 1.74        14.15 s = 8.8% OVER

deflation required to reach 13 s                        10.2%
largest measurable load effect over a 6x swing           1.9%
                                          RATIO          5.4x
```

**Five to six times larger than the entire measured load sensitivity, and not one of the fifteen
lane runs at any load came in under 13 s.** That distinction is carried onto the ticket page, the
board row and the trace row in those words, so a later reader cannot convert it into *"the machine
was quiet"*.

## The sizing that is ON THE PAGE because it kills the obvious remedy

**~70% of this lane's CPU is the PER-FILE FLOOR, not test execution** — per-file in-worker time sums
to roughly **4.2 s** of a **14.5 s** CPU total; the rest is transform, collect, prepare and the
per-file module-registry isolation `ADR-0008` deliberately bought.

**Therefore trimming assertions cannot close 1.480 s.** It aims at the smaller 30%, and the entire
30% is smaller than twice the deficit. **Only moving a WHOLE file removes its floor**, and at
**371 ms all-in per average file** the deficit is **~4 average files**, or fewer heavy ones.

**`A1` of the new ticket makes the per-file saving a MEASUREMENT and rules an inferred one
inadmissible.** `ADR-0014` marked it `UNKNOWN - verify` and it stays that way until measured: the
in-worker table in the ruling hop's `observation` note is a single run, is not CPU, and is not a
median — **it names candidates and prices none of them.** `A3` refuses assertion-trimming with the
arithmetic on the page rather than as a preference.

## The two levers named as NOT MINE, on the page, so nobody rediscovers them

1. **`isolate: false` — UNAVAILABLE.** `ADR-0008` decision 7: **30–36%** (it would close this gap
   twice over), **green in only 4 of 21 observed runs**, and it **disarms `zobrist.nfr.test.ts`,
   `gameend.nfr.test.ts` and `san.nfr.test.ts`** — `NFR-005`'s call-count sub-bar, `NFR-001`'s three
   `gameStatus` bars and `ABC-025`'s five `N1` rows. **This is the FOURTH time it has had to be
   written down and the page says so, so the fifth rediscovery is visibly a repeat.**
2. **Moving the 13 s level — the OWNER'S OUTRIGHT.** Not recommended, not argued obsolete, not
   moved. If he moves it, that is HIS ADR superseding `ADR-0014` on his quoted, dated words.

**And the third, which is why this escalates rather than executes:** the one lever an agent CAN pull
— moving whole files behind an opt-in lane — **changes what the default lane GUARANTEES**, against
this project's standing convention that every acceptance criterion is answered in the default lane.
**So `A5` fences ALL execution behind the owner's verbatim dated word. BA/PM cut the problem and the
options with their sizing and CHOSE NOTHING.**

**A fourth option is named and disqualified as a remedy rather than omitted: re-deriving `N8-LANE`'s
5%.** Worth doing on its own merits and **it creates no headroom whatsoever** — it changes what a
*ticket* may spend, not what the *lane* already costs. Leaving it off the page would have invited it
back as a fix.

## Size `L`, and why it is NOT split today

Four to eight candidate files measured at n = 8 under a rotating protocol at ~14.5 s CPU per run,
plus a coverage re-homing table by criterion id, plus an owner escalation, plus execution, plus a
conforming closing measurement. **Not `M`** — `ABC-108` was `M` for one measurement and its ruling.
**Not `XL`** — the protocol, the instrument and the opt-in lane shape all exist.

**Split trigger named instead of splitting now, because splitting now means splitting on an answer
nobody has:** `XS` if the owner moves the level (his ADR plus a re-statement, nothing else — and
`A1`–`A4` are still owed first, because he should not be asked to move a level without the sized
alternative in front of him); **two `M`s** if he takes the file move — `A1`–`A4` measure/price/
escalate, `A6`–`A9` execute/re-home/re-measure/rule.

## DoR **8 of 10, ⚠️x2 — and I am not smoothing either**

- **⚠️(3) INVEST — estimable only conditionally.** `A1`–`A4` are independent, small and fully
  testable; **`A6`–`A9`'s shape depends on a decision that has not been taken.**
- **⚠️(10) A MAJOR UNRESOLVED BLOCKER, and it is a HUMAN DECISION rather than an environmental
  input.** Both remedies that close the gap change something the owner ruled. Same species as
  `ABC-100`. **A page scoring 10/10 here would be promising a fix it is not permitted to pick.**
- **`A1`–`A4` ARE PULLABLE TODAY**, and the row and the page both say so — the blocker is downstream
  of them, and producing the sized set is precisely what unblocks the human.

The other eight items are ✅ and the reasons are on the page's own DoR table, not restated here.

## What the ticket carries against the lane, in `ADR-0014` decision 4's form

**0 new test files, 0 new tests, 0 new spawns → 0 ms measured against `N8-LANE`'s 650 ms — AND the
clause state is BREACHED.** Both halves are written, because writing only the first would be the
sentence `ADR-0014` decision 4 forbids. **`N8-SPAWN` stays 0 ms**; the harness runs outside the
repository. **`NFR-008`'s target here is the project's first NEGATIVE delta: savings ≥ 1.480 s.**
