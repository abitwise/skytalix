---
id: ABC-026
title: The default test lane has no cumulative budget — only per-ticket ratios, and two EMPTY test files cost 5.4–6.1% of it
status: backlog
column: Backlog
size: S
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
>
> ---
>
> ## ARCHITECT/DESIGN HOP, 2026-08-10 — the central number now exists. **THE DoR GAP IS CLOSED EXCEPT FOR ONE ITEM THAT IS BA/PM's AND ONE THAT IS THE OWNER's. SIZE `S`.**
>
> Task `refinement-ABC-026`, subtask `refinement-ABC-026-design`, Workflow 07. **Zero production
> lines, zero test lines; `src/` byte-identical (37 md5s before and after, `git status --short --
> src/` empty).** Everything below was measured on out-of-tree copies whose repository files were
> `cmp`-verified byte-identical per file. Full numbers in `plans/nfr-catalog.md`'s `NFR-008` section
> and in `.grugops/context/refinement-ABC-026/notes/`; the reasoning is
> `memory-bank/50-decisions/ADR-0008-default-test-lane-budget.md`.
>
> ```
> DELIVERED AT THIS HOP
>   NFR-008        the lane's TOTAL: npm test, PERFT_DEEP unset, <= 3 s WALL and <= 13 s CPU
>                  (medians of >= 7 interleaved runs, Apple M3 / 8 cores / Node v24.12.0 /
>                  vitest 3.2.7, UNKNOWN - verify elsewhere).  Today 1.765 s / 7.640 s = 59% of it.
>                  The 3 s is ADOPTED from THIS TICKET'S OWN promotion trigger, not invented.
>                  LEVEL is PROVISIONAL; SHAPE is not.  Ratifier: Olger Oeselg via the Orchestrator.
>   N8-LANE        the standing per-ticket bar every ticket now inherits: <= 5% of the TOTAL,
>                  NOT of the current lane.  BA/PM's re-derived N5 with ONE clause changed.
>   the floor      CPU = 0.85 s + 159 ms x files, R^2 0.9999 over files = 1..128 (the curve this
>                  ticket asked for; the prior reading was n = 2 conditions at one point).
>   ADR-0008       proposed.
>   NFR-002        both open flags ruled; the row is BYTE-IDENTICAL and no target moved.
> ```
>
> **The three things this ticket's `## Scope` asked for, answered:**
>
> 1. **A total budget as a catalog row — DONE.** `NFR-008`, with instrument, statistic, admissibility
>    control and machine, in that file's convention. **Two clauses (wall AND CPU) because each bounds
>    the other's degenerate optimum — measured: `--no-file-parallelism` cuts CPU 30.1% and multiplies
>    wall by 2.4x.** The level is `PROVISIONAL` pending the owner; that is `NFR-005`'s existing
>    precedent in the same file, not a hedge invented here.
> 2. **A standing per-ticket bar shape — DONE, and `ABC-025`'s `N5` is NOT assumed correct; it is
>    adopted with exactly one clause changed.** *The `5%` was never the defect — the DENOMINATOR
>    was.* A ratio against the current lane compounds: twenty tickets at 5% each multiply the lane by
>    **1.05²⁰ = 2.65x** with every ticket green. Against a fixed total the same 5% is arithmetic and
>    admits exactly twenty. Every other clause of BA/PM's re-derivation (CPU, net of the floor,
>    median of paired per-round deltas, n ≥ 7 interleaved, null control by identity, scope) is
>    adopted **unchanged and with attribution**.
> 3. **A reading on the per-file floor — DONE, and the shape question has a measured answer that
>    contradicts its own premise.** **A TEST FILE COSTS 368–504x A TEST**: 128 trivial assertions in
>    ONE file cost 1.1 s CPU; the same 128 in 128 FILES cost 21.3–23.8 s. **So 22 files is not the
>    problem and file count is not the lever** — the lever is the ~160 ms per-file cost, of which
>    **70–90% is per-file process isolation**. Nothing here proposes deleting, narrowing or merging
>    any test, and this measurement removes the last reason anyone might have wanted to.
>
> **The one thing that turned out to be the real finding, and it was not on this ticket's list.**
> The isolation saving (**−30.7% / −36.5% CPU**) is the largest lever on this lane by a wide margin
> and **it is not available**: `--no-isolate` is green in **4 of 21 observed runs**, and the only
> files that ever fail are `zobrist.nfr.test.ts`, `gameend.nfr.test.ts` and `san.nfr.test.ts` —
> `NFR-005`'s call-count sub-bar, `NFR-001`'s three `gameStatus` bars and `ABC-025`'s five `N1` rows.
> Remove those four files and it is green 6 of 6. **The lane's dominant cost is buying exactly the
> isolation this board's spied guards depend on, and nobody knew the price.** **THE FIRST OBSERVED
> RUN WAS GREEN** — a single-run adoption was available and would have silently disarmed three of
> this catalog's own instruments.
>
> **What is left of this ticket, and it is real work rather than paperwork** — see
> `## What remains after the Architect/Design hop` below.

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

*(Written at the cut, 2026-08-10. **Left standing rather than rewritten**, per this board's
convention; the current status of each line is in the block that follows it.)*

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

### DoR status after the Architect/Design hop, 2026-08-10 — **8 of 10 clean, 2 open, and neither open item is mine**

- **acceptance criteria clear, testable and measurable** ⚠️ → **the BLOCKER is removed and the
  criteria are still unwritten.** *"What may the lane cost in total"* now has an answer — `NFR-008`,
  ≤ 3 s wall and ≤ 13 s CPU with its instrument, statistic and machine — so criteria can now be
  written **against a number instead of a feeling**. **They are not written here: acceptance criteria
  are BA/PM's, and an architect writing the criteria his own catalog row will be judged by is the
  same conflict Security/NFR refused at `ABC-025`'s gate.** What they have to cover is in
  `## What remains` below.
- **dependencies known** ✅ → **CLOSED. This hop is the Architect/Design hop the line asked for.**
  `plans/nfr-catalog.md` is seeded, `ADR-0008` is written, and **no further Architect/Design hop is
  needed before `Ready`.**
- **size assigned** ✅ → **`S` (2).** See `## Size` below.
- **problem clear / scope / value / out-of-scope / test notes** ✅ — unchanged, and the scope sketch
  the cut called *"negotiable"* has been settled rather than re-opened.
- **NEW, and it is the one gap no role on this board can close** ⚠️ — **`NFR-008`'s LEVEL is
  `PROVISIONAL` and its ratifier is Olger Oeselg via the Orchestrator.** The *shape* is measured and
  is not provisional. What is unratified is what a 3 s wait is worth to the humans who wait for it,
  and **there is no instrument on this board that measures that.** The 3 s is adopted from this
  ticket's own promotion trigger, so it is the board's own agreed figure rather than an invention —
  but *agreed by two roles* is not *ratified by the owner*, and this ticket should not claim it is.

## What remains after the Architect/Design hop

**Three items. None is a catalog row and none is a measurement that has not been taken.**

1. **BA/PM writes the acceptance criteria** and takes the ticket `Backlog → Ready`. They have to
   cover, at minimum: (a) `NFR-008` is the row of record and `N8-LANE` is inherited by name rather
   than re-derived per ticket — **including by `EPIC-003`'s `parseSan` ticket, whose `Backlog` row
   currently instructs it to inherit `ABC-025`'s re-derived `N5`; that instruction now resolves to
   `N8-LANE`, same clauses, corrected denominator**; (b) the `pool: "threads"` candidate is either
   adopted or refused **with its measurement**, not on preference; (c) the four `*.nfr.test.ts`
   guards' isolation dependence is recorded where the next engineer will read it, since the cheapest
   thing a future engineer can do is turn isolation off and watch 676/676 go green once.
2. **The owner ratifies or moves `NFR-008`'s level.** One sentence. The row is written so a level
   change touches two numbers and nothing else.
3. **A development hop, if the board wants the available saving.** `pool: "threads"` is a two-line
   `vitest.config.ts` measured at **−13.97% wall / −10.78% CPU, sign 0/8 on both samples, 676/676
   green in 24 of 24 runs** — with a **required screen of ≥ 20 consecutive green runs including all
   four `*.nfr.test.ts` files**, because *"green 24 times"* is exactly what `--no-isolate` produced
   before it was caught. **This is the only part of this ticket that writes a file the runner reads,
   and it is still not a change under `src/`; the expected production diff remains ZERO lines.**

**What is explicitly NOT left to do:** no measurement pass (taken — 10 suites, 636 recorded runs,
0 harness errors, two independent samples of every load-bearing figure), no catalog row (written),
no per-ticket bar derivation (written), no decision on file count (measured: file count is not the
lever), and **no test deletion, narrowing or merging — that was out of scope at the cut and the
measurement has removed the last reason anyone might have wanted it.**

## Size

**`S` (2), assigned 2026-08-10 by Architect/Design; BA/PM owns the `Backlog → Ready` promotion and
may revise it.** The cut said the size *"is somewhere between one catalog row and a lane
restructuring, and which one depends on the measurement that has not been done."* **The measurement
has been done and the answer is the near end.** The lane restructuring is not on the table: the two
levers are a two-line config file and a change to four test files' spy strategy, and neither is this
ticket's to take today. What is left is acceptance criteria, one owner ratification and one optional
config change with a determinism screen. Calibrated against `ABC-011` (`S`) and `ABC-024` (`S`).
**It would have been `M` or worse if the measurement had found that file count were the lever**, which
is precisely the uncertainty the cut recorded and this hop resolved.

## Priority `P2`, and the trigger that would move it

`P2`: nothing is broken, no user is affected, and the lane is still fast. **Promote to `P1` when the
default lane passes 3 s**, or when any two further tickets each add a test file under `src/` —
whichever comes first — because after that the headroom argument for taking the measurement calmly
stops being true. Checked at this cut: the lane is **~1.4 s**, and `ABC-024`, `ABC-016` and `ABC-017`
all sit in `Backlog` with satisfied dependencies, so the second half of that trigger is reachable at
the next refinement pass.

**Two things about this trigger, recorded 2026-08-10 by Architect/Design and both left for BA/PM.**

- **The trigger's own 3 s is now `NFR-008`'s bar** — adopted from here rather than invented, because
  it is the only figure for this quantity the board had already agreed to. **That makes the trigger
  and the bar fire at the same instant, and a `P2 → P1` escalation that fires at the breach arrives
  too late to prevent it.** The trigger needs a level *below* the bar, or the bar needs a WARN level
  — **and neither is invented here, because `N8-LANE` already does that job**: every ticket is
  checked against its 5% share at its own gate, so the breach is visible ticket by ticket long
  before the total is reached. Recorded so a reader does not mistake the coincidence for design.
  Owner **BA/PM** at the promotion hop.
- **Half the trigger fired the day it was written.** `ABC-016` was promoted to `Ready` on 2026-08-10
  and adds a test file under `src/`; `ABC-017` is held expressly so the second half does not fire
  before this ticket lands. **That hold is discharged by this hop** — the total exists, so `ABC-017`
  may proceed. Priority stays **`P2`**: the lane is at 59% of the wall clause with the budget
  measured, and nothing is broken. It is now a `P2` with a number behind it rather than a feeling.

## Source

`ABC-025` Security/NFR gate risk **#9** (`.grugops/context/ticket-to-pr-ABC-025/notes/`,
`20260810T165506Z-security-nfr-decision-b5f7d20a`), confirmed and extended with the per-file floor
measurement at `ABC-025`'s BA/PM ruling hop. `ABC-025` itself is **not** re-opened by this ticket and
nothing here changes its verdicts.
