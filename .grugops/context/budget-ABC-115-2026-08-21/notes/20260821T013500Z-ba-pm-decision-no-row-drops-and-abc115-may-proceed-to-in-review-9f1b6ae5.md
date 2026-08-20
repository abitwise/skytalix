---
id: 20260821T013500Z-ba-pm-decision-no-row-drops-and-abc115-may-proceed-to-in-review-9f1b6ae5
kind: decision
by: ba-pm
at: 2026-08-21T01:35:00Z
verified_by:
confidence: high
refs:
  - ABC-115
  - N8-SPAWN
  - A3
  - A9
supersedes:
---

# **NO ROW DROPS**, AND **`ABC-115` MAY PROCEED TO `In Review`** — on the re-derived clause, and the column move is not mine

## 1. No criterion is dropped, and I re-priced the option with my own coefficient before saying so

The engineer laid out three options and took none. **Option (b) — drop `A3`'s default-glyph pair —
is REJECTED for the second time, and this time it is also arithmetically pointless.**

At my measured **0.152 s per child**, dropping two children saves **~0.30 s**. That takes the
delivered **+1.19 s** to **~0.89 s** — **still 1.8x the 0.5 s ceiling it was supposed to reach.**
(The engineer priced the same move at ~0.32 s off +1.02 s, reaching ~0.70 s; different arithmetic,
identical conclusion.) **To get six children under 0.5 s you must delete THREE of them, and all six
are named by a criterion** — `A3` five, `A9` one, `A4` zero. **That is not a budget trim; it is
deleting half the ticket's evidence.**

**And it was already wrong on the merits before it was wrong on the numbers.** I priced and rejected
this exact trade at the amendment hop: *deleting a boundary guard to protect a proxy number is
trading the thing for the measure of the thing.* Nothing since has weakened that — the engineer's
watched-RED round 2 shows a bare-swallow mutant passing `A1`, `A2` **and all five of `A3`'s close
points** while `A9` is the only row that kills it. **`A9` is the whole guard, and the five `A3` rows
are what makes `A9`'s red mean something narrower than "the file broke".**

**If a row is ever to go, it is a RE-CUT and must be argued on the criterion's own value.** It may
never be argued from a number the criterion is inconvenient for. That is the rule, and this hop is
declining to break it on my own clause.

## 2. `ABC-115` may proceed to `In Review`

**The blocker is discharged.** The delivery does not breach `N8-SPAWN` as re-derived:

| clause | ceiling | delivered (my measurement) | verdict |
|---|---|---|---|
| added children | <= 6 | **+6** (pin 17 -> 23, asserted by the suite) | **MET**, exactly at the ceiling |
| added wall | <= 2.0 s | **+1.12 s** | **MET** |
| added CPU per child | <= 0.30 s | **0.198 s** (+1.19 s over 6) | **MET** |

**The basis, stated plainly so it cannot be read as a favour:**

- The clause it breached was **impossible from the day I wrote it** — six of the cheapest children
  that exist cost 0.91 s against a 0.5 s bar — so **the breach measured a defect in my criterion, not
  a defect in the delivery.**
- The delivery sits at **1.3x the theoretical floor**. There is no waste to send back.
- **Nothing else is outstanding on this ticket:** nine criteria answered, four mandatory gates green
  (`lint`, `typecheck`, `unit`, `build`), lane 40 files / 1212 tests / **0 skipped**, green —
  re-measured by me at both arms, 5/5. Both watched-RED rounds ran, and round 2 is the one that
  proves `A9`.
- **`A6`'s fence holds from git**, not from narration: exactly `src/cli.ts` and `src/cli.test.ts`,
  and **13 added production lines against a <= 15 bound.**

**AND THE ENGINEER WAS RIGHT TO STOP.** The ticket said *"a hop that meets the count and blows a time
clause has breached this ticket and says so rather than shipping"*, and they did exactly that: no row
dropped, no clause restated, no board move taken, the breach reported at full size against **both**
readings of "CPU" — including the reading less favourable to them. **A build that had quietly relaxed
my sentence would have hidden a defect in a criterion that would then have shipped into the next
ticket that copied it.** Stopping cost one hop and bought the correction above.

## 3. What I am NOT doing

**I am not moving `ABC-115`.** It stays in `In Development`. Two things stand between it and `Done`
and neither is mine:

- The `In Development` -> `In Review` move is the **Orchestrator's**, on its pull.
- **QE's `qe-e2e` hop is owed and has not run** — the owner's standing rule of 2026-08-17: *no ticket
  reaches `Done` without QE's recorded verdict*, and the `In Review` exit follows it.

**Also not mine and not done here:** no UAT (the diff carries 13 production lines, so the
zero-production-lines waiver **does not apply** and the owner's word is needed as before), nothing
merged, nothing deployed, nothing self-signed. `src/` untouched at this hop — `git diff --numstat`
against `aac410c` under `src/` is empty.
