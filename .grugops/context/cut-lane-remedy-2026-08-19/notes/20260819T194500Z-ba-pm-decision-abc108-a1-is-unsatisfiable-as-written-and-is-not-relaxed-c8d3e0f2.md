---
id: 20260819T194500Z-ba-pm-decision-abc108-a1-is-unsatisfiable-as-written-and-is-not-relaxed-c8d3e0f2
kind: decision
by: ba-pm
at: 2026-08-19T19:45:00Z
verified_by:
confidence: high
refs:
  - ABC-108
  - ABC-110
  - ADR-0014
  - NFR-008
  - OQ-1
supersedes:
---

# `ABC-108` `A1` is RE-SCORED **FAILED and UNSATISFIABLE AS WRITTEN**. It is **not** quietly relaxed to something that would have passed. The criterion shape that DID work is recorded as the one to reuse

**This is not a stamp.** Hand-authored `decision`; no `finding` is admissible on this install.
Written to `plans/tickets/ABC-108-the-default-test-lanes-own-budget-is-spent.md` as a dated
`## Criterion re-score` section plus a dated DoR re-score block. **No criterion was rewritten and
none was deleted** — the precedent is `ABC-033` `A4`, whose falsified criterion was neither marked
met nor removed.

## `A1` FAILED — measured, not argued

`A1` required a **maximum recorded 1-min load average ≤ 1.0 on 8 logical cores**.

```
sample 1, recorded at every round boundary       min 1.72   median 7.19   MAX 10.24
sample 2, recorded immediately before each run   min 1.44   median 2.17   max 2.77
LOWEST 1-min load observed ANYWHERE in the hop   1.44
```

**The threshold was never reached, and the reading was published anyway — correctly, on a bound.**

## And it is impossible IN PRINCIPLE, which is the finding worth keeping

The default lane runs `pool: "threads"` at `availableParallelism() − 1` = **7 workers**, consuming
~14.6 s of CPU in ~2.9 s of wall — **~5x parallelism**. A back-to-back interleaved harness therefore
drives the 1-min load average above 1.0 **by itself, inside a single round**, whatever else is
running on the machine.

> **A load threshold sampled during a self-parallel harness measures the harness.**

**No amount of quieting the machine from inside it can satisfy `A1`**, and independently of that the
machine's own floor was **1.44** with ~20 agent worktrees live. **Two separate reasons, and either
one alone is fatal to the criterion.**

## What `A1` GOT RIGHT, and why it is not deleted

`A1` existed to prevent exactly one outcome, in its own words: *"reporting a number taken at load 2.9
as quiet"*. **That outcome did not happen.** `A1` failing is what forced the honest move — the hop
stopped asserting quiet and started sizing the contamination. **It was a well-intentioned criterion
that turned out impossible, and that is a finding, not an embarrassment to tidy away.**

**The temptation refused, explicitly: relaxing `A1` to "load ≤ 3.0" — or to "record the load" — would
have made it pass retroactively and would have taught nothing.** A criterion re-written to fit the
measurement that failed it is a criterion that can never fail again.

## The criterion SHAPE that worked, and it is the one to reuse

> **Measure the load SENSITIVITY of the instrument and SIZE the contamination, rather than assert
> quiet.**

Three independent estimates bound the whole load effect at **~1.9%** against a **10.2%** breach — a
ratio of **5.4x** — and the single quietest run of the hop (load 1.74) still read **14.15 s, 8.8%
over the clause**. **That bound is what let a `high`-confidence ruling stand on a machine that failed
`A1`, instead of a claim nobody could have made.** It is written into `ABC-110`'s `## Test notes` as
an instruction, not a suggestion: **a quiet machine will not be available and must not be claimed.**

## The consequence carried forward, so it cannot be misread

`ABC-108`'s promotion trigger reads *"over 13 s CPU **on a quiet machine**"*. **The machine was not
quiet. `ABC-110` is `P0` on SUBSTANCE — 1.9% measured contamination against a 10.2% breach — and NOT
because `A1` passed.** That sentence is on `ABC-110`'s page, on its board row and in its trace row.

## `A5`'s stated gap is CLOSED; `A2`/`A3`/`A4`/`A6`/`A7`/`A8` are MET

**`A5`** required the ruling to name the follow-up ticket id. Architect/Design supplied the
requirement, the priority and the owner and **declined to invent an id**, because assigning one is
BA/PM's and an invented id fabricates a board state. **`ABC-110` is the id; `A5` reads met from
2026-08-19.**

**`A2`, `A3`, `A4`, `A6`, `A7`, `A8` — MET** on the ruling hop's own record: protocol at n = 8 with
an identity null control of **+0.10% at sign 5/8 (admissible)**; the restated medians stated against
both clauses at `54cbb23` / 39 files / 1181 tests; per-file all-in at **371–378 ms** beside the
ratified **341 ms** and inherited **383 ms**, with its unattributable residue stated in **both**
directions — including that the ratified 341 ms is itself a loaded figure, so deflating toward it is
backwards; the `N8-LANE` sentence written as *rate limit, not grant*; the eight `NFR-001`–`NFR-008`
rows hashing **`63f66795…ca31`** before and after; and `git diff --name-only … -- src/` **empty**.

## The DoR score does NOT move: 9/10, ⚠️x1, and the reason is replaced rather than discharged

Item 10's ⚠️ was *"the quiet machine may not be reachable; if it is not, the ticket goes to `Blocked`
rather than publishing a loaded number"*. **It was not reachable, the ticket did NOT go to `Blocked`,
and it did NOT publish a loaded number as a quiet one — it sized the contamination and ruled on the
bound. That is a better outcome than either branch the row anticipated.**

**And the ⚠️ is kept anyway.** The ⚠️ names a real defect in this page's OWN criteria — `A1` asked
for something no measurement of a self-parallel lane can deliver — and **discharging it by pointing
at a successful ruling would hide a criteria defect inside a good result.** The ruling stands on a
*replacement* instrument, not on `A1`. **Score unchanged, reason replaced, defect recorded.**

**This is also the `AGENTS.md` process-rule-1 control working in the right direction**: a criteria
gap found and recorded, rather than a score smoothed at the exit.
