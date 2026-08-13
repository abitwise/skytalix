# ADR-0008: The default test lane has a total budget, and the per-ticket bar is denominated in the budget rather than in the lane

## Status

**accepted** — RATIFIED 2026-08-11 by **Olger Oeselg**, the project owner, DIRECTLY and in
session: *"ratify NFR-008 at 3s wall / 13s CPU"*. Both the *shape* and the *level* (3 s wall /
13 s CPU) now stand; the `PROVISIONAL` marker is discharged and the level is no longer pending.

**How this ratification was made, recorded because the distinction is load-bearing.** The owner
ruled directly on his own words, quoted above. The Orchestrator was the CHANNEL, not the
ratifier — it escalated the level, declined to set it, and stated in the board header that it
would not, on the ground that `ADR-0004`'s Status section records its own by-delegation
ratification as **explicitly not precedent**. **This ADR therefore does NOT rest on a delegation
and does not extend `ADR-0004`'s.** It is a plain human decision, which is the only kind this
level could ever have had: what a 3 s wait is worth to the humans who wait is not measurable by
any role on this board, and no measurement in this file was ever going to supply it.

Written 2026-08-10 as `proposed`, for the reason in Consequences. Authored by Architect/Design at task `refinement-ABC-026`, subtask `refinement-ABC-026-design`,
Workflow 07, from `ABC-025`'s Security/NFR gate risk **#9**.

This ADR is written because the *why* here is not recoverable from the catalog row alone: the row
carries a number, and the thing a future maintainer will need is the argument that a per-ticket ratio
cannot be made to work no matter how carefully it is worded.

## Context

The default lane (`npm test`, `PERFT_DEEP` unset) is this project's inner loop. Every role runs it
several times per hop and it is the `unit` step of `quality.mandatory_gates`.

**Every bar this board has ever set on it is a per-ticket ratio against the lane as it stood when
that ticket was cut.** `ABC-025`'s `N5` (*"≤ 5% of the default lane"*) is the worked example. It was
invented to protect the lane; four instruments and one ruling hop later, its own gate recorded that
it does not, and cut `ABC-026` to say so.

Three separate defects were found in `N5` before this hop, and they were treated as three problems:

1. **It was unmeasurable as written.** Its own comparison procedure, run on a byte-identical tree,
   reported +0.7% to +6.0% for a change that is literally nothing (Security/NFR, `ABC-025`'s gate).
2. **It was unmeetable as written.** Two *empty* test files cost 5.4–6.1% of the lane, so a gross 5%
   bar is tripped by a ticket that adds two files containing nothing (BA/PM, `ABC-025`'s ruling hop).
3. **Its threshold had no derivation.** `5%` was the cutting hop's own prediction plus headroom — a
   bar reverse-engineered from an estimate (BA/PM, same hop).

BA/PM's re-derivation fixed (1) and (2) and explicitly left (3) open: *"whether 5% is the right
fraction is `UNKNOWN - verify` until `ABC-026` sets the total."*

**This ADR's context is a fourth defect that is structural and that no amount of careful wording
fixes: a ratio denominated in the CURRENT lane cannot see a total.** Each ticket is measured against
a baseline the previous ticket already inflated. *n* tickets each passing "≤ 5% of the current lane"
multiply the lane by `1.05ⁿ` — **2.65x at twenty tickets** — with every ticket green and every gate
honest. It is a geometric series. **A per-ticket ratio is not a weak budget; it is not a budget.**

The measurements this decision rests on were taken at this hop and are recorded in full in
`plans/nfr-catalog.md`'s `NFR-008` section. The three that decide the shape:

- **A test file costs 368–504x a test.** 128 trivial assertions in one file cost 1.1 s CPU; the same
  128 spread over 128 files cost 21.3–23.8 s. The floor curve is `CPU = 0.85 s + 159 ms × files`,
  `R² 0.9999` over files = 1…128. **49–58% of today's lane is per-file runner overhead, not test
  content**, by two independent decompositions that agree within 8 points.
- **Adding two test files moves the wall clock by −15 to +3 ms per file** (indistinguishable from
  zero) **while moving CPU by 100–225 ms per file**, and wall grows in a *sawtooth* with a
  ~70–75 ms step at each multiple of the 7 default workers.
- **`--no-file-parallelism` cuts CPU by 30.1% and multiplies wall by 2.4x.**

## Decision

**1. The default lane gets a TOTAL, stated as `NFR-008` in `plans/nfr-catalog.md`, with two clauses
that must both hold: ≤ 3 s wall AND ≤ 13 s CPU (user + sys)**, medians of ≥ 7 interleaved runs on the
named reference machine.

**2. The two clauses are deliberate and each exists to bound the other's degenerate optimum.** A
CPU-only bar is met by serialising the lane, which measurably costs the engineer 2.4x the wait. A
wall-only bar is met by buying cores. Neither alone is a budget on the thing that matters.

**3. The total is on the WALL clock and the per-ticket bar is on CPU, and that is not an
inconsistency — it is the whole design.** A *total* is a ~2x question; the wall clock's ±20% session
drift resolves that easily. A *per-ticket delta* is a 5% question; only CPU resolves it (its identity
null control reads ≤ 1.5% with the sign at chance, while the wall clock cannot see two added files at
all). **The instrument that could not adjudicate `N5` can adjudicate the total, and the instrument
that adjudicates the total cannot adjudicate a ticket. Two bars, two questions two orders of
magnitude apart, two instruments.**

**4. The standing per-ticket bar (`N8-LANE`) is `N5`'s re-derivation with exactly ONE clause changed
— the denominator: ≤ 5% of the TOTAL, not of the current lane.** Every other clause of BA/PM's
re-derivation is adopted unchanged and with attribution: CPU (user + sys), net of the measured
per-file floor, median of paired per-round deltas, n ≥ 7 interleaved rounds, one fresh process per
run, identity null control mandatory, scope = every file the branch adds under `src/`. **The 5% was
never the defect; the denominator was.** With the total fixed, twenty tickets at 5% consume the
budget exactly once — an arithmetic series, bounded by construction, whose ticket capacity is an
explicit number instead of a surprise.

**5. Every ticket inherits `N8-LANE` and may state a tighter bar, never a looser one.** A ticket that
states nothing has stated this one. This ends the practice of re-deriving a lane bar per ticket,
which has now cost two ruling hops.

**6. The budget has two accounts with different owners, and drawing that line is the substance of
this decision.**
- **The CONTENT account** — what a ticket's tests actually execute — is charged per ticket under
  `N8-LANE`. **Owner: BA/PM at each cut; checked by Security/NFR at each gate.**
- **The FLOOR account** — `files × per-file cost`, ~160 ms CPU per file, which no ticket can
  influence and which no per-ticket bar has ever been able to see — is charged to nobody per ticket.
  **Owner: Architect/Design.** `ABC-025`'s gate recorded that the cheapest saving on this lane *"is
  structural and is not owned by anyone"*; this is that ownership.

**7. Per-file process isolation is RETAINED, deliberately, at a measured price**, and the price is
recorded so that nobody rediscovers the lever and takes it: `--no-isolate` saves 30.7–36.5% of lane
CPU and is **green in 4 of 21 observed runs**, failing only ever in `zobrist.nfr.test.ts`,
`gameend.nfr.test.ts` and `san.nfr.test.ts` — `NFR-005`'s call-count sub-bar, `NFR-001`'s three
`gameStatus` bars and `ABC-025`'s five `N1` rows. Removing those four files makes it green 6 of 6.
**The lane's dominant cost buys exactly the module-registry isolation this project's spied
call-count guards depend on.** No guard is under suspicion and no test is proposed for deletion.

**8. `pool: "threads"` (with isolation kept) is a CANDIDATE, not adopted here.** Measured through
`npm test`: **−13.97% wall (−260 ms) / −10.78% CPU (−825 ms), sign 0/8 on both samples, 676/676 green
in 24 of 24 runs.** It is handed to `ABC-026`'s development hop with a required screen of ≥ 20
consecutive green runs including all four `*.nfr.test.ts` files, because *"green 24 times"* is
precisely the evidence `--no-isolate` produced before it was caught.

## Alternatives

**A. Keep the per-ticket ratio and word it better. REJECTED — structurally, not on taste.** The
compounding is a property of the denominator, not of the wording. No statistic, sample size or
instrument makes `1.05ⁿ` bounded. This is the alternative the board has already tried twice.

**B. Set the total in CPU only. REJECTED on a measurement.** `--no-file-parallelism` meets a CPU
budget by 30.1% while making the engineer wait 2.4x longer. A budget whose cheapest satisfaction
harms the thing it protects is worse than none.

**C. Set the total in wall only. REJECTED.** Wall time is a function of core count; the same lane on
one core is already over. The CPU clause is the portable half and the wall clause is the human half.

**D. Set the per-ticket bar on the wall clock (what `N5` originally said). REJECTED as unmeasurable
by construction, which is stronger than "noisy".** Two added files move wall by −15 to +3 ms per
file, and the sawtooth means the *same* file costs 5–20 ms or ~70–75 ms depending only on how many
files already exist — **a wall bar charges two identical tickets different amounts for identical
work.**

**E. Reduce the file count (consolidate test files). REJECTED, and the measurement removes the
motive.** The lane is expensive per FILE and nearly free per TEST, so consolidation trades a real
saving against readability, ownership and blast radius, while reducing the per-file cost costs
nothing in coverage at all. `ABC-026` already forbids deleting or narrowing tests; this ADR records
that even the *milder* version of that idea is the wrong lever.

**F. Turn off per-file isolation and take the 30–36%. REJECTED on evidence** — see Decision 7. Worth
recording that **the first observed `--no-isolate` run was green**: a single-run adoption was
available and would have silently disarmed three of this catalog's own instruments.

**G. Invent a number for the total. REJECTED, and it is the defect that produced `ABC-026`.** The
3 s is **adopted** from `ABC-026`'s own promotion trigger — the one figure for this quantity that the
board had already written down and agreed to — rather than picked at this hop.

**H. Refuse to set a total until a human states one. REJECTED.** That is what the cutting hop
correctly did and what this hop was scheduled to stop doing. The compromise taken instead is
`NFR-005`'s existing precedent in this same file: seed the row, mark the **level** `PROVISIONAL`, and
name the ratifier.

## Consequences

- **The budget binds inside this project's own remaining plan, on day one.** Today's lane is
  1.765 s wall / 7.640 s CPU — 59% of the wall clause. `ABC-025` cost 4.5–8.8% of the budget net of
  the floor, so **the budget admits 11–22 more `ABC-025`-sized tickets and the plan has ~20 left.**
  Tight, not comfortable. A budget that did not bind would not have been worth the hop.
- **Two levers are now priced and owned.** `pool: "threads"` is available at −14% wall for a two-line
  config change; the isolation lever is worth −30% and is blocked by four files whose fix is a
  different spy strategy, not a coverage cut. Neither is spent here.
- **Ticket authors stop inventing lane bars.** They inherit `N8-LANE` and subtract 160 ms CPU per
  file added. `EPIC-003`'s `parseSan` ticket, which the board has already instructed to inherit
  `ABC-025`'s re-derived `N5`, inherits **this** instead — same clauses, corrected denominator.
- **Security/NFR gains a bar it can check without re-specifying anything**, which is what its own
  `ABC-025` ruling asked for.
- **The level is unratified and this is a live gap, not a formality.** No role on this board can
  measure what a 3 s wait is worth to the humans who wait for it. Until Olger Oeselg rules, the
  level is `PROVISIONAL` — exactly as `NFR-005`'s depth 7 has been since 2026-07-30.
- **Every absolute figure is one machine and drifts ~20% with thermal state** — the same tree read
  6.68 s CPU / 1.61 s wall early and 8.14 s / 1.96 s after ~15 min of sustained load. Ratios
  replicate; absolutes do not. `UNKNOWN - verify` on any other hardware, and the wall clause is
  explicitly a function of core count.
- **Zero production lines and zero test lines were written for this decision.** `src/` is
  byte-identical (37 md5s before and after); every measurement was taken on out-of-tree copies whose
  repository files were `cmp`-verified byte-identical per file.

## Rollback

Cheap and complete at every level, and nothing downstream has been built on it yet.

- **The level**: change two numbers in `NFR-008`'s Target cell. The row's shape, instrument,
  statistic, admissibility control and machine survive any level change — that separation is why the
  row is written this way. The ratifier moving the level is the *expected* path, not a rollback.
- **The per-ticket bar**: `N8-LANE` lives in one section of `plans/nfr-catalog.md` and is inherited
  by reference. Reverting it restores `ABC-025`'s re-derived `N5` verbatim, since the only clause
  that differs is the denominator.
- **The whole ADR**: delete `NFR-008`'s row and section. `NFR-001`–`NFR-007` were not touched (all
  nine pre-existing table lines hashed identical before and after), no target moved, no test was
  added, removed or narrowed, and no runner configuration was changed. The board returns to exactly
  the position `ABC-025`'s gate left it in, with the measurements still on record.
- **Decisions 7 and 8 have nothing to roll back** — isolation was retained (the status quo) and
  `pool: "threads"` was not adopted.

## ADDENDUM 2026-08-13 — Decision 8 is DISCHARGED (`pool: "threads"` ADOPTED), and the budget is MEASURED for the first time

Architect/Design, task `abc026-2026-08-13`, subtask `ABC-026-lane-budget`, Workflow 04, at
`main` = `06c5427`. **Nothing above is edited.** The Status stays `accepted`; **the 3 s wall /
13 s CPU level is Olger Oeselg's, ratified in person 2026-08-11, and this hop measures against it
rather than touching it.** Decisions 1–7 stand unchanged and unre-opened. What follows discharges
Decision 8, which this ADR explicitly handed to *"`ABC-026`'s development hop"* with owner
Architect/Design.

### The budget is MET, and `H5` is discharged

**`NFR-008` measured to its own protocol — medians of ≥ 7 interleaved runs, `PERFT_DEEP` unset, one
fresh OS process per run, every run asserting its own file and test counts. 135 runs, 0 harness
errors, 28 test files / 807 tests.** Two independent in-worktree samples plus one out-of-tree
replicate: **wall 1.845 / 1.935 / 2.210 s against ≤ 3 s — MET. CPU 9.975 / 10.315 / 10.390 s against
≤ 13 s — MET.** Full figures, spreads, controls and the disclosed deviations are in
`plans/nfr-catalog.md`'s `NFR-008` section; they are not restated here.

**The Consequences section above says today's lane is "1.765 s wall / 7.640 s CPU — 59% of the wall
clause". That was true of a 22-file lane on 2026-08-10 and it is now stale by six files and one
session.** The lane is at **74% of the wall clause and 80% of the CPU clause**, and **the CPU clause
is the binding one** — measured, and for the reason this ADR already gave in Decision 3: the wall
clock cannot resolve a per-file delta. **The paragraph above is left standing rather than rewritten,
per this board's convention; this is its current status.** The practical consequence is that
*"tight, not comfortable"* is now tighter: **~7 more test files at today's all-in cost, ~16 if every
one were empty**, against `EPIC-003`'s eight tickets implying 7–8 files.

### Decision 8, discharged: `pool: "threads"` is **ADOPTED**

**The required screen is SATISFIED, and it was run against SEVEN files, not four.** Decision 8 says
*"all four `*.nfr.test.ts` files"*; four was the correct census when this ADR was written on
2026-08-10, and `history-pane`, `status-panel` and `turn-loop` landed on 2026-08-11 — the day it was
ratified. The 2026-08-12 architecture audit flagged the drift and did not edit this ADR. **This hop
read the census from disk (seven) and screened against all seven.** Decision 8's sentence is left
standing; **read it as "every `*.nfr.test.ts` file".**

```
screen result   24 CONSECUTIVE green runs, no red at any point
                807/807 tests on 28 files in every run, each run's counts recorded
                all SEVEN *.nfr.test.ts files passed in every one of the 24
saving          -7.32% / -7.70% CPU and -14.09% / -23.08% wall, sign 0/8 on all four,
                paired per-round deltas in the same interleaved harness, two samples
slope           per-file CPU cost 158.2 -> 138.9 ms/file, -12.2%
```

**Why this is adoptable when `--no-isolate` is not, stated as a mechanism rather than a run count —
because this ADR's own warning is that a run count is exactly what `--no-isolate` had.**

1. **`isolate` stays `true` and was not touched.** Per-file module-registry isolation is RETAINED.
   The mechanism that breaks `zobrist` / `gameend` / `san` under `--no-isolate` — a spy installed
   after a sibling file in the same worker already imported the module — **is not present.** This is
   the whole difference, and Decision 7 is unchanged: **the lane's dominant cost still buys exactly
   that isolation, and this adoption does not spend it.**
2. **What threads genuinely does share is the process, and that hazard was PROBED and ARMED rather
   than argued.** Five test files read `process.*` and `src/glyph-mode.test.ts` **mutates** both
   `process.env` and `process.stdout.isTTY`. A dedicated probe — one file mutating both and holding
   the mutation live while six sibling files read them concurrently — was **green 6 of 6** under
   `pool: "threads"`, and **the identical assertion goes RED when the mutation and the read share a
   worker**, which is the arming control that makes the green meaningful. `tinypool` does not pass
   `SHARE_ENV`, so each worker receives its own `process.env` copy. **A green probe that cannot fail
   proves nothing; this one was shown to fail on demand.**
3. **The evidence classes are not the same, and that is the point.** `--no-isolate` had *green runs
   and nothing else* — and at 4 of 21 it was ~80% red once anyone looked. `pool: "threads"` has
   24 consecutive green runs **plus** a named mechanism for why the guard-breaking failure mode is
   absent **plus** an armed probe of the one hazard it does introduce.

**What this adoption does NOT claim.** **24 of 24 green bounds the per-run failure rate at roughly
12.5% by the rule of three — not at zero.** `worker_threads` remains a weaker boundary than a child
process for anything process-global that Node does not copy per worker. **If this lane starts
flaking, delete `vitest.config.ts` first** — that is the entire rollback, one file, no other change —
**and say so on the ticket rather than debugging the ticket that happened to be in flight.**

**It was adopted because the screen passed AND the mechanism holds AND the lane is at 80% of its
binding clause with 7–8 committed files against ~7 of planning headroom — not because it was
available.** It buys ~3 more files of planning headroom (~7 → ~10) and ~0.3 s of wall on every run of
every hop. **It is not a solution to the per-file floor and must not be treated as one:** the floor
is still ~139 ms per file and it is still the structural driver, exactly as the 2026-08-12 audit
warned. That audit's other claim — *"a one-time discount, not a change in the slope"* — is
**refuted**: the slope falls 12.2%. The correction is small and does not change its conclusion.

### `A5`: where the isolation warning lives, and where it deliberately does not

**The warning is placed in `vitest.config.ts` and in this ADR — the two places named by `ABC-026`'s
`A5` — and NOT in the four `*.nfr.test.ts` files.** BA/PM ruled that placement on 2026-08-12 for two
reasons this hop confirms: `ABC-030` is rewriting the justification comment in those same files, and
**the engineer who would disarm these guards is editing the runner config, not reading a test file.**
`vitest.config.ts` is where the hand is, and as of this hop it exists.

> **THE WARNING, RECORDED HERE AS `A5` REQUIRES.** `isolate: false` / `--no-isolate` saves
> **30.7–36.5% of lane CPU** — the largest saving available anywhere on this lane, larger than every
> test-content saving ever proposed for it, combined. **IT IS NOT AVAILABLE.** It is green in **4 of
> 21 observed runs**, and **the first observed run was green** — a single-run adoption was available
> and would have silently disarmed `NFR-005`'s call-count sub-bar, `NFR-001`'s three `gameStatus`
> bars and `ABC-025`'s five `N1` rows. The only files that ever fail are `zobrist.nfr.test.ts`,
> `gameend.nfr.test.ts` and `san.nfr.test.ts`; remove them and it is green 6 of 6. **Those guards are
> the instruments this catalog reached for three separate times when a clock could not resolve a
> question. The lane's dominant cost is buying them. No guard is under suspicion and no test is
> proposed for deletion — the price is recorded so nobody rediscovers the lever and takes it.**

### Rollback, extended for this addendum only

**The adoption:** delete `vitest.config.ts`. That is the whole of it — one file, created by this hop,
outside `src/`, outside `tsconfig.json`'s `include` and outside `biome.json`'s `files.includes`.
A config containing only `defineConfig({})` was measured as its own interleaved condition at
**+0.24% / +0.30% CPU with the sign at chance**, so deleting the settings while keeping the file, or
deleting the file entirely, both return the lane to its measured baseline at no cost. **The
measurement itself has nothing to roll back:** zero production lines, zero test lines, `src/`
byte-identical, and `NFR-001`–`NFR-008` byte-identical with no target, bar or level moved.
