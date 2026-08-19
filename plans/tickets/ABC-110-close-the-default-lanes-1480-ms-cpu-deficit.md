---
id: ABC-110
title: Close the default lane's 1.480 s CPU deficit — `NFR-008` is BREACHED, and both levers that can close it change something the owner ruled
status: backlog
column: Backlog
size: L
priority: P0
epic: —
feature: —
---

# ABC-110 — `NFR-008`'s CPU clause is breached by 1.480 s; measure what moving whole files actually saves, put the sized options to the owner, and close it on his word

> **Cut 2026-08-19 by BA/PM** (task `cut-lane-remedy-2026-08-19`, Workflow 07) against **`ADR-0014`**
> and Architect/Design's `OQ-1` ruling.
> **Every measurement on this page is Architect/Design's, copied and not re-derived** —
> `.grugops/context/design-oq1-lane-budget-2026-08-19/notes/` (including the raw per-run TSVs) and
> `plans/nfr-catalog.md` § *"`OQ-1` IS RULED"*.
> **This is the `P0` remedy ticket `ABC-108` promised in advance and `ADR-0014` § Decision 7 records
> as OWED.** Architect/Design deliberately did not assign it an id — cutting a ticket and assigning
> an id are BA/PM's, and inventing one at the ruling would have fabricated a board state.
> **`ADR-0014` `A5`'s stated gap is closed by this page's existence: the id is `ABC-110`.**

## Problem

*User*: every role that runs the default lane — the Software Engineer at a gate, QE at a validation
hop, Security/NFR measuring an `N8-LANE` charge, Architect/Design as `NFR-008`'s owner — and behind
them the owner, whose `≤ 3 s wall / ≤ 13 s CPU` level this is, ratified in person 2026-08-11.

*Pain*: **`NFR-008`'s CPU clause is BREACHED. 14.480 s against 13 s — 111.4%, over by 1.480 s**, at
`main` @ `54cbb23`, **39 test files / 1181 tests**. Ruled 2026-08-19 by Architect/Design on the
**lower** of two samples deliberately; the protocol-conformant sample (n = 8, identity null control
**+0.10% at sign 5/8 — admissible**) reads **14.760 s = 113.5%**. **Not one of the fifteen lane runs
taken in that hop, at any load, came in under 13 s.** Machine: Apple M3 (Mac15,13) / 8 logical cores
/ Darwin 25.5.0 arm64 / Node v24.12.0 / vitest 3.2.7 — **`UNKNOWN - verify` on any other hardware.**

*Value*: **nothing is operationally broken — the lane runs, the gate runs, tickets merge. What is
broken is a budget, and every gate from here runs over a ratified contract.** `N8-LANE`'s 650 ms is
now a **rate limit and not a grant** (`ADR-0014` decision 4): it still binds, but every charge —
**including a fully compliant one** — adds to an overdraft. This ticket is the only thing that ends
that state without the owner moving his own level.

## Why this is `P0`, and the honesty it rests on

**`ABC-108` named this promotion trigger in advance, in its own words:** *"if a restated reading is
taken and comes back over 13 s CPU on a quiet machine, the follow-up remedy ticket is `P0` and this
page says so in advance."* **A reading came back at 14.480 s. The trigger fired.**

**And the machine was NOT quiet, so the trigger is met on SUBSTANCE rather than because `A1`
passed.** `ABC-108` `A1` required a 1-min load average ≤ 1.0; **the lowest load observed anywhere in
the ruling hop was 1.44** and `A1` **FAILED** (see `## Dependencies` and `ABC-108`'s own re-score).
What replaces it is a **measured bound on the contamination, not a claim of its absence**:

```
load sensitivity of the instrument, measured three independent ways
  within one sample, across a 3.2x load rise                        +1.63% CPU
  across the two samples, across a ~3x load fall                    -1.90% CPU
  the single QUIETEST run of the hop, at load 1.74      14.15 s  =  8.8% OVER the clause

deflation required to reach 13 s from the ruled figure               10.2%
largest load effect measurable over a 6x load swing                   1.9%
                                                       RATIO         5.4x
```

**The breach is five to six times larger than the entire measured load sensitivity of the
instrument.** That is why the trigger is honoured. **Anyone re-reading this page must not convert
that into "the machine was quiet".** It was not, and `P0` does not depend on it having been.

## The sizing that kills the obvious remedy — read this before proposing anything

**~70% of this lane's CPU is the PER-FILE FLOOR, not test execution.** Per-file in-worker time over
the whole default lane sums to roughly **4.2 s** against a **14.5 s** CPU total. The remaining ~10 s
is transform, collect, prepare, and the per-file module-registry isolation `ADR-0008` deliberately
bought.

**Therefore: trimming assertions inside files aims at the smaller 30% and cannot close 1.480 s.**
Only moving a **whole file** removes its floor. At **371 ms all-in per average file** the deficit is
**~4 average files**, or fewer heavy ones.

**`UNKNOWN - verify`, and it is `A1` of this ticket: the all-in CPU saving of moving any SPECIFIC
file was never measured. It must be measured, not inferred from per-file in-worker times.** The
in-worker table in Architect/Design's `observation` note is a single run, is not CPU, and is not a
median; it names candidates and prices none of them.

## Two levers are NOT this ticket's, and they are named so nobody rediscovers them

1. **`isolate: false` — UNAVAILABLE, and this is the FOURTH time it has had to be written down.**
   `ADR-0008` decision 7: saves **30–36%** — it would close this gap twice over — and it is still
   forbidden, because it is **green in only 4 of 21 observed runs** and **disarms
   `zobrist.nfr.test.ts`, `gameend.nfr.test.ts` and `san.nfr.test.ts`** (`NFR-005`'s call-count
   sub-bar, `NFR-001`'s three `gameStatus` bars and `ABC-025`'s five `N1` rows). **Do not spend a hop
   rediscovering it and do not propose it as new.**
2. **Moving the 13 s level — the OWNER'S ALONE.** It is `ABC-108`'s `## Out of scope`, it is
   `NFR-008`'s own wording, and it is Olger Oeselg's. **This page does not recommend it, does not
   argue it obsolete, and does not move it.**

## The third thing, and it is why this escalates rather than executes

**The only lever an agent can pull — moving whole files behind an opt-in lane — CHANGES WHAT THE
DEFAULT LANE GUARANTEES.** This project's standing convention is that **every acceptance criterion
is answered in the default lane** (that sentence is written into `PERFT_DEEP`, `SEARCH_DEEP`,
`ENGINE_DEEP` and `INPUT_DEEP`'s own `AGENTS.md` entries). Moving ~4 files' worth of content out
either breaks that convention or forces the criteria they answer to be re-homed.

**So both remedies that actually close the gap change something the owner ruled**, and **this ticket
CUTS THE PROBLEM AND THE OPTIONS WITH THEIR SIZING AND DOES NOT CHOOSE.** `A5` fences execution
behind his word.

## Scope

- **Measure**, under `NFR-008`'s own protocol and out of tree, **the all-in CPU saving of removing
  each candidate file** from the default lane — the quantity `ADR-0014` marked `UNKNOWN - verify`.
- **Assemble a candidate set whose MEASURED savings sum to ≥ 1.480 s**, with the residual stated.
- **Price the coverage each candidate takes with it** — by criterion id, not by adjective.
- **Put the sized set to the owner**, alongside the two levers that are not an agent's, and **stop**.
- **Execute the option he names**, then **re-measure under the row's protocol and rule the clause**.
- Record the result where `ADR-0014` says: `plans/nfr-catalog.md`, and a superseding ADR if the level
  moves.

## Out of scope

- **`isolate: false`.** Unavailable; see above.
- **Moving `NFR-008`'s `3 s` / `13 s` level.** The owner's outright. If he moves it, that is HIS ADR
  superseding `ADR-0014`, written on his quoted words — never an agent re-baselining a level.
- **Re-deriving `N8-LANE`'s 5%.** Worth doing on its own merits and **it creates no headroom
  whatsoever** — it changes what a *ticket* may spend, not what the *lane* already costs. It is not a
  remedy for this breach and must not be booked as one.
- **`NFR-008`'s WALL clause.** Unruled, one sample over, and **routed to its own ticket** — see
  `## Dependencies`. This ticket consumes that ticket's protocol answer; it does not rule wall.
- **Deleting, thinning or consolidating any test.** `NFR-008`'s own floor measurement already ruled
  the lane *"expensive per FILE and nearly free per TEST"*; buying 1.480 s out of already-thin guards
  optimises the wrong quantity, and QE has three `ABC-078` criteria whose guards do not yet detect
  what they exist to detect.
- **Re-cutting any ticket's `N8-LANE ≤ 650 ms` line.** `ADR-0014` decision 4 deliberately left them
  standing: 650 ms still binds and still means 5% of the **clause**. **No page needs re-cutting.**
- **`AR-N8LANE-078`.** DISCHARGED, not charged — see `## Dependencies`. Not re-opened here.

## Acceptance (Given/When/Then)

- **`A1` (the per-file saving is MEASURED, and an inferred one is inadmissible).** **Given** the lane
  at a named commit, **when** a candidate file is removed in an out-of-tree copy, **then** the record
  carries the **paired median CPU delta at n = 8** under `NFR-008`'s protocol — CPU (user + sys), one
  fresh OS process per run, condition order rotated every round, 9 rounds with round 0 discarded,
  each run asserting its own file and test counts — **with an identity null control ≤ 1.5% whose sign
  is at chance, recorded BEFORE the treatment is looked at.** *(A saving derived from a per-file
  in-worker time is INADMISSIBLE and is reported as such.)*
- **`A2` (the set closes the deficit, or the failure to is the result).** **Then** the record states
  the **sum of measured savings against 1.480 s** and the residual as a number. *(If no admissible
  set closes it, that is recorded and escalated — it is NOT closed by trimming assertions, and
  `A3` says why.)*
- **`A3` (the floor is not fought with assertions).** **Then** **no retained file loses a single
  assertion for budget reasons**, and any proposal that trims inside a retained file is rejected on
  the page with the arithmetic: **the whole per-file in-worker sum is ~4.2 s of a 14.5 s total, so
  the entire 30% is smaller than twice the deficit and only a whole-file move removes a floor.**
- **`A4` (the coverage price is named by criterion id, never by adjective).** **Then** for every file
  proposed for a move, the record lists **each acceptance criterion it answers**, marks each as
  *still answered in the default lane* or *moved behind the flag*, and states the resulting count.
  *("Coverage preserved" is not an answer to this criterion.)*
- **`A5` (nothing moves before the owner speaks — this is the fence).** **Given** that both viable
  options change something he ruled, **then** **no test file changes lane and no level changes**
  until the owner's decision is recorded **verbatim with its date**, and the record names which of
  the sized options he took. *(An agent choosing here is the failure this ticket exists to prevent.)*
- **`A6` (the closing measurement rules the clause, both halves).** **Then** a reading under the same
  protocol at a named commit, with that commit's file and test counts, reports **median CPU and
  median wall at n = 8** stated against **13 s** and **3 s** as numbers, with an admissible null
  control — **and the warm/cold question is settled per `## Dependencies` before that wall figure is
  read as a verdict.** *(A single green run is not this, and neither is a mean.)*
- **`A7` (no bar, floor, level or account moved — verified, not promised).** **Then** the eight table
  rows `NFR-001`–`NFR-008` in `plans/nfr-catalog.md` hash **`sha256 63f66795…ca31`**, byte-identical
  across this ticket's whole diff — **unless the owner moved the level under `A5`, in which case his
  words and their date are quoted verbatim and a superseding ADR carries the change.** `N8-LANE`'s
  5%, its CPU instrument, its paired-median statistic, its identity null control and its **160 ms
  per-file floor** are unmoved either way, and **`N8-SPAWN` stays 0 ms**.
- **`A8` (tests are MOVED, never lost).** **Then** the total test count is **1181 before and after
  with skip count 0**, and for every moved file `<FLAG>=1 npx vitest run <path>` runs **the same
  number of tests that file ran in the default lane** — asserted by counting, not by reading. *(The
  established shape: an opt-in lane's extra cases are NOT DEFINED rather than skipped, so the gate's
  skip count stays 0. A moved file must not become a skip.)*
- **`A9` (each new lane is a RUN command with its own count in `AGENTS.md`).** **Then** every opt-in
  lane this ticket creates has an `AGENTS.md` `### Test` entry in the existing
  `PERFT_DEEP`/`SEARCH_DEEP`/`ENGINE_DEEP`/`INPUT_DEEP` shape, **with a dated RUN comment carrying
  exit code, test count and elapsed time** — and the byte cost is measured against `ABC-109`'s cap
  (see `## Dependencies`).

## Dependencies

- **THE OWNER'S DECISION IS A HARD BLOCKER on everything after `A4`, and it is not an agent's to
  supply.** `A1`–`A4` are pullable today and produce exactly what he needs to decide. **`A5`–`A9`
  are not pullable until he speaks.** This is the same species of blocker as `ABC-100` — blocked on
  a human, not on an agent — and it is stated rather than smoothed.
- **The WALL clause wants its own ticket and this one consumes its answer.** `NFR-008`'s wall clause
  is **UNRULED**: 2.805 s warm-interleaved and **3.120 s cooled** straddle 3 s, and **that 3.120 s is
  the first sample of this lane ever to exceed the wall clause.** The warm/cold question — a verdict
  that flips with the filesystem cache — must be settled **before `A6`'s wall figure can be read as a
  verdict at all**, which makes it an **input to this ticket rather than a part of it**. **BA/PM
  recommends it be cut separately and routed FIRST or in parallel; it is deliberately NOT cut here
  (one ticket was authorised, and this is the one `ADR-0014` says is owed).**
  **CUT 2026-08-20 AT TASK `cut-nfr008-wall-2026-08-20`: THE ID IS `ABC-111`** (`M`, `P1`, DoR 9/10,
  pullable today) — this bullet's stated gap is closed the way `ABC-108` `A5`'s was closed by this
  page's existence. **`A6` consumes `ABC-111` `A4`/`A7`; the dependency is one-way.**
  **AND IT REACHES FURTHER THAN `A6`, which was not previously written down: `ABC-111` also moves the
  NUMBER `A2` sums against.** The CPU clause was ruled on **14.480 s — the COOLED sample** — while the
  **protocol-conformant** sample reads **14.760 s**, so **if `ABC-111` settles on the warm state this
  ticket's deficit is 1.760 s, not 1.480 s (+280 ms, 19% larger)**. **The CPU ruling STANDS EITHER WAY
  and is NOT re-opened by either ticket** — both figures are over 13 s, and Architect/Design ruled on
  the lower on purpose so the ruling would not depend on sample choice. **`A2` is NOT re-cut and this
  page is NOT re-scored: it stays DoR 8/10 ⚠️x2.** Whoever executes `A2` states which figure the
  settled protocol implies and sums against that one.
- **`ABC-109` and this ticket collide in `AGENTS.md`, and both directions are real.** `AGENTS.md` is
  **29,749 bytes against an inherited 32,768-byte cap that truncates SILENTLY from the tail** —
  3,019 bytes of headroom, ~2.6 edits at the measured mean of +1,159. **`A9` adds lane entries to the
  very file `ABC-109` is trying to get under budget**, and the four existing `*_DEEP` entries are
  among the largest blocks in `### Test`. **Neither ticket blocks the other; whichever runs second
  re-measures.** Flagged so it is not discovered at a gate.
- **`AR-N8LANE-078` is DISCHARGED, not charged, and this ticket does not re-open it.** `ABC-078` did
  not cause this: **`NFR-008`'s own restatement arithmetic — `9.545 + 11 × 0.341 = 13.30 s` — was
  already over the clause on 2026-08-13's published numbers, before `ABC-078` existed.** Its 190 ms
  overspend is **13% of the 1.480 s deficit** and removing it entirely would not clear the clause.
  **No new risk is opened against `ABC-078` and its file is not a privileged candidate.**
- **`ADR-0008` and the ratified 2026-08-13 `NFR-008` reading are the instruments this builds on**,
  and neither is re-opened. **`ADR-0014` is the ruling this ticket serves** and is not amended by it.
- **Cheapest BEFORE `ABC-079`, `ABC-080`, `ABC-081` and `ABC-084` land** — each adds test content to
  the lane being remedied. **Stated as an ordering preference, not a blocker**, exactly as `ABC-108`
  stated it. That ordering has now been ignored once; the lane grew eleven files against a published
  planning number of seven.

## Security / NFR triggers

- **`NFR-008` (`≤ 3 s` wall / `≤ 13 s` CPU, default lane) — this ticket IS the trigger, and it is
  the first ticket whose target is a NEGATIVE delta.** Bar unchanged and not this ticket's to move.
  **Target: measured savings ≥ 1.480 s, closing median CPU ≤ 13 s and median wall ≤ 3 s at n = 8.**
- **`N8-LANE` — written in `ADR-0014` decision 4's form, and it may not be read as a pass.**
  **0 new test files, 0 new tests, 0 new spawns**, so the measured charge is **0 ms against 650 ms**
  — **and the clause state is BREACHED, because it is.** *(Passing 650 ms says nothing about the
  budget. Writing only the percentage would say nothing true.)*
- **`N8-SPAWN` — 0 ms**, unchanged. The measurement harness runs **outside** the repository.
- **Security — no new surface.** No production code, no dependency, no network, no secret, no input.
  **Firing threshold, falsifiable:** any file added under `src/` that is not a lane-flag guard in an
  existing test file, any change to `package.json` or `vitest.config.ts`, or the harness being
  committed into the repository.

## Test notes

1. **The harness is throwaway and lives OUTSIDE the repository** — `git archive` out-of-tree copies
   plus a scratchpad script. Committing it would add lane content to the lane under measurement.
2. **`vitest.config.ts` declares no `exclude`**, so an in-repo agent worktree makes the default lane
   report another branch's tree as its own — measured at 245 files / 6993 tests against a lane
   `NFR-008` sizes for ~1000. **Out-of-tree copies avoid it. Any in-repo figure needs
   `--exclude '**/.claude/**'` and that must be STATED, not hidden.**
3. **Two disclosed deviations are inherited and must be disclosed AGAIN, never silently repeated:**
   `node_modules` symlinked into each out-of-tree copy, and — if `AGENTS.md` is not present in the
   copy — 5 tests in `src/cli.test.ts` fail on `ENOENT`, which is an artifact of copying and not a
   defect. *(`git archive` carries `AGENTS.md` because it is tracked; a copy made another way may
   not.)*
4. **A quiet machine will NOT be available and must not be claimed.** `ABC-108` `A1` is
   **unsatisfiable as written for this lane** — 7 workers at ~5x parallelism drive the 1-min load
   average above 1.0 by themselves. **Reuse the shape that worked: measure the load SENSITIVITY of
   the instrument and size the contamination, rather than assert quiet.**
5. **Record the null control before looking at the treatment.** Admissibility is a precondition, not
   a post-hoc comfort.
6. **The default-lane test count is the tripwire on `A8`.** `1181` is the whole lane at `54cbb23`;
   count every run, and treat a run whose counts differ as a harness error rather than a datum.

## Size and priority rationale

**Size `L`.** Four to eight candidate files each measured at n = 8 under a rotating protocol at
~14.5 s of CPU per run, plus a coverage re-homing table by criterion id, plus an owner escalation,
plus the execution, plus a conforming closing measurement. **Not `M`** — `ABC-108` was `M` for **one**
measurement and its ruling; this is several measurements, a decision it may not take itself, and a
change to what the default lane guarantees. **Not `XL`**: the no-`XL` rule binds tickets, and the
protocol, the instrument and the opt-in lane shape all already exist.

**SPLIT TRIGGER, named rather than left to taste — and deliberately NOT split today, because
splitting now means splitting on an answer nobody has:**
- **If the owner moves the 13 s level (`A5`), this collapses to `XS`** — his ADR superseding
  `ADR-0014`, `A6`'s re-statement, and nothing else. **`A1`–`A4` are still owed first**; he should
  not be asked to move a level without the sized alternative in front of him.
- **If he takes the whole-file move, SPLIT into two `M`s at that moment**: `A1`–`A4` (measure, price
  the coverage, escalate) and `A6`–`A9` (execute, re-home, re-measure, rule).

**Priority `P0`** — **by `ABC-108`'s own named promotion trigger, not by BA/PM's alarm.** That page
argued itself DOWN to `P1` in writing (*"nothing is stopped today… what is damaged is the meaning of
a number"*) and named the one condition that would raise it. **The condition is met: 14.480 s against
13 s.** Two things this `P0` explicitly does NOT claim: it does **not** claim the machine was quiet
(it was not — see `## Why this is P0`), and it does **not** claim anything is operationally broken.
**What is broken is a ratified contract, and it stays broken visibly on every gate until this
closes.**

**Demotion trigger, named:** if the owner rules under `A5` that the lane may run over its clause for
a stated period, this drops to `P2` **on his words and their date**, and `ADR-0014` is superseded by
the ADR that records him — **never by an agent deciding the breach is tolerable.**

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-19**. **Result: 8 of 10, ⚠️x2 — NOT READY TO PULL AS A WHOLE. `A1`–`A4` ARE PULLABLE
TODAY and both ⚠️ are about what comes after them.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** users named; the pain is a ruled 14.480 s against 13 s with an admissible null control and a 5.4x margin over the instrument's measured load sensitivity; the value is stated without overclaiming — a budget is broken, not an operation |
| 2 | scope and out-of-scope clear | **✅** seven fences, including both levers that are not an agent's, the wall clause, the 5% re-derivation (named as **not** a remedy), test deletion, and re-cutting `N8-LANE` lines |
| 3 | INVEST-shaped | **⚠️ ESTIMABLE ONLY CONDITIONALLY, and not smoothed.** `A1`–`A4` are independent, small and fully testable. **`A6`–`A9`'s shape depends on an answer nobody has** — `XS` if the level moves, `M` if files move. Priced at `L` for the larger branch with a named split trigger; splitting today would split on a decision that has not been taken |
| 4 | acceptance testable and measurable | **✅** nine: a paired median at **n = 8** with a **≤ 1.5%** null control, savings summed against **1.480 s**, criteria re-homed **by id**, the owner's words **verbatim and dated**, a closing reading against **13 s** and **3 s**, eight rows hashed **`63f66795…ca31`**, **1181** tests and skip **0** with per-file counts re-asserted behind each flag, and an `AGENTS.md` entry carrying a dated RUN |
| 5 | dependencies known | **✅** all five are named with their direction: the owner (hard, after `A4`), the wall-clause ticket (an **input**, recommended and deliberately not cut here), `ABC-109`'s `AGENTS.md` cap (mutual, neither blocking), `AR-N8LANE-078` (discharged, with the arithmetic), and the `ABC-079`/`080`/`081`/`084` ordering preference |
| 6 | security/NFR triggers with a measurable target | **✅** `NFR-008` is the trigger and the target is a **negative** delta of ≥ 1.480 s; `N8-LANE` written in `ADR-0014` decision 4's form — 0 ms measured **and** the clause state BREACHED, so it cannot be read as a pass; `N8-SPAWN` 0 ms; security firing threshold falsifiable |
| 7 | test notes present | **✅** six, including the `vitest.config.ts` worktree trap, both inherited disclosed deviations, the 1181-count tripwire, and the instruction **not** to claim a quiet machine |
| 8 | size assigned | **✅** `L`, with the not-`M`/not-`XL` arguments and a two-branch split trigger tied to the owner's answer |
| 9 | priority assigned | **✅** `P0` **by `ABC-108`'s own pre-registered trigger**, with what the `P0` does not claim written down, plus a named demotion trigger that only the owner can fire |
| 10 | no major unresolved blocker | **⚠️ ONE, and it is a HUMAN DECISION rather than an environmental input.** Both remedies that close the gap change something the owner ruled — the default lane's guarantee, or his level. **No agent may choose between them** (`A5`). Same species as `ABC-100`. **Not smoothed to ✅**: a page scoring 10/10 here would be promising a fix it is not permitted to pick |

Column moves are the Orchestrator's.
