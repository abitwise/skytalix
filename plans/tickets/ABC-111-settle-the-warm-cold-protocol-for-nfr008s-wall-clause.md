---
id: ABC-111
title: Settle the warm/cold measurement protocol for `NFR-008`'s wall clause — a verdict that flips with the cache is not a verdict
status: dropped
column: Done
size: M
priority: P3
epic: —
feature: —
---

# ABC-111 — `NFR-008`'s wall clause is UNRULED because its two samples straddle 3 s; settle WHICH STATE the lane is measured in, why, and how it is reproduced

> **Cut 2026-08-20 by BA/PM** (task `cut-nfr008-wall-2026-08-20`, Workflow 07) from BA/PM's own
> recommendation at `cut-lane-remedy-2026-08-19`, routed by the Orchestrator.
> **Every absolute measurement on this page is Architect/Design's, copied and not re-derived** —
> `.grugops/context/design-oq1-lane-budget-2026-08-19/notes/` including the raw per-run TSVs.
> **The derived per-run CPU/wall ratios below ARE this hop's arithmetic**, computed from those TSVs
> and shown with their inputs so they can be checked rather than trusted;
> `.grugops/context/cut-nfr008-wall-2026-08-20/notes/` carries the working.
> **THE DELIVERABLE IS THE PROTOCOL QUESTION SETTLED, NOT THE CLAUSE RULED.** Ruling the wall clause
> is Architect/Design's, as `NFR-008`'s owner, and it is `## Out of scope` here.

## Problem

*User*: **Architect/Design**, who owns `NFR-008` and could not rule half of it; **Security/NFR**, who
must check a wall figure at a gate; **`ABC-110`**, whose `A6` closing reading is unreadable until this
is answered; and behind them the owner, whose `≤ 3 s wall` level this is, ratified in person
2026-08-11.

*Pain*: **`NFR-008`'s wall clause is UNRULED, and it is unruled because the answer depends on a
choice nobody has written down.** At `main` @ `54cbb23`, 39 files / 1181 tests, one machine, one
afternoon:

```
warm, interleaved, n = 8, identity null control ADMISSIBLE   2.805 s  =  93.5% of the 3 s clause
cooled, 90 s idle gap before each run, n = 6, NO null control 3.120 s = 104.0% of the 3 s clause
```

**Those are the same lane on the same commit, and they land on opposite sides of the clause.** The
3.120 s is **the first sample this lane has ever produced over the wall clause** — every prior
reading on record is comfortably under (worst median 2.210 s = 73.7%, 2026-08-13). **The samples do
not disagree about the lane; they disagree about the protocol**, and until the protocol is settled no
wall figure this project produces — including `ABC-110` `A6`'s closing one — can be read as pass or
fail.

*Value*: **a protocol outlives the lane it is applied to.** `ABC-110` is about to change the lane; the
warm/cold question will still be open afterwards unless settled separately. **The absolute figure is
the lesser half of this ticket.**

## What is already established, and what the straddle actually is

**Read this before proposing a design; three of the four things here were derived at the cut and are
not in any prior note.**

1. **The effect is on PARALLELISM, not on CPU — and unlike wall, it separates the two states with
   ZERO OVERLAP.** CPU/wall (effective parallelism, 8 logical cores, 7 workers), per run:

   ```
   warm A, rounds 1-8   5.184 5.256 5.268 5.281 5.300 5.322 5.332 5.353   median 5.291
   cooled A, runs 1-6   4.449 4.475 4.618 4.655 4.683 4.830               median 4.637
   warm min 5.184  >  cooled max 4.830        14 runs, 0 overlap, -12.4% median
   ```

   **Wall straddles the clause; the ratio does not straddle anything.** Whatever this is, it costs
   the lane ~0.65x of parallelism and costs it no CPU.
2. **The one genuinely cold run inside the WARM sample carries the cooled signature — and it is
   exactly the run `NFR-008`'s protocol discards.** Round 0 ran `A N P` in that order:

   ```
   round 0  A  wall 2.99  CPU 14.15  ratio 4.732   <- the cold range, and the sample's highest wall
   round 0  N  wall 2.80  CPU 14.58  ratio 5.207   <- already warm, one run later
   round 0  P  wall 2.91  CPU 15.53  ratio 5.337   <- already warm
   ```

   **Only the first run of the whole session is cold; the next run in the same round is not.** The
   row's protocol says *"round 0 discarded as warm-up"*, so **the row already discards the cold state
   by construction** — and the cooled sample is that discarded state, re-created six times.
   *(This is evidence about what the row's text ALREADY DOES. It is not a ruling that warm is right
   — see `## Out of scope`.)*
3. **Load does not explain it.** Inside the cooled sample the 1-min load before each run runs
   1.44–2.77 and the wall runs 3.03–3.26 with **no monotone relation** (load 1.44 → 3.06 s; load 1.68
   → 3.23 s; load 2.77 → 3.17 s). The cooled sample is the *quieter* one and reads the *higher* wall.
4. **The cooled sample is INADMISSIBLE for comparison as it stands, on the row's own terms** — `n = 6`
   against the row's `≥ 7`, and **no identity null control was run in the cooled state at all.** The
   warm sample has one (`N−A` = **+0.10% CPU / −20 ms wall, sign 5/8 — admissible**). **So the
   straddle is currently a conformant sample against a non-conformant one, and that alone is enough
   to owe this ticket.**

## Scope

- **Measure both states in ONE harness, each conformant to `NFR-008`'s protocol, each with its own
  identity null control**, so the warm/cold delta is compared against something rather than asserted.
- **Discriminate among the named rival candidates for the cause** (below), or record that it could
  not be discriminated — which is an admissible result.
- **Write the settled protocol as executable text**: which state the row's wall reading is taken in,
  what `n`, what gap, what warm-up, and what a later measurer does to reproduce it.
- **Demonstrate reproducibility**: run the settled protocol a second time, independently.
- **Propose the `plans/nfr-catalog.md` amendment for `NFR-008`'s owner to apply**, and state in one
  executable sentence what state `ABC-110` `A6`'s closing wall reading is taken in.

## Out of scope

- **Ruling the wall clause.** MET/BREACHED is Architect/Design's as `NFR-008`'s owner, on the settled
  protocol. **This ticket makes the ruling possible; it does not take it.** *(If the settled protocol
  produces a conformant reading anyway, report the number and hand it over — do not write a verdict.)*
- **The 3 s and 13 s levels.** Olger Oeselg's, ratified in person 2026-08-11. Not moved, not argued
  obsolete, not re-derived.
- **Re-ruling the CPU clause.** BREACHED, `ADR-0014`, and this ticket does not re-open it. **It does
  touch which FIGURE the breach is stated at — see `## Dependencies`, and report that; do not re-rule
  it.**
- **The CPU remedy.** `ABC-110`'s, entirely. **No test file changes lane here and no assertion is
  removed.**
- **`N8-LANE`'s 5%, its 650 ms, and the `N8-LANE ≤ 650 ms` line on any ticket.** `ADR-0014` decision 4
  left them standing on purpose. **Not re-derived, not re-cut.**
- **`AR-N8LANE-078`.** Discharged with the arithmetic. Not re-opened.
- **Any other machine.** Apple M3 (Mac15,13) / 8 logical cores / Darwin 25.5.0 arm64 / Node v24.12.0
  / vitest 3.2.7. **`UNKNOWN - verify` anywhere else** — the row already says the wall clause is a
  function of core count.

## The rival candidates — named at the cut so nobody re-derives them, and NONE is established

Architect/Design labelled the filesystem/JIT cache a **candidate, not a cause**, and did not establish
it. **Three others survive the cut, and each predicts the same wall rise with no CPU rise** — which is
why wall alone cannot separate them:

| candidate | what it predicts | how it is separated |
|---|---|---|
| **cold FS page cache / JIT cache** after the idle gap | first-run-only penalty; disappears once the tree is read | prime the cache without running the lane, keep the gap |
| **CPU frequency ramp / core parking** after ~90 s idle | penalty tracks the gap length, not the cache | vary the gap (0 / 15 / 90 s) with the cache held warm |
| **the idle gap itself** (scheduler, thermal, background settle) | penalty tracks the gap and survives both controls above | it is what is left when the two above are excluded |
| **an unmeasured background process** in that one session | does not reproduce | the second independent session (`A5`) |

## Acceptance (Given/When/Then)

- **`A1` (both states measured under the row's protocol, each with its OWN null control).** **Given**
  the lane at a named commit with its file and test counts, **when** the warm and cold states are
  measured in one harness, **then** each state reports **median wall AND median CPU at n ≥ 8**, one
  fresh OS process per run, round 0 handled explicitly per state, **each carrying its own `cmp`- or
  `diff -r`-verified identity null control reading ≤ 1.5% CPU with its sign at chance, recorded
  BEFORE the treatment is looked at.** *(The 2026-08-19 cooled sample is `n = 6` with no null control
  and is inadmissible as a comparator; it is a motivation, not a datum, and the record says so.)*
- **`A2` (the warm/cold delta is shown to exceed the controls, or it is not an effect).** **Then** the
  record states the **paired delta in wall and in CPU/wall ratio with its sign test**, against the
  **spread of the null control in the same state** — and the delta is called real only if it exceeds
  it. *(A difference smaller than the instrument's own null is not an effect and must be reported as
  none.)*
- **`A3` (the cause is discriminated, or the failure to is the result).** **Given** the four
  candidates above, **when** the primed-cache arm (gap kept, tree read first, no lane run) and the
  gap-length arm (0 / 15 / 90 s, cache warm) are run at n ≥ 8, **then** each candidate is marked
  **excluded / consistent / undetermined** with the number that did it. *("Undetermined" for all four
  is an admissible outcome and closes this criterion; "probably the cache" is not.)*
- **`A4` (the settled protocol is EXECUTABLE TEXT, not a preference).** **Then** the record states, in
  a form a later measurer can follow without asking anyone: **the state the row's wall reading is
  taken in, the `n`, the inter-run gap, the warm-up handling, the null control, and the reason —
  argued against `NFR-008`'s own `Applies to` cell** (*"the inner loop every role runs several times
  per hop"*) **and against its own existing round-0 rule.** *(A protocol that names a state without a
  reason is a preference. Cite the row's words.)*
- **`A5` (it reproduces, and that is the whole test of "settled").** **Given** the protocol from `A4`,
  **when** it is run a second time in a separate session ≥ 1 hour later at the same commit, **then**
  the two medians land **on the same side of 3 s**, and their difference is stated as a number.
  *(THE DEFECT THIS TICKET EXISTS TO FIX IS A VERDICT THAT FLIPS. If the two runs land on opposite
  sides, the protocol has NOT settled the question — that is the result, it is recorded as such, and
  it is escalated rather than resolved by choosing a run.)*
- **`A6` (the amendment is drafted for the owner of the row, and nothing is written into the row
  here).** **Then** the record carries the **proposed wording** for `plans/nfr-catalog.md`'s
  `NFR-008` section, as an amendment `NFR-008`'s owner applies. *(This ticket's own diff does not
  write it — see `A8`.)*
- **`A7` (`ABC-110` `A6` gets one executable sentence).** **Then** the record states **what state
  `ABC-110`'s closing wall reading is taken in and at what `n`**, by reference to `A4`, so `A6`'s
  figure is admissible on arrival. **And it states which CPU figure the settled protocol implies —
  14.480 s (cooled) or 14.760 s (warm) — as a number**, because `ABC-110` `A2` sums its savings
  against the deficit that follows from it. *(Report the implication. Do not re-rule the CPU clause:
  it is BREACHED on either figure.)*
- **`A8` (no bar, floor, level or account moved — verified, not promised).** **Then** the eight table
  rows `NFR-001`–`NFR-008` in `plans/nfr-catalog.md` hash **`sha256 63f66795…ca31`**, byte-identical
  across this ticket's whole diff. `N8-LANE`'s 5%, its 650 ms, its CPU instrument, its paired-median
  statistic, its identity null control and its **160 ms per-file floor** are unmoved, **`N8-SPAWN`
  stays 0 ms**, and **`git diff --name-only` under `src/` is empty — 0 test files added, 0 removed,
  0 moved between lanes, 1181 tests before and after with skip count 0.**

## Dependencies

- **`ABC-110` `A6` CONSUMES this ticket's `A4`/`A7`, and this ticket depends on nothing of
  `ABC-110`'s.** The direction is one-way and this is the input. **It is pullable TODAY** — no owner
  decision, no blocked human, no dependency on `ABC-110` `A1`–`A4`. **Route it first or in parallel.**
- **It also touches the NUMBER `ABC-110` `A2` sums against, and that is not obvious.** The CPU clause
  was ruled on **14.480 s — the COOLED sample**, deliberately the lower of the two, while the
  **protocol-conformant** sample reads **14.760 s**. **If the settled protocol is the warm one, the
  stated deficit moves from 1.480 s to 1.760 s — +280 ms, 19% larger.** **The ruling stands either
  way** (both are over 13 s, and Architect/Design ruled on the lower on purpose so it would not depend
  on sample choice), **but `ABC-110`'s target figure has a ±280 ms protocol dependency that nobody had
  written down.** `A7` reports it; **neither ticket re-rules the CPU clause.**
- **`NFR-008` is a merged, ratified contract and its owner is Architect/Design.** The amendment is
  drafted here (`A6`) and applied there. **The 3 s level is the owner's and is not in either scope.**
- **`ADR-0014` is the ruling this serves and is not amended by it.** `ADR-0014` recorded the wall
  clause as NOT RULED and named this work; it does not need superseding for this ticket to run.
- **`ABC-109`'s `AGENTS.md` cap is NOT engaged.** This ticket adds **no** `### Test` entry and no
  opt-in lane — it creates no lane and moves no file. **Stated so the collision `ABC-110` carries is
  not assumed to apply here too.**
- **Cheapest at a commit that is not moving.** `ABC-110` will change the lane and `ABC-079`/`080`/
  `081`/`084` will add to it. **A protocol survives that; an absolute figure does not.** *(Ordering
  preference, not a blocker — and it is why the deliverable is the protocol.)*

## Security / NFR triggers

- **`NFR-008` (`≤ 3 s` wall / `≤ 13 s` CPU, default lane) — this ticket is about the WALL clause's
  MEASUREMENT and the bar is not its to move.** **Target, measurable: two independent runs of the
  settled protocol at `n ≥ 8`, each with an admissible null control, whose medians land on the same
  side of 3 s, with the difference between them stated in milliseconds.** *(The target is
  reproducibility, not a verdict.)*
- **`N8-LANE` — written in `ADR-0014` decision 4's form, and it may not be read as a pass.** **0 new
  test files, 0 new tests, 0 new spawns**, so the measured charge is **0 ms against 650 ms** — **and
  the clause state is BREACHED on CPU, because it is, and UNRULED on wall, which is why this ticket
  exists.** *(Writing only the percentage would say nothing true.)*
- **`N8-SPAWN` — 0 ms**, unchanged. The harness runs **outside** the repository.
- **Security — no new surface.** No production code, no dependency, no network, no secret, no input.
  **Firing threshold, falsifiable:** any file added or changed under `src/`, any change to
  `package.json` or `vitest.config.ts`, or the harness being committed into the repository.

## Test notes

1. **The harness is throwaway and lives OUTSIDE the repository** — `git archive` out-of-tree copies
   plus a scratchpad script. Committing it adds lane content to the lane under measurement.
2. **`vitest.config.ts` declares no `exclude`**, so an in-repo agent worktree makes the default lane
   report another branch's tree as its own (measured once at 245 files / 6993 tests). **Out-of-tree
   copies avoid it; any in-repo figure needs `--exclude '**/.claude/**'` and that must be STATED.**
3. **Two disclosed deviations are inherited and must be disclosed AGAIN, never silently repeated:**
   `node_modules` symlinked into each out-of-tree copy, and — if `AGENTS.md` is missing from a copy —
   5 `src/cli.test.ts` tests fail on `ENOENT`, an artifact of copying and not a defect. *(`git
   archive` carries `AGENTS.md` because it is tracked.)*
4. **A quiet machine will NOT be available and must not be claimed.** `ABC-108` `A1` is unsatisfiable
   as written for this lane — 7 workers at ~5x parallelism drive the 1-min load above 1.0 by
   themselves. **Reuse the shape that worked: size the contamination, do not assert quiet.** *(Load is
   a bigger hazard here than for CPU: the whole straddle is 0.315 s of wall, so one unrecorded load
   excursion can manufacture the effect. Record the 1-min load immediately before EVERY run — the
   cooled sample already did — and report wall against it.)*
5. **This ticket's cost is WALL-CLOCK, not CPU.** The cold arms need an idle gap per run: 90 s × n = 8
   is ~12 min per cold condition before any lane time, and `A1`+`A3`+`A5` need several. **Run it as a
   background harness; do not sit on it.**
6. **Record every null control before looking at the treatment.** Admissibility is a precondition, not
   a post-hoc comfort — and the missing cooled null control is half of why this ticket exists.
7. **Count every run.** The lane at `54cbb23` is **39 files / 1181 tests**; a run whose counts differ
   is a harness error, never a datum. The 2026-08-19 hop recorded 0 harness errors over 27 runs
   this way.
8. **Report wall and CPU separately and never blend them** — the row's standing rule — **and report
   the CPU/wall ratio as a third, derived column.** It is the quantity that separated the two states
   with zero overlap at the cut, and it is the sharpest instrument on this page.

## Size and priority rationale

**Size `M`.** Four to five conditions (warm, warm null, cold, cold null, primed-cache) at `n ≥ 8`,
plus a gap-length arm, plus a second independent session for `A5`, plus a drafted amendment. **Not
`S`** — one measurement and a write-up would be `S`; this is a cause-discrimination design and a
reproduction run, and the reproduction is not optional because it IS the criterion. **Not `L`** —
unlike `ABC-110` there is one instrument, one question, no coverage re-homing, no owner escalation
blocking execution, and nothing under `src/` changes. **`ABC-108` is the right comparator and this is
its shape**: one measurement question, one protocol, one hand-off. **The protocol, the harness shape,
the null control and the out-of-tree method all already exist and are reused, not designed.**

**SPLIT TRIGGER, named:** if `A3`'s discrimination arms turn out to need a machine state this session
cannot produce (no control over CPU frequency governor or page cache from userspace on this host),
**split `A3` out as its own `S` and close this ticket on `A1`+`A2`+`A4`–`A8`** — the protocol can be
settled empirically without the cause being named, and `A4` must then say so explicitly rather than
imply a cause. **Deliberately not split today: the cause, if found, is what makes `A4`'s reason
defensible instead of merely stated.**

**Priority `P1` — and the arguments both ways are on the page.**
**Not `P0`:** the clause is **UNRULED, not BREACHED** — one sample of six, below the row's own `n`,
with no null control, is not a breach; nothing is stopped today; and **`ABC-110` `A1`–`A4` are
pullable without this**, so it blocks no work that is currently pullable.
**Not `P2`:** it gates the admissibility of `ABC-110` `A6`'s closing figure, it is the first time this
lane has ever gone over on wall, and it is **cheap and unblocked today** while `ABC-110` waits on a
human.

**PROMOTION TRIGGER, pre-registered so a later hop does not have to argue it:** **a
protocol-conformant reading at `n ≥ 8` with an admissible null control whose median wall exceeds
3 s makes the wall clause BREACHED — and a second breached clause on the same row is `P0`**, by the
same shape as `ABC-108`'s own trigger.
**DEMOTION TRIGGER:** if the owner moves the 3 s level under `ABC-110` `A5`, this drops to `P2`
pending re-derivation against his new level, **on his words and their date** — never on an agent
deciding the question is moot.

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-20**. **Result: 9 of 10, ⚠️x1 — PULLABLE TODAY. The ⚠️ is item 3 and it is about what `A3`
can be estimated to deliver, not about whether the ticket can start.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** four users named; the pain is two samples of one commit landing on opposite sides of one clause (2.805 s = 93.5% / 3.120 s = 104.0%), with the first over-wall sample this lane has ever produced; the value is stated without overclaiming — **a protocol outlives the lane, and no wall figure is readable until it exists** |
| 2 | scope and out-of-scope clear | **✅** seven fences, including the ruling itself (the row owner's), the 3 s and 13 s levels (the project owner's), the CPU remedy (`ABC-110`'s), `N8-LANE`'s 650 ms lines, `AR-N8LANE-078`, and any other machine |
| 3 | INVEST-shaped | **⚠️ ESTIMABLE WITH ONE NAMED SOFT SPOT, and not smoothed.** `A1`, `A2`, `A4`–`A8` are independent, small, testable and fully priced. **`A3`'s effort depends on how much of the machine state is reachable from userspace on this host — unknown at the cut.** Priced at `M` with a named split trigger that drops `A3` to its own `S`; **"undetermined" is written into `A3` as an admissible outcome so the ticket cannot stall on it** |
| 4 | acceptance testable and measurable | **✅** eight: `n ≥ 8` per state, a **≤ 1.5%** null control **per state** with its sign at chance, a paired delta judged against that null's own spread, four candidates each marked excluded/consistent/undetermined, a protocol written as executable text citing the row's own words, **two independent runs landing on the same side of 3 s with their difference in ms**, the implied CPU figure stated as **14.480 or 14.760**, and eight rows hashed **`63f66795…ca31`** with `src/` empty and 1181 tests / skip 0 |
| 5 | dependencies known | **✅** six, each with its direction: `ABC-110` `A6` (one-way, this is the input), the **±280 ms deficit dependency** on `ABC-110` `A2` (found at this cut, not previously written down), `NFR-008`'s owner (drafts here, applies there), `ADR-0014` (served, not amended), `ABC-109` (explicitly **not** engaged — no lane, no `AGENTS.md` entry), and the ordering preference |
| 6 | security/NFR triggers with a measurable target | **✅** `NFR-008` with a **reproducibility** target rather than a verdict — two runs, same side of 3 s, difference in ms; `N8-LANE` in `ADR-0014` decision 4's form (0 ms measured **and** the clause state, so it cannot be read as a pass); `N8-SPAWN` 0 ms; security firing threshold falsifiable |
| 7 | test notes present | **✅** eight, including the `vitest.config.ts` worktree trap, both inherited disclosed deviations, the instruction not to claim quiet, the **wall-clock cost of the idle gaps** (~12 min per cold condition), the 1181-count tripwire, and the CPU/wall ratio as the third reported column |
| 8 | size assigned | **✅** `M`, with the not-`S`/not-`L` arguments, `ABC-108` named as the comparator, and a split trigger tied to `A3` |
| 9 | priority assigned | **✅** `P1`, with the not-`P0`/not-`P2` arguments on the page, plus a **pre-registered `P0` promotion trigger** (a conformant reading over 3 s) and a demotion trigger only the owner can fire |
| 10 | no major unresolved blocker | **✅** and it is the point of this ticket: **there is no human decision and no environmental precondition here.** `ABC-110` waits on the owner; this does not. **The machine's failure to go quiet is sized rather than blocking** (`A1` reuses the sizing shape, not the quiet threshold) |

Column moves are the Orchestrator's.

## Re-score — 2026-10-10 (BA/PM, subtask `bapm-rescore-backlog-r1-2026-10-10`, wave tip `39d87491`)

**Verdict: DROP — close as SUPERSEDED, once `NFR-008`'s row carries the re-open trigger below.** Until
then it stays in `Backlog` at **`P3`** (frontmatter moved `P1` → `P3` at this hop) so the trigger keeps
a carrier. `column`/`status` are not moved here.

**Why: this page's own DEMOTION TRIGGER fired, on the owner's word.** It reads *"if the owner moves the
3 s level … this drops to `P2` pending re-derivation against his new level, on his words and their
date."* He did: 2026-10-10, *"2. accept"* on `ADR-0035`, mapped by the Orchestrator to **R-1 — wall ≤ 10 s
at load1 ≤ 8** (note `…6a1f3d92`; the mapping is flagged to him, see Owner question). **Re-derived
here against W = 10 s:**

| quantity | value | source |
|---|---|---|
| cooled/warm wall factor | 5.291 ÷ 4.637 = **1.141** | this page, 2026-08-19 ratios (39 files, Node v24.12.0) |
| today's conforming wall | **6.52 s / 7.16 s** | `ADR-0035` § Context (`ABC-084` runs 1 and 3) |
| today, projected cold | **7.44 s / 8.17 s** | × 1.141 — **a projection, not a reading** |
| warm wall at which the protocol choice could flip W | 10 ÷ 1.141 = **8.76 s** | arithmetic |

**The warm/cold choice cannot move a verdict against 10 s today.** Both states land under it with
≥ 1.83 s to spare, even on the projection. `ADR-0035` decision 5 says the same in words. The consumer
this ticket served, `ABC-110` `A6`, is `Done`.

**What survives — one trigger, not a ticket.** *Re-open the warm/cold protocol question when a
conforming warm `npm test` wall median reaches **8.76 s**, or any cooled reading exceeds **10 s**.*
**Carrier: the `NFR-008` row, owner Security/NFR / Architect/Design** — recommended for its next catalog
hop. **Caveat on the factor:** it was measured on v24.12.0 at 39 files; on re-open, re-measure it rather
than reuse it.

**DoR: not re-scored — a dropped ticket is not pulled.**

## Page note — 2026-10-11 (BA/PM, subtask `bapm-batch-2026-10-11`, wave tip `506550f3`)

**Recommendation: FOLD the trigger into `ABC-144`, then DROP this ticket (close as SUPERSEDED).**
`column`/`status` are not moved here; that is the Orchestrator's.

**Re-read against the owner's new goal.** On 2026-10-10 the owner asked for less `npm test` CPU on the
M3 and allowed the 10 s wall to rise "a bit". That is `ABC-144`, `P1`.
- **This page's own finding is about parallelism.** § "What is already established", item 1: the
  warm/cold effect is on CPU/wall, with zero overlap between the states.
- **A worker cap changes parallelism, and it raises the wall toward W.** So `ABC-144` will move the
  lane into the zone where the warm/cold choice can flip a verdict. The 2026-10-10 re-score put that
  zone at a warm median of 8.76 s against 10 s, and today's 6.52 / 7.16 s will rise.
- **The trigger was never carried.** There is no "8.76" in `plans/nfr-catalog.md` at this tip, so
  the 2026-10-10 "drop once `NFR-008` carries it" condition has not been met.

**What `ABC-144` takes (its `A4` and `A5`):**
- both states measured at the new setting, each with its own identity twin;
- both medians under W by at least that state's R;
- the cooled/warm factor **re-measured**, not reused (the caveat above);
- the re-open trigger re-derived as W ÷ factor;
- wording for the `NFR-008` row, written by Security/NFR after the owner's word.

**What is dropped:** `A3`'s cause discrimination (four candidates, primed-cache and gap-length arms)
and `A7` (`ABC-110` is `Done`). No verdict depends on the cause. If `ABC-144` `A4` finds one state
over W, the owner hears it, and cause discrimination can be re-cut then, against a real number.

**Why not keep this ticket open beside `ABC-144`:** both would read the same lane in the same window,
twice. **Why not drop it outright:** the trigger would lose its only carrier just as the wall moves
toward it.

**DoR: not re-scored.** A ticket recommended for drop is not pulled.
