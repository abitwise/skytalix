# ADR-0008: The default test lane has a total budget, and the per-ticket bar is denominated in the budget rather than in the lane

## Status

**accepted** — RATIFIED 2026-08-11 by **Olger Oeselg**, the project owner, DIRECTLY and in
session: *"ratify NFR-008 at 3s wall / 13s CPU"*. Both the *shape* and the *level* (3 s wall /
13 s CPU) now stand; the `PROVISIONAL` marker is discharged and the level is no longer pending.

**Addendum 2026-10-19 — ACCEPTED 2026-10-19 by Olger Oeselg (owner), note `…9f3b6e20`; was PROPOSED** (`ABC-173`, Architect/Design, subtask
`arch-ABC-173-adr0008`). It adds a memory ceiling to the lane: Σ `heap_size_limit` ≤ 2048 MiB at peak
concurrency, in two lane shapes. It is carried by the lane command and refused at run start without it. See
`§ ADDENDUM 2026-10-19` at the end of this file. Decisions 1–8 and the 2026-08-13 addendum are unchanged.

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

## ADDENDUM 2026-10-19 — every vitest run carries a V8 heap ceiling (Σ `heap_size_limit` ≤ 2048 MiB at peak concurrency), sized by the run's shape, set on the lane command and refused at run start without it (`ABC-173`)

**Status of this addendum: ACCEPTED 2026-10-19** by Olger Oeselg (owner): OQ1 "Accept, two sizes (Recommended)", OQ2 read as counting shutting-down workers (the two-size design rests on it), OQ3 "Yes, every run (Recommended)" — note `.grugops/context/wave-2026-09-25/notes/…9f3b6e20`. Was PROPOSED. Architect/Design, task `wave-2026-09-25`, subtask
`arch-ABC-173-adr0008`, at `main` = `3468f054`.
- Nothing above is edited. Decision 7 (isolation stays on) and the `pool: "threads"` adoption are unchanged.
- This hop changed no byte under `src/`, and none in `vitest.config.ts`, `package.json` or `AGENTS.md`.
- Probes ran on a scratch copy only. They recorded counts, exit codes and heap limits, and **no timing**:
  `.grugops/context/arch-ABC-173-adr0008/probe/RUN.txt`.

**Inputs:**
- the owner's word `…c4a8e1f6`: *"vitest needs to be capped to max 2 cpu cores and 2GB of memory"*;
- his answers to Q1–Q4, `…e7d2a915`:
  - Σ `heap_size_limit` ≤ 2048 MiB, with RSS reported and not gated;
  - 2 busy executors, one core each;
  - all `AGENTS.md` vitest lanes;
  - nothing gives way on a breach without his word;
- `ABC-173`'s page (Scope, Pins touched, A1–A9);
- BA/PM's notes `…7e3b19d4` and `…2c9d5a61`.

### What the source allows (verified at this hop, vitest 4.1.11 in `node_modules`, node v26.11.1)

- **V1 — the main process and the workers cannot be given different limits.**
  - `ThreadsPoolWorker.start()` (`dist/chunks/cli-api.CnMVyzaz.js:3229-3234`) builds
    `new Worker(entrypoint, { env, execArgv, stdout, stderr })`. It passes **no `resourceLimits`**, and no file in
    `dist/` names `resourceLimits` (0 files).
  - A worker's `execArgv` is `resolveOptions` (`:3798-3803`) plus `project.config.execArgv` (`:3727-3735`).
    `resolveOptions` keeps only `--cpu-prof*`, `--heap-prof*` and `--diagnostic-dir` from the main process's flags.
    The config route is refused by Node: a heap flag in a Worker's `execArgv` throws `ERR_WORKER_INVALID_EXEC_ARGV`.
  - **The V8 heap flag is process-wide.** A worker built with `execArgv: []` under `node --max-old-space-size=128`
    reads 224 MiB, the same as the main thread.
  - The only per-worker knob, `resourceLimits`, works in plain Node (224 MiB), but vitest reaches it only through a
    custom `poolRunner` (`:3609`). That is a custom pool, and the ticket forbids it.
  - **So the main process and the workers always share one value. Children and the wrapper are separate processes
    and could differ.**
- **V2 — finished workers are not awaited before the next one starts.**
  - The pool frees a slot at `testfileFinished` and starts the next file (`:3494`).
  - Termination is "started but not awaited until the end of full run" (`:3547`). So more than 2 worker isolates
    can be live at once.
  - **Observed: at most 4 `Worker` objects live** (constructed, `exit` not yet delivered). This was read in both of 2
    default-lane runs of 59 files. It is an upper bound, because `exit` reaches the main loop late. The source sets
    **no bound** on it.
- **V3 — children inherit the lane's `NODE_OPTIONS`.** Each worker's `env` is `{ ...process.env, … }` (`:3718`).
  The `cli.test.ts` `childOf`, `history-pane.nfr` and `transposition` sites pass no `env`, so their children get
  the lane's value. `CLI_DEEP`'s `CHILD_ENV = {}` gets nothing.
- **V4 — `globalSetup` runs in the main process, after the run's files are resolved.**
  - `this.state.collectPaths(filepaths)` (`:13761`) runs before `initializeGlobalSetup` (`:13774`, `:10813`).
  - Probed: `isMainThread` is `true`, and `project.vitest.state.getPaths().length` reads 1, 5 and 59 for one file,
    the `src/search` filter and the suite.
  - A throw from setup exits 1 before any test runs.
  - `project.provide(key, value)` reaches `inject(key)` in a worker.
- **V5 — the default lane holds one two-isolate child.** `CHILDREN.npmRun` (`src/cli.test.ts:720`) runs
  `npm run chess`, which is npm plus `node src/cli.ts`: 2 Node isolates behind one blocked worker.
  - Observed: 29 Node child starts per default run, with at most 2 live at once.
  - By construction the most is 3: two workers, each blocked on at most one synchronous child (`C2`), and only one
    of them can be in `cli.test.ts`.

### Ruling 1 — where the limit lives

**`NODE_OPTIONS=--max-old-space-size=<flag>` goes on the lane command.** The `<flag>` is set by the run's
shape (Ruling 2).
- **`npm test`:** in `scripts.test`, before `node tools/grugops/run-bounded.js`. The wrapper, vitest and every
  env-inheriting child then get it.
- **`npm run test:watch`:** in `scripts["test:watch"]`.
- **Every other vitest command in `AGENTS.md`:** as a prefix on the command line.

**It is enforced by a guard, not by memory.**
- `vitest.config.ts` gains `globalSetup: ["./tools/grugops/heap-guard.js"]`.
- That file runs in the main process (V4). It reads `v8.getHeapStatistics().heap_size_limit` there, which is
  `A5`'s main-process reading.
- It **throws** when the limit is above the row for the run's shape. The run exits 1 and no test runs. The message
  names the prefix to use.
- So a lane typed without the prefix (Node's default here is 4192 MiB) is **refused, loudly**. It never runs
  uncapped.

**The config import still loads nothing at run time.** The new key is a path string. `ABC-144` `A7` and `ABC-152`
`V3` import `vitest.config.ts` and read only `pool`, `maxWorkers`, `fileParallelism`, `isolate`, `poolOptions`,
`projects` and `experimental`. Both stay green and byte-identical. The setup entry the ticket asks about
(Architect question 5) is **allowed**, and it is the guard. A re-exec is not allowed (see (c) below).

| candidate | ruling | why |
|---|---|---|
| **`NODE_OPTIONS` on the lane command + main-process guard** | **CHOSEN** | Reaches `npm test` and every direct `npx vitest run` (`npx` passes its env to vitest; read at 224 MiB in every probe lane). Scoped to vitest: `npm run chess`, `typecheck`, `build`, `perft` are untouched. Visible where it is typed, and refused when missing. |
| (a) a `package.json` script per lane | rejected | `ABC-042` `A10` asserts `added` = `["chess"]`, so ~13 new keys turn it red. The `AGENTS.md` lines become `npm run …` with the `--` trap, and `npx vitest run <path>`, coverage and skip-count still bypass it. |
| (b) `NODE_OPTIONS` in the `AGENTS.md` lines **only** | taken **with** the guard | Without a guard, a mistyped line runs uncapped and nothing notices. |
| (c) a `vitest.config.ts` setup that re-execs | rejected | The main heap is fixed before the config loads. A re-exec keeps a second main process live for the whole run (+1 row). The config is imported inside a worker by `A7`/`V3`, which must load nothing. |
| (d) `.npmrc` `node-options` | rejected on evidence | npm 11.20.0 (`@npmcli/config/lib/set-envs.js:102-104`) sets `NODE_OPTIONS` for **every** npm command, `run` and `exec`, and **replaces** the caller's value: `INPUT_DEEP`'s `--expose-gc` is silently dropped (34 → 33, exit 0). It also caps the mandatory gates. `tsc --noEmit` at 224 MiB: **heap out of memory, exit 134**. |
| (e) a node options file | rejected | On v26.11.1 only `--experimental-config-file` / `--experimental-default-config-file` exist, so it still needs a command-line flag and is experimental. `engines` is `>=22`. |
| `--max-heap-size` instead of `--max-old-space-size` | rejected (boring) | It is exact (224 → 224) and accepted in `NODE_OPTIONS` on v26.11.1. But it is a raw V8 flag outside Node's documented options, `UNKNOWN - verify` on Node 22/24. The guard reads the limit, so the +96 MiB offset is harmless. |
| `test.env.NODE_OPTIONS` (a separate children row) | rejected | It adds a third number and a config key. Neither shape needs it. |
| one uniform row for every lane | rejected on measurement | `PUZZLE_DEEP` is red at 224 MiB ("Worker exited unexpectedly", 2 of 2) and green at 256/292/336/496. The suite's peak is 9 isolates (Ruling 2), so 9 × 256 = 2304 > 2048. No single value meets both. |

### Ruling 2 — the budget table (`A2`): two shapes, each ≤ 2048 MiB at its own peak

**The shape is set by the run's file count, which the guard reads (V4).**
- **SUITE:** ≥ 2 files.
- **ONE-FILE:** exactly 1 file.
- **0 files:** the guard throws, because it cannot look.

Every value below is `heap_size_limit`, the value read, and not the flag. On this stack `flag + 96 = limit` in every
reading (`RUN.txt` §1).

**SUITE shape:**
- **Commands:** `npm test`; `npm run test:watch`; both coverage lines; the skip-count capture; any filter that
  matches more than one file.
- **Flag and limit:** `--max-old-space-size=128` gives **224 MiB** per isolate.

| isolate | live at peak | how the count is known | MiB each | MiB |
|---|---:|---|---:|---:|
| `run-bounded.js` wrapper (`npm test` only) | 1 | the script | 224 | 224 |
| vitest main process | 1 | | 224 | 224 |
| workers running a file | 2 | `maxWorkers: 2` (`:3494`) | 224 | 448 |
| workers still terminating | **2 (reserve)** | **observed** maximum, 4 live in 2 of 2 runs; no source bound (V2) | 224 | 448 |
| Node children | 3 | by construction (V5); observed 2 | 224 | 672 |
| **Σ** | **9** | | | **2016 ≤ 2048** |

**ONE-FILE shape:**
- **Commands:** every `*_DEEP` lane line and `npx vitest run <path>`.
- **Flag and limit:** `--max-old-space-size=400` gives **496 MiB** per isolate.

| isolate | live at peak | how the count is known | MiB each | MiB |
|---|---:|---|---:|---:|
| vitest main process | 1 | | 496 | 496 |
| worker | 1 | one file is one task, so one worker is ever built; nothing terminates during the run | 496 | 496 |
| Node children | 2 | one synchronous child at a time. Only `cli.test.ts` `npmRun` is two isolates, and `CLI_DEEP` stays serial (`C2`) | 496 | 992 |
| **Σ** | **4** | | | **1984 ≤ 2048** |

**Not counted, as the ticket defines Q1 and the owner accepted it:**
- **The lane's own `npm`/`npx` client.** Under `npm test`, npm starts before the script's prefix, so it keeps
  Node's default (4192 MiB here). Under `npx …` the prefix comes first, so `npx` reads the row.
- **Non-Node children** (`git`, `sh`, `head`). They are outside the V8 mechanism and are recorded, not capped.
- **RSS.** It is reported and not gated.

**Measured at the rows (scratch, counts only, `RUN.txt` §3–5):**
- **At 224 MiB:**
  - `npm test`: 59 files, 1915 passed;
  - coverage: 1915 passed;
  - quiescence 37, transposition (ENGINE) 26, `INPUT_DEEP` 34, `CLI_DEEP` 10, `ZOBRIST_DEEP` 33,
    transposition (SEARCH) 40, each read at 224, which is below their 496 row.
- **At 496 MiB:** `PUZZLE_DEEP` 18, `SEARCH_DEEP` `search.test.ts` 57, `PERFT_DEEP` 32.
- **Not run here (they are the SE's `A7`):** `ENGINE_DEEP` `engine.test.ts` and `levels.test.ts`, `LADDER_DEEP`,
  and `SEARCH_DEEP` `search.pvs-lmr.test.ts`.
- **On a breach:** an out-of-memory error in any lane goes to the owner (Q4). Neither row is raised without his word.

**The rows are passed to the workers, not re-derived there.**
- The guard calls `project.provide("heapRowMiB", row)`.
- `A4`, `A6` and the `CLI_DEEP` probe compare against `inject("heapRowMiB")`. Probed, armed: 2 files at the
  ONE-FILE flag read row 224 against worker 496, and both rows went red.

### Ruling 3 — the `INPUT_DEEP` collision and the `CLI_DEEP` child

**`INPUT_DEEP`: one `NODE_OPTIONS` value carries both flags.**
- The line becomes `INPUT_DEEP=1 NODE_OPTIONS="--expose-gc --max-old-space-size=400" npx vitest run src/line-input.test.ts`.
  The quotes are required.
- A second `NODE_OPTIONS=` assignment would replace the first. That replacement is the collision itself.
- Dropping the heap flag means the guard refuses the run. Dropping `--expose-gc` reads 33 against 34, which is the
  existing trap. Both read in scratch at 224: 34 with the flag and 33 without.

**`CLI_DEEP`: the flag enters `spawnSync`'s argv as a node option, before the entry point.** `CHILD_ENV` stays `{}`
and `CHILD_ARGS` is unchanged.
- **The construction:** `argv = [heapToken, entryPointIn(root), ...args]`.
- **Where `heapToken` comes from:** it is the **last** `--max-old-space-size=<digits>` token in the worker's own
  `process.env.NODE_OPTIONS`. That is the lane's value, copied by vitest (V3). When it is absent, the test throws.
- **Why the parent's value and not a literal.** The child then carries exactly its parent's value in either shape.
  A literal 400 under `CLI_DEEP=1 npm test` would put a 496 MiB child under a 224 MiB row.
- **What still holds:**
  - Only that one token crosses. `NODE_OPTIONS` itself never reaches the child, so the header's guarantee against a
    `--import` double holds. The header sentence is amended to name the token.
  - The option goes before the entry point, because after it the product reads it as its own argument.
  - `ABC-119`'s pins stay green: `Object.keys(CHILD_ENV)` is `[]`, and the `import|loader|require|hook|conditions`
    filter on `CHILD_ARGS` is `[]`.
- **Read in scratch:** `spawnSync(process.execPath, ["--max-old-space-size=128", "-e", …], { env: {} })` gives 224,
  and `CLI_DEEP` passed 10 with the token in argv.

### Ruling 4 — the 2-executor definition holds as built

**`maxWorkers: 2` with synchronous children meets "2 busy executors, one core each". Nothing changes.**
- `Pool.schedule` returns while `activeTasks.length >= maxWorkers` (`:3494`). So at most 2 files run at once, each
  in its own worker (`isolate` on).
- `spawnSync` / `execFileSync` block the worker's thread, so a worker and its child are never both busy. In the
  `npm run chess` chain, npm waits on `sh`, and `sh` waits on `node`.
- **Overhead, not executors:**
  - the vitest main thread (the owner's Q2);
  - workers still terminating (V2), which have finished their file and run no test code;
  - the wrapper and the lane's npm client, both idle while they wait.
- **Pins:** `C2` pins the synchronous form, and `ABC-144` `A7` pins the 2. `VITEST_MAX_WORKERS` may only lower it.
- macOS has no CPU quota, so this is a concurrency cap, as the page says.

### Ruling 5 — `N8-LANE` and `NFR-008` across the merge (`ADR-0035`)

- **`N8-LANE` needs no fresh baseline.** It has none. It is a paired per-ticket delta: base, head and twin are read
  in one window (`ADR-0035` D2).
  - From the merge on, each arm runs its set's `AGENTS.md` form, prefix included. The guard refuses the bare form.
  - The same set has the same shape in all three arms, so the arms stay comparable.
- **`ABC-173`'s own readings.** QE takes both in `ABC-173`'s QE hop (`In Review`), on the branch tip as it will
  merge, **before** the merge. The post-merge run on `main` is the mandatory gates only.
  1. **`N8-LANE` on its narrow set** (the test files it adds or modifies).
     - The base arm and the twin run the base tree with the base's unprefixed command.
     - The head arm runs the head tree with the head's command.
     - The cap's own CPU therefore lands in the charge, which is the point.
  2. **`A9`, the `NFR-008` total.** `npm test` wall ≤ 10 s at load1 ≤ 8, with CPU reported. It is read with a twin,
     because `ADR-0035` D1 makes a twin required for admissibility.
     - It is the first full-lane reading on the capped stack.
     - **Its twin R replaces the full-lane `F` outright.** The current 1.72 s / 3.25 s was read before vitest 4.1 and
       before the cap.
     - A wall over 10 s goes to the owner (Q4). The cap does not give way.
- **Per-set `F` values stay** until each set's first capped reading replaces them outright. There is no
  provisional-16 % reset.
  - `F` governs only what a cut may write. A verdict always reads its own R (D1), so a stale `F` can yield
    UNRESOLVED, but never a false MET.
- **The reference stack** (`ADR-0035` D5) gains one clause: *"V8 heap per isolate 224 MiB (SUITE) / 496 MiB
  (ONE-FILE)"*.
  - Readings taken before the merge are pre-cap. They are labelled, not re-read, forward-only in the D4 shape.
  - `ABC-174`'s readings follow the merge, as the page orders.
  - **`ABC-171`.** If it merges after `ABC-173`, its rebased gates run with the cap. Its recorded QE lines stay as
    read, labelled pre-cap.

### Pins (`A8`)

**These move, each re-pinned in `ABC-173`'s diff with the reason "`ABC-173`, `ADR-0008` addendum 2026-10-19":**
- **`ABC-042` `A10` `SCRIPTS_AT_HEAD`** (`src/cli.test.ts:1779-1780`): the `test` and `"test:watch"` values only.
  - `AT_HEAD`, the reserved keys and `added` = `["chess"]` are unchanged.
  - It is still a byte pin, so `A7`'s "the CLI-flag route is closed by `A10`" stays true.
- **`tools/grugops/run-bounded.js:9-10`**: the header quote of `scripts.test`. This is a comment.
- **`N8_SPAWN`** (`src/cli.test.ts:1950`): 27 → **28**, written `17 + 7 + 1 + 2 + 1`. The added child is `A6`'s
  probe, and its comment names `ABC-173`.
- **`CLI_DEEP`'s deep count goes up by 1** (`A6`'s probe, deep block only). It read 10 on this tree. The default-lane
  row still spawns nothing.
- **Comments:** the header sentence in `src/cli.real-engine.test.ts` on the empty environment, and
  `src/line-input.test.ts:77`, which spells the lane command.
- **The `AGENTS.md` vitest command lines.** They need about 640 B more, but `AGENTS.md` sits **at** its 24,576 B
  budget.
  - **`ABC-109` `A5` stays green by offset.** The same diff moves at least that many bytes of RUN-receipt comment
    text, verbatim, into `memory-bank/90-agents-md-command-log.md`.
  - The budget is never raised; that is the owner's.
  - The `Dev / run` slot is not edited, so the `ABC-065`/`067`/`071` rows stay green.

**These stay green and byte-identical:**
- `ABC-144` `A7` and `ABC-152` `V3`;
- `ABC-119`'s `CHILD_ENV` `{}` and `CHILD_ARGS` rows;
- decision 7's `isolate` line;
- `INPUT_DEEP`'s 34.

**This fires, and the page accepts it:** `ABC-146` `A0`'s staleness rule.

### What the SE does (exact)

1. **`package.json`.** Change two values, and nothing else:
   - `"test": "NODE_OPTIONS=--max-old-space-size=128 node tools/grugops/run-bounded.js 60000 vitest run --reporter=default --reporter=./tools/grugops/result-file-reporter.js --outputFile.json=.test-results/last-run.json"`
   - `"test:watch": "NODE_OPTIONS=--max-old-space-size=128 vitest"`
2. **`tools/grugops/run-bounded.js`.** Update the header quote only.
3. **New `tools/grugops/heap-guard.js`.** It is plain JS, like its siblings, and is linted under `tools/**/*.js`.
   - **Exports:** the rows `{ suite: 224, oneFile: 496 }` in MiB and the flags `{ suite: 128, oneFile: 400 }`.
   - **Default `setup(project)`:**
     - assert `isMainThread`;
     - `files = project.vitest.state.getPaths().length`, and throw on 0 or on a missing API;
     - `row = files === 1 ? oneFile : suite`;
     - throw when `heap_size_limit` > `row` MiB, with a message naming the limit, the row and the prefix;
     - `project.provide("heapRowMiB", row)`.
   - **Nothing else.** No re-exec, and no side effect at import.
4. **`vitest.config.ts`.** Add the `globalSetup` key and one header paragraph (memory: Rulings 1–2 in brief, with a
   pointer here). The existing text stays.
5. **`src/cli.real-engine.test.ts`.**
   - Put `heapToken` in argv, as in Ruling 3.
   - Add one deep-block probe child, built the same way (same token source, `env: CHILD_ENV`). It reports
     `heap_size_limit` ≤ `inject("heapRowMiB")`.
   - Amend the header sentence.
6. **`src/cli.test.ts`.**
   - **`A6`:** one `CHILDREN` entry through `childOf` that prints its own `heap_size_limit`, asserted
     ≤ `inject("heapRowMiB")`. Re-pin `N8_SPAWN` to 28.
   - **`A4`:** one in-process row, `isMainThread === false` and `heap_size_limit` ≤ `inject("heapRowMiB")`. The guard
     covers the main process in every lane. V1 makes the worker equal to the main process, so this one row is
     `A4`'s worker reading, and no `setupFiles` entry is added.
   - **`A10`:** the two script values.
   - **Static rows, in process and with no spawn:**
     - **`C2`:** no async `child_process` form in `src/**/*.test.ts`, and ≥ 4 synchronous sites found.
     - **`A3`:** every vitest command in `AGENTS.md` carries `NODE_OPTIONS` with its shape's flag (ONE-FILE when it
       names exactly one test file or `<path>`). `INPUT_DEEP`'s single value carries both `--expose-gc` and the
       flag, and the flags equal `heap-guard.js`'s exports.
     - **`A6`:** the `history-pane.nfr` and `transposition` `spawnSync` calls pass no `env` key and no heap flag in
       argv. They inherit exactly `childOf`'s construction, which the probe child proves.
7. **`AGENTS.md`.** Prefix every vitest command line:
   - **SUITE flag:** the two coverage lines and the skip-count capture.
   - **ONE-FILE flag:** the `PERFT_DEEP`, `SEARCH_DEEP` ×4, `ENGINE_DEEP` ×3, `ZOBRIST_DEEP`, `PUZZLE_DEEP`,
     `CLI_DEEP` and `LADDER_DEEP` lines, and `Test (single file)`.
   - **`INPUT_DEEP`:** as in Ruling 3.
   - Offset the bytes as in § Pins.
8. **`src/line-input.test.ts:77`.** Update the comment.
9. **`A7`.**
   - Run every lane as `AGENTS.md` spells it, and record its pass and skip counts.
   - Record peak `heapUsed` per lane, as an observation.
   - Read the live-worker maximum once with this hop's `probe/pre.mjs` + `analyze2.mjs`, as an observation for the
     reserve. `scripts.test` now sets `NODE_OPTIONS`, so run it as
     `NODE_OPTIONS="--import=<pre.mjs> --max-old-space-size=128" npx vitest run`.
   - A reading over 4 live workers, or any out-of-memory error, goes to the owner.
10. **Armed reds (`A3`):** watch each one go red, then revert it:
    - default lane: remove the script prefix;
    - `CLI_DEEP`: drop the argv token, then drop the line prefix;
    - `INPUT_DEEP`: drop the heap flag;
    - add one `spawn(` (the `C2` row);
    - run 2 files at the ONE-FILE flag.

### Risks (named, not closed)

- **`RISK-ABC173-TEARDOWN`.** The 2-worker reserve is an observation (V2). vitest 4.1.11 sets no bound on it. If
  `A7` reads more than 4 live workers, the SUITE row is breached by construction, and that goes to the owner.
- **`RISK-ABC173-STATE`.**
  - The guard reads `vitest.state.getPaths()`. It is a public getter (`reporters.d.DtoKVV2s.d.ts:1297`, `:1165`),
    not documented as stable.
  - This joins `RISK-ABC143-01`'s class, at a `vitest` bump. It fails loud: the guard throws when the API is
    missing or the count is 0.
- **`RISK-ABC173-PUZZLE`.** `PUZZLE_DEEP` is red at 224 MiB and green at 256 MiB. Its margin is the ONE-FILE row,
  about 1.9x. Running it in a SUITE-shape command is refused by the guard; it is not silently re-sized.
- **Another Node version.** The offset between flag and limit was read only on v26.11.1. The guard checks the
  limit, so a larger offset reds loudly and a smaller one under-uses the row.

### NFR impact

- **This proposes a catalog row** for Security/NFR to write after acceptance, at the next free id (`NFR-010` at
  this commit):
  - **Name:** *Test-lane V8 heap ceiling*.
  - **Bar:** Σ `heap_size_limit` ≤ 2048 MiB at peak concurrency per lane shape: SUITE 9 × 224, ONE-FILE 4 × 496.
  - **Instrument:** the main-process read in `heap-guard.js`, plus the `A4` and `A6` probes.
  - **RSS:** reported, not gated.
  - **Owners:** the level is Olger Oeselg's, the table Architect/Design's, the row Security/NFR's.
- **`NFR-008`'s stack declaration** gains the heap clause (Ruling 5).
- **CPU:** unchanged (Ruling 4).

### Owner questions (his word; nothing here moves without it)

- **OQ1.** Accept this addendum, with the two rows (SUITE 224 MiB, Σ 2016; ONE-FILE 496 MiB, Σ 1984)?
  *Recommend: yes.*
- **OQ2.** Count workers that are still terminating against the 2048, with a reserve of 2 that is observed and not
  source-bound? His Q1 answer reads that way, and it is why two rows are needed.
  - **The alternative:** count only isolates that can run test code. Then one uniform row of 292 MiB
    (`--max-old-space-size=196`) serves every lane: 7 × 292 = 2044.
  - Its cost is a thin `PUZZLE_DEEP` margin: green at 292 MiB in 1 run, red at 224 MiB.
  - *Recommend: count them, with two rows.*
- **OQ3.** The guard also refuses an uncapped coverage run, skip-count capture, single-file run or `test:watch`.
  These are not among the 10 lanes, and they get the prefix too. Confirm that "vitest needs to be capped" covers
  every vitest run. *Recommend: yes.*

### Rollback

- **One revert:**
  - drop the `globalSetup` key and `heap-guard.js`;
  - restore the two script values, the `run-bounded.js` quote, the `AGENTS.md` lines and the moved receipts;
  - restore the `CLI_DEEP` argv;
  - restore `N8_SPAWN` 27.
- **The rows are data.** Change a row and its flag together in `heap-guard.js`, and the `A3` static row follows.
  Decisions 1–8 are untouched either way.
