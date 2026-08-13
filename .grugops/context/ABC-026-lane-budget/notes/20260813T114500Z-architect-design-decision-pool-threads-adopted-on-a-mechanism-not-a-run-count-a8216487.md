---
id: 20260813T114500Z-architect-design-decision-pool-threads-adopted-on-a-mechanism-not-a-run-count-a8216487
kind: decision
by: architect-design
at: 2026-08-13T11:45:00Z
verified_by:
confidence: high
refs:
  - ABC-026
  - ABC-026-A4
  - ABC-026-A5
  - ADR-0008
  - NFR-008
  - NFR-001
  - NFR-005
  - ABC-030
  - vitest.config.ts
  - memory-bank/50-decisions/ADR-0008-default-test-lane-budget.md
supersedes:
---

# `A4`: `pool: "threads"` is **ADOPTED**. **`A5`'s warning goes in `vitest.config.ts` and `ADR-0008`.** `ADR-0008` Decision 8 is discharged.

A `decision`. **The thing that decided it is a mechanism, not a run count — because a run count is
exactly the evidence `--no-isolate` had, and this project's own record is that a run count was not
enough.**

## The screen BA/PM required, run and satisfied

```
24 CONSECUTIVE green runs, no red at any point
807/807 tests on 28 files in EVERY run, each run's counts recorded individually
all SEVEN *.nfr.test.ts files passed in EVERY one of the 24
```

**Run against SEVEN files, not four.** `ADR-0008` Decision 8 says *"all four"*; four was the correct
census on 2026-08-10, and `history-pane`, `status-panel` and `turn-loop` landed 2026-08-11 — the day it
was ratified. The 2026-08-12 architecture audit found the drift and deliberately did not edit the ADR.
**I read the census from disk (`ls src/*.nfr.test.ts` → 7) rather than from the ADR, and screened
against all seven.** Decision 8's sentence is left standing; the ADR addendum says to read it as
*every* `*.nfr.test.ts` file.

**One honest note on the screen harness itself: my first green predicate was WRONG and the harness
caught it.** I asserted `numTotalTestSuites === 28`; vitest's JSON reporter counts **describe blocks**
there (140), not files. All 24 runs reported `green=false` on a suite that was in fact entirely
passing. **The predicate was corrected to `testResults.length === 28` plus per-file `status ===
"passed"`, and the screen re-run from scratch.** Recorded because a screen that fails open would be
worse than no screen, and because the first result was discarded rather than re-interpreted.

## The saving, measured here rather than inherited

```
                     CPU delta      sign     WALL delta       sign
sample A         -0.800 s -7.70%    0/8    -0.510 s -23.08%   0/8
sample B         -0.730 s -7.32%    0/8    -0.260 s -14.09%   0/8
recorded 08-10            -10.78%   0/8            -13.97%    0/8

per-file CPU SLOPE   forks 158.2 ms/file  ->  threads 138.9 ms/file  = -12.2%   R^2 0.9988
```

**The recorded −13.97% wall replicates almost exactly in the quieter sample. The recorded −10.78% CPU
does NOT — I read −7.3% / −7.7%, and that is reported rather than smoothed.**

**The 2026-08-12 audit's claim that threads is *"a one-time discount, not a change in the slope"* is
REFUTED: the slope falls 12.2%.** The refutation is small and does **not** overturn that audit's
conclusion — the per-file floor is still ~139 ms and still the structural driver. **Anyone treating
threads as "the answer" will still be back inside two epics.**

## **Why this is adoptable when `--no-isolate` is not**

**1. `isolate` stays `true` and was not touched.** Per-file module-registry isolation is **retained**.
The mechanism that breaks `zobrist` / `gameend` / `san` under `--no-isolate` — a spy installed after a
sibling file in the same worker has already imported the module under test — **is structurally absent.**
`ADR-0008` Decision 7 is unchanged: the lane's dominant cost still buys that isolation, and this
adoption does not spend it.

**2. The one hazard threads DOES introduce was probed, and the probe was ARMED.** Threads share the
process. **Five test files read `process.*` and `src/glyph-mode.test.ts` MUTATES both `process.env` and
`process.stdout.isTTY`** — I found that by reading the suite, and it is the real risk, not a
hypothetical one.

```
probe   one file mutates process.env + process.stdout.isTTY and HOLDS the mutation live
        while six sibling files read the same keys concurrently
result  GREEN 6 of 6 under pool: "threads"          -> no cross-worker leakage observed
ARMING  the IDENTICAL assertion, with the mutation and the read in the SAME module,
        goes RED: `expected { sawEnv: true, sawTty: true } to deeply equal
                   { sawEnv: false, sawTty: false }`
```

**A green probe that cannot fail proves nothing. This one was shown to fail on demand before its green
was believed.** The mechanism behind the containment: `tinypool` constructs its `Worker`s **without
`SHARE_ENV`** (checked in `node_modules/tinypool/dist/index.js`), so each worker receives its own
`process.env` copy, and a worker's `process.stdout` is its own stream object.

**3. The evidence classes are genuinely different, and that is the whole argument.** `--no-isolate` had
*green runs and nothing else* — and at **4 of 21** it was ~80% red the moment anyone ran it twenty
times. `pool: "threads"` has 24 consecutive green runs **plus** a named reason the guard-breaking mode
is absent **plus** an armed probe of the hazard it actually adds. **I did not adopt it because it was
available; I adopted it because the screen passed AND the mechanism holds AND the lane is at 80% of its
binding clause with 7–8 committed files against ~7 files of planning headroom.**

## What this decision does NOT claim

**24 of 24 green bounds the per-run failure rate at roughly 12.5% by the rule of three — NOT at zero.**
`worker_threads` remains a weaker boundary than a child process for anything process-global that Node
does not copy per worker. **If this lane starts flaking, delete `vitest.config.ts` first — that is the
entire rollback, one file — and say so on the ticket rather than debugging whichever ticket happened to
be in flight.** That sentence is written into the delivered file, not only here.

It buys **~3 more files of planning headroom (~7 → ~10)** and ~0.3 s of wall on every run of every hop.
**It is not a solution to the per-file floor and must not be sold as one.**

## `A5`: where the warning lives, and where it deliberately does not

**Placed in `vitest.config.ts` and in `ADR-0008` — the two files `A5` names — and NOT in the four
`*.nfr.test.ts` files.** BA/PM's 2026-08-12 ruling holds for both its reasons: `ABC-030` is rewriting
the justification comment in those same files, and **the engineer who would disarm these guards is
editing the runner config, not reading a test file.** As of this hop that config file exists.

**And the collision case was priced rather than assumed away.** `A5` says the file is created *"by
`A4`'s adoption or by this criterion"* — so if `A4` had **refused**, the file was **still owed**. I ran
that condition: a `vitest.config.ts` containing only `defineConfig({})` measured **+0.24% CPU (sign
6/8) / −0.45% wall (2/8)** in sample A and **+0.30% CPU (5/8) / 0.00% wall (3/8)** in sample B — inside
this catalog's own ≤ 1.5% null band with the sign at chance. **Creating the file costs measurably
nothing, so a refusal would not have made `A5` expensive.**
