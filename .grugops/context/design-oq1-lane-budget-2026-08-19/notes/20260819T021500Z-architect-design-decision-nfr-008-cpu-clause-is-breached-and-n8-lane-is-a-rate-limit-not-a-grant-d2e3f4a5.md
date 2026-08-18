---
id: 20260819T021500Z-architect-design-decision-nfr-008-cpu-clause-is-breached-and-n8-lane-is-a-rate-limit-not-a-grant-d2e3f4a5
kind: decision
by: architect-design
at: 2026-08-19T02:15:00Z
verified_by:
confidence: high
refs:
  - ABC-108
  - OQ-1
  - NFR-008
  - N8-LANE
  - N8-SPAWN
  - ADR-0008
  - ADR-0014
  - AR-N8LANE-078
supersedes:
---

# `OQ-1` IS RULED. **`NFR-008`'s CPU clause is BREACHED — 14.480 s (cooled, n=6) / 14.760 s (protocol, n=8) against 13 s at `54cbb23`, 39 files / 1181 tests.** The wall clause is **NOT ruled** and I say why. **`N8-LANE` is a RATE LIMIT, not a grant, and that is the sentence that replaces the one Security/NFR left**

**This is not a stamp.** Hand-authored `decision`; no `finding` is admissible on this install.
**The reading, its protocol, its raw data and its full honesty clause are in this task's
`observation` note and are not restated here.**

## The ruling, in one line each

> **`NFR-008` CPU clause (`≤ 13 s`): BREACHED.** Ruled on **14.480 s**, the median of the quieter of
> two samples, at `main` @ `54cbb23`, **39 test files / 1181 tests**, Apple M3 (Mac15,13) / 8 logical
> cores / Darwin 25.5.0 arm64 / Node v24.12.0 / vitest 3.2.7; `UNKNOWN - verify` elsewhere.
> **Over by 1.480 s = 111.4% of the clause.** The protocol-conformant sample (n = 8, identity null
> control **+0.10% at sign 5/8 — admissible**) reads **14.760 s = 113.5%**. **I rule on the lower of
> the two, deliberately: if the breach survives the reading most favourable to the lane, the ruling
> does not depend on which sample a reader prefers.**

> **`NFR-008` wall clause (`≤ 3 s`): NOT RULED. It is at the boundary and my two samples straddle
> it** — **2.805 s** (protocol, n = 8, warm interleaved rounds) and **3.120 s** (cooled, n = 6, below
> the row's own `n`). **93.5% and 104.0% of the same clause.** A clause whose verdict flips with the
> filesystem cache has not been measured well enough to rule, and **ruling it "MET" on the warm
> sample would be picking the flattering number** — the exact move `ABC-108` exists to prevent.
> **Recorded as measured and left open.** It is not this ticket's clause and nothing in the remedy
> below is blocked by it.

## Why `high` confidence on a reading taken on a machine that failed `A1`

**`A1` failed and I am not going to pretend otherwise: the lowest 1-min load average observed
anywhere in this hop was 1.44, the maximum was 10.24, and the threshold is 1.0.** `ABC-108`'s ⚠️ was
right and the machine could not be quieted from inside it — ~20 agent worktrees are live.

**`A1` also cannot be satisfied by a measurement of this lane, on this machine, ever**, and that is a
property of the criterion: the lane runs 7 worker threads at ~5x parallelism, so **the harness drives
the 1-min load average above 1.0 by itself, inside a single round.** A load threshold sampled at
round boundaries during a back-to-back harness is measuring the harness.

**So quiet was not asserted — the contamination was SIZED, and it is small enough that the ruling
does not need it to be zero:**

```
load sensitivity of this instrument, measured three ways
  within sample 1, load 3.2x rise (3.0 -> 9.5)                  +1.63% CPU
  across samples, load ~3x fall (7.19 -> 2.17)                  -1.90% CPU
  the single QUIETEST run of the hop, load 1.74                 14.15 s  =  8.8% OVER the clause

deflation required to reach 13 s from the ruled figure          10.2%
largest load effect measurable over a 6x load swing              1.9%
                                                    RATIO       5.4x
```

**The breach is five to six times larger than the entire measured load sensitivity of the
instrument, and not one of the 15 runs of the lane taken in this hop — at any load — came in under
13 s.** That is why `high`, on a machine that failed `A1`. **A bounded honest answer, which is what
was asked for.**

## The honesty clause `ABC-108` was built around is DISCHARGED, and it resolves against the lane

`ABC-108` was written so it could not be read as though the breach were established, because
Security/NFR read **383 ms/file against the ratified 341 ms** and could not size the difference.
**It is sized now.** This hop reads **371 ms/file** (cooled) and **378 ms/file** (protocol) — between
the two figures, **at a lower load than either**. Of the 42 ms/file gap, **~7 ms/file is load and
~35 ms/file is content and file mix**: the lane grew **28 → 39 files and 807 → 1181 tests**, and the
eleven files added since the ratified reading cost **449 ms/file all-in — 32% above the old lane's
average**.

**And the deflation argument runs the wrong way.** The ratified 341 ms is itself a loaded figure —
its own item 7 records a load median of **10.56** with 98 of 135 runs above 8 cores, and says so in
its own words. **Deflating today's number toward a baseline that is itself inflated is not a
correction; it is double-counting in the lane's favour.**

**The row's own restatement arithmetic reaches the same verdict from the 2026-08-13 numbers alone:**
`9.545 + 11 × 0.341 = 13.30 s` — **over the clause without any measurement of mine.** The forecast
was published on 2026-08-13 (*"~7 as the planning number"*, *"tight, not comfortable"*); **eleven
files landed against a planning number of seven.** Nobody re-read the row at a cut. **The
measurement confirmed a forecast; it did not discover a surprise.**

## `A6` — what `N8-LANE` means from 2026-08-19 forward. **This grants nothing and loosens nothing**

Security/NFR left the sentence *"a 5% slice of a total that is already spent is not a slice of
anything"* for the next gate to inherit. **Here is the sentence that replaces it:**

> **`N8-LANE`'s 650 ms is STILL MEASURED, STILL BINDING and STILL 5% OF THE 13 s CLAUSE — but from
> 2026-08-19 it is a RATE LIMIT and not a GRANT, and passing it no longer implies `NFR-008` is
> respected, because it is not.** A ticket must still measure its charge under the row's protocol and
> still state it against **650 ms**, against the **clause** (13 s) and never against the current lane.
> **What a ticket may no longer do is conclude anything about the budget from passing.** The lane is
> **overdrawn by 1.480 s**, so every charge — including a compliant one — adds to an overdraft.

**Three consequences, written so they cannot be read as permission:**

1. **`N8-LANE MET` may never again be written to mean "the lane is within budget".** Write the
   measured milliseconds, then the clause state as ruled. A cut or a gate that writes only the
   percentage has said nothing true.
2. **Every ticket in flight and in `Backlog` carrying an `N8-LANE ≤ 650 ms` line keeps that line and
   it is still checkable** — the arithmetic that stopped being honest was *"and therefore the lane is
   fine"*, not the 650 ms itself. **No ticket needs re-cutting for this, and BA/PM does not have to
   re-open pages.**
3. **The 5% is UNTOUCHED and so is everything else.** `N8-LANE`'s 5%, its CPU instrument, its
   paired-median statistic, its identity null control, its 160 ms per-file floor and `N8-SPAWN`'s
   0 ms balance are all unmoved by this ruling. **`NFR-008`'s 3 s / 13 s level is Olger Oeselg's and
   this hop measured AGAINST it rather than touching it.** Nothing here is looser than what it
   replaced; every clause is strictly harder to read as a pass.

## `AR-N8LANE-078` — the accepted risk this ruling was supposed to discharge

**Discharged as an input, exactly as Security/NFR framed it — and it is confirmed as a category
error to charge to `ABC-078`.** `ABC-078`'s ~840 ms is **not** the cause of the breach: the
arithmetic restatement was over the clause at **13.30 s** on 2026-08-13's own published per-file
figure, before `ABC-078` existed. **`AR-N8LANE-078` is closed as an accounting question and stays
closed as a historical record; the 190 ms overspend it names is 13% of the 1.480 s deficit and
removing it entirely would not clear the clause.** No new risk is opened against `ABC-078`.

## The remedy — NOT CHOSEN HERE, and one of the four is the owner's alone

`ABC-108` fences the remedy out and I keep that fence. **The deficit a remedy must close is
`1.480 s`** (or `1.760 s` if a reader prefers the protocol sample). What this hop adds is that the
options are now **sized** rather than listed:

1. **`isolate: false` — UNAVAILABLE, and NOT re-derived.** `ADR-0008` decision 7: 30–36% saving,
   green in 4 of 21 runs, disarms `zobrist.nfr.test.ts` / `gameend.nfr.test.ts` / `san.nfr.test.ts`.
   **It would close the gap twice over and it is still not available.** Recorded so the next reader
   does not spend a hop rediscovering it.
2. **Move whole files behind an existing opt-in lane** (the `PERFT_DEEP` / `SEARCH_DEEP` /
   `ENGINE_DEEP` / `INPUT_DEEP` shape). **AVAILABLE, and it is the only lever an agent can pull.**
   Sizing: **~70% of this lane's CPU is the per-file floor, not test execution** (the whole per-file
   in-worker time sums to ~4.2 s of a 14.5 s total), so **trimming assertions inside files is aimed
   at the smaller 30% and will not close 1.480 s.** Only moving a **whole file** removes its floor.
   At 371 ms all-in per average file that is **~4 average files**, or fewer heavy ones.
   **`UNKNOWN - verify`: the all-in saving per specific file was not measured here and must be
   measured by the remedy ticket, not inferred.** **The price is named: it removes default-lane
   coverage, and this project's standing convention is that every acceptance criterion is answered
   in the default lane.**
3. **Re-derive the 5% against today's plan** — the row's own standing invitation, **still
   unexercised**. **It must be said plainly that this creates no headroom whatsoever:** re-deriving
   the fraction changes what a *ticket* may spend, not what the *lane* already costs. It is worth
   doing and it is not a remedy for this breach.
4. **Move the 13 s level — the owner's alone. I stop here.** It is `ABC-108`'s `## Out of scope`, it
   is `NFR-008`'s own wording, and it is Olger Oeselg's, ratified in person 2026-08-11. **I do not
   recommend it, I do not argue it obsolete, and I have not moved it.**

## What happens next, and what I could NOT do

**A remedy ticket is OWED and it is `P0`** by `ABC-108`'s own named promotion trigger (*"if a
restated reading is taken and comes back over 13 s CPU on a quiet machine, the follow-up remedy
ticket is `P0` and this page says so in advance"*) — **noting honestly that the reading was taken on
a machine that failed `A1`, and that the trigger is met on substance because the contamination was
sized at 1.9% against a 10.2% breach.**

**`A5` asks the ruling to name a follow-up ticket id and I cannot supply one.** Cutting a ticket and
assigning an id are BA/PM's at a cut and the board is the Orchestrator's; **inventing `ABC-109` here
would be fabricating a board state.** So the ruling names the requirement, the priority and the
owner, and the id is written in by BA/PM at the cut. **That is a stated gap in `A5`, not a silent
one.**

## Escalated, plainly, rather than routed around

1. **`NFR-008` is a merged, ratified contract and it is now BREACHED.** The clause did not change —
   the lane grew past it. **Every remedy that closes the gap changes something the owner ruled**:
   option 2 changes what the default lane guarantees (coverage moves behind flags), option 4 changes
   his level. **That choice is his and it is escalated, not routed around.**
2. **`A1` is unsatisfiable as written on this machine for this lane** — a load threshold sampled
   during a self-parallel harness measures the harness. **The measurable replacement that worked is
   the load SENSITIVITY of the instrument** (~2% over a 6x swing). Whoever re-scores `ABC-108`
   should know `A1` failed and why, and that the ruling stands anyway on the bound rather than on a
   claim of quiet.
3. **The wall clause is unruled and one sample is over it.** It is the first time any sample of this
   lane has exceeded 3 s. **It wants its own measurement, on the row's protocol, with the warm/cold
   question settled — and that is not this ticket's clause.**

## Recorded where

`plans/nfr-catalog.md` (the ruling, under the rows that own it), `ADR-0014` (the standing decision
and its rollback), `memory-bank/00-index.md` (ADR count, same commit), `plans/traceability.md`.
**No board column was moved, nothing was merged, nothing was deployed, no bar/floor/level was
relaxed, and `git diff --name-only` under `src/` is empty.**
