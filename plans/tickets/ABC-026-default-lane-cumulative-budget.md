---
id: ABC-026
title: The default test lane has no cumulative budget — only per-ticket ratios, and two EMPTY test files cost 5.4–6.1% of it
status: backlog
column: Backlog
size: UNKNOWN - verify
priority: P2
epic: —
feature: —
---

# ABC-026 — the default lane has no cumulative budget, only per-ticket ratios, and the per-ticket ratio cannot see the total

> **Cut 2026-08-10 by BA/PM** (task `ticket-to-pr-ABC-025`, subtask `ticket-to-pr-ABC-025-bapm2`,
> Workflow 07) from `ABC-025`'s Security/NFR gate risk **#9**, owned by BA/PM with Architect/Design.
>
> **THIS TICKET'S DEFINITION OF READY IS NOT MET AND IT STAYS IN `Backlog`.** What is missing is
> named under `## Why the DoR is NOT met` and it is not paperwork: the central number — what the lane
> is allowed to cost — does not exist yet, and inventing one here would repeat exactly the defect
> that produced this ticket (`ABC-025`'s `N5` was a bar reverse-engineered from an estimate rather
> than derived from a budget). **`ABC-024` is the precedent for a hardening leftover parked in
> `Backlog` with its DoR gap recorded rather than smoothed.**
>
> **This ticket is NOT a defect ticket and it is NOT a proposal to delete tests.** No existing row is
> under suspicion and no coverage is on the table.

## Problem

*User*: every engineer and every role on this board. The default lane is the inner loop — it runs on
every hop of every ticket, several times per hop.

*Pain*: **every bar this board has ever set on lane cost is a per-ticket ratio against the lane as it
stood when that ticket was cut.** A per-ticket ratio cannot see an accumulating total: each ticket is
measured against a baseline the previous ticket already inflated, so every ticket can pass its own
bar while the lane doubles. `ABC-025`'s `N5` is the instance — it was invented to protect the lane
and it does not, and its own gate said so.

*Value*: the lane is at ~1.4 s and still an inner loop. The moment to set a total is while there is
headroom, not after `ABC-024`, `ABC-016`, `ABC-017`, `EPIC-003` and the next hardening ticket have
each spent their own 5% against a moving baseline.

## The measurement that makes this a ticket rather than a worry

Measured 2026-08-10 by BA/PM at `ABC-025`'s ruling hop, Apple M3 / Node v24.12.0 / darwin arm64,
vitest 3.2.7, three interleaved harness runs on out-of-tree copies asserted byte-identical per file,
one fresh OS process per run, `UNKNOWN - verify` on any other hardware:

```
TWO TRIVIAL ONE-ASSERTION TEST FILES — no repository imports, nothing to run —
cost  +5.4% / +6.1%  of the default lane's CPU time, sign positive 8 of 8 both times,
against a null control by identity of +0.1% / +0.0% / -0.1%.
```

**The lane's cost is dominated by per-file worker, transform and collect overhead rather than by test
content.** Two consequences, and the second is the one nobody has acted on:

1. **A per-ticket bar of ≤ 5% stated gross is unmeetable by any ticket that adds two test files** —
   including a ticket that adds two empty ones. `ABC-025`'s `N5` had to be re-derived *net of this
   floor* to be a bar at all.
2. **The board's cheapest available saving is structural and is not owned by anyone.** Every ticket
   that adds a file pays the floor again. The lane has **22 test files** today. No role has ever been
   asked whether that is the right shape, and no per-ticket bar can ask.

Beside it, the distribution that Security/NFR put in front of a human, re-derived independently here
(21.4% against the gate's 20.1%, 2.3x against its 2.1x — agreement within ~10%):

```
src/perft.test.ts                     24 tests   1039 ms   39.5% of suite test time
src/san.qualifier.hardening.test.ts   20 tests    564 ms   21.4%   <- ABC-025, one ticket
src/san.test.ts                       22 tests    269 ms   10.2%
                                      676 tests  2633 ms   total
```

`ABC-025`'s two files are **21.7%** of the suite's test time and cost **2.3x** the 275 tests of the
castling-hardening, en-passant-hardening and gameend files combined.

## Scope (sketch — this is NOT refined and the shape is negotiable)

- **A total budget for the default lane**, stated with the instrument, the statistic and the machine,
  as a row in `plans/nfr-catalog.md` — which is **Architect/Design's to seed** and Security/NFR's to
  check against, per that file's own ownership line. That is why this ticket is not BA/PM's alone.
- **A standing per-ticket bar shape** that ticket authors inherit instead of re-inventing one per
  ticket. `ABC-025`'s re-derived `N5` is the current best candidate wording and is not assumed
  correct — it is one ticket's bar that survived four gates and one ruling.
- **A reading on the per-file floor**: whether 22 test files is the shape this lane should have, and
  what the fixed cost per file actually is across a range of file counts (this hop measured it at one
  point only, n = 2 conditions).

## Out of scope

- **Deleting or narrowing any existing test.** No row is under suspicion. A cumulative budget is a
  bar on what comes next, not a licence to cut what exists; if it ever is, that is a human's call.
- **`ABC-025`'s `A1`–`A6`, its corpus, and its delivered files.** Ruled on and closed at its ruling
  hop; a narrowed-corpus variant was built, priced and **refused** there with reasons.
- **Choosing the runner configuration.** Naming a pool strategy, a thread count or a file layout is a
  design decision and belongs to Architect/Design with a measurement, not to this ticket's author.
- **The `PERFT_DEEP=1` lane.** `ABC-024` considered and rejected promoting it into the gate; not
  re-opened.
- **Any change under `src/`.** The expected production diff of this ticket is zero lines.

## Why the DoR is NOT met — named, not smoothed

- **acceptance criteria clear, testable and measurable** ❌ — the central number does not exist. What
  may the lane cost in total? Nothing on this board answers that. `ABC-024` recorded that a 36–40 s
  lane is not acceptable in front of a guard and the lane is 1.4 s today; between those two numbers
  there is no line, and **inventing one at a cutting hop is precisely the defect that produced this
  ticket.** It needs a measurement pass and a decision, not a sentence.
- **dependencies known** ⚠️ — `plans/nfr-catalog.md` is Architect/Design's to seed. This ticket
  cannot be taken to `Ready` by BA/PM alone; it needs an Architect/Design hop first.
- **size assigned** ❌ — `UNKNOWN - verify`. It is somewhere between one catalog row and a lane
  restructuring, and which one depends on the measurement that has not been done.
- **problem clear / scope / value / out-of-scope / test notes** ✅ — above, with the numbers measured
  rather than asserted.

## Priority `P2`, and the trigger that would move it

`P2`: nothing is broken, no user is affected, and the lane is still fast. **Promote to `P1` when the
default lane passes 3 s**, or when any two further tickets each add a test file under `src/` —
whichever comes first — because after that the headroom argument for taking the measurement calmly
stops being true. Checked at this cut: the lane is **~1.4 s**, and `ABC-024`, `ABC-016` and `ABC-017`
all sit in `Backlog` with satisfied dependencies, so the second half of that trigger is reachable at
the next refinement pass.

## Source

`ABC-025` Security/NFR gate risk **#9** (`.grugops/context/ticket-to-pr-ABC-025/notes/`,
`20260810T165506Z-security-nfr-decision-b5f7d20a`), confirmed and extended with the per-file floor
measurement at `ABC-025`'s BA/PM ruling hop. `ABC-025` itself is **not** re-opened by this ticket and
nothing here changes its verdicts.
