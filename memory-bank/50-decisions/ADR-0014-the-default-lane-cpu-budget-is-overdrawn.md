# ADR-0014: The default lane's CPU budget is overdrawn, and `N8-LANE` is a rate limit rather than a grant

## Status

`superseded by ADR-0019` — **on the LEVEL of the CPU clause only**, 2026-09-19, exactly as
`## Rollback` below prescribes: the owner moved the 13 s to 15 s in session (*"3. raise to 15s for
now"*, Olger Oeselg, 2026-09-19) and `ADR-0019` records him. **Every other decision here — the
measurement at `54cbb23`, the content attribution, the sizing of the alternatives, decision 4's
form of words — stands as the record `ADR-0019` builds on.** Decision 4's rate-limit reading lapses
by its own rollback clause on `ADR-0019`'s conforming reading (14.940 s ≤ 15 s), with 60 ms of
headroom; see `ADR-0019` decision 5.

Was: `accepted` — 2026-08-19, by Architect/Design at `ABC-108` (task
`design-oq1-lane-budget-2026-08-19`), the owner of `NFR-008`.

**Scope fence, first, because this ADR is about a level it does not touch.** `NFR-008`'s
`≤ 3 s wall / ≤ 13 s CPU` level is **Olger Oeselg's**, ratified in person 2026-08-11. **This ADR
records that the lane has grown past that level. It does not move it, re-baseline it, or argue it
obsolete, and nothing in it may be read as doing so.** It amends no clause of `ADR-0008`; it records
what happened to the budget `ADR-0008` created.

## Context

`ADR-0008` gave the default test lane a **total** and denominated the per-ticket bar (`N8-LANE`) in
that total rather than in the current lane, precisely so that *n* tickets at 5% would consume the
budget **once** — an arithmetic series — instead of multiplying it by `1.05ⁿ`. That design worked as
intended. **What it could not do was stop the budget from being spent, and the budget is now spent.**

The 2026-08-13 ratified reading measured **9.545 s CPU at 28 files** post-`threads` and published its
own forecast in its own words: *"USE ~7 AS THE PLANNING NUMBER AND ~16 AS THE CEILING"* at ~341 ms
all-in per file, *"tight, not comfortable"*. It also wrote down the restatement rule — when files
land, **restate by arithmetic, do not re-measure**.

**Eleven files landed against a planning number of seven, and nobody ran the restatement.** Security/
NFR caught it at `ABC-078`'s gate on 2026-08-18, measured the lane at **13.400 s without that
ticket's file**, and filed `OQ-1` rather than a breach verdict — correctly, because it read **383 ms
per file against the ratified 341 ms** and could not separate load inflation from content. `ABC-108`
cut that open question, fenced the remedy out, and made a **quiet machine** the precondition of the
answer.

**That precondition could not be met and was not faked.** This machine carries ~20 live agent
worktrees; the lowest 1-min load average observed anywhere in the ruling hop was **1.44** against
`ABC-108` `A1`'s threshold of **1.0**. It is also unmeetable in principle for this lane: the lane
runs 7 worker threads at ~5x parallelism, so an interleaved harness drives the 1-min load average
above 1.0 **by itself**. **A load threshold sampled during a self-parallel harness measures the
harness.** So the hop stopped asserting quiet and **sized the contamination instead**.

Full reading, raw per-run data and honesty clause:
`.grugops/context/design-oq1-lane-budget-2026-08-19/notes/`. The ruling as published:
`plans/nfr-catalog.md`, section *"`OQ-1` IS RULED"*.

## Decision

**1. `NFR-008`'s CPU clause is BREACHED.** Ruled on **14.480 s** against **13 s**, at `main` @
`54cbb23`, **39 test files / 1181 tests**, Apple M3 (Mac15,13) / 8 logical cores / Darwin 25.5.0
arm64 / Node v24.12.0 / vitest 3.2.7 — **`UNKNOWN - verify` on any other hardware.** Over by
**1.480 s = 111.4% of the clause**. The protocol-conformant sample (n = 8, identity null control
**+0.10% at sign 5/8, admissible**) reads **14.760 s = 113.5%**. **The ruling is taken on the lower
of the two on purpose: a breach that survives the reading most favourable to the lane does not depend
on which sample a reader prefers.**

**2. `NFR-008`'s WALL clause is NOT RULED, and the refusal is deliberate.** Two samples straddle it —
**2.805 s (93.5%)** warm-interleaved and **3.120 s (104.0%)** cooled. **A clause whose verdict flips
with the filesystem cache has not been measured well enough to rule, and picking the flattering
sample is exactly the failure `ABC-108` exists to prevent.** It is the first 3 s+ sample this lane
has produced. It wants its own measurement, with the warm/cold question settled.

**3. The verdict does not rest on a quiet machine, because there was none. It rests on a MEASURED
bound on the contamination.** Load sensitivity of this instrument, three independent ways:
**+1.63%** across a 3.2x load rise within one sample; **−1.90%** across a ~3x load fall between
samples; and the **single quietest run of the hop, at load 1.74, still read 14.15 s — 8.8% over the
clause.** Closing a **10.2%** deficit would take a deflation **5.4x larger than the entire measured
load sensitivity**, and **not one of the fifteen lane runs taken in the hop, at any load, came in
under 13 s.**

**4. `N8-LANE` is a RATE LIMIT, not a GRANT, from 2026-08-19 — and this makes it strictly harder to
pass on, never easier.** The 650 ms is still measured, still binding, and still 5% of **the clause**
(never of the current lane). **What a ticket may no longer do is conclude anything about the budget
from passing it.** The lane is overdrawn by 1.480 s, so **every charge, including a fully compliant
one, adds to an overdraft.** `N8-LANE MET` may never again be written to mean *"the lane is within
budget"*: write the measured milliseconds, then the ruled clause state. **Tickets already carrying an
`N8-LANE ≤ 650 ms` line keep it and it stays checkable** — what stopped being honest was the sentence
*"and therefore the lane is fine"*, never the 650 ms.

**5. Nothing else moved, and that is part of the decision rather than a disclaimer.** `N8-LANE`'s 5%,
its CPU instrument, its paired-median statistic, its identity null control and its **160 ms per-file
floor** are untouched; **`N8-SPAWN`'s balance stays 0 ms**; the eight `NFR-001`–`NFR-008` table rows
are byte-identical (`sha256 63f66795…ca31`, unchanged across five hops now); `src/` is byte-identical
and no test was added, deleted, trimmed or moved.

**6. The gap is CONTENT, not load, and it was attributed rather than assumed.** Per-file all-in reads
**371 ms** (cooled) / **378 ms** (protocol) against the ratified **341 ms** and the inherited
**383 ms** — between the two, at a **lower** load than either. Of the 42 ms/file gap, **~7 ms/file is
load and ~35 ms/file is content and file mix**: the eleven files added since the ratified reading
cost **449 ms/file all-in, 32% above the old lane's average.** **And the deflation argument runs
backwards:** the ratified 341 ms is itself a loaded figure (its own item 7 records a load median of
**10.56**, 98 of 135 runs above 8 cores, *"the load pushes the absolutes UP"*), so **how much of the
ratified baseline is inflation is `UNKNOWN - verify` — only that it is not a floor.**

**7. The remedy is NOT decided here.** `ABC-108` fences it out and this ADR keeps that fence. **A
`P0` remedy ticket is owed**, by `ABC-108`'s own named promotion trigger; **its id is BA/PM's to
assign at the cut, and inventing one here would be fabricating a board state.** What this ADR
contributes is the **sizing** — see Alternatives.

## Alternatives

The four options `OQ-1` named, sized against the **1.480 s** deficit. **None is chosen here and one
is not mine to choose.**

- **`isolate: false` — UNAVAILABLE, and recorded so nobody rediscovers it.** `ADR-0008` decision 7:
  saves 30–36%, **green in only 4 of 21 observed runs**, and disarms `zobrist.nfr.test.ts`,
  `gameend.nfr.test.ts` and `san.nfr.test.ts` — `NFR-005`'s call-count sub-bar, `NFR-001`'s three
  `gameStatus` bars and `ABC-025`'s five `N1` rows. **It would close this gap twice over and it is
  still not available.** This is the third time it has had to be written down.
- **Move whole files behind an existing opt-in lane** (`PERFT_DEEP` / `SEARCH_DEEP` / `ENGINE_DEEP` /
  `INPUT_DEEP`). **Available, and the only lever an agent can pull.** Sizing, which is the useful
  part: **~70% of this lane's CPU is the per-file floor, not test execution** — per-file in-worker
  time sums to roughly **4.2 s** of a **14.5 s** total. **Trimming assertions inside files therefore
  aims at the smaller 30% and cannot close 1.480 s; only moving a WHOLE file removes its floor.** At
  371 ms all-in per average file that is **~4 average files**, or fewer heavy ones. **`UNKNOWN -
  verify`: the all-in saving of moving any specific file was not measured and must not be inferred
  from per-file in-worker times.** **Its price is named: it removes default-lane coverage, against
  this project's standing convention that every acceptance criterion is answered in the default
  lane.**
- **Re-derive `N8-LANE`'s 5% against today's plan** — `NFR-008`'s own standing invitation, still
  unexercised. **It creates no headroom and must not be mistaken for a remedy:** it changes what a
  *ticket* may spend, not what the *lane* already costs. Worth doing on its own merits.
- **Move the 13 s level — the OWNER'S ALONE, and this ADR stops at naming it.** Not recommended, not
  argued obsolete, not moved.

**Rejected here, explicitly: consolidating or deleting tests to buy time.** `NFR-008`'s own floor
measurement already ruled that *"the lane is expensive per FILE and nearly free per TEST"*, and QE
has three `ABC-078` criteria whose guards do not detect what they exist to detect — **a follow-up
that makes those guards real will COST lane time, not save it.** Buying 1.480 s by thinning
already-thin guards optimises the wrong quantity.

## Consequences

- **Every cut and every gate from 2026-08-19 inherits an answer instead of an open question.** The
  sentence to write is decision 4's, and it is one sentence rather than a re-derivation.
- **`AR-N8LANE-078` is discharged as an accounting question.** `ABC-078` did not cause this: the
  arithmetic restatement was over the clause at **13.30 s** on 2026-08-13's own published per-file
  figure, before that ticket existed. Its 190 ms is **13% of the deficit** and removing it entirely
  would not clear the clause. **No new risk is opened against it.**
- **A `P0` remedy ticket is owed and the board does not yet contain it.** Until it is cut and
  delivered, the lane runs over its CPU clause on every gate. **Nothing is operationally broken —
  the lane runs, the gate runs, tickets merge — what is broken is a budget, and it stays broken
  visibly rather than quietly.**
- **This is an ESCALATION to the owner, not a decision routed around him.** `NFR-008` is a merged,
  ratified contract and it is breached. **Both remedies that actually close the gap change something
  he ruled**: the opt-in option changes what the default lane guarantees, and the level option is his
  outright.
- **`ABC-108`'s `A1` is unsatisfiable as written** for a self-parallel lane on a shared machine, and
  the criterion shape that DID work — a measured **load sensitivity** rather than an asserted quiet —
  is the one to reuse the next time this lane is measured. **`A5` is also partially unmet: the
  follow-up ticket id could not be supplied, and that is stated rather than filled with an invented
  id.**
- **The forecast-that-nobody-read is the process failure worth carrying forward.** `NFR-008` item 6
  wrote the restatement rule; eleven files landed; nobody ran the one line of arithmetic. **The
  measurement here confirmed a published forecast rather than discovering anything.**

## Rollback

**This ADR records a measurement and a reading rule; rolling it back means showing the measurement
wrong, not deleting the file.**

- **To overturn decision 1**, produce a reading of the default lane under `NFR-008`'s own protocol —
  CPU (user + sys), one fresh process per run, order rotated, 9 rounds with round 0 discarded,
  **n = 8**, every run asserting its own file and test counts, **identity null control ≤ 1.5% with
  its sign at chance** — whose **median is ≤ 13 s CPU** at a named commit with that commit's file and
  test counts. **A single green run is not that, and neither is a mean, and neither is one sample of
  six.** Append it to `plans/nfr-catalog.md` and set this ADR `superseded by`.
- **Decision 4 lapses automatically** the moment a conforming reading puts the lane back under the
  clause: `N8-LANE` is a grant again with no edit to this file needed, because it was never anything
  but 5% of the clause. **It does NOT lapse because the level moved, unless the owner moved it.**
- **If the owner moves the 13 s level**, this ADR is `superseded by` the ADR that records his
  decision. **It is not amended by an agent to match a new level.**
- **Nothing to revert in code or config.** No production file, no dependency, no `vitest.config.ts`
  key and no test was touched by the hop that wrote this. The measurement harness ran outside the
  repository and was never committed.
